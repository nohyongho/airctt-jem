**CTT 전체 아키텍처 (요약)**

이 문서는 `CTT-CRM`(관리자)과 `ctt-consumer`(소비자)를 포함한 CTT 시스템의 전체 아키텍처 개요입니다.
목표: 리포지토리 구조, API 네임스페이스, 핵심 DB 스키마, RBAC, 주요 모듈(AR/이벤트/SNS/AI/마케팅 등) 통합 계획과 우선순위를 한눈에 볼 수 있게 정리합니다.

**전제**
- 모노레포(권장): `apps/consumer`, `apps/crm`, `packages/shared`, `services/worker` 구조
- DB: PostgreSQL (jsonb, uuid), 비동기 작업: Redis + BullMQ 또는 RabbitMQ
- 파일/자산: S3 호환 스토리지 + CDN

**목차**
- **Repository Layout**
- **Runtime / Infra**
- **API 네임스페이스 및 예시 엔드포인트 (TypeScript)**
- **핵심 DB 스키마 (요약 + SQL 스니펫)**
- **RBAC: 역할 / 권한 리스트**
- **모듈별 설계 요약**
  - SNS / Gift
  - News / Event / Jackpot
  - AR Studio
  - Event Engine
  - AI 고객·안전 관리
  - 제품/재고/판매 관리
  - AI 마케팅 제안
  - Pet-AI (R&D placeholder)
- **통합 계획 & 우선순위**
- **다음 단계**

**Repository Layout (권장)**
- `apps/consumer` : 기존 `ctt-consumer` 앱 (Next.js app dir)
- `apps/crm` : 관리자 패널 (Next.js 또는 React 기반)
- `packages/shared` : 공용 타입, API 클라이언트, auth, RBAC 유틸
- `packages/ui` : 공용 UI 컴포넌트
- `packages/db` : 마이그레이션, Prisma/Knex 설정
- `services/worker` : 비동기 작업(AR 처리, 이벤트 실행, AI job)
- `services/media` : 3D 변환, 썸네일 생성
- `docker-compose.yml` : Postgres, Redis, MinIO (개발용)

**Runtime / Infra (권장 구성)**
- Database: PostgreSQL (v14+), 확장: pgcrypto 또는 uuid-ossp
- Cache / Queue: Redis (+ BullMQ) — 이벤트/AI/AR 작업 큐
- Object Storage: S3 / MinIO (3D 모델, 오디오, 이미지 보관)
- Real-time: Socket.IO / Pusher / Redis PubSub
- AI: 외부 LLM/embedding 서비스(예: OpenAI, 자체 벡터 DB) + worker

**API 네임스페이스**
- `/api/public/...` : 소비자용 공용 엔드포인트
- `/api/admin/...` : 관리자 전용(권한 미들웨어 적용)
- `/api/internal/...` : 내부/worker 통신 전용 (인증 제한)

예시: TypeScript 핸들러 서명(Next.js App Router)
- `apps/consumer/app/api/public/chat/route.ts` → export async function POST(req: Request) { /* create message */ }
- `apps/crm/app/api/admin/events/route.ts` → export async function GET(req: Request) { /* list events */ }

**핵심 DB 스키마 요약 (중요 테이블)**
- `users` (회원/관리자 공통)
  - `id uuid PK`, `email text unique`, `password_hash text`, `name text`, `phone text`, `is_active boolean`, `created_at`

- `roles` / `permissions` / `role_permissions` / `user_roles`
  - roles: id, name
  - permissions: id, name
  - role_permissions(role_id, permission_id)
  - user_roles(user_id, role_id, scope_type, scope_id)

- `merchants`, `stores` (가맹점/매장)

- `products`, `inventory_movements`, `sales_records`

- `orders`, `order_items`, `payments`

- `chats`, `chat_messages`, `gifts`, `gift_transfers`, `chat_moderation_logs`

- `news`, `events`, `event_entries`, `event_templates`, `event_runs`, `event_winners`

- `ar_models`, `ar_sessions`, `event_assets`

- `ai_profiles`, `safety_flags`, `ai_audit`

필수 SQL 스니펫 (참고)
-- users / roles
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text,
  name text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE roles (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text
);

CREATE TABLE user_roles (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id int REFERENCES roles(id),
  scope_type text DEFAULT 'global',
  scope_id uuid NULL,
  PRIMARY KEY(user_id, role_id, scope_type, scope_id)
);

-- chats / messages
CREATE TABLE chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  content text,
  attachments jsonb,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

-- gifts
CREATE TABLE gifts (
  id serial PRIMARY KEY,
  code text UNIQUE,
  name text NOT NULL,
  price_cents int NOT NULL,
  is_active boolean DEFAULT true,
  meta jsonb
);

CREATE TABLE gift_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id int REFERENCES gifts(id),
  from_user uuid REFERENCES users(id),
  to_user uuid REFERENCES users(id),
  order_id uuid REFERENCES orders(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- event templates & runs
CREATE TABLE event_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  steps jsonb NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE event_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES event_templates(id),
  user_id uuid REFERENCES users(id),
  state jsonb,
  result jsonb,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz
);

-- AR models
CREATE TABLE ar_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id),
  name text,
  asset_url text,
  thumbnail_url text,
  format text,
  meta jsonb,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

