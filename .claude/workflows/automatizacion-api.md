---
name: automatizacion-api
description: Flujo para automatizar una API nueva o modificar una existente en el plan de pruebas JMeter de Policysense
---

# Workflow — Automatización / Modificación de API en JMeter

Usar este workflow cada vez que llegue un requerimiento nuevo o de modificación de un endpoint a automatizar.

---

## Paso 1 — Líder de Pruebas actualiza el Excel de control

**Agente:** `lider-pruebas`

- Abrir `docs/API_Control_Automatizacion.xlsx`
- Localizar el endpoint en la hoja **Inventario Completo**
- Cambiar el estado de automatización al valor que corresponda:

| Estado | Cuándo usarlo |
|--------|--------------|
| `Nueva` | Endpoint que nunca fue automatizado |
| `En curso` | Trabajo en progreso por el equipo |
| `En modificación` | Ya existe pero requiere cambios |
| `Deprecada` | Endpoint eliminado o reemplazado |
| `Automatizada` | Completada y validada en `main` |

- Registrar: fecha de solicitud, sprint asignado, responsable
- Guardar y confirmar al equipo el estado actualizado

---

## Paso 2 — Análisis del requerimiento

**Agente principal:** `analizador-requerimientos-api`
**Consulta permanente:** `seguro-especialista`

- Determinar si es endpoint **nuevo** o **modificación** de uno existente
- Consultar `docs/api-inventory.md` para ver estado actual
- Consultar `docs/Policysense.postman_collection.json` para ver la request base
- Revisar documentación en `docs/` (manuales MHTML/TXT del módulo)
- Con apoyo del `seguro-especialista`, clarificar:
  - Lógica de negocio del endpoint
  - Prerrequisitos (datos que deben existir antes, tokens, IDs previos)
  - Postcondiciones esperadas (qué cambia en el sistema tras la llamada)
- Entregar **brief estructurado** al `disenador-jmx`:
  - Método HTTP, path completo, host, parámetros, body de ejemplo
  - Assertions necesarias (HTTP code, SLA, campos de negocio)
  - Variables JMeter a usar o crear
  - Dependencias de otros samplers (ej: debe correr después de POST Crear Cotizacion)

---

## Paso 3 — Diseño en JMeter

**Agente principal:** `disenador-jmx`
**Consulta permanente:** `seguro-especialista`

- Recibir el brief del `analizador-requerimientos-api`
- En `Policysense.jmx`:
  - Agregar o modificar el `HTTPSamplerProxy` en el ThreadGroup correcto
  - Configurar prerrequisitos: samplers previos, variables extraídas (RegexExtractor / JSR223)
  - Configurar postcondiciones: variables que otros samplers necesitarán después
  - Agregar assertions:
    - `ResponseAssertion` — código HTTP esperado (ej: `2\d\d`)
    - `DurationAssertion` — SLA del módulo (ms)
    - `ResponseAssertion` negativa — sin `error|exception|stacktrace`
    - Assertions de negocio específicas del endpoint
  - Envolver el sampler en su `IfController` con la condición `requestToRun`
- Indicar a `infraestructura-devops` si necesita rama nueva o no

---

## Paso 4 — Infraestructura y gestión de rama

**Agente:** `infraestructura-devops`

- **Si el diseñador solicitó rama nueva:**
  - `git checkout -b feat/<nombre-endpoint-o-modulo>`
  - Commit del JMX modificado en esa rama
  - `git push origin feat/<rama>`
  - NO hacer merge a `main`
- **Si NO se solicitó rama nueva:**
  - Solo verificar que `azure-pipelines.yml` no requiere cambios
  - Si el nuevo endpoint requiere host o variable nueva → actualizar el YAML en rama separada
  - Nunca modificar el pipeline sin necesidad real

---

## Paso 5 — Validación y decisión de merge

**Agente:** `validador-calidad`

- Hacer checkout de la rama entregada por `infraestructura-devops`
- Ejecutar checklist de auditoría:
  - [ ] ResponseAssertion presente y correcta
  - [ ] DurationAssertion con SLA del módulo
  - [ ] Assertions de negocio específicas del endpoint
  - [ ] IfController con condición `requestToRun` correcta
  - [ ] Prerrequisitos y postcondiciones configurados
  - [ ] No rompe ningún ThreadGroup existente
- Ejecutar el test localmente o vía pipeline apuntando a la rama
- **Si la ejecución es exitosa:**
  - **Opción A (se solicitó merge):** `git checkout main` → `git merge --no-ff <rama>` → `git push origin main` → eliminar rama
  - **Opción B (no se solicitó merge):** dejar la rama lista, notificar al líder
- **Si la ejecución falla:**
  - Documentar errores encontrados
  - Devolver a `disenador-jmx` con detalle de qué corregir
  - NO hacer merge

---

## Paso 6 — Cierre: Líder actualiza el control

**Agente:** `lider-pruebas`

- Actualizar `docs/API_Control_Automatizacion.xlsx`:
  - Cambiar estado a `Automatizada` (o `En revisión` si quedó en rama sin merge)
  - Registrar: fecha de completado, ThreadGroup, rama o commit de referencia
  - Actualizar el % de cobertura en la hoja **Resumen Ejecutivo**
- Confirmar al equipo que el ciclo está cerrado

---

## Participación del especialista en seguros

**Agente:** `seguro-especialista`

Siempre disponible para consulta en los pasos 2, 3 y 5. Casos de uso típicos:
- Aclarar qué significa un campo del response en términos de negocio
- Validar si un valor de prueba es coherente con las reglas del ERP
- Confirmar el flujo de negocio correcto (ej: ¿se puede emitir sin cotización previa?)
- Revisar si una postcondición es realista según la lógica de seguros

---

## Diagrama de flujo

```
Requerimiento nuevo/modificación
         │
         ▼
[1] lider-pruebas → actualiza Excel (estado: Nueva / En modificación / En curso)
         │
         ▼
[2] analizador-requerimientos-api ←→ seguro-especialista
    evalúa API, documentación, prereqs, postcondiciones
    entrega brief estructurado
         │
         ▼
[3] disenador-jmx ←→ seguro-especialista
    programa en Policysense.jmx
    solicita rama (opcional) a infraestructura-devops
         │
         ▼
[4] infraestructura-devops
    crea rama feat/<nombre> (si se solicitó)
    verifica/actualiza azure-pipelines.yml (solo si es necesario)
         │
         ▼
[5] validador-calidad
    audita + ejecuta prueba
    ┌─── OK + merge solicitado → merge a main + push
    ├─── OK + sin merge → rama lista, notifica
    └─── FAIL → devuelve a disenador-jmx
         │
         ▼
[6] lider-pruebas → actualiza Excel (estado: Automatizada / % cobertura)
```
