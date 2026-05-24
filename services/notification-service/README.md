# Notification Service

Gestion des notifications utilisateur et systeme.

Port local: `4004`

Endpoints MVP:

- `POST /notifications`: envoyer une notification.
- `GET /notifications/my?userId=...`: lister les notifications d'un utilisateur.
- `PATCH /notifications/:id/read`: marquer une notification comme lue.
- `PATCH /notifications/read-all`: marquer toutes les notifications d'un utilisateur comme lues.
