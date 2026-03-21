export const COTIZAR_LEAD_STATUSES = [
  "nuevo",
  "contactado",
  "cerrado",
  "descartado",
] as const;

export type CotizarLeadStatus = (typeof COTIZAR_LEAD_STATUSES)[number];

export interface CotizarLead {
  id: string;
  name?: string;
  phone?: string;
  industry: string;
  volume: string;
  features: string[];
  plan: string;
  setup: string;
  monthly: string;
  createdAt: string;
  status?: CotizarLeadStatus;
}
