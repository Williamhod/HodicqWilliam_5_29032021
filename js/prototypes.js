HTMLElement.prototype.show = function (classe = 'd-flex') {
    this.classList.remove('d-none');
    this.classList.add(classe);
};

HTMLElement.prototype.hide = function (classe = 'd-flex') {
    this.classList.add('d-none');
    this.classList.remove(classe);
};

HTMLSelectElement.prototype.addOption = function (value, text, selected = false) {
    var option = document.createElement('option');
    option.value = value;
    option.text = text;
    option.selected = selected;
    this.add(option);
};

/**
 * Supprime les options d'un menu select
 * @param {number} start Index du premier option à supprimer
 * @param {number} end Index du dernier option à supprimer
 */
HTMLSelectElement.prototype.removeOptions = function (start = 0, end) {
    let imax = typeof end === 'number' ? end : this.options.length - 1;
    for (let i = imax; i >= start; i--) {
        this.remove(i);
    }
};

String.prototype.reverseNumberFormat = function (locale = 'fr-FR') {
    var thousandSeparator = Intl.NumberFormat(locale)
        .format(11111)
        .replace(/\p{Number}/gu, '');
    var decimalSeparator = Intl.NumberFormat(locale)
        .format(1.1)
        .replace(/\p{Number}/gu, '');

    return parseFloat(
        this.replace(new RegExp('\\' + thousandSeparator, 'g'), '').replace(new RegExp('\\' + decimalSeparator), '.'),
    );
};

// permet d'initialiser l'affichage des prix
Number.prototype.numberFormat = function (locale = 'fr-FR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
    }).format(this);
};

HTMLElement.prototype.numberID = function() {
    return this.getAttribute('id').match(/([\d]+)/)[0];
}