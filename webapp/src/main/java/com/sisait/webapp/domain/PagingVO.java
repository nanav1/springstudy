package com.sisait.webapp.domain;

import lombok.ToString;

// 페이징시 필요한 변수와, 검색어, 검색키에 관련된 정보를 보관할 변수들을 선언
@ToString
public class PagingVO {
    private int nowPage = 1;//현재 페이지
    private int onePageRecord = 5;// 한페이지에 표시할 레코드 수
    private int totalRecord;// 총 레코드 수
    private int totalPage; // 총 페이지 수

    private int offsetPoint; // 선택할 레코드의 시작위치 => 현재페이지의 영향을 받는다.

    private int onePageNumCount = 5;// 한번에 표시할 페이지 갯수
    private int startPageNum = 1;

    private String searchKey;//검색어
    private String searchWord;//검색키

    public int getNowPage() {
        return nowPage;
    }

    public void setNowPage(int nowPage) {
        this.nowPage = nowPage;

        // 페이지 번호의 시작값 계산
        startPageNum = (nowPage-1)/onePageNumCount*onePageNumCount+1;
    }

    public int getOnePageRecord() {
        return onePageRecord;
    }

    public void setOnePageRecord(int onePageRecord) {
        this.onePageRecord = onePageRecord;
    }

    public int getTotalRecord() {
        return totalRecord;
    }

    public void setTotalRecord(int totalRecord) {
        this.totalRecord = totalRecord;

        //총 레코드수가 setting되면 총페이지를 계산할 수 있다
        if(totalRecord % onePageRecord == 0){ // onePageRecord의 배수인지 확인
            totalPage = totalRecord / onePageRecord;
        }else{
            totalPage = (totalRecord / onePageRecord) + 1;
        }

    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }

    public int getOffsetPoint() {
        return offsetPoint;
    }

    public void setOffsetPoint(int offsetPoint) {
        this.offsetPoint = offsetPoint;
    }

    public int getOnePageNumCount() {
        return onePageNumCount;
    }

    public void setOnePageNumCount(int onePageNumCount) {
        this.onePageNumCount = onePageNumCount;
    }

    public int getStartPageNum() {
        return startPageNum;
    }

    public void setStartPageNum(int startPageNum) {
        this.startPageNum = startPageNum;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public String getSearchWord() {
        return searchWord;
    }

    public void setSearchWord(String searchWord) {
        this.searchWord = searchWord;
    }
}
