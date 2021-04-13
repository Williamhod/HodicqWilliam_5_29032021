window.onload = () => {
    /**********************************************************************
     ** Fonction - Show et hide un item                                   *
     **********************************************************************/
    HTMLElement.prototype.show = function (classe = 'd-flex') {
        this.classList.remove('d-none');
        this.classList.add(classe);
    };

    HTMLElement.prototype.hide = function (classe = 'd-flex') {
        this.classList.add('d-none');
        this.classList.remove(classe);
    };

    /**********************************************************************
     ** HOME - réalisation des cartes par l'appel de la fonction loadPage *
     **********************************************************************/
    // permet d'initialiser l'affichage des prix
    const formatPrice = (price, locale = 'fr-FR') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const reverseFormatNumber = (stringNumber, locale = 'fr-FR') => {
        var thousandSeparator = Intl.NumberFormat(locale)
            .format(11111)
            .replace(/\p{Number}/gu, '');
        var decimalSeparator = Intl.NumberFormat(locale)
            .format(1.1)
            .replace(/\p{Number}/gu, '');

        return parseFloat(
            stringNumber
                .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
                .replace(new RegExp('\\' + decimalSeparator), '.'),
        );
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
                <li class="list-group-item unstretched-link"><span>Prix : </span><span id="' + id + '_price" ></span></li>\
                <li class="list-group-item unstretched-link">\
                    <select class="form-select inputGroupSelect01 unstretched-link" id="' + id + '_lenses">\
                    <option value="" selected>Lentilles</option>\
                    </select>\
                <li class="list-group-item unstretched-link">\
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
            <span id="' + id + '_select-msg" class="d-flex msg-select"></span>\
            <div class="row">\
                <div class="col-auto text-left unstretched-link ">\
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

        let prix = document.querySelector(`#${id} #${id}_price`);
        prix.textContent += formatPrice(camera.price / 100);

        let link = document.querySelector(`#${id} #${id}_link`);
        link.href = 'produit.html?id=' + camera._id;

        // Ajout de l'evenement sur le bouton Ajouter au panier
        document.querySelector(`#${id} #${id}_form`).addEventListener('submit', setPanier);
    };

    /****************************************************************************************
     ** Produit - Implantation des données dans la carte par l'appel de la fonction loadPage*
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

        let prix = document.querySelector(`#${id} #${id}_price`);
        prix.textContent += formatPrice(camera.price / 100);

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
            //recupere les paramètres de l url
            $_GET[name] = value;
        });

        // Définit l'url + id produit (si page produit)
        let url = 'http://localhost:3000/api/cameras/';

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
            if (tab[i]['lenses'] == lentille && tab[i]['id'] == id) {
                return i;
            }
        }
        return -1;
    };

    const setPanier = (e) => {
        /**
         * TODO List
         * [x] Ajouter dans le panier depuis la page produit
         * [x] Bouton supprimer : Supprime un élément du panier
         *  [x] Si plus d'article, set styles
         * [x] Ajout dans le panier :
         *  [x] Vérifier si qté & lentilles non vide
         *  [x] Si produit existe déjà avec même lentille
         * [x] Set quantité => set panier
         *  [x] réaliser les sous totaux dynamique
         *  [x] realiser le total dynamique
         * [x] realiser la boucle pour les cartes dans la page order afficher et dupliquer
         * [x] Si panier vide
         *  [x] disable la partie form  ou le boutton a voir suivant style de page
         *  [x] Masquer article par défaut
         * [ ] Vérifier les qté avant envoi
         * [v] Adapter les id de la page produit avec home
         * [x] Ajouter une span de notification d'ajout de l'article ds le panier
         * [ ] Ajouter un modal de suppression du panier
         * [ ] Lien en cliquant sur le nom du produit sur le panier
         */

        // Stop l'event du lien
        e.preventDefault();

        const form = e.target;
        // Récupère le numéro de l'article via l'id du formulaire
        let idData = form.getAttribute('id').match(/([\d]+)/)[0];
        let id = 'cards_' + idData;

        // Vérifie si une lentille et une quantité ont été sélectionnées
        let idArt = form.querySelector(`#${id} #${id}_id`);
        let lenses = form.querySelector(`#${id} #${id}_lenses`);
        let quantity = form.querySelector(`#${id} #${id}_quantity`);
        let msgSelect = form.querySelector(`#${id} #${id}_select-msg`);
        let name = form.querySelector(`#${id} h5`);
        let price = form.querySelector(`#${id} #${id}_price`);
        let img = form.querySelector(`#${id} img`);
        let error = false;

        // On vérifie qu'une lentille a été sélectionnée
        if (lenses.value == '') {
            error = true;
            lenses.classList.add('border-danger');
        } else {
            lenses.classList.remove('border-danger');
        }

        // On vérifie qu'une quantité a été sélectionnée
        if (quantity.value == 0) {
            error = true;
            quantity.classList.add('border-danger');
        } else {
            quantity.classList.remove('border-danger');
        }

        msgSelect.textContent = '';
        // Si aucun des deux, on affiche une erreur et on stop l'ajout dans le panier
        if (error) {
            msgSelect.classList.add('text-danger');
            msgSelect.textContent = 'Veuillez sélectionner une valeur';
            return false;
        }
        // Si l'article est bien ajouté on notifie de l'ajout pendant 1.5 sec
        msgSelect.classList.remove('text-danger');
        msgSelect.classList.add('text-success');
        msgSelect.textContent = 'Votre article a bien été ajouté !';

        // On remet un content vide mais la span garde la meme taille pour pas modifier les tailles des cards
        setTimeout(() => {
            msgSelect.textContent = '';
            msgSelect.classList.remove('text-success');
        }, 1500);

        // Récupère le panier et le stocke dans un tableau
        let panier = getPanier();

        console.log('Panier', panier);
        // Récupère la position de l'article dans le panier
        let pos = getPosition(panier, idArt.value, lenses.value);
        // Si l'article est déjà dans le panier
        if (pos >= 0) {
            panier[pos]['quantity'] += parseInt(quantity.value);
        } else {
            // Création d'un objet pour stocker les éléments du panier
            // prettier-ignore
            let donneesPanier = {
                id: idArt.value,
                img: img.src,
                name: name.textContent,
                price: price.textContent,
                quantity: parseInt(quantity.value),
                lenses: lenses.value,
            };
            // Ajoute le produit au panier tableau
            panier.push(donneesPanier);
        }
        // Met à jour le panier
        localStorage.set('panier', panier);
        console.log('Produit ajouté dans le panier.');
    };

    const setDisplayPanier = (nb, elemsEmpty, elemsFull) => {
        let elemsToShow = []; // Tableau des éléments que l'on souhaite afficher
        let elemsToHide = []; // Tableau des éléments que l'on souhaite masquer
        if (nb > 0) {
            elemsToShow = elemsFull;
            elemsToHide = elemsEmpty;
        } else {
            elemsToShow = elemsEmpty;
            elemsToHide = elemsFull;
        }
        elemsToShow.forEach((elem) => document.getElementById(elem).show());
        elemsToHide.forEach((elem) => document.getElementById(elem).hide());
    };

    const panierPage = () => {
        console.log('Function', 'panierPage()');
        let panier = getPanier();
        let elemsBasketFull = [
            'order-title',
            'order-total',
            'order-modal-container',
            'order-alert-contentfull',
            'order-alert-title',
            'list_cards',
        ];
        let elemsBasketEmpty = ['basket-empty', 'order-alert-contentempty'];
        document.getElementById('cards_0').show();
        setDisplayPanier(panier.length, elemsBasketEmpty, elemsBasketFull);

        let total = 0;
        for (let i = 0; i < panier.length; i++) {
            let id = 'cards_' + i;
            let card;

            // Si y'a plus d'un élément, on clone le premier élément
            if (i > 0) {
                // Clone le premier card
                card = document.querySelector(`#cards_0`).cloneNode(true);
                // Ajoute au DOM
                document.querySelector('#list_cards').appendChild(card);
                // Remplace les id cards_0 par l'id dynamique
                card.outerHTML = card.outerHTML.replaceAll('cards_0', 'cards_' + i);
            }
            document.querySelector(`#${id} #${id}_id`).value = panier[i].id;
            document.querySelector(`#${id} #${id}_lenses`).textContent = panier[i].lenses;
            document.querySelector(`#${id} #${id}_price`).textContent = panier[i].price;
            document.querySelector(`#${id} h5`).textContent = panier[i].name;
            document.querySelector(`#${id} img`).src = panier[i].img;

            let options = '';
            let nMax = panier[i].quantity > 5 ? panier[i].quantity : 5; //valeur minimale à 5.
            for (let n = 1; n <= nMax; n++) {
                let selected = panier[i].quantity == n ? 'selected' : '';
                options += `<option value="${n}" ${selected}>${n}</option>`;
            }
            document.querySelector(`#${id} #${id}_quantity`).innerHTML = options;

            let subTotal = panier[i].quantity * reverseFormatNumber(panier[i].price);
            document.querySelector(`#${id} #${id}_subtotal`).textContent = formatPrice(subTotal);

            total += subTotal;

            let changeQuantity = document.querySelector(`#${id}_quantity`);
            let buttonRemove = document.querySelector(`#${id}_remove`);
            buttonRemove.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('button supprimer');
                // Supprimer l'élément du tableau panier
                const bt = e.target;
                // Récupère le numéro de l'article via l'id du button
                let idData = bt.getAttribute('id').match(/([\d]+)/)[0];
                let id = 'cards_' + idData;

                // Récupère la position de l'article dans le panier à l'aide de son id et de la lentille
                let pos = getPosition(
                    panier,
                    document.querySelector(`#${id}_id`).value,
                    document.querySelector(`#${id}_lenses`).textContent,
                );
                // Supprime l'élément à la position pos (le 1 signifie 1 élément supprimé)
                panier.splice(pos, 1);

                // Mise a jour du prix à la supression par la soustraction du sous-total au total
                total -= reverseFormatNumber(document.querySelector(`#${id} #${id}_subtotal`).textContent);
                document.querySelector(`#cards_total`).textContent = formatPrice(total);

                // Met à jour le panier
                localStorage.set('panier', panier);
                // Retire l'élémen du DOM
                document.querySelector(`#${id}`).remove();
                // Met à jour la page s'il n'y a plus d'éléments dans le panier
                setDisplayPanier(panier.length, elemsBasketEmpty, elemsBasketFull);
            });
            changeQuantity.addEventListener('change', (e) => {
                e.preventDefault();
                console.log('changement quantité');
                // Supprimer l'élément du tableau panier
                const bt = e.target;
                // Récupère le numéro de l'article via l'id du button
                let idData = bt.getAttribute('id').match(/([\d]+)/)[0];
                let id = 'cards_' + idData;

                // Récupère la position de l'article dans le panier à l'aide de son id et de la lentille
                let pos = getPosition(
                    panier,
                    document.querySelector(`#${id}_id`).value,
                    document.querySelector(`#${id}_lenses`).textContent,
                );
                // Supprime l'élément à la position pos (le 1 signifie 1 élément supprimé)
                panier[pos].quantity = document.querySelector(`#${id}_quantity`).value;

                // Retire l'ancien sous-total du total
                total -= reverseFormatNumber(document.querySelector(`#${id} #${id}_subtotal`).textContent);
                // Calcul le nouveau sous-total
                let subTotal = panier[pos].quantity * reverseFormatNumber(panier[pos].price);
                document.querySelector(`#${id} #${id}_subtotal`).textContent = formatPrice(subTotal);
                // Calcul le nouveau total
                total += subTotal;
                // Mise a jour du total
                document.querySelector(`#cards_total`).textContent = formatPrice(total);

                // Met à jour le panier
                localStorage.set('panier', panier);
            });
        }
        console.log(panier);

        document.querySelector(`#cards_total`).textContent = formatPrice(total);
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
};
