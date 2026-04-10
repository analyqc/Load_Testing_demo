---
name: dominio-seguros-policysense
description: Conocimiento del dominio asegurador de Policysense — entidades, reglas de negocio, terminologia y flujos extraidos de los manuales oficiales. Usar al interpretar resultados de pruebas o validar assertions de negocio.
---

# Dominio Asegurador — Policysense ERP
Fuente: Manuales oficiales Policysense | Actualizado: 2026-04-10

## Terminologia Clave

| Termino | Definicion (contexto Policysense) |
|---------|-----------------------------------|
| **Policysense** | Plataforma core de seguros desarrollada por In Motion, basada en microservicios Mendix (low-code), desplegada en nube (GKE/AlloyDB). |
| **App** | Cada microservicio Mendix de la suite. Ej: App de Polizas, App de Siniestros. |
| **Kernel** | Nucleo operativo: seguridad, usuarios, permisos, workflows, catalogo de clientes, Disenador de Productos, Rating Engine, Centro de Mensajes Seguros (SMC), Autorizaciones, User Management. |
| **RBAC** | Role-Based Access Control. Modelo de seguridad de Policysense: permisos se asignan a roles, roles a cargos/perfiles, cargos a usuarios. |
| **Unidad de Negocio** | Division organizacional (Siniestros, Suscripcion, Finanzas, etc.). Cada usuario interno pertenece a una. |
| **Cargo** | Posicion funcional dentro de una Unidad de Negocio (Analista, Supervisor, Gerente, etc.). Determina roles heredados. |
| **Perfil Externo** | Configuracion de accesos para usuarios externos (brokers, talleres, medicos, ajustadores). |
| **Cadena Ejecutable** | Secuencia orquestada de acciones automaticas parametrizables sin programacion. Motor de automatizacion de procesos de negocio. |
| **Workflow** | Flujo de trabajo modelado graficamente en Mendix, para procesos de larga duracion con intervencion humana. |
| **Rating Engine** | Motor de tarificacion: calcula primas, tasas, recargos y descuentos. |
| **Disenador de Productos** | Configurador central de reglas de negocio por producto: coberturas, facturacion, frecuencias de pago, periodo de gracia, etc. |
| **FNOL** | First Notice of Loss. Notificacion inicial de siniestro. |
| **Bordereaux** | Reporte periodico de operaciones (primas o siniestros) enviado a reaseguradores para conciliacion. |
| **Cesion** | Transferencia de parte del riesgo a un reasegurador o coasegurador. |
| **Orden de facturacion** | Mensaje Kafka de PolicyAdmin a Billing indicando que debe facturar una poliza. |
| **Ente de cobro** | Entidad bancaria o procesador de pago configurado en Billing. |
| **Lote de cobro** | Conjunto de instrucciones de cobro agrupadas para enviar a un ente de cobro. |
| **SMC** | Secure Message Center. Sistema de comunicacion segura entre usuarios del sistema. |
| **Transformacion** | Paso de un tipo de objeto al siguiente (solicitud -> cotizacion -> poliza) sin borrar los anteriores. |
| **Pleno / Linea** | En reaseguro de excedente, multiplo de la retencion que acepta el reasegurador. |
| **Vested Commissions** | Comisiones garantizadas que el canal conserva incluso si deja la compania. |

## Policy Admin — Ciclo de Vida de Poliza

### Formas de Venta
1. **Express**: Portal autoservicio, productos simples, emision inmediata, firma electronica y cobro en linea.
2. **Estandar**: Back office, productos complejos, flujo multi-paso: solicitud -> cotizacion -> hoja suscripcion -> poliza.
3. **APIs**: Integracion con terceros (bancaseguros, retail, insurtechs) via REST/OpenAPI.
4. **Cargas masivas**: Excel/batch para aliados comerciales, sponsors de seguros masivos, embedded insurance.

### Flujo de Emision (Estandar)
```
Solicitud -> Cotizacion -> [Hoja de Suscripcion] -> Poliza
```
Cada paso es una "transformacion" que crea un nuevo objeto sin borrar el anterior.

