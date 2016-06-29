
function handleOpen() {

}

function handleClose() {

}

function handleMessage(message) {

}

function iniWebsocket(connector, url) {
    let ws = new WebSocket(conf);
    ws.onopen = handleOpen;
    ws.onclose = handleClose;
    ws.onmessage = handleMessage;
}


export class WebSocketConnection {

    constructor(url) {
        this._url = url;
        this._ws = ws;
        this._isOpen = true;
    }

    _send(message) {
        if(this._isOpen) {
            this._ws.send(message);
        }
    }

    publish(endpoint, value) {
        return new Promise((resolve, reject) => {

        })
    }

    subscribe(endpoint, callback) {
        return new Promise(() => {

        })
    }
}