**RBAC: 역할(Role) 및 권한(Permission) 설계(요약)**
- 역할(권장 기본): `superadmin`, `admin`, `merchant_owner`, `merchant_staff`, `user`
- 권한(샘플):
  - `auth:login`, `users:read`, `users:manage`
  - `stores:read`, `stores:manage`, `products:crud`, `inventory:adjust`
  - `orders:read`, `orders:update_status`, `orders:refund`
  - `events:manage`, `events:trigger`, `events:verify_winner`
  - `chat:moderate`, `chat:read`, `chat:write`, `gifts:send`, `gifts:manage`
  - `ar:upload`, `ar:manage`, `ai:moderate`, `marketing:suggestions:apply`

권한 적용 방식: 각 API 엔드포인트에 `requirePermission('x:y')` 미들웨어 적용. 일부 권한은 scope(merchant_id) 기반으로 허용.

**모듈별 설계 요약 (중요 포인트)**

1) SNS Chat & Gift
- 실시간 메시징: Socket.IO 또는 Pusher + Redis pub/sub
- 메시지 저장: `chat_messages`, 모더레이션 로그 필요
- 선물 흐름: 상품(선물) 선택 → 결제(order 생성) → `gift_transfers` 기록 → 수취인 알림

2) News / Event / Jackpot
- 이벤트 템플릿 + 런 기록, 관리자에서 당첨자 검증 워크플로 필요
- `news`는 공지/채용/지역 이벤트 타입으로 분리

3) AR Studio Room
- Asset 업로드 → Worker에서 glTF 변환 / LOD 생성 → S3 업로드 → consumer 뷰어(three.js, model-viewer)
- Break-apart 모드는 model metadata와 단계별 파트 분리 정보 필요

4) Event Engine
- 템플릿(steps jsonb) 기반으로 Worker가 단계별 실행, 실시간 업데이트는 SSE/WebSocket으로 전달
- 시각/오디오 에셋은 `event_assets`로 관리

5) AI customer & safety management
- 메시지·콘텐츠는 moderation pipeline을 통과시키고 위험 점수 초과 시 자동 플래그
- AI 프로파일(임베딩)로 개인화, 로그는 `ai_audit`에 보관

6) Store product, sales, inventory management
- `inventory_movements`로 모든 재고 변경을 기록하고 알림/자동 재주문(reorder) 트리거

7) AI-driven marketing suggestions
- Batch/stream 분석으로 `marketing_suggestions` 생성, CRM에서 수락 시 캠페인으로 변환

8) Pet communication AI (R&D placeholder)
- 명확한 동의(consent) 요구, 데이터 익명화 및 별도 queue/job으로 보관

**API 엔드포인트 요약 (대표)**
- Auth: `POST /api/public/auth/login`, `POST /api/public/auth/logout`, `POST /api/public/auth/refresh`
- Users: `GET /api/admin/users`, `GET /api/public/users/:id`, `POST /api/admin/users`
- Stores/Products: `GET /api/public/stores`, `GET /api/public/stores/:id`, `POST /api/admin/stores`, `POST /api/admin/stores/:id/products`
- Orders: `POST /api/public/orders`, `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status`
- Chat/Gifts: `GET /api/public/chat`, `POST /api/public/chat/:chatId/messages`, `POST /api/public/chat/:chatId/send-gift`
- News/Events: `GET /api/public/news`, `POST /api/admin/events`, `POST /api/admin/jackpots/:id/verify-winner`
- AR: `POST /api/admin/ar/models` (upload), `GET /api/public/ar/models/:id` (metadata)
- Event Engine: `POST /api/public/events/:id/trigger`, `GET /api/public/events/:runId/status`
- AI: `POST /api/internal/ai/moderate`, `POST /api/public/ai/chat`

각 엔드포인트는 `packages/shared/auth`의 토큰/권한 체크 미들웨어를 통과하도록 설계.

**Integration Plan (단계별)**
1. 공통 패키지 초기화: `packages/shared` (타입, auth, api-client) 생성
2. Infra: `docker-compose`로 Postgres/Redis/MinIO 구성
3. 인증·RBAC 구현 및 초기 마이그레이션(users, roles, user_roles)
4. Consumer 기본 플로우(상점 목록→주문) 및 CRM 로그인/대시보드
5. SNS + News/Event MVP (채팅 저장, 선물 기록, 뉴스 게시)
6. Product/Inventory → AR → Event Engine → AI 순으로 단계적으로 추가

**우선순위(데모 권장)**
- 1차 데모: 인증/RBAC + consumer 주문 플로우 + CRM 로그인·간단 대시보드 + SNS(채팅 최소 기능) + News 게시
- 2차: Inventory/Products, Gift 결제 연동, Event participation
- 3차: AR 자산 파이프라인, Event Engine, AI moderation

**운영·보안 권장 사항**
- 모든 민감 데이터는 암호화, 로그/감사기록(`audit_logs`) 유지
- AI 기능은 사용자 동의, 사용량 제한, 감사 로그 필요
- 대용량 자산(3D)은 CDN + LRU 캐시 전략 권장

**다음 단계(제가 할 일)**
- 원하시면 이 문서를 기반으로 `packages/shared` 스켈레톤, `apps/crm` 스캐폴드, 초기 마이그레이션 SQL 파일들을 생성해 드립니다.

---
파일 위치: `d:/CTT-CRM/ctt-consumer/architecture.md`
