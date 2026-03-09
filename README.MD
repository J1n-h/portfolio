웹페이즈 형식의 포트폴리오
정보: 선린인터넷고등학교 1학년 이진헌
Firestore Database를 이용하여 웹사이트를 제작
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDN2tvyH9yzCFtcAuzUWQYTuA4g6s_bCj8",
    authDomain: "portfolio-6fded.firebaseapp.com",
    projectId: "portfolio-6fded",
    storageBucket: "portfolio-6fded.firebasestorage.app",
    messagingSenderId: "365358771894",
    appId: "1:365358771894:web:6fd6cdd1745a3f346bc017"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

어떤 일이 있어도 원본 MD 파일은 훼손하지 않는다.

## 서버 접근 안내

포트폴리오를 다른 사람이 볼 수 있도록 하려면 다음과 같은 방법을 사용하세요:

1. **로컬 네트워크** – 서버는 기본적으로 `0.0.0.0`(모든 인터페이스)에 바인딩됩니다. 같은 LAN에 연결된 다른 기기에서는 호스트 PC의 IP와 포트 8000을 통해 접속할 수 있습니다. 예: `http://192.168.0.5:8000`.

2. **공용 인터넷** – 외부에서 접속하려면:
   * 라우터에서 포트포워딩(8000)을 설정하거나
   * [ngrok](https://ngrok.com) 같은 터널링 도구를 사용해 일시적으로 URL을 생성하세요:
     ```sh
     ngrok http 8000
     ```
   그러면 ngrok이 제공하는 공개 주소를 다른 사람에게 알려줄 수 있습니다.

3. **클라우드에 배포** – GitHub Pages, Netlify, Vercel 같은 정적 호스팅 서비스를 사용하면 별도의 서버 없이 공개 호스팅이 가능합니다.

이제 다른 사람도 네트워크를 통해 포트폴리오를 열람할 수 있습니다.

## GitHub로 배포하기

포트폴리오 저장소를 만든 뒤 GitHub Pages를 이용하면 별도의 서버 없이도 공개할 수 있습니다:

1. GitHub에 새 리포지토리(예: `portfolio`)를 생성하고 로컬 프로젝트를 커밋 & 푸시하세요.
   ```sh
   git init
   git add .
   git commit -m "initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<username>/portfolio.git
   git push -u origin main
   ```
2. 리포지토리의 **Settings > Pages** 섹션으로 이동합니다.
3. **Source**를 `main` 브랜치, `/ (root)` 폴더로 설정하고 저장합니다.
4. 몇 분 뒤 `https://<username>.github.io/portfolio/` 형태의 URL이 활성화됩니다.
5. Firestore처럼 외부 API를 사용하는 경우, 클라이언트 키가 공개되므로 주의하세요.

GitHub Pages는 정적 파일만 서빙하기 때문에 `server.py`는 필요 없습니다. CSS, JS, HTML을 수정하고 커밋 & 푸시하면 즉시 반영됩니다.