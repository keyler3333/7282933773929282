'use client'

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { 
  Zap, RefreshCw, Shield, Search, Copy, Check, X,
  ExternalLink, ChevronRight, Clock, ArrowRight, 
  Star, Code2, Sword, Wheat, Wrench
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

const LOGO = "data:image/png;base64,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"

const SCRIPTS = [
  { id:1, name:"Combat Warriors Auto-Farm", game:"Combat Warriors", category:"Combat", updated:"Apr 18, 2026", tag:"HOT", tagColor:"#ef4444", code:"-- Combat Warriors Auto-Farm v3.2\nlocal Players = game:GetService(\"Players\")\nlocal config = {\n    autoFarm = true,\n    autoCollect = true,\n    safeMode = true\n}\nprint(\"[XZX HUB] Loaded!\")" },
  { id:2, name:"Blox Fruits Devil Fruit Sniper", game:"Blox Fruits", category:"Farming", updated:"Apr 17, 2026", tag:"NEW", tagColor:"#22c55e", code:"-- Blox Fruits Sniper v1.9\nlocal function snipeFruit()\n    -- XZX HUB Premium\nend\nprint(\"[XZX HUB] Sniper Active!\")" },
  { id:3, name:"Arsenal Aimbot & ESP", game:"Arsenal", category:"Combat", updated:"Apr 16, 2026", tag:"HOT", tagColor:"#ef4444", code:"-- Arsenal ESP v2.5\nlocal ESP = {\n    Enabled = true,\n    BoxESP = true,\n    NameESP = true\n}\nprint(\"[XZX HUB] ESP Loaded!\")" },
  { id:4, name:"Pet Simulator Auto Collect", game:"Pet Simulator 99", category:"Farming", updated:"Apr 15, 2026", tag:"UPDATED", tagColor:"#f59e0b", code:"-- Pet Sim 99 v4.1\nlocal function autoCollect()\n    -- Auto Collect Logic\nend\nprint(\"[XZX HUB] Running!\")" },
  { id:5, name:"Doors Entity ESP & Skip", game:"DOORS", category:"Utility", updated:"Apr 14, 2026", tag:"NEW", tagColor:"#22c55e", code:"-- DOORS Entity Skip v1.2\nlocal config = {\n    EntityESP = true,\n    AutoSkip = true\n}\nprint(\"[XZX HUB] DOORS Active!\")" },
  { id:6, name:"Brookhaven Admin Panel", game:"Brookhaven RP", category:"Utility", updated:"Apr 12, 2026", tag:"STABLE", tagColor:"#6366f1", code:"-- Brookhaven Panel v3.0\nlocal utils = {\n    NoClip = false,\n    Speed = 16,\n    Fly = false\n}\nprint(\"[XZX HUB] Panel Ready!\")" },
]

const CHANGELOG = [
  { version:"v2.5.0", date:"April 18, 2026", label:"MAJOR", labelColor:"#38bdf8", changes:["Added Combat Warriors Auto-Farm with anti-detection","New glassmorphism UI overlay","XZX Executor v4 compatibility layer","Performance up to 40% faster"] },
  { version:"v2.4.3", date:"April 14, 2026", label:"PATCH", labelColor:"#22c55e", changes:["Hotfix: Blox Fruits crash on server hop","Arsenal ESP rendering bug fixed","Mobile UI text rendering fixes"] },
  { version:"v2.4.0", date:"April 9, 2026", label:"UPDATE", labelColor:"#a855f7", changes:["DOORS Entity ESP rewritten from scratch","Brookhaven RP Utility Panel added","Script loader 60% faster","New website launched"] },
  { version:"v2.3.1", date:"March 28, 2026", label:"PATCH", labelColor:"#22c55e", changes:["Pet Simulator 99 updated for latest patch","Fixed memory leak in farm sessions"] },
  { version:"v2.3.0", date:"March 20, 2026", label:"UPDATE", labelColor:"#a855f7", changes:["Introduced XZX Script Vault system","Version badges and timestamps","Discord bot script notifications","5 new scripts added"] },
]

const CATS = ["All","Combat","Farming","Utility"]

function ParticleField() {
  const count = 1000
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const clockRef = useRef(new THREE.Clock())
  const posRef = useRef(new Float32Array(count * 3))
  const colRef = useRef(new Float32Array(count * 3))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)

    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      posRef.current[i*3] = Math.sin(p) * Math.cos(t) * r
      posRef.current[i*3+1] = Math.sin(p) * Math.sin(t) * r
      posRef.current[i*3+2] = Math.cos(p) * r
      const s = 0.5 + Math.random() * 0.5
      colRef.current[i*3] = s
      colRef.current[i*3+1] = s
      colRef.current[i*3+2] = s
    }

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const t = clockRef.current.getElapsedTime()
    const attr = pointsRef.current.geometry.attributes.position
    const a = attr.array as Float32Array
    const m = mouseRef.current

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = a[i3]
      const y = a[i3+1]
      const z = a[i3+2]
      a[i3] += (x + m.x * 1.5) * 0.001
      a[i3+1] += (y + m.y * 1.5) * 0.001
      a[i3+2] += (z + Math.sin(t * 0.2 + x) * 0.1 - z) * 0.001
      if (Math.sqrt(x*x + y*y + z*z) > 8) {
        a[i3] *= 0.99
        a[i3+1] *= 0.99
        a[i3+2] *= 0.99
      }
    }
    attr.needsUpdate = true
    pointsRef.current.rotation.y += 0.0005
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={posRef.current} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colRef.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.8} />
    </points>
  )
}

