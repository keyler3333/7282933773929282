'use client'

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  Zap, RefreshCw, Shield, Search, Copy, Check, X,
  ExternalLink, Menu, XIcon, Clock, ArrowRight, Code2,
  Sword, Wheat, Wrench, Star, BookOpen
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

const LOGO_URL = "https://i.postimg.cc/pLjwZ938/114A3ACE-CAC7-45B3-AB50-FDF67970EB2A.png"

const GAME_THUMBNAILS: Record<string, string> = {
  "Combat Warriors": "https://cdn.static.pikoya.com/robloxgo/games/4282985734/thumbnail_3",
  "Blox Fruits": "https://tr.rbxcdn.com/4a6c4e6c4e6c4e6c4e6c4e6c4e6c4e6c/150/150/Image/Png",
  "Arsenal": "https://cdn.static.pikoya.com/robloxgo/games/1137054487/thumbnail_1",
  "Pet Simulator 99": "https://cdn.static.pikoya.com/robloxgo/games/8737899170/thumbnail_1",
  "DOORS": "https://cdn.static.pikoya.com/robloxgo/games/5689626702/thumbnail_1",
  "Brookhaven RP": "https://cdn.static.pikoya.com/robloxgo/games/3078160987/thumbnail_1",
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
    version: "v2.5.0", date: "Apr 18", changes: [
      "Combat Warriors auto‑farm got a full anti‑detection pass. Should hold up way better now.",
      "Loader injection is faster. Noticed it on my end, you might too.",
      "Farming scripts across the board run smoother. Less stutter."
    ]
  },
  {
    version: "v2.4.3", date: "Apr 14", changes: [
      "Fixed that stupid Blox Fruits crash on server hop. Took way too long to track down.",
      "Arsenal ESP no longer breaks on lower end hardware. Finally."
    ]
  },
  {
    version: "v2.4.0", date: "Apr 9", changes: [
      "DOORS entity ESP rebuilt. It was a mess before, should be reliable now.",
      "Brookhaven panel added because people kept asking. Basic utils only."
    ]
  },
  {
    version: "v2.3.1", date: "Mar 28", changes: [
      "Pet Sim 99 updated. Game patched, we patched. Simple."
    ]
  },
  {
    version: "v2.3.0", date: "Mar 20", changes: [
      "Script vault organized. Way easier to find stuff now.",
      "Discord bot pings when something updates. No more guessing."
    ]
  },
]

const CATEGORIES = ["All", "Combat", "Farming", "Utility"]

// --- ParticleField (fixed, never stops) ---
function ParticleField() {
  const count = 1200
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const clockRef = useRef(new THREE.Clock())
  const positionsRef = useRef<Float32Array | null>(null)
  const colorsRef = useRef<Float32Array | null>(null)

  useEffect(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i*3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i*3+1] = Math.sin(phi) * Math.sin(theta) * r
      pos[i*3+2] = Math.cos(phi) * r

      const brightness = 0.4 + Math.random() * 0.6
      col[i*3] = brightness * 0.95
      col[i*3+1] = brightness * 0.85
      col[i*3+2] = brightness
    }

    positionsRef.current = pos
    colorsRef.current = col
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    if (!positionsRef.current) return

    const time = clockRef.current.getElapsedTime()
    const geometry = pointsRef.current.geometry
    const posAttr = geometry.attributes.position
    const positions = posAttr.array as Float32Array
    const originalPos = positionsRef.current
    const mouse = mouseRef.current

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const ox = originalPos[i3]
      const oy = originalPos[i3+1]
      const oz = originalPos[i3+2]

      const targetX = ox + mouse.x * 2.5
      const targetY = oy + mouse.y * 2.0
      const targetZ = oz + Math.sin(time * 0.3 + ox) * 0.5

      positions[i3] += (targetX - positions[i3]) * 0.02
      positions[i3+1] += (targetY - positions[i3+1]) * 0.02
      positions[i3+2] += (targetZ - positions[i3+2]) * 0.02

      const dist = Math.sqrt(positions[i3]**2 + positions[i3+1]**2 + positions[i3+2]**2)
      if (dist > 8.5) {
        positions[i3] *= 0.98
        positions[i3+1] *= 0.98
        positions[i3+2] *= 0.98
      }
    }

    posAttr.needsUpdate = true
    pointsRef.current.rotation.y += 0.0004
  })

  if (!positionsRef.current || !colorsRef.current) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positionsRef.current}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colorsRef.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.85}
      />
    </points>
  )
}

