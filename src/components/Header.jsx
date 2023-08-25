import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <h1>Real time chat</h1>          
            <Link to='/login'>Login</Link> 
            <Link to='/register'>Register</Link> 
            <Link to='/chats'>Your chats</Link> 
        </header>
    );
}

export default Header;