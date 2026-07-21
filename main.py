import http.server
import socketserver
import webbrowser
import os

PORT = 8000


class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()


def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print("сайт запущен!")
        print(f"открывай в браузере: http://localhost:{PORT}")
        print("нажми Ctrl+C, чтобы остановить сервер")
        webbrowser.open(f"http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nсервер остановлен. хорошего свидания!")


if __name__ == "__main__":
    run_server()
