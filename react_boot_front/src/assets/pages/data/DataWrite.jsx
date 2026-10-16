import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/toastui-editor.css'
import color from '@toast-ui/editor-plugin-color-syntax'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import { useRef, useState } from 'react'
import axios from 'axios'
import {serverUrl} from '../../common/config'

function DataWrite() {
    // 제목을 보관할 변수
    const [subject, setSubject] = useState('')
    // 내용을 보관할 변수
    const editorRef = useRef()
    // 첨부파일을 담을 변수
    const [files, setFiles] = useState([]);

    const subjectChange = (event) => {
        setSubject(event.target.value);
    }
    const handleFileChange = (event)=>{
        setFiles(Array.from(event.target.files))
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
        console.log("files==>",files)
        if(files.length == 0){
            alert("첨부파일 1개 이상 필수")
            return;
        }
        // axios를 이용하여 백앤드 호출
        // form 객체를 생성하여 작성자, 제목 글애용 첨부파일을 추가한다음 전송
        const formData = new FormData();
        formData.append("subject", subject)
        formData.append("content", content)
        formData.append("joinsEntity.id", sessionStorage.getItem("logId"))
        //첨부파일 폼에 주가하기
        for(var i=0;i<files.length;i++){
            formData.append("files", files[i]);
        }
        axios.post(`${serverUrl}/data/dataWrite`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        .then(response=>{
          console.log(response.data)
          if(response.data == "Ok"){
            location.href = "/data/dataList";
          }else{
            alert("자료 등록 실패");
          }
        })
        .catch(error=>{
            console.log(error)
        })
        
    }
    return (
        <div>
            <div className='container'>
                <h2>자료실 글쓰기</h2>
                <form>
                    <input type='text' 
                        name='subject' 
                        id='subject' 
                        style={{ width: "90%", padding: "10px", margin: "10px 0" }} 
                        onChange={subjectChange}
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
                        <label htmlFor="files" class="form-label">첨부파일:</label>
                        <input type="file"  class="from-control" id="files" name="files" multiple
                        onChange = {handleFileChange}
                        />
                    </div>
                    <button onClick={handleData}>자료실 글 등록하기</button>
                </form>
            </div>
        </div>
    )
}

export default DataWrite