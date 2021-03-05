export class InterfaceLoader {
    constructor() {
        this.main = document.querySelector('#display');
    }

    load(url) {
        return new Promise((resolve, reject) => {
            var http = new XMLHttpRequest();
            http.onreadystatechange = () => {
                if (http.readyState == 4 && http.status == 200) {
                    let response = http.response.body.innerHTML;

                    // Suppréssion de toutes les balises script et les commentaires
                    response = response.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    response = response.replace(/<!--.*-->/gi, '')

                    this.main.innerHTML = response;
                    resolve();
                }
                else if (http.readyState == 4 && http.status != 200) reject(http);
            };

            http.open('GET', url, true);
            http.responseType = 'document';
            http.send();
        })
    }
}