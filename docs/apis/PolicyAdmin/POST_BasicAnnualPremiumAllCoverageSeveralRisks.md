# POST /Risk/BasicAnnualPremiumAllCoverageSeveralRisks

**Modulo:** Policy Admin — RatingService
**Estado JMeter:** Automatizado | **ThreadGroup:** 01 - Policy Admin
**Fecha automatizacion:** 2026-04-13 | **Commit:** 3c6c82b

---

## Descripcion de negocio

Calcula la prima anual basica para todas las coberturas de multiples riesgos/asegurados en una sola llamada. Se usa en cotizaciones de polizas grupales o familiares donde hay mas de un asegurado (ej: seguro de vida familiar, poliza colectiva). Es el primer paso de tarificacion multiasegurado antes de construir la oferta comercial para el cliente.

---

## Request

| Campo | Valor |
|-------|-------|
| Metodo | POST |
| URL | `https://policyadmin.testview.policysense.solutions/rest/ratingservice/v1/Risk/BasicAnnualPremiumAllCoverageSeveralRisks` |
| Autenticacion | Basic Auth — `Authorization: Basic ${__P(auth_basic_token,TXhBZG1pbjpBZG1pbl8xMjM=)}` |
| Content-Type | application/json |

### Body de ejemplo
```json
{
  "risks": [
    { "productCode": "VIDA-001", "lob": "LIFE", "insuredAge": 35 },
    { "productCode": "VIDA-001", "lob": "LIFE", "insuredAge": 40 }
  ]
}
```

### Parametros del body

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| risks | array | Si | Lista de riesgos a tarifar (minimo 1 elemento) |
| risks[].productCode | string | Si | Codigo del producto (ej: VIDA-001) |
| risks[].lob | string | Si | Linea de negocio (LIFE, HEALTH) |
| risks[].insuredAge | integer | Si | Edad del asegurado en anos |

---

## Response esperado

- **HTTP:** 200 OK
- **Campos clave:** `AnnualPremium`, `BasicAnnualPremium`, `CalculatedCoverages`, `GrossPremiumByFrequencies`
- La respuesta contiene un resultado por cada riesgo enviado en el array.

---

## Prerrequisitos

Ninguno. Llamada independiente (stateless).

## Postcondiciones

Ninguna. Solo lectura / calculo.

---

## Configuracion JMeter

| Parametro | Valor |
|-----------|-------|
| IfController testname | `POST BasicAnnualPremiumAllCoverageSeveralRisks` |
| requestToRun key | `POST BasicAnnualPremiumAllCoverageSeveralRisks` |
| SLA property | `${__P(sla_rating_several,3000)}` |
| CSV | `data/rating_several_risks_data.csv` |
| Variables CSV | `rating_several_product_code`, `rating_several_lob`, `rating_several_age1`, `rating_several_age2` |
