import './App.css';
import React, {useEffect} from 'react';
import HomePage from './components/home/HomePage';
import LoginPage from './components/login/LoginPage';
import ServersPage from './components/server/ServersPage';
import {useStore} from './Store';
import {useFetchData} from './hooks/useFetchData';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router';

const App: React.FC = () => {

    const fetchData = useFetchData();

    const apiInited = useStore((state) => state.apiInited);

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <Router>
            <Routes>
                <Route path='/login' element={!apiInited ? <LoginPage/> : <Navigate to='/servers' replace/>}/>
                <Route path='/servers' element=<ServersPage/>/>
                <Route path='/' element=<HomePage/>/>
            </Routes>
        </Router>
    );
}

export default App;
