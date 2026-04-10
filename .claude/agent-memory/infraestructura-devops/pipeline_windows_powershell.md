---
name: Pipeline migrado a windows-latest + PowerShell
description: Decision de migrar el pipeline de ubuntu-latest/bash a windows-latest/PowerShell con JMeterInstaller@0
type: project
---

Pipeline migrado de `ubuntu-latest` + `Bash@3` a `windows-latest` + `PowerShell@2` + `JMeterInstaller@0`.

**Why:** La task `JMeterInstaller@0` de Azure DevOps solo funciona en agentes Windows. El cliente de referencia validado usaba PowerShell. El cambio permite usar la task oficial en lugar de descargar JMeter manualmente con wget.

**How to apply:** Al modificar el pipeline, siempre usar `vmImage: windows-latest`. No volver a usar `Bash@3` para instalar JMeter — usar `JMeterInstaller@0` con `jmeterVersion: '5.6.3'`.

Detalles adicionales:
- El JMX se llama `Policysense.jmx` (no `demo.jmx`)
- Carpeta de reporte JMeter: `report/` (no `reports/`)
- Carpeta de resultados JTL: `results/results.jtl`
- El SLA gate usa `statistics.json` leido desde PowerShell, no awk sobre el JTL
- Parametro `errorLimitOverridesJson` permite overrides por ThreadGroup label
- Validacion anti-produccion integrada en el script PowerShell (bloquea si HOST contiene 'prod/prd/live')
