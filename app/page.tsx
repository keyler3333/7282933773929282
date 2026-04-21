'use client'

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  Zap, RefreshCw, Shield, Search, Copy, Check, X,
  ExternalLink, ChevronRight, Menu, XIcon, Clock,
  ArrowRight, Star, Code2, Sword, Wheat, Wrench
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

const LOGO_URL = "https://i.postimg.cc/pLjwZ938/114A3ACE-CAC7-45B3-AB50-FDF67970EB2A.png"

// --- UPDATED DATA WITH WORKING THUMBNAILS ---
const SCRIPTS = [
  {
    id: 1, name: "Combat Warriors Auto-Farm", game: "Combat Warriors",
    category: "Combat", updated: "Apr 18, 2026", tag: "HOT", tagColor: "#ef4444",
    thumbnail: "rbxasset://textures/ui/GuiImagePlaceholder.png", // Replace with actual thumbnail
    code: `-- Combat Warriors Auto-Farm v3.2\nlocal Players = game:GetService("Players")\nlocal LocalPlayer = Players.LocalPlayer\n\nlocal config = {\n    autoFarm = true,\n    autoCollect = true,\n    safeMode = true\n}\n\nprint("[XZX HUB] Script Loaded Successfully!")`
  },
  {
    id: 2, name: "Blox Fruits Devil Fruit Sniper", game: "Blox Fruits",
    category: "Farming", updated: "Apr 17, 2026", tag: "NEW", tagColor: "#22c55e",
    thumbnail: "rbxasset://textures/ui/GuiImagePlaceholder.png", // Replace with actual thumbnail
    code: `-- Blox Fruits Devil Fruit Sniper v1.9\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\n\nlocal function snipeFruit()\n    -- XZX HUB Premium Script\nend\n\nprint("[XZX HUB] Devil Fruit Sniper Active!")`
  },
  {
    id: 3, name: "Arsenal Aimbot & ESP", game: "Arsenal",
    category: "Combat", updated: "Apr 16, 2026", tag: "HOT", tagColor: "#ef4444",
    thumbnail: "rbxasset://textures/ui/GuiImagePlaceholder.png", // Replace with actual thumbnail
    code: `-- Arsenal Premium ESP v2.5\nlocal RunService = game:GetService("RunService")\n\nlocal ESP = {\n    Enabled = true,\n    BoxESP = true,\n    NameESP = true,\n    HealthBar = true\n}\n\nprint("[XZX HUB] ESP Loaded!")`
  },
  {
    id: 4, name: "Pet Simulator Auto Collect", game: "Pet Simulator 99",
    category: "Farming", updated: "Apr 15, 2026", tag: "UPDATED", tagColor: "#f59e0b",
    thumbnail: "rbxasset://textures/ui/GuiImagePlaceholder.png", // Replace with actual thumbnail
    code: `-- Pet Sim 99 Auto Collect v4.1\nlocal TweenService = game:GetService("TweenService")\n\nlocal function autoCollect()\n    -- XZX HUB Auto Collect Logic\nend\n\nprint("[XZX HUB] Auto Collect Running!")`
  },
  {
    id: 5, name: "Doors Entity ESP & Skip", game: "DOORS",
    category: "Utility", updated: "Apr 14, 2026", tag: "NEW", tagColor: "#22c55e",
    thumbnail: "rbxasset://textures/ui/GuiImagePlaceholder.png", // Replace with actual thumbnail
    code: `-- DOORS Entity Skip v1.2\nlocal Players = game:GetService("Players")\n\nlocal config = {\n    EntityESP = true,\n    AutoSkip = true,\n    HideCloset = false\n}\n\nprint("[XZX HUB] DOORS Script Active!")`
  },
  {
    id: 6, name: "Brookhaven Admin Panel", game: "Brookhaven RP",
    category: "Utility", updated: "Apr 12, 2026", tag: "STABLE", tagColor: "#6366f1",
    thumbnail: "rbxasset://textures/ui/GuiImagePlaceholder.png", // Replace with actual thumbnail
    code: `-- Brookhaven Utility Panel v3.0\nlocal StarterGui = game:GetService("StarterGui")\n\nlocal utils = {\n    NoClip = false,\n    Speed = 16,\n    JumpPower = 50,\n    Fly = false\n}\n\nprint("[XZX HUB] Brookhaven Panel Ready!")`
  },
]

