import Protocol from "../net/protocol";

export class EnumUtils {

}

export class UriUtils {

    public static getProtocolFromUri(href: string) : any {
        let splitHref = href.split(":");
        if(splitHref.length < 2) {
            return null;
        }        
        let protocolStr = splitHref[0];           
        for(let p in Protocol) {
            if(p.toLowerCase() == protocolStr.toLowerCase()) {
                return Protocol[p];
            }    
        }
    }

    public static assembleUri(...parts: string[]) : string {
        return null;
    }

    public static getUrisMap(hrefs: Array<string>): Map<Protocol, string> {
        let result = new Map<Protocol, string>();
        if(!hrefs) {
            return result;
        }

        for(let href of hrefs) {
            let protocol = this.getProtocolFromUri(href);
            if(protocol != null) {                
              result.set(this.getProtocolFromUri(href), href);
            }    
        }
        return result;
    }
} 

export class CommonUtils {

    public static exists(obj: any) : boolean {
        return obj !== undefined && obj !== null;
    }
}

export class StringUtils {

    public static isEmpty(str: string) : boolean {
        return str === undefined || str == null || str.length == 0; 
    }
}