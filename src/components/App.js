import React, { useEffect, useState } from 'react';
import AppRouter from './Router';
import {auth} from '../firebase';
import { updateCurrentUser } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);

  // 현재유저의 객체 저장 변수
  const [userObj, setUserObj] = useState(null);
  
  // 유저상태의 변화 탐지(로그인, 로그아웃, 앱 초기화될 때 발생)
  useEffect(()=>{ //
    auth.onAuthStateChanged((user)=>{
      // console.log(user);
      if(user){ // 유저상태의 변화(로그인)가 발생 하면
        setUserObj(user); // 현재유저의 객체에 유저정보를 저장
      }
      setInit(true); // 항상 true, 어플리케이션이 언제 시작해도 onAuthStateChanged가 실행되어야 하기 때문
    })
  },[]);

  const refreshUser = async () => { // 프로필 이름 변경시 user 새로고침
    await updateCurrentUser(auth, auth.currentUser);
    setUserObj(auth.currentUser);
  };

  return (  // 앱라우터에 유저객체와, Boolean(로그인상태)을 넘겨줌, 이렇게 하면 [login,setLogIn] state를 하나 줄임(render를 하나 덜하게 된다)
    <> 
      {init?<AppRouter refreshUser={refreshUser} logIn={Boolean(userObj)} userObj={userObj}/>:"Initializing..."}
      <footer>&copy;{new Date().getFullYear()} TodoList</footer>
    </>
  );
}

export default App;
