package com.sisait.webapp.repository;

import com.sisait.webapp.domain.JoinsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// jpa 프래임워크를 구현하는 인터페이스
// 1. JpaRepository class 를 상속받음
// 2. select, update, insert, delete 쿼리문을 수행할 메소드가 이미 생성되어있음
//                                                          dto  ,   id의 데이터형
public interface JoinsRepository extends JpaRepository<JoinsEntity, Integer> {

    //로그인
    JoinsEntity findByUseridAndPassword(String userid, String password);

    JoinsEntity findByUserid(String userid);

    List<JoinsEntity> findByUsername(String username);
}
