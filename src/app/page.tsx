"use client";

import ClientOnly, {
  BlochSphereNoSSR,
  CircuitNoSSR,
  AlgorithmsNoSSR,
} from "@/components/ClientOnly";

// export default function HomePage() {
//   return (
//     <ClientOnly>
//       <div className="p-4">
//         <h1
//           style={{
//             textAlign: "center",
//             letterSpacing: 1.5,
//             marginBottom: "24px",
//             background: "linear-gradient(90deg, #0077ff, #ffc300)",
//             WebkitBackgroundClip: "text",
//             backgroundClip: "text",
//             color: "transparent",
//           }}
//         >
//           Quantum Playground
//         </h1>
//         <div>
//           <BlochSphereNoSSR />
//           {/* <CircuitNoSSR /> */}
//           <AlgorithmsNoSSR />
//         </div>
//       </div>
//     </ClientOnly>
//   );
// }

// "use client";

// import { useEffect, useRef } from "react";
// import ClientOnly, {
//   BlochSphereNoSSR,
//   CircuitNoSSR,
//   AlgorithmsNoSSR,
// } from "@/components/ClientOnly";

// export default function HomePage() {
//   const titleRef = useRef<HTMLHeadingElement>(null);

//   useEffect(() => {
//     const title = titleRef.current;
//     if (!title) return;

//     // Animation for quantum "entanglement" effect
//     const animate = () => {
//       const letters = title.textContent?.split("") || [];
//       title.innerHTML = letters
//         .map(
//           (letter, i) =>
//             `<span class="quantum-letter" style="
//           display: inline-block;
//           transition: transform 0.3s ease, color 0.3s ease;
//           transform: rotate(${Math.sin(Date.now() / 500 + i * 0.3) * 5}deg);
//           color: hsl(${(Date.now() / 20 + i * 20) % 360}, 100%, 65%);
//         ">${letter === " " ? "&nbsp;" : letter}</span>`
//         )
//         .join("");

//       requestAnimationFrame(animate);
//     };

//     animate();

//     // Particle effect on hover
//     const handleMouseEnter = () => {
//       title.style.textShadow =
//         "0 0 10px rgba(0, 119, 255, 0.7), 0 0 20px rgba(255, 195, 0, 0.5)";
//     };

//     const handleMouseLeave = () => {
//       title.style.textShadow = "none";
//     };

//     title.addEventListener("mouseenter", handleMouseEnter);
//     title.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       title.removeEventListener("mouseenter", handleMouseEnter);
//       title.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, []);

