---
name: Actualizacion Skill con Manuales Reales
description: Se enriquecio SKILL.md con informacion extraida de los 6 manuales .docx de Policysense el 2026-04-09
type: project
---

El skill de pruebas (insurance-erp-testing/SKILL.md) fue actualizado con logica de negocio real extraida de los 6 manuales oficiales de Policysense.

**Why:** El skill anterior tenia informacion generica. Los manuales .docx contienen la logica de negocio real: estados, transiciones, flujos detallados, tipos de reaseguro, estructura de facturas, cadenas ejecutables, modelo RBAC, y los flujos completos de cada modulo con reglas de validacion especificas.

**How to apply:** Al disenar nuevos escenarios de prueba JMeter, el skill ahora tiene informacion suficiente para generar ThreadGroups realistas sin necesidad de consultar los manuales directamente. Los datos de prueba CSV deben reflejar las entidades y estados documentados en el skill.

Modulos enriquecidos:
- Distribution Management: tipos canal, niveles, estados, transiciones, acuerdos economicos, escalera comisiones, redes, onboarding
- Facturacion: estructura factura, estados, herencia de reglas, lotes cobro, morosidad, operaciones manuales
- Policy Admin: formas emision, cadenas ejecutables, endosos, renovacion batch, polizas colectivas/masivas/embebidas
- Reaseguro: tipos proporcional/no proporcional, cuota parte, excedente, XL, Cat XL, stop loss, coaseguro, cumulos
- Siniestros: FNOL multicanal, concepto de casos, estados reserva con ejemplo numerico, recuperaciones
- Admin Usuarios: modelo RBAC 3 capas, estados usuario, interfaces acceso, grupos en workflows
