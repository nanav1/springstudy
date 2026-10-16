package com.sisait.webapp.service;

import com.sisait.webapp.domain.DataEntity;
import com.sisait.webapp.domain.FileEntity;
import com.sisait.webapp.repository.DataRepository;
import com.sisait.webapp.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DataService {
    private final DataRepository repository;
    private final FileRepository fileRepository;

    public DataEntity dataInsert(DataEntity entity) {
        return repository.save(entity);
    }

    public int fileListInsert(List<FileEntity> fileList) {
        //insert into File_entity(filename, extname, size, id) values(?,?,?,?)
        int cnt=0;
        for(FileEntity fEntity : fileList){
            FileEntity resultEntity = fileRepository.save(fEntity);
            if(resultEntity.getId()>0){//추가된 레코드 수 구하기
              cnt++;
            }
        }
        return cnt;
    }

    public List<DataEntity> dataListSelect() {
        // secelt * from data_entity order by id desc
        return repository.findAllByOrderByIdDesc();
    }

    public DataEntity dataDetailSelect(int id) {
        // select * from data_entity where id=?;
        return repository.findById(id).get();
    }

    public void hitCount(int id) {
        DataEntity orgEntity = dataDetailSelect(id);
        orgEntity.setHit(orgEntity.getHit()+1);
        repository.save(orgEntity);
    }

    public int fileDelete(List<Integer> delFile) {
        int cnt = 0;
        if(delFile !=null) {
            for (int id : delFile) {
                cnt += fileRepository.dataFileDelete(id);
            }
        }
        return cnt;
    }

    public int dataUpdate(DataEntity entity) {
        return repository.dataUpdate(entity.getId(), entity.getSubject(), entity.getContent());
    }

    public List<FileEntity> fileDeleteList(List<Integer> delFile) {
        //select * from FileEntity where id in (5, 7)
        return fileRepository.findByIdIn(delFile);
    }

    public int dataDBDelete(int id) {
        return repository.dataDBDelete(id);
    }

    public int fileDBDelete(int id) {
        return fileRepository.fileDelete(id);
    }
}
