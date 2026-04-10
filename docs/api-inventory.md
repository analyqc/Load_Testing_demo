# Inventario de APIs Policysense

Fecha: 2026-04-09 | Version: v1130 / testview | Total endpoints: 251 | Fuente: OpenAPI JSON via `/rest-doc/rest/{service}/v1/openapi.json`

---

## Resumen ejecutivo

| Modulo | Host | Servicios | Total Endpoints | Alta Prio | Automatizados JMX | Sin automatizar |
|--------|------|-----------|----------------|-----------|-------------------|----------------|
| Policy Admin | policyadmin.testview | 11 | 61 | 38 | 3 | 58 |
| Facturacion y Cobranza | billing.v1130 | 2 | 6 | 4 | 2 | 4 |
| Siniestros | claims.v1130 | 2 | 4 | 2 | 3 | 1 |
| Distribution Management | distributionchannels.v1130 | 4 | 100 | 45 | 3 | 97 |
| Ventas | sales.v1130 | 4 | 41 | 18 | 3 | 38 |
| Reaseguro | reinsurance.v1130 | 3 | 8 | 5 | 4 | 4 |
| Productos | product.v1130 | 4 | 11 | 6 | 3 | 8 |
| Admin Usuarios | usermanagement.v1130 | 2 | 4 | 3 | 4 | 0 |
| Servicio de Campo (SMC) | smc.v1130 | 2 | 3 | 2 | 2 | 1 |
| Portal Autoservicio | portal.v1130 | 1 | 2 | 1 | 2 | 0 |
| Configuracion | settings.v1130 | 5 | 11 | 2 | 2 | 9 |
| **Totales** | **11 hosts** | **40** | **251** | **126** | **31** | **220** |

> **Cobertura actual**: 31 samplers JMX de 251 endpoints reales = **12.4%**. Oportunidad de automatizar 220 endpoints adicionales.

---

## Por modulo

### Policy Admin -- policyadmin.testview.policysense.solutions

#### RatingService -- /rest/ratingservice/v1
Descripcion: Calculo de capitales y primas de coberturas de un riesgo

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /Risk/BasicAnnualPremiumForAllCoverage | Calculo de primas anuales por cobertura | ALTA | No | -- | 2000 |
| 2 | POST | /Risk/GrossAllModalPremiumForAllCoverages | Calculo importes a facturar por frecuencia | ALTA | No | -- | 2000 |
| 3 | POST | /Risk/GrossModalPremiumForSelectedCoverages | Importes a facturar coberturas seleccionadas | ALTA | No | -- | 2000 |
| 4 | POST | /Risk/BasicAnnualPremiumAllCoverageSeveralRisks | Primas anuales para multiples riesgos | ALTA | No | -- | 2000 |
| 5 | GET | /Risk/PolicyInformation | Info de poliza (OfficialPolicyNumber, EffectiveDate) | MEDIA | No | -- | 2000 |
| 6 | GET | /RiskString | Procesar cadena de riesgo | BAJA | No | -- | 2000 |

