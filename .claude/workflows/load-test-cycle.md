---
name: ciclo-pruebas-de-carga
description: Ciclo completo de pruebas de carga para el ERP de Seguros
---

# Flujo de Trabajo — Ciclo de Pruebas de Carga

## 1. Preparación
- Verificar que el ambiente destino está disponible (QA/Staging)
- Validar datos de prueba en data/*.csv
- Confirmar token de autenticación vigente
- NUNCA ejecutar contra producción

## 2. Diseño de Escenarios
- Revisar ThreadGroups en demo.jmx
- Ajustar usuarios concurrentes según el módulo del ERP
- Verificar assertions y SLAs por endpoint
- Usar skill `lluvia-de-ideas` para nuevos escenarios

## 3. Ejecución
```bash
jmeter -n -t demo.jmx -l results/results.jtl -e -o reports/ \
  -Jhost=<HOST> -Jport=<PUERTO> -Jprotocol=https \
  -Jusers=10 -JrampUp=30 -Jloop=3 -Jtoken=<JWT>
```

## 4. Análisis de Resultados
- Revisar reporte HTML en reports/
- Verificar SLAs por módulo del ERP
- Identificar cuellos de botella
- Usar skill `depuracion-sistematica` si hay fallos

## 5. Reporte
- Generar resumen en reports/resumen.md
- Documentar hallazgos y recomendaciones
- Comparar contra baseline anterior
- Usar skill `verificacion-antes-de-completar` antes de entregar
