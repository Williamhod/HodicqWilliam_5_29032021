window.onload = () => {
    // Création de l'objet panier avec le cookie 'panier'
    let monApi = new Api('panier', 'cameras_sauvegarde.json');
    let monPanier = monApi.getPanier();

    const editCard = async (i, camera) => {
        // Id de l'article (dans le code)
        let id = 'cards_' + i;
        let img = document.querySelector(`#${id} img`);

        // Version Json
        img.src = camera.imageUrl.replace('http://localhost:3000/', '');
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
        prix.textContent += (camera.price / 100).numberFormat();

        document.querySelector(`#${id}_form`).addEventListener('submit', monPanier.setPanier);
    };

    // le i permet d avoir l'indice de l article.
    let i = 0;
    // la fonction loadPage a ces données mise dans la fonction camera.
    const loadPage = (cameras) => {

        // Si cameras est un tableau, cela signifie que l'id demandé n'a pas été trouvé
        if (Array.isArray(cameras)) {
            
            // Produit non trouvé
            document.querySelector('#message-error').show('');
            document.querySelector('#cards_0').hide();
            document.querySelector('#message-valid').hide();
            setTimeout(() => (window.location = 'index.html'), 5000);
        } else {
            // Une seule camera
            editCard(i, cameras);
        }
    };

    let datas = {};
    const loadDatas = async () => {
        // Récupère les params get pour l'id de l'objet afin d'avoir une fiche produit
        let $_GET = [];
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (a, name, value) => {
            //recupere les paramètres de l url
            $_GET[name] = value;
        });

        // NOTE Version avec le fichier json
        datas = await monApi.getProducts();
        if (typeof $_GET['id'] === 'string') {
            datas.forEach((val) => {
                if (val['_id'] == $_GET['id']) {
                    datas = val;
                    return;
                }
            });
        }
        // NOTE Version avec le lien localhost
        /*if (typeof $_GET['id'] !== 'undefined') {
            monApi.setUrl('http://localhost:3000/api/cameras/' + $_GET['id']);
        }
        datas = await monApi.getProducts();*/

        loadPage(datas);
    };

    loadDatas()
    .then(() => {
        console.log('Connected');
    })
    .catch((error) => {
        //permet de voir la réponse de la promesse de l api (getproduct) en cas de non connexion
        console.error('Erreur', error.status, ':', error.statusText);
        console.error('URL :', error.responseURL);
    });
};;