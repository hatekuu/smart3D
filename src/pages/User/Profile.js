import React from 'react';

const Profile = () => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  return (
    <div>
      <h2>Thông Tin Cá Nhân</h2>
      <p>Tên người dùng: {username}</p>
      <p>Vai trò: {role}</p>
    </div>
  );
};

export default Profile;