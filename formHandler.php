<?php
include_once('SendMailSmtpClass.php');

function sanitizeArray($array) {
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            $array[$key] = sanitizeArray($value);
        } else {
            $array[$key] = htmlspecialchars(trim($value));
        }
    }
    return $array;
}

function MailSend(string $body, string $mailFrom, string $mailTo, string $subject, object $smtp): string
{
    $headers = "From: $mailFrom\r\n";
    $headers .= "To: $mailTo\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    
    if ($smtp->send($mailTo, $subject, $body, $headers)) {
        $result = "Сообщение отправлено";
    } else {
        $result = "Сообщение не было отправлено";
    }

    return $result;
}

function Message(string $name, $arResult)
{
    ob_start();
    ?>
    <snap>Данные о доставки от <?=$name?></snap><br>
    <table cellspacing="0" cellpadding="0" width="50%">
        <tr>
            <td>
                <?php
                foreach ($arResult as $title => $arformFields) {
                    ?>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center">
                                <span style="padding: 5px"><strong><?= $title ?></strong></span>
                            </td>
                        </tr>
                    </table>
                    <table width="100%" border="2" cellspacing="0" cellpadding="0">
                        <?php
                        foreach ($arformFields as $fieldName => $fieldValue) {
                            ?>
                            <tr>
                                <td style="background-color: #f0f1f3;" bgcolor="#f0f1f3">
                                    <?php
                                    if (is_numeric($fieldName)) {
                                        ?>
                                        <strong><span style="padding: 5px"><?= $fieldName + 1 ?></span></strong>
                                        <?php
                                    } else {
                                        ?>
                                        <span style="padding: 5px"><?= $fieldName ?></span>
                                        <?php
                                    }
                                    ?>
                                </td>
                                <td>
                                <?php
                                if (!is_array($fieldValue)) {
                                    ?>
                                        <span style="padding: 5px"><?= $fieldValue ?></span>
                                    <?php
                                } else {
                                    ?>
                                    <table width="100%" border="1" cellspacing="0" cellpadding="0">
                                        <?php
                                        foreach ($fieldValue as $paramTitle => $value) {
                                            ?>
                                            <tr>
                                                <td width="20%" style="background-color: #f0f1f3;" bgcolor="#f0f1f3">
                                                    <span style="padding: 5px"><?= $paramTitle ?></span>
                                                </td>
                                                <td>
                                                    <span style="padding: 5px"><?= $value ?></span>
                                                </td>
                                            </tr>
                                            <?php
                                        }
                                        ?>
                                    </table>
                                    <?php
                                }
                                ?>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </table>
                    <?php 
                }
                ?>
            </td>
        </tr>
    </table>
    <?php
    return ob_get_clean();
}

function translite($arLang, $array) {
    foreach ($array as $key => $value) {
        if (array_key_exists($key, $arLang)) {
            $newKey = $arLang[$key];
            unset($array[$key]);
            $array[$newKey] = $value;
            $key = $newKey;
        }
        if (is_array($array[$key])) {
            $array[$key] = translite($arLang, $array[$key]);
        }
    }
    return $array;
}

if ($_POST['submit_btn']) {

    $arPost = sanitizeArray($_POST);
    $arPost["order_options"]["order_date"] = date('d.m.Y', strtotime($arPost["order_options"]["order_date"]));
    unset($arPost['sender']['title']);
    unset($arPost['sender']['id']);
    unset($arPost['submit_btn']);
    unset($arPost['select_art']);

    $arLang = [
        'sender' => "Отправитель",
        'sender_name' => 'Магазин',
        'order_number' => 'Номер заказа',
        'recipient' => 'Получатель',
        'recipient_name' => 'Клиент',
        'order_options' => 'Параметры заказа',
        'positions' => 'Позиции',
        'phone' => "Телефон",
        'address' => "Адрес",
        'description' => 'Как пройти',
        'add_comments' => 'Коментарий',
        'order_date' => 'Дата доставки',
        'lift_up' => 'Подьем на этаж',
        'loading_unloading' => 'Погрузочно\разгручозные работы',
        'articul' => 'Артикул',
        'product_name' => 'Название',
        'height' => 'Высота',
        'width' => 'Ширина',
        'lenght' => 'Длина',
        'weight' => 'Вес',
        'quantity' => 'Количество'
    ];
    
    $arResult = translite($arLang, $arPost);

    $site = $_SERVER['HTTP_HOST'];

    $subject = "С сайта: $site отправлено сообщение";

    $username = "#";
    $password = "#";
    $host = "smtp.mailsnag.com";
    $port = "2525";

    $smtp = new SendMailSmtpClass($username, $password, $host, $mailFrom, $port);

    $name = trim($_POST['sender']['sender_name']);
    $email = 'store@mai.test';
    $rcptName = 'Сотрудник';
    $rcptEmail = 'test@yandex.ru';

    $body = Message($name, $arResult);
    echo $body;
    $send = MailSend($body, $email, $rcptEmail, $subject, $smtp);
}

