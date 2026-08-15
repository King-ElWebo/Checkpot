"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { savePageAction } from "../actions";

interface PageData {
  id?: string;
  routeKey?: string;
  content?: Record<string, unknown>;
  visibility?: boolean;
}

export default function PageEditClient({
  isNew,
  id,
  initialData,
}: {
  isNew: boolean;
  id: string;
  initialData: PageData | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      await savePageAction(isNew ? null : id, formData);
      router.push("/admin/pages");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Fehler beim Speichern.";
      setError(message);
    }
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Seiteninhalte (Erweitert)</div>
        <h1>{isNew ? "Neuen Seiteninhalt anlegen" : `Seite: ${initialData?.routeKey || "Bearbeiten"}`}</h1>
        <p className="text-xs text-[#b45309] bg-[#fef3c7] p-2.5 rounded-lg border border-[#fde68a] mt-2">
          Hinweis: Diese strukturierten JSON-Inhalte werden von den aktuellen öffentlichen Seiten nicht direkt verwendet.
        </p>
      </section>

      <section className="login-panel" style={{ width: "100%", maxWidth: "800px" }}>
        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: 0 }}>
          <div className="field-group">
            <label htmlFor="routeKey">Route Key (z.B. &quot;home&quot;, &quot;ueber-uns&quot;) *</label>
            <input type="text" id="routeKey" name="routeKey" defaultValue={initialData?.routeKey || ""} required />
          </div>

          <div className="field-group" style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "10px" }}>
            <input type="checkbox" id="visibility" name="visibility" value="true" defaultChecked={initialData?.visibility ?? true} style={{ width: "24px", minHeight: "24px" }} />
            <label htmlFor="visibility" style={{ fontSize: "1rem" }}>Sichtbar</label>
          </div>

          <div className="field-group">
            <label htmlFor="content">Inhalts-Blöcke (JSON Format)</label>
            <textarea
              id="content"
              name="content"
              defaultValue={initialData?.content ? JSON.stringify(initialData.content, null, 2) : "{\n  \"title\": \"\",\n  \"blocks\": []\n}"}
              rows={15}
              style={{ width: "100%", border: "1px solid #d6d3d1", borderRadius: "10px", padding: "14px", background: "var(--surface)", fontFamily: "monospace", fontSize: "0.85rem" }}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button type="submit" style={{ flex: 1 }}>Speichern</button>
            <Link href="/admin/pages" className="secondary-button" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              Abbrechen
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
