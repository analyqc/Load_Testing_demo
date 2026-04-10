<#
.SYNOPSIS
  Genera results.xml (JUnit) desde report\statistics.json
.PARAMETER StatsFile
  Ruta al statistics.json (default: report\statistics.json)
.PARAMETER OutXml
  Ruta de salida del JUnit XML
.PARAMETER MaxErrPct
  Limite de error% para marcar testcase como failure (default: 5)
.PARAMETER GroupToRun
  Nombre del grupo ejecutado (para el nombre del testsuite)
#>
param(
  [string]$StatsFile  = 'report\statistics.json',
  [string]$OutXml     = 'results\results.xml',
  [double]$MaxErrPct  = 5,
  [string]$GroupToRun = 'ALL'
)

New-Item -ItemType Directory -Force -Path (Split-Path $OutXml) | Out-Null

$emptyXml = '<?xml version="1.0" encoding="UTF-8"?><testsuites><testsuite name="JMeter" tests="0" failures="0" errors="0"><properties/></testsuite></testsuites>'

if (-not (Test-Path $StatsFile)) {
  [System.IO.File]::WriteAllText($OutXml, $emptyXml, [System.Text.Encoding]::UTF8)
  Write-Warning "statistics.json no encontrado — JUnit XML vacio generado."
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

$rows     = Get-StatRows (Get-Content $StatsFile -Raw | ConvertFrom-Json)
$total    = $rows.Count
$failures = 0
$ts       = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss')

$cases = [System.Text.StringBuilder]::new()
foreach ($r in $rows) {
  $lbl  = ([string](Get-Prop $r @('transaction','label'))) -replace '[<>&"'']', ''
  $n    = [int](Get-Prop $r @('sampleCount','samples'))
  $f    = [int](Get-Prop $r @('errorCount','failures'))
  $ep   = if ($n -gt 0) { [math]::Round($f/$n*100,2) } else { 0.0 }
  $avg  = [math]::Round([double](Get-Prop $r @('meanResTime','average')),1)
  $t    = [math]::Round($avg/1000,3)
  if ($ep -gt $MaxErrPct) {
    $failures++
    [void]$cases.AppendLine("    <testcase classname=`"JMeter`" name=`"$lbl`" time=`"$t`"><failure message=`"Error $ep% supera limite $MaxErrPct%`">Samples: $n  Failures: $f  Error%: $ep%</failure></testcase>")
  } else {
    [void]$cases.AppendLine("    <testcase classname=`"JMeter`" name=`"$lbl`" time=`"$t`"/>")
  }
}

$xml = [System.Text.StringBuilder]::new()
[void]$xml.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$xml.AppendLine('<testsuites>')
[void]$xml.AppendLine("  <testsuite name=`"Policysense Load Test - $GroupToRun`" tests=`"$total`" failures=`"$failures`" errors=`"0`" timestamp=`"$ts`">")
[void]$xml.Append($cases.ToString())
[void]$xml.AppendLine('  </testsuite>')
[void]$xml.AppendLine('</testsuites>')

[System.IO.File]::WriteAllText($OutXml, $xml.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "JUnit XML generado: $OutXml ($total casos, $failures fallos)"
