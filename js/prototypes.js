/**
 * Affiche un élement en remplaçant la classe de d-none
 * @param {String} classes Classes qui remplaçent la classe d-none
 */
HTMLElement.prototype.show = function (classe = 'd-flex') {
    this.classList.remove('d-none');
    if (classe != '') this.classList.add(classe);
};

/**
 * Cache un élément en remplaçant les classes choisies par d-none
 * @param {String} classes Classes que la classe d-none remplace
 */
HTMLElement.prototype.hide = function (classe = 'd-flex') {
    this.classList.add('d-none');
    if (classe != '') this.classList.remove(classe);
};

/**
 * Ajoute un élément option au menu select
 * @param {String|number} value Valeur de l'élément option
 * @param {String} text Contenu de l'élément option
 * @param {boolean} selected Option séléectionnée ou non
 */
HTMLSelectElement.prototype.addOption = function (value, text, selected = false) {
    var option = document.createElement('option');
    option.value = value;
    option.text = text;
    option.selected = selected;
    this.add(option);
};

/**
 * Transforme un prix d'un format chaine vers nombre
 * @param {String} locale Une chaine de caractères avec un identifiant de langue BCP 47
 * @returns {number} Prix sous forme numérique (ex: 123456.79)
 */ String.prototype.reverseNumberFormat = function (locale = 'fr-FR') {
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

/**
 * Transforme un prix d'un format nombre vers chaine
 * @param {String} locale Une chaine de caractères avec un identifiant de langue BCP 47
 * @returns {String} Prix sous forme de chaine (ex: 123 456,79 €)
 */
Number.prototype.numberFormat = function (locale = 'fr-FR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
    }).format(this);
};

/**
 * Récupère la partie numérique de l'id d'un élément
 * @returns {number} Id de l'élément
 */
HTMLElement.prototype.numberID = function () {
    return this.getAttribute('id').match(/([\d]+)/)[0];
};

// https://github.com/zevero/simpleWebstorage
//uniforme les actions du storage et uniforme les types de données en chaine.
/**
 * Modifie un cookie
 * @param {String} key Identifiant du cookie
 * @param {*} obj Contenu du cookie
 * @returns
 */
Storage.prototype.set = function (key, obj) {
    var t = typeof obj;
    if (t === 'undefined' || obj === null) this.removeItem(key);
    this.setItem(key, t === 'object' ? JSON.stringify(obj) : obj);
    return obj;
};

/**
 * Retourne le contenu d'un cookie
 * @param {String} key Identifiant du cookie
 * @returns {*} Contenu du cookie
 */
Storage.prototype.get = function (key) {
    var obj = this.getItem(key);
    try {
        var j = JSON.parse(obj);
        if (j && typeof j === 'object') return j;
    } catch (e) {}
    return obj;
};

/**
 * Vérifie si un cookie existe
 * @param {string} name Nom du cookie
 * @returns {boolean} True si le cookie existe, False sinon
 */
Storage.prototype.has = window.hasOwnProperty;

/**
 * Supprime un cookie à l'aide de son nom
 * @param {string} name Nom du cookie
 */
Storage.prototype.remove = localStorage.removeItem;

/**
 * Retourne la liste des cookies
 * @returns {String[]} Liste des cookies
 */
Storage.prototype.keys = function () {
    return Object.keys(this.valueOf());
};
