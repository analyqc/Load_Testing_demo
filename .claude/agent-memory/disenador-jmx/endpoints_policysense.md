---
name: Endpoints reales Policysense por microservicio
description: Hosts y rutas reales extraidos del OpenAPI de Policysense para cada modulo
type: reference
---

## Hosts por modulo (todos puerto 443 HTTPS)

| Variable JMX       | Host                                              |
|--------------------|---------------------------------------------------|
| auth_host          | sales.v1130.policysense.solutions                 |
| billing_host       | billing.v1130.policysense.solutions               |
| claims_host        | claims.v1130.policysense.solutions                |
| distribution_host  | distributionchannels.v1130.policysense.solutions  |
| policyadmin_host   | policyadmin.testview.policysense.solutions        |
| product_host       | product.v1130.policysense.solutions               |
| reinsurance_host   | reinsurance.v1130.policysense.solutions           |
| settings_host      | settings.v1130.policysense.solutions              |
| usermgmt_host      | usermanagement.v1130.policysense.solutions        |
| portal_host        | portal.v1130.policysense.solutions                |
| smc_host           | smc.v1130.policysense.solutions                   |

## OAuth
- POST https://${auth_host}/oauth/v2/token
- Body: grant_type=password&username=MxAdmin&password=Admin_123&client_id=policysense
- Extractor JSONPath: $.access_token -> access_token
- JSR223 Groovy: props.put("access_token", vars.get("access_token"))

## Prefijos de ruta por servicio
- RatingService: /rest/ratingservice/v1
- PolicyAdminService: /rest/policyadminservice/v1
- UnderwritingService: /rest/underwritingservice/v1
- BusinessRules: /rest/businessrules/v1
- Billing: /rest/billing/v1
- FNOL: /rest/fnol/v1
- DistributionChannelService: /rest/distributionchannelservice/v1
- CommisionAccount: /rest/commisionaccount/v1
- Integrations: /rest/integrations/v1
- OpportunityService: /rest/opportunityservice/v1
- BrokerService: /rest/brokerservice/v1
- Reinsurance: /rest/reinsurance/v1
- InsuranceCompanyService: /rest/insurancecompanyservice/v1
- ProductService: /rest/product/v1
- CoverageService: /rest/coverageservice/v1
- UserManagementServices: /rest/usermanagementservices/v1
- SecureMessageCenter: /rest/securemessagecenter/v1
- Data (Portal): /rest/data/v1
- SystemSetting: /rest/systemsetting/v1
- ExchangeRateService: /rest/exchangerateservice/v1
- BankService: /rest/bankservice/v1
