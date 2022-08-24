import React from 'react';
import {Link} from 'react-router-dom';
import '../styles.css';

const Navigation = ({userObj}) => {
    // Local Login을 했을때는 displayName이 null이고, Socil Login을 했을 때는 displayName이 존재한다
    if(userObj.displayName===null){ // local login해서 displayName이 Null인 경우
        const name = userObj.email.split('@')[0]; // name에 email의 @를 기준으로 나누어 [0]값을 저장하고
        userObj.displayName=name; // name을 다시 displayName에 넣어준다
    }
    
    return (
        <nav>
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/profile'>{userObj.displayName}'s Profile</Link>
                </li>
            </ul>
        </nav>
    );
}
export default Navigation;