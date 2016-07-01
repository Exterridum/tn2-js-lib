
export class CommonUtils {

    static processUrl(url, params) {
        for(let param in params) {
            url = url.replace("{" + param + "}", params[value]);
        }
        return url;
    }
}