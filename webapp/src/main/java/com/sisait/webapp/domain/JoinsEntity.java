package com.sisait.webapp.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
/* 서버가 실행됐을때 데이터베이스에 테이블이 없으면 자동으로 테이블을 생성함
*  dto, vo의 역할도 함
*  테이블명은 클래스명으로 만들어지고 @Table어노테이션을 쓰면 테이블 이름을 원하는 이름으로 적용할 수 있다
*  */
@Table(name="Joins_Entity")
// setter, getter, toString, equals == @data
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinsEntity {
    // 자동일련번호, 중복허용x
    // 중복혀용하지 않는다. 모든 Entity에는 @Id가 있어야함 (primary key)
    @Id
    // autoincrement
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // 컬럼명
    @Column(name="JOINS_ID", nullable = false)
    private Integer id;

    // 중복안됨, 자리수 : 20, null 허용안함
    @Column(name="USERID", nullable = false, length = 20, unique = true)
    private String userid;

    @Column(nullable = false, length = 20)
    private String password;

    @Column(nullable = false, length = 20)
    private String username;

    @Column(nullable = false, columnDefinition = "varchar(15) default '010-0000-0000'")
    private String tel;

    @Column(nullable = false, length=45)
    private String email;

    //등록일 : 자동으로 오늘 날짜
    // UpdateTimestamp : insert, update 할 때 현재날짜와 시간으로 변경
    // CreationTimestamp : insert 날짜시간정보 등록이 되고 수정할ㄸ ㅐ변경하지 않는다
    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()", updatable = false)
    private String writedate;
}
