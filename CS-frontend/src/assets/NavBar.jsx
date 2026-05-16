import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="navbar">
            <nav>
                <div className="title">
                    <Link to={'/'} className="image">
                        <img src="/pp[1].png" alt="Logo" />
                    </Link>
                    <h1 className="brand-text">CommandSPES</h1>
                    <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div className={`links ${menuOpen ? "open" : ""}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/students" onClick={() => setMenuOpen(false)}>Members</Link>
                    <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
                    <Link to="/galleries" onClick={() => setMenuOpen(false)}>Gallery</Link>
                </div>
            </nav>
        </div>
    );
}
