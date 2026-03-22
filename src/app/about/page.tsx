"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Target, Globe } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import USMap from "@/components/ui/USMap";

/* ═══════════════════ TEAM DATA ═══════════════════ */
const team = [
  {
    name: "Justin Chavez-Meneses",
    role: "Chief Executive Officer",
    background: "BBA Finance & Accounting, Emory University",
    contribution: "Orchestrated the architectural pivot from pure data collection to actionable operational intelligence, securing the initial $2M in seed funding while personally overseeing the first 10 pilot installations.",
    image: "/images/team/justin-meneses.jpeg",
  },
  {
    name: "Felipe Cardozo",
    role: "Chief Technology Officer",
    background: "BS Computer Science & Math, Emory University",
    contribution: "Developed the proprietary 'VeraSight' neural network, achieving a 40% reduction in processing latency for real-time food waste detection. Built the core infrastructure from the ground up in a windowless lab over 72-hour coding sprints.",
    image: "/images/team/Felipe-Cardozo.jpeg",
  },
  {
    name: "Eduardo Lapa",
    role: "Software Engineering",
    background: "BS Economics, Fundação Getulio Vargas",
    contribution: "Engineered the dynamic pricing engine that correlates real-time inventory levels with market demand, directly responsible for a 15% increase in gross margins for Veratori's beta partners.",
    image: "/images/team/Eduardo_Lapa.png",
  },
  {
    name: "Leonardo Affonso",
    role: "Hardware Engineering",
    background: "BEng Electrical Engineering, Federal University of Rio de Janeiro",
    contribution: "Designed the custom 'Sentinel-1' sensor housing, capable of withstanding the extreme humidity and temperature fluctuations of industrial kitchens. Optimized power consumption to allow for solar-integrated deployment.",
    image: "/images/team/LeonardoAffonso.png",
  },
  {
    name: "Daniel Gambacorta",
    role: "Software Engineering",
    background: "BEng Mechanical Engineering, Texas A&M",
    contribution: "Bridges the gap between physical sensors and cloud analytics by developing the edge-computing synchronization layer. His work ensures data integrity even in the most connectivity-challenged environments.",
    image: "/images/team/daniel-gambacorta.png",
  },
  {
    name: "Milad Khezrefaridi",
    role: "Hardware Engineering",
    background: "BEng Mechanical Engineering, UT Austin",
    contribution: "Revolutionized the mounting system for Veratori's visual sensors, reducing installation time by 70%. Led the rapid prototyping of the second-generation thermal imaging modules.",
    image: "/images/team/milad-khezrefaridi.png",
  },
];

