---
name: Pipeline con scripts inline (sin archivos externos)
description: El pipeline usa scripts inline en PowerShell, no filePath a scripts externos
type: project
---

El pipeline de referencia que funciona usa `targetType: 'inline'` en todos los pasos PowerShell, con los scripts completos embebidos en el YAML. No usa `filePath` apuntando a `scripts/gen-html-report.ps1` ni `scripts/gen-junit-report.ps1`.

**Why:** La versión anterior del pipeline fallaba porque dependía de scripts externos que podían no existir en el agente. La estructura inline es más portable y no requiere mantener archivos adicionales.

**How to apply:** Al modificar el pipeline, mantener toda la lógica PowerShell dentro del bloque `script:` del YAML. No crear dependencias de scripts externos en `scripts/`.

Cambios aplicados en la reescritura de 2026-04-10:
- `demo.jmx` → `Policysense.jmx`
- 12 hosts de microservicios Policysense como `-J` props en jmeterArgs (sin variable group)
- `groupToRun` default: `01_Policy_Admin`
- SLA check usa `${{ parameters.groupToRun }}`, `${{ parameters.maxErrorPercent }}`, `${{ parameters.errorLimitOverridesJson }}` directamente
- Sin variable group `policysense-jmeter-vars`
- Scripts HTML y JUnit inline en el YAML
