import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, adminRegister } from "../store/adminSlice";
import toast from "react-hot-toast";

const INITIAL = { name: "", email: "", password: "" };

export default function AdminRegister() {
    const [fields, setFields] = useState(INITIAL);

    const { status, isAuthenticated } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin/dashboard");
        }

    }, [isAuthenticated, navigate])

    const set = (key) => (e) => {
        setFields((f) => ({ ...f, [key]: e.target.value }));
    };

    const submit = () => {
        if(fields.name === "" || fields.email === "" || fields.password === "") {
            toast.error("Please fill all fields");
            return;
        }
        dispatch(adminRegister(fields.name, fields.email, fields.password))

    };


    return (
        <div className="max-w-md mx-auto">
            <div className="form-header">
                <div className="form-eyebrow">Admin Setup</div>
                <h1 className="form-title">
                    Create <em>Admin</em>
                </h1>
                <p className="form-subtitle">
                    Register a new admin account to manage the system.
                </p>
            </div>

            <div className="form-card">
                <div className="form-grid">

                    <Field
                        label="Full Name"
                        type="text"
                        placeholder="Admin Name"
                        value={fields.name}
                        onChange={set("name")}
                        icon={<UserIcon />}
                    />

                    <Field
                        label="Email Address"
                        type="email"
                        placeholder="admin@email.com"
                        value={fields.email}
                        onChange={set("email")}
                        icon={<MailIcon />}
                    />

                    <Field
                        label="Password"
                        type="password"
                        placeholder="Create password"
                        value={fields.password}
                        onChange={set("password")}
                        icon={<LockIcon />}
                    />

                </div>

                <div className="submit-row">
                    <button
                        className="submit-btn"
                        onClick={submit}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? (
                            <>
                                <div className="spinner" /> Creating...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>
                    <Link to="/login" className="text-blue-500 text-xs">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
}

/* Reusable Field */
function Field({ label, type, placeholder, value, onChange, icon }) {
    return (
        <div className="field full">
            <label className="field-label">{label}</label>
            <div className="field-input-wrap">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="field-input"
                />
                <span className="field-icon">{icon}</span>
            </div>
        </div>
    );
}

/* Icons */
const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="2,4 12,13 22,4" />
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);