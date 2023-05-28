const inOutClass = [
    "zumen-header",
    "zumen-footer",
    "comment",
    "node-title",
    "1zumen-title",
    "2zumen-title",
    "comment-guidetitle",
    "comment-guide",
    "comment-cover",
    "comment-1zumen",
    "comment-1zumenNotTitle",
    "comment-1zumenOnly",
    "comment-1zumenTreeDiagram",
    "comment-2zumen",
    "comment-2zumenOnly",
    "comment-2zumenTop",
    "comment-3zumen",
    "comment-4zumen",
    "comment-6zumen",
    "comment-nextMove",
    "comment-verticalTextOnly1Lines",
    "comment-verticalTextOnly2Lines",
    "comment-horizontalTextOnly",
    "comment-horizontalTextOnly",
];

const localStorageAutoSaveKye = "AutoSave";

// 自動保存
setInterval(function () {
    localStorage.setItem(localStorageAutoSaveKye, outputHtml());
}, 10000);

$(function () {
    // [保存]ボタン押下
    $("#saveBtn").on("click", function () {
        $("a#getLocal")[0].click();
    });
    $("#getLocal").on("click", function () {
        downloadText();
    });

    // [更新]ボタン押下
    // OPTIMIZE: ページ数が300ページくらいになると十数秒くらいかかる.
    $("#reloadBtn").on("click", function () {
        linkZumenNo();
        changeHeader();
        for (target of inOutClass) {
            if (target !== "zumen-header") {
                var output = $(".output-" + target);
                output.each(function (index, element) {
                    createPreview(index, $(".input-" + target), output);
                    titlePageNo(index, output);
                    coverPageNo(index, output);
                    pageNo(index, output);
                    referenceHeader(index, output);
                });
            }
        }
    });

    // [読込]ボタン押下
    $("#uploadBtn").on("click", function () {
        $('input[name="myfile"]').click();
    });

    var form = document.forms.myform;
    if (form !== undefined) {
        form.myfile.addEventListener("change", function (e) {
            var file = e.target.files[0];
            var fileName = file.name.replace(/.html/g, "");
            $("#fileName").val(fileName);
            document.title = fileName;

            // FileReaderのインスタンスを作成する
            var reader = new FileReader();

            // 読み込んだファイルの中身を取得する
            reader.readAsText(file);

            // ファイルの中身を取得後に処理を行う
            reader.addEventListener("load", function () {
                var loadHtml = $(reader.result);
                restore(loadHtml);
            });
        });
    }

    // [追加]ボタン押下
    $("#newpageBtn").on("click", function () {
        var pageType = $("select[name='pageType']").val();
        var zumenType = $("select[name='zumenType']").val();
        insertPage(pageType, undefined, zumenType);
        changeHeader();
    });

    // [削除]ボタン押下
    $("#deleteBtn").on("click", function () {
        if ($("#book").find(".ui-selected").length) {
            var result = confirm(
                "選択したページを削除してよろしいですか。\n※削除すると復元することはできません。"
            );
            if (result) {
                $(".ui-selected").remove();
                linkZumenNo();
                changeHeader();
            }
        } else {
            alert("削除するページを選択してください");
        }
    });

    // [ヘルプ]ボタン押下
    $("#helpBtn").on("click", function () {
        $("#helpDialog").dialog("open");
    });
    $("#helpDialog").dialog({
        autoOpen: false,
        modal: true,
        height: 800,
        width: 1200,
    });

    // [情報]ボタン押下
    $("#infoBtn").on("click", function () {
        $("#infoLink").click();
    });

    // オーバーレイクリックでダイアログを閉じる
    $(document).on("click", ".ui-widget-overlay", function () {
        $(".ui-dialog-titlebar-close").trigger("click");
    });

    // [設定]ボタン押下
    $("#configBtn").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $("nav").removeClass("open");
            $(".overlay").removeClass("open");
        } else {
            $(this).addClass("active");
            $("nav").addClass("open");
            $(".overlay").addClass("open");
        }
    });
    // オーバーレイクリックでメニューを閉じる
    $(".overlay").on("click", function () {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $("#configBtn").removeClass("active");
            $("nav").removeClass("open");
        }
    });

    // [設定] "図面タイプ" 変更イベント
    $("#zumenTypeCheckbox").on("change", function () {
        $("#zumenType").text($(this).prop("checked") ? "有効" : "無効");
        $.cookie("zumenType", $(this).prop("checked"));
    });
    // 設定値のcookie読み込み
    var zumenTypeCheckbox = $.cookie("zumenType");
    if (zumenTypeCheckbox !== undefined) {
        var isChecked = true;
        if (zumenTypeCheckbox === "false") {
            isChecked = false;
        }
        $("#zumenTypeCheckbox").prop("checked", isChecked).change();
    }

    // [設定] "図面ヘッダー括弧" 変更イベント
    $("#zumenHeaderBracketsCheckbox").on("change", function () {
        $("#zumenHeaderBrackets").text(
            $(this).prop("checked") ? "表示" : "非表示"
        );
        document.getElementById("output-zumen-header").disabled =
            !$(this).prop("checked");
        $.cookie("zumenHeaderBrackets", $(this).prop("checked"));
    });
    var zumenHeaderBrackets = $.cookie("zumenHeaderBrackets");
    if (zumenHeaderBrackets !== undefined) {
        var isChecked = true;
        if (zumenHeaderBrackets === "false") {
            isChecked = false;
        }
        $("#zumenHeaderBracketsCheckbox").prop("checked", isChecked).change();
    }

    // [設定] "縦書き→横書き" 変更イベント
    $("#horizontalWritingCheckbox").on("change", function () {
        $("#horizontalWriting").text(
            $(this).prop("checked") ? "横書き" : "無効"
        );
        document.getElementById("writing-mode-horizontal").disabled =
            !$(this).prop("checked");
        changeHeader();
    });

    // [設定] "ページ選択" 変更イベント
    $("#selectable").on("change", function () {
        $.cookie("selectable", $(this).prop("checked"));
        $("#book")
            .selectable($(this).prop("checked") ? "enable" : "disable")
            .sortable($(this).prop("checked") ? "enable" : "disable");

        $("#selectableLabel").text($(this).prop("checked") ? "有効" : "無効");
        if ($(this).prop("checked") === false) {
            $(".page").removeClass("ui-selected");
        }
    });
    // 設定値のcookie読み込み
    var selectable = $.cookie("selectable");
    if (selectable !== undefined) {
        var isChecked = true;
        if (selectable === "false") {
            isChecked = false;
        }
        $("#selectable").prop("checked", isChecked).change();
    }

    // [設定] "ページ選択" 変更イベント
    $("#headerviewcheckbox").on("change", function () {
        if ($("#headerviewcheckbox").prop("checked")) {
            $(".output-area-header").css("visibility", "visible");
            $("#headerview").text("表示");
        } else {
            $(".output-area-header").css("visibility", "hidden");
            $("#headerview").text("非表示");
        }
        $.cookie("headerview", $(this).prop("checked"));
    });
    // 設定値のcookie読み込み
    var headerview = $.cookie("headerview");
    if (headerview !== undefined) {
        var isChecked = true;
        if (headerview === "false") {
            isChecked = false;
        }
        $("#headerviewcheckbox").prop("checked", isChecked).change();
    }

    $(window).on("input", function (event) {
        if (form !== document.forms.myform) {
            return false;
        }
        var inputClass = "." + $(":focus").attr("class");
        var index = $(inputClass).index($(":focus"));
        // フォーカスが当たっている箇所をプレビューに転記
        if (inputClass === ".zumen-textarea") {
            var dstZumenElement = $(".zumen").eq(index);
            var dstZumen = dstZumenElement.find(".shogizumen");
            var srcZumen = $(".zumen-textarea").eq(index);
            var text = srcZumen.val();
            // 図面に変更があるときだけ出力図面を更新する
            if (dstZumen.text().trim() !== text.trim()) {
                dstZumenElement.html(outputZumen().children());

                $.when(dstZumenElement.find(".shogizumen").html(text)).done(
                    SSZumen
                );
                createPreview(
                    index,
                    $(".input-zumen-header"),
                    $(".output-zumen-header")
                );
                createPreview(
                    index,
                    $(".input-zumen-footer"),
                    $(".output-zumen-footer")
                );
            }
        } else {
            var outputClass = inputClass.replace(/input/g, "output");
            createPreview(index, $(inputClass), $(outputClass));
        }

        // (英数字_英数字)がoutputにあればspanタグに変換
        var outHeader = $(".output-zumen-header").eq(index);
        var headerTxt = outHeader.html();
        if (
            inputClass === ".zumen-textarea" ||
            inputClass === ".input-zumen-header"
        ) {
            var regex = /\((([a-zA-Z0-9]+_[a-zA-Z0-9]+))\)/g;
            if (headerTxt.match(regex)) {
                var incrementId = headerTxt
                    .match(regex)[0]
                    .replace("(", "")
                    .replace(")", "");
                var incrementClass = incrementId.split("_")[0];
                outHeader.html(
                    headerTxt.replace(
                        regex,
                        $("<span>", {
                            class: "header" + incrementClass,
                            id: "header" + incrementId,
                        }).prop("outerHTML")
                    )
                );
            }

            headerTxt = outHeader.html();
            if (headerTxt.match(/move/)) {
                var srcZumen = $(".zumen-textarea").eq(index).val();
                re = /^手数＝\d+\s+(.*)\s+まで/m;
                if (srcZumen.match(re)) {
                    move = srcZumen
                        .match(re)[1]
                        .trim()
                        .replace(/△/g, "☖")
                        .replace(/▲/g, "☗");
                    outHeader.html(
                        headerTxt.replace(
                            /move/g,
                            $("<span>", {
                                class: "lasthand",
                            })
                                .html(move)
                                .prop("outerHTML")
                        )
                    );
                }
            }
        }

        if (inputClass !== "input-zumen-header") {
            var outputClass = inputClass.replace(/input/g, "output");
            titlePageNo(index, $(outputClass));
            coverPageNo(index, $(outputClass));
            pageNo(index, $(outputClass));
            referenceHeader(index, $(outputClass));
        }
    });
});

/**
 * ヘッダ以外に(英数字_英数字)がoutputにあればspanタグに変換
 * 図面ヘッダの数字を参照して表示する
 *
 * @param {*} index
 * @param {*} outputClass jqueryオブジェクト
 */
function referenceHeader(index, outputClass) {
    var output = outputClass.eq(index);
    var comment = output.html();
    var regex = /\((([a-zA-Z0-9]+_[a-zA-Z0-9]+))\)/g;

    if (comment.match(regex)) {
        output.html(
            comment.replace(
                regex,
                $("<span>", {
                    class: "comment" + "$1",
                }).prop("outerHTML")
            )
        );
        for (var i = 0; i < comment.match(regex).length; i++) {
            var incrementId = comment
                .match(regex)
                [i].replace(")", "")
                .replace("(", "");
            const num = $("#header" + incrementId).text();
            $(".comment" + incrementId)
                .addClass("num") // 2桁,3桁数字を横文字にする
                .text(num);
        }
    }
}

function isString(obj) {
    return typeof obj == "string" || obj instanceof String;
}

/**
 * ヘッダ以外に(英数字_英数字)がoutputにあればspanタグに変換
 * 図面ヘッダの数字を参照して表示する
 *
 * @param {*} index
 * @param {*} outputClass jqueryオブジェクト
 */