//   return (
//     <ClientOnly>
//       <div className="p-4">
//         <h1
//           ref={titleRef}
//           style={{
//             textAlign: "center",
//             letterSpacing: "2px",
//             marginBottom: "24px",
//             fontSize: "3.5rem",
//             fontWeight: "800",
//             textTransform: "uppercase",
//             fontFamily: "'Orbitron', sans-serif",
//             background:
//               "linear-gradient(90deg, #0077ff, #ffc300, #ff00aa, #0077ff)",
//             backgroundSize: "300% auto",
//             WebkitBackgroundClip: "text",
//             backgroundClip: "text",
//             color: "transparent",
//             animation: "gradientShift 8s linear infinite",
//             padding: "0.5rem 1rem",
//             borderRadius: "8px",
//             position: "relative",
//             overflow: "hidden",
//             cursor: "default",
//             transition: "all 0.3s ease",
//           }}
//           className="quantum-title"
//         >
//           Quantum Playground
//         </h1>
//         <style jsx global>{`
//           @keyframes gradientShift {
//             0% {
//               background-position: 0% center;
//             }
//             100% {
//               background-position: 300% center;
//             }
//           }
//           .quantum-title::before {
//             content: "";
//             position: absolute;
//             top: -2px;
//             left: -2px;
//             right: -2px;
//             bottom: -2px;
//             background: linear-gradient(
//               45deg,
//               #0077ff,
//               #ffc300,
//               #ff00aa,
//               #0077ff
//             );
//             background-size: 400% 400%;
//             z-index: -1;
//             border-radius: 10px;
//             opacity: 0;
//             transition: opacity 0.3s ease;
//             animation: gradientShift 8s linear infinite;
//           }
//           .quantum-title:hover::before {
//             opacity: 0.3;
//           }
//         `}</style>
//         <div>
//           <BlochSphereNoSSR />
//           {/* <CircuitNoSSR /> */}
//           <AlgorithmsNoSSR />
//         </div>
//       </div>
//     </ClientOnly>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function HomePage() {
//   const [showIntro, setShowIntro] = useState(true);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const slides = [
//     {
//       title: "Quantum Playground",
//       subtitle: "Where Quantum Mechanics Meets Interactive Exploration",
//       description:
//         "Dive into the quantum realm with our cutting-edge simulation platform designed for students, researchers, and quantum enthusiasts.",
//     },
//     {
//       title: "Visualize Quantum States",
//       subtitle: "Experience Quantum Phenomena Firsthand",
//       description:
//         "Interact with our intuitive Bloch Sphere visualizer to understand superposition and quantum state evolution in real-time.",
//     },
//     {
//       title: "Build Quantum Circuits",
//       subtitle: "Design and Test Quantum Algorithms",
//       description:
//         "Create complex quantum circuits with our drag-and-drop interface and simulate their behavior on actual quantum hardware.",
//     },
//     {
//       title: "Learn Quantum Algorithms",
//       subtitle: "From Theory to Practical Implementation",
//       description:
//         "Step-by-step tutorials and visualizations for Shor's, Grover's, and other fundamental quantum algorithms.",
//     },
//   ];

//   const goToNextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const goToPrevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const enterApp = () => {
//     setShowIntro(false);
//   };

//   // Auto-advance slides
//   useEffect(() => {
//     if (showIntro) {
//       const timer = setTimeout(goToNextSlide, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentSlide, showIntro]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] text-white overflow-hidden">
//       {showIntro ? (
//         <IntroSection
//           slides={slides}
//           currentSlide={currentSlide}
//           goToNextSlide={goToNextSlide}
//           goToPrevSlide={goToPrevSlide}
//           enterApp={enterApp}
//         />
//       ) : (
//         <MainAppSection />
//       )}
//     </div>
//   );
// }

// interface Slide {
//   title: string;
//   subtitle: string;
//   description: string;
// }

// interface IntroSectionProps {
//   slides: Slide[];
//   currentSlide: number;
//   goToNextSlide: () => void;
//   goToPrevSlide: () => void;
//   enterApp: () => void;
// }

// const IntroSection = ({
//   slides,
//   currentSlide,
//   goToNextSlide,
//   goToPrevSlide,
//   enterApp,
// }: IntroSectionProps) => {
//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
//       {/* Quantum particle background */}
//       <ParticleBackground />

//       <div className="relative z-10 max-w-4xl w-full">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentSlide}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//             className="text-center"
//           >
//             <motion.h1
//               className="text-5xl md:text-6xl font-light tracking-wider mb-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               {slides[currentSlide].title}
//             </motion.h1>

//             <motion.h2
//               className="text-xl md:text-2xl font-light text-[#a0a0d0] mb-8"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               {slides[currentSlide].subtitle}
//             </motion.h2>

//             <motion.p
//               className="text-lg text-[#c0c0e0] max-w-2xl mx-auto mb-12"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               {slides[currentSlide].description}
//             </motion.p>
//           </motion.div>
//         </AnimatePresence>

//         {/* Slide indicators */}
//         <div className="flex justify-center space-x-2 mb-12">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all ${
//                 currentSlide === index
//                   ? "bg-[#4cc9f0] scale-125"
//                   : "bg-[#3a3a6a] hover:bg-[#5a5a8a]"
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>