### Cadena Ejecutable tipica de emision
```
Calcular prima (Rating Engine)
  -> Solicitar aprobacion (Workflow Kernel)
  -> Generar PDF
  -> Enviar notificacion
  -> Registrar en ERP
```

### Modelo de Datos principal
- **Poliza**: numero, fechas, estado, ramo, producto, plan, aseguradora
- **Cobertura**: riesgos cubiertos, SA, prima, deducible, exclusiones
- **Asegurado/Beneficiario**: personas vinculadas (sincronizado con repositorio de clientes)
- **Intermediario**: canal asociado (vinculo con Distribution Management)
- **Prima y Facturacion**: prima neta, impuestos, recargos, cuotas (vinculo con Billing)
- **Historial de cambios**: bitacora automatica de cada modificacion

### Operaciones de mantenimiento
| Operacion | Descripcion |
|-----------|-------------|
| **Endoso** | Modificacion a poliza vigente (cambio cobertura, SA, vehiculo, etc.). Genera factura de diferencia de prima. |
| **Renovacion** | Automatica o manual. Genera nuevo conjunto de facturas. |
| **Cancelacion** | Anticipada: genera notas de credito por prima no devengada. |
| **Reactivacion** | Restablecer poliza cancelada o suspendida. |

### Ramos soportados
- **Generales**: autos, hogar, incendio, responsabilidad civil, transporte
- **Vida**: individual, colectivo, unit-linked, ahorro
- **Salud**: individual, colectivo, gastos medicos

### Arquitectura tecnica
- Microservicios sobre Mendix (low-code)
- PostgreSQL en AlloyDB
- Comunicacion: Kafka (eventos), REST APIs (OpenAPI), Webhooks
- Orquestacion: Kubernetes (GKE)
- Cifrado: TLS 1.3 (transito), AES CBC (reposo)
- Despliegue: Azure Pipelines + Terraform (IaC)
- Monitoreo: Grafana

## Distribution Management — Canales

### Tipos de canal (parametrizables)
- Agente empleado / interno (sin niveles)
- Agente exclusivo (con niveles: En entrenamiento -> Basico -> Avanzado -> Experto)
- Broker / Corredor
- Bancaseguros (redes bancarias, carga masiva)
- Canal digital / Marketplace
- Retail / Seguros masivos (sponsor)
- Affinity (colegios profesionales, clubes)
- Embedded insurance (sponsor con connotacion legal distinta)

### Estados de canal (parametrizables por compania)
| # | Estado | Puede vender | Detiene pagos | Requiere acuerdo economico |
|---|--------|-------------|---------------|---------------------------|
| 1 | En reclutamiento | No | N/A | Opcional |
| 2 | Activo | Si | No | Si |
| 3 | Suspendido temporal | No | Configurable | Configurable |
| 4 | Suspendido definitivo | No | Si | No |

### Transiciones de estado
- En reclutamiento -> Activo: **requiere aprobacion** (workflow)
- Cualquiera -> Suspendido temporal: sin condiciones
- Las transiciones son parametrizables y pueden requerir aprobacion

### Niveles de canal (ejemplo Agente exclusivo)
| Nivel | Puede vender | Puede usar portal | Puede pedir prestamos |
|-------|-------------|-------------------|----------------------|
| En entrenamiento | No | Configurable | No |
| Basico | Si | Si | Configurable |
| Avanzado | Si | Si | Si |
| Experto | Si | Si | Si |

Las reglas de transicion entre niveles son parametrizables. No se puede saltar niveles (ej: "En entrenamiento" no puede pasar directo a "Experto").

### Jerarquias y Escalera de Comisiones
- Redes jerarquicas multinivel (nacional -> regional -> sucursal -> agente)
- **Escalera de comisiones**: distribucion de la comision entre los niveles de la jerarquia
- Plantillas de escalera reutilizables
- Participacion publica (visible en poliza) vs participacion privada (confidencial)
- Buena practica: crear plantillas de (n+2) o (n+3) niveles para anticipar crecimiento

