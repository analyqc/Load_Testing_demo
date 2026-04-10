---
name: ejecucion-de-planes
description: Usar cuando tienes un plan de implementación escrito para ejecutar, con puntos de revisión
---

# Ejecución de Planes

## Resumen

Cargar plan, revisar críticamente, ejecutar todas las tareas, reportar al completar.

**Anunciar al inicio:** "Estoy usando el skill de ejecución-de-planes para implementar este plan."

## El Proceso

### Paso 1: Cargar y Revisar Plan
1. Leer archivo del plan
2. Revisar críticamente — identificar preguntas o preocupaciones
3. Si hay preocupaciones: plantearlas al usuario antes de empezar
4. Si no hay preocupaciones: crear lista de tareas y proceder

### Paso 2: Ejecutar Tareas

Para cada tarea:
1. Marcar como en progreso
2. Seguir cada paso exactamente (el plan tiene pasos pequeños)
3. Ejecutar verificaciones según lo especificado
4. Marcar como completada

### Paso 3: Completar

Después de que todas las tareas estén completas y verificadas:
- Ejecutar las pruebas JMeter para confirmar que todo funciona
- Revisar resultados en el reporte
- Anunciar completación con evidencia

## Cuándo Parar y Pedir Ayuda

**PARAR ejecución inmediatamente cuando:**
- Bloqueo: dependencia faltante, prueba falla, instrucción poco clara
- El plan tiene vacíos críticos
- No entiendes una instrucción
- La verificación falla repetidamente

**Pedir aclaración en vez de adivinar.**

## Recordar
- Revisar plan críticamente primero
- Seguir los pasos del plan exactamente
- No saltar verificaciones
- Parar cuando estés bloqueado, no adivinar
- Nunca ejecutar pruebas de carga contra producción
