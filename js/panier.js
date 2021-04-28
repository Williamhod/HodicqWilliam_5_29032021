/**
 *
 */
class Panier {
    /**
     *
     * @param {string} nameCookie Nom du cookie
     */
    constructor(nameCookie, options = {}) {
        this.nameCookie = nameCookie;
        this.tabProduits = this.loadPanier();
        this.total = 0;
        this.options = options;
        this.quantityMax = 5; 
        this.timeout = null;
    }

    setStorage = () => {
        localStorage.set(this.nameCookie, this.tabProduits);
    };

    /**
     * Charge le panier à partir d'un storage (cookie local)
     * @returns {Array}
     */
    loadPanier = () => {
        // Initialisation du panier s'il n'existe toujours pas, sinon on récupère son contenu
        return localStorage.has(this.nameCookie) ? localStorage.get(this.nameCookie) : [];
    };

    /**
     * Retourne la position d'un id associé à une lentille dans le panier
     * ce qui va permettre d'accèder à l'élèment modifié depuis l'interface
     * utilisateur jusqu'au panier
     * @param {string} id Id du produit
     * @param {string} lentille Lentille choisie
     * @returns {number} Position du produit dans le panier
     */
    getPosition = (id, lentille) => {
        for (let i = 0, imax = this.tabProduits.length; i < imax; i++) {
            if (this.tabProduits[i]['lenses'] == lentille && this.tabProduits[i]['id'] == id) {
                return i;
            }
        }
        return -1;
    };

    setDisplayPanier = () => {
        if (this.options.elemsBasketFull === null || this.options.elemsBasketEmpty === null) return;

        let elemsToShow = []; // Tableau des éléments que l'on souhaite afficher
        let elemsToHide = []; // Tableau des éléments que l'on souhaite masquer
        if (this.tabProduits.length > 0) {
            elemsToShow = this.options.elemsBasketFull;
            elemsToHide = this.options.elemsBasketEmpty;
        } else {
            elemsToShow = this.options.elemsBasketEmpty;
            elemsToHide = this.options.elemsBasketFull;
        }
        elemsToShow.forEach((elem) => document.getElementById(elem).show());
        elemsToHide.forEach((elem) => document.getElementById(elem).hide());
    };

    display = () => {
        for (let i = 0, imax = this.tabProduits.length; i < imax; i++) {
            let id = this.getPanierElementId('article', i); // 'cards_{{i}}'
            let card;

            // Si y'a plus d'un élément, on clone le premier élément
            if (i == 0) {
                // On affiche le premier élément (le seul disponible dans le html)
                //this.getPanierElement('parent').show();
                this.getPanierElement('article', 0, '#').show();
            } else {
                // Clone le premier card
                card = this.getPanierElement('article', 0, '#').cloneNode(true);
                // Ajoute au DOM
                this.getPanierElement('parent').appendChild(card);
                // Remplace les id cards_0 par l'id dynamique
                card.outerHTML = card.outerHTML.replaceAll('cards_0', 'cards_' + i);
            }

            this.getPanierElement('idProduit', id).value = this.tabProduits[i].id;
            this.getPanierElement('lentilles', id).textContent = this.tabProduits[i].lenses;
            this.getPanierElement('prix', id).textContent = this.tabProduits[i].price;
            this.getPanierElement('linknom', id).textContent = this.tabProduits[i].name;
            this.getPanierElement('linknom', id).href = 'produit.html?id=' + this.tabProduits[i].id;
            this.getPanierElement('image', id).src = this.tabProduits[i].img;

            let selectQuantity = this.getPanierElement('quantity', id);
            // Récupère la quantité choisit, sachant qu'elle est cappé à quantityMax
            let quantityInSelect =
                this.tabProduits[i].quantity > this.quantityMax ? this.quantityMax : this.tabProduits[i].quantity;
            // Si premier élément, on génère les options
            if (i == 0) {
                for (let n = 1; n <= this.quantityMax; n++) {
                    selectQuantity.addOption(n, n, quantityInSelect == n);
                }
            } else {
                // Parcours toutes les quantités jusqu'à trouver celle choisit
                for (let n = 1, nmax = selectQuantity.length; n <= nmax; n++) {
                    if (quantityInSelect == n) {
                        selectQuantity[n - 1].selected = true;
                        break;
                    }
                }
            }

            let subTotal = quantityInSelect * this.tabProduits[i].price.reverseNumberFormat();
            document.querySelector(`#${id} #${id}_subtotal`).textContent = subTotal.numberFormat();
            this.total += subTotal;

            selectQuantity.addEventListener('change', this.editQuantityProduit);
            let buttonRemove = this.getPanierElement('btRemove', id);
            buttonRemove.addEventListener('click', (e) => {
                // Sans cela, la page se réactualise en cliquant sur le bouton supprimer
                e.preventDefault();
            });
        }

        document.querySelector(this.getPanierElementId('total')).textContent = this.total.numberFormat();
    };

    /**
     * Récupère un élément du panier à partir de son id
     * @param {string} elementID Nom de l'élément souhaité
     * @param {string} value Valeur pour remplacer le paramètre entre {{param}}
     * @param {string} prefix Chaine à ajouter au début de l'id récupéré (ex: #)
     * @returns
     */
    getPanierElement = (elementID, value = null, prefix = '') => {
        let element = null;
        try {
            //console.log(elementID, value);
            element = document.querySelector(prefix + this.getPanierElementId(elementID, value));
        } catch (e) {
            throw new Error(`L'élément avec l'id '${elementID}' n'a pas été trouvé !`);
        }
        return element;
    };

