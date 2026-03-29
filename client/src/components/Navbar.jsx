import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { adminLogout } from "../store/adminSlice";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userWrapRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isAuthenticated, admin } = useSelector((state) => state.admin);

  const full_name = admin?.full_name || "Admin";
  const email = admin?.email || "";

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* click-outside → close dropdown */
  useEffect(() => {
    const handler = (e) => {
      if (userWrapRef.current && !userWrapRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav className={`nav-wrap${scrolled ? " scrolled" : ""}`}>
        <div className={`nav-inner${scrolled ? " scrolled" : ""}`}>

          {/* Logo */}
          <Link to="/" className="logo">
            {/* <div className="logo-mark">Lx</div> */}
            <span className="logo-name">Lead<span>Trackr</span></span>
          </Link>

          {/* Right cluster */}
          <div className="nav-right">

            {/* Enroll Now — hidden on mobile */}
            <Link to="/enroll" className="enroll-btn">
              <div className="enroll-btn-inner">
                <span>✦</span> Enroll Now
              </div>
            </Link>

            {/* User icon */}
            {
              isAuthenticated ? (
                <div className="user-wrap" ref={userWrapRef}>
                  <button
                    className="user-btn"
                    onClick={() => setUserMenuOpen(o => !o)}
                    aria-label="User menu"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div className="user-dropdown">

                      {/* Profile header */}
                      <div className="dd-header">
                        <div className="dd-avatar">{full_name.charAt(0)}</div>
                        <div>
                          <div className="dd-info-name">{full_name}</div>
                          <div className="dd-info-email">{email}</div>
                        </div>
                      </div>

                      {/* Enroll Now — visible only on mobile */}
                      <button className="dd-enroll" onClick={() => setUserMenuOpen(false)}>
                        ✦ &nbsp;Enroll Now
                      </button>

                      {/* Menu items */}
                      {[
                        // { icon: "⊙", label: "My Profile" },
                        { icon: "◫", label: "Dashboard", onClick: () => navigate("/admin/dashboard") },
                        // { icon: "◈", label: "Settings" },
                      ].map(item => (
                        <button key={item.label} className="dd-item" onClick={() => { setUserMenuOpen(false); item.onClick?.() }}>
                          <span className="dd-icon">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}

                      <div className="dd-divider" />

                      <button className="dd-item danger" onClick={() => {
                        dispatch(adminLogout());
                        setUserMenuOpen(false);
                      }}>
                        <span className="dd-icon">↩</span>
                        Sign out
                      </button>

                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="login-btn">Login</Link>
              )
            }

          </div>
        </div>
      </nav>

      {/* ── DEMO HERO ── */}
      {/* <section className="hero">
        <h1>Learn Without<br />Limits</h1>
        <p>Unlock world-class courses crafted by industry experts. Start your journey today.</p>
      </section> */}
    </>
  );
}