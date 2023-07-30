import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl } from '../config';
import LoadingAnimation from './Loading';
import '../App.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const register = async (ev) => {
    ev.preventDefault();
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
      const response = await fetch(`${backendUrl}/Register`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(`Registered user successfully `, {
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
      } else {
        toast.error(`User already exists`, {
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
      toast.error(`An error occured.`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false)
  };

  return (
    <div style={{textAlign: 'center'}}>
      <h1>Register</h1>
      <form onSubmit={register} style={styles.form}>
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
        <button style={styles.button} type="submit">Register</button>
      </form>
      <div style ={{margin: '1%'}}>
      {loading && <LoadingAnimation/>}
      </div>
    </div>
  );
};

export default Register;
