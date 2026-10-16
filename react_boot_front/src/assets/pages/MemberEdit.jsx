import axios from "axios";
import { useEffect, useState } from "react"
import serverUrl from '../common/config'

function Memberform() {
    const [memberData, setmemberData] = useState({})

    // useEffect에서 로그인 회원 정보를 DB에서 조회하여야 함
    useEffect(()=>{
        getJoins()
    },[])



    // 회원정보 가져오기
    function getJoins(){
        axios.post(serverUrl+"/joins/getjoins", {userid:sessionStorage.getItem("logUserid")})
        .then((response)=>{
            console.log(response.data)
            setmemberData({
                id: response.data.id,
                userid : response.data.userid,
                username : response.data.username,
                tel : response.data.tel,
                email : response.data.email,
                password : ""
            })
        })
        .catch((error)=>{
            console.log(error)
        })
    }


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

        // 비밀번호 정규성
        const pwreg = /^[A-Za-z0-9]{8,10}$/
        if (!pwreg.test(memberData.password)) {
            alert("비밀번호는 영대소문자, 숫자를 포함해 8~10자 이내로 가능")
            return;
        }

        if(memberData.password==""){
            alert("비밀번호를 입력하세요")
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

        // 백엔드(DB에서 수정)
        axios.post(serverUrl+"/joins/joinsEdit", memberData)
        .then((response)=>{
            console.log(response)
            if(response.data.userid==""){
                alert("수정실패, 비밀번호를 확인하세요")
            }else{
                alert("회원정보 수정이 완료되었습니다")
            }
        })
        .catch((error)=>{
            console.log(error)
        })

    }
    //회원탈퇴
    function unRegister(){
        //탈퇴확인하여 삭제한다.
        var que = confirm("회원탈퇴하시겠습니까?");
        if(que){//탈퇴할 경우
            //로그인한 id를 이용하여 탈퇴처리
            axios.delete(serverUrl+"/joins/unregister/"+sessionStorage.getItem("logId"))
            .then((response)=>{
                //회원탈퇴가 되었는지 확인, 0:탈퇴, 그외 탈퇴실패
                //탈퇴시 sessionStorage의 로그인 정보를 지우고
                if(response.data == "0"){
                    sessionStorage.clear();
                    location.href="/";        
                }
            })
            .catch((e)=>{
                console.log(e)
            })
        }
    }


    return (
        <div className="container" style={{ width: '500px' }}>
            <h1 style={{ textAlign: 'center' }}>회원정보 수정</h1>
            <form onSubmit={memberformCheck}>
                <div className="mb-3 mt-3">
                    <label for="userid" className="form-label">아이디</label>
                    <input type="text" className="form-control" id="userid" placeholder="아이디를 입력하세요" name="userid" minLength={5} maxLength={12} value={memberData.userid} disabled
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
                        onChange={setMemberform} value={memberData.username} readOnly />
                </div>
                <div className="mb-3">
                    <label for="usertel" className="form-label">연락처</label>
                    <input type="text" className="form-control" id="tel" placeholder="연락처(010-1234-5678)를 입력하세요" name="tel" required
                        onChange={setMemberform} value={memberData.tel} />
                </div>
                <div className="mb-3">
                    <label for="useremail" className="form-label">이메일</label>
                    <input type="email" className="form-control" id="email" placeholder="이메일을 입력하세요" name="email" required
                        onChange={setMemberform} value={memberData.email} />
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">회원정보 수정하기</button>
                </div>
            </form>
            <div className="d-grid p-3">
                <button className="btn btn-danger" onClick={unRegister}>회원탈퇴</button>
            </div>
        </div>
    )
}

export default Memberform