// --- GameThumbnail ---
function GameThumbnail({ game, className = "" }: { game: string; className?: string }) {
  const [imgErr, setImgErr] = useState(false)
  const thumbnailUrl = GAME_THUMBNAILS[game]

  if (!thumbnailUrl || imgErr) {
    return (
      <div className={`flex items-center justify-center bg-black/60 backdrop-blur-sm ${className}`}>
        <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
          {game.split(" ").map(w => w[0]).join("").slice(0, 3)}
        </span>
      </div>
    )
  }

  return (
    <img
      src={thumbnailUrl}
      alt={game}
      onError={() => setImgErr(true)}
      className={`object-cover ${className}`}
    />
  )
}

// --- Navbar (updated with Guide) ---
function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links: [string, string][] = [["home","Home"],["scripts","Scripts"],["guide","Guide"],["updates","Updates"]]

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 px-5"
    >
      <div className={`mx-auto max-w-6xl mt-3 rounded-xl transition-all duration-300 backdrop-blur-md ${
        scrolled ? "bg-black/80 border border-white/10" : "bg-black/40 border border-white/5"
      }`}>
        <div className="flex items-center justify-between px-5 py-3">
          <button onClick={() => setPage("home")} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 transition-all duration-300 group-hover:border-purple-400/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <img src={LOGO_URL} alt="XZX" className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight transition-all duration-300 group-hover:text-purple-200 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              XZX <span className="text-white/30 group-hover:text-white/50">HUB</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map(([p, label]) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  page === p ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage("scripts")}
            className="hidden md:block bg-white text-black text-sm font-bold px-5 py-2 rounded-lg hover:bg-white/90 transition"
          >
            Get Scripts
          </button>

          <button onClick={() => setOpen(!open)} className="md:hidden text-white/60">
            {open ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/8"
            >
              <div className="flex flex-col p-4 gap-1">
                {links.map(([p, label]) => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); setOpen(false) }}
                    className={`text-left px-3 py-2 text-sm ${
                      page === p ? "text-white bg-white/5" : "text-white/40"
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

// --- HomePage (unchanged) ---
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
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  <img src={LOGO_URL} alt="XZX" className="w-full h-full object-cover" />
                </div>
                <span className="text-white/40 text-sm font-medium tracking-wide">
                  scripts that don't break every update
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-[clamp(48px,8vw,96px)] font-bold leading-none tracking-tight text-white mb-4 transition-all duration-500 hover:text-purple-100 hover:drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              XZX HUB
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-xl max-w-2xl mb-10 leading-relaxed"
            >
              We update these scripts constantly because Roblox patches constantly. They work on our machines and they'll work on yours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => setPage("scripts")}
                className="bg-white text-black font-bold text-sm px-8 py-4 rounded-lg hover:bg-white/90 transition flex items-center gap-2"
              >
                Browse scripts <ArrowRight size={16} />
              </button>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="backdrop-blur-md bg-white/5 border border-white/20 text-white/70 font-medium text-sm px-8 py-4 rounded-lg hover:border-white/40 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
              >
                <ExternalLink size={16} /> Discord
              </a>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-12 left-6 right-6 z-10">
          <div className="max-w-6xl mx-auto flex gap-8 text-sm text-white/30">
            <span>6 games supported</span>
            <span>·</span>
            <span>scripts updated this week</span>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-6">Why we made this</h2>
            <p className="text-white/50 text-lg leading-relaxed mb-4">
              We got tired of scripts breaking two days after finding them. So we started fixing them ourselves and keeping them updated. Now we just share what we use.
            </p>
            <p className="text-white/50 text-lg leading-relaxed">
              No corporate nonsense, no "company". Just a team of devs with too much free time and a decent understanding of Roblox's internals.
            </p>
          </div>
          <div className="space-y-6">
            {[
              { title: "Undetected", desc: "We test everything on alts before release. Haven't been banned yet." },
              { title: "Fast updates", desc: "If a game patches, we usually have a fix within a day." },
              { title: "No bloat", desc: "Scripts do what they say. No extra garbage." }
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                <p className="text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center">
          <button
            onClick={() => setPage("scripts")}
            className="bg-white text-black font-bold text-lg px-12 py-5 rounded-lg hover:bg-white/90 transition inline-flex items-center gap-3"
          >
            See all scripts <ArrowRight size={20} />
          </button>
          <p className="text-white/30 text-sm mt-6">Updated {SCRIPTS[0].updated}</p>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/10 text-center">
        <p className="text-white/30 text-sm">© {new Date().getFullYear()} XZX HUB. All rights reserved.</p>
      </footer>
    </div>
  )
}

// --- ScriptsPage (unchanged) ---
function ScriptsPage() {
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("All")
  const [modal, setModal] = useState<typeof SCRIPTS[0] | null>(null)
  const [copied, setCopied] = useState(false)

  const catIcons: Record<string, JSX.Element> = { Combat: <Sword size={11} />, Farming: <Wheat size={11} />, Utility: <Wrench size={11} /> }

  const filtered = SCRIPTS.filter(s => {
    const okCat = cat === "All" || s.category === cat
    const okSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.game.toLowerCase().includes(search.toLowerCase())
    return okCat && okSearch
  })

  const copy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-2">Scripts</h1>
        <p className="text-white/40">{SCRIPTS.length} available, all tested</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder-white/30 focus:border-purple-400/50 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition backdrop-blur-sm ${
                cat === c
                  ? "bg-white text-black border-white"
                  : "bg-black/40 border-white/10 text-white/50 hover:border-white/30 hover:bg-black/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-purple-400/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"
            >
              <div className="relative h-32 bg-black/60">
                <GameThumbnail game={s.game} className="absolute inset-0 w-full h-full opacity-70 hover:opacity-100 transition" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <span className="absolute bottom-2 left-3 text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
                  {s.game}
                </span>
                <span
                  className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-sm"
                  style={{ color: s.tagColor, borderColor: s.tagColor, backgroundColor: s.tagColor + "20" }}
                >
                  {s.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2">{s.name}</h3>
                <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">{catIcons[s.category]} {s.category}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {s.updated}</span>
                </div>
                <button
                  onClick={() => { setModal(s); setCopied(false) }}
                  className="w-full bg-white text-black font-bold text-sm py-2.5 rounded-lg hover:bg-white/90 transition flex items-center justify-center gap-2"
                >
                  <Code2 size={14} /> Get Script
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && <div className="text-center py-20 text-white/30">Nothing found.</div>}

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl w-full max-w-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between p-5 border-b border-white/10">
                <div>
                  <span className="text-xs text-white/40 uppercase tracking-wider">{modal.game}</span>
                  <h2 className="text-xl font-bold text-white mt-1">{modal.name}</h2>
                </div>
                <button onClick={() => setModal(null)} className="text-white/40 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="p-5">
                <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-white/60 whitespace-pre-wrap">{modal.code}</pre>
                </div>
                <div className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-lg p-3 mb-4 flex gap-2 text-amber-400/80 text-xs">
                  <span>⚠️</span> Use a trusted executor. Not responsible for misuse.
                </div>
                <button
                  onClick={() => copy(modal.code)}
                  className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 backdrop-blur-sm ${
                    copied ? "bg-green-600/80 text-white" : "bg-white text-black hover:bg-white/90"
                  }`}
                >
                  {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy script</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="mt-20 py-8 border-t border-white/10 text-center">
        <p className="text-white/30 text-sm">© {new Date().getFullYear()} XZX HUB. All rights reserved.</p>
      </footer>
    </div>
  )
}

