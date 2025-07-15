"use client";

import React, { useState } from "react";

// List of gates for the palette
const GATE_PALETTE = [
  { label: "X", name: "Pauli-X" },
  { label: "Y", name: "Pauli-Y" },
  { label: "Z", name: "Pauli-Z" },
  { label: "H", name: "Hadamard" },
  { label: "S", name: "Phase" },
  { label: "T", name: "T" },
  { label: "CX", name: "CNOT" },
  { label: "CCX", name: "Toffoli" },
  { label: "SWAP", name: "SWAP" },
  { label: "I", name: "Identity" },
];

const DEMO_CIRCUIT = [
  // Each array is a qubit wire, each string is a gate or ""
  ["H", "CX", "", "T"],
  ["", "CX", "Z", ""],
  ["", "CCX", "", "SWAP"],
];

export default function Circuit() {
  // Modern UI styles
  const cardStyle: React.CSSProperties = {
    background: "rgba(24,28,36,0.98)",
    borderRadius: 18,
    boxShadow: "0 4px 32px #0008",
    padding: 24,
    color: "#fff",
    width: 700,
    margin: "32px auto",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #4c6cff 0%, #0077ff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 2px 8px #0004",
    transition: "background 0.2s, transform 0.2s",
    marginRight: 12,
  };

  // For demo, not interactive yet
  const [circuit] = useState(DEMO_CIRCUIT);

  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: "center", letterSpacing: 1, marginBottom: 12 }}>
        <span style={{ color: "#4c6cff" }}>Quantum Circuit Designer</span>
      </h2>
      <div
        style={{
          textAlign: "center",
          color: "#aaa",
          fontSize: 16,
          marginBottom: 16,
        }}
      >
        Drag gates from the palette to build your quantum circuit.
      </div>

      {/* Gate Palette */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        {GATE_PALETTE.map((gate) => (
          <div
            key={gate.label}
            draggable
            title={gate.name}
            style={{
              width: 44,
              height: 44,
              background: "linear-gradient(90deg, #232b3a 60%, #181c24 100%)",
              border: "2px solid #4c6cff",
              borderRadius: 8,
              color: "#ffc300",
              fontWeight: 700,
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              boxShadow: "0 2px 8px #0006",
              userSelect: "none",
            }}
          >
            {gate.label}
          </div>
        ))}
      </div>

      {/* Demo Circuit */}
      <div
        style={{
          background: "#232b3a",
          borderRadius: 12,
          padding: 24,
          margin: "0 auto 16px auto",
          minHeight: 120,
          boxShadow: "0 2px 8px #0004",
          overflowX: "auto",
        }}
      >
        {/* {circuit.map((wire, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 18,
              minHeight: 44,
            }}
          >
            <span
              style={{
                color: "#aaa",
                fontWeight: 600,
                marginRight: 10,
                fontSize: 16,
                minWidth: 32,
                display: "inline-block",
              }}
            >
              q{i}
            </span>
            <div
              style={{
                height: 4,
                background: "#444",
                flex: 1,
                marginRight: 10,
                borderRadius: 2,
                position: "relative",
                top: 0,
              }}
            />
            {wire.map((gate, j) =>
              gate ? (
                <div
                  key={j}
                  style={{
                    width: 44,
                    height: 44,
                    background:
                      "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
                    border: "2px solid #fff",
                    borderRadius: 8,
                    color: "#232b3a",
                    fontWeight: 700,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: -22,
                    zIndex: 2,
                    boxShadow: "0 2px 8px #0006",
                  }}
                  title={gate}
                >
                  {gate}
                </div>
              ) : (
                <div
                  key={j}
                  style={{
                    width: 44,
                    height: 44,
                    marginLeft: -22,
                    background: "transparent",
                  }}
                />
              )
            )}
          </div> */}
        {/* ))} */}

        {circuit.map((wire, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 18,
              minHeight: 44,
            }}
          >
            <span
              style={{
                color: "#aaa",
                fontWeight: 600,
                marginRight: 10,
                fontSize: 16,
                minWidth: 32,
                display: "inline-block",
              }}
            >
              q{i}
            </span>
            <div
              style={{
                display: "flex",
                gap: 8, // space between gates
                alignItems: "center",
                flex: 1,
              }}
            >
              {wire.map((gate, j) =>
                gate ? (
                  <div
                    key={j}
                    style={{
                      width: 44,
                      height: 44,
                      background:
                        "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
                      border: "2px solid #fff",
                      borderRadius: 8,
                      color: "#232b3a",
                      fontWeight: 700,
                      fontSize: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px #0006",
                      transition: "box-shadow 0.2s, border 0.2s",
                      cursor: "pointer",
                    }}
                    title={gate}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 0 0 4px #ffc30088";
                      (e.currentTarget as HTMLDivElement).style.border =
                        "2px solid #ffc300";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 2px 8px #0006";
                      (e.currentTarget as HTMLDivElement).style.border =
                        "2px solid #fff";
                    }}
                  >
                    {gate}
                  </div>
                ) : (
                  <div
                    key={j}
                    style={{
                      width: 44,
                      height: 44,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px dashed #4c6cff",
                      borderRadius: 8,
                      transition: "border 0.2s, background 0.2s",
                    }}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>
        All major gates: Pauli-X, Y, Z, Hadamard, Phase, T, CNOT, Toffoli, SWAP,
        Identity.
      </div>
    </div>
  );
}
