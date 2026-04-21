'use client'

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  Zap, RefreshCw, Shield, Search, Copy, Check, X,
  ExternalLink, Menu, XIcon, Clock, ArrowRight, Code2,
  Sword, Wheat, Wrench, Star
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

const LOGO_URL = "https://i.postimg.cc/pLjwZ938/114A3ACE-CAC7-45B3-AB50-FDF67970EB2A.png"

const UNIVERSE_IDS: Record<string, number> = {
  "Combat Warriors":  2699330604,
  "Blox Fruits":      2753915549,
  "Arsenal":          286090429,
  "Pet Simulator 99": 8737899170,
  "DOORS":            6516141723,
  "Brookhaven RP":    4924922222,
}

const SCRIPTS = [
  {
    id: 1, name: "Combat Warriors Auto-Farm", game: "Combat Warriors",
    category: "Combat", updated: "Apr 18, 2026", tag: "HOT", tagColor: "#f43f5e",
    code: `-- Combat Warriors Auto-Farm v3.2\nlocal Players = game:GetService("Players")\nlocal LocalPlayer = Players.LocalPlayer\n\nlocal config = {\n    autoFarm = true,\n    autoCollect = true,\n    safeMode = true\n}\n\nprint("[XZX HUB] Loaded")`
  },
  {
    id: 2, name: "Blox Fruits Devil Fruit Sniper", game: "Blox Fruits",
    category: "Farming", updated: "Apr 17, 2026", tag: "NEW", tagColor: "#22c55e",
    code: `-- Blox Fruits Devil Fruit Sniper v1.9\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\n\nlocal function snipeFruit()\n    -- snipe logic\nend\n\nprint("[XZX HUB] Sniper Active")`
  },
  {
    id: 3, name: "Arsenal Aimbot & ESP", game: "Arsenal",
    category: "Combat", updated: "Apr 16, 2026", tag: "HOT", tagColor: "#f43f5e",
    code: `-- Arsenal ESP v2.5\nlocal RunService = game:GetService("RunService")\n\nlocal ESP = { Enabled = true, BoxESP = true, NameESP = true }\n\nprint("[XZX HUB] ESP Loaded")`
  },
  {
    id: 4, name: "Pet Simulator Auto Collect", game: "Pet Simulator 99",
    category: "Farming", updated: "Apr 15, 2026", tag: "UPDATED", tagColor: "#f59e0b",
    code: `-- Pet Sim 99 Auto Collect v4.1\nlocal TweenService = game:GetService("TweenService")\n\nlocal function autoCollect()\n    -- collect logic\nend\n\nprint("[XZX HUB] Auto Collect On")`
  },
  {
    id: 5, name: "Doors Entity ESP & Skip", game: "DOORS",
    category: "Utility", updated: "Apr 14, 2026", tag: "NEW", tagColor: "#22c55e",
    code: `-- DOORS Entity Skip v1.2\nlocal Players = game:GetService("Players")\n\nlocal config = { EntityESP = true, AutoSkip = true }\n\nprint("[XZX HUB] DOORS Script On")`
  },
  {
    id: 6, name: "Brookhaven Utility Panel", game: "Brookhaven RP",
    category: "Utility", updated: "Apr 12, 2026", tag: "STABLE", tagColor: "#818cf8",
    code: `-- Brookhaven Utility Panel v3.0\nlocal StarterGui = game:GetService("StarterGui")\n\nlocal utils = { NoClip = false, Speed = 16, Fly = false }\n\nprint("[XZX HUB] Panel Ready")`
  },
]

