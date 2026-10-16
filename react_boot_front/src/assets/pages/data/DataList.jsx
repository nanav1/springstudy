import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import {serverUrl} from '../../common/config'

function DataList() {
  //레코드들을 담을 변수
  const [dataList, setDataList] = useState([]);

  //DB에서 레코드 가져오기
  useEffect(()=>{
    getDataList();
  },[])
  function getDataList(){
    axios.get(serverUrl+"/data/dataList")
    .then((response)=>{
      console.log(response.data)
      setDataList(response.data)
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  return (
    <div>
        <h2>자료실 글 목록</h2>
        {
          (sessionStorage.getItem("logStatus") == 'Y')
          &&
          (
            <button onClick={()=>location.href='/data/dataWrite'} className="btn btn-primary">글쓰기</button>
          )
        }
        <div className="row" style={{borderBottom:"2px solid gray", textAlign:"center"}}>
          <div className="col-sm-1 p-3">번호</div>
          <div className="col-sm-7 p-3">제목</div>
          <div className="col-sm-1 p-3">글쓴이</div>
          <div className="col-sm-1 p-3">조회수</div>
          <div className="col-sm-2 p-3">등록일</div>
        </div>
        {
          dataList.map((record, idx)=>{
            return(
              <div key={idx} className="row" style={{borderBottom:"1px solid gray", textAlign:"center"}}>
                <div className="col-sm-1 p-3">{record.id}</div>
                <div className="col-sm-7 p-3"><Link to={`/data/dataDetail/${record.id}`}>{record.subject}</Link></div>
                <div className="col-sm-1 p-3">{record.joinsEntity.username}</div>
                <div className="col-sm-1 p-3">{record.hit}</div>
                <div className="col-sm-2 p-3">{record.writedate}</div>
              </div>
            )
          })
        }

    </div>
  )
}

export default DataList