//* realisation de la fonction pour realiser le template html des cardes depuis les données de la fonction caméra

//! a faire une page produit avec un html pre fait auquel on ajoute les données du js pour la manip dom

const createCard = (i, camera) => {
    // Id de l'article (dans le code)
    let id = 'cards_' + i;

    // prettier-ignore
    let template =
        '<img src="" class="card-img-top card-img-index" alt="" />\
        <div class="card-body">\
            <h5 class="card-title"></h5>\
            <p class="card-text unstretched-link"></p>\
            <ul class="list-group list-group-flush">\
                <li class="list-group-item unstretched-link" id="' + id + '_rate" >Prix : </li>\
                <li class="list-group-item">\
                    <select class="form-select inputGroupSelect01 unstretched-link" id="' + id + '_lenses">\
                        <option selected>Lentilles</option>\
                    </select>\
                <li class="list-group-item">\
                    <select class="form-select inputGroupSelect02 unstretched-link">\
                        <option selected>Quantité</option>\
                        <option value="1">1</option>\
                        <option value="2">2</option>\
                        <option value="3">3</option>\
                        <option value="4">4</option>\
                        <option value="5">5</option>\
                    </select>\
                </li>\
            </ul>\
            <div class="row">\
                <div class="col-auto text-left">\
                    <a href="#" class="unstretched-link btn btn-success">Ajouter au panier</a>\
                </div>\
                <div class="col-auto text-right position-static">\
                    <a href="#" class="stretched-link btn btn-info" id="' + id + '_link">Détails</a>\
                </div>\
            </div>\
        </div>';

    // Création de l'article
    let div = document.createElement('div');
    div.id = id;
    div.classList.add('card', 'mb-4', 'mx-2', 'border-0', 'shadow');
    div.innerHTML = template;
    document.querySelector('#list_cards').appendChild(div);

    //let img = document.querySelector('#' + id + ' img');
    let img = document.querySelector(`#${id} img`);
    img.src = camera.imageUrl; // Récupération des données en mettant la fonction + le nom attribué dans l'api
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
    prix.textContent += new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
    }).format(camera.price);

    let link = document.querySelector(`#${id} #${id}_link`);
    link.href = '?product=' + camera._id;
};

// le i permet d avoir l'indice de l article.
let i = 0;
// la fonction loaded a ces données mise dans la fonction camera.
const loaded = (cameras) => {
    console.log(cameras);
    // Double la quantité de cameras pour les tests
    //cameras.push(...cameras);

    if (Array.isArray(cameras)) {
        for (let camera of cameras) {
            createCard(i, camera);
            i++;
        }
    } else {
        createCard(i, cameras);
    }
};

const loadPage = () => {
    // Récupère les params get pour l'id de l'objet afin d'avoir une fiche produit
    var $_GET = [];
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (a, name, value) => {
        $_GET[name] = value;
    });

    // Définit l'url + id produit
    let url = 'http://localhost:3000/api/cameras/';
    // Si un param product existe, on ajoute l'id du produit
    if (typeof $_GET['product'] !== 'undefined') {
        url += $_GET['product'];
    }

    // recuperation des données de l api pour les mettre dans la fonction loaded
    $.get(url, (data) => {
        //! Verifier si objet vide, si oui afficher erreur !
        // On lance le script
        loaded(data);
    });
};
loadPage();

/*$.get('http://localhost:3000/api/teddies/', (data) => {
    // On lance le script
    loaded(data);
});
*/

/*$.get('http://localhost:3000/api/furniture/', (data) => {
    // On lance le script
    loaded(data);
});
*/
