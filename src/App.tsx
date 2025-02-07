import React, {useEffect} from 'react';
import HomePage from './components/home/HomePage';
import LoginPage from './components/login/LoginPage';
import ServersPage from './components/server/ServersPage';
import {useFetchData} from './hooks/useFetchData';
import {Route, Routes} from 'react-router';

const App: React.FC = () => {

    const fetchData = useFetchData();

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <Routes>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/servers' element={<ServersPage/>}/>
            <Route path='/' element={<HomePage/>}/>
        </Routes>
    );
}

export default App;
