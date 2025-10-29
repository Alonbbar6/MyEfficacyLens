"use client";

import { useState } from "react";

const features = [
  {
    title: "Jargon Translator",
    description: "Hover over any political term for instant, simple definitions. No more feeling stupid when you see 'filibuster' or 'cloture vote.'",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    stat: "500+ terms",
    color: "bg-efficacy-clarity",
  },
  {
    title: "Bill Tracker",
    description: "Follow legislation with plain-language summaries and clear 'Take Action' buttons. Know exactly what's happening and what you can do.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    stat: "Real-time updates",
    color: "bg-efficacy-efficacy",
  },
  {
    title: "Promise Tracker",
    description: "Track politicians' campaign promises with color-coded progress bars. Hold them accountable with verified facts.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    stat: "100% verified",
    color: "bg-efficacy-momentum",
  },
  {
    title: "Rep Lookup",
    description: "Find your local representatives instantly with voting records and contact info. One click to call with a ready-made script.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    stat: "All 50 states",
    color: "bg-efficacy-clarity",
  },
  {
    title: "Action Efficacy Tracker",
    description: "See your political impact in real-time. Hours saved, calls made, bills tracked. Feel competent, not paralyzed.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    stat: "Your impact",
    color: "bg-efficacy-efficacy",
  },
  {
    title: "Non-Partisan News",
    description: "Get the facts without the spin. We show you what happened, who voted how, and what it means—no bias, just clarity.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    stat: "Zero bias",
    color: "bg-efficacy-momentum",
  },
];

const EfficacyFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="bg-base-100 py-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-extrabold text-4xl md:text-5xl tracking-tight mb-6 font-serif">
            Everything You Need to Be{" "}
            <span className="bg-gradient text-transparent bg-clip-text">
              Politically Effective
            </span>
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            From understanding complex bills to tracking your representatives' promises, 
            Efficacy gives you the tools to transform anxiety into action.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-base-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="card-body">
                <div className={`w-16 h-16 rounded-full ${feature.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`text-${feature.color.replace('bg-', '')}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="card-title text-xl mb-2">{feature.title}</h3>
                <p className="text-base-content/70 mb-4">{feature.description}</p>
                <div className="badge badge-outline">{feature.stat}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient p-1 rounded-2xl inline-block">
            <div className="bg-base-100 rounded-2xl p-8">
              <h3 className="font-bold text-2xl mb-4">
                Ready to Stop Feeling Paralyzed?
              </h3>
              <p className="text-base-content/70 mb-6 max-w-xl mx-auto">
                Join thousands of Gen Z activists who've transformed their political anxiety 
                into real, measurable impact.
              </p>
              <a
                href="#get-started"
                className="btn bg-efficacy-clarity hover:bg-efficacy-clarity/90 text-white border-none btn-lg"
              >
                Start Your Free Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EfficacyFeatures;
