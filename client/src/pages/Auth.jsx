import { useState } from "react";

/* ─────────────────────────────────────────
   INLINE STYLES  (mirrors your index.css tokens)
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c28;
    --border: rgba(255,255,255,0.07);
    --accent: #7c6aff;
    --accent2: #e45fff;
    --accent-glow: rgba(124,106,255,0.35);
    --text: #f0eeff;
    --muted: #8884a8;
    --error: #ff6b6b;
    --success: #4ade80;
    --nav-h: 68px;
    --radius: 14px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }

  /* ── LAYOUT ── */
  .auth-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }
  @media (max-width: 860px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-panel { display: none !important; }
  }

  /* ── LEFT PANEL ── */
  .auth-panel {
    position: relative;
    background: linear-gradient(145deg, #0d0b1e 0%, #130f2a 40%, #1a0a2e 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 52px;
    overflow: hidden;
  }
  .auth-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 30%, rgba(124,106,255,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 80% 70%, rgba(228,95,255,0.12) 0%, transparent 55%);
    pointer-events: none;
  }
  .panel-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(124,106,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,106,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .panel-logo {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo-mark {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 17px;
    color: #fff;
    box-shadow: 0 0 24px var(--accent-glow);
  }
  .logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 22px;
    letter-spacing: -0.5px;
    color: var(--text);
  }
  .logo-name span { color: var(--accent); }

  .panel-copy { position: relative; }
  .panel-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }
  .panel-eyebrow::before {
    content: ''; display: block;
    width: 20px; height: 2px;
    background: var(--accent); border-radius: 2px;
  }
  .panel-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3vw, 42px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1px;
    color: var(--text);
    margin-bottom: 16px;
  }
  .panel-headline em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .panel-sub {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 340px;
  }

  .panel-stats {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(124,106,255,0.15);
    border-radius: 14px;
    padding: 18px 20px;
    backdrop-filter: blur(10px);
  }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.5px;
  }
  .stat-label {
    font-size: 11.5px;
    color: var(--muted);
    margin-top: 4px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  /* ── RIGHT (FORM) SIDE ── */
  .auth-form-side {
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    position: relative;
  }
  .auth-form-side::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.3;
  }

  .auth-box {
    width: 100%;
    max-width: 440px;
  }

  /* mobile logo */
  .mobile-logo {
    display: none;
    align-items: center;
    gap: 10px;
    margin-bottom: 36px;
  }
  @media (max-width: 860px) {
    .mobile-logo { display: flex; }
  }

  .auth-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(24px, 3.5vw, 32px);
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--text);
    margin-bottom: 6px;
  }
  .auth-sub {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  /* ── FORM FIELDS ── */
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
  }
  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
  .field-wrap { position: relative; }
  .field-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
    display: flex;
    transition: color 0.2s;
  }
  .field-input {
    width: 100%;
    padding: 13px 16px 13px 42px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }
  .field-input::placeholder { color: rgba(136,132,168,0.5); }
  .field-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(124,106,255,0.12);
  }
  .field-wrap:focus-within .field-icon { color: var(--accent); }
  .field-input.error { border-color: var(--error); }
  .field-error { font-size: 11.5px; color: var(--error); font-weight: 500; }

  /* password toggle */
  .pw-toggle {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    cursor: pointer;
    color: var(--muted);
    display: flex;
    transition: color 0.2s;
    padding: 0;
  }
  .pw-toggle:hover { color: var(--text); }

  /* strength meter */
  .strength-bar {
    display: flex; gap: 4px; margin-top: 6px;
  }
  .strength-seg {
    flex: 1; height: 3px; border-radius: 2px;
    background: var(--border);
    transition: background 0.3s;
  }
  .strength-seg.weak { background: #ff6b6b; }
  .strength-seg.fair { background: #fbbf24; }
  .strength-seg.good { background: #34d399; }
  .strength-label { font-size: 11px; color: var(--muted); margin-top: 4px; }

  /* ── SUBMIT ── */
  .submit-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px var(--accent-glow);
    margin-top: 8px;
    letter-spacing: 0.3px;
  }
  .submit-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 32px var(--accent-glow);
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── DIVIDER ── */
  .auth-switch {
    text-align: center;
    margin-top: 24px;
    font-size: 13.5px;
    color: var(--muted);
  }
  .auth-switch button {
    background: none; border: none;
    color: var(--accent);
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    transition: opacity 0.2s;
    padding: 0;
    margin-left: 4px;
  }
  .auth-switch button:hover { opacity: 0.75; }

  /* ── SUCCESS ── */
  .success-wrap {
    text-align: center;
    padding: 32px 0;
    animation: fadeUp 0.4s ease both;
  }
  .success-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: rgba(74,222,128,0.1);
    border: 2px solid rgba(74,222,128,0.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes popIn {
    from { transform: scale(0.4); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .success-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px; font-weight: 800;
    color: var(--text); margin-bottom: 8px;
  }
  .success-sub { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 24px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.4s ease both; }

  /* ── PROGRESS SEGMENTS ── */
  .tab-row {
    display: flex;
    gap: 6px;
    margin-bottom: 28px;
  }
  .tab-seg {
    flex: 1; height: 3px; border-radius: 2px;
    background: var(--border);
    transition: background 0.35s;
  }
  .tab-seg.active { background: linear-gradient(90deg, var(--accent), var(--accent2)); }

  /* ── BADGE ── */
  .admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: rgba(124,106,255,0.12);
    border: 1px solid rgba(124,106,255,0.25);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }
  .admin-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
  }

  /* ── REMEMBER / FORGOT ── */
  .form-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .remember {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: var(--muted); cursor: pointer;
    user-select: none;
  }
  .remember input { accent-color: var(--accent); cursor: pointer; }
  .forgot {
    font-size: 13px; color: var(--accent);
    background: none; border: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    transition: opacity 0.2s;
    padding: 0;
  }
  .forgot:hover { opacity: 0.7; }

  @keyframes progress { from { width: 0% } to { width: 100% } }
`;

/* ─────── SVG ICONS ─────── */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = ({ off }) => off ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconShield = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ─────── PASSWORD STRENGTH ─────── */
function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_CLASSES = ['', 'weak', 'fair', 'good', 'good'];

/* ─────── LEFT PANEL ─────── */
function Panel({ mode }) {
  const stats = [
    { num: "12k+", label: "Leads Managed" },
    { num: "94%",  label: "Conversion Rate" },
    { num: "3.2x", label: "Pipeline Growth" },
    { num: "48hr", label: "Avg. Response" },
  ];

  return (
    <div className="auth-panel">
      <div className="panel-grid" />

      <div className="panel-logo">
        <div className="logo-mark">LT</div>
        <div className="logo-name">Lead<span>Trackr</span></div>
      </div>

      <div className="panel-copy">
        <div className="panel-eyebrow">Admin Portal</div>
        <h2 className="panel-headline">
          {mode === "login"
            ? <><span>Your leads,</span><br /><em>intelligently</em><br />tracked.</>
            : <><span>Start tracking</span><br /><em>smarter,</em><br />not harder.</>}
        </h2>
        <p className="panel-sub">
          {mode === "login"
            ? "Access your dashboard to manage leads, track conversions, and grow your pipeline with real-time insights."
            : "Set up your admin account to get full control over your lead management workspace."}
        </p>
      </div>

      <div className="panel-stats">
        {stats.map(({ num, label }) => (
          <div className="stat-card" key={label}>
            <div className="stat-num">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────── REGISTER FORM ─────── */
function RegisterForm({ onSwitch }) {
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const strength = getStrength(form.password);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Minimum 8 characters required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setDone(true);
  };

  if (done) return (
    <div className="success-wrap">
      <div className="success-icon"><IconCheck /></div>
      <div className="success-title">Account Created!</div>
      <p className="success-sub">Welcome to LeadTrackr, {form.name.split(" ")[0]}.<br />Your admin account is ready to use.</p>
      <button className="submit-btn" style={{ maxWidth: 220, margin: "0 auto" }} onClick={onSwitch}>
        Sign In Now <IconArrow />
      </button>
    </div>
  );

  return (
    <div className="fade-up">
      <div className="admin-badge"><IconShield /> Admin Registration</div>
      <h1 className="auth-heading">Create Account</h1>
      <p className="auth-sub">Set up your LeadTrackr admin workspace.</p>

      <div className="tab-row">
        {[1, 2, 3].map(i => <div key={i} className={`tab-seg ${i === 1 ? "active" : ""}`} />)}
      </div>

      {/* Full Name */}
      <div className="field">
        <label className="field-label">Full Name</label>
        <div className="field-wrap">
          <input
            className={`field-input${errors.name ? " error" : ""}`}
            placeholder="Jane Doe"
            value={form.name}
            onChange={e => set("name", e.target.value)}
          />
          <span className="field-icon"><IconUser /></span>
        </div>
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      {/* Email */}
      <div className="field">
        <label className="field-label">Email Address</label>
        <div className="field-wrap">
          <input
            className={`field-input${errors.email ? " error" : ""}`}
            placeholder="admin@company.com"
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
          />
          <span className="field-icon"><IconMail /></span>
        </div>
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="field">
        <label className="field-label">Password</label>
        <div className="field-wrap">
          <input
            className={`field-input${errors.password ? " error" : ""}`}
            placeholder="Min. 8 characters"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={e => set("password", e.target.value)}
          />
          <span className="field-icon"><IconLock /></span>
          <button className="pw-toggle" type="button" onClick={() => setShowPw(v => !v)}>
            <IconEye off={showPw} />
          </button>
        </div>
        {form.password && (
          <>
            <div className="strength-bar">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`strength-seg${i <= strength ? " " + STRENGTH_CLASSES[strength] : ""}`} />
              ))}
            </div>
            <div className="strength-label">{STRENGTH_LABELS[strength]} password</div>
          </>
        )}
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading
          ? <><div className="spinner" /> Creating Account…</>
          : <>Create Admin Account <IconArrow /></>}
      </button>

      <div className="auth-switch">
        Already have an account?
        <button onClick={onSwitch}>Sign in</button>
      </div>
    </div>
  );
}

/* ─────── LOGIN FORM ─────── */
function LoginForm({ onSwitch }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [remember, setRemember] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setDone(true);
  };

  if (done) return (
    <div className="success-wrap">
      <div className="success-icon"><IconCheck /></div>
      <div className="success-title">Welcome Back!</div>
      <p className="success-sub">You've signed in successfully.<br />Redirecting to your dashboard…</p>
      <div style={{ width: "100%", height: 3, borderRadius: 2, background: "var(--border)", marginTop: 16, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, var(--accent), var(--accent2))", animation: "progress 1.4s ease forwards" }} />
      </div>
    </div>
  );

  return (
    <div className="fade-up">
      <div className="admin-badge"><IconShield /> Admin Access</div>
      <h1 className="auth-heading">Welcome Back</h1>
      <p className="auth-sub">Sign in to your LeadTrackr admin panel.</p>

      {/* Email */}
      <div className="field">
        <label className="field-label">Email Address</label>
        <div className="field-wrap">
          <input
            className={`field-input${errors.email ? " error" : ""}`}
            placeholder="admin@company.com"
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
          />
          <span className="field-icon"><IconMail /></span>
        </div>
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="field">
        <label className="field-label">Password</label>
        <div className="field-wrap">
          <input
            className={`field-input${errors.password ? " error" : ""}`}
            placeholder="Enter your password"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={e => set("password", e.target.value)}
          />
          <span className="field-icon"><IconLock /></span>
          <button className="pw-toggle" type="button" onClick={() => setShowPw(v => !v)}>
            <IconEye off={showPw} />
          </button>
        </div>
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <div className="form-meta">
        <label className="remember">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          Remember me
        </label>
        <button className="forgot">Forgot password?</button>
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading
          ? <><div className="spinner" /> Signing In…</>
          : <>Sign In to Dashboard <IconArrow /></>}
      </button>

      <div className="auth-switch">
        Don't have an account?
        <button onClick={onSwitch}>Register now</button>
      </div>
    </div>
  );
}

/* ─────── ROOT EXPORT ─────── */
export default function AdminAuth() {
  const [mode, setMode] = useState("login");

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-root">
        <Panel mode={mode} />

        <div className="auth-form-side">
          <div className="auth-box">
            {/* Mobile-only logo */}
            <div className="mobile-logo">
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #7c6aff, #e45fff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14
              }}>LT</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)" }}>
                Lead<span style={{ color: "var(--accent)" }}>Trackr</span>
              </div>
            </div>

            {mode === "login"
              ? <LoginForm    onSwitch={() => setMode("register")} />
              : <RegisterForm onSwitch={() => setMode("login")} />}
          </div>
        </div>
      </div>
    </>
  );
}