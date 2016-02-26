from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

class SimpleEcho(WebSocket):

    def handleMessage(self):
        # echo message back to client
        print 'message handeled'
        self.sendMessage('hey')

    def handleConnected(self):
        print self.address, 'connected'
        self.sendMessage('I am here')

    def handleClose(self):
        print self.address, 'closed'



class SocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
		print("WebSocket opened")
		fh = open("res/BvhHeaderSample_Gemma.txt","r")
		self.write_message(fh.read())
		fh.close()

    def on_message(self, message):
    	print 'message handeled'
        if message == '$GETFRAMES1$':
			print 'sending frames'
			msg = ''
			msg += '$FRAMES$1$\n'
			fh = open("res/BvhFramesSample_Gemma.txt","r")
			for i in range(1,500):
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