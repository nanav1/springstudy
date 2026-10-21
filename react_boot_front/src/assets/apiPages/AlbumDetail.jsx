import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {serverUrl} from '../common/config'

function AlbumDetail() {
  const { albumNo } = useParams(); 
  const [albumData, setAlbumData] = useState(null);

  useEffect(() => {
    albumDetailset();
  }, []);

  const albumDetailset = async()=>{
        axios.get(`${serverUrl}/api/albumDetail?albumNo=${albumNo}`)
      .then((res) => {
        setAlbumData(res.data);
        console.log("앨범데이터", res.data)
      })
      .catch((err) => console.error(err));
  }

    if (!albumData) {
    return <div className="container" style={{ padding: "20px" }}>앨범 데이터를 불러오는 중입니다...</div>;
  }


  return (
    <div className="container" style={{width:"800px"}}>
      <table className = "table table-bordered">
        <tbody>
          <tr>
            <td>
              <h1 style={{textAlign:"center"}}>앨범상세페이지</h1>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td><a href={`https://www.melon.com/album/detail.htm?albumId=${albumNo}`} target="_blank"><img src={albumData[0].albumImg}/></a></td>
                    <td>
                      <table className="table table-borderless" style={{textAlign:"center", fontWeight:"bold"}}>
                        <tbody>
                          <tr>
                            <td colSpan="2">{albumData[0].albumName}</td>
                          </tr>
                          <tr>
                            <td colSpan="2"><a href={`https://www.melon.com/artist/timeline.htm?artistId=${albumData[0].artistCode}`} target="_blank">{albumData[0].artist}</a></td>
                          </tr>
                          <tr>
                            <td colSpan="1">발매일</td>
                            <td>{albumData[0].releaseDate}</td>
                          </tr>
                          <tr>
                            <td>장르</td>
                            <td>{albumData[0].genre}</td>
                          </tr>
                          <tr>
                            <td>발매사</td>
                            <td>{albumData[0].publisher}</td>
                          </tr>
                          <tr>
                            <td>기획사</td>
                            <td>{albumData[0].agency}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>                    
                  </tr>
                  <tr>
                    <td>
                      <h1>수록곡</h1>
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>번호</th>
                            <th>곡정보</th>
                            <th>아티스트</th>
                            <th>좋아요</th>
                          </tr>
                        </thead>
                      <tbody>
                          {albumData.slice(1).map((song, index) => (
                            <tr key={index}>
                              <td>{index+1}</td>
                              <td><a href={`https://www.melon.com/song/detail.htm?songId=${song.songNum}`} target="_blank">{song.trackTitle}</a></td>   
                              <td>{song.trackArtist}</td>
                              <td>{song.likey}</td>
                            </tr>
                          ))}
                      </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AlbumDetail