function pageNo(index, outputClass) {
    var output = outputClass.eq(index);
    var comment = output.html();
    var regex = /\(((\w+_\w+))\)/g;
    var regexPage = /\(((\w+_\w+_page))\)/g;
    if (comment.match(regexPage)) {
        output.html(
            comment.replace(
                regexPage,
                $("<span>", {
                    class: "pageNo" + "$1",
                }).prop("outerHTML")
            )
        );
        for (var i = 0; i < comment.match(regexPage).length; i++) {
            var incrementId = comment
                .match(regexPage)
                [i].replace(")", "")
                .replace("(", "")
                .replace("_page", "");

            var pageNo = $("#header" + incrementId)
                .parents(".output-area")
                .children()
                .html()
                ?.split("　")?.[0];

            if (pageNo !== undefined) {
                $(".pageNo" + incrementId + "_page")
                    .addClass("num") // 2桁,3桁数字を横文字にする
                    .text(pageNo);
            }
        }
    }
}

/**
 * ヘッダ以外に(英数字_英数字)がoutputにあればspanタグに変換
 * 図面ヘッダの数字を参照して表示する
 *
 * @param {*} index
 * @param {*} outputClass jqueryオブジェクト
 */
function titlePageNo(index, outputClass) {
    var output = outputClass.eq(index);
    var comment = output.html();
    var regex = /\(((titlePage_[0-9]+))\)/g;
    if (comment.match(regex)) {
        output.html(
            comment.replace(
                regex,
                $("<span>", {
                    class: "$1",
                }).prop("outerHTML")
            )
        );
        for (var i = 0; i < comment.match(regex).length; i++) {
            const a = Number(
                comment
                    .match(regex)
                    [i].replace("(titlePage_", "")
                    .replace(")", "")
            );
            var pageNo =
                $(".page").index(
                    $(".output-node-title").eq(a).parents(".page")
                ) + 1;
            $(".titlePage_" + a)
                .addClass("num") // 2桁,3桁数字を横文字にする
                .text(pageNo);
        }
    }
}

