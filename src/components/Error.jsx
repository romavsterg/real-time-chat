import React from 'react';
import { useRouteError } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Error() {
    return (
        <>
            <Header/>
            <main>
                <h2>Error: {useRouteError().message};</h2>
            </main>
            <Footer/>
        </>
    );
}

export default Error;