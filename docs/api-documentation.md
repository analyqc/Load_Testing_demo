# Documentación de APIs Automatizadas — Policysense
Última actualización: 2026-04-10 | Ambiente: QA (v1130 / testview)

> Registro detallado de cada API automatizada en JMeter, con análisis de assertions,
> variantes de datos y consideraciones de rendimiento.
> Se actualiza cada vez que se automatiza un nuevo endpoint.

## Índice

| # | API | Módulo | Microservicio | Prioridad | Sprint | Estado JMX |
|---|-----|--------|--------------|-----------|--------|-----------|
| 01 | POST /Risk/BasicAnnualPremiumForAllCoverage | Policy Admin | RatingService | ALTA | 1 | ✅ Automatizado |

---

## [01] POST /Risk/BasicAnnualPremiumForAllCoverage

### Identificación
- **Módulo:** Policy Admin
- **Microservicio:** RatingService
- **Host QA:** `https://policyadmin.testview.policysense.solutions`
- **Path base:** `/rest/ratingservice/v1`
- **Path completo:** `/rest/ratingservice/v1/Risk/BasicAnnualPremiumForAllCoverage`
- **ThreadGroup JMX:** `01 - Policy Admin`
- **Posición en TG:** Primer sampler (es el más crítico del módulo)

### Descripción de negocio
Calcula las **primas anuales básicas y capitales para todas las coberturas** parametrizadas en el diseñador de productos, dado un riesgo específico. Este es el motor de tarificación (Rating Engine) de Policysense.

> Fuente OpenAPI: *"Realiza el cálculo de las coberturas (capitales y primas anuales) parametrizadas en el diseñador de productos, por defecto. Si se informan coberturas, las mismas se recalculan respetando los datos ingresados. No se calculan los importes, según frecuencia, a facturar."*

**Rol en el flujo de negocio:**
```
Prospecto (Lead) → Cotización → [ESTE ENDPOINT] → Presentar opciones al cliente → Selección → Emisión póliza
```

Es el endpoint de **mayor criticidad comercial** en Policy Admin porque:
- Se invoca en cada cotización (múltiples veces por prospecto)
- Es CPU-intensivo (cálculos actuariales en tiempo real)
- Su latencia impacta directamente la experiencia del agente/broker
- Sin respuesta correcta, el flujo de cotización no avanza

---

### Schema del Request Body — objeto `Risk`

El endpoint acepta `application/json` o `application/xml`. El body es un único objeto `Risk` con los siguientes campos:

#### Campos de identificación del riesgo (input principal)

| Campo | Tipo | Requerido | Descripción | Valores de ejemplo |
|-------|------|:---------:|-------------|-------------------|
| `LineOfBusinessCode` | integer (int32) | ✅ | Código del ramo (Line of Business) | `1`, `2`, `3` |
| `ProductCode` | integer (int32) | ✅ | Código del producto en Policysense | `101`, `202`, `305` |
| `CalculationDate` | string (date-time) | ⬜ | Fecha de cálculo; si no se envía, usa fecha actual | `2026-01-01T00:00:00Z` |
| `EffectiveDate` | string (date-time) | ✅ | Fecha de inicio de vigencia de la póliza | `2026-01-01T00:00:00Z` |
| `ExpirationDate` | string (date-time) | ⬜ | Fecha de fin de vigencia | `2027-01-01T00:00:00Z` |
| `OriginalEffectiveDate` | string (date-time) | ⬜ | Fecha efectiva original (renovaciones/endosos) | `2025-01-01T00:00:00Z` |
| `SumInsured` | number | ✅ | Capital asegurado total del riesgo | `50000`, `100000`, `500000` |
| `SumInsuredAccumulationOfRisk` | number | ⬜ | Capital acumulado para acumulación de riesgos | `100000` |
| `SumInsuredTaxes` | number | ⬜ | Capital asegurado incluyendo impuestos | `55000` |
| `AnnualPremium` | number | ⬜ | Prima anual (campo de respuesta; puede enviarse para recalcular) | — |
| `ParticularData` | string | ⬜ | Datos particulares adicionales del riesgo (JSON libre) | `"{}"` |
| `InsuranceDuration` | integer (int32) | ⬜ | Duración de la cobertura en la unidad indicada | `1`, `12`, `365` |
| `InsuranceDurationUnit` | enum (string) | ⬜ | Unidad de duración del seguro | `Hours`, `Days`, `Months`, `Years`, `AttainedAge`, `WholeLife` |
| `ShortTermCalculationOption` | enum (string) | ⬜ | Método de cálculo de prima para pólizas de corto plazo | `Prorated`, `ShortTermFactor` |
| `OpportunityId` | integer (int64) | ⬜ | ID de oportunidad/cotización en CRM | `1001`, `2045` |
| `ExecutionTime` | number | ⬜ | Tiempo de ejecución del cálculo (campo de respuesta) | — |
| `FirstAdditionalInformation` | string | ⬜ | Información adicional libre #1 | `"free text"` |
| `SecondAdditionalInformation` | string | ⬜ | Información adicional libre #2 | `"free text"` |

