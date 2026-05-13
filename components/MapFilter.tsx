export function MapFilter({ filter, setFilter }: any) {
  return (
    <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-xl p-3 rounded-xl border border-white/10">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-transparent text-sm text-white outline-none"
      >
        <option>Seluruh Indonesia</option>
        <option>Kalimantan Timur</option>
        <option>Jawa Tengah</option>
      </select>
    </div>
  );
}