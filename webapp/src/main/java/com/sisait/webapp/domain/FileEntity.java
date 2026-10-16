package com.sisait.webapp.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="FILE_ENTITY")
public class FileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FILE_ID")
    private int id;

    @Column(nullable = false,length = 200)
    private String filename;

    @Column(nullable = false,length = 5)
    private String extname;

    @Column(nullable = false)
    private int size;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "DATA_ID")
    @ToString.Exclude
    private DataEntity dataEntity;
}
