"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

type CategoryDto = { id: string; slug: string; name: string; groupId: string; groupSlug: string };
type BrandDto = { id: string; name: string; slug: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MediaDto = { url: string; metadata?: any } | null;

type OutfitDto = {
  id: string;
  title: string;
  note: string | null;
  availabilityNote: string | null;
  media: MediaDto;
  brands: BrandDto[];
  categories: CategoryDto[];
};

type TaxonomyGroup = {
  id: string;
  name: string;
  slug: string;
  categories: { id: string; name: string; slug: string }[];
};

export function OutfitsLookbook({
  initialOutfits,
  taxonomy
}: {
  initialOutfits: OutfitDto[];
  taxonomy: TaxonomyGroup[];
}) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const handleFilterChange = (groupId: string, categoryId: string) => {
    setSelectedFilters(prev => {
      const groupFilters = prev[groupId] || [];
      if (groupFilters.includes(categoryId)) {
        return {
          ...prev,
          [groupId]: groupFilters.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          [groupId]: [...groupFilters, categoryId]
        };
      }
    });
  };

  const clearFilters = () => setSelectedFilters({});

  const filteredOutfits = useMemo(() => {
    return initialOutfits.filter(outfit => {
      for (const [groupId, selectedCatIds] of Object.entries(selectedFilters)) {
        if (selectedCatIds.length === 0) continue;
        
        const outfitCatsInGroup = outfit.categories.filter(c => c.groupId === groupId);
        const matchesGroup = outfitCatsInGroup.some(c => selectedCatIds.includes(c.id));
        
        if (!matchesGroup) return false;
      }
      return true;
    });
  }, [initialOutfits, selectedFilters]);

  const activeFilterCount = Object.values(selectedFilters).flat().length;

  return (
    <div className="lookbook-layout">
      {/* Filter Toolbar (Centered) */}
      <div className="filter-toolbar">
        <button 
          className="filter-trigger"
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          aria-expanded={filterPanelOpen}
        >
          {filterPanelOpen ? "Filter schließen" : "Outfits filtern"}
          {activeFilterCount > 0 && !filterPanelOpen && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>

        <span className="results-count">
          {filteredOutfits.length} {filteredOutfits.length === 1 ? "Look" : "Looks"}
        </span>
      </div>

      {/* Expandable Filter Panel */}
      {filterPanelOpen && (
        <div className="filter-panel-expanded">
          <div className="filter-header">
            <h2>Filter</h2>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Zurücksetzen
              </button>
            )}
          </div>

          <div className="filter-groups">
            {taxonomy.map(group => (
              <div key={group.id} className="filter-group">
                <h3>{group.name}</h3>
                <div className="filter-options">
                  {group.categories.map(cat => {
                    const isSelected = (selectedFilters[group.id] || []).includes(cat.id);
                    return (
                      <label key={cat.id} className="filter-option">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleFilterChange(group.id, cat.id)}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="option-label">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results (Centered Full Width) */}
      <main className="lookbook-main">
        {filteredOutfits.length === 0 ? (
          <div className="no-results">
            <p>Für diese Auswahl sind derzeit keine Outfits hinterlegt.</p>
            <button onClick={clearFilters} className="clear-filters-btn-large">
              Alle Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="outfits-grid">
            {filteredOutfits.map(outfit => (
              <div key={outfit.id} className="outfit-tile">
                {outfit.media ? (
                  <div className="outfit-image-wrapper">
                    <Image
                      src={outfit.media.url}
                      alt={outfit.media.metadata?.alt || outfit.title}
                      fill
                      className="outfit-image"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="outfit-placeholder" />
                )}
                
                <div className="outfit-meta">
                  <h3 className="outfit-title">{outfit.title}</h3>
                  {outfit.availabilityNote && (
                    <span className="outfit-availability">{outfit.availabilityNote}</span>
                  )}
                  
                  {outfit.brands.length > 0 && (
                    <div className="outfit-brands">
                      {outfit.brands.map(brand => (
                        <Link key={brand.id} href={`/marken/${brand.slug}`} className="outfit-brand-link">
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .lookbook-layout {
          padding: 2rem 5%;
          max-width: 1920px;
          margin: 0 auto;
          min-height: 80vh;
        }

        .filter-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .filter-trigger {
          background: none;
          border: none;
          padding: 0.5rem 0;
          font-weight: 500;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: var(--foreground);
        }

        .filter-badge {
          background: var(--foreground);
          color: var(--background);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .results-count {
          color: var(--muted);
          font-size: 0.875rem;
        }

        .filter-panel-expanded {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .filter-header h2 {
          font-size: 1.25rem;
          margin: 0;
        }

        .clear-filters-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 0.875rem;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
        }

        .clear-filters-btn-large {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: var(--foreground);
          color: var(--background);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .filter-groups {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .filter-group h3 {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          margin: 0 0 1rem 0;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 1rem;
        }

        .filter-option input {
          display: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 1px solid var(--border);
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .filter-option input:checked + .checkbox-custom {
          background: var(--foreground);
          border-color: var(--foreground);
        }

        .filter-option input:checked + .checkbox-custom::after {
          content: "";
          width: 4px;
          height: 10px;
          border: solid var(--background);
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          margin-top: -2px;
        }

        .outfits-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .outfit-tile {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .outfit-image-wrapper {
          position: relative;
          aspect-ratio: 3/4;
          width: 100%;
          background: var(--surface);
          border-radius: 4px;
          overflow: hidden;
        }

        .outfit-image {
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .outfit-placeholder {
          aspect-ratio: 3/4;
          background: var(--surface);
          border-radius: 4px;
        }

        .outfit-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .outfit-title {
          font-size: 1.125rem;
          margin: 0;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .outfit-availability {
          font-size: 0.875rem;
          color: #991b1b;
        }

        .outfit-brands {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .outfit-brand-link {
          font-size: 0.75rem;
          text-decoration: none;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          z-index: 2; /* Ensure brand links are distinctly clickable above tile */
        }

        .outfit-brand-link:hover {
          color: var(--foreground);
          text-decoration: underline;
        }

        .no-results {
          padding: 4rem 0;
          text-align: center;
          color: var(--muted);
        }

        /* Hover Interaction Polish (Desktop/Hover-capable only) */
        @media (hover: hover) and (pointer: fine) {
          .outfit-tile:hover {
            transform: translateY(-3px);
          }
          .outfit-tile:hover .outfit-image {
            transform: scale(1.03);
          }
          .outfit-tile:hover .outfit-title {
            color: var(--accent, #991b1b);
          }
        }

        /* Reduced Motion Respect */
        @media (prefers-reduced-motion: reduce) {
          .outfit-tile {
            transition: none;
          }
          .outfit-tile:hover {
            transform: none;
          }
          .outfit-image {
            transition: none;
          }
          .outfit-tile:hover .outfit-image {
            transform: none;
          }
        }

        /* Responsive Grid Adjustments */
        @media (max-width: 1440px) {
          .outfits-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .outfits-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .outfits-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .filter-panel-expanded {
            padding: 1.5rem;
          }
          .filter-groups {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 390px) {
          .outfits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