const CHANGELOG = [
  {
    version: "v2.5.0", date: "April 18, 2026", label: "MAJOR", labelColor: "#818cf8",
    changes: [
      "Combat Warriors auto-farm — new anti-detection pass included",
      "UI overlay rebuilt, way less intrusive now",
      "XZX Executor v4 compat working",
      "Farming scripts ~40% faster across the board",
    ]
  },
  {
    version: "v2.4.3", date: "April 14, 2026", label: "PATCH", labelColor: "#22c55e",
    changes: [
      "Fixed Blox Fruits crash on server hop",
      "Arsenal ESP rendering bug on low-end devices",
      "Mobile text rendering cleanup",
    ]
  },
  {
    version: "v2.4.0", date: "April 9, 2026", label: "UPDATE", labelColor: "#818cf8",
    changes: [
      "DOORS entity ESP fully rewritten",
      "Brookhaven utility panel added (community request)",
      "Script loader 60% faster",
      "New hub site live",
    ]
  },
  {
    version: "v2.3.1", date: "March 28, 2026", label: "PATCH", labelColor: "#22c55e",
    changes: [
      "Pet Sim 99 updated for latest patch",
      "Memory leak fix in long farm sessions",
    ]
  },
  {
    version: "v2.3.0", date: "March 20, 2026", label: "UPDATE", labelColor: "#818cf8",
    changes: [
      "Script vault system launched",
      "Version badges + update timestamps added",
      "Discord bot now pings on script updates",
      "5 new scripts across combat and farming",
    ]
  },
]

const CATEGORIES = ["All", "Combat", "Farming", "Utility"]

