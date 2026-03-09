"""간단한 파이썬 HTTP 서버

이 스크립트를 실행하면 현재 디렉터리(`portfolio`)를 기준으로
정적 파일을 8000번 포트에서 서빙합니다. 브라우저에서
`http://localhost:8000`으로 접속하면 index.html이 열립니다.
"""

import http.server
import socketserver

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    pass

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Shutting down server")
            httpd.server_close()
