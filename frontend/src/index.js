import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';

import Pong from './Pong';

ReactDOM.render(<Pong />, document.getElementById('root'));
registerServiceWorker();
