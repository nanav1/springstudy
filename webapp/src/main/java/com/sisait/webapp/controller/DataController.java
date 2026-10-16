package com.sisait.webapp.controller;

import com.sisait.webapp.domain.DataEntity;
import com.sisait.webapp.domain.FileEntity;
import com.sisait.webapp.service.DataService;
import jakarta.servlet.http.HttpSession;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/data")
public class DataController {
    private final DataService service;
    //자료실 글 등록: 파일업로드
    @PostMapping("/dataWrite")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public String dataWrite(DataEntity entity, HttpSession session){
        // 파일을 업로드할 위치값을 httpSession 객체를 이용하여 절대값을 구함
        String path = session.getServletContext().getRealPath("/uploads");
        System.out.println("path=>"+path);

        List<FileEntity> fileList = null;

        try {
            // 파일업로드 : 파일명, 확장자, 파일크기를 이용하여 FileEntity를 가지는list를 생성해야한다.
            // 같은 파일명이 있으면 rename한다

            // 업로드 폴더가 없으면 생성하기
            File pathFile = new File(path);
            if( !pathFile.exists()){
                pathFile.mkdir();
            }

            // 원글 db추가
            DataEntity resultEntity = service.dataInsert(entity);

            // 파일업로드 -> FileEntity -> list 담아 반환하기
            fileList = fileuploadProcess(resultEntity.getId(), entity.getFiles(), path);
            // 첨부파일 db추가 FileEntity의 레코드를 추가
            int resultCount = service.fileListInsert(fileList);

            return "Ok";
        }catch(Exception e){
            //이미 업로드된 파일 삭제
            if(fileList != null){
                for (FileEntity fe : fileList){
                    File f = new File(path, fe.getFilename()+"."+fe.getExtname());
                    f.delete();
                }
            }
            //롤백
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return "failed";
        }
    }

