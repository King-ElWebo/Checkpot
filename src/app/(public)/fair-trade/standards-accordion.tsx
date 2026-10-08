export function StandardsAccordion() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 pt-2">
      {/* 1. Global Organic Textile Standard (GOTS) */}
      <div className="flex flex-col border-t border-[#E5E2DC] pt-7 sm:pt-8 pb-2 sm:pb-4">
        <h3 className="font-display text-[27px] sm:text-[29px] lg:text-[31px] font-normal text-[#1A1A1A] mb-3 leading-[1.2] tracking-tight">
          Global Organic Textile Standard (GOTS)
        </h3>

        <p className="text-[15px] sm:text-[16px] text-[#4A5568] leading-relaxed max-w-xl">
          GOTS ist ein Standard für Textilien aus ökologisch erzeugten Naturfasern mit definierten Umwelt- und Sozialkriterien entlang der textilen Verarbeitung.
        </p>
      </div>

      {/* 2. Fair Wear */}
      <div className="flex flex-col border-t border-[#E5E2DC] pt-7 sm:pt-8 pb-2 sm:pb-4">
        <h3 className="font-display text-[27px] sm:text-[29px] lg:text-[31px] font-normal text-[#1A1A1A] mb-3 leading-[1.2] tracking-tight">
          Fair Wear
        </h3>

        <p className="text-[15px] sm:text-[16px] text-[#4A5568] leading-relaxed max-w-xl">
          Fair Wear arbeitet mit Mitgliedsmarken an besseren Arbeitsbedingungen und menschenrechtlicher Sorgfalt in textilen Lieferketten.
        </p>
      </div>
    </div>
  );
}
