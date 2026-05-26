# chatgpt-import

ChatGPT 공식 데이터 export (`conversations.json`)를 파싱해서 OpenClaw이 읽을 수 있는 Markdown/JSON으로 변환합니다.

## 사용법

### 1. ChatGPT 대화 데이터 내보내기

1. [ChatGPT](https://chat.openai.com) → Settings → Data Controls → **Export Data**
2. 이메일로 받은 ZIP 파일에서 `conversations.json` 추출

### 2. 변환 실행

```bash
cd chatgpt-import

# Markdown으로 변환 (기본)
node src/cli.js <conversations.json경로>

# JSON으로 변환
node src/cli.js conversations.json --format json

# 특정 키워드 포함 대화만 필터링
node src/cli.js conversations.json --filter "docker"

# 출력 디렉토리 지정
node src/cli.js conversations.json --output ./my-exports
```

### 3. 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `-o, --output <dir>` | 출력 디렉토리 | `./output` |
| `-f, --format md\|json` | 출력 포맷 | `md` |
| `-k, --filter <keyword>` | 키워드 필터링 | (없음) |

### 출력 구조

```
output/
├── _index.json                  # 전체 대화 목록 (제목, 날짜, 메시지 수)
├── docker-네트워킹-질문.md      # 개별 대화 파일
├── typescript-제네릭-설명.md
└── ...
```

### 테스트

```bash
node --test src/parser.test.js
```

## 의존성

Node.js 18+ (외부 패키지 없음, 순수 Node.js)
