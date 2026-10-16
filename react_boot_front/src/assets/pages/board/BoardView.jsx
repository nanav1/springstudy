import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {serverUrl} from '../../common/config'

function BoardView() {
    //이전페이지 보낸 레코드번호(id)의 값을 request
    const {id} = useParams()

    // DB선택한 레코드를 담을 변수
    const [record, setRecord] = useState({})

    useEffect(()=>{
        getBoardView();
    },[])
    function getBoardView(){
        axios.get(`${serverUrl}/board/boardView/${id}`)
        .then((response)=>{
            //console.log(response)
            setRecord(response.data)
        })
        .catch((error)=>{
            //console.log(error)
        })
    }
    //글삭제
    function boardDelete(){
        if(confirm("글을 삭제하시겠습니까?")){
            //글번호(id)를 이용하여 삭제하기
            axios.get(`${serverUrl}/board/boardDel/${id}`)
            .then((response)=>{
                if(response.data == "1"){
                    location.href="/board/list";
                }
            })
            .catch((error)=>{
                //console.log(error)
            })
        }
    }
  return (
    <div className="container">
        <h2>게시판 글 내용 보기</h2>
        <div className="row" style={{borderBottom:'1px solid gray'}}>
            <div className="col-sm-1 p-3">번호</div>
            <div className="col-sm-5 p-3">{record.id}</div>
            <div className="col-sm-1 p-3">작성자</div>
            <div className="col-sm-5 p-3">{record.joinsEntity?.username}</div>
        </div>
        <div className="row" style={{borderBottom:'1px solid gray'}}>
            <div className="col-sm-1 p-3">등록일</div>
            <div className="col-sm-5 p-3">{record.updateDateTime}</div>
            <div className="col-sm-1 p-3">조회수</div>
            <div className="col-sm-5 p-3">{record.hit}</div>
        </div>
        <div className="row" style={{borderBottom:'1px solid gray'}}>
            <div className="col-sm-1 p-3">제목</div>
            <div className="col-sm-11 p-3">{record.subject}</div>
        </div>
        <div className="row" style={{borderBottom:'1px solid gray'}}>
            <div className="col-sm-1 p-3">글내용</div>
            <div className="col-sm-11 p-3"dangerouslySetInnerHTML={{ __html: record.content }}></div>
        </div>
        <div style={{padding:'30px 0', margin:'30px 0'}}>
            <button type="button" className="btn btn-success" onClick={()=> location.href='/board/list'}>목록</button>&nbsp;
            {
                ( record.joinsEntity?.username == sessionStorage.getItem("logUsername"))
                &&
                (<>
            <button type="button" className="btn btn-info" onClick={()=>{location.href=`/board/boardEdit/${id}`}}>수정</button>&nbsp;
            <button type="button" className="btn btn-warning" onClick={boardDelete}>삭제</button>
                </>)
            }
        </div>
    </div>
  )
}

export default BoardView