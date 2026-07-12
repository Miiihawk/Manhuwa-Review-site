export default function SearchForm() {
  return (
    <form className="w-full">
      <label className="sr-only" htmlFor="search">
        Search manhwa
      </label>
      <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-3 backdrop-blur-md">
        <span className="text-white/45">⌕</span>
        <input
          id="search"
          type="search"
          placeholder="Search manhwa, genres, or authors"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        />
      </div>
    </form>
  );
}
