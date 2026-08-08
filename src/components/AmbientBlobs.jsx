export default function AmbientBlobs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="animate-blob absolute top-[18%] left-[12%] w-[420px] h-[420px] rounded-full bg-sky-500/10 blur-[72px]" />
      <div className="animate-blob2 absolute top-[28%] right-[8%] w-[360px] h-[360px] rounded-full bg-pink-500/10 blur-[64px]" />
      <div className="animate-blob3 absolute bottom-[22%] left-[38%] w-[500px] h-[260px] rounded-full bg-amber-400/8 blur-[80px]" />
    </div>
  )
}
