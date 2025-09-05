export default function BlochNotes() {
  return (
    <div className="bg-[#13131a] border border-[#24243a] p-6 rounded-2xl shadow-lg text-gray-300">
      <h2 className="text-2xl font-semibold text-[#ffc300] mb-4">
        About the Bloch Sphere
      </h2>

      <div className="space-y-4">
        <p>
          The Bloch sphere is a geometric representation of a pure quantum state
          of a two-level system (qubit).
        </p>

        <h3 className="text-lg font-semibold text-[#4c6cff]">Key Points:</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-400">
          <li>
            The north pole represents |0⟩ and the south pole represents |1⟩
          </li>
          <li>
            Points on the equator represent equal superpositions of |0⟩ and |1⟩
          </li>
          <li>
            The azimuthal angle (φ) represents the phase between |0⟩ and |1⟩
          </li>
          <li>
            The polar angle (θ) determines the probability of measuring |0⟩ or
            |1⟩
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-[#4c6cff]">
          Mathematical Representation:
        </h3>
        <p className="text-gray-400">
          Any qubit state can be written as:
          <br />
          <code className="bg-[#1d2233] text-[#ffc300] px-2 py-1 rounded-md">
            |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩
          </code>
        </p>

        <h3 className="text-lg font-semibold text-[#4c6cff]">Common States:</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-400">
          <li>|0⟩: θ=0°, φ=0°</li>
          <li>|1⟩: θ=180°, φ=0°</li>
          <li>|+⟩: θ=90°, φ=0°</li>
          <li>|-⟩: θ=90°, φ=180°</li>
          <li>|i⟩: θ=90°, φ=90°</li>
          <li>|-i⟩: θ=90°, φ=270°</li>
        </ul>
      </div>
    </div>
  );
}
