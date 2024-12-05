if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
window.onload = function()
{
    const addrInput = document.querySelector(".ajaxInput"); //поле ввода адреса с номером article 
    const artInput = document.querySelector(".article");
    const cliAddrInput = document.querySelector(".ajaxInputCliAddr"); //поле адреса клинента
    const select = document.getElementById('addres');
    const selectCli = document.getElementById('CliAddres'); //поля выборв адреса клиента
    const selectArt = document.getElementById('articleOptions'); //поля выбора артикула
    const autoloadFields = document.querySelectorAll(".ajaxAutoload"); //поля для автозагрузки данных
    const form = document.getElementById('form');
    const mainForm = document.querySelector('.mainForm');
    const positionForm = document.querySelector('.positions');

    function handleMediaQuery() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            // Действие для экранов меньше 768px
            mainForm.parentNode.insertBefore(positionForm, mainForm.nextSibling);
        } else {
            // Действие для экранов больше 768px
            document.querySelector('.formWraper').appendChild(positionForm);
        }
    }

    handleMediaQuery();
    window.addEventListener("resize", handleMediaQuery);

    //________________________НАЧАЛО Отслеживание кликов по опциям(подсказкам)_________________________
    select.addEventListener('mousedown', function(event) {
        if (event.target.classList.contains('options')) { // Проверяем, что кликнули именно по опции
            isOptionClicked = true; // Устанавливаем флаг, если кликнули на опцию
        }
    });

    selectCli.addEventListener('mousedown', function(event) {
        if (event.target.classList.contains('options')) { // Проверяем, что кликнули именно по опции
            isOptionClicked = true; // Устанавливаем флаг, если кликнули на опцию
        }
    });

    selectArt.addEventListener('mousedown', function(event) {
        if (event.target.classList.contains('options')) { // Проверяем, что кликнули именно по опции
            isOptionClicked = true; // Устанавливаем флаг, если кликнули на опцию
        }
    });

    let isOptionClicked = false;

     //________________________КОНЕЦ Отслеживание кликов по опциям(подсказкам)_________________________

        form.addEventListener('submit', function(event) {
            const position = document.querySelector('.position');
            const errorMessage = document.querySelector('.errorMessage');

           
            if (!position) {
                errorMessage.style.display = 'inline';
                errorMessage.innerHTML = 'Не добавлены товарные позиции';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                event.preventDefault(); 
            } else {
                errorMessage.style.display = 'none';
            }
        });

    

    const positionContainer = document.querySelector('.showPositions');

//_________________________________начало Изменение полей формы __________________
    //________________________________чало условия скрытия опций при пустом поле________
    addrInput.addEventListener('input', evt => {
        if (addrInput.value.length == 0) {
            select.style.display = 'none';
        }
      })

    artInput.addEventListener('input', evt => {
        if (artInput.value.length == 0) {
            selectArt.style.display = 'none';
        }
    })

    cliAddrInput.addEventListener('input', evt => {
        if (cliAddrInput.value.length == 0) {
            selectCli.style.display = 'none';
        }
    })
    //________________________________КОНЕЦ условия скрытия опций при пустом поле________

    //________________________________НАЧАЛО условия скрытия опций при потери фокуса________

    addrInput.addEventListener('blur', function() {
        if (!isOptionClicked) {
            select.style.display = 'none'; // Скрываем селектор, если не было клика на опцию
        }
        // Сбрасываем флаг
        isOptionClicked = false;
    });

    artInput.addEventListener('blur', function() {
        if (!isOptionClicked) {
            selectArt.style.display = 'none'; // Скрываем селектор, если не было клика на опцию
        }
        // Сбрасываем флаг
        isOptionClicked = false;
    });

    cliAddrInput.addEventListener('blur', function() {
        if (!isOptionClicked) {
            selectCli.style.display = 'none'; // Скрываем селектор, если не было клика на опцию
        }
        // Сбрасываем флаг
        isOptionClicked = false;
    });

    //________________________________КОНЕЦ условия скрытия опций при потери фокуса________

    autoloadFields.forEach(field => {
        field.readOnly = true;
    });

//_________________________________конец Изменение полей формы__________________ 


 //_________________________________________Начало удаление поззиции_____________________
    positionContainer.addEventListener('click', function(event) {
        if (event.target.closest('.deletePosition')) {
            const positionUnit = event.target.closest('.position');
            if (positionUnit) {
                positionUnit.remove();
            } else {
                console.error('НЕ УДАЛИЛОСЬ');
            }

            const allPositions = document.querySelectorAll(".position");

            
            allPositions.forEach((position, index) => {
                const inputs = position.querySelectorAll('input');

                position.querySelector('.positionFieldsWraper > .positionTitleWraper > .positionTitle').innerHTML = 'Товар ' + (index + 1);
                let positionIndex = index;
                inputs.forEach(input => {
                    // Получаем текущее значение name
                    const currentName = input.getAttribute('name');
                    
                    
                    // Используем регулярное выражение для замены
                    const newName = currentName.replace(/positions\[\d+\]\[(.+?)\]/, `positions[${positionIndex}][$1]`);
      
                    // Устанавливаем новое значение name
                    input.setAttribute('name', newName);
                });

            });
        }
    });
//_________________________________________Конец удаление поззиции_____________________
}