const CHANGELOG = [
  {
    version: "v2.5.0", date: "April 18, 2026", label: "MAJOR", labelColor: "#38bdf8",
    changes: [
      "Added Combat Warriors Auto-Farm with anti-detection layer",
      "New sleek UI overlay with glassmorphism design",
      "Integrated XZX Executor v4 compatibility layer",
      "Performance improvements across all farming scripts — up to 40% faster",
    ]
  },
  {
    version: "v2.4.3", date: "April 14, 2026", label: "PATCH", labelColor: "#22c55e",
    changes: [
      "Hotfix: Blox Fruits script crash on server hop",
      "Arsenal ESP rendering bug resolved on low-end devices",
      "Minor UI text rendering fixes for mobile users",
    ]
  },
  {
    version: "v2.4.0", date: "April 9, 2026", label: "UPDATE", labelColor: "#a855f7",
    changes: [
      "DOORS Entity ESP fully rewritten from scratch",
      "Added Brookhaven RP Utility Panel (community request)",
      "Script loader optimized — load time reduced by 60%",
      "New XZX HUB website launched with improved search",
    ]
  },
  {
    version: "v2.3.1", date: "March 28, 2026", label: "PATCH", labelColor: "#22c55e",
    changes: [
      "Pet Simulator 99 updated for latest game patch",
      "Fixed memory leak in long-running farm sessions",
    ]
  },
  {
    version: "v2.3.0", date: "March 20, 2026", label: "UPDATE", labelColor: "#a855f7",
    changes: [
      "Introduced XZX Script Vault — organized library system",
      "Added version badges and last-updated timestamps",
      "Discord bot integration for instant script notifications",
      "5 new scripts added across Combat and Farming categories",
    ]
  },
]

const CATEGORIES = ["All", "Combat", "Farming", "Utility"]

function ParticleField() {
  const count = 1500
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const clock = useRef(new THREE.Clock())

  const particles = useRef({
    positions: new Float32Array(count * 3),
    colors: new Float32Array(count * 3)
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const positions = particles.current.positions
    const colors = particles.current.colors

    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i*3] = Math.sin(phi) * Math.cos(theta) * r
      positions[i*3+1] = Math.sin(phi) * Math.sin(theta) * r
      positions[i*3+2] = Math.cos(phi) * r

      const shade = 0.5 + Math.random() * 0.5
      colors[i*3] = shade
      colors[i*3+1] = shade
      colors[i*3+2] = shade
    }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return

    const time = clock.current.getElapsedTime()
    const geometry = pointsRef.current.geometry
    const positionAttribute = geometry.attributes.position
    const positions = positionAttribute.array as Float32Array
    const mouse = mouseRef.current

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = positions[i3]
      const y = positions[i3+1]
      const z = positions[i3+2]

      const dx = x + mouse.x * 1.5
      const dy = y + mouse.y * 1.5
      const dz = z + Math.sin(time * 0.2 + x) * 0.1

      positions[i3] += dx * 0.001
      positions[i3+1] += dy * 0.001
      positions[i3+2] += (dz - positions[i3+2]) * 0.001

      const dist = Math.sqrt(x*x + y*y + z*z)
      if (dist > 8) {
        positions[i3] *= 0.99
        positions[i3+1] *= 0.99
        positions[i3+2] *= 0.99
      }
    }

    positionAttribute.needsUpdate = true
    pointsRef.current.rotation.y += 0.0005
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.current.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.current.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.8}
      />
    </points>
  )
}

