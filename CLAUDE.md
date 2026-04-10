# Pruebas de Carga — Suite Policysense

## Contexto

Este proyecto implementa pruebas de carga JMeter para **Policysense**, la suite de seguros de In Motion S.A.
Los manuales del sistema están en `docs/Portal de Manuales — Policysense*.mhtml`.
El proyecto se integrará con **Azure DevOps** para CI/CD.

## Módulos de Policysense

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Distribution Management** | Canales (agentes, brokers), tipos, niveles, estados, jerarquías, redes, comisiones multinivel, acuerdos económicos, licencias |
| 2 | **Facturación y Cobranza** | Recaudación de primas, recibos, opciones de pago, conciliación, días de gracia |
| 3 | **Policy Admin** | Ciclo de vida póliza (cotización → emisión → endoso → renovación), portal autoservicio, visión 360° |
| 4 | **Reaseguro** | Coaseguro, reaseguro cedido/aceptado, contratos, cesiones, bordereaux, cuentas corrientes |
| 5 | **Siniestros** | FNOL, validación cobertura, reservas, ajustadores, liquidación, salvamentos, finiquito |
| 6 | **Admin Usuarios** | Usuarios, roles, permisos, grupos de soporte |

## Estructura del proyecto

```
demo_jmeter/
├── demo.jmx                    # Plan de pruebas principal (14 ThreadGroups)
├── azure-pipelines.yml         # Pipeline Azure DevOps
├── data/                       # CSVs con datos de prueba
├── scripts/                    # Scripts de ejecución
├── reports/                    # Reportes HTML (gitignored)
├── docs/                       # Manuales Policysense (MHTML + TXT)
├── CLAUDE.md                   # Este archivo
└── .claude/
    ├── agents/                  # Agentes especializados (subagents)
    │   ├── lider-pruebas.md     # Coordinador del equipo
    │   ├── disenador-jmx.md     # Diseñador de ThreadGroups
    │   ├── infraestructura-devops.md  # Pipeline y scripts
    │   ├── analista-resultados.md    # Métricas y SLAs
    │   ├── validador-calidad.md      # Assertions y datos CSV
    │   └── seguro-especialista.md    # Especialista en seguros
    ├── agent-memory/            # Memoria persistente por agente
    ├── hooks/                   # Hooks de protección
    ├── skills/                  # Skills (Policysense + Superpowers)
    ├── workflows/               # 3 flujos de trabajo
    └── settings.json            # Configuración de hooks
```

## Skills disponibles

| Skill | Cuándo usarlo |
|-------|---------------|
| `pruebas-policysense` | Diseñar pruebas para APIs de Policysense (contiene lógica de negocio) |
| `lluvia-de-ideas` | Antes de diseñar nuevos escenarios de prueba |
| `depuracion-sistematica` | Ante fallos en pruebas JMeter |
| `escritura-de-planes` | Planificar implementación de nuevos escenarios |
| `ejecucion-de-planes` | Ejecutar planes aprobados paso a paso |
| `despacho-de-agentes-paralelos` | Tareas paralelas por módulo de Policysense |
| `desarrollo-dirigido-por-subagentes` | Subagentes para tareas independientes |
| `verificacion-antes-de-completar` | Verificar con evidencia antes de entregar |

## Workflows disponibles

| Workflow | Descripción |
|----------|-------------|
| `ciclo-pruebas-de-carga` | Ciclo completo: preparación → diseño → ejecución → análisis → reporte |
| `prueba-estres-catastrofe` | Stress test simulando evento catastrófico (500 usuarios, siniestros masivos) |
| `pipeline-azure-devops` | Subir y ejecutar pruebas en Azure DevOps CI/CD |

## Agentes disponibles (`.claude/agents/`)

| Agente | Archivo | Responsabilidad |
|--------|---------|----------------|
| **lider-pruebas** | `lider-pruebas.md` | Coordina, prioriza módulos, sintetiza resultados |
| **disenador-jmx** | `disenador-jmx.md` | ThreadGroups, Samplers, Assertions por módulo Policysense |
| **infraestructura-devops** | `infraestructura-devops.md` | Scripts headless, Azure DevOps pipeline, multi-ambiente |
| **analista-resultados** | `analista-resultados.md` | Listeners, reportes, SLAs por módulo, comparación baseline |
| **validador-calidad** | `validador-calidad.md` | Assertions de negocio, datos CSV, cobertura de escenarios |
| **seguro-especialista** | `seguro-especialista.md` | Consultas sobre lógica de negocio aseguradora |

Cada agente tiene memoria persistente en `.claude/agent-memory/{nombre}/`.

## Hooks activos

| Hook | Qué hace |
|------|----------|
| `protect-files.sh` | Bloquea edición de .env, credenciales, resultados, reportes |
| `check-no-production.sh` | Bloquea comandos contra producción |
| `validate-jmx.sh` | Valida XML del .jmx tras edición |
| Agent Stop | Verifica assertions completas antes de declarar "listo" |
| Notification | Alerta Windows cuando Claude necesita atención |
| SessionStart compact | Re-inyecta contexto Policysense tras compactación |

## Lógica de negocio clave de Policysense

### Canales de distribución
- **Tipos de canal**: parametrizables (Agente empleado, Agente exclusivo, Broker)
- **Niveles**: En entrenamiento → Básico → Avanzado → Experto
- **Estados**: En reclutamiento → Activo → Suspendido temporal → Suspendido definitivo
- **Transiciones**: algunas requieren aprobación (workflow)
- **Comisiones**: escalera multinivel con distribución parametrizable
- **Acuerdos económicos**: comisiones, subsidios, anticipos, préstamos, póliza seguro, fondo retiro

### Siniestros
- **Ciclo**: FNOL → Validación cobertura → Investigación → Ajuste → Reserva → Liquidación → Finiquito
- **Reservas**: inicial, ajuste, final
- **Salvamentos y recuperos**: incluido recupero de reaseguro

### Reaseguro
- **Tipos**: proporcional, no proporcional, coaseguro
- **Cesión automática**: al emitir póliza se calcula prima cedida
- **Bordereaux**: reporte periódico para conciliación

### Facturación
- **Flujo**: Emisión → Recibo → Factura → Cobranza → Conciliación
- **Días de gracia**: configurables por producto
- **Mora**: notificación → suspensión

## Azure DevOps

Pipeline configurado en `azure-pipelines.yml`:
- Trigger en `main` y `develop`
- Instala JMeter 5.6.3 en agente Ubuntu
- Ejecuta pruebas con variables de grupo `policysense-jmeter-vars`
- Publica resultados JTL y reporte HTML como artefactos
- Verifica SLA de tasa de error < 1%

## Variables de ejecución

| Variable | Default | Descripción |
|----------|---------|-------------|
| `host` | api.erp-seguros.local | Host de la API Policysense |
| `port` | 8080 | Puerto |
| `protocol` | https | Protocolo |
| `users` | 5 | Usuarios concurrentes por ThreadGroup |
| `rampUp` | 10 | Tiempo de ramp-up (segundos) |
| `loop` | 3 | Iteraciones por usuario |
| `token` | TEST_TOKEN | JWT de autenticación |

## Regla fundamental

**NUNCA ejecutar pruebas de carga contra producción de Policysense.**
Solo ambientes QA/Staging con datos de prueba.