// --- GuidePage (new, expanded, real tone) ---
function GuidePage() {
  const [activeSection, setActiveSection] = useState("basics")

  const sections = [
    { id: "basics", label: "The Basics" },
    { id: "ui", label: "Making UI" },
    { id: "movement", label: "Moving Around" },
    { id: "bypass", label: "Not Getting Caught" },
    { id: "lag", label: "Breaking Stuff" },
    { id: "extra", label: "Extra Tricks" },
  ]

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen size={32} className="text-purple-400" />
          Learning Luna Code
        </h1>
        <p className="text-white/40 text-lg">Straight from the trenches. No fluff.</p>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-4">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeSection === section.id
                ? "bg-white text-black"
                : "bg-black/40 text-white/50 hover:bg-black/60 hover:text-white/80"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Content sections */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-8"
      >
        {/* The Basics */}
        {activeSection === "basics" && (
          <>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-2xl font-bold text-white mb-4">First things first</h2>
              <p className="text-white/50 mb-4">You need an executor. Luna, Delta, Synapse — pick one. Free executors exist (Krnl, Fluxus) but they break constantly and have key systems. If you're serious, buy a premium one. It's worth the $5-10.</p>
              <p className="text-white/50 mb-4">Once you have an executor, you just paste code and hit inject. That's it. Now let's write some actual code.</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Every script starts with services
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

-- This prints to the executor console
print("Hello, " .. player.Name)

-- Change your walkspeed
humanoid.WalkSpeed = 50

-- Give yourself a tool (if game allows)
local tool = Instance.new("Tool")
tool.Name = "Sword"
tool.Parent = player.Backpack`}</pre>
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="font-display text-xl font-bold text-white mb-3">Finding stuff in the game</h3>
              <p className="text-white/50 mb-4">Use the explorer in your executor to browse the game's objects. You can see all the remotes, guis, and players. That's how you find what to exploit.</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Example: find all remote events
for _, v in pairs(game:GetDescendants()) do
    if v:IsA("RemoteEvent") then
        print(v:GetFullName())
    end
end`}</pre>
              </div>
            </div>
          </>
        )}

        {/* Making UI */}
        {activeSection === "ui" && (
          <>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-2xl font-bold text-white mb-4">Buttons, Sliders, and Windows</h2>
              <p className="text-white/50 mb-4">You can build UI from scratch with Instance.new() but that's tedious. Most people use a library. Here's both ways:</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4 mb-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Raw UI (no library)
local gui = Instance.new("ScreenGui", player.PlayerGui)
local frame = Instance.new("Frame", gui)
frame.Size = UDim2.new(0, 300, 0, 200)
frame.Position = UDim2.new(0.5, -150, 0.5, -100)
frame.BackgroundColor3 = Color3.fromRGB(20, 20, 30)
frame.BorderSizePixel = 0

local toggle = Instance.new("TextButton", frame)
toggle.Size = UDim2.new(0, 200, 0, 40)
toggle.Position = UDim2.new(0.5, -100, 0.5, -20)
toggle.Text = "Toggle"
toggle.BackgroundColor3 = Color3.fromRGB(168, 85, 247)

toggle.MouseButton1Click:Connect(function()
    toggle.Text = toggle.Text == "Toggle" and "On" or "Toggle"
end)`}</pre>
              </div>
              <p className="text-white/50 mb-4">But using a UI library is way cleaner:</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- OrionLib example (popular)
local OrionLib = loadstring(game:HttpGet(('https://raw.githubusercontent.com/shlexware/Orion/main/source')))()
local Window = OrionLib:MakeWindow({Name = "My Hub", HidePremium = false, SaveConfig = true})

local Tab = Window:MakeTab({Name = "Main", Icon = "rbxassetid://4483345998"})

Tab:AddButton({Name = "Click me", Callback = function()
    print("button pressed")
end})

Tab:AddSlider({Name = "Speed", Min = 16, Max = 200, Default = 16, Callback = function(v)
    game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = v
end})`}</pre>
              </div>
            </div>
          </>
        )}

        {/* Moving Around */}
        {activeSection === "movement" && (
          <>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-2xl font-bold text-white mb-4">Speed, Fly, Noclip, Teleport</h2>
              <p className="text-white/50 mb-4">These are the bread and butter. Most games patch simple walkspeed changes, but fly and noclip usually work if done right.</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4 mb-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Fly (BodyVelocity method)
local player = game.Players.LocalPlayer
local char = player.Character or player.CharacterAdded:Wait()
local root = char:WaitForChild("HumanoidRootPart")
local humanoid = char:WaitForChild("Humanoid")

local flying = false
local bodyGyro, bodyVel

local function startFly()
    bodyGyro = Instance.new("BodyGyro", root)
    bodyGyro.P = 9e4
    bodyVel = Instance.new("BodyVelocity", root)
    bodyVel.MaxForce = Vector3.new(9e9, 9e9, 9e9)
    
    flying = true
    while flying do
        local dir = Vector3.zero
        local cam = workspace.CurrentCamera
        local uis = game:GetService("UserInputService")
        if uis:IsKeyDown(Enum.KeyCode.W) then dir += cam.CFrame.LookVector end
        if uis:IsKeyDown(Enum.KeyCode.S) then dir -= cam.CFrame.LookVector end
        if uis:IsKeyDown(Enum.KeyCode.A) then dir -= cam.CFrame.RightVector end
        if uis:IsKeyDown(Enum.KeyCode.D) then dir += cam.CFrame.RightVector end
        if uis:IsKeyDown(Enum.KeyCode.Space) then dir += Vector3.new(0,1,0) end
        if uis:IsKeyDown(Enum.KeyCode.LeftShift) then dir -= Vector3.new(0,1,0) end
        bodyVel.Velocity = dir * 50
        root.CFrame = CFrame.new(root.Position) * CFrame.Angles(0, cam.CFrame.LookVector.Y, 0)
        wait()
    end
    bodyGyro:Destroy()
    bodyVel:Destroy()
end

-- Noclip
local function noclip(enabled)
    for _, part in pairs(char:GetDescendants()) do
        if part:IsA("BasePart") then part.CanCollide = not enabled end
    end
end`}</pre>
              </div>
              <p className="text-white/40 text-sm">Teleporting is just setting the root part's CFrame:</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Teleport to a player
local target = game.Players:FindFirstChild("TargetName")
if target and target.Character then
    game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = target.Character.HumanoidRootPart.CFrame
end`}</pre>
              </div>
            </div>
          </>
        )}

        {/* Not Getting Caught */}
        {activeSection === "bypass" && (
          <>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-2xl font-bold text-white mb-4">Staying undetected</h2>
              <p className="text-white/50 mb-4">Byfron anti-cheat (the thing that detects executors) runs on most games now. You can't bypass it with Lua alone — that's on the executor devs. But you can avoid server-side detection by not being obvious.</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4 mb-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Hook a remote to see what it sends
local oldNamecall
oldNamecall = hookmetamethod(game, "__namecall", function(self, ...)
    local method = getnamecallmethod()
    local args = {...}
    print("Remote called:", self.Name, method, unpack(args))
    return oldNamecall(self, ...)
end)

-- Block a specific remote (dangerous, can desync)
local old
old = hookfunction(Instance.new("RemoteEvent").FireServer, function(self, ...)
    if self.Name == "BanPlayer" then return end
    return old(self, ...)
end)`}</pre>
              </div>
              <p className="text-white/40 text-sm">These are educational. Using them will likely get you banned if the game has a decent anti-cheat.</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="font-display text-xl font-bold text-white mb-3">Silent Aim / Hitbox Expander</h3>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Expand hitboxes (works in some games)
for _, player in pairs(game.Players:GetPlayers()) do
    if player ~= game.Players.LocalPlayer and player.Character then
        for _, part in pairs(player.Character:GetChildren()) do
            if part:IsA("BasePart") then
                part.Size = part.Size * 2
                part.Transparency = 0.5
            end
        end
    end
end`}</pre>
              </div>
            </div>
          </>
        )}

        {/* Breaking Stuff */}
        {activeSection === "lag" && (
          <>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-2xl font-bold text-white mb-4">Lag switches & server crashers</h2>
              <p className="text-white/50 mb-4">These are toxic and can get you hardware banned. Only use in private servers or games you own.</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4 mb-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Remote spammer (may crash server)
local remote = game:GetService("ReplicatedStorage"):FindFirstChild("SomeRemote")
if remote then
    while true do
        remote:FireServer("spam")
        wait()
    end
end

-- Client-side lag (requires external tool)
-- Use a firewall to block RobloxPlayerBeta.exe for 1 second then unblock
-- Many executors have built-in lag switch features.`}</pre>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="text-amber-400/80 text-sm">⚠️ This is how you get your account deleted. Don't be that guy.</p>
              </div>
            </div>
          </>
        )}

        {/* Extra Tricks */}
        {activeSection === "extra" && (
          <>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-2xl font-bold text-white mb-4">ESP, Auto Farm, and More</h2>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4 mb-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Simple ESP (draw boxes around players)
local function createESP(player)
    local highlight = Instance.new("Highlight")
    highlight.FillColor = Color3.fromRGB(255, 0, 0)
    highlight.OutlineColor = Color3.fromRGB(255, 255, 255)
    highlight.Parent = player.Character
end

for _, player in pairs(game.Players:GetPlayers()) do
    if player ~= game.Players.LocalPlayer then
        player.CharacterAdded:Connect(function(char)
            createESP(player)
        end)
        if player.Character then createESP(player) end
    end
end

-- Auto farm (example: click a button repeatedly)
local button = workspace:FindFirstChild("FarmButton", true)
while true do
    if button then
        fireclickdetector(button.ClickDetector)
    end
    wait(0.5)
end`}</pre>
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="font-display text-xl font-bold text-white mb-3">Script Hubs & Loadstrings</h3>
              <p className="text-white/50 mb-4">Many games have pre-made script hubs. You just paste a loadstring and it gives you a full GUI with all features.</p>
              <div className="bg-black/60 border border-white/10 rounded-lg p-4">
                <pre className="text-xs text-white/60 whitespace-pre-wrap">{`-- Example: load a Blox Fruits script
loadstring(game:HttpGet("https://raw.githubusercontent.com/SomeHub/BloxFruits/main.lua"))()`}</pre>
              </div>
            </div>
          </>
        )}
      </motion.div>

      <footer className="mt-16 py-8 border-t border-white/10 text-center">
        <p className="text-white/30 text-sm">For educational purposes only. Use at your own risk.</p>
      </footer>
    </div>
  )
}

// --- UpdatesPage (unchanged) ---
function UpdatesPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-bold text-white mb-2">Updates</h1>
      <p className="text-white/40 mb-12">What changed, when, and why.</p>

      <div className="space-y-8">
        {CHANGELOG.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-400/30 transition-all"
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-lg font-bold text-white">{entry.version}</span>
              <span className="text-sm text-white/30">{entry.date}</span>
            </div>
            <ul className="space-y-2">
              {entry.changes.map((c, idx) => (
                <li key={idx} className="text-white/60 text-base leading-relaxed">— {c}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <footer className="mt-20 py-8 border-t border-white/10 text-center">
        <p className="text-white/30 text-sm">© {new Date().getFullYear()} XZX HUB. All rights reserved.</p>
      </footer>
    </div>
  )
}

// --- Main Page (light rays removed) ---
export default function Page() {
  const [page, setPage] = useState("home")
  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "scripts" && <ScriptsPage />}
      {page === "guide" && <GuidePage />}
      {page === "updates" && <UpdatesPage />}
    </>
  )
}