    //자료실 글 목록
    @GetMapping("/dataList")
    public List<DataEntity> dataList(){
        return service.dataListSelect();
    }
    //글 내용 선택하기
    @GetMapping("/dataDetail/{id}")
    public DataEntity dataDetail(@PathVariable("id") int id){
        service.hitCount(id);
        return service.dataDetailSelect(id);
    }
    //파일 내용을 바이너리코드로 반환하는 매핑
    @GetMapping("/file/download/{downFile}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("downFile") String downFile, HttpSession session) throws Exception{
        String folder = session.getServletContext().getRealPath("uploads");

        //소스 읽어오기
        Path path = Paths.get(folder, downFile);
        Resource resource = new UrlResource(path.toUri());

        //한글파일 읽을 수 있게 contentDisposition 빌더로 변환
        org.springframework.http.ContentDisposition contentDisposition = org.springframework.http.ContentDisposition.builder("attachment")
                .filename(downFile, java.nio.charset.StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
        //resource의 자원을 ResponseEntity 객체로 작성하여 반환하기
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename = \""+downFile+"\"")
//                .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                .body(resource);
    }
    //자료실 글 수정
    @PostMapping("/dataEdit")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public String dataEdit(DataEntity entity, HttpSession session){
        System.out.println(entity.toString());
        //원글 수정하기전 DB에 잇는 정보 가져오기
        DataEntity orgDataEntity = service.dataDetailSelect(entity.getId());

        //파일을 업로드할 절대 경로
        String uploadPath = session.getServletContext().getRealPath("/uploads");

        List<FileEntity> newUploadFile = null;
        int uploadFileCnt = 0;
        try{
            // 새로운 업로드
            newUploadFile = fileuploadProcess(entity.getId(), entity.getFiles(), uploadPath);

            // 새로 첨부한 파일이 있을 때 새로 업로드한 파일정보를 DB에 insert
            if(newUploadFile != null && newUploadFile.size()>0){
                uploadFileCnt =  service.fileListInsert(newUploadFile);
            }
            // DB에서 삭제된 파일의 레코드를 지우기 전에 삭제된 파일을 먼저 선택한다
            List<FileEntity> delFileList = service.fileDeleteList(entity.getDelFile());

            // 삭제한 파일의 레코드를 DB에서 지우기
            int delFileCount = service.fileDelete(entity.getDelFile());

            // 원글 수정한 내용을 update하기
            int updateCount = service.dataUpdate(entity);

            // 수정성공
            // 수정폼에서 삭제한 파일을 지워야한다
            // 삭제할 파일이 있으면 지운다
            fileDelete(uploadPath,delFileList);

            return "Ok";
        }catch(Exception e){
            //수정실패
            //새로첨부한 파일 삭제
            fileDelete(uploadPath, newUploadFile);
            //롤백
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return "Fail";
        }
    }
    // 파일 삭제
    public void fileDelete(String path, List<FileEntity> list){
        if(list != null && list.size()>0){ //새로 업로드한 파일이 잇으면
            for(FileEntity  f : list){
                File file = new File(path, f.getFilename()+"."+f.getExtname());
                file.delete();
            }
        }
    }
    @GetMapping("/dataDelete/{id}")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public String dataDelete(@PathVariable("id") int id, HttpSession session){
        String path = session.getServletContext().getRealPath("/uploads");
        try {
            //첨부파일 레코드를 db에서 삭제하기전에 보관 : 파일삭제할때필요함
            DataEntity dbSelect = service.dataDetailSelect(id);

            //첨부파일을 db에서 삭제
            int fileResult = 0;
            for(FileEntity fEntity : dbSelect.getFileList()){
                fileResult += service.fileDBDelete(fEntity.getId());
            }

            //원글을 DB에서 삭제
            int result = service.dataDBDelete(id);
            //첨부파일도 삭제
            fileDelete(path, dbSelect.getFileList());

            return "Ok";
        }catch(Exception e){
            e.printStackTrace();

            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return "Fail";
        }
    }
    public List<FileEntity> fileuploadProcess(int id, List<MultipartFile> fileList, String path) {
        // 원글번호, MultipartFile -> 파일명, 확장자, 크기, 업로드위치
        // rename도 해야함
        // 업로드한 파일목록을 보관할 변수 선언
        List<FileEntity> uploadFileList = new ArrayList<FileEntity>();

        if (fileList != null) {
            for (MultipartFile mf : fileList) {
                if (mf != null) {
                    //원래 파일명
                    String orgFilename = mf.getOriginalFilename();
                    //파일명 중복 확인후 rename
                    File file = new File(path, orgFilename);
                    //파일명과 확장자 분리
                    int point = orgFilename.lastIndexOf(".");
                    String filename = orgFilename.substring(0, point);
                    String extname = orgFilename.substring(point + 1);
                    if (file.exists()) {// 있으면 true, 없으면 false
                        //rename -> a.gif -> a(1).gif ...
                        for (int i = 1; ; i++) {
                            String newFilename = filename + "(" + i + ")." + extname;
                            file = new File(path, newFilename);
                            if (!file.exists()) {
                                // 새로 만든 파일명으로 업로드 해야 하므로, orgFilename에 대입 후 반복문 중지
                                orgFilename = newFilename;
                                break;
                            }
                        }
                    }
                        //업로드
                        try {
                            mf.transferTo(file);
                            FileEntity fEntity = new FileEntity();
//                            fEntity.getDataEntity().setId(id); //원글
                            DataEntity data = new DataEntity();
                            data.setId(id);
                            fEntity.setDataEntity(data);

                            int p = orgFilename.lastIndexOf(".");
                            fEntity.setFilename(orgFilename.substring(0, p));//파일명
                            fEntity.setExtname(extname);//확장자

                            fEntity.setSize((int) file.length());//용량
                            uploadFileList.add(fEntity);//업로드한 파일 목록 보관
                        } catch (Exception e) {
                            e.printStackTrace(); // 서버 콘솔에 에러 출력
                            throw new RuntimeException("파일 업로드 중 오류가 발생했습니다: " + orgFilename, e);
                        }
                }
            }
        }
        return uploadFileList;
    }


}
