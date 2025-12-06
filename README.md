# The Smart Analyst 🕵️‍♂️📊

> **Vision**: A Data Analytics Dashboard empowered by Agentic AI.

## 🌟 The Concept
It's not just about *seeing* the data; it's about *understanding* it.
We are building a dashboard where you can talk to your data.
-   **Visuals**: Beautiful charts showing key metrics.
-   **Intelligence**: An embedded AI Agent (n8n) that explains the "Why" behind the numbers.

## 🏎️ The Tech Stack
We prioritized **Developer Experience (DX)**, **Performance**, and **Type Safety**.

-   **Runtime:** [Bun](https://bun.com) 🥟
-   **Backend:** [ElysiaJS](https://elysiajs.com) 🦊
-   **Frontend:** [React](https://react.dev) + [Vite](https://vitejs.dev) ⚡
-   **Database:** [Turso](https://turso.tech) / LibSQL 💽
-   **Styling:** [Tailwind CSS v3](https://tailwindcss.com) 🎨
-   **Automation:** [n8n](https://n8n.io) 🤖

## 🚀 Quick Start

### Prerequisites
-   [Bun](https://bun.com) installed.

### Installation
```bash
# 1. Clone & Install
bun install

# 2. Setup Database
bun run server/scripts/migrate.ts
```

### Running Development Mode
**Terminal 1 (Backend):**
```bash
bun run server/src/index.ts
```

**Terminal 2 (Frontend):**
```bash
bun run dev --cwd client
```

## 🔄 How it Works
1.  **The Dashboard** fetches metrics from the database and renders charts.
2.  **The User** asks a question ("Why is sales down?").
3.  **The Server** forwards this to an **n8n Workflow**.
4.  **The Agent** analyzes the raw data and returns a textual insight.
5.  **The UI** displays the AI's answer alongside the charts.

## 🏰 Production Deployment ("The Server Architect")

We use a **Bare Metal** strategy on a Linux VPS (Hostinger KVM) to practice fundamental DevOps skills.

### Architecture
-   **Hardware**: Ubuntu 24.04 VPS (4GB RAM).
-   **Reverse Proxy**: Nginx (handling SSL & Routing).
    -   `dashboard.yourdomain.com` -> `localhost:3000` (Bun App)
    -   `n8n.yourdomain.com` -> `localhost:5678` (n8n Docker)
-   **Application**:
    -   **Bun**: Runs as a native `systemd` service for maximum performance.
    -   **n8n**: Runs in **Docker** for ease of maintenance.
-   **Security**:
    -   Root login disabled.
    -   SSH Keys only.
    -   UFW Firewall restricted to ports 22, 80, 443.
