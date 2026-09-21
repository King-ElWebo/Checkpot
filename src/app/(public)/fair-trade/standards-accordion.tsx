import Image from 'next/image';

export function StandardsAccordion() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 pt-2">
      {/* 1. Global Organic Textile Standard (GOTS) */}
      <div className="flex flex-col border-t border-[#E5E2DC] pt-7 sm:pt-8 pb-2 sm:pb-4">
        <div className="relative h-14 sm:h-16 w-40 sm:w-48 mb-4 sm:mb-5">
          <Image
            src="/customer/standards/gots-logo_cmyk.jpg"
            alt="Global Organic Textile Standard (GOTS)"
            fill
            className="object-contain object-left"
          />
        </div>

        <h3 className="font-display text-2xl sm:text-[26px] lg:text-[28px] font-normal text-[#1A1A1A] mb-3 leading-[1.2] tracking-tight">
          Global Organic Textile Standard (GOTS)
        </h3>

        <p className="text-[15px] sm:text-[16px] text-[#4A5568] leading-relaxed max-w-xl">
          GOTS ist ein Standard für Textilien aus ökologisch erzeugten Naturfasern mit definierten Umwelt- und Sozialkriterien entlang der textilen Verarbeitung.
        </p>
      </div>

      {/* 2. Fair Wear Foundation */}
      <div className="flex flex-col border-t border-[#E5E2DC] pt-7 sm:pt-8 pb-2 sm:pb-4">
        <div className="relative h-14 sm:h-16 w-36 sm:w-44 mb-4 sm:mb-5">
          <Image
            src="/customer/standards/hd_logo_fairwear.jpg"
            alt="Fair Wear Foundation"
            fill
            className="object-contain object-left"
          />
        </div>

        <h3 className="font-display text-2xl sm:text-[26px] lg:text-[28px] font-normal text-[#1A1A1A] mb-3 leading-[1.2] tracking-tight">
          Fair Wear Foundation
        </h3>

        <p className="text-[15px] sm:text-[16px] text-[#4A5568] leading-relaxed max-w-xl">
          Fair Wear arbeitet mit Mitgliedsmarken an besseren Arbeitsbedingungen und menschenrechtlicher Sorgfalt in textilen Lieferketten.
        </p>
      </div>
    </div>
  );
}
