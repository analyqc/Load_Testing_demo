---
name: escritura-de-planes
description: Usar cuando tienes requisitos para una tarea de múltiples pasos en JMeter, ANTES de tocar el .jmx o cualquier archivo
---

# Escritura de Planes

## Resumen

Escribe planes de implementación completos asumiendo que el ingeniero tiene cero contexto del ERP de seguros. Documenta todo lo que necesita saber: qué archivos tocar, qué ThreadGroups crear, qué assertions configurar, cómo probar. Tareas pequeñas y claras.

**Anunciar al inicio:** "Estoy usando el skill de escritura-de-planes para crear el plan de implementación."

**Guardar planes en:** `docs/planes/YYYY-MM-DD-<nombre>.md`

## Verificación de Alcance

Si los requisitos cubren múltiples módulos independientes del ERP, sugiere dividir en planes separados — uno por módulo. Cada plan debe producir pruebas funcionales por sí mismo.

## Estructura de Archivos

Antes de definir tareas, mapea qué archivos se crearán o modificarán:

- `demo.jmx` — ThreadGroups, HTTP Samplers, Assertions
- `data/*.csv` — Datos de prueba del módulo de seguros
- `scripts/*.sh` — Scripts de ejecución
- `docs/planes/*.md` — Documentación del plan

## Granularidad de Tareas

**Cada paso es una acción (2-5 minutos):**
- "Agregar ThreadGroup para Endosos" — paso
- "Agregar HTTP Sampler POST /endosos" — paso
- "Agregar Response Assertion (status 201)" — paso
- "Agregar Duration Assertion (SLA < 4000ms)" — paso
- "Ejecutar prueba para verificar que funciona" — paso

## Encabezado del Plan

**Todo plan DEBE empezar con:**

```markdown
# [Nombre] Plan de Implementación

**Objetivo:** [Una oración describiendo qué construye]

**Módulos del ERP:** [Qué módulos de seguros involucra]

**SLAs objetivo:** [Tiempos de respuesta esperados]

---
```

## Estructura de Tarea

````markdown
### Tarea N: [Nombre del componente]

**Archivos:**
- Modificar: `demo.jmx` (ThreadGroup X)
- Crear: `data/endosos.csv`
- Ejecutar: `scripts/run_test.sh`

- [ ] **Paso 1: Agregar ThreadGroup**
  Nombre: `Seguros_Endosos_Emision`
  Usuarios: `${__P(users,5)}`

- [ ] **Paso 2: Agregar HTTP Sampler**
  POST ${basePath}/polizas/{id}/endosos
  Body: {...}

- [ ] **Paso 3: Agregar Assertions**
  Response Assertion: status 201
  Duration Assertion: < 4000ms

- [ ] **Paso 4: Ejecutar y verificar**
  Ejecutar: `jmeter -n -t demo.jmx -Jusers=1 -Jloop=1`
  Esperado: Sin errores
````

## Sin Placeholders

Cada paso debe contener el contenido real. Estos son **fallos del plan** — nunca escribirlos:
- "TBD", "TODO", "implementar después"
- "Agregar validación apropiada"
- "Similar a la Tarea N" (repetir el contenido)
- Pasos que describen qué hacer sin mostrar cómo

## Auto-Revisión

Después de escribir el plan completo:
1. **Cobertura de requisitos:** ¿Cada módulo tiene su ThreadGroup?
2. **Scan de placeholders:** Buscar "TBD", "TODO", secciones incompletas
3. **Consistencia:** ¿Los nombres de ThreadGroup y paths de API son consistentes?
4. Si encuentras problemas, arreglarlos en línea

## Principios

- Rutas de archivos exactas siempre
- Contenido completo en cada paso
- Comandos exactos con salida esperada
- YAGNI: no agregar escenarios innecesarios
- NUNCA apuntar a producción
