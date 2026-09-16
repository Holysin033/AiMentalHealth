<div align="right">

[简体中文](./README.md) | **English**

</div>

# 🧠 AI Mental Health Assistant

A mental health self-care platform built with **Vue 3 + Vite + Element Plus**, featuring **AI-powered streaming counseling (SSE)**, an emotion diary, and a psychology knowledge base — with dedicated interfaces for end users and administrators.

> A front-end learning project backed by a public test API. Works out of the box.

---

## ✨ Features

### User Side (`/front`)
| Module | Description |
|--------|-------------|
| 💬 **AI Counseling** | Streaming chat over SSE with word-by-word AI reply rendering (Markdown supported); lazy temp-session creation, multi-session switching, session deletion; post-chat emotion analysis |
| 📔 **Emotion Diary** | 1–10 mood rating (tiered captions & colors), 8 emotion presets, trigger & reflection records, sleep/stress life indicators, reset & double-submit protection |
| 📚 **Knowledge Base** | Paged article list, hot-recommend sidebar (sorted by read count), article detail (rich-text body, tags, author info), single/double-line text truncation |
| 🔐 **Auth** | Token + localStorage persistence with role-based routing |

### Admin Side (`/back`)
| Module | Description |
|--------|-------------|
| 📊 **Dashboard** | ECharts analytics board |
| 📄 **Article Management** | Article CRUD (wangEditor rich text), table search |
| 🗂 **Consultation & Diary Logs** | User session and diary data management |

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Core Framework | Vue 3.5 (Composition API + `<script setup>`) |
| Build Tool | Vite 8 |
| UI Library | Element Plus 2.13 + `@element-plus/icons-vue` |
| State Management | Pinia 3 + pinia-persistedstate-plugin (persistence) |
| Routing | Vue Router 4 (History mode + role-based guards) |
| HTTP Client | Axios (unified wrapper + response interceptor) |
| AI Streaming | @microsoft/fetch-event-source (SSE via POST) |
| Charts | ECharts 6 |
| Rich Text | wangEditor 5 |
| Styling | SCSS (nested + scoped) |
| Auto Import | unplugin-auto-import / unplugin-vue-components / unplugin-icons |

---

## 🚀 Quick Start

### Requirements
- **Node.js ≥ 20.19** (or ≥ 22.12, required by Vite 8)
- npm / pnpm / yarn — any package manager

### Install & Run

```bash
# 1. Clone the project
git clone https://github.com/ <your-username> /ai_mental_health.git
cd ai_mental_health </your-username>

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
open the URL printed in the console (defaults to `http://localhost:5173`).

### Production Build

```bash
npm run build     # Outputs to dist/
npm run preview   # Preview the production build locally

> A Vite proxy (`/api → http://159.75.169.224:1235/api`) is pre-configured to bypass CORS during development. To use your own backend, change the `target` in `server.proxy` inside `vite.config.js`.

---

## 📁 Project Structure

```text
ai_mental_health/
├── src/
│   ├── api/                    # API layer (split by side)
│   │   ├── frontend.js         # User-side APIs (sessions/diary/articles/emotion)
│   │   ├── admin.js            # Admin-side APIs
│   │   └── chatStream.js       # SSE chat (fetch-event-source wrapper)
│   ├── assets/                 # Static assets (images, global styles)
│   ├── components/             # Shared components
│   │   ├── MarkdownRenderer.vue  # Markdown rendering for AI messages
│   │   ├── RichTextEditor.vue    # wangEditor wrapper
│   │   ├── ArticleDialog.vue     # Article editing dialog
│   │   ├── TableSearch.vue       # Table search
│   │   ├── NavBar.vue / SideBar.vue / PageHead.vue
│   ├── constants/              # Constants (emotion caption mappings, etc.)
│   ├── layouts/                # Three layouts: frontend / backend / auth
│   ├── router/                 # Route table + global guards
│   ├── store/                  # Pinia store (admin)
│   ├── utils/
│   │   ├── request.js          # Axios instance (interceptor unwraps data.data)
│   │   ├── mapFunction.js      # Pure utility functions
│   │   └── others.js
│   ├── views/
│   │   ├── auth/               # Login / Register
│   │   ├── frontend/           # User-side pages (chat/diary/knowledge/home)
│   │   └── backend/            # Admin-side pages (dashboard/articles/logs)
│   ├── App.vue
│   └── main.js
├── vite.config.js              # Proxy, auto-import, alias config
└── package.json

---

## 🗺 Route Map

| Path | Page | Notes |
|------|------|-------|
| `/auth/login` `/auth/register` | Login / Register | Unauthenticated users are redirected here |
| `/front/index` | Home | Default user-side page |
| `/front/consultation` | AI Counseling | SSE streaming chat |
| `/front/emotion` | Emotion Diary | Daily records |
| `/front/knowledge` | Knowledge Base | Article list + hot recommendations |
| `/front/knowledge/article/:id` | Article Detail | UUID param |
| `/back/dashboard` | Analytics Dashboard | Default admin-side page |
| `/back/knowledge` `/back/consultation` `/back/emotion` | Content Management | — |

**Route Guard**: `beforeEach` validates the token and `userInfo.userType` from localStorage — `userType: 1` (user) may only access `/front/**`, `userType: 2` (admin) may only access `/back/**`. Unauthorized access redirects to the corresponding side's home page; invalid data is cleared and the user is sent back to the login page.

---

## 🔑 Implementation Notes

### 1. SSE Streaming Chat
Uses `@microsoft/fetch-event-source` to initiate SSE over **POST** (native EventSource only supports GET):
POST /api/psychological-chat/stream
Header: { token, Accept: text/event-stream }
Body:   { sessionId, userMessage }

- The server pushes chunks of `{ code, data: { content } }`; the `done` event marks the end
- `AbortController` aborts the stream on component unmount / session switch
- Business errors arrive via `event: error`; network errors are handled in `onerror`

### 2. Request Interceptor
The response interceptor in `utils/request.js` unwraps and returns `data.data` directly — components receive business data without extra `.data` access. Errors are thrown uniformly and caught by each page's try-catch with an ElMessage toast.

### 3. On-demand Auto Import
Vite plugins auto-register Element Plus components and icons (`unplugin-vue-components`) and auto-import Vue APIs (`unplugin-auto-import`). Type declarations are generated at `src/auto-imports.d.ts` and `src/components.d.ts`.

---

## 📌 Known Issues & TODO

- [ ] The `session_` prefix format used after clicking a session in the list needs further verification against the backend
- [ ] Chat error bubble (`isError`) style branch is ready but not yet wired to error states
- [ ] Emotion diary history query API not yet available (backend only offers upsert)
- [ ] Admin-side article management page needs polishing
- [ ] Add ESLint + Prettier for consistent code style

---

> ⚠️ The English version may lag behind the [Chinese version](./README.md). When in doubt, refer to the Chinese docs.

---

## 📄 License

[MIT](LICENSE)