<p align="center">
  <h1 align="center">🧠 AssistanceAI</h1>
  <p align="center">
    A multi-agent AI platform powered by LangGraph, Gemini, and a microservices backend.
    <br />
    <em>Chat · Code · Search · PDF · PPT · Image · Vision</em>
  </p>
</p>

---

## Overview

**AssistanceAI** is a full-stack, production-ready AI assistant platform built with a microservices architecture. A supervisor graph (LangGraph) dynamically routes user queries to specialized AI agents — each purpose-built for tasks like conversational chat, web search, code generation, document creation, and image generation.

### Key Features

- 🤖 **Multi-Agent System** — LangGraph supervisor graph with intelligent routing across 8 specialized agents
- 💬 **Conversational Chat** — Powered by Google Gemini 2.5 Flash
- 🔍 **Web Search** — Real-time internet search via Tavily API
- 💻 **Code Generation** — Context-aware coding assistant with syntax-highlighted artifacts
- 📄 **PDF Generation** — Automated PDF document creation with PDFKit
- 📊 **PPT Generation** — Slide deck creation with PptxGenJS
- 🖼️ **Image Generation** — AI-powered image creation via Gemini
- 👁️ **Vision Analysis** — Image understanding and description
- 📚 **PDF RAG** — Upload and query PDF documents with retrieval-augmented generation (Qdrant)
- 💳 **Billing & Credits** — Razorpay-integrated subscription system (Starter / Pro plans)
- 🔐 **Authentication** — Firebase Auth (Google OAuth) with Redis session management

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│  React 19 · Redux Toolkit · TailwindCSS 4 · Framer Motion      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Express.js)                     │
│  CORS · Helmet · Cookie Auth · Session Middleware · Proxy        │
│  Routes: /api/auth → Auth · /api/chat → Chat · /api/agent →     │
│          Agent · /api/billing → Billing · /api/me → Session      │
└──────┬──────────┬──────────┬──────────┬─────────────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
  ┌─────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
  │  Auth   │ │  Chat  │ │ Agent  │ │ Billing │
  │ Service │ │Service │ │Service │ │ Service │
  │ :8001   │ │ :8002  │ │ :8003  │ │ :8004   │
  └────┬────┘ └───┬────┘ └───┬────┘ └────┬────┘
       │          │          │            │
       ▼          ▼          ▼            ▼
  ┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
  │Firebase │ │MongoDB │ │LangGraph │ │ Razorpay │
  │ Admin   │ │ Atlas  │ │Supervisor│ │   API    │
  └─────────┘ └────────┘ └────┬─────┘ └──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
         ┌────────┐     ┌──────────┐     ┌──────────┐
         │ Gemini │     │  Tavily  │     │  Qdrant  │
         │2.5Flash│     │  Search  │     │ VectorDB │
         └────────┘     └──────────┘     └──────────┘
```

### Agent Routing Flow

```
User Prompt → Router Node → Agent Selection
                              ├── chat      → Gemini conversational response
                              ├── search    → Tavily web search → chat summary
                              ├── coding    → Code generation with artifacts
                              ├── pdf       → PDF document generation
                              ├── ppt       → PowerPoint slide generation
                              ├── image     → AI image generation
                              ├── vision    → Image analysis (auto-routed for image uploads)
                              └── pdf_rag   → PDF Q&A with RAG (auto-routed for PDF uploads)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Redux Toolkit, TailwindCSS 4, Framer Motion |
| **API Gateway** | Express.js 5, express-http-proxy, cookie-parser, Helmet |
| **Auth Service** | Firebase Admin SDK, MongoDB (Mongoose), Redis (ioredis) |
| **Chat Service** | Express.js, MongoDB (conversations & messages) |
| **Agent Service** | LangGraph, LangChain, Gemini 2.5 Flash, Tavily, Qdrant, PDFKit, PptxGenJS |
| **Billing Service** | Razorpay SDK, MongoDB (orders & payments) |
| **Database** | MongoDB Atlas |
| **Cache/Sessions** | Redis |
| **Auth Provider** | Firebase Authentication (Google OAuth) |
| **AI Models** | Google Gemini 2.5 Flash (via `@google/genai` and LangChain) |
| **Vector Store** | Qdrant (for PDF RAG) |
| **File Storage** | AWS S3 (for generated artifacts) |
| **Deployment** | Render (Web Services + Static Site + Redis) |

---

## Project Structure

