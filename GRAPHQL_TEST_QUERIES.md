# GraphQL Test Queries

Copie-colle chaque query dans Apollo Sandbox Explorer:

https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:4000/graphql

Si tu préfères ouvrir directement l'API locale, le serveur GraphQL est sur:

http://localhost:4000/graphql

Astuce: Apollo Sandbox garde les queries visibles dans un espace plus confortable que l'ancienne interface GraphQL brute, ce qui simplifie l'ajout et le test des requêtes.

---

## 1️⃣ TEST REGISTER (Créer un utilisateur)

Copie-colle cette query dans l'éditeur Apollo Sandbox:

```graphql
mutation {
  register(input: {email: "alice@test.com", password: "Pass123!"}) {
    token
    user {
      id
      email
    }
  }
}
```

**Résultat attendu:**
```json
{
  "data": {
    "register": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "user": {
        "id": "1",
        "email": "alice@test.com"
      }
    }
  }
}
```

✅ **Si tu vois le token et l'email, c'est bon!**

---

## 2️⃣ TEST LOGIN (Se connecter et récupérer le token)

Copie-colle cette query:

```graphql
mutation {
  login(input: {email: "alice@test.com", password: "Pass123!"}) {
    token
  }
}
```

**Résultat attendu:**
```json
{
  "data": {
    "login": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
  }
}
```

✅ **Copie le token (la longue chaîne)**

---

## 3️⃣ TEST ME (Requête protégée avec Authorization)

**Important:** Avant d'exécuter cette query:
1. Clique sur l'onglet **"Headers"** ou **"HTTP Headers"** en bas de l'interface GraphQL
2. Ajoute cet en-tête:
```
Authorization: Bearer <colle_ton_token_ici>
```

Si cet en-tête manque ou n'est pas enregistré, `me` renvoie `null`.

Par exemple:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

Puis copie-colle cette query:

```graphql
query {
  me {
    id
    email
  }
}
```

**Résultat attendu:**
```json
{
  "data": {
    "me": {
      "id": "1",
      "email": "alice@test.com"
    }
  }
}
```

✅ **Si tu vois ton email et ton ID, l'authentification fonctionne!**

---

## 📋 Résumé des étapes

| # | Action | Étape |
|---|--------|-------|
| 1 | Execute **REGISTER** query | Crée alice@test.com |
| 2 | Execute **LOGIN** query | Récupère le token |
| 3 | Copy token → paste dans **Headers** `Authorization: Bearer ...` | Ajoute le header |
| 4 | Execute **ME** query avec le header | Teste l'accès protégé |

Si tout fonctionne ✅, tu verras les données utilisateur retournées avec le token valide.

---

## 4. TEST INCIDENTS

```graphql
mutation {
  reportIncident(input: {
    title: "Accident avenue principale"
    description: "Deux voies bloquees"
    zone: "Centre"
    severity: "HIGH"
    reportedBy: "1"
  }) {
    id
    title
    status
    severity
  }
}
```

```graphql
query {
  incidents {
    id
    title
    zone
    status
    createdAt
  }
}
```

```graphql
mutation {
  updateIncidentStatus(id: "1", status: "IN_PROGRESS") {
    id
    status
    updatedAt
  }
}
```

## 5. TEST NOTIFICATIONS

```graphql
mutation {
  sendNotification(input: {
    userId: "1"
    title: "Incident signale"
    message: "Un incident est ouvert dans votre zone."
  }) {
    id
    title
    read
  }
}
```

```graphql
query {
  myNotifications(userId: "1") {
    id
    title
    message
    read
  }
}
```

```graphql
mutation {
  markNotificationAsRead(id: "1") {
    id
    read
  }
}
```

---

## 6️⃣ TEST VEHICULES (Gestion des véhicules et positions GPS)

### mutation createVehicle (Créer un véhicule)
```graphql
mutation {
  createVehicle(input: {
    plateNumber: "AB-111-XX"
    model: "Renault Zoe"
    status: "ACTIVE"
  }) {
    id
    plateNumber
    model
    status
    createdAt
  }
}
```

### query vehicles (Lister tous les véhicules)
```graphql
query {
  vehicles {
    id
    plateNumber
    model
    status
    createdAt
  }
}
```

### query vehicle (Détails d'un véhicule)
```graphql
query {
  vehicle(id: "1") {
    id
    plateNumber
    model
    status
    createdAt
  }
}
```

### mutation recordVehiclePosition (Enregistrer une position GPS)
```graphql
mutation {
  recordVehiclePosition(vehicleId: "1", input: {
    lat: 48.5
    lng: 2.5
    speed: 60.0
  }) {
    id
    vehicleId
    lat
    lng
    speed
    recordedAt
  }
}
```

### query vehiclePositions (Historique des positions GPS)
```graphql
query {
  vehiclePositions(vehicleId: "1", limit: 10) {
    id
    vehicleId
    lat
    lng
    speed
    recordedAt
  }
}
```

---

## 7️⃣ TEST TRAFIC (Zones et métriques de densité)

### mutation createTrafficZone (Créer une zone de trafic)
```graphql
mutation {
  createTrafficZone(input: {
    name: "Zone Centre"
    bbox: {
      minLat: 48.0
      minLng: 2.0
      maxLat: 49.0
      maxLng: 3.0
    }
  }) {
    id
    name
    bbox {
      minLat
      minLng
      maxLat
      maxLng
    }
    createdAt
  }
}
```

### query trafficZones (Lister toutes les zones)
```graphql
query {
  trafficZones {
    id
    name
    bbox {
      minLat
      minLng
      maxLat
      maxLng
    }
    createdAt
  }
}
```

### query trafficZone (Détail d'une zone)
```graphql
query {
  trafficZone(id: "1") {
    id
    name
    bbox {
      minLat
      minLng
      maxLat
      maxLng
    }
    createdAt
  }
}
```

### mutation calculateTraffic (Calculer la densité et le niveau de trafic)
```graphql
mutation {
  calculateTraffic(zoneId: "1", windowMinutes: 15) {
    id
    zoneId
    vehicleCount
    level
    createdAt
  }
}
```

