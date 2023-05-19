import React, { useContext } from 'react';
import { AuthContext } from '../Auth';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const {user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <img src={require(`../images/NBA.png`)} alt="NBA" className="navbar-logo" />{' '}
        <span className="sts">Stats</span>
      </Link>
      <ul>
      <li>
          <Link to="/Trivia">Trivia</Link>
        </li>
      <li>
          <Link to="/Posts">Posts</Link>
        </li>
      <li>
          <Link to="/Post">Create Post</Link>
        </li>
        <li>
          <Link to="/Favorites">Favorites</Link>
        </li>
        <li>
          <Link to="/Compare">Compare</Link>
        </li>
        <li>
          <Link to="/Scores">Live Scores</Link>
        </li>
        {!isAuthenticated ? (
          <>
            <li>
              <Link to="/Login">Login</Link>
            </li>
            <li>
              <Link to="/Register">Register</Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/Profile">
                Profile ({user})
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
