package com.sisait.webapp.service;

import com.sisait.webapp.domain.BoardEntity;
import com.sisait.webapp.domain.JoinsEntity;
import com.sisait.webapp.domain.PagingVO;
import com.sisait.webapp.repository.BoardRepository;
import com.sisait.webapp.repository.JoinsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository repository;
    private final JoinsRepository joinsRepository;

    public BoardEntity boardWrite(BoardEntity entity) {
        return repository.save(entity);
    }

    public List<BoardEntity> boardAllSelectList() {
        //         모든 레코드를 id로 내림차순 정렬 -> boardEntity
        return repository.findAllByOrderByIdDesc();
    }

    public int getTotalRecordCount(PagingVO vo) {
        if(vo.getSearchWord()==null || vo.getSearchWord().equals("")) {
            // select count(id) from board_entity;
            return repository.countIdBy();
        }else{//검색어 있을때 : 제목, 글내용, 작성자 검색
            // select count(id) from board_entity where subject like '%검색어%';
            if(vo.getSearchKey().equals("subject")){
                return repository.countIdBySubjectContaining(vo.getSearchWord());
            }else if(vo.getSearchKey().equals("content")) {
                // select count(id) from board_entity where content like '%검색어%';
                return repository.countIdByContentContaining(vo.getSearchWord());
            }
            // select count(id) from board_entity where joins_id like '%검색어%';
            // select count(id) from board_entity where name in ('a', 'b', 'c')
            return repository.countByJoinsEntity_IdIn(joins_idList(vo.getSearchWord()));
        }
    }
    // in 연산자에서 사용할 회원명의 id를 구하여 List로 만든다.
    public List<Integer> joins_idList(String username){
        List<JoinsEntity> list = joinsRepository.findByUsername(username);

        List<Integer> idList = new ArrayList<Integer>();
        for(JoinsEntity e : list){
            idList.add(e.getId());
        }
        return idList;
    }

    public List<BoardEntity> boardPageList(PagingVO vo) {
        // 해당 페이지 정보를 선택하기 위해서는
        // 1. 컨트롤러 매핑에 @PageableDefault 어노테이션을 기술한다
        // 2. jpa 메소드 호출시 PageRequest를 정의한다
        // select * from board_entity order by board_id desc limit 5 offset 6;

        if(vo.getSearchWord() == null || vo.getSearchWord().equals("")) {
            // 검색어가 없을 때
            //                                                                         선택할 페이지(0,1,2), 페이지당레코드수
            return repository.findAllByOrderByIdDesc(PageRequest.of(vo.getNowPage() - 1, vo.getOnePageRecord()));
        }else{//검색어가 있을 때

            // 제목에서 검색 시 : 검색어 해당하고, 해당 페이지의 레코드를 선택
            if(vo.getSearchKey().equals("subject")) {
                // select * from board_entity where subject like '%FFF%' order by id desc limit 5 offset 5;
                return repository.findBySubjectContainingOrderByIdDesc(vo.getSearchWord(), PageRequest.of(vo.getNowPage() - 1, vo.getOnePageRecord()));
            }else if(vo.getSearchKey().equals("content")) {
                // 글 내용에서 검색 시
                // select * from board_entity where content like '%FFF%' order by id desc limit 5 offset 5;
                return repository.findByContentContainingOrderByIdDesc(vo.getSearchWord(), PageRequest.of(vo.getNowPage() - 1, vo.getOnePageRecord()));
            }else {
                // 작성자에서 검색할 때
                // select * from board_entity join joins_entity on board_entity.id=joins_entity_id
                // where board_entity.joins_entity.id in (2,10.45) order by id desc limit 5 offset 5;
                return  repository.findByJoinsEntity_IdInOrderByIdDesc(joins_idList(vo.getSearchWord()), PageRequest.of(vo.getNowPage()-1,vo.getOnePageRecord()));
            }
        }
    }

    public BoardEntity boardSelect(int id) {
        // select * from board_entity where id=?;
        Optional<BoardEntity> opt = repository.findById(id);
        return opt.get();
    }
    //조회수 증가
    public void hitCount(int id) {
        // update board_entity set hit = hit+1 where board_id=id;
        // 해당글을 선택
        BoardEntity orgEntity = boardSelect(id); // hit=0
        orgEntity.setHit(orgEntity.getHit()+1); // hit=1
        repository.save(orgEntity); // id가 잇으면 update, id가 없으면 insert
    }


    public int boardDelete(int id) {
        return repository.boardDelete(id);
    }
}
