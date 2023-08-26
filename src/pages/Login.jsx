import React, { useContext } from 'react';
import { Context, auth } from '..';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { Form, Link, redirect, useActionData, useNavigation } from 'react-router-dom';
import { signInWithEmailAndPassword } from '@firebase/auth';

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

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        const {user} = await auth.signInWithPopup(provider)
        console.log(user)
    }
    const status = useNavigation().state
    const error = useActionData() 
    const message = localStorage.getItem("message")
    console.log(message)

    return (
        <div className="login-container">
            <h1>Sign in to your account</h1>
            {error && <h3 className="red">{error}</h3>}
            {message && <h3 className="yellow">{message}</h3>}

            <Form method="post" className="login-form" replace>
                <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                />
                <button
                    disabled={status === "submitting"}
                >
                    {status === "submitting"
                        ? "Logging in..."
                        : "Log in"
                    }
                </button>
            </Form>
            <h2>Or sign in with Google</h2>
            <button onClick={login} >Войти с помощью Google</button>
            <Link to='/register'>Don't have an account? You can register.</Link>
        </div>
    )
}

export {Login, action}