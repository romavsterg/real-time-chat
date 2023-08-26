import React from 'react';
import {Buffer} from 'buffer';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';

export async function loader() {
    try {
        const token = localStorage.getItem('token');
        const decoded = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );
        return decoded
    } catch (error) {
        localStorage.setItem("message", "You must be logged in to use chats")
        throw redirect('/login')
    }
}


function Chats() {
    const user = useLoaderData()
    // console.log(user)
    return (
        <section>
            <h2>Your Chats</h2>
            <Outlet/>
        </section>
    );
}

export default Chats;