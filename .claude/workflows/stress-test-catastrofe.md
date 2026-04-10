---
name: prueba-estres-catastrofe
description: Prueba de estrés simulando evento catastrófico (pico masivo de siniestros)
---

# Flujo de Trabajo — Prueba de Estrés Catastrófica

## Escenario
Simula un evento catastrófico (granizo, inundación, terremoto) que genera un pico masivo de avisos de siniestro simultáneos al ERP de seguros.

## Parámetros de carga

| Parámetro | Valor |
|-----------|-------|
| Usuarios concurrentes | 500 |
| Ramp-up | 60 segundos |
| Iteraciones | 10 |
| Tiempo de espera | 1000ms entre requests |

## Módulos más afectados
- **Siniestros**: aviso masivo, consultas, actualización de estado
- **Cobranza**: recibos de emergencia
- **Servicio de Campo**: inspecciones de emergencia
- **Portal Reaseguro**: cesiones masivas

## Ejecución
```bash
jmeter -n -t demo.jmx -l results/estres_catastrofe.jtl -e -o reports/estres/ \
  -Jhost=<HOST> -Jprotocol=https \
  -Jusers=500 -JrampUp=60 -Jloop=10 -Jtoken=<JWT>
```

## Criterios de aceptación
- El sistema no debe caerse (0 errores de conexión)
- Registro de siniestro P95 < 10000ms bajo carga extrema
- Tiempo de recuperación < 5 minutos post-pico
- Sin pérdida de datos (todos los siniestros registrados)
- Portal de reaseguro debe seguir respondiendo

## Después de la prueba
- Limpiar datos de prueba generados
- Documentar comportamiento del sistema bajo estrés
- Identificar punto de quiebre (cuántos usuarios antes de degradación)
- Reportar recomendaciones de escalamiento
