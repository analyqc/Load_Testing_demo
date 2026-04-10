---
name: pruebas-policysense
description: Skill de pruebas JMeter para Policysense ERP. Contiene logica de negocio real extraida de los 6 manuales del sistema.
---

# Pruebas de Carga -- Suite Policysense

Actualizado: 2026-04-09 | Fuente: Manuales oficiales Policysense v1130

## Microservicios y Hosts (Ambiente QA)

| Modulo | Host | Servicios principales | Endpoints |
|--------|------|----------------------|-----------|
| Policy Admin | policyadmin.testview.policysense.solutions | RatingService, PolicyAdminService, UnderwritingService, Risk, BusinessRules, HealthDeclaration, VehicleInfo, Fleet, Projection, ATS | 61 |
| Facturacion y Cobranza | billing.v1130.policysense.solutions | Billing, BusinessRules | 6 |
| Siniestros | claims.v1130.policysense.solutions | FNOL (NoticeOfLoss), BusinessRules | 4 |
| Distribution Management | distributionchannels.v1130.policysense.solutions | DistributionChannelService, CommisionAccount, CommisionScheme, BusinessRules | 100 |
| Ventas | sales.v1130.policysense.solutions | SalesService, OAuth | 41 |
| Reaseguro | reinsurance.v1130.policysense.solutions | ReinsuranceService, BusinessRules | 8 |
| Productos | product.v1130.policysense.solutions | ProductDesigner | 11 |
| Admin Usuarios | usermanagement.v1130.policysense.solutions | UserManagement | 4 |
| SMC | smc.v1130.policysense.solutions | SecureMessageCenter | 3 |
| Portal | portal.v1130.policysense.solutions | PortalService | 2 |
| Configuracion | settings.v1130.policysense.solutions | SettingsService | 11 |

**Dominio base**: `*.policysense.solutions`
**Total endpoints descubiertos**: 251 | **Automatizados en JMX**: 31 (12.4%)

## Autenticacion

- **OAuth2**: POST /oauth/v2/token en `sales.v1130.policysense.solutions`
- **Credenciales QA**: MxAdmin / Admin_123 / client_id=policysense
- **Token**: Bearer en header Authorization
- **IDP**: Auth0 (configurable, puede integrarse con IDP del cliente)
- **Politicas de seguridad**: complejidad de contrasena, expiracion, intentos fallidos, bloqueo automatico, MFA

---

## Modulo 1: Distribution Management

**Host**: `distributionchannels.v1130.policysense.solutions`
**Base path**: `/rest/distributionchannelservice/v1`
**Criticidad**: ALTA

### Entidades de negocio

| Entidad | Descripcion | Campos clave |
|---------|-------------|-------------|
| Canal de distribucion | Agente, broker, sponsor, entidad distribuidora | ID interno, tipo, nivel, estado, codigo, datos fiscales |
| Tipo de canal | Parametrizable (Agente empleado, Agente exclusivo, Broker, Bancaseguro, Digital, Retail) | Nombre, niveles asociados, reglas por nivel |
| Nivel de canal | Progresion dentro de un tipo | Nombre (Novel/Basico/Avanzado/Experto), puede vender, puede pedir prestamos, usa portal |
| Licencia | Autorizacion regulatoria por familia de producto | Categoria (Vida/Salud/Patrimoniales), vigencia, renovacion periodica |
| Red de distribucion | Estructura jerarquica multinivel | Tipo (publica/privada/sociedad/bancaria/retail), max niveles, ramos cubiertos |
| Acuerdo economico | Contrato de compensacion canal | Datos basicos, datos fiscales, cuadros de comision, beneficios, opciones |
| Escalera de comisiones | Distribucion multinivel de comision | Plantilla por niveles, participacion publica vs privada |
| Seguro E&O | Poliza de responsabilidad civil profesional | Compania, vigencia, monto cobertura |

### Tipos de canal soportados

- Agente empleado (fuerza de ventas propia, sin niveles tipicamente)
- Agente exclusivo (independiente, con plan de carrera: Novel -> Promotor calificado -> Promotor experto)
- Broker / Corredor (redes independientes, cuentas comerciales grandes)
- Bancaseguro (red bancaria, carga masiva empleados, modelo de puntos)
- Canal digital (portales, marketplaces, embedded insurance)
- Retail / Masivos (alianzas con cadenas comerciales)
- Affinity (colegios profesionales, universidades, clubes)
- Sponsor (para seguros masivos y embebidos, no es intermediario legal)

### Estados del canal y transiciones

| Estado | Puede vender | Recibe pagos | Acuerdo economico | Puede pedir prestamos |
|--------|-------------|-------------|-------------------|----------------------|
| En reclutamiento | No | No | Opcional | No |
| Activo | Si | Si | Obligatorio | Segun nivel |
| Suspendido temporalmente | No | Detenidos | Vigente | No |
| Suspendido definitivo | No | No | Cancelado | No |

**Transiciones con aprobacion**: En reclutamiento -> Activo (requiere workflow de aprobacion)
**Transiciones libres**: Cualquier estado -> Suspendido temporalmente (sin condiciones)

### Reglas de transicion de niveles

- En entrenamiento -> Basico (permitido)
- En entrenamiento -> Experto (NO permitido, debe pasar por niveles intermedios)
- Cada nivel define: puede vender, puede usar portal, necesita codigo, plantilla de acuerdo economico

### Acuerdos economicos (estructura detallada)

**Estructura del acuerdo**:
1. Datos basicos (vigencia, canal asociado)
2. Datos fiscales
3. Cuadros de comision (por producto/cobertura)
4. Beneficios (multiples tipos):
   - **Cantidad fija**: pago fijo por gastos operativos (ej: USD 1,000/mes transporte)
   - **Porcentaje sobre KPI**: bono por primas cobradas/emitidas
   - **Calculo personalizado**: mediante programa
   - **Subsidio**: ingreso minimo garantizado para canales nuevos (con/sin devolucion)
   - **Prestamo**: con devolucion pre-acordada
   - **Poliza de seguros**: Salud/Vida automatica para canales
   - **Fondo de retiro**