### Acuerdos Economicos
Cada canal debe tener un acuerdo economico valido para operar. Estructura:
1. **Datos basicos** y **datos fiscales**
2. **Cuadros de comision**: como se calcula la comision por negocio
3. **Beneficios**: compensaciones adicionales:
   - Cantidad fija (gastos operativos)
   - Porcentaje sobre KPI (bono por desempeno)
   - Calculo personalizado
   - Subsidio (ingreso minimo garantizado, con o sin devolucion)
   - Prestamo (con devolucion pre-acordada)
   - Poliza de seguros (salud, vida para el canal)
   - Fondo de retiro
4. **Condiciones**: ej. haber vendido > X en trimestre anterior

Los acuerdos tienen **versionamiento** con fecha inicio/fin. Duracion tipica: 12-36 meses.

### Calculo de Comisiones (flujo)
```
1. PolicyAdmin emite/cotiza poliza
2. PolicyAdmin -> Kafka -> Distribution Management (pide calculo)
3. DM verifica: canal activo, cumple normas
4. DM recupera escalera de comisiones del canal
5. DM calcula % por cada nodo de la escalera
6. DM -> Kafka -> PolicyAdmin (devuelve resultado)
7. PolicyAdmin almacena en poliza/cotizacion
8. PolicyAdmin -> Kafka -> Billing (orden de facturacion con % comision)
9. Billing calcula monto de comision por factura
```

**Devengo de comisiones**: configurable. Opciones:
- Al facturar la prima
- Al cobrar la prima (estado "Liquidada" del banco)
- Al recibir el dinero fisicamente en la cuenta bancaria

### Comisiones garantizadas (vested)
Si un canal se retira pero tiene comisiones garantizadas, sigue recibiendo comisiones por renovaciones de su cartera. Si no las tiene, cesan al terminar la relacion.

### Redes de Distribucion
- Tipos: jerarquia publica, jerarquia privada, sociedad entre pares, red bancaria, red de retail
- Cada red define: nombre, fecha validez, tipo, max niveles, ramos/productos
- Opciones de calculo: tablas del nodo mas alto, del nodo mas bajo, o cada nodo con su propia tabla
- Soporte de sistema de puntos (bancaseguros, retail)
- Versionamiento de redes (crear borrador, revisar, activar)

### Cumplimiento y Formacion
- **Licencias**: por tipo (vida, salud, patrimoniales). Verificacion obligatoria por la compania.
- **Seguro E&O**: Errors and Omissions (responsabilidad civil profesional). Monto depende de ventas del ano anterior.
- **Entrenamientos**: catalogo de instituciones y cursos, creditos educativos, registro de cursos internos.
- **Creditos educativos**: cantidad minima anual requerida para mantener licencia vigente.

### 5 Bloques funcionales del modulo
| Bloque | Funcionalidades |
|--------|----------------|
| Compensacion | Comisiones, recuperacion, bonos, acuerdos economicos |
| Administracion | Pagos, retenciones, cuentas corrientes, workflows, metas |
| Estructura comercial | Redes, jerarquias, niveles de supervision |
| Cumplimiento y formacion | Licencias, seguros, entrenamientos, certificaciones |
| Comunicacion | Portal de agentes, chat seguro, onboarding, centro de mensajes |

## Facturacion y Cobranza

### Principio fundamental
**Billing no cuestiona el riesgo, solo lo monetiza.** Todas las reglas de negocio se heredan del Disenador de Productos.

### Funciones principales (independientes entre si)
1. **Facturacion**: Generar facturas de prima a partir de ordenes de facturacion
2. **Cobranza**: Gestionar el cobro de esas facturas

### Tipos de transacciones que generan facturacion
| Evento | Descripcion |
|--------|-------------|
| Emision | Primera facturacion de poliza nueva. N facturas segun frecuencia de pago. |
| Renovacion | Nuevo conjunto de facturas para nuevo periodo de vigencia. |
| Endoso | Factura de diferencia de prima (cobro adicional o nota de credito). |
| Alta/baja colectivo | Facturacion por movimiento en polizas colectivas. |
| Anulacion | Nota de credito por prima no devengada. |
| Valores garantizados vida | Seguro saldado, prorrogado, rescates, prestamos. |

