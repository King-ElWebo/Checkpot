"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadMediaAction } from "../actions";
import { compressImage } from "@/lib/image-compression";

export default function MediaUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      if (!file || file.size === 0) {
        throw new Error("Bitte ein Bild auswählen.");
      }

      // Compress image client-side before upload
      const compressedFile = await compressImage(file);
      formData.set("file", compressedFile);

      await uploadMediaAction(formData);
      router.push("/admin/media");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Fehler beim Upload.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Medien</div>
        <h1>Neues Bild hochladen</h1>
      </section>

      <section className="login-panel" style={{ width: "100%", maxWidth: "600px" }}>
        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: 0 }}>
          <div className="field-group">
            <label htmlFor="file">Bilddatei *</label>
            <input type="file" id="file" name="file" accept="image/*" required style={{ paddingTop: "12px" }} />
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>Bilder werden automatisch im Browser verkleinert und komprimiert.</p>
          </div>

          <div className="field-group">
            <label htmlFor="title">Titel (Intern)</label>
            <input type="text" id="title" name="title" />
          </div>

          <div className="field-group">
            <label htmlFor="alt">Alternativtext (für Barrierefreiheit)</label>
            <input type="text" id="alt" name="alt" />
          </div>

          <div className="field-group">
            <label htmlFor="rights">Bildrechte / Fotograf</label>
            <input type="text" id="rights" name="rights" />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? "Wird hochgeladen..." : "Hochladen"}
            </button>
            <Link href="/admin/media" className="secondary-button" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              Abbrechen
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
