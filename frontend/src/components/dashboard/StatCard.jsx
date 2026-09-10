function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-blue-500/30 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          <Icon size={21} />
        </div>
      </div>

      {description && (
        <p className="mt-4 text-xs text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;