5. Opciones y condiciones

**Versionamiento**: fecha inicio/fin, versiones secuenciales, creacion desde plantilla o acuerdo previo.
**Duracion tipica**: superior a 12 meses (ej: 36 meses).

### Comisiones -- Escalera multinivel

- Cada nodo de la red genera comision proporcional a su participacion
- Si Juan vende: solo Juan recibe comision
- Si Luisa (bajo Juan) vende: Luisa Y Juan reciben segun plantilla
- Si Jose (4 niveles) vende: Jose, Francisco, Jorge y Juan reciben
- **Plantillas de participacion**: reutilizables, definen distribucion por cantidad de niveles activos
- **Comisiones garantizadas (vested)**: canal conserva comisiones de cartera aun si se desvincula
- **Participacion publica vs privada**: publica = visible en poliza, privada = confidencial
- **Calculo**: Distribution Management es el UNICO responsable de calcular comisiones para cualquier poliza/factura
- **Modelo de puntos**: alternativa a comisiones en redes bancarias/retail

### Redes de distribucion

**Tipos de red**:
- Jerarquia publica (visible en polizas)
- Jerarquia privada (participacion confidencial)
- Sociedad entre pares (no jerarquica)
- Red bancaria (estructura plana, carga masiva desde Excel)
- Red de retail

**Configuracion de red**:
- Nombre, codigo, fecha validez
- Max niveles, ramos/productos cubiertos
- Regla de comision: usar tablas del nodo mas alto / mas bajo / propias de cada nodo
- Manejo de eliminacion de nodos (comisiones garantizadas o no)

### Proceso de onboarding de canales

```
1. Captura info inicial (datos, tipo canal, ID fiscal)
2. Validacion documental (licencia, certificaciones, poliza E&O)
3. Generacion de codigo
4. Asignacion jerarquica y territorial (red, region, productos autorizados)
5. Configuracion comercial (acuerdo economico, comisiones, cuentas pago)
6. Aprobacion y activacion (workflow area comercial + cumplimiento)
7. Creacion usuario portal
```

### Endpoints criticos para pruebas de carga

| Prioridad | Endpoint | Metodo | SLA (ms) |
|-----------|---------|--------|----------|
| ALTA | /DistributionChannel | GET | 1500 |
| ALTA | /DistributionChannel | PUT | 1500 |
| ALTA | /comission | GET/POST | 1500 |
| ALTA | /EconomicAgreements/GetByChannel/{id} | GET | 1500 |
| ALTA | /Loans/GetByChannel/{id} | GET | 1500 |
| ALTA | /Loans/BalanceForChannel/{id} | GET | 1500 |
| ALTA | /DistributionNetwork/GetByChannel/{id} | GET | 1500 |
| ALTA | /NetworkMember/GetByChannel/{id} | GET | 1500 |
| ALTA | /DistributionChannelCreationRequest | POST | 1500 |
| ALTA | /Credentials | POST | 1500 |
| ALTA | /AuthorizedUser | GET/POST | 1500 |
| ALTA | /AccountPayableFromChannel | GET/POST | 1500 |

---

## Modulo 2: Facturacion y Cobranza

**Host**: `billing.v1130.policysense.solutions`
**Base path**: `/rest/billing/v1`
**Criticidad**: ALTA

### Entidades de negocio

| Entidad | Descripcion | Campos clave |
|---------|-------------|-------------|
| Factura de prima | Documento con obligacion de pago | Numero unico, sistema origen, fechas emision/vencimiento, moneda, frecuencia, poliza |
| Concepto de facturacion | Desglose de la factura | Prima neta, recargos, descuentos, impuestos, derechos emision |
| Ente de cobro | Banco/procesador de pago | Visa, Mastercard, bancos locales |
| Lote de cobro | Agrupacion de instrucciones de cobro | Fecha presentacion, fecha cobro, ente, moneda, tipo agrupacion |
| Movimiento bancario | Registro de cuenta bancaria | Banco, ID movimiento, fecha, descripcion, estado, importe |
| Cadena ejecutable (morosidad) | Secuencia automatizada de acciones por mora | Recordatorio -> notificacion -> suspension -> anulacion |

### Estados de factura

| Estado | Descripcion |
|--------|-------------|
| Pendiente | Generada pero no cobrada |
| Pagada (parcial/total) | Pago manual registrado |
| Liquidada | Banco confirmo cobro (dinero puede no estar aun en cuenta) |
| Anulada | Factura cancelada |

### Estructura de una factura

1. **Datos generales**: numero unico, fechas, periodo, moneda, frecuencia, referencia poliza, sistema origen
2. **Datos del tomador/pagador**: identificacion, razon social, direccion fiscal, canal asociado
3. **Conceptos de facturacion**: prima, recargos (fraccionamiento), descuentos (fidelidad), impuestos (IVA, ISR)
4. **Movimientos facturables** (colectivas): altas, bajas, endosos con efecto en prima, ajustes prorrateados
5. **Totales**: subtotales y total final
6. **Estado y relacion con cobranza**: historia completa

### Filosofia de "Herencia de Reglas"

Billing NO cuestiona el riesgo, solo lo monetiza. Todas las reglas vienen del Disenador de Productos:
- Frecuencias de pago permitidas (mensual, trimestral, semestral, anual)
- Metodos de pago (tarjeta, domiciliacion, efectivo, transferencia)
- Factor de fraccionamiento (ej: 5% recargo por pago mensual)
- Periodo de gracia (dias configurables por producto)
- Conceptos de facturacion por cobertura
- Titular de factura (contratante, asegurado, tercero)

### Flujo completo del dinero

