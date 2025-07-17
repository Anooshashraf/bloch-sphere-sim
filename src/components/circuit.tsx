"use client";

import React, { useState } from "react";

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

const INIT_CIRCUIT = [
  ["H", "CX", "", "T"],
  ["", "CX", "Z", ""],
  ["", "CCX", "", "SWAP"],
];

export default function Circuit() {
  const [circuit, setCircuit] = useState(INIT_CIRCUIT);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  // Add a qubit (wire)
  const addQubit = () => {
    setCircuit([...circuit, Array(circuit[0]?.length || 4).fill("")]);
  };

  // Remove last qubit
  const removeQubit = () => {
    if (circuit.length > 1) setCircuit(circuit.slice(0, -1));
  };

  // Add a column (time step)
  const addColumn = () => {
    setCircuit(circuit.map((wire) => [...wire, ""]));
  };

  // Remove last column
  const removeColumn = () => {
    if (circuit[0].length > 1)
      setCircuit(circuit.map((wire) => wire.slice(0, -1)));
  };

  // Place gate in slot
  const placeGate = (qi: number, gj: number) => {
    if (!selectedGate) return;
    setCircuit((prev) =>
      prev.map((wire, i) =>
        wire.map((gate, j) => (i === qi && j === gj ? selectedGate : gate))
      )
    );
    setSelectedGate(null);
  };

  // Remove gate from slot
  const removeGate = (qi: number, gj: number) => {
    setCircuit((prev) =>
      prev.map((wire, i) =>
        wire.map((gate, j) => (i === qi && j === gj ? "" : gate))
      )
    );
  };

  // UI styles
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
        Click a gate, then click an empty slot to place it. Click a gate in the
        circuit to remove it.
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
            title={gate.name}
            onClick={() => setSelectedGate(gate.label)}
            style={{
              width: 44,
              height: 44,
              background:
                selectedGate === gate.label
                  ? "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)"
                  : "linear-gradient(90deg, #232b3a 60%, #181c24 100%)",
              border:
                selectedGate === gate.label
                  ? "2px solid #ffc300"
                  : "2px solid #4c6cff",
              borderRadius: 8,
              color: selectedGate === gate.label ? "#232b3a" : "#ffc300",
              fontWeight: 700,
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px #0006",
              userSelect: "none",
              transition: "all 0.2s",
            }}
          >
            {gate.label}
          </div>
        ))}
      </div>

      {/* Circuit Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <button style={buttonStyle} onClick={addQubit}>
          + Qubit
        </button>
        <button style={buttonStyle} onClick={removeQubit}>
          - Qubit
        </button>
        <button style={buttonStyle} onClick={addColumn}>
          + Step
        </button>
        <button style={buttonStyle} onClick={removeColumn}>
          - Step
        </button>
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
                alignItems: "center",
                flex: 1,
                position: "relative",
              }}
            >
              {/* Wire line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: 4,
                  background: "#444",
                  borderRadius: 2,
                  zIndex: 0,
                }}
              />
              {/* Gates */}
              <div
                style={{ display: "flex", gap: 8, width: "100%", zIndex: 1 }}
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
                      onClick={() => removeGate(i, j)}
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
                        background: selectedGate
                          ? "#333"
                          : "rgba(255,255,255,0.04)",
                        border: selectedGate
                          ? "2px dashed #ffc300"
                          : "1px dashed #4c6cff",
                        borderRadius: 8,
                        transition: "border 0.2s, background 0.2s",
                        cursor: selectedGate ? "pointer" : "default",
                      }}
                      onClick={() => selectedGate && placeGate(i, j)}
                    />
                  )
                )}
              </div>
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
