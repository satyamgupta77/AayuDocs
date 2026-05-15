export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <main className="flex-1 pt-24 pb-12">
        {children}
      </main>
    </div>
  );
}