```
1. Rating Engine: calcula prima neta, impuestos, recargos, derechos emision
2. PolicyAdmin: consolida poliza, envia mensaje Kafka a Billing
3. Billing: genera TODAS las facturas de la vigencia de una vez
   (ej: poliza anual trimestral = 4 facturas inmediatas)
4. Distribution Management: calcula y paga comisiones
5. Co/Reaseguro: distribuye primas segun participacion
6. ERP Contable: recibe asientos contables
```

### Tipos de transacciones que generan facturacion

- **Emisiones**: primera facturacion, genera N facturas segun frecuencia
- **Renovaciones**: nuevo conjunto de facturas (automaticas o manuales)
- **Endosos**: facturas de diferencia de prima (cobro adicional o nota de credito)
- **Altas/bajas colectivos**: facturacion por movimiento
- **Anulaciones**: notas de credito por prima no devengada
- **Valores garantizados vida**: seguro saldado, prorrogado, rescates, prestamos

### Reglas criticas

- **Generacion anticipada**: todas las facturas se crean al momento de emision (no "sobre la marcha")
- **Secuencialidad de pagos**: facturas deben pagarse en orden cronologico
- **Pagos parciales**: permitidos, factura queda con saldo pendiente
- **Comisiones**: pueden liberarse al liquidar (confianza en banco) o al recibir dinero en cuenta (configurable)
- **Netting**: compensacion de comisiones contra deudas pendientes

### Proceso de cobro automatico (lotes)

```
1. Crear lote: fecha presentacion, fecha cobro, ente, moneda, tipo agrupacion
   - Por documento: cada factura = instruccion separada
   - Por pagador: facturas del mismo cliente = 1 instruccion consolidada
2. Generar archivo bancario: header + detalle + trailer (formato especifico por banco)
3. Enviar a ente de cobro
4. Recibir respuesta: satisfactorio/rechazado por paquete
5. Procesar respuesta: actualizar facturas, registrar movimiento bancario
6. Imputar lote: conciliar pago del banco a la compania
```

**Tiempos respuesta banco**: 1-2 dias cuentas bancarias, hasta 15 dias tarjetas credito.

### Gestion de morosidad (cadena ejecutable)

```
Pre-vencimiento: recordatorio automatico
Vencimiento: factura vencida, poliza sigue activa durante periodo de gracia
Post-gracia: notificacion factura vencida
Propuesta: acuerdo de pago
Suspension: cobertura suspendida
Anulacion: automatica por falta de pago
```

### Endpoints criticos para pruebas

| Prioridad | Endpoint | Metodo | SLA (ms) |
|-----------|---------|--------|----------|
| ALTA | /Bill/BillsByPolicy | GET | 2000 |
| ALTA | /Bill/BillsByClient | GET | 2000 |
| ALTA | /BillingOrder/BillingPolicyIssue | POST | 2000 |
| ALTA | /Evaluate (BusinessRules) | POST | 2000 |

---

## Modulo 3: Policy Admin

**Host**: `policyadmin.testview.policysense.solutions`
**Base paths**: `/rest/policyadmin/v1`, `/rest/ratingservice/v1`, `/rest/underwritingservice/v1`
**Criticidad**: ALTA

### Entidades de negocio

| Entidad | Descripcion | Campos clave |
|---------|-------------|-------------|
| Poliza | Contrato de seguro | Numero oficial, producto, plan, ramo, vigencia, estado, version |
| Cotizacion (Quotation) | Oferta pre-emision | QuotationId, producto, coberturas, prima calculada |
| Solicitud (Application) | Propuesta del cliente | Datos asegurado, coberturas solicitadas |
| Endoso | Modificacion a poliza vigente | Tipo (puntual/multiple), facturable/no facturable |
| Cobertura | Componente del seguro | Suma asegurada, deducible, exclusiones, prima |
| Certificado | Asegurado dentro de colectiva | Vigencia propia, coberturas, primas individuales |
| Division | Agrupacion de certificados | Sucursal, departamento, segmento |
| Cadena ejecutable | Orquestador de acciones automaticas | Secuencia: calcular prima -> aprobar -> generar PDF -> notificar |

### Ramos y productos soportados

**Seguros Generales**: Automoviles, SOAT/SOAP, Incendio, Responsabilidad Civil, Transporte, Robo, Ingenieria, Accidentes Personales, Equipos Electronicos, Embarcaciones, Mascotas, Aviacion, Todo Riesgo Construccion, PYMEs, Multirriesgo Hogar, Fianzas

**Seguros de Vida**: Temporal, Vitalicia, Universal, con Ahorro/Inversion, mixtos, individual, colectivo. Incluye reservas matematicas, valores garantizados (saldado, prorrogado, rescate, prestamo, caducacion).

**Seguros de Salud**: Individual, familiar, corporativo. Coberturas hospitalarias, ambulatorias, gastos mayores. Periodos de carencia. Renovacion con ajuste por rango etario.

### Modos de creacion de polizas

1. **Forma Express** (portal): solicitud + cotizacion + emision inmediata, productos simples/enlatados
2. **Forma Estandar** (backoffice): solicitud -> cotizacion -> hoja suscripcion -> poliza, productos complejos
3. **APIs REST**: integraciones B2B (bancaseguro, retail, embedded), motor central sin UI
4. **Cargas masivas**: desde Excel, alto volumen (seguros masivos, colectivos)

### Flujo de emision de poliza

```
1. Seleccion producto/plan (Disenador de Productos)
2. Datos asegurado, beneficiarios, participantes (repositorio clientes)
3. Coberturas, sumas aseguradas, deducibles, exclusiones
4. Calculo prima (Rating Engine via Kafka o REST)
5. Calculo comision (Distribution Management via Kafka)
   - Verifica canal autorizado, licencia vigente, estado canal
   - Calcula escalera de comisiones por cobertura
6. Verificacion reaseguro (App Co/Reaseguro)
   - Tabla de capacidades automaticas o consulta App Reaseguro
   - Si falta capacidad: colocacion facultativa (poliza espera)
7. Validacion reglas de negocio (microflujos, workflows Kernel)
8. Emision y numeracion automatica
9. Generacion documento contractual PDF
10. Publicacion via Kafka -> Billing, Distribution, Reaseguro, ERP
```

