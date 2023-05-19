import { useContext, useState } from 'react'
import ReactQuill from 'react-quill'
import { AuthContext } from '../Auth'
import 'react-quill/dist/quill.snow.css'
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
    padding: '20px',
    width: '60%',
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
    marginTop:'50px',
  }
};
const Post = () => {
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const {isAuthenticated} = useContext(AuthContext)
    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      };
    
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    const createNewPost = async (ev) => {
      ev.preventDefault();
      const data = { title, summary, content }; 

      if (!data.title || !data.summary || !data.content) {
        alert('Please enter all fields');
        return;
      } else {
        alert('Post submitted successfully')
      }
        const response = await fetch('http://localhost:4000/Create', {
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
        <form onSubmit={createNewPost} style={styles.form}>
          <input
            style={styles.input}
            type="title"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <input
            style={styles.input}
            type="summary"
            placeholder="Summary"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
          />
  
          <ReactQuill
            style={styles.quill}
            value={content}
            modules={modules}
            formats={formats}
            onChange={(newValue) => setContent(newValue)}
          />
          <button style={styles.button}>Submit</button>
        </form>
      ) : (
        <h1 style={{textAlign: 'center'}}>Please log in or register</h1>
      )}
    </>
  );
}
  
export default Post;