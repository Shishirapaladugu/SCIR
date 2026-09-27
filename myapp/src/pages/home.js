export default function Home() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className="home-container">
            {user ? (
                <h1>Welcome back, {user.name}! 👋</h1>
            ) : (
                <h1>Welcome to EduLoop 👋</h1>
            )}
            <p>This is the home page of the application.</p>
        </div>
    );
}