### Cadenas ejecutables (motor de automatizacion)

Secuencia orquestada de acciones parametrizable, sin programacion:

| Accion | Tipo |
|--------|------|
| Calcular prima | Microflujo -> Rating Engine |
| Solicitar firma | Integracion firma electronica |
| Generar PDF | Document Generation Service |
| Pedir aprobacion | Workflow Kernel (asincrono) |
| Ejecutar microflujo | Proceso interno encapsulado |
| Cambiar estado | Vigente, suspendida, cancelada |
| Enviar mensaje | Notificacion/correo |
| Generar tarea | Asignacion a usuario/rol |

**Ejemplo emision**: Calcular Prima -> Validar Reglas -> Generar PDF -> Solicitar Firma -> Registrar ERP -> Notificar Asegurado

### Tipos de endosos

**Puntuales** (un aspecto a la vez): cambio direccion, coberturas, fecha efecto, frecuencia pago
**Mediante forma estandar** (multiples cambios simultaneos): usa formato similar a emision

**Clasificacion**:
- Facturables: cambio coberturas, suma asegurada, altas/bajas colectivos
- No facturables administrativos: correccion datos, direccion
- No facturables financieros: cambio medio/frecuencia pago
- No facturables contractuales: inclusion/exclusion asegurados, cambio plan

**Efecto en facturacion**: genera facturas NUEVAS adicionales (no modifica originales). Prorrateo desde fecha endoso.

### Cancelacion de poliza

```
1. Registro solicitud/evento cancelacion (tabla causas parametrizable)
2. Validacion causas y condiciones devolucion
3. Calculo prima no devengada (reserva riesgo en curso)
4. Notificacion Cobranzas -> facturas devolucion -> clawback comisiones
5. Notificacion Reaseguro -> cesiones correspondientes
6. Emision carta cancelacion (opcional, configurable)
```

**Causa**: solicitud cliente, falta pago, termino vigencia, anulacion por error.
**Vida**: NO usar cancelacion, usar valores garantizados (rescate total/caducacion).

### Pre-renovacion y renovacion

**Pre-renovacion** (batch, 8-10 semanas antes vencimiento):
- Ejecuta herramientas de analisis parametrizables:
  - Experiencia de pago (promedio atraso en dias, luz amarilla/roja)
  - Lealtad (descuento por antiguedad)
  - Experiencia siniestral (% siniestralidad, numero siniestros)
  - Otras polizas (descuento por cantidad)
  - Churning Risk (riesgo de no renovacion, roadmap)
- Clona poliza con fechas actualizadas (registro inactivo)
- Detecta necesidad de indexacion y re-tarificacion
- Verifica capacidad reaseguro (facultativo si necesario)

**Renovacion** (batch principal, genera primas):
- Toma polizas de RenewalAnalysisPerPolicy
- Activa registro clonado en pre-renovacion
- Genera nuevas facturas via Billing

### Polizas colectivas y masivas

| Dimension | Colectiva | Masiva | Embebida |
|-----------|-----------|--------|----------|
| Contrato | Poliza madre + certificados | Polizas estandarizadas | Polizas via APIs |
| Volumen | Medio/Alto | Muy alto | Alto |
| Canal | Empresas, brokers | Bancos, retail | Plataformas digitales |
| Interfaz | Backoffice/Portales | Cargas masivas | Plataforma del socio |
| Personalizacion | Media/Alta | Baja | Baja/Media |

**Facturacion colectiva**: por movimientos (alta/baja genera movimiento pendiente), consolidacion periodica o a demanda, a nivel poliza madre o por division.

### Endpoints criticos para pruebas

| Prioridad | Endpoint | Metodo | SLA (ms) |
|-----------|---------|--------|----------|
| ALTA | /quotation | POST | 2000 |
| ALTA | /quotation | GET | 2000 |
| ALTA | /quotation/all | GET | 2000 |
| ALTA | /quotation/life | POST | 2000 |
| ALTA | /quotation/broker | GET | 2000 |
| ALTA | /quotation/allbyclient | GET | 2000 |
| ALTA | /quotationcoverage | GET | 2000 |
| ALTA | /Risk/BasicAnnualPremiumForAllCoverage | POST | 2000 |
| ALTA | /Risk/GrossAllModalPremiumForAllCoverages | POST | 2000 |
| ALTA | /requirement/getbyclient | GET | 2000 |
| ALTA | /requirement/getpendingbychannel | GET | 2000 |
| ALTA | /underwritingcase/getbyfilter | GET | 2000 |
| ALTA | /Evaluate (BusinessRules) | POST | 2000 |
| ALTA | /healthdeclaration | POST | 2000 |
| ALTA | /product | GET | 2000 |

---

## Modulo 4: Reaseguro

**Host**: `reinsurance.v1130.policysense.solutions`
**Criticidad**: MEDIA

### Entidades de negocio

| Entidad | Descripcion |
|---------|-------------|
| Contrato (Treaty) | Acuerdo automatico obligatorio para un ramo/linea |
| Cesion | Parte del riesgo transferida al reasegurador |
| Colocacion facultativa | Cesion caso por caso para riesgos atipicos |
| Reasegurador | Compania que acepta el riesgo cedido |
| Bordereaux | Reporte periodico de cesiones para conciliacion |
| Cuenta corriente | Saldos entre cedente y reasegurador |
| Notificacion | Mensaje del App Polizas solicitando verificacion capacidad |
| Ramo de reaseguro | Puede diferir de ramos comerciales (ej: Multirriesgo Hogar -> Incendio + Robo + RC) |

