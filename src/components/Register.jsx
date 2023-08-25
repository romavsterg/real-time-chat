import React from 'react';
import 'firebase/compat/auth';
import { auth } from '../index.js';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createUserWithEmailAndPassword } from '@firebase/auth';


export async function action({ request }) {
    try {
        const formData = await request.formData() 
        const email = formData.get("email")
        const password = formData.get("password")
        const user =await createUserWithEmailAndPassword(auth, email, password)
        console.log(user)
        localStorage.setItem('token', user.user.accessToken)
        return redirect('/')
    } catch (error) {
        return error.message
    }
}

function Register() {
    const status = useNavigation().state
    const error = useActionData() 

    return (
        <>
            <h1>Registration</h1>
            {error && <h3 className="red">{error}</h3>}

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
                        ? "Signing up"
                        : "Sign up"
                    }
                </button>
            </Form>
        </>
    );
}

export default Register;