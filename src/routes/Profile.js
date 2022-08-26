import { updateProfile } from 'firebase/auth';
import { collection, getDocs, orderBy, where, query } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {auth, db, storage} from '../firebase';

const Profile = ({refreshUser, userObj})=>{
    const navigate = useNavigate();
    useEffect(() => {
        getMytoDos();
    }, []);

    const onLogOut = ()=> {
        auth.signOut();
        navigate("/");
        refreshUser(); //refreshUser해줌으로써 새로고침안해도 로그인화면으로 넘어감
    };
    
    const getMytoDos = async () => { //현재 유저의 저장된 toDo들을 받아옴
        const q = query( // db의 컬렉션 중 'todos'에서 userObj의 uid와 동일한 creatorId를 가진 모든 데이터를 내림차순으로 가져오는 쿼리(요청)생성
            collection(db, 'todos'),
            where('creatorId', '==', userObj.uid),
            orderBy('createdAt', 'desc')
        );
        // 쿼리 데이터 가져오기
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.map((doc) => {
            //console.log(doc.data());
        });

    };

    // 파일에 대한 Ref(upload, download, delete)생성, 파일경로: 유저이메일/랜덤식별자
    const photoRef = ref(storage, `${userObj.email}/${userObj.uid}`); 
    // userObj.uid에 uuidv4()를 넣게되면 값이 랜덤으로 생성되어 값을 몰라 데이터를 삭제할 수 없음

    const [photo, setPhoto] = useState(""); // reader로 부터 읽어온 파일의 데이터를 담을 변수
    const onFileChange = (e) => { // 파일의 변화 탐지 함수
        // console.log(e.target.files);
        const {target:{files},} = e; // event안의 target의 files를 받아옴
        const file = files[0]; // img파일을 넣을 변수, 1개의 파일만 저장
        // console.log(file);

        const reader = new FileReader(); // 파일을 읽어올 수 있는 web API
        reader.readAsDataURL(file); // readAsDataURL을 사용해서 파일을 읽어오고, 파일에 대한 데이터를 얻게 됨
        reader.onloadend = (finishedEvent) => { // 파일을 다 읽어오면 event listener를 file reader에 추가
            // console.log(finishedEvent);
            const {currentTarget:{result},} = finishedEvent; // finishedEvent안의 currentTarget의 result값을 받아옴(Img파일 데이터)
            setPhoto(result);
        };
    };

    const clear = async () => { // x버튼 클릭하면
        setPhoto(null); // 지금 선택된 사진 없애고
        setOk(true); //Ok버튼 생성
    }; 

    const onRemovePhoto = async () => { // remove버튼 클릭하면 
        await deleteObject(photoRef); //photo 지우고 
        await updateProfile(auth.currentUser, {photoURL: ''}); // url 비우기
        setPhoto(null);
        setOk(true); //Ok버튼 생성
    }; 

    const [ok, setOk] = useState(true); //o 버튼 생성여부
    const onOkClick = async () => { // ok버튼 클릭시 
        // fileRef로 부터 파일 참조 Url인 data_url을 받아와서 storage에 업로드, data_url은 readAsDataURL로 부터 생성된 데이터
        await uploadString(photoRef, photo, 'data_url'); 
        const photoUrl= await getDownloadURL(photoRef); // photoUrl에 업로드한 사진의 Url 저장
        await updateProfile(auth.currentUser, {photoURL: photoUrl}); // userObj의 photoURL 업데이트
        setOk(!ok); // ok버튼 제거
    };  
    // console.log(userObj.photoURL);
    // console.log(userObj.displayName);

    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onNameChange = (e) => {
        const {target:{value},} = e;
        setNewDisplayName(value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if(userObj.displayName !== newDisplayName){ // 이름에 변경사항이 있을때만 update
            await updateProfile(userObj, {displayName: newDisplayName});
        };
        refreshUser();
    }

    return (
        <>
        {
            userObj.photoURL ?
            <>
                <img src={userObj.photoURL} width="50px" height="50px"/>
                <button onClick={onRemovePhoto}>Remove Profile</button>
            </> :
            <>
                {photo ? // Img파일이 존재하면 img를 보여주고 아니면 파일선택을 보여줌
                    (
                    <div>
                        <img src={photo} width='100px' height='100px' />
                        {ok && // ok 버튼 눌렀을 때
                            <>
                                <input onClick={onOkClick} type="submit" value="o" />
                                <button onClick={clear}>x</button>
                            </> 
                        }
                    </div>
                    ) : 
                    <div>
                        <label htmlFor="img_file" style={{cursor:'pointer'}}>+ Add Profile...</label>
                        <input type="file" accept='image/*' onChange={onFileChange} id='img_file' style={{display:"none"}} value="" />
                    </div>
                }
            </>
        }
            <form onSubmit={onSubmit}>
                <input onChange={onNameChange} type="text" placeholder='name' value={newDisplayName} />
                <input type="submit" value="Update Name" />
            </form>
            <button onClick={onLogOut}>Log Out</button>
        </>
    );
}

export default Profile;