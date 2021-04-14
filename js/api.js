// recupération des données du ou des produits depuis l api
class Api {
    constructor(url) {
        this.url = url;

    }

    getProducts = () => {
        return new Promise((response) => {
            let request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    //this.status >= 200 && this.status < 400
                    if (this.statusText == 'OK') {
                        // Si tout se passe bien
                        response(JSON.parse(this.responseText));
                        console.log('Connected');
                    } else {
                        // Si tout va mal
                        console.error('Erreur : ' + this.statusText);
                    }
                }
            };
            request.open('get', this.url, true);
            request.send();
        });
    };

}

