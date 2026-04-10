---
name: rating_response_structure
description: Estructura del response real de POST BasicAnnualPremiumForAllCoverage para assertions
type: project
---
# Response real Rating API - campos para assertions

Endpoint: POST /rest/ratingservice/v1/Risk/BasicAnnualPremiumForAllCoverage
Host: policyadmin.testview.policysense.solutions
Auth: Basic TXhBZG1pbjpBZG1pbl8xMjM=

## Campos clave del response (verificados con datos reales)
- "LineOfBusinessCode": integer (ej: 11)
- "ProductCode": integer (ej: 4)
- "AnnualPremium": decimal (ej: 247.24) — varía por CSV row
- "InsuranceDurationUnit": "Years"
- "CalculatedCoverages": array de 5 coberturas con campos ClientRoleCode, CoverageCode, CoverageDescription, IsRequired, IsSelectedByDefault, IsSelected, SumInsured, Rate, TypeOfCoefficient, AnnualPremium, VariationIDSelected
- "GrossPremiumByFrequencies": array de 3 frecuencias (PaymentFrequencyCode: 1=Anual, 2=Semestral, 3=Trimestral) con campos Hash, CalculationOption, DataOption — SÍ tiene BasicAnnualPremium y GrossAnnualPremium en el response del request original (row 1), pero en el response de la segunda fila (Dog, Female, sum_insured=1500) solo contiene Hash + PaymentFrequencyCode
- "Roles": array con BirthDate, GenderCode, IsSmoker
- "ReturnValueOptionList": true

## Assertions correctas (test_type=16 SUBSTRING)
- "AnnualPremium": — prima calculada presente
- "LineOfBusinessCode":11 — LOB correcto
- "CoverageDescription": — coberturas calculadas
- "IsSelected":true — al menos una cobertura seleccionada
- "PaymentFrequencyCode":1 — frecuencia anual presente
- "InsuranceDurationUnit":"Years" — duración anual

## IMPORTANTE
En el response de la segunda fila del CSV (Dog, Female, sum_insured=1500), GrossPremiumByFrequencies
NO contiene BasicAnnualPremium/GrossAnnualPremium en el nivel superior del objeto frecuencia.
Solo tiene Hash + PaymentFrequencyCode + CalculationOption + DataOption.
No hacer assertions sobre BasicAnnualPremium dentro de GrossPremiumByFrequencies para este caso.

## Assertions implementadas en Policysense.jmx (TG01 Rating)
Las 4 assertions de contenido anteriores (test_type=2, XML tags) fueron reemplazadas
por 6 assertions precisas (test_type=16 SUBSTRING JSON) el 2026-04-10:
1. Assert - HTTP 200 (response_code, test_type=8)
2. SLA - Max 2000ms (DurationAssertion)
3. Assert - Sin errores (NOT regex, test_type=2)
4. Assert - AnnualPremium calculado
5. Assert - LineOfBusinessCode presente
6. Assert - CalculatedCoverages tiene coberturas
7. Assert - Cobertura principal seleccionada
8. Assert - GrossPremiumByFrequencies presente
9. Assert - InsuranceDurationUnit Years
