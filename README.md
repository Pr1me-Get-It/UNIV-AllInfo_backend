# UNIV AllInfo Backend

## !! Warning !!

**main 브랜치에 push 시 AWS EC2에 자동으로 deploy 됩니다**

### ❤️❤️여기를 보세요❤️❤️

DB를 MySQL로 마이그레이션 하면서 변경된 부분들 모두 리드미에 반영하지 못했습니다.
GET `/notice?page={}&keyword={}`
GET POST `/notice/:id/like`
GET `/notice/:id/deadline`
POST `/user/register`
GET POST DELETE `/user/keyword`
이렇게 API 구현되어 있습니다.
쓰면서 익히십시오. 궁금하면 물어보십시오.

### 현재 구현 된 API

#### 엔드포인트: `/notice`

##### 메서드: `GET`

#### 설명

최신 공지사항 또는 검색 키워드에 따른 공지사항 목록을 페이지별로 조회하는 API입니다.
정렬 기준은 posted_at의 역순

#### 요청 파라미터

| 이름    | 타입   | 설명                             | 필수 여부 | 예시  |
| ------- | ------ | -------------------------------- | --------- | ----- |
| p       | number | 페이지 번호 (기본값: 1)          | 선택      | 1     |
| keyword | string | 검색할 키워드 (없으면 최신 공지) | 선택      | "KNU" |

#### 응답 예시

```
[
    {
        "notice_id": 3227,
        "source": "KMU/HOME/kmusic/sub.htm?nav_code=kmu1622609949",
        "title": "2026학년도 1학기 재학생 등록금 수납 계획",
        "posted_at": "2026-01-18T15:00:00.000Z",
        "link": "https://home.knu.ac.kr/HOME/kmusic/sub.htm?mode=view&mv_data=aWR4PTEzOTgmc3RhcnRQYWdlPTAmbGlzdE5vPTEzNTQmdGFibGU9ZXhfYmJzX2RhdGFfa211c2ljJm5hdl9jb2RlPWttdTE2MjI2MDk5NDkmY29kZT1YQms5V0czN3pIcWwmc2VhcmNoX2l0ZW09JnNlYXJjaF9vcmRlcj0mb3JkZXJfbGlzdD0mbGlzdF9zY2FsZT0mdmlld19sZXZlbD0mdmlld19jYXRlPSZ2aWV3X2NhdGUyPQ==",
        "created_at": "2026-01-19T02:36:53.000Z",
        "link_hash": "66a8c960ac482f926c207cff6b7c8c9c1cec9aaac490dc166c169dcf72c2ac78"
    },
    {
        "notice_id": 3000,
        "source": "CSE/bbs/board.php?bo_table=sub5_1",
        "title": "일반공지 [자원봉사센터] 대학생 우수 자원봉사자 표창 대상자 추천 안내",
        "posted_at": "2026-01-18T15:00:00.000Z",
        "link": "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_1&wr_id=28974",
        "created_at": "2026-01-19T02:36:47.000Z",
        "link_hash": "87dd992b956940979adab77fcdebf6d0966fb50ce3a2b5fb4bf8d12d84ddca33"
    },
    ...
]
```

---

#### 필드 설명

| 이름       | 설명                                      |
| ---------- | ----------------------------------------- |
| notice_id  | 공지글 고유 ID                            |
| source     | 출처 약어 (ELE, SEE 등) + 과 내 세부 구분 |
| title      | 공지 제목                                 |
| posted_at  | 공지 날짜 (YYYY-MM-DD)                    |
| link       | 상세 페이지 URL                           |
| created_at | DB에 저장된 시각                          |
| link_hash  | 공지별 중복 확인용 hash                   |

#### 엔드포인트: `/notice/:id/like`

##### 메서드: `GET`, `POST`

---

#### 설명

지정한 공지(`notice_id`)에 대해 사용자의 이메일을 기반으로 좋아요를 처리합니다. 이미 좋아요한 사용자는 중복으로 좋아요할 수 없습니다. 한 번 누른 좋아요는 되돌릴 수 없습니다.

---

#### 요청 예시

```
POST /notice/224/like
Content-Type: application/json
{
	"email": "user@example.com"
}
```

---

#### 성공 응답

- 새로 좋아요를 추가한 경우 (200 OK)

```
Status: 200
{
	"success": true,
	"message": "Notice liked"
}
```

- 이미 좋아요가 되어 있는 경우

```
Status: 400
{
	"success": false,
	"message": "Notice already liked"
}
```

---

#### 에러 응답

```
Status: 500
{
	"success": false,
	"message": "Server Error"
}
```

---

#### 필드 설명

| 이름      | 설명                          |
| --------- | ----------------------------- |
| notice_id | 공지의 고유 ID (URL 파라미터) |
| email     | 좋아요를 누르는 사용자 이메일 |

---