/**
 * ヘッダ以外に(英数字_英数字)がoutputにあればspanタグに変換
 * 図面ヘッダの数字を参照して表示する
 *
 * @param {*} index
 * @param {*} outputClass jqueryオブジェクト
 */
function coverPageNo(index, outputClass) {
    var output = outputClass.eq(index);
    var comment = output.html();
    var regex = /\(((coverPage_[0-9]+))\)/g;
    if (comment.match(regex)) {
        output.html(
            comment.replace(
                regex,
                $("<span>", {
                    class: "$1",
                }).prop("outerHTML")
            )
        );
        for (var i = 0; i < comment.match(regex).length; i++) {
            const a = Number(
                comment
                    .match(regex)
                    [i].replace("(coverPage_", "")
                    .replace(")", "")
            );
            var pageNo =
                $(".page").index(
                    $(".output-comment-cover").eq(a).parents(".page")
                ) + 1;
            $(".coverPage_" + a)
                .addClass("num") // 2桁,3桁数字を横文字にする
                .text(pageNo);
        }
    }
}

function convertHeaderInputToOutput(text) {
    sashite_last = shogizumen.replace("  ９", "９").match(/  ((?:[^\s])+)/g);
    if (sashite_last && sashite_last_hide === false) {
        sashite_last = sashite_last[0].replace(/^\s+/g, "");
        elem_sashite_last.html(sashite_last);
    }

    return text
        .replace(/\r\n|\n|\r/g, "<br>")
        .replace(/△/g, "☖")
        .replace(/▲/g, "☗")
        .replace(/◇(.*?)<br>/g, "◇<b>$1</b><br>");
}

/**
 *  プレビュー表示用にhtmlタグに変換
 *
 * @param {*} text
 * @return {*}
 */
function convertInputToOutput(text) {
    if (isString(text)) {
        // 縦書きで数字を横にする
        let re = /%\d{2}%|%\d{3}%/;
        while (text.match(re) !== null) {
            text = text.replace(
                text.match(re)[0],
                '<span class="num">' +
                    text.match(re)[0].replace(/%/g, "") +
                    "</span>"
            );
        }

        return text
            .replace(/\r\n|\n|\r/g, "<br>")
            .replace(/△/g, "☖")
            .replace(/▲/g, "☗")
            .replace(/◇(.*?)<br>/g, "◇<b>$1</b><br>");
    }
}
/**
 * htmlタグなどをinput側に合わせて変換
 *
 * @param {*} text
 * @return {*}
 */
function convertOutputToInput(text) {
    return text
        .replace(/<span class="num">/g, "%")
        .replace(/<\/span>/g, "%")
        .replace(/(<br>|<br \/>)/g, "\n")
        .replace(/☖/g, "△")
        .replace(/☗/g, "▲")
        .replace(/◇<b>(.*?)<\/b>/g, "◇$1");
}

function createPreview(index, inputSelector, outputSelector) {
    var inputTxt = inputSelector.eq(index).val();
    outputSelector.eq(index).html(convertInputToOutput(inputTxt));
}

/**
 * output(プレビュー)の項目をinputに転記
 *
 * @param {*} inputObj jqueryオブジェクト
 * @param {*} outputObj jqueryオブジェクト
 */
