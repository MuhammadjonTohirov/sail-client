"use client";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import SuggestedListings from "@/components/home/SuggestedListings";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedListings />
      <SuggestedListings />
      <HowItWorks />
      <CTASection />
    </div>
  );
}