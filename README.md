# Paribas Backend (Node.js + Express + MongoDB)

## Installation

1. Installer les dépendances
```
npm install
```

2. Créer un fichier `.env` dans `backend/` avec:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/paribas
```

3. Lancer en dev
```
npm run dev
```

## Endpoints

- POST `/api/auth/register`
  - Body JSON:
    ```json
    {
      "nom": "string",
      "prenom": "string",
      "soldeCompte": 0,
      "deviseCompte": "EUR",
      "soldeElec": 0,
      "fraisDeblocage": 0
    }
    ```
  - Réponse: document utilisateur créé (sans mot de passe pour l’instant)
