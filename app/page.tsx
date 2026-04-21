'use client'

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Copy, Check, X, Search, Menu, XIcon, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

const LOGO_URL = "https://i.postimg.cc/pLjwZ938/114A3ACE-CAC7-45B3-AB50-FDF67970EB2A.png"

const UNIVERSE_IDS: Record<string, number> = {
  "Combat Warriors": 2699330604,
  "Blox Fruits": 2753915549,
  "Arsenal": 286090429,
  "Pet Simulator 99": 8737899170,
  "DOORS": 6516141723,
  "Brookhaven RP": 4924922222,
}

const SCRIPTS = [
  {
    id: 1, name: "Auto-Farm", game: "Combat Warriors",
    category: "Combat", updated: "Apr 18, 2026", tag: "HOT",
    code: `-- Combat Warriors Auto-Farm\nlocal Players = game:GetService("Players")\nlocal LocalPlayer = Players.LocalPlayer\n\nlocal config = {\n    autoFarm = true,\n    autoCollect = true,\n    safeMode = true\n}\n\nprint("[XZX HUB] Script Loaded")`
  },
  {
    id: 2, name: "Devil Fruit Sniper", game: "Blox Fruits",
    category: "Farming", updated: "Apr 17, 2026", tag: "NEW",
    code: `-- Blox Fruits Devil Fruit Sniper\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\n\nlocal function snipeFruit()\n    -- snipe logic\nend\n\nprint("[XZX HUB] Sniper Active")`
  },
  {
    id: 3, name: "Aimbot & ESP", game: "Arsenal",
    category: "Combat", updated: "Apr 16, 2026", tag: "HOT",
    code: `-- Arsenal ESP\nlocal RunService = game:GetService("RunService")\n\nlocal ESP = {\n    Enabled = true,\n    BoxESP = true,\n    NameESP = true,\n}\n\nprint("[XZX HUB] ESP Active")`
  },
  {
    id: 4, name: "Auto Collect", game: "Pet Simulator 99",
    category: "Farming", updated: "Apr 15, 2026", tag: "UPDATED",
    code: `-- Pet Sim 99 Auto Collect\nlocal TweenService = game:GetService("TweenService")\n\nlocal function autoCollect()\n    -- collect logic\nend\n\nprint("[XZX HUB] Auto Collect On")`
  },
  {
    id: 5, name: "Entity ESP & Skip", game: "DOORS",
    category: "Utility", updated: "Apr 14, 2026", tag: "NEW",
    code: `-- DOORS Entity Skip\nlocal Players = game:GetService("Players")\n\nlocal config = {\n    EntityESP = true,\n    AutoSkip = true,\n}\n\nprint("[XZX HUB] DOORS Script On")`
  },
  {
    id: 6, name: "Utility Panel", game: "Brookhaven RP",
    category: "Utility", updated: "Apr 12, 2026", tag: "STABLE",
    code: `-- Brookhaven Utility Panel\nlocal StarterGui = game:GetService("StarterGui")\n\nlocal utils = {\n    NoClip = false,\n    Speed = 16,\n    Fly = false\n}\n\nprint("[XZX HUB] Panel Ready")`
  },
]

const CHANGELOG = [
  {
    version: "v2.5.0", date: "April 18, 2026", label: "MAJOR",
    changes: [
      "added combat warriors auto-farm with new anti-detection pass",
      "new ui overlay — way cleaner, less intrusive",
      "xzx executor v4 compat fully working now",
      "farming scripts noticeably faster (~40% improvement)",
    ]
  },
  {
    version: "v2.4.3", date: "April 14, 2026", label: "PATCH",
    changes: [
      "fixed blox fruits crash on server hop",
      "arsenal esp rendering bug on low-end devices is gone",
      "mobile text rendering fix",
    ]
  },
  {
    version: "v2.4.0", date: "April 9, 2026", label: "UPDATE",
    changes: [
      "doors entity esp fully rewritten from scratch",
      "added brookhaven utility panel (you guys kept asking)",
      "script loader 60% faster to load now",
      "new hub site shipped",
    ]
  },
  {
    version: "v2.3.1", date: "March 28, 2026", label: "PATCH",
    changes: [
      "pet sim 99 updated for latest game patch",
      "fixed memory leak in long farm sessions",
    ]
  },
  {
    version: "v2.3.0", date: "March 20, 2026", label: "UPDATE",
    changes: [
      "script vault system introduced",
      "version badges and update timestamps added",
      "discord bot sends instant script update pings",
      "5 new scripts added across combat and farming",
    ]
  },
]

const CATEGORIES = ["All", "Combat", "Farming", "Utility"]