function Navbar({ page, setPage }: { page: string, setPage: (p: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6"
    >
      <div className={`mx-auto max-w-7xl mt-4 border-2 border-black transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl' : 'bg-black/80 backdrop-blur-md'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => setPage("home")} className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 overflow-hidden shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] group-hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] transition-all">
              <img
                src={LOGO_URL}
                alt="XZX"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </div>
            <span className="logo-text text-white text-2xl font-display font-bold tracking-widest">
              XZX <span className="text-gray-400">HUB</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {[["home","Home"],["scripts","Scripts"],["updates","Updates"]].map(([p, label]) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`relative font-display font-bold text-sm tracking-widest transition-colors ${
                  page === p ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {label}
                {page === p && (
                  <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage("scripts")}
            className="hidden md:block bg-white text-black font-display font-bold text-sm tracking-widest px-6 py-2 border-2 border-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)]"
          >
            GET SCRIPTS
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
          >
            {mobileOpen ? <XIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t-2 border-black"
            >
              <div className="flex flex-col gap-4 px-6 py-4">
                {[["home","Home"],["scripts","Scripts"],["updates","Updates"]].map(([p, label]) => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); setMobileOpen(false) }}
                    className={`text-left font-display font-semibold text-sm tracking-wider ${
                      page === p ? 'text-white' : 'text-gray-400'
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

function HomePage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <Suspense fallback={null}>
              <ParticleField />
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-black border-2 border-white/20 px-6 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-display font-bold text-xs tracking-widest text-gray-300">
              ALL SCRIPTS UNDETECTED — UPDATED DAILY
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="flex justify-center mb-8"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]">
              <img
                src={LOGO_URL}
                alt="XZX HUB"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40" />
              {/* Gallery Corner Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/60 -translate-x-1 -translate-y-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/60 translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/60 -translate-x-1 translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/60 translate-x-1 translate-y-1"></div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-7xl md:text-8xl font-bold leading-[1.1] mb-6"
          >
            <span className="text-white">XZX HUB:</span>
            <br />
            <span className="text-gray-400">Powering Your</span>
            <br />
            <span className="text-white">Gameplay.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto mb-10"
          >
            Elite Roblox scripts engineered for performance. Stay ahead of every update. Execute with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => setPage("scripts")}
              className="bg-white text-black font-display font-bold text-sm tracking-widest px-8 py-3 border-2 border-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] flex items-center gap-2 group"
            >
              VIEW SCRIPTS <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent text-white border-2 border-white font-display font-bold text-sm tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-all flex items-center gap-2">
              <ExternalLink size={16} /> JOIN DISCORD
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-12 justify-center mt-16"
          >
            {[["50+","Scripts"],["99.9%","Uptime"],["10K+","Users"],["24h","Updates"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-4xl font-bold text-white">{val}</div>
                <div className="text-xs tracking-widest text-gray-400 font-display font-semibold mt-2">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        {/* Gallery Corner Brackets for the whole section */}
        <div className="absolute top-0 left-6 w-8 h-8 border-t-2 border-l-2 border-white/40 -translate-x-2 -translate-y-2"></div>
        <div className="absolute top-0 right-6 w-8 h-8 border-t-2 border-r-2 border-white/40 translate-x-2 -translate-y-2"></div>
        <div className="absolute bottom-0 left-6 w-8 h-8 border-b-2 border-l-2 border-white/40 -translate-x-2 translate-y-2"></div>
        <div className="absolute bottom-0 right-6 w-8 h-8 border-b-2 border-r-2 border-white/40 translate-x-2 translate-y-2"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <span className="font-display text-xs tracking-widest text-gray-400 border-2 border-white/20 px-3 py-1">
              ABOUT US
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mt-6 mb-4 leading-[1.2]">
              Built by Players,<br /><span className="text-gray-400">For Players.</span>
            </h2>
            <p className="text-gray-400 text-base mb-4 leading-relaxed">
              XZX HUB is a team of dedicated developers obsessed with crafting the cleanest, fastest, and most reliable Roblox scripts available anywhere.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              Every script is hand-coded, tested across servers, and updated within hours of game patches. We don&apos;t cut corners.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Code2 size={20} />, label: "Clean Code", sub: "No bloat. Pure performance." },
              { icon: <Shield size={20} />, label: "Undetected", sub: "Bypass detection systems." },
              { icon: <RefreshCw size={20} />, label: "Daily Updates", sub: "Patch-proof within 24h." },
              { icon: <Star size={20} />, label: "Premium QA", sub: "Every script tested live." },
            ].map(({ icon, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black border-2 border-white/20 p-5 hover:border-white hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)]"
              >
                <div className="text-white mb-3">{icon}</div>
                <div className="font-display font-bold text-sm text-white mb-1">{label}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-display text-xs tracking-widest text-gray-400 border-2 border-white/20 px-3 py-1">
            OUR STRENGTHS
          </span>
          <h2 className="font-display text-5xl font-bold text-white mt-6">
            Why Choose XZX HUB?
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Zap size={28} />, title: "Fast Execution", sub: "Optimized script loader that injects in under 200ms. Zero lag. Zero stuttering." },
            { icon: <RefreshCw size={28} />, title: "Frequent Updates", sub: "Our team monitors game patches 24/7. Scripts are hot-fixed within hours." },
            { icon: <Shield size={28} />, title: "Undetected", sub: "Advanced anti-detection layers built into every script. Your account stays safe." },
          ].map(({ icon, title, sub }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-black border-2 border-white/20 p-8 hover:border-white hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)]"
            >
              <div className="w-14 h-14 bg-white/10 border-2 border-white/20 flex items-center justify-center text-white mb-6">
                {icon}
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-black border-2 border-white/30 p-16 text-center relative shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]"
        >
          {/* Gallery Corner Brackets for the CTA */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/60 -translate-x-2 -translate-y-2"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/60 translate-x-2 -translate-y-2"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/60 -translate-x-2 translate-y-2"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/60 translate-x-2 translate-y-2"></div>
          
          <h2 className="font-display text-5xl font-bold text-white mb-4">
            Ready to <span className="text-gray-400">Dominate?</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Browse our full script library and elevate your gameplay today.
          </p>
          <button
            onClick={() => setPage("scripts")}
            className="bg-white text-black font-display font-bold text-sm tracking-widest px-12 py-4 border-2 border-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] inline-flex items-center gap-2 group"
          >
            BROWSE SCRIPTS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.game.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const catIcons: Record<string, JSX.Element> = { Combat: <Sword size={12} />, Farming: <Wheat size={12} />, Utility: <Wrench size={12} /> }

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="font-display text-xs tracking-widest text-gray-400 border-2 border-white/20 px-3 py-1">
          SCRIPT VAULT
        </span>
        <h1 className="font-display text-6xl font-bold text-white mt-6 mb-3">Script Library</h1>
        <p className="text-gray-400">{SCRIPTS.length} scripts available — all tested and undetected.</p>
      </motion.div>

      <div className="flex flex-wrap gap-4 mb-10">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full bg-black border-2 border-white/20 py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-white focus:outline-none transition-colors"
            placeholder="Search scripts or games..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`font-display font-bold text-xs tracking-widest px-5 py-2 border-2 transition-all ${
                category === cat
                  ? 'bg-white text-black border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]'
                  : 'bg-transparent text-gray-400 border-white/20 hover:border-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-black border-2 border-white/20 overflow-hidden hover:border-white hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)]"
            >
              <div className="h-32 bg-black/80 relative flex items-center justify-center border-b-2 border-white/20">
                <img
                  src={s.thumbnail}
                  alt={s.game}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400/000000/FFFFFF?text=No+Thumbnail";
                  }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <span className="relative z-10 font-display font-bold text-sm tracking-widest text-white uppercase drop-shadow-lg">{s.game}</span>
                <span className="absolute top-3 right-3 font-display font-bold text-[10px] tracking-widest px-2 py-1 border-2 z-10" style={{ backgroundColor: `${s.tagColor}20`, color: s.tagColor, borderColor: `${s.tagColor}40` }}>
                  {s.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-white mb-2">{s.name}</h3>
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center gap-1 text-[10px] tracking-widest text-gray-400 font-display font-semibold">
                    {catIcons[s.category]} {s.category.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] tracking-wider text-gray-400 font-display">
                    <Clock size={10} /> {s.updated}
                  </span>
                </div>
                <button
                  onClick={() => { setModal(s); setCopied(false) }}
                  className="w-full bg-white text-black font-display font-bold text-xs tracking-widest py-2.5 border-2 border-white hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,0.6)] hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.8)] flex items-center justify-center gap-2"
                >
                  <Code2 size={14} /> GET SCRIPT
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Code2 size={40} className="mx-auto mb-4 text-gray-500" />
          <p className="font-display text-lg font-semibold text-gray-400">No scripts found.</p>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border-2 border-white w-full max-w-lg p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.6)]"
              onClick={e => e.stopPropagation()}
            >
              {/* Gallery Corner Brackets for Modal */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white/60 -translate-x-1 -translate-y-1"></div>
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white/60 translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white/60 -translate-x-1 translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white/60 translate-x-1 translate-y-1"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-display text-[10px] tracking-widest text-gray-400 border-2 border-white/20 px-2 py-0.5">
                    {modal.game}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-white mt-2">{modal.name}</h2>
                </div>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="bg-black/80 border-2 border-white/20 p-4 mb-5 max-h-48 overflow-y-auto">
                <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap">{modal.code}</pre>
              </div>
              <div className="bg-amber-500/10 border-2 border-amber-500/30 p-3 mb-5 flex gap-2">
                <span className="text-amber-500">⚠️</span>
                <span className="text-amber-500/80 text-xs">Use a trusted Roblox executor. XZX HUB is not responsible for misuse.</span>
              </div>
              <button
                onClick={() => handleCopy(modal.code)}
                className={`w-full font-display font-bold text-sm tracking-widest py-3 border-2 transition-all flex items-center justify-center gap-2 ${
                  copied ? 'bg-green-600 text-white border-green-600' : 'bg-white text-black border-white hover:bg-black hover:text-white'
                } shadow-[4px_4px_0px_0px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]`}
              >
                {copied ? <><Check size={16} /> COPIED!</> : <><Copy size={16} /> COPY TO CLIPBOARD</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UpdatesPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <span className="font-display text-xs tracking-widest text-gray-400 border-2 border-white/20 px-3 py-1">
          CHANGELOG
        </span>
        <h1 className="font-display text-6xl font-bold text-white mt-6 mb-3">Updates & News</h1>
        <p className="text-gray-400">Stay in the loop — every patch, every feature, every fix.</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr,320px] gap-12">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
          <div className="space-y-12">
            {CHANGELOG.map((entry, i) => (
              <motion.div
                key={entry.version}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-10"
              >
                <div className="absolute left-[-6px] top-2 w-3 h-3 border-2 border-black" style={{ backgroundColor: entry.labelColor, boxShadow: `0 0 12px ${entry.labelColor}80` }} />
                <div className="bg-black border-2 border-white/20 p-6 hover:border-white/40 transition-all">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-display text-xl font-bold text-white">{entry.version}</span>
                    <span className="font-display text-[10px] tracking-widest px-2 py-0.5 border-2" style={{ backgroundColor: `${entry.labelColor}10`, color: entry.labelColor, borderColor: `${entry.labelColor}30` }}>
                      {entry.label}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] tracking-wider text-gray-400 font-display ml-auto">
                      <Clock size={10} /> {entry.date}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {entry.changes.map((c, idx) => (
                      <li key={idx} className="text-gray-400 text-sm">{c}</li>
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
          <div className="bg-black border-2 border-white/20 p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-white/10 border-2 border-white/20 flex items-center justify-center">
                <RefreshCw size={20} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-white">Auto-Update Active</h3>
            </div>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              XZX HUB scripts update automatically within hours of Roblox patches. No action required.
            </p>
            <div className="h-0.5 bg-white/20 my-5" />
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-widest text-gray-500 font-display">LAST CHECK</span>
              <span className="text-sm text-white font-display font-bold">Just now</span>
            </div>
          </div>
        </motion.div>
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
