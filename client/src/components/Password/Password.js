import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { resetPassword } from '../../actions/passwordActions'
import styles from './Password.module.css'

const Password = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [form, setForm] = useState({
        password: '',
        confirmPassword: ''
    })
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if(form.password !== form.confirmPassword) {
            setMessage('Passwords do not match')
            return
        }
        if(form.password.length < 8) {
            setMessage('Password must be at least 8 characters long')
            return
        }
        dispatch(resetPassword(form, history))
    }

    return (
        <div className={styles.passwordContainer}>
            <div className={styles.formWrapper}>
                <h2>Reset Password</h2>
                <p className={styles.instruction}>Please enter your new password below.</p>
                <form onSubmit={handleSubmit} >
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="New Password"
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        required
                    />
                    <input 
                        type="password" 
                        name="confirmPassword"
                        placeholder="Confirm Password" 
                        onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                        required
                    />
                    {message && <p className={styles.errorMessage}>{message}</p>}
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    )
}

export default Password 