```
cortex-ai/
├── cortex-ai/
│   ├── frontend/                    # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/          # UI components (Sidebar, ChatArea, etc.)
│   │   │   ├── pages/               # Page views (Home)
│   │   │   ├── redux/               # Redux slices (user, conversation, message)
│   │   │   ├── features/            # API modules (agent, billing, chat, message)
│   │   │   ├── hooks/               # Custom hooks (useCurrentUser)
│   │   │   └── utils/               # Axios instance
│   │   ├── firebase.js              # Firebase client config
│   │   └── package.json
│   │
│   └── backend/
│       ├── gateway/                 # API Gateway (port 5000/8000)
│       │   ├── middlewares/         # auth.middleware.js (session check)
│       │   ├── controllers/         # user.controller.js
│       │   └── utils/               # proxyWithHeaders.js
│       │
│       ├── services/
│       │   ├── auth/                # Auth Service (port 8001)
│       │   │   ├── config/          # firebase.js (Admin SDK)
│       │   │   ├── controllers/     # Login, logout, plan updates
│       │   │   ├── models/          # User model (Mongoose)
│       │   │   └── routes/          # Auth routes
│       │   │
│       │   ├── chat/                # Chat Service (port 8002)
│       │   │   ├── controllers/     # Conversation & message CRUD
│       │   │   ├── models/          # Conversation, Message models
│       │   │   └── routes/          # Chat routes
│       │   │
│       │   ├── agent/               # Agent Service (port 8003)
│       │   │   ├── agents/          # 8 specialized AI agents
│       │   │   ├── graph/           # LangGraph supervisor + router
│       │   │   ├── config/          # Model configs
│       │   │   └── utils/           # Model factory, helpers
│       │   │
│       │   └── billing/             # Billing Service (port 8004)
│       │       ├── controllers/     # Order creation, payment verification
│       │       ├── models/          # Order model
│       │       └── routes/          # Billing routes
│       │
│       └── shared/
│           └── redis/               # Shared Redis client
│
├── render.yaml                      # Render deployment blueprint
├── .gitignore                       # Git ignore rules
└── README.md                        # ← You are here
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **Redis** (local or cloud)
- **MongoDB** (Atlas recommended)
- **Firebase** project with Authentication enabled (Google provider)
- **Google Cloud** service account key for Firebase Admin SDK

### 1. Clone the Repository

```bash
git clone https://github.com/VibhuSuneja/assistance-ai.git
cd assistance-ai
```

### 2. Environment Variables

Each service has its own `.env` file. Create them with the following variables:

#### Gateway (`cortex-ai/backend/gateway/.env`)
```env
PORT=8000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
BILLING_SERVICE=http://localhost:8004
REDIS_URL=redis://localhost:6379
```

#### Auth Service (`cortex-ai/backend/services/auth/.env`)
```env
PORT=8001
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/auth
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
FIREBASE_SERVICE_ACCOUNT='<JSON string of your service account key>'
```

#### Chat Service (`cortex-ai/backend/services/chat/.env`)
```env
PORT=8002
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/chat
```

#### Agent Service (`cortex-ai/backend/services/agent/.env`)
```env
PORT=8003
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/agent
GOOGLE_API_KEY=<your-gemini-api-key>
TAVILY_API_KEY=<your-tavily-api-key>
QDRANT_URL=<your-qdrant-cloud-url>
QDRANT_API_KEY=<your-qdrant-api-key>
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_REGION=<your-aws-region>
S3_BUCKET=<your-s3-bucket>
```

#### Billing Service (`cortex-ai/backend/services/billing/.env`)
```env
PORT=8004
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/billing
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
AUTH_SERVICE_URL=http://localhost:8001
```

#### Frontend (`cortex-ai/frontend/.env`)
```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_RAZORPAY_KEY=<your-razorpay-public-key>
```

### 3. Install Dependencies

```bash
# Gateway
cd cortex-ai/backend/gateway && npm install

# Auth Service
cd ../services/auth && npm install

# Chat Service
cd ../chat && npm install

# Agent Service
cd ../agent && npm install

# Billing Service
cd ../billing && npm install

# Frontend
cd ../../../frontend && npm install
```

### 4. Start Services (Development)

Open separate terminals for each service:

```bash
# Terminal 1 — Gateway
cd cortex-ai/backend/gateway && node index.js

# Terminal 2 — Auth Service
cd cortex-ai/backend/services/auth && node index.js

# Terminal 3 — Chat Service
cd cortex-ai/backend/services/chat && node index.js

# Terminal 4 — Agent Service
cd cortex-ai/backend/services/agent && npm run dev

# Terminal 5 — Billing Service
cd cortex-ai/backend/services/billing && node index.js

# Terminal 6 — Frontend
cd cortex-ai/frontend && npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Deployment (Render)

The project includes a [`render.yaml`](render.yaml) blueprint for one-click deployment on [Render](https://render.com).

### Services Deployed:
| Service | Type | Port |
|---|---|---|
| `cortex-redis` | Redis | Internal |
| `cortex-auth-service` | Web Service | 5001 |
| `cortex-chat-service` | Web Service | 5002 |
| `cortex-agent-service` | Web Service | 5003 |
| `cortex-billing-service` | Web Service | 5004 |
| `cortex-gateway` | Web Service | 5000 |
| `cortex-frontend` | Static Site | — |

### Deploy Steps:
1. Push your code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com) → **New Blueprint Instance**.
3. Connect your GitHub repo and select the `render.yaml` file.
4. Set secret environment variables (`FIREBASE_SERVICE_ACCOUNT`, `MONGODB_URL`, API keys) in the Render dashboard.
5. Deploy.

---

## Security

- 🔒 **No credentials in version control** — All secrets stored in `.env` files (git-ignored).
- 🔑 **Firebase Admin SDK** — Loaded from `FIREBASE_SERVICE_ACCOUNT` environment variable (JSON string or Base64).
- 🍪 **Session-based auth** — HTTP-only secure cookies with Redis-backed sessions (7-day TTL).
- 🛡️ **Helmet** — Security headers on the gateway.
- 🌐 **CORS** — Restricted to `FRONTEND_URL` origin only.

---

## Credits System

| Agent | Cost per Use |
|---|---|
| Chat | 1 credit |
| Search | 5 credits |
| Coding | 10 credits |
| PDF Generation | 10 credits |
| PPT Generation | 10 credits |
| Image Generation | 10 credits |

### Plans

| Plan | Price | Credits |
|---|---|---|
| Free | ₹0 | 100 |
| Starter | ₹199 | 500 |
| Pro | ₹499 | 1,000 |

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request.

---

## License

This project is developed as a B.Tech Final Year Project.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/VibhuSuneja">Vibhu Suneja</a>
</p>
