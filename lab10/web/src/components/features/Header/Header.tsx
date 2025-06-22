import React, {FC} from 'react';
import logo from '../../../images/logo.svg';
import './Header.scss';
import {Link, useLocation} from "react-router-dom";

const Header: FC = () => {
    const location = useLocation();

    return (
        <header>
            <nav className="desktop-nav">
                <Link to="/" className={`h6 ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                <Link to="/catalog" className={`h6 ${location.pathname === '/catalog' ? 'active' : ''}`}>Find a
                    doctor</Link>
                <Link to="/cart" className={`h6 ${location.pathname === '/cart' ? 'active' : ''}`}>Cart</Link>
            </nav>
            <nav role="navigation">
                <div id="menuToggle">
                    <input type="checkbox"/>
                    <span></span>
                    <span></span>
                    <span></span>
                    <ul id="menu">
                        <a href="/">
                            <li>Home</li>
                        </a>
                        <a href="/">
                            <li>Find a doctor</li>
                        </a>
                        <a href="/">
                            <li>Apps</li>
                        </a>
                        <a href="/">
                            <li>Testimonials</li>
                        </a>
                        <a href="/">
                            <li>About us</li>
                        </a>
                    </ul>
                </div>
            </nav>
            <img className="logo" src={logo} alt="Trafalgar"/>
        </header>
    );
};

export default Header;