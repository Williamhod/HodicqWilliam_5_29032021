window.onload = () => {
    /**********************************************************************
     ** New prototypes                                                    *
     **********************************************************************/
    HTMLElement.prototype.show = function () {
        this.classList.remove('d-none');
        this.classList.add('d-flex');
    };

    HTMLElement.prototype.hide = function () {
        this.classList.add('d-none');
        this.classList.remove('d-flex');
    };

    /**********************************************************************
     ** HOME - réalisation des cartes par l'appel de la fonction loadPage *
     **********************************************************************/
    // permet d'initialiser l'affichage des prix
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(price / 100);
    };

    const createCard = async (i, camera) => {
        console.log('Function', 'createCard()');
        // Id de l'article (dans le code)
        let id = 'cards_' + i;

        // prettier-ignore
        let template =
    '<form action="#" method="GET" id="' + id + '_form">\
        <input type="hidden" value="" name="id" id="' + id + '_id" />\
        <img src="" class="card-img-top card-img-index" alt="" />\
        <div class="card-body">\
            <h5 class="card-title"></h5>\
            <p class="card-text unstretched-link"></p>\
            <ul class="list-group list-group-flush">\
                <li class="list-group-item unstretched-link" id="' + id + '_rate" >Prix : </li>\
                <li class="list-group-item">\
                    <select class="form-select inputGroupSelect01 unstretched-link" id="' + id + '_lenses">\
                    <option value="" selected>Lentilles</option>\
                    </select>\
                <li class="list-group-item">\
                    <select class="form-select inputGroupSelect02 unstretched-link" id="' + id + '_quantity">\
                        <option value="0" selected>Quantité</option>\
                        <option value="1">1</option>\
                        <option value="2">2</option>\
                        <option value="3">3</option>\
                        <option value="4">4</option>\
                        <option value="5">5</option>\
                    </select>\
                </li>\
            </ul>\
            <span id="' + id + '_select-error" class="text-danger d-none">Veuillez sélectionner une valeur</span>\
            <div class="row ">\
                <div class="col-auto text-left">\
                    <input type="submit" class="unstretched-link btn btn-success" value="Ajouter au panier" />\
                </div>\
                <div class="col-auto text-right position-static">\
                    <a href="#" class="stretched-link btn btn-info" id="' + id + '_link">Détails</a>\
                </div>\
            </div>\
        </div>\
     </form>';

        // Création de l'article
        let div = document.createElement('div');
        div.id = id;
        div.classList.add('card', 'mb-4', 'mx-2', 'border-0', 'shadow');
        div.innerHTML = template;
        document.querySelector('#list_cards').appendChild(div);

        document.querySelector(`#${id} #${id}_id`).value = camera._id;

        //let img = document.querySelector('#' + id + ' img');
        let img = document.querySelector(`#${id} img`);
        // TODO Remettre après
        //img.src = camera.imageUrl; // Récupération des données en mettant la fonction + le nom attribué dans l'api
        img.src = 'images/vcam_' + (i + 1) + '.jpg';
        img.alt = camera.name;

        //let name = document.querySelector('#' + id + ' h5');
        let name = document.querySelector(`#${id} h5`);
        name.textContent = camera.name;

        //let description = document.querySelector('#' + id + ' p');
        let description = document.querySelector(`#${id} p`);
        description.textContent = camera.description;

        let lenses = document.querySelector(`#${id} #${id}_lenses`);
        // Création d'une boucle pour extrapoler les valeurs du tableau lenses (de l'api) afin de les afficher à l'unité
        for (let lense of camera.lenses) {
            lenses.innerHTML += `<option value="${lense}">${lense}</option>`;
        }

        let prix = document.querySelector(`#${id} #${id}_rate`);
        prix.textContent += formatPrice(camera.price);

        let link = document.querySelector(`#${id} #${id}_link`);
        link.href = 'produit.html?id=' + camera._id;

        // Ajout de l'evenement sur le bouton Ajouter au panier
        document.querySelector(`#${id} #${id}_form`).addEventListener('submit', setPanier);
    };

    /****************************************************************************************
     ** Produit - Implantation des données dans la carte par l'appel de la fonction loadPage  *
     ****************************************************************************************/
    const editCard = async (i, camera) => {
        console.log('Function', 'editCard()');
        // Id de l'article (dans le code)
        let id = 'cards_' + i;
        let img = document.querySelector(`#product-img`);
        // TODO Remettre après
        //img.src = camera.imageUrl;
        img.src = 'images/vcam_' + (i + 1) + '.jpg';
        img.alt = camera.name;

        document.querySelector(`#${id}_id`).value = camera._id;

        let name = document.querySelector(`#product-name`);
        name.textContent = camera.name;

        let description = document.querySelector(`#product-description`);
        description.textContent = camera.description;

        let lenses = document.querySelector(`#${id}_lenses`);
        // Création d'une boucle pour extrapoler les valeurs du tableau lenses (de l'api) afin de les afficher à l'unité
        for (let lense of camera.lenses) {
            lenses.innerHTML += `<option value="${lense}">${lense}</option>`;
        }

        let prix = document.querySelector(`#product-price`);
        prix.textContent += formatPrice(camera.price);

        document.querySelector(`#${id}_form`).addEventListener('submit', setPanier);
    };

    /***************************************************
     ** API                                            *
     **************************************************/

    // recupération des données du ou des produits depuis l api
    const getProducts = (url) => {
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
            request.open('get', url, true);
            request.send();
        });
    };

    // le i permet d avoir l'indice de l article.
    let i = 0;
    // la fonction loadPage a ces données mise dans la fonction camera.
    const loadPage = (cameras) => {
        console.log('Function', 'loadPage()');
        console.log(cameras);
        // Double la quantité de cameras pour les tests
        //cameras.push(...cameras);

        if (Array.isArray(cameras)) {
            for (let camera of cameras) {
                createCard(i, camera);
                i++;
            }
        } else {
            console.log('card avec info id item');
            // Une seule camera
            editCard(i, cameras);
        }
    };

    let datas = {};
    const loadDatas = async () => {
        console.log('Function', 'loadDatas()');
        // Récupère les params get pour l'id de l'objet afin d'avoir une fiche produit
        var $_GET = [];
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (a, name, value) => {
            $_GET[name] = value;
        });

        // Définit l'url + id produit (si page produit)
        let url = 'cameras_sauvegarde.json';

        // recuperation des données de l api pour les mettre dans la fonction loadPage
        datas = await getProducts(url);
        if (typeof $_GET['id'] !== 'undefined') {
            datas.forEach((val) => {
                if (val['_id'] == $_GET['id']) {
                    datas = val;
                    return;
                }
            });
        }
        loadPage(datas);
    };

    const loadDatasSave = async () => {
        console.log('Function', 'loadDatas()');
        // Récupère les params get pour l'id de l'objet afin d'avoir une fiche produit
        var $_GET = [];
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (a, name, value) => {
            $_GET[name] = value;
        });

        // Définit l'url + id produit (si page produit)
        let url = 'http://localhost:3000/api/cameras/';
        // Si un param product existe, on ajoute l'id du produit
        if (typeof $_GET['id'] !== 'undefined') {
            url += $_GET['id'];
        }

        // recuperation des données de l api pour les mettre dans la fonction loadPage
        let promise = await getProducts(url);
        loadPage(promise);
    };

    /***************************************************
     ** Panier                                         *
     **************************************************/

    const getPanier = () => {
        // Initialisation du panier s'il n'existe toujours pas, sinon on récupère son contenu
        return localStorage.has('panier') ? localStorage.get('panier') : [];
    };

    /**
     * Retourne la position d'un id associé à une lentille dans un tableau
     * @param {Object[]} tab
     * @param {string} id
     * @param {string} lentille
     * @returns {number} Position
     */
    const getPosition = (tab, id, lentille) => {
        console.log('Function', 'getPosition()');
        for (let i = 0; i < tab.length; i++) {
            if (tab[i]['lents'] == lentille && tab[i]['id'] == id) {
                return i;
            }
        }
        return -1;
    };

    const setPanier = (e) => {
        /**
         * TODO List
         * [x] Ajouter dans le panier depuis la page produit
         * [ ] Bouton supprimer : Supprime un élément du panier
         *  [ ] Si plus d'article, set styles
         * [x] Ajout dans le panier :
         *  [x] Vérifier si qté & lentilles non vide
         *  [x] Si produit existe déjà avec même lentille
         * [ ] Set quantité => set panier
         * [ ] realiser la boucle pour les cartes dans la page order afficher et dupliquer
         * [ ] réaliser les sous totaux dynamique
         * [ ] realiser le total dynamique
         * [x] Si panier vide
         *  [x] disable la partie form  ou le boutton a voir suivant style de page
         *  [x] Masquer article par défaut
         * [ ] Vérifier les qté avant envoi
         * [ ] Adapter les id de la page produit avec home
         */

        // Stop l'event du lien
        e.preventDefault();

        console.log('Function', 'setPanier()');
        const form = e.target;
        // Récupère le numéro de l'article via l'id du formulaire
        let idData = form.getAttribute('id').match(/([\d]+)/)[0];
        let id = 'cards_' + idData;

        // Vérifie si une lentille et une quantité ont été sélectionnées
        let idArt = form.querySelector(`#${id} #${id}_id`);
        let lents = form.querySelector(`#${id} #${id}_lenses`);
        let quantity = form.querySelector(`#${id} #${id}_quantity`);
        let msgError = form.querySelector(`#${id} #${id}_select-error`);
        let error = false;

        // On vérifie qu'une lentille a été sélectionnée
        if (lents.value == '') {
            error = true;
            lents.classList.add('border-danger');
        } else {
            lents.classList.remove('border-danger');
        }

        // On vérifie qu'une quantité a été sélectionnée
        if (quantity.value == 0) {
            error = true;
            quantity.classList.add('border-danger');
        } else {
            quantity.classList.remove('border-danger');
        }

        // Si aucun des deux, on affiche une erreur et on stop l'ajout dans le panier
        if (error) {
            msgError.show();
            return false;
        }
        msgError.hide();

        // Récupère le panier et le stocke dans un tableau
        let panier = getPanier();

        console.log('Panier', panier);
        // Récupère la position de l'article dans le panier
        let pos = getPosition(panier, idArt.value, lents.value);
        // Si l'article est déjà dans le panier
        if (pos >= 0) {
            panier[pos]['quantity'] += parseInt(quantity.value);
        } else {
            // Création d'un objet pour stocker les éléments du panier
            // prettier-ignore
            let donneesPanier = {
                id      : idArt.value,
                quantity: parseInt(quantity.value),
                lents   : lents.value,
            };
            // Ajoute le produit au panier tableau
            panier.push(donneesPanier);
        }
        // Met à jour le panier
        localStorage.set('panier', panier);
        console.log('Produit ajouté dans le panier.');
    };

    panierPage = () => {
        console.log('Function', 'panierPage()');
        let panier = getPanier();
        let elemsBasketFull = [
            'order-title',
            'order-card-container',
            'order-total',
            'order-modal-container',
            'order-alert-contentfull',
            'order-alert-title',
        ];
        let elemsBasketEmpty = ['basket-empty', 'order-alert-contentempty'];
        let elemsToShow = []; // Tableau des éléments que l'on souhaite afficher
        let elemsToHide = []; // Tableau des éléments que l'on souhaite masquer
        if (panier.length > 0) {
            console.log(panier);
            elemsToShow = elemsBasketFull;
            elemsToHide = elemsBasketEmpty;
        } else {
            elemsToShow = elemsBasketEmpty;
            elemsToHide = elemsBasketFull;
            console.log('PANIER VIDE !!! Bouh !!!! Donne nous tes sous !!!!');
        }
        elemsToShow.forEach((elem) => document.getElementById(elem).show());
        elemsToHide.forEach((elem) => document.getElementById(elem).hide());
    };

    /***************************************************
     ** Chargement de la page                          *
     **************************************************/

    // Nom de la page
    const namePage = document.querySelector('#page').value;
    if (namePage == 'home') {
        // Charge les produits
        loadDatas();
    } else if (namePage == 'product') {
        // Charge le produit
        loadDatas();
    } else if (namePage == 'order') {
        //
        panierPage();
    }

    /*const getProducts = (url) => {
        $.get(url, (data) => {
            console.log('Function', 'get()');
            //! Verifier si objet vide, si oui afficher erreur !
            // On lance le script
            loadPage(data);
        });
    };*/

    /***************************************************
     ** Modification visuel du selecteur qualité       *
     **************************************************/

    let media_sm = false;

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
    ////changeOptionContent();
    //// Lorsque la taille de l'écran est modifiée
    ////window.addEventListener('resize', changeOptionContent);
};
