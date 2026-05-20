# Gateway

API Gateway GraphQL du projet.

Responsabilites:
- Exposer un point d'entree unique GraphQL.
- Verifier JWT et roles.
- Router vers les services metier.

Run (NestJS TypeScript skeleton):

1. Install dependencies:

```bash
cd gateway
npm install
```

2. Start in development:

```bash
npm run start:dev
```

Default port: `4000`. Configure `AUTH_SERVICE_URL` and `JWT_SECRET` as needed.