function inputTextCopyPaste(inputObj, outputObj) {
    inputObj.each(function (index, element) {
        var output = outputObj.eq(index);
        var outputCopy = output.clone();

        var lastHand = outputCopy.find(".lasthand");
        if (lastHand.length > 0) {
            lastHand.replaceWith("move");
        }

        var incrementElement = outputCopy.find("[id^='header']");
        if (incrementElement.length > 0) {
            var id = incrementElement.attr("id");
            outputCopy.find("#" + id).replaceWith("(" + id + ")");
            // プレフィックス削除
            outputCopy.html(outputCopy.html().replace("header", ""));
        }

        outputCopy.find("[class^='comment']").each(function (index, element) {
            var commentClass = $(element).attr("class").replace(" num", "");

            outputCopy
                .find("." + commentClass)
                .replaceWith("(" + commentClass + ")");
            outputCopy.html(outputCopy.html().replace("(comment", "("));
        });

        outputCopy.find("[class^='pageNo']").each(function (index, element) {
            var commentClass = $(element).attr("class").replace(" num", "");

            outputCopy
                .find("." + commentClass)
                .replaceWith("(" + commentClass + ")");
            outputCopy.html(outputCopy.html().replace("(pageNo", "("));
        });

        outputCopy.find("[class^='coverPage']").each(function (index, element) {
            var commentClass = $(element).attr("class").replace(" num", "");

            outputCopy
                .find("." + commentClass)
                .replaceWith("(" + commentClass + ")");
        });

        outputCopy.find("[class^='titlePage']").each(function (index, element) {
            var commentClass = $(element).attr("class").replace(" num", "");

            outputCopy
                .find("." + commentClass)
                .replaceWith("(" + commentClass + ")");
        });

        $(element).val(convertOutputToInput(outputCopy.html()));
    });
}

function setBlobUrl(id, content) {
    // 指定されたデータを保持するBlobを作成する。
    var blob = new Blob([content], { type: "application/x-msdownload" });

    // Aタグのhref属性にBlobオブジェクトを設定し、リンクを生成
    window.URL = window.URL || window.webkitURL;
    $("#" + id).attr("href", window.URL.createObjectURL(blob));
    $("#" + id).attr("download", "tmp.txt");
}

/**
 * 以下のとき、読み込んだhtmlをテキストエリアに転記
 * 1.[読込]ボタン押下
 * 2.画面表示時の復元
 *
 * @param {*} html
 */
function restore(html) {
    var isFirstRun = $(".shogizumen").length === 0;

    var outputArea = html.find(".output-area");
    ($(".ui-selected").length
        ? $(outputArea.get().reverse()) // 選択状態の下に挿入する場合は逆順に処理
        : outputArea
    ).each(function (index, element) {
        var jqElement = $(element);
        pageType = jqElement.find('input[name="input-page-type"]').val();
        zumenType = jqElement.find('input[name="input-zumen-type"]').val();
        insertPage(pageType, jqElement);
    });

    $.when(inputTextCopyPaste($(".zumen-textarea"), $(".shogizumen"))).done(
        SSZumen(isFirstRun)
    );
    // 読み込んだファイルの内容をテキストエリアに転記
    for (target of inOutClass) {
        inputTextCopyPaste($(".input-" + target), $(".output-" + target));
    }
}

/**
 *プレビューのHTMLを取得
 *
 * @return jQueryオブジェクト(プレビューのHTML)
 */
function outputHtml() {
    var book = $("#book").clone();
    book.find(".zumen").each(function (index, element) {
        var zumen = $(element).find(".shogizumen").html();
        var zumenHeader = $(element).find(".output-zumen-header").html();
        var zumenFooter = $(element).find(".output-zumen-footer").html();

        $(element).html(outputZumen().children());
        $(element).find(".shogizumen").html(zumen);
        $(element).find(".output-zumen-header").html(zumenHeader);
        $(element).find(".output-zumen-footer").html(zumenFooter);
    });
    book.find("[class^='input-']").each(function (index, element) {
        $(element).remove();
    });
    var outputHtml = $("<html>")
        .append($("<head>").append($("#header").html()))
        .append($("<body>").append(book.prop("outerHTML")))
        .prop("outerHTML");
    return outputHtml;
}

