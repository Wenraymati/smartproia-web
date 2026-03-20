# SmartProIA Web — Contexto del Proyecto

## Stack

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 15+ | Framework fullstack — App Router |
| React | 19 | UI |
| TypeScript | strict | Todo el proyecto |
| Tailwind CSS | 4 | Estilos |
| Upstash Redis | latest | Caché de señales y estado |
| MercadoPago | v2 | Suscripciones y pagos |
| Resend | latest | Emails transaccionales |
| Framer Motion | latest | Animaciones |
| Vercel Analytics | latest | Métricas de uso |

## Deploy

- **Plataforma:** Vercel
- **Auto-deploy:** Branch `master` → producción automática
- **Repo GitHub:** `Wenraymati/smartproia-web`
- **URL producción:** smartproia.com

No hacer push a `master` sin confirmación explícita de Matias.

## Variables de Entorno Clave

Nunca hardcodear. Todas en `.env` local y en Vercel Dashboard.

| Variable | Descripción |
|----------|-------------|
| `ADMIN_SECRET` | `smartproia-admin-2026` — acceso rutas admin |
| `UPSTASH_REDIS_REST_URL` | URL Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Token Upstash |
| `MERCADOPAGO_ACCESS_TOKEN` | Token MP producción |
| `RESEND_API_KEY` | API key Resend |

## Pipeline de Señales

```
pretrade.js (Clawd)
  → publish-channel.js --evening | (6AM cron)
    → Canal Telegram VIP (channelId: -1003809856981)
    → /api/update-signal (POST)
      → Upstash Redis
        → LiveSignal.tsx (polling)
```

Canal VIP WhatsApp: +56962326907

## Suscripciones

| Plan | Precio | Acceso |
|------|--------|--------|
| Canal VIP | $15/mes | Canal Telegram señales |
| PRO | $25/mes | Web + señales en tiempo real |

## Estructura de Directorios

```
app/                # App Router (Next.js 15)
  api/              # API routes
    update-signal/  # Endpoint para recibir señales de Clawd
    webhook/        # Webhooks MercadoPago
  (routes)/         # Páginas
public/             # Assets estáticos
```

## Reglas TypeScript

- `strict: true` siempre — no desactivar nunca
- No usar `any` — tipar todo explícitamente
- Componentes con tipos explícitos para props
- API routes con tipos de Request/Response

## Task Schedulers (Windows)

| Tarea | Horario | Script |
|-------|---------|--------|
| SmartProIA-PublishChannel | 6AM diario | publish-channel.js |
| SmartProIA-EveningSignal | 8:30PM Lun-Sab | publish-channel.js --evening |

## Reglas Operacionales

1. TypeScript strict — sin excepciones
2. ADMIN_SECRET solo en env var — nunca en código ni commits
3. No push a master sin confirmación de Matias
4. Revisar `~/.claude/skills/security.md` antes de cualquier PR
5. Redis keys de señales: no modificar schema sin revisar LiveSignal.tsx
