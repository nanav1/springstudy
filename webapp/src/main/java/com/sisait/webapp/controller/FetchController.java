package com.sisait.webapp.controller;

import com.sisait.webapp.dto.ProductDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*")
@Controller //view+데이터
public class FetchController {
    // fetch get방식 접속 요청 처리
    @RequestMapping(value = "/fetchTest", method= RequestMethod.GET)
    @ResponseBody // controller 어노테이션은 view + 데이터전송하여야만 하지만 비동기는 view를 필요로하지 않는다
                    // 그래서 지금 매핑은 뷰가 없이 body있는 매핑이다
    public ProductDTO fetchTest(HttpServletRequest request){
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        int hit = Integer.parseInt(request.getParameter("hit"));

        System.out.println(title);
        System.out.println(content);
        System.out.println(hit);

        return new ProductDTO("8989","노트북","화이트",20000);
    }

    @RequestMapping(value = "/fetchPostTest", method = RequestMethod.POST)
    @ResponseBody
    public List<ProductDTO> fetchPostTest(ProductDTO dto){
        System.out.println(dto.toString());

        List<ProductDTO> list = new ArrayList<ProductDTO>();
        list.add(new ProductDTO("1111","사과","레드",1500));
        list.add(new ProductDTO("2222","배","화이트",2500));
        list.add(new ProductDTO("3333","복숭아","핑크",2000));
        list.add(new ProductDTO("4444","파인애플","옐로우",5500));

        return list;
    }
}
