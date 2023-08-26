import React from 'react';
import 'firebase/compat/auth';
import { auth } from '../index.js';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import '../styles/Registration.css'


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
        <div className='auth-container'>
            <h2>Registration</h2>
            {error && <h3 className="red">{error}</h3>}

            <Form method="post" className="auth-form" replace>
                <input  className='input' name="email" type="email" placeholder="Email address" required/>
                <input  className='input' name="password" type="password" placeholder="Password" required/>
                <button className='auth-button'
                    disabled={status === "submitting"}
                >
                    {status === "submitting"
                        ? "Signing up"
                        : "Sign up"
                    }
                </button>
            </Form>
        </div>
    );
}

export default Register;