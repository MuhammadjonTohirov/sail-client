"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { appConfig } from "@/config";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const { t } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { name } = appConfig;

  const heroTitle = t("home.heroTitle", { name });
  const heroSubtitle = t("home.heroSubtitle");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/search`);
    }
  };

  return (
    <div className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{heroTitle}</h1>
          <p className="hero-subtitle">{heroSubtitle}</p>

          {/* Search Bar */}
          <div className="hero-search">
            <div className="search-input-wrapper flex-1">
              <svg
                className="search-icon"
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
              <input
                className="hero-search-input"
                placeholder={t("home.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="hero-search-btn" onClick={handleSearch}>
              {t("home.searchButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
