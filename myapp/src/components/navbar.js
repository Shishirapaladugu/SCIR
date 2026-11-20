import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Dynamically update user auth state whenever route changes
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    });

    useEffect(() => {
        try {
            setUser(JSON.parse(localStorage.getItem("user")));
        } catch {
            setUser(null);
        }
    }, [location]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav>
            <div>
                <div>
                    <h2 className="logo">EduLoop</h2>
                    <br />
                </div>

                <div>
                    <p className="tagline">
                        Keep the resources in circulation
                    </p>
                </div>
            </div>

            <div className="links">
                <Link to="/" className="link">
                    Home
                </Link>

                {user ? (
                    <>
                        <Link to="/resources" className="link">
                            Browse
                        </Link>
                        <Link to="/upload" className="link">
                            Upload
                        </Link>
                        <Link to="/dashboard" className="link">
                            Dashboard
                        </Link>
                        <a href="#logout" className="link" onClick={handleLogout}>
                            Logout
                        </a>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="link">
                            Login
                        </Link>
                        <Link to="/register" className="link">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