#### PolicyAdminService -- /rest/policyadmin/v1
Descripcion: The Sales API - Gestion de cotizaciones, solicitudes y polizas

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /quotation/all | Listar todas las cotizaciones (paginado) | ALTA | Si | TG01 | 2000 |
| 2 | DELETE | /quotation/all | Eliminar todas las cotizaciones (key) | BAJA | No | -- | 2000 |
| 3 | GET | /quotation | Obtener cotizacion por QuotationId | ALTA | Si | TG01 | 2000 |
| 4 | POST | /quotation | Crear cotizacion | ALTA | Si | TG01 | 2000 |
| 5 | PUT | /quotation | Actualizar cotizacion | ALTA | No | -- | 2000 |
| 6 | DELETE | /quotation/delete | Eliminar cotizacion | MEDIA | No | -- | 2000 |
| 7 | GET | /quotation/newid | Generar nuevo ID de cotizacion | MEDIA | No | -- | 2000 |
| 8 | GET | /quotation/allanonynousbyquotation | Cotizaciones anonimas por criterio | MEDIA | No | -- | 2000 |
| 9 | GET | /quotation/allanonymousbyclient | Cotizaciones anonimas por cliente | MEDIA | No | -- | 2000 |
| 10 | GET | /quotation/allbyclient | Cotizaciones por cliente (ClientCode, Email) | ALTA | No | -- | 2000 |
| 11 | GET | /quotation/numberofquotations | Contar cotizaciones por cliente | MEDIA | No | -- | 2000 |
| 12 | GET | /quotation/allbyclientgroupbyproduct | Cotizaciones agrupadas por producto | MEDIA | No | -- | 2000 |
| 13 | GET | /quotation/orphans/count | Contar cotizaciones huerfanas | BAJA | No | -- | 2000 |
| 14 | DELETE | /quotation/orphans | Eliminar cotizaciones huerfanas | BAJA | No | -- | 2000 |
| 15 | POST | /quotation/life | Crear cotizacion vida | ALTA | No | -- | 2000 |
| 16 | PUT | /quotation/life | Actualizar cotizacion vida | ALTA | No | -- | 2000 |
| 17 | GET | /quotation/life/{QuotationId} | Obtener cotizacion vida | ALTA | No | -- | 2000 |
| 18 | GET | /quotation/broker | Cotizaciones/solicitudes/polizas por broker | ALTA | No | -- | 2000 |
| 19 | GET | /quotation/quotationsource | Cotizaciones con documentos fuente | MEDIA | No | -- | 2000 |
| 20 | GET | /quotationclient | Obtener cliente de cotizacion | MEDIA | No | -- | 2000 |
| 21 | GET | /quotationcoverage | Coberturas de una cotizacion | ALTA | No | -- | 2000 |
| 22 | GET | /quotationquantity | Total de cotizaciones | MEDIA | No | -- | 2000 |
| 23 | GET | /quotationquantity/ByDistributionChannel | Cotizaciones por canal de distribucion | MEDIA | No | -- | 2000 |
| 24 | POST | /quotationpdf | Generar PDF de cotizacion | MEDIA | No | -- | 2000 |
| 25 | GET | /quotationpdf | Obtener PDF de cotizacion | MEDIA | No | -- | 2000 |
| 26 | DELETE | /quotationpdf | Eliminar PDF | BAJA | No | -- | 2000 |
| 27 | GET | /quotationpdf/quotationlifepdf/{OfficialQuotationId} | PDF de cotizacion vida | MEDIA | No | -- | 2000 |
| 28 | GET | /quotationclientaddress | Direcciones del cliente | MEDIA | No | -- | 2000 |
| 29 | POST | /quotationclientaddress/save | Guardar direccion | MEDIA | No | -- | 2000 |
| 30 | PUT | /quotationclientaddress/update | Actualizar direccion | MEDIA | No | -- | 2000 |
| 31 | GET | /quotationclientaddress/GetByQuotation | Direcciones por cotizacion | MEDIA | No | -- | 2000 |
| 32 | POST | /insuranceduration | Crear duracion de seguro | MEDIA | No | -- | 2000 |
| 33 | GET | /product | Productos por canal de distribucion | ALTA | No | -- | 2000 |
| 34 | GET | /applicationformat | Formatos de solicitud por producto | MEDIA | No | -- | 2000 |
| 35 | GET | /applicationformat/GetForClientQuotation | Formato de solicitud cliente | MEDIA | No | -- | 2000 |

#### UnderwritingService -- /rest/underwritingservice/v1
Descripcion: Suscripcion y requerimientos de underwriting

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /requirement/getbyclient | Requerimientos por cliente | ALTA | No | -- | 2000 |
| 2 | POST | /requirement | Crear requerimiento de suscripcion | ALTA | No | -- | 2000 |
| 3 | GET | /requirement | Obtener requerimiento por RecGUID | MEDIA | No | -- | 2000 |
| 4 | GET | /requirement/getbycase | Requerimientos por caso | MEDIA | No | -- | 2000 |
| 5 | GET | /requirement/getbyquotation | Requerimientos por cotizacion | MEDIA | No | -- | 2000 |
| 6 | GET | /requirement/getpendingbychannel | Requerimientos pendientes por canal | ALTA | No | -- | 2000 |
| 7 | GET | /requirement/getpendingbytoken | Requerimientos pendientes por token | MEDIA | No | -- | 2000 |
| 8 | POST | /underwritingfiledocument | Subir documento de suscripcion | MEDIA | No | -- | 2000 |
| 9 | GET | /underwritingcase/getbyfilter | Casos de suscripcion filtrados | ALTA | No | -- | 2000 |
| 10 | GET | /Token/validate | Validar token de acceso unico | MEDIA | No | -- | 2000 |

#### Risk -- /rest/risk/v1
Descripcion: Consultar informacion de un riesgo

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /RiskInformation/opportunity/{OpportunityId} | Info de riesgo por oportunidad | ALTA | No | -- | 2000 |
| 2 | GET | /RiskInformation/quotation/{OfficialQuotation} | Info de riesgo por cotizacion | ALTA | No | -- | 2000 |

#### BusinessRules -- /rest/businessrules/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /Evaluate | Evaluar reglas de negocio | ALTA | No | -- | 2000 |
| 2 | GET | /Facts | Lista de hechos de reglas de negocio | MEDIA | No | -- | 2000 |
| 3 | GET | /Rulesets | Lista de paquetes de reglas disponibles | MEDIA | No | -- | 2000 |

#### HealthDeclaration -- /rest/healthdeclaration/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /healthdeclaration | Crear declaracion de salud | ALTA | No | -- | 2000 |
| 2 | GET | /healthdeclaration | Obtener declaracion por RecGUID | MEDIA | No | -- | 2000 |
| 3 | GET | /healthdeclarationpdf | PDF de declaracion de salud | BAJA | No | -- | 2000 |

