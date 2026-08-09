import type { Metadata } from "next";

import { StatusCard } from "@/components/admin/status-card";
import { isDatabaseConfigured } from "@/db";

export const metadata: Metadata = {
  title: "Übersicht",
};

const workflowSteps = [
  "Discovery",
  "Freigegebene Spezifikation",
  "Freigegebenes Design-System",
  "Frontend",
  "Frontend-Freeze",
  "Backend-Integration",
  "Security-Audit",
  "Release-Verifikation",
];

export default function AdminPage() {
  const databaseConfigured = isDatabaseConfigured();

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Systemstatus</div>
        <h1>Saubere technische Grundlage</h1>
        <p>
          Die Anwendung enthält keine Kundendaten und keine Demo-Domäne. Fachliche Tabellen und
          Admin-Module entstehen erst aus dem freigegebenen Frontend-Vertrag.
        </p>
      </section>

      <section className="status-grid" aria-label="Technischer Status">
        <StatusCard
          title="Framework"
          value="Next.js 16"
          detail="App Router, React 19 und TypeScript Strict Mode."
          tone="ready"
        />
        <StatusCard
          title="Datenbank"
          value={databaseConfigured ? "Neon verbunden" : "Neon ausstehend"}
          detail={
            databaseConfigured
              ? "DATABASE_URL ist konfiguriert."
              : "DATABASE_URL nach der Neon-Bereitstellung ergänzen."
          }
          tone={databaseConfigured ? "ready" : "pending"}
        />
        <StatusCard
          title="Datenzugriff"
          value="Drizzle"
          detail="Lazy initialisiert und ohne Produktions-Fallback."
          tone="ready"
        />
      </section>

      <section className="workflow-panel" aria-labelledby="workflow-title">
        <div>
          <div className="eyebrow">Repository-Vertrag</div>
          <h2 id="workflow-title">Geplanter Delivery-Flow</h2>
        </div>
        <ol>
          {workflowSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
