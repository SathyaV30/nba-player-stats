const Navbar = () => {
    
    return (<nav className = "nav">
      <a href="/" className="site-title">
  <img src={require(`../images/NBA.png`)} alt="NBA" className="navbar-logo"/> <span className="sts">Stats</span>
    </a>
        <ul>
            <li>
            <a href = "/Favorites" >Favorites</a>
            </li>
            <li>
            <a href = "/Compare" >Compare</a>
             </li>
             <li>
            <a href = "/Scores" >Live Scores</a>
             </li>
        </ul>
    </nav>
    )
}



export default Navbar;