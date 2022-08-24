import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import {auth} from '../firebase';
import '../styles.css';
import {FaGoogle,FaGithub, FaSyncAlt, FaUserPlus, FaKey} from "react-icons/fa";
const Auth = ()=>{
    const [email, setEmail] = useState(''); // email 저장 변수
    const [password, setPassword] = useState(''); // Password 저장 변수
    const [newAccount, setNewAccount] = useState(true); // 새계정 생성상태 저장 변수
    const [error, setError] = useState(''); // 에러 저장 변수

    // 입력된 이메일, 비밀번호의 변화 탐지
    const onChange = (e)=>{ // e 는 무슨 일이 일어났는가? 를 뜻함
        // console.log(e.target.name);
        const {target:{name, value}} = e; //event로 부터 target을 받아오고 name과 입력된 value를 받아옴
        if(name === 'email'){
            setEmail(value);
        } else if(name === 'password'){
            setPassword(value);
        }
    }

    // 로그인 버튼 클릭
    const onSubmit = async(e)=>{
        e.preventDefault(); // submit 하는 순간에 페이지 새로고침이 되는 것을 막아줌
        try {
            let data;
            if(newAccount){
                // create account
                data = await createUserWithEmailAndPassword(auth, email, password);
            } else{
                // log in
                data = await signInWithEmailAndPassword(auth, email, password);
            }
            //console.log(data);
        } catch (error) {
            // setError(error.message);
            alert(error.message);
        }
    }

    // toggle은 on, off 두 개의 상태밖에 없는 스위치를 뜻함
    // newAccount의 이전 값을 가져와서 그 값에 반대값을 리턴
    const toggleAccount = () => setNewAccount(prev => !prev);

    // social login 클릭 함수
    const onSocialClick = async (e) =>{
        // console.log(e.target.name);
        const {target:{name}} = e;
        let provider;
        if(name === "google"){ // 클릭한 소셜로그인이 구글이면
            provider = new GoogleAuthProvider();
        } else if(name === "github"){ // 클릭한 소셜로그인이 깃헙이면
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(auth, provider); // 소셜로그인 팝업창
        //console.log(data);
    }

    return  <div>
                <br/><br/>
                <h1>LogIn</h1>
                <form onSubmit={onSubmit}>
                    <input className='account' name='email' type="email" placeholder='Email' required value={email} onChange={onChange} /><br/>
                    <input className='account' name='password' type="password" placeholder='Password' required value={password} onChange={onChange} /><br/>
                    {newAccount?<FaUserPlus style={{cursor:'pointer'}} size="30" type='submit'/>:<FaKey style={{cursor:'pointer'}} type='submit' size="30"/>}&nbsp;&nbsp;&nbsp;&nbsp;
                    <FaSyncAlt size="25" style={{cursor:'pointer'}} onClick={toggleAccount}/>
                </form>
                {/* {error} */}
                <br/>
                <div>
                    <button onClick={onSocialClick} name='google'>Google</button>
                    <button onClick={onSocialClick} name='github'>GitHub</button>
                </div>
            </div>
}
export default  Auth;