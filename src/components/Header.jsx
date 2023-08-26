import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <header>
            <Link className='link' to='/'><h1>Real time chat</h1></Link>     
            <nav className='nav'>
                <Link className='link' to='/login'>Log in</Link> 
                <Link className='link' to='/register'>Register</Link> 
                <Link className='link' to='/chats'>Your chats</Link> 
            </nav>     
        </header>
    );
}

export default Header;