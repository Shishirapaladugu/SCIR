import './login.css'
export default function Login() {
    return (

        <div className="login-overlay">
            <div className='login-box'>
                <button className="close-btn">x</button>
                <h2>Login</h2>
                <form>
                    <div className="form-row">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" placeholder="abc@gmail.com" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="password">Password:</label>
                        <input id="password" type="password" placeholder='enter password' />
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