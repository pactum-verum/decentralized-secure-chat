import React from 'react';
import ReactDOM from 'react-dom/client';
import * as IPFS from 'ipfs-http-client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
try {
  // window.ipfs = ipfs({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  window.ipfs = await IPFS.create("http://localhost:5001");

  root.render(
    <React.StrictMode>
      <ChakraProvider>
        <App/>
      </ChakraProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error(error);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
