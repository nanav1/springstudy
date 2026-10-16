package com.sisait.webapp.repository;

import com.sisait.webapp.domain.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Integer> {
    @Modifying
    @Query("delete from FileEntity where id=:id")
    int dataFileDelete(@Param("id" ) int id);

    List<FileEntity> findByIdIn(List<Integer> delFile);

    @Modifying
    @Query("delete from FileEntity where id=:id")
    int fileDelete(@Param("id") int id);
}
