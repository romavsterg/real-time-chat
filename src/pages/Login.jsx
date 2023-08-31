import React, { useContext } from 'react';
import { Context, auth } from '..';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { Form, Link, redirect, useActionData, useNavigate, useNavigation } from 'react-router-dom';
import { signInWithEmailAndPassword } from '@firebase/auth';
import '../styles/Login.css';

async function action({ request }) { 
    try {
        const formData = await request.formData() 
        const email = formData.get("email")
        const password = formData.get("password")
        const user = await signInWithEmailAndPassword(auth, email, password)
        const token = user.user.accessToken
        localStorage.setItem("token", token)
        localStorage.setItem("logedIn", true)
        return redirect('/')
    } catch (error) {
        return error.message
    }
}

function Login() {
    const navigate = useNavigate()
   
    const {auth} = useContext(Context)

    const LoginHandler = async (e) => {
        e.preventDefault()
        const provider = new firebase.auth.GoogleAuthProvider()
        const {user} = await auth.signInWithPopup(provider)
        localStorage.setItem("token", user.multiFactor.user.accessToken)
        localStorage.setItem("logedIn", true)
        navigate('/')
    }

    const status = useNavigation().state
    const error = useActionData() 
    const message = localStorage.getItem("message")
    localStorage.setItem("message", '')

    return (
        <div className="auth-container">
            <h2>Sign in to your account</h2>
            {error && <h3 className="red">{error}</h3>}
            {message && <h3 className="yellow">{message}</h3>}
            <div className="login-forms">
                <Form method="post" className="auth-form" replace>
                    <input className='input' name="email" type="email" placeholder="Email address" required />
                    <input className='input' name="password" type="password" placeholder="Password" required/>
                    <button className='button' disabled={status === "submitting"}>
                        {status === "submitting"
                            ? "Logging in..."
                            : "Log in"
                        }
                    </button>
                </Form>
                <div className="google-login">
                    <button className='google-login-button button' onClick={LoginHandler} >Sign in with Google</button>
                </div>
            </div>
            <h3>Don't have an account? You can<Link className='link' to='/register'> register.</Link></h3>
        </div>
    )
}

export {Login, action}