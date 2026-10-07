import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const API_URL = "http://localhost:5000/api";

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [resources, setResources] = useState([]);
    const [requestedIds, setRequestedIds] = useState(() => new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [submittingId, setSubmittingId] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("user");
            }
        }

        const loadResources = async () => {
            try {
                const response = await fetch(`${API_URL}/resources`);
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Unable to load resources.");
                }
                setResources(data.resources);

                if (token) {
                    const interestsResponse = await fetch(`${API_URL}/my-resource-interests`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const interestsData = await interestsResponse.json();
                    if (!interestsResponse.ok || !interestsData.success) {
                        throw new Error(interestsData.message || "Unable to load your requests.");
                    }
                    setRequestedIds(new Set(interestsData.resourceIds));
                }
            } catch (loadError) {
                console.error("Home resource loading error:", loadError);
                setError(loadError.message || "Unable to load resources. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadResources();
    }, []);

    const requestResource = async (resource) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        if (requestedIds.has(resource._id)) return;

        setSubmittingId(resource._id);
        setNotice("");
        setError("");
        try {
            const response = await fetch(`${API_URL}/resources/${resource._id}/interests`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to send your request.");
            }
            setRequestedIds((previous) => new Set(previous).add(resource._id));
            setNotice(`Your interest in "${resource.title}" has been sent to the owner.`);
        } catch (requestError) {
            console.error("Resource interest request error:", requestError);
            setError(requestError.message || "Unable to send your request. Please try again.");
        } finally {
            setSubmittingId("");
        }
    };

    return (
        <main className="marketplace-home">
            <section className="marketplace-hero">
                <p className="marketplace-eyebrow">EDULOOP RESOURCE EXCHANGE</p>
                <h1>{user ? `Welcome back, ${user.name}!` : "Keep learning resources in circulation."}</h1>
                <p>Find books, notes, question papers, and other study materials shared by your community.</p>
                <button className="marketplace-upload-link" onClick={() => navigate("/upload")}>
                    Share a resource
                </button>
            </section>

            <section className="marketplace-listings" aria-labelledby="listings-heading">
                <div className="marketplace-section-heading">
                    <div>
                        <p className="marketplace-eyebrow">COMMUNITY SHARES</p>
                        <h2 id="listings-heading">Available resources</h2>
                    </div>
                    <span>{resources.length} {resources.length === 1 ? "resource" : "resources"}</span>
                </div>

                {notice && <p className="marketplace-notice" role="status">{notice}</p>}
                {error && <p className="marketplace-error" role="alert">{error}</p>}

                {loading ? (
                    <p className="marketplace-empty">Loading shared resources...</p>
                ) : resources.length === 0 ? (
                    <p className="marketplace-empty">No resources have been shared yet. Be the first to add one!</p>
                ) : (
                    <div className="marketplace-grid">
                        {resources.map((resource) => {
                            const isOwner = user && String(user.id || user._id) === String(resource.ownerId);
                            const isRequested = requestedIds.has(resource._id);
                            return (
                                <article className="marketplace-resource-card" key={resource._id}>
                                    <div className="marketplace-resource-topline">
                                        <span>{resource.resourceType}</span>
                                        <span className={`marketplace-listing-badge ${resource.listingType === "free" ? "is-free" : ""}`}>
                                            {resource.listingType === "free" ? "Free" : "For sale"}
                                        </span>
                                    </div>
                                    <h3>{resource.title}</h3>
                                    {resource.author && <p className="marketplace-resource-author">by {resource.author}</p>}
                                    <p className="marketplace-resource-description">{resource.description}</p>
                                    <dl>
                                        <div><dt>Subject</dt><dd>{resource.subject}</dd></div>
                                        <div><dt>Category</dt><dd>{resource.category}</dd></div>
                                        <div><dt>Institution</dt><dd>{resource.institution}</dd></div>
                                        {resource.condition && <div><dt>Condition</dt><dd>{resource.condition}</dd></div>}
                                    </dl>
                                    <div className="marketplace-card-footer">
                                        <strong>{resource.listingType === "free" ? "Free to share" : `₹${resource.expectedPrice}`}</strong>
                                        <button
                                            type="button"
                                            onClick={() => requestResource(resource)}
                                            disabled={Boolean(isOwner || isRequested || submittingId === resource._id)}
                                        >
                                            {isOwner ? "Your resource" : isRequested ? "Request sent" : submittingId === resource._id ? "Sending..." : "I'm interested"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
