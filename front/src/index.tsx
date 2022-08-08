import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";
import './index.css';

import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'

// import store from './store/1_redux_toolkit/index'
// import {store} from './store/2_redux_toolkit/store'
// import {store} from './store/3_redux_toolkit/store'
import {store} from './store/store'



const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);
