import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    let loggedIn = false

    return (
        <header>
            <Link className='link' to='/'><h1>Real time chat</h1></Link>     
            <nav className='nav'>
                { !loggedIn ? 
                    <>
                        <Link className='link' to='/login'>Log in</Link> 
                        <Link className='link' to='/register'>Register</Link> 
                    </>
                    :
                    <button className='link logout' onClick={() => {localStorage.clear(); loggedIn = false}}>Log out</button>
                }
                <Link className='link' to='/chats'>Your chats</Link> 
            </nav>     
        </header>
    );
}

export default Header;