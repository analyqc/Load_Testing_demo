---
name: Postman es fuente de verdad para bodies de samplers
description: Cuando hay discrepancia entre el body del JMX y el de Postman, el Postman siempre gana
type: feedback
---

El body del sampler en el JMX debe coincidir exactamente con la request de Postman, campo por campo.

**Why:** El usuario actualiza manualmente las requests en Postman para reflejar la API real. El JMX puede quedar desactualizado. La coleccion Postman es la fuente de verdad del contrato de API.

**How to apply:** Al crear o revisar cualquier sampler POST/PUT/PATCH, siempre comparar contra la request equivalente en `docs/Policysense.postman_collection.json`. Si hay diferencias, el JMX se corrige para que coincida con Postman, no al reves.

Patron de correccion aplicado (RatingService BasicAnnualPremiumForAllCoverage):
- Postman: 5 campos camelCase simples — productCode (string), lob (string), effectiveDate (string), insuredAge (int), coverageAmount (int)
- JMX anterior: 15+ campos PascalCase con estructura anidada (Roles, ParticularData, etc.) que no existian en Postman
- Accion: reemplazar body completo del JMX con los 5 campos del Postman, usando ${variable} para los dinamicos
- Strings llevan comillas en el JSON: "${product_code}" — ints no: ${insured_age}
- Actualizar CSVDataSet variableNames y el CSV en paralelo con las nuevas columnas
