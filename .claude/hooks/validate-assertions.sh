#!/bin/bash
# Hook Stop: Verifica que el JMX tenga ResponseAssertion y DurationAssertion
# en cada ThreadGroup antes de declarar el trabajo completo.

JMX="$CLAUDE_PROJECT_DIR/Policysense.jmx"

if [[ ! -f "$JMX" ]]; then
  exit 0  # No hay JMX que validar
fi

ERRORS=()

# Verificar XML válido
if command -v xmllint &> /dev/null; then
  if ! xmllint --noout "$JMX" 2>/dev/null; then
    ERRORS+=("El archivo Policysense.jmx no es XML válido.")
  fi
fi

# Contar ThreadGroups (excluyendo SetupThreadGroup)
TG_COUNT=$(grep -c 'testclass="ThreadGroup"' "$JMX" 2>/dev/null || echo 0)

# Contar assertions
RESPONSE_COUNT=$(grep -c 'testclass="ResponseAssertion"' "$JMX" 2>/dev/null || echo 0)
DURATION_COUNT=$(grep -c 'testclass="DurationAssertion"' "$JMX" 2>/dev/null || echo 0)

# Cada ThreadGroup debe tener al menos 2 ResponseAssertions y 1 DurationAssertion
# (mínimo esperado: TG_COUNT * 2 ResponseAssertions, TG_COUNT * 1 DurationAssertion)
MIN_RESPONSE=$((TG_COUNT * 2))
MIN_DURATION=$((TG_COUNT * 1))

if [[ "$RESPONSE_COUNT" -lt "$MIN_RESPONSE" ]]; then
  ERRORS+=("Faltan ResponseAssertions: hay $RESPONSE_COUNT pero se esperan al menos $MIN_RESPONSE (2 por ThreadGroup).")
fi

if [[ "$DURATION_COUNT" -lt "$MIN_DURATION" ]]; then
  ERRORS+=("Faltan DurationAssertions: hay $DURATION_COUNT pero se esperan al menos $MIN_DURATION (1 por ThreadGroup).")
fi

# Verificar SetUp OAuth tiene DurationAssertion
SETUP_DURATION=$(grep -A 50 'testclass="SetupThreadGroup"' "$JMX" | grep -c 'testclass="DurationAssertion"' 2>/dev/null || echo 0)
if [[ "$SETUP_DURATION" -eq 0 ]]; then
  ERRORS+=("El ThreadGroup '00 - SetUp OAuth Login' no tiene DurationAssertion.")
fi

if [[ ${#ERRORS[@]} -gt 0 ]]; then
  echo "Validación de assertions fallida:" >&2
  for err in "${ERRORS[@]}"; do
    echo "  - $err" >&2
  done
  exit 2
fi

echo "JMX validado: $TG_COUNT ThreadGroups, $RESPONSE_COUNT ResponseAssertions, $DURATION_COUNT DurationAssertions. OK."
exit 0
