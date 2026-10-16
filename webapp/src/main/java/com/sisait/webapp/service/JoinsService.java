package com.sisait.webapp.service;

import com.sisait.webapp.domain.JoinsEntity;
import com.sisait.webapp.repository.JoinsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service // 비지니스 구현을 위한 클래스, jpa repository를 호출할 클래스
@RequiredArgsConstructor
public class JoinsService {
    // 회원인증과 관련된 db작업을 할 repository작성
    private final JoinsRepository repository;
    //회원등록
    //insert into tbl(a,b) values("a","b") <-- jpa

    public JoinsEntity createJoins(JoinsEntity joinsEntity) {
        // @id의 필드가 null이면 insert -> select를 실행한다
        // @id 필드가 null이 아니면 update -> select를 해서 리턴
        return repository.save(joinsEntity);
    }

    public JoinsEntity login(JoinsEntity joinsEntity) {
        //로그인
        // select * from joins_entity where userid=? && password=?
        JoinsEntity entity = repository.findByUseridAndPassword(joinsEntity.getUserid(),joinsEntity.getPassword());
        System.out.println(entity);

        return entity;
    }

    public JoinsEntity getJoinSelect(String userid) {
        //select joins_id, userid, username, password, tel, email, writedate from joins_entity where userid=?
        return repository.findByUserid(userid);
    }
    //회원수정                   //id, userid, username, tel, email, password
    public JoinsEntity joinsUpdate(JoinsEntity entity) {
        //entity 객체에 있는 password와 DB의 password가 같은지 확인 후 수정한다.
        //db의 원정보 선택
        JoinsEntity dbEntity = getJoinSelect(entity.getUserid());
        if(dbEntity.getPassword().equals(entity.getPassword())){
            //비밀번호가 같으면 수정
            return repository.save(entity); // update -> select
        }else {
            //수정안함
            entity.setUserid("");
            return entity;
        }
    }

    public int unRegister(Integer id) {
        // delete from joins_entity where id=?;
        try {
            // deleteBy는 반환형이 없으므로 sql 수행시 삭제 대상이 없으면 강제로 예외를 발생시킬것
            //                                    람다식 함수
            repository.deleteById(id);
            //                             select * from joins_entity where id = 1?
            JoinsEntity entity = repository.findById(id).orElseThrow(()->{
                throw new IllegalArgumentException("존재하지 않는 정보입니다");
            });
            return id;
        }catch(Exception e){
            System.out.println(e.getMessage());
        }
        return 0;
    }
}