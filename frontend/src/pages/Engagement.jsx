import { useEffect, useState } from "react";
import {
  Award,
  Coins,
  Crown,
  Gem,
  Heart,
  Radio,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";
const tokenPacks = [
  { id: "starter", label: "Starter", tokens: 500, price: "$4.99" },
  { id: "creator", label: "Creator", tokens: 1500, price: "$12.99" },
  { id: "champion", label: "Champion", tokens: 4000, price: "$29.99" },
];

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

const trophyColors = {
  wood: "#a66a3f",
  copper: "#c47b55",
  bronze: "#c99a43",
  silver: "#b8c7d9",
  gold: "#f5c451",
  platinum: "#8ee6df",
  diamond: "#9bc7ff",
};

function Engagement() {
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setData(await request("/engagement"));
    } catch (error) {
      setNotice(error.message);
    }
  };

  useEffect(() => {
    let cancelled = false;
    request("/engagement")
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((error) => {
        if (!cancelled) setNotice(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const act = async (path, options = {}) => {
    try {
      setBusy(true);
      const result = await request(path, options);
      setNotice(result.message || "Updated");
      await load();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (!data) return <div className="flex min-h-[60vh] items-center justify-center text-slate-400">Loading live studio...</div>;

  const { channel, profile = {}, missions = [], storeItems = [] } = data;
  const completed = new Set((profile.completedMissions || []).map((item) => item.missionId));
  const progress = Math.min(100, ((profile.xp || 0) % 500) / 5);

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300"><Radio size={15} /> Viewer rewards</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Live Studio</h1>
          <p className="mt-2 max-w-2xl text-slate-400">Turn every watch, like, and challenge into a reason to come back.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100"><Coins size={18} /> {profile.tokens || 0} tokens</div>
      </div>

      {notice && <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{notice}</div>}

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.55fr]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#121b2c] p-7 shadow-2xl shadow-cyan-950/30">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-300"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400" /> Live now</div><h2 className="max-w-xl text-3xl font-black text-white">{channel.title}</h2><p className="mt-2 text-slate-400">Hosted by {channel.hostName} · {channel.category}</p></div>
            <div className="flex gap-3 text-right"><div><p className="text-2xl font-black text-white">{channel.viewers.toLocaleString()}</p><p className="text-xs uppercase tracking-wider text-slate-500">viewers</p></div><div><p className="text-2xl font-black text-white">{channel.likes.toLocaleString()}</p><p className="text-xs uppercase tracking-wider text-slate-500">likes</p></div></div>
          </div>
          <div className="relative mt-10 flex min-h-44 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#243d58] via-[#15283b] to-[#0d1423]"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(120deg, transparent 35%, rgba(103,232,249,.22) 36%, transparent 37%), linear-gradient(25deg, transparent 45%, rgba(245,196,81,.16) 46%, transparent 47%)", backgroundSize: "90px 90px" }} /><Sparkles className="relative h-14 w-14 text-cyan-200" /></div>
          <button disabled={busy} onClick={() => act("/engagement/channel/like", { method: "POST" })} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"><Heart size={18} fill="currentColor" /> Like the channel</button>
          <div className="mt-3 flex gap-2"><button disabled={busy} onClick={() => act("/engagement/channel/gift", { method: "POST", body: JSON.stringify({ amount: 50 }) })} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-300/20 disabled:opacity-50"><Coins size={16} /> Gift 50</button><button disabled={busy} onClick={() => act("/engagement/channel/gift", { method: "POST", body: JSON.stringify({ amount: 250 }) })} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-300/20 disabled:opacity-50"><Sparkles size={16} /> Gift 250</button></div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Your level</p><p className="mt-1 text-4xl font-black text-white">{profile.level || 1}</p></div><div className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-300/15 text-amber-300"><Zap size={28} /></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-cyan-300" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>{profile.xp || 0} XP</span><span>{Math.max(0, 500 - ((profile.xp || 0) % 500))} to next level</span></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-black/20 p-3"><p className="text-xs text-slate-500">Points</p><p className="mt-1 text-xl font-bold text-white">{profile.points || 0}</p></div><div className="rounded-xl bg-black/20 p-3"><p className="text-xs text-slate-500">Trophies</p><p className="mt-1 text-xl font-bold text-white">{(profile.trophies || []).length}</p></div></div></div>
      </section>

      <section><div className="mb-4 flex items-center gap-3"><Target className="text-amber-300" /><div><h2 className="text-xl font-bold text-white">Missions & challenges</h2><p className="text-sm text-slate-500">Complete a mission to earn tokens, XP, and a trophy.</p></div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{missions.map((mission) => <div key={mission.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-start justify-between gap-3"><div className="rounded-xl bg-amber-300/10 p-2 text-amber-300"><Award size={18} /></div><span className="text-xs font-bold uppercase tracking-wider" style={{ color: trophyColors[mission.trophy] }}>{mission.trophy}</span></div><h3 className="mt-5 font-bold text-white">{mission.title}</h3><p className="mt-2 min-h-10 text-sm text-slate-400">{mission.description}</p><div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>+{mission.reward} pts</span><span>+{mission.xp} XP</span></div><button disabled={busy || completed.has(mission.id)} onClick={() => act(`/engagement/missions/${mission.id}/complete`, { method: "POST" })} className="mt-4 w-full rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-amber-300/40 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50">{completed.has(mission.id) ? "Completed" : "Claim reward"}</button></div>)}</div></section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><div className="flex items-center gap-3"><ShoppingBag className="text-cyan-300" /><div><h2 className="text-xl font-bold text-white">Token shop</h2><p className="text-sm text-slate-500">Top up your balance for gifts and cosmetics.</p></div></div><div className="mt-5 space-y-3">{tokenPacks.map((pack) => <button key={pack.id} disabled={busy} onClick={() => act("/engagement/tokens/purchase", { method: "POST", body: JSON.stringify({ pack: pack.id }) })} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/10 p-4 text-left transition hover:border-cyan-300/40"><span><span className="block font-semibold text-white">{pack.label}</span><span className="text-xs text-slate-500">{pack.tokens.toLocaleString()} tokens</span></span><span className="font-bold text-cyan-200">{pack.price}</span></button>)}</div></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><div className="flex items-center gap-3"><Crown className="text-amber-300" /><div><h2 className="text-xl font-bold text-white">Profile cosmetics</h2><p className="text-sm text-slate-500">3D-inspired items that show beside your viewer identity.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{storeItems.map((item) => <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827] p-4"><div className="mb-4 grid h-24 place-items-center rounded-xl bg-gradient-to-br from-white/10 to-black/20" style={{ color: trophyColors[item.accent] || "#8ee6df" }}><div className="drop-shadow-[0_10px_8px_rgba(0,0,0,.5)]">{item.type === "avatar" ? <Crown size={50} /> : item.type === "reaction" ? <Gem size={50} /> : item.type === "frame" ? <Sparkles size={50} /> : <Trophy size={50} />}</div></div><h3 className="font-bold text-white">{item.name}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p><button disabled={busy || (profile.ownedItems || []).some((owned) => owned.itemId === item.id)} onClick={() => act(`/engagement/store/${item.id}/purchase`, { method: "POST" })} className="mt-4 flex w-full items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-50"><span>{(profile.ownedItems || []).some((owned) => owned.itemId === item.id) ? "Owned" : "Apply to profile"}</span><span className="flex items-center gap-1 text-amber-200"><Coins size={14} />{item.price}</span></button></div>)}</div></div></section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><div className="flex items-center gap-3"><Trophy className="text-amber-300" /><h2 className="text-xl font-bold text-white">Trophy cabinet</h2></div><div className="mt-5 flex flex-wrap gap-4">{["wood", "copper", "bronze", "silver", "gold", "platinum", "diamond"].map((tier) => <div key={tier} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm capitalize" style={{ color: trophyColors[tier] }}><Trophy size={16} />{tier}</div>)}</div></section>
    </div>
  );
}

export default Engagement;