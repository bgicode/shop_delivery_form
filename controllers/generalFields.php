<?php
$arGeneralFields = [
    'sender' => [
        [
            'title' => 'Магазин',
            'name' => "sender_name",
            'type' => 'text',
            'value' => 'Фирменный магазин POLARIS',
            'class' => 'store',
            'access' => 'readonly',
            'required' => 'required'

        ],
        [
            'title' => 'Адрес отправителя c номером',
            'name' => "title",
            'type' => 'text',
            'class' => 'ajaxInput',
            'dataList' => true,
            'dataListID' => 'addres',
            'required' => 'required'
        ],
        [
            'title' => 'Контаткный номер отправителя',
            'name' => "phone",
            'type' => 'tel',
            'class' => 'ajaxAutoload',
            'required' => 'required'
        ],
        [
            'title' => 'Адрес отправителя',
            'name' => "address",
            'type' => 'text',
            'class' => 'ajaxAutoload',
            'required' => 'required'
        ],
        [
            'title' => 'Как пройти',
            'name' => "description",
            'type' => 'text',
            'class' => 'ajaxAutoload',
        ],
        [
            'name' => "id",
            'type' => 'hidden',
            'class' => 'ajaxAutoload storId',
        ],
        [
            'title' => 'Номер заказа 1С/СРМ',
            'name' => "order_number",
            'type' => 'text',
            'required' => 'required'
        ],
    ],
    "recipient" => [
        [
            'title' => 'Получатель',
            'name' => "recipient_name",
            'type' => 'text',
            'required' => 'required'
        ],
        [
            'title' => 'Контактный номер получателя',
            'name' => "phone",
            'type' => 'tel',
            'required' => 'required'
        ],
        [
            'title' => 'Адрес получателя',
            'name' => "address",
            'type' => 'text',
            'required' => 'required',
            'class' => 'ajaxInputCliAddr',
            'dataList' => true,
            'dataListID' => 'CliAddres',
        ],
        [
            'title' => 'Подьезд, Этаж',
            'name' => "description",
            'type' => 'text'
        ],
        [
            'title' => 'Дополнительные комментарии',
            'name' => "add_comments",
            'type' => 'text'
        ],
    ],
    'order_options' => [
        [
            'title' => 'Желаемая дата доставки',
            'name' => "order_date",
            'type' => 'date',
            'required' => 'required'
        ],
        [
            'title' => 'Подьем на этаж',
            'name' => "lift_up",
            'type' => 'checkbox',
            'value' => 'yes',
            'class' => 'check'
        ],
        [
            'title' => 'Погрузочно\разгручозные работы ',
            'name' => "loading_unloading",
            'type' => 'checkbox',
            'value' => 'yes',
            'class' => 'check'
        ],
    ]
];
