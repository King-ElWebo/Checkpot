"use client";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="public-page">
      <section className="container error-panel" role="alert">
        <p className="public-eyebrow">Fehler</p>
        <h1>Diese Ansicht konnte nicht geladen werden.</h1>
        <p>
          Bitte versuchen Sie es erneut. Die Kontaktdaten im Footer bleiben sichtbar, falls Sie Checkpot direkt
          erreichen möchten.
        </p>
        <button className="public-button" type="button" onClick={reset}>
          Erneut versuchen
        </button>
      </section>
    </div>
  );
}
