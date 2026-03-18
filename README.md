# CCE Backend — EHPAD Room Configurator API

Node.js/Express REST API providing Google SSO authentication, user management, and configuration persistence for the **EHPAD Room Configurator (CCE)**.

> **CDA Context**: this project serves as the server layer for the *Concepteur Développeur d'Applications* professional certification (RNCP Level 6).


## Tech Stack

Runtime: Node.js ≥ 20 
Framework: Express 5.x
ORM: Sequelize 6.x 
DBMS: MySQL 8.0
DB Driver: mysql2 3.x
Google Auth: google-auth-library 10.x
JWT: jsonwebtoken 9.x 
Env Variables: dotenv 17.x
CORS: cors 2.x 
Dev: nodemon 3.x


## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 9
- **MySQL 8.0** installed and running (or via Docker)
- A **Google OAuth 2.0 Client ID** (Google Cloud Console → APIs & Services → Credentials)


## Installation

```bash
# Clone the repository
git clone https://github.com/hendrickBCYN/CCE_BACKEND.git
cd CCE_BACKEND

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in the values in .env (see section below)
```


## Environment Variables

`PORT`: Express server listening port `3000` 
`DB_HOST`: MySQL server host `localhost`
`DB_PORT`: MySQL port `3306` 
`DB_NAME`: Database name `cce_db`
`DB_USER`: MySQL user `root`
`DB_PASSWORD`: MySQL password *(required)*
`JWT_SECRET`: Secret key for JWT signing *(required)*
`GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID *(required)*


## Available Scripts

```bash
npm run dev       # Start the server with nodemon (auto-reload)
npm start         # Start the server in production mode
```


## Project Structure

```
src/
├── config/
│   └── database.js             # Sequelize configuration (MySQL connection)
├── middleware/
│   └── authMiddleware.js       # JWT verification on protected routes
├── models/
│   ├── index.js                # Sequelize initialization + model imports
│   ├── User.js                 # User model (Google SSO)
│   └── Configuration.js       # Configuration model (Unity data)
├── routes/
│   ├── authRoutes.js           # Authentication routes (/api/auth/*)
│   └── configurationRoutes.js  # CRUD configuration routes (/api/configurations/*)
├── controllers/
│   ├── authController.js       # Auth logic (Google verification, JWT issuance)
│   └── configurationController.js  # Configuration CRUD logic
└── server.js                   # Entry point — Express, Sequelize, and route initialization
```


## Data Model

Two entities linked by a **0:N** relationship (one user owns 0 to N configurations):

**USER**

`id`: INT (PK, auto) Unique identifier 
`google_id`: VARCHAR Unique Google identifier
`email`: VARCHAR Google email address 
`display_name`: VARCHAR Display name
`avatar_url`: VARCHAR Google profile picture URL 
`role`: VARCHAR User role 
`created_at`: DATETIME Creation date
`updated_at`: DATETIME Last update date

**CONFIGURATION**

`id`: INT (PK, auto) Unique identifier 
`user_id`: INT (FK) Reference to USER
`name`: VARCHAR Configuration name
`unity_data`: JSON Unity configuration data
`is_latest`: BOOLEAN  Whether this is the most recent configuration |
`created_at`: DATETIME  
`updated_at`: DATETIME 

Models are defined with **Sequelize ORM** and automatically synchronized at startup (`sequelize.sync()`).


## API Endpoints

### Authentication

`POST`: `/api/auth/google` Login via Google credential. Verifies the token with Google, creates or retrieves the user in the database, returns an application JWT + user info. 
`GET`: `/api/auth/verify` Verifies JWT validity. Returns user info if the token is valid.

### Configurations

`GET`: `/api/configurations` List the authenticated user's configurations
`GET`: `/api/configurations/:id` Retrieve a configuration by ID 
`POST`: `/api/configurations` Create a new configuration

All `/api/configurations/*` routes are protected by the `authMiddleware`, which verifies the `Authorization: Bearer <JWT>` header.


## Authentication Flow

1. The frontend sends the Google `credential` (Google JWT) via `POST /api/auth/google`
2. The backend verifies this credential with the Google API using `google-auth-library`
3. If valid: looks up the user by `google_id` in the database, or creates a new record if not found
4. Issues an **application JWT** signed with `JWT_SECRET` (containing `userId` and `email`)
5. Returns to the frontend: `{ token, user }`
6. For subsequent requests, the frontend sends the JWT in the `Authorization` header
7. The `authMiddleware` decodes and verifies the JWT before granting access


## Docker

The project is designed to be containerized via the `docker-compose.yml` located at the parent repository root:

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: cce_db
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./CCE_BACKEND
    ports:
      - "3001:3000"
    environment:
      PORT: 3000
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: cce_db
      DB_USER: root
      DB_PASSWORD: root_password
      JWT_SECRET: docker-jwt-secret-change-me
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
    depends_on:
      - db
```


## Related Project

- **Frontend**: [`CCE_FRONTEND`](https://github.com/hendrickBCYN/CCE_FRONTEND) — React 19 + Vite application with Unity WebGL integration

