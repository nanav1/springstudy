import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./assets/pages/Layout"
import Home from './assets/pages/Home'
import Login from './assets/pages/Login'
import Memberform from "./assets/pages/Memberform"
import MemberEdit from "./assets/pages/MemberEdit"
import AdminLayout from "./assets/pages/admin/AdminLayout"
import MemberList from "./assets/pages/admin/MemberList"
import BoardList from "./assets/pages/board/BoardList"
import BoardWrite from "./assets/pages/board/BoardWrite"
import AsynchPage from "./assets/pages/AsynchPage"
import FetchPage from "./assets/pages/FetchPage"
import AxiosPage from "./assets/pages/AxiosPage"
import BoardView from "./assets/pages/board/BoardView"
import BoardEdit from "./assets/pages/board/BoardEdit"

import DataList from "./assets/pages/data/DataList"
import DataWrite from "./assets/pages/data/DataWrite"
import DataDetail from "./assets/pages/data/DataDetail"
import DataEdit from "./assets/pages/data/DataEdit"

import ApiLayout from "./assets/apiPages/ApiLayout"
import ApiHome from "./assets/apiPages/ApiHome"
import KakaoMap from "./assets/apiPages/KakaoMap"
import EmailNaver from "./assets/apiPages/EmailNaver"
import Crawling from "./assets/apiPages/Crawling"
import AlbumDetail from "./assets/apiPages/albumDetail"

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* outlet에 표시할 기본(첫) 페이지 컴포넌트 설정 */}
          <Route index element={<Home />}></Route>
          <Route path="/asynch" element={<AsynchPage />}></Route>
          <Route path="/fetch" element={<FetchPage />}></Route>
          <Route path="/axios" element={<AxiosPage />}></Route>

          <Route path="/login" element={<Login />}></Route>
          <Route path="/memberform" element={<Memberform />}></Route>
          <Route path="/memberEdit" element={<MemberEdit />}></Route>
          
          <Route path="/board/list" element={<BoardList />}></Route>
          <Route path="/board/write" element={<BoardWrite />}></Route>
          <Route path="/board/view/:id" element={<BoardView />}></Route>
          <Route path="/board/boardEdit/:id" element={<BoardEdit />}></Route>

          <Route path="/data/dataList" element={<DataList />}></Route>
          <Route path="/data/dataWrite" element={<DataWrite />}></Route>
          <Route path="/data/dataDetail/:id" element={<DataDetail/>}></Route>
          <Route path="/data/dataEdit/:id" element={<DataEdit/>}></Route>
        </Route>
        <Route path="/openapi/apilayout" element={<ApiLayout/>}>
          <Route index element={<ApiHome/>}></Route>
          <Route path="/openapi/apilayout/kakaomap" element={<KakaoMap/>}></Route>
          <Route path="/openapi/apilayout/email" element={<EmailNaver/>}></Route>
          <Route path="/openapi/apilayout/crwaling" element={<Crawling/>}></Route>
        </Route>
        <Route path="/album/detail/:albumNo" element={<AlbumDetail />} />

        <Route path="/admin/home" element={<AdminLayout />}>
          <Route index element={<MemberList />}></Route>
          {/* <Route path="/memberList" element={<MemberList />}></Route> */}
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
