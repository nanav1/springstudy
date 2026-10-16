import { useState } from "react";
import {serverUrl} from '../common/config'

function FetchPage() {
  const [product, setProduct] = useState({})
  //상품정보목록
  const[productList, setproductList]=useState([])
  function fetchStart(){
    fetch(serverUrl+"/fetchTest?title=연습중&content=fetch를 이용한 비동기 테스트&hit=12",{method:"get"})
    .then(response=>{
      //응답받으면
      if(!response){ // response에 정보가 있으면 true 없으면 false
        throw new Error("응답실패")
      }
      console.log("response-->", response);
      return response.json();
    })
    //json으로 파싱된 데이터를 받아 처리하는 함수
    .then(data=>{
      console.log("data-->", data);
      setProduct(data);
    })
    .catch(error=>{
      console.log('error->',error);
    })
  }

  //post방식 비동기 호출
  function fetchPostStart(){
    fetch(serverUrl+"/fetchPostTest",{
      method:'post',
      headers:{
        "Content-type" : "application/x-www-form-urlencoded"
      },
      body : "proCode=5656&proName=책상&option=120cm&price=5000"
    })
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      console.log("data----->",data)
      setproductList(data);
    })
    .catch((error)=>{
      console.log("에러------>",error)
    })
  }
  return (
    <div className="container">
        <h2>fetch를 이용한 비동기 처리</h2>
        <button onClick={fetchStart}>fetch를 이용한 get방식 비동기요청</button>
        <table className="table">
          <tr>
            <td>상품코드</td>
            <td>상품명</td>
            <td>옵션</td>
            <td>가격</td>
          </tr>
          <tr>
            <td>{product.proCode}</td>
            <td>{product.proName}</td>
            <td>{product.option}</td>
            <td>{product.price}</td>
          </tr>
        </table>
        <hr/>
        <button onClick={fetchPostStart}>fetch를 이용한 post방식 비동기 호출</button>
        <table className="table">
          <tr>
            <td>상품코드</td>
            <td>상품명</td>
            <td>옵션</td>
            <td>가격</td>
          </tr>
          {
            productList.map((record,i)=>{
              return(
                <tr>
                  <td>{record.proCode}</td>
                  <td>{record.proName}</td>
                  <td>{record.option}</td>
                  <td>{record.price}</td>
                </tr>
              )
            })
          }
        </table>
    </div>
  )
}

export default FetchPage