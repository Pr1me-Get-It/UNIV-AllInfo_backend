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

#### 설명

최신 공지사항 또는 검색 키워드에 따른 공지사항 목록을 페이지별로 조회하는 API입니다.

#### 요청 파라미터

| 이름    | 타입   | 설명                             | 필수 여부 | 예시  |
| ------- | ------ | -------------------------------- | --------- | ----- |
| p       | number | 페이지 번호 (기본값: 1)          | 선택      | 1     |
| keyword | string | 검색할 키워드 (없으면 최신 공지) | 선택      | "KNU" |

#### 응답 예시

```
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
```

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

#### 엔드포인트: `/notice/like/:id`

##### 메서드: `POST`

---

#### 설명

지정한 공지(`id`)에 대해 사용자의 이메일을 기반으로 좋아요를 처리합니다. 이미 좋아요한 사용자는 중복으로 좋아요할 수 없습니다. 한 번 누른 좋아요는 되돌릴 수 없습니다.

---

#### 요청 예시

```
POST /notice/like/224
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

- 이미 좋아요가 되어 있는 경우 (200 OK)

```
Status: 200
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

| 이름  | 설명                          |
| ----- | ----------------------------- |
| id    | 공지의 고유 ID (URL 파라미터) |
| email | 좋아요를 누르는 사용자 이메일 |

---

#### 엔드포인트: `/notice/deadline/:id`

##### 메서드: `GET`

---

#### 설명

특정 공지(`id`)의 시작일과 마감일 정보를 반환합니다. 추출할 수 없는 포맷의 공지이거나 마감일이 없는 공지의 경우 null을 반환합니다.

---

#### 요청 예시

```
GET /notice/deadline/224
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

| 이름  | 타입   | 설명                      | 필수 여부 | 예시               |
| ----- | ------ | ------------------------- | --------- | ------------------ |
| email | string | 등록할 사용자 이메일 주소 | 예        | `user@example.com` |
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
