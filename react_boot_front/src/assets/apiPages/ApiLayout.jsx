import { Link, Outlet } from "react-router-dom"
import Footer from "../pages/Footer"

import "../css/top.css"

function ApiLayout() {

  return (
    <>
    <div className="row">
        <div className="col-sm-2 api-menu" style={{backgroundColor:"navy", color:"#fff", textAlign:"center", minHeight:"80vh"}}>
            <h1 style={{padding:"50px 0"}}><Link to="/openApi/apiLayout">OpenAPI</Link></h1>

            <div><Link to="/">Home</Link></div>
            <div><Link to="/openapi/apilayout/kakaomap">카카오맵</Link></div>
            <div><Link to="/openapi/apilayout/email">이메일보내기</Link></div>
        </div>
        <div className="col-sm-10 p-0">
          <Outlet/>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default ApiLayout