---
name: pipeline-azure-devops
description: Flujo de trabajo para subir y ejecutar pruebas JMeter en Azure DevOps
---

# Flujo de Trabajo — Pipeline Azure DevOps

## Objetivo
Ejecutar las pruebas de carga JMeter de Policysense como parte del pipeline CI/CD en Azure DevOps.

## Prerrequisitos
- Repositorio del proyecto en Azure Repos o GitHub conectado a Azure DevOps
- Pool de agentes con JMeter instalado (o instalación dinámica)
- Variable group con credenciales de ambiente (host, token)
- Ambiente de QA/Staging disponible

## Estructura de archivos para el repositorio

```
demo_jmeter/
├── demo.jmx                    # Plan de pruebas principal
├── data/                       # CSVs con datos de prueba
├── azure-pipelines.yml         # Pipeline principal
├── scripts/
│   ├── run_test.sh             # Script ejecución headless
│   └── install_jmeter.sh      # Script instalación JMeter en agente
└── reports/                    # Generados por JMeter (gitignored)
```

## Pipeline YAML

```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  - group: policysense-jmeter-vars  # host, port, token, users, rampUp, loop

stages:
  - stage: LoadTest
    displayName: 'Pruebas de Carga Policysense'
    jobs:
      - job: JMeterTest
        displayName: 'Ejecutar JMeter'
        steps:
          - task: Bash@3
            displayName: 'Instalar JMeter'
            inputs:
              targetType: 'inline'
              script: |
                sudo apt-get update -qq
                sudo apt-get install -y -qq default-jre
                wget -q https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.tgz
                tar -xzf apache-jmeter-5.6.3.tgz
                echo "##vso[task.setvariable variable=JMETER_HOME]$(pwd)/apache-jmeter-5.6.3"

          - task: Bash@3
            displayName: 'Ejecutar pruebas de carga'
            inputs:
              targetType: 'inline'
              script: |
                mkdir -p results reports
                $(JMETER_HOME)/bin/jmeter -n \
                  -t demo.jmx \
                  -l results/results.jtl \
                  -e -o reports/ \
                  -Jhost=$(HOST) \
                  -Jport=$(PORT) \
                  -Jprotocol=https \
                  -Jusers=$(USERS) \
                  -JrampUp=$(RAMP_UP) \
                  -Jloop=$(LOOP) \
                  -Jtoken=$(TOKEN)

          - task: PublishPipelineArtifact@1
            displayName: 'Publicar resultados JTL'
            inputs:
              targetPath: 'results/'
              artifact: 'jmeter-results'

          - task: PublishPipelineArtifact@1
            displayName: 'Publicar reporte HTML'
            inputs:
              targetPath: 'reports/'
              artifact: 'jmeter-report'

          - task: Bash@3
            displayName: 'Verificar SLAs'
            inputs:
              targetType: 'inline'
              script: |
                # Verificar tasa de error < 1%
                ERROR_RATE=$(awk -F',' 'NR>1 {total++; if($8=="false") errors++} END {print (errors/total)*100}' results/results.jtl)
                echo "Tasa de error: ${ERROR_RATE}%"
                if (( $(echo "$ERROR_RATE > 1" | bc -l) )); then
                  echo "##vso[task.logissue type=error]Tasa de error ${ERROR_RATE}% excede el SLA de 1%"
                  exit 1
                fi
```

## Variable Group: policysense-jmeter-vars

| Variable | Ejemplo | Secreto |
|----------|---------|---------|
| HOST | api-qa.policysense.com | No |
| PORT | 443 | No |
| TOKEN | eyJhbG... | Sí |
| USERS | 10 | No |
| RAMP_UP | 30 | No |
| LOOP | 3 | No |

## Pasos para configurar en Azure DevOps

1. Crear proyecto en Azure DevOps
2. Importar repositorio (Azure Repos o conexión GitHub)
3. Crear Variable Group `policysense-jmeter-vars`
4. Crear Pipeline desde `azure-pipelines.yml`
5. Configurar aprobaciones si se necesita gate antes de ambiente
6. Ejecutar pipeline manualmente o con trigger automático
