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
  { label: "SW", name: "SWAP" },
  { label: "I", name: "Identity" },
  { label: "M", name: "Measure" },
];

const INIT_CIRCUIT = [
  ["H", "CX", "", "T"],
  ["", "CX", "Z", ""],
  ["", "CCX", "", "SW"],
];

export default function Circuit() {
  const [circuit, setCircuit] = useState(INIT_CIRCUIT);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  const [initialStates, setInitialStates] = useState<string[]>(
    Array(circuit.length).fill("|0⟩")
  );
  const [showEquations, setShowEquations] = useState(true);

  const addQubit = () => {
    setCircuit([...circuit, Array(circuit[0]?.length || 4).fill("")]);
    setInitialStates([...initialStates, "|0⟩"]);
  };

  const removeQubit = () => {
    if (circuit.length > 1) {
      setCircuit(circuit.slice(0, -1));
      setInitialStates(initialStates.slice(0, -1));
    }
  };

  const addColumn = () => {
    setCircuit(circuit.map((wire) => [...wire, ""]));
  };

  const removeColumn = () => {
    if (circuit[0].length > 1)
      setCircuit(circuit.map((wire) => wire.slice(0, -1)));
  };

  const placeGate = (qi: number, gj: number) => {
    if (!selectedGate) return;
    setCircuit((prev) =>
      prev.map((wire, i) =>
        wire.map((gate, j) => (i === qi && j === gj ? selectedGate : gate))
      )
    );
    setSelectedGate(null);
  };

  const removeGate = (qi: number, gj: number) => {
    setCircuit((prev) =>
      prev.map((wire, i) =>
        wire.map((gate, j) => (i === qi && j === gj ? "" : gate))
      )
    );
  };

  const updateInitialState = (index: number, value: string) => {
    const newStates = [...initialStates];
    newStates[index] = value;
    setInitialStates(newStates);
  };

  const calculateFinalState = () => {
    // This is a simplified representation - in a real app you'd use a quantum simulator
    let finalStates = initialStates.map((state) => state);

    // Very basic state transformation simulation
    circuit.forEach((wire, qi) => {
      wire.forEach((gate) => {
        if (gate === "H") {
          finalStates[qi] = `(${finalStates[qi].replace("⟩", "⟩ + |1⟩")})/√2`;
        } else if (gate === "X") {
          finalStates[qi] = finalStates[qi].replace("0", "1").replace("1", "0");
        } else if (gate === "M") {
          finalStates[qi] = `Measured: ${Math.random() > 0.5 ? "|1⟩" : "|0⟩"}`;
        }
        // Add more gate transformations as needed
      });
    });

    return finalStates;
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(24,28,36,0.98)",
    borderRadius: 18,
    boxShadow: "0 4px 32px #0008",
    padding: 24,
    color: "#fff",
    width: "100%",
    maxWidth: 700,
    margin: "32px auto",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box",
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

  const toggleButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: showEquations
      ? "linear-gradient(90deg, #4c6cff 0%, #0077ff 100%)"
      : "linear-gradient(90deg, #232b3a 0%, #181c24 100%)",
  };

  const finalStates = calculateFinalState();

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

      {/* Initial States Input */}
      {showEquations && (
        <div
          style={{
            background: "#232b3a",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
            boxShadow: "0 2px 8px #0004",
          }}
        >
          <div style={{ color: "#4c6cff", fontWeight: 600, marginBottom: 8 }}>
            Initial Qubit States:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {initialStates.map((state, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 6, color: "#aaa" }}>q{i}:</span>
                <select
                  value={state}
                  onChange={(e) => updateInitialState(i, e.target.value)}
                  style={{
                    background: "#181c24",
                    color: "#fff",
                    border: "1px solid #4c6cff",
                    borderRadius: 6,
                    padding: "4px 8px",
                  }}
                >
                  <option value="|0⟩">|0⟩</option>
                  <option value="|1⟩">|1⟩</option>
                  <option value="|+⟩">|+⟩ (|0⟩ + |1⟩)/√2</option>
                  <option value="|-⟩">|-⟩ (|0⟩ - |1⟩)/√2</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

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
            draggable
            onDragStart={() => setDraggedGate(gate.label)}
            onDragEnd={() => setDraggedGate(null)}
            onClick={() => setSelectedGate(gate.label)}
            style={{
              width: 44,
              height: 44,
              background:
                selectedGate === gate.label || draggedGate === gate.label
                  ? "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)"
                  : "linear-gradient(90deg, #232b3a 60%, #181c24 100%)",
              border:
                selectedGate === gate.label || draggedGate === gate.label
                  ? "2px solid #ffc300"
                  : "2px solid #4c6cff",
              borderRadius: 8,
              color:
                selectedGate === gate.label || draggedGate === gate.label
                  ? "#232b3a"
                  : "#ffc300",
              fontWeight: 700,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              boxShadow: "0 2px 8px #0006",
              userSelect: "none",
              transition: "all 0.2s",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
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
          flexWrap: "wrap",
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
        <button
          style={toggleButtonStyle}
          onClick={() => setShowEquations(!showEquations)}
        >
          {showEquations ? "Hide States" : "Show States"}
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
          width: "100%",
          maxWidth: "100vw",
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
                minWidth: 0,
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
                style={{
                  display: "flex",
                  gap: 8,
                  width: "100%",
                  zIndex: 1,
                  minWidth: 0,
                  overflowX: "auto",
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
                          gate === "M"
                            ? "linear-gradient(90deg, #00c853 0%, #64dd17 100%)"
                            : "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
                        border: "2px solid #fff",
                        borderRadius: 8,
                        color: "#232b3a",
                        fontWeight: 500,
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px #0006",
                        transition: "box-shadow 0.2s, border 0.2s",
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={
                        GATE_PALETTE.find((g) => g.label === gate)?.name || gate
                      }
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
                        background: draggedGate
                          ? "#333"
                          : "rgba(255,255,255,0.04)",
                        border: draggedGate
                          ? "2px dashed #ffc300"
                          : "1px dashed #4c6cff",
                        borderRadius: 8,
                        transition: "border 0.2s, background 0.2s",
                        cursor: draggedGate ? "pointer" : "default",
                      }}
                      onClick={() => selectedGate && placeGate(i, j)}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={() => {
                        if (draggedGate) {
                          setCircuit((prev) =>
                            prev.map((wire, wi) =>
                              wire.map((g, ji) =>
                                wi === i && ji === j ? draggedGate : g
                              )
                            )
                          );
                          setDraggedGate(null);
                        }
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final States Display */}
      {showEquations && (
        <div
          style={{
            background: "#232b3a",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
            boxShadow: "0 2px 8px #0004",
          }}
        >
          <div style={{ color: "#4c6cff", fontWeight: 600, marginBottom: 8 }}>
            Final Qubit States:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {finalStates.map((state, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 6, color: "#aaa" }}>q{i}:</span>
                <span style={{ color: "#ffc300" }}>{state}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>
        All major gates: Pauli-X, Y, Z, Hadamard, Phase, T, CNOT, Toffoli, SWAP,
        Identity, Measure.
      </div>

      {/* Notes Section */}
      <div
        style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          alignItems: "stretch",
          marginTop: 24,
          flexWrap: "wrap",
        }}
      >
        {/* Gate Effects */}
        <div
          style={{
            background: "linear-gradient(120deg, #232b3a 80%, #2d3750 100%)",
            borderRadius: 12,
            padding: "18px 22px",
            color: "#fff",
            fontSize: 15,
            lineHeight: 1.7,
            minWidth: 220,
            flex: "1 1 220px",
            maxWidth: 340,
            border: "2px solid #4c6cff",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px #4c6cff22",
          }}
        >
          <strong style={{ color: "#4c6cff" }}>Gate Effects:</strong>
          <ul style={{ margin: "10px 0 0 18px", padding: 0 }}>
            <li>
              <b style={{ color: "#ffc300" }}>X (Pauli-X):</b> Flips the qubit
              state (like a NOT gate).
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>Y, Z (Pauli-Y, Pauli-Z):</b>{" "}
              Rotate the qubit around Y or Z axis on the Bloch sphere.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>H (Hadamard):</b> Puts the qubit
              into superposition.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>S, T (Phase, T):</b> Add a phase
              to the qubit state.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>CX (CNOT):</b> Flips the target
              qubit if the control qubit is 1.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>CCX (Toffoli):</b> Flips the
              target qubit if both controls are 1.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>SW (SWAP):</b> Swaps the states of
              two qubits.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>I (Identity):</b> Does not change
              the qubit state.
            </li>
            <li>
              <b style={{ color: "#00c853" }}>M (Measure):</b> Collapses the
              qubit state to |0⟩ or |1⟩.
            </li>
          </ul>
        </div>
        {/* Manufacturing Notes */}
        <div
          style={{
            background: "linear-gradient(120deg, #2d2a1a 80%, #3a320f 100%)",
            borderRadius: 12,
            padding: "18px 22px",
            color: "#fff",
            fontSize: 15,
            lineHeight: 1.7,
            minWidth: 220,
            flex: "1 1 220px",
            maxWidth: 340,
            border: "2px solid #ffc300",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px #ffc30022",
          }}
        >
          <strong style={{ color: "#ffc300" }}>Manufacturing Notes:</strong>
          <ul style={{ margin: "10px 0 0 18px", padding: 0 }}>
            <li>
              Physical quantum circuits are built using superconducting qubits,
              trapped ions, or photonic systems.
            </li>
            <li>
              Each gate is implemented via precise control pulses or laser
              operations.
            </li>
            <li>
              Layout and connectivity are limited by hardware architecture.
            </li>
            <li>
              Noise and decoherence are major challenges; error correction is
              essential.
            </li>
            <li>
              Manufacturing requires ultra-low temperatures and advanced
              nanofabrication.
            </li>
            <li>
              Measurement is typically done via dispersive readout in
              superconducting qubits.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