### Principio fundamental: Atomizacion del riesgo

Una poliza puede descomponerse en multiples "riesgos de reaseguro", cada uno con su propia distribucion. Ejemplo: poliza Multirriesgo del Hogar -> riesgos de Incendio, Robo, Responsabilidad Civil.

### Tipos de reaseguro soportados

**Segun forma de contratacion**:
- Obligatorio (Treaty): automatico para todo un ramo, reasegurador no evalua cada riesgo
- Facultativo: caso por caso, para riesgos atipicos o que exceden tratado

**Segun participacion (Proporcional)**:
- **Cuota Parte (Quota Share)**: todo se reparte en mismo %, simple y estable
  - Ejemplo: 60-40 -> reasegurador recibe 40% prima, paga 40% siniestros
- **Excedente (Surplus)**: reasegurador solo participa por encima de retencion
  - Lineas/plenos = multiplos de retencion (ej: 4 lineas x 200K = 800K capacidad)
  - Si riesgo < retencion: tratado no participa
- **Facultativo-Obligatorio (Facob)**: cedente decide si usa contrato, reasegurador obligado a aceptar

**Combinaciones frecuentes**:
```
Retencion propia (linea compania): 200K
+ Cuota Parte 50%: 200K
+ 1er Excedente (3 lineas): 600K
+ 2do Excedente (2 lineas): 400K
= Capacidad total: 1.4M
```

**Segun participacion (No Proporcional)**:
- **XL Risk** (Exceso Perdida por Riesgo): protege contra perdidas grandes de un solo riesgo
  - Ejemplo: 100K xs 50K = asegurador paga primeros 50K, reasegurador hasta 100K adicionales
- **Cat XL** (Exceso Perdida por Evento): catastrofes naturales, puede cubrir varios ramos
  - Ejemplo: 50M xs 10M por evento
- **Stop Loss**: protege siniestralidad anual del portafolio
  - Ejemplo: reasegurador cubre exceso de 120% de prima ganada

### Coaseguro

- Multiples aseguradoras comparten un mismo riesgo
- Asegurador lider coordina
- Distribucion proporcional: primas, siniestros, gastos (mismos porcentajes)
- Saldo = Prima cedible - siniestros - gastos
- Cuenta de coaseguro reporta saldo a favor/en contra de cada coasegurador

### Flujo de reaseguro cedido

```
1. PolicyAdmin emite poliza -> notificacion a App Reaseguro via Kafka
2. App Reaseguro verifica capacidad automatica
   - Si suficiente: calcula distribucion, genera cesiones automaticas
   - Si insuficiente: genera tarea en bandeja usuarios reaseguro
   - Colocacion facultativa manual -> poliza espera hasta "luz verde"
3. Cada notificacion genera respuesta auditable
4. Cesion de primas generada automaticamente
5. Bordereaux periodico para conciliacion
```

### Reaseguro aceptado

- Policysense puede gestionar reaseguro facultativo aceptado (aseguradora actua como reaseguradora)
- Solo facultativo por riesgo individual
- Transacciones llegan desde sistemas externos
- Registro sin intervencion en emision (riesgo originado externamente)

### Cumulos de riesgo

- Dos o mas polizas que constituyen un mismo riesgo tecnico
- Personas: mismo asegurado en multiples polizas (facil de detectar)
- Autos: mismo vehiculo (VIN/placa, casi inexistente)
- Incendio: riesgos colindantes (complejo, requiere coordenadas geograficas)
- App Polizas detecta y codifica cumulos, avisa a App Reaseguro

### Endpoints criticos para pruebas

| Prioridad | Endpoint | Metodo | SLA (ms) |
|-----------|---------|--------|----------|
| ALTA | /Evaluate (BusinessRules) | POST | 2000 |
| ALTA | Cesion automatica (flujo Kafka) | -- | 3000 |
| ALTA | Bordereaux generacion | GET | 10000 |

---

## Modulo 5: Siniestros

**Host**: `claims.v1130.policysense.solutions`
**Base path**: `/rest/fnol/v1`
**Criticidad**: ALTA

### Entidades de negocio

| Entidad | Descripcion | Campos clave |
|---------|-------------|-------------|
| Siniestro | Evento que genera reclamo | Numero unico, poliza, fecha ocurrencia, tipo, estado |
| Caso | Reclamo independiente dentro de un siniestro | Reclamante, coberturas afectadas, reservas, pagos |
| FNOL | First Notice of Loss (notificacion) | Numero FNOL, numero siniestro (asignados separadamente) |
| Reserva | Estimacion financiera de obligacion | Inicial, estimado ajustado, autorizada, autorizada pendiente, pagado |
| Tipo de siniestro | Clasificacion parametrizable por producto | Define flujo de trabajo, requerimientos, cuestionario, metodo reserva |
| Requerimiento | Documento/evidencia solicitada al reclamante | Estado (solicitado, recibido, aprobado), sin limite de cantidad |
| Ajustador | Profesional de campo | Asignado por caso, usa App movil |
| Pago | Desembolso de indemnizacion | A beneficiario, proveedor, tercero autorizado |
| Recuperacion | Subrogacion, salvamento, recupero reaseguro | Reduce impacto financiero automaticamente |

### Tipos de siniestro (ejemplos Auto)

- Accidente con heridos
- Accidente sin heridos
- Robo del auto
- Rotura del parabrisas
- Servicio en la via

Cada tipo define: requerimientos a solicitar, cuestionario, metodo de reserva inicial, flujo de trabajo especifico.

### Etapas del proceso (4 fases fundamentales)

| Fase | Actividades |
|------|-----------|
| **Notificacion** | FNOL, validacion poliza/coberturas, registro siniestro, asignacion casos |
| **Analisis** | Estimacion y control de reservas, investigacion |
| **Cumplimiento** | Procesamiento de pagos y recuperaciones |
| **Cierre** | Cierre caso, actualizacion cuentas reaseguro, info a Analytics |