#### Sub-objeto: `Roles[]` (asegurados/roles del riesgo)

Define las personas aseguradas y sus características actuariales. Crítico para el cálculo de primas de vida y salud.

| Campo | Tipo | Descripción | Valores de ejemplo |
|-------|------|-------------|-------------------|
| `ClientRoleCode` | integer (int32) | Código del rol del cliente (ej: titular, cónyuge, hijo) | `1`, `2`, `3` |
| `BirthDate` | string (date-time) | Fecha de nacimiento del asegurado | `1990-03-15T00:00:00Z` |
| `GenderCode` | integer (int32) | Código de género (parametrizable en Policysense) | `1` = Masculino, `2` = Femenino |
| `IsSmoker` | boolean | Indica si el asegurado es fumador (impacta la prima) | `false`, `true` |
| `RecGUID` | string | GUID identificador del registro | `"550e8400-e29b-41d4-a716..."` |
| `ClientId` | string | ID del cliente en el sistema | `"CLIENT-001"` |

#### Sub-objeto: `CalculatedCoverages[]` (coberturas — entrada opcional / salida enriquecida)

Si se envían coberturas, se recalculan respetando los datos ingresados. La respuesta devuelve todas las coberturas calculadas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `CoverageCode` | integer (int32) | Código de cobertura parametrizado en el producto |
| `CoverageDescription` | string | Descripción de la cobertura |
| `ClientRoleCode` | integer (int32) | Rol al que aplica la cobertura |
| `UseOfCoverage` | enum | `Basic`, `Complementary`, `Both` |
| `IsRequired` | boolean | Indica si la cobertura es obligatoria |
| `IsSelectedByDefault` | boolean | Seleccionada por defecto al cotizar |
| `IsSelected` | boolean | Si el cliente/agente la seleccionó |
| `SumInsured` | number | Capital asegurado de esta cobertura |
| `Rate` | number | Tasa aplicada al cálculo |
| `TypeOfCoefficient` | enum | Tipo de coeficiente: `Percentage`, `Pormilage`, `Multiplier` |
| `AnnualPremium` | number | **Prima anual calculada para esta cobertura** |
| `DailyLimitAmount` | number | Monto límite diario (coberturas de gastos médicos) |
| `DeductibleOption` | enum | Tipo de deducible: `Franchise`, `Deductible`, `None` |
| `DeductiblePercentageOrAmount` | number | Porcentaje o monto del deducible |
| `AnnualExtraPremium` | number | Extra prima anual aplicada |
| `ManualPremiumAction` | enum | `Calculate_Rate`, `No_Rate` |
| `VariationIDSelected` | integer (int32) | ID de variación seleccionada |
| `RecGUID` | string | GUID del registro de cobertura |
| `ClientId` | string | ID del cliente asociado |

---

### Schema de la Respuesta (HTTP 200)

La respuesta es el mismo objeto `Risk` enriquecido con los resultados del cálculo:

#### Campos clave de respuesta en el objeto `Risk`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `AnnualPremium` | **number** | **Prima anual total del riesgo — campo principal de resultado** |
| `SumInsured` | number | Capital asegurado consolidado |
| `SumInsuredAccumulationOfRisk` | number | Capital acumulado calculado |
| `SumInsuredTaxes` | number | Capital con impuestos calculado |
| `ExecutionTime` | number | Tiempo que tomó el cálculo en el servidor |
| `CalculatedCoverages[]` | array | Array de coberturas con primas y capitales calculados por cobertura |
| `ModuleRisks[]` | array | Riesgos agrupados por módulo de producto (si aplica) |
| `InsuredAmountComponentRisks[]` | array | Componentes del capital asegurado desglosados |

#### Campos clave dentro de cada `CalculatedCoverage` (respuesta)

| Campo | Descripción |
|-------|-------------|
| `AnnualPremium` | Prima anual de esta cobertura específica |
| `SumInsured` | Capital asegurado de la cobertura |
| `Rate` | Tasa aplicada |
| `AnnualExtraPremium` | Extra prima aplicada |
| `IsRequired` | Si la cobertura es obligatoria en el producto |
| `CoverageSelectionHelpers[]` | Ayudas para selección de coberturas (UI) |
| `DeductibleSettings[]` | Opciones de deducibles disponibles |
| `FixedInsuredAmountByPossibleValues[]` | Capitales fijos disponibles para selección |

#### Códigos de respuesta HTTP

| Código | Significado |
|--------|-------------|
| `200` | Cálculo exitoso — devuelve objeto `Risk` con primas calculadas |
| `401` | No autorizado — token JWT inválido o expirado |

---

### Request Body de ejemplo (mínimo viable)

```json
{
  "LineOfBusinessCode": 1,
  "ProductCode": 101,
  "EffectiveDate": "2026-01-01T00:00:00Z",
  "SumInsured": 100000,
  "InsuranceDuration": 1,
  "InsuranceDurationUnit": "Years",
  "Roles": [
    {
      "ClientRoleCode": 1,
      "BirthDate": "1990-03-15T00:00:00Z",
      "GenderCode": 1,
      "IsSmoker": false
    }
  ]
}
```

