---
name: desarrollo-dirigido-por-subagentes
description: Usar cuando se ejecutan planes de implementación con tareas independientes en la sesión actual
---

# Desarrollo Dirigido por Subagentes

Ejecutar plan despachando un subagente fresco por tarea, con revisión de dos etapas después de cada una: cumplimiento de requisitos primero, luego calidad.

**Por qué subagentes:** Delegas tareas a agentes especializados con contexto aislado. Construyes exactamente lo que necesitan. Esto preserva tu contexto para coordinación.

**Principio central:** Subagente fresco por tarea + revisión de dos etapas = alta calidad, iteración rápida

## Cuándo Usar

**Usar cuando:**
- Tienes un plan de implementación con múltiples tareas
- Las tareas son mayormente independientes
- Quieres quedarte en la misma sesión

**vs. Ejecución de Planes:**
- Misma sesión (sin cambio de contexto)
- Subagente fresco por tarea (sin contaminación de contexto)
- Revisión de dos etapas automática
- Iteración más rápida

## El Proceso

1. **Leer plan** — extraer todas las tareas con texto completo
2. **Por cada tarea:**
   - Despachar subagente implementador con contexto completo
   - Si el subagente tiene preguntas → responder, re-despachar
   - Subagente implementa, prueba, hace commit, auto-revisa
   - Despachar subagente revisor de requisitos
   - Si no cumple → implementador arregla → re-revisión
   - Despachar subagente revisor de calidad
   - Si hay problemas → implementador arregla → re-revisión
   - Marcar tarea completa
3. **Después de todas las tareas** — revisión final, verificar todo

## Manejo de Estado del Implementador

**LISTO:** Proceder a revisión de requisitos.

**LISTO_CON_DUDAS:** Leer las dudas antes de proceder. Si son sobre corrección, abordarlas. Si son observaciones, anotar y proceder.

**NECESITA_CONTEXTO:** Proveer la información faltante y re-despachar.

**BLOQUEADO:** Evaluar el bloqueo:
1. Si es problema de contexto → más contexto, re-despachar
2. Si la tarea es muy grande → dividir en piezas más pequeñas
3. Si el plan está mal → escalar al usuario

**Nunca** ignorar una escalación o forzar al mismo subagente a reintentar sin cambios.

## Plantillas de Prompt

- `./implementer-prompt.md` — Despachar subagente implementador
- `./spec-reviewer-prompt.md` — Despachar revisor de requisitos
- `./code-quality-reviewer-prompt.md` — Despachar revisor de calidad

## Banderas Rojas

**Nunca:**
- Saltar revisiones (ni de requisitos NI de calidad)
- Proceder con problemas sin arreglar
- Despachar múltiples subagentes de implementación en paralelo (conflictos)
- Hacer que el subagente lea el archivo del plan (proveer texto completo)
- Ignorar preguntas del subagente
- Aceptar "casi cumple" en requisitos
- Ejecutar pruebas contra producción
