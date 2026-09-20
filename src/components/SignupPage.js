import { useState } from 'react';
import { Logo } from './Logo';
import { Notif } from './Notif';

export const SignupPage = (props) => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setAccountType] = useState('Savings Peso');
    const [notif, setNotif] = useState({ message: '', style: '' });

    const createRandomAccount = () =>
        Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (!fullname || !email || !password) {
            setNotif({ message: 'All fields are required.', style: 'danger' });
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(u => u.email === email)) {
            setNotif({ message: 'Email already registered.', style: 'danger' });
            return;
        }

        const newUser = {
            email,
            password,
            fullname,
            type: accountType,
            number: createRandomAccount(),
            isAdmin: false,
            balance: 0,
            transactions: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setNotif({ message: 'Account created! You can now login.', style: 'success' });
        setTimeout(() => props.onSwitch(), 1500);
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
                    <label htmlFor="fullname">Full Name</label>
                    <input id="fullname" autoComplete="off" onChange={e => setFullname(e.target.value)} value={fullname} type="text" />
                    <label htmlFor="email">Email Address</label>
                    <input id="email" autoComplete="off" onChange={e => setEmail(e.target.value)} value={email} type="email" />
                    <label htmlFor="password">Password</label>
                    <input id="password" autoComplete="off" onChange={e => setPassword(e.target.value)} value={password} type="password" />
                    <label htmlFor="accountType">Account Type</label>
                    <select id="accountType" value={accountType} onChange={e => setAccountType(e.target.value)}>
                        <option value="Savings Peso">Savings Account</option>
                        <option value="Checking Peso">Checking Account</option>
                    </select>
                    <button type="submit" className="btn">Create Account</button>
                </form>
                <p className="auth-switch">Already have an account? <span onClick={props.onSwitch}>Login</span></p>
            </div>
        </div>
    );
};
