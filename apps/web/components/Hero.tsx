import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        {/* Trust Badge */}
        <div className="badge badge-lg bg-efficacy-clarity/10 text-efficacy-clarity border-efficacy-clarity/20 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Trusted by 500+ Gen Z Political Activists
        </div>
        
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight font-serif">
          Stop Doomscrolling.
          <br />
          <span className="bg-gradient text-transparent bg-clip-text">Start Doing.</span>
        </h1>
        
        <p className="text-lg opacity-80 leading-relaxed">
          Transform political anxiety into political efficacy. Get clear, actionable, 
          non-partisan information that helps you move from feeling paralyzed to 
          making your voice count—without the jargon or the overwhelm.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="#get-started"
            className="btn bg-efficacy-clarity hover:bg-efficacy-clarity/90 text-white border-none btn-lg"
          >
            Start Free Today
          </a>
          <a
            href="#how-it-works"
            className="btn btn-outline btn-lg border-efficacy-clarity text-efficacy-clarity hover:bg-efficacy-clarity hover:text-white"
          >
            See How It Works
          </a>
        </div>
        
        {/* Trust Indicators */}
        <div className="text-sm opacity-60 flex flex-wrap gap-4 justify-center lg:justify-start">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% Free Forever
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Non-Partisan
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No Jargon
          </span>
        </div>

        <TestimonialsAvatars priority={true} />
      </div>
      <div className="lg:w-full">
        <div className="mockup-window border bg-base-300 shadow-2xl">
          <div className="bg-gradient p-8 flex flex-col gap-4">
            <div className="bg-white/95 backdrop-blur rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-efficacy-clarity/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-efficacy-clarity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-efficacy-darkBlue">Housing Bill HR-2847</h3>
                  <p className="text-sm text-efficacy-mediumGray">In Progress</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-efficacy-mediumGray">Status</span>
                  <span className="font-semibold text-efficacy-efficacy">Passed House</span>
                </div>
                <progress className="progress progress-success w-full" value="60" max="100"></progress>
                <p className="text-sm text-efficacy-mediumGray mt-2">
                  This bill expands affordable housing initiatives. Next: Senate vote on Nov 15.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
