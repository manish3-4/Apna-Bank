import { useState } from 'react';
import DATA from '../data';
import { Dashboard } from './Dashboard';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { ClientDashboard } from './ClientDashboard';

export const Authenticate = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notif, setNotif] = useState({ message: '', style: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [client, setClient] = useState(null);
    const [authView, setAuthView] = useState('login');

    const getUsers = () => {
        const stored = localStorage.getItem('users');
        if (!stored) {
            localStorage.setItem('users', JSON.stringify(DATA));
            return [...DATA];
        }
        return JSON.parse(stored);
    };

    const clients = getUsers();

    const isLoginSuccess = (email, password) => {
        const user = clients.find(u => u.email === email && u.password === password);
        if (user) {
            setIsAdmin(user.isAdmin);
            setClient(user);
            setNotif({ message: '', style: '' });
            return true;
        }
        setNotif({ message: 'Wrong username and password.', style: 'danger' });
        return false;
    };

    const login = (username, password) => {
        if (isLoginSuccess(username, password)) {
            setIsLoggedIn(true);
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('client');
        setNotif({ message: 'You have logged out.', style: 'success' });
    };

    if (isLoggedIn) {
        localStorage.setItem('currentUser', JSON.stringify(client));
        return isAdmin
            ? <Dashboard users={clients} logoutHandler={logout} />
            : <ClientDashboard client={client} users={clients} setClient={setClient} logout={logout} />;
    }

    if (authView === 'signup') {
        return <SignupPage onSwitch={() => setAuthView('login')} />;
    }

    if (authView === 'forgot-password') {
        return <ForgotPasswordPage onSwitch={() => setAuthView('login')} />;
    }

    return <LoginPage
        loginHandler={login}
        notif={notif}
        onSwitch={() => setAuthView('signup')}
        onForgot={() => setAuthView('forgot-password')}
    />;
};
