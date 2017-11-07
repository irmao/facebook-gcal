class RequestService {
    static postJson(url, jsonObject) {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonObject)
        };

        return fetch(url, options);
    }

    static get(url) {
        const options = {
            method: 'GET'
        };

        return fetch(url, options);
    }
}

export default RequestService;