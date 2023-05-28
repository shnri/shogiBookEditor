$(function () {
    $(".custom-select").each(function () {
        var classes = $(this).attr("class"),
            id = $(this).attr("id"),
            name = $(this).attr("name");
        var template = '<div class="' + classes + '">';
        template +=
            '<span class="custom-select-trigger">' +
            $(this).attr("placeholder") +
            "</span>";
        template += '<div class="custom-options">';
        $(this)
            .find("option")
            .each(function () {
                template +=
                    '<span class="custom-option ' +
                    $(this).attr("class") +
                    '" data-value="' +
                    $(this).attr("value") +
                    '">' +
                    $(this).html() +
                    "</span>";
            });
        template += "</div></div>";

        $(this).wrap('<div class="custom-select-wrapper"></div>');
        $(this).hide();
        $(this).after(template);
    });
    var pageType = $.cookie("pageType");
    if (pageType !== "undefined") {
        customOptionEvent($("[data-value=" + pageType + "]"));
    }
    var zumenType = $.cookie("zumenType");
    if (zumenType !== "undefined") {
        customOptionEvent($("[data-value=" + zumenType + "]"));
    }
    $(".custom-option:first-of-type").hover(
        function () {
            $(this).parents(".custom-options").addClass("option-hover");
        },
        function () {
            $(this).parents(".custom-options").removeClass("option-hover");
        }
    );
    $(".custom-select-trigger").on("click", function () {
        $("html").one("click", function () {
            $(".custom-select").removeClass("opened");
        });
        $(this).parents(".custom-select").toggleClass("opened");
        event.stopPropagation();
    });
    $(".custom-option").on("click", function () {
        customOptionEvent($(this));
    });
});

function customOptionEvent(element) {
    $(element)
        .parents(".custom-select-wrapper")
        .find("select")
        .val($(element).data("value"));

    $.cookie("pageType", $(element).data("value"));
    $.cookie("zumenType", $(element).data("value"));
    $(element)
        .parents(".custom-options")
        .find(".custom-option")
        .removeClass("selection");
    $(element).addClass("selection");
    $(element).parents(".custom-select").removeClass("opened");
    $(element)
        .parents(".custom-select")
        .find(".custom-select-trigger")
        .text($(element).text());
}
