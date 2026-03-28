import './Header.css'
const Header =()=>{
    return (
        <header className="header">
            <div className="container">
                <div className="logo">The Singing Tales</div>
                <nav className="nav">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Shop</a>
                    <a href="#">Contact</a>
                </nav>
                <div className="actions">
                    <a href="/login" className="login">Login</a>
                </div>
            </div>
        </header>
    );
};
export default Header;