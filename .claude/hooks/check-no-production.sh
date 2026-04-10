#!/bin/bash
# Bloquea cualquier comando Bash que apunte a hosts de producción
# Previene ejecutar JMeter contra ambientes productivos

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

PROD_PATTERNS=("prod" "produccion" "production" "api.seguros.com" "erp.seguros.com" "live." "prd.")

for pattern in "${PROD_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "BLOQUEADO: El comando contiene referencia a produccion ('$pattern'). Las pruebas de carga NUNCA deben ejecutarse contra produccion." >&2
    exit 2
  fi
done

exit 0
