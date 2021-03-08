export class InterfaceLoader {
    constructor() {
        this.main = document.querySelector('#display');
        this.interfaces = [];
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

                const gui = this.main.appendChild(parser.parseFromString(response, 'text/html').body.firstChild);
                gui.style.display = "none";
                this.interfaces.push(gui);
                resolve(this.interfaces[this.interfaces.length - 1]);
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

    show(gui) {
        if(!this.interfaces.filter(child => gui == child).length) throw `L'interface à charger est inexistante !`;

        this.interfaces.forEach(child => {
            child.style.display = 'none';
        })

        gui.style.display = 'block';
    }
}