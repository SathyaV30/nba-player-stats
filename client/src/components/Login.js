import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl } from '../config';
import LoadingAnimation from './Loading';
import { FaLock } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import '../App.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect] = useState(false)
  const {setIsAuthenticated, setUser, user}  = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '10%',
      gap: '20px', 
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '30px', 
      width:'350px',
      margin: 'auto',
    },
    inputGroup: {
      position: 'relative',
      width: '80%', 
      borderRadius: '5px',
      border: '1px solid #ccc'
    },
    input: {
      width: '100%',
      padding: '15px 15px 15px 50px',
      borderRadius: '5px',
      border: 'none',
      textAlign: 'left',
      fontSize: '20px',
    },
    icon: {
      position: 'absolute',
      left: '15px',
      top: '50%', 
      transform: 'translateY(-50%)', 
      color: '#999',
      fontSize: '20px',
    },
    button: {
      width: '80%', 
      padding: '15px',
      borderRadius: '5px',
      border: 'none',
      color: 'white',
      backgroundColor: '#17408B',
      cursor: 'pointer',
      marginTop:'10px', 
      fontSize:'20px',
    }
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!username || !password) {
      toast.error(`Please enter all fields`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false)
      return;
    }
    
    try {
      const response = await fetch(`${backendUrl}/Login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setUser(username)
        setLoading(false)
        toast.success(`Logged in as ${username}`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setUsername('');
        setPassword('');
        setRedirect(true)
        setIsAuthenticated(true)
      } else {
        setLoading(false)
        toast.error('Incorrect username or password', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
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
    setUsername('');
    setPassword('');
  };
  if (redirect) {
    return <Navigate to ={'/'}/>
  }

  return (
    <div style={{textAlign: 'center'}}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <FaUser style={styles.icon} />
          <input
            style={styles.input}
            type="text"
            id="username"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className = 'lg'
          />
        </div>
        <div style={styles.inputGroup}>
          <FaLock style={styles.icon} />
          <input
            style={styles.input}
            type="password"
            id="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className = 'lg'
          />
        </div>
        <button style={styles.button} type="submit">Login</button>
      </form>
      <div style ={{margin: '1%'}}>
      {loading && <LoadingAnimation/>}
      </div>
    </div>

  );
};

export default Login;