#### VehicleInformationService -- /rest/vehicleinformationservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /VehicleModelByMake | Modelos de vehiculo por marca | MEDIA | No | -- | 2000 |
| 2 | GET | /VehicleEdition | Ediciones por modelo | MEDIA | No | -- | 2000 |
| 3 | GET | /VehicleValue | Valor del vehiculo | MEDIA | No | -- | 2000 |

#### FleetService -- /rest/fleetservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /Vehicle | Registrar vehiculo en flota | MEDIA | No | -- | 2000 |

#### Projection -- /rest/projection/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /Request | Solicitar proyeccion de vida | MEDIA | No | -- | 2000 |

#### ATS -- /rest/ats/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /quotation/byclient/{clientcode} | Cotizaciones por cliente (ATS) | MEDIA | No | -- | 2000 |
| 2 | DELETE | /AutomaticTesting | Eliminar datos de testing automatico | BAJA | No | -- | 2000 |

---

### Facturacion y Cobranza -- billing.v1130.policysense.solutions

#### Billing -- /rest/billing/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /Bill/BillsByPolicy | Recibos por poliza (PolicyID, EffectiveDate) | ALTA | Si | TG03 | 2000 |
| 2 | GET | /Bill/BillsByClient | Recibos por cliente (ClientID, EffectiveDate) | ALTA | Si | TG03 | 2000 |
| 3 | POST | /BillingOrder/BillingPolicyIssue | Orden de facturacion por emision de poliza | ALTA | No | -- | 2000 |

#### BusinessRules -- /rest/businessrules/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /Evaluate | Evaluar reglas (dias de gracia, mora) | ALTA | No | -- | 2000 |
| 2 | GET | /Facts | Hechos de reglas de facturacion | MEDIA | No | -- | 2000 |
| 3 | GET | /Rulesets | Paquetes de reglas disponibles | MEDIA | No | -- | 2000 |

---

### Siniestros -- claims.v1130.policysense.solutions

#### FNOL (NoticeOfLoss) -- /rest/fnol/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /BasicInformation | Informacion basica de siniestro (NoticeID) | ALTA | Si | TG02 | 2000 |

> Nota: El OpenAPI solo expone 1 endpoint GET. Los POST/PATCH del JMX usan paths genericos que probablemente pasan por un gateway.

#### BusinessRules -- /rest/businessrules/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /Evaluate | Evaluar reglas de validacion de cobertura | ALTA | No | -- | 2000 |
| 2 | GET | /Facts | Hechos de reglas de siniestros | MEDIA | No | -- | 2000 |
| 3 | GET | /Rulesets | Paquetes de reglas disponibles | MEDIA | No | -- | 2000 |

---

### Distribution Management -- distributionchannels.v1130.policysense.solutions

#### DistributionChannelService -- /rest/distributionchannelservice/v1
Descripcion: CRUD completo de canales de distribucion, direcciones, credenciales, prestamos, redes, comisiones