    /**
     * Récupère un id du panier
     * @param {string} elementID Nom de l'élément souhaité
     * @param {string} value Valeur pour remplacer le paramètre entre {{param}}
     * @returns
     */
    getPanierElementId = (elementID, value = null) => {
        let id = null;
        switch (elementID) {
            case 'parent':
                id = this.options.elemsParentId;
                break;
            case 'article':
                id = this.options.elemsIds.replaceAll('{{i}}', value);
                break;
            default:
                id = this.options.elemsBasket[elementID].replaceAll('{{id}}', value);
        }
        return id;
    };

    editQuantityProduit = (e) => {
        console.log('edit');

        let articleID = e.target.numberID();

        // Récupère le numéro de l'article via l'id du button
        let id = 'cards_' + articleID;

        // Récupère la position de l'article dans le panier à l'aide de son id et de la lentille
        let pos = this.getPosition(
            this.getPanierElement('idProduit', id).value,
            this.getPanierElement('lentilles', id).textContent,
        );

        // Modifie la quantité de l'élément à la position pos
        this.tabProduits[pos].quantity = parseInt(this.getPanierElement('quantity', id).value);

        // Retire l'ancien sous-total du total
        this.total -= this.getPanierElement('sousTotal', id).textContent.reverseNumberFormat();
        // Calcul le nouveau sous-total
        let subTotal = this.tabProduits[pos].quantity * this.tabProduits[pos].price.reverseNumberFormat();
        this.getPanierElement('sousTotal', id).textContent = subTotal.numberFormat();
        // Calcul le nouveau total
        this.total += subTotal;
        // Mise a jour du total
        this.getPanierElement('total', id).textContent = this.total.numberFormat();

        // Met à jour le panier
        this.setStorage();
    };

    removeProduit = (target) => {
        console.log('remove');

        let articleID = target.numberID();

        // Récupère le numéro de l'article via l'id du button
        let id = 'cards_' + articleID;

        // Récupère la position de l'article dans le panier à l'aide de son id et de la lentille
        let pos = this.getPosition(
            this.getPanierElement('idProduit', id).value,
            this.getPanierElement('lentilles', id).textContent,
        );
        // Supprime l'élément à la position pos (le 1 signifie 1 élément supprimé)
        this.tabProduits.splice(pos, 1);

        // Mise a jour du prix à la supression par la soustraction du sous-total au total
        this.total -= this.getPanierElement('sousTotal', id).textContent.reverseNumberFormat();
        this.getPanierElement('total', id).textContent = this.total.numberFormat();

        // Met à jour le panier
        this.setStorage();
        // Retire l'élémen du DOM
        this.getPanierElement('article', articleID, '#').remove();
        // Met à jour la page s'il n'y a plus d'éléments dans le panier
        this.setDisplayPanier();
    };

    setPanier = (e) => {
        console.log('Panier.setPanier()');
        // Stop l'event du lien
        e.preventDefault();

        let form = e.target;
        
        let articleID = form.numberID();

        // Récupère le numéro de l'article via l'id du button
        let id = 'cards_' + articleID;

        // on recupèrer les champs valeurs
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

        // Remet à jour le contenu du panier avant d'ajouter les nouveaux éléments
        this.tabProduits = this.loadPanier();

        console.log('Panier', this.tabProduits);
        // Récupère la position de l'article dans le panier
        let pos = this.getPosition(idArt.value, lenses.value);
        // Si l'article est déjà dans le panier
        if (pos >= 0) {
            if (this.tabProduits[pos]['quantity'] == 5) {
                msgSelect.classList.add('text-danger');
                msgSelect.textContent = 'Rupture de stock !';
            } else {
                this.tabProduits[pos]['quantity'] += parseInt(quantity.value);

                if (this.tabProduits[pos]['quantity'] > 5 /**produit.stock */) {
                    msgSelect.classList.add('text-info');
                    msgSelect.textContent = 'Quantitée max de 5 articles atteinte.';
                    this.tabProduits[pos]['quantity'] = 5;
                } else {
                    msgSelect.classList.add('text-success');
                    msgSelect.textContent = "La quantité d'articles a été mise à jour.";
                }
            }
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
            this.tabProduits.push(donneesPanier);

            //message d ajout
            msgSelect.classList.add('text-success');
            msgSelect.textContent = 'Votre article a bien été ajouté !';
        }
        // On remet un content vide mais la span garde la meme taille pour pas modifier les tailles des cards
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            msgSelect.textContent = '';
            msgSelect.classList.remove('text-success', 'text-info', 'text-danger');
        }, 3000);

        // Met à jour le panier
        this.setStorage();
        console.log('Produit ajouté dans le panier.');
    };

    /**
     * Récupère l'ensemble des id des produits contenu dans le panier
     * @return {string[]} Tableau d'id
     */
    getListProductsId = () => {
        let tab = [];
        for (let produit of this.tabProduits) {
            tab.push(produit.id);
        }
        return tab;
    };
}
