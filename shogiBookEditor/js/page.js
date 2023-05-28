function insertPage(pageType, outputElement, zumenType) {
    var page = $("<section>", { class: "page" });
    var inputZumenArea = $("<div>", { class: "input-zumen-area" });
    var outputArea = $("<div>", { class: "output-area" });
    var inputCommentArea = $("<div>", { class: "input-comment-area" });
    var outputAreaHeader = $("<div>", { class: "output-area-header" });
    outputArea.append(outputAreaHeader);
    switch (pageType) {
        case "verticalTextOnly1Lines":
        case "verticalTextOnly2Lines":
            inputCommentArea.append(inputComment(pageType));
            outputArea.append(outputComment(pageType));
            break;
        case "horizontalTextOnly":
            inputCommentArea.append(inputComment(pageType));
            $("<div>", { class: "output-answer-area" });
            outputArea.append($("<div>").append(outputComment(pageType, true)));
            break;
        case "nextMove":
            outputAnswerArea = $("<div>", { class: "output-answer-area" });
            outputQuestionArea = $("<div>", { class: "output-question-area" });
            outputAnswerArea
                .append(
                    $("<div>", { class: "flex-item" }).append(
                        $("<div>").append(outputZumen("small-zumen"))
                    )
                )
                .append(
                    $("<div>", { class: "flex-item" }).append(
                        outputComment(pageType, true)
                    )
                );

            outputQuestionArea
                .append(
                    $("<div>", { class: "flexCenter" }).append(
                        outputZumen("large-zumen", pageType)
                    )
                )
                .append(outputComment(pageType, true));

            outputArea.append(outputAnswerArea).append(outputQuestionArea);

            for (var i = 1; i <= 2; i++) {
                inputZumenArea.append(inputZumen());
                inputCommentArea.append(inputComment(pageType));
            }

            break;
        case "3zumen":
            outputZumenArea = $("<div>", { class: "output-zumen-area" });
            outputArea.append(outputZumenArea).append(outputComment(pageType));
            for (var i = 1; i <= 3; i++) {
                inputZumenArea.append(inputZumen());
                outputZumenArea.append(
                    $("<div>", { class: "flexCenter" }).append(
                        outputZumen("small-zumen")
                    )
                );
            }
            inputCommentArea.append(inputComment(pageType));
            break;

        case "3zumenGuide":
            for (var i = 1; i <= 3; i++) {
                inputZumenArea.append(inputZumen());
                outputArea.css("flex-wrap", "wrap").append(guideBlock());
                inputCommentArea.append(
                    $("<div>")
                        .append(
                            $("<textarea>", {
                                class: "input-comment-guidetitle",
                            })
                        )
                        .append(inputComment("guide"))
                );
            }
            break;

        case "2zumen":
            outputZumenArea = $("<div>", { class: "output-zumen-area" });
            outputArea.append(outputZumenArea).append(outputComment(pageType));
            for (var i = 1; i <= 2; i++) {
                inputZumenArea.append(inputZumen());
                outputZumenArea.append(
                    $("<div>")
                        .addClass("output-medium-zumen")
                        .append(outputZumen("medium-zumen"))
                );
            }
            inputCommentArea.append(inputComment(pageType));
            break;

        case "1zumen":
            inputZumenArea.append(inputZumen(pageType));
            var title = $("<div>").addClass("vertical-text output-node-title");
            outputArea
                .append(
                    $("<div>")
                        .addClass("flex-item")
                        .append(
                            $("<div>")
                                .addClass("zumen-1zumen")
                                .append(outputZumen("large-zumen"))
                        )
                        .append(outputComment(pageType))
                )
                .append($("<div>").addClass("flex-item").append(title));
            inputCommentArea.append(
                $("<input>", {
                    type: "text",
                    name: "input-node-title",
                    class: "input-node-title",
                    placeholder: "タイトル",
                })
            );
            inputCommentArea.append(inputComment(pageType));
            break;
        case "1zumenNotTitle":
            inputZumenArea.append(inputZumen(pageType));
            outputArea.append(
                $("<div>")
                    .addClass("flex-item")
                    .append(
                        $("<div>")
                            .addClass("zumen-1zumen")
                            .append(outputZumen("large-zumen"))
                    )
                    .append(outputComment(pageType))
            );
            inputCommentArea.append(inputComment(pageType));
            break;
        case "1zumenOnly":
            var title = $("<div>").addClass("output-1zumen-title");
            inputZumenArea.append(inputZumen());
            outputArea.append(
                $("<div>")
                    .addClass("flex-item output-area-inside")
                    .append($("<div>").append(title))
                    .append(
                        $("<div>")
                            .addClass("zumen-1zumen")
                            .append(outputZumen("big-zumen"))
                    )
            );

            inputCommentArea.append(
                $("<input>", {
                    type: "text",
                    name: "input-1zumen-title",
                    class: "input-1zumen-title",
                })
            );
            break;
        case "1zumenTreeDiagram":
            inputZumenArea.append(inputZumen(pageType));
            outputArea.append(
                $("<div>")
                    .addClass("flex-item")
                    .append(
                        $("<div>")
                            // .addClass("zumen-1zumen")
                            .append(outputZumen("small-zumen"))
                    )
                    .append(outputComment(pageType))
            );
            inputCommentArea.append(
                inputComment(
                    pageType,
                    "\n\n\n\n\n\n\n\n\n\n\n　　　　　　┌△３四歩\n　　　　　　│\n　┌▲７六歩┤\n　│　　　　│\n　│　　　　└△８四歩\n　│\n─┤\n　│\n　│\n　│\n　└▲２六歩　"
                )
            );
            break;
        case "4zumen":
            var title = $("<div>").addClass("output-1zumen-title");
            var outputZumenArea = $("<div>").addClass("output-area-4zumen");
            outputArea.append(title).append(outputZumenArea);
            outputZumenArea1 = $("<div>", { class: "output-zumen-area" });
            outputZumenArea2 = $("<div>", { class: "output-zumen-area" });
            outputZumenArea.append(outputZumenArea1).append(outputZumenArea2);
            inputCommentArea.append(
                $("<input>", {
                    type: "text",
                    name: "input-1zumen-title",
                    class: "input-1zumen-title",
                    placeholder: "タイトル",
                })
            );
            for (var i = 1; i <= 2; i++) {
                inputZumenArea.append(inputZumen());
                outputZumenArea1.append(
                    outputZumen("small-zumen").addClass("output-zumen-4zumen")
                );
                outputZumenArea2.append(
                    outputZumen("small-zumen").addClass("output-zumen-4zumen")
                );
                inputCommentArea.append(inputZumen());
            }
            break;
        case "6zumen":
            var outputZumenArea = $("<div>").addClass("output-area-6zumen");
            outputZumenArea1 = $("<div>");
            outputZumenArea2 = $("<div>");
            outputZumenArea.append(outputZumenArea1).append(outputZumenArea2);
            outputArea.append(outputZumenArea);
            for (var i = 1; i <= 3; i++) {
                inputZumenArea.append(inputZumen());
                outputZumenArea1.append(
                    $("<div>", { class: "flexCenter" }).append(
                        outputZumen("small-zumen").addClass(
                            "output-zumen-6zumen"
                        )
                    )
                );
                outputZumenArea2.append(
                    outputZumen("small-zumen").addClass("output-zumen-6zumen")
                );
                inputCommentArea.append(inputZumen());
            }
            break;
        case "2zumenOnly":
            for (var i = 1; i <= 2; i++) {
                var title = $("<div>").addClass(
                    "vertical-text output-2zumen-title"
                );
                inputZumenArea.append(inputZumen());
                outputArea
                    .append(
                        $("<div>")
                            .addClass("flex-item")
                            .append(
                                $("<div>").append(outputZumen("large-zumen"))
                            )
                    )
                    .append($("<div>").addClass("flex-item").append(title));
                inputCommentArea.append(
                    $("<input>", {
                        type: "text",
                        name: "input-2zumen-title",
                        class: "input-2zumen-title",
                    })
                );
            }

            break;
        case "2zumenTop":
            outputZumenArea = $("<div>", {
                class: "output-zumen-area-2 flex-item",
            });
            outputArea.append(outputZumenArea).append(outputComment(pageType));
            for (var i = 1; i <= 2; i++) {
                inputZumenArea.append(inputZumen());
                outputZumenArea.append(
                    $("<div>").append(outputZumen("small-zumen"))
                );
            }

            // outputArea.append(
            //     $("<div>")
            //         .addClass("flex-item")
            //         .append(
            //             $("<div>")
            //                 .addClass("zumen-1zumen")
            //                 .append(outputZumen("large-zumen"))
            //                 .append(outputZumen("large-zumen"))
            //         )
            //         .append(outputComment(pageType))
            // );
            inputCommentArea.append(inputComment(pageType));
            break;

        case "cover":
            outputArea.append(outputComment(pageType));
            inputCommentArea.append(
                $("<input>", {
                    type: "text",
                    name: "input-comment-cover",
                    class: "input-comment-cover",
                    placeholder: "タイトル",
                })
            );
            break;

        default:
            break;
    }

    var output =
        outputElement !== undefined
            ? $(outputElement.prop("outerHTML"))
            : outputArea;

    page.append(inputZumenArea).append(output).append(inputCommentArea);
    if (output.find('input[name="input-page-type"]').length === 0) {
        output.append(
            $("<input>", {
                type: "text",
                name: "input-page-type",
                value: pageType,
                style: "display: none;",
            })
        );
    }
    if (output.find('input[name="input-zumen-type"]').length === 0) {
        output.append(
            $("<input>", {
                type: "text",
                name: "input-zumen-type",
                value: zumenType,
                style: "display: none;",
            })
        );
    }

    // 選択状態の下に挿入する
    if ($(".ui-selected").length) {
        $(".ui-selected:last").after(page);
    } else {
        $("#book").append(page);
    }
}

