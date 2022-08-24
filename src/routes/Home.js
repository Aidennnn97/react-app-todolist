import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase'; // Firebase로부터 db, storage에 대한 권한 얻어옴
import { addDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import Todo from '../components/Todo';
import { v4 as uuidv4 } from 'uuid'; // uuid 는 어떤 특별한 식별자를 랜덤으로 생성해 준다
import '../styles.css';

const Home = ({userObj})=>{ // 라우터로부터 userObj값을 전달받음
    //console.log(userObj); // userObj 확인
    const [toDo, setToDo] = useState(''); // 할일을 저장할 변수
    const [toDos, setToDos] = useState([]); // 여러개의 할일들을 저장할 배열

    /*구식의 방식(새로고침을 해야 변경된 데이터 확인이 가능하다)ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
    // const getToDos = async ()=>{
    //     const dbToDos = await getDocs(collection(db, 'todos')); // firestore에 저장된 데이터들을 가져옴,'todos'는 Firestore의 collection이름 
    //     dbToDos.forEach((document)=>{ //dbToDos안에 있는 모든 document에 대해서 배열을 리턴하는데 그 배열은 새로 작성한 todo와 그 이전 데이터들이다. set이 붙는 함수를 쓸 때 값 대신에 함수를 전달할 수 있고, 함수를 전달하면 리액트는 이전 값에 접근할 수 있게 해준다.
    //         const todoObject = { // 객체에는 data와 id가 있다. Es6 spread attribute기능
    //             ...document.data(), // 데이터의 내용
    //             id: document.id,
    //         }
    //         // setToDos(prev => [document.data(), ...prev]); // document.data()대신 object를 만들어 넣어줌.
    //         setToDos(prev => [todoObject, ...prev]);
    //     });
    // };

    // useEffect(()=>{ // 페이지가 열리면 getToDos함수 호출.
    //     getToDos();
    //     onSnapshot(collection(db, 'todos'),(snapshot)=>{ // 실시간으로 db의 변화된 값을 계속해서 넘겨줌(create, read, update, delete)
    //         console.log('something happened!')
    //     });
    // }, []);
    /*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/

    useEffect(()=>{ // 페이지가 열리면 저장된 todo리스트를 보여줌
        onSnapshot(collection(db, 'todos'),(snapshot)=>{ // 실시간으로 db의 변화된 값을 계속해서 넘겨줌(create, read, update, delete)
            // console.log(snapshot.docs); // snapshot의 documetn 확인
            // forEach로 해도되지만 map으로 했을 때 re-render하지 않아도 되기 때문에 더 빠르게 실행된다
            const todoArray = snapshot.docs.map((doc)=>({ // snapshot에 있는 모든 doc은 objects를 반환하여 todoArray에 저장
                id: doc.id,
                ...doc.data(),
            }));
            // console.log(todoArray);
            setToDos(todoArray); // todo리스트 배열에 snapshot으로 가져온 todoArray 데이터 저장
        });
    }, []);

    
    const onTodoSubmit = async (e)=>{ // submit할 때 마다 firestore에 데이터 생성
        e.preventDefault();
        // const photoUrl = await getDownloadURL(ref(storage, photoRef)); // Photo downloadUrl
        // console.log(photoUrl);
        await addDoc(collection(db, "todos"),{ // 'todos'라는 컬렉션을 만듬
            toDo: toDo, // 콘솔창에 보이는 이름 : db에 저장된값 의 형식
            createdAt: Date.now(), // 저장한 시간
            creatorId: userObj.uid, // userObj로부터 uid값을 받아오고, 이제 todo를 누가 썼는지 알 수 있음
        });
        setToDo(''); // 입력칸 초기화

    }
    const onChange = (e)=>{ // 입력값(value)이 바뀔 때 마다 e안에 있는 target안에 있는 value를 가져옴
        const {target:{value}} = e;
        setToDo(value);
    }
    // console.log(toDos);  // 현재 firestore에 저장된 데이터 확인

    return (
        <div>
            {userObj.photoURL&& <img src={userObj.photoURL} />}
            <form onSubmit={onTodoSubmit}>
                <input value={toDo} onChange={onChange} type="text" placeholder='what needs to be done...'/>
                <input type="submit" value="Add" />
            </form>
            <div>
                {toDos.map((toDo)=>{ // map을 사용할 때는 key값을 넣어야 하는데 key는 React가 어떤 항목을 변경, 추가, 삭제 할지 식별하는 것을 돕고, element에 안정적인 고유성을 부여하기 위해 배열 내부의 element에 지정해주어야 한다, 만약 지정해 주지 않는 다면 Index값이 자동으로 설정되고 이로인해 성능이 저항되거나 문제가 발생할 수 있다
                    //return <div key={toDo.id}><h4>{toDo.toDo}</h4></div>
                    return <Todo key={toDo.id} toDoObj={toDo} owner={toDo.creatorId === userObj.uid}/> // Todo에 key값과 toDo객체를 넘겨주고, 현재 로그인된 유저(userObj.udi)가 todo를 작성한 사람(toDo.creatorId)과 같은 유저인지 아닌지 true, false값을 넘겨준다
                })}
            </div>
        </div>
    );
}
export default Home;