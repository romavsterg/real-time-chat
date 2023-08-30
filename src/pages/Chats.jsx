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
        console.log(`${[user.email, email].sort()}`);
        chatsRef.orderByChild('title').equalTo(`${[user.email, email].sort()}`.replace(',', '')).once('value', (snapshot) => {
            console.log(snapshot.val());
            if (snapshot.val()) {
                setError(`the chat with this user is already exists`)
                console.log('a')
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
                setEmail('')
                togglePopup()
            }
        })
        setIsloading(false)
        if (error) {
            return 
        } 
    }

    useEffect(() => {  
         function getChats(prop) {
            chatsRef.orderByChild(prop).equalTo(user.email).once('value', async (snapshot) => {
                setIsloading(true)
                for (var i in snapshot.val()) {
                    let chat = await chatsRef.child(i).get()
                    chats.push(chat.val())
                    console.log(chat.val());
                    setChats(chats);
                    // console.log(chats);
                }
                setIsloading(false)
            }) 
        }
        getChats('user1')
        getChats('user2')
        
    }, [chats, chatsRef, user.email])
    console.log(chats);
    
    return (
        <section className='chats'>
            <h2>Your Chats</h2>
            {isLoading && <Loader/>}
            {chats[0] && 
                <div className="chat-links">
                    {chats.map(chat => <Link key={chat.key} to={chat.key} className='chat-link'>{chat.title.replace(user.email, '')}</Link>)}
                </div>
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