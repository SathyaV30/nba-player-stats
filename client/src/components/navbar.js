import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../Auth';
import { NavLink, useLocation } from 'react-router-dom';
import '../App.css'
import { CSSTransition } from 'react-transition-group';

const Navbar = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showHamburger, setShowHamburger] = useState(window.innerWidth <= 1200);

  const handleMenuClick = (event) => {
    event.stopPropagation();
 
      setShowMenu(!showMenu);
  
  };
  

  const closeMenu = () => {
    setShowMenu(false);
  }

  useEffect(() => {
    const handleResize = () => {
      setShowHamburger(window.innerWidth <= 1200);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  useEffect(()=> {
    console.log(showMenu)
  }, [showMenu])
  const navLinks = (
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
  );

  return (
    <nav className="nav">
        <NavLink to="/" className="site-title">
            <img src={require(`../images/NBA.png`)} alt="NBA" className="navbar-logo" />
            <span className="sts">Stats</span>
        </NavLink>

        {showHamburger && 
            <button onClick={handleMenuClick} className={`menu-button ${showMenu ? "menu-button-active" : ""}`}>
                <div className="menu-button-line" />
                <div className="menu-button-line" />
                <div className="menu-button-line" />
            </button>
        }

        {showHamburger && 
          <CSSTransition 
          in={showMenu} 
          timeout={300} 
          classNames="dropdown"
          unmountOnExit
      >
                <div className="dropdown" ref={dropdownRef}>
                    <div className="dropdown-container">
                        <li>
                            <NavLink to="/Leaderboard" className={location.pathname === "/Leaderboard" ? "bld" : "none"}>Leaderboard</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Trivia" className={location.pathname === "/Trivia" ? "bld" : "none"}>Trivia</NavLink>
                        </li>
                        <li>
                            <NavLink to="/MyPosts" className={location.pathname === "/MyPosts" ? "bld" : "none"}>My Posts</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Posts" className={location.pathname === "/Posts" ? "bld" : "none"}>Posts</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Post" className={location.pathname === "/Post" ? "bld" : "none"}>Create Post</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Favorites" className={location.pathname === "/Favorites" ? "bld" : "none"}>Favorites</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Compare" className={location.pathname === "/Compare" ? "bld" : "none"}>Compare</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Scores" className={location.pathname === "/Scores" ? "bld" : "none"}>Live Scores</NavLink>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <NavLink to="/Login" className={location.pathname === "/Login" ? "bld" : "none"}>Login</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Register" className={location.pathname === "/Register" ? "bld" : "none"}>Register</NavLink>
                                </li>
                            </>
                        ) : (
                            <li>
                                <NavLink to="/Profile" className={location.pathname === "/Profile" ? "bld" : "none"}>
                                Profile ({user})
                                </NavLink>
                            </li>
                        )}
                    </div>
                </div>
            </CSSTransition>
        }

        {!showHamburger && navLinks}
    </nav>
);

};

export default Navbar;
