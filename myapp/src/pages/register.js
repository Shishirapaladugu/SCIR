import './login.css'
import React, { useState } from 'react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

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
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('Unable to register right now. Please try again.');
        }
    };

    return (
        <div className="login-overlay">
            <div className='login-box'>
                <button className="close-btn">x</button>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-row">
                        <label htmlFor="name">UserName:</label>
                        <input type="text" id="name" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="password">Password:</label>
                        <input id="password" type="password" placeholder='enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="confirm">Confirm:</label>
                        <input type="password" id="confirm" placeholder="enter password again" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    {message && <p className="form-message">{message}</p>}
                    <button type="submit" className="login-btn">Register</button>
                </form>
            </div>
        </div>
    );
}