//         {/* Navigation buttons */}
//         <div className="flex justify-center space-x-4 mb-16">
//           <button
//             onClick={goToPrevSlide}
//             className="px-6 py-3 border border-[#4cc9f0] text-[#4cc9f0] rounded-full hover:bg-[#4cc9f010] transition-all"
//           >
//             Previous
//           </button>
//           <button
//             onClick={enterApp}
//             className="px-8 py-3 bg-[#4cc9f0] text-[#0a0a1a] rounded-full font-medium hover:bg-[#3ab0d0] transition-all shadow-lg shadow-[#4cc9f040]"
//           >
//             Enter Quantum Playground
//           </button>
//           <button
//             onClick={goToNextSlide}
//             className="px-6 py-3 border border-[#4cc9f0] text-[#4cc9f0] rounded-full hover:bg-[#4cc9f010] transition-all"
//           >
//             Next
//           </button>
//         </div>

//         {/* Features grid */}
//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//         >
//           {[
//             {
//               title: "Real-time Visualization",
//               icon: "🔮",
//               color: "#4cc9f0",
//             },
//             {
//               title: "Interactive Circuits",
//               icon: "⚡",
//               color: "#7209b7",
//             },
//             {
//               title: "Algorithm Library",
//               icon: "📚",
//               color: "#3a86ff",
//             },
//           ].map((feature, index) => (
//             <motion.div
//               key={index}
//               className="p-6 bg-[#151530] rounded-xl border border-[#2a2a50] backdrop-blur-sm"
//               whileHover={{ y: -5, transition: { duration: 0.2 } }}
//             >
//               <div
//                 className="text-3xl mb-4 w-16 h-16 rounded-full flex items-center justify-center mx-auto"
//                 style={{ backgroundColor: `${feature.color}20` }}
//               >
//                 {feature.icon}
//               </div>
//               <h3 className="text-xl font-light text-center">
//                 {feature.title}
//               </h3>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>

//       {/* Footer */}
//       <motion.div
//         className="absolute bottom-6 text-[#5a5a8a] text-sm"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1 }}
//       >
//         Quantum Playground v1.0 | Built with Next.js & Quantum Simulators
//       </motion.div>
//     </div>
//   );
// };

// import React from "react";

// interface Slide {
//   title: string;
//   description: string;
// }

// interface IntroSectionProps {
//   slides: Slide[];
//   currentSlide: number;
//   goToNextSlide: () => void;
//   goToPrevSlide: () => void;
//   enterApp: () => void;
//   goToSlide: (index: number) => void; // ✅ added
// }

// const IntroSection: React.FC<IntroSectionProps> = ({
//   slides,
//   currentSlide,
//   goToNextSlide,
//   goToPrevSlide,
//   enterApp,
//   goToSlide,
// }) => {
//   return (
//     <div className="intro-section">
//       <h1>{slides[currentSlide]?.title}</h1>
//       <p>{slides[currentSlide]?.description}</p>

//       <div className="controls">
//         <button onClick={goToPrevSlide}>Previous</button>
//         <button onClick={goToNextSlide}>Next</button>
//       </div>

//       <div className="dots">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)} // ✅ fixed
//             className={index === currentSlide ? "active" : ""}
//           >
//             ●
//           </button>
//         ))}
//       </div>

//       <button onClick={enterApp}>Enter App</button>
//     </div>
//   );
// };

// const MainAppSection = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navigation Bar */}
//       <nav className="flex justify-between items-center p-6 border-b border-[#2a2a50]">
//         <div className="flex items-center space-x-2">
//           <div className="w-3 h-3 rounded-full bg-[#4cc9f0]"></div>
//           <div className="w-3 h-3 rounded-full bg-[#7209b7]"></div>
//           <div className="w-3 h-3 rounded-full bg-[#3a86ff]"></div>
//           <span className="ml-4 text-xl font-light">Quantum Playground</span>
//         </div>

