"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { MediaDto } from "@/lib/repositories/media";
import { uploadMediaAction } from "@/app/admin/media/actions";
import { compressImage } from "@/lib/image-compression";

interface MediaPickerProps {
  name: string;
  label: string;
  initialMediaId?: string | null;
  initialMedia?: MediaDto | null;
  allMedia: MediaDto[];
  aspect?: "logo" | "photo" | "square";
  helpText?: string;
  required?: boolean;
}

export function MediaPicker({
  name,
  label,
  initialMediaId,
  initialMedia,
  allMedia,
  aspect = "photo",
  helpText,
  required = false,
}: MediaPickerProps) {
  // Find initial item
  const initialItem = useMemo(() => {
    if (initialMedia) return initialMedia;
    if (initialMediaId) {
      return allMedia.find((m) => m.id === initialMediaId) || null;
    }
    return null;
  }, [initialMedia, initialMediaId, allMedia]);

  const [selectedItem, setSelectedItem] = useState<MediaDto | null>(initialItem);
  const [mediaList, setMediaList] = useState<MediaDto[]>(allMedia);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Filtered media list
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

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Bitte eine gültige Bilddatei (JPG, PNG, WebP) auswählen.");
      }

      // Client-side compression
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.set("file", compressed);
      formData.set("title", file.name.replace(/\.[^/.]+$/, ""));

      const res = await uploadMediaAction(formData);

      if (res.success && res.media) {
        const newMedia = res.media;
        // Prepend to media list
        setMediaList((prev) => [newMedia, ...prev]);
        // Auto-select
        setSelectedItem(newMedia);
        // Auto-close dialog
        setIsOpen(false);
      } else {
        throw new Error("Upload fehlgeschlagen.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Fehler beim Upload.";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelect = (item: MediaDto) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  const handleRemove = () => {
    setSelectedItem(null);
  };

  return (
    <div className="field-group flex flex-col gap-2">
      {/* Hidden input ensuring standard form submit */}
      <input type="hidden" name={name} value={selectedItem?.id || ""} />

      <div className="flex items-baseline justify-between">
        <label className="text-sm font-bold text-[#1c1917]">
          {label} {required && <span className="text-[#b91c1c]">*</span>}
        </label>
        {helpText && <span className="text-xs text-[#78716c]">{helpText}</span>}
      </div>

      {/* Closed State / Current Selection Preview */}
      {selectedItem ? (
        <div className="flex flex-col gap-3 p-4 bg-[#fafaf9] border border-[#e7e5e4] rounded-xl">
          <div className="flex items-center gap-4">
            {/* Visual Thumbnail */}
            <div
              className={`relative overflow-hidden rounded-lg bg-white border border-[#e7e5e4] flex-shrink-0 ${
                aspect === "logo"
                  ? "w-28 h-20 p-2 flex items-center justify-center"
                  : aspect === "square"
                  ? "w-24 h-24"
                  : "w-32 h-24"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.url}
                alt={selectedItem.alt || selectedItem.title || "Ausgewähltes Bild"}
                className={`w-full h-full ${
                  aspect === "logo" ? "object-contain" : "object-cover"
                }`}
                style={
                  selectedItem.focalPoint && aspect !== "logo"
                    ? { objectPosition: selectedItem.focalPoint }
                    : undefined
                }
              />
            </div>

            {/* Metadata Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#1c1917] truncate">
                {selectedItem.title || "Ohne Titel"}
              </div>
              <div className="text-xs text-[#78716c] truncate mt-0.5">
                {selectedItem.url.split("/").pop()}
              </div>
              {selectedItem.alt && (
                <div className="text-xs text-[#a8a29e] truncate mt-0.5">
                  Alt: {selectedItem.alt}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#e7e5e4]/80">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#292524] text-white hover:bg-[#44403c] transition-colors cursor-pointer"
            >
              Bild ändern
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-[#78716c] hover:text-[#b91c1c] hover:bg-[#fee2e2]/40 transition-colors cursor-pointer"
            >
              Entfernen
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center p-6 bg-[#fafaf9] border-2 border-dashed border-[#d6d3d1] hover:border-[#a8a29e] hover:bg-[#f5f5f4] rounded-xl cursor-pointer transition-all duration-150 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#f5f5f4] group-hover:bg-[#e7e5e4] flex items-center justify-center text-[#78716c] mb-2 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            {aspect === "logo" ? "Logo auswählen" : "Bild auswählen"}
          </span>
          <span className="text-xs text-[#78716c] mt-0.5">
            Aus der Mediathek wählen oder neues Bild hochladen
          </span>
        </div>
      )}

      {/* Media Picker Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label={`Bild für ${label} auswählen`}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#e7e5e4]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#e7e5e4] flex items-center justify-between bg-[#fafaf9]">
              <div>
                <h3 className="text-lg font-bold text-[#1c1917]">Bild auswählen</h3>
                <p className="text-xs text-[#78716c]">
                  Wählen Sie ein Bild für <strong>{label}</strong> oder laden Sie ein neues hoch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716c] hover:bg-[#e7e5e4] hover:text-[#1c1917] transition-colors cursor-pointer"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>

            {/* Search & Upload Header Bar */}
            <div className="p-4 border-b border-[#e7e5e4] bg-white flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Bilder nach Titel oder Dateinamen durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 text-xs bg-[#fafaf9] border border-[#e7e5e4] rounded-lg focus:outline-hidden focus:border-[#1c1917] text-[#1c1917]"
                />
                <svg
                  className="w-4 h-4 text-[#a8a29e] absolute left-3 top-3 pointer-events-none"
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

              {/* Upload Trigger */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto h-10 px-4 rounded-lg bg-[#C01718] hover:bg-[#a01314] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {isUploading ? (
                    <span>Wird hochgeladen...</span>
                  ) : (
                    <>
                      <span>+ Neues Bild hochladen</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Inline Dropzone / Upload State */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`px-4 py-2 text-center text-xs transition-colors border-b ${
                isDragging
                  ? "bg-[#fee2e2] border-[#C01718] text-[#C01718] font-bold"
                  : "bg-[#f5f5f4]/60 border-[#e7e5e4] text-[#78716c]"
              }`}
            >
              {isDragging
                ? "Bild hier loslassen zum direkten Hochladen..."
                : "Tipp: Sie können auch eine Bilddatei direkt in dieses Fenster ziehen."}
            </div>

            {uploadError && (
              <div className="p-3 bg-[#fee2e2] text-[#991b1b] text-xs font-medium border-b border-[#fca5a5]">
                {uploadError}
              </div>
            )}

            {/* Visual Media Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-4 min-h-[260px] max-h-[460px]">
              {filteredMedia.length === 0 ? (
                <div className="py-16 text-center text-sm text-[#78716c]">
                  {searchQuery
                    ? `Keine Bilder für "${searchQuery}" gefunden.`
                    : "Noch keine Bilder in der Mediathek vorhanden."}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`group relative flex flex-col text-left rounded-xl overflow-hidden border-2 transition-all p-1 bg-[#fafaf9] hover:bg-[#f5f5f4] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] cursor-pointer ${
                          isSelected
                            ? "border-[#C01718] bg-[#fee2e2]/20 shadow-sm"
                            : "border-transparent hover:border-[#d6d3d1]"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-white border border-[#e7e5e4]/60">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.alt || item.title || ""}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            style={
                              item.focalPoint
                                ? { objectPosition: item.focalPoint }
                                : undefined
                            }
                          />

                          {/* Selected Checkmark Badge */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#C01718] text-white flex items-center justify-center shadow-md">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Title Label */}
                        <div className="p-1.5 w-full">
                          <div className="text-xs font-semibold text-[#1c1917] truncate">
                            {item.title || item.url.split("/").pop()}
                          </div>
                          {item.alt && (
                            <div className="text-[10px] text-[#a8a29e] truncate">
                              Alt: {item.alt}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#e7e5e4] bg-[#fafaf9] flex items-center justify-between text-xs text-[#78716c]">
              <span>
                {filteredMedia.length} {filteredMedia.length === 1 ? "Bild" : "Bilder"} verfügbar
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#e7e5e4] hover:bg-[#d6d3d1] text-[#1c1917] font-semibold transition-colors cursor-pointer"
              >
                Fertig / Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