#### 엔드포인트: `/notice/:id/deadline`

##### 메서드: `GET`

---

#### 설명

특정 공지(`id`)의 시작일과 마감일 정보를 반환합니다. 추출할 수 없는 포맷의 공지이거나 마감일이 없는 공지의 경우 null을 반환합니다.

---

#### 요청 예시

```
GET /notice/224/deadline
```

---

#### 성공 응답

- 시작일, 마감일이 존재하는 경우 (200 OK)

```
Status: 200
{
    "deadline": {
        "start": "2025-11-27",
        "end": "2025-12-01"
    },
    "isExistDeadline": true
}
```

- 기간의 시작일 또는 마감일이 일부 존재하는 경우 (200 OK)

```
Status: 200
{
    "deadline": {
        "start": "null",
        "end": "2025-12-01"
    },
    "isExistDeadline": true
}
```

- 마감일이 명시적으로 없는 경우 (200 OK)

```
Status: 200
{
    "deadline": {
        "start": "null",
        "end": "null"
    },
    "isExistDeadline": false
}
```

---

#### 에러 응답

```
Status: 500
{
	"success": false,
	"message": "Server Error"
}
```

---

#### 필드 설명

| 이름            | 설명                                     |
| --------------- | ---------------------------------------- |
| id              | 공지의 고유 ID (URL 파라미터)            |
| deadline        | 마감일 문자열 (`YYYY-MM-DD` 형태로 응답) |
| └─ start        | 기간의 시작일 정보                       |
| └─ end          | 기간의 마감일 정보                       |
| isExistDeadline | 마감일 존재 여부 (true/false)            |

---

#### 엔드포인트: `/user/register`

##### 메서드: `POST`

---

#### 설명

사용자 이메일로 간단히 사용자 등록을 수행하는 엔드포인트입니다.
**구글 로그인을 시킨 후 반드시 호출해주세요!**
이미 등록된 이메일이면 중복 등록을 허용하지 않습니다. (아무 email이나 던져줘도 알아서 잘 처리합니다.)

---

#### 요청 헤더

| 이름           | 설명               |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

---

#### 요청 바디

| 이름          | 타입   | 설명                      | 필수 여부 | 예시               |
| ------------- | ------ | ------------------------- | --------- | ------------------ |
| email         | string | 등록할 사용자 이메일 주소 | 예        | `user@example.com` |
| expoPushToken | string | 토큰주세요                | 예        |                    |

예시:

```
{
	"email": "user@example.com",
	"expoPushToken" : token
}
```

---

#### 성공 응답

- **201 Created**: 새 사용자가 생성된 경우

```
Status: 201
{
	"success": true,
	"message": "User registered successfully with email: user@example.com"
}
```

- **200 OK**: 이미 등록된 사용자 (idempotent)

```
Status: 200
{
	"success": true,
	"message": "User already registered"
}
```

---

#### 에러 응답

```
Status: 500
{
	"success": false,
	"message": "Failed to register user"
}
```

---

#### 필드 설명

| 이름  | 설명                               |
| ----- | ---------------------------------- |
| email | 사용자의 이메일 주소 (유효한 형식) |

---

#### 엔드포인트: `/user/keyword`

##### 메서드: `GET`, `POST`, `DELETE`

---

#### 설명

사용자가 등록한 푸쉬알림을 위한 키워드를 관리하는 엔드포인트입니다.

- `GET` : 특정 사용자가 등록한 키워드 목록을 조회합니다.
- `POST` : 키워드를 새로 등록합니다.
- `DELETE` : 등록된 키워드를 삭제합니다.

---

#### 요청 예시

- `GET` (사용자 이메일로 조회)

```
GET /user/keyword
Content-Type: application/json
{
	"email": "user@example.com",
}
```

- `POST` (키워드 등록)

```
POST /user/keyword
Content-Type: application/json
{
	"email": "user@example.com",
	"keywords": ["KNU"]
}
```

- `DELETE` (키워드 삭제)

```
DELETE /user/keyword
Content-Type: application/json
{
	"email": "user@example.com",
	"keywords": ["KNU"]
}
```

---

#### 응답 예시

- `GET` 성공 (200 OK)

```
Status: 200
{
	"success": true,
	"keywords": ["KNU", "장학금", "학사"]
}
```

- `POST` 성공 (201 Created 또는 200 OK)

```
Status: 201
{
	"success": true,
	"message": "Keyword registered",
	"keywords": 요청 반영 후 키워드 Array
}
```

- `DELETE` 성공 (200 OK)

```
Status: 200
{
	"success": true,
	"message": "Keyword deleted",
	"keywords": 요청 반영 후 키워드 Array
}
```

---

#### 필드 설명

| 이름    | 설명                      |
| ------- | ------------------------- |
| email   | 사용자의 이메일 주소      |
| keyword | 등록/삭제할 키워드 문자열 |

---
