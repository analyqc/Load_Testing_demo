#!/bin/bash
# Valida que el archivo .jmx sea XML válido después de cada edición

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" == *.jmx ]]; then
  if command -v xmllint &> /dev/null; then
    if ! xmllint --noout "$FILE_PATH" 2>/dev/null; then
      echo "ERROR: El archivo $FILE_PATH no es XML válido. Revisa la estructura del .jmx." >&2
      exit 2
    fi
  fi
fi

exit 0
