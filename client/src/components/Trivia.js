import React, { useState, useEffect, useContext } from 'react';
import NBAtrivia from '../nbatrivia.json';
import "../App.css";
import Modal from 'react-modal';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AuthContext } from '../Auth';




const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        placeItems: 'center',
        alignItems: 'center',
        justifyContent:'center',
        margin: 'auto',
        maxWidth: '50%',
        maxHeight: '500px', 
        minHeight:'500px',
        border: '1px solid #17408b',
        padding: '10px',
        marginTop:'50px',
        position: 'relative',
        zIndex: 0,
        overflowY: 'scroll' // Make it scrollable vertically
      },
    button: {
      marginTop: '10px',
      padding: '10px 20px',
      cursor: 'pointer',
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
          width:'200px',
          height:'150px',
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

const Trivia = () => {
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState([]);
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const {user} = useContext(AuthContext)

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
      const res = await fetch('http://localhost:4000/SubmitAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentAnswer }),
        credentials:'include',
      });
  
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await res.json();
      console.log(data); 
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
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
    setUserAnswer('');
    setIsCorrect(null);
    setIsAnswered(false);
  };

  return (
    <div style={styles.container}>
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

      <h2>Trivia Question:</h2>
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
