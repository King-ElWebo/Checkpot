"use client";

import React, { useRef } from "react";

interface FocalPointPickerProps {
  imageUrl: string;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export function FocalPointPicker({ imageUrl, value, onChange, disabled }: FocalPointPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current focal point (default 50% 50%)
  const parseCoordinates = (val: string | null): { x: number; y: number } => {
    if (!val) return { x: 50, y: 50 };
    const parts = val.trim().split(/\s+/);
    if (parts.length >= 2) {
      const x = parseInt(parts[0], 10);
      const y = parseInt(parts[1], 10);
      if (!isNaN(x) && !isNaN(y)) return { x, y };
    }
    // Named presets
    if (val === "top") return { x: 50, y: 15 };
    if (val === "bottom") return { x: 50, y: 85 };
    if (val === "left") return { x: 15, y: 50 };
    if (val === "right") return { x: 85, y: 50 };
    return { x: 50, y: 50 };
  };

  const currentCoords = parseCoordinates(value);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = Math.max(0, Math.min(100, Math.round((clientX / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round((clientY / rect.height) * 100)));

    onChange(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-[#78716c]">
        Klicken Sie auf das Bild, um den Bildfokus für den automatischen Zuschnitt zu setzen.
        <span className="block text-[11px] text-[#a8a29e] mt-0.5">
          Der Bildfokus gilt überall, wo dieses Bild verwendet wird.
        </span>
      </div>

      {/* Interactive Image Container */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className={`relative w-full max-w-[420px] aspect-[4/3] bg-[#f5f5f4] border border-[#e7e5e4] rounded-xl overflow-hidden cursor-crosshair select-none ${
          disabled ? "pointer-events-none opacity-60" : "hover:border-[#a8a29e]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Focal Point Vorschau"
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Crosshair Pin */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
          style={{ left: `${currentCoords.x}%`, top: `${currentCoords.y}%` }}
        >
          <div className="w-7 h-7 rounded-full border-2 border-white bg-[#C01718]/80 shadow-[0_0_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Quick Presets & Indicator */}
      <div className="flex flex-wrap items-center gap-2 max-w-[420px]">
        <span className="text-xs font-mono font-medium text-[#1c1917] bg-[#f5f5f4] px-2 py-1 rounded-md border border-[#e7e5e4]">
          {value || "50% 50% (Standard)"}
        </span>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("50% 15%")}
            className="text-xs px-2 py-1 rounded bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#1c1917] transition-colors"
          >
            Oben
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("50% 50%")}
            className="text-xs px-2 py-1 rounded bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#1c1917] transition-colors"
          >
            Mitte
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("50% 85%")}
            className="text-xs px-2 py-1 rounded bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#1c1917] transition-colors"
          >
            Unten
          </button>
          {value && value !== "50% 50%" && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(null)}
              className="text-xs px-2 py-1 rounded text-[#78716c] hover:text-[#b91c1c] transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
