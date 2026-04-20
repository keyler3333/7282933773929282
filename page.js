'use client'

import { useState, useEffect } from "react"
import {
  Zap, RefreshCw, Shield, Search, Copy, Check, X,
  ExternalLink, ChevronRight, Menu, XIcon, Clock,
  Youtube, Twitter, MessageCircle, ArrowRight, Star,
  Code2, Sword, Wheat, Wrench, Bell
} from "lucide-react"

const SCRIPTS = [
  {
    id: 1, name: "Combat Warriors Auto-Farm", game: "Combat Warriors",
    category: "Combat", updated: "Apr 18, 2026", tag: "HOT", tagColor: "#ef4444",
    code: `-- Combat Warriors Auto-Farm v3.2\nlocal Players = game:GetService("Players")\nlocal LocalPlayer = Players.LocalPlayer\n\nlocal config = {\n    autoFarm = true,\n    autoCollect = true,\n    safeMode = true\n}\n\nprint("[XZX HUB] Script Loaded Successfully!")`
  },
  {
    id: 2, name: "Blox Fruits Devil Fruit Sniper", game: "Blox Fruits",
    category: "Farming", updated: "Apr 17, 2026", tag: "NEW", tagColor: "#22c55e",
    code: `-- Blox Fruits Devil Fruit Sniper v1.9\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\n\nlocal function snipeFruit()\n    -- XZX HUB Premium Script\nend\n\nprint("[XZX HUB] Devil Fruit Sniper Active!")`
  },
  {
    id: 3, name: "Arsenal Aimbot & ESP", game: "Arsenal",
    category: "Combat", updated: "Apr 16, 2026", tag: "HOT", tagColor: "#ef4444",
    code: `-- Arsenal Premium ESP v2.5\nlocal RunService = game:GetService("RunService")\n\nlocal ESP = {\n    Enabled = true,\n    BoxESP = true,\n    NameESP = true,\n    HealthBar = true\n}\n\nprint("[XZX HUB] ESP Loaded!")`
  },
  {
    id: 4, name: "Pet Simulator Auto Collect", game: "Pet Simulator 99",
    category: "Farming", updated: "Apr 15, 2026", tag: "UPDATED", tagColor: "#f59e0b",
    code: `-- Pet Sim 99 Auto Collect v4.1\nlocal TweenService = game:GetService("TweenService")\n\nlocal function autoCollect()\n    -- XZX HUB Auto Collect Logic\nend\n\nprint("[XZX HUB] Auto Collect Running!")`
  },
  {
    id: 5, name: "Doors Entity ESP & Skip", game: "DOORS",
    category: "Utility", updated: "Apr 14, 2026", tag: "NEW", tagColor: "#22c55e",
    code: `-- DOORS Entity Skip v1.2\nlocal Players = game:GetService("Players")\n\nlocal config = {\n    EntityESP = true,\n    AutoSkip = true,\n    HideCloset = false\n}\n\nprint("[XZX HUB] DOORS Script Active!")`
  },
  {
    id: 6, name: "Brookhaven Admin Panel", game: "Brookhaven RP",
    category: "Utility", updated: "Apr 12, 2026", tag: "STABLE", tagColor: "#6366f1",
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

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar({ page, setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 24px" }}>
      <div className="glass-heavy" style={{
        maxWidth: 1100, margin: "16px auto 0", borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px",
      }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: "linear-gradient(135deg, #0ea5e9, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(56,189,248,0.4)",
          }}>
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>XZ</span>
          </div>
          <span className="logo-text" style={{ color: "#e2e8f0" }}>
            XZX <span style={{ color: "#38bdf8" }}>HUB</span>
          </span>
        </button>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {[["home","Home"],["scripts","Scripts"],["updates","Updates"]].map(([p, label]) => (
            <button key={p} className={`nav-link${page===p?" active":""}`} onClick={() => setPage(p)}>{label}</button>
          ))}
        </div>

        <button className="btn-primary desktop-nav" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => setPage("scripts")}>
          Get Scripts
        </button>

        <button onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#e2e8f0", display: "none" }}
          className="mobile-menu-btn">
          {mobileOpen ? <XIcon size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="glass-heavy" style={{
          maxWidth: 1100, margin: "8px auto 0", borderRadius: 10, padding: "16px 24px",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          {[["home","Home"],["scripts","Scripts"],["updates","Updates"]].map(([p, label]) => (
            <button key={p} className={`nav-link${page===p?" active":""}`}
              onClick={() => { setPage(p); setMobileOpen(false) }}
              style={{ textAlign: "left", width: "fit-content" }}>{label}</button>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section className="grid-bg" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <div className="hero-orb" style={{ width: 500, height: 500, background: "rgba(56,189,248,0.08)", top: "10%", left: "-10%" }} />
        <div className="hero-orb" style={{ width: 400, height: 400, background: "rgba(168,85,247,0.08)", bottom: "5%", right: "-5%" }} />

        <div style={{ maxWidth: 800, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="anim-fade-up-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div className="glass" style={{ borderRadius: 999, padding: "6px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulse-glow 2s infinite" }} />
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", color: "rgba(226,232,240,0.8)" }}>
                ALL SCRIPTS UNDETECTED — UPDATED DAILY
              </span>
            </div>
          </div>

          <h1 className="font-display anim-fade-up-2" style={{ fontSize: "clamp(44px, 8vw, 84px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 24 }}>
            <span className="shimmer-text">XZX HUB:</span>
            <br />
            <span style={{ color: "#e2e8f0" }}>Powering Your</span>
            <br />
            <span style={{ color: "#e2e8f0" }}>Gameplay.</span>
          </h1>

          <p className="anim-fade-up-3" style={{ fontSize: 17, color: "rgba(226,232,240,0.55)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 40px" }}>
            Elite Roblox scripts engineered for performance. Stay ahead of every update. Execute with confidence.
          </p>

          <div className="anim-fade-up-4" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => setPage("scripts")} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              View Scripts <ChevronRight size={16} />
            </button>
            <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Join Discord <ExternalLink size={14} />
            </button>
          </div>

          <div className="anim-fade-up-5" style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {[["50+","Scripts"],["99.9%","Uptime"],["10K+","Users"],["24h","Updates"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#38bdf8" }}>{val}</div>
                <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(226,232,240,0.4)", marginTop: 4, fontFamily: "Rajdhani, sans-serif", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div className="badge" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)", marginBottom: 16, display: "inline-block" }}>
              ABOUT US
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.1, marginBottom: 20 }}>
              Built by Players,<br /><span style={{ color: "#38bdf8" }}>For Players.</span>
            </h2>
            <p style={{ color: "rgba(226,232,240,0.55)", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
              XZX HUB is a team of dedicated developers obsessed with crafting the cleanest, fastest, and most reliable Roblox scripts available anywhere.
            </p>
            <p style={{ color: "rgba(226,232,240,0.55)", lineHeight: 1.8, fontSize: 15 }}>
              Every script is hand-coded, tested across servers, and updated within hours of game patches. We don't cut corners.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { icon: <Code2 size={20} />, label: "Clean Code", sub: "No bloat. Pure performance." },
              { icon: <Shield size={20} />, label: "Undetected", sub: "Bypass detection systems." },
              { icon: <RefreshCw size={20} />, label: "Daily Updates", sub: "Patch-proof within 24h." },
              { icon: <Star size={20} />, label: "Premium QA", sub: "Every script tested live." },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="glass feature-card" style={{ borderRadius: 10, padding: 20 }}>
                <div style={{ color: "#38bdf8", marginBottom: 10 }}>{icon}</div>
                <div className="font-display" style={{ fontWeight: 700, fontSize: 15, color: "#e2e8f0", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: "rgba(226,232,240,0.45)" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="badge" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)", marginBottom: 16, display: "inline-block" }}>
            OUR STRENGTHS
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#e2e8f0" }}>
            Why Choose XZX HUB?
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            { icon: <Zap size={28} />, color: "#f59e0b", title: "Fast Execution", sub: "Optimized script loader that injects in under 200ms. Zero lag. Zero stuttering. Just clean execution every single time." },
            { icon: <RefreshCw size={28} />, color: "#38bdf8", title: "Frequent Updates", sub: "Our team monitors game patches 24/7. Scripts are hot-fixed within hours of any Roblox update — you're never left broken." },
            { icon: <Shield size={28} />, color: "#22c55e", title: "Undetected", sub: "Advanced anti-detection layers built into every script. We study bypass techniques continuously to keep your account safe." },
          ].map(({ icon, color, title, sub }) => (
            <div key={title} className="glass feature-card" style={{ borderRadius: 12, padding: "32px 28px" }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, marginBottom: 20, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>{title}</h3>
              <p style={{ color: "rgba(226,232,240,0.5)", lineHeight: 1.7, fontSize: 14 }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ borderRadius: 16, padding: "56px 40px", textAlign: "center", background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(168,85,247,0.08))", border: "1px solid rgba(56,189,248,0.15)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.08), transparent 60%)", pointerEvents: "none" }} />
          <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#e2e8f0", marginBottom: 16, position: "relative" }}>
            Ready to <span style={{ color: "#38bdf8" }}>Dominate?</span>
          </h2>
          <p style={{ color: "rgba(226,232,240,0.5)", marginBottom: 32, fontSize: 15, position: "relative" }}>
            Browse our full script library and elevate your gameplay today.
          </p>
          <button className="btn-primary" onClick={() => setPage("scripts")} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 16, padding: "14px 36px" }}>
            Browse Scripts <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

// ─── SCRIPTS ──────────────────────────────────────────────────────────────────

function ScriptsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [modal, setModal] = useState(null)
  const [copied, setCopied] = useState(false)

  const filtered = SCRIPTS.filter(s => {
    const matchCat = category === "All" || s.category === category
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.game.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const catIcons = { Combat: <Sword size={12} />, Farming: <Wheat size={12} />, Utility: <Wrench size={12} /> }

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 48 }}>
        <div className="badge anim-fade-up-1" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)", marginBottom: 16, display: "inline-block" }}>SCRIPT VAULT</div>
        <h1 className="font-display anim-fade-up-2" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>Script Library</h1>
        <p className="anim-fade-up-3" style={{ color: "rgba(226,232,240,0.5)", fontSize: 15 }}>{SCRIPTS.length} scripts available — all tested and undetected.</p>
      </div>

      <div className="anim-fade-up-3" style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(226,232,240,0.3)", pointerEvents: "none" }} />
          <input className="search-input" placeholder="Search scripts or games..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`tag-btn${category===cat?" active":""}`} onClick={() => setCategory(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {filtered.map((s, i) => (
          <div key={s.id} className="glass script-card" style={{ borderRadius: 12, overflow: "hidden", animationDelay: `${i * 0.06}s` }}>
            <div style={{ height: 120, position: "relative", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2338bdf8' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
              <div className="font-display" style={{ position: "relative", zIndex: 1, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(226,232,240,0.35)", textTransform: "uppercase" }}>{s.game}</div>
              <div className="badge" style={{ position: "absolute", top: 12, right: 12, background: `${s.tagColor}20`, color: s.tagColor, border: `1px solid ${s.tagColor}40` }}>{s.tag}</div>
            </div>
            <div style={{ padding: "20px" }}>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: "#e2e8f0", marginBottom: 8, lineHeight: 1.3 }}>{s.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(226,232,240,0.35)", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, letterSpacing: "0.08em" }}>{catIcons[s.category]} {s.category.toUpperCase()}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(226,232,240,0.35)", fontFamily: "Rajdhani, sans-serif", fontWeight: 600 }}><Clock size={10} /> {s.updated}</span>
              </div>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 8, padding: "10px" }}
                onClick={() => { setModal(s); setCopied(false) }}>
                <Code2 size={14} /> Get Script
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(226,232,240,0.3)" }}>
          <Code2 size={40} style={{ margin: "0 auto 16px", display: "block" }} />
          <p className="font-display" style={{ fontSize: 18, fontWeight: 600 }}>No scripts found.</p>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setModal(null)}>
          <div className="modal-panel glass-heavy" style={{ borderRadius: 14, width: "100%", maxWidth: 560, padding: 32, boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(56,189,248,0.15)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div className="badge" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)", marginBottom: 8, display: "inline-block" }}>{modal.game}</div>
                <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2 }}>{modal.name}</h2>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(226,232,240,0.5)", flexShrink: 0 }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 8, padding: 16, marginBottom: 20, border: "1px solid rgba(255,255,255,0.06)", maxHeight: 200, overflowY: "auto" }}>
              <pre style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 12, color: "rgba(226,232,240,0.7)", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{modal.code}</pre>
            </div>
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 13 }}>⚠️</span>
              <span style={{ fontSize: 12, color: "rgba(245,158,11,0.85)", lineHeight: 1.5 }}>Use a trusted Roblox executor. XZX HUB is not responsible for misuse.</span>
            </div>
            <button className="copy-btn" style={{ width: "100%", justifyContent: "center", background: copied ? "linear-gradient(135deg, #16a34a, #22c55e)" : "linear-gradient(135deg, #0ea5e9, #38bdf8)", color: "#0a0a0a" }}
              onClick={() => handleCopy(modal.code)}>
              {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy to Clipboard</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── UPDATES ──────────────────────────────────────────────────────────────────

function UpdatesPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 64 }}>
        <div className="badge anim-fade-up-1" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)", marginBottom: 16, display: "inline-block" }}>CHANGELOG</div>
        <h1 className="font-display anim-fade-up-2" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>Updates & News</h1>
        <p className="anim-fade-up-3" style={{ color: "rgba(226,232,240,0.5)", fontSize: 15 }}>Stay in the loop — every patch, every feature, every fix.</p>
      </div>

      <div className="updates-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>
        {/* Timeline */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, #38bdf8, #a855f7, rgba(168,85,247,0))" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {CHANGELOG.map((entry, i) => (
              <div key={entry.version} className="timeline-item" style={{ paddingLeft: 40, paddingBottom: 48, position: "relative", animationDelay: `${i * 0.1}s` }}>
                <div style={{ position: "absolute", left: -6, top: 6, width: 13, height: 13, borderRadius: "50%", background: entry.labelColor, boxShadow: `0 0 12px ${entry.labelColor}80`, border: "2px solid #0a0a0a" }} />
                <div className="glass" style={{ borderRadius: 12, padding: "24px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    <span className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>{entry.version}</span>
                    <span className="badge" style={{ background: `${entry.labelColor}18`, color: entry.labelColor, border: `1px solid ${entry.labelColor}35` }}>{entry.label}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(226,232,240,0.35)", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, marginLeft: "auto" }}><Clock size={11} /> {entry.date}</span>
