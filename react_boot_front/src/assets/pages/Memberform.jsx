import axios from "axios";
import { useState } from "react"
import serverUrl from '../common/config'

function Memberform() {
    const [memberData, setmemberData] = useState({ userid: '', password: '', username: '', tel: '', email: '' })


    const setMemberform = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setmemberData((p) => {
            return { ...p, [name]: value }
        })

        console.log(memberData)
    }

    // 아이디, 비번 등 정보 등록 
    const memberformCheck = (event) => {
        event.preventDefault(); //action 페이지 이동 해제하는 기능

        // 정규성 검사
        const idreg = /^[A-Za-z]{1}[A-Za-z0-9_]{4,11}$/; //[a-zA-Z0-9_] = [\w]
        // 아이디 정규성
        if (!idreg.test(memberData.userid)) {
            alert("아이디는 첫 번째 글자를 영어로 하여 영대소문자,숫자,_포함 5~12자 이내 가능")
            return;
        }
        // 비밀번호 정규성
        const pwreg = /^[A-Za-z0-9]{8,10}$/
        if (!pwreg.test(memberData.userpwd)) {
            alert("비밀번호는 영대소문자, 숫자를 포함해 8~10자 이내로 가능")
            return;
        }
        if(memberData.password==""){
            alert("비밀번호를 입력하세요")
            return false;
        }
        if(memberData.username==""){
            alert("이름을 입력하세요")
            return false;
        }
        // 이름 정규성
        const namereg = /^[가-힣]{2,6}$/
        if (!namereg.test(memberData.username)) {
            alert("이름은 한글 2~6자 이내로 가능")
            return false;
        }
        // 전화번호 정규성
        const phonereg = /^(010|02|031|041|051|061)[-][0-9]{3,4}[-][0-9]{4}$/
        if (!phonereg.test(memberData.tel)) {
            alert("연락처는 010-0000-0000 형식으로 입력");
            return false;
        }
        // 이메일 정규성
        const emailreg = /^[A-Za-z0-9]{5,10}[@][a-zA-Z0-9]{2,6}[.][a-zA-Z]{2,3}([a-zA-Z]{2,3})?$/
        if (!emailreg.test(memberData.email)) {
            alert("이메일을 잘못 입력하였습니다.");
            return false;
        }

        // 백엔드(DB에서 확인 후 로그인summit)
        // alert("회원 등록")

        // 비동기식으로 백엔드 -> DB저장
        axios.post(serverUrl+"/joins/joinsForm", memberData)
        .then(function(response){
            console.log("회원가입됨", response)
            if(response.data!=null && response.data>0){
                //로그인 페이지 이동
                location.href = '/login'
            }
        })
        .catch(function(error){ 
            console.log("error", error)
        })
        
        // 로그인 페이지로 이동
        // location.href = '/login'
    }

    return (
        <div className="container" style={{ width: '500px' }}>
            <h1 style={{ textAlign: 'center' }}>회원가입</h1>
            <form onSubmit={memberformCheck}>
                <div className="mb-3 mt-3">
                    <label for="userid" className="form-label">아이디</label>
                    <input type="text" className="form-control" id="userid" placeholder="아이디를 입력하세요" name="userid" minLength={5} maxLength={12} required
                        onChange={setMemberform} />
                </div>
                <div className="mb-3">
                    <label for="userpwd" className="form-label">비밀번호</label>
                    <input type="password" className="form-control" id="password" placeholder="비밀번호를 입력하세요" name="password" required
                        onChange={setMemberform} />
                </div>
                <div className="mb-3">
                    <label for="username" className="form-label">이름</label>
                    <input type="text" className="form-control" id="username" placeholder="이름을 입력하세요" name="username" required
                        onChange={setMemberform} />
                </div>
                <div className="mb-3">
                    <label for="usertel" className="form-label">연락처</label>
                    <input type="text" className="form-control" id="tel" placeholder="연락처(010-1234-5678)를 입력하세요" name="tel" required
                        onChange={setMemberform} />
                </div>
                <div className="mb-3">
                    <label for="useremail" className="form-label">이메일</label>
                    <input type="email" className="form-control" id="email" placeholder="이메일을 입력하세요" name="email" required
                        onChange={setMemberform} />
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">회원가입하기</button>
                </div>
            </form>
        </div>
    )
}

export default Memberform