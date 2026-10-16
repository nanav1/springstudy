package com.sisait.webapp.controller;

import com.sisait.webapp.dto.ProductDTO;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class    AxiosController {

    @GetMapping("/axiosGetTest")
    public String axiosGetTest(int now_page, String searchWord){
        System.out.println("현재페이지"+now_page+", 검색어"+searchWord);

        return "현재페이지"+now_page+", 검색어 = "+searchWord;
    }

    @PostMapping("/axiosPostTest")
    public Map<String, Object> axiosPostTest(@RequestBody ProductDTO dto){
        System.out.println("번호 : "+dto.getProName()+", title : "+dto.getPrice());

        Map<String, Object> mapData = new HashMap<String, Object>();
        mapData.put("productName", dto.getProName());
        mapData.put("price", dto.getPrice());

        List<ProductDTO> lst = new ArrayList<ProductDTO>();
        lst.add(new ProductDTO("1001","포도","2kg",3000));
        lst.add(new ProductDTO("1002","딸기","3kg",10000));
        lst.add(new ProductDTO("1003","수박","1kg",15000));
        mapData.put("product",lst);

        return mapData;
    }
}
