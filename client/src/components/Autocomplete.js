import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import Papa from 'papaparse';
import NBACsv from '../nba.csv'

const containerStyles = {
    position: 'relative',
    width: '300px',  // Set a fixed width
};

const inputStyles = {
    fontSize: '1.2em',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0px 0px 5px #ccc',
    width: '100%',  // Set width to 100% to fill the container
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
};




const suggestionStyles = {
    padding: '10px 20px',
    fontSize: '1.2em',
    listStyleType: 'none',
    border: 'none',
    borderRadius: '5px',

};

const suggestionHoverStyles = {
    backgroundColor: '#ddd',
    padding: '10px 20px',
    fontSize: '1.2em',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0px 0px 5px #ccc',

};


const Autocomplete = ({setPlayerName, onChange, value,isComponentA }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);

  

useEffect(() => {
    Papa.parse(NBACsv, {
      download: true,
      header: true,
      complete: function (results) {
        const names = results.data.map((row) => {
        
          let fullName = row.BBRefName.split(' ');
          return  fullName[0] + ' ' + fullName[1]
        });
        setPlayerNames(names);
      },
    });
}, []);

useEffect(()=> {
    console.log(playerNames)
}, [playerNames])




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
  };

  const theme = {
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
      theme={theme}
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