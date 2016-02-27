import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web


class SocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
		print("WebSocket opened")
		fh = open("res/BvhHeaderSample_Gemma.txt","r")
		self.write_message(fh.read())
		fh.close()

    def on_message(self, message):
    	print 'message handeled'
        if message == '$GETFRAMES1$':
			print 'sending frames1'
			msg = ''
			msg += '$FRAMES$1$\n'
			fh = open("res/BvhFramesSample_Gemma.txt","r")
			for i in range(1,450):
				msg+=fh.readline()
			fh.close()
			self.write_message(msg);
        if message == '$GETFRAMES2$':
            print 'sending frames2'
            msg = ''
            msg += '$FRAMES$2$\n'
            fh = open("res/BvhFramesSample_Gemma.txt","r")
            for i in range(1,1000):
                fh.readline()
            for i in range(1,20):
                msg+=fh.readline()
            fh.close()
            self.write_message(msg);
        if message == '$GETFRAMES3$':
            print 'sending frames3'
            msg = ''
            msg += '$FRAMES$3$\n'
            fh = open("res/BvhFramesSample_Gemma.txt","r")
            for i in range(1,3000):
                fh.readline()
            for i in range(1,800):
                msg+=fh.readline()
            fh.close()
            self.write_message(msg);

    def on_close(self):
        print("WebSocket closed")

    def check_origin(self, origin):
    	return True

app = tornado.web.Application([
    (r'/', SocketHandler),
])

if __name__ == "__main__":

	# server = SimpleWebSocketServer('', 6869, SimpleEcho)
	# server.serveforever()
	http_server = tornado.httpserver.HTTPServer(app)
	http_server.listen(6869)
	tornado.ioloop.IOLoop.instance().start()