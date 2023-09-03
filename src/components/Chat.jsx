import React, { useContext, useEffect, useState } from 'react';
import { Form, redirect, useLoaderData } from 'react-router-dom';
import { Context } from '..';
import '../styles/Chat.css'
import {Buffer} from 'buffer';
import Loader from './Loader';

export async function loader({params}) {
    try {
        const token = localStorage.getItem('token');
        const decoded = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );
        return {user: decoded, chatId: params.chatId}
    } catch (error) {
        localStorage.setItem("message", "You must be logged in to use chats")
        throw redirect('/login')
    }
}

function Chat() {
    const {user, chatId} = useLoaderData()

    const {chatsRef, messagesRef} = useContext(Context)

    const [chat, setChat] = useState(null)

    const [messageText, setMessageText] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        async function GetChat(id) {
            let chat = await chatsRef.child(id).get()
            chat = chat.val()
            if (chat.user2 === user.email) {
                chat.title = chat.user1
                setChat(chat)
            } else {
                chat.title = chat.user2
                setChat(chat)
            }
        }
        GetChat(chatId)
    }, [chatsRef, chatId, user.email])

    async function createMessage(e) {
        e.preventDefault()
        if (messageText.length === 0) {
            return
        }
        try {
            console.log(messageText);
            console.log(chatId);

            const newMessageRef = messagesRef.push()

            const newMessage = {
                id: newMessageRef.key,
                chatId: chatId,
                text: messageText,
                from: user.email
            }

            newMessageRef.set(newMessage)

            setMessageText('')
        } catch (error) {
            
        }
    }

    useEffect(() => {  
        const getChats = async (snapshot) => {
            let Messages = []
            if (snapshot.val()) {
                for (var i in snapshot.val()) {
                    let message = await messagesRef.child(i).get()
                    if (message.val()) {
                        message = message.val()
                        Messages.push(message)
                    }
                }
            }
            setMessages(Messages);
        }
        messagesRef.orderByChild('chatId').equalTo(chatId).on('value', async (snapshot) => await getChats(snapshot))
    }, [messagesRef, user.email, chatId])

    return (
        <div className='chat'>
            {chat ?
                <>
                    <h2 className='chat-title'>{chat.title}</h2> 
                    <div className="chat-container">
                        <div className="messages">
                            {messages.map(message => 
                                <div className='message' key={message.id} style={{'margin-left': message.from === user.email ? 'auto' : '0'}}>
                                    <p>{message.text}</p>
                                </div>)
                            }
                        </div>
                    </div>
                    <Form className='message-form' method='post' onSubmit={createMessage}>
                        <textarea className='input' type="text" value={messageText} 
                               autoComplete="off" onChange={(event)=>setMessageText(event.target.value)} 
                               name="message-text" placeholder='type a message...'/>
                        <button className='send-message-button' type="submit">&gt;</button>
                    </Form>
                </>
                :
                <Loader/>
            }
        </div>
    );
}

export default Chat;