**GET Endpoints:**

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /DistributionChannel | Canal por ID | ALTA | Si | TG05 | 1500 |
| 2 | GET | /DistributionChannel/GetBySyncUserId/{SyncUserId} | Canal por SyncUserId | ALTA | No | -- | 1500 |
| 3 | GET | /DistributionChannel/GetForDistributionChannel_AccessToPortal/{id} | Acceso portal del canal | MEDIA | No | -- | 1500 |
| 4 | GET | /ChannelCurrentAccount/GetByChannel/{id} | Cuenta corriente del canal | ALTA | No | -- | 1500 |
| 5 | GET | /ChannelAuthorizedUser/GetByChannel/{id} | Usuarios autorizados del canal | MEDIA | No | -- | 1500 |
| 6 | GET | /ChannelAuthorizedUser/GetUserSyncIdSeparatedByCommas/{id} | SyncIds de usuarios | BAJA | No | -- | 1500 |
| 7 | GET | /PhysicalAddress/GetByChannel/{id} | Direcciones del canal | MEDIA | No | -- | 1500 |
| 8 | GET | /PhysicalAddress/{DistributionChannelId} | Direccion especifica | MEDIA | No | -- | 1500 |
| 9 | GET | /Credentials/GetByChannel/{id} | Credenciales del canal | MEDIA | No | -- | 1500 |
| 10 | GET | /Credentials | Credenciales por email | MEDIA | No | -- | 1500 |
| 11 | GET | /DistributionChannelHistory/GetByChannel/{id} | Historial del canal | MEDIA | No | -- | 1500 |
| 12 | GET | /EconomicAgreements/GetByChannel/{id} | Acuerdos economicos | ALTA | No | -- | 1500 |
| 13 | GET | /Loans/GetByChannel/{id} | Prestamos del canal (por status) | ALTA | No | -- | 1500 |
| 14 | GET | /Loans/GetByChannelAll/{id} | Todos los prestamos | MEDIA | No | -- | 1500 |
| 15 | GET | /Loans/BalanceForChannel/{id} | Saldo de prestamos | ALTA | No | -- | 1500 |
| 16 | GET | /Loans/GetNewLoan/{id} | Nuevo prestamo | MEDIA | No | -- | 1500 |
| 17 | GET | /Loans/GetById/{LoanId} | Prestamo por ID | MEDIA | No | -- | 1500 |
| 18 | GET | /DistributionNetwork/GetByChannel/{id} | Red de distribucion | ALTA | No | -- | 1500 |
| 19 | GET | /RiskProfessionalPolicies/GetByChannel/{id} | Polizas de riesgo profesional | MEDIA | No | -- | 1500 |
| 20 | GET | /Support/GetByChannel/{id} | Soporte del canal | BAJA | No | -- | 1500 |
| 21 | GET | /Phone/GetByChannel/{id} | Telefonos del canal | MEDIA | No | -- | 1500 |
| 22 | GET | /Phone/{DistributionChannelId} | Telefono especifico | MEDIA | No | -- | 1500 |
| 23 | GET | /NetworkMember/GetByChannel/{id} | Miembros de red | ALTA | No | -- | 1500 |
| 24 | GET | /NetworkMember/GetChildrenOfAFather/{id} | Hijos en jerarquia | MEDIA | No | -- | 1500 |
| 25 | GET | /DistributionChannelContext/GetForDistributionChannel/{AuthUserSyncId} | Contexto del canal | MEDIA | No | -- | 1500 |
| 26 | GET | /DistributionChannelCreationRequest/{Param}/{Other} | Solicitud de creacion | MEDIA | No | -- | 1500 |
| 27 | GET | /ProofOfInsurance | Prueba de seguro por email | MEDIA | No | -- | 1500 |
| 28 | GET | /ProducerLicenseCategory | Categorias de licencia | BAJA | No | -- | 1500 |
| 29 | GET | /InsuranceCompany | Companias de seguros | BAJA | No | -- | 1500 |
| 30 | GET | /CredentialDoc | Documento de credencial | MEDIA | No | -- | 1500 |
| 31 | GET | /ProofOfInsuranceDoc | Documento prueba de seguro | MEDIA | No | -- | 1500 |
| 32 | GET | /DistributionChannelType | Tipos de canal | BAJA | No | -- | 1500 |
| 33 | GET | /AuthorizedUser | Usuarios autorizados por email | ALTA | No | -- | 1500 |
| 34 | GET | /AuthorizedUser/verificationlink/{Param}/{Other} | Enlace verificacion | BAJA | No | -- | 1500 |
| 35 | GET | /DistributionManagementSetting | Config de Distribution Mgmt | BAJA | No | -- | 1500 |
| 36 | GET | /SocialMedia | Redes sociales del canal | BAJA | No | -- | 1500 |
| 37 | GET | /TaskCountForDistributionChannel/{id} | Conteo de tareas | MEDIA | No | -- | 1500 |
| 38 | GET | /ContactPerson | Personas de contacto | MEDIA | No | -- | 1500 |
| 39 | GET | /comission | Comisiones por canal | ALTA | Si | TG05 | 1500 |

**POST Endpoints:**

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 40 | POST | /PhysicalAddress | Crear direccion | MEDIA | No | -- | 1500 |
| 41 | POST | /Credentials | Crear credenciales | ALTA | No | -- | 1500 |
| 42 | POST | /Loans/{UserSyncId} | Crear prestamo | ALTA | No | -- | 1500 |
| 43 | POST | /Loans/CurrencyAndInterestByTypeOfApproval/{id} | Moneda e interes por tipo | MEDIA | No | -- | 1500 |
| 44 | POST | /Loans/TemporalSave/{id} | Guardado temporal prestamo | MEDIA | No | -- | 1500 |
| 45 | POST | /Phone | Agregar telefono | MEDIA | No | -- | 1500 |
| 46 | POST | /DistributionChannelCreationRequest | Crear solicitud canal | ALTA | No | -- | 1500 |
| 47 | POST | /ProofOfInsurance | Crear prueba de seguro | MEDIA | No | -- | 1500 |
| 48 | POST | /CredentialDoc | Subir documento credencial | MEDIA | No | -- | 1500 |
| 49 | POST | /ProofOfInsuranceDoc | Subir doc prueba seguro | MEDIA | No | -- | 1500 |
| 50 | POST | /AuthorizedUser | Registrar usuario autorizado | ALTA | No | -- | 1500 |
| 51 | POST | /SocialMedia | Registrar red social | BAJA | No | -- | 1500 |
| 52 | POST | /ContactPerson | Registrar persona contacto | MEDIA | No | -- | 1500 |
| 53 | POST | /comission | Crear comision | ALTA | No | -- | 1500 |

