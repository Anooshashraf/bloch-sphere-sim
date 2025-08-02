// // "use client";

// // import React, { useState } from "react";
// // import BlochSphere from "@/components/BlochSphere";
// // import Circuit from "@/components/circuit";

// // export default function NavigationBar() {
// //   const [menuOpen, setMenuOpen] = useState(false);

// //   return (
// //     <nav
// //       style={{
// //         width: "100%",
// //         background: "linear-gradient(90deg, #232b3a 60%, #181c24 100%)",
// //         padding: "0.5rem 2rem",
// //         boxShadow: "0 2px 8px #0004",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "space-between",
// //         fontFamily: "'Segoe UI', Arial, sans-serif",
// //         position: "relative",
// //         zIndex: 100,
// //       }}
// //     >
// //       <div style={{ fontWeight: 700, fontSize: 22, color: "#ffc300" }}>
// //         Quantum Simulator
// //       </div>
// //       {/* Desktop Links */}
// //       <div
// //         style={{
// //           display: "flex",
// //           gap: 24,
// //           alignItems: "center",
// //         }}
// //         className="nav-links"
// //       >
// //         <a
// //           href="/"
// //           style={{
// //             color: "#fff",
// //             textDecoration: "none",
// //             fontWeight: 500,
// //             fontSize: 16,
// //             transition: "color 0.2s",
// //             display: "none",
// //           }}
// //           className="nav-link"
// //         >
// //           Home
// //         </a>
// //         <a
// //           href="/BlochSphere"
// //           style={{
// //             color: "#fff",
// //             textDecoration: "none",
// //             fontWeight: 500,
// //             fontSize: 16,
// //             transition: "color 0.2s",
// //             display: "none",
// //           }}
// //           className="nav-link"
// //         >
// //           Bloch Sphere
// //         </a>
// //         <a
// //           href="/circuit"
// //           style={{
// //             color: "#fff",
// //             textDecoration: "none",
// //             fontWeight: 500,
// //             fontSize: 16,
// //             transition: "color 0.2s",
// //             display: "none",
// //           }}
// //           className="nav-link"
// //         >
// //           Circuit Designer
// //         </a>
// //       </div>
// //       {/* Hamburger */}
// //       <button
// //         aria-label="Open menu"
// //         style={{
// //           background: "none",
// //           border: "none",
// //           color: "#ffc300",
// //           fontSize: 28,
// //           cursor: "pointer",
// //           display: "none",
// //         }}
// //         className="nav-hamburger"
// //         onClick={() => setMenuOpen((v) => !v)}
// //       >
// //         ☰
// //       </button>
// //       {/* Sidebar Menu */}
// //       {menuOpen && (
// //         <div
// //           style={{
// //             position: "fixed",
// //             top: 0,
// //             right: 0,
// //             width: 220,
// //             height: "100vh",
// //             background: "#232b3a",
// //             boxShadow: "-2px 0 16px #0008",
// //             display: "flex",
// //             flexDirection: "column",
// //             padding: "2rem 1rem",
// //             zIndex: 999,
// //           }}
// //         >
// //           <button
// //             aria-label="Close menu"
// //             style={{
// //               background: "none",
// //               border: "none",
// //               color: "#ffc300",
// //               fontSize: 28,
// //               alignSelf: "flex-end",
// //               marginBottom: 24,
// //               cursor: "pointer",
// //             }}
// //             onClick={() => setMenuOpen(false)}
// //           >
// //             ×
// //           </button>
// //           <a
// //             href="/"
// //             style={{
// //               color: "#fff",
// //               textDecoration: "none",
// //               fontWeight: 500,
// //               fontSize: 18,
// //               marginBottom: 18,
// //             }}
// //             onClick={() => setMenuOpen(false)}
// //           >
// //             Home
// //           </a>
// //           <a
// //             href="/BlochSphere"
// //             style={{
// //               color: "#fff",
// //               textDecoration: "none",
// //               fontWeight: 500,
// //               fontSize: 18,
// //               marginBottom: 18,
// //             }}
// //             onClick={() => setMenuOpen(false)}
// //           >
// //             Bloch Sphere
// //           </a>
// //           <a
// //             href="/circuit"
// //             style={{
// //               color: "#fff",
// //               textDecoration: "none",
// //               fontWeight: 500,
// //               fontSize: 18,
// //               marginBottom: 18,
// //             }}
// //             onClick={() => setMenuOpen(false)}
// //           >
// //             Circuit Designer
// //           </a>
// //         </div>
// //       )}
// //       {/* Responsive CSS */}
// //       <style>{`
// //         @media (max-width: 700px) {
// //           .nav-links .nav-link {
// //             display: none !important;
// //           }
// //           .nav-hamburger {
// //             display: block !important;
// //           }
// //         }
// //         @media (min-width: 701px) {
// //           .nav-links .nav-link {
// //             display: block !important;
// //           }
// //           .nav-hamburger {
// //             display: none !important;
// //           }
// //         }
// //       `}</style>
// //     </nav>
// //   );
// // }

