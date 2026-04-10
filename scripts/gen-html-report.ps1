<#
.SYNOPSIS
  Genera jmeter-inline-report.html desde report\statistics.json
.PARAMETER StatsFile
  Ruta al statistics.json (default: report\statistics.json)
.PARAMETER OutHtml
  Ruta de salida del HTML
.PARAMETER MaxErrPct
  Limite de error% para colorear celdas (default: 5)
.PARAMETER BuildId
  ID del build de Azure DevOps
.PARAMETER GroupToRun
  Nombre del grupo ejecutado
.PARAMETER Users
  Usuarios concurrentes
.PARAMETER RampUp
  Ramp-up en segundos
.PARAMETER Loop
  Iteraciones
#>
param(
  [string]$StatsFile  = 'report\statistics.json',
  [string]$OutHtml    = "$env:BUILD_ARTIFACTSTAGINGDIRECTORY\jmeter-inline-report.html",
  [double]$MaxErrPct  = 5,
  [string]$BuildId    = $env:BUILD_BUILDID,
  [string]$GroupToRun = 'ALL',
  [string]$Users      = '10',
  [string]$RampUp     = '5',
  [string]$Loop       = '2'
)

New-Item -ItemType Directory -Force -Path (Split-Path $OutHtml) | Out-Null

if (-not (Test-Path $StatsFile)) {
  '<html><body><p>statistics.json no encontrado.</p></body></html>' | Out-File $OutHtml -Encoding UTF8
  Write-Warning "statistics.json no encontrado."
  exit 0
}

function Get-StatRows([object]$Root) {
  $acc = [System.Collections.ArrayList]@()
  if ($null -eq $Root) { return @() }
  if ($Root -is [System.Collections.IList] -and $Root -isnot [string]) {
    foreach ($x in $Root) { if ($x) { [void]$acc.Add($x) } }
    return @($acc)
  }
  if ($Root -is [PSCustomObject]) {
    $n = @($Root.PSObject.Properties.Name)
    if (($n -contains 'sampleCount' -or $n -contains 'errorCount') -and $n -contains 'transaction') {
      [void]$acc.Add($Root); return @($acc)
    }
    foreach ($p in $Root.PSObject.Properties) {
      $v = $p.Value
      if (-not $v -or $v -isnot [PSCustomObject]) { continue }
      $vn = @($v.PSObject.Properties.Name)
      if (-not ($vn -contains 'sampleCount' -or $vn -contains 'errorCount')) { continue }
      if (-not ($vn -contains 'transaction') -or [string]::IsNullOrWhiteSpace("$($v.transaction)")) {
        $v | Add-Member -NotePropertyName transaction -NotePropertyValue $p.Name -Force
      }
      [void]$acc.Add($v)
    }
  }
  return @($acc)
}

function Get-Prop([object]$Row, [string[]]$Keys) {
  if (-not $Row -or $Row -isnot [PSCustomObject]) { return $null }
  foreach ($k in $Keys) {
    foreach ($p in $Row.PSObject.Properties) { if ($p.Name -ieq $k) { return $p.Value } }
  }
  return $null
}

$rows    = Get-StatRows (Get-Content $StatsFile -Raw | ConvertFrom-Json)
$runDate = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
$trs     = [System.Text.StringBuilder]::new()

