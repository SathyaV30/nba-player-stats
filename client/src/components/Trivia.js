import React, { useState, useEffect, useContext } from 'react';
import NBAtrivia from '../nbatrivia.json';
import "../App.css";
import Modal from 'react-modal';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { AuthContext } from '../Auth';
import { Tooltip } from 'react-tooltip';
import { backendUrl } from '../config';






const Trivia = () => {
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState([]);
  const [answer, setAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const {user} = useContext(AuthContext)

  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});

  

  const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        placeItems: 'center',
        alignItems: 'center',
        justifyContent:'center',
        margin: 'auto',
        maxWidth: windowDimensions.width,
        position: 'relative',
        zIndex: 0,
        overflowY: 'overlay',
        backgroundColor:'white',
            },
    button: {
      marginTop: '10px',
      padding: '10px 20px',
      cursor: 'pointer',
      borderRadius:'5px',
    },
    buttonVisible: {
      backgroundColor: '#17408b',
      color: 'white',
      border: 'none',
    },
    buttonHidden: {
        backgroundColor: '#17408b',
        color: 'white',
        border: 'none',

    },
    wrapper: {
        position: 'relative',
        flex: 1,
      },
      modal: {
        content: {
          position: 'absolute',
          top: '45%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width:windowDimensions.width <=768 ? windowDimensions.width * 0.5 : windowDimensions.width * 0.2,
          height:windowDimensions.width <=768 ? windowDimensions.width * 0.5 : windowDimensions.width * 0.2,
        },
      },
    correct: {
      color: 'green',
      fontSize: '2em',
      animation: 'zoom 1s forwards'
    },
    incorrect: {
      color: 'red',
      fontSize: '2em',
      animation: 'zoom 1s forwards'
    } ,
    closeButton: {
        position: 'absolute',
        top: '3px',
        right: '3px',
        border: 'none',
        background: 'transparent',
        fontSize: '1.1em',
        cursor: 'pointer',
        color:'#17408b',
      }
};

  useEffect(() => {
    if (isAnswered) {
      setModalIsOpen(true);
    }
  }, [isAnswered]);

  const closeModal = () => {
    setModalIsOpen(false);
    setIsAnswered(false);
    setIsCorrect(null);
    generateRandomQuestion();
  };

  const handleAnswerSubmit = async () => {
    setIsCorrect(userAnswer === answer);
    const currentAnswer = userAnswer === answer;
    setIsAnswered(true);
  
    try {
      const res = await fetch(`${backendUrl}/SubmitAnswer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentAnswer, difficulty }),
        credentials:'include',
      });
  
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await res.json();
      console.log(data); 
    } catch (error) {
      console.error('There has been error:', error);
    }
  };
  
    


  useEffect(() => {
    generateRandomQuestion();
  }, []);

  const generateRandomQuestion = () => {
    const questions = NBAtrivia.questions;
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    setQuestion(randomQuestion.question);
    setChoices(randomQuestion.choices);
    setAnswer(randomQuestion.answer);
    setDifficulty(randomQuestion.difficulty);
    setUserAnswer('');
    setIsCorrect(null);
    setIsAnswered(false);
  };

  return (
    <div style={styles.container}>
      <div style = {{display:'flex', justifyContent:'center', alignItems: 'center'}}><h1>Trivia</h1><FaInfoCircle
            style={{ color: '#17408b', fontSize: '20px', marginLeft: '10px', verticalAlign: 'middle' }}
            data-tooltip-id="info-tooltip"
            data-tooltip-content="Earn NBA coins by answering trivia questions.
                                Correct easy question = +5 coins. 
                                Correct medium question = +7 coins. 
                                Correct hard quesion = +9 coins.
                                Incorrect question = -5 coins." />
          <Tooltip id="info-tooltip" place={windowDimensions.width <=768 ? "bottom" : 'right'} effect="solid" multiline={true} multilineMaxWidth={200} style={{ width: '300px' }}>
          </Tooltip></div>
     <Modal 
  isOpen={modalIsOpen}
  onRequestClose={closeModal} 
  style={styles.modal}
  contentLabel="Result Modal"
>
  <button style={styles.closeButton} onClick={closeModal}>&times;</button>
  <div style ={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection: 'column', height: '100%'}}>
    {isCorrect ? 
        <div style ={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection: 'column'}}>
        <FaCheckCircle style={styles.correct}/>
        <p>Correct!</p> 
      </div>
      :
      <div style ={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection: 'column'}}>
        <FaTimesCircle style={styles.incorrect}/>
        <p>Incorrect!</p>
        <span>The correct answer was: {answer}</span>
      </div>
    }
  </div>
</Modal>

     
      <h2>Question (<span style = {{color: difficulty == 'easy' ? 'green' : difficulty == 'medium' ? 'orange' : 'red'}}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>)</h2>
      <p style ={{fontSize:'1.3em'}}>{question}</p>
      <ul>
        {choices.map((choice, index) => (
         <span key={index} style ={{display: 'block', listStyleType:'none', margin: '10px 0'}}>
         <label>
           <input
             type="radio"
             name="answer"
             value={choice}
             checked={userAnswer === choice}
             onChange={(e) => setUserAnswer(e.target.value)}
             style={{margin:'3px'}}
           />
           {choice}
         </label>
       </span>
        ))}
      </ul>
      <button style={{...styles.button, ...(modalIsOpen ? styles.buttonHidden : styles.buttonVisible)}} onClick={handleAnswerSubmit} disabled={isAnswered}>Submit Answer</button>
      <button style={{...styles.button, ...(modalIsOpen ? styles.buttonHidden : styles.buttonVisible)}} onClick={generateRandomQuestion}>Generate Another Question</button>
    </div>
  );
};

export default Trivia;