import React, { useContext, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import fallback from '../images/fallback.png';
import { AuthContext } from '../Auth';
import { toast } from 'react-toastify';
import { backendUrl } from '../config';
import FollowListModal from './FollowListModal';

const UserInfoModal = ({ isOpen, onRequestClose, userInfo }) => {
  const { user } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);
  const [show, setShow] = useState(false);

  const checkIfUserFollowed = async (clickedUser) => {
    setShow(false);
    const res = await fetch(`${backendUrl}/Userdata`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json();
    const isFollowing = data.following.some(followedUser => followedUser.username === clickedUser);
    setFollowed(isFollowing);
    setShow(true);
  };

  useEffect(() => {
    if (userInfo) {
      checkIfUserFollowed(userInfo.username);
    }
  }, [userInfo]);

  const handleUserUnfollow = async (clickedUser) => {
    const res = await fetch(`${backendUrl}/UnfollowUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ clickedUser }),
    });

    if (res.ok) {
      toast.success(`Successfully unfollowed ${clickedUser}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setFollowed(false);
    } else {
      toast.error('An error occurred', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleUserFollow = async (clickedUser) => {
    const res = await fetch(`${backendUrl}/FollowUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ clickedUser }),
    });

    if (res.ok) {
      toast.success(`Successfully followed ${clickedUser}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setFollowed(true);
    } else {
      toast.error('An error occurred', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

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
          minHeight: '450px',
          maxWidth: '800px',
          maxHeight: '450px',
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
        onError={(e) => (e.target.src = fallback)}
    />
    <h2>{userInfo.username} Profile</h2>
    {show && userInfo.username !== user && (
        followed ? (
            <button
                style={{
                    marginLeft: '10px',
                    backgroundColor: '#17408b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                }}
                onClick={() => handleUserUnfollow(userInfo.username)}
            >
                <div style={{ display: 'flex', flexDirection: 'row', placeItems: 'center' }}>
                    <FaUserMinus style={{ marginRight: '5%', fontSize: '1.2rem' }} />
                    <span>Unfollow</span>
                </div>
            </button>
        ) : (
            <button
                style={{
                    marginLeft: '10px',
                    backgroundColor: '#17408b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                }}
                onClick={() => handleUserFollow(userInfo.username)}
            >
                <div style={{ display: 'flex', flexDirection: 'row', placeItems: 'center' }}>
                    <FaUserPlus style={{ marginRight: '5%', fontSize: '1.2rem' }} />
                    <span>Follow</span>
                </div>
            </button>
        )
    )}
</div>
            <p dangerouslySetInnerHTML={{ __html: userInfo.bio && userInfo.bio }}></p>
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
            <p>
              <strong>Followers:</strong> {userInfo.followers.length}
            </p>
            <p>
              <strong>Following:</strong> {userInfo.following.length}
            </p>

          </div>
        </>
      )}
    </Modal>
  );
};

export default UserInfoModal;
