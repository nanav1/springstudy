import { Link } from 'react-router-dom'
import '/src/assets/css/board.css'
import { useEffect, useState } from 'react'
import axios from 'axios';
import {serverUrl} from '../../common/config'

function BoardList() {
    // 해당페이지의 레코드를 담을 변수
    const [boardList, setBoardList] = useState([]);

    // 페이지번호 관련 정보를 보관할 변수
    // 현재페이지, 총레코드수, 총페이지수, 시작페이지, 검색어, 검색키..
    const [pageInfo, setPageInfo] = useState({})
    // 출력할 페이지번호
    const [pageNum, setpageNum] = useState([])
    // 검색어, 검색키를 담을 변수
    const [searchData, setsearchData] = useState({
        searchKey: 'subject',
        searchWord: '',
    })
    // 사용자가 입력한 검색키와 검색어를 searchData에 담는 변수
    const setSearchWord = (event) => {
        setsearchData((previous) => {
            return { ...previous, [event.target.name]: event.target.value }
        })
        //console.log(searchData)
    }
    useEffect((pNum)=>{
        getBoardList(1);
    },[])

    // 데이터베이스에서 해당 페이지 레코드정보, 페이지(검색어) 관련 response
    const getBoardList = (pNum) => {
        // 게시판 목록 페이지는 자동으로 서버에서 레코드 가져와 -> boardList에 setting
        // 검색어가 있으면 현재페이지와 검색키, 검색어를 서버(boot)에 보낸다.
        var queryData = "?nowPage=" + pNum;
        if(searchData.searchWord != ''){
            queryData += "&searchKey=" + searchData.searchKey+"&searchWord="+searchData.searchWord
        }
        axios.get(`${serverUrl}/board/boardList${queryData}`)
        // axios.get("/board/boardList?nowPage="+pNum)
        .then((response)=>{
            //console.log("게시판목록:",response)

            //필요한 정보(id, subject, username, hit, createDateTime)
            setBoardList([]);
            response.data.boardList.map((record)=>{
                //userState 변수에 세팅
                setBoardList((prev)=>{
                    return [...prev,{id:record.id, 
                                     subject:record.subject,
                                     username:record.joinsEntity.username,
                                     hit:record.hit,
                                     writedate:record.updateDateTime
                                    }]
                })
            })
            //페이지 정보 처리
            setPageInfo({nowPage:response.data.pages.nowPage,
                         totalRecord:response.data.pages.totalRecord,
                         totalPage:response.data.pages.totalPage,
                         startPage:response.data.pages.startPage
                        });

            //페이지 번호 매기기
            setpageNum([]);
            const pageNumTemp=[];
            for(var p = response.data.pages.startPageNum ; p< response.data.pages.startPageNum+response.data.pages.onePageNumCount; p++){
               if(p<= response.data.pages.totalPage){ //페이지 번호는 총 페이지 수보다 작거나 같을 때 생성
                pageNumTemp.push(p);
               }
            }
            setpageNum(pageNumTemp);
        })
        .catch((error)=>{
           // console.log("boarderror:",error)
        })

        setPageInfo((previous) => {
            return { ...previous, nowPage: pNum }
        })
    }
    
    return (
        <div className="container">
            <div className="board-title">게시판목록</div>
            {/* 로그인 시 글쓰기 */}
            {
                sessionStorage.getItem("logStatus") != null && sessionStorage.getItem("logStatus") == "Y" &&
                <div>
                    <Link to="/board/write">글쓰기</Link>
                </div>
            }
            <div className="row">
                <div className="col-sm-2">총레코드수 : {pageInfo.totalRecord}개</div>
                <div className='col-sm-8' style={{ textAlign: 'center' }}>
                    {/* 검색(제목, 글쓴이, 글내용) */}
                    {/* 검색키 */}
                    <select name="searchKey" onChange={setSearchWord}>
                        <option value="subject">제목</option>
                        <option value="content">글내용</option>
                        <option value="userid">작성자</option>
                    </select>
                    <input type="text" name="searchWord" placeholder="검색어입력" onChange={setSearchWord} onKeyDown={(e)=>{if(e.key === 'Enter'){getBoardList(1)}}}/>
                    <input type="button" value="검색" className="btn btn-info" onClick={()=>getBoardList(1)} />
                </div>
                <div className="col-sm-2" style={{ textAlign: 'right' }}>{pageInfo.nowPage}/{pageInfo.totalPage}</div>
            </div>

            {/* 게시판 목록 */}
            <div className='list'>
                <div className="row" style={{ fontWeight: 'bold' }}>
                    <div className="col-sm-1 p-3">번호</div>
                    <div className="col-sm-7 p-3">제목</div>
                    <div className="col-sm-1 p-3">작성자</div>
                    <div className="col-sm-1 p-3">조회수</div>
                    <div className="col-sm-2 p-3">등록일</div>
                </div>
                {
                    boardList.map((record, idx) => {
                        return < div className="row" key={idx}>
                            <div className="col-sm-1 p-3">{record.id}</div>
                            <div className="col-sm-7 p-3"><Link to={`/board/view/${record.id}`}>{record.subject}</Link></div>
                            <div className="col-sm-1 p-3">{record.username}</div>
                            <div className="col-sm-1 p-3">{record.hit}</div>
                            <div className="col-sm-2 p-3">{record.writedate}</div>
                        </div>
                    })
                }
            </div>

            {/* 페이징 */}
            <ul className="pagination justify-content-center" style={{ margin: '20px 0' }}>

                {/* 이전 페이지로 이동 */}
                {   
                    (pageInfo.nowPage != pageInfo.startPage) && (pageInfo.nowPage != 1) &&
                    <li className="page-item"><Link className="page-link" onClick={() => getBoardList(pageInfo.nowPage - 1)}>Prev</Link></li>
                }


                {/* 페이지 번호 출력 */}
                {/* 현재페이지 "page-item active" */}
                {/* 현재 페이지가 아니면 "page-item" */}

                {pageNum.map((p, idx) => {
                    var activeStyle = "page-item active"
                    if (p != pageInfo.nowPage) activeStyle = "page-item"

                    return <li key={idx} className={activeStyle} >
                        <Link className="page-link" onClick={() => { getBoardList(p) }}>{p}</Link>
                    </li>
                })}
                {/* 다음 페이지로 이동 */}
                {
                    (pageInfo.totalPage > pageInfo.nowPage) &&
                    < li className="page-item"><Link className="page-link" onClick={() => getBoardList(pageInfo.nowPage + 1)}>Next</Link></li>
                }
            </ul>
        </div >
    )
}

export default BoardList