### Generacion anticipada de facturas
Policysense genera **TODAS las facturas de la vigencia al momento de la emision**. Ej: poliza anual con pago trimestral = 4 facturas inmediatamente.

### Secuencialidad de pagos
Las facturas DEBEN pagarse en orden cronologico. No se puede pagar la del Q4 si Q1 esta pendiente.

### Estados de factura
| Estado | Significado |
|--------|-------------|
| Pendiente | Generada, no cobrada |
| Pagada (parcial/total) | Pago manual registrado |
| Liquidada | Banco confirmo el cobro (dinero puede no estar aun en cuenta) |
| Anulada | Factura cancelada |

### Estructura de una factura de primas
1. **Datos generales**: numero, fechas emision/vencimiento, periodo, moneda, frecuencia, sistema de origen
2. **Datos del tomador/pagador**: identificacion, nombre, direccion fiscal, canal
3. **Conceptos de facturacion**: prima, recargos, descuentos, impuestos/tasas/cargos legales
4. **Movimientos facturables** (colectivos): altas, bajas, endosos, ajustes prorrateados
5. **Totales**: subtotales y total a pagar
6. **Estado y cobranza**: historial completo

### Configuracion de facturacion (niveles)
| Donde | Que se configura |
|-------|-----------------|
| Disenador de Productos | Conceptos de facturacion, frecuencias de pago, metodos de pago, periodo de gracia, titular de factura |
| Kernel (settings) | Tablas de codigos |
| Kernel (User Management) | Usuarios y roles |
| App de Facturacion | Entes de cobro, plantillas bancarias, codigos de respuesta, cadenas de morosidad, reglas contables |

### Frecuencias de pago
- Anual, semestral, trimestral, mensual
- Factor de pago fraccionado configurable (ej: mensual = 1.05 = 5% recargo)
- Frecuencia base definida en producto (generalmente anual)

### Periodo de gracia
- Dias configurables por producto en "Valores por defecto"
- Factura vencida pero poliza sigue activa durante el periodo
- Acciones de morosidad se programan considerando este periodo

### Proceso de cobro automatico (lotes)
```
1. Crear lote (fecha, ente de cobro, moneda, tipo agrupacion)
2. Agrupacion: por documento (1 cargo por factura) o por pagador (1 cargo consolidado)
3. Generar archivo en formato del banco (header + detalle + trailer)
4. Enviar al banco
5. Recibir respuesta: procesado/rechazado por paquete
6. Imputar lote: asociar movimiento bancario al lote
7. Actualizar facturas automaticamente
```

### Operaciones manuales de cobro
- Cobro por medios no integrados
- Formas de pago: cheque, deposito, transferencia, tarjeta, siniestro (descuento de indemnizacion), cuenta corriente
- Estilos de busqueda: por poliza, pagador, ente de cobro, Excel, seleccion manual, lote
- Pagos parciales permitidos
- Auditoria completa de cada operacion

### Control de morosidad (cadenas ejecutables)
```
Recordatorio pre-vencimiento
  -> Notificacion factura vencida
  -> Propuesta acuerdo de pago
  -> Suspension de cobertura
  -> Anulacion automatica por falta de pago
```

### Integraciones
- **PolicyAdmin**: recibe ordenes de facturacion, notifica anulaciones
- **Distribution Management**: libera comisiones cuando factura esta liquidada/pagada
- **Reaseguro**: alimenta calculos de cesion y bordereaux de primas
- **ERP**: asientos contables automaticos
- **Facturacion electronica**: agnostico al proveedor (SUNAT, SAT/CFDI, DIAN, SII, AFIP, etc.)

### Capacidades tecnicas
- Multimoneda, multi-ente, multi-comercio (diferentes Merchant IDs)
- Tokenizacion segura de tarjetas
- IA para redaccion de mensajes de cobranza
- Analytics: reportes de aging, morosidad, dashboards

## Siniestros (Claims)

