import http.server, ssl

server_address = ('172.16.1.168', 8009)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, server_side=True, certfile='localhost.pem', keyfile='localhost-key.pem',
                               ssl_version=ssl.PROTOCOL_TLSv1_2)
httpd.serve_forever()