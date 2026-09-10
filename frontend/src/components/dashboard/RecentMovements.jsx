import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

function RecentMovements({ movements = [] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <div>
          <h2 className="font-semibold text-white">
            Recent Stock Movements
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Latest inventory activity
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {movements.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No recent movements.
          </div>
        ) : (
          movements.map((movement) => {
            const stockIn = movement.type === "stock-in";

            return (
              <div
                key={movement._id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-xl p-2 ${
                      stockIn
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {stockIn ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {movement.product?.name || "Unknown product"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {movement.performedBy?.name || "Unknown user"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {stockIn ? "+" : "-"}
                    {movement.quantity}
                  </p>

                  <p className="text-xs text-gray-500">
                    {movement.type}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentMovements;