import { useEffect, useState } from "react";
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

export default function AdminDashboard() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [course, setCourse] = useState("All");
    const [status, setStatus] = useState("All");

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Fetch Leads
    const fetchLeads = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/leads`, {
                params: { search, course, status },
                withCredentials: true,
            });

            setLeads(res.data.leads);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [search, course, status]);

    // Update Status
    const updateStatus = async (id, currentStatus) => {
        const loaderState = toast.loading("Updating status...");
        try {
            const newStatus =
                currentStatus === "new" ? "contacted" : "new";

            await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/admin/leads/${id}`,
                { status: newStatus },
                { withCredentials: true }
            );

            // Optimistic UI update
            setLeads((prev) =>
                prev.map((lead) =>
                    lead.id === id ? { ...lead, status: newStatus } : lead
                )
            );
            toast.success("Status updated successfully", { id: loaderState });
        } catch (err) {
            console.log(err);
            toast.error("Failed to update status", { id: loaderState });
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen form-card">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>

            {/* Filters */}
            <div className=" p-4 rounded-xl shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="Search name or email..."
                    className="border p-2 rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border p-2 rounded-lg"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                >
                    <option value="All">All Courses</option>
                    {COURSES.map((course) => (
                        <option key={course} value={course}>{course}</option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded-lg"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                </select>

                <button
                    onClick={fetchLeads}
                    className="submit-btn justify-center"
                >
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className=" rounded-xl shadow-sm overflow-x-auto">
                {loading ? (
                    <p className="p-4 text-center">Loading...</p>
                ) : leads.length === 0 ? (
                    <p className="p-4 text-center">No leads found</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className=" text-left">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Course</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="border-t  transition"
                                >
                                    <td className="p-3">{lead.name}</td>
                                    <td className="p-3">{lead.email}</td>
                                    <td className="p-3">{lead.course}</td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${lead.status === "new"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {lead.status}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <button
                                            onClick={() =>
                                                updateStatus(lead.id, lead.status)
                                            }
                                            className="text-blue-600 hover:underline"
                                        >
                                            Mark as{" "}
                                            {lead.status === "new"
                                                ? "Contacted"
                                                : "New"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