### Etapas fundamentales
```
1. NOTIFICACION
   - FNOL (First Notice of Loss)
   - Validacion poliza/coberturas
   - Registro y asignacion

2. ANALISIS
   - Estimacion y control de reservas

3. CUMPLIMIENTO
   - Pagos y recuperaciones

4. CIERRE
   - Cierre del caso
   - Envio a otros modulos
```

### Canales de FNOL
- Portal web de siniestros
- App movil de siniestros
- Back office (call center)
- APIs

### Tipo de siniestro
Concepto clave que determina el flujo de trabajo. Cada producto define sus tipos. Ejemplo para Autos:
- Accidente con heridos
- Accidente sin heridos
- Robo del auto
- Rotura del parabrisas
- Servicio en la via

Cada tipo define:
- Lista de requerimientos al reclamante
- Cuestionario especifico
- Metodo de reserva inicial
- Flujo de trabajo (workflow) parametrizable

### Casos dentro de un siniestro
Un siniestro puede tener multiples **casos** (reclamos independientes del mismo evento).
Ejemplo: accidente de auto = 1 caso propio + N casos por terceros afectados.
Cada caso puede tener su propia notificacion.

### Directorio de polizas en Siniestros
El App de Siniestros mantiene un directorio ligero de todas las polizas con datos minimos (numero, fechas, clientes, campo "summary" con telefono, placa, VIN, direccion). Se actualiza via Kafka cuando se emite cada poliza. Al ocurrir un siniestro, se obtiene la informacion completa del core.

### Reservas de siniestros pendientes

#### Estados de reserva
| Estado | Descripcion |
|--------|-------------|
| **Reserva inicial** | Automatica al registrar siniestro. No se modifica. Pagos no se hacen sobre esta. |
| **Estimado ajustado** | Actualizacion con mas informacion (ajustadores, cotizaciones). Puede cambiar varias veces. |
| **Reserva autorizada** | Monto aprobado por supervisor. Total autorizado (incluye pagado y pendiente). |
| **Autorizada pendiente** | Remanente autorizado no utilizado. |

#### Metodos de reserva inicial
- Por total del capital asegurado de la cobertura
- Por costo medio de siniestros del ano anterior
- Manual

#### Flujo de reservas (ejemplo)
```
1. Siniestro hogar/incendio, SA = 1M, costo medio = 100K
   Inicial=100K | Ajustado=0 | Autorizada=0 | Pend=0 | Pagado=0

2. Ajustador estima reparacion en 80K
   Inicial=100K | Ajustado=80K | Autorizada=0 | Pend=0 | Pagado=0

3. Analista pide aprobacion, supervisor aprueba
   Inicial=100K | Ajustado=80K | Autorizada=80K | Pend=80K | Pagado=0

4. Se paga al cliente
   Inicial=100K | Ajustado=80K | Autorizada=80K | Pend=0 | Pagado=80K

5. Cliente reclama 30K adicionales con evidencia
   Inicial=100K | Ajustado=110K | Autorizada=80K | Pend=0 | Pagado=80K

6. Se autoriza complemento
   Inicial=100K | Ajustado=110K | Autorizada=110K | Pend=30K | Pagado=80K

7. Se paga complemento
   Inicial=100K | Ajustado=110K | Autorizada=110K | Pend=0 | Pagado=110K
```

### Pagos de siniestros

#### Tipos de pago
| Tipo | Procesado desde | Controles |
|------|----------------|-----------|
| **Pago a reclamante/beneficiario** | Panel de control de siniestros | Contra reserva autorizada |
| **Pago a proveedor** (taller, medico, abogado) | Modulo de procuraduria | Ordenes de compra/servicio, facturas |
| **Pago a ajustador/inspector** | No afecta reserva de siniestros | - |

#### Validaciones previas al pago
- Reserva autorizada con saldo suficiente
- Correspondencia cobertura-beneficiario-monto
- Documentos obligatorios completos
- Limites operativos por rol/tipo/jerarquia

#### Flujo de autorizacion de pagos (configurable)
- Aprobacion individual (montos bajos)
- Aprobacion en cascada (montos significativos)
- Aprobacion multiple (varias areas)
- Aprobacion automatica (condiciones preestablecidas)

