import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/toastui-editor.css'
import color from '@toast-ui/editor-plugin-color-syntax'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {serverUrl} from '../../common/config'
import { useParams } from 'react-router-dom'
import fileicon from "../../img/fileicon.png"

function DataEdit() {
    const {id} = useParams()

    // 해당 레코드 정보가져오기
    const [DataData, setDataData] = useState({}) // 수정할 글 담을 변수
    useEffect(()=>{
        getDataSelect()
    },[])
    const getDataSelect = ()=>{
        axios.get(`${serverUrl}/data/dataDetail/${id}`)
        .then((response)=>{
            // console.log(response.data)
            setDataData(response.data)
            setSubject(response.data.subject)

            // toastEditer에 글내용 표시
            const editor = editorRef.current?.getInstance()
            if(editor){
                editor.setHTML(response.data.content);
            }
            // 기존 첨부파일을 orgFilename에서 추가하기
            const orgFileList = [];
            response.data.fileList.map((file)=>{
                var jsonFile = {id: file.id, filename: file.filename+"."+file.extname, size: file.size, extname:file.extname}
                orgFileList.push(jsonFile)
            })
            setOrgFileName(orgFileList)
        })
        .catch((error)=>{
            //console.log(error)
        })
    }


    // 제목을 보관할 변수
    const [subject, setSubject] = useState('')
    // 내용을 보관할 변수
    const editorRef = useRef()
    // 원래 첨부파일을 담을 변수
    const [orgFileName, setOrgFileName] = useState([]);
    // 첨부파일을 담을 변수
    const [files, setFiles] = useState([]);

    const subjectChange = (event) => {
        setSubject(event.target.value);
    }
    //삭제할 파일 정보 저장할 변수
    const [delFile, setDelFile] = useState([])


    const handleFileChange = (event)=>{
        setFiles(Array.from(event.target.files))
    }

    //삭제할 파일의 id를 delFile에 추가
    const addDelFile = (event, fileId)=>{
        // 삭제할 파일의 글 번호 delFile에 추가하고
        setDelFile((prev)=>{
            return [...prev, fileId]
        })
        // 이벤트가 발생한 <b>태그의 부모를 숨긴다
        const parentElement = event.target.parentElement;
        parentElement.style.display = "none";
    }

    const handleData = (event) => {
        event.preventDefault();
        const content = editorRef.current?.getInstance().getHTML();

        // 유효성검사 : 제목, 글내용
        if (subject == "") {
            alert('제목을 입력해주세요')
            return;
        }
        if (content == ""|| content=="<p><br></p>") {
            alert('글내용을 입력하세요')
            return
        }

        // axios를 이용한 백엔드 호출(제목, 글내용, 글쓴이) => json타입으로 보냄
        const boardData = {
            subject: subject,
            content: content,
            // userid: sessionStorage.getItem("logId")
            joinsEntity : {id:sessionStorage.getItem("logId")}
        }
        console.log(boardData)

        // axios.post("/data/dataWrite", boardData)
        // .then((response)=>{
        //     console.log(response)
        //     if(response.data=="Ok"){// 등록 성공 시 목록으로 이동
        //         // location.href = "/data/list";
        //     }
        //     // 등록 실패 시 현재 페이지 유지
        // })
        // .catch((error)=>{
        //     console.log(error)
        // })
        // 등록여부에 따라 현재페이지 유지

        //첨부파일이 있는지 확인
        if(orgFileName.length+files.length-delFile.length <= 0){
            alert("첨부파일 1개 이상 필수")
            return;
        }
        // axios를 이용하여 백앤드 호출
        // form 객체를 생성하여 자료실 글 번호, 작성자, 제목 글내용 첨부파일을 추가한다음 전송
        const formData = new FormData();
        formData.append("id", id)
        formData.append("subject", subject)
        formData.append("content", content)
        formData.append("joinsEntity.id", sessionStorage.getItem("logId"))
        //첨부파일 폼에 주가하기
        for(var i=0;i<files.length;i++){
            formData.append("files", files[i]);
        }
        // 수정 삭제한 파일 목록
        for(var i=0; i<delFile.length; i++){
            formData.append("delFile", delFile[i])
        }

        axios.post(`${serverUrl}/data/dataEdit`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        .then(response=>{
          if(response.data == "Ok"){
            location.href = `/data/dataDetail/${id}`;
          }else{
            alert("자료 수정 실패");
          }
        })
        .catch(error=>{
            console.log(error)
        })
        
    }
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

    return (
        <div>
            <div className='container'>
                <h2>자료실 글 수정</h2>
                <form>
                    <input type='text' 
                        name='subject' 
                        id='subject' 
                        style={{ width: "90%", padding: "10px", margin: "10px 0" }} 
                        onChange={subjectChange}
                        value={subject}
                        //maxLength={200}
                        />

                    <Editor
                        ref={editorRef}
                        initialValue=""
                        previewStyle="vertical"
                        height="400px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={false}
                        hideModeSwitch={true}
                        plugins={[color]}
                    />
                    <div className="mb-3 mt-3">
                        <label htmlFor="files" className="form-label">첨부파일:</label>
                        {   
                       orgFileName.map((f,idx)=>{
                            return(
                                <div key={idx} style={{display:"flex", alignItems:"center",height:"50px", justifyContent:"space-between", width:"700px"}}>
                                    <div style={{width:"50px", height:"50px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    {f.extname == "jpeg" 
                                    ? <img src={`${serverUrl}/uploads/${f.filename}`}
                                        style={{maxWidth:"100%",maxHeight:"100%", cursor:"pointer", objectFit:"contain"}}
                                        onClick={()=>downloadFile(f.filename)}
                                    />
                                    : <img src={fileicon} 
                                        style={{maxWidth:"100%",maxHeight:"100%", cursor:"pointer", objectFit:"contain"}}
                                        onClick={()=>downloadFile(f.filename)}/>
                                    }</div>
                                    <div>{f.filename}</div>
                                    <div>{f.size < 1024 
                                            ? `${f.size}byte` 
                                                : f.size<1048576 
                                                    ? `${parseFloat((f.size/1024).toFixed(2))}KB` 
                                                        : f.size < 1073741824
                                                            ? `${parseFloat((f.size/1048576).toFixed(2))}MB`
                                                                : `${parseFloat((f.size/1073741824).toFixed(2))}GB`} </div>
                                    <b style={{cursor:"pointer", fontSize:"1.1em", border:"1px solid", height:"15px", width:"15px", display:"flex", alignItems:"center", justifyContent:"center"}}
                                       onClick={(event)=>addDelFile(event, f.id)}>X</b>
                                </div>
                            )
                        })
                         }
                <br/>
                        <input type="file"  className="from-control" id="files" name="files" multiple
                        onChange = {handleFileChange}
                        />
                    </div>
                    <button onClick={handleData}>자료실 글 수정하기</button>
                </form>
            </div>
        </div>
    )
}

export default DataEdit