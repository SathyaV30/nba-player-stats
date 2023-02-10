const Navbar = () => {
    return (<nav className = "nav">
        <a href = "/nba-stats" className = "site-title">NBA stats </a>
        <ul>
            <li>
            <a href = "/nba-stats/Favorites" >Favorites</a>
            </li>
            <li>
            <a href = "/nba-stats/Compare" >Compare</a>
             </li>
        </ul>
    </nav>
    )
}

export default Navbar;