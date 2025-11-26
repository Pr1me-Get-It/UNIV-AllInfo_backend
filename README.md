# UNIV AllInfo Backend

## !! Warning !!

**main 브랜치에 push 시 AWS EC2에 자동으로 deploy 됩니다**

### 곧 구현 될 API

- 신청 마감일 등 date 추출 API
- 푸쉬알림 관련 키워드 등록 수정 등 API
- 좋아요 관련 API

### 현재 구현 된 API

#### 엔드포인트: `/notice`

##### 메서드: `GET`

---

#### 설명

최신 공지사항 또는 검색 키워드에 따른 공지사항 목록을 페이지별로 조회하는 API입니다.

---

#### 요청 파라미터

| 이름    | 타입   | 설명                             | 필수 여부 | 예시  |
| ------- | ------ | -------------------------------- | --------- | ----- |
| p       | number | 페이지 번호 (기본값: 1)          | 선택      | 1     |
| keyword | string | 검색할 키워드 (없으면 최신 공지) | 선택      | "KNU" |

---

#### 응답 예시

{
"notices": [
{
"id": 224,
"source": "ELE",
"title": "『2025년 'KNU-대구RISE' 청년 연구자 창업 아이디어 지원 사업』 안내 새글",
"date": "2025-11-25",
"link": "https://home.knu.ac.kr/HOME/electric/sub.htm?mode=view&mv_data=..."
},
{
"id": 223,
"source": "ELE",
"title": "KNU-O 방구석 콘서트 <Future of AI> 안내 새글",
"date": "2025-11-25",
"link": "https://home.knu.ac.kr/HOME/electric/sub.htm?mode=view&mv_data=..."
}
],
"total": 224,
"page": 1,
"pageSize": 15,
"totalPages": 15
}

---

#### 필드 설명

| 이름       | 설명                    |
| ---------- | ----------------------- |
| notices    | 공지사항 목록 배열      |
| └─ id      | 공지글 고유 ID          |
| └─ source  | 출처 약어 (ELE, SEE 등) |
| └─ title   | 공지 제목               |
| └─ date    | 공지 날짜 (YYYY-MM-DD)  |
| └─ link    | 상세 페이지 URL         |
| total      | 전체 공지글 수          |
| page       | 현재 페이지 번호        |
| pageSize   | 한 페이지당 공지글 수   |
| totalPages | 전체 페이지 수          |

---
