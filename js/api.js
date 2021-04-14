// recupération des données du ou des produits depuis l api
class Api {
    constructor(cookieName, url = '') {
        this.url = url;
        this.cookieName = cookieName;
        // Créer le panier pour l'application
        this.panier = new Panier(cookieName, this.getOptionsPanier());
    }

    getPanier = () => {
        return this.panier;
    };

    setUrl = (newUrl) => {
        this.url = newUrl;
    };

    getUrl = () => {
        return this.url;
    }

    getProducts = () => {
        return new Promise((response) => {
            let request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    //if (this.statusText == 'OK') {
                    if (this.status == 200) {
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

    getOptionsPanier = () => {
        return {
            // les élèments a voir quand le panier contient un article
            elemsBasketFull: [
                'order-title',
                'order-total',
                'order-modal-container',
                'order-alert-contentfull',
                'order-alert-title',
            ],
            // Les éléments à masquer lorsque le panier est vide
            elemsBasketEmpty: ['basket-empty', 'order-alert-contentempty'],
            // L'élément parent des éléments
            elemsParentId: '#list_cards',
            // Id distingant les éléments entre eux
            elemsIds: 'cards_{{i}}',
            // prettier-ignore
            elemsBasket: {
                idProduit: '#{{id}} #{{id}}_id',
                lentilles: '#{{id}} #{{id}}_lenses',
                prix: '#{{id}} #{{id}}_price',
                nom: '#{{id}} h5',
                image: '#{{id}} img',
                quantity: '#{{id}} #{{id}}_quantity',
                sousTotal: '#{{id}} #{{id}}_subtotal',
                btRemove: '#{{id}}_remove',
                total: '#cards_total',
            },
        };
    };
}
