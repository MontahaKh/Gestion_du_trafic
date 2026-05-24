# Traffic Service

Gestion des zones et calcul de densite du trafic.

Port local: `4005`

Endpoints:

- `GET /health`: endpoint de sante.

## Zones

- `POST /traffic/zones`
- `GET /traffic/zones`
- `GET /traffic/zones/:id`

Body example:

```json
{
	"name": "Centre-Ville",
	"bbox": { "minLat": 36.79, "minLng": 10.17, "maxLat": 36.82, "maxLng": 10.21 }
}
```

## Metrics

- `POST /traffic/zones/:id/calculate`

Body example:

```json
{ "windowMinutes": 15 }
```

Le service lit la table `gps_positions` (alimentee par `vehicle-service`) pour compter les positions dans le bbox sur la fenetre de temps, calcule un niveau (`FAIBLE`/`MOYEN`/`ELEVE`) et insere un enregistrement dans `traffic_metrics`.

Run (NestJS TypeScript skeleton):

1. Install dependencies:

```bash
cd services/traffic-service
npm install
```

2. Start in development:

```bash
npm run start:dev
```

Configure `DATABASE_URL` to point to your database, for example:

```bash
postgres://webuser:webpass@localhost:5432/webservice
```

On startup, the service creates tables `traffic_zones` and `traffic_metrics` if they do not exist.
