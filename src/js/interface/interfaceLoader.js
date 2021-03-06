export class InterfaceLoader {
    constructor() {
        this.main = document.querySelector('#display');
    }

    load(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response => response.text())
            .then(text => {
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(text, "text/html");
                let response = htmlDocument.body.innerHTML;

                // Suppréssion de toutes les balises script et les commentaires
                response = response.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                response = response.replace(/<!--.*-->/gi, '')

                this.main.innerHTML = response;
                resolve();
            })
            .catch(error => reject(error));

            // http.onreadystatechange = () => {
            //     if (http.readyState == 4 && http.status == 200) {
            //         let response = http.response.body.innerHTML;

            //         // Suppréssion de toutes les balises script et les commentaires
            //         response = response.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            //         response = response.replace(/<!--.*-->/gi, '')

            //         this.main.innerHTML = response;
            //         resolve();
            //     }
            //     else if (http.readyState == 4 && http.status != 200) reject(http);
            // };

            // http.open('GET', url, true);
            // http.responseType = 'document';
            // http.send();
        })
    }
}