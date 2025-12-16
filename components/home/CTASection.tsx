"use client";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const { t } = useI18n();
  const router = useRouter();

  const onClickPost = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert(t("auth.loginRequiredToPost"));
      router.push("/auth/login");
      return;
    }
    router.push("/post");
  };

  return (
    <section className="py-12 bg-gradient-to-br from-accent to-accent-2">
      <div className="container text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {t("home.ctaTitle")}
        </h2>
        <p className="text-white text-lg mb-6 opacity-90">
          {t("home.ctaSubtitle")}
        </p>
        <button
          className="inline-flex items-center gap-2 text-[#002F34] font-semibold py-3 px-8 rounded-lg transition-colors"
          onClick={onClickPost}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t("home.ctaButton")}
        </button>
      </div>
    </section>
  );
}
