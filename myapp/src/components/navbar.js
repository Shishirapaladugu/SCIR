
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Read the current user whenever the component renders
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
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
                        <Link to="/upload" className="link">
                            Upload
                        </Link>

                        <Link to="/dashboard" className="link">
                            Profile
                        </Link>
                        <Link to='/logout' className="link" onClick={handleLogout}>
                            Logout
                        </Link>
                        
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