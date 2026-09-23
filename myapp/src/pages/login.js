import './login.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

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
            setMessage(data.message || 'Login '); 
            if(data.success){ 
                localStorage.setItem('token', data.token); 
                //storing the user data in local storage for future use 
                localStorage.setItem('user', JSON.stringify(data.user)); 
                setEmail(''); 
                setPassword(''); 
                //navigate to home page or dashboard 
                setMessage('Login successful!'); 
                alert('Login successful! Redirecting to home page...'); 
                navigate('/'); 
            } 
        } catch (error) { 
            console.error('Error logging in user:', error); 
            alert('Invalid email or password'); 
        } 
    } 
    return ( 
 
        <div className="login-overlay"> 
            <div className='login-box'> 
                <div className='login-header'> 
                <button className="close-btn" onClick={() => navigate('/')}>x</button> 
                <h2>Login</h2> 
                </div> 
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
                    <p className="message">{message}</p> 
                    <button type="submit" className="login-btn">login</button> 
                </form> 
            </div> 
        </div> 
    ); 
} 