import { Link, Outlet } from 'react-router-dom'
import Footer from '../pages/Footer'
import '../css/top.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {serverUrl} from '../common/config'
const logoutFnc = () => {
    // 로그아웃: 로그인 정보를 지우고 홈페이지로 이동(sessionStorage 삭제)
    // sessionStorage.removeItem("logStatus") -> 특정 세션스토리지만 지울 때 사용
    sessionStorage.clear()
    // springboot서버의 session 지우기
    axios.get(serverUrl+"/joins/logout")
    .then((response)=>{
        location.href = "/"
    })
    .catch((error)=>{

    })


    
}

function Layout() {
    const [username, setUsername] = useState("")
    useEffect(()=>{
        setUsername(sessionStorage.getItem("logUsername"))
    },[])
    return (
        <>
            <div className="container top-menu">
                {(sessionStorage.getItem("logStatus") == null || sessionStorage.getItem("logStatus") != "Y")
                    && (<div><Link to="/login">로그인</Link></div>)
                }

                {(sessionStorage.getItem("logStatus") == null || sessionStorage.getItem("logStatus") != "Y")
                    && (<div><Link to="/memberform">회원가입</Link></div>)
                }

                {(sessionStorage.getItem("logStatus") != null && sessionStorage.getItem("logStatus") == "Y")
                    && (<div onClick={logoutFnc}><Link>{username}님 로그아웃</Link></div>)
                }

                {(sessionStorage.getItem("logStatus") != null && sessionStorage.getItem("logStatus") == "Y")
                    && (<div><Link to="/memberEdit">회원정보수정</Link></div>)
                }

                <div><Link to="">고객센터</Link></div>
                <div><Link to="/admin/home">관리자페이지</Link></div>
            </div>
            <div className='main-logo'>
                <Link to="/">시사IT아카데미</Link>
            </div>
            <div className='main-menu'>
                <div><Link to="/">홈</Link></div>
                <div><Link to="asynch">비동기처리</Link></div>
                <div><Link to="fetch">fetch</Link></div>
                <div><Link to="axios">axios</Link></div>
                <div><Link to="/board/list">뉴스게시판</Link></div>
                <div><Link to="/data/dataList">자료실</Link></div> 
                <div><Link to="/openApi/apiLayout">OpenAPI</Link></div>
            </div>

            <Outlet />

            <Footer />
        </>
    )

}
export default Layout