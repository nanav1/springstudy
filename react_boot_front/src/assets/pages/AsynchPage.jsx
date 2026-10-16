import { useState } from "react";
import {serverUrl} from '../common/config'

function AsynchPage(){
    var [result, setResult] = useState("");
    var [list, setList] = useState([]);
    function xmlStart(){
        //비동기 호출하기
        // 1. XMLHttpRequest 객체생성
        var xHttp = new XMLHttpRequest();
        // 2. 서버에 요청한 정보를 응답 받았을때 처리 할 함수
        xHttp.onreadystatechange = function(){
            console.log("readyState->"+this.readyState);
            console.log("status->"+this.status);
            console.log("responseText"+this.responseText);

            /*
            readyState  0 : 초기화실패 1: tjqjdusruf  2 : 요청접수 3: 처리요청 4: 요청와뇰
            state        200 - 정상 처리 됨, 403 - 금지 404- 찾을수없음
            responseText : 응답결과
            */
           if (this.readyState === 4 && this.responseText){
            setResult(this.responseText);

           }
        }
        // 3. 요청방식과 매핑주소를 기술한다.
        //         요청방식, 매핑주소와 쿼리데이터                              비동기접속여부
        xHttp.open("GET", serverUrl + "/xmlTest?name=홍길동님&age=25", true);
        // 4. 서버요청하기
        xHttp.send();
        
    }
    //post 방식 비동기처리
    function xmlStart2(){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function(){
            if(this.readyState==4&&this.status==200){
                setResult(this.responseText);
            }

        }
        xmlHttp.open("POST", serverUrl + "/xmlTest2", true);
        //post방식일때는 header 작성
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.send("proCode=8888&proName=자전거&option=전기&price=120000");

    }
    function xmlStart3(){
        var xHttp = new XMLHttpRequest();

        xHttp.onreadystatechange = function(){
            if(this.readyState===4 && this.status===200){
                console.log(this.responseText);
                var jsonData = JSON.parse(this.responseText)
                console.log(jsonData)

                // // 서버에서 받은 정보를 list에 보관하기
                // // [{},{},{}]
                // jsonData.map((product)=>{

                // });
                setList(jsonData);
            }
        }
        xHttp.open("GET",serverUrl+"/xmlTest3", true)
        xHttp.send();
    }
    return (
        <div className="container">
            <h2>XMLHTTPSRequest를이용한비동기처리</h2>
            <button onClick={xmlStart}>server에서 문자열 가져오기get</button>
            <button onClick={xmlStart2}>server에서 문자열 가져오기post</button>
            <div>result : {result}</div>
            <button onClick={xmlStart3}>컬렉션 요청(list)</button>
            <div>
                <div className="row" style={{borderBottom:"1px solid gray"}}>
                    <div className="col-sm-3 p-3">상품코드</div>
                    <div className="col-sm-3 p-3">상품명</div>
                    <div className="col-sm-3 p-3">옵션</div>
                    <div className="col-sm-3 p-3">가격</div>
                </div>
                {
                    list.map((record)=>{
                        return(
                            <div className="row" style={{borderBottom:"1px solid gray"}}>
                                <div className="col-sm-3 p-3">{record.proCode}</div>
                                <div className="col-sm-3 p-3">{record.proName}</div>
                                <div className="col-sm-3 p-3">{record.option}</div>
                                <div className="col-sm-3 p-3">{record.price}</div>
                            </div>                            
                        )
                    })
                }
            </div>
        </div>

    )
}

export default AsynchPage