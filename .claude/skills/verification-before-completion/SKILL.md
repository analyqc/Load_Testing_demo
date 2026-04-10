---
name: verificacion-antes-de-completar
description: Usar cuando estés a punto de declarar que el trabajo está completo, arreglado o pasando, ANTES de hacer commit o crear PRs — requiere ejecutar comandos de verificación y confirmar la salida antes de hacer cualquier afirmación de éxito
---

# Verificación Antes de Completar

## Resumen

Declarar que el trabajo está completo sin verificación es deshonestidad, no eficiencia.

**Principio central:** Evidencia antes de afirmaciones, siempre.

## La Ley de Hierro

```
NO HAY AFIRMACIONES DE COMPLETACIÓN SIN EVIDENCIA DE VERIFICACIÓN FRESCA
```

Si no ejecutaste el comando de verificación en este mensaje, no puedes afirmar que pasa.

## La Función de Verificación

```
ANTES de afirmar cualquier estado o expresar satisfacción:

1. IDENTIFICAR: ¿Qué comando prueba esta afirmación?
   - JMeter: jmeter -n -t demo.jmx -Jusers=1 -Jloop=1
   - XML válido: xmllint --noout demo.jmx
   - Assertions: revisar reporte de resultados

2. EJECUTAR: Ejecutar el comando COMPLETO (fresco)
3. LEER: Salida completa, código de salida, contar fallos
4. VERIFICAR: ¿La salida confirma la afirmación?
   - Si NO: Declarar estado real con evidencia
   - Si SÍ: Declarar afirmación CON evidencia
5. SOLO ENTONCES: Hacer la afirmación

Saltar cualquier paso = mentir, no verificar
```

## Fallos Comunes en JMeter

| Afirmación | Requiere | No suficiente |
|------------|----------|---------------|
| Pruebas pasan | Ejecución JMeter: 0 errores | "Debería pasar" |
| XML válido | xmllint: sin errores | "Se ve bien el XML" |
| SLA cumplido | Reporte: tiempos < umbral | Asumir que es rápido |
| Error arreglado | Re-ejecutar: sin error | Código cambiado, asumir arreglado |
| ThreadGroup funciona | Ejecutar con 1 usuario: OK | Solo revisar el XML |

## Banderas Rojas — PARAR

- Usar "debería", "probablemente", "parece que"
- Expresar satisfacción antes de verificar ("Listo!", "Perfecto!", "Hecho!")
- A punto de hacer commit sin verificar
- Confiar en resultados de ejecuciones anteriores
- Verificación parcial
- Pensar "solo esta vez"

## Prevención de Racionalización

| Excusa | Realidad |
|--------|----------|
| "Debería funcionar ahora" | EJECUTA la verificación |
| "Estoy seguro" | Seguridad no es evidencia |
| "Solo esta vez" | Sin excepciones |
| "XML se ve bien" | Ejecuta xmllint |
| "El agente dijo que está bien" | Verifica independientemente |

## Cuándo Aplicar

**SIEMPRE antes de:**
- CUALQUIER variación de afirmaciones de éxito/completación
- CUALQUIER expresión de satisfacción
- Hacer commit, crear PR, completar tarea
- Pasar a la siguiente tarea
- Delegar a agentes

## La Línea Final

**Sin atajos para verificación.**

Ejecuta el comando. Lee la salida. ENTONCES afirma el resultado.

Esto es no negociable.
