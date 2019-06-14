import * as fetch from "isomorphic-fetch";

export function fetchCircuits() {
    return fetch( "https://api.github.com/repos/jasonboy/wechat-jssdk/branches" )
        .then(res => res.json())
        .then(res => res);
}