const TAG_COLORS: Record<string, string> = {
  HOT: "#e8002a",
  NEW: "#16a34a",
  UPDATED: "#d97706",
  STABLE: "#6366f1",
}

function GameThumbnail({ game, className = "" }: { game: string; className?: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const uid = UNIVERSE_IDS[game]

  useEffect(() => {
    if (!uid) { setFailed(true); return }
    fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${uid}&size=150x150&format=Png&isCircular=false`
    )
      .then(r => r.json())
      .then(d => {
        const url = d?.data?.[0]?.imageUrl
        if (url) setImgUrl(url)
        else setFailed(true)
      })
      .catch(() => setFailed(true))
  }, [uid])

  if (failed || !imgUrl) {
    return (
      <div className={`flex items-center justify-center bg-[#111] border-r border-[#1e1e1e] ${className}`}>
        <span className="font-mono text-[10px] text-[#333] uppercase tracking-widest select-none">
          {game.slice(0, 3)}
        </span>
      </div>
    )
  }

  return (
    <img
      src={imgUrl}
      alt={game}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}

function ParticleField() {
  const count = 1200
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const clock = useRef(new THREE.Clock())

  const particles = useRef({
    positions: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const pos = particles.current.positions
    const col = particles.current.colors
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r
      pos[i * 3 + 2] = Math.cos(phi) * r
      const isRed = Math.random() < 0.06
      const b = 0.3 + Math.random() * 0.5
      col[i * 3] = isRed ? 0.9 : b
      col[i * 3 + 1] = isRed ? 0.05 : b
      col[i * 3 + 2] = isRed ? 0.05 : b
    }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const time = clock.current.getElapsedTime()
    const geo = pointsRef.current.geometry
    const pa = geo.attributes.position
    const pos = pa.array as Float32Array
    const m = mouseRef.current
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = pos[i3], y = pos[i3 + 1], z = pos[i3 + 2]
      pos[i3] += (x + m.x * 1.5) * 0.001
      pos[i3 + 1] += (y + m.y * 1.5) * 0.001
      pos[i3 + 2] += (z + Math.sin(time * 0.2 + x) * 0.1 - z) * 0.001
      const dist = Math.sqrt(x * x + y * y + z * z)
      if (dist > 8) {
        pos[i3] *= 0.99
        pos[i3 + 1] *= 0.99
        pos[i3 + 2] *= 0.99
      }
    }
    pa.needsUpdate = true
    pointsRef.current.rotation.y += 0.0004
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.current.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.current.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.022} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.7} />
    </points>
  )
}

