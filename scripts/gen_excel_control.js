/**
 * Genera el Excel de Control de Automatizacion de APIs de Policysense.
 * Fuente de datos: docs/api-inventory.md
 * Salida: docs/API_Control_Automatizacion.xlsx
 */
const ExcelJS = require('exceljs');
const path = require('path');

const endpoints = [];
const idCounter = {};

const PREFIX_MAP = {
  'Policy Admin': 'PA', 'Facturacion y Cobranza': 'FC', 'Siniestros': 'SI',
  'Distribution Management': 'DM', 'Ventas': 'VE', 'Reaseguro': 'RE',
  'Productos': 'PR', 'Admin Usuarios': 'AU', 'Servicio de Campo (SMC)': 'SM',
  'Portal Autoservicio': 'PO', 'Configuracion': 'CF', 'OAuth (Transversal)': 'OA',
};

function add(modulo, microservicio, pathBase, metodo, endpoint, descripcion, prioridad, automatizado, tg, sla) {
  const prefix = PREFIX_MAP[modulo] || 'XX';
  idCounter[prefix] = (idCounter[prefix] || 0) + 1;
  const eid = `POL-${prefix}${String(idCounter[prefix]).padStart(3, '0')}`;
  endpoints.push({
    id: eid, modulo, microservicio, pathBase, metodo, endpoint,
    descripcion, prioridad, automatizado, tg, sla,
    estado: automatizado === 'Si' ? 'Completado' : 'Pendiente', notas: ''
  });
}

// ========== ALL ENDPOINT DATA ==========

// Policy Admin - RatingService
let s = 'RatingService', p = '/rest/ratingservice/v1';
add('Policy Admin', s, p, 'POST', '/Risk/BasicAnnualPremiumForAllCoverage', 'Calculo de primas anuales por cobertura', 'ALTA', 'Si', 'TG-Rating', 2000);
// Override notas for BasicAnnualPremiumForAllCoverage
endpoints[endpoints.length - 1].notas = 'CSV 8 variantes | 4 assertions | Sprint 1';
add('Policy Admin', s, p, 'POST', '/Risk/GrossAllModalPremiumForAllCoverages', 'Calculo importes a facturar por frecuencia', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'POST', '/Risk/GrossModalPremiumForSelectedCoverages', 'Importes a facturar coberturas seleccionadas', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'POST', '/Risk/BasicAnnualPremiumAllCoverageSeveralRisks', 'Primas anuales para multiples riesgos', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/Risk/PolicyInformation', 'Info de poliza (OfficialPolicyNumber, EffectiveDate)', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/RiskString', 'Procesar cadena de riesgo', 'BAJA', 'No', '--', 2000);

