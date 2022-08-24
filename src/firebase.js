import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID
  };

  // const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);

  initializeApp(firebaseConfig);

  export const auth = getAuth(); // authentication
  export const db = getFirestore(); // database
  export const storage = getStorage(); // storage

  // export 할 경우에는 import {함수명} from "경로"로 사용하는데,
  // export default 할 경우에는 import 함수명 from "경로"로 사용해야 한다.
  // export default 로 무언가를 방출하는 경우, 방출된 모듈의 이름과 상관없이 as를 쓰지않고 사용 가능 하다.