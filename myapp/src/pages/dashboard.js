
import { useEffect, useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchDashboard = async () => {
            try {
                // Get logged-in user
                const userResponse = await fetch(
                    "http://localhost:5000/api/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const userData = await userResponse.json();

                if (!userData.success) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                    return;
                }

                setUser(userData.user);

                // Get resources uploaded by this user
                const resourceResponse = await fetch(
                    "http://localhost:5000/api/my-resources",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const resourceData = await resourceResponse.json();

                if (resourceData.success) {
                    setResources(resourceData.resources);
                }

            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return <h2>Loading your dashboard...</h2>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-container">

            <h1>Welcome, {user.name}! 👋</h1>

            {/* Profile */}
            <div className="profile-card">
                <h2>My Account</h2>

                <p>
                    <strong>Name:</strong> {user.name}
                </p>

                <p>
                    <strong>Email:</strong> {user.email}
                </p>
            </div>

            {/* Statistics */}
            <div className="dashboard-stats">

                <div className="dashboard-card">
                    <h3>{resources.length}</h3>
                    <p>Resources Shared</p>
                </div>

                <div className="dashboard-card">
                    <h3>0</h3>
                    <p>Resources Acquired</p>
                </div>

            </div>

            {/* My Resources */}
            <div className="dashboard-section">

                <h2>My Resources</h2>

                {resources.length === 0 ? (
                    <p>
                        You haven't shared any resources yet.
                    </p>
                ) : (
                    <div className="resources-list">

                        {resources.map((resource) => (
                            <div
                                className="resource-card"
                                key={resource._id}
                            >
                                <h3>{resource.title}</h3>

                                <p>
                                    <strong>Type:</strong>{" "}
                                    {resource.resourceType}
                                </p>

                                <p>
                                    <strong>Subject:</strong>{" "}
                                    {resource.subject}
                                </p>

                                <p>
                                    <strong>Category:</strong>{" "}
                                    {resource.category}
                                </p>

                                <p>
                                    <strong>Listing:</strong>{" "}
                                    {resource.listingType === "free"
                                        ? "FREE"
                                        : `₹${resource.expectedPrice}`}
                                </p>
                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}