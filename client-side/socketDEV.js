// Define websocket to be used for server interaction

class Socket { // manually extend WebSocket, because WebSocket didn't want to use "super"

	constructor(serverClass) {
		console.log('construct socket')
		/*try {
			this.ws = new WebSocket("ws://{{host}}/mySocket")
		} catch (evt) {
			alert('Failed to create websocket. Check your internet connection and reload to try again.')
		}*/
		//this.ws.socket = this
		this.serverClass = serverClass
		// NOTE: below function moved to dedicated method onmessage below...
		/*this.ws.onmessage = function(event) {
			console.log('ws.onmessage')
			let inData = JSON.parse(event.data)
			this.socket.serverClass.receiveData(inData)
		}*/
		// Once the socket is successfully open, try to login
		//this.ws.onopen = function(event) {
		//	console.log('ws.onopen')
		//	this.socket.serverClass.onopen(this.socket)
			// but since we don't have to wait for the socket to open anymore we can just connect it immediately
		this.serverClass.onopen(this)
		//}
		// If the websocket closes (unexpectedly, since we never want it to close), then show error
		/*this.ws.onclose = function(evt) {
			console.log('ws.onclose')
			if (evt.code == 3001) {
				alert('Websocket closed with code 3001.')
			} else {
				alert('A websocket connection error caused the websocket to close. You may no longer be connected to the internet. Your most recent change may not be saved. You will need to reload in order for future changes to be saved.')
			}
		}*/
		// If the websocket errors, then show error
		/*this.ws.onerror = function(evt) {
			console.log('ws.onerror')
			console.log('Websocket error. Error object: ' + evt)
		}*/
	}

	// Send data through websocket
	send(outData) {
		console.log('socket.js : send')
		// outData : object to be translated into a string for websocket transfer
		//let outDataStr = JSON.stringify(outData)
		//this.ws.send(outDataStr)
		// Send the message over HTTP
		let payload = {
			method: 'PUT',
			headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			body: JSON.stringify(outData),
		}
		fetch('http://learnnation.org:8244/mySocket', payload).then(this.onmessage)
		console.log('completed get request')
	}

	// React to response from server
 	onmessage(response) {
		console.log('onmessage')
		console.log('response:')
		console.log(response)
		let inData = JSON.parse(response.data)
		console.log('inData:')
		console.log(inData)
		this.serverClass.receiveData(inData)
	}
}

