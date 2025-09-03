// components/notes/BlochNotes.tsx
export default function BlochNotes() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        About the Bloch Sphere
      </h2>

      <div className="prose prose-indigo max-w-none">
        <p>
          The Bloch sphere is a geometric representation of a pure quantum state
          of a two-level system (qubit).
        </p>

        <h3 className="font-semibold text-gray-700 mt-4">Key Points:</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
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

        <h3 className="font-semibold text-gray-700 mt-4">
          Mathematical Representation:
        </h3>
        <p className="text-gray-600">
          Any qubit state can be written as:
          <br />
          |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩
        </p>

        <h3 className="font-semibold text-gray-700 mt-4">Common States:</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
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
