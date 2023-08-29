import React, { useContext, useEffect, useState } from 'react';
import { Form, Link, Outlet, redirect, useLoaderData, useNavigation } from 'react-router-dom';
import '../styles/Chats.css';
import {Buffer} from 'buffer';
import Popup from '../components/Popup';
import { Context } from '..';
import Loader from '../components/Loader';

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
    const status = useNavigation().state

    const {chatsRef} = useContext(Context)

    const user = useLoaderData()
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('a@gmail.com');
    const [error, setError] = useState('')
    const [chats, setChats] = useState([])
    
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    async function createChat(e) {
        e.preventDefault()
        chatsRef.orderByChild('title').equalTo(`${[user.email, email].sort()}`).once('value', (snapshot) => {
            if (snapshot.exists()) {
                setError(`the chat with this email is already exists`)
            } else {
                setError('')
                let newChat = {
                    title: `${[user.email, email].sort()}`,
                    user1: user.email,
                    user2: email
                }
                const newChatRef = chatsRef.push()
                newChatRef.set(newChat)
                newChat = {
                    key: newChatRef.key,
                    title: `${[user.email, email].sort()}`.replace(',', ''),
                    user1: user.email,
                    user2: email
                }
                newChatRef.set(newChat)
                chats.push(newChat)
            }
        })
        if (error) {
            return 
        } 
    }

    useEffect(() => {
        chatsRef.orderByChild('user1').equalTo(user.email).once('value', async (snapshot) => {
            if (snapshot.exists()) {
                let arr = []
                for (var i in snapshot.val()) {
                    let chat = await chatsRef.child(i).get()
                    arr.push(chat.val());
                }
                setChats(arr)
            }
        })
        }, [user, chatsRef]
    )
    
    return (
        <section className='chats'>
            <h2>Your Chats</h2>
            {
            chats ? chats.map(chat => <Link className='chat-link' to={chat.key} key={chat.key}>{chat.title.replace(user.email, '')}</Link>) 
            : 
            <Loader/>
            }
            <div className="new-chat">
                <button onClick={togglePopup} className='button'><h3>Create a new chat</h3></button>
                {isOpen && 
                    <Popup>
                        <div className='popup-header'>
                            <h4>Create a new chat</h4>                    
                            <button className='close-popup-button' onClick={togglePopup}>&#10006;</button> 
                        </div>
                        {error && <h3>{error}</h3>}
                        <Form onSubmit={createChat} className='new-chat-form'>
                            <input value={email} onChange={(event)=>setEmail(event.target.value)}  required type="email" className='input' placeholder='email of the user you want to chat with' />
                            <button className='button'>{status === 'submitting' ? "Creating" : "Create"}</button>
                        </Form>   
                    </Popup>
                }
            </div>
        </section>
    );
}

export default Chats;