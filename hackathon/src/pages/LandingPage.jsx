import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Inline CSS ───────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #F8FAFC;
    color: #0F172A;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes countUp {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes drawRing {
    from { stroke-dashoffset: 502; }
    to   { stroke-dashoffset: 125; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.18); }
    50%       { box-shadow: 0 0 0 16px rgba(37,99,235,0); }
  }

  .hero-animate-1 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.1s; }
  .hero-animate-2 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.25s; }
  .hero-animate-3 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.4s; }
  .hero-animate-4 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.55s; }
  .card-float     { animation: float 4.5s ease-in-out infinite; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: #2563EB; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px; font-weight: 600; padding: 14px 28px;
    border: none; border-radius: 12px; cursor: pointer;
    transition: all 0.2s; box-shadow: 0 4px 20px rgba(37,99,235,0.35);
    animation: pulse-glow 2.5s ease-in-out infinite;
  }
  .btn-primary:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(37,99,235,0.45); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px; font-weight: 500; padding: 14px 28px;
    border: 1.5px solid rgba(255,255,255,0.4); border-radius: 12px; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.7); }

  .step-card {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding: 32px 24px; background: #fff; border-radius: 20px;
    border: 1px solid #E2E8F0; flex: 1; transition: transform 0.2s, box-shadow 0.2s;
  }
  .step-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(15,23,42,0.1); }

  .stat-card {
    background: #fff; border-radius: 20px; border: 1px solid #E2E8F0;
    padding: 36px 28px; text-align: center; transition: transform 0.2s;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(15,23,42,0.08); }

  .scheme-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: #fff; border: 1.5px solid #E2E8F0;
    border-radius: 50px; padding: 10px 20px;
    font-size: 14px; font-weight: 600; color: #0F172A;
    box-shadow: 0 2px 8px rgba(15,23,42,0.06);
  }

  .nav-link {
    font-size: 14px; font-weight: 500; color: #64748B;
    text-decoration: none; padding: 6px 4px;
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
  }
  .nav-link:hover { color: #2563EB; border-bottom-color: #2563EB; }
`;

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onGetStarted }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 64, background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0",
      display: "flex", alignItems: "center", padding: "0 40px",
    }}>
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 6.5V13.5L10 18L17 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.8" fill="none"/>
              <path d="M10 7L10 13M7 9.5L13 9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: "#0F172A", letterSpacing: "-0.3px" }}>
            Work<span style={{ color: "#2563EB" }}>Proof</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 32 }}>
          {["How It Works", "Schemes", "About"].map(l => (
            <a key={l} href="#how-it-works" className="nav-link">{l}</a>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button style={{
            background: "none", border: "1.5px solid #E2E8F0", borderRadius: 10,
            padding: "8px 18px", fontSize: 14, fontWeight: 600, color: "#0F172A",
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}
            onMouseOver={e => e.target.style.borderColor = "#2563EB"}
            onMouseOut={e => e.target.style.borderColor = "#E2E8F0"}
            onClick={onGetStarted}
          >Login</button>
          <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 14, animation: "none", boxShadow: "0 2px 12px rgba(37,99,235,0.3)" }}
            onClick={onGetStarted}>
            Get Started →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Score Card Mockup (SVG illustration) ─────────────────────────────────────
function ScoreCardMockup() {
  return (
    <div className="card-float" style={{ position: "relative" }}>
      {/* Glow behind */}
      <div style={{
        position: "absolute", inset: -30, borderRadius: 40,
        background: "radial-gradient(ellipse,rgba(37,99,235,0.22),transparent 70%)",
        filter: "blur(16px)", zIndex: 0,
      }} />

      {/* Main card */}
      <div style={{
        position: "relative", zIndex: 1,
        background: "linear-gradient(145deg,#1E3A5F,#0F172A)",
        borderRadius: 24, padding: "32px 28px", width: 320,
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
      }}>
        {/* Card header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginBottom: 4 }}>WORKPROOF SCORE</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>Ramesh Kumar</p>
          </div>
          <div style={{
            background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)",
            borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#10B981",
          }}>A+</div>
        </div>

        {/* Score ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ position: "relative", width: 140, height: 140 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
              <circle cx="70" cy="70" r="58" fill="none" stroke="#10B981" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="364" strokeDashoffset="72"
                transform="rotate(-90 70 70)"
                style={{ filter: "drop-shadow(0 0 8px rgba(16,185,129,0.6))" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 34, fontWeight: 800, color: "#fff", lineHeight: 1 }}>742</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>out of 850</span>
            </div>
          </div>
        </div>

        {/* Sub-score bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Income", val: 82, color: "#3B82F6" },
            { label: "Spending", val: 74, color: "#8B5CF6" },
            { label: "Savings", val: 68, color: "#10B981" },
            { label: "Network", val: 79, color: "#F59E0B" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 54, fontSize: 11, color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>{s.label}</span>
              <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${s.val}%`, background: s.color, borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: s.color, width: 28, textAlign: "right" }}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Street Vendor · Karnataka</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2563EB" }}>MUDRA Eligible ✓</span>
        </div>
      </div>

      {/* Floating badge */}
      <div style={{
        position: "absolute", bottom: -16, right: -20, zIndex: 2,
        background: "#fff", borderRadius: 12, padding: "10px 16px",
        boxShadow: "0 8px 24px rgba(15,23,42,0.18)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>MUDRA Loan: Up to ₹1L</span>
      </div>
    </div>
  );
}

