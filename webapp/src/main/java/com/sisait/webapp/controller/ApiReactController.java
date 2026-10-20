package com.sisait.webapp.controller;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RequestMapping("/api")
@RestController
public class ApiReactController {

    @GetMapping("/crwalingMelonTop100")
    public List<Map<String, String>> melonChart(){
        List<Map<String, String>> melonChart = new ArrayList<Map<String, String>>();
        try{
            //크롤링 할 페이지 url : melon.com의 멜론차트 페이지 정보
            String url = "https://www.melon.com/chart/index.htm";

            // 해당 url에서 Document를 얻어온다
            Connection coonnect = Jsoup.connect(url);
            Document doc = coonnect.get();

            // Document 에서 tr태그중 class가 lst50, lst100인 element 구하기
            //select("tr") : tr태그선택
            //select("tr.lst50") : tr태그에서 class가 lst50인 element들을 선택 "tr#lst50" 은 id
            Elements elements = doc.select("tr.lst50,tr.lst100");

            for(Element element : elements){
                //순위
                String rank = element.select("span.rank").text();
                String postImage = element.select("a.image_typeAll img").attr("src");
                String songName = element.select("div.rank01>span>a").text();
                String artistName = element.select("div.rank02>a").text();
                String albumName = element.select("div.rank03>a").text();
                String albumCode = element.select("div.wrap>a.image_typeAll").attr("href");
                String albumNo = albumCode.substring(albumCode.indexOf("=")+1);
                String songUrl = element.select("div.wrap>.a.type-3").attr("href");
                String songId = songUrl.substring(songUrl.indexOf("=")+1);

                System.out.println(rank+"  "+songName+"  "+postImage+"  "+albumNo+"  "+songId);

                Map<String, String> map = new HashMap<String ,String>();
                map.put("rank", rank);
                map.put("postImage", postImage);
                map.put("songName",songName);
                map.put("artistName",artistName);
                map.put("albumName",albumName);
                map.put("albumNo",albumNo);
                map.put("songId", songId);

                melonChart.add(map);
            }

        }catch(Exception e){
            e.printStackTrace();
        }
        return melonChart;
    }

    @GetMapping("/albumDetail")
    public Map<String, Object> albumDetail(@RequestParam("albumNo") String id) {
        Map<String, Object> albumDetailData = new HashMap<>();

        try {
            String url = "https://www.melon.com/album/detail.htm?albumId=" + id;

            Connection connect = Jsoup.connect(url);

            Document doc = connect.get();

        } catch (Exception e) {
            e.printStackTrace();

        }

        return albumDetailData;
    }
}