**PUT Endpoints:**

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 54 | PUT | /DistributionChannel | Actualizar canal | ALTA | No | -- | 1500 |
| 55 | PUT | /PhysicalAddress | Actualizar direccion | MEDIA | No | -- | 1500 |
| 56 | PUT | /Loans | Actualizar prestamo | MEDIA | No | -- | 1500 |
| 57 | PUT | /Phone | Actualizar telefono | MEDIA | No | -- | 1500 |
| 58 | PUT | /DistributionChannelCreationRequest/refresh/{P}/{O} | Reenviar invitacion | BAJA | No | -- | 1500 |
| 59 | PUT | /DistributionChannelCreationRequest/complete/{P}/{O} | Completar creacion canal | ALTA | No | -- | 1500 |
| 60 | PUT | /CredentialDoc/metadata | Actualizar metadata credencial | BAJA | No | -- | 1500 |
| 61 | PUT | /ProofOfInsuranceDoc/metadata | Actualizar metadata seguro | BAJA | No | -- | 1500 |
| 62 | PUT | /AuthorizedUser | Actualizar perfil usuario autorizado | MEDIA | No | -- | 1500 |
| 63 | PUT | /AuthorizedUser/verificationlink/refresh/{P}/{O} | Refrescar verificacion | BAJA | No | -- | 1500 |
| 64 | PUT | /AuthorizedUser/verificationlink/complete/{P}/{O} | Completar verificacion | BAJA | No | -- | 1500 |
| 65 | PUT | /SocialMedia | Actualizar red social | BAJA | No | -- | 1500 |
| 66 | PUT | /ContactPerson | Actualizar persona contacto | MEDIA | No | -- | 1500 |

**DELETE Endpoints:**

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 67 | DELETE | /PhysicalAddress/{PhysicalAddressCode} | Eliminar direccion | BAJA | No | -- | 1500 |
| 68 | DELETE | /Credentials | Eliminar credencial | BAJA | No | -- | 1500 |
| 69 | DELETE | /Phone/{PhoneCode} | Eliminar telefono | BAJA | No | -- | 1500 |
| 70 | DELETE | /Loans/{UserSyncId} | Eliminar prestamo | BAJA | No | -- | 1500 |
| 71 | DELETE | /CredentialDoc/{CredentialFileID} | Eliminar doc credencial | BAJA | No | -- | 1500 |
| 72 | DELETE | /ProofOfInsuranceDoc/{ProofOfInsuranceFileID} | Eliminar doc seguro | BAJA | No | -- | 1500 |
| 73 | DELETE | /AuthorizedUser | Eliminar usuario autorizado | BAJA | No | -- | 1500 |
| 74 | DELETE | /SocialMedia | Eliminar red social | BAJA | No | -- | 1500 |
| 75 | DELETE | /ContactPerson/{ContactPersonId} | Eliminar contacto | BAJA | No | -- | 1500 |

#### CommisionAccount -- /rest/commisionaccount/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /AccountPayableFromChannel | Cuentas por pagar del canal | ALTA | Si | TG05 | 1500 |
| 2 | POST | /AccountPayableFromChannel | Crear cuenta por pagar | ALTA | No | -- | 1500 |
| 3 | PUT | /AccountPayableFromChannel | Actualizar cuenta por pagar | MEDIA | No | -- | 1500 |
| 4 | DELETE | /AccountPayableFromChannel | Eliminar cuenta por pagar | BAJA | No | -- | 1500 |
| 5 | GET | /AccountPayableFromChannel/AccountPayableID | Cuenta por ID | MEDIA | No | -- | 1500 |
| 6 | GET | /AccountPayableLine | Lineas de cuenta por pagar | ALTA | No | -- | 1500 |
| 7 | POST | /AccountPayableLine | Crear linea | MEDIA | No | -- | 1500 |
| 8 | PUT | /AccountPayableLine | Actualizar linea | MEDIA | No | -- | 1500 |
| 9 | DELETE | /AccountPayableLine | Eliminar linea | BAJA | No | -- | 1500 |
| 10 | GET | /CommissionLiquidation | Liquidacion de comisiones | ALTA | No | -- | 1500 |
| 11 | PUT | /CommissionLiquidation | Actualizar liquidacion | ALTA | No | -- | 1500 |
| 12 | GET | /CommissionLiquidation/ByStatus | Liquidaciones por estado | ALTA | No | -- | 1500 |
| 13 | GET | /CommissionLiquidation/ByChannel | Liquidaciones por canal | ALTA | No | -- | 1500 |
| 14 | GET | /AccountPayableAttachment | Obtener adjunto | MEDIA | No | -- | 1500 |
| 15 | POST | /AccountPayableAttachment | Subir adjunto | MEDIA | No | -- | 1500 |
| 16 | PUT | /AccountPayableAttachment/metadata | Actualizar metadata | BAJA | No | -- | 1500 |
| 17 | DELETE | /AccountPayableAttachment/{AttachmentFileId} | Eliminar adjunto | BAJA | No | -- | 1500 |
| 18 | POST | /AccountPayableHistory | Crear historial | MEDIA | No | -- | 1500 |
| 19 | GET | /AccountPayableHistory | Historial de cuenta | MEDIA | No | -- | 1500 |
| 20 | POST | /ChannelCurrentAccount | Crear cuenta corriente | ALTA | No | -- | 1500 |
| 21 | GET | /ChannelCurrentAccount | Cuentas corrientes | ALTA | No | -- | 1500 |
| 22 | GET | /EconomicAgreement | Acuerdo economico | ALTA | No | -- | 1500 |
| 23 | GET | /DetailByChannel | Detalle por canal | MEDIA | No | -- | 1500 |

