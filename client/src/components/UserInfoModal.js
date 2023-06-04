import React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import fallback from '../images/fallback.png'

const UserInfoModal = ({ isOpen, onRequestClose, userInfo }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Info Modal"
      style={{
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '800px',
          minHeight: '395px',
          maxWidth: '800px',
          maxHeight: '395px',
          overflow: 'auto',
          backgroundColor: '#FFF',
          borderRadius: '10px',
          padding: '20px',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {userInfo && (
        <>
          <div style={{ position: 'relative' }}>
            <FaTimes
              style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', color: '#17408b' }}
              onClick={onRequestClose}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={userInfo.profilePic}
                style={{ height: '50px', width: '50px', objectFit: 'cover', border: '1px solid lightgrey', borderRadius: '50%', marginRight: '1.5%' }}
                alt="Profile"
                onError = {(e)=> e.target.src = fallback}
              />
              <h2>{userInfo.username} Profile</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: userInfo.bio && userInfo.bio}}></p>
            <p>
              <strong>Country:</strong> {userInfo.location ? userInfo.location : 'Not selected'}
            </p>
            <p>
              <strong>Favorite Team:</strong> {userInfo.favoriteTeam ? userInfo.favoriteTeam : 'None'}
            </p>
            <p>
              <strong>Favorite Players:</strong> {userInfo.favoritePlayers.length > 0 ? userInfo.favoritePlayers.join(', ') : 'None'}
            </p>
            <p>
              <strong>Trivia questions answered:</strong> {userInfo.TriviaQuestionsAnswered}
            </p>
            <p>
              <strong>Trivia questions correct:</strong> {userInfo.TriviaQuestionsCorrect}
            </p>
            <p>
              <strong>NBA Coins:</strong> {userInfo.coins}
            </p>
          </div>
        </>
      )}
    </Modal>
  );
};

export default UserInfoModal;
