window.onload = () => {
    let monApi = new Api('panier');
    let monPanier = monApi.getPanier();

    monPanier.setDisplayPanier();
    monPanier.display();

    // Variable pour contenir le bouton supprimer
    let bt_supprimer_target = null;

    const customModal = (e) => {
        // Stocke le bouton Supprimer sur lequel l'utilisateur a cliqué
        bt_supprimer_target = e.relatedTarget;
        // Récupère l'id de l'élément
        let id = monPanier.getPanierElementId('article', bt_supprimer_target.numberID());
        // Récupère les éléments du modal
        let article = $(e.target).find('#modal-body-article')[0]; //le find permet de recherche parmis les enfants de e.target(le modal)
        let lentilles = $(e.target).find('#modal-body-lentilles')[0];
        // Modifie le contenue du modal
        article.textContent = monPanier.getPanierElement('nom', id).textContent;
        lentilles.textContent = monPanier.getPanierElement('lentilles', id).textContent;
    };
    // Se déclenche lorsque le modal s'ouvre
    $('#modalConfirmRemove').on('show.bs.modal', customModal);

    const confirmationRemoveModal = () => {
        // Retire l'article du panier
        monPanier.removeProduit(bt_supprimer_target);
        // Réinitialise la variable contenant le bouton cliqué
        bt_supprimer_target = null;
    };

    $('#modalConfirmRemoveValid').on('click', confirmationRemoveModal);

    /***************************************************
     ** Modal- Confirmation de commande                *
     **************************************************/

    // Declaration des id provenant des inputs de order

    let modalName = document.querySelector(`#order_last_name`);
    let modalFirstName = document.querySelector(`#order_first_name`);
    let modalPhone = document.querySelector(`#order_phone_number`);
    let modalAddress = document.querySelector(`#order_adress`);
    let modalCity = document.querySelector(`#order_city`);
    let modalEmail = document.querySelector(`#order_email`);
    let modalForm = document.querySelector(`#order_form`);

    // Declaration des formats
    let phoneFormat = /^\d{10}$/;
    let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let nameAllFormat = /^[A-Za-z- '\p{L}]{2,}[^\s\p{S}\p{P}\$*-+/]$/;
    let adressFormat = /^([A-Za-z0-9- .,#'\p{L}]{7,}[^\s\p{S}\p{P}\$-+/])$/;

    // Set up des messages des champs non complèter
    let modalErrorMessages = {
        order_last_name: "Sans le nom ca va être compliqué d'envoyer la commande",
        order_first_name: 'Le prénom est tout aussi essentiel que le nom',
        order_adress: 'Si vous nous dites pas ou envoyer la commande, on ne peut le savoir hein !',
        order_city: 'Ohh vraiment tu as oublié ta ville ? =)',
        order_email: 'Merci de renseigner votre adresse e-mail',
        order_phone_number: "Vous pouvez renseigner votre numéro de téléphone, mais ce n'est pas obligatoire",
    };

    // au blur du champs selectionné , vérifier sur le format du modal correspond avec les données utilisateurs
    const validateModal = (e, format) => {
        let elem = e.target;
        elem.classList.remove('is-valid', 'is-invalid');
        if (elem.value.match(format)) {
            elem.classList.add('is-valid');
            elem.setCustomValidity('');
        } else {
            elem.classList.add('is-invalid');
            elem.setCustomValidity(modalErrorMessages[e.target.getAttribute('id')]);
        }
    };

    modalEmail.addEventListener('blur', (e) => validateModal(e, emailFormat));
    modalName.addEventListener('blur', (e) => validateModal(e, nameAllFormat));
    modalFirstName.addEventListener('blur', (e) => validateModal(e, nameAllFormat));
    modalAddress.addEventListener('blur', (e) => validateModal(e, adressFormat));
    modalCity.addEventListener('blur', (e) => validateModal(e, nameAllFormat));
    modalPhone.addEventListener('blur', (e) => validateModal(e, phoneFormat));

    const setupOrder = (e) => {
        // on retire la redirection du submit
        e.preventDefault();
        //Réalisation de l'objet de contact pour le post order/api
        let contact = {
            firstName: modalFirstName.value,
            lastName: modalName.value,
            address: modalAddress.value,
            city: modalCity.value,
            email: modalEmail.value,
        };
        let products = monPanier.getListProductsId();
        let order = {
            contact,
            products,
        };

        const sendOrder = () => {
            //return new Promise((resolve) => {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();

                xhr.onload = function () {
                    // print JSON response
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 201) {
                        // localStorage.set('order', this.responseText);
                        // window.location = './order-confirmation.html';
                        resolve(JSON.parse(this.responseText));
                    } else {
                        // ERROR
                        reject(this);
                    }
                };
                xhr.open('POST', 'http://localhost:3000/api/cameras/order', true);
                //Envoie les informations du header adaptées avec la requête
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.send(JSON.stringify(order));
            });
        };
        sendOrder()
            .then((response) => {
                localStorage.set('order', response);
                window.location = './order-confirmation.html';
            })
            .catch((error) => {
                // Affichage message d'erreur
                console.error('Erreur', error.status, ':', error.statusText);
                console.error('URL :', error.responseURL);
            });
    };

    // au clic du submit , nous réalisons l objet contact et products (comprenant uniquement les id produits)
    modalForm.addEventListener('submit', setupOrder);
};

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
