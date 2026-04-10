---
name: lluvia-de-ideas
description: "DEBES usar esto antes de cualquier trabajo creativo: diseñar escenarios de prueba, agregar módulos al .jmx, modificar ThreadGroups o definir SLAs. Explora la intención del usuario, requisitos y diseño antes de implementar."
---

# Lluvia de Ideas para Diseño de Pruebas

Ayuda a convertir ideas en diseños completos de pruebas de carga a través de diálogo colaborativo.

Empieza entendiendo el contexto del proyecto (ERP de seguros), luego haz preguntas una a la vez para refinar la idea. Una vez que entiendas qué se va a probar, presenta el diseño y obtén la aprobación del usuario.

<HARD-GATE>
NO invoques ningún skill de implementación, escribas código/XML, ni tomes acciones de implementación hasta que hayas presentado un diseño y el usuario lo haya aprobado. Aplica a TODOS los escenarios sin importar su simplicidad aparente.
</HARD-GATE>

## Anti-Patrón: "Esto es muy simple para necesitar diseño"

Cada escenario de prueba pasa por este proceso. Un GET simple, un ThreadGroup nuevo, un cambio de SLA — todos. Los escenarios "simples" son donde los supuestos no examinados causan más retrabajo. El diseño puede ser breve, pero DEBES presentarlo y obtener aprobación.

## Lista de verificación

DEBES crear una tarea para cada elemento y completarlos en orden:

1. **Explorar contexto del proyecto** — revisar archivos .jmx, docs, módulos del ERP
2. **Hacer preguntas clarificadoras** — una a la vez: propósito, restricciones, criterios de éxito, SLAs
3. **Proponer 2-3 enfoques** — con pros/contras y tu recomendación
4. **Presentar diseño** — en secciones escaladas a su complejidad, obtener aprobación
5. **Escribir documento de diseño** — guardar en `docs/planes/YYYY-MM-DD-<tema>-diseño.md`
6. **Auto-revisión** — verificar: sin placeholders, sin contradicciones, sin ambigüedad
7. **Revisión del usuario** — preguntar al usuario antes de proceder
8. **Transición a implementación** — invocar skill de escritura-de-planes

## El Proceso

**Entender la idea (contexto seguros):**

- Revisar el estado actual del proyecto: `demo.jmx`, datos CSV, scripts
- Preguntar sobre el módulo del ERP involucrado (Pólizas, Siniestros, Cobranza, etc.)
- Identificar los endpoints reales de la API
- Entender los SLAs del negocio para ese módulo
- Hacer preguntas una a la vez
- Preferir preguntas de opción múltiple cuando sea posible

**Explorar enfoques:**

- Proponer 2-3 enfoques de prueba diferentes con pros/contras
- Considerar: prueba de carga normal, prueba de estrés, prueba de pico
- Recomendar la mejor opción y explicar por qué

**Presentar el diseño:**

- Una vez que entiendas qué se va a probar, presenta el diseño
- Incluir: ThreadGroups, HTTP Samplers, Assertions, SLAs, datos de prueba
- Escalar cada sección a su complejidad
- Preguntar después de cada sección si se ve bien

**Diseño para el ERP de Seguros:**

- Cada ThreadGroup = un módulo del menú (Pólizas, Siniestros, etc.)
- Cada HTTP Sampler = una operación de la API (GET, POST, PATCH, DELETE)
- Response Assertions = validar reglas de negocio del seguro
- Duration Assertions = SLAs según criticidad del módulo
- CSV Data Sets = datos de prueba realistas del dominio de seguros

## Principios clave

- **Una pregunta a la vez** — No abrumar con múltiples preguntas
- **Opción múltiple preferido** — Más fácil de responder
- **YAGNI** — No agregar escenarios innecesarios
- **Explorar alternativas** — Siempre proponer 2-3 enfoques
- **Validación incremental** — Presentar, obtener aprobación, avanzar
- **NUNCA producción** — Las pruebas de carga solo contra QA/Staging
