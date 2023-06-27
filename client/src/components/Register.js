import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl } from '../config';
import LoadingAnimation from "./Loading";



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
    width: '57.5%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    color: 'white',
    backgroundColor: '#17408B',
    cursor: 'pointer',
    marginTop:'5px',
  }
};

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  async function register(ev) {
    ev.preventDefault();
    setLoading(true)
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
    } else if (password.length < 8) {
      toast.error(`Password must contain at least 8 characters`, {
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
    setUsername('');
    setPassword('');
  }

  return (
    <div style={{textAlign: 'center'}}>
     <div>

    <div>
      <h2>Register</h2>
      <form onSubmit={register} style={styles.form}>
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
        <button style={styles.button} type="submit">Register</button>
      </form>
    </div>
</div>
<div style ={{margin: '1%'}}>
      {loading && <LoadingAnimation/>}
      </div>
    </div>
  );
}