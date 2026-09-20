import { Account } from "./Account";
import { useState } from "react";

export const MainContent = (props) => {
    const {users, editingUser, setEditingUser, setEditModal, setDeleteUser} = props;
    const [isCurrentUserAdmin] = useState(() => {
      const localUser = JSON.parse(localStorage.getItem('currentUser'));
      return localUser ? localUser.isAdmin : false;
    });
    
    const bankAccounts = users.map((user, index) => (
      <Account key={user.number} index={index} fullname={user.fullname} 
        type={user.type} 
        isAdmin={isCurrentUserAdmin} 
        accountNumber={user.number} 
        balance={user.balance} 
        editingUser={editingUser} 
        setEditingUser={setEditingUser} setEditModal={setEditModal} 
        setDeleteUser={setDeleteUser} />
    ));
      
    return (
      <section id="main-content">
        {bankAccounts}
      </section>
    )
}
