export interface BotHealthResponse {
  status: "ok" | "error";
  uptime?: number;
  version?: string;
}

export interface GymBotMetrics {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  conversions: number;
}

export interface GymBotLead {
  id: string;
  phone: string;
  name?: string;
  temperature: "hot" | "warm" | "cold";
  createdAt: string;
  lastMessage?: string;
}

export interface RuizRuizStats {
  totalLeads: number;
  byEstado: Record<string, number>;
}

export interface RuizRuizLead {
  id: string;
  phone: string;
  name?: string;
  estado: string;
  createdAt: string;
  lastMessage?: string;
}

async function fetchBot<T>(
  baseUrl: string,
  token: string,
  path: string,
  timeout = 5000
): Promise<T | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { "x-dashboard-token": token },
      signal: controller.signal,
      next: { revalidate: 0 },
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
  fetchBot<GymBotMetrics>(gymUrl(), gymToken(), "/dashboard/metrics");
export const getGymBotLeads = () =>
  fetchBot<GymBotLead[]>(gymUrl(), gymToken(), "/dashboard/leads");

export const getRuizRuizHealth = () =>
  fetchBot<BotHealthResponse>(ruizUrl(), ruizToken(), "/health");
export const getRuizRuizStats = () =>
  fetchBot<RuizRuizStats>(ruizUrl(), ruizToken(), "/dashboard/stats");
export const getRuizRuizLeads = () =>
  fetchBot<RuizRuizLead[]>(ruizUrl(), ruizToken(), "/dashboard/leads");
