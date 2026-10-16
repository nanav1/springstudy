import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/toastui-editor.css'
import color from '@toast-ui/editor-plugin-color-syntax'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import {serverUrl} from '../../common/config'

function BoardEdit() {
    // 이전 페이지에서 보낸 레코드 번호 
    const {id} = useParams()

    // 해당 레코드 정보가져오기
    const [boardData, setboardData] = useState({}) // 수정할 글 담을 변수
    useEffect(()=>{
        getBoard()
    },[])
    function getBoard(){
        axios.get(`${serverUrl}/boardEdit/${id}`)
        .then((response)=>{
            //console.log(response.data)
            setboardData(response.data)
            setSubject(response.data.subject)

            // toastEditer에 글내용 표시
            const editor = editorRef.current?.getInstance()
            if(editor){
                editor.setHTML(response.data.content);
            }
        })
        .catch((error)=>{
            //console.log(error)
        })
    }

    // 제목을 보관할 변수
    const [subject, setSubject] = useState('')
    // 내용을 보관할 변수
    const editorRef = useRef()

    const subjectChange = (event) => {
        setSubject(event.target.value);
    }
    const handleBoard = () => {
        // HTML태그로 글내용 얻어오기
        // console.log('글내용: ', editorRef.current?.getInstance().getHTML())
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
        // const boardData = {
        //     subject: subject,
        //     content: content,
        //     // userid: sessionStorage.getItem("logId")
        //     joinsEntity : {id:sessionStorage.getItem("logId")}
        // }

        // setboardData((p)=>{
        //     return {...p, subject:subject, content:content}
        // })
        // console.log(boardData)
        // -> useState 쓰니까 업데이트가 느려서 버튼 한버 ㄴ 누르는걸론 수정이 안됨
        // 서버로 보낼 데이터
        const updateData = {
            ...boardData,
            subject: subject,
            content: content
        };

       
        // axios.post("/board/boardEditOk", boardData)
        axios.post(serverUrl+ "/board/boardEditOk", updateData)
        .then((response)=>{
            //console.log(response)
            if(response.data=="Ok"){// 수정 성공 시 해당 게시물로 이동
               location.href = `/board/view/${boardData.id}`;
            }
            // 수정 실패 시 현재 페이지 유지
        })
        .catch((error)=>{
            //console.log(error)
        })
        // 등록여부에 따라 현재페이지 유지
        
    }
    return (
        <div>
            <div className='container'>
                <h2>글 수정(ToastEditer)</h2>
                <input type='text' 
                       name='subject' 
                       id='subject' 
                       style={{ width: "90%", padding: "10px", margin: "10px 0" }}
                       value={subject} 
                       onChange={subjectChange}
                       maxLength={200}
                       />

                <Editor
                    ref={editorRef}
                    initialValue=""
                    previewStyle="vertical"
                    height="500px"
                    initialEditType="wysiwyg"
                    useCommandShortcut={false}
                    hideModeSwitch={true}
                    plugins={[color]}
                    value
                />
                <button onClick={handleBoard}>글 수정하기</button>
            </div>
        </div>
    )
}

export default BoardEdit