foreach ($r in $rows) {
  $lbl  = [string](Get-Prop $r @('transaction','label'))
  $n    = [int](Get-Prop $r @('sampleCount','samples'))
  $f    = [int](Get-Prop $r @('errorCount','failures'))
  $ep   = if ($n -gt 0) { [math]::Round($f/$n*100,2) } else { 0.0 }
  $avg  = [math]::Round([double](Get-Prop $r @('meanResTime','average')),1)
  $mn   = [int](Get-Prop $r @('minResTime','min'))
  $mx   = [int](Get-Prop $r @('maxResTime','max'))
  $med  = [math]::Round([double](Get-Prop $r @('medianResTime','median')),1)
  $p90  = [int](Get-Prop $r @('pct1ResTime','percentile90'))
  $p95  = [int](Get-Prop $r @('pct2ResTime','percentile95'))
  $p99  = [int](Get-Prop $r @('pct3ResTime','percentile99'))
  $tps  = [math]::Round([double](Get-Prop $r @('throughput','tps')),2)
  $recv = [math]::Round([double](Get-Prop $r @('receivedKBytesPerSec','recvKB')),2)
  $sent = [math]::Round([double](Get-Prop $r @('sentKBytesPerSec','sentKB')),2)
  $cls  = if ($ep -gt $MaxErrPct) { ' class="err"' } elseif ($ep -gt 0) { ' class="warn"' } else { '' }
  [void]$trs.Append("<tr><td>$lbl</td><td>$n</td><td>$f</td><td$cls>$ep%</td><td>$avg</td><td>$mn</td><td>$mx</td><td>$med</td><td>$p90</td><td>$p95</td><td>$p99</td><td>$tps</td><td>$recv</td><td>$sent</td></tr>`n")
}

$css = @'
body{font-family:Segoe UI,sans-serif;background:#f4f6f9;margin:0;padding:20px;color:#333}
h1{color:#0078d4;margin-bottom:8px}
.meta{background:#fff;border-radius:6px;padding:10px 18px;margin-bottom:18px;box-shadow:0 1px 4px rgba(0,0,0,.1);font-size:.9em}
.meta span{margin-right:20px}
table{border-collapse:collapse;width:100%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.1);border-radius:6px;overflow:hidden}
th{background:#0078d4;color:#fff;padding:9px 7px;text-align:right;font-size:.82em;white-space:nowrap}
th:first-child{text-align:left}
td{padding:7px;text-align:right;border-bottom:1px solid #eee;font-size:.82em}
td:first-child{text-align:left;font-weight:500}
tr:hover td{background:#f0f7ff}
.err{background:#fde8e8!important;color:#c0392b;font-weight:700}
.warn{background:#fef9e7!important;color:#d35400}
.footer{margin-top:14px;font-size:.78em;color:#999;text-align:right}
'@

$html = [System.Text.StringBuilder]::new()
[void]$html.AppendLine('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">')
[void]$html.AppendLine('<title>Policysense Load Test</title>')
[void]$html.AppendLine("<style>$css</style></head><body>")
[void]$html.AppendLine('<h1>Policysense - Reporte de Pruebas de Carga</h1>')
[void]$html.AppendLine('<div class="meta">')
[void]$html.AppendLine("  <span><b>Build:</b> $BuildId</span>")
[void]$html.AppendLine("  <span><b>Fecha:</b> $runDate</span>")
[void]$html.AppendLine("  <span><b>Grupo:</b> $GroupToRun</span>")
[void]$html.AppendLine("  <span><b>Usuarios:</b> $Users</span>")
[void]$html.AppendLine("  <span><b>Ramp-up:</b> ${RampUp}s</span>")
[void]$html.AppendLine("  <span><b>Loop:</b> $Loop</span>")
[void]$html.AppendLine("  <span><b>SLA error max:</b> $MaxErrPct%</span>")
[void]$html.AppendLine('</div>')
[void]$html.AppendLine('<table><thead><tr>')
[void]$html.AppendLine('  <th>Label</th><th>#Samples</th><th>FAIL</th><th>Error%</th>')
[void]$html.AppendLine('  <th>Avg(ms)</th><th>Min</th><th>Max</th><th>Median</th>')
[void]$html.AppendLine('  <th>p90</th><th>p95</th><th>p99</th><th>TPS</th><th>RecvKB/s</th><th>SentKB/s</th>')
[void]$html.AppendLine('</tr></thead><tbody>')
[void]$html.Append($trs.ToString())
[void]$html.AppendLine('</tbody></table>')
[void]$html.AppendLine('<div class="footer">Policysense CI/CD - In Motion S.A. - azure-pipelines.yml</div>')
[void]$html.AppendLine('</body></html>')

[System.IO.File]::WriteAllText($OutHtml, $html.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "HTML generado: $OutHtml ($($rows.Count) filas)"
