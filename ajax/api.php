<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");


use Bitrix\Catalog\StoreTable;

\Bitrix\Main\Loader::includeModule('catalog');

\Bitrix\Main\Loader::includeModule('iblock');


//_______________________________________________________Получить список складов_________________________
if (!empty($_GET['sender']['title'])) {
    $addrFilter = htmlspecialchars(trim($_GET['sender']['title']));
    $arStores = StoreTable::getList (
        [
            'select' => ["TITLE", "ADDRESS", "DESCRIPTION", "UF_STORE_NOT_PUBLIC_PHONE", 'ID'],
            'filter' => ['TITLE' => '%' . $addrFilter . '%'],
            'limit' => 6
        ])->fetchAll();

    foreach($arStores as $key => $store) {
        foreach ($store as $prop => $value) {
            if ($prop == "UF_STORE_NOT_PUBLIC_PHONE") {
                $store["PHONE"] = $value;
                unset($store[$prop]);
            }
        }
        $arStores[$key] = $store;
    }
    if ($_GET['inputType'] == 'addr') {
        echo(json_encode($arStores, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
    }
}


//_______________________________________________________Получить товар ар артикулу_________________________
if (!empty($_GET['select_art'])) {

    $articleFilter = htmlspecialchars(trim($_GET['select_art']));
    $positionLimit = 5;
    $arFilter = array(
        'IBLOCK_ID' => 91,
        'PROPERTY_ARTROZ' => '%' . $articleFilter . '%',
    );
    /* тут можно дописать PROPERTY_... - те которые нужны*/
    $arSelect = array(
        "ID",
        'IBLOCK_ID',
        'IBLOCK_SECTION_ID',
        "NAME",
        'PROPERTY_ARTROZ',
    );
    
    $res = CIBlockElement::GetList(array(), $arFilter, false, array("nTopCount"=>$positionLimit), $arSelect);
    $resPrope = CIBlockElement::GetList(array(), $arFilter, false, array("nTopCount"=>$positionLimit), $arSelect);
    
    while ($ob = $res->GetNextElement()) {
        $arFields[] = array_intersect_key($ob->GetFields(), array_flip(["ID", "NAME", 'PROPERTY_ARTROZ_VALUE']));
    }
    
    // $arResult = array_intersect_key($ob->GetFields(), array_flip(["ID", "NAME", 'PROPERTY_ARTROZ']));
    $allResProp = [];
    while ($arElement = $resPrope->GetNext()) {
        // Получаем свойства элемента
        $propertyCodes = ['DIMENSIONS_HEIGHT', 'DIMENSIONS_WIDTH', 'DIMENSIONS_LENGTH', 'DIMENSIONS_GROSS_WEIGHT'];
        $properties = CIBlockElement::GetProperty($arElement['IBLOCK_ID'], $arElement['ID'], [], false); // Замените на ваши коды свойств
    
        $resultProperties = [];
        while ($property = $properties->Fetch()) {
            $resultProperties[$property['CODE']] = $property['VALUE'];
        }
    
        // Выводим значения свойств
        foreach ($propertyCodes as $code) {
            if (isset($resultProperties[$code])) {
                $arElemProps[$code] = $resultProperties[$code];
            }
        }
        $allResProp[] = $arElemProps;
    }
    

    foreach ($arFields as $key => $value) {
        if ($allResProp[$key]) {
            $AllElemsProps[$key] = $arFields[$key] + $allResProp[$key];
        } else {
            $AllElemsProps[$key] = $arFields[$key];
        }
    }
    //_________________________________НАЧАЛО данные по остаткам___________________________
    if (!empty($_GET['sender']['id'])) {
        foreach ($AllElemsProps as $key => $position) {
            $storeRes = CCatalogStoreProduct::GetList(
                array("SORT" => "ASC"),
                array('STORE_ID' => htmlspecialchars(trim($_GET['sender']['id'])), 'PRODUCT_ID' => $position['ID']),
                false,
                false, 
                array("PRODUCT_ID", 'STORE_ID', 'AMOUNT')
            );
    
            while($arStoreParam = $storeRes->Fetch()){
                $amount = $arStoreParam['AMOUNT'];
            }
            if ($amount === NULL) {
                $AllElemsProps[$key]['AMOUNT'] = 0;
            } else {
                $AllElemsProps[$key]['AMOUNT'] = $amount;
            } 
        } 
    } else {
        foreach ($AllElemsProps as $key => $position) { 
            $AllElemsProps[$key]['AMOUNT'] = 0;
        }
        
    }
    //_________________________________КОНЕЦ данные по остаткам___________________________
    if ($_GET['inputType'] == 'article' || $_GET['inputType'] == 'showPos') {

        echo(json_encode($AllElemsProps, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
    }
}
