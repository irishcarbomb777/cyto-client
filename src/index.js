import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router} from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import config from './config';


Amplify.configure({
  // Initiates the S3 
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
  },
  API: {
    endpoints: [
      { // Scandata DynamoDB api
        name: "scandata",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      // NOTE: You'll need to add the python server API below this entry
    ]
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();