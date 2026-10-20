import axios from "axios"
import { useEffect, useState } from "react"
import {serverUrl} from '../common/config'

function Crawling() {
    const [melonTop100, setMelonTop100] = useState([])

    useEffect(()=>{
        getMelonHitTop100()
    },[])
    const getMelonHitTop100 = async ()=>{
        await axios.get(serverUrl+'/api/crwalingMelonTop100')
        .then((response)=>{
            if(response.data){
                setMelonTop100(response.data)
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }
  return (
    <>
    <table>
    <tbody>
        {
            melonTop100.map((song, index)=>{
                return(
                    <tr key={index}>
                        <td>{song.rank}</td>
                        <td><a href={`/album/detail/${song.albumNo}`}  target="_blank"><img src={song.postImage}/></a></td>
                        {/* <td><a href={`https://www.melon.com/album/detail.htm?albumId=${song.albumNo}`} target="_blank"><img src={song.postImage}/></a></td> */}
                        <td>{song.songName}</td>
                        <td>{song.artistName}</td>
                        <td>{song.albumName}</td>
                        <td>{song.songId}</td>
                        <td>{song.albumNo}</td>
                    </tr>
                )
            })
        }
    </tbody>
    </table>
    </>
  )
}

export default Crawling