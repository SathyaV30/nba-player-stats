import React, { useState, useEffect, useContext } from 'react';
import Autosuggest from 'react-autosuggest';
import Papa from 'papaparse';
import NBACsv from '../nba.csv';
import { ThemeContext } from '../Auth';





const suggestionStyles = {
    padding: '10px 20px',
    fontSize: '1.2em',
    listStyleType: 'none',
    border: 'none',
    borderRadius: '5px',

};




const Autocomplete = ({setPlayerName, onChange, value,isComponentA }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);
  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
  const {theme} = useContext(ThemeContext);

  const inputStyles = {
    fontSize: '1.2em',
    padding: '10px',
    border: '0.8px solid #17408B',
    borderRadius: '5px',
    width: '100%', 
    height:'100%',
    backgroundColor: theme == 'light' ? '#f1f1f1' : '#353535',
    color: theme == 'light' ? '#353535' : '#e8e5e5',
    boxShadow: '0px 0px 1px #ccc',

};


  const suggestionHoverStyles = {
    padding: '10px 20px',
    fontSize: '1.2em',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0px 0px 1px #ccc',

};

const suggestionContainerStyles = {
  position: 'absolute',
  top: 45,
  width: '100%', 
  backgroundColor: 'white',
  borderRadius: 3,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  zIndex: 999,
  cursor:'pointer',
  backgroundColor: theme === 'light' ? '#f1f1f1' : '#545454',
};


 
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerStyles = {
    position: 'relative',
    width: windowDimensions.width <=768 ? windowDimensions.width * 0.6 : windowDimensions.width * 0.3,
    height:'48px',
 
};

  

useEffect(() => {
    Papa.parse(NBACsv, {
      download: true,
      header: true,
      complete: function (results) {
        const names = results.data.map((row) => {
        
          let fullName = row.NBAName.split(' ');
          return  fullName[0] + ' ' + fullName[1]
        });
        setPlayerNames(names);
      },
    });
}, []);



  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : playerNames.filter(
          (name) =>
            name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const getSuggestionValue = (suggestion) => {
    if (isComponentA) {
        onChange({}, { newValue: suggestion }); 
        return suggestion;
    } else {
      setPlayerName(suggestion);
      setSuggestions([]);
      return;
    }
  };
  


  const renderSuggestion = (suggestion, { isHighlighted }) => (
    <div style={isHighlighted ? suggestionHoverStyles : suggestionStyles}>
      {suggestion}
    </div>
  );



  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

 
  const inputProps = {
    placeholder: 'Enter an NBA player\'s name',
    value,
    onChange: (event, { newValue }) => {
        onChange(event, { newValue });
    },
    style: inputStyles
};

  const themeContainer = {
    container: containerStyles,
    input: inputStyles,
    suggestionsContainer: suggestionContainerStyles,
    suggestionsList: { 
      padding: 0, 
      margin: 0, 
      listStyleType: 'none'  
    },
};


  return (
    <Autosuggest
      theme={themeContainer}
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}

    />
  );
};

export default Autocomplete;