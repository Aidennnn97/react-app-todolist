import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../firebase';

const Todo = ({toDoObj, owner}) => { // Home.js로 부터 toDoObj, owner를 받아옴
    const [edit, setEdit] = useState(false); // 수정 상태를 나타내는 변수 초기화
    const [newToDo, setNewToDo] = useState(toDoObj.toDo); // 수정된 todo를 저장할 변수, 이전에 저장된 toDo값을 default로 초기화
    const onEdit = ()=> {
        setEdit((prev) => !prev); // 수정버튼클릭 함수, 이전값을가져오고, 반대값을 리턴해준다
        setNewToDo(toDoObj.toDo); // 수정 상태에서 입력하다가 cancel 클릭시 수정상태에서 입력된 데이터를 원래 저장된 값으로 초기화 
    }; 
    const onChange = (e) => { // 입력값(value)이 바뀔 때 마다 e안에 있는 target안에 있는 value를 가져옴
        const {target: {value}} = e;
        setNewToDo(value);
    };
    const onSubmit = async (e) => { // toDoObj로부터 id값을 받아와 collection의 toDo에 newToDo 저장
        e.preventDefault();
        await updateDoc(doc(db, 'todos', toDoObj.id), {toDo: newToDo});
        setEdit(false); // 수정완료후 수정상태 변경
    };

    const onDelete = async ()=>{ // 삭제버튼클릭 함수
        const ok = window.confirm('Are you sure you want to delete this todo?');
        if(ok){ // delete todo, (db, collection, document) 형식
            await deleteDoc(doc(db, 'todos', toDoObj.id)); // toDo 객체의 id 값을 받아와 삭제
        }
    };

    return ( 
        <div>
            {edit ? ( // 수정상태이면, input에 onChange를 넣지않으면 수정하고있어도 수정되는지 볼 수 없음
                    <>
                        {owner && ( // 유저가 일치하면 수정 폼을 보여줌
                            <>
                            <div className='todolist'>
                                <form onSubmit={onSubmit}>
                                    <div className='todo'>
                                    <input onChange={onChange} type='text' placeholder='Edit your todo' value={newToDo} required /> 
                                    </div>
                                    <div className='todobtn'>
                                    <button onClick={onEdit}>Cancel</button>
                                    <button type='submit'>Update</button>
                                    </div>
                                </form>
                            </div>
                            </>
                        )}
                    </>
                ) : ( // 수정상태 아니면
                    <>
                        {owner && ( // 유저가 일치하면 유저의 toDo를 받아옴
                            <>
                            <div className='todolist'>
                            <div className='todo'>{toDoObj.toDo}</div>
                            <div className='todobtn'>
                            <button onClick={onEdit}>Edit</button>
                            <button onClick={onDelete}>Delete</button>
                            </div>
                            </div>
                            </>
                        )}
                    </>
                )}
        </div>
)};

export default Todo;