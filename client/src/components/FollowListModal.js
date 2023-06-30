import React, { useState } from 'react';
import Modal from 'react-modal';
import UserInfoModal from './UserInfoModal';
import fallback from '../images/fallback.png'

const FollowListModal = ({ isOpen, onRequestClose, followList, type }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUsernameClick = (user) => {
    setSelectedUser(user);
    setIsUserInfoModalOpen(true);
  };

  const filteredList = followList.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Follow List Modal"
      style={{
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '300px',
          overflow: 'auto',
          backgroundColor: '#FFF',
          borderRadius: '10px',
          padding: '20px',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <input
        type="text"
        placeholder={`Search ${type}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredList.length > 0 ? filteredList.map((user, index) => (
          <li key={index} onClick={() => handleUsernameClick(user)} style={{ cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}>
            <img onError = {(e)=> e.target.src = fallback } src={user.profilePic} alt={user.username} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px', objectFit:'cover' }} />
            {user.username}
          </li>
        )) : (
          <li style={{ padding: '5px' }}>No results found</li>
        )}
      </ul>

      {selectedUser && (
        <UserInfoModal
          isOpen={isUserInfoModalOpen}
          onRequestClose={() => setIsUserInfoModalOpen(false)}
          userInfo={selectedUser}
        />
      )}
    </Modal>
  );
};

export default FollowListModal;
