import './login.css'
export default function Register() {
    return (

        <div className="login-overlay">
            <div className='login-box'>
                <button className="close-btn">x</button>
                <h2>Register</h2>
                <form>
                    <div className="form-row">
                        <label htmlFor="name">UserName:</label>
                        <input type="text" id="name" placeholder="Username" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" placeholder="abc@gmail.com" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="password">PassWord:</label>
                        <input id="password" type="password" placeholder='enter password' />
                    </div>
                    <div className="form-row">
                        <label htmlFor="confirm">Confirm:</label>
                        <input type="password" id="confirm" placeholder="enter password again" />
                    </div>
                    <button type="submit" className="login-btn">Register</button>
                </form>
            </div>
        </div>
    );
}