Ejemplo de reglas:
- Pagos USD < 500, ramo Autos: aprobacion automatica
- Pagos entre 2,000 y 20,000: aprobacion por 1 miembro del grupo "Supervisores"
- Pagos > 20,000: aprobacion por grupo "Gerentes"

### Recuperaciones y Salvamentos
- **Subrogacion**: derecho de la aseguradora a reclamar al causante
- **Salvamentos**: bienes recuperados (vehiculos siniestrados, etc.)
- **Recupero de reaseguro**: porcion del siniestro cubierta por reasegurador
- Los pagos de salvamentos y recuperaciones NO afectan reservas de siniestros pendientes

### Observaciones automaticas al registrar siniestro
- Primas atrasadas
- Otros siniestros recientes o abiertos
- Deducibles o exclusiones aplicables
- Existencia de coaseguro

### Roles en siniestros
| Rol | Responsabilidades |
|-----|-------------------|
| Analista de siniestros | Registro, evaluacion, reservas, seguimiento |
| Supervisor/Gerente | Aprobacion reservas, pagos, excepciones, KPIs |
| Ajustador | Evaluacion tecnica, informes, evidencias (app movil) |
| Procuraduria | Compras y servicios vinculados al siniestro |
| Proveedor/Taller/Medico | Prestacion servicios, carga facturas (portal web) |
| Cliente/Reclamante | Notificacion, seguimiento (portal/autoservicio) |

## Reaseguro

### Principio fundamental: Atomizacion del riesgo
Dividir riesgo grande en partes pequenas para que ningun participante quede excesivamente expuesto.
- **Nivel 1**: Dentro de la aseguradora (ley de grandes numeros)
- **Nivel 2**: Entre aseguradoras (coaseguro - horizontal)
- **Nivel 3**: Aseguradora y reasegurador (reaseguro - vertical)

### Coaseguro vs Reaseguro
| Aspecto | Coaseguro | Reaseguro |
|---------|-----------|-----------|
| Participantes | Varias aseguradoras locales | Aseguradora + reaseguradores (locales e internacionales) |
| Relacion legal | Directa entre asegurado y cada aseguradora | Solo aseguradora-asegurado; separada aseguradora-reasegurador |
| Poliza | Una comun firmada por todos, o una por cada participante | Solo la aseguradora emite |
| Participacion | % fijo por coasegurador | Reglas diversas segun contrato |

### Coaseguro en Policysense
- **Cedido**: La compania es lider, distribuye riesgo a otras aseguradoras locales
- **Aceptado**: La compania recibe porcion de riesgo de otra compania lider
- Ambos soportados en la misma aplicacion
- Documento: "cesion de primas en coaseguro" (firma electronica)

#### Cuentas de coaseguro
Reporte periodico del lider con: primas emitidas/cobradas, comisiones, gastos, siniestros pagados/reservados, saldo por coasegurador.

### Tipos de Reaseguro

#### Por forma de contratacion
| Tipo | Descripcion | Cuando se usa |
|------|-------------|---------------|
| **Facultativo** | Caso por caso, reasegurador decide si acepta | Riesgos atipicos, grandes, que exceden el tratado |
| **Obligatorio (Tratado)** | Automatico para todo el portafolio que cumpla criterios | Ramos completos, estabilizar resultados |

#### Por forma de participacion

**Proporcional:**
| Subtipo | Mecanismo | Ejemplo |
|---------|-----------|---------|
| **Cuota Parte (Quota Share)** | Todo se reparte en mismo % siempre | 60-40: reasegurador recibe 40% prima, paga 40% siniestro |
| **Excedente (Surplus)** | Reasegurador participa solo por encima de la retencion. Capacidad = plenos x retencion. | Retencion 200K, 4 plenos = 800K capacidad reasegurador. Riesgo 400K: 50/50. Riesgo 150K: 100% aseguradora. |
| **Facob (Fac-Ob)** | Facultativo obligatorio | Combinacion de ambos modelos |

