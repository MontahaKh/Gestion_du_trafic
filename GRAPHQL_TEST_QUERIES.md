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
