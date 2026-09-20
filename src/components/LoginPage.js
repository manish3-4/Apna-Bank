import { useState } from 'react';
import { Logo } from './Logo';
import { Notif } from './Notif';

export const LoginPage = ({ loginHandler, notif, onSwitch, onForgot }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        loginHandler(username, password);
    };

    return (
        <div id="login-page">
            <div className="auth-icon">
                <i className='bx bx-bank'></i>
            </div>
            <div id="login">
                <Logo />
                <Notif message={notif.message} style={notif.style} />
                <form onSubmit={onSubmitHandler}>
                    <label htmlFor="username">Username</label>
                    <input id="username" autoComplete="off" onChange={e => setUsername(e.target.value)} value={username} type="text" />
                    <label htmlFor="password">Password</label>
                    <input id="password" autoComplete="off" onChange={e => setPassword(e.target.value)} value={password} type="password" />
                    <p className="forgot-link"><span onClick={onForgot}>Forgot Password?</span></p>
                    <button type="submit" className="btn">Login</button>
                </form>
                <p className="auth-switch">Don't have an account? <span onClick={onSwitch}>Sign Up</span></p>
            </div>
        </div>
    );
};
