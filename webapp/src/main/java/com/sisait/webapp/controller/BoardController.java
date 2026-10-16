package com.sisait.webapp.controller;


import com.sisait.webapp.domain.BoardEntity;
import com.sisait.webapp.domain.PagingVO;
import com.sisait.webapp.service.BoardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/board")
@RequiredArgsConstructor // private final로 선언된 변수의 객체 생성
public class BoardController {
    private final BoardService service;
    //게시판 글등록
    @PostMapping("/boardWrite")
    public String boardWrite(@RequestBody BoardEntity entity, HttpServletRequest request){
        entity.setIp(request.getRemoteAddr());
        entity.setHit(0);
        System.out.println(entity.toString());
//         insert -> 등록   save() -> select를 반환
        BoardEntity insertEntity = service.boardWrite(entity);
        //System.out.println(insertEntity);

        if(insertEntity.getId()==null){
            return "Fail";//insert 실패
        }else{
            return "Ok"; //insert 성공
        }
    }
    //게시판 글 목록 선택
    @GetMapping("/boardList")
    public Map<String, Object> boardList(PagingVO vo, @PageableDefault(sort="id", direction = Sort.Direction.DESC) Pageable pageable, Sort sort){
        Map<String, Object> map = new HashMap<String, Object>();
        //페이징, 검색
        //총레코드수를 구하여 vo에 totalRecord에 대입
        vo.setTotalRecord(service.getTotalRecordCount(vo));

        System.out.println("페이지 검색어 정보 : "+vo.toString());

        //db의 모든 레코드를 desc선택하여 List<BoardEntity>에 담아 반환
//        List<BoardEntity> list = service.boardAllSelectList();

        //해당 페이지의 레코드 선택
        List<BoardEntity> list = service.boardPageList(vo); // 검색어 , 해당페이지

        map.put("boardList", list);//목록
        map.put("pages", vo); // 페이지, 검색 정보

        return map;
    }
    // 글 내용 보기, 해당 글 선택
    @GetMapping("/boardView/{id}")
    public BoardEntity boardSelect(@PathVariable int id){
        //조회수 증가
        service.hitCount(id);
        return service.boardSelect(id);
    }
    //글 수정 폼 -> 글내용선택
    @GetMapping("/boardEdit/{id}")
    public BoardEntity boardEditSelect(@PathVariable int id){
        return service.boardSelect(id);
    }

    // 글 수정 - Db 업데이트
    @PostMapping("/boardEditOk")
    public String boardEditOk(@RequestBody BoardEntity entity){
        System.out.println(entity.toString());
//        //기존 글 내용이 있는 레코드를 선택
//        BoardEntity selectEntity = service.boardSelect(entity.getId());
//        selectEntity.setSubject(entity.getSubject());
//        selectEntity.setContent(entity.getContent());
        // 이거 2안 쓸려면 아래 메소드에 entity 대신 selectEntity 대입하면됨

        // id가 있으므로 save() 메소드는 update문을 만들어서 구현한다.
        BoardEntity resultEntity = service.boardWrite(entity);
        if(resultEntity != null){
            return "Ok";
        }else {
            return "fail";
        }
    }
    //글삭제
    @GetMapping("/boardDel/{id}")
    public String boardDel(@PathVariable("id") int id){
        int result = service.boardDelete(id);
        return  result+"";
    }
}
