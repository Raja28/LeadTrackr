import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const COURSES = [
    "Full Stack Web Development",
    "Data Science & Machine Learning",
    "UI/UX Design",
    "Cloud Computing & DevOps",
    "Cybersecurity",
    "Mobile App Development",
    "Artificial Intelligence",
    "Blockchain Development",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate", "Other"];

const INITIAL = { name: "", email: "", phone: "", course: "", college: "", year: "" };

function validate(fields) {
    const errs = {};
    if (!fields.name.trim()) errs.name = "Full name is required.";
    else if (fields.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";

    if (!fields.email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = "Enter a valid email address.";

    if (!fields.phone.trim()) errs.phone = "Phone number is required.";
    else if (!/^[+]?[\d\s\-()]{7,15}$/.test(fields.phone)) errs.phone = "Enter a valid phone number.";

    if (!fields.course) errs.course = "Please select a course.";
    if (!fields.college.trim()) errs.college = "College / University name is required.";
    if (!fields.year) errs.year = "Please select your year of study.";

    return errs;
}

export default function EnrollNowForm() {
    const [fields, setFields] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [status, setStatus] = useState("idle");

    const set = (key) => (e) => {
        setFields(f => ({ ...f, [key]: e.target.value }));
        if (touched[key]) {
            const errs = validate({ ...fields, [key]: e.target.value });
            setErrors(prev => ({ ...prev, [key]: errs[key] }));
        }
    };

    const blur = (key) => () => {
        setTouched(t => ({ ...t, [key]: true }));
        const errs = validate(fields);
        setErrors(prev => ({ ...prev, [key]: errs[key] }));
    };

    const submit = async () => {
        if (fields.name === "" || fields.email === "" || fields.phone === "" || fields.course === "" || fields.college === "" || fields.year === "") {
            toast.error("Please fill all fields");
            return;
        }

        try {
            
            setStatus("loading");
            const response = await axios.post(import.meta.env.VITE_BASE_URL + "/api/guest/enroll", fields);
            console.log(response);
            toast.success("Enrolled Successfully");
            reset();
        } catch (error) {
            setStatus("idle");
            console.log("Enroll Now From Error", error);
            // setErrors(error.response.data.message);
            toast.error(error.response.data.message);
        }
    };

    const reset = () => {
        setFields(INITIAL);
        setErrors({});
        setTouched({});
        setStatus("idle");
    };

    return (
        <>
            <div className="page">
                {/* Header */}
                <div className="form-header">
                    <div className="form-eyebrow">Admissions Open</div>
                    <h1 className="form-title">Start Your<br /><em>Journey</em> Today</h1>
                    <p className="form-subtitle">
                        Fill in your details below and our team will reach out within 24 hours.
                    </p>
                </div>

                {/* Card */}
                <div className="form-card">

                    {status === "success" ? (
                        <div className="success-card">
                            <div className="success-icon-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <div className="success-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                Application Submitted
                            </div>
                            <h2 className="success-title">You're all set!</h2>
                            <p className="success-body">
                                Thanks <strong>{fields.name.split(" ")[0]}</strong>! Your enrollment request has been received.
                                We'll send a confirmation to <strong>{fields.email}</strong> shortly.
                            </p>
                            <button className="reset-btn" onClick={reset}>Submit another response</button>
                        </div>

                    ) : (
                        <>
                            {/* Progress */}
                            <div className="progress-row justify-center">
                                <div className="">
                                    <h2 className="text-2xl font-bold">Fill Details</h2>
                                </div>
                                {/* <div className="prog-step">
                                    <div className="prog-dot active">1</div>
                                    Details
                                </div>
                                <div className="prog-line" />
                                <div className="prog-step">
                                    <div className="prog-dot">2</div>
                                    Review
                                </div>
                                <div className="prog-line" />
                                <div className="prog-step">
                                    <div className="prog-dot">3</div>
                                    Confirm
                                </div> */}
                            </div>

                            {/* Fields */}
                            <div className="form-grid">

                                {/* Name */}
                                <Field
                                    label="Full Name" id="name" type="text"
                                    placeholder="e.g. Prashant Singh"
                                    value={fields.name} onChange={set("name")} onBlur={blur("name")}
                                    error={touched.name && errors.name}
                                    valid={touched.name && !errors.name && fields.name}
                                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>}
                                />

                                {/* Email */}
                                <Field
                                    label="Email Address" id="email" type="email"
                                    placeholder="you@email.com"
                                    value={fields.email} onChange={set("email")} onBlur={blur("email")}
                                    error={touched.email && errors.email}
                                    valid={touched.email && !errors.email && fields.email}
                                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>}
                                />

                                {/* Phone */}
                                <Field
                                    label="Phone Number" id="phone" type="tel"
                                    placeholder="+91 98765 43210"
                                    value={fields.phone} onChange={set("phone")} onBlur={blur("phone")}
                                    error={touched.phone && errors.phone}
                                    valid={touched.phone && !errors.phone && fields.phone}
                                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .92h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.03z" /></svg>}
                                />

                                {/* Course */}
                                <SelectField
                                    label="Course" id="course"
                                    value={fields.course} onChange={set("course")} onBlur={blur("course")}
                                    error={touched.course && errors.course}
                                    valid={touched.course && !errors.course && fields.course}
                                    options={COURSES}
                                    placeholder="Select a course"
                                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>}
                                />

                                {/* College */}
                                <Field
                                    label="College / University" id="college" type="text"
                                    placeholder="e.g. IIT Bombay"
                                    value={fields.college} onChange={set("college")} onBlur={blur("college")}
                                    error={touched.college && errors.college}
                                    valid={touched.college && !errors.college && fields.college}
                                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>}
                                />

                                {/* Year */}
                                <SelectField
                                    label="Year of Study" id="year"
                                    value={fields.year} onChange={set("year")} onBlur={blur("year")}
                                    error={touched.year && errors.year}
                                    valid={touched.year && !errors.year && fields.year}
                                    options={YEARS}
                                    placeholder="Select your year"
                                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                                />

                            </div>

                            {/* Submit */}
                            <div className="submit-row">
                                <button
                                    className="submit-btn"
                                    onClick={submit}
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? (
                                        <><div className="spinner" /> Submitting…</>
                                    ) : (
                                        <>
                                            Enroll Now
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                        </>
                                    )}
                                </button>
                                <p className="submit-note">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                    Your data is safe &amp; never shared.
                                </p>
                            </div>

                            {/* Error banner */}
                            {status === "error" && (
                                <div className="error-banner">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={`var(--error)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <div>
                                        <div className="error-banner-text">
                                            {errors}
                                        </div>
                                        <button className="error-banner-retry" onClick={() => setStatus("idle")}>Try again →</button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

/* ── Sub-components ── */

function Field({ label, id, type, placeholder, value, onChange, onBlur, error, valid, icon }) {
    return (
        <div className="field">
            <label className="field-label" htmlFor={id}>
                {label} <span className="req">*</span>
            </label>
            <div className="field-input-wrap">
                <input
                    id={id} type={type} placeholder={placeholder}
                    value={value} onChange={onChange} onBlur={onBlur}
                    className={`input-text-bg field-input${error ? " has-error" : ""}${valid ? " is-valid" : ""}`}
                />
                <span className="field-icon">{icon}</span>
                {valid && (
                    <span className="field-tick">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                )}
            </div>
            {error && <span className="field-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
            </span>}
        </div>
    );
}

function SelectField({ label, id, value, onChange, onBlur, error, valid, options, placeholder, icon }) {
    return (
        <div className="field">
            <label className="field-label" htmlFor={id}>
                {label} <span className="req">*</span>
            </label>
            <div className="field-input-wrap">
                <select
                    id={id} value={value} onChange={onChange} onBlur={onBlur}
                    className={`field-input${error ? " has-error" : ""}${valid ? " is-valid" : ""}`}
                >
                    <option value="">{placeholder}</option>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <span className="field-icon">{icon}</span>
            </div>
            {error && <span className="field-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
            </span>}
        </div>
    );
}