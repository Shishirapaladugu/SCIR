import { useEffect, useState } from "react";
import "./dashboard.css";

const API_URL = "http://localhost:5000/api";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [resources, setResources] = useState([]);
    const [incomingInterests, setIncomingInterests] = useState([]);
    const [sentInterests, setSentInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState("");
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchDashboard = async () => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {
            // 1. Get logged-in user profile
            const userResponse = await fetch(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = await userResponse.json();

            if (!userData.success) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }
            setUser(userData.user);

            // 2. Get resources uploaded by this user
            const resourceResponse = await fetch(`${API_URL}/my-resources`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const resourceData = await resourceResponse.json();
            if (resourceData.success) {
                setResources(resourceData.resources);
            }

            // 3. Get incoming requests for user's resources
            const incomingResponse = await fetch(`${API_URL}/resource-interests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const incomingData = await incomingResponse.json();
            if (incomingData.success) {
                setIncomingInterests(incomingData.interests);
            }

            // 4. Get outgoing requests sent by this user
            const sentResponse = await fetch(`${API_URL}/my-sent-interests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const sentData = await sentResponse.json();
            if (sentData.success) {
                setSentInterests(sentData.interests);
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            setError("Unable to load complete dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle accepting or declining incoming requests
    const handleRequestStatus = async (interestId, status) => {
        setActionLoading(interestId);
        setNotice("");
        setError("");
        try {
            const res = await fetch(`${API_URL}/resource-interests/${interestId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update request status");
            }

            setIncomingInterests((prev) =>
                prev.map((item) =>
                    item._id === interestId ? { ...item, status } : item
                )
            );
            setNotice(`Request has been marked as ${status}.`);
        } catch (err) {
            console.error("Error updating interest status:", err);
            setError(err.message || "Failed to update request.");
        } finally {
            setActionLoading("");
        }
    };

    // Handle toggling resource availability status
    const handleToggleResourceStatus = async (resourceId, currentStatus) => {
        const nextStatus = currentStatus === "claimed" ? "available" : "claimed";
        setActionLoading(resourceId);
        setNotice("");
        setError("");
        try {
            const res = await fetch(`${API_URL}/resources/${resourceId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: nextStatus })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update resource status");
            }

            setResources((prev) =>
                prev.map((resItem) =>
                    resItem._id === resourceId ? { ...resItem, status: nextStatus } : resItem
                )
            );
            setNotice(`Resource marked as ${nextStatus}.`);
        } catch (err) {
            console.error("Error toggling resource status:", err);
            setError(err.message || "Failed to update resource status.");
        } finally {
            setActionLoading("");
        }
    };

    // Handle deleting an uploaded resource
    const handleDeleteResource = async (resourceId) => {
        if (!window.confirm("Are you sure you want to delete this resource listing? This action cannot be undone.")) {
            return;
        }

        setActionLoading(resourceId);
        setNotice("");
        setError("");
        try {
            const res = await fetch(`${API_URL}/resources/${resourceId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to delete resource");
            }

            setResources((prev) => prev.filter((item) => item._id !== resourceId));
            // Also clean up any incoming interest for this resource
            setIncomingInterests((prev) =>
                prev.filter((interest) => interest.resource?._id !== resourceId)
            );
            setNotice("Resource deleted successfully.");
        } catch (err) {
            console.error("Error deleting resource:", err);
            setError(err.message || "Failed to delete resource.");
        } finally {
            setActionLoading("");
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <h2>Loading your dashboard...</h2>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const pendingIncoming = incomingInterests.filter(
        (i) => (i.status || "pending") === "pending"
    ).length;
    const acquiredCount = sentInterests.filter(
        (i) => i.status === "accepted"
    ).length;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Welcome, {user.name}! 👋</h1>
                    <p className="dashboard-subtitle">
                        Manage your educational resources, exchanges, and community requests.
                    </p>
                </div>
            </header>

            {notice && <div className="dashboard-alert success">{notice}</div>}
            {error && <div className="dashboard-alert error">{error}</div>}

            {/* Profile Overview */}
            <div className="profile-card">
                <h2>My Account</h2>
                <div className="profile-details">
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="dashboard-stats">
                <div className="dashboard-card">
                    <h3>{resources.length}</h3>
                    <p>Resources Shared</p>
                </div>

                <div className="dashboard-card">
                    <h3>{pendingIncoming}</h3>
                    <p>Pending Requests</p>
                </div>

                <div className="dashboard-card">
                    <h3>{acquiredCount}</h3>
                    <p>Resources Acquired</p>
                </div>
            </div>

            {/* Section 1: Incoming Requests */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Requests for My Resources</h2>
                    <span className="count-badge">{incomingInterests.length}</span>
                </div>

                {incomingInterests.length === 0 ? (
                    <p className="empty-message">No one has requested your resources yet.</p>
                ) : (
                    <div className="resources-list">
                        {incomingInterests.map((interest) => {
                            const status = interest.status || "pending";
                            return (
                                <div className="resource-card" key={interest._id}>
                                    <div className="card-topline">
                                        <span className={`status-pill status-${status}`}>
                                            {status.toUpperCase()}
                                        </span>
                                        <span className="card-date">
                                            {new Date(interest.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3>{interest.resource?.title || "Resource no longer available"}</h3>

                                    <p>
                                        <strong>Requested by:</strong>{" "}
                                        {interest.requester?.name || "Unknown user"}
                                    </p>

                                    {interest.requester?.email && (
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            <a href={`mailto:${interest.requester.email}`}>
                                                {interest.requester.email}
                                            </a>
                                        </p>
                                    )}

                                    {interest.resource?.listingType && (
                                        <p>
                                            <strong>Listing:</strong>{" "}
                                            {interest.resource.listingType === "free"
                                                ? "Free"
                                                : `₹${interest.resource.expectedPrice}`}
                                        </p>
                                    )}

                                    <div className="card-actions">
                                        {status === "pending" ? (
                                            <>
                                                <button
                                                    className="btn-action btn-accept"
                                                    disabled={actionLoading === interest._id}
                                                    onClick={() =>
                                                        handleRequestStatus(interest._id, "accepted")
                                                    }
                                                >
                                                    {actionLoading === interest._id ? "Updating..." : "✓ Accept"}
                                                </button>
                                                <button
                                                    className="btn-action btn-decline"
                                                    disabled={actionLoading === interest._id}
                                                    onClick={() =>
                                                        handleRequestStatus(interest._id, "rejected")
                                                    }
                                                >
                                                    ✕ Decline
                                                </button>
                                            </>
                                        ) : status === "accepted" ? (
                                            <p className="action-note success-note">
                                                Accepted! Contact requester to complete handover.
                                            </p>
                                        ) : (
                                            <p className="action-note muted-note">
                                                Request declined.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Section 2: Outgoing Sent Requests */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Resources I Requested</h2>
                    <span className="count-badge">{sentInterests.length}</span>
                </div>

                {sentInterests.length === 0 ? (
                    <p className="empty-message">
                        You haven't requested any resources yet. Explore the marketplace to find materials!
                    </p>
                ) : (
                    <div className="resources-list">
                        {sentInterests.map((interest) => {
                            const status = interest.status || "pending";
                            return (
                                <div className="resource-card" key={interest._id}>
                                    <div className="card-topline">
                                        <span className={`status-pill status-${status}`}>
                                            {status.toUpperCase()}
                                        </span>
                                        <span className="card-date">
                                            {new Date(interest.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3>{interest.resource?.title || "Resource no longer available"}</h3>

                                    <p>
                                        <strong>Owner:</strong>{" "}
                                        {interest.owner?.name || "Resource Owner"}
                                    </p>

                                    {interest.resource?.listingType && (
                                        <p>
                                            <strong>Listing:</strong>{" "}
                                            {interest.resource.listingType === "free"
                                                ? "Free"
                                                : `₹${interest.resource.expectedPrice}`}
                                        </p>
                                    )}

                                    {/* Reveal owner contact details if accepted */}
                                    {status === "accepted" ? (
                                        <div className="contact-revealed-box">
                                            <p className="contact-title">🎉 Request Accepted!</p>
                                            {interest.resource?.phone && (
                                                <p>
                                                    <strong>Phone:</strong>{" "}
                                                    <a href={`tel:${interest.resource.phone}`}>
                                                        {interest.resource.phone}
                                                    </a>
                                                </p>
                                            )}
                                            {interest.resource?.gmail && (
                                                <p>
                                                    <strong>Email:</strong>{" "}
                                                    <a href={`mailto:${interest.resource.gmail}`}>
                                                        {interest.resource.gmail}
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    ) : status === "pending" ? (
                                        <p className="action-note pending-note">
                                            ⏳ Waiting for the owner to respond.
                                        </p>
                                    ) : (
                                        <p className="action-note muted-note">
                                            Request was declined by the owner.
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Section 3: My Shared Resources */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>My Shared Resources</h2>
                    <span className="count-badge">{resources.length}</span>
                </div>

                {resources.length === 0 ? (
                    <p className="empty-message">
                        You haven't shared any resources yet. Click "Upload" in the navbar to contribute!
                    </p>
                ) : (
                    <div className="resources-list">
                        {resources.map((resource) => {
                            const resStatus = resource.status || "available";
                            return (
                                <div className="resource-card" key={resource._id}>
                                    <div className="card-topline">
                                        <span className={`status-pill status-${resStatus}`}>
                                            {resStatus.toUpperCase()}
                                        </span>
                                        <span className="card-badge">
                                            {resource.resourceType}
                                        </span>
                                    </div>

                                    <h3>{resource.title}</h3>

                                    <p>
                                        <strong>Subject:</strong> {resource.subject}
                                    </p>

                                    <p>
                                        <strong>Category:</strong> {resource.category}
                                    </p>

                                    <p>
                                        <strong>Listing:</strong>{" "}
                                        {resource.listingType === "free"
                                            ? "FREE"
                                            : `₹${resource.expectedPrice}`}
                                    </p>

                                    <div className="card-actions">
                                        <button
                                            className="btn-action btn-toggle"
                                            disabled={actionLoading === resource._id}
                                            onClick={() =>
                                                handleToggleResourceStatus(resource._id, resStatus)
                                            }
                                        >
                                            {resStatus === "claimed"
                                                ? "Mark Available"
                                                : "Mark Claimed"}
                                        </button>
                                        <button
                                            className="btn-action btn-delete"
                                            disabled={actionLoading === resource._id}
                                            onClick={() => handleDeleteResource(resource._id)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
