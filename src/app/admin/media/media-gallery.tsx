"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { MediaDto, MediaUsage } from "@/lib/repositories/media";
import {
  uploadMediaAction,
  updateMediaMetadataAction,
  deleteMediaAction,
  checkMediaUsageAction,
} from "./actions";
import { compressImage } from "@/lib/image-compression";
import { FocalPointPicker } from "@/components/admin/focal-point-picker";

interface MediaWithUsage extends MediaDto {
  usage?: MediaUsage;
}

interface MediaGalleryProps {
  initialMedia: MediaWithUsage[];
}

type UploadQueueItem = {
  id: string;
  name: string;
  previewUrl: string;
  status: "uploading" | "success" | "error";
  error?: string;
};

export function MediaGallery({ initialMedia }: MediaGalleryProps) {
  const [mediaList, setMediaList] = useState<MediaWithUsage[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaWithUsage | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editRights, setEditRights] = useState("");
  const [editSeason, setEditSeason] = useState("");
  const [editFocalPoint, setEditFocalPoint] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Usage state for selected media
  const [usageData, setUsageData] = useState<MediaUsage | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Multi-upload state
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered media
  const filteredMedia = useMemo(() => {
    if (!searchQuery.trim()) return mediaList;
    const q = searchQuery.toLowerCase().trim();
    return mediaList.filter((m) => {
      const titleMatch = m.title?.toLowerCase().includes(q);
      const altMatch = m.alt?.toLowerCase().includes(q);
      const filenameMatch = m.url.split("/").pop()?.toLowerCase().includes(q);
      return Boolean(titleMatch || altMatch || filenameMatch);
    });
  }, [mediaList, searchQuery]);

  // Open details
  const handleOpenDetails = async (item: MediaWithUsage) => {
    setSelectedMedia(item);
    setEditTitle(item.title || "");
    setEditAlt(item.alt || "");
    setEditRights(item.rights || "");
    setEditSeason(item.season || "");
    setEditFocalPoint(item.focalPoint || null);
    setSaveMessage(null);
    setShowDeleteModal(false);
    setDeleteError(null);
    setIsDetailsOpen(true);

    // Fetch live usage
    setLoadingUsage(true);
    try {
      const usage = await checkMediaUsageAction(item.id);
      setUsageData(usage);
    } catch {
      setUsageData(null);
    } finally {
      setLoadingUsage(false);
    }
  };

  // Save metadata
  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedia) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const formData = new FormData();
      formData.set("title", editTitle);
      formData.set("alt", editAlt);
      formData.set("rights", editRights);
      formData.set("season", editSeason);
      formData.set("focalPoint", editFocalPoint || "");

      const res = await updateMediaMetadataAction(selectedMedia.id, formData);
      if (res.success) {
        setSaveMessage({ type: "success", text: "Metadaten erfolgreich gespeichert." });
        // Update item in local list
        setMediaList((prev) =>
          prev.map((m) =>
            m.id === selectedMedia.id
              ? {
                  ...m,
                  title: editTitle || null,
                  alt: editAlt || null,
                  rights: editRights || null,
                  season: editSeason || null,
                  focalPoint: editFocalPoint || null,
                }
              : m
          )
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Fehler beim Speichern.";
      setSaveMessage({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  // Safe delete
  const handleDelete = async (force = false) => {
    if (!selectedMedia) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteMediaAction(selectedMedia.id, force);
      // Remove from list
      setMediaList((prev) => prev.filter((m) => m.id !== selectedMedia.id));
      setIsDetailsOpen(false);
      setShowDeleteModal(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Fehler beim Löschen.";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Multi-upload handler
  const handleFilesUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    const newQueueItems: UploadQueueItem[] = fileArray.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      status: "uploading",
    }));

    setUploadQueue((prev) => [...newQueueItems, ...prev]);

    // Upload sequentially to preserve stable connection
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const queueId = newQueueItems[i].id;

      try {
        const compressed = await compressImage(file);
        const formData = new FormData();
        formData.set("file", compressed);
        formData.set("title", file.name.replace(/\.[^/.]+$/, ""));

        const res = await uploadMediaAction(formData);
        if (res.success && res.media) {
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === queueId ? { ...q, status: "success" } : q))
          );
          // Add to media gallery
          setMediaList((prev) => [res.media, ...prev]);
        } else {
          throw new Error("Upload fehlgeschlagen.");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Fehler";
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === queueId ? { ...q, status: "error", error: message } : q
          )
        );
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Dropzone & Action Bar */}
      <section className="admin-panel p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#1c1917]">Bilder hochladen</h2>
            <p className="text-xs text-[#78716c]">
              Ziehen Sie mehrere Bilder hierher oder wählen Sie Dateien von Ihrem Computer.
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFilesUpload(e.target.files)}
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-5 rounded-xl bg-[#292524] hover:bg-[#44403c] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>+ Bilder auswählen</span>
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#C01718] bg-[#fee2e2]/40 text-[#C01718]"
              : "border-[#d6d3d1] hover:border-[#a8a29e] bg-[#fafaf9] text-[#78716c]"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-[#e7e5e4] flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-[#78716c]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold text-[#1c1917]">
            Dateien hier ablegen oder klicken zum Durchsuchen
          </span>
          <span className="text-xs text-[#a8a29e] mt-1">
            Unterstützt JPG, PNG und WebP. Automatische Komprimierung für schnelle Ladezeiten.
          </span>
        </div>

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-[#e7e5e4]">
            <div className="flex items-center justify-between text-xs text-[#78716c]">
              <span>Upload-Status ({uploadQueue.length})</span>
              <button
                type="button"
                onClick={() => setUploadQueue([])}
                className="text-[#a8a29e] hover:text-[#1c1917] cursor-pointer"
              >
                Liste leeren
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {uploadQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-[#fafaf9] border border-[#e7e5e4] rounded-lg text-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="w-7 h-7 rounded object-cover border border-[#e7e5e4]"
                  />
                  <span className="max-w-[140px] truncate font-medium text-[#1c1917]">
                    {item.name}
                  </span>
                  {item.status === "uploading" && (
                    <span className="text-[#b45309] font-semibold text-[11px] animate-pulse">
                      Lädt...
                    </span>
                  )}
                  {item.status === "success" && (
                    <span className="text-[#15803d] font-bold text-[11px]">✓ Bereit</span>
                  )}
                  {item.status === "error" && (
                    <span className="text-[#b91c1c] font-bold text-[11px]">Fehler</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Gallery Section */}
      <section className="admin-panel p-6 flex flex-col gap-6">
        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Bilder nach Titel, Dateiname oder Alt-Text suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-xs bg-[#fafaf9] border border-[#e7e5e4] rounded-xl focus:outline-hidden focus:border-[#1c1917] text-[#1c1917]"
            />
            <svg
              className="w-4 h-4 text-[#a8a29e] absolute left-3.5 top-3.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="text-xs text-[#78716c]">
            {filteredMedia.length} {filteredMedia.length === 1 ? "Bild" : "Bilder"} in der Mediathek
          </div>
        </div>

        {/* Visual Grid */}
        {filteredMedia.length === 0 ? (
          <div className="py-20 text-center text-sm text-[#78716c]">
            {searchQuery
              ? `Keine Bilder für "${searchQuery}" gefunden.`
              : "Noch keine Bilder vorhanden. Nutzen Sie den Upload-Bereich oben."}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => {
              const hasAlt = Boolean(item.alt?.trim());
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetails(item)}
                  className="group relative flex flex-col rounded-xl overflow-hidden border border-[#e7e5e4] bg-white hover:border-[#1c1917] hover:shadow-md cursor-pointer transition-all duration-150"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#fafaf9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt || ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      style={
                        item.focalPoint ? { objectPosition: item.focalPoint } : undefined
                      }
                    />

                    {/* Missing Alt Warning Badge */}
                    {!hasAlt && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500/90 text-white text-[10px] font-bold shadow-xs">
                        Alt fehlt
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-3 flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-[#1c1917] truncate">
                      {item.title || item.url.split("/").pop()}
                    </span>
                    <span className="text-[11px] text-[#a8a29e] truncate">
                      {item.createdAt.toLocaleDateString("de-AT")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Media Details Modal / Drawer */}
      {isDetailsOpen && selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Bild-Details bearbeiten"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e7e5e4]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#e7e5e4] flex items-center justify-between bg-[#fafaf9]">
              <div>
                <h3 className="text-lg font-bold text-[#1c1917]">
                  {selectedMedia.title || "Bild bearbeiten"}
                </h3>
                <p className="text-xs text-[#78716c] truncate max-w-lg mt-0.5">
                  {selectedMedia.url}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716c] hover:bg-[#e7e5e4] hover:text-[#1c1917] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
              {/* Left Column: Focal Point & Preview */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="text-sm font-bold text-[#1c1917]">Bildfokus & Vorschau</div>
                <FocalPointPicker
                  imageUrl={selectedMedia.url}
                  value={editFocalPoint}
                  onChange={setEditFocalPoint}
                />

                {/* Usage Section */}
                <div className="mt-4 pt-4 border-t border-[#e7e5e4] flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                    Verwendung auf der Website
                  </span>
                  {loadingUsage ? (
                    <div className="text-xs text-[#a8a29e] animate-pulse">
                      Verwendung wird geprüft...
                    </div>
                  ) : usageData && usageData.totalCount > 0 ? (
                    <div className="flex flex-col gap-2 bg-[#f5f5f4] p-3 rounded-xl border border-[#e7e5e4]">
                      <span className="text-xs font-semibold text-[#1c1917]">
                        Verwendet bei {usageData.totalCount} Element(en):
                      </span>
                      <div className="flex flex-col gap-1.5 text-xs">
                        {usageData.brands.map((b) => (
                          <Link
                            key={`${b.id}-${b.role}`}
                            href={`/admin/brands/${b.id}`}
                            className="text-[#C01718] hover:underline flex items-center gap-1.5"
                          >
                            <span>Marke: {b.name}</span>
                            <span className="text-[11px] text-[#78716c]">
                              ({b.role === "logo" ? "Markenlogo" : "Titelbild"})
                            </span>
                          </Link>
                        ))}
                        {usageData.outfits.map((o) => (
                          <Link
                            key={o.id}
                            href={`/admin/outfits/${o.id}`}
                            className="text-[#C01718] hover:underline flex items-center gap-1.5"
                          >
                            <span>Outfit: {o.title}</span>
                            <span className="text-[11px] text-[#78716c]">(Outfit-Foto)</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#15803d] font-medium bg-[#f0fdf4] p-2.5 rounded-lg border border-[#bbf7d0]">
                      ✓ Dieses Bild ist unbenutzt und kann bedenkenlos gelöscht werden.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Metadata Form */}
              <form
                onSubmit={handleSaveMetadata}
                className="flex-1 flex flex-col gap-4"
              >
                <div className="text-sm font-bold text-[#1c1917]">Metadaten bearbeiten</div>

                <div className="field-group">
                  <label htmlFor="edit-title">Interner Bildtitel</label>
                  <input
                    type="text"
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="z.B. Sommerkleid Detail"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="edit-alt">Alternativtext (Alt-Text)</label>
                  <input
                    type="text"
                    id="edit-alt"
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    placeholder="Beschreibt das Bild für Screenreader"
                  />
                  <span className="text-[11px] text-[#a8a29e]">
                    Wichtig für Barrierefreiheit und SEO.
                  </span>
                </div>

                <div className="field-group">
                  <label htmlFor="edit-rights">Bildrechte / Fotograf</label>
                  <input
                    type="text"
                    id="edit-rights"
                    value={editRights}
                    onChange={(e) => setEditRights(e.target.value)}
                    placeholder="z.B. Checkpot Hietzing / Foto Studio"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="edit-season">Saison-Zuordnung (optional)</label>
                  <input
                    type="text"
                    id="edit-season"
                    value={editSeason}
                    onChange={(e) => setEditSeason(e.target.value)}
                    placeholder="z.B. Frühjahr/Sommer 2026"
                  />
                </div>

                {saveMessage && (
                  <div
                    className={`p-3 rounded-lg text-xs font-semibold ${
                      saveMessage.type === "success"
                        ? "bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]"
                        : "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]"
                    }`}
                  >
                    {saveMessage.text}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-[#e7e5e4] flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="py-2.5 px-6 rounded-xl bg-[#292524] hover:bg-[#44403c] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    {isSaving ? "Speichern..." : "Änderungen speichern"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="py-2.5 px-4 rounded-xl text-[#b91c1c] hover:bg-[#fee2e2]/40 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Bild löschen
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMedia && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#e7e5e4] flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#1c1917]">
              {usageData && usageData.totalCount > 0
                ? "Achtung: Bild wird verwendet!"
                : "Bild wirklich löschen?"}
            </h3>

            {usageData && usageData.totalCount > 0 ? (
              <div className="flex flex-col gap-2 text-xs text-[#78716c]">
                <p className="text-[#991b1b] font-semibold">
                  Dieses Bild wird derzeit bei folgenden Elementen verwendet:
                </p>
                <ul className="list-disc list-inside bg-[#fef2f2] p-3 rounded-lg border border-[#fecaca] text-[#991b1b]">
                  {usageData.brands.map((b) => (
                    <li key={b.id}>
                      Marke: {b.name} ({b.role})
                    </li>
                  ))}
                  {usageData.outfits.map((o) => (
                    <li key={o.id}>Outfit: {o.title}</li>
                  ))}
                </ul>
                <p>
                  Wenn Sie das Bild löschen, wird die Verknüpfung bei diesen Elementen entfernt.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#78716c]">
                Möchten Sie dieses Bild unwiderruflich aus der Mediathek und dem Speicher löschen?
              </p>
            )}

            {deleteError && (
              <div className="p-2.5 bg-[#fee2e2] text-[#991b1b] text-xs font-medium rounded-lg">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#1c1917] text-xs font-semibold cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(usageData ? usageData.totalCount > 0 : false)}
                className="px-4 py-2 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold cursor-pointer"
              >
                {isDeleting
                  ? "Wird gelöscht..."
                  : usageData && usageData.totalCount > 0
                  ? "Trotzdem unwiderruflich löschen"
                  : "Endgültig löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
