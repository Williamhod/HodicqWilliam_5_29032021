window.onload = () => {
    // Création de l'objet panier avec le cookie 'panier'
    let monApi = new Api('panier');
    let panier = monApi.getPanier();

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

 /***************************************************
     ** Modal- Confirmation de commande                *
     **************************************************/
    /**
     * TODO List
     * [ ] validation des champs
     * [ ] redirection apres validation des champs depuis le btn du modal
     * [ ] voir pour la génération de l'id de commande
     * [ ] X
     * [ ] X
     */

    /***************************************************
     ** Modification visuel du selecteur qualité       *
     **************************************************/

    /* let media_sm = false;
    
        // Modifie le contenu du selecteur qte
        function changeOptionContent() {
            // Si la taille de l'écran est plus petit que 500px
            if (window.matchMedia('(max-width: 766px)').matches) {
                // Sm
                if (!media_sm) {
                    // Si ce n'est pas déjà en sm
                    document.querySelector('.option-content-qte').textContent = 'Qté';
                    media_sm = true;
                }
            } else {
                // Default
                if (media_sm) {
                    // Si c'est en sm
                    document.querySelector('.option-content-qte').textContent = 'Quantité';
                    media_sm = false;
                }
            }
        }
        //// Appelle une fois la fonction au cas où l'écran soit sm
        //changeOptionContent();
        //// Lorsque la taille de l'écran est modifiée
        //window.addEventListener('resize', changeOptionContent);
        */