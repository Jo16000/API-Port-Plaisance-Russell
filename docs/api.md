# Documentation API – Port de Plaisance Russell

## 1. AUTHENTIFICATION

### POST /auth/register
Créer un utilisateur + renvoyer un token.

Body :
{
  "username": "Jonathan",
  "email": "jonathan@test.com",
  "password": "123456"
}

### POST /auth/login
Connexion utilisateur.

Body :
{
  "email": "jonathan@test.com",
  "password": "123456"
}

----------------------------------------------------

## 2. USERS

### GET /users
Retourne tous les utilisateurs.

### GET /users/:email
Retourne un utilisateur via son email.

### POST /users
Créer un utilisateur.

Body :
{
  "username": "Jonathan",
  "email": "jonathan@test.com",
  "password": "123456"
}

### PUT /users/:email
Met à jour un utilisateur.

### DELETE /users/:email
Supprime un utilisateur.

----------------------------------------------------

## 3. CATWAYS

### GET /catways
Liste des catways.

### GET /catways/:id
Un catway spécifique.

### POST /catways
Créer un catway.

Body :
{
  "numero": 12,
  "longueur": 8,
  "largeur": 3
}

### PUT /catways/:id
Mettre à jour un catway.

### DELETE /catways/:id
Supprimer un catway.

----------------------------------------------------

## 4. RÉSERVATIONS (token obligatoire)

### GET /catways/:catwayId/reservations
Liste des réservations d’un catway.

### POST /catways/:catwayId/reservations
Créer une réservation.

Body :
{
  "userEmail": "jonathan@test.com",
  "dateDebut": "2024-07-10",
  "dateFin": "2024-07-12"
}

### DELETE /catways/:catwayId/reservations/:id
Supprimer une réservation.

----------------------------------------------------

## 5. Codes d’erreur

400 – Mauvaise requête  
401 – Token manquant / invalide  
404 – Non trouvé  
409 – Conflit  
500 – Erreur serveur
