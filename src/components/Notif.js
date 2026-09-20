import React from 'react';

export const Notif = (props) => {
    if (!props.message) return null;
    return <div className={`notif ${props.style}`}>{props.message}</div>;
};
