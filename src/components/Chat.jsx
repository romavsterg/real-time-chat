import React from 'react';
import { useLoaderData } from 'react-router-dom';

export async function loader({ params }) {
    return params
}


function Chat() {
    const params = useLoaderData()
    console.log(params);
    return (
        <div>
            <h3>Chat</h3> 
            <div className="chat-container">
                <div className="messages">pa</div>
            </div>
        </div>
    );
}

export default Chat;