import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("@/components/HomeClient"), {
  ssr: false,
  loading: () => (
    <main className="pitch-grid min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass rounded-[32px] p-10 text-slate-200">Loading X Prophet Cup...</div>
      </div>
    </main>
  )
});

export default function Page() {
  return <HomeClient />;
}
