import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d16] via-[#13132a] to-[#1a1a35] p-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#ffc300] via-[#ff4d00] to-[#ff00c8] bg-clip-text text-transparent mb-6">
            Quantum Playground
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore the fascinating world of quantum computing through
            interactive visualizations, algorithm simulations, and quantum
            circuit design
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#ffc300] to-[#ff00c8] mx-auto mb-12"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Algorithms Card */}
          <Link href="/algorithms">
            <div className="group relative bg-gradient-to-br from-[#13131a] to-[#1a1a2a] border border-[#24243a] rounded-2xl p-8 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff00c8]/20">
              <div className="absolute top-4 right-4 w-12 h-12 bg-[#ff00c8]/10 rounded-full flex items-center justify-center group-hover:animate-pulse">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff00c8] to-[#ff4d00] rounded-2xl flex items-center justify-center text-2xl mb-4">
                  🧠
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Algorithms
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Discover quantum algorithms like Shor's, Grover's, and
                  Deutsch-Jozsa with interactive simulations
                </p>
              </div>
              <div className="flex items-center text-[#ff00c8] group-hover:text-[#ffc300] transition-colors">
                <span className="text-sm font-medium">Explore Algorithms</span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Circuit Card */}
          <Link href="/circuit">
            <div className="group relative bg-gradient-to-br from-[#13131a] to-[#1a1a2a] border border-[#24243a] rounded-2xl p-8 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00ff88]/20">
              <div className="absolute top-4 right-4 w-12 h-12 bg-[#00ff88]/10 rounded-full flex items-center justify-center group-hover:animate-pulse">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#00ff88] to-[#00ccff] rounded-2xl flex items-center justify-center text-2xl mb-4">
                  ⚡
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Circuit
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Build and visualize quantum circuits with drag-and-drop gates
                  and real-time simulation
                </p>
              </div>
              <div className="flex items-center text-[#00ff88] group-hover:text-[#00ccff] transition-colors">
                <span className="text-sm font-medium">Design Circuit</span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Bloch Sphere Card */}
          <Link href="/bloch">
            <div className="group relative bg-gradient-to-br from-[#13131a] to-[#1a1a2a] border border-[#24243a] rounded-2xl p-8 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00ccff]/20">
              <div className="absolute top-4 right-4 w-12 h-12 bg-[#00ccff]/10 rounded-full flex items-center justify-center group-hover:animate-pulse">
                <span className="text-2xl">🌐</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#00ccff] to-[#ffc300] rounded-2xl flex items-center justify-center text-2xl mb-4">
                  🌍
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Bloch Sphere
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Visualize quantum states and transformations in 3D with
                  interactive Bloch sphere representation
                </p>
              </div>
              <div className="flex items-center text-[#00ccff] group-hover:text-[#ffc300] transition-colors">
                <span className="text-sm font-medium">View Sphere</span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="bg-[#13131a]/80 border border-[#24243a] rounded-2xl p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#ffc300] mb-2">10+</div>
              <div className="text-gray-400">Quantum Algorithms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00ff88] mb-2">15+</div>
              <div className="text-gray-400">Quantum Gates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00ccff] mb-2">100%</div>
              <div className="text-gray-400">Interactive Learning</div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Built with Next.js, TypeScript, and quantum passion 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
