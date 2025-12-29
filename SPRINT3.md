# Sprint 3: SaaS Foundation

> **Goal:** Multi-tenant ready foundation with Docker + async AI  
> **Started:** 2025-12-25  
> **Last Updated:** 2025-12-29

---

## Phase Order (Dependency-Based)
1. **Data Architecture** → Schema changes affect everything ✅
2. **DevOps** → Docker makes testing consistent ✅
3. **AI Orchestration** → Depends on new schema
4. **QA** → Tests verify all changes

---

## 📊 Progress

### Phase 1: Data Architecture ✅
- [x] 1.1 Create `workspaces` table + migration
- [x] 1.2 Create `files` table for upload metadata
- [x] 1.3 Create `ai_tasks` table (status tracking)
- [x] 1.4 Add TypeBox validation to all endpoints
- [x] 1.5 Migrate existing data to workspace model

### Phase 2: DevOps (Docker) ✅
- [x] 2.1 Backend Dockerfile (Bun multi-stage)
- [x] 2.2 Frontend Dockerfile (Vite build + Nginx)
- [x] 2.3 docker-compose.yml (full stack)
- [x] 2.4 @agentic/shared-types monorepo package
- [x] 2.5 Update CI/CD for Docker deployment
- [x] 2.6 Production: System Nginx → Docker (port 8080)

### Phase 3: AI Orchestration
- [ ] 3.1 Refactor `/api/chat` to return task_id immediately
- [ ] 3.2 Create `/api/ai-tasks/:id` status endpoint
- [ ] 3.3 Frontend polling with "Processing..." UI
- [ ] 3.4 Update Nginx timeout to 300s

### Phase 4: QA
- [ ] 4.1 Setup bun test infrastructure
- [ ] 4.2 Unit tests: CSV parsing, JWT, validation
- [ ] 4.3 E2E health check test
- [ ] 4.4 CI blocks on test failure

---

## ✅ Definition of Done
- [x] `docker-compose up` works on fresh Linux
- [x] All queries filter by `workspace_id`
- [ ] AI: always returns success OR error (no silent fails)
- [ ] GitHub Actions blocks failing tests

---

## 🌐 Production URL
- HTTP: `http://smart-analyst.72-62-67-226.nip.io`
- HTTPS: Pending (Let's Encrypt rate limited)