//         <div className="flex space-x-4">
//           <button className="px-4 py-2 rounded-lg bg-[#151530] hover:bg-[#252550] transition-colors">
//             Save
//           </button>
//           <button className="px-4 py-2 rounded-lg bg-[#4cc9f0] text-[#0a0a1a] hover:bg-[#3ab0d0] transition-colors">
//             Export
//           </button>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-64 bg-[#101025] border-r border-[#2a2a50] p-4">
//           <h3 className="text-[#a0a0d0] font-light mb-4">Quantum Tools</h3>
//           <ul className="space-y-2">
//             {[
//               "Bloch Sphere",
//               "Quantum Circuit",
//               "Algorithms Library",
//               "State Vector",
//               "Qubit Manipulator",
//               "Quantum Gates",
//             ].map((item, index) => (
//               <li
//                 key={index}
//                 className="p-2 rounded hover:bg-[#202040] cursor-pointer transition-colors"
//               >
//                 {item}
//               </li>
//             ))}
//           </ul>

//           <h3 className="text-[#a0a0d0] font-light mt-8 mb-4">Examples</h3>
//           <ul className="space-y-2">
//             {[
//               "Superposition",
//               "Entanglement",
//               "Quantum Teleportation",
//               "Grover's Algorithm",
//               "Shor's Algorithm",
//               "Quantum Fourier Transform",
//             ].map((item, index) => (
//               <li
//                 key={index}
//                 className="p-2 rounded hover:bg-[#202040] cursor-pointer transition-colors"
//               >
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </aside>

//         {/* Main Workspace */}
//         <main className="flex-1 p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Bloch Sphere Section */}
//             <div className="bg-[#151530] border border-[#2a2a50] rounded-xl p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-light">Bloch Sphere</h2>
//                 <div className="flex space-x-2">
//                   <button className="px-3 py-1 rounded bg-[#202040] hover:bg-[#303060] transition-colors">
//                     Reset
//                   </button>
//                   <button className="px-3 py-1 rounded bg-[#4cc9f0] text-[#0a0a1a] hover:bg-[#3ab0d0] transition-colors">
//                     Animate
//                   </button>
//                 </div>
//               </div>
//               <div className="h-80 bg-[#0a0a1a] rounded-lg flex items-center justify-center">
//                 <div className="relative w-64 h-64 rounded-full border border-[#4cc9f0] flex items-center justify-center">
//                   <div className="absolute w-full h-0.5 bg-[#4cc9f0] opacity-30"></div>
//                   <div className="absolute w-0.5 h-full bg-[#4cc9f0] opacity-30"></div>
//                   <div className="absolute w-0.5 h-full bg-[#4cc9f0] opacity-30 transform rotate-45"></div>
//                   <div className="w-40 h-40 rounded-full border border-[#7209b7] flex items-center justify-center">
//                     <div className="w-24 h-24 rounded-full border border-[#3a86ff] flex items-center justify-center">
//                       <div className="w-4 h-4 rounded-full bg-[#4cc9f0]"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Circuit Builder Section */}
//             <div className="bg-[#151530] border border-[#2a2a50] rounded-xl p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-light">Quantum Circuit</h2>
//                 <div className="flex space-x-2">
//                   <button className="px-3 py-1 rounded bg-[#202040] hover:bg-[#303060] transition-colors">
//                     Clear
//                   </button>
//                   <button className="px-3 py-1 rounded bg-[#7209b7] hover:bg-[#6108a6] transition-colors">
//                     Run
//                   </button>
//                 </div>
//               </div>
//               <div className="h-80 bg-[#0a0a1a] rounded-lg p-4">
//                 <div className="flex space-x-8 mb-6">
//                   <div className="flex flex-col items-center">
//                     <div className="w-8 h-8 rounded-full border border-[#4cc9f0] flex items-center justify-center mb-1">
//                       H
//                     </div>
//                     <span className="text-xs text-[#a0a0d0]">Hadamard</span>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <div className="w-8 h-8 rounded-full border border-[#7209b7] flex items-center justify-center mb-1">
//                       X
//                     </div>
//                     <span className="text-xs text-[#a0a0d0]">Pauli-X</span>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <div className="w-8 h-8 rounded-full border border-[#3a86ff] flex items-center justify-center mb-1">
//                       CNOT
//                     </div>
//                     <span className="text-xs text-[#a0a0d0]">Control</span>
//                   </div>
//                 </div>

