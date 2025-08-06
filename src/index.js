import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'primereact/resources/primereact.min.css';
// import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/themes/mdc-dark-indigo/theme.css"
import 'primeicons/primeicons.css';
import { Provider } from 'react-redux';
import Store from './store/Store';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

