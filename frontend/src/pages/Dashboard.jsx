import { useEffect, useState } from "react";
import {
  Package,
  Tags,
  Truck,
  Users,
  AlertTriangle,
  XCircle,
  ArrowDownToLine,
  RefreshCw,
} from "lucide-react";

import { getDashboard } from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboard();

      setDashboard(data.dashboard);
      setMovements(data.recentMovements || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let cancelled = false;

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");

      if (!cancelled) {
        setDashboard(response.data.dashboard);
        setRecentMovements(response.data.recentMovements || []);
      }
    } catch (error) {
      if (!cancelled) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchDashboard();

  return () => {
    cancelled = true;
  };
}, []);

  const stats = dashboard
    ? [
        {
          title: "Total Products",
          value: dashboard.totalProducts,
          icon: Package,
        },
        {
          title: "Categories",
          value: dashboard.totalCategories,
          icon: Tags,
        },
        {
          title: "Suppliers",
          value: dashboard.totalSuppliers,
          icon: Truck,
        },
        {
          title: "Users",
          value: dashboard.totalUsers,
          icon: Users,
        },
        {
          title: "Low Stock",
          value: dashboard.lowStock,
          icon: AlertTriangle,
        },
        {
          title: "Out of Stock",
          value: dashboard.outOfStock,
          icon: XCircle,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <h2 className="font-semibold text-red-400">
          Failed to load dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error}
        </p>

        <button
          onClick={loadDashboard}
          className="mt-4 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-amber-400">
            INVENTORY OVERVIEW
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Monitor your inventory and stock activity.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-amber-400/30 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-amber-400/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3">
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent movements */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recent Stock Movements
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Latest inventory activity
            </p>
          </div>

          <ArrowDownToLine className="h-5 w-5 text-amber-400" />
        </div>

        {movements.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No stock movements yet.
          </div>
        ) : (
          <div className="space-y-3">
            {movements.map((movement) => (
              <div
                key={movement._id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-400/10 p-2">
                    <ArrowDownToLine className="h-4 w-4 text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {movement.product?.name || "Unknown product"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {movement.product?.sku || "No SKU"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">
                    +{movement.quantity}
                  </p>

                  <p className="text-xs text-slate-500">
                    {new Date(movement.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}