/* ═══════════════════ ORIGIN & MISSION ═══════════════════ */
function Story() {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 ${isDark ? "bg-midnight" : "bg-mist"}`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <span className="text-sage font-semibold tracking-widest uppercase text-sm mb-4 block">The Origin</span>
          <p className={`text-lg md:text-xl leading-relaxed mb-8 ${isDark ? "text-white/70" : "text-black/70"}`}>
            Veratori began in the summer of 2025, when Justin Meneses — while working at Poke Bowl NY — observed firsthand the operational inefficiencies that quietly erode profitability in food service businesses: poor inventory visibility, reactive decision-making, and a near-total absence of actionable data. Determined to solve what he experienced directly, Justin assembled a team of builders and operators, most notably his co-founder Felipe Cardozo, and Veratori was founded.
          </p>

          <span className="text-sage font-semibold tracking-widest uppercase text-sm mb-4 block">The Mission</span>
          <p className={`text-lg md:text-xl leading-relaxed mb-10 ${isDark ? "text-white/70" : "text-black/70"}`}>
            Veratori's mission is to give food & beverage operators the same quality of operational intelligence that enterprise-level organizations have — accessible, real-time, and AI-powered. We believe the future of the food industry is run on data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { id: "precision", icon: Target, title: "Precision Intelligence", text: "99.2% detection accuracy in complex, low-light environments." },
              { id: "global", icon: Globe, title: "Global Impact", text: "3.2M+ lbs of annual food waste prevented across our partners." },
            ].map(item => (
              <div key={item.id}>
                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-sage mb-4" />
                <h4 className="font-bold mb-2 text-lg md:text-xl">{item.title}</h4>
                <p className={`text-base md:text-lg ${isDark ? "text-white/50" : "text-black/50"}`}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-4/5 rounded-xl overflow-hidden border border-white/10 mt-4 lg:mt-0">
          <Image
            src="/images/assets/about-hero.png"
            alt="Veratori lab"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ ROADMAP & TIMELINE ═══════════════════ */
const milestones = [
  {
    date: "Summer 2025",
    title: "Concept Born",
    desc: "Justin Meneses identifies operational inefficiencies at Poke Bowl NY; concept for Veratori is born."
  },
  {
    date: "August 20, 2025",
    title: "Official Foundation",
    desc: "Veratori Inc. is officially founded; co-founder Felipe Cardozo joins the mission."
  },
  {
    date: "Late 2025",
    title: "Product Development",
    desc: "Initial team assembled; early-stage computer vision and hardware development begins."
  },
  {
    date: "Early 2026",
    title: "Beta Launch",
    desc: "Beta program launched; first piloting partners onboarded at $359/month per hardware unit."
  },
  {
    date: "August 2026 (Target)",
    title: "Market Deployment",
    desc: "Market-ready product deployed across all piloting partner locations."
  },
  {
    date: "2026 & Beyond",
    title: "Vertical Expansion",
    desc: "Expansion into pharmaceuticals, manufacturing, and additional high-dependency verticals."
  }
];

function Roadmap() {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <span className="text-sage font-semibold tracking-widest uppercase text-sm mb-4 block">Roadmap</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Scale & Expansion</h2>
            <p className={`text-xl md:text-2xl leading-relaxed ${isDark ? "text-white/60" : "text-black/60"}`}>
              By August 2026, Veratori's market-ready product will be deployed across all piloting partner locations. In parallel, the team is in active development with firms outside the food service vertical — including organizations in pharmaceuticals and manufacturing — establishing Veratori as a cross-industry operational intelligence platform.
            </p>
            <div className="mt-20">
              <USMap />
            </div>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-sage/20 before:to-transparent">
            {milestones.map((m, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-sage/30 bg-black text-sage shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <div className="w-2 h-2 rounded-full bg-sage" />
                </div>
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded border border-white/5 bg-white/5 shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-2">
                    <div className="font-bold text-sage text-base md:text-lg">{m.date}</div>
                  </div>
                  <div className="text-lg md:text-xl font-bold mb-2">{m.title}</div>
                  <div className={`text-base md:text-lg ${isDark ? "text-white/50" : "text-black/50"}`}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ TEAM SECTION ═══════════════════ */
function Team() {
  const { isDark } = useTheme();
  
  // Animation variants for the team member cards
  const cardVariants = {
    initial: { y: 0 },
    hover: { y: -5 }
  };

  const infoBoxVariants = {
    initial: { opacity: 0, y: 15, scale: 0.98 },
    hover: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <section className={`py-20 ${isDark ? "bg-midnight" : "bg-mist"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 text-center md:text-left">
          <span className="text-sage font-semibold tracking-widest uppercase text-sm mb-4 block">People</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Team</h2>
          <p className={`max-w-2xl text-lg md:text-xl ${isDark ? "text-white/50" : "text-black/50"}`}>
            Engineers and operators with backgrounds in computer vision, mechanical engineering, and quantitative finance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((member) => (
            <motion.div 
              key={member.name} 
              initial="initial"
              whileHover="hover"
              variants={cardVariants}
              className="group relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-midnight shadow-lg border border-white/5">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-[1.08]"
                />
                
                {/* Hover Overlay Box */}
                <motion.div 
                  variants={infoBoxVariants}
                  className="absolute inset-x-3 bottom-3 p-5 rounded-xl bg-black/85 backdrop-blur-lg border border-white/10 z-10 pointer-events-none group-hover:pointer-events-auto shadow-2xl flex flex-col gap-3"
                >
                  <div>
                    <p className="text-sage font-bold text-xs uppercase tracking-[0.2em] mb-2">Mission & Impact</p>
                    <p className="text-white text-sm md:text-base leading-relaxed font-medium">
                      {member.contribution}
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1">Formation</p>
                    <p className="text-white/90 text-sm leading-tight">{member.background}</p>
                  </div>
                </motion.div>

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />
              </div>

              <div className="px-2 mt-2 text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-1 group-hover:text-sage transition-colors duration-300">{member.name}</h3>
                <p className="text-sage/80 font-semibold text-base md:text-lg tracking-wide capitalize italic">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ PAGE ASSEMBLY ═══════════════════ */
export default function AboutPage() {
  const { isDark } = useTheme();
  return (
    <main className={isDark ? "bg-black text-white" : "bg-white text-black"}>
      {/* Page Header */}
      <section className={`pt-28 pb-14 border-b ${isDark ? "border-white/5" : "border-black/5"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">About Veratori</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6 text-balance">
              Quantifying the physical world<br />
              <span className="text-sage">for the future of retail</span>
            </h1>
            <p className={`text-lg max-w-2xl leading-relaxed ${isDark ? "text-white/55" : "text-black/55"}`}>
              We build specialized computer vision and sensor hardware to eliminate waste in the global food supply chain. 
            </p>
          </motion.div>
        </div>
      </section>

      <Story />
      <Roadmap />
      <Team />

      {/* Contact CTA */}
      <section className={`py-24 border-t ${isDark ? "border-white/5 bg-[#0A1220]" : "border-black/5 bg-[#F4F9F6]"}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-left md:max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Work with us</h2>
              <p className={`text-lg md:text-xl ${isDark ? "text-white/60" : "text-black/60"}`}>
                We're always interested in hearing from engineers, operators, and people who want to reduce food waste at scale.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="mailto:veratori@veratori.com"
                className="inline-flex items-center gap-2 px-10 py-5 text-lg border-2 border-sage text-sage font-bold rounded-lg hover:bg-sage hover:text-white transition-all duration-300 shadow-sm"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

