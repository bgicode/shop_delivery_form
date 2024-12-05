window.addEventListener("DOMContentLoaded", () => {

    const inputFields = document.querySelectorAll(".ajaxInput"); //поле ввода адреса магазина
    const inputFieldArt = document.querySelector(".ajaxInputArt"); //поле ввода арткула
    const mainForm = document.querySelector(".mainForm"); //оснавная форма "Отправитель"
    const showPositions = document.querySelector(".showPositions"); //Обёртка позиций
    const addPositionButton = document.querySelector(".addPosition"); //кнопка добовления позиции
    const errorMessage = document.querySelector('.errorMessage'); // сообщение об ошибке
    const inputFieldCliAddr = document.querySelector(".ajaxInputCliAddr"); //поле ввода адреса клиента

    let arErroMessage = {noAddr: "Выберите адрес отправителя",
                        noGoods: "Товар с таким артикулом розницы не найден",
                        noStock: "Товара нет в наличии в текущем магазине"};

    let selected = false;

    function imposeMinMax(el){
        if (el.value != "") {
          if (parseInt(el.value) < parseInt(el.min)) {
            el.value = el.min;
          }
          if (parseInt(el.value) > parseInt(el.max)) {
            el.value = el.max;
          }
        }
      }

    function showOptions(data, select, responceName) {

        //_________Заполнение подсказок при вводе_________
        // data - массив данных в ajax-ответе
        // select - элемент DOM обёртка для опций
        // responceName - строка ключ поля в ajax-ответе для установки в опцию
        
        select.style.display = 'block';
        if (selected && data) {
            select.style.display = 'block';
            selected = false;
        }

        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }

        // Заполняем datalist опциями из массива data   'AMOUNT', 'NAME'
        
        data.forEach(responseUnit => {
            for (let key in responseUnit) {
                if (key == responceName) {
                    const option = document.createElement('div');
                    option.classList.add('options');
                    if (responceName == 'PROPERTY_ARTROZ_VALUE') {
                        option.innerHTML = responseUnit[responceName] + ' ' + responseUnit['AMOUNT'] + 'шт. ' + responseUnit['NAME']; 
                        option.setAttribute('data-value', responseUnit[responceName]); // Устанавливаем значение опции
                    } else {
                        option.setAttribute('data-value', responseUnit[responceName]);// Устанавливаем значение опции
                        option.innerHTML = responseUnit[responceName];
                    }
                    select.appendChild(option); // Добавляем опцию в datalist
                }
            }
        });

    }

    function showPosition(data) {
        //________Вывод выбранной позиции______________
        // data - массив данных в ajax-ответе
        
        const positions = document.querySelectorAll('.position'); // получение уже созданных позици
        let repeatingPosition = false;


        let positionsCount = 0
        if (positions) {
            positionsCount = positions.length;
        } else {
            positionsCount = 0;
        }

        //_____________НАЧАЛО проверка на нужный экземпляр в data (если в data несколько элементов)_________________
        let dataIndex = 0;
        data.forEach((responseUnit, index) => {
            for (let key in responseUnit) {
                if (key == 'PROPERTY_ARTROZ_VALUE') {
                    if (responseUnit[key] == inputFieldArt.value) {
                        dataIndex = index;
                        break;
                    }
                }
            }
        });
        //_____________КОНЕЦ проверка на нужный экземпляр в data (если в data несколько элементов)_______________
        positions.forEach((position, index) => {
            if (position.querySelector('.articulField').value == data[dataIndex]['PROPERTY_ARTROZ_VALUE']) {
                if ((position.querySelector('.quantity').value + 1) < position.querySelector('.quantity').max) {
                    position.querySelector('.quantity').value++;
                }
                repeatingPosition = true;
                console.log(position.querySelector('.quantity').max);
            }
        });

        if (!repeatingPosition) {
            //______________Вывод позиции товара __________________
            const HTMLcontentAvailb = `<div class="position">
                                            <div class="positionFieldsWraper">
                                                <div class="positionTitleWraper">
                                                    <span class="positionTitle">Товар ${positionsCount+1}</span>
                                                    <div class="button deletePosition">
                                                        Удалить <img src="/local/templates/shop/img/closed.svg" >
                                                    </div>
                                                </div>
                                                <div class="positionInputWraper">
                                                    <span class="positionFieldTitle">Артикул</span>
                                                    <input class="field ajaxAutoload positionField articulField" type="text" name="positions[${positionsCount}][articul]" value="${data[dataIndex]['PROPERTY_ARTROZ_VALUE']}" required>
                                                    <span class=" positionFieldTitle">Название</span>
                                                    <input class="field ajaxAutoload positionField" type="text" name="positions[${positionsCount}][product_name]" value="${data[dataIndex]['NAME']}" required>
                                                    <span class=" positionFieldTitle">Габариты</span>
                                                    <div class="dimensionWraper">
                                                        <div>
                                                            <span class="positionFieldTitle">Высота</span>
                                                            <input class="field ajaxAutoload positionField" type="text" name="positions[${positionsCount}][height]" value="${data[dataIndex]['DIMENSIONS_HEIGHT']}">
                                                        </div>
                                                        <div>
                                                            <span class="positionFieldTitle">Ширина</span>
                                                            <input class="field ajaxAutoload positionField" type="text" name="positions[${positionsCount}][width]" value="${data[dataIndex]['DIMENSIONS_WIDTH']}">
                                                        </div>
                                                        <div>
                                                            <span class="positionFieldTitle">Длина</span>
                                                            <input class="field ajaxAutoload positionField" type="text" name="positions[${positionsCount}][lenght]" value="${data[dataIndex]['DIMENSIONS_LENGTH']}">
                                                        </div>
                                                    </div>
                                                    <div class="dimensionWraper">
                                                        <div>
                                                            <span class="positionFieldTitle">Вес</span>
                                                            <input class="field ajaxAutoload positionField" type="text" name="positions[${positionsCount}][weight]" value="${data[dataIndex]['DIMENSIONS_GROSS_WEIGHT']}">
                                                        </div>
                                                        <div>
                                                            <span class="positionFieldTitle quantityTitle">Количество</span><span class="quantityMax">&nbsp;максимум ${data[dataIndex]["AMOUNT"]} шт.</span>
                                                            <input class="field positionField quantity" type="number" name="positions[${positionsCount}][quantity]" value="1" min=1 max=${data[dataIndex]["AMOUNT"]} >
                                                        </div>
                                                        
                                                    </div> 
                                                </div>
                                            </div>
                                        </div>`;

            const newPosition = document.createElement('div'); // обёртка новой позиции

            newPosition.innerHTML = HTMLcontentAvailb;

            showPositions.appendChild(newPosition);

            newPosition.querySelector('.quantity').addEventListener('keyup', function() {
                imposeMinMax(newPosition.querySelector('.quantity'));
            });

            showPositions.querySelectorAll('input').forEach(input => {
            if (input.value == 'undefined') {
                input.value = '';
                input.readOnly = false;
                input.classList.remove('ajaxAutoload');
            }
            });
        }
        document.querySelector(".ajaxInputArt").value = '';
    }

    function setInputData(data, inputType) {
        // установка полученного ajax-ответа
        // data - массив данных в ajax-ответе
        // inputType - тип ajax запрос из какого поля отпрален

        //______________________________НАЧАЛО установка данных при полученни данных по адресу_____________
        if (inputType == "addr") {
            const autoloadFields = mainForm.querySelectorAll(".ajaxAutoload"); //поля для автозаполнения
            const select = document.getElementById('addres'); //обёртка для опций

            showOptions(data, select, 'TITLE');

            let options = document.querySelectorAll('.options'); // предложенные опции

            
            options.forEach((option, index) => {
                option.onclick = () => {
                    document.querySelector(".ajaxInput").value = option.textContent; // Устанавливаем выбранное значение в поле ввода
                    let selectIndex = index;
                    select.style.display = 'none'; // Скрываем выпадающий список
                    selected = true;

                    for (let key in data[selectIndex]) {

                        autoloadFields.forEach((autoloadField) => {

                            if (autoloadField.getAttribute('name') == ('sender' + '[' + key.toLowerCase() + ']')) {
                                autoloadField.value = data[selectIndex][key]; 
                            }
                        });
                    }
                    if (document.getElementsByName('sender[address]')[0].value.length > 0) {
                        errorMessage.style.display = 'none';
                    }
                }
            })
        //______________________________КОНЕЦ установка данных при полученни данных по адресу_____________

        //______________________________НАЧАЛО вывод похожий артикулов на введённых в поле артикул_____________
        } else if (inputType =='article') {

            const select = document.getElementById('articleOptions');
            
            showOptions(data, select, 'PROPERTY_ARTROZ_VALUE');
            errorMessage.style.display = 'none';
            let options = document.querySelectorAll('.options');

            options.forEach((option) => {
                option.onclick = () => {
                    document.querySelector(".article").value = option.getAttribute('data-value'); // Устанавливаем выбранное значение в поле ввода
                    select.style.display = 'none'; // Скрываем выпадающий список
                    selected = true;
                }
            })
        //______________________________КОНЕЦ вывод похожий артикулов на введённых в поле артикул_____________

        //______________________________НАЧАЛО установка данных согласно выбранного артикула_____________
        } else if (inputType == 'showPos') {
            const foundAddr = document.getElementsByName('sender[address]');
            isGoods = false;

            if (foundAddr[0].value == ''
                || foundAddr[0].value == 'undefined'
                || foundAddr[0].value == null
            ){
                errorMessage.style.display = 'inline';
                errorMessage.innerHTML = arErroMessage.noAddr;
            } else {
                data.forEach((value, key) => {
                    if (value['PROPERTY_ARTROZ_VALUE'] == inputFieldArt.value) {
                        isGoods = true;
                    }
                })
                if (!data[0]['ID'] || !isGoods) {
                    errorMessage.style.display = 'inline';
                    errorMessage.innerHTML = arErroMessage.noGoods;
                } else {
                    if (data[0]["AMOUNT"] != 0) {
                        showPosition(data);
                        errorMessage.style.display = 'none';
                    } else {
                        errorMessage.style.display = 'inline';
                        errorMessage.innerHTML = arErroMessage.noStock;
                    }
                }
            }
             //______________________________КОНЕЦ установка данных согласно выбранного артикула_____________
             //______________________________НАЧАЛО вывод подсказок для адреса клиента_____________
        } else if (inputType == 'cliAddr') {
            const select = document.getElementById('CliAddres'); //обёртка для опций
            let responce = data['suggestions']
            showOptions(responce, select, 'value');

            let options = document.querySelectorAll('.options');

            options.forEach((option) => {
                option.onclick = () => {
                    document.querySelector(".ajaxInputCliAddr").value = option.textContent; // Устанавливаем выбранное значение в поле ввода
                    select.style.display = 'none'; // Скрываем выпадающий список
                    selected = true;
                }
            })
        }
    }

    function getInputData(inputName, event, query = '') {
        //______________________получение ajax-ответа___________________________
        // event событие определяющее поле с которого происходит
        // inputName атрибут name воля ввода для запроса
        let inputType; // тип ajax запрос из какого поля отпрален
        let iputClass; // класс поля для получения данных для ajax-запроса
        let apiType = 'local';

        if (inputName.includes('select')) {
            if (event == 'showPos') {
                inputType = 'showPos';
            } else {
                inputType = 'article';
            }
            iputClass = ".ajaxInputArt";
        } else {
            inputType = 'addr';
            iputClass = ".ajaxInput";
        } 

        if (event == 'cliAddr') {
            inputType = 'cliAddr';
            iputClass = ".ajaxInputCliAddr";
            apiType = 'remot';
        }

        let formData = new FormData();

        const input = document.querySelector(iputClass);

        //____________________________________НАЧАЛО генерация строки запроса_________________________
        const storId = document.querySelector('.storId');
        if (input.name == inputName || input.name == 'sender[title]') { 
            formData.append(input.name, input.value);
            formData.append('inputType', inputType);
            formData.append(storId.name, storId.value);
            if (inputType == 'showPos') {
                formData.append(storId.name, storId.value);
            }
        }

        let str = '?';
        formData.forEach((value, key) => {
            str += key + '=' + value + '&';
        });
        // str = encodeURIComponent(str);
        str = str.replace(/ /g, '%20');
        str.replace(/&+$/, '');

        let url = location.protocol + '//' + location.host + location.pathname + 'ajax/api.php' + str;
        if (event == 'cliAddr') {
            url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
        }

        //____________________________________КОНЕЦ генерация строки запроса_________________________
        getResourse(url, apiType, query)
            .then(data => setInputData(data, inputType))
            .catch(err => console.error(err));
    }


    //_________________________НАЧАЛО событие запрос от поля с адресом______________________
    if (inputFields) {
        inputFields.forEach((inputField) => {
            inputField.addEventListener('input', (e) => {
                if (inputField.value.length > 0) {
                    getInputData(inputField.name, 'addr');
                }
            });
        });
    }
    //_________________________КОНЕЦ событие запрос от поля с адресом______________________

    //_________________________НАЧАЛО событие запрос от поля с артикул для получения списка опций______________________
    if (inputFieldArt) {
        inputFieldArt.addEventListener('input', (e) => {
            if (inputFieldArt.value.length > 0) {
                getInputData(inputFieldArt.name, 'art');
            }
        });
    }
    //_________________________КОНЕЦ событие запрос от поля с артикул для получения списка опций______________________

     //_________________________НАЧАЛО событие запрос от поля адрес получателя для получения списка опций______________________
     if (inputFieldCliAddr) {
        inputFieldCliAddr.addEventListener('input', (e) => {
            if (inputFieldCliAddr.value.length > 0) {
                getInputData(inputFieldCliAddr.name, 'cliAddr', inputFieldCliAddr.value);
            }
        });
    }
    //_________________________КОНЕЦ событие запрос от поля адрес получателя для получения списка опций______________________

    //_________________________НАЧАЛО событие запрос получение параметров для вывода позиции_____________________
    addPositionButton.addEventListener('click', function(event) {
        errorMessage.style.display = 'none';
        getInputData(inputFieldArt.name, 'showPos')
    })
    //_________________________КОНЕЦ событие запрос получение параметров для вывода позиции_____________________

    async function getResourse(url, apiType, query) {
 
        let options;
        let token = "001640b171642d7dcb3c2eb3a20082ba00766578";
        if (apiType == 'local') {
            options = {
                method: "GET"
            }
        } else if (apiType == 'remot') {
            options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify({query: query, count: 6})
            }
        }

        const res = await fetch(`${url}`, options);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }
})
