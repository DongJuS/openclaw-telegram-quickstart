# OpenClaw Telegram Quickstart

> 5분 만에 AI 텔레그램 챗봇 만들기

Docker와 [OpenClaw](https://github.com/openclaw/openclaw)를 사용해서 나만의 AI 텔레그램 봇을 만드는 퀵스타트 가이드입니다. Clone하고, 토큰만 넣으면 바로 동작합니다.

## 사전 준비

| 항목 | 설명 |
|------|------|
| **Docker** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치 후 실행 중이어야 합니다 |
| **Telegram** | Telegram 앱이 설치되어 있어야 합니다 |
| **AI 인증** | 아래 두 가지 방법 중 택 1 |

### AI 인증 방법 선택

| 방법 | 설명 | 비용 | 난이도 |
|------|------|------|--------|
| **A. API 키** | OpenAI/Anthropic/Gemini 등의 API 키 사용 | API 사용량만큼 과금 | 쉬움 |
| **B. ChatGPT OAuth** | ChatGPT 계정으로 브라우저 로그인 | ChatGPT 구독 요금만 | 약간의 추가 셋업 |

---

## 방법 A: API 키로 시작하기 (권장)

가장 간단한 방법입니다. API 키만 있으면 됩니다.

### 1단계: 레포 클론

```bash
git clone https://github.com/DongJuS/openclaw-telegram-quickstart.git
cd openclaw-telegram-quickstart
```

### 2단계: 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 **두 가지**만 수정하세요:

```env
# Telegram 봇 토큰 (@BotFather에서 발급)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# AI API 키 (기본: OpenAI)
OPENAI_API_KEY=sk-your-actual-key-here
```

<details>
<summary><strong>Telegram 봇 토큰 발급 방법</strong></summary>

1. Telegram에서 [@BotFather](https://t.me/BotFather)를 검색합니다
2. `/newbot` 명령을 입력합니다
3. 봇 이름을 입력합니다 (예: `My AI Assistant`)
4. 봇 사용자명을 입력합니다 (예: `my_ai_assistant_bot`) - `_bot`으로 끝나야 합니다
5. 발급된 토큰을 복사합니다 (형식: `123456789:ABCdefGHI...`)

</details>

### 3단계: 실행

```bash
docker compose up -d
```

끝! Telegram에서 봇에게 메시지를 보내보세요.

---

## 방법 B: ChatGPT OAuth로 시작하기

ChatGPT Plus/Free 계정을 사용해서 별도의 API 키 없이 봇을 운영하는 방법입니다. ChatGPT 계정으로 브라우저 로그인한 credential을 Docker 컨테이너에 전달합니다.

### 1단계: 레포 클론

```bash
git clone https://github.com/DongJuS/openclaw-telegram-quickstart.git
cd openclaw-telegram-quickstart
```

### 2단계: OpenClaw CLI 설치 및 ChatGPT 로그인

먼저 로컬에 OpenClaw CLI를 설치하고 ChatGPT OAuth 인증을 완료합니다:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts
node --version
npm install -g openclaw
which openclaw
openclaw onboard

```

브라우저에서 ChatGPT 계정으로 로그인하면 credential이 `~/.openclaw/credentials/`에 저장됩니다.

### 3단계: Credential 복사

인증 정보를 Docker가 읽을 수 있도록 config 폴더에 복사합니다:

```bash
cp -r ~/.openclaw/credentials/ ./config/credentials/
```

### 4단계: Config 교체

ChatGPT OAuth용 config로 교체합니다:

```bash
cp examples/openclaw.chatgpt-oauth.json config/openclaw.json
```

### 5단계: 환경 변수 설정

```bash
cp .env.example .env
```
``` X단계 : 안된다면
• 지금 원인은 거의 확정이야.

  auth-profiles.json에는 openai-codex OAuth가 정상으로 들어갔는데, 실제 Codex app-server가 보는 파일은 아
  직 없음:
  openclaw models auth login --provider openai-codex --method device-code --set-default
  openclaw gateway restart

  openclaw tui
  ~/.openclaw/agents/main/agent/codex-home/auth.json

  그래서 OpenClaw 모델 상태는 정상처럼 보이지만, 실행 시점에는 여전히 Failed to extract accountId from
  token이 납니다.

  터미널에서 이거 실행해:

  mkdir -p ~/.openclaw/agents/main/agent/codex-home
  cp ~/.codex/auth.json ~/.openclaw/agents/main/agent/codex-home/auth.json
  chmod 600 ~/.openclaw/agents/main/agent/codex-home/auth.json
  openclaw gateway restart

  openclaw tui
```

```token access json file
Get-Content $env:USERPROFILE\.openclaw\openclaw.json
```


`.env`에서 Telegram 봇 토큰만 수정하세요. **AI API 키는 필요 없습니다:**

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# AI API 키는 주석 처리 (ChatGPT OAuth 사용)
# OPENAI_API_KEY=
```

### 6단계: 실행

```bash
docker compose up -d
```

Telegram에서 봇에게 메시지를 보내보세요!

### OAuth 토큰 갱신

ChatGPT OAuth 토큰은 일정 기간 후 만료됩니다. 만료 시:

```bash
# 재로그인
openclaw login openai-codex

# credential 다시 복사
cp -r ~/.openclaw/credentials/ ./config/credentials/

# 재시작
docker compose restart
```

---

## 작동 확인

```bash
# 컨테이너 상태 확인 (healthy가 보이면 정상)
docker compose ps

# 게이트웨이 헬스체크
curl http://localhost:18789/healthz

# 로그 확인 (Telegram 연결 상태)
docker compose logs --tail 20
```

정상 로그 예시:
```
[gateway] ready (... plugins: telegram; ...)
[telegram] [default] starting provider (@your_bot_name)
```

## AI 모델 변경

기본 모델은 **OpenAI gpt-4o-mini** (방법 A) 또는 **OpenAI Codex gpt-4o** (방법 B)입니다.

### Provider 비교

| Provider | 모델 | 인증 방식 | 비고 |
|----------|------|-----------|------|
| **OpenAI** | gpt-4o-mini | API 키 (`OPENAI_API_KEY`) | 가장 저렴 |
| **OpenAI Codex** | gpt-4o | ChatGPT OAuth (브라우저 로그인) | API 키 불필요 |
| **Anthropic** | Claude Sonnet 4.6 | API 키 (`ANTHROPIC_API_KEY`) | 고품질 응답 |
| **Google** | Gemini 2.0 Flash | API 키 (`GEMINI_API_KEY`) | 빠른 응답 |
| **OpenRouter** | 여러 모델 | API 키 (`OPENROUTER_API_KEY`) | 하나의 키로 다양한 모델 |

### 변경 방법

1. `.env`에서 사용할 provider의 API 키 주석을 해제합니다
2. `examples/` 폴더에서 원하는 config를 복사합니다:

```bash
# ChatGPT OAuth 사용 시
cp examples/openclaw.chatgpt-oauth.json config/openclaw.json

# Anthropic Claude 사용 시
cp examples/openclaw.anthropic.json config/openclaw.json

# Google Gemini 사용 시
cp examples/openclaw.gemini.json config/openclaw.json

# OpenRouter 사용 시
cp examples/openclaw.openrouter.json config/openclaw.json
```

3. 재시작합니다:

```bash
docker compose restart
```

## Control UI

브라우저에서 OpenClaw 웹 UI에 접근할 수 있습니다:

```
http://localhost:18789
```

로그인 시 Gateway Token을 입력하세요 (`.env`의 `OPENCLAW_GATEWAY_TOKEN` 값, 기본: `quickstart-token`).

Control UI에서 할 수 있는 것:
- 봇과 실시간 채팅
- 채널 상태 확인
- 설정 변경

## 문제 해결

### Docker가 실행되지 않음

```
Cannot connect to the Docker daemon
```

Docker Desktop 앱을 실행하세요. Linux의 경우:
```bash
sudo systemctl start docker
```

``` docker에서 실행하기 위해서 진행.
  mkdir -p docker/openclaw

  cat > docker/openclaw/Dockerfile <<'EOF'
  FROM node:24-bookworm-slim

  RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates ripgrep python3 \
    && rm -rf /var/lib/apt/lists/*

  RUN npm install -g openclaw

  WORKDIR /workspace
  EXPOSE 18789

  CMD ["openclaw", "gateway", "--port", "18789", "--bind", "lan"]
  EOF

  docker build -t openclaw-image -f docker/openclaw/Dockerfile .

  openclaw gateway stop

  docker run -it --name openclaw-docker-version \
    -p 127.0.0.1:18789:18789 \
    -v "$HOME/.openclaw:/root/.openclaw" \
    -v "$HOME/.codex:/root/.codex:ro" \
    -v "/mnt/c/Users/didsu/workspace/openclaw:/workspace" \
    -w /workspace \
    openclaw-image

  인증 파일 복사:

  mkdir -p ~/.openclaw/agents/main/agent/codex-home
  cp ~/.codex/auth.json ~/.openclaw/agents/main/agent/codex-home/auth.json
  chmod 600 ~/.openclaw/agents/main/agent/codex-home/auth.json

  컨테이너 안으로 진입:

  docker exec -it openclaw-docker-version bash

  컨테이너 안에서 플러그인 설치/복구:

  apt-get update
  apt-get install -y python3

  openclaw plugins install @openclaw/codex --force

  필요 시 반쯤 설치된 폴더 제거 후 재설치:

  rm -rf /root/.openclaw/npm/node_modules/@openclaw/codex
  openclaw plugins install @openclaw/codex

  소유권 문제 해결:

  chown -R root:root /root/.openclaw/npm/node_modules/@openclaw

  플러그인 확인:

  openclaw plugins list
```

### 봇이 메시지에 응답하지 않음

1. 토큰이 유효한지 확인:
```bash
# .env의 토큰으로 직접 확인
source .env
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe"
```

```
OPENCLAW : ACCESS NOT CONFIGURED MY USER ID : XXXX PAIRING CODE, ASK THE BOT OWNER TO
  APPROVE PAIRING APPROVE TELEGRAM ....
openclaw pairing approve telegram HQMKSTFL
```

2. 컨테이너 로그 확인:
```bash
docker compose logs --tail 50
```

3. 재시작:
```bash
docker compose restart
```

### ChatGPT OAuth 인증 실패

```
OpenAI Codex OAuth refresh returned no credentials
```

OAuth 토큰이 만료되었습니다:
```bash
openclaw login openai-codex
cp -r ~/.openclaw/credentials/ ./config/credentials/
docker compose restart
```

### 포트 충돌 (18789 사용 중)

```bash
# 어떤 프로세스가 포트를 사용 중인지 확인
lsof -i :18789

# 다른 포트 사용: .env에 추가
echo "OPENCLAW_PORT=28789" >> .env
docker compose up -d
```

```envDP 토큰을 안넣었을떄.
  $env:TG_TOKEN="123213:ABCDASDFASDFDAGFAD"

  docker stop openclaw-docker-version
  docker rm openclaw-docker-version

  docker run -d `
    --name openclaw-docker-version `
    -p 127.0.0.1:18789:18789 `
    -e TELEGRAM_BOT_TOKEN="$env:TG_TOKEN" `
    -v "C:\Users\didsu\workspace\openclaw:/workspace" `
    -v "$env:USERPROFILE\.openclaw:/root/.openclaw" `
    -v "$env:USERPROFILE\.codex:/root/.codex:ro" `
    openclaw-image `
    openclaw gateway --port 18789 --bind lan

  바로 확인하려면 이어서 이것도 실행하세요.

  docker exec openclaw-docker-version sh -lc "printenv | grep TELEGRAM"
  docker logs -f openclaw-docker-version
```

### WSL2에서 Telegram 연결 실패

Windows WSL2 환경에서 DNS/IPv6 문제가 발생할 수 있습니다. `.env`에 추가:
```env
OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY=1
```

## 정리

```bash
# 중지 및 컨테이너 제거
docker compose down

# 데이터까지 완전 삭제
docker compose down -v
```

## 그룹 채팅에서 사용

봇을 Telegram 그룹에 초대하면 그룹에서도 사용할 수 있습니다.
기본 설정: 그룹에서는 **봇을 멘션**해야 응답합니다 (`@your_bot_name 질문`).

## 다음 단계

- [OpenClaw 공식 문서](https://docs.openclaw.ai)
- [Telegram 채널 설정 가이드](https://docs.openclaw.ai/channels/telegram)
- [Discord/Slack 등 다른 채널 추가](https://docs.openclaw.ai/channels)
- [AI 에이전트 커스터마이징](https://docs.openclaw.ai/agents)
- [GitHub: openclaw/openclaw](https://github.com/openclaw/openclaw)

## License

MIT
