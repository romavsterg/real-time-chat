import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <header>
            <Link className='link' to='/'><h1>Real time chat</h1></Link>     
            <nav className='nav'>
                { localStorage.getItem('logedIn') === 'false' ? 
                    <>
                        <Link className='link' to='/login'>Log in</Link> 
                        <Link className='link' to='/register'>Register</Link> 
                    </>
                    :
                    <Link to='/login' className='link logout' onClick={() => {localStorage.setItem("logedIn", false); localStorage.setItem("token", undefined)}}>Log out</Link>
                }
                <Link className='link' to='/chats'>Chats</Link> 
            </nav>     
        </header>
    );
}

export default Header;