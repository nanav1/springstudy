import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {serverUrl} from '../common/config'

function AlbumDetail() {
  // 1단계 라우터에서 설정한 :albumNo 값을 주소창에서 가져옵니다.
  const { albumNo } = useParams(); 
  const [albumData, setAlbumData] = useState(null);

  useEffect(() => {
    // 스프링 부트 서버에 크롤링 데이터 요청
    axios.get(`${serverUrl}/api/albumDetail?albumNo=${albumNo}`)
      .then((res) => {
        setAlbumData(res.data);
        console.log(res.data)
      })
      .catch((err) => console.error(err));
  }, [albumNo]);

  if (!albumData) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <img src={albumData.postImage} alt="앨범 커버" width="200" />
      <h2>{albumData.albumName}</h2>
      <h3>{albumData.artistName}</h3>
      <hr />
      <h4>수록곡</h4>
      <ul>
        {albumData.songs?.map((song) => (
          <li key={song.songNo}>
            {song.songNo}. {song.songTitle}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlbumDetail