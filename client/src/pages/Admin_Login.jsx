import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../store/adminSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const INITIAL = { email: "", password: "" };

export default function AdminLogin() {
    const [fields, setFields] = useState(INITIAL);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, isAuthenticated } = useSelector((state) => state.admin);
    const set = (key) => (e) => {
        setFields((f) => ({ ...f, [key]: e.target.value }));
    };

    useEffect(() => {
        console.log(isAuthenticated);
        if (isAuthenticated) {
            navigate("/admin/dashboard");
        }

    }, [isAuthenticated, navigate])


    const submit = () => {
        if (fields.email === "" || fields.password === "") {
            toast.error("Please fill all fields");
            return;
        }
        dispatch(adminLogin(fields.email, fields.password))
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="form-header">
                <div className="form-eyebrow">Admin Access</div>
                <h1 className="form-title">
                    Welcome <em>Back</em>
                </h1>
                <p className="form-subtitle">
                    Login to manage your platform dashboard.
                </p>
            </div>

            <div className="form-card">
                <div className="form-grid">

                    <Field
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="admin@email.com"
                        value={fields.email}
                        onChange={set("email")}
                        icon={<MailIcon />}
                    />

                    <Field
                        label="Password"
                        id="password"
                        type="password"
                        placeholder="Enter password"
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
                                <div className="spinner" /> Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                    <Link to="/register" className="text-blue-500 text-xs">Don't have an account? Register</Link>
                </div>
            </div>
        </div>
    );
}

function Field({ label, id, type, placeholder, value, onChange, icon }) {
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
                    required
                />
                <span className="field-icon">{icon}</span>
            </div>
        </div>
    );
}

/* Icons */
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