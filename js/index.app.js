window.onload = () => {
    // Création de l'objet panier avec le cookie 'panier'
    //let monApi = new Api('panier', 'cameras_sauvegarde.json');
    let monApi = new Api('panier', 'http://localhost:3000/api/cameras/');
    let monPanier = monApi.getPanier();

    const createCard = async (i, camera) => {
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
            <li class="list-group-item unstretched-link"><span>Prix : </span><span id="' + id + '_price" class="font-weight-bold"></span></li>\
            <li class="list-group-item unstretched-link">\
            <div class="form-floating w-80  w-md-75 w-lg-85 mt-2 unstretched-link">\
                <select class="form-select2 inputGroupSelect01" id="' + id + '_lenses">\
                <option value="" selected>-</option>\
                </select>\
                <label>Lentilles</label>\
                </div>\
            <li class="list-group-item unstretched-link">\
            <div class="form-floating w-80  w-md-75 w-lg-85 mt-2">\
                <select class="form-select2 inputGroupSelect02" id="' + id + '_quantity">\
                    <option value="0" selected>-</option>\
                    <option value="1">1</option>\
                    <option value="2">2</option>\
                    <option value="3">3</option>\
                    <option value="4">4</option>\
                    <option value="5">5</option>\
                </select>\
                <label>Quantité</label>\
            </div>\
            </li>\
        </ul>\
        <span id="' + id + '_select-msg" class="d-flex msg-select mb-3 unstretched-link"></span>\
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
        div.classList.add('card', 'w-md-100', 'mb-4', 'mx-2', 'border-0', 'shadow');
        div.innerHTML = template;
        document.querySelector('#list_cards').appendChild(div);

        document.querySelector(`#${id} #${id}_id`).value = camera._id;

        //let img = document.querySelector('#' + id + ' img');
        let img = document.querySelector(`#${id} img`);

        //img.src = camera.imageUrl; // Récupération des données en mettant la fonction + le nom attribué dans l'api
        // Version Json
        img.src = camera.imageUrl.replace('http://localhost:3000/', '');
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
        prix.textContent += (camera.price / 100).numberFormat();

        let link = document.querySelector(`#${id} #${id}_link`);
        link.href = 'produit.html?id=' + camera._id;

        // Ajout de l'evenement sur le bouton Ajouter au panier
        document.querySelector(`#${id} #${id}_form`).addEventListener('submit', monPanier.setPanier);
    };

    // le i permet d avoir l'indice de l article.
    let i = 0;
    // la fonction loadPage a ces données mise dans la fonction camera.
    const loadPage = (cameras) => {
        // Si camaras est un tableau, cela signifie que l'id demandé n'a pas été trouvé
        if (Array.isArray(cameras) && cameras.length > 0) {
            for (let camera of cameras) {
                createCard(i, camera);
                i++;
            }
        } else {
            console.error('Erreur');
        }
    };

    let datas = {};
    const loadDatas = async () => {
        // recuperation des données de l api pour les mettre dans la fonction loadPage
        datas = await monApi.getProducts();
        loadPage(datas);
    };

    loadDatas();
};