---

### Assertions implementadas en JMeter

| # | Tipo | Configuración | Propósito |
|---|------|--------------|---------|
| 1 | ResponseAssertion | HTTP 200 (EQUALS) | Confirma éxito del cálculo |
| 2 | DurationAssertion | 2000ms máximo | SLA de Policy Admin |
| 3 | ResponseAssertion (NOT) | sin `error`/`exception`/`stacktrace` en body | Sin errores de servidor |
| 4 | ResponseAssertion (CONTAINS) | `"AnnualPremium"` en body | Confirma que retornó prima calculada |

---

### Variantes de datos para prueba de carga (`data/rating_data.csv`)

Los campos del CSV mapean directamente a los campos del objeto `Risk` del OpenAPI real.

| # | LineOfBusinessCode | ProductCode | EffectiveDate | SumInsured | InsuranceDuration | InsuranceDurationUnit | Role_BirthDate | Role_GenderCode | Role_IsSmoker | Propósito |
|---|-------------------|------------|--------------|------------|-------------------|-----------------------|----------------|-----------------|--------------|---------|
| 1 | 1 | 101 | 2026-01-01T00:00:00Z | 50000 | 1 | Years | 2001-01-01T00:00:00Z | 1 | false | Asegurado joven (25 años), cobertura baja |
| 2 | 1 | 101 | 2026-01-01T00:00:00Z | 100000 | 1 | Years | 1991-01-01T00:00:00Z | 1 | false | Asegurado adulto (35 años), cobertura media |
| 3 | 1 | 101 | 2026-01-01T00:00:00Z | 250000 | 1 | Years | 1981-01-01T00:00:00Z | 2 | false | Asegurado adulto (45 años), cobertura alta |
| 4 | 1 | 101 | 2026-01-01T00:00:00Z | 500000 | 1 | Years | 1971-01-01T00:00:00Z | 1 | false | Asegurado mayor (55 años), cobertura muy alta |
| 5 | 1 | 101 | 2026-01-01T00:00:00Z | 100000 | 1 | Years | 1961-01-01T00:00:00Z | 2 | false | Asegurado senior (65 años) — mayor carga actuarial |
| 6 | 1 | 101 | 2026-01-01T00:00:00Z | 75000 | 1 | Years | 1996-01-01T00:00:00Z | 1 | true | Joven fumador (30 años) — extra prima por hábito |
| 7 | 1 | 101 | 2026-06-01T00:00:00Z | 150000 | 1 | Years | 1986-01-01T00:00:00Z | 2 | false | Fecha efectiva diferente, adulto 40 años |
| 8 | 1 | 101 | 2026-06-01T00:00:00Z | 300000 | 1 | Years | 1976-01-01T00:00:00Z | 1 | true | Alta cobertura, adulto mayor fumador |

> **Nota:** Los valores de `LineOfBusinessCode` y `ProductCode` deben validarse contra los códigos reales configurados en el ambiente QA de Policysense antes de ejecutar las pruebas.

---

### Escenarios de prueba de carga

| Escenario | Usuarios | RampUp | Loop | Objetivo | SLA |
|-----------|---------|--------|------|---------|-----|
| Carga base | 5 | 10s | 3 | Verificar funcionamiento | 2000ms |
| Carga normal | 20 | 30s | 5 | Carga típica día laboral | 2000ms |
| Carga pico | 50 | 60s | 10 | Pico campaña comercial | 3000ms |
| Stress test | 100 | 120s | 20 | Límite del sistema | 5000ms |
| Endurance | 10 | 10s | 100 | Estabilidad en el tiempo | 2000ms |

---

### Consideraciones de rendimiento

- **Tipo de operación:** CPU-intensiva (motor actuarial en memoria con reglas parametrizadas)
- **Patrón de carga real:** Ráfagas cortas (múltiples cotizaciones simultáneas de agentes y brokers)
- **Bottleneck probable:** Procesador del servidor PolicyAdmin bajo alta concurrencia
- **Campos que más impactan el tiempo de respuesta:**
  - `InsuranceDurationUnit: WholeLife` → mayor complejidad actuarial de largo plazo
  - `IsSmoker: true` → activa tablas de mortalidad diferenciadas
  - Muchas coberturas en `CalculatedCoverages[]` → mayor iteración en el motor
  - `SumInsured` alto + edad avanzada → cálculos de reserva más complejos
- **Recomendación de monitoreo:** CPU del servidor + memoria JVM + tiempo de respuesta P95 durante el test
- **Diferencia con endpoint hermano:** `GrossAllModalPremiumForAllCoverages` calcula además los importes a facturar por frecuencia de pago — es más costoso computacionalmente.

---

### Estado de automatización
- ✅ Automatizado en JMX: `Policysense.jmx` → TG `01 - Policy Admin`
- ✅ CSV de datos: `data/rating_data.csv`
- ✅ 4 assertions implementadas
- ✅ Schema validado contra OpenAPI real: `https://policyadmin.testview.policysense.solutions/rest-doc/rest/ratingservice/v1/openapi.json`
- 📅 Sprint: 1 | Fecha: 2026-04-10
