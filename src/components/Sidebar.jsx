import React from 'react';
import User from './User';

const Sidebar = ({ users }) => {
  return (
    <div className="sidebar">
      {users.map((user, index) => (
        <User key={index} name={user.name} />
      ))}
    </div>
  );
};

export default Sidebar;