#### TrainingService -- /rest/trainingservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /Training/GetByUserSyncId/{UserId}/{ChannelId} | Entrenamientos por usuario y canal | MEDIA | No | -- | 1500 |
| 2 | GET | /Training | Entrenamientos por email | MEDIA | No | -- | 1500 |
| 3 | POST | /Training | Crear entrenamiento | MEDIA | No | -- | 1500 |
| 4 | DELETE | /Training | Eliminar entrenamiento | BAJA | No | -- | 1500 |
| 5 | GET | /InternalTraining/CurrentAll | Todos los entrenamientos internos | MEDIA | No | -- | 1500 |
| 6 | GET | /TrainingOption | Opciones de entrenamiento | BAJA | No | -- | 1500 |
| 7 | GET | /EducationInstitution | Instituciones educativas | BAJA | No | -- | 1500 |

#### Integrations -- /rest/integrations/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /commissionabletransaction | Listar transacciones comisionables | ALTA | No | -- | 1500 |
| 2 | POST | /commissionabletransaction | Crear transacciones comisionables | ALTA | No | -- | 1500 |
| 3 | GET | /commissionabletransaction/{transactionid} | Transaccion por ID | MEDIA | No | -- | 1500 |
| 4 | DELETE | /commissionabletransaction/{transactionid} | Eliminar transaccion | BAJA | No | -- | 1500 |

---

### Ventas -- sales.v1130.policysense.solutions

#### OpportunityService (LeadService) -- /rest/opportunityservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /Lead/{LeadId} | Obtener prospecto por ID | ALTA | No | -- | 1500 |
| 2 | GET | /Lead/GetAllByDistributionChannel/{ChannelSyncId} | Prospectos por canal | ALTA | No | -- | 1500 |
| 3 | POST | /Lead | Crear/actualizar oportunidad | ALTA | Si | TG04 | 1500 |
| 4 | GET | /Lead | Prospecto por email | ALTA | Si | TG04 | 1500 |
| 5 | GET | /Lead/CountAllByDistributionChannel/{id}/{OnlyLead} | Contar prospectos del canal | MEDIA | No | -- | 1500 |
| 6 | GET | /Opportunity/GetAllByDistributionChannel/{id} | Oportunidades por canal | ALTA | No | -- | 1500 |
| 7 | GET | /Opportunity/GetById/{OpportunityId} | Oportunidad por ID | ALTA | No | -- | 1500 |
| 8 | GET | /Opportunity/CountAllByDistributionChannel/{id} | Contar oportunidades del canal | MEDIA | No | -- | 1500 |
| 9 | DELETE | /Opportunity/all | Eliminar todas las oportunidades | BAJA | No | -- | 1500 |
| 10 | GET | /Opportunity/GetNewOpportunityForQuotation | Nueva oportunidad para cotizacion | ALTA | No | -- | 1500 |
| 11 | GET | /LeadAddress/All | Direcciones del prospecto | MEDIA | No | -- | 1500 |
| 12 | POST | /LeadAddress/Save | Guardar direccion | MEDIA | No | -- | 1500 |
| 13 | GET | /LeadAddress/RetrieveActiveByClient | Direcciones activas por cliente | MEDIA | No | -- | 1500 |
| 14 | DELETE | /LeadAddress | Eliminar direccion | BAJA | No | -- | 1500 |
| 15 | GET | /LeadAddress/RetrieveAllByClient | Todas las direcciones por cliente | MEDIA | No | -- | 1500 |
| 16 | PUT | /LeadAddress/Update | Actualizar direccion | MEDIA | No | -- | 1500 |
| 17 | GET | /LeadAddress/ValidateType | Validar tipo de direccion | BAJA | No | -- | 1500 |
| 18 | GET | /Client/GetByFilter | Buscar cliente (Email, ClientCode) | ALTA | No | -- | 1500 |
| 19 | GET | /Client/Exists | Verificar si existe cliente | MEDIA | No | -- | 1500 |
| 20 | GET | /ClientPhone/{LeadId} | Telefonos del prospecto | MEDIA | No | -- | 1500 |
| 21 | POST | /ClientPhone/{LeadId} | Agregar telefono | MEDIA | No | -- | 1500 |
| 22 | PUT | /ClientPhone/{LeadId} | Actualizar telefono | MEDIA | No | -- | 1500 |
| 23 | DELETE | /ClientPhone/{LeadId} | Eliminar telefono | BAJA | No | -- | 1500 |

