/*
    Решил не делать на React + Redux или Vue JS + Vuex.
    Запрос асинхронный. можно использовать fetch, но для него нужен полифилл
    
    блог: klesarev.github.io
    почта: klesareff.igor@yandex.ru
*/


// глобальные переменные
// состояние приложения
var store = {};

// формируем асинхронный запрос
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://api.qa.imumk.ru/api/mobilev1/update', true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send( JSON.stringify({Data:""}) );

xhr.onreadystatechange = function() {
    
    if (this.readyState != 4) return;
    // если не сработало обработать ошибку
    if (this.status != 200) {
        alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
        return;
    }
    // получаем результат из this.responseText сохраняем в store массив данных
    store = JSON.parse(xhr.responseText).items;

    // отрисуем начальное остояние
    renderElems( store )
}

// сортируеем данные
function sorted() {
    
    // предмет
    var subjectList = document.querySelector('.subject');
    var subjectQuery = subjectList.options[subjectList.selectedIndex].value;
    // тип
    var genreList = document.querySelector('.genre');
    var genreQuery = genreList.options[genreList.selectedIndex].value;
    // класс
    var gradeList = document.querySelector('.grade');
    var gradeQuery = gradeList.options[gradeList.selectedIndex].value;
    // поисковой запрос
    var serchQuery = document.querySelector('.search').value;
   
    // filter возвращает новый массив после callback
    var res = store.filter(function(element) {
        return (!subjectQuery || element.subject == subjectQuery)
			&& (!genreQuery  || element.genre==genreQuery)
            && (!gradeQuery || element.grade.split(";").indexOf(gradeQuery) >= 0)
            && (!serchQuery || (element.description + element.title).toUpperCase().indexOf(serchQuery.toUpperCase()) >= 0)

    })

    // отрисуем данные
    renderElems( res )
};


// Рендерим элементы
function renderElems(elems) {

    var wrapper = document.querySelector('.list-wrapper');
    // очищаем обертку
    while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
    };

    // map вызывает для каждого элемента callback
    elems.map(function(element) {

        // выбираем валюту отображения ( рубли / доллары )
        // не очень верный способ, так как можно вынести в отдельный метод
        // но зато строче кода меньше.
        var select = document.querySelector('.price'),
            query = select.selectedIndex;

        var price = (query == 0) ? element.price + " руб." : element.priceBonus + " &#9733;";

        var card = document.createElement('div');
        card.className = "card-item uk-card uk-card-default uk-card-body";
        
        var cardImage = document.createElement('img');
        cardImage.className = "card-image"
        cardImage.src = "https://www.imumk.ru/covers/"+element.courseId+".png";

        var cardBlock = document.createElement('div');
        cardBlock.className = "card-block";
        cardBlock.innerHTML 
            = "<h4 class='card-title'>"+ element.subject +"</h4>" 
                + "<p class='card-grade'>"+ element.grade +" класс</p>"
                + "<p class='card-genre'>"+ element.genre +"</p>"
                + "<a class='card-link uk-button uk-button-primary' href='#'>Купить за "+ price +"</a>"

        card.appendChild( cardImage );
        card.appendChild( cardBlock );

        // card.innerHTML = element.title;
        wrapper.appendChild( card )
    });

    // console.log( elems )
};
