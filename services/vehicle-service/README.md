# Vehicle Service

Gestion des vehicules et positions GPS.

Port local: `4002`

Endpoints MVP:

- `POST /vehicles`: creer un vehicule.
- `GET /vehicles`: lister les vehicules.
- `GET /vehicles/:id`: consulter un vehicule.
- `POST /vehicles/:id/positions`: enregistrer une position GPS.
- `GET /vehicles/:id/positions?limit=100`: lister l'historique des positions.

- `GET /health`: endpoint de sante.

Run (NestJS TypeScript skeleton):

1. Install dependencies:

```bash
cd services/vehicle-service
npm install
```

2. Start in development:

```bash
npm run start:dev
```

Default port: `4002`.

Configure `DATABASE_URL` to point to your database, for example:

```bash
postgres://webuser:webpass@localhost:5432/webservice
```

When running with `docker-compose.yml`, the service can use the `postgres` container automatically.