function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 24px" }
  const innerStyle: React.CSSProperties = {
    maxWidth: 1280, margin: "16px auto 0", borderRadius: 12, transition: "all 0.3s",
    background: scrolled ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.4)",
    backdropFilter: "blur(20px)", border: scrolled ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.05)"
  }

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} style={navStyle}>
      <div style={innerStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px" }}>
          <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
            <img src={LOGO} alt="XZX" style={{ width: 40, height: 40, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }} />
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>XZX <span style={{ color: "#9ca3af" }}>HUB</span></span>
          </button>
          <div style={{ display: "flex", gap: 32 }}>
            {[["home","Home"],["scripts","Scripts"],["updates","Updates"]].map(([p, l]) => (
              <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? "#fff" : "#9ca3af", fontWeight: 600, fontSize: 13, letterSpacing: 1, position: "relative", padding: "4px 0" }}>
                {l}
                {page === p && <motion.div layoutId="nav" style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 2, background: "#fff" }} />}
              </button>
            ))}
          </div>
          <button onClick={() => setPage("scripts")} style={{ background: "#fff", color: "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, letterSpacing: 1, padding: "8px 20px", borderRadius: 8 }}>Get Scripts</button>
        </div>
      </div>
    </motion.nav>
  )
}

function HomePage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <Suspense fallback={null}><ParticleField /></Suspense>
          </Canvas>
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom,rgba(0,0,0,0.6),rgba(0,0,0,0.3),#000)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", textAlign: "center", padding: "80px 24px 0" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "8px 16px", marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ color: "#d1d5db", fontSize: 11, fontWeight: 600, letterSpacing: 2 }}>ALL SCRIPTS UNDETECTED — UPDATED DAILY</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.05 }} style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <img src={LOGO} alt="XZX" style={{ width: 120, height: 120, objectFit: "contain", filter: "drop-shadow(0 0 50px rgba(255,255,255,0.15))" }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} style={{ fontSize: "clamp(44px,8vw,88px)", fontWeight: 700, lineHeight: 1.0, marginBottom: 24, color: "#fff" }}>
            XZX HUB:<br /><span style={{ color: "#6b7280" }}>Powering Your</span><br />Gameplay.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ color: "#9ca3af", fontSize: 18, maxWidth: 480, margin: "0 auto 40px" }}>
            Elite Roblox scripts engineered for performance. Stay ahead of every update.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("scripts")} style={{ background: "#fff", color: "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, letterSpacing: 1, padding: "12px 32px", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              View Scripts <ChevronRight size={16} />
            </button>
            <button style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontWeight: 700, fontSize: 13, letterSpacing: 1, padding: "12px 32px", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <ExternalLink size={16} /> Join Discord
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap", marginTop: 64 }}>
            {[["50+","Scripts"],["99.9%","Uptime"],["10K+","Users"],["24h","Updates"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{v}</div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#6b7280", fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "96px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 11, letterSpacing: 2, color: "#6b7280", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 999 }}>ABOUT US</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", marginTop: 24, marginBottom: 16, lineHeight: 1.1 }}>Built by Players,<br /><span style={{ color: "#6b7280" }}>For Players.</span></h2>
            <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 12 }}>XZX HUB is a team of dedicated developers obsessed with crafting the cleanest, fastest Roblox scripts available anywhere.</p>
            <p style={{ color: "#6b7280", lineHeight: 1.7 }}>Every script is hand-coded, tested across servers, and updated within hours of game patches.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[{ icon: <Code2 size={20} />, l: "Clean Code", s: "No bloat. Pure performance." }, { icon: <Shield size={20} />, l: "Undetected", s: "Bypass detection systems." }, { icon: <RefreshCw size={20} />, l: "Daily Updates", s: "Patch-proof within 24h." }, { icon: <Star size={20} />, l: "Premium QA", s: "Every script tested live." }].map(({ icon, l, s }, i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20 }}>
                <div style={{ color: "#fff", marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{s}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 11, letterSpacing: 2, color: "#6b7280", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 999 }}>OUR STRENGTHS</span>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: "#fff", marginTop: 24 }}>Why Choose XZX HUB?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {[{ icon: <Zap size={28} />, t: "Fast Execution", s: "Optimized loader injects in under 200ms. Zero lag." }, { icon: <RefreshCw size={28} />, t: "Frequent Updates", s: "Team monitors patches 24/7. Hot-fixed within hours." }, { icon: <Shield size={28} />, t: "Undetected", s: "Advanced anti-detection layers in every script." }].map(({ icon, t, s }, i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 32 }}>
              <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.05)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 24 }}>{icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{t}</h3>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{s}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: "96px 24px", maxWidth: 900, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "80px 48px", textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Ready to <span style={{ color: "#6b7280" }}>Dominate?</span></h2>
          <p style={{ color: "#6b7280", marginBottom: 32 }}>Browse our full script library and elevate your gameplay today.</p>
          <button onClick={() => setPage("scripts")} style={{ background: "#fff", color: "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, letterSpacing: 1, padding: "16px 40px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 8 }}>
            Browse Scripts <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>
    </div>
  )
}

