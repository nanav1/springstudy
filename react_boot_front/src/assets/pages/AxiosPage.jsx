import { useState } from "react";
import axios from 'axios';
import {serverUrl} from '../common/config'

function AxiosPage() { 
    const[result, setResult]=useState(" ");

    const[productName, setProductName] = useState("")
    const[price, setPrice] = useState(0);
    const[productList, setProductList] = useState([])

    // get방식 요청하기
    function axiosGetTest(){
        axios.get(serverUrl+"/axiosGetTest",{
            params:{
                now_page:5,
                searchWord : "빅데이터"
            }
        })
        .then(function(response){
            console.log(response)
            setResult(response.data)
        })
        .catch((error)=>{
        console.log(error)
        })
    }
    // post 방식 요청
    function axiosPostTest(){
        axios.post(serverUrl+"/axiosPostTest",{
            proName : "싸이클",
            price : 12500
        })
        .then((response)=>{
            console.log(response)
            setProductName(response.data.productName);//상품명
            setPrice(response.data.price)//가격
            setProductList(response.data.product)//컬렉션
        })
        .catch((error)=>{
            console.log(error)
        })
    }
  return (
    <div className="container">
        <h2>Axios를 이용한 비동기 호출</h2>
        <button onClick={axiosGetTest}>axios를 이용한 get방식 호출</button>
        <div>
            응답내용 : {result}
        </div>
        <button onClick={axiosPostTest}>axios를 이용한 post방식 호출</button>
        <div>
            상품명 : {productName}
        </div>
        <div>
            상품가격 : {price}
        </div>
        <table className="table">
            <tbody>
            {
                productList.map((record, idx)=>{
                    return(
                        <tr key={idx}>
                            <td>{record.proCode}</td>
                            <td>{record.proName}</td>
                            <td>{record.option}</td>
                            <td>{record.price}</td>
                        </tr>        
                    )
                })
                
            }
            </tbody>
        </table>
    </div>
  )
}

export default AxiosPage