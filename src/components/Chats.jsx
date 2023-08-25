import React from 'react';
import { Outlet } from 'react-router-dom';

function Chats() {
    return (
        <section>
            <h2>Your Chats</h2>
            <Outlet/>
        </section>
    );
}

export default Chats;