function ScriptsPage() {
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("All")
  const [modal, setModal] = useState<typeof SCRIPTS[0] | null>(null)
  const [copied, setCopied] = useState(false)

  const filtered = SCRIPTS.filter(s => (cat === "All" || s.category === cat) && (s.name.toLowerCase().includes(search.toLowerCase()) || s.game.toLowerCase().includes(search.toLowerCase())))

  const copyFn = (code: string) => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const catIcon: Record<string, JSX.Element> = { Combat: <Sword size={12} />, Farming: <Wheat size={12} />, Utility: <Wrench size={12} /> }

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "112px 24px 64px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 11, letterSpacing: 2, color: "#6b7280", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 999 }}>SCRIPT VAULT</span>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginTop: 24, marginBottom: 8 }}>Script Library</h1>
          <p style={{ color: "#6b7280" }}>{SCRIPTS.length} scripts available — all tested and undetected.</p>
        </motion.div>

        <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
            <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
            <input style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px 12px 44px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} placeholder="Search scripts or games..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? "#fff" : "transparent", color: cat === c ? "#000" : "#9ca3af", border: cat === c ? "1px solid #fff" : "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontWeight: 600, fontSize: 12, letterSpacing: 1, padding: "8px 16px", borderRadius: 8 }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          <AnimatePresence>
            {filtered.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ height: 100, background: "rgba(0,0,0,0.6)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,0,0,0.6))" }} />
                  <span style={{ position: "relative", zIndex: 1, fontWeight: 700, fontSize: 12, letterSpacing: 2, color: "#fff" }}>{s.game.toUpperCase()}</span>
                  <span style={{ position: "absolute", top: 12, right: 12, fontWeight: 700, fontSize: 10, letterSpacing: 1, padding: "2px 8px", borderRadius: 4, border: "1px solid " + s.tagColor + "30", background: s.tagColor + "15", color: s.tagColor, zIndex: 1 }}>{s.tag}</span>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 8 }}>{s.name}</h3>
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, letterSpacing: 1, color: "#6b7280", fontWeight: 600 }}>{catIcon[s.category]} {s.category.toUpperCase()}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b7280" }}><Clock size={10} /> {s.updated}</span>
                  </div>
                  <button onClick={() => { setModal(s); setCopied(false) }} style={{ width: "100%", background: "#fff", color: "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, letterSpacing: 1, padding: "10px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Code2 size={14} /> Get Script
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "80px 0" }}><Code2 size={40} style={{ margin: "0 auto 16px", color: "#4b5563", display: "block" }} /><p style={{ color: "#6b7280", fontSize: 18, fontWeight: 600 }}>No scripts found.</p></div>}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, width: "100%", maxWidth: 520, padding: 32, boxShadow: "0 25px 60px rgba(0,0,0,0.8)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: 2, color: "#6b7280", border: "1px solid rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: 4 }}>{modal.game}</span>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginTop: 8, marginBottom: 0 }}>{modal.name}</h2>
                </div>
                <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}><X size={18} /></button>
              </div>
              <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 16, marginBottom: 20, maxHeight: 180, overflowY: "auto" }}>
                <pre style={{ fontFamily: "monospace", fontSize: 12, color: "#d1d5db", whiteSpace: "pre-wrap", margin: 0 }}>{modal.code}</pre>
              </div>
              <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: 12, marginBottom: 20, display: "flex", gap: 8 }}>
                <span>⚠️</span>
                <span style={{ color: "rgba(245,158,11,0.8)", fontSize: 12 }}>Use a trusted executor. XZX HUB is not responsible for misuse.</span>
              </div>
              <button onClick={() => copyFn(modal.code)} style={{ width: "100%", background: copied ? "#16a34a" : "#fff", color: copied ? "#fff" : "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, letterSpacing: 1, padding: "14px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy to Clipboard</>}
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
    <div style={{ minHeight: "100vh", background: "#000", padding: "112px 24px 64px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 64 }}>
          <span style={{ fontSize: 11, letterSpacing: 2, color: "#6b7280", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 999 }}>CHANGELOG</span>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginTop: 24, marginBottom: 8 }}>Updates & News</h1>
          <p style={{ color: "#6b7280" }}>Stay in the loop — every patch, every feature, every fix.</p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom,rgba(255,255,255,0.3),rgba(255,255,255,0.05),transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {CHANGELOG.map((e, i) => (
                <motion.div key={e.version} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ position: "relative", paddingLeft: 40 }}>
                  <div style={{ position: "absolute", left: -5, top: 8, width: 10, height: 10, borderRadius: "50%", border: "2px solid #000", background: e.labelColor, boxShadow: "0 0 12px " + e.labelColor + "80" }} />
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 24 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{e.version}</span>
                      <span style={{ fontSize: 10, letterSpacing: 2, padding: "2px 8px", borderRadius: 4, border: "1px solid " + e.labelColor + "30", background: e.labelColor + "10", color: e.labelColor }}>{e.label}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b7280", marginLeft: "auto" }}><Clock size={10} /> {e.date}</span>
                    </div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      {e.changes.map((c, idx) => (
                        <li key={idx} style={{ color: "#6b7280", fontSize: 14, display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: e.labelColor, marginTop: 2 }}>›</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [page, setPage] = useState("home")
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "scripts" && <ScriptsPage />}
      {page === "updates" && <UpdatesPage />}
    </div>
  )
}
