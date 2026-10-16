import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {serverUrl} from "../../common/config"
import fileicon from "../../img/fileicon.png"

function DataDetail() {
    const {id} = useParams()
    const [data, setData] = useState([]) 
    useEffect(()=>{
        getDataDetail();
    },[])
    function getDataDetail(){
        // id에 해당하는 글을 백엔드에서 가져오기
        axios.get(`${serverUrl}/data/dataDetail/${id}`)
        .then((response)=>{
            console.log(response.data)
            setData(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    // 다운로드 기능 만들기
    const downloadFile = async (downFile) => {
        // 해당 파일명의 자료를 springboot에 요청 (blob:바이너리코드로 응답받는다.)
        const response = await axios.get(`${serverUrl}/data/file/download/${downFile}`,{responseType:'blob'})

        // res.data의 바이너리 코드 a태그를 만들어 다운로드 수행
        // href="파일명" href="바이러니코드("blob")"
        // <a href="" download/></a> -> 화면추가 -> zmfflr
        // 1. href에 대입할 주소 만들기
        const url = window.URL.createObjectURL(response.data)
        

        // 2. a태그 만들기
        const aTag = document.createElement("a");

        // 3. href 속의 값 대입
        aTag.href = url;
        aTag.download = `${downFile}`; //다운로드 파일명

        // 4. a태그를 document에 추가하기
        document.body.appendChild(aTag);

        // 5. 클릭 이벤트 발생
        aTag.click()

        // 6. a태그 삭제
        aTag.remove()

        // 7. window 내장 객체의 자원도 삭제
        window.URL.revokeObjectURL(url)
    }
    function dataDelete(){
        if(confirm("자료실 글을 삭제하시겠습니까?")){//삭제여부
            axios.get(`${serverUrl}/data/dataDelete/${data.id}`)
            .then((response)=>{
                //삭제-> 목록으로
                if(response.data == "Ok"){
                location.href='/data/datalist'}
                else{
                    alert("삭제 실패");
                }
            })
            .catch((error)=>{
                console.log(error)
            })

        }
    }
  return (
    <div className="container">
        <div className="row" style={{borderBottom:"1px solid gray"}}>
            <div className="col-sm-1 p-3">글번호</div>
            <div className="col-sm-5 p-3">{data.id}</div>
            <div className="col-sm-1 p-3">등록일</div>
            <div className="col-sm-5 p-3">{data.writedate}</div>
        </div>
        <div className="row" style={{borderBottom:"1px solid gray"}}>
            <div className="col-sm-1 p-3">글쓴이</div>
            <div className="col-sm-5 p-3">{data.joinsEntity?.username}</div>
            <div className="col-sm-1 p-3">조회수</div>
            <div className="col-sm-5 p-3">{data.hit}</div>
        </div>
        <div className="row" style={{borderBottom:"1px solid gray"}}>
            <div className="col-sm-1 p-3">글제목</div>
            <div className="col-sm-11 p-3">{data.subject}</div>
        </div>
        <div className="row" style={{borderBottom:"1px solid gray"}}>
            <div className="col-sm-1 p-3">글내용</div>
            <div className="col-sm-11 p-3" dangerouslySetInnerHTML={{__html:data.content}}></div>
        </div>
        <div className="row" style={{borderBottom:"1px solid gray"}}>
            <div className="col-sm-2 p-3">첨부파일</div>
            <div className="col-sm-10 p-3">
                {/* {   
                    data.fileList?.map((imageData, idx)=>{
                        return (
                            <img src={`${serverUrl}/uploads/${imageData.filename}.${imageData.extname}`}
                                 style={{maxWidth:"100px",maxHeight:"100px",margin:"10px", cursor:"pointer"}}
                                 key={idx}
                                 onClick={()=>{downloadFile(`${imageData.filename}.${imageData.extname}`)}}/>
                        )
                    })
                } */}
                {   
                       data.fileList?.map((imageData,idx)=>{
                            return(
                                <div key={idx} style={{display:"flex", alignItems:"center",height:"50px", justifyContent:"space-between", width:"700px"}}>
                                    <div style={{width:"50px", height:"50px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    { imageData.extname == "jpeg" ?
                                    <img src={`${serverUrl}/uploads/${imageData.filename}.${imageData.extname}`}
                                    style={{maxWidth:"100%",maxHeight:"100%", cursor:"pointer", objectFit:"contain"}}
                                    onClick={()=>{downloadFile(`${imageData.filename}.${imageData.extname}`)}}
                                    />
                                    : <img src={fileicon}
                                        style={{maxWidth:"100%",maxHeight:"100%", cursor:"pointer", objectFit:"contain"}}
                                        onClick={()=>{downloadFile(`${imageData.filename}.${imageData.extname}`)}}/>
                                    }
                                    </div>
                                    <div>{imageData.filename}.{imageData.extname}</div>
                                    <div>{imageData.size < 1024 
                                            ? `${imageData.size}byte` 
                                                : imageData.size<1048576 
                                                    ? `${parseFloat((imageData.size/1024).toFixed(2))}KB` 
                                                        : imageData.size < 1073741824
                                                            ? `${parseFloat((imageData.size/1048576).toFixed(2))}MB`
                                                                : `${parseFloat((imageData.size /1073741824).toFixed(2))}GB`} </div>
                                </div>
                            )
                        })
                         }
            </div>
        </div>
        <div>
            <br/>
            <button type="button" className="btn btn-success" onClick={()=> location.href='/data/datalist'}>목록</button>&nbsp;
            {
                ( data.joinsEntity?.username == sessionStorage.getItem("logUsername"))
                &&
                (<>
            <button type="button" className="btn btn-info" onClick={()=>{location.href=`/data/dataEdit/${id}`}}>수정</button>&nbsp;
            <button type="button" className="btn btn-warning" onClick={dataDelete}>삭제</button>
                </>)
            }
        </div>
    </div>
  )
}

export default DataDetail