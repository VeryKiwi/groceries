from tornado.ioloop import IOLoop
from tornado.web import url #constructs a URLSpec for you

from tornado.web import RequestHandler
from tornado.web import StaticFileHandler
from tornado.web import Application
from tornado.websocket import WebSocketHandler

from tornado.log import enable_pretty_logging

class BaseHandler (RequestHandler):
	def initialize(self, var):
		#init stuff!
		print( var )
		pass
	def get(self, num):
		self.write("this is "+num+"!")

class FormHandler (BaseHandler):
	def get(self):
		# / is relative
		self.write("""	<form action='/form' method='post'>
							<input type='text' name='thisistheonlyinput' />
							<input type='submit' value='Submit' />
						</form>
					""")
	def post(self):
		invar = self.get_body_argument("thisistheonlyinput")
		print( "going to post the input!"+invar )

# The WebSocket protocol is still in development. This module currently implements the hixie-76 and hybi-10 versions of the protocol. See this browser compatibility table on Wikipedia: http://en.wikipedia.org/wiki/WebSockets#Browser_support
class SocketHandler (WebSocketHandler):
        def open(self):
                print('websocket opened!')

        def on_message(self, message):
                print('got message: ' + message)
                
		# Check to ensure a command is received
		if "command" not in message:
			raise KeyError("Key 'command' is missing. Way to suck...")
		# Check the command received and proceed accordingly
		if message["command"] == "add meal":
			print 'add me'
		elif message["command"] == "edit meal":
			print 'edit me'
		elif message["command"] == "remove meal":
			print 'remove me'
                # send a message back
                self.write_message('ten four')

        def on_close(self):
                print('websocket closed')

def make_app():
	return Application(
		[
                        url('/mySocket', SocketHandler, {} , name = "mySocket!!!"),
                   	url('/form', FormHandler, { "var":"initialize this!" }, name = "forlorn"),
			url(r'/(.*)', StaticFileHandler, { "path":"../www/" }) # captures anything at all, and serves it as a static file. simple!
		],
		#settings
		debug = True,
	)


def main():
	enable_pretty_logging()
	application = make_app()
	application.listen(8243) # Groceries port
	#other stuff
	IOLoop.current().start()

if __name__ == "__main__": main()
