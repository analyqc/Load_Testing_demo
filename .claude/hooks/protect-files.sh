#!/bin/bash
# Protege archivos sensibles del ERP de seguros
# Bloquea ediciones a: .env, credenciales, resultados de prueba, configuración git

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(".env" "credentials" ".git/" "results/" "reports/" "package-lock.json" "*.jtl")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Bloqueado: $FILE_PATH coincide con patron protegido '$pattern'. Los resultados y reportes son generados por JMeter, no deben editarse manualmente." >&2
    exit 2
  fi
done

exit 0
