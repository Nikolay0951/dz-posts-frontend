export default class Http {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    getRequest(url, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${this.baseUrl}${url}`);
        xhr.addEventListener('load', (evt) => {
            if (evt.currentTarget.status >= 200 && evt.currentTarget.status < 300) {
                onSuccess(evt);
                return;
            }
            onError(evt);
            console.log(evt);
        });
        xhr.addEventListener('error', onError);
        xhr.send();
    }
    postRequest(url, onSuccess, onError, body, headers) {
        // if(data===null)
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${this.baseUrl}${url}`);
        for (const header of headers) {
            xhr.setRequestHeader(header.name, header.value);
        }
        xhr.addEventListener('load', (evt) => {
            if (evt.currentTarget.status >= 200 && evt.currentTarget.status < 300) {
                onSuccess(evt);
                return;
            }
            onError(evt);
            console.log(evt);
        });
        xhr.addEventListener('error', onError);
        xhr.send(body);
    }
    deleteRequest(url, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `${this.baseUrl}${url}`);
        xhr.addEventListener('load', (evt) => {
            if (evt.currentTarget.status >= 200 && evt.currentTarget.status < 300) {
                onSuccess(evt);
                return;
            }
            onError(evt);
            console.log(evt);
        });
        xhr.addEventListener('error', onError);
        xhr.send();
    }
}