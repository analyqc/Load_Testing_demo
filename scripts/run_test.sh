#!/usr/bin/env bash
# =============================================================================
# run_test.sh — Ejecución local headless de JMeter para Policysense
# =============================================================================
# Uso:
#   ./scripts/run_test.sh [opciones]
#
# Opciones:
#   -h HOST        Host de la API  (default: localhost)
#   -p PORT        Puerto          (default: 8080)
#   -P PROTOCOL    Protocolo       (default: http)
#   -u USERS       Usuarios conc.  (default: 5)
#   -r RAMP_UP     Ramp-up (seg)   (default: 10)
#   -l LOOPS       Iteraciones     (default: 3)
#   -t THREADS     ThreadGroup a ej (default: todos, ej: "01-Polizas")
#   -j JMETER_BIN  Ruta a jmeter   (default: jmeter en PATH)
#
# Ejemplo mínimo (QA local):
#   ./scripts/run_test.sh -h localhost -p 8080 -P http
#
# Ejemplo con usuarios:
#   ./scripts/run_test.sh -h qa.policysense.local -p 443 -P https -u 10 -r 20 -l 5
# =============================================================================

set -euo pipefail

# --------------------------------------------------------------------------
# Valores por defecto
# --------------------------------------------------------------------------
HOST="localhost"
PORT="8080"
PROTOCOL="http"
USERS="5"
RAMP_UP="10"
LOOPS="3"
JMETER_BIN="${JMETER_HOME:-}/bin/jmeter"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
JMX_FILE="$PROJECT_DIR/demo.jmx"
RESULTS_DIR="$PROJECT_DIR/results/$TIMESTAMP"
REPORT_DIR="$PROJECT_DIR/reports/$TIMESTAMP"

# --------------------------------------------------------------------------
# Parseo de argumentos
# --------------------------------------------------------------------------
while getopts "h:p:P:u:r:l:j:" opt; do
  case $opt in
    h) HOST="$OPTARG" ;;
    p) PORT="$OPTARG" ;;
    P) PROTOCOL="$OPTARG" ;;
    u) USERS="$OPTARG" ;;
    r) RAMP_UP="$OPTARG" ;;
    l) LOOPS="$OPTARG" ;;
    j) JMETER_BIN="$OPTARG" ;;
    *) echo "Opción inválida: -$OPTARG" >&2; exit 1 ;;
  esac
done

# --------------------------------------------------------------------------
# Validaciones previas
# --------------------------------------------------------------------------

# Seguridad: nunca apuntar a producción
if echo "$HOST" | grep -qiE "(prod|produccion|production|api\.seguros\.com)"; then
  echo "ERROR: El host '$HOST' parece ser de produccion. Aborting."
  exit 1
fi

# Verificar que jmeter existe
if ! command -v jmeter &>/dev/null && [ ! -x "$JMETER_BIN" ]; then
  echo "ERROR: JMeter no encontrado."
  echo "  - Agrega JMeter al PATH, o"
  echo "  - Define la variable JMETER_HOME, o"
  echo "  - Usa la opción -j /ruta/a/jmeter"
  exit 1
fi

# Resolver binario final
if command -v jmeter &>/dev/null; then
  JMETER_CMD="jmeter"
else
  JMETER_CMD="$JMETER_BIN"
fi

# Verificar que el JMX existe
if [ ! -f "$JMX_FILE" ]; then
  echo "ERROR: No se encontró $JMX_FILE"
  exit 1
fi

# --------------------------------------------------------------------------
# Crear directorios de resultados
# --------------------------------------------------------------------------
mkdir -p "$RESULTS_DIR"
mkdir -p "$REPORT_DIR"

JTL_FILE="$RESULTS_DIR/resultados.jtl"
LOG_FILE="$RESULTS_DIR/jmeter.log"

# --------------------------------------------------------------------------
# Banner
# --------------------------------------------------------------------------
echo "========================================================"
echo "  Policysense — Prueba de Carga Local"
echo "========================================================"
echo "  Host:       $PROTOCOL://$HOST:$PORT"
echo "  Usuarios:   $USERS (ramp-up ${RAMP_UP}s, loops $LOOPS)"
echo "  JMX:        $JMX_FILE"
echo "  Resultados: $RESULTS_DIR"
echo "  Reporte:    $REPORT_DIR"
echo "========================================================"
echo ""

# --------------------------------------------------------------------------
# Ejecución JMeter (modo headless / non-GUI)
# --------------------------------------------------------------------------
echo "[$(date '+%H:%M:%S')] Iniciando JMeter..."

"$JMETER_CMD" \
  -n \
  -t "$JMX_FILE" \
  -l "$JTL_FILE" \
  -j "$LOG_FILE" \
  -Jhost="$HOST" \
  -Jport="$PORT" \
  -Jprotocol="$PROTOCOL" \
  -Jusers="$USERS" \
  -JrampUp="$RAMP_UP" \
  -Jloop="$LOOPS" \
  -e \
  -o "$REPORT_DIR"

EXIT_CODE=$?

echo ""
echo "[$(date '+%H:%M:%S')] JMeter finalizado (código de salida: $EXIT_CODE)"

# --------------------------------------------------------------------------
# Verificación rápida de SLAs
# --------------------------------------------------------------------------
if [ -f "$JTL_FILE" ] && [ "$EXIT_CODE" -eq 0 ]; then
  echo ""
  echo "--- Verificación rápida de SLAs ---"

  TOTAL=$(tail -n +2 "$JTL_FILE" | wc -l)
  ERRORS=$(tail -n +2 "$JTL_FILE" | awk -F',' '$8 == "false" {count++} END {print count+0}')

  if [ "$TOTAL" -gt 0 ]; then
    ERROR_PCT=$(awk "BEGIN {printf \"%.2f\", ($ERRORS / $TOTAL) * 100}")
    echo "  Total muestras: $TOTAL"
    echo "  Errores:        $ERRORS ($ERROR_PCT%)"

    if awk "BEGIN {exit ($ERROR_PCT >= 1.0)}"; then
      echo "  [OK] Tasa de error por debajo del umbral (< 1%)"
    else
      echo "  [ADVERTENCIA] Tasa de error supera el 1% — revisar resultados"
      EXIT_CODE=1
    fi
  fi

  echo ""
  echo "Reporte HTML generado en:"
  echo "  $REPORT_DIR/index.html"
fi

echo ""
echo "========================================================"
echo "  Resultados guardados en: results/$TIMESTAMP/"
echo "  Reporte HTML en:         reports/$TIMESTAMP/"
echo "========================================================"

exit $EXIT_CODE
