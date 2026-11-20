import { useEffect, useState, useMemo } from "react";
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

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedListing, setSelectedListing] = useState("all");

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

    // Filter resources dynamically
    const filteredResources = useMemo(() => {
        return resources.filter((resource) => {
            // Search query matches title, author, subject, or institution
            const query = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !query ||
                (resource.title && resource.title.toLowerCase().includes(query)) ||
                (resource.author && resource.author.toLowerCase().includes(query)) ||
                (resource.subject && resource.subject.toLowerCase().includes(query)) ||
                (resource.institution && resource.institution.toLowerCase().includes(query));

            // Category filter
            const matchesCategory =
                selectedCategory === "all" ||
                resource.category?.toLowerCase() === selectedCategory.toLowerCase();

            // Resource type filter
            const matchesType =
                selectedType === "all" ||
                resource.resourceType?.toLowerCase() === selectedType.toLowerCase();

            // Listing type filter (free vs sale)
            const matchesListing =
                selectedListing === "all" ||
                resource.listingType === selectedListing;

            return matchesSearch && matchesCategory && matchesType && matchesListing;
        });
    }, [resources, searchQuery, selectedCategory, selectedType, selectedListing]);

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

    const hasActiveFilters =
        searchQuery !== "" ||
        selectedCategory !== "all" ||
        selectedType !== "all" ||
        selectedListing !== "all";

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedType("all");
        setSelectedListing("all");
    };

    return (
        <main className="marketplace-home">
            <section className="marketplace-hero">
                <p className="marketplace-eyebrow">EDULOOP RESOURCE EXCHANGE</p>
                <h1>{user ? `Welcome back, ${user.name}!` : "Keep learning resources in circulation."}</h1>
                <p>Find books, notes, question papers, and study materials shared by peers in your academic community.</p>
                <button className="marketplace-upload-link" onClick={() => navigate("/upload")}>
                    + Share a resource
                </button>
            </section>

            <section className="marketplace-listings" aria-labelledby="listings-heading">
                {/* Search and Filters Bar */}
                <div className="marketplace-filter-card">
                    <div className="search-bar-row">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="🔍 Search by title, subject, author, or college..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {hasActiveFilters && (
                            <button className="btn-reset-filters" onClick={resetFilters}>
                                Reset Filters
                            </button>
                        )}
                    </div>

                    <div className="filter-controls-row">
                        <div className="filter-group">
                            <label htmlFor="filter-type">Type:</label>
                            <select
                                id="filter-type"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="Book">Book</option>
                                <option value="Notes">Notes</option>
                                <option value="Study Material">Study Material</option>
                                <option value="Question Paper">Question Paper</option>
                                <option value="Previous Year Papers">Previous Year Papers</option>
                                <option value="Lab Manual">Lab Manual</option>
                                <option value="Project Material">Project Material</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="filter-category">Category:</label>
                            <select
                                id="filter-category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="Management">Management</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Competitive Exams">Competitive Exams</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="filter-listing">Listing:</label>
                            <select
                                id="filter-listing"
                                value={selectedListing}
                                onChange={(e) => setSelectedListing(e.target.value)}
                            >
                                <option value="all">All Pricing</option>
                                <option value="free">Free</option>
                                <option value="sale">For Sale</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="marketplace-section-heading">
                    <div>
                        <p className="marketplace-eyebrow">COMMUNITY SHARES</p>
                        <h2 id="listings-heading">Available resources</h2>
                    </div>
                    <span>
                        {filteredResources.length}{" "}
                        {filteredResources.length === 1 ? "resource" : "resources"} found
                    </span>
                </div>

                {notice && <p className="marketplace-notice" role="status">{notice}</p>}
                {error && <p className="marketplace-error" role="alert">{error}</p>}

                {loading ? (
                    <p className="marketplace-empty">Loading shared resources...</p>
                ) : filteredResources.length === 0 ? (
                    <div className="marketplace-empty">
                        <p>No resources found matching your search or filters.</p>
                        {hasActiveFilters && (
                            <button className="marketplace-upload-link" onClick={resetFilters}>
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="marketplace-grid">
                        {filteredResources.map((resource) => {
                            const isOwner = user && String(user.id || user._id) === String(resource.ownerId);
                            const isRequested = requestedIds.has(resource._id);
                            const isClaimed = resource.status === "claimed";

                            return (
                                <article className="marketplace-resource-card" key={resource._id}>
                                    <div className="marketplace-resource-topline">
                                        <span className="marketplace-type-tag">{resource.resourceType}</span>
                                        <div className="badges-group">
                                            {isClaimed && (
                                                <span className="marketplace-status-badge is-claimed">
                                                    Claimed
                                                </span>
                                            )}
                                            <span
                                                className={`marketplace-listing-badge ${
                                                    resource.listingType === "free" ? "is-free" : ""
                                                }`}
                                            >
                                                {resource.listingType === "free" ? "Free" : "For sale"}
                                            </span>
                                        </div>
                                    </div>

                                    <h3>{resource.title}</h3>
                                    {resource.author && (
                                        <p className="marketplace-resource-author">by {resource.author}</p>
                                    )}
                                    <p className="marketplace-resource-description">
                                        {resource.description}
                                    </p>

                                    <dl>
                                        <div>
                                            <dt>Subject</dt>
                                            <dd>{resource.subject}</dd>
                                        </div>
                                        <div>
                                            <dt>Category</dt>
                                            <dd>{resource.category}</dd>
                                        </div>
                                        <div>
                                            <dt>Institution</dt>
                                            <dd>{resource.institution}</dd>
                                        </div>
                                        {resource.condition && (
                                            <div>
                                                <dt>Condition</dt>
                                                <dd>{resource.condition}</dd>
                                            </div>
                                        )}
                                    </dl>

                                    <div className="marketplace-card-footer">
                                        <strong>
                                            {resource.listingType === "free"
                                                ? "Free to share"
                                                : `₹${resource.expectedPrice}`}
                                        </strong>
                                        <button
                                            type="button"
                                            onClick={() => requestResource(resource)}
                                            disabled={Boolean(
                                                isClaimed ||
                                                isOwner ||
                                                isRequested ||
                                                submittingId === resource._id
                                            )}
                                        >
                                            {isClaimed
                                                ? "Claimed"
                                                : isOwner
                                                ? "Your resource"
                                                : isRequested
                                                ? "Request sent"
                                                : submittingId === resource._id
                                                ? "Sending..."
                                                : "I'm interested"}
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
