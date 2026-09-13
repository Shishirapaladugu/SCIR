import { Link } from 'react-router-dom';
import './navbar.css';
export default function Navbar() {
    return (
        <nav>

            <h2>my app</h2>
            <div className='links'>
                <Link to='/'>Login</Link>
                <Link to='/register'>Register</Link>
            </div>

        </nav>
    );
}