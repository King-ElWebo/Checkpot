"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { savePageAction } from "../actions";

export default function PageEditClient({ isNew, id, initialData }: { isNew: boolean, id: string, initialData: any }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      await savePageAction(isNew ? null : id, formData);
      router.push("/admin/pages");
    } catch (err: any) {
      setError(err.message || "Fehler beim Speichern.");
    }
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Seiteninhalte</div>
        <h1>{isNew ? "Neue Seite" : "Seite bearbeiten"}</h1>
      </section>

      <section className="login-panel" style={{ width: "100%", maxWidth: "800px" }}>
        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: 0 }}>
          
          <div className="field-group">
            <label htmlFor="routeKey">Route Key (z.B. "home", "ueber-uns") *</label>
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
