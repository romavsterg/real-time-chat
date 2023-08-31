import React from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
    return (
        <>
            <Header loggedIn={useLoaderData()}/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
}

export default Layout;