function downloadText() {
    const title =
        ($("#fileName").val() === "" ? "book" : $("#fileName").val()) + ".html";
    const blobType = "text/html";
    const linkTagId = "getLocal";
    var linkTag = document.getElementById(linkTagId);
    var linkTagAttr = ["href", "download"];

    var stringObject = new Blob([outputHtml()], { type: blobType });
    var objectURL = window.URL.createObjectURL(stringObject);
    var UA = window.navigator.userAgent.toLowerCase();
    if (UA.indexOf("msie") != -1 || UA.indexOf("trident") != -1) {
        window.navigator.msSaveOrOpenBlob(stringObject, title);
    } else {
        linkTag.setAttribute(linkTagAttr[0], objectURL);
        linkTag.setAttribute(linkTagAttr[1], title);
    }
}

function changeHeader() {
    if ($("#headerviewcheckbox").prop("checked")) {
        $(".output-area-header").css("visibility", "visible");
    } else {
        $(".output-area-header").css("visibility", "hidden");
    }
    var cover = "";
    var title = "";
    var isHorizontal = $("#horizontalWritingCheckbox").prop("checked");

    $(".output-area").each(function (index, element) {
        var header = $(element).find(".output-area-header");
        if (header.length === 0) {
            var outputAreaHeader = $("<div>", { class: "output-area-header" });
            $(element).prepend(outputAreaHeader);
        }
    });
    $(".output-area-header").each(function (index, element) {
        var pageNo = index + 1;
        var justifyContent =
            (pageNo % 2 === 1 && isHorizontal) || // 横書きは奇数ページが右上
            (pageNo % 2 === 0 && !isHorizontal) // 縦書きは偶数ページが右上
                ? "flex-end"
                : "flex-start";
        $(element).css("justify-content", justifyContent);

        var coverElement = $(element)
            .parent()
            .children(".output-comment-cover");
        var titleElement = $(element).parent().find(".output-node-title");

        if (coverElement.length > 0) {
            cover = coverElement.text();
            title = "";
        }
        if (titleElement.length > 0) {
            title = titleElement.text();
        }
        var text = pageNo;
        if (justifyContent === "flex-start" && !isHorizontal) {
            text += "　";

            if (title !== "" && cover !== "") {
                text += cover + "　/　" + title;
            } else if (title === "") {
                text += cover;
            } else if (cover === "") {
                text += title;
            }
        } else if (justifyContent === "flex-end" && isHorizontal) {
            var textCover = "";

            if (title !== "" && cover !== "") {
                textCover = cover + "　/　" + title;
            } else if (title === "") {
                textCover = cover;
            } else if (cover === "") {
                textCover = title;
            }
            text = textCover + "　" + pageNo;
        }

        if (coverElement.length > 0) {
            text = "";
        }

        $(element).text(text);
    });
}

/**
 * 図面番号を連番にする
 * 図面番号を参照できるようにする
 */
function linkZumenNo() {
    var headerNameArray = [];
    $("[class^='header']").each(function (index, element) {
        jqElement = $(element);
        var className = jqElement.attr("class").replace(" num", "");
        if (headerNameArray.includes(className)) {
            return true;
        }
        headerNameArray.push(className);
    });

    const numList = {
        1: "１",
        2: "２",
        3: "３",
        4: "４",
        5: "５",
        6: "６",
        7: "７",
        8: "８",
        9: "９",
    };
    headerNameArray.forEach(function (className) {
        var zumenNo = 0;

        $("." + className).each(function (index, element) {
            var jqElement = $(element);
            var incrementId = jqElement.attr("id");
            //var first = $("[id=" + incrementId + "]").first();
            var first = $("#" + incrementId);
            if (jqElement.get(0) != first.get(0)) {
                jqElement.text(first.text());
            } else {
                zumenNo++;
                $("#" + incrementId)
                    .addClass("num")
                    .text(zumenNo < 10 ? numList[zumenNo] : zumenNo);
            }
        });
    });
    $("[class*='output-comment']").each(function (index, element) {
        $(element)
            .find("[class^='comment']")
            .each(function (index, element) {
                var incrementId = $(element)
                    .attr("class")
                    .replace("comment", "");
                $(".comment" + incrementId).each(function (index, element) {
                    $(element).text($("#header" + incrementId).text());
                });
            });
    });
}
