---
name: despacho-de-agentes-paralelos
description: Usar cuando hay 2+ tareas independientes que pueden trabajarse sin estado compartido ni dependencias secuenciales
---

# Despacho de Agentes Paralelos

## Resumen

Delegas tareas a agentes especializados con contexto aislado. Construyes exactamente lo que necesitan. Esto preserva tu propio contexto para trabajo de coordinación.

Cuando tienes múltiples problemas no relacionados (diferentes módulos del ERP, diferentes tipos de prueba, diferentes fallos), investigarlos secuencialmente pierde tiempo.

**Principio central:** Despachar un agente por dominio de problema independiente. Dejarlos trabajar en paralelo.

## Cuándo Usar

**Usar cuando:**
- 3+ módulos del ERP necesitan ThreadGroups independientes
- Múltiples tipos de prueba: carga, estrés, pico
- Cada problema puede entenderse sin contexto de los otros
- No hay estado compartido entre investigaciones

**No usar cuando:**
- Los fallos están relacionados (arreglar uno podría arreglar otros)
- Se necesita entender el estado completo del sistema
- Los agentes interferirían entre sí (editando mismo archivo)

## El Patrón

### 1. Identificar Dominios Independientes

Agrupar por módulo del ERP:
- Agente A: ThreadGroups de Pólizas y Endosos
- Agente B: ThreadGroups de Siniestros y Cobranza
- Agente C: Scripts de ejecución y CI/CD

### 2. Crear Tareas Enfocadas por Agente

Cada agente recibe:
- **Alcance específico:** Un módulo o subsistema
- **Meta clara:** Qué debe lograr
- **Restricciones:** No modificar código de otros módulos
- **Salida esperada:** Resumen de qué encontró y qué hizo

### 3. Despachar en Paralelo

```
Tarea("Crear ThreadGroups para módulo Reaseguro")
Tarea("Configurar assertions SLA para módulo Cobranza")
Tarea("Crear script CI/CD para GitHub Actions")
// Las tres corren concurrentemente
```

### 4. Revisar e Integrar

Cuando los agentes retornan:
- Leer cada resumen
- Verificar que los arreglos no entren en conflicto
- Ejecutar suite completa de pruebas JMeter
- Integrar todos los cambios

## Estructura de Prompt para Agente

Buenos prompts de agente son:
1. **Enfocados** — Un dominio de problema claro
2. **Auto-contenidos** — Todo el contexto necesario
3. **Específicos sobre salida** — ¿Qué debe retornar el agente?

```markdown
Crear ThreadGroup para el módulo de Siniestros en demo.jmx:

Endpoints:
- POST /api/v1/siniestros (aviso de siniestro)
- GET /api/v1/siniestros/{id} (consulta)
- PATCH /api/v1/siniestros/{id}/estado (actualizar estado)

Requisitos:
1. Usuarios concurrentes: ${__P(users,5)}
2. Response Assertion: status 201/200 según endpoint
3. Duration Assertion: < 5000ms para POST, < 1000ms para GET

NO modifiques otros ThreadGroups existentes.

Retorna: Resumen de qué ThreadGroup creaste y qué assertions configuraste.
```

## Errores Comunes

**Muy amplio:** "Arregla todas las pruebas" — agente se pierde
**Específico:** "Crea ThreadGroup para Siniestros" — alcance enfocado

**Sin contexto:** "Arregla el timeout" — agente no sabe dónde
**Con contexto:** Incluir mensajes de error y nombres de endpoints

## Verificación

Después de que los agentes retornan:
1. **Revisar cada resumen** — Entender qué cambió
2. **Verificar conflictos** — ¿Editaron los agentes el mismo código?
3. **Ejecutar suite completa** — Verificar que todo funciona junto
4. **Inspección visual** — Los agentes pueden cometer errores sistemáticos
