// Define websocket to be used for server interaction

class Socket { // manually extend WebSocket, because WebSocket didn't want to use "super"

	constructor(serverClass) {
		try {
			this.ws = new WebSocket("ws://{{host}}/mySocket")
		} catch (evt) {
			alert('Failed to create websocket. Check your internet connection and reload to try again.')
		}
		this.ws.socket = this
		this.serverClass = serverClass
		this.ws.onmessage = function(event) {
			let inData = JSON.parse(event.data)
			this.socket.serverClass.receiveData(inData)
		}
		// Once the socket is successfully open, try to login
		this.ws.onopen = function(event) {
			this.socket.serverClass.onopen(this.socket)
		}
		// If the websocket closes (unexpectedly, since we never want it to close), then show error
		this.ws.onclose = function(evt) {
			if (evt.code == 3001) {
				alert('Websocket closed with code 3001.')
			} else {
				alert('A websocket connection error caused the websocket to close. You may no longer be connected to the internet. Your most recent change may not be saved. You will need to reload in order for future changes to be saved.')
			}
		}
		// If the websocket errors, then show error
		this.ws.onerror = function(evt) {
			console.log('Websocket error. Error object: ' + evt)
		}
	}

	// Send data through websocket
	send(outData) {
		// outData : object to be translated into a string for websocket transfer
		let outDataStr = JSON.stringify(outData)
		this.ws.send(outDataStr)
	}
}