function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links = [["home", "Home"], ["scripts", "Scripts"], ["updates", "Updates"]]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#060606]/95 border-b border-[#1c1c1c]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="flex items-center gap-2.5">
          <img src={LOGO_URL} alt="XZX" className="w-8 h-8 rounded object-cover" />
          <span className="font-display text-[15px] font-bold tracking-wider text-white">
            XZX<span className="text-[#e8002a]">.</span>HUB
          </span>
        </button>

        <div className="hidden md:flex items-center gap-7">
          {links.map(([p, label]) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`font-mono text-xs tracking-widest uppercase transition-colors ${
                page === p ? "text-white" : "text-[#555] hover:text-[#aaa]"
              }`}
            >
              {page === p && <span className="text-[#e8002a] mr-1">▸</span>}{label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage("scripts")}
          className="hidden md:flex items-center gap-1.5 bg-[#e8002a] hover:bg-[#c0001f] text-white font-mono text-[11px] tracking-widest uppercase px-4 py-2 transition-colors"
        >
          Get Scripts
        </button>

        <button onClick={() => setOpen(!open)} className="md:hidden text-[#aaa] hover:text-white transition-colors">
          {open ? <XIcon size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#060606] border-t border-[#1c1c1c]"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map(([p, label]) => (
                <button
                  key={p}
                  onClick={() => { setPage(p); setOpen(false) }}
                  className={`text-left font-mono text-xs tracking-widest uppercase ${page === p ? "text-white" : "text-[#555]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function HomePage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <Suspense fallback={null}>
              <ParticleField />
            </Suspense>
          </Canvas>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#060606]/50 via-transparent to-[#060606]" />
        <div className="scanlines absolute inset-0 z-0 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 w-full">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest text-[#555] uppercase">All scripts undetected — updated Apr 18</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-[clamp(52px,10vw,120px)] font-bold leading-none mb-6 tracking-tight"
          >
            <span className="text-white">XZX</span>
            <span className="text-[#e8002a]">.</span>
            <span className="text-white">HUB</span>
            <br />
            <span className="text-[#2a2a2a] text-[clamp(20px,4vw,48px)] font-normal tracking-normal">
              scripts that actually work.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="font-mono text-[13px] text-[#555] max-w-md mb-10 leading-relaxed"
          >
            updated within hours of patches. no premium bs. no bloat. just the scripts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => setPage("scripts")}
              className="flex items-center gap-2 bg-[#e8002a] hover:bg-[#c0001f] text-white font-mono text-[12px] tracking-widest uppercase px-6 py-3 transition-colors"
            >
              View Scripts →
            </button>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-[#2a2a2a] hover:border-[#444] text-[#aaa] hover:text-white font-mono text-[12px] tracking-widest uppercase px-6 py-3 transition-colors"
            >
              Discord ↗
            </a>
          </motion.div>
        </div>

        <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-[#e8002a]/40 to-transparent hidden md:block" />
      </section>

      <section className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-mono text-[10px] tracking-widest text-[#e8002a] uppercase mb-4 block">/ about</span>
            <h2 className="font-display text-[clamp(32px,5vw,52px)] font-bold text-white leading-tight mb-6">
              made for the<br />
              <span className="text-[#333]">community.</span>
            </h2>
            <p className="font-mono text-[13px] text-[#555] leading-relaxed mb-4">
              we've been doing this for a while. scripts get updated fast, the hub stays clean, and we actually test stuff before pushing it live.
            </p>
            <p className="font-mono text-[13px] text-[#555] leading-relaxed">
              no inflated script counts. no fake uptime numbers. just {SCRIPTS.length} solid scripts that work.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-px bg-[#1c1c1c] border border-[#1c1c1c]"
          >
            {[
              { n: "50+", l: "scripts" },
              { n: "< 24h", l: "patch response" },
              { n: "10k+", l: "users" },
              { n: "6", l: "supported games" },
            ].map(({ n, l }) => (
              <div key={l} className="bg-[#060606] p-8">
                <div className="font-display text-3xl font-bold text-white mb-1">{n}</div>
                <div className="font-mono text-[10px] tracking-widest text-[#444] uppercase">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-[#111]">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
          <span className="font-mono text-[10px] tracking-widest text-[#e8002a] uppercase">/ why xzx</span>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-px bg-[#1c1c1c] border border-[#1c1c1c]">
          {[
            { n: "01", t: "Fast Execution", d: "loads fast, runs clean. lightweight loader that doesn't tank your fps." },
            { n: "02", t: "Patch-Proof", d: "we watch for game updates constantly. most scripts are fixed in under a day." },
            { n: "03", t: "Undetected", d: "anti-detection is built in. we don't push scripts until they pass our checks." },
          ].map(({ n, t, d }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#060606] p-8 group hover:bg-[#0a0a0a] transition-colors"
            >
              <div className="font-mono text-[10px] text-[#333] mb-4">{n}</div>
              <h3 className="font-display text-lg font-bold text-white mb-3 group-hover:text-[#e8002a] transition-colors">{t}</h3>
              <p className="font-mono text-[12px] text-[#555] leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-28 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-[#1c1c1c] p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <span className="font-mono text-[10px] tracking-widest text-[#e8002a] uppercase mb-3 block">/ ready?</span>
            <h2 className="font-display text-4xl font-bold text-white">browse the vault.</h2>
          </div>
          <button
            onClick={() => setPage("scripts")}
            className="flex-shrink-0 bg-[#e8002a] hover:bg-[#c0001f] text-white font-mono text-[12px] tracking-widest uppercase px-8 py-4 transition-colors"
          >
            Open Scripts →
          </button>
        </motion.div>
      </section>
    </div>
  )
}

function ScriptsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [modal, setModal] = useState<typeof SCRIPTS[0] | null>(null)
  const [copied, setCopied] = useState(false)

  const filtered = SCRIPTS.filter(s => {
    const matchCat = category === "All" || s.category === category
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.game.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <span className="font-mono text-[10px] tracking-widest text-[#e8002a] uppercase mb-3 block">/ script vault</span>
        <h1 className="font-display text-5xl font-bold text-white mb-2">Scripts</h1>
        <p className="font-mono text-[12px] text-[#444]">{SCRIPTS.length} scripts — all tested, all undetected.</p>
      </motion.div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" />
          <input
            className="w-full bg-[#0a0a0a] border border-[#1c1c1c] py-2.5 pl-9 pr-4 text-[#aaa] placeholder-[#333] focus:border-[#e8002a] focus:outline-none font-mono text-[12px] transition-colors"
            placeholder="search scripts or games..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2.5 border transition-colors ${
                category === cat
                  ? "bg-[#e8002a] border-[#e8002a] text-white"
                  : "border-[#1c1c1c] text-[#555] hover:border-[#333] hover:text-[#aaa]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="flex flex-col gap-px bg-[#1c1c1c] border border-[#1c1c1c]">
        <AnimatePresence>
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-stretch bg-[#060606] hover:bg-[#0b0b0b] transition-colors group"
            >
              <div className="w-[90px] flex-shrink-0 overflow-hidden">
                <GameThumbnail game={s.game} className="w-full h-full min-h-[72px]" />
              </div>

              <div className="flex flex-1 items-center px-5 py-4 gap-4 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display text-[15px] font-bold text-white group-hover:text-[#e8002a] transition-colors truncate">
                      {s.name}
                    </span>
                    <span
                      className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 flex-shrink-0 border"
                      style={{ color: TAG_COLORS[s.tag], borderColor: TAG_COLORS[s.tag] + "40" }}
                    >
                      {s.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-[#444]">{s.game}</span>
                    <span className="text-[#222]">·</span>
                    <span className="font-mono text-[10px] text-[#333] uppercase tracking-widest">{s.category}</span>
                    <span className="text-[#222]">·</span>
                    <span className="font-mono text-[10px] text-[#333] flex items-center gap-1">
                      <Clock size={9} /> {s.updated}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { setModal(s); setCopied(false) }}
                  className="flex-shrink-0 border border-[#1c1c1c] group-hover:border-[#e8002a] text-[#555] group-hover:text-[#e8002a] font-mono text-[10px] tracking-widest uppercase px-4 py-2 transition-colors"
                >
                  Get
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-mono text-[13px] text-[#333]">no scripts match that.</p>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#080808] border border-[#1c1c1c] w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c]">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-[#444] uppercase mb-0.5">{modal.game}</div>
                  <div className="font-display text-lg font-bold text-white">{modal.name}</div>
                </div>
                <button onClick={() => setModal(null)} className="text-[#333] hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-[#040404] border border-[#181818] p-4 mb-4 max-h-48 overflow-y-auto">
                  <pre className="font-mono text-[11px] text-[#666] whitespace-pre-wrap leading-relaxed">{modal.code}</pre>
                </div>

                <div className="flex items-start gap-2 border border-[#1a1208] bg-[#0a0800] p-3 mb-4">
                  <span className="text-[#d97706] text-xs mt-px">⚠</span>
                  <span className="font-mono text-[11px] text-[#7a6020] leading-relaxed">
                    use a trusted executor. xzx hub isn't responsible for misuse.
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(modal.code)}
                  className={`w-full font-mono text-[12px] tracking-widest uppercase py-3 flex items-center justify-center gap-2 transition-colors ${
                    copied ? "bg-[#16a34a] text-white" : "bg-[#e8002a] hover:bg-[#c0001f] text-white"
                  }`}
                >
                  {copied ? <><Check size={14} /> copied</> : <><Copy size={14} /> copy to clipboard</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UpdatesPage() {
  const LABEL_COLORS: Record<string, string> = {
    MAJOR: "#e8002a",
    UPDATE: "#6366f1",
    PATCH: "#16a34a",
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <span className="font-mono text-[10px] tracking-widest text-[#e8002a] uppercase mb-3 block">/ changelog</span>
        <h1 className="font-display text-5xl font-bold text-white mb-2">Updates</h1>
        <p className="font-mono text-[12px] text-[#444]">every patch, feature, and fix — in order.</p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1c1c1c]" />
        <div className="space-y-10">
          {CHANGELOG.map((entry, i) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-10"
            >
              <div
                className="absolute left-0 top-[6px] w-[15px] h-[15px] border-2 border-[#060606]"
                style={{ backgroundColor: LABEL_COLORS[entry.label] ?? "#e8002a" }}
              />

              <div className="border border-[#1c1c1c] hover:border-[#2a2a2a] transition-colors">
                <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-[#111]">
                  <span className="font-display text-base font-bold text-white">{entry.version}</span>
                  <span
                    className="font-mono text-[9px] tracking-widest px-2 py-0.5 uppercase border"
                    style={{ color: LABEL_COLORS[entry.label], borderColor: LABEL_COLORS[entry.label] + "40" }}
                  >
                    {entry.label}
                  </span>
                  <span className="font-mono text-[10px] text-[#333] ml-auto flex items-center gap-1">
                    <Clock size={9} /> {entry.date}
                  </span>
                </div>
                <ul className="px-6 py-4 space-y-2">
                  {entry.changes.map((c, idx) => (
                    <li key={idx} className="font-mono text-[12px] text-[#555] flex items-start gap-2">
                      <span className="text-[#e8002a] mt-px text-[9px]">—</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [page, setPage] = useState("home")
  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "scripts" && <ScriptsPage />}
      {page === "updates" && <UpdatesPage />}
    </>
  )
}
