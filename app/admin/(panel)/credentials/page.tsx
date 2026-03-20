export const dynamic = "force-dynamic";

import { CredentialsVault, type ResolvedService, type FieldType } from "../../components/CredentialsVault";

const SERVICES = [
  {
    name: "VPS Hostinger",
    group: "VPS",
    fields: [
      { label: "Panel URL", key: "CRED_HOSTINGER_URL", type: "url" as FieldType },
      { label: "Usuario", key: "CRED_HOSTINGER_USER", type: "text" as FieldType },
      { label: "Contrasena", key: "CRED_HOSTINGER_PASS", type: "password" as FieldType },
    ],
  },
  {
    name: "SSH VPS",
    group: "VPS",
    fields: [
      { label: "IP", key: "CRED_SSH_IP", type: "text" as FieldType },
      { label: "Usuario", key: "CRED_SSH_USER", type: "text" as FieldType },
      { label: "Clave SSH path", key: "CRED_SSH_KEY_PATH", type: "text" as FieldType },
    ],
  },
  {
    name: "Chatwoot",
    group: "Apps",
    fields: [
      { label: "URL", key: "CRED_CHATWOOT_URL", type: "url" as FieldType },
      { label: "Email", key: "CRED_CHATWOOT_EMAIL", type: "text" as FieldType },
      { label: "Contrasena", key: "CRED_CHATWOOT_PASS", type: "password" as FieldType },
    ],
  },
  {
    name: "Uptime Kuma",
    group: "Apps",
    fields: [
      { label: "URL", key: "CRED_UPTIME_URL", type: "url" as FieldType },
      { label: "Usuario", key: "CRED_UPTIME_USER", type: "text" as FieldType },
      { label: "Contrasena", key: "CRED_UPTIME_PASS", type: "password" as FieldType },
    ],
  },
  {
    name: "Evolution API",
    group: "APIs",
    fields: [
      { label: "URL", key: "CRED_EVOLUTION_URL", type: "url" as FieldType },
      { label: "API Key", key: "CRED_EVOLUTION_APIKEY", type: "password" as FieldType },
    ],
  },
  {
    name: "PostgreSQL (VPS)",
    group: "APIs",
    fields: [
      { label: "Host", key: "CRED_PG_HOST", type: "text" as FieldType },
      { label: "Usuario", key: "CRED_PG_USER", type: "text" as FieldType },
      { label: "Contrasena", key: "CRED_PG_PASS", type: "password" as FieldType },
      { label: "Database", key: "CRED_PG_DB", type: "text" as FieldType },
    ],
  },
  {
    name: "Upstash Redis",
    group: "APIs",
    fields: [
      { label: "REST URL", key: "CRED_UPSTASH_URL", type: "url" as FieldType },
      { label: "Token", key: "CRED_UPSTASH_TOKEN", type: "password" as FieldType },
    ],
  },
] as const;

export default function CredentialsPage() {
  const resolved: ResolvedService[] = SERVICES.map((service) => ({
    name: service.name,
    group: service.group,
    fields: service.fields.map((field) => ({
      label: field.label,
      type: field.type,
      value: process.env[field.key] ?? null,
    })),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Credenciales</h1>
        <p className="text-slate-500 text-sm mt-1">
          Accesos a servicios y APIs del sistema
        </p>
      </div>

      <CredentialsVault services={resolved} />
    </div>
  );
}
