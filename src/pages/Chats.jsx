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
    const user = useLoaderData()

    const {chatsRef} = useContext(Context)

    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('')
    const [chats, setChats] = useState([])
    const [isLoading, setIsloading] = useState(true)
    
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    async function createChat(e) {
        setIsloading(true)
        e.preventDefault()
        if (user.email === email) {
            setError("you can not create a chat with yourself")
            setIsloading(false)
            return 
        }
        chatsRef.orderByChild('title').equalTo(`${[user.email, email].sort()}`).once('value', (snapshot) => {
            if (snapshot.val()) {
                setError(`the chat with this user is already exists`)
            } else {
                const newChatRef = chatsRef.push()
                let newChat = {
                    key: newChatRef.key,
                    title: `${[user.email, email].sort()}`,
                    user1: user.email,
                    user2: email
                }
                newChatRef.set(newChat)
                togglePopup()
                setEmail('')
                setError('')
            }
        })
        setIsloading(false)
        if (error) {
            return 
        } 
    }

    useEffect(() => {  
        const getChats = async (snapshot) => {
            let Chats = []
            setIsloading(true)
            if (snapshot.val()) {
                for (var i in snapshot.val()) {
                    let chat = await chatsRef.child(i).get()
                    if (chat.val()) {
                        chat = chat.val()
                        console.log(chat);
                        if (chat.user2 === user.email) {
                            chat.title = chat.user1
                            Chats.push(chat)
                        } else if (chat.user1 === user.email) {
                            chat.title = chat.user2
                            Chats.push(chat)
                        }
                    }
                }
            }
            Chats = Chats.filter((item, pos) => {
                return Chats.indexOf(item) === pos
            })
            setIsloading(false)
            setChats(Chats);
        }
        chatsRef.on('value', async (snapshot) => await getChats(snapshot))
    }, [chatsRef, user.email])
    
    return (
        <section className='chats'>
            <h2>Your Chats</h2>
            {isLoading && <Loader/>}
            {chats[0] && 
                <div className="chat-links">
                    {chats.map(chat => <Link key={chat.key} to={chat.key} className='chat-link'>{chat.title}</Link>)}
                </div>
            }
            <Outlet/>
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
                            <input value={email} onChange={(event)=>setEmail(event.target.value)}  required type="email" className='input' placeholder='email' />
                            <button className='button'>{status === 'submitting' ? "Creating" : "Create"}</button>
                        </Form>   
                    </Popup>
                }
            </div>
        </section>
    );
}

export default Chats;