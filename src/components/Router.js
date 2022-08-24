import React from 'react';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Profile from '../routes/Profile';
import Navigation from './Navigation';

const AppRouter = ({refreshUser,logIn, userObj})=> { // App.js 로 부터 logIn 상태와 userObj 값을 받아오고 userObj값을 Home에 전달
    return (
        <Router>
            {logIn && <Navigation userObj={userObj}/>}
            <Routes>
                {logIn
                ? (
                <>{/* Home, Profile에 userObj를 줌으로써 로그인된 사용자의 toDo만 볼 수 있음 */}
                <Route exact path='/' element={<Home userObj={userObj}/>}></Route>
                <Route exact path='/profile' element={<Profile refreshUser={refreshUser} userObj={userObj}/>}></Route>
                </>
                ) : ( 
                <>
                <Route exact path='/' element={<Auth/>}></Route>
                {/*  이렇게 사용하면 url이 /(Home)가 되지않고 profile로 그대로 남음
                <Route exact path='/profile' element={<Auth/>}/>
                 */}
                </>
                )}
            </Routes>
        </Router>
    )
};
export default AppRouter;