**No Proporcional:**
| Subtipo | Mecanismo |
|---------|-----------|
| **Exceso de perdida por riesgo (XL Risk)** | Reasegurador paga cuando siniestro individual supera umbral |
| **Exceso de perdida por evento (Cat XL)** | Reasegurador paga cuando evento catastrofico acumulado supera umbral |
| **Exceso de siniestralidad (Stop Loss)** | Reasegurador paga cuando ratio de siniestralidad global supera % definido |

### Cesion automatica en Policysense
Al emitir una poliza, PolicyAdmin notifica al App de Co/Reaseguro via Kafka. El App evalua los contratos vigentes y calcula automaticamente la prima cedida y la retencion.

### Datos clave de cesion
- Prima cedida
- Capital cedido
- Retencion de la compania
- Comisiones de reaseguro
- Participacion por contrato/capa

### Bordereaux
Reportes periodicos generados automaticamente:
- **Bordereaux de primas**: primas cedidas por periodo
- **Bordereaux de siniestros**: siniestros cedidos por periodo
Usados para conciliacion entre cedente y reasegurador.

## Admin Usuarios

### Arquitectura de accesos (3 capas RBAC)
```
Usuarios (internos/externos)
  -> Cargos (dentro de Unidades de Negocio) o Perfiles (externos)
    -> Roles por aplicacion
      -> Permisos
```

### Usuarios internos
- Pertenecen a una Unidad de Negocio
- Tienen un Cargo que determina roles automaticamente
- Estados: Nuevo, Activo, Inactivo, Bloqueado, Pendiente de Aprobacion
- Email unico obligatorio
- Tipos SMC: Administrador, Canal Distribucion, Cliente, Empleado Back/Front Office, Proveedor

### Usuarios externos
- Tipificados por Perfil (plano, sin jerarquia)
- Perfil se asocia a roles por aplicacion
- Ejemplos: brokers, talleres, medicos, ajustadores independientes
- Acceso via Portal Web o App Movil

### Unidades de Negocio (ejemplos)
Siniestros, Suscripcion, Finanzas, Reaseguro, Operaciones, Tecnologia

### Cargos (ejemplos)
Analista, Supervisor, Gerente, Director, Administrador del sistema

### Grupos de usuarios
- Agrupacion logica para workflows (aprobaciones, revisiones, notificaciones)
- Propietario, nombre, tipo, miembros
- Un usuario puede pertenecer a multiples grupos
- Ejemplos: Analistas de Siniestros, Ajustadores, Supervisores de Suscripcion, Equipo de Procuraduria

### Interfaces de acceso
| Ambiente | Usuarios tipicos | Tareas |
|----------|-----------------|--------|
| **Backoffice** | Empleados, supervisores, auditores | Registro, reservas, pagos, seguimiento |
| **Portal Web** | Clientes, brokers, talleres, medicos | Consulta, documentos, cotizaciones |
| **App Movil** | Ajustadores, inspectores | Ordenes, inspeccion, fotos, reportes |

### Seguridad
- IDP: Auth0 (o integracion con IDP del cliente, Active Directory)
- Complejidad de contrasena configurable
- Expiracion de contrasenas
- Intentos fallidos maximos, bloqueo automatico
- Autenticacion multifactor (MFA)
- Auditoria completa de creacion, modificacion, asignacion de roles

## Reglas de Negocio Criticas para Pruebas

### Validaciones que los assertions DEBEN verificar

**Policy Admin:**
1. Poliza no puede emitirse sin calculo de prima (Rating Engine)
2. Poliza no puede emitirse sin verificacion de reaseguro (puede requerir facultativo)
3. Comisiones calculadas por Distribution Management antes de emision
4. Numeracion automatica y unica de polizas
5. Endoso debe generar factura de diferencia de prima
6. Cancelacion debe generar nota de credito
7. Renovacion debe generar nuevo conjunto de facturas

**Distribution Management:**
8. Canal debe estar en estado "Activo" para vender
9. Canal debe tener acuerdo economico valido y vigente
10. Transicion "En reclutamiento" -> "Activo" requiere aprobacion
11. Calculo de comisiones respeta escalera de jerarquia
12. Recuperacion automatica de comisiones en caso de anulacion o mora
13. Licencias y seguro E&O deben estar vigentes

