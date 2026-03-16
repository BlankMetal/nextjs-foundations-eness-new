// loading.tsx is a Next.js file convention.
// It automatically wraps the sibling page.tsx in a <Suspense> boundary,
// showing this component as the fallback during full-page navigations.
export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse p-8">
      <div className="mb-2 h-8 w-48 rounded bg-gray-200" />
      <div className="mb-6 h-4 w-32 rounded bg-gray-200" />
      <div className="mb-6 flex gap-4">
        <div className="h-6 w-20 rounded bg-gray-200" />
        <div className="h-6 w-20 rounded bg-gray-200" />
        <div className="h-6 w-20 rounded bg-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}
