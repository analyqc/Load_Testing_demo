---
name: test_type correcto para assertions negativas con regex
description: Usar test_type=2 (CONTAINS) para regex en ResponseAssertion, no test_type=1 (SUBSTRING)
type: feedback
---

En JMeter, los valores de `Assertion.test_type` son:
- `1` = SUBSTRING — coincidencia literal, NO evalúa regex
- `2` = CONTAINS — evalúa regex
- `8` = EQUALS — coincidencia exacta, NO evalúa regex

**Regla:** Si el patrón de la assertion usa sintaxis regex (e.g., `(?i)(error|exception|stacktrace)`), el test_type DEBE ser `2` (CONTAINS).

**Why:** En el sampler `Assert - Sin errores` del TG `01 - Policy Admin`, se usó `test_type=1` con un patrón regex. JMeter lo trataría como literal, nunca coincidiría con la cadena real, haciendo la assertion inútil. Detectado el 2026-04-09.

**How to apply:** Al auditar cualquier ResponseAssertion con patrón que contenga `(?i)`, `.*`, `\d`, `|`, `()` u otra sintaxis regex, verificar que `test_type=2`. Si usa `test_type=1` o `test_type=8`, marcar como bug y corregir.
