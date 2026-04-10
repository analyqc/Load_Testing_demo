---
name: Patrones XML JMeter validados para Policysense.jmx
description: Patrones de assertions, ThreadGroup control y estructura XML que funcionan en JMeter 5.6.3
type: reference
---

## Patron assertions obligatorias por sampler (3 assertions)

```xml
<!-- 1. HTTP 2xx con regex -->
<ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="Assert - HTTP 2xx">
  <collectionProp name="Asserion.test_strings">
    <stringProp name="49586">2\d\d</stringProp>
  </collectionProp>
  <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
  <intProp name="Assertion.test_type">1</intProp>  <!-- 1 = contiene / matches -->
</ResponseAssertion>
<hashTree/>

<!-- 2. DurationAssertion segun SLA del modulo -->
<DurationAssertion guiclass="DurationAssertionGui" testclass="DurationAssertion" testname="SLA - Max Xms">
  <stringProp name="DurationAssertion.duration">2000</stringProp>
</DurationAssertion>
<hashTree/>

<!-- 3. Assert sin error (invertida) -->
<ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="Assert - Sin errores">
  <collectionProp name="Asserion.test_strings">
    <stringProp name="49587">(?i)(error|exception|stacktrace)</stringProp>
  </collectionProp>
  <stringProp name="Assertion.test_field">Assertion.response_data</stringProp>
  <intProp name="Assertion.test_type">1</intProp>
  <boolProp name="Assertion.not">true</boolProp>
</ResponseAssertion>
<hashTree/>
```

## Control groupToRun por ThreadGroup

```xml
<stringProp name="ThreadGroup.num_threads">${__groovy(def g=props.get("groupToRun","ALL");(g=="ALL"||g=="XX_NombreGrupo")?props.get("users","5").toInteger():0,)}</stringProp>
```

Nombres de grupo que coinciden con el valor de groupToRun:
- 01_Policy_Admin, 02_Claims, 03_Billing, 04_Sales, 05_Distribution
- 06_User_Management, 07_Products, 08_Reinsurance, 09_Portal_Reinsurance
- 10_Portal_Self_Service, 11_User_Center, 12_Field_Service, 13_Feedback, 14_Settings

## HTTP Defaults por ThreadGroup (patron)

Cada TG tiene su propio ConfigTestElement con el host especifico:
```xml
<ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="Defaults NombreModulo">
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments">
    <collectionProp name="Arguments.arguments"/>
  </elementProp>
  <stringProp name="HTTPSampler.domain">${modulo_host}</stringProp>
  <stringProp name="HTTPSampler.port">443</stringProp>
  <stringProp name="HTTPSampler.protocol">https</stringProp>
  <stringProp name="HTTPSampler.connect_timeout">5000</stringProp>
  <stringProp name="HTTPSampler.response_timeout">10000</stringProp>
</ConfigTestElement>
<hashTree/>
```

## SetUp OAuth (patron)

- SetupThreadGroup con guiclass="SetupThreadGroupGui" testclass="SetupThreadGroup"
- 1 hilo, 1 loop, on_sample_error=stoptest
- Header interno: Content-Type: application/x-www-form-urlencoded (SOLO para OAuth)
- JSONPathExtractor + JSR223PostProcessor (groovy): props.put("access_token", vars.get("access_token"))
- Header Global separado (fuera del SetUp) con Bearer ${__P(access_token,TEST_TOKEN)}

## SLAs por modulo

| Modulo          | SLA ms |
|-----------------|--------|
| Policy Admin    | 2000   |
| Claims          | 2000   |
| Billing         | 2000   |
| Sales           | 1500   |
| Distribution    | 1500   |
| User Management | 3000   |
| Products        | 3000   |
| Reinsurance     | 3000   |
| Portal Reins.   | 3000   |
| Portal Self Svc | 3000   |
| User Center     | 3000   |
| Field Service   | 3000   |
| Feedback        | 3000   |
| Settings        | 3000   |

## Intprop test_type valores

- 1 = Substring (contiene) / con regex flag se comporta como match
- 2 = Contains (substring sin regex)
- 8 = Equals

## Body POST (postBodyRaw=true)

Para POST con JSON, usar:
```xml
<boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
<elementProp name="HTTPsampler.Arguments" elementType="Arguments">
  <collectionProp name="Arguments.arguments">
    <elementProp name="" elementType="HTTPArgument">
      <stringProp name="Argument.value">{"key":"value"}</stringProp>
      <stringProp name="Argument.metadata">=</stringProp>
    </elementProp>
  </collectionProp>
</elementProp>
```

## Path params: usar valor fijo en el path

Ej: /GetByChannel/{id} -> /GetByChannel/1 o /GetByChannel/DC-001
NO usar variables de path en el path string con {}, solo en query params.

## Rating Service - Schema de respuesta real (OpenAPI verificado)

Endpoint: POST /rest/ratingservice/v1/Risk/BasicAnnualPremiumForAllCoverage
Respuesta: siempre HTTP 200 (no 201), devuelve objeto Risk con campo raiz **AnnualPremium** (number).
Array de coberturas calculadas: **CalculatedCoverages** (cada elemento tiene AnnualPremium propio).
Assertion de negocio validada: ResponseAssertion CONTAINS `"AnnualPremium"` sobre response_data (test_type 2).

## CSVDataSet - patron para Rating

```xml
<CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV - Rating Data" enabled="true">
  <stringProp name="filename">data/rating_data.csv</stringProp>
  <stringProp name="variableNames">productCode,lob,insuredAge,coverageAmount,effectiveDate</stringProp>
  <boolProp name="ignoreFirstLine">true</boolProp>
  <stringProp name="delimiter">,</stringProp>
  <boolProp name="recycle">true</boolProp>
  <boolProp name="stopThread">false</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp>
</CSVDataSet>
<hashTree/>
```

El CSVDataSet debe colocarse ANTES del HTTPSamplerProxy (hermano, no hijo).
Body con variables: {"productCode":"${productCode}","lob":"${lob}","effectiveDate":"${effectiveDate}","insuredAge":${insuredAge},"coverageAmount":${coverageAmount}}
Nota: insuredAge y coverageAmount son numericos (sin comillas).
