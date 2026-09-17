import './login.css'
import React, { useState } from 'react';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //send request to backend
     const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body:JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error logging in user:', error);
        }
    }
    return (

        <div className="login-overlay">
            <div className='login-box'>
                <button className="close-btn">x</button>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-row">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="password">Password:</label>
                        <input id="password" type="password" placeholder='enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='forgot'>
                        <a href="/forgot-password">
                            Forget the password
                        </a>
                    </div>
                    <button type="submit" className="login-btn">login</button>
                </form>
            </div>
        </div>
    );
}