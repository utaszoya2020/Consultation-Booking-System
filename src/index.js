import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import 'normalize.css';
import 'antd/dist/antd.css';
import 'react-calendar/dist/Calendar.css';
import reducers from './redux/reducers/index';

const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
