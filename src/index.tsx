import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {ServiceProvider} from './services/ServiceProvider';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ServiceProvider>
                <App />
            </ServiceProvider>
        </React.StrictMode>
    );
}
