window.onload = () => {
    // Options pour le panier
    let options = {
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

    // Création de l'objet panier avec le cookie 'panier'
    let panier = new Panier('panier', options);

    // TODO Ajouter un loader
    panier.setDisplayPanier();
    panier.display();

    // Variable pour contenir le bouton supprimer
    let bt_supprimer_target = null;
    // Se déclenche lorsque le modal s'ouvre
    $('#modalConfirmRemove').on('show.bs.modal', function (e) {
        // Stocke le bouton Supprimer sur lequel l'utilisateur a cliqué
        bt_supprimer_target = e.relatedTarget;
        // Récupère l'id de l'élément
        let id = panier.getPanierElementId('article', bt_supprimer_target.numberID());
        // Récupère les éléments du modal
        let article = $(e.target).find('#modal-body-article')[0];//le find permet de recherche parmis les enfants de e.target(le modal)
        let lentilles = $(e.target).find('#modal-body-lentilles')[0];
        // Modifie le contenue du modal
        article.textContent = panier.getPanierElement('nom', id).textContent;
        lentilles.textContent = panier.getPanierElement('lentilles', id).textContent;
    });

    $('#modalConfirmRemoveValid').on('click', function () {
        // Retire l'article du panier
        panier.removeProduit(bt_supprimer_target);
        // Réinitialise la variable contenant le bouton cliqué
        bt_supprimer_target = null;
    });
}