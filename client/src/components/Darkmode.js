import React, { useContext } from "react";
import { ReactComponent as Sun } from "../images/Sun.svg";
import { ReactComponent as Moon } from "../images/Moon.svg";
import "./Darkmode.css";
import { ThemeContext } from "../Auth";

const DarkMode = () => {
    const {theme, toggleTheme} = useContext(ThemeContext)
    return (
        <div className='dark_mode'>
            <input
            className='dark_mode_input'
            type='checkbox'
            id='darkmode-toggle'
            checked={theme === 'dark'}
            onChange={()=> toggleTheme()}
        />

            <label className='dark_mode_label' for='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;