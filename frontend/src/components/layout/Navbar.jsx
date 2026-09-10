import { Bell, Search, UserCircle } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#07090f]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="relative hidden w-full max-w-md sm:block">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder="Search inventory..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-xl border border-white/10 bg-white/[0.03] p-3 text-gray-400 hover:text-white">
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <UserCircle size={34} className="text-gray-400" />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">
              Administrator
            </p>

            <p className="text-xs text-gray-500">
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;