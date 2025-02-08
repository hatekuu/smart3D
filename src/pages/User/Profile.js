import React, { useEffect, useState } from 'react';
import { getUserProfile, updateProfile, deleteAddress } from '../../api/auth';
import './css/Profile.css'; // Import file CSS

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ address: '', phone: '', note: '' });
  const [newAddress, setNewAddress] = useState({ address: '', phone: '', note: '' });
  const [addingNew, setAddingNew] = useState(false);

  // State để chỉnh sửa số điện thoại
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getUserProfile();
        setUser(result && typeof result === "object" ? result : null);
        setNewNumber(result?.number || '');
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateNumber = async () => {
    try {
      await updateProfile({
        userId: user.userId,
        number: newNumber
      });
      const updatedUser = await getUserProfile();
      setUser(updatedUser);
      setIsEditingNumber(false);
    } catch (error) {
      console.error("Error updating phone number:", error);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(user.address[index]);
  };

  const handleUpdate = async () => {
    try {
      await updateProfile({
        userId: user.userId,
        addressIndex: editingIndex,
        ...editData
      });
      const updatedUser = await getUserProfile();
      setUser(updatedUser);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      await deleteAddress({
        userId: user.userId,
        addressIndex: index
      });
      const updatedUser = await getUserProfile();
      setUser(updatedUser);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleAddNew = async () => {
    if (!newAddress.address.trim()) return;

    try {
      await updateProfile({
        userId: user.userId,
        addressIndex: user.address.length,
        ...newAddress
      });
      const updatedUser = await getUserProfile();
      setUser(updatedUser);
      setNewAddress({ address: '', phone: '', note: '' });
      setAddingNew(false);
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  if (loading) return <p>Đang tải thông tin...</p>;
  if (!user) return <p>Không tìm thấy thông tin người dùng</p>;

  return (
    <div className="profile-container">
      <h2>Thông Tin Cá Nhân</h2>
      <p><strong>Tên:</strong> {user.username}</p>
      <p><strong>Vai trò:</strong> {user.role}</p>

      <p>
        <strong>Số điện thoại:</strong>{" "}
        {isEditingNumber ? (
          <input
            type="text"
            className="input-field"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        ) : (
          user.number || "Chưa cập nhật"
        )}
        {isEditingNumber ? (
          <>
            <button className="save-btn" onClick={handleUpdateNumber}>Lưu</button>
            <button className="cancel-btn" onClick={() => setIsEditingNumber(false)}>Hủy</button>
          </>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditingNumber(true)}>Sửa</button>
        )}
      </p>

      <h3>Danh sách địa chỉ:</h3>
      <ul className="address-list">
        {user.address?.length > 0 ? (
          user.address.map((addr, index) => (
            <li key={index} className="address-item">
              {editingIndex === index ? (
                <div className="edit-form">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nhập địa chỉ"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nhập số điện thoại"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ghi chú"
                    value={editData.note}
                    onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                  />
                  <button className="save-btn" onClick={handleUpdate}>Lưu</button>
                  <button className="cancel-btn" onClick={() => setEditingIndex(null)}>Hủy</button>
                </div>
              ) : (
                <div>
                  <p><strong>Địa chỉ:</strong> {addr.address}</p>
                  <p><strong>Điện thoại:</strong> {addr.phone}</p>
                  <p><strong>Ghi chú:</strong> {addr.note}</p>
                  <button className="edit-btn" onClick={() => handleEdit(index)}>Sửa</button>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>Xóa</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>Không có địa chỉ nào</p>
        )}
      </ul>

      {addingNew ? (
        <div className="add-new-container">
          <h3>Thêm địa chỉ mới</h3>
          <input
            type="text"
            className="input-field"
            placeholder="Nhập địa chỉ"
            value={newAddress.address}
            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Nhập số điện thoại"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Ghi chú"
            value={newAddress.note}
            onChange={(e) => setNewAddress({ ...newAddress, note: e.target.value })}
          />
          <button className="save-btn" onClick={handleAddNew}>Lưu</button>
          <button className="cancel-btn" onClick={() => setAddingNew(false)}>Hủy</button>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setAddingNew(true)}>Thêm địa chỉ</button>
      )}
    </div>
  );
};

export default Profile;