// "use client";

// import React, { useState } from "react";
// import BlochSphere from "./BlochSphere";
// import Circuit from "./circuit";
// import Link from "next/link";

// export default function NavigationBar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav
//       style={{
//         width: "100%",
//         background: "linear-gradient(90deg, #232b3a 60%, #181c24 100%)",
//         padding: "0.5rem 2rem",
//         boxShadow: "0 2px 8px #0004",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         fontFamily: "'Segoe UI', Arial, sans-serif",
//         position: "relative",
//         zIndex: 100,
//       }}
//     >
//       <div style={{ fontWeight: 700, fontSize: 22, color: "#ffc300" }}>
//         Quantum Simulator
//       </div>
//       {/* Desktop Links */}
//       <div
//         style={{
//           display: "flex",
//           gap: 24,
//           alignItems: "center",
//         }}
//         className="nav-links"
//       >
//         <Link
//           href="/"
//           className="nav-link"
//           style={{
//             color: "#fff",
//             textDecoration: "none",
//             fontWeight: 500,
//             fontSize: 16,
//             transition: "color 0.2s",
//             display: "none",
//           }}
//         >
//           Home
//         </Link>
//         <Link
//           href="/BlochSphere"
//           className="nav-link"
//           style={{
//             color: "#fff",
//             textDecoration: "none",
//             fontWeight: 500,
//             fontSize: 16,
//             transition: "color 0.2s",
//             display: "none",
//           }}
//         >
//           Bloch Sphere
//         </Link>
//         <Link
//           href="/circuit"
//           className="nav-link"
//           style={{
//             color: "#fff",
//             textDecoration: "none",
//             fontWeight: 500,
//             fontSize: 16,
//             transition: "color 0.2s",
//             display: "none",
//           }}
//         >
//           Circuit Designer
//         </Link>
//       </div>
//       {/* Hamburger */}
//       <button
//         aria-label="Open menu"
//         style={{
//           background: "none",
//           border: "none",
//           color: "#ffc300",
//           fontSize: 28,
//           cursor: "pointer",
//           display: "none",
//         }}
//         className="nav-hamburger"
//         onClick={() => setMenuOpen((v) => !v)}
//       >
//         ☰
//       </button>
//       {/* Sidebar Menu */}
//       {menuOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             right: 0,
//             width: 220,
//             height: "100vh",
//             background: "#232b3a",
//             boxShadow: "-2px 0 16px #0008",
//             display: "flex",
//             flexDirection: "column",
//             padding: "2rem 1rem",
//             zIndex: 999,
//           }}
//         >
//           <button
//             aria-label="Close menu"
//             style={{
//               background: "none",
//               border: "none",
//               color: "#ffc300",
//               fontSize: 28,
//               alignSelf: "flex-end",
//               marginBottom: 24,
//               cursor: "pointer",
//             }}
//             onClick={() => setMenuOpen(false)}
//           >
//             ×
//           </button>
//           <Link
//             href="/"
//             style={{
//               color: "#fff",
//               textDecoration: "none",
//               fontWeight: 500,
//               fontSize: 18,
//               marginBottom: 18,
//               display: "block",
//             }}
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             href="/BlochSphere"
//             style={{
//               color: "#fff",
//               textDecoration: "none",
//               fontWeight: 500,
//               fontSize: 18,
//               marginBottom: 18,
//               display: "block",
//             }}
//             onClick={() => setMenuOpen(false)}
//           >
//             Bloch Sphere
//           </Link>
//           <Link
//             href="/circuit"
//             style={{
//               color: "#fff",
//               textDecoration: "none",
//               fontWeight: 500,
//               fontSize: 18,
//               marginBottom: 18,
//               display: "block",
//             }}
//             onClick={() => setMenuOpen(false)}
//           >
//             Circuit Designer
//           </Link>
//         </div>
//       )}
//       {/* Responsive CSS */}
//       <style>{`
//         @media (max-width: 700px) {
//           .nav-links .nav-link {
//             display: none !important;
//           }
//           .nav-hamburger {
//             display: block !important;
//           }
//         }
//         @media (min-width: 701px) {
//           .nav-links .nav-link {
//             display: block !important;
//           }
//           .nav-hamburger {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </nav>
//   );
// }

