---
name: depuracion-sistematica
description: Usar ante cualquier fallo en pruebas JMeter, errores de API, comportamiento inesperado o problemas de rendimiento, ANTES de proponer soluciones
---

# Depuración Sistemática

## Resumen

Arreglos aleatorios pierden tiempo y crean nuevos problemas. Parches rápidos enmascaran problemas subyacentes.

**Principio central:** SIEMPRE encontrar la causa raíz antes de intentar arreglos.

## La Ley de Hierro

```
NO HAY ARREGLOS SIN INVESTIGACIÓN DE CAUSA RAÍZ PRIMERO
```

Si no completaste la Fase 1, no puedes proponer arreglos.

## Cuándo usar

Usar para CUALQUIER problema técnico:
- Fallos en pruebas JMeter (errores HTTP, timeouts, assertions fallidas)
- Tiempos de respuesta fuera de SLA
- Errores de conexión al ERP
- Problemas de rendimiento detectados en reportes
- Fallos en el plan de pruebas .jmx (XML inválido)
- Errores de configuración (host, puerto, tokens)

**Usar ESPECIALMENTE cuando:**
- Bajo presión de tiempo (urgencias hacen tentador adivinar)
- "Solo un arreglo rápido" parece obvio
- Ya intentaste múltiples arreglos
- El arreglo anterior no funcionó

## Las Cuatro Fases

DEBES completar cada fase antes de pasar a la siguiente.

### Fase 1: Investigación de Causa Raíz

**ANTES de intentar CUALQUIER arreglo:**

1. **Leer mensajes de error cuidadosamente**
   - No saltar errores ni advertencias
   - Leer stack traces completos
   - Anotar códigos HTTP, tiempos, rutas de API

2. **Reproducir consistentemente**
   - ¿Puedes provocarlo de forma confiable?
   - ¿Cuáles son los pasos exactos?
   - ¿Pasa cada vez o es intermitente?

3. **Revisar cambios recientes**
   - ¿Qué cambió que pudo causar esto?
   - Diferencias en el .jmx, datos CSV, configuración
   - Cambios en el ambiente (QA/Staging)

4. **Recopilar evidencia en sistemas multi-componente**
   - En el ERP de seguros: API Gateway → Backend → Base de datos
   - Verificar en cada capa: ¿dónde falla exactamente?
   - Agregar logging/diagnóstico temporal si es necesario

5. **Rastrear flujo de datos**
   - ¿De dónde viene el valor incorrecto?
   - Rastrear hacia atrás hasta encontrar la fuente
   - Arreglar en la fuente, no en el síntoma

### Fase 2: Análisis de Patrones

1. **Encontrar ejemplos que funcionan** — ThreadGroups o endpoints similares que sí pasan
2. **Comparar contra referencias** — ¿Qué es diferente entre lo que funciona y lo que falla?
3. **Identificar diferencias** — Listar cada diferencia, por pequeña que sea
4. **Entender dependencias** — ¿Qué componentes, configuraciones, ambiente necesita?

### Fase 3: Hipótesis y Prueba

1. **Formar hipótesis única** — "Creo que X es la causa porque Y"
2. **Probar mínimamente** — El cambio más pequeño posible
3. **Verificar antes de continuar** — ¿Funcionó? Sí → Fase 4. No → nueva hipótesis
4. **Cuando no sabes** — Decir "no entiendo X", pedir ayuda

### Fase 4: Implementación

1. **Implementar arreglo único** — Abordar la causa raíz, UN cambio a la vez
2. **Verificar arreglo** — Ejecutar prueba de nuevo, ¿se resolvió?
3. **Si no funciona** — PARAR. Volver a Fase 1 con nueva información
4. **Si 3+ arreglos fallaron** — Cuestionar la arquitectura de la prueba

## Banderas Rojas — PARAR y Seguir el Proceso

Si te encuentras pensando:
- "Arreglo rápido por ahora, investigo después"
- "Solo pruebo cambiando X a ver si funciona"
- "Agrego múltiples cambios y ejecuto"
- "Probablemente es X, déjame arreglar eso"
- "No entiendo del todo pero esto podría funcionar"

**TODAS estas significan: PARAR. Volver a Fase 1.**

## Referencia Rápida

| Fase | Actividades | Criterio de éxito |
|------|-------------|-------------------|
| **1. Causa Raíz** | Leer errores, reproducir, revisar cambios | Entender QUÉ y POR QUÉ |
| **2. Patrón** | Encontrar ejemplos que funcionan, comparar | Identificar diferencias |
| **3. Hipótesis** | Formar teoría, probar mínimamente | Confirmada o nueva hipótesis |
| **4. Implementación** | Arreglar, verificar | Problema resuelto |

## Técnicas de Soporte

Disponibles en este directorio:
- **`root-cause-tracing.md`** — Rastrear bugs hacia atrás por el call stack
- **`defense-in-depth.md`** — Validación en múltiples capas
- **`condition-based-waiting.md`** — Reemplazar timeouts arbitrarios con polling de condiciones
