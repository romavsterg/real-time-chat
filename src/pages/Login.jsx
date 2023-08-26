import React, { useContext } from 'react';
import { Context, auth } from '..';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { Form, Link, redirect, useActionData, useNavigation } from 'react-router-dom';
import { signInWithEmailAndPassword } from '@firebase/auth';
import '../styles/Login.css';

async function action({ request }) {
    try {
        const formData = await request.formData() 
        const email = formData.get("email")
        const password = formData.get("password")
        const user = await signInWithEmailAndPassword(auth, email, password)
        const token = user.user.accessToken
        console.log(user, token)
        localStorage.setItem("token", token)
        return redirect('/')
    } catch (error) {
        return error.message
    }
}

function Login() {
    const {auth} = useContext(Context)

    const login = async (e) => {
        e.preventDefault()
        const provider = new firebase.auth.GoogleAuthProvider()
        const {user} = await auth.signInWithPopup(provider)
        console.log(user.multiFactor.user)
        localStorage.setItem("token", user.multiFactor.user.accessToken)
        redirect('/')
    }
    const status = useNavigation().state
    const error = useActionData() 
    const message = localStorage.getItem("message")
    localStorage.setItem("message", '')
    console.log(message)

    return (
        <div className="auth-container">
            <h2>Sign in to your account</h2>
            {error && <h3 className="red">{error}</h3>}
            {message && <h3 className="yellow">{message}</h3>}
            <div className="login-forms">
                <Form method="post" className="auth-form" replace>
                    <input className='input' name="email" type="email" placeholder="Email address" required />
                    <input className='input' name="password" type="password" placeholder="Password" required/>
                    <button className='auth-button' disabled={status === "submitting"}>
                        {status === "submitting"
                            ? "Logging in..."
                            : "Log in"
                        }
                    </button>
                </Form>
                <div className="google-login">
                    <button className='google-login-button auth-button' onClick={login} >Sign in with Google</button>
                </div>
            </div>
            <Link className='link' to='/register'>Don't have an account? You can register.</Link>
        </div>
    )
}

export {Login, action}