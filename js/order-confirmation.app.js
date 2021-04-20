window.onload = () => {

    let orderConfirmationId = localStorage.get('order');

    document.querySelector('#order-id').textContent = orderConfirmationId.orderId;

    localStorage.clear();
};
