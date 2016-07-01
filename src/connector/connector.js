import CommonUtils from '../utils'

export class Connector {
    constructor(url, protocol) {
        this._url = url;
        this._protocol = protocol;
    }

    _assembleUrl(uri) {
        return this._url + uri;
    }

    _assembleAndProcess(uri, params) {
        CommonUtils.processUrl(this._assembleUrl(uri), params);
    }
}