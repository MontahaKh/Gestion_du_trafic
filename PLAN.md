# Plan de Suivi - Mini Projet Web Services et GraphQL

## 1. Objectif du plan

Ce plan sert a piloter le projet de facon operationnelle: qui fait quoi, dans quel ordre, avec quels criteres de validation.

## 2. Equipe et responsabilites

- Personne A: Architecture, Gateway GraphQL, Authentification, securite.
- Personne B: Service Vehicules + Service Trafic.
- Personne C: Service Incidents + Notifications + Qualite des livrables.

## 3. Decoupage par phases

## Phase 0 - Cadrage (J1)

- Valider la stack: NestJS ou Express.
- Choisir la base: PostgreSQL ou MySQL.
- Definir conventions (branching, commit, code style, gestion erreurs).
- Valider le schema global des donnees.

Critere de sortie:
- Architecture cible approuvee par les 3 membres.

## Phase 1 - Socle technique (J2 a J4)

- Initialiser repository et structure multi-services.
- Monter la gateway GraphQL.
- Configurer connexion base + migrations.
- Mettre en place JWT et middlewares/guards.

Critere de sortie:
- Auth minimale operationnelle + gateway disponible.

## Phase 2 - MVP metier priorite HAUTE (Semaine 2)

- Vehicules: add/list/detail/recordPosition.
- Trafic: createZone/calc densite/list zones/classification.
- Incidents: report/list/updateStatus.
- Notifications: send/myNotifications.

Critere de sortie:
- Toutes les US haute priorite passent les criteres d'acceptation.

## Phase 3 - Priorite MOYENNE (Semaine 3)

- Auth: updateRole + logout.
- Vehicules: history.
- Incidents: detail + creation auto embouteillage.
- Notifications: markAsRead + markAllAsRead.

Critere de sortie:
- Fonctionnalites moyenne priorite stables et testees.

## Phase 4 - Priorite BASSE et Bonus (Semaine 4)

- Vehicules: update/delete.
- Trafic: update/delete zone.
- Incidents: delete incident resolu.
- Bonus: subscriptions GraphQL temps reel, Docker Compose, dashboard.

Critere de sortie:
- Livrables complets et projet presentable.

## 4. Tableau de suivi des user stories

| US | Priorite | Responsable | Etat | Date cible |
|---|---|---|---|---|
| US-AUTH-01 | Haute | A | A faire | S1 |
| US-AUTH-02 | Haute | A | A faire | S1 |
| US-AUTH-05 | Haute | A | A faire | S1 |
| US-VEH-01 | Haute | B | A faire | S2 |
| US-VEH-02 | Haute | B | A faire | S2 |
| US-VEH-03 | Haute | B | A faire | S2 |
| US-VEH-04 | Haute | B | A faire | S2 |
| US-TRF-01 | Haute | B | A faire | S2 |
| US-TRF-02 | Haute | B | A faire | S2 |
| US-TRF-03 | Haute | B | A faire | S2 |
| US-TRF-04 | Haute | B | A faire | S2 |
| US-INC-01 | Haute | C | A faire | S2 |
| US-INC-02 | Haute | C | A faire | S2 |
| US-INC-03 | Haute | C | A faire | S2 |
| US-NOT-01 | Haute | C | A faire | S2 |
| US-NOT-02 | Haute | C | A faire | S2 |

Les US de priorite moyenne et basse sont suivies dans la meme logique a partir de S3.

## 5. Rituels de suivi

- Daily de 15 minutes: blocages, avancement, prochain objectif.
- Revue de sprint hebdomadaire: demo des US terminees.
- Retro rapide en fin de semaine: ce qui marche, ce qui bloque, actions.

## 6. Qualite et verification

Chaque US est validee si:

- Criteres d'acceptation respectes.
- Test manuel ou automatique execute.
- Verification de securite (JWT, roles, acces).
- Erreurs gerees de facon propre (messages utiles).
- Documentation mise a jour (README, requetes test).

## 7. Livrables et proprietaire principal

- Code source GitHub: A + B + C.
- Base de donnees + scripts: A.
- README final: C.
- Diagrammes UML: B.
- Collection Postman: C.
- Requetes GraphQL de test: A + C.
- Slides presentation finale: B + C.

## 8. Gestion des risques

- Risque: retard integration inter-services.
	Action: integration continue des la fin de S1.
- Risque: conflits Git frequents.
	Action: petites branches et pull requests courtes.
- Risque: manque de tests.
	Action: ajouter tests au fil de l'eau, pas en fin de projet.
- Risque: dette securite.
	Action: revue JWT/roles a chaque sprint.