// ── Roblox thumbnail via roproxy (CORS-friendly mirror) ───────────────────────
function GameThumbnail({ game, className = "" }: { game: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null)
  const [err, setErr] = useState(false)
  const uid = UNIVERSE_IDS[game]

  useEffect(() => {
    if (!uid) { setErr(true); return }
    fetch(
      `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${uid}&size=150x150&format=Png&isCircular=false`
    )
      .then(r => r.json())
      .then(d => {
        const img = d?.data?.[0]?.imageUrl
        if (img) setUrl(img)
        else setErr(true)
      })
      .catch(() => setErr(true))
  }, [uid])

  if (err || !url) {
    return (
      <div className={`flex items-center justify-center bg-[#0d0d14] ${className}`}>
        <span className="text-[11px] font-bold text-white/20 uppercase tracking-widest select-none">
          {game.split(" ").map((w: string) => w[0]).join("").slice(0, 3)}
        </span>
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={game}
      onError={() => setErr(true)}
      className={`object-cover ${className}`}
    />
  )
}

// ── Particles ──────────────────────────────────────────────────────────────────
function ParticleField() {
  const count = 1400
  const ref = useRef<THREE.Points>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const clock = useRef(new THREE.Clock())
  const buf = useRef({
    pos: new Float32Array(count * 3),
    col: new Float32Array(count * 3),
  })

  useEffect(() => {
    const mv = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", mv)
    return () => window.removeEventListener("mousemove", mv)
  }, [])

  useEffect(() => {
    const { pos, col } = buf.current
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      pos[i*3]   = Math.sin(p)*Math.cos(t)*r
      pos[i*3+1] = Math.sin(p)*Math.sin(t)*r
      pos[i*3+2] = Math.cos(p)*r
      const isAccent = Math.random() < 0.1
      const b = 0.35 + Math.random() * 0.45
      col[i*3]   = isAccent ? 0.55 : b
      col[i*3+1] = isAccent ? 0.35 : b
      col[i*3+2] = isAccent ? 0.95 : b
    }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const t = clock.current.getElapsedTime()
    const pa = ref.current.geometry.attributes.position
    const pos = pa.array as Float32Array
    const m = mouse.current
    for (let i = 0; i < count; i++) {
      const i3 = i*3
      const x = pos[i3], y = pos[i3+1], z = pos[i3+2]
      pos[i3]   += (x + m.x*1.5)*0.001
      pos[i3+1] += (y + m.y*1.5)*0.001
      pos[i3+2] += (z + Math.sin(t*0.2+x)*0.1 - z)*0.001
      if (Math.sqrt(x*x+y*y+z*z) > 8) {
        pos[i3]*=0.99; pos[i3+1]*=0.99; pos[i3+2]*=0.99
      }
    }
    pa.needsUpdate = true
    ref.current.rotation.y += 0.0004
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={buf.current.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={buf.current.col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.024}
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.75}
      />
    </points>
  )
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links: [string, string][] = [["home","Home"],["scripts","Scripts"],["updates","Updates"]]

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-5"
    >
      <div className={`mx-auto max-w-6xl mt-3 rounded-2xl transition-all duration-300 ${
        scrolled
          ? "bg-[#07070f]/85 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/40"
          : "bg-[#07070f]/40 backdrop-blur-md border border-white/5"
      }`}>
        <div className="flex items-center justify-between px-5 py-3.5">

          <button onClick={() => setPage("home")} className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-violet-500/40 transition-all">
              <img src={LOGO_URL} alt="XZX" className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-[17px] font-bold tracking-wide text-white">
              XZX <span className="text-white/30">HUB</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map(([p, label]) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`relative px-4 py-1.5 rounded-lg font-display font-semibold text-[13px] tracking-wide transition-colors ${
                  page === p ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {label}
                {page === p && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/8 -z-10"
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage("scripts")}
            className="hidden md:flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-display font-bold text-[12px] tracking-widest uppercase px-4 py-2 rounded-lg transition-colors"
          >
            Get Scripts
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white/60 hover:text-white transition-colors"
          >
            {open ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/8 overflow-hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {links.map(([p, label]) => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); setOpen(false) }}
                    className={`text-left px-3 py-2 rounded-lg font-display font-semibold text-[13px] tracking-wide transition-colors ${
                      page === p ? "text-white bg-white/8" : "text-white/40"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

// ── Home ───────────────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <Suspense fallback={null}><ParticleField /></Suspense>
          </Canvas>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#07070f]/70 via-[#07070f]/30 to-[#07070f]" />
        <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, #07070f 100%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display text-[11px] font-semibold tracking-widest text-white/50 uppercase">
              All scripts undetected — updated daily
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex justify-center mb-7"
          >
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-violet-900/30">
              <img src={LOGO_URL} alt="XZX HUB" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[clamp(48px,9vw,96px)] font-bold leading-none tracking-tight mb-5"
          >
            <span className="text-white">XZX HUB</span>
            <br />
            <span className="text-white/20 text-[clamp(22px,4vw,44px)] font-medium tracking-normal">
              the scripts actually work.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/40 text-[15px] max-w-lg mx-auto mb-10 leading-relaxed font-display"
          >
            Updated within hours of patches. Clean loader. No bloat. Just the scripts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-wrap gap-3 justify-center mb-16"
          >
            <button
              onClick={() => setPage("scripts")}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-display font-bold text-[13px] tracking-wider px-7 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-900/40 group"
            >
              View Scripts <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 font-display font-bold text-[13px] tracking-wider px-7 py-3 rounded-xl transition-all"
            >
              <ExternalLink size={14} /> Discord
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="flex flex-wrap gap-10 justify-center"
          >
            {[["50+","Scripts"],["< 24h","Patch fix"],["10k+","Users"],["6","Games"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-2xl font-bold text-white">{v}</div>
                <div className="font-display text-[10px] tracking-widest text-white/25 uppercase mt-0.5">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-14 items-center"
        >
          <div>
            <span className="font-display text-[11px] tracking-widest text-violet-400 uppercase border border-violet-500/20 px-3 py-1 rounded-full">
              About
            </span>
            <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold text-white mt-5 mb-5 leading-tight">
              Made by players,<br />
              <span className="text-white/25">kept running for them.</span>
            </h2>
            <p className="text-white/40 text-[15px] mb-4 leading-relaxed font-display">
              We've been at this for a while. Scripts get updated fast, the hub stays clean, and stuff actually gets tested before it goes live.
            </p>
            <p className="text-white/40 text-[15px] leading-relaxed font-display">
              No inflated numbers. No fake uptime stats. Just {SCRIPTS.length} scripts that do what they say.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Code2 size={18} />, label: "Clean Code",    sub: "No bloat. Lightweight loader." },
              { icon: <Shield size={18} />, label: "Undetected",   sub: "Passes detection on every release." },
              { icon: <RefreshCw size={18} />, label: "Fast Updates", sub: "Most patches fixed in under a day." },
              { icon: <Star size={18} />, label: "Tested Live",    sub: "Every script runs before it ships." },
            ].map(({ icon, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-violet-500/20 hover:bg-white/[0.05] transition-all"
              >
                <div className="text-violet-400 mb-3">{icon}</div>
                <div className="font-display font-bold text-[14px] text-white mb-1">{label}</div>
                <div className="font-display text-[12px] text-white/30">{sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Why */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-display text-[11px] tracking-widest text-violet-400 uppercase border border-violet-500/20 px-3 py-1 rounded-full">
            Why XZX
          </span>
          <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold text-white mt-5">
            What actually makes it good.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: <Zap size={26} />,       t: "Fast Execution",    d: "Loads fast, runs clean. The loader stays out of the way and doesn't spike your frame time." },
            { icon: <RefreshCw size={26} />, t: "Patch-Proof Updates", d: "We watch for game patches constantly. Most scripts are back up within a few hours of a break." },
            { icon: <Shield size={26} />,    t: "Undetected",         d: "Anti-detection is built into every script. Nothing gets pushed until it clears our checks." },
          ].map(({ icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-7 hover:border-violet-500/20 hover:bg-white/[0.05] transition-all group"
            >
              <div className="w-11 h-11 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 mb-5 group-hover:bg-violet-500/15 transition-colors">
                {icon}
              </div>
              <h3 className="font-display text-[18px] font-bold text-white mb-2">{t}</h3>
              <p className="font-display text-[13px] text-white/35 leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-white/8 bg-white/[0.025] backdrop-blur-sm p-14 text-center overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
          </div>
          <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold text-white mb-4">
            Ready? <span className="text-white/25">Browse the vault.</span>
          </h2>
          <p className="font-display text-[15px] text-white/35 mb-8">
            All scripts are live and tested right now.
          </p>
          <button
            onClick={() => setPage("scripts")}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-display font-bold text-[13px] tracking-wider px-9 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-violet-900/40 group"
          >
            Open Scripts <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </section>
    </div>
  )
}

// ── Scripts ────────────────────────────────────────────────────────────────────
function ScriptsPage() {
  const [search, setSearch] = useState("")
  const [cat, setCat]       = useState("All")
  const [modal, setModal]   = useState<typeof SCRIPTS[0] | null>(null)
  const [copied, setCopied] = useState(false)

  const catIcons: Record<string, JSX.Element> = {
    Combat:  <Sword size={11} />,
    Farming: <Wheat size={11} />,
    Utility: <Wrench size={11} />,
  }

  const filtered = SCRIPTS.filter(s => {
    const okCat    = cat === "All" || s.category === cat
    const okSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                     s.game.toLowerCase().includes(search.toLowerCase())
    return okCat && okSearch
  })

  const copy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <span className="font-display text-[11px] tracking-widest text-violet-400 uppercase border border-violet-500/20 px-3 py-1 rounded-full">
          Script Vault
        </span>
        <h1 className="font-display text-5xl font-bold text-white mt-5 mb-2">Scripts</h1>
        <p className="font-display text-[14px] text-white/30">{SCRIPTS.length} scripts — tested, undetected.</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search scripts or games..."
            className="w-full bg-white/[0.04] border border-white/8 rounded-xl py-3 pl-11 pr-4 text-white/80 placeholder-white/20 focus:border-violet-500/40 focus:outline-none font-display text-[13px] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`font-display font-bold text-[12px] tracking-wider px-4 py-2 rounded-xl border transition-all ${
                cat === c
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "border-white/8 text-white/35 hover:border-white/15 hover:text-white/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/25 hover:bg-white/[0.05] transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative h-32 overflow-hidden bg-[#0d0d14]">
                <GameThumbnail
                  game={s.game}
                  className="absolute inset-0 w-full h-full opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/30 to-transparent" />
                <span className="absolute bottom-2.5 left-3.5 font-display font-bold text-[11px] tracking-wider text-white/80 uppercase drop-shadow-md">
                  {s.game}
                </span>
                <span
                  className="absolute top-2.5 right-2.5 font-display font-bold text-[10px] tracking-widest px-2 py-0.5 rounded-md border backdrop-blur-sm"
                  style={{
                    color: s.tagColor,
                    borderColor: s.tagColor + "35",
                    backgroundColor: s.tagColor + "15",
                  }}
                >
                  {s.tag}
                </span>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="font-display font-bold text-[15px] text-white mb-2 leading-snug">{s.name}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 font-display text-[11px] text-white/30 uppercase tracking-wider">
                    {catIcons[s.category]} {s.category}
                  </span>
                  <span className="flex items-center gap-1 font-display text-[11px] text-white/25">
                    <Clock size={10} /> {s.updated}
                  </span>
                </div>
                <button
                  onClick={() => { setModal(s); setCopied(false) }}
                  className="w-full bg-white/5 hover:bg-violet-600 border border-white/8 hover:border-violet-500 text-white/60 hover:text-white font-display font-bold text-[12px] tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Code2 size={13} /> Get Script
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <Code2 size={36} className="mx-auto mb-4 text-white/15" />
          <p className="font-display text-[15px] text-white/25">No scripts match that.</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-[#0e0e18] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between p-6 border-b border-white/8">
                <div>
                  <span className="font-display text-[11px] tracking-widest text-white/25 uppercase border border-white/8 px-2 py-0.5 rounded-md">
                    {modal.game}
                  </span>
                  <h2 className="font-display text-[20px] font-bold text-white mt-2">{modal.name}</h2>
                </div>
                <button onClick={() => setModal(null)} className="text-white/25 hover:text-white transition-colors mt-1">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-black/40 border border-white/6 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
                  <pre className="font-mono text-[12px] text-white/40 whitespace-pre-wrap leading-relaxed">{modal.code}</pre>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 mb-4 flex gap-2.5">
                  <span className="text-amber-400 text-sm mt-px">⚠</span>
                  <span className="font-display text-[12px] text-amber-400/60 leading-relaxed">
                    Use a trusted executor. XZX HUB isn't responsible for misuse.
                  </span>
                </div>

                <button
                  onClick={() => copy(modal.code)}
                  className={`w-full font-display font-bold text-[13px] tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-violet-600 hover:bg-violet-500 text-white"
                  }`}
                >
                  {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Script</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Updates ────────────────────────────────────────────────────────────────────
function UpdatesPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <span className="font-display text-[11px] tracking-widest text-violet-400 uppercase border border-violet-500/20 px-3 py-1 rounded-full">
          Changelog
        </span>
        <h1 className="font-display text-5xl font-bold text-white mt-5 mb-2">Updates</h1>
        <p className="font-display text-[14px] text-white/30">Every patch, feature, and fix — in order.</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-10">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/30 via-white/10 to-transparent" />
          <div className="space-y-10">
            {CHANGELOG.map((e, i) => (
              <motion.div
                key={e.version}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="relative pl-9"
              >
                <div
                  className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-[#07070f]"
                  style={{ backgroundColor: e.labelColor, boxShadow: `0 0 10px ${e.labelColor}60` }}
                />
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-white/12 transition-all">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-display text-[17px] font-bold text-white">{e.version}</span>
                    <span
                      className="font-display text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-md border"
                      style={{ color: e.labelColor, borderColor: e.labelColor + "30", backgroundColor: e.labelColor + "10" }}
                    >
                      {e.label}
                    </span>
                    <span className="font-display text-[11px] text-white/25 ml-auto flex items-center gap-1">
                      <Clock size={10} /> {e.date}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {e.changes.map((c, idx) => (
                      <li key={idx} className="font-display text-[13px] text-white/35 flex items-start gap-2">
                        <span className="text-violet-500/60 mt-1 text-[8px]">●</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="lg:sticky lg:top-28 h-fit"
        >
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <RefreshCw size={16} className="text-violet-400" />
              </div>
              <h3 className="font-display font-bold text-[15px] text-white">Auto-Update On</h3>
            </div>
            <p className="font-display text-[13px] text-white/30 mb-5 leading-relaxed">
              Scripts update automatically within hours of a Roblox patch. You don't have to do anything.
            </p>
            <div className="h-px bg-white/6 my-4" />
            <div className="flex items-center justify-between">
              <span className="font-display text-[10px] tracking-widest text-white/20 uppercase">Last Check</span>
              <span className="font-display text-[13px] text-white font-bold">Just now</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function Page() {
  const [page, setPage] = useState("home")
  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === "home"    && <HomePage setPage={setPage} />}
      {page === "scripts" && <ScriptsPage />}
      {page === "updates" && <UpdatesPage />}
    </>
  )
}