// Policy Admin - PolicyAdminService
s = 'PolicyAdminService'; p = '/rest/policyadmin/v1';
add('Policy Admin', s, p, 'GET', '/quotation/all', 'Listar todas las cotizaciones (paginado)', 'ALTA', 'Si', 'TG01', 2000);
add('Policy Admin', s, p, 'DELETE', '/quotation/all', 'Eliminar todas las cotizaciones (key)', 'BAJA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation', 'Obtener cotizacion por QuotationId', 'ALTA', 'Si', 'TG01', 2000);
add('Policy Admin', s, p, 'POST', '/quotation', 'Crear cotizacion', 'ALTA', 'Si', 'TG01', 2000);
add('Policy Admin', s, p, 'PUT', '/quotation', 'Actualizar cotizacion', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'DELETE', '/quotation/delete', 'Eliminar cotizacion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/newid', 'Generar nuevo ID de cotizacion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/allanonynousbyquotation', 'Cotizaciones anonimas por criterio', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/allanonymousbyclient', 'Cotizaciones anonimas por cliente', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/allbyclient', 'Cotizaciones por cliente (ClientCode, Email)', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/numberofquotations', 'Contar cotizaciones por cliente', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/allbyclientgroupbyproduct', 'Cotizaciones agrupadas por producto', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/orphans/count', 'Contar cotizaciones huerfanas', 'BAJA', 'No', '--', 2000);
add('Policy Admin', s, p, 'DELETE', '/quotation/orphans', 'Eliminar cotizaciones huerfanas', 'BAJA', 'No', '--', 2000);
add('Policy Admin', s, p, 'POST', '/quotation/life', 'Crear cotizacion vida', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'PUT', '/quotation/life', 'Actualizar cotizacion vida', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/life/{QuotationId}', 'Obtener cotizacion vida', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/broker', 'Cotizaciones/solicitudes/polizas por broker', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotation/quotationsource', 'Cotizaciones con documentos fuente', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotationclient', 'Obtener cliente de cotizacion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotationcoverage', 'Coberturas de una cotizacion', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotationquantity', 'Total de cotizaciones', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotationquantity/ByDistributionChannel', 'Cotizaciones por canal de distribucion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'POST', '/quotationpdf', 'Generar PDF de cotizacion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotationpdf', 'Obtener PDF de cotizacion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'DELETE', '/quotationpdf', 'Eliminar PDF', 'BAJA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotationpdf/quotationlifepdf/{OfficialQuotationId}', 'PDF de cotizacion vida', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotationclientaddress', 'Direcciones del cliente', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'POST', '/quotationclientaddress/save', 'Guardar direccion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'PUT', '/quotationclientaddress/update', 'Actualizar direccion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/quotationclientaddress/GetByQuotation', 'Direcciones por cotizacion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'POST', '/insuranceduration', 'Crear duracion de seguro', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/product', 'Productos por canal de distribucion', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/applicationformat', 'Formatos de solicitud por producto', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/applicationformat/GetForClientQuotation', 'Formato de solicitud cliente', 'MEDIA', 'No', '--', 2000);

// Policy Admin - UnderwritingService
s = 'UnderwritingService'; p = '/rest/underwritingservice/v1';
add('Policy Admin', s, p, 'GET', '/requirement/getbyclient', 'Requerimientos por cliente', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'POST', '/requirement', 'Crear requerimiento de suscripcion', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/requirement', 'Obtener requerimiento por RecGUID', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/requirement/getbycase', 'Requerimientos por caso', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/requirement/getbyquotation', 'Requerimientos por cotizacion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/requirement/getpendingbychannel', 'Requerimientos pendientes por canal', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'POST', '/underwritingfiledocument', 'Subir documento de suscripcion', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/underwritingcase/getbyfilter', 'Casos de suscripcion filtrados', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/Token/validate', 'Validar token de acceso unico', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/requirement/getpendingbytoken', 'Requerimientos pendientes por token', 'MEDIA', 'No', '--', 2000);

// Policy Admin - Risk
s = 'Risk'; p = '/rest/risk/v1';
add('Policy Admin', s, p, 'GET', '/RiskInformation/opportunity/{OpportunityId}', 'Info de riesgo por oportunidad', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/RiskInformation/quotation/{OfficialQuotation}', 'Info de riesgo por cotizacion', 'ALTA', 'No', '--', 2000);

// Policy Admin - BusinessRules
s = 'BusinessRules'; p = '/rest/businessrules/v1';
add('Policy Admin', s, p, 'POST', '/Evaluate', 'Evaluar reglas de negocio', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/Facts', 'Lista de hechos de reglas de negocio', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/Rulesets', 'Lista de paquetes de reglas disponibles', 'MEDIA', 'No', '--', 2000);

// Policy Admin - HealthDeclaration
s = 'HealthDeclaration'; p = '/rest/healthdeclaration/v1';
add('Policy Admin', s, p, 'POST', '/healthdeclaration', 'Crear declaracion de salud', 'ALTA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/healthdeclaration', 'Obtener declaracion por RecGUID', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/healthdeclarationpdf', 'PDF de declaracion de salud', 'BAJA', 'No', '--', 2000);

// Policy Admin - VehicleInformationService
s = 'VehicleInformationService'; p = '/rest/vehicleinformationservice/v1';
add('Policy Admin', s, p, 'GET', '/VehicleModelByMake', 'Modelos de vehiculo por marca', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/VehicleEdition', 'Ediciones por modelo', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'GET', '/VehicleValue', 'Valor del vehiculo', 'MEDIA', 'No', '--', 2000);

// Policy Admin - FleetService, Projection, ATS
add('Policy Admin', 'FleetService', '/rest/fleetservice/v1', 'POST', '/Vehicle', 'Registrar vehiculo en flota', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', 'Projection', '/rest/projection/v1', 'POST', '/Request', 'Solicitar proyeccion de vida', 'MEDIA', 'No', '--', 2000);
s = 'ATS'; p = '/rest/ats/v1';
add('Policy Admin', s, p, 'GET', '/quotation/byclient/{clientcode}', 'Cotizaciones por cliente (ATS)', 'MEDIA', 'No', '--', 2000);
add('Policy Admin', s, p, 'DELETE', '/AutomaticTesting', 'Eliminar datos de testing automatico', 'BAJA', 'No', '--', 2000);

// Facturacion y Cobranza
s = 'Billing'; p = '/rest/billing/v1';
add('Facturacion y Cobranza', s, p, 'GET', '/Bill/BillsByPolicy', 'Recibos por poliza (PolicyID, EffectiveDate)', 'ALTA', 'Si', 'TG03', 2000);
add('Facturacion y Cobranza', s, p, 'GET', '/Bill/BillsByClient', 'Recibos por cliente (ClientID, EffectiveDate)', 'ALTA', 'Si', 'TG03', 2000);
add('Facturacion y Cobranza', s, p, 'POST', '/BillingOrder/BillingPolicyIssue', 'Orden de facturacion por emision de poliza', 'ALTA', 'No', '--', 2000);
s = 'BusinessRules'; p = '/rest/businessrules/v1';
add('Facturacion y Cobranza', s, p, 'POST', '/Evaluate', 'Evaluar reglas (dias de gracia, mora)', 'ALTA', 'No', '--', 2000);
add('Facturacion y Cobranza', s, p, 'GET', '/Facts', 'Hechos de reglas de facturacion', 'MEDIA', 'No', '--', 2000);
add('Facturacion y Cobranza', s, p, 'GET', '/Rulesets', 'Paquetes de reglas disponibles', 'MEDIA', 'No', '--', 2000);

// Siniestros
add('Siniestros', 'FNOL (NoticeOfLoss)', '/rest/fnol/v1', 'GET', '/BasicInformation', 'Informacion basica de siniestro (NoticeID)', 'ALTA', 'Si', 'TG02', 2000);
s = 'BusinessRules'; p = '/rest/businessrules/v1';
add('Siniestros', s, p, 'POST', '/Evaluate', 'Evaluar reglas de validacion de cobertura', 'ALTA', 'No', '--', 2000);
add('Siniestros', s, p, 'GET', '/Facts', 'Hechos de reglas de siniestros', 'MEDIA', 'No', '--', 2000);
add('Siniestros', s, p, 'GET', '/Rulesets', 'Paquetes de reglas disponibles', 'MEDIA', 'No', '--', 2000);

// Distribution Management - DistributionChannelService
s = 'DistributionChannelService'; p = '/rest/distributionchannelservice/v1';
// GET
add('Distribution Management', s, p, 'GET', '/DistributionChannel', 'Canal por ID', 'ALTA', 'Si', 'TG05', 1500);
add('Distribution Management', s, p, 'GET', '/DistributionChannel/GetBySyncUserId/{SyncUserId}', 'Canal por SyncUserId', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/DistributionChannel/GetForDistributionChannel_AccessToPortal/{id}', 'Acceso portal del canal', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/ChannelCurrentAccount/GetByChannel/{id}', 'Cuenta corriente del canal', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/ChannelAuthorizedUser/GetByChannel/{id}', 'Usuarios autorizados del canal', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/ChannelAuthorizedUser/GetUserSyncIdSeparatedByCommas/{id}', 'SyncIds de usuarios', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/PhysicalAddress/GetByChannel/{id}', 'Direcciones del canal', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/PhysicalAddress/{DistributionChannelId}', 'Direccion especifica', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Credentials/GetByChannel/{id}', 'Credenciales del canal', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Credentials', 'Credenciales por email', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/DistributionChannelHistory/GetByChannel/{id}', 'Historial del canal', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/EconomicAgreements/GetByChannel/{id}', 'Acuerdos economicos', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Loans/GetByChannel/{id}', 'Prestamos del canal (por status)', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Loans/GetByChannelAll/{id}', 'Todos los prestamos', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Loans/BalanceForChannel/{id}', 'Saldo de prestamos', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Loans/GetNewLoan/{id}', 'Nuevo prestamo', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Loans/GetById/{LoanId}', 'Prestamo por ID', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/DistributionNetwork/GetByChannel/{id}', 'Red de distribucion', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/RiskProfessionalPolicies/GetByChannel/{id}', 'Polizas de riesgo profesional', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Support/GetByChannel/{id}', 'Soporte del canal', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Phone/GetByChannel/{id}', 'Telefonos del canal', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Phone/{DistributionChannelId}', 'Telefono especifico', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/NetworkMember/GetByChannel/{id}', 'Miembros de red', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/NetworkMember/GetChildrenOfAFather/{id}', 'Hijos en jerarquia', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/DistributionChannelContext/GetForDistributionChannel/{AuthUserSyncId}', 'Contexto del canal', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/DistributionChannelCreationRequest/{Param}/{Other}', 'Solicitud de creacion', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/ProofOfInsurance', 'Prueba de seguro por email', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/ProducerLicenseCategory', 'Categorias de licencia', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/InsuranceCompany', 'Companias de seguros', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/CredentialDoc', 'Documento de credencial', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/ProofOfInsuranceDoc', 'Documento prueba de seguro', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/DistributionChannelType', 'Tipos de canal', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/AuthorizedUser', 'Usuarios autorizados por email', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/AuthorizedUser/verificationlink/{Param}/{Other}', 'Enlace verificacion', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/DistributionManagementSetting', 'Config de Distribution Mgmt', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/SocialMedia', 'Redes sociales del canal', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/TaskCountForDistributionChannel/{id}', 'Conteo de tareas', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/ContactPerson', 'Personas de contacto', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/comission', 'Comisiones por canal', 'ALTA', 'Si', 'TG05', 1500);
// POST
add('Distribution Management', s, p, 'POST', '/PhysicalAddress', 'Crear direccion', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/Credentials', 'Crear credenciales', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/Loans/{UserSyncId}', 'Crear prestamo', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/Loans/CurrencyAndInterestByTypeOfApproval/{id}', 'Moneda e interes por tipo', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/Loans/TemporalSave/{id}', 'Guardado temporal prestamo', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/Phone', 'Agregar telefono', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/DistributionChannelCreationRequest', 'Crear solicitud canal', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/ProofOfInsurance', 'Crear prueba de seguro', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/CredentialDoc', 'Subir documento credencial', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/ProofOfInsuranceDoc', 'Subir doc prueba seguro', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/AuthorizedUser', 'Registrar usuario autorizado', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/SocialMedia', 'Registrar red social', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/ContactPerson', 'Registrar persona contacto', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/comission', 'Crear comision', 'ALTA', 'No', '--', 1500);
// PUT
add('Distribution Management', s, p, 'PUT', '/DistributionChannel', 'Actualizar canal', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/PhysicalAddress', 'Actualizar direccion', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/Loans', 'Actualizar prestamo', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/Phone', 'Actualizar telefono', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/DistributionChannelCreationRequest/refresh/{P}/{O}', 'Reenviar invitacion', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/DistributionChannelCreationRequest/complete/{P}/{O}', 'Completar creacion canal', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/CredentialDoc/metadata', 'Actualizar metadata credencial', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/ProofOfInsuranceDoc/metadata', 'Actualizar metadata seguro', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/AuthorizedUser', 'Actualizar perfil usuario autorizado', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/AuthorizedUser/verificationlink/refresh/{P}/{O}', 'Refrescar verificacion', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/AuthorizedUser/verificationlink/complete/{P}/{O}', 'Completar verificacion', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/SocialMedia', 'Actualizar red social', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/ContactPerson', 'Actualizar persona contacto', 'MEDIA', 'No', '--', 1500);
// DELETE
add('Distribution Management', s, p, 'DELETE', '/PhysicalAddress/{PhysicalAddressCode}', 'Eliminar direccion', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/Credentials', 'Eliminar credencial', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/Phone/{PhoneCode}', 'Eliminar telefono', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/Loans/{UserSyncId}', 'Eliminar prestamo', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/CredentialDoc/{CredentialFileID}', 'Eliminar doc credencial', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/ProofOfInsuranceDoc/{ProofOfInsuranceFileID}', 'Eliminar doc seguro', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/AuthorizedUser', 'Eliminar usuario autorizado', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/SocialMedia', 'Eliminar red social', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/ContactPerson/{ContactPersonId}', 'Eliminar contacto', 'BAJA', 'No', '--', 1500);

// Distribution Management - CommisionAccount
s = 'CommisionAccount'; p = '/rest/commisionaccount/v1';
add('Distribution Management', s, p, 'GET', '/AccountPayableFromChannel', 'Cuentas por pagar del canal', 'ALTA', 'Si', 'TG05', 1500);
add('Distribution Management', s, p, 'POST', '/AccountPayableFromChannel', 'Crear cuenta por pagar', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/AccountPayableFromChannel', 'Actualizar cuenta por pagar', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/AccountPayableFromChannel', 'Eliminar cuenta por pagar', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/AccountPayableFromChannel/AccountPayableID', 'Cuenta por ID', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/AccountPayableLine', 'Lineas de cuenta por pagar', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/AccountPayableLine', 'Crear linea', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/AccountPayableLine', 'Actualizar linea', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/AccountPayableLine', 'Eliminar linea', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/CommissionLiquidation', 'Liquidacion de comisiones', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/CommissionLiquidation', 'Actualizar liquidacion', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/CommissionLiquidation/ByStatus', 'Liquidaciones por estado', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/CommissionLiquidation/ByChannel', 'Liquidaciones por canal', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/AccountPayableAttachment', 'Obtener adjunto', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/AccountPayableAttachment', 'Subir adjunto', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'PUT', '/AccountPayableAttachment/metadata', 'Actualizar metadata', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/AccountPayableAttachment/{AttachmentFileId}', 'Eliminar adjunto', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/AccountPayableHistory', 'Crear historial', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/AccountPayableHistory', 'Historial de cuenta', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/ChannelCurrentAccount', 'Crear cuenta corriente', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/ChannelCurrentAccount', 'Cuentas corrientes', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/EconomicAgreement', 'Acuerdo economico', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/DetailByChannel', 'Detalle por canal', 'MEDIA', 'No', '--', 1500);

// Distribution Management - TrainingService
s = 'TrainingService'; p = '/rest/trainingservice/v1';
add('Distribution Management', s, p, 'GET', '/Training/GetByUserSyncId/{UserId}/{ChannelId}', 'Entrenamientos por usuario y canal', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/Training', 'Entrenamientos por email', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/Training', 'Crear entrenamiento', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/Training', 'Eliminar entrenamiento', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/InternalTraining/CurrentAll', 'Todos los entrenamientos internos', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/TrainingOption', 'Opciones de entrenamiento', 'BAJA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/EducationInstitution', 'Instituciones educativas', 'BAJA', 'No', '--', 1500);

// Distribution Management - Integrations
s = 'Integrations'; p = '/rest/integrations/v1';
add('Distribution Management', s, p, 'GET', '/commissionabletransaction', 'Listar transacciones comisionables', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'POST', '/commissionabletransaction', 'Crear transacciones comisionables', 'ALTA', 'No', '--', 1500);
add('Distribution Management', s, p, 'GET', '/commissionabletransaction/{transactionid}', 'Transaccion por ID', 'MEDIA', 'No', '--', 1500);
add('Distribution Management', s, p, 'DELETE', '/commissionabletransaction/{transactionid}', 'Eliminar transaccion', 'BAJA', 'No', '--', 1500);

// Ventas - OpportunityService
s = 'OpportunityService'; p = '/rest/opportunityservice/v1';
add('Ventas', s, p, 'GET', '/Lead/{LeadId}', 'Obtener prospecto por ID', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Lead/GetAllByDistributionChannel/{ChannelSyncId}', 'Prospectos por canal', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'POST', '/Lead', 'Crear/actualizar oportunidad', 'ALTA', 'Si', 'TG04', 1500);
add('Ventas', s, p, 'GET', '/Lead', 'Prospecto por email', 'ALTA', 'Si', 'TG04', 1500);
add('Ventas', s, p, 'GET', '/Lead/CountAllByDistributionChannel/{id}/{OnlyLead}', 'Contar prospectos del canal', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Opportunity/GetAllByDistributionChannel/{id}', 'Oportunidades por canal', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Opportunity/GetById/{OpportunityId}', 'Oportunidad por ID', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Opportunity/CountAllByDistributionChannel/{id}', 'Contar oportunidades del canal', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'DELETE', '/Opportunity/all', 'Eliminar todas las oportunidades', 'BAJA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Opportunity/GetNewOpportunityForQuotation', 'Nueva oportunidad para cotizacion', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/LeadAddress/All', 'Direcciones del prospecto', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'POST', '/LeadAddress/Save', 'Guardar direccion', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/LeadAddress/RetrieveActiveByClient', 'Direcciones activas por cliente', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'DELETE', '/LeadAddress', 'Eliminar direccion', 'BAJA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/LeadAddress/RetrieveAllByClient', 'Todas las direcciones por cliente', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'PUT', '/LeadAddress/Update', 'Actualizar direccion', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/LeadAddress/ValidateType', 'Validar tipo de direccion', 'BAJA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Client/GetByFilter', 'Buscar cliente (Email, ClientCode)', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Client/Exists', 'Verificar si existe cliente', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/ClientPhone/{LeadId}', 'Telefonos del prospecto', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'POST', '/ClientPhone/{LeadId}', 'Agregar telefono', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'PUT', '/ClientPhone/{LeadId}', 'Actualizar telefono', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'DELETE', '/ClientPhone/{LeadId}', 'Eliminar telefono', 'BAJA', 'No', '--', 1500);

// Ventas - BrokerService
s = 'BrokerService'; p = '/rest/brokerservice/v1';
add('Ventas', s, p, 'POST', '/lead', 'Crear prospecto', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'PUT', '/lead', 'Actualizar prospecto', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'DELETE', '/lead', 'Eliminar prospecto', 'BAJA', 'No', '--', 1500);
add('Ventas', s, p, 'POST', '/exclusiveleadrequest', 'Solicitud de prospecto exclusivo', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/alloweddocumentperrole', 'Documentos permitidos por producto', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/alloweddocumentperrole/alloweddocumentbyallowedrole', 'Docs por rol', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/alloweddocumentperrole/clientdocumentbyopportunity', 'Doc de cliente por oportunidad', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/alloweddocumentperrole/clientdocument', 'Doc de cliente por ID', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/businessquoteinformation', 'Info de cotizaciones de negocio', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/businessquoteinformation/TotalCount', 'Total cotizaciones', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'POST', '/salessurchargediscount/PostSurchargeDiscount', 'Crear recargo/descuento/impuesto', 'ALTA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/salessurchargediscount/getbyquotation', 'Recargo/descuento por cotizacion', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'DELETE', '/salessurchargediscount', 'Eliminar recargo/descuento', 'BAJA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/salessurchargediscount/alreadyexist', 'Validar duplicado', 'BAJA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/leadhelpercontext', 'Contexto del prospecto', 'MEDIA', 'No', '--', 1500);

// Ventas - Campaign
s = 'Campaign'; p = '/rest/campaign/v1';
add('Ventas', s, p, 'GET', '/Campaign/GetByUserSyncId/{UserId}/{ChannelId}', 'Campanas por usuario y canal', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Campaign/GetByCampaignCodes', 'Campanas por codigos', 'MEDIA', 'No', '--', 1500);
add('Ventas', s, p, 'GET', '/Campaign', 'Campana por codigo', 'MEDIA', 'No', '--', 1500);

// Ventas - AuthenticationTest
add('Ventas', 'AuthenticationTest', '/rest/authenticationtest/v1', 'GET', '/Test', 'Health check de autenticacion', 'MEDIA', 'No', '--', 1500);

// Reaseguro
s = 'Reinsurance'; p = '/rest/reinsurance/v1';
add('Reaseguro', s, p, 'GET', '/policytransactionnotification', 'Listar notificaciones de transaccion', 'ALTA', 'Si', 'TG08', 3000);
add('Reaseguro', s, p, 'POST', '/policytransactionnotification', 'Crear notificacion de transaccion', 'ALTA', 'Si', 'TG08', 3000);
add('Reaseguro', s, p, 'GET', '/policytransactionnotification/{id}', 'Notificacion por ID', 'ALTA', 'Si', 'TG09', 3000);
s = 'InsuranceCompanyService'; p = '/rest/insurancecompanyservice/v1';
add('Reaseguro', s, p, 'GET', '/insurancecompany', 'Listar companias de seguros', 'ALTA', 'No', '--', 3000);
add('Reaseguro', s, p, 'GET', '/insurancecompany/{insurancecompanycode}', 'Compania por codigo', 'MEDIA', 'No', '--', 3000);
s = 'BusinessRules'; p = '/rest/businessrules/v1';
add('Reaseguro', s, p, 'POST', '/Evaluate', 'Evaluar reglas de reaseguro', 'ALTA', 'Si', 'TG09', 3000);
add('Reaseguro', s, p, 'GET', '/Facts', 'Hechos de reglas de reaseguro', 'MEDIA', 'No', '--', 3000);
add('Reaseguro', s, p, 'GET', '/Rulesets', 'Paquetes de reglas disponibles', 'MEDIA', 'No', '--', 3000);

// Productos
s = 'ProductService'; p = '/rest/product/v1';
add('Productos', s, p, 'GET', '/Product', 'Listar productos (paginado, filtros)', 'ALTA', 'Si', 'TG07', 3000);
add('Productos', s, p, 'GET', '/Product/image', 'Imagen del producto', 'BAJA', 'No', '--', 3000);
add('Productos', s, p, 'GET', '/Product/ProductSetting', 'Config del producto', 'ALTA', 'No', '--', 3000);
add('Productos', s, p, 'GET', '/Product/product', 'Producto por codigo', 'ALTA', 'Si', 'TG07', 3000);
add('Productos', s, p, 'GET', '/ExtraPremiumDiscountTax/All/{ProductCode}/{EffectiveDate}/{LOB}', 'Recargos/descuentos/impuestos', 'MEDIA', 'No', '--', 3000);
add('Productos', s, p, 'GET', '/Module', 'Modulos del producto', 'MEDIA', 'No', '--', 3000);
s = 'CoverageService'; p = '/rest/coverageservice/v1';
add('Productos', s, p, 'GET', '/coverage/All/{ProductCode}/{LOB}/{EffectiveDate}', 'Coberturas por producto', 'ALTA', 'Si', 'TG07', 3000);
add('Productos', s, p, 'GET', '/coverageselectionhelper/GetByProductAndCoverageCode', 'Ayuda seleccion cobertura', 'MEDIA', 'No', '--', 3000);
s = 'LifeHealthService'; p = '/rest/lifehealthservice/v1';
add('Productos', s, p, 'GET', '/AllowedCombinationOfPaymentAndInsuranceDuration/{code}/{lob}/{date}', 'Combinaciones pago/duracion', 'MEDIA', 'No', '--', 3000);
add('Productos', s, p, 'GET', '/AllowedCombinationOfPaymentAndInsuranceDuration/GetFirst/{code}/{lob}/{date}', 'Primera combinacion', 'MEDIA', 'No', '--', 3000);
add('Productos', 'PropertyAndCasualty', '/rest/propertyandcasualty/v1', 'GET', '/PropertyInsuredType/{ProductCode}/{LOB}/{EffectiveDate}', 'Tipos de asegurado P&C', 'MEDIA', 'No', '--', 3000);

// Admin Usuarios
add('Admin Usuarios', 'UserManagement', '/rest/usermanagement/v1', 'GET', '/user/image', 'Imagen de usuario', 'BAJA', 'Si', 'TG06', 3000);
s = 'UserManagementServices'; p = '/rest/usermanagementservices/v1';
add('Admin Usuarios', s, p, 'POST', '/user', 'Crear usuario', 'ALTA', 'Si', 'TG06', 3000);
add('Admin Usuarios', s, p, 'PUT', '/user/activate', 'Activar cuenta de usuario (Token, SyncId)', 'ALTA', 'Si', 'TG11', 3000);
add('Admin Usuarios', s, p, 'PUT', '/user/Email', 'Cambiar email de usuario', 'ALTA', 'Si', 'TG11', 3000);

// SMC
s = 'SecureMessageCenter'; p = '/rest/securemessagecenter/v1';
add('Servicio de Campo (SMC)', s, p, 'GET', '/SMC', 'Resumen de mensajes del usuario (SyncId)', 'MEDIA', 'Si', 'TG12', 3000);
add('Servicio de Campo (SMC)', s, p, 'POST', '/Email', 'Enviar correo centralizado', 'ALTA', 'Si', 'TG12', 3000);
add('Servicio de Campo (SMC)', 'TaskCountForUserService', '/rest/taskcountforuserservice/v1', 'GET', '/GetTaskCountForUser/{SyncId}', 'Conteo de tareas del usuario', 'MEDIA', 'No', '--', 3000);

// Portal Autoservicio
s = 'Data'; p = '/rest/data/v1';
add('Portal Autoservicio', s, p, 'POST', '/validationmessage', 'Enviar mensajes de validacion', 'MEDIA', 'Si', 'TG10', 3000);
add('Portal Autoservicio', s, p, 'GET', '/validationmessage', 'Obtener mensajes de validacion', 'MEDIA', 'Si', 'TG10', 3000);

// Configuracion
add('Configuracion', 'SystemSetting', '/rest/systemsetting/v1', 'GET', '/generalsystemsetting', 'Configuracion general del sistema', 'ALTA', 'Si', 'TG14', 3000);
s = 'ExchangeRateService'; p = '/rest/exchangerateservice/v1';
add('Configuracion', s, p, 'GET', '/ExchangeRate', 'Tipos de cambio (por SyncId)', 'MEDIA', 'No', '--', 3000);
add('Configuracion', s, p, 'GET', '/ExchangeRate/GetByCurrencyCode/{CurrencyCode}', 'Tipo cambio por moneda', 'MEDIA', 'No', '--', 3000);
s = 'BankService'; p = '/rest/bankservice/v1';
add('Configuracion', s, p, 'GET', '/BankService/{BankCode}', 'Banco por codigo', 'MEDIA', 'No', '--', 3000);
add('Configuracion', s, p, 'GET', '/BankService/GetAll', 'Listar todos los bancos', 'MEDIA', 'No', '--', 3000);
add('Configuracion', s, p, 'GET', '/BankService/GetByCountry/{CountryCode}', 'Bancos por pais', 'MEDIA', 'No', '--', 3000);
add('Configuracion', s, p, 'GET', '/BankContactService/GetBySyncId/{SyncId}', 'Contacto bancario', 'BAJA', 'No', '--', 3000);
add('Configuracion', s, p, 'GET', '/BankContactService/GetFromBankCode/{BankCode}', 'Contactos del banco', 'BAJA', 'No', '--', 3000);
s = 'InterestService'; p = '/rest/interestservice/v1';
add('Configuracion', s, p, 'GET', '/Interest', 'Tasas de interes (por SyncId)', 'MEDIA', 'No', '--', 3000);
add('Configuracion', s, p, 'GET', '/Interest/GetByCurrencyCode/{CurrencyCode}', 'Intereses por moneda', 'MEDIA', 'No', '--', 3000);
add('Configuracion', 'AccountPayableConceptService', '/rest/accountpayableconceptservice/v1', 'GET', '/AccountPayableConcept', 'Conceptos de cuentas por pagar', 'MEDIA', 'No', '--', 3000);

// OAuth (Transversal)
add('OAuth (Transversal)', 'OAuth', '/oauth/v2', 'POST', '/token', 'Obtener token OAuth (grant_type=password)', 'ALTA', 'No', '--', 1000);

// ========== HELPER FUNCTIONS ==========

const modOrder = ['Policy Admin', 'Facturacion y Cobranza', 'Siniestros', 'Distribution Management',
  'Ventas', 'Reaseguro', 'Productos', 'Admin Usuarios', 'Servicio de Campo (SMC)',
  'Portal Autoservicio', 'Configuracion', 'OAuth (Transversal)'];

const modPriority = {
  'Policy Admin': 'Alta', 'Facturacion y Cobranza': 'Alta', 'Siniestros': 'Alta',
  'Distribution Management': 'Alta', 'Ventas': 'Media', 'Reaseguro': 'Media',
  'Productos': 'Media', 'Admin Usuarios': 'Baja', 'Servicio de Campo (SMC)': 'Baja',
  'Portal Autoservicio': 'Baja', 'Configuracion': 'Baja', 'OAuth (Transversal)': 'Alta',
};

const MODULE_COLORS = {
  'Policy Admin': 'D6E4F0', 'Facturacion y Cobranza': 'E2EFDA', 'Siniestros': 'FCE4D6',
  'Distribution Management': 'D9E2F3', 'Ventas': 'FFF2CC', 'Reaseguro': 'E2D9F3',
  'Productos': 'D5F5E3', 'Admin Usuarios': 'FADBD8', 'Servicio de Campo (SMC)': 'F9E79F',
  'Portal Autoservicio': 'AED6F1', 'Configuracion': 'D5DBDB', 'OAuth (Transversal)': 'F5CBA7',
};

const METHOD_COLORS = { GET: 'C6EFCE', POST: 'BDD7EE', PUT: 'F4B084', DELETE: 'FFC7CE' };
const PRIO_COLORS = { ALTA: 'FF6B6B', MEDIA: 'F4B084', BAJA: '92D050' };
const SPRINT_COLORS = { 'Sprint 1': 'FF6B6B', 'Sprint 2': 'F4B084', 'Sprint 3': 'FFEB9C', 'Sprint 4': 'BDD7EE', 'Sprint 5': 'C6EFCE' };

function assignSprint(ep) {
  const m = ep.modulo;
  if (m === 'OAuth (Transversal)' || m === 'Policy Admin') return 'Sprint 1';
  if (m === 'Siniestros' || m === 'Facturacion y Cobranza') return 'Sprint 2';
  if (m === 'Distribution Management') return 'Sprint 3';
  if (m === 'Ventas' || m === 'Reaseguro') return 'Sprint 4';
  return 'Sprint 5';
}

function estimateHours(ep) {
  return { GET: 1, POST: 2, PUT: 1.5, DELETE: 1 }[ep.metodo] || 1.5;
}

// ========== GENERATE EXCEL ==========

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'In Motion S.A. - QA Team';
  wb.created = new Date(2026, 3, 9);

  const headerStyle = { font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } }, alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } };
  const thinBorder = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

  // ===== HOJA 1: Resumen Ejecutivo =====
  const ws1 = wb.addWorksheet('Resumen Ejecutivo', { properties: { tabColor: { argb: 'FF1F4E79' } } });

  ws1.mergeCells('A1:I1');
  const titleCell = ws1.getCell('A1');
  titleCell.value = 'Control de Automatizacion de APIs - Policysense v1130';
  titleCell.font = { bold: true, size: 16, color: { argb: 'FF1F4E79' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  const totalAuto = endpoints.filter(e => e.automatizado === 'Si').length;
  ws1.mergeCells('A2:I2');
  const subtitleCell = ws1.getCell('A2');
  subtitleCell.value = `Fecha: 2026-04-09 | Total: ${endpoints.length} endpoints | Cobertura: ${totalAuto}/${endpoints.length} (${(100 * totalAuto / endpoints.length).toFixed(1)}%)`;
  subtitleCell.font = { size: 11, italic: true };
  subtitleCell.alignment = { horizontal: 'center' };

  const h1 = ['Modulo', 'Microservicio(s)', 'Total Endpoints', 'Alta Prio', 'Media Prio', 'Baja Prio', 'Automatizados JMX', '% Cobertura', 'Prioridad Modulo'];
  const headerRow1 = ws1.getRow(4);
  h1.forEach((h, i) => {
    const cell = headerRow1.getCell(i + 1);
    cell.value = h;
    Object.assign(cell, headerStyle);
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
    cell.alignment = headerStyle.alignment;
    cell.border = thinBorder;
  });

  let row = 5;
  const totals = [0, 0, 0, 0, 0];
  for (const mod of modOrder) {
    const modEps = endpoints.filter(e => e.modulo === mod);
    if (!modEps.length) continue;
    const svcs = [...new Set(modEps.map(e => e.microservicio))].sort().join(', ');
    const total = modEps.length;
    const alta = modEps.filter(e => e.prioridad === 'ALTA').length;
    const media = modEps.filter(e => e.prioridad === 'MEDIA').length;
    const baja = modEps.filter(e => e.prioridad === 'BAJA').length;
    const auto = modEps.filter(e => e.automatizado === 'Si').length;
    const pct = total > 0 ? (auto / total * 100) : 0;

    const r = ws1.getRow(row);
    [mod, svcs, total, alta, media, baja, auto, `${pct.toFixed(1)}%`, modPriority[mod] || 'Media'].forEach((v, i) => {
      const cell = r.getCell(i + 1);
      cell.value = v;
      cell.border = thinBorder;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      if (i === 0) {
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        if (MODULE_COLORS[mod]) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + MODULE_COLORS[mod] } };
      }
      if (i === 1) cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      if (i === 7) {
        const color = pct >= 70 ? 'C6EFCE' : (pct >= 40 ? 'FFEB9C' : 'FFC7CE');
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + color } };
      }
    });
    totals[0] += total; totals[1] += alta; totals[2] += media; totals[3] += baja; totals[4] += auto;
    row++;
  }

  // Totals row
  const totalPct = totals[0] > 0 ? (totals[4] / totals[0] * 100) : 0;
  const tr = ws1.getRow(row);
  ['TOTALES', '--', totals[0], totals[1], totals[2], totals[3], totals[4], `${totalPct.toFixed(1)}%`, '--'].forEach((v, i) => {
    const cell = tr.getCell(i + 1);
    cell.value = v;
    cell.border = thinBorder;
    cell.font = { bold: true, size: 11 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (i === 7) {
      const color = totalPct >= 70 ? 'C6EFCE' : (totalPct >= 40 ? 'FFEB9C' : 'FFC7CE');
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + color } };
    }
  });

  ws1.columns = [{ width: 25 }, { width: 55 }, { width: 15 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 18 }, { width: 14 }, { width: 16 }];

  // ===== HOJA 2: Inventario Completo =====
  const ws2 = wb.addWorksheet('Inventario Completo', { properties: { tabColor: { argb: 'FF2E75B6' } } });

  const h2 = ['ID', 'Modulo', 'Microservicio', 'Servicio/Path base', 'Metodo HTTP', 'Endpoint', 'Descripcion', 'Prioridad', 'Automatizado JMX', 'ThreadGroup JMX', 'SLA (ms)', 'Estado Prueba', 'Notas'];
  const hr2 = ws2.getRow(1);
  h2.forEach((h, i) => {
    const cell = hr2.getCell(i + 1);
    cell.value = h;
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
    cell.alignment = headerStyle.alignment;
    cell.border = thinBorder;
  });

  endpoints.forEach((ep, idx) => {
    const r = ws2.getRow(idx + 2);
    [ep.id, ep.modulo, ep.microservicio, ep.pathBase, ep.metodo, ep.endpoint, ep.descripcion, ep.prioridad, ep.automatizado, ep.tg, ep.sla, ep.estado, ep.notas].forEach((v, i) => {
      const cell = r.getCell(i + 1);
      cell.value = v;
      cell.border = thinBorder;
      cell.alignment = { vertical: 'middle', wrapText: true };

      if (i === 1 && MODULE_COLORS[ep.modulo]) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + MODULE_COLORS[ep.modulo] } };
      }
      if (i === 4) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (METHOD_COLORS[ep.metodo] || 'FFFFFF') } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (i === 7) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (PRIO_COLORS[ep.prioridad] || 'FFFFFF') } };
        cell.font = { bold: true, color: ep.prioridad === 'ALTA' ? { argb: 'FFFFFFFF' } : { argb: 'FF000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (i === 8) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ep.automatizado === 'Si' ? 'FF92D050' : 'FFFF6B6B' } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (i === 11) {
        const eColor = ep.estado === 'Completado' ? 'C6EFCE' : (ep.estado === 'En progreso' ? 'FFEB9C' : 'FFC7CE');
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + eColor } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    });
  });

  ws2.columns = [{ width: 14 }, { width: 25 }, { width: 25 }, { width: 32 }, { width: 12 }, { width: 50 }, { width: 45 }, { width: 12 }, { width: 16 }, { width: 16 }, { width: 10 }, { width: 15 }, { width: 20 }];
  ws2.autoFilter = { from: 'A1', to: `M${endpoints.length + 1}` };
  ws2.views = [{ state: 'frozen', ySplit: 1 }];

  // ===== HOJA 3: Plan de Automatizacion =====
  const ws3 = wb.addWorksheet('Plan de Automatizacion', { properties: { tabColor: { argb: 'FFFF6B6B' } } });

  const h3 = ['ID', 'Modulo', 'Microservicio', 'Metodo', 'Endpoint', 'Descripcion', 'Sprint Sugerido', 'Responsable', 'Estimacion (horas)'];
  const hr3 = ws3.getRow(1);
  h3.forEach((h, i) => {
    const cell = hr3.getCell(i + 1);
    cell.value = h;
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
    cell.alignment = headerStyle.alignment;
    cell.border = thinBorder;
  });

  const altaNotAuto = endpoints
    .filter(e => e.prioridad === 'ALTA' && e.automatizado === 'No')
    .sort((a, b) => {
      const ai = modOrder.indexOf(a.modulo); const bi = modOrder.indexOf(b.modulo);
      return ai !== bi ? ai - bi : a.id.localeCompare(b.id);
    });

  altaNotAuto.forEach((ep, idx) => {
    const sprint = assignSprint(ep);
    const hrs = estimateHours(ep);
    const r = ws3.getRow(idx + 2);
    [ep.id, ep.modulo, ep.microservicio, ep.metodo, ep.endpoint, ep.descripcion, sprint, 'Por asignar', hrs].forEach((v, i) => {
      const cell = r.getCell(i + 1);
      cell.value = v;
      cell.border = thinBorder;
      cell.alignment = { vertical: 'middle', wrapText: true };
      if (i === 1 && MODULE_COLORS[ep.modulo]) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + MODULE_COLORS[ep.modulo] } };
      }
      if (i === 3) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (METHOD_COLORS[ep.metodo] || 'FFFFFF') } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (i === 6) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (SPRINT_COLORS[sprint] || 'FFFFFF') } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    });
  });

  const sumRow = altaNotAuto.length + 3;
  ws3.getCell(`A${sumRow}`).value = 'Total endpoints ALTA sin automatizar:';
  ws3.getCell(`A${sumRow}`).font = { bold: true, size: 11 };
  ws3.getCell(`E${sumRow}`).value = altaNotAuto.length;
  ws3.getCell(`E${sumRow}`).font = { bold: true, size: 11, color: { argb: 'FFFF0000' } };
  ws3.getCell(`A${sumRow + 1}`).value = 'Estimacion total (horas):';
  ws3.getCell(`A${sumRow + 1}`).font = { bold: true, size: 11 };
  ws3.getCell(`E${sumRow + 1}`).value = altaNotAuto.reduce((sum, e) => sum + estimateHours(e), 0);
  ws3.getCell(`E${sumRow + 1}`).font = { bold: true, size: 11, color: { argb: 'FFFF0000' } };

  ws3.columns = [{ width: 14 }, { width: 25 }, { width: 25 }, { width: 10 }, { width: 50 }, { width: 45 }, { width: 16 }, { width: 15 }, { width: 16 }];
  ws3.autoFilter = { from: 'A1', to: `I${altaNotAuto.length + 1}` };
  ws3.views = [{ state: 'frozen', ySplit: 1 }];

  // ===== HOJA 4: Cobertura por Sprint =====
  const ws4 = wb.addWorksheet('Cobertura por Sprint', { properties: { tabColor: { argb: 'FF00B050' } } });

  ws4.mergeCells('A1:H1');
  const t4 = ws4.getCell('A1');
  t4.value = 'Plan de Cobertura por Sprint - Policysense Load Testing';
  t4.font = { bold: true, size: 14, color: { argb: 'FF1F4E79' } };
  t4.alignment = { horizontal: 'center' };

  ws4.mergeCells('A2:H2');
  const st4 = ws4.getCell('A2');
  st4.value = 'Duracion estimada: 2 semanas por sprint | Solo endpoints ALTA prioridad sin automatizar';
  st4.font = { size: 10, italic: true };
  st4.alignment = { horizontal: 'center' };

  const h4 = ['Sprint', 'Foco', 'Modulos/Servicios', 'Periodo', 'Endpoints ALTA', 'Horas Estimadas', 'Acumulado %', 'Estado'];
  const hr4 = ws4.getRow(4);
  h4.forEach((h, i) => {
    const cell = hr4.getCell(i + 1);
    cell.value = h;
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
    cell.alignment = headerStyle.alignment;
    cell.border = thinBorder;
  });

  const sprintDefs = [
    ['Sprint 1', 'OAuth + Policy Admin (critico)', 'Autenticacion, cotizaciones, tarificacion, reglas de negocio', 'Semana 1-2'],
    ['Sprint 2', 'Siniestros + Facturacion (core)', 'FNOL, validacion cobertura, facturacion, reglas', 'Semana 3-4'],
    ['Sprint 3', 'Distribution Management', 'Canales, comisiones, liquidaciones, prestamos, redes', 'Semana 5-6'],
    ['Sprint 4', 'Ventas + Reaseguro', 'Oportunidades, prospectos, brokers, contratos reaseguro', 'Semana 7-8'],
    ['Sprint 5', 'Productos + UserMgmt + Portal + SMC + Settings', 'Catalogo productos, usuarios, portal, mensajeria, config', 'Semana 9-10'],
  ];

  let cumulative = 0;
  sprintDefs.forEach(([sname, foco, desc, periodo], idx) => {
    const sprintEps = altaNotAuto.filter(e => assignSprint(e) === sname);
    const count = sprintEps.length;
    const hrs = sprintEps.reduce((sum, e) => sum + estimateHours(e), 0);
    cumulative += count;
    const pctAcum = altaNotAuto.length > 0 ? (cumulative / altaNotAuto.length * 100) : 0;

    const r = ws4.getRow(idx + 5);
    [sname, foco, desc, periodo, count, hrs, `${pctAcum.toFixed(0)}%`, 'Pendiente'].forEach((v, i) => {
      const cell = r.getCell(i + 1);
      cell.value = v;
      cell.border = thinBorder;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      if (i === 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (SPRINT_COLORS[sname] || 'FFFFFF') } };
        cell.font = { bold: true };
      }
      if (i === 1 || i === 2) cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    });
  });

  const sr = 11;
  ws4.getCell(`A${sr}`).value = 'Resumen General';
  ws4.getCell(`A${sr}`).font = { bold: true, size: 12, color: { argb: 'FF1F4E79' } };
  ws4.getCell(`A${sr + 1}`).value = 'Total endpoints ALTA sin automatizar:';
  ws4.getCell(`D${sr + 1}`).value = altaNotAuto.length;
  ws4.getCell(`D${sr + 1}`).font = { bold: true };
  ws4.getCell(`A${sr + 2}`).value = 'Total horas estimadas:';
  ws4.getCell(`D${sr + 2}`).value = altaNotAuto.reduce((sum, e) => sum + estimateHours(e), 0);
  ws4.getCell(`D${sr + 2}`).font = { bold: true };
  ws4.getCell(`A${sr + 3}`).value = 'Endpoints ya automatizados:';
  ws4.getCell(`D${sr + 3}`).value = totalAuto;
  ws4.getCell(`D${sr + 3}`).font = { bold: true };
  ws4.getCell(`A${sr + 4}`).value = 'Cobertura actual:';
  ws4.getCell(`D${sr + 4}`).value = `${(100 * totalAuto / endpoints.length).toFixed(1)}%`;
  ws4.getCell(`D${sr + 4}`).font = { bold: true, color: { argb: 'FFFF0000' } };
  ws4.getCell(`A${sr + 5}`).value = 'Cobertura objetivo (5 sprints):';
  ws4.getCell(`D${sr + 5}`).value = '100% ALTA prioridad';
  ws4.getCell(`D${sr + 5}`).font = { bold: true, color: { argb: 'FF00B050' } };

  ws4.columns = [{ width: 14 }, { width: 35 }, { width: 50 }, { width: 14 }, { width: 16 }, { width: 16 }, { width: 14 }, { width: 14 }];

  // ===== SAVE =====
  const outputPath = path.join(__dirname, '..', 'docs', 'API_Control_Automatizacion.xlsx');
  await wb.xlsx.writeFile(outputPath);
  console.log(`Guardado: ${outputPath}`);
  console.log(`Hojas: ${wb.worksheets.map(w => w.name).join(', ')}`);
  console.log(`Total endpoints: ${endpoints.length}`);
  console.log(`Automatizados: ${totalAuto}`);
  console.log(`ALTA sin automatizar: ${altaNotAuto.length}`);
  console.log('OK');
}

main().catch(err => { console.error(err); process.exit(1); });
