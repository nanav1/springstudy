package com.sisait.webapp.controller;

import com.sisait.webapp.dto.ProductDTO;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

// XMLHttpRequestController 테스트용
// 비동기식은 뷰페이지가 필요없다
// 데이터만 반환할수있고 데이터+뷰도 반환할 수 있다
// ResponceEntiy 클라이언트 코드 작성 가능
@CrossOrigin(origins="http://192.168.4.90:5173")
@RestController
public class XMLHttpRequestController {

    @GetMapping("/xmlTest")
    public String xmlTest(String name, int age){
        System.out.println("리액트에서 보낸 데이터");
        System.out.println("이름 : "+name + ", 나이"+age);

        // 리액트게 정보 보내기
        return "name : "+ name +"님, age : "+age;
    }
    @PostMapping("/xmlTest2")
    public String xmlTest2(String proCode, String proName, String option, int price){
        System.out.println("상품코드 : " + proCode);
        System.out.println("상품명 : " + proName);
        System.out.println("상품옵션 : " + option);
        System.out.println("상품명 : " + price);

        return proCode+"/"+proName+"/"+option+"/"+price;
    }
    //컬렉션을 리턴하는 매핑
    @GetMapping("/xmlTest3")
    public List<ProductDTO> xmlTest3(){
        List<ProductDTO> lst = new ArrayList<ProductDTO>();
        lst.add(new ProductDTO("1111","냉장고","800",12000));
        lst.add(new ProductDTO("2222","텔레비전","65인치",15000));
        lst.add(new ProductDTO("3333","세탁기","25리터",10000));

        return lst;
    }
}
