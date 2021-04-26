window.onload = () => {
    // on recupèrer la réponse de l'api (order)
    let orderConfirmationId = localStorage.get('order');

    // on implante l'id de confirmation de commande
    document.querySelector('#order-id').textContent = orderConfirmationId.orderId;

    // on supprime les données du localStorage
    localStorage.clear();
};
