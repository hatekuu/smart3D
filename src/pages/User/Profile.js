import React from 'react';

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const role=userData?.role;
  const username=userData?.username;

  return (
    <div>
      <h2>Thông Tin Cá Nhân</h2>
      <p>Tên người dùng: {username}</p>
      <p>Vai trò: {role}</p>
    </div>
  );
};

export default Profile;