import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../Auth";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { Tooltip } from 'react-tooltip'
import { FaTimes, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import 'react-tooltip/dist/react-tooltip.css'
import NBACsv from "../nba.csv";
import Papa from 'papaparse';
import NBA from '../images/NBA.png';
import Hawks from '../images/Atlanta_Hawks.png';
import Celtics from '../images/Boston_Celtics.png';
import Nets from '../images/Brooklyn_Nets.png';
import Hornets from '../images/Charlotte_Hornets.png';
import Bulls from '../images/Chicago_Bulls.png';
import Cavaliers from '../images/Cleveland_Cavaliers.png';
import Mavericks from '../images/Dallas_Mavericks.png';
import Nuggets from '../images/Denver_Nuggets.png';
import Pistons from '../images/Detroit_Pistons.png';
import Warriors from '../images/Golden_State_Warriors.png';
import Rockets from '../images/Houston_Rockets.png';
import Pacers from '../images/Indiana_Pacers.png';
import Clippers from '../images/LA_Clippers.png';
import Lakers from '../images/Los_Angeles_Lakers.png';
import Grizzlies from '../images/Memphis_Grizzlies.png';
import Heat from '../images/Miami_Heat.png';
import Bucks from '../images/Milwaukee_Bucks.png';
import Timberwolves from '../images/Minnesota_Timberwolves.png';
import Pelicans from '../images/New_Orleans_Pelicans.png';
import Knicks from '../images/New_York_Knicks.png';
import Thunder from '../images/Oklahoma_City_Thunder.png';
import Magic from '../images/Orlando_Magic.png';
import Sixers from '../images/Philadelphia_76ers.png';
import Suns from '../images/Phoenix_Suns.png';
import Blazers from '../images/Portland_Trail_Blazers.png';
import Kings from '../images/Sacramento_Kings.png';
import Spurs from '../images/San_Antonio_Spurs.png';
import Raptors from '../images/Toronto_Raptors.png';
import Jazz from '../images/Utah_Jazz.png';
import Wizards from '../images/Washington_Wizards.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fallback from '../images/fallback.png';
import ReactCardFlip from 'react-card-flip';
import Coin from "./Coin";
import ReactCountryFlag from "react-country-flag"
import { backendUrl } from '../config';


const teamLogos = {
  'Atlanta Hawks': Hawks,
  'Boston Celtics': Celtics,
  'Brooklyn Nets': Nets,
  'Charlotte Hornets': Hornets,
  'Chicago Bulls': Bulls,
  'Cleveland Cavaliers': Cavaliers,
  'Dallas Mavericks': Mavericks,
  'Denver Nuggets': Nuggets,
  'Detroit Pistons': Pistons,
  'Golden State Warriors': Warriors,
  'Houston Rockets': Rockets,
  'Indiana Pacers': Pacers,
  'LA Clippers': Clippers,
  'Los Angeles Lakers': Lakers,
  'Memphis Grizzlies': Grizzlies,
  'Miami Heat': Heat,
  'Milwaukee Bucks': Bucks,
  'Minnesota Timberwolves': Timberwolves,
  'New Orleans Pelicans': Pelicans,
  'New York Knicks': Knicks,
  'Oklahoma City Thunder': Thunder,
  'Orlando Magic': Magic,
  'Philadelphia 76ers': Sixers,
  'Phoenix Suns': Suns,
  'Portland Trail Blazers': Blazers,
  'Sacramento Kings': Kings,
  'San Antonio Spurs': Spurs,
  'Toronto Raptors': Raptors,
  'Utah Jazz': Jazz,
  'Washington Wizards': Wizards,
};

const countryMap = {
  "Afghanistan": "AF",
  "Aland Islands": "AX",
  "Albania": "AL",
  "Algeria": "DZ",
  "American Samoa": "AS",
  "Andorra": "AD",
  "Angola": "AO",
  "Anguilla": "AI",
  "Antarctica": "AQ",
  "Antigua and Barbuda": "AG",
  "Argentina": "AR",
  "Armenia": "AM",
  "Aruba": "AW",
  "Australia": "AU",
  "Austria": "AT",
  "Azerbaijan": "AZ",
  "Bahamas": "BS",
  "Bahrain": "BH",
  "Bangladesh": "BD",
  "Barbados": "BB",
  "Belarus": "BY",
  "Belgium": "BE",
  "Belize": "BZ",
  "Benin": "BJ",
  "Bermuda": "BM",
  "Bhutan": "BT",
  "Bolivia": "BO",
  "Bonaire, Sint Eustatius and Saba": "BQ",
  "Bosnia and Herzegovina": "BA",
  "Botswana": "BW",
  "Bouvet Island": "BV",
  "Brazil": "BR",
  "British Indian Ocean Territory": "IO",
  "Brunei Darussalam": "BN",
  "Bulgaria": "BG",
  "Burkina Faso": "BF",
  "Burundi": "BI",
  "Cambodia": "KH",
  "Cameroon": "CM",
  "Canada": "CA",
  "Cape Verde": "CV",
  "Cayman Islands": "KY",
  "Central African Republic": "CF",
  "Chad": "TD",
  "Chile": "CL",
  "China": "CN",
  "Christmas Island": "CX",
  "Cocos (Keeling) Islands": "CC",
  "Colombia": "CO",
  "Comoros": "KM",
  "Congo": "CG",
  "Congo, Democratic Republic of the Congo": "CD",
  "Cook Islands": "CK",
  "Costa Rica": "CR",
  "Cote D'Ivoire": "CI",
  "Croatia": "HR",
  "Cuba": "CU",
  "Curacao": "CW",
  "Cyprus": "CY",
  "Czech Republic": "CZ",
  "Denmark": "DK",
  "Djibouti": "DJ",
  "Dominica": "DM",
  "Dominican Republic": "DO",
  "Ecuador": "EC",
  "Egypt": "EG",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  "Eritrea": "ER",
  "Estonia": "EE",
  "Ethiopia": "ET",
  "Falkland Islands (Malvinas)": "FK",
  "Faroe Islands": "FO",
  "Fiji": "FJ",
  "Finland": "FI",
  "France": "FR",
  "French Guiana": "GF",
  "French Polynesia": "PF",
  "French Southern Territories": "TF",
  "Gabon": "GA",
  "Gambia": "GM",
  "Georgia": "GE",
  "Germany": "DE",
  "Ghana": "GH",
  "Gibraltar": "GI",
  "Greece": "GR",
  "Greenland": "GL",
  "Grenada": "GD",
  "Guadeloupe": "GP",
  "Guam": "GU",
  "Guatemala": "GT",
  "Guernsey": "GG",
  "Guinea": "GN",
  "Guinea-Bissau": "GW",
  "Guyana": "GY",
  "Haiti": "HT",
  "Heard Island and Mcdonald Islands": "HM",
  "Holy See (Vatican City State)": "VA",
  "Honduras": "HN",
  "Hong Kong": "HK",
  "Hungary": "HU",
  "Iceland": "IS",
  "India": "IN",
  "Indonesia": "ID",
  "Iran, Islamic Republic of": "IR",
  "Iraq": "IQ",
  "Ireland": "IE",
  "Isle of Man": "IM",
  "Israel": "IL",
  "Italy": "IT",
  "Jamaica": "JM",
  "Japan": "JP",
  "Jersey": "JE",
  "Jordan": "JO",
  "Kazakhstan": "KZ",
  "Kenya": "KE",
  "Kiribati": "KI",
  "Korea, Democratic People's Republic of": "KP",
  "Korea, Republic of": "KR",
  "Kosovo": "XK",
  "Kuwait": "KW",
  "Kyrgyzstan": "KG",
  "Lao People's Democratic Republic": "LA",
  "Latvia": "LV",
  "Lebanon": "LB",
  "Lesotho": "LS",
  "Liberia": "LR",
  "Libyan Arab Jamahiriya": "LY",
  "Liechtenstein": "LI",
  "Lithuania": "LT",
  "Luxembourg": "LU",
  "Macao": "MO",
  "Macedonia, the Former Yugoslav Republic of": "MK",
  "Madagascar": "MG",
  "Malawi": "MW",
  "Malaysia": "MY",
  "Maldives": "MV",
  "Mali": "ML",
  "Malta": "MT",
  "Marshall Islands": "MH",
  "Martinique": "MQ",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Mayotte": "YT",
  "Mexico": "MX",
  "Micronesia, Federated States of": "FM",
  "Moldova, Republic of": "MD",
  "Monaco": "MC",
  "Mongolia": "MN",
  "Montenegro": "ME",
  "Montserrat": "MS",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Myanmar": "MM",
  "Namibia": "NA",
  "Nauru": "NR",
  "Nepal": "NP",
  "Netherlands": "NL",
  "Netherlands Antilles": "AN",
  "New Caledonia": "NC",
  "New Zealand": "NZ",
  "Nicaragua": "NI",
  "Niger": "NE",
  "Nigeria": "NG",
  "Niue": "NU",
  "Norfolk Island": "NF",
  "Northern Mariana Islands": "MP",
  "Norway": "NO",
  "Oman": "OM",
  "Pakistan": "PK",
  "Palau": "PW",
  "Palestinian Territory, Occupied": "PS",
  "Panama": "PA",
  "Papua New Guinea": "PG",
  "Paraguay": "PY",
  "Peru": "PE",
  "Philippines": "PH",
  "Pitcairn": "PN",
  "Poland": "PL",
  "Portugal": "PT",
  "Puerto Rico": "PR",
  "Qatar": "QA",
  "Reunion": "RE",
  "Romania": "RO",
  "Russian Federation": "RU",
  "Rwanda": "RW",
  "Saint Barthelemy": "BL",
  "Saint Helena": "SH",
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Martin": "MF",
  "Saint Pierre and Miquelon": "PM",
  "Saint Vincent and the Grenadines": "VC",
  "Samoa": "WS",
  "San Marino": "SM",
  "Sao Tome and Principe": "ST",
  "Saudi Arabia": "SA",
  "Senegal": "SN",
  "Serbia": "RS",
  "Serbia and Montenegro": "CS",
  "Seychelles": "SC",
  "Sierra Leone": "SL",
  "Singapore": "SG",
  "Sint Maarten": "SX",
  "Slovakia": "SK",
  "Slovenia": "SI",
  "Solomon Islands": "SB",
  "Somalia": "SO",
  "South Africa": "ZA",
  "South Georgia and the South Sandwich Islands": "GS",
  "South Sudan": "SS",
  "Spain": "ES",
  "Sri Lanka": "LK",
  "Sudan": "SD",
  "Suriname": "SR",
  "Svalbard and Jan Mayen": "SJ",
  "Swaziland": "SZ",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Syrian Arab Republic": "SY",
  "Taiwan, Province of China": "TW",
  "Tajikistan": "TJ",
  "Tanzania, United Republic of": "TZ",
  "Thailand": "TH",
  "Timor-Leste": "TL",
  "Togo": "TG",
  "Tokelau": "TK",
  "Tonga": "TO",
  "Trinidad and Tobago": "TT",
  "Tunisia": "TN",
  "Turkey": "TR",
  "Turkmenistan": "TM",
  "Turks and Caicos Islands": "TC",
  "Tuvalu": "TV",
  "Uganda": "UG",
  "Ukraine": "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "United States Minor Outlying Islands": "UM",
  "Uruguay": "UY",
  "Uzbekistan": "UZ",
  "Vanuatu": "VU",
  "Venezuela": "VE",
  "Viet Nam": "VN",
  "Virgin Islands, British": "VG",
  "Virgin Islands, U.s.": "VI",
  "Wallis and Futuna": "WF",
  "Western Sahara": "EH",
  "Yemen": "YE",
  "Zambia": "ZM",
  "Zimbabwe": "ZW"
};


const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };


function ProfilePage({ setFavoritePlayersVersion }) {
  const [bio, setBio] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [location, setLocation] = useState(null);
  const [coins, setCoins] = useState(0);
  const {setUser, user, setIsAuthenticated} = useContext(AuthContext);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [csv, setCsv] = useState(null);
  const [tqc, setTqc] = useState(0);
  const [tqa, setTqa] = useState(0); 
  const [isFlipped, setIsFlipped] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [profilePic, setProfilePic] = useState(fallback);
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    progressContainer: {
      height: '20px',
      width: '100%',
      margin: '10px 0',
    },
    
    progress: {
      height: '100%',
      borderRadius: 'inherit',
      transition: 'width .2s ease-in',
    },
    input: {
      margin: '10px 0',
      padding: '10px',
      width:'100%',
      borderRadius: '4px',
      boxSizing: 'border-box',
    },
    button: {
      margin: '10px',
      padding: '10px',
      width: '60%',
      backgroundColor: '#17408B',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      borderRadius:'5px'
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 'auto',
    },
    header: {
      color: 'black',
      margin: '10px 0',
    },
    quill: {
      padding: '10px',
      borderColor: 'lightgrey',
      borderRadius: '4px',
      minWidth: '100%',
    },
    playerContainer: {
      minWidth: '100%',
      maxWidth:'100%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: '10px',
      flexDirection: 'row',
      flexWrap: 'wrap',
      
  
    },player: {
      margin: '10px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column', 
      border: '1px solid lightgrey', 
      borderRadius: '8px',
      padding: '10px', 
      minHeight: '200px',
      position: 'relative', 
      minWidth:'122.5px',
      maxWidth:'122.5px',
      overflow:'hidden',
      cursor:'pointer',
    },
    playerImage: {
      width: '100px', 
      height: '100px', 
      borderRadius: '50%', 
      margin: '10px auto', 
      objectFit: 'cover',
      border: '1px solid lightgrey',
    },
    removeIcon: {
      position: 'absolute',
      top: '5px', 
      right: '5px',
      display: 'none',
      cursor: 'pointer',
      color: '#17408b',
    },
    playerName: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } ,
    profilePicture: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover',
      border:'1px lightgrey solid',
      cursor:'pointer',
      opacity: isHovered ? '0.2' : '1',
    },
    editButton:{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '10px',
      color: 'black',
      fontSize: '24px',
      border: 'none',
      cursor: 'pointer',
      opacity: isHovered ? '1' : '0',
      transition: 'opacity 0.3s ease',
    },
  };
  

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };


  useEffect(() => {
    const fetchPlayerData = async () => {
      for (const player of favoritePlayers) {
        const res = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${player}`);
        setPlayerData(prevState => ({
          ...prevState,
          [player]: res.data.data[0]
        }));
      }
    };

    fetchPlayerData();
  }, [favoritePlayers]);

  const handleFlip = (player) => {
    setIsFlipped(prevState => ({
      ...prevState,
      [player]: !prevState[player]
    }));
  };

  function calcFontSize(name) {
    if (name.length <= 10) {
      return 14;
    } else if (name.length <= 15) {
      return 12;
    } else {
      return 10;
    }
  }

  const getImgID = (name) => {
    for (let i=0;i<csv.length;i++) {
      if (csv[i][0].toLowerCase() === name.toLowerCase()) {
        return csv[i][6]
      }
    }
 }
 useEffect(() => {
    const fetchParseData = async () => {
      Papa.parse(NBACsv, {
        download:true,
        delimiter:"\n",
        complete: function(results) { 
            setCsv(results.data) 
        }
      })
    }
    fetchParseData()
  
  }, [])


  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${backendUrl}/Userdata`, {
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
      });
      const data = await res.json();
      setBio(data.bio);
      if (data.favoriteTeam !== 'Not Selected') {
        setFavoriteTeam(data.favoriteTeam);
      }
      setFavoritePlayers(data.favoritePlayers);
      setTqa(data.TriviaQuestionsAnswered);
      setTqc(data.TriviaQuestionsCorrect);
      setCoins(data.coins);
      setLocation(data.location);
      setProfilePic(data.profilePic)
    
    };
  
    fetchData();
  }, []);
  

  const handleUpdate = async () => {
    const res = await fetch(`${backendUrl}/UpdateUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, favoriteTeam, favoritePlayers, location, profilePic }),
      credentials:'include',
    });

    if (res.ok) {
      toast.success('Profile updated successfully', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error('There was an error updating your profile', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleRemovePlayer = async (name) => {
    getImgID(name);
    try {
      const response = await fetch(`${backendUrl}/RemoveFavoritePlayer`, {
        method: 'DELETE',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username:user, player:name})
      });
      
      if (response.ok) {
        toast.success(`Removed ${name} from favorites`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFavoritePlayers(prevPlayers => prevPlayers.filter(player => player !== name));
        setFavoritePlayersVersion(prevVersion => prevVersion + 1);
        
      } else {
        throw new Error('Failed to remove player from favorites');
    }
  } catch (error) {
    console.error(error);
  }
};

const handleLogout = async () => {
  try {
    setIsAuthenticated(false);
    setUser('');
    const response = await fetch(`${backendUrl}/Logout`, {
      method: 'GET',
      credentials: 'include', 
    });

    if (response.ok) {
      toast.success('Logged out successfully', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error('Failed to logout', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    navigate('/');
  } catch (error) {
    console.error('Failed to log out', error);
  }
};
const handleProfilePicChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const newProfilePic = e.target.result;
    setProfilePic(newProfilePic);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

return (
 <>
 <h1 style ={{textAlign:'center'}}>Welcome, {user}!</h1>
  <div style={{ display: 'flex', flexDirection: 'row' }}>
  <div style={{ width: '50%' }}>
      <div style={styles.container}>
        
        <h2 style ={styles.header}>Profile Picture</h2>
        <div style ={{position:'relative',  display: 'inline-block'}}>
        <label htmlFor="profilePicInput">
        {isHovered && <div style={styles.editButton}>Change</div>}
  <img
    src={profilePic}
    alt="Profile Picture"
    style={styles.profilePicture}
    onMouseOver={handleMouseOver}
    onMouseOut={handleMouseOut}
    onError = {(e)=> e.target.src = fallback}
  />
</label>
<input
  type="file"
  id="profilePicInput"
  style={{ display: 'none'}}
  onChange={handleProfilePicChange}
/>
</div>
        <h2 style={styles.header}>Bio</h2>
        <ReactQuill value={bio} onChange={setBio} modules={modules} style={styles.quill} />
        <div style={{ display: 'flex', flexDirection: 'column', placeItems: 'center' }}>
          <h2 style={styles.header}>Country</h2>
          <div style ={{display:'flex', placeItems:'center'}}>
          <ReactCountryFlag  style={{
                    fontSize: '2em',
                    lineHeight: '2em',
                    marginRight:'1%'
                }}countryCode={countryMap[location]} /><select
            style={styles.input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
              <option>Select Country</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Aland Islands">Aland Islands</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="American Samoa">American Samoa</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Anguilla">Anguilla</option>
              <option value="Antarctica">Antarctica</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Aruba">Aruba</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bonaire, Sint Eustatius and Saba">Bonaire, Sint Eustatius and Saba</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Bouvet Island">Bouvet Island</option>
              <option value="Brazil">Brazil</option>
              <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
              <option value="Brunei Darussalam">Brunei Darussalam</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Cape Verde">Cape Verde</option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Christmas Island">Christmas Island</option>
              <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Congo, Democratic Republic of the Congo">Congo, Democratic Republic of the Congo</option>
              <option value="Cook Islands">Cook Islands</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Cote D'Ivoire">Cote D'Ivoire</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Curacao">Curacao</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="French Guiana">French Guiana</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="French Southern Territories">French Southern Territories</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guam">Guam</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
              <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
              <option value="Honduras">Honduras</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jersey">Jersey</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
              <option value="Korea, Republic of">Korea, Republic of</option>
              <option value="Kosovo">Kosovo</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macao">Macao</option>
              <option value="Macedonia, the Former Yugoslav Republic of">Macedonia, the Former Yugoslav Republic of</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Martinique">Martinique</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
              <option value="Moldova, Republic of">Moldova, Republic of</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Northern Mariana Islands">Northern Mariana Islands</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Pitcairn">Pitcairn</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Qatar">Qatar</option>
              <option value="Reunion">Reunion</option>
              <option value="Romania">Romania</option>
              <option value="Russian Federation">Russian Federation</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Barthelemy">Saint Barthelemy</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Martin">Saint Martin</option>
              <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Serbia and Montenegro">Serbia and Montenegro</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Sint Maarten">Sint Maarten</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Georgia and the South Sandwich Islands">South Georgia and the South Sandwich Islands</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
              <option value="Swaziland">Swaziland</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syrian Arab Republic">Syrian Arab Republic</option>
              <option value="Taiwan, Province of China">Taiwan, Province of China</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Togo">Togo</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Viet Nam">Viet Nam</option>
              <option value="Virgin Islands, British">Virgin Islands, British</option>
              <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
              <option value="Wallis and Futuna">Wallis and Futuna</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>

              </select>
              </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', placeItems: 'center' }}>
        <button style={styles.button} onClick={handleUpdate}>
          Update Profile
        </button>
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
    <div style={{ width: '50%' }}>
      <div style={styles.container}>
        <h2 style={styles.header}>Favorite Team</h2>
        <div style={{ display: 'flex', flexDirection: 'row', placeItems: 'center' }}>
          {favoriteTeam && favoriteTeam.length > 0 && (
            <img
              src={teamLogos[favoriteTeam]}
              height="30px"
              style={{ objectFit: 'cover' }}
              onError={ (e) => e.target.src = NBA } />
          )}
          <select
            style={styles.input}
            id="favoriteTeam"
            value={favoriteTeam}
            onChange={(e) => setFavoriteTeam(e.target.value)}
          >
            <option value="">Select a team</option>
            <option value="Atlanta Hawks">Atlanta Hawks</option>
            <option value="Boston Celtics">Boston Celtics</option>
            <option value="Brooklyn Nets">Brooklyn Nets</option>
            <option value="Charlotte Hornets">Charlotte Hornets</option>
            <option value="Chicago Bulls">Chicago Bulls</option>
            <option value="Cleveland Cavaliers">Cleveland Cavaliers</option>
            <option value="Dallas Mavericks">Dallas Mavericks</option>
            <option value="Denver Nuggets">Denver Nuggets</option>
            <option value="Detroit Pistons">Detroit Pistons</option>
            <option value="Golden State Warriors">Golden State Warriors</option>
            <option value="Houston Rockets">Houston Rockets</option>
            <option value="Indiana Pacers">Indiana Pacers</option>
            <option value="LA Clippers">LA Clippers</option>
            <option value="Los Angeles Lakers">Los Angeles Lakers</option>
            <option value="Memphis Grizzlies">Memphis Grizzlies</option>
            <option value="Miami Heat">Miami Heat</option>
            <option value="Milwaukee Bucks">Milwaukee Bucks</option>
            <option value="Minnesota Timberwolves">Minnesota Timberwolves</option>
            <option value="New Orleans Pelicans">New Orleans Pelicans</option>
            <option value="New York Knicks">New York Knicks</option>
            <option value="Oklahoma City Thunder">Oklahoma City Thunder</option>
            <option value="Orlando Magic">Orlando Magic</option>
            <option value="Philadelphia 76ers">Philadelphia 76ers</option>
            <option value="Phoenix Suns">Phoenix Suns</option>
            <option value="Portland Trail Blazers">Portland Trail Blazers</option>
            <option value="Sacramento Kings">Sacramento Kings</option>
            <option value="San Antonio Spurs">San Antonio Spurs</option>
            <option value="Toronto Raptors">Toronto Raptors</option>
            <option value="Utah Jazz">Utah Jazz</option>
            <option value="Washington Wizards">Washington Wizards</option>
          </select>
        </div>

        <div>
          <h2 style={{ textAlign: 'center' }}>Trivia Stats</h2>
          <p> Trivia questions answered: {tqa} </p>
          <div style={{
            width: '100%',
            boxShadow: 'none',
            backgroundColor: 'transparent',
            display: 'flex'
          }}>
            {tqa !== 0 && (
              <>
                <div style={{ width: `${((tqc / tqa) * 100).toFixed(2)}%`, float: 'left', borderRadius: '50px' }}>
                  <div
                    data-tooltip-id="correctTooltip"
                    data-tooltip-content={`${((tqc / tqa) * 100).toFixed(2)}% Correct `}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#228B22',
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px 0px 0px 10px'
                    }} />
                 { tqc > 0 && <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', whiteSpace: 'nowrap', color: '#228B22' }}><span>{tqc}</span><FaCheckCircle style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '3px', flexShrink: '0' }} /></div> } 
                </div>


                <div style={{ width: `${((1 - (tqc / tqa)) * 100).toFixed(2)}%`, float: 'left', borderRadius: '50px' }}>
                  <div
                    data-tooltip-id="incorrectTooltip"
                    data-tooltip-content={`${((1 - (tqc / tqa)) * 100).toFixed(2)}% Incorrect`}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#DC143C',
                      width: '100%',
                      height: '40px',
                      borderRadius: '0px 10px 10px 0px'
                    }} />
                  {tqa-tqc > 0 && <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', whiteSpace: 'nowrap', color: '#DC143C' }}> <span>{tqa - tqc}</span> <FaTimesCircle style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '3px', flexShrink: '0' }} /> </div>}
                </div>


              </>
            )}
            <Tooltip id="correctTooltip" />
            <Tooltip id="incorrectTooltip" />
          </div>




        </div>
        <div style={{ display: 'flex', margin: '10px auto', placeItems: 'center' }}>
          <Coin />
          <h2 style={{ textAlign: 'center' }}>NBA Coins: <span style = {{fontWeight:'normal'}}>{coins}</span></h2>
          <FaInfoCircle
            style={{ color: '#17408b', fontSize: '20px', marginLeft: '10px', verticalAlign: 'middle' }}
            data-tooltip-id="info-tooltip"
            data-tooltip-content="Earn NBA coins by answering trivia questions, making posts, and predicting NBA games correctly. Climb the leaderboard to showcase your NBA knowledge!" />


          <Tooltip id="info-tooltip" place="top" effect="solid" multiline={true} multilineMaxWidth={200} style={{ width: '250px' }}>
          </Tooltip>
        </div>
        <h2 style={styles.header}>Favorite Players</h2>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div style={styles.playerContainer}>
            {favoritePlayers.length !== 0 ? (
              favoritePlayers.map((player, index) => (
                <ReactCardFlip isFlipped={isFlipped[player] || false} flipDirection="horizontal" key={index}>
                  <div
                    style={styles.player}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => handleFlip(player)}
                  >
                    <FaTimes
                      style={index === hoverIndex ? { ...styles.removeIcon, display: 'block' } : styles.removeIcon}
                      onClick={() => handleRemovePlayer(player, index)} />
                    <p style={{ ...styles.playerName, fontSize: calcFontSize(player) }}>{player}</p>
                    <img
                      style={styles.playerImage}
                      src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${getImgID(player)}.png`}
                      onError={(e) => {
                        e.target.src = fallback;
                      } }
                      alt="player" />
                  </div>
                  <div
                    style={styles.player}
                    onClick={() => handleFlip(player)}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <FaTimes
                      style={index === hoverIndex ? { ...styles.removeIcon, display: 'block' } : styles.removeIcon}
                      onClick={() => handleRemovePlayer(player, index)} />
                    {playerData[player] && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p style={{ ...styles.playerName, fontSize: calcFontSize(playerData[player].first_name + ' ' + playerData[player].last_name) }}>{playerData[player].first_name + ' ' + playerData[player].last_name}</p>
                        <p style={{ ...styles.playerName, fontSize: calcFontSize(playerData[player].height_feet? playerData[player].height_feet : 'Height not available' ) }}>{playerData[player].height_feet?(playerData[player].height_feet + '\'' + playerData[player].height_inches + '\"') :  'Height not available' }</p>
                        <p style={{ ...styles.playerName, fontSize: calcFontSize(playerData[player].weight_pounds? playerData[player].weight_pounds : 'Weight not available') }}>{playerData[player].weight_pounds?(playerData[player].weight_pounds + ' lbs') :'Weight not available'} </p>
                        <p style={{ ...styles.playerName, fontSize: calcFontSize(playerData[player].team.full_name? playerData[player].team.full_name : 'Team name not available' ) }}>{playerData[player].team.full_name? (playerData[player].team.full_name) : 'Team name not available'}</p>
                      </div>
                    )}
                  </div>
                </ReactCardFlip>
              ))
            ) : (
              <span>None</span>
            )}
          </div>
        </div>
        


      </div>

    </div>
    

  </div>

        </>
);

}

export default ProfilePage;