### FNOL -- Canales de notificacion

1. Portal de siniestros (web)
2. App movil de siniestros
3. Backoffice (empleados, call center)
4. APIs REST

### Flujo detallado del FNOL

```
1. Identificar reclamante y poliza
   - Por numero poliza, telefono, cedula, placa, VIN, o cualquier campo "summary"
   - Tambien terceros afectados (no aparecen en poliza)
2. Datos basicos: fecha/hora ocurrencia, tipo siniestro, lugar
3. Si emergencia: flujo acelerado
4. Seleccionar cobertura(s) afectada(s)
5. Solicitud asistencias (grua, transporte, ambulancia)
6. Atencion emergencias
7. Eventos catastroficos (deteccion automatica probabilidad + indicacion manual)
8. Solicitud requerimientos (segun tipo siniestro parametrizado)
9. Cuestionario segun tipo siniestro
10. Imagenes, videos, documentos opcionales
```

### Al finalizar FNOL, Policysense ejecuta:

1. Crea siniestro (numero unico) -- excepto si es nuevo reclamante de siniestro existente
2. Crea caso dentro del siniestro
3. Establece reserva inicial segun metodo parametrizado:
   - Por total capital asegurado de cobertura afectada
   - Por costo medio de anos anteriores
   - Manual
4. Genera observaciones: primas atrasadas, siniestros previos, deducibles, exclusiones, coaseguro

### Concepto de "Casos"

Un siniestro puede tener multiples casos (reclamos independientes del mismo evento).
Ejemplo accidente auto: 1 caso vehiculo propio + 3 casos terceros danados = 4 casos.
Cada caso tiene su propia notificacion, reservas y pagos.

### Directorio de polizas

El App Siniestros contiene un directorio minimo de todas las polizas:
- Numero, fechas validez, clientes/beneficiarios
- Campo "summary" con datos de busqueda (telefono, placa, VIN, direccion)
- Se actualiza automaticamente al emitir cada poliza
- Al ocurrir siniestro: pide info completa al core y guarda copia local

### Estados de reserva (flujo con ejemplo numerico)

| Estado | Descripcion |
|--------|-------------|
| Reserva inicial | Automatica al registrar siniestro (no se modifica, pagos no se hacen sobre esta) |
| Estimado ajustado | Actualizacion con mas info (ajustador, cotizaciones). Cambia multiples veces |
| Reserva autorizada | Monto aprobado por supervisor. Total autorizado acumulado |
| Autorizada pendiente | Remanente autorizado no utilizado |
| Pagado | Total desembolsado |

**Ejemplo completo**:
```
Paso 1: Registro siniestro Hogar/Incendio. Costo medio = 100K
  -> Inicial=100K, Ajustado=0, Autorizada=0, Pendiente=0, Pagado=0

Paso 2: Ajustador estima 80K
  -> Inicial=100K, Ajustado=80K, Autorizada=0, Pendiente=0, Pagado=0

Paso 3: Aprobacion por 80K
  -> Inicial=100K, Ajustado=80K, Autorizada=80K, Pendiente=80K, Pagado=0

Paso 4: Pago de 80K
  -> Inicial=100K, Ajustado=80K, Autorizada=80K, Pendiente=0, Pagado=80K

Paso 5: Cliente presenta evidencia adicional 30K
  -> Inicial=100K, Ajustado=110K, Autorizada=80K, Pendiente=0, Pagado=80K

Paso 6: Aprobacion adicional 30K
  -> Inicial=100K, Ajustado=110K, Autorizada=110K, Pendiente=30K, Pagado=80K

Paso 7: Pago final 30K
  -> Inicial=100K, Ajustado=110K, Autorizada=110K, Pendiente=0, Pagado=110K
```

### Controles de seguridad en reservas

- Validaciones automaticas: no superar limites por tipo usuario/nivel jerarquico
- Bloqueo por inconsistencias poliza/cobertura/monto
- Registro todas aprobaciones/rechazos con sello tiempo y usuario
- Integracion centro mensajes seguros para aprobaciones pendientes

### Pagos de siniestro

- A beneficiario/asegurado directo
- A proveedores via procuraduria
- A traves de sistemas contables externos
- Validacion: monto no excede reserva aprobada, cobertura corresponde al siniestro
- Actualiza saldo reserva automaticamente

### Recuperaciones

- Subrogacion (cobro a tercero responsable)
- Salvamentos (valor residual de bienes danados)
- Recupero de reaseguro (cesiones de siniestros)
- Impacto financiero automatico en modulos correspondientes

### Cierre del siniestro

```
1. Confirmar: no existen reservas pendientes
2. Verificar: todas las tareas del flujo completadas
3. Generar reporte cierre
4. Actualizar cuentas tecnicas reaseguro
5. Enviar info a Analytics (indicadores, estadisticas de perdidas para diseno productos)
```

### Endpoints criticos para pruebas

| Prioridad | Endpoint | Metodo | SLA (ms) |
|-----------|---------|--------|----------|
| ALTA | /BasicInformation (FNOL) | GET | 2000 |
| ALTA | FNOL crear siniestro | POST | 5000 |
| ALTA | Reservas (crear/ajustar) | POST/PUT | 3000 |
| ALTA | Pagos siniestro | POST | 5000 |
| ALTA | /Evaluate (BusinessRules) | POST | 2000 |

---

## Modulo 6: Admin Usuarios

**Host**: `usermanagement.v1130.policysense.solutions`
**Criticidad**: BAJA

### Modelo de acceso (RBAC)

Tres capas: Usuarios -> Roles por aplicacion -> Permisos

