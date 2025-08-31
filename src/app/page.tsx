"use client";

import ClientOnly, {
  BlochSphereNoSSR,
  CircuitNoSSR,
  AlgorithmsNoSSR,
} from "@/components/ClientOnly";

import React, { useState, useEffect, useRef } from "react";

interface Slide {
  title: string;
  description: string;
}

interface IntroSectionProps {
  slides: Slide[];
  currentSlide: number;
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  enterApp: () => void;
  goToSlide: (index: number) => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  slides,
  currentSlide,
  goToNextSlide,
  goToPrevSlide,
  enterApp,
  goToSlide,
}) => {
  return (
    <div className="intro-section relative min-h-screen flex flex-col items-center justify-center p-4">
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4">
          {slides[currentSlide]?.title}
        </h1>
        <p className="text-lg text-[#c0c0e0] max-w-2xl mx-auto mb-12">
          {slides[currentSlide]?.description}
        </p>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={goToPrevSlide}
            className="px-6 py-3 border border-[#4cc9f0] text-[#4cc9f0] rounded-full hover:bg-[#4cc9f010] transition-all"
          >
            Previous
          </button>
          <button
            onClick={enterApp}
            className="px-8 py-3 bg-[#4cc9f0] text-[#0a0a1a] rounded-full font-medium hover:bg-[#3ab0d0] transition-all shadow-lg shadow-[#4cc9f040]"
          >
            Enter App
          </button>
          <button
            onClick={goToNextSlide}
            className="px-6 py-3 border border-[#4cc9f0] text-[#4cc9f0] rounded-full hover:bg-[#4cc9f010] transition-all"
          >
            Next
          </button>
        </div>

        <div className="flex justify-center space-x-2 mb-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[#4cc9f0] scale-125"
                  : "bg-[#3a3a6a] hover:bg-[#5a5a8a]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 30;
    const colors = ["#4cc9f0", "#7209b7", "#3a86ff"];

    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = "50%";
      particle.style.opacity = `${Math.random() * 0.4 + 0.1}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.pointerEvents = "none";

      container.appendChild(particle);
      particles.push(particle);

      const animate = () => {
        const x = Math.sin(Date.now() / 2000 + i) * 18;
        const y = Math.cos(Date.now() / 1800 + i) * 18;
        particle.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
      };

      animate();
    }

    return () => {
      particles.forEach((particle) => {
        if (particle.parentNode === container) {
          container.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, #1a1a3a 0%, #0a0a1a 70%)",
      }}
    />
  );
};

// ---------------- Results Panel ----------------
function ResultsPanel({
  results,
  onBack,
}: {
  results: any | null;
  onBack?: () => void;
}) {
  if (!results) {
    return (
      <div className="p-6 rounded-lg bg-[#13131a] border border-[#24243a]">
        <h3 className="text-xl text-[#ffc300] mb-2">No results yet</h3>
        <p className="text-sm text-[#bdbde8]">
          Run an algorithm to see results here.
        </p>
        {onBack && (
          <div className="mt-4">
            <button
              onClick={onBack}
              className="px-3 py-2 rounded bg-[#4c6cff] text-white"
            >
              Back
            </button>
          </div>
        )}
      </div>
    );
  }

  const download = () => {
    const payload = JSON.stringify(results, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quantum-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 rounded-lg bg-[#0f1116] border border-[#232339]">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-xl text-[#ffc300] mb-1">
            {results.algorithm ?? "Run Results"}
          </h3>
          <div className="text-xs text-[#9aa0c7]">
            {results.timestamp
              ? new Date(results.timestamp).toLocaleString()
              : ""}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={download}
            className="px-3 py-2 rounded bg-[#2e7d32] text-white"
          >
            Download JSON
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-2 rounded bg-[#4c6cff] text-white"
            >
              Back
            </button>
          )}
        </div>
      </div>

      <pre className="mt-4 bg-[#0b0c10] p-4 rounded text-sm overflow-auto text-[#dbe6ff]">
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  );
}
// ---------------- Main App section ----------------
const MainAppSection = () => {
  // which tool panel is active
  const [activePanel, setActivePanel] = useState<
    "bloch" | "circuit" | "algorithms" | "results"
  >("bloch");

  // store results object from child components
  const [results, setResults] = useState<any | null>(null);

  // This handler will be passed down as `onRun` to Circuit (and optionally to BlochSphere/Algorithms)
  const handleRun = (result: any) => {
    console.log("Results received in parent:", result);
    setResults(result);
    setActivePanel("results"); // auto-switch to results
  };

  return (
    <ClientOnly>
      <div className="min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#232339] bg-gradient-to-r from-[#070712] to-[#0d0f18]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#4cc9f0]" />
            <div className="w-3 h-3 rounded-full bg-[#7209b7]" />
            <div className="w-3 h-3 rounded-full bg-[#3a86ff]" />
            <h2 className="ml-4 text-lg font-light">Quantum Playground</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 rounded bg-[#151530] hover:bg-[#252550]"
              onClick={() => {
                // quick-reset results for demo
                setResults(null);
                setActivePanel("circuit");
              }}
            >
              Reset
            </button>
            <button
              className="px-3 py-1 rounded bg-[#4cc9f0] text-[#0a0a1a] hover:bg-[#3ab0d0]"
              onClick={() => {
                // export current results if present
                if (results) {
                  const payload = JSON.stringify(results, null, 2);
                  const blob = new Blob([payload], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `quantum-results-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
            >
              Export
            </button>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-64 bg-[#0f1116] border-r border-[#232339] p-4">
            <div className="text-sm text-[#aeb6e6] mb-4">Quantum Tools</div>

            <button
              className={`text-left px-3 py-2 rounded ${
                activePanel === "bloch" ? "bg-[#1b2446]" : "hover:bg-[#121428]"
              }`}
              onClick={() => setActivePanel("bloch")}
            >
              Bloch Sphere
            </button>
            <button
              className={`text-left px-3 py-2 rounded ${
                activePanel === "circuit"
                  ? "bg-[#1b2446]"
                  : "hover:bg-[#121428]"
              }`}
              onClick={() => setActivePanel("circuit")}
            >
              Quantum Circuit
            </button>
            <button
              className={`text-left px-3 py-2 rounded ${
                activePanel === "algorithms"
                  ? "bg-[#1b2446]"
                  : "hover:bg-[#121428]"
              }`}
              onClick={() => setActivePanel("algorithms")}
            >
              Algorithms Library
            </button>
            <button
              className={`text-left px-3 py-2 rounded ${
                activePanel === "results"
                  ? "bg-[#1b2446]"
                  : "hover:bg-[#121428]"
              }`}
              onClick={() => setActivePanel("results")}
            >
              Results
            </button>

            <div className="mt-6 text-sm text-[#9aa0c7]">
              Examples
              <ul className="mt-2 pl-4 space-y-1 text-xs">
                <li>Superposition</li>
                <li>Entanglement</li>
                <li>Grover's Search</li>
                <li>Shor's Algorithm</li>
                <li>Grover's Algorithm</li>
              </ul>
            </div>
          </aside>

          <main className="flex-1 p-6 overflow-auto">
            {activePanel === "bloch" && (
              <div className="rounded-xl p-4 bg-[#0b0c12] border border-[#232339]">
                <h3 className="text-lg text-[#cfe4ff] mb-4">Bloch Sphere</h3>
                <BlochSphereNoSSR />
              </div>
            )}

            {activePanel === "circuit" && (
              <div className="rounded-xl p-4 bg-[#0b0c12] border border-[#232339]">
                <h3 className="text-lg text-[#cfe4ff] mb-4">
                  Circuit Designer
                </h3>
                <CircuitNoSSR onRun={handleRun} />
              </div>
            )}

            {activePanel === "algorithms" && (
              <div className="rounded-xl p-4 bg-[#0b0c12] border border-[#232339]">
                <h3 className="text-lg text-[#cfe4ff] mb-4">Algorithms</h3>
                <AlgorithmsNoSSR onRun={handleRun} />
              </div>
            )}

            {activePanel === "results" && (
              <div className="rounded-xl p-4 bg-[#0b0c12] border border-[#232339]">
                <h3 className="text-lg text-[#cfe4ff] mb-4">Results</h3>
                <ResultsPanel
                  results={results}
                  onBack={() => setResults(null)}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </ClientOnly>
  );
};

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      title: "Quantum Playground",
      description:
        "Dive into the quantum realm with our cutting-edge simulation platform.",
    },
    {
      title: "Visualize Quantum States",
      description: "Interact with our intuitive Bloch Sphere visualizer.",
    },
    {
      title: "Build Quantum Circuits",
      description: "Create quantum circuits with our drag-and-drop interface.",
    },
  ];

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const enterApp = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(goToNextSlide, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, showIntro]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] text-white overflow-hidden">
      {showIntro ? (
        <IntroSection
          slides={slides}
          currentSlide={currentSlide}
          goToNextSlide={goToNextSlide}
          goToPrevSlide={goToPrevSlide}
          enterApp={enterApp}
          goToSlide={goToSlide}
        />
      ) : (
        <MainAppSection />
      )}
    </div>
  );
}
