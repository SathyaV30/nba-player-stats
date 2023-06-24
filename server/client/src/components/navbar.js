import React, { useContext } from 'react';
import { AuthContext } from '../Auth';
import { NavLink, useLocation } from 'react-router-dom';
import '../App.css'

const Navbar = () => {
  const {user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const location = useLocation();


  return (
    <nav className="nav">
      <NavLink to="/" className={"site-title"}>
        <img src={require(`../images/NBA.png`)} alt="NBA" className="navbar-logo" />{' '}
        <span className="sts">Stats</span>
      </NavLink>
      <ul>
      <li className='nav-links'>
          <NavLink to="/Leaderboard" className={location.pathname === "/Leaderboard" ? "bld" : "none"}>Leaderboard</NavLink>
        </li>
        <li className='nav-links'>
          <NavLink to="/Trivia" className={location.pathname === "/Trivia" ? "bld" : "none"}>Trivia</NavLink>
        </li>
        <li className='nav-links'>
          <NavLink to="/MyPosts" className={location.pathname === "/MyPosts" ? "bld" : "none"}>My Posts</NavLink>
        </li>
        <li className='nav-links'>
          <NavLink to="/Posts" className={location.pathname === "/Posts" ? "bld" : "none"}>Posts</NavLink>
        </li>
        <li className='nav-links'>
          <NavLink to="/Post" className={location.pathname === "/Post" ? "bld" : "none"}>Create Post</NavLink>
        </li>
        <li className='nav-links'>
          <NavLink to="/Favorites" className={location.pathname === "/Favorites" ? "bld" : "none"}>Favorites</NavLink>
        </li>
        <li className='nav-links'>
          <NavLink to="/Compare" className={location.pathname === "/Compare" ? "bld" : "none"}>Compare</NavLink>
        </li>
        <li className='nav-links'>
          <NavLink to="/Scores" className={location.pathname === "/Scores" ? "bld" : "none"}>Live Scores</NavLink>
        </li>
        {!isAuthenticated ? (
          <>
             <li className='nav-links'>
              <NavLink to="/Login" className={location.pathname === "/Login" ? "bld" : "none"}>Login</NavLink>
            </li>
            <li className='nav-links'>
              <NavLink to="/Register" className={location.pathname === "/Register" ? "bld" : "none"}>Register</NavLink>
            </li>
          </>
        ) : (
          <li className='nav-links'>
            <NavLink to="/Profile" className={location.pathname === "/Profile" ? "bld" : "none"}>
                Profile ({user})
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};


export default Navbar;