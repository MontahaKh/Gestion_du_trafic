# Auth Service

Gestion des utilisateurs, login, JWT, et roles.

Run (NestJS TypeScript skeleton):

1. Install dependencies:

```bash
cd services/auth-service
npm install
```

2. Start in development:

```bash
npm run start:dev
```

Default port: `4001`.

The service now persists users in PostgreSQL instead of memory. Configure `DATABASE_URL` to point to your database, for example:

```bash
postgres://webuser:webpass@localhost:5432/webservice
```

When running with `docker-compose.yml`, the auth service uses the `postgres` container automatically.

Configure `JWT_SECRET` env var to change the signing key.
