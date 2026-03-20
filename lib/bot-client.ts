export interface BotHealthResponse {
  status: "ok" | "db_error" | "error";
  ts?: number;
}

export interface GymBotMetrics {
  today_leads: number;
  critical: number;
  hot: number;
  warm: number;
  cool: number;
  cold: number;
  conversion_rate: number;
  gym_name: string;
}

export interface GymBotLead {
  id: number;
  wa_id: string;
  nombre: string | null;
  telefono: string | null;
  plan_interes: string | null;
  goal: string | null;
  score: number;
  temperature: string; // "CRITICAL" | "HOT" | "WARM" | "COOL" | "COLD"
  estado: string;
  notas: string | null;
  source: string | null;
  last_interaction: number | null;
  created_at: number;
  updated_at: number;
}

export interface RuizRuizStats {
  total: number;
  nuevo: number;
  contactado: number;
  cerrado: number;
  urgentes: number;
  hoy: number;
}

export interface RuizRuizLead {
  id: number;
  wa_id: string;
  nombre: string | null;
  telefono: string | null;
  servicio: string | null;
  tamano_empresa: string | null;
  urgencia: number;
  estado: string;
  score: number;
  notas: string | null;
  source: string | null;
  created_at: number;
  updated_at: number;
}

async function fetchBot<T>(
  baseUrl: string,
  token: string,
  path: string,
  timeout = 5000
): Promise<T | null> {
  if (!baseUrl) return null;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { "x-dashboard-token": token },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(id);
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

function gymUrl() { return process.env.GYMBOT_URL ?? ""; }
function gymToken() { return process.env.GYMBOT_DASHBOARD_TOKEN ?? ""; }
function ruizUrl() { return process.env.RUIZRUIZ_URL ?? ""; }
function ruizToken() { return process.env.RUIZRUIZ_DASHBOARD_TOKEN ?? ""; }

export const getGymBotHealth = () =>
  fetchBot<BotHealthResponse>(gymUrl(), gymToken(), "/health");
export const getGymBotMetrics = () =>
  fetchBot<GymBotMetrics>(gymUrl(), gymToken(), "/api/metrics");
export const getGymBotLeads = () =>
  fetchBot<GymBotLead[]>(gymUrl(), gymToken(), "/api/leads");

export const getRuizRuizHealth = () =>
  fetchBot<BotHealthResponse>(ruizUrl(), ruizToken(), "/health");
export const getRuizRuizStats = () =>
  fetchBot<RuizRuizStats>(ruizUrl(), ruizToken(), "/api/stats");
export const getRuizRuizLeads = () =>
  fetchBot<RuizRuizLead[]>(ruizUrl(), ruizToken(), "/api/leads");