// ─── Step Item ─────────────────────────────────────────────────────────────────
function StepItem({ emoji, num, title, desc, isLast }) {
  return (
    <>
      <div className="step-card">
        <div style={{
          width: 60, height: 60, borderRadius: 18,
          background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, marginBottom: 16,
        }}>{emoji}</div>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: "#2563EB",
          color: "#fff", fontSize: 12, fontWeight: 700, display: "flex",
          alignItems: "center", justifyContent: "center", marginBottom: 12,
        }}>{num}</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{desc}</p>
      </div>
      {!isLast && (
        <div style={{ display: "flex", alignItems: "center", color: "#CBD5E1", fontSize: 22, flexShrink: 0 }}>→</div>
      )}
    </>
  );
}

// ─── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{globalStyles}</style>
      <Navbar onGetStarted={() => navigate('/login')} />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg,#0F172A 0%,#1E3A5F 55%,#0F2A4A 100%)",
        minHeight: "100vh", paddingTop: 64, display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background texture dots */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Gradient orb */}
        <div style={{
          position: "absolute", top: "15%", right: "5%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(37,99,235,0.18),transparent 65%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px", width: "100%", display: "flex", alignItems: "center", gap: 80 }}>
          {/* Left text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hero-animate-1" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.35)",
              borderRadius: 50, padding: "6px 16px", marginBottom: 28,
            }}>
              <span style={{ fontSize: 16 }}>🇮🇳</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#93C5FD" }}>Built for India's 31 Crore Informal Workers</span>
            </div>

            <h1 className="hero-animate-2" style={{
              fontFamily: "'Sora',sans-serif", fontSize: "clamp(36px,4.5vw,58px)",
              fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 24,
              letterSpacing: "-1px",
            }}>
              Your Work Has Value.<br />
              <span style={{ color: "#60A5FA" }}>Now Prove It.</span>
            </h1>

            <p className="hero-animate-3" style={{
              fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.75,
              marginBottom: 40, maxWidth: 480,
            }}>
              Get your alternate credit score using your UPI history.<br />
              <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>No salary slip needed. No bank visits. 5 minutes.</strong>
            </p>

            <div className="hero-animate-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: "15px 32px" }} onClick={() => navigate('/login')}>
                Get My Score Free →
              </button>
              <button className="btn-outline" onClick={scrollToHowItWorks}>
                ▶ See How It Works
              </button>
            </div>

            {/* Trust indicators */}
            <div className="hero-animate-4" style={{ display: "flex", gap: 28, marginTop: 40, flexWrap: "wrap" }}>
              {["🔒 Aadhaar-secured", "⚡ Results in 5 mins", "🆓 Always free"].map(t => (
                <span key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 6 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right card */}
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", paddingRight: 40 }}>
            <ScoreCardMockup />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: "#fff", padding: "100px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-block", background: "#EFF6FF", borderRadius: 50,
              padding: "6px 18px", fontSize: 13, fontWeight: 700,
              color: "#2563EB", letterSpacing: 1, marginBottom: 16,
            }}>HOW IT WORKS</div>
            <h2 style={{
              fontFamily: "'Sora',sans-serif", fontSize: 38, fontWeight: 800,
              color: "#0F172A", letterSpacing: "-0.5px", marginBottom: 12,
            }}>From Zero to Credit Score in 4 Steps</h2>
            <p style={{ fontSize: 16, color: "#64748B", maxWidth: 500, margin: "0 auto" }}>
              No documents. No branch visits. Just your phone and your work history.
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
            <StepItem emoji="📱" num="1" title="Enter Aadhaar" desc="Your identity anchor — verified securely. No documents uploaded." />
            <StepItem emoji="📄" num="2" title="Upload UPI PDF" desc="Download your statement from PhonePe, GPay, or Paytm in seconds." />
            <StepItem emoji="🤖" num="3" title="AI Scores You" desc="Our algorithm builds your alternate credit profile from transactions." />
            <StepItem emoji="🏦" num="4" title="Get Matched" isLast desc="See exactly which government schemes and loans you qualify for." />
          </div>
        </div>
      </section>

      {/* ── TRUST / STATS ────────────────────────────────────────────────────── */}
      <section style={{ background: "#F1F5F9", padding: "100px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{
              display: "inline-block", background: "#FEF9C3", borderRadius: 50,
              padding: "6px 18px", fontSize: 13, fontWeight: 700,
              color: "#854D0E", letterSpacing: 1, marginBottom: 16,
            }}>THE OPPORTUNITY</div>
            <h2 style={{
              fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 800,
              color: "#0F172A", letterSpacing: "-0.5px",
            }}>A Crisis No One Is Solving</h2>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 60 }}>
            {[
              { num: "31 Crore", label: "Registered informal workers in India", color: "#2563EB", bg: "#EFF6FF" },
              { num: "₹42L Cr", label: "PSL mandate banks need to deploy", color: "#059669", bg: "#ECFDF5" },
              { num: "0 CIBIL", label: "Workers with zero credit history", color: "#DC2626", bg: "#FEF2F2" },
            ].map(s => (
              <div key={s.num} className="stat-card">
                <div style={{
                  display: "inline-block", background: s.bg, borderRadius: 12,
                  padding: "10px 18px", marginBottom: 16,
                }}>
                  <span style={{
                    fontFamily: "'Sora',sans-serif", fontSize: 32, fontWeight: 800, color: s.color,
                  }}>{s.num}</span>
                </div>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Scheme badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <p style={{ width: "100%", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#94A3B8", letterSpacing: 1, marginBottom: 8 }}>SCHEMES WE MATCH YOU WITH</p>
            {[
              { icon: "🏛️", name: "PM SVANidhi", sub: "Up to ₹50,000" },
              { icon: "🏦", name: "MUDRA Loan", sub: "Up to ₹10 Lakh" },
              { icon: "🌾", name: "PMEGP", sub: "Up to ₹50 Lakh" },
            ].map(s => (
              <div key={s.name} className="scheme-badge">
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#1E3A5F,#2563EB)",
        padding: "80px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontSize: 38, fontWeight: 800,
            color: "#fff", marginBottom: 16, letterSpacing: "-0.5px",
          }}>Ready to Build Your Financial Identity?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 36 }}>
            Join thousands of informal workers who've already discovered their credit potential.
          </p>
          <button className="btn-primary" style={{ fontSize: 17, padding: "16px 40px" }} onClick={() => navigate('/login')}>
            Get My Free Score →
          </button>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>
            Takes 5 minutes · No documents needed · 100% free
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#0F172A", padding: "48px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 6.5V13.5L10 18L17 13.5V6.5L10 2Z" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>
                Work<span style={{ color: "#60A5FA" }}>Proof</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Your Financial Identity. Your Power.</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
              ⚠️ Not a government portal. Scores are indicative only.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              © 2024 WorkProof · All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}