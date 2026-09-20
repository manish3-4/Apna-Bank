import React from "react";
import { ActionButtons } from "./ActionButtons";
import { formatNumber } from "./Utils";

export const Account = (props) => {
    const {type, accountNumber, balance, fullname, editingUser, setEditingUser, setDeleteUser, index, isAdmin, setEditModal} = props;
    
    const action = isAdmin ? <ActionButtons index={index} 
      editingUser={editingUser} 
      setEditingUser={setEditingUser} 
      setEditModal={setEditModal} setDeleteUser={setDeleteUser} /> : null;
    
    return (
      <div className="account">
          <div className="details">
              <h1>{fullname}</h1>
              <h3>{type}</h3>
              <div>{accountNumber}</div>
              {action}
          </div>
          <div className="balance">{formatNumber(balance)}</div>
      </div>
    )
}
