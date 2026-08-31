"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { navigationLinks } from "@/content/fixtures/checkpot";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white">
      <div className="mx-auto flex h-20 max-w-7xl 2xl:max-w-[1600px] items-center justify-between px-6 lg:px-8 2xl:px-12">
        <Link
          href="/"
          className="flex items-center space-x-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
        >
          <div className="relative h-10 w-32 2xl:w-36">
            <Image
              src="/customer/checkpot-logo.svg"
              alt="Checkpot Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-8 2xl:space-x-10">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href as Route}
                className={`text-[13px] 2xl:text-[13.5px] uppercase tracking-wider font-medium transition-colors hover:text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] ${
                  isActive ? "text-[#C01718]" : "text-[#1A1A1A]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="text-[#1A1A1A] hover:text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Hauptmenü umschalten"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-menu" className="border-t border-[#E2E8F0] bg-white md:hidden">
          <nav className="flex flex-col space-y-4 px-6 py-6">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href as Route}
                  className={`text-lg font-medium transition-colors hover:text-[#C01718] ${
                    isActive ? "text-[#C01718]" : "text-[#1A1A1A]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
