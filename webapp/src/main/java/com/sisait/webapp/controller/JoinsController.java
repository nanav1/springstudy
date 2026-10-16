package com.sisait.webapp.controller;

import com.sisait.webapp.domain.JoinsEntity;
import com.sisait.webapp.service.JoinsService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor // private fianl 선언된 변수에 객체를 생성해서 대입해준다
@RequestMapping("/joins")
public class JoinsController {
    private final JoinsService service; //new JoinsServic()

    @PostMapping("/joinsForm")
    public Integer joinsForm(@RequestBody JoinsEntity joinsEntity){
        System.out.println(joinsEntity.toString());

        return service.createJoins(joinsEntity).getId();
    }
    //로그인
    @PostMapping("/login")                                          //현재접속의 session객체생성
    public JoinsEntity joinsLogin(@RequestBody JoinsEntity joinsEntity, HttpSession session){
        System.out.println(joinsEntity.toString());
        System.out.println(session.getId());
        JoinsEntity entity = service.login(joinsEntity);
        if(entity != null) {        //로그인 성공 : 세션에 필요한 정보기록(id, username, userid)
            session.setAttribute("logId", entity.getId());
            session.setAttribute("logId", entity.getUserid());
            session.setAttribute("logName", entity.getUsername());
            session.setAttribute("logStatus", "Y");

        entity.setPassword("");
        entity.setTel("");
        entity.setEmail("");
        entity.setWritedate("");

        }else{    //로그인 실패
            session.setAttribute("logStatus", "N");
        }
        return entity;
    }

    @GetMapping("/logout")
    public String logout(HttpSession session){
        //session 객체 자체를 제거한다    -> 새로운 세션이 자동으로 할당됨
        session.invalidate();
        return "Ok";
    }

    // 회원선택(userid)
    @PostMapping("/getjoins")
    public JoinsEntity getJoins(@RequestBody JoinsEntity entity){
        return service.getJoinSelect(entity.getUserid());
    }
    //회원정보수정
    @PostMapping("/joinsEdit") // entity = dto = vo
    public String joinsEdit(@RequestBody JoinsEntity entity){
        JoinsEntity result = service.joinsUpdate(entity);
        return "Ok";
    }
    //회원탈퇴  /joins/unregister/1
    @DeleteMapping("/unregister/{id}")
    public String unregister(@PathVariable Integer id, HttpSession session){
        // 레코드 삭제
        int result = service.unRegister(id);
        // 세션 로그인 정보 삭제

        // result == 0 이면 회원탈퇴, 그 외의 id는 존재
        if(result ==0){
            session.invalidate();
        }
        return result+""; // new String(id); 0, 그외.....id
    }
}
