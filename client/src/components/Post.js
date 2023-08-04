import { useContext, useState } from 'react'
import ReactQuill from 'react-quill'
import { AuthContext } from '../Auth'
import 'react-quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl } from '../config';


const Post = () => {


  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const {isAuthenticated} = useContext(AuthContext)
    const styles = {
      form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%',
        gap: '10px',
        border: 'none',
        borderRadius: '10px',
        width: windowDimensions.width <=768 ? '95%' : '60%',
        margin: 'auto'
      },
      input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc'
      },
      quill: {
        width: '100%',
        height: '200px'
      },
      button: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        color: 'white',
        backgroundColor: '#17408b',
        cursor: 'pointer',
        marginTop:windowDimensions.width <=768 ? '65px' : '10px'
      }
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
    
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link',
    ]

    const createNewPost = async (ev) => {
      ev.preventDefault();
      const data = { title, summary, content }; 

      if (!data.title || !data.summary ) {
        toast.error('Please enter a title and summary', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      } else {
        toast.success('Post submitted successfully', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
        const response = await fetch(`${backendUrl}/Create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          credentials: 'include',
          body: JSON.stringify(data), 
      })

      
    
  
      
  }
  
      
  return (
    <>
      {isAuthenticated ? (
        <><h1 style={{ textAlign: 'center' }}>Create Post</h1><form onSubmit={createNewPost} style={styles.form}>
          <input
            style={styles.input}
            type="title"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)} />
          <input
            style={styles.input}
            type="summary"
            placeholder="Summary"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)} />

          <ReactQuill
            style={styles.quill}
            value={content}
            modules={modules}
            formats={formats}
            onChange={(newValue) => setContent(newValue)}
            placeholder='Enter your hotest NBA takes, stories, or facts!' />
          <button style={styles.button}>Submit</button>
        </form></>
      ) : (
        <h1 style={{textAlign: 'center'}}>Please log in or register</h1>
      )}
    </>
  );
}
  
export default Post;