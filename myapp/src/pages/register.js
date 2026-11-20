import './login.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();
            setMessage(data.message || 'Registration failed');

            if (data.success) {
                alert('Registration successful! Redirecting to login page...');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('Unable to register right now. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-overlay">
            <div className='login-box'>
                <button className="c-btn" onClick={() => navigate('/')}>×</button>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-row">
                        <label htmlFor="name">Full Name:</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label htmlFor="confirm">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirm"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p className="form-message">{message}</p>}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 'bold' }}>Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
