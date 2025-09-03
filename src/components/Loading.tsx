// components/Loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}