#### BrokerService -- /rest/brokerservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /lead | Crear prospecto | ALTA | No | -- | 1500 |
| 2 | PUT | /lead | Actualizar prospecto | ALTA | No | -- | 1500 |
| 3 | DELETE | /lead | Eliminar prospecto | BAJA | No | -- | 1500 |
| 4 | POST | /exclusiveleadrequest | Solicitud de prospecto exclusivo | ALTA | No | -- | 1500 |
| 5 | GET | /alloweddocumentperrole | Documentos permitidos por producto | MEDIA | No | -- | 1500 |
| 6 | GET | /alloweddocumentperrole/alloweddocumentbyallowedrole | Docs por rol | MEDIA | No | -- | 1500 |
| 7 | GET | /alloweddocumentperrole/clientdocumentbyopportunity | Doc de cliente por oportunidad | MEDIA | No | -- | 1500 |
| 8 | GET | /alloweddocumentperrole/clientdocument | Doc de cliente por ID | MEDIA | No | -- | 1500 |
| 9 | GET | /businessquoteinformation | Info de cotizaciones de negocio | ALTA | No | -- | 1500 |
| 10 | GET | /businessquoteinformation/TotalCount | Total cotizaciones | MEDIA | No | -- | 1500 |
| 11 | POST | /salessurchargediscount/PostSurchargeDiscount | Crear recargo/descuento/impuesto | ALTA | No | -- | 1500 |
| 12 | GET | /salessurchargediscount/getbyquotation | Recargo/descuento por cotizacion | MEDIA | No | -- | 1500 |
| 13 | DELETE | /salessurchargediscount | Eliminar recargo/descuento | BAJA | No | -- | 1500 |
| 14 | GET | /salessurchargediscount/alreadyexist | Validar duplicado | BAJA | No | -- | 1500 |
| 15 | GET | /leadhelpercontext | Contexto del prospecto | MEDIA | No | -- | 1500 |

#### Campaign -- /rest/campaign/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /Campaign/GetByUserSyncId/{UserId}/{ChannelId} | Campanas por usuario y canal | MEDIA | No | -- | 1500 |
| 2 | GET | /Campaign/GetByCampaignCodes | Campanas por codigos | MEDIA | No | -- | 1500 |
| 3 | GET | /Campaign | Campana por codigo | MEDIA | No | -- | 1500 |

#### AuthenticationTest -- /rest/authenticationtest/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /Test | Health check de autenticacion | MEDIA | No | -- | 1500 |

---

### Reaseguro -- reinsurance.v1130.policysense.solutions

#### Reinsurance -- /rest/reinsurance/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /policytransactionnotification | Listar notificaciones de transaccion | ALTA | Si | TG08 | 3000 |
| 2 | POST | /policytransactionnotification | Crear notificacion de transaccion | ALTA | Si | TG08 | 3000 |
| 3 | GET | /policytransactionnotification/{id} | Notificacion por ID | ALTA | Si | TG09 | 3000 |

#### InsuranceCompanyService -- /rest/insurancecompanyservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /insurancecompany | Listar companias de seguros | ALTA | No | -- | 3000 |
| 2 | GET | /insurancecompany/{insurancecompanycode} | Compania por codigo | MEDIA | No | -- | 3000 |

#### BusinessRules -- /rest/businessrules/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /Evaluate | Evaluar reglas de reaseguro | ALTA | Si | TG09 | 3000 |
| 2 | GET | /Facts | Hechos de reglas de reaseguro | MEDIA | No | -- | 3000 |
| 3 | GET | /Rulesets | Paquetes de reglas disponibles | MEDIA | No | -- | 3000 |

---

### Productos -- product.v1130.policysense.solutions

#### ProductService -- /rest/product/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /Product | Listar productos (paginado, filtros) | ALTA | Si | TG07 | 3000 |
| 2 | GET | /Product/image | Imagen del producto | BAJA | No | -- | 3000 |
| 3 | GET | /Product/ProductSetting | Config del producto | ALTA | No | -- | 3000 |
| 4 | GET | /Product/product | Producto por codigo | ALTA | Si | TG07 | 3000 |
| 5 | GET | /ExtraPremiumDiscountTax/All/{ProductCode}/{EffectiveDate}/{LOB} | Recargos/descuentos/impuestos | MEDIA | No | -- | 3000 |
| 6 | GET | /Module | Modulos del producto | MEDIA | No | -- | 3000 |

#### CoverageService -- /rest/coverageservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /coverage/All/{ProductCode}/{LOB}/{EffectiveDate} | Coberturas por producto | ALTA | Si | TG07 | 3000 |
| 2 | GET | /coverageselectionhelper/GetByProductAndCoverageCode | Ayuda seleccion cobertura | MEDIA | No | -- | 3000 |

#### LifeHealthService -- /rest/lifehealthservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /AllowedCombinationOfPaymentAndInsuranceDuration/{code}/{lob}/{date} | Combinaciones pago/duracion | MEDIA | No | -- | 3000 |
| 2 | GET | /AllowedCombinationOfPaymentAndInsuranceDuration/GetFirst/{code}/{lob}/{date} | Primera combinacion | MEDIA | No | -- | 3000 |

#### PropertyAndCasualty -- /rest/propertyandcasualty/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /PropertyInsuredType/{ProductCode}/{LOB}/{EffectiveDate} | Tipos de asegurado P&C | MEDIA | No | -- | 3000 |

---

