<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
define("PAGE_PATH", $APPLICATION->GetCurDir());
$APPLICATION->SetTitle("Форма доставки");
$asset = \Bitrix\Main\Page\Asset::getInstance();
$asset->addCss(PAGE_PATH . '/css/style.css');
$asset->addJs(PAGE_PATH . '/main.js');
$asset->addJs(PAGE_PATH . '/ajax/ajax.js');

require_once(dirname(__DIR__).'/delivery_from_shop/controllers/generalFields.php');
require_once(dirname(__DIR__).'/delivery_from_shop/formHandler.php');


use Bitrix\Main\Application;
use Bitrix\Main\Web\Uri;
$request = Application::getInstance()->getContext()->getRequest();
$requestUri= $request->getRequestUri();

?>
<form action="<?php $requestUri?>" method="POST" id='form'>
    <div class="formWraper">
        <div class="formGroup DesktopFirstForm">
            <?php
            foreach ($arGeneralFields as $role => $arFields) {
                switch ($role) {
                    case 'sender':
                        $formTitle = 'Отправитель';
                        $formTClass = 'mainForm';
                        break;
                    case 'recipient':
                        $formTitle = 'Получатель';
                        $formTClass = 'recipientForm';
                        break;
                    case 'order_options':
                        $formTitle = 'Параметры заказа';
                        $formTClass = 'optionsForm';
                        break;
                }
                ?>
                <div class="<?=$formTClass?>">
                <h2><?= $formTitle ?></h2>
                <?php
                foreach ($arFields as $arField) {
                    if ($arField['type'] == 'checkbox') {
                        ?>
                        <div class="field fieldWraper">
                                <input  id="<?= $arField['class'] . $arField['name'] ?>" class="<?= $arField['class'] ?>" type="<?= $arField['type'] ?>" name="<?=$role?>[<?= $arField['name'] ?>]" value="<?= $arField['value'] ?>" <?= $arField['access'] ?>>
                                <label for="<?= $arField['class'] . $arField['name'] ?>" class="formFieldTitle checkboxWrapper"><?= $arField['title'] ?></label>
                        </div>
                    <?php
                    } else { 
                    ?>
                        <div class="fieldWraper">
                            <span class="formFieldTitle"><?= $arField['title'] ?></span>
                            <input class="field <?= $arField['class'] ?>" type="<?= $arField['type'] ?>" name="<?=$role?>[<?= $arField['name'] ?>]" value="<?= $arField['value'] ?>" <?= $arField['access'] ?>  <?= $arField['required'] ?>>
                            <?php
                            if ($arField['dataList']) {
                            ?>
                                <div class="dropdownList" id="<?= $arField['dataListID'] ?>">
                                </div>
                            <?php
                            }
                            ?>
                        </div>

                    <?php
                    }
                }
                ?>
                </div>
                <?php
            }
            ?>
            <input class="send button" type="submit" name="submit_btn" value="Отправить">
        </div>
        <div class="positions formGroup">
            <h2>Товарные позиции</h2>
            <div class="positionsWraper">
                <div class="fieldWraper positionsUnit allPositions">
                    <div>
                        <span class="formFieldTitle">Артикул для выбора товара</span>
                        <div class="inputWraper articleWrapper">
                            <input class="field article ajax ajaxInputArt" type="text" name="select_art">
                            <div class="button addPosition">
                                <span>Добавить товарную позицию</span>
                                <img src="/local/templates/shop/img/basket.svg" alt="добавить товарную позицию">
                            </div>
                        </div>
                        <div id="articleOptions">
                        </div>
                        <div class="errorWraper">
                            <span class="errorMessage"></span>
                        </div>
                        <div class="showPositions">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
