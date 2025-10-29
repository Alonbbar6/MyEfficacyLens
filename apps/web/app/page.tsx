import { Suspense, ReactNode } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import EfficacyFeatures from "@/components/EfficacyFeatures";
import Pricing from "@/components/Pricing";
import Testimonials3 from "@/components/Testimonials3";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Metadata } from 'next';

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Efficacy - Transform Political Anxiety Into Action',
  description: 'Free, non-partisan political tracker app for Gen Z. Stop doomscrolling, start doing. Track bills, understand jargon, and make your voice count with clarity and confidence.',
  keywords: 'political tracker, civic engagement, Gen Z politics, political app, bill tracking, voter information, political efficacy, non-partisan news',
};

export default function Home(): JSX.Element {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <main>
        {/* Efficacy - Transform political anxiety into political efficacy */}
        <Hero />
        <Problem />
        <EfficacyFeatures />
        <Testimonials3 />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