**Los roles NO se asignan directamente al usuario**. Se configuran por estructura organizacional:
- Usuarios internos: Cargo dentro de Unidad de Negocio -> hereda roles automaticamente
- Usuarios externos: Perfil -> asociado a roles por aplicacion

### Entidades de negocio

| Entidad | Descripcion |
|---------|-------------|
| Usuario | Nombre, email (unico), unidad negocio, cargo, perfil, estado |
| Rol | Conjunto permisos por aplicacion (ej: Underwriter en PolicyAdmin) |
| Unidad de negocio | Division organizacional (Siniestros, Suscripcion, Finanzas, Reaseguro, Operaciones, TI) |
| Cargo | Posicion jerarquica (Analista, Supervisor, Gerente, Director, Admin sistema) |
| Grupo de usuarios | Estructura logica para workflows (Analistas Siniestros, Ajustadores, Supervisores Suscripcion) |
| Perfil externo | Config acceso para usuarios externos (proveedores, talleres, medicos, brokers, ajustadores) |

### Estados del usuario

| Estado | Descripcion |
|--------|-------------|
| Nuevo | Recien creado |
| Activo | En operacion |
| Inactivo | Deshabilitado |
| Bloqueado | Por intentos fallidos o accion admin |
| Pendiente de Aprobacion | Requiere autorizacion |

### Interfaces de acceso

| Ambiente | Usuarios tipicos | Ejemplos de tareas |
|----------|-----------------|-------------------|
| Backoffice | Empleados, supervisores, auditores | Siniestros, reservas, pagos, seguimiento |
| Portal Web | Clientes, brokers, talleres, medicos | Consulta estado, documentos, cotizaciones |
| App Movil | Ajustadores, inspectores | Ordenes, inspeccion danos, fotos, reportes |

### Tipos de usuario SMC (Secure Message Center)

Administrador, Canal de Distribucion, Cliente, Empleado Back Office, Empleado Front Office, Proveedor

### Grupos de usuarios (uso en workflows)

- Aprobaciones de reservas
- Aprobaciones de pagos
- Aprobadores de usuarios
- Revision de casos
- Validacion de documentos

### Ejemplo asignacion roles

| Cargo: Suscriptor | Unidad: Negocios |
|---|---|
| POLICYADMIN | Underwriter |
| SECUREMESSAGECENTER | BackOfficeEmployee |
| FEEDBACK | User |

### Buenas practicas

- Principio minimo privilegio
- Revisiones periodicas de roles
- Desactivar cuentas de ex-empleados
- No compartir credenciales
- Mantener estructura organizacional actualizada

### Endpoints criticos para pruebas

| Prioridad | Endpoint | Metodo | SLA (ms) |
|-----------|---------|--------|----------|
| ALTA | Login/Auth (OAuth2) | POST | 1000 |
| ALTA | Consulta permisos | GET | 500 |
| MEDIA | CRUD usuarios | GET/POST/PUT | 2000 |
| MEDIA | Consulta consolidado usuarios | GET | 2000 |

---

## SLAs consolidados por modulo

| Modulo | Operacion | SLA P95 | Justificacion |
|--------|-----------|---------|---------------|
| Distribution | Registro canal (onboarding) | < 5000ms | Formulario extenso, validacion docs |
| Distribution | Consulta canal | < 1500ms | Lectura frecuente |
| Distribution | Calculo comision escalera | < 3000ms | CPU intensivo, multinivel |
| Distribution | Acuerdos economicos | < 1500ms | Lectura |
| Facturacion | Orden facturacion (emision) | < 3000ms | Genera N facturas |
| Facturacion | Consulta facturas poliza/cliente | < 2000ms | Alta frecuencia |
| Facturacion | Operacion manual cobro | < 2000ms | Critico financiero |
| Facturacion | Proceso lote cobro | < 10000ms | Batch |
| Policy Admin | Crear cotizacion | < 2000ms | Motor riesgo |
| Policy Admin | Calculo prima (Rating Engine) | < 2000ms | CPU intensivo |
| Policy Admin | Emision poliza (cadena completa) | < 5000ms | Transaccion compleja multi-servicio |
| Policy Admin | Endoso | < 4000ms | Modificacion + recalculo |
| Policy Admin | Renovacion en linea | < 5000ms | Batch filtrado |
| Reaseguro | Verificacion capacidad (notificacion) | < 3000ms | CPU intensivo |
| Reaseguro | Cesion automatica | < 3000ms | Calculo proporciones |
| Reaseguro | Bordereaux | < 10000ms | Batch/reporte pesado |
| Siniestros | FNOL (crear siniestro) | < 5000ms | Critico operacional |
| Siniestros | Consulta siniestro/caso | < 2000ms | Alta frecuencia |
| Siniestros | Ajuste reserva + aprobacion | < 3000ms | Financiero |
| Siniestros | Pago siniestro | < 5000ms | Critico financiero |
| Usuarios | Login/Auth OAuth2 | < 1000ms | UX critico |
| Usuarios | Consulta permisos | < 500ms | Cada request |

---

## Datos de prueba recomendados

### CSVs por modulo

**canales.csv**: tipo_canal, nivel, estado, codigo, licencia_vigente, tipo_red, nivel_jerarquia, tiene_acuerdo_economico
- Tipos: Agente_Empleado, Agente_Exclusivo, Broker, Bancaseguro, Digital, Retail
- Niveles: En_entrenamiento, Basico, Avanzado, Experto, Novel, Promotor_Calificado, Promotor_Experto
- Estados: En_reclutamiento, Activo, Suspendido_temporal, Suspendido_definitivo

**polizas.csv**: numero, ramo, producto, estado, tipo_poliza, tomador_id, canal_id, vigencia_inicio, vigencia_fin, frecuencia_pago, moneda
- Ramos: Auto, Vida, Salud, Incendio, RC, Transporte, Hogar, PYME
- Tipos: Individual, Colectiva, Masiva, Embebida
- Frecuencias: Mensual, Trimestral, Semestral, Anual

