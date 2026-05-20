# Plateforme de Gestion du Trafic Urbain

Mini Projet Web Services et GraphQL

## 1. Contexte

Cette application distribue les responsabilites metier en plusieurs services independants, exposes via une API Gateway GraphQL.

Objectif principal: superviser les vehicules, detecter les incidents et analyser la circulation urbaine en temps quasi reel.

## 2. Architecture cible

- API Gateway GraphQL: point d'entree unique (queries, mutations, subscriptions).
- Service Authentification: comptes, login, JWT, roles ADMIN et OPERATOR.
- Service Vehicules: flotte, detail vehicule, positions GPS, historique.
- Service Trafic: zones, densite, classification de congestion.
- Service Incidents: declaration, consultation, workflow de statuts.
- Service Notifications: messages systeme et utilisateur, lecture, temps reel (bonus).
- Base relationnelle: PostgreSQL (recommande) ou MySQL.

## 3. Stack technique proposee

- Backend: NestJS (recommande pour GraphQL modulaire) ou Node.js/Express.
- API: GraphQL obligatoire.
- Authentification: JWT avec expiration configurable.
- Validation: DTO + validation schema.
- Erreurs: format d'erreur standardise sur toute l'API.
- Gestion de version: Git et GitHub.

## 4. Demarrage projet (etapes)

1. Initialiser le repository et definir les conventions Git.
2. Creer la structure des services et de la gateway.
3. Configurer la base de donnees et les migrations.
4. Implementer Auth (register, login, verify token, roles).
5. Implementer Vehicules (CRUD de base + positions GPS).
6. Implementer Trafic (zones + calcul densite + classification).
7. Implementer Incidents (report, listing, update statut).
8. Implementer Notifications (send, list, mark as read).
9. Connecter les services via la gateway GraphQL.
10. Ajouter tests, README final, diagrammes UML et collection Postman.

## 5. Repartition entre 3 personnes

### Personne A - Architecture, Auth, Gateway

- Mettre en place la base du projet et la gateway GraphQL.
- Implementer le service Authentification.
- Securiser les resolvers (JWT + roles).
- Gerer les standards techniques partages (validation, erreurs, logs).

### Personne B - Vehicules et Trafic

- Implementer le service Vehicules et l'historique GPS.
- Implementer le service Trafic (zones, densite, statut).
- Integrer les regles de classification Faible / Moyen / Eleve.
- Exposer queries/mutations GraphQL associees.

### Personne C - Incidents, Notifications, Qualite

- Implementer le service Incidents.
- Implementer le service Notifications et les cas de lecture.
- Ajouter les tests unitaires/integration prioritaires.
- Produire Postman, jeux de requetes GraphQL et support de presentation.

## 6. Backlog priorise (26 user stories)

### Haute priorite (MVP)

- Auth: US-AUTH-01, 02, 05
- Vehicules: US-VEH-01, 02, 03, 04
- Trafic: US-TRF-01, 02, 03, 04
- Incidents: US-INC-01, 02, 03
- Notifications: US-NOT-01, 02

### Moyenne priorite

- Auth: US-AUTH-03, 04
- Vehicules: US-VEH-05
- Incidents: US-INC-04, 06
- Notifications: US-NOT-03

### Basse priorite / Bonus

- Vehicules: US-VEH-06
- Trafic: US-TRF-05
- Incidents: US-INC-05
- Notifications: US-NOT-04 (subscriptions WebSocket)

## 7. Plan de livraison conseille (4 semaines)

- Semaine 1: architecture, base de donnees, Auth complete, gateway initiale.
- Semaine 2: services Vehicules + Trafic (MVP), tests unitaires de base.
- Semaine 3: services Incidents + Notifications, interconnexions inter-services.
- Semaine 4: durcissement securite, tests, documentation, demo finale.

## 8. Definition de termine (DoD)

Une fonctionnalite est consideree terminee si:

- Les criteres d'acceptation de la user story sont satisfaits.
- Les validations d'entree sont en place.
- Les erreurs sont gerees de facon explicite.
- Les regles de securite (JWT/role) sont appliquees.
- Les tests associes sont executes.
- La documentation est mise a jour.

## 9. Livrables obligatoires

- Code source complet (GitHub).
- Base de donnees et script de creation.
- README complet de lancement et usage.
- Diagrammes UML (architecture + principaux flux).
- Collection Postman.
- Requetes GraphQL de test.
- Presentation finale.

## 10. Commandes standard a definir dans le projet

- Installation des dependances.
- Lancement en mode developpement.
- Lancement des tests.
- Lancement de la gateway et des services.

Ces commandes seront precisees une fois la stack validee (NestJS ou Express).