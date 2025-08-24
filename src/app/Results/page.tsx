// // // "use client";

// // // import { useRouter } from "next/navigation";
// // // import { ResultsNoSSR } from "@/components/ClientOnly";

// // // export default function ResultsPage({
// // //   searchParams,
// // // }: {
// // //   searchParams: { data?: string };
// // // }) {
// // //   const router = useRouter();

// // //   // Get results from query param (if you passed them as JSON string)
// // //   let results = null;
// // //   if (searchParams.data) {
// // //     try {
// // //       results = JSON.parse(searchParams.data);
// // //     } catch (e) {
// // //       console.error("Invalid results data", e);
// // //     }
// // //   }

// // //   return (
// // //     <div className="p-6">
// // //       <ResultsNoSSR results={results} onBack={() => router.back()} />
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useRouter, useSearchParams } from "next/navigation";
// // import { ResultsNoSSR } from "@/components/ClientOnly";

// // export default function ResultsPage() {
// //   const router = useRouter(); // ✅ add this
// //   const searchParams = useSearchParams();

// //   let results: any = null;
// //   const data = searchParams.get("data");
// //   if (data) {
// //     try {
// //       results = JSON.parse(data);
// //     } catch (e) {
// //       console.error("Invalid results data", e);
// //     }
// //   }

// //   return (
// //     <div className="p-6">
// //       {results ? (
// //         <ResultsNoSSR results={results} onBack={() => router.back()} />
// //       ) : (
// //         <p className="text-[#9aa0c7]">
// //           No results available. Run an algorithm first.
// //         </p>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import { useSearchParams } from "next/navigation";
// import ResultsPanel from "@/components/Results";

// export default function ResultsPage() {
//   const searchParams = useSearchParams();
//   const rawData = searchParams.get("data");

//   let parsed = null;
//   try {
//     parsed = rawData ? JSON.parse(decodeURIComponent(rawData)) : null;
//   } catch (e) {
//     console.error("Error parsing results data:", e);
//   }

//   return (
//     <div className="p-6">
//       <ResultsPanel results={parsed} onBack={() => history.back()} />
//     </div>
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");

  let parsedData: any = null;
  try {
    if (dataParam) {
      parsedData = JSON.parse(decodeURIComponent(dataParam));
    }
  } catch (err) {
    console.error("Failed to parse results data", err);
  }

  if (!parsedData) {
    return (
      <div className="p-6 text-red-400">
        No result data provided or failed to parse.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">
        Algorithm Results
      </h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Code</h3>
        <pre className="bg-[#1a1a2e] p-3 rounded text-sm whitespace-pre-wrap">
          {parsedData.code}
        </pre>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Counts</h3>
        <pre className="bg-[#1a1a2e] p-3 rounded text-sm whitespace-pre-wrap">
          {JSON.stringify(parsedData.counts, null, 2)}
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Explanation</h3>
        <p className="bg-[#1a1a2e] p-3 rounded text-sm whitespace-pre-wrap">
          {parsedData.explanation}
        </p>
      </div>
    </div>
  );
}
