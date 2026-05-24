# Incident Service

Gestion du cycle de vie des incidents.

Port local: `4003`

Endpoints MVP:

- `POST /incidents`: declarer un incident.
- `GET /incidents`: lister les incidents, avec filtre optionnel `status`.
- `GET /incidents/:id`: consulter un incident.
- `PATCH /incidents/:id/status`: passer un incident a `REPORTED`, `IN_PROGRESS` ou `RESOLVED`.
