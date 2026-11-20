import './login.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // send login request to backend
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setEmail('');
                setPassword('');
                setMessage('Login successful!');
                navigate('/dashboard');
            } else {
                setMessage(data.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            setMessage('Unable to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-overlay">
            <div className='login-box'>
                <div className='login-header'>
                    <button className="c-btn" onClick={() => navigate('/')}>×</button>
                    <h2>Login</h2>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="form-row">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="abc@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <p className={`message ${message.includes('successful') ? 'success' : ''}`}>
                            {message}
                        </p>
                    )}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#4f46e5', fontWeight: 'bold' }}>
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
