export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HolderIQ</h1>
        </div>

        <div className="hidden md:flex items-center gap-8 text-zinc-400">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#about" className="hover:text-white transition">
            About
          </a>

          <a href="#roadmap" className="hover:text-white transition">
            Roadmap
          </a>
        </div>

        <button className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-zinc-200 transition">
          Analyze Collection
        </button>
      </div>
    </nav>
  );
}