**Facturacion:**
14. Todas las facturas de la vigencia se generan al momento de emision
15. Facturas DEBEN pagarse en orden cronologico
16. Periodo de gracia respetado antes de acciones de morosidad
17. Estado "Liquidada" = banco confirmo cobro (no necesariamente dinero en cuenta)
18. Notas de credito generadas correctamente en anulaciones
19. Pagos parciales permitidos

**Siniestros:**
20. FNOL crea siniestro con numero unico y reserva inicial automatica
21. Pago NO puede exceder reserva autorizada
22. Reserva inicial NO se modifica despues de creacion
23. Requerimientos pendientes impiden cerrar etapa de analisis
24. Pagos a proveedores SOLO via procuraduria
25. Pagos a ajustadores/inspectores NO afectan reserva de siniestros
26. Cierre requiere: sin reservas pendientes + todas las tareas completadas

**Reaseguro:**
27. Cesion automatica calculada al emitir poliza
28. Porcentajes coaseguro + retencion no pueden exceder 100%
29. Bordereaux generados periodicamente para conciliacion
30. Siniestros alimentan automaticamente reservas de reaseguro

**Admin Usuarios:**
31. Email unico por usuario
32. Roles se heredan automaticamente del cargo/unidad de negocio
33. Segregacion de funciones: un usuario no debe tener roles conflictivos
34. Todas las acciones de administracion quedan en log de auditoria

## Datos de Referencia QA

### Valores validos para estados de poliza
`Borrador | Cotizacion | En suscripcion | Vigente | Suspendida | Cancelada | Vencida | Renovada`

### Valores validos para estados de factura
`Pendiente | Pagada | Liquidada | Anulada`

### Valores validos para estados de siniestro
`Notificado | En analisis | En cumplimiento | Cerrado | Reabierto`

### Valores validos para estados de usuario
`Nuevo | Activo | Inactivo | Bloqueado | Pendiente de Aprobacion`

### Valores validos para estados de canal
`En reclutamiento | Activo | Suspendido temporal | Suspendido definitivo`

### Ramos tipicos
`Autos | Hogar | Incendio | RC General | RC Profesional | Transporte | Vida Individual | Vida Colectivo | Salud Individual | Salud Colectivo | Viaje | Accidentes Personales`

### Frecuencias de pago
`Anual | Semestral | Trimestral | Mensual`

### Metodos de pago
`Tarjeta de credito | Domiciliacion bancaria | Transferencia | Efectivo | Cheque`

### Tipos de siniestro (ejemplo Autos)
`Accidente con heridos | Accidente sin heridos | Robo total | Robo parcial | Rotura parabrisas | Servicio en via | Danos por terceros`

### Tipos de reaseguro
`Cuota Parte | Excedente | Facultativo | XL Risk | Cat XL | Stop Loss | Facob`

### Tipos de endoso comunes
`Cambio de cobertura | Cambio de SA | Inclusion/exclusion beneficiario | Cambio de vehiculo | Cambio de direccion | Cambio de forma de pago | Prorroga | Reduccion`

### Conceptos de facturacion tipicos
`Prima neta | Recargo por fraccionamiento | Derecho de emision | IVA/ISR | Gastos administrativos | Prima cobertura opcional`

### Comunicacion inter-modulos (Kafka topics implicitos)
| Origen | Destino | Evento |
|--------|---------|--------|
| PolicyAdmin | Billing | Orden de facturacion |
| PolicyAdmin | Distribution Mgmt | Solicitud calculo comisiones |
| PolicyAdmin | Co/Reaseguro | Notificacion de emision (verificar cesion) |
| PolicyAdmin | Siniestros | Actualizacion directorio polizas |
| Billing | PolicyAdmin | Estado de primas/cobertura |
| Billing | Distribution Mgmt | Factura liquidada (devengo comision) |
| Billing | Co/Reaseguro | Transacciones de primas para cesiones |
| Siniestros | Co/Reaseguro | Reservas/pagos para bordereaux siniestros |
| Siniestros | Billing | Consulta estado primas |
| Siniestros | ERP | Asientos contables de pagos |
