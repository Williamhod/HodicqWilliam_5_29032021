// recupération des données du ou des produits depuis l api
class Api {
    constructor(cookieName, url = '') {
        this.url = url;
        this.cookieName = cookieName;
        // Créer le panier pour l'application
        this.panier = new Panier(cookieName, this.loadOptions());
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

    /**
     * Créer une promesse qui exécute une requete de connexion à
     * l'url choisit dans l'api et retourne une réponse.
     * Si la réponse a un statut 200, cela retourne un tableau
     * des produits, sinon cela ne retourne rien.
     * @returns {Promise} Promesse contenant le tableau des articles
     */
    getProducts = () => {
        return new Promise((resolve,reject) => {
            let request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    //if (this.statusText == 'OK') {
                    if (this.status == 200) {
                        // renvoi le tableau de produit
                        resolve(JSON.parse(this.responseText));
                    } else {
                        // renvoie la réponse de connexion si cela ne se connecte pas.
                        reject(this);
                    }
                }
            };
            request.open('get', this.url, true);
            request.send();
        });
    };

    
    loadOptions = () => {
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
                linknom: '#{{id}} h5 > a',
                image: '#{{id}} img',
                quantity: '#{{id}} #{{id}}_quantity',
                sousTotal: '#{{id}} #{{id}}_subtotal',
                btRemove: '#{{id}}_remove',
                total: '#cards_total',
            },
        };
    };
}
