import React from 'react';
import { useLoaderData } from 'react-router-dom';

export async function loader({ params }) {
    return params
}

function Chat() {
    const params = useLoaderData()
    return (
        <div>
           <h3>Chat # {params.chatId}</h3> 
        </div>
    );
}

export default Chat;