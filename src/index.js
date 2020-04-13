import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, browserHistory } from 'react-router-dom';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import './index.css';
import App from './App';
import 'normalize.css';
import 'antd/dist/antd.css';
import 'react-calendar/dist/Calendar.css';
import reducers from './redux/reducers/index';

const routerMiddleware = routerMiddleware(browserHistory);

const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
    applyMiddleware(routerMiddleware)
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <App history={history} />
    </Provider>,
    document.getElementById('root')
);
