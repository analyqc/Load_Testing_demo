# POST /Risk/BasicAnnualPremiumForAllCoverage

**Modulo:** Policy Admin — RatingService
**Estado JMeter:** Automatizado | **ThreadGroup:** 01 - Policy Admin
**Fecha automatizacion:** preexistente

---

## Descripcion de negocio

Calcula la prima anual basica para todas las coberturas de un unico riesgo/asegurado. Es el primer paso del flujo de tarificacion en cotizaciones de seguro de vida individual. Devuelve el desglose por cobertura, frecuencias de pago y detalles del riesgo calculado.

---

## Request

| Campo | Valor |
|-------|-------|
| Metodo | POST |
| URL | `https://policyadmin.testview.policysense.solutions/rest/ratingservice/v1/Risk/BasicAnnualPremiumForAllCoverage` |
| Autenticacion | Basic Auth — `Authorization: Basic ${__P(auth_basic_token,TXhBZG1pbjpBZG1pbl8xMjM=)}` |
| Content-Type | application/json |

### Body de ejemplo
```json
{
  "productCode": "VIDA-001",
  "lob": "LIFE",
  "insuredAge": 35
}
```

### Parametros del body

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| productCode | string | Si | Codigo del producto de seguro (ej: VIDA-001) |
| lob | string | Si | Linea de negocio (LIFE, HEALTH) |
| insuredAge | integer | Si | Edad del asegurado en anos |

---

## Response esperado

- **HTTP:** 200 OK
- **Campos clave:** `AnnualPremium`, `BasicAnnualPremium`, `CalculatedCoverages`, `GrossPremiumByFrequencies`, `LineOfBusinessCode`, `InsuranceDurationUnit`

---

## Prerrequisitos

Ninguno. Llamada independiente (stateless).

## Postcondiciones

Ninguna. Solo lectura / calculo.

---

## Configuracion JMeter

| Parametro | Valor |
|-----------|-------|
| IfController testname | `POST Rating BasicAnnualPremiumForAllCoverage` |
| requestToRun key | `POST Rating BasicAnnualPremiumForAllCoverage` |
| SLA property | `${__P(rating_max_duration,5000)}` |
| CSV | `data/rating_data.csv` |
| Variables CSV | `lob_code`, `product_code`, `sum_insured` |
