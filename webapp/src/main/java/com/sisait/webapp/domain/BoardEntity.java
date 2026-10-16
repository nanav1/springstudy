package com.sisait.webapp.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

// entity + dto + vo
@Entity
@Data // getter setter toString equals
@NoArgsConstructor // 매개변수 없는 생성자
@AllArgsConstructor // 매개변수 전체가 있는 생성자
@Table(name="BOARD_ENTITY")
public class BoardEntity {
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // autoincrement
    @Column(name="BOARD_ID")
    private Integer id;//일련번호

    @Column(nullable = false, length = 200)
    private String subject;//제목

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;//글내용

    @Column(columnDefinition = "int default 0")
    private Integer hit;//조회수
    @Column(nullable = false)
    private String ip;//글쓴이의 ip
    @CreationTimestamp //@UpdateTimestamp : 수정씨 날짜변경
    @Column(columnDefinition = "DATETIME default now()")
    private String updateDateTime; // 등록일 : 날짜+시간

    //글쓴이 : joins_entity와 join이 처리

    //회원정보 1명을 보관할 수 있는 entity를 설정
    @ManyToOne // 1:n을 외래키 설정 OneToManty:tk
    @JoinColumn(name="joins_id")
    private JoinsEntity joinsEntity;
}
