package com.sisait.webapp.repository;

import com.sisait.webapp.domain.BoardEntity;
import com.sisait.webapp.domain.JoinsEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    List<BoardEntity> findAllByOrderByIdDesc();
    List<BoardEntity> findAllByOrderByIdDesc(PageRequest pageRequest);
    //검색어가 없을 때 총 레코드 수
    int countIdBy();


    int countIdBySubjectContaining(String searchWord);

    int countIdByContentContaining(String searchWord);

    int countByJoinsEntity_IdIn(List<Integer> integers);

    List<BoardEntity> findBySubjectContainingOrderByIdDesc(String searchWord, PageRequest of);

    List<BoardEntity> findByContentContainingOrderByIdDesc(String searchWord, PageRequest of);


    List<BoardEntity> findByJoinsEntity_IdInOrderByIdDesc(List<Integer> integers, PageRequest of);

    @Modifying //update delete일때
    @Transactional
    @Query("delete from BoardEntity where id=:id")
    int boardDelete(@Param("id") int id);
}
