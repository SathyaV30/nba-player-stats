import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Auth';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Papa from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa';

const Posts = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [userModal, setUserModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });


  const styles = {
    postContainer: {
      border: '1px solid #ccc',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '10px',
    },
    postTitle: {
      color: '#333',
      fontSize: '24px',
      wordWrap: 'break-word',
    },
    postSummary: {
      color: '#666',
      fontSize: '18px',
      wordWrap: 'break-word',
    },
    postContent: {
      color: '#444',
      fontSize: '16px',
      wordWrap: 'break-word',
    },
    postButton: {
      backgroundColor: '#17408B',
      color: 'white',
      padding: '10px 20px',
      marginRight: '10px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '15px',
    },
    label: {
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    textarea: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      minHeight: '100px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px',
    },
    headerTitle: {
      margin: '10px',
    },
    dateInput: {
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '5px 10px',
      marginTop: '10px',
    },
    modalContent: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      minWidth: '800px',
      minHeight: '350px',
      maxWidth: '800px',
      maxHeight: '350px',
    
      overflow: 'auto',
      backgroundColor: '#FFF',
      borderRadius: '10px',
      padding: '20px',
    },
    modalOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  };
  

  
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/Posts?date=${date}`, { withCredentials: true });
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetchPosts();
  }, [isAuthenticated, date]);


  const editPost = (post) => {
    if (post.author.username !== user) {
      alert('You are not the author of this post');
      return;
    }
    setEditingPost(post);
    setTitle(post.title);
    setSummary(post.summary);
    setContent(post.content);
  };

  const savePost = async () => {
    try {
      await axios.put(`http://localhost:4000/Posts/${editingPost._id}`, { title, summary, content }, { withCredentials: true });
      setEditingPost(null);
      setTitle('');
      setSummary('');
      setContent('');
      fetchPosts();
    } catch (error) {
      alert(error.response.data.message)
    }
  };

  const deletePost = async (post) => {
    try {
      await axios.delete(`http://localhost:4000/Posts/${post._id}`, { withCredentials: true });
      fetchPosts();
    } catch (error) {
      alert(error.response.data.message)
    }
  };

  const likePost = async (post) => {
    try {
      await axios.post(`http://localhost:4000/Posts/${post._id}/like`, {}, { withCredentials: true });
      fetchPosts();
    } catch (error) {
      alert(error.response.data.message)
    }
  };

  const dislikePost = async (post) => {
    try {
      await axios.post(`http://localhost:4000/Posts/${post._id}/dislike`, {}, { withCredentials: true });
      fetchPosts();
    } catch (error) {
      alert(error.response.data.message)
    }
  };

  const getUser = async (post) => {
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      };
     const response = await axios.get(`http://localhost:4000/Posts/${post._id}`, config);
     const {username, bio, favoritePlayers,favoriteTeam} = response.data
     setUserInfo({username, bio, favoritePlayers, favoriteTeam});
     setUserModal(true);
    } catch (error) {
      alert('An error occured. Please try again')
    }
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]


  return (
    <>
      {isAuthenticated ? (
        <div>
          <div style={styles.header}>
          <h1 style={styles.headerTitle}>Posts from {date}</h1>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            style={styles.dateInput}
          />
        </div>

          {posts.map((post) => (
            <div key={post._id} style={styles.postContainer}>
              {editingPost === post ? (
               <>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>Title</label>
                 <input
                   type="text"
                   value={title}
                   onChange={(event) => setTitle(event.target.value)}
                   style={styles.input}
                 />
               </div>
             
               <div style={styles.inputGroup}>
                 <label style={styles.label}>Summary</label>
                 <input
                   type="text"
                   value={summary}
                   onChange={(event) => setSummary(event.target.value)}
                   style={styles.input}
                 />
               </div>
             
               <div style={styles.inputGroup}>
                 <label style={styles.label}>Content</label>
                 <ReactQuill
                   value={content}
                   modules={modules}
                   formats={formats}
                   onChange={(newValue) => setContent(newValue)}
                   style={styles.quill}
                 />
               </div>
             
               <div style={styles.buttonGroup}>
                 <button style={styles.postButton} onClick={savePost}>Save</button>
                 <button style={styles.postButton} onClick={() => setEditingPost(null)}>Cancel</button>
               </div>
             </>
             
              ) : (
                <>
                  <h2 style={styles.postTitle}>{post.title}</h2>
                  <p style={styles.postSummary}>{post.summary}</p>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} style={styles.postContent} />
                  <a style ={{color:'#17408b', cursor:'pointer',textDecoration:'underline'}} onClick = {() => getUser(post)}>@{post.author.username}</a>
                  <p>Likes: {post.likes ? post.likes.length : 0}</p>
                  <p>Dislikes: {post.dislikes ? post.dislikes.length : 0}</p>
                  <button style={styles.postButton} onClick={() => likePost(post)}> <FontAwesomeIcon icon={faThumbsUp} /> </button>
                  <button style={styles.postButton} onClick={() => dislikePost(post)}> <FontAwesomeIcon icon={faThumbsDown} /> </button>
                  <Modal
                  isOpen={userModal}
                  onRequestClose={() => setUserModal(false)}
                  contentLabel="User Info Modal"
                  style={{
                    content: styles.modalContent,
                    overlay: styles.modalOverlay,
                  }}
                >
                  {userInfo && (
                    <>
                      <div style={{position: 'relative'}}>
                      <FaTimes style={{position: 'absolute', top: 0, right: 0, cursor: 'pointer', color:'#17408b'}} onClick={() => setUserModal(false)} />
                      <h2>{userInfo.username} Profile</h2>
                      <p dangerouslySetInnerHTML={{ __html: userInfo.bio }}></p>
                      <p><strong>Favorite Team:</strong> {userInfo.favoriteTeam}</p>
                      <p><strong>Favorite Players:</strong> {userInfo.favoritePlayers.join(', ')}</p>
                  </div>
                    </>
                  )}
              </Modal>
                  {post.author._id === user.id && (
                    <>
                      <button style={styles.postButton} onClick={() => editPost(post)}>Edit</button>
                      <button style={styles.postButton} onClick={() => deletePost(post)}>Delete</button>
                    </>
                  )}
                </>
              )}
            </div>
          ))
          
          }
          
        </div>
        
      ) : (
        <h1 style ={{textAlign:'center'}}>Please log in or register</h1>
      )}
    </>
  );
}  
export default Posts;


 