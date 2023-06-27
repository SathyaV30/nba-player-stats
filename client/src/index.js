import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
    <ToastContainer
  toastStyle={{
    progressBar: {
      background: 'linear-gradient(to right, #ff0000, #ffffff, #0000ff)',
    },
   
  }}
/>


  </React.StrictMode>
);