**facturas.csv**: numero, poliza_id, monto, estado, fecha_vencimiento, concepto, moneda, pagador_id
- Estados: Pendiente, Pagada_parcial, Pagada_total, Liquidada, Anulada

**siniestros.csv**: numero, poliza_id, tipo_siniestro, estado_fase, fecha_ocurrencia, cobertura_afectada, reserva_inicial, estimado_ajustado, reserva_autorizada, pagado
- Fases: Notificacion, Analisis, Cumplimiento, Cierre
- Tipos (Auto): Accidente_con_heridos, Accidente_sin_heridos, Robo, Rotura_parabrisas, Servicio_via

**reaseguro.csv**: contrato_id, tipo_contrato, tipo_participacion, reasegurador, retencion, capacidad_lineas, porcentaje_cesion, ramo_reaseguro
- Tipos contrato: Obligatorio, Facultativo
- Participacion: Cuota_Parte, Excedente, Facob, XL_Risk, Cat_XL, Stop_Loss

**usuarios.csv**: nombre, email, unidad_negocio, cargo, estado, tipo_usuario_smc
- Unidades: Siniestros, Suscripcion, Finanzas, Reaseguro, Operaciones, TI
- Cargos: Analista, Supervisor, Gerente, Director, Admin_sistema
- Estados: Nuevo, Activo, Inactivo, Bloqueado, Pendiente_Aprobacion

---

## Casos de prueba criticos por modulo

### Distribution Management
1. **Onboarding completo**: crear canal -> validar docs -> asignar red -> acuerdo economico -> activar
2. **Calculo comision escalera 4 niveles**: venta por nodo inferior, verificar distribucion a todos los niveles
3. **Cambio estado con aprobacion**: En reclutamiento -> Activo (workflow)
4. **Suspension por licencia vencida**: verificar que canal no puede vender
5. **Carga masiva red bancaria**: Excel con N empleados, verificar creacion nodos

### Facturacion y Cobranza
1. **Emision -> facturacion completa**: poliza anual trimestral = 4 facturas generadas
2. **Lote de cobro**: crear lote, generar archivo, procesar respuesta, imputar
3. **Operacion manual multimoneda**: cobro manual con conciliacion
4. **Cadena morosidad**: vencimiento -> gracia -> recordatorio -> suspension -> anulacion
5. **Endoso con impacto facturacion**: generar facturas adicionales prorrateadas

### Policy Admin
1. **Emision poliza individual (cadena completa)**: cotizacion -> prima -> comision -> reaseguro -> emision -> facturacion
2. **Emision colectiva con carga masiva**: poliza madre + N certificados desde Excel
3. **Endoso multiple**: cambio coberturas + beneficiario + clausula en una transaccion
4. **Renovacion batch**: pre-renovacion (analisis) + renovacion (activacion + facturacion)
5. **Cancelacion con devolucion**: cancelacion -> notas credito -> clawback comisiones -> aviso reaseguro

### Reaseguro
1. **Cesion automatica cuota parte**: emision poliza -> distribucion proporcional automatica
2. **Excedente con multiples lineas**: riesgo que llena 1er y 2do surplus
3. **Colocacion facultativa**: riesgo excede capacidad automatica -> espera -> colocacion manual -> luz verde
4. **Bordereaux periodico**: generacion reporte conciliacion con reasegurador
5. **Coaseguro**: distribucion prima/siniestro/gastos entre multiples aseguradoras

### Siniestros
1. **FNOL completo (backoffice)**: identificacion -> tipo siniestro -> coberturas -> asistencias -> requerimientos -> cuestionario
2. **Siniestro con multiples casos**: accidente auto con 4 afectados = 4 casos independientes
3. **Flujo completo de reservas**: inicial -> estimado ajustado -> autorizacion -> pago -> ajuste adicional -> pago final
4. **Evento catastrofico**: FNOL con flag catastrofe -> manejo especial reaseguro
5. **Recuperacion por subrogacion**: pago siniestro -> subrogacion a tercero -> reduccion impacto

### Admin Usuarios
1. **Crear usuario interno**: asignar unidad + cargo -> herencia automatica de roles
2. **Crear perfil externo**: broker con acceso a PolicyAdmin y SMC
3. **Grupo de usuarios en workflow**: tarea dirigida a grupo, cualquier miembro puede tomarla
4. **Bloqueo por intentos fallidos**: verificar politica Auth0
5. **Auditoria de cambios**: verificar registro de todas las modificaciones

---

## Integracion entre modulos (comunicacion via Kafka)

| Emisor | Receptor | Evento | Contenido |
|--------|----------|--------|-----------|
| PolicyAdmin | Billing | Emision poliza | Datos poliza completos, coberturas, primas, comisiones |
| PolicyAdmin | Distribution | Solicitud calculo comision | Datos poliza + canal |
| PolicyAdmin | Reaseguro | Notificacion verificacion capacidad | Datos poliza, coberturas, sumas aseguradas |
| Billing | PolicyAdmin | Anulacion factura emision | Poliza afectada |
| Billing | Distribution | Liberacion comision | Factura liquidada/pagada |
| Billing | Reaseguro | Primas cobradas | Datos para bordereaux |
| Distribution | PolicyAdmin | Respuesta calculo comision | Luz verde/roja, escalera comisiones por cobertura |
| Reaseguro | PolicyAdmin | Respuesta verificacion | Capacidad OK / necesita facultativo |
| Siniestros | Reaseguro | Cesion siniestro | Bordereaux de siniestros |
| Siniestros | Billing | Consulta estado primas | Verificacion pagos al dia |
| Todos | ERP | Asientos contables | Informacion contable estructurada |

---

## NUNCA ejecutar contra produccion

Las pruebas de carga son destructivas por naturaleza. Solo ambientes QA/Staging con datos de prueba.
