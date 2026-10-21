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
    public List<Map<String, String>> albumDetail(@RequestParam("albumNo") String id) {
        List<Map<String, String>> albumDetailData = new ArrayList<Map<String, String>>();

        try {
            String url = "https://www.melon.com/album/detail.htm?albumId=" + id;

            Connection connect = Jsoup.connect(url);

            Document doc = connect.get();

            Elements elements = doc.select("div.wrap_info");

            for(Element element : elements){
                String albumName = element.selectFirst("div.song_name").ownText().trim();
                String albumImg = element.selectFirst("div.thumb img").attr("src");
                String artistCode = element.selectFirst("a.artist_name").attr("href").replaceAll("[^0-9]", "");
//                String artist = element.selectFirst("div.artist").ownText().trim();
                String artist = element.select("div.artist a.artist_name").stream().map(Element::text).map(String::trim).collect(java.util.stream.Collectors.joining(", "));
                String releaseDate = element.selectFirst("dt:contains(발매일) + dd") != null ? element.selectFirst("dt:contains(발매일) + dd").text().trim() : "";
                String genre = element.selectFirst("dt:contains(장르) + dd") != null ? element.selectFirst("dt:contains(장르) + dd").text().trim() : "";
                String publisher = element.selectFirst("dt:contains(발매사) + dd") != null ? element.selectFirst("dt:contains(발매사) + dd").text().trim() : "";
                String agency = element.selectFirst("dt:contains(기획사) + dd") != null ? element.selectFirst("dt:contains(기획사) + dd").text().trim() : "";

                Map<String, String> map = new HashMap<String ,String>();
                map.put("albumName", albumName);
                map.put("artistCode",artistCode);
                map.put("artist",artist);
                map.put("albumImg", albumImg);
                map.put("releaseDate", releaseDate);
                map.put("genre", genre);
                map.put("publisher", publisher);
                map.put("agency", agency);

                albumDetailData.add(map);
            }

            Elements songRows = doc.select("div.service_list_song tbody tr");

            for (Element tr : songRows) {
                    String trackTitle = tr.selectFirst("a[href*=playSong]") != null ? tr.selectFirst("a[href*=playSong]").text().trim() : "";
                    String trackArtist = tr.select("a[href*=goArtistDetail]").stream().map(Element::text).map(String::trim).distinct().collect(java.util.stream.Collectors.joining(", "));
                    String songNum = tr.selectFirst("input.input_check").val();
                    String likey = tr.selectFirst("span.cnt").ownText();


                    Map<String, String> map = new HashMap<String ,String>();
                    map.put("trackTitle",trackTitle);
                    map.put("trackArtist",trackArtist);
                    map.put("songNum", songNum);
                    map.put("likey",likey);

                    albumDetailData.add(map);
            }

        } catch (Exception e) {
            e.printStackTrace();

        }

        return albumDetailData;
    }
}
