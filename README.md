# 🌀 Quantum Bloch Sphere Simulator

An interactive **Bloch Sphere Simulator** built with **React + Next.js**.  
This project is designed for learning, visualizing, and experimenting with **quantum states**, **quantum gates**, and **algorithms** in an intuitive and modern UI.  

---

## ✨ Features

- 🎛 **Interactive Bloch Sphere**  
  Visualize single-qubit quantum states in real-time.

- ⚡ **Circuit Simulator**  
  Drag and drop quantum gates (X, H, Z, CX, T, etc.) and see their effects on the qubit state.

- 🧠 **Algorithm Runner**  
  Run pre-defined algorithms like **Deutsch**, **Custom Circuits**, and more.  
  Results are displayed with:
  - Algorithm Code  
  - Technical Measurement Results  
  - Human-readable Explanation  

- 📊 **Results Panel**  
  View detailed output, raw technical data, and even download results as JSON.  

- 📱 **Responsive & Modern UI**  
  Built with **TailwindCSS + shadcn/ui**, fully responsive and mobile-friendly.  

📂 Project Structure
/components
   ├── BlochSphere.tsx      # Interactive Bloch sphere
   ├── Circuit.tsx          # Quantum circuit builder
   ├── Algorithms.tsx       # Algorithm runner
   ├── Results.tsx          # Results panel
   └── ClientOnly.tsx       # No-SSR wrapper

/pages
   ├── index.tsx            # Home page with navigation
   └── _app.tsx             # Global app wrapper

🧑‍💻 Tech Stack

React + Next.js — Core framework
Three.js — 3D visualization of the Bloch Sphere
TailwindCSS — Styling
shadcn/ui — UI components
TypeScript — Type safety

📘 Educational Notes

Bloch Sphere: Represents a single qubit state as a point on a sphere.
Gates: Operations like X, H, Z rotate or transform the state vector.
Measurement: Collapses the quantum state into classical outcomes (0 or 1).
Algorithms: Small demos (e.g., Deutsch) showcase how circuits work.
## 🚀 Getting Started

📥 Export & Results

Download raw results as JSON for later analysis.
View algorithm code, counts, explanations, and state outputs in one panel.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/bloch-sphere-simulator.git
cd bloch-sphere-simulator

2. Install dependencies
npm install
# or
yarn install