//                 <div className="border-t border-[#2a2a50] pt-4">
//                   <div className="flex items-center mb-4">
//                     <div className="w-6 h-6 rounded-full border border-[#4cc9f0] mr-3"></div>
//                     <div className="h-0.5 bg-[#4cc9f0] flex-1">
//                       <div className="w-8 h-8 rounded-full border border-[#4cc9f0] flex items-center justify-center relative -top-3 left-1/4">
//                         H
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-6 h-6 rounded-full border border-[#7209b7] mr-3"></div>
//                     <div className="h-0.5 bg-[#7209b7] flex-1">
//                       <div className="w-8 h-8 rounded-full border border-[#7209b7] flex items-center justify-center relative -top-3 left-1/2">
//                         X
//                       </div>
//                       <div className="w-4 h-4 rounded-full border border-[#3a86ff] flex items-center justify-center absolute top-1/2 left-3/4 transform -translate-y-1/2">
//                         •
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Algorithms Section */}
//           <div className="bg-[#151530] border border-[#2a2a50] rounded-xl p-6 mt-8">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-light">Quantum Algorithms</h2>
//               <input
//                 type="text"
//                 placeholder="Search algorithms..."
//                 className="px-4 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a50] focus:outline-none focus:border-[#4cc9f0]"
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {[
//                 { name: "Grover's Search", color: "#4cc9f0" },
//                 { name: "Shor's Factorization", color: "#7209b7" },
//                 { name: "Quantum Fourier Transform", color: "#3a86ff" },
//                 { name: "Quantum Teleportation", color: "#4cc9f0" },
//                 { name: "Superdense Coding", color: "#7209b7" },
//                 { name: "Deutsch-Jozsa Algorithm", color: "#3a86ff" },
//               ].map((algo, index) => (
//                 <div
//                   key={index}
//                   className="p-4 rounded-lg border border-[#2a2a50] hover:border-[currentColor] transition-colors"
//                   style={{ color: algo.color }}
//                 >
//                   {algo.name}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// const ParticleBackground = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     // Create particles
//     const particleCount = 30;
//     const colors = ["#4cc9f0", "#7209b7", "#3a86ff"];

//     for (let i = 0; i < particleCount; i++) {
//       const particle = document.createElement("div");
//       particle.style.position = "absolute";
//       particle.style.width = `${Math.random() * 3 + 1}px`;
//       particle.style.height = particle.style.width;
//       particle.style.backgroundColor =
//         colors[Math.floor(Math.random() * colors.length)];
//       particle.style.borderRadius = "50%";
//       particle.style.opacity = `${Math.random() * 0.4 + 0.1}`;

//       // Random position
//       particle.style.left = `${Math.random() * 100}%`;
//       particle.style.top = `${Math.random() * 100}%`;

//       container.appendChild(particle);

//       // Animate particle
//       const animate = () => {
//         const x = Math.sin(Date.now() / 2000 + i) * 20;
//         const y = Math.cos(Date.now() / 1800 + i) * 20;
//         particle.style.transform = `translate(${x}px, ${y}px)`;
//         requestAnimationFrame(animate);
//       };

//       animate();
//     }

//     return () => {
//       while (container.firstChild) {
//         container.removeChild(container.firstChild);
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="absolute inset-0 pointer-events-none overflow-hidden"
//       style={{
//         background:
//           "radial-gradient(circle at center, #1a1a3a 0%, #0a0a1a 70%)",
//       }}
//     />
//   );
// };

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

const MainAppSection = () => {
  return (
    // <div className="min-h-screen flex flex-col bg-[#0a0a1a] text-white">
    //   <nav className="flex justify-between items-center p-6 border-b border-[#2a2a50]">
    //     <div className="flex items-center space-x-2">
    //       <div className="w-3 h-3 rounded-full bg-[#4cc9f0]"></div>
    //       <div className="w-3 h-3 rounded-full bg-[#7209b7]"></div>
    //       <div className="w-3 h-3 rounded-full bg-[#3a86ff]"></div>
    //       <span className="ml-4 text-xl font-light">Quantum Playground</span>
    //     </div>

    //     <div className="flex space-x-4">
    //       <button className="px-4 py-2 rounded-lg bg-[#151530] hover:bg-[#252550] transition-colors">
    //         Save
    //       </button>
    //       <button className="px-4 py-2 rounded-lg bg-[#4cc9f0] text-[#0a0a1a] hover:bg-[#3ab0d0] transition-colors">
    //         Export
    //       </button>
    //     </div>
    //   </nav>

    //   <div className="flex flex-1">
    //     <aside className="w-64 bg-[#101025] border-r border-[#2a2a50] p-4">
    //       <h3 className="text-[#a0a0d0] font-light mb-4">Quantum Tools</h3>
    //       <ul className="space-y-2">
    //         {[
    //           "Bloch Sphere",
    //           "Quantum Circuit",
    //           "Algorithms Library",
    //           "State Vector",
    //           "Qubit Manipulator",
    //           "Quantum Gates",
    //         ].map((item, index) => (
    //           <li
    //             key={index}
    //             className="p-2 rounded hover:bg-[#202040] cursor-pointer transition-colors"
    //           >
    //             {item}
    //           </li>
    //         ))}
    //       </ul>

    //       <h3 className="text-[#a0a0d0] font-light mt-8 mb-4">Examples</h3>
    //       <ul className="space-y-2">
    //         {[
    //           "Superposition",
    //           "Entanglement",
    //           "Quantum Teleportation",
    //           "Grover's Algorithm",
    //           "Shor's Algorithm",
    //           "Quantum Fourier Transform",
    //         ].map((item, index) => (
    //           <li
    //             key={index}
    //             className="p-2 rounded hover:bg-[#202040] cursor-pointer transition-colors"
    //           >
    //             {item}
    //           </li>
    //         ))}
    //       </ul>
    //     </aside>

    //     <main className="flex-1 p-6">
    //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    //         <div className="bg-[#151530] border border-[#2a2a50] rounded-xl p-6">
    //           <div className="flex justify-between items-center mb-4">
    //             <h2 className="text-xl font-light">Bloch Sphere</h2>
    //             <div className="flex space-x-2">
    //               <button className="px-3 py-1 rounded bg-[#202040] hover:bg-[#303060] transition-colors">
    //                 Reset
    //               </button>
    //               <button className="px-3 py-1 rounded bg-[#4cc9f0] text-[#0a0a1a] hover:bg-[#3ab0d0] transition-colors">
    //                 Animate
    //               </button>
    //             </div>
    //           </div>
    //           <div className="h-80 bg-[#0a0a1a] rounded-lg flex items-center justify-center">
    //             <div className="relative w-64 h-64 rounded-full border border-[#4cc9f0] flex items-center justify-center">
    //               <div className="absolute w-full h-0.5 bg-[#4cc9f0] opacity-30"></div>
    //               <div className="absolute w-0.5 h-full bg-[#4cc9f0] opacity-30"></div>
    //               <div className="absolute w-0.5 h-full bg-[#4cc9f0] opacity-30 transform rotate-45"></div>
    //               <div className="w-40 h-40 rounded-full border border-[#7209b7] flex items-center justify-center">
    //                 <div className="w-24 h-24 rounded-full border border-[#3a86ff] flex items-center justify-center">
    //                   <div className="w-4 h-4 rounded-full bg-[#4cc9f0]"></div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="bg-[#151530] border border-[#2a2a50] rounded-xl p-6">
    //           <div className="flex justify-between items-center mb-4">
    //             <h2 className="text-xl font-light">Quantum Circuit</h2>
    //             <div className="flex space-x-2">
    //               <button className="px-3 py-1 rounded bg-[#202040] hover:bg-[#303060] transition-colors">
    //                 Clear
    //               </button>
    //               <button className="px-3 py-1 rounded bg-[#7209b7] hover:bg-[#6108a6] transition-colors">
    //                 Run
    //               </button>
    //             </div>
    //           </div>
    //           <div className="h-80 bg-[#0a0a1a] rounded-lg p-4">
    //             <div className="flex space-x-8 mb-6">
    //               <div className="flex flex-col items-center">
    //                 <div className="w-8 h-8 rounded-full border border-[#4cc9f0] flex items-center justify-center mb-1">
    //                   H
    //                 </div>
    //                 <span className="text-xs text-[#a0a0d0]">Hadamard</span>
    //               </div>
    //               <div className="flex flex-col items-center">
    //                 <div className="w-8 h-8 rounded-full border border-[#7209b7] flex items-center justify-center mb-1">
    //                   X
    //                 </div>
    //                 <span className="text-xs text-[#a0a0d0]">Pauli-X</span>
    //               </div>
    //               <div className="flex flex-col items-center">
    //                 <div className="w-8 h-8 rounded-full border border-[#3a86ff] flex items-center justify-center mb-1">
    //                   CNOT
    //                 </div>
    //                 <span className="text-xs text-[#a0a0d0]">Control</span>
    //               </div>
    //             </div>

    //             <div className="border-t border-[#2a2a50] pt-4">
    //               <div className="flex items-center mb-4">
    //                 <div className="w-6 h-6 rounded-full border border-[#4cc9f0] mr-3"></div>
    //                 <div className="h-0.5 bg-[#4cc9f0] flex-1">
    //                   <div className="w-8 h-8 rounded-full border border-[#4cc9f0] flex items-center justify-center relative -top-3 left-1/4">
    //                     H
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="flex items-center">
    //                 <div className="w-6 h-6 rounded-full border border-[#7209b7] mr-3"></div>
    //                 <div className="h-0.5 bg-[#7209b7] flex-1">
    //                   <div className="w-8 h-8 rounded-full border border-[#7209b7] flex items-center justify-center relative -top-3 left-1/2">
    //                     X
    //                   </div>
    //                   <div className="w-4 h-4 rounded-full border border-[#3a86ff] flex items-center justify-center absolute top-1/2 left-3/4 transform -translate-y-1/2">
    //                     •
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-[#151530] border border-[#2a2a50] rounded-xl p-6 mt-8">
    //         <div className="flex justify-between items-center mb-4">
    //           <h2 className="text-xl font-light">Quantum Algorithms</h2>
    //           <input
    //             type="text"
    //             placeholder="Search algorithms..."
    //             className="px-4 py-2 rounded-lg bg-[#0a0a1a] border border-[#2a2a50] focus:outline-none focus:border-[#4cc9f0]"
    //           />
    //         </div>
    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //           {[
    //             { name: "Grover's Search", color: "#4cc9f0" },
    //             { name: "Shor's Factorization", color: "#7209b7" },
    //             { name: "Quantum Fourier Transform", color: "#3a86ff" },
    //             { name: "Quantum Teleportation", color: "#4cc9f0" },
    //             { name: "Superdense Coding", color: "#7209b7" },
    //             { name: "Deutsch-Jozsa Algorithm", color: "#3a86ff" },
    //           ].map((algo, index) => (
    //             <div
    //               key={index}
    //               className="p-4 rounded-lg border border-[#2a2a50] hover:border-[currentColor] transition-colors"
    //               style={{ color: algo.color }}
    //             >
    //               {algo.name}
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </main>
    //   </div>
    // </div>

    <ClientOnly>
      <div className="p-4">
        <h1
          style={{
            textAlign: "center",
            letterSpacing: 1.5,
            marginBottom: "24px",
            background: "linear-gradient(90deg, #0077ff, #ffc300)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Quantum Playground
        </h1>
        <div>
          <BlochSphereNoSSR />
          {/* <CircuitNoSSR /> */}
          <AlgorithmsNoSSR />
        </div>
      </div>
    </ClientOnly>
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

      container.appendChild(particle);
      particles.push(particle);

      const animate = () => {
        const x = Math.sin(Date.now() / 2000 + i) * 20;
        const y = Math.cos(Date.now() / 1800 + i) * 20;
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
