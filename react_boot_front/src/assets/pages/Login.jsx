import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {serverUrl} from '../common/config'

function Login() {

    const navi = useNavigate();

    // 아이디와 비번을 저장할 변수 생성
    const [loginData, setloginData] = useState({userid:'asdf1004',password:'asdf123456'})

    // form데이터를 useState변수에 set
    const setLoginForm = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setloginData((p) => {
            return { ...p, [name]: value }
        })
        console.log(loginData)
    }

    // 아이디, 비번 확인 
    const logFormCheck = () => {
        console.log(loginData, loginData.userid)
        event.preventDefault(); //action 페이지 이동 해제하는 기능

        // 아이디, 비번 입력 확인
        if (loginData.userid == undefined || loginData.userid == "") return;
        if (loginData.password == undefined || loginData.password == "") return;

        // 백엔드(DB에서 확인 후 로그인summit) : userid, password를 가지고 백엔드 요청
        // alert("백엔드 수행")
        axios.post(serverUrl+"/joins/login", loginData)
        .then((response)=>{
            if(!response.data){//정보가 없을때 false, 정보가 있을때 true
                alert("로그인 실패하였습니다.");
            }else{
                //로그인 성공, : id, userid, username, logStatus
                window.sessionStorage.setItem("logId", response.data.id);
                window.sessionStorage.setItem("logUserid", response.data.userid);
                window.sessionStorage.setItem("logUsername", response.data.username);
                window.sessionStorage.setItem("logStatus", "Y");

                //홈으로 이동하기
                location.href = "/"
                // navigate("/")
            }
        })
        .catch((error)=>{
            console.log(error)
        })

        // 로그인 성공: 홈페이지로 이동(sessionStorage에 상태 저장)
        // sessionStorage.setItem("logStatus", "Yes")
        // location.href = "/" // -> 자바스크립트 기반
        // navi("/") -> 리액트 기능(userNavigate: 어차피 location.href과 똑같음, 다만 변수에 담아서 사용해야 함)


        // 로그인 실패: 현재 페이지 유지

    }

    return (
        <div className="container" style={{ width: '500px' }}>
            <h1 style={{ textAlign: 'center' }}>로그인</h1>
            <form onSubmit={logFormCheck}>
                <div className="mb-3 mt-3">
                    <label for="text" className="form-label">아이디: </label>
                    <input type="text" className="form-control" id="userid" placeholder="Enter ID" name="userid"
                        onChange={setLoginForm} value={loginData.userid} />
                </div>
                <div className="mb-3">
                    <label for="pwd" className="form-label">비밀번호: </label>
                    <input type="password" className="form-control" id="password" placeholder="Enter password" name="password"
                        onChange={setLoginForm} value={loginData.password}/>
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login