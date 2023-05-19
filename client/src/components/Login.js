import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [redirect,setRedirect] = useState(false)
  const {setIsAuthenticated, setUser}  = useContext(AuthContext);
  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '10%',
      gap: '10px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '20px',
      width: '30%',
      margin: 'auto'
    },
    input: {
      width: '80%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc'
    },
    button: {
      width: '85%',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      color: 'white',
      backgroundColor: '#17408B',
      cursor: 'pointer'
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('Please enter all fields');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/Login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        document.cookie = `token=${data.token}; Secure; HttpOnly; SameSite=Strict;`;
        setUser(username)
        setUsername('');
        setPassword('');
        setRedirect(true)
        setIsAuthenticated(true)
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
    }
    

    setUsername('');
    setPassword('');
  };
  if (redirect) {
    return <Navigate to ={'/'}/>
  }

  return (
    <div style={{textAlign: 'center'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {message && <p>{message}</p>}
        <div>
          <label htmlFor="username">Username</label>
          <input
            style={styles.input}
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button style={styles.button} type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;