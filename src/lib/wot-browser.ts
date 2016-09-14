/// <reference path="../../node_modules/@types/es6-promise/index.d.ts"/>
/// <reference path="../../node_modules/@types/es6-collections/index.d.ts"/>
/// <reference path="../../node_modules/@types/whatwg-fetch/index.d.ts"/>

import BrowserProtocolResolver from "../net/browser/resolver";
import {Resolver} from "../net/resolver";
import WebOfThings from "../impl/wot"

Resolver.register(new BrowserProtocolResolver());

export const Wot = new WebOfThings("http://tno2.net:8080/conas/dth-esp8266-1/");