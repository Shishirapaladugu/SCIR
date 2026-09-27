import { Link } from "react-router-dom";
import "./navbar.css";
export default function Navbar() {
  return (
    <nav>
        <div>
            <div>
      <h2 className="logo">EduLoop</h2><br/>
</div>
<div>
      <p className="tagline">Keep the resources Circulation</p>
      </div>
      </div>
      <div className="links">
        <Link to="/" className="link">
          Home
        </Link>
        <Link to="/login" className="link">
          Login
        </Link>
        <Link to="/register" className="link">
          Register
        </Link>
        <Link to="/upload" className="link">
          Upload
        </Link>
      </div>
    </nav>
  );
}
