import React, { useState } from "react";
import { 
  Search, ShieldCheck, RefreshCw, BarChart3, ArrowRight, Zap, 
  HelpCircle, MessageSquare, Compass, CheckCircle2, UserCheck, Code
} from "lucide-react";

interface LandingPageProps {
  onStartDashboard: () => void;
  isDarkMode: boolean;
}

export default function LandingPage({ onStartDashboard }: LandingPageProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const steps = [
    {
      title: "Query Parsing & Target Discovery",
      desc: "Parse specified business categories and geographic scopes. Trigger parallel lookups on search engines, maps, and directories."
    },
    {
      title: "Parallel Web Scraping & Extracting",
      desc: "Crawl domains, social profiles, local directories, and official portals using advanced selectors to extract phone, email, and location details."
    },
    {
      title: "Source Verification & Conflict Resolution",
      desc: "Cross-reference data points. Score confidence based on official domains. Flag inconsistencies and warn about discrepancies."
    },
    {
      title: "Intelligent Deduplication & Merging",
      desc: "Detect overlapping records using semantic string similarity algorithms and automatically combine duplicate sources."
    },
    {
      title: "Executive Synthesis & AI Reporting",
      desc: "Employ advanced LLM reasoning to parse logs and compile professional, data-backed reports ready to export."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setContactSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setContactSubmitted(false);
      }, 4000);
    }
  };

  return (
    <div className="bg-forest text-cream min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border border-stone/30 bg-sage/20 rounded-2xl mb-12 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(#C9A35A08_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-widest text-gold bg-sage/45 border border-stone/40 rounded-full mb-8 uppercase">
            <Zap className="w-3 h-3 text-gold animate-pulse" /> Autonomous Deep Audit Pipeline
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 text-cream font-sans leading-tight">
            Fresh Local Lead intelligence.<br />
            <span className="text-gold font-light">Discovered and verified.</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-cream/80 mb-10 font-normal leading-relaxed">
            Autonomous agent that crawls directories, extracts emails, cross-checks operating details, resolves contact duplicates, and builds clean executive datasets in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              id="hero-cta-dashboard"
              onClick={onStartDashboard}
              className="group flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/85 text-forest font-bold rounded-lg text-sm transition-colors cursor-pointer border border-gold"
            >
              Launch Scraper <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a 
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3 bg-sage/40 hover:bg-sage/55 text-cream font-medium rounded-lg text-sm border border-stone/40 transition-colors"
            >
              System Operations
            </a>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 p-5 rounded-xl bg-sage/25 border border-stone/30 backdrop-blur-md">
            <div className="text-center p-2 border-r border-stone/20">
              <div className="text-2xl font-bold font-mono text-cream">100%</div>
              <div className="text-[10px] text-gold uppercase tracking-wider mt-1 font-mono">Live Extraction</div>
            </div>
            <div className="text-center p-2 md:border-r border-stone/20">
              <div className="text-2xl font-bold font-mono text-cream">5+</div>
              <div className="text-[10px] text-gold uppercase tracking-wider mt-1 font-mono">Direct Sources</div>
            </div>
            <div className="text-center p-2 border-r border-stone/20">
              <div className="text-2xl font-bold font-mono text-cream">15s</div>
              <div className="text-[10px] text-gold uppercase tracking-wider mt-1 font-mono">Audit Velocity</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl font-bold font-mono text-cream">99%</div>
              <div className="text-[10px] text-gold uppercase tracking-wider mt-1 font-mono">Precision Match</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border border-stone/20 bg-sage/10 rounded-2xl mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-cream mb-3">
              Modern Lead Sourcing Architecture
            </h2>
            <p className="text-cream/70 text-sm max-w-xl mx-auto font-normal">
              Static lead databases are historically full of stale details, dead websites, and inactive phone lines. ResearchPro crawls active public channels on demand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-sage/20 border border-stone/35 hover:border-stone/50 hover:bg-sage/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-sage/40 border border-stone/30 flex items-center justify-center text-gold mb-5">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gold mb-2">Deep Discovery Parser</h3>
              <p className="text-cream/80 text-xs leading-relaxed font-normal">
                Query categories globally. The system discovers targets on Maps, directories, Yelp registries, and social profiles, gathering deep unstructured listings.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-sage/20 border border-stone/35 hover:border-stone/50 hover:bg-sage/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-sage/40 border border-stone/30 flex items-center justify-center text-gold mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gold mb-2">Multi-Channel Verification</h3>
              <p className="text-cream/80 text-xs leading-relaxed font-normal">
                Cross-references active lines, domain status, and business reviews. Calculates strict transparency scores and flags conflicting hours or phone records.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-sage/20 border border-stone/35 hover:border-stone/50 hover:bg-sage/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-sage/40 border border-stone/30 flex items-center justify-center text-gold mb-5">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gold mb-2">Smart Merge & Dedupe</h3>
              <p className="text-cream/80 text-xs leading-relaxed font-normal">
                Leverages advanced string similarity filters to merge multiple duplicates with distinct address representations or matching operating numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (STEPPER) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 border border-stone/20 bg-sage/10 rounded-2xl mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-cream mb-3">
              Automated Process Flow
            </h2>
            <p className="text-cream/70 text-sm max-w-xl mx-auto font-normal">
              Each search session triggers a multi-stage server-side agent pipeline.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {steps.map((step, idx) => (
              <button
                key={idx}
                id={`step-tab-${idx}`}
                onClick={() => setActiveStep(idx)}
                className={`p-4 text-left rounded-lg border text-sm transition-all cursor-pointer ${
                  activeStep === idx 
                    ? "bg-sage text-gold border-gold/40 shadow-sm" 
                    : "bg-sage/10 border-stone/35 text-cream/50 hover:border-stone hover:text-cream"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    activeStep === idx ? "bg-gold text-forest font-bold" : "bg-sage/30 text-cream/60"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest">Step 0{idx + 1}</span>
                </div>
                <div className="font-medium text-xs truncate">{step.title}</div>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-sage/20 border border-stone/30 backdrop-blur-md min-h-[140px]">
            <h3 className="text-base font-semibold mb-3 text-gold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold" /> {steps[activeStep].title}
            </h3>
            <p className="text-cream/80 text-xs leading-relaxed font-normal">{steps[activeStep].desc}</p>
          </div>
        </div>
      </section>

      {/* 4. READY TO RUN */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border border-stone/25 bg-sage/15 rounded-2xl mb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream mb-3">Begin Lead Extraction</h2>
          <p className="text-cream/80 text-sm max-w-md mx-auto mb-8 font-normal">
            Run custom search audits or select preconfigured target categories with real-time feedback loops.
          </p>
          <button
            id="demo-cta-dashboard-bottom"
            onClick={onStartDashboard}
            className="px-8 py-3 bg-gold hover:bg-gold/85 text-forest font-bold rounded-lg text-sm transition-colors border border-gold cursor-pointer shadow-lg"
          >
            Open Dashboard
          </button>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold tracking-tight text-cream uppercase tracking-wider font-mono">
              Industry Validation
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-sage/20 border border-stone/30">
              <p className="text-cream/80 italic mb-5 text-xs leading-relaxed font-normal">
                &ldquo;We replaced our static prospect provider with ResearchPro AI. Having freshly scraped and verified phone numbers and websites generated in seconds boosted our outreach response rates by 42%.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sage/45 border border-stone/30 flex items-center justify-center text-gold text-xs font-bold font-mono">SM</div>
                <div>
                  <h4 className="font-semibold text-xs text-cream">Sarah Mitchell</h4>
                  <p className="text-[10px] text-gold/80 font-mono uppercase">VP of Outbound, ClayScale LLC</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-sage/20 border border-stone/30">
              <p className="text-cream/80 italic mb-5 text-xs leading-relaxed font-normal">
                &ldquo;The duplicate merging feature alone is worth every dollar. It seamlessly merges overlapping Yelp and Google maps entries, delivering perfectly pristine datasets to our sales pipeline.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sage/45 border border-stone/30 flex items-center justify-center text-gold text-xs font-bold font-mono">DR</div>
                <div>
                  <h4 className="font-semibold text-xs text-cream">David Rivera</h4>
                  <p className="text-[10px] text-gold/80 font-mono uppercase">Data Integrity Lead, Horizon Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center text-cream uppercase tracking-wider font-mono mb-10">Common Questions</h2>
          <div className="space-y-4">
            <div className="p-5 rounded-lg bg-sage/20 border border-stone/30">
              <h3 className="font-semibold text-xs text-gold mb-2 flex items-center gap-2 uppercase font-mono tracking-wider">
                <HelpCircle className="w-4 h-4 text-gold" /> How does the verification score work?
              </h3>
              <p className="text-cream/80 text-xs leading-relaxed font-normal">
                Our verification engine analyses records across multiple channels. High Verification is attained if the official website is active, details match the Google Maps API, and Yelp registries confirm the data. Scores above 80 indicate reliable matching.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-sage/20 border border-stone/30">
              <h3 className="font-semibold text-xs text-gold mb-2 flex items-center gap-2 uppercase font-mono tracking-wider">
                <HelpCircle className="w-4 h-4 text-gold" /> Can I search any business in any location?
              </h3>
              <p className="text-cream/80 text-xs leading-relaxed font-normal">
                Yes! Our system dynamically orchestrates search query lookups. In case you do not have a Gemini API key connected, we automatically synthesize realistic high-confidence demo mock files instantly so you can evaluate the experience safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT FORM */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-sage/15 border border-stone/30 rounded-2xl mb-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-cream mb-2">Request System Access</h2>
            <p className="text-gold/90 text-xs font-mono uppercase tracking-wider">Enterprise integrations and high-volume crawls.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4 p-6 rounded-xl bg-sage/25 border border-stone/30 backdrop-blur-md">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gold mb-1.5 font-bold">Name</label>
              <input 
                type="text" 
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-forest/50 border border-stone/40 focus:border-gold/50 rounded outline-none text-cream placeholder-stone/60 text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gold mb-1.5 font-bold">Email</label>
              <input 
                type="email" 
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-forest/50 border border-stone/40 focus:border-gold/50 rounded outline-none text-cream placeholder-stone/60 text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gold mb-1.5 font-bold">Message</label>
              <textarea 
                rows={3}
                required
                placeholder="Describe your custom target parameters..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 bg-forest/50 border border-stone/40 focus:border-gold/50 rounded outline-none text-cream placeholder-stone/60 text-xs transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-gold hover:bg-gold/85 text-forest font-bold rounded text-xs transition-colors border border-gold cursor-pointer shadow-md"
            >
              Send Message
            </button>

            {contactSubmitted && (
              <div className="p-3 bg-sage border border-stone/50 text-gold text-[10px] font-mono rounded text-center">
                ✓ Transmission received successfully.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-stone/70 text-[10px] font-mono uppercase tracking-wider">
        <p>&copy; {new Date().getFullYear()} ResearchPro AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
