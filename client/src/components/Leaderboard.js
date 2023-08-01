import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ReactCountryFlag from "react-country-flag"
import axios from 'axios';
import Modal from 'react-modal'
import UserInfoModal from './UserInfoModal';
import { backendUrl } from '../config';
import LoadingAnimation from './Loading';

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

const styles = {
    modalContent: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '800px',
        minHeight: '400px',
        maxWidth: '800px',
        maxHeight: '400px',
      
        overflow: 'auto',
        backgroundColor: '#FFF',
        borderRadius: '10px',
        padding: '20px',
      },
      modalOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
      },
}
  

const Leaderboard = () => {

  const [topPlayers, setTopPlayers] = useState([]);
  const [userModal, setUserModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});

  useEffect(() => {
    fetchTopPlayers();
  }, []);

  const handleUserClick = (user) => {
    setUserInfo(user);
    setUserModal(true);
  }




  const fetchTopPlayers = async () => {
    try {
      setLoading(true);
        const response = await fetch(`${backendUrl}/TopPlayers`, {
            headers: { 'Content-Type': 'application/json' },
            credentials:'include',
          });
      if (response.ok) {
        const data = await response.json();
        setTopPlayers(data);
      } else {
        console.error('Error fetching top players:', response.status);
      }
    } catch (error) {
      console.error('Error fetching top players:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Leaderboard</h1>
      <div style={{ display: 'flex', width: '80%', justifyContent: 'space-between', margin: '0px' }}>
        <div style={{ fontWeight: '640', width: '50px', textAlign: 'center' }}>Place</div>
        <div style={{ fontWeight: '640', flex: 2, textAlign: 'center' }}>Username</div>
        <div style={{ fontWeight: '640', flex: 2, textAlign: 'center' }}>NBA Coins</div>
        <div style={{ fontWeight: '640', flex: 3, textAlign: 'center' }}>Country</div>
      </div>
      {topPlayers.slice(0, 3).map((user, index) => (
        <div
          key={index}
          style={{
            backgroundColor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#CD7F32' : 'white',
            width: '80%',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '10px',
            borderRadius: '10px',
          }}
        >
          <div style={{ width: '50px', textAlign: 'center', fontSize: '20px' }}>
            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
          </div>
          <div style={{ flex: 2, textAlign: 'center'}}>
            <a
              style={{ color: '#17408b', cursor: 'pointer' }}
              onClick={() => handleUserClick(user)}
            >
              @{user.username}
            </a>
          </div>
          <div style={{ flex: 2, textAlign: 'center' }}>{user.coins}</div>
          <div style={{ flex: 3, textAlign: 'center' }}>
            <ReactCountryFlag
              style={{
                fontSize: '2em',
                lineHeight: '2em',
                marginRight: '1%',
              }}
              countryCode={countryMap[user.location]}
            />
          {windowDimensions.width <= 768
  ? user.location && countryMap[user.location]
    ? countryMap[user.location]
    : 'Not selected'
  : user.location || 'Not selected'}

          </div>
        </div>
      ))}
      {topPlayers.slice(3).map((user, index) => (
        <div
          key={index + 3}
          style={{
            width: '80%',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '10px',
            borderRadius: '10px',
            backgroundColor: 'white',
            border: '1px solid black',
          }}
        >
          <div style={{ width: '50px', textAlign: 'center' }}>{index + 4}</div>
          <div style={{ flex: 2, textAlign: 'center' }}>
            <a
              style={{ color: '#17408b', cursor: 'pointer'}}
              onClick={() => handleUserClick(user)}
            >
              @{user.username}
            </a>
          </div>
          <div style={{ flex: 2, textAlign: 'center' }}>{user.coins}</div>
          <div style={{ flex: 3, textAlign: 'center' }}>
            <ReactCountryFlag
              style={{
                fontSize: '2em',
                lineHeight: '2em',
                marginRight: '1%',
              }}
              countryCode={countryMap[user.location]}
            />
           {windowDimensions.width <= 768
  ? user.location && countryMap[user.location]
    ? countryMap[user.location]
    : 'Not selected'
  : user.location || 'Not selected'}


          </div>
        </div>
      ))}
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
  <div>{loading && <LoadingAnimation/>}</div>
</div>

      <UserInfoModal isOpen={userModal} onRequestClose={() => setUserModal(false)} userInfo={userInfo} />
    </div>
  );
};

export default Leaderboard;
