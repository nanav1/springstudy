package com.sisait.webapp.dto;

import lombok.*;

@ToString
@Setter
@Getter
@NoArgsConstructor // 매개변수가없는생성자매소드
@AllArgsConstructor// 매개변수가 모두 있는 생성자 매소드
public class ProductDTO {
    private String proCode;
    private String proName;
    private String option;
    private int price;
}
