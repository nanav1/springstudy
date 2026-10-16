package com.sisait.webapp.controller;
// class가 컨트롤러 클래스가 되기 위해서는
// controller, restController 어노테이션을 class정의 전에 기술하면 된다

import com.sisait.webapp.dto.TestDTO;
import org.springframework.boot.Banner;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
// 접속자의 매핑주소에 따라, 접속을 받고 프로세스 처리하고 결과를 반환하는 역할을 한다.
// 뷰페이지정보 + 데이터를 반환한다
public class HomeController {
    //@RequestMapping -- post방식 get 방식
    //@GetMapping -- get방식
    //@PostMapping -- post방식
    @RequestMapping(value = "/",method = RequestMethod.GET) // get 방식일때
    //@RequestMapping("/") //get방식일때
    //@RequestMapping(value = "/",method = RequestMethod.POST) // post 방식일때

    public String home(){
        System.out.println("home컨트롤러 실행됨");
        // 데이터와 뷰페이지 정보를 알려줌
        // Controller에서 String을 리턴하면 뷰파일명이 된다
        return "index"; //index.html
    }
    @GetMapping("/list")
    public String test(int page){
        System.out.println("페이지 :"+page);//sout
        return "board"; // board.html
    }

    @RequestMapping(value = "/my/infor", method = RequestMethod.POST)
    public ModelAndView information(String username, int age){
        System.out.println("이름 : "+username);
        System.out.println("나이 : "+age);

        ModelAndView mav = new ModelAndView();
        // 데이터 셋팅
        mav.setViewName("board");//뷰페이지 //board.html
        return mav;
    }

    @PostMapping("/my/infor2")
    public ModelAndView information2(TestDTO dto){
        System.out.println("이름 ===> "+dto.getUsername());
        System.out.println("id ===>"+dto.getUserid());
        System.out.println("나이 ===>"+dto.getAge());

        ModelAndView mav = new ModelAndView();
        mav.setViewName("index");
        return mav;
    }

    @GetMapping("/test/{won}/{product}")
    public String test2(@PathVariable int won, @PathVariable String product){
        System.out.println("won -> "+(won +10000)+"원");
        System.out.println("product -> "+product);
        return "index";
    }
}
