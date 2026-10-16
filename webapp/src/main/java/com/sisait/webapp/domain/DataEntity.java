package com.sisait.webapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="DATA_ENTITY")
public class DataEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="DATA_ID")
    private int id;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(columnDefinition = "int default 0")
    private int hit;

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private String writedate;
    //작성자
    @ManyToOne //1:N
    @JoinColumn(name="JOINS_ID")
    @ToString.Exclude
    //@JsonIgnore
    private JoinsEntity joinsEntity;

    //첨부파일 : 원글 삭제시 첨부파일도 같이 삭제되도록 cascde 설정하기
    @OneToMany(
        mappedBy = "dataEntity",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )

    @JsonManagedReference
    private List<FileEntity> fileList = new ArrayList<FileEntity>();

    @Transient
    List<MultipartFile> files;

    //삭제할 첨부파일의 글번호를 담을 변수
    @Transient
    List<Integer> delFile;
}
