export default function ToolLoading() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-12">
      <div className="animate-pulse space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="h-16 w-16 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-5 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg max-w-full"></div>
        </div>

        {/* Dropzone Skeleton */}
        <div className="h-80 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700"></div>

        {/* Configuration skeleton */}
        <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    </div>
  );
}
