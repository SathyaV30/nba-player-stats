import { useState } from "react";



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

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
 


  async function register(ev) {
    ev.preventDefault();
    if (!username || !password) {
      setMessage('Please enter all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/Register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
    }

    setUsername('');
    setPassword('');
  }

  return (
    <div style={{textAlign: 'center'}}>
     <div>

    <div>
      <h2>Register</h2>
      <form onSubmit={register} style={styles.form}>
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
        <button style={styles.button} type="submit">Register</button>
      </form>
    </div>
</div>
    </div>
  );
}