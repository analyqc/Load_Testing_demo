---
name: API Discovery v1130
description: Estructura de 11 hosts Policysense, 132 servicios REST descubiertos via /rest-doc/, sin OpenAPI publico disponible
type: project
---

Los 11 hosts de Policysense v1130/testview publican sus servicios REST en `/rest-doc/` pero NO exponen spec OpenAPI:
- `/v3/api-docs`, `/v2/api-docs`, `/swagger.json` todos devuelven 404
- Los endpoints REST individuales (`/rest/*/v1/`) requieren OAuth y redirigen (HTTP 303)
- El acceso autenticado requiere obtener un token via `/oauth/v2/token` con MxAdmin/Admin_123

**Why:** La arquitectura de Policysense usa Jersey REST con autenticacion obligatoria; no hay spec publica.

**How to apply:** Para obtener detalle de operaciones individuales de cada servicio, primero se debe autenticar via OAuth, luego acceder a cada servicio o usar WADL. Considerar usar curl con token para explorar programaticamente.
