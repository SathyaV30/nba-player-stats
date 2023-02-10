const Navbar = () => {
    return (<nav className = "nav">
        <a href = "/" className = "site-title">NBA stats </a>
        <ul>
            <li>
            <a href = "/Favorites" >Favorites</a>
            </li>
            <li>
            <a href = "/Compare" >Compare</a>
             </li>
        </ul>
    </nav>
    )
}

export default Navbar;