### Admin Usuarios -- usermanagement.v1130.policysense.solutions

#### UserManagement -- /rest/usermanagement/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /user/image | Imagen de usuario | BAJA | Si | TG06 | 3000 |

#### UserManagementServices -- /rest/usermanagementservices/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /user | Crear usuario | ALTA | Si | TG06 | 3000 |
| 2 | PUT | /user/activate | Activar cuenta de usuario (Token, SyncId) | ALTA | Si | TG11 | 3000 |
| 3 | PUT | /user/Email | Cambiar email de usuario | ALTA | Si | TG11 | 3000 |

---

### Servicio de Campo (SMC) -- smc.v1130.policysense.solutions

#### SecureMessageCenter -- /rest/securemessagecenter/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /SMC | Resumen de mensajes del usuario (SyncId) | MEDIA | Si | TG12 | 3000 |
| 2 | POST | /Email | Enviar correo centralizado | ALTA | Si | TG12 | 3000 |

#### TaskCountForUserService -- /rest/taskcountforuserservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /GetTaskCountForUser/{SyncId} | Conteo de tareas del usuario | MEDIA | No | -- | 3000 |

---

### Portal Autoservicio -- portal.v1130.policysense.solutions

#### Data -- /rest/data/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | POST | /validationmessage | Enviar mensajes de validacion | MEDIA | Si | TG10 | 3000 |
| 2 | GET | /validationmessage | Obtener mensajes de validacion | MEDIA | Si | TG10 | 3000 |

---

### Configuracion -- settings.v1130.policysense.solutions

#### SystemSetting -- /rest/systemsetting/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /generalsystemsetting | Configuracion general del sistema | ALTA | Si | TG14 | 3000 |

#### ExchangeRateService -- /rest/exchangerateservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /ExchangeRate | Tipos de cambio (por SyncId) | MEDIA | No | -- | 3000 |
| 2 | GET | /ExchangeRate/GetByCurrencyCode/{CurrencyCode} | Tipo cambio por moneda | MEDIA | No | -- | 3000 |

#### BankService -- /rest/bankservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /BankService/{BankCode} | Banco por codigo | MEDIA | No | -- | 3000 |
| 2 | GET | /BankService/GetAll | Listar todos los bancos | MEDIA | No | -- | 3000 |
| 3 | GET | /BankService/GetByCountry/{CountryCode} | Bancos por pais | MEDIA | No | -- | 3000 |
| 4 | GET | /BankContactService/GetBySyncId/{SyncId} | Contacto bancario | BAJA | No | -- | 3000 |
| 5 | GET | /BankContactService/GetFromBankCode/{BankCode} | Contactos del banco | BAJA | No | -- | 3000 |

#### InterestService -- /rest/interestservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /Interest | Tasas de interes (por SyncId) | MEDIA | No | -- | 3000 |
| 2 | GET | /Interest/GetByCurrencyCode/{CurrencyCode} | Intereses por moneda | MEDIA | No | -- | 3000 |

#### AccountPayableConceptService -- /rest/accountpayableconceptservice/v1

| # | Metodo | Endpoint | Descripcion | Prioridad | Automatizado | ThreadGroup JMX | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|----------------|---------|
| 1 | GET | /AccountPayableConcept | Conceptos de cuentas por pagar | MEDIA | No | -- | 3000 |

---

## OAuth 2.0 (Transversal a todos los hosts)

Todos los hosts exponen autenticacion en `/oauth/v2`:

| # | Metodo | Endpoint | Descripcion | Prioridad | Host ejemplo | SLA (ms) |
|---|--------|---------|-------------|-----------|------------|---------|
| 1 | POST | /oauth/v2/token | Obtener token OAuth (grant_type=password) | ALTA | sales.v1130 | 1000 |

Credenciales QA: `username=MxAdmin, password=Admin_123, client_id=policysense`

---

## Acciones prioritarias

1. **Cobertura critica (ALTA prioridad, sin automatizar):**
   - RatingService: 4 endpoints de tarificacion (POST) -- impacto directo en cotizacion
   - PolicyAdminService: PUT cotizacion, cotizaciones vida, coberturas -- flujo completo de poliza
   - UnderwritingService: 10 endpoints de suscripcion -- flujo de aprobacion
   - Billing: BillingPolicyIssue (POST) -- emision de factura
   - DistributionChannelService: CRUD canales, prestamos, comisiones -- modulo completo
   - CommisionAccount: Liquidacion de comisiones -- impacto financiero
   - OpportunityService: Oportunidades, prospectos -- flujo comercial
   - BrokerService: Recargos/descuentos -- impacto en pricing
   - OAuth: Login -- prerequisito de todas las pruebas

2. **Mapear gateway**: Los paths del JMX (`/api/v1/...`) no coinciden con los REST reales (`/rest/{service}/v1/...`). Verificar si existe API Gateway que transforma rutas.

3. **FNOL limitado**: El OpenAPI de claims solo expone 1 GET. Investigar si hay endpoints adicionales protegidos o si el JMX usa paths via gateway.
