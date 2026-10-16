package com.sisait.webapp.repository;

import com.sisait.webapp.domain.DataEntity;
import com.sisait.webapp.domain.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DataRepository extends JpaRepository<DataEntity, Integer>{
    List<DataEntity> findAllByOrderByIdDesc();

    @Modifying
    @Query("update DataEntity set subject=:subject, content=:content where id=:id")
    int dataUpdate(@Param("id")int id,@Param("subject") String subject, @Param("content") String content);

    @Modifying
    @Query("delete from DataEntity where id=:id")
    int dataDBDelete(@Param("id") int id);
}