"use client";

import React, { useState } from "react";

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #232b3a 60%, #181c24 100%)",
        padding: "0.5rem 2rem",
        boxShadow: "0 2px 8px #0004",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "'Segoe UI', Arial, sans‑serif",
        position: "relative",
        zIndex: 100,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 22, color: "#ffc300" }}>
        Quantum Simulator
      </div>

      <div className="nav-links" style={{ display: "flex", gap: 24 }}>
        <a className="nav-link" href="/">
          Home
        </a>
        <a className="nav-link" href="/BlochSphere">
          Bloch Sphere
        </a>
        <a className="nav-link" href="/circuit">
          Circuit Designer
        </a>
      </div>

      <button
        aria-label="Open menu"
        className="nav-hamburger"
        onClick={() => setMenuOpen((o) => !o)}
      >
        ☰
      </button>

      {menuOpen && (
        <div className="sidebar">
          <button
            aria-label="Close menu"
            className="close-btn"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
          <a href="/" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="/BlochSphere" onClick={() => setMenuOpen(false)}>
            Bloch Sphere
          </a>
          <a href="/circuit" onClick={() => setMenuOpen(false)}>
            Circuit Designer
          </a>
        </div>
      )}

      <style jsx>{`
        a.nav-link {
          color: #fff;
          font-weight: 500;
          text-decoration: none;
          font-size: 16px;
          transition: color 0.2s;
        }
        button.nav-hamburger {
          background: none;
          border: none;
          color: #ffc300;
          font-size: 28px;
          cursor: pointer;
          display: none;
        }

        @media (max-width: 700px) {
          .nav-links {
            display: none !important;
          }
          .nav-hamburger {
            display: block !important;
          }
        }
        @media (min-width: 701px) {
          .nav-links .nav-link {
            margin-right: 24px;
          }
          .nav-hamburger {
            display: none !important;
          }
        }

        .sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 220px;
          height: 100vh;
          background: #232b3a;
          box-shadow: -2px 0 16px #0008;
          display: flex;
          flex-direction: column;
          padding: 2rem 1rem;
          z-index: 999;
        }
        .close-btn {
          background: none;
          border: none;
          color: #ffc300;
          font-size: 28px;
          align-self: flex-end;
          margin-bottom: 24px;
          cursor: pointer;
        }
        .sidebar a {
          margin-bottom: 18px;
          color: #fff;
          font-weight: 500;
          font-size: 18px;
          text-decoration: none;
          display: block;
        }
      `}</style>
    </nav>
  );
}
