# 🐳 Dockerized Multi-Service Application

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A complete multi-container application — **React frontend, Node.js backend, PostgreSQL database, and an Nginx reverse proxy** — all orchestrated with a single `docker-compose up`. This is the exact pattern behind the most common freelance DevOps request: *"Can you dockerize my application?"*

---

## 📐 Architecture

```
                    Client Browser
                         │
                         ▼
              ┌─────────────────────┐
              │   Nginx Reverse      │   :80 (only exposed port)
              │   Proxy               │
              └─────────────────────┘
                    │           │
            "/"     │           │  "/api/*"
                    ▼           ▼
        ┌──────────────┐  ┌──────────────┐
        │ React         │  │ Node.js       │
        │ Frontend      │  │ Backend       │
        │ (served via   │  │ (Express API) │
        │ its own nginx)│  │               │
        └──────────────┘  └──────┬───────┘
                                  │
                                  ▼
                          ┌──────────────┐
                          │ PostgreSQL    │
                          │ Database      │
                          └──────────────┘
```

**Why this matters:** the browser only ever talks to port 80. The reverse proxy decides, based on the URL path, whether a request goes to the frontend or the backend. The frontend never hardcodes the backend's address — it just calls `/api/...` and lets Nginx route it. This is exactly how production setups isolate internal services from the outside world.

All four containers communicate over a private Docker network (`app-network`) and can reach each other by **service name** (e.g. the backend connects to the database at host `db`, not an IP address).

---

## 🧰 Tech Stack

| Service | Technology |
|---|---|
| Frontend | React 18 (built with Vite), served via Nginx |
| Backend | Node.js + Express, REST API |
| Database | PostgreSQL 16 |
| Reverse Proxy | Nginx |
| Orchestration | Docker Compose |

---

## 📁 Project Structure

```
dockerized-multi-service-app/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── server.js          # Express app & routes
│   ├── db.js               # PostgreSQL connection pool
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf           # Serves the built static files
│   ├── Dockerfile           # Multi-stage: build → serve
│   └── .dockerignore
├── nginx/
│   └── nginx.conf           # Top-level reverse proxy config
└── db/
    └── init.sql             # Creates table + seed data on first run
```

---

## 🚀 Running It

**Prerequisites:** Docker and Docker Compose installed.

```bash
# Clone the repo
git clone https://github.com/Hacker3S/dockerized-multi-service-app.git
cd dockerized-multi-service-app

# Copy environment template
cp .env.example .env

# Build and start everything
docker-compose up --build
```

Once all four containers are up, visit:

- **App:** http://localhost
- **API directly:** http://localhost/api/items
- **Health check:** http://localhost/api/health

Stop everything with:
```bash
docker-compose down
```

Stop and wipe the database volume too (fresh start):
```bash
docker-compose down -v
```

---

## ⚙️ How the Services Talk to Each Other

1. **Browser → Reverse Proxy (`:80`)** — the only port exposed to the host machine.
2. **Reverse Proxy → Frontend** — any request to `/` is forwarded to the `frontend` container's internal Nginx, which serves the built React static files.
3. **Reverse Proxy → Backend** — any request to `/api/*` is forwarded to the `backend` container on port 5000.
4. **Backend → Database** — the Express API queries PostgreSQL using the service name `db` as the hostname, resolved automatically by Docker's internal DNS.

Because everything talks over service names instead of hardcoded IPs, you could scale or move any single container without touching the others.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/items` | Fetch all items |
| POST | `/api/items` | Add a new item (`{ "name": "..." }`) |

---

## 🧪 Verifying Each Layer Independently

```bash
# Confirm all containers are running
docker-compose ps

# Check backend logs
docker-compose logs backend

# Check database logs
docker-compose logs db

# Exec into the database directly
docker-compose exec db psql -U postgres -d appdb -c "SELECT * FROM items;"
```

---

## 💡 What This Project Demonstrates

- Multi-container orchestration with Docker Compose
- Service-to-service communication over a private Docker network
- Nginx as a reverse proxy, routing by URL path to different backend services
- Multi-stage Docker builds (compiling a React app, then serving only the static output — keeping the final image small)
- Environment-variable-driven configuration instead of hardcoded credentials
- Persistent data with named volumes (database survives container restarts)
- Container healthchecks and startup dependency ordering (`depends_on: condition: service_healthy`)

---

## 🚀 Possible Extensions

- Add HTTPS via Nginx + Let's Encrypt (Certbot)
- Add a `docker-compose.prod.yml` override for production settings
- Add pgAdmin as a fifth service for visual database inspection
- Connect this to the CI/CD pipeline from Project 1 to auto-build and deploy on push

---

## 👤 Author

**Shawn Sreeju Sampath**
[GitHub](https://github.com/Hacker3S) · [LinkedIn](https://linkedin.com/in/shawn-sreeju-sampath-074923377)

---

## 📄 License

This project is licensed under the MIT License.