function inputZumen() {
    var inputZumenHeader = $("<input>", {
        type: "text",
        name: "zumen-header",
        class: "input-zumen-header",
    });
    var inputshogizumen = $("<textarea>").addClass("zumen-textarea");
    var inputZumenFooter = $("<textarea>", {
        type: "text",
        name: "zumen-footer",
        class: "input-zumen-footer",
    });
    return $("<div>")
        .append(inputZumenHeader)
        .append(inputshogizumen)
        .append(inputZumenFooter);
}

function outputZumen(sizeClass, pageType) {
    var outputZumenHeader = $("<figcaption>").append(
        $("<span>", { class: "output-zumen-header" })
    );
    var outputshogizumen = $("<pre>").addClass("shogizumen");
    var outputZumenFooter = $("<figcaption>").append(
        $("<span>", { class: "output-zumen-footer" })
    );

    var outputZumen = $("<figure>", { class: "zumen" })
        .addClass(sizeClass)
        .append(outputZumenHeader)
        .append(outputshogizumen);

    if (pageType !== "nextMove") {
        outputZumen.append(outputZumenFooter);
    }

    return outputZumen;
}

function inputComment(className, placeholder) {
    return $("<textarea>", {
        placeholder: placeholder,
    }).addClass("input-comment-" + className);
}

//テキストを出力する領域
/**
 *
 * @param {*} className
 * @param {*} isHorizontal
 */
function outputComment(className, isHorizontal) {
    var div = isHorizontal
        ? $("<div>")
        : $("<div>", { class: "vertical-text" });
    return div.addClass("output-comment-" + className);
}

function guideBlock() {
    var comment = outputComment("guide");
    var title = outputComment("guidetitle");
    var guideBlock = $("<div>", { class: "guide-block" });
    var zumenCommentBlock = $("<div>", {
        class: "zumen-comment-block",
    });
    guideBlock
        .append(zumenCommentBlock.clone().append(outputZumen("small-zumen")))
        .append(zumenCommentBlock.clone().append(comment).append(title));
    return guideBlock;
}
