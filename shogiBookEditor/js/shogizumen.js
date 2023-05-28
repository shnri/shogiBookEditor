/* 
 shogizumen.js ver.20170713 
 (c) maasa. | http://www.geocities.jp/ookami_maasa/shogizumen/
*/

(function (func) {
    if (typeof SSZumen == "undefined") {
        SSZumen = func;
        window.addEventListener("load", SSZumen, false);
    }
})(function (isFirstRun) {
    function svgavailable() {
        var dummy = document.createElement("div");
        dummy.innerHTML = "<svg/>";
        return dummy.firstChild && dummy.firstChild.viewBox != undefined;
    }
    if (!svgavailable()) {
        return;
    }

    var selector = ".shogizumen";
    var selectorJq = $(selector);
    var selectorTag = "pre";
    var defaultSize = 0;
    var minSize = 0;
    var maxSize = 0;
    var drawall = function (isFirstRun) {
        var elementList = document.querySelectorAll(selector);
        for (var i = 0; i < elementList.length; i++) {
            if (isFirstRun !== true) {
                if (selectorJq.eq(i).css("display") === "none") {
                    continue;
                }
            }
            var shogizumenClassElement = elementList[i];
            var shogizumen;
            if (shogizumenClassElement.tagName.toLowerCase() != selectorTag) {
                shogizumen = shogizumenClassElement.querySelector(selectorTag);
            } else {
                shogizumen = shogizumenClassElement;
                shogizumenClassElement = shogizumenClassElement.parentNode;
            }

            var zumenText = shogizumen.innerHTML;
            var zumenTypeElement = selectorJq
                .eq(i)
                .closest(".output-area")
                .find('input[name="input-zumen-type"]');
            if (
                zumenTypeElement.val() === "tsumeShogi" ||
                zumenTypeElement.prop("checked") // 旧設定用
            ) {
                zumenText = "詰将棋" + zumenText;
            } else if (zumenTypeElement.val() === "rotationDiagram") {
                zumenText = "反転" + zumenText;
            }
            var fill = "none";
            var re = /^背景色＝#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/gm;
            if ((result = re.exec(zumenText)) != null) {
                fill = "#" + result[1];
            }

            var ban = readzumen(zumenText);
            if (ban != false) {
                var zumenClass = selectorJq
                    .eq(i)
                    .parents(".zumen")
                    .attr("class");

                var shogizumenWidth = 216;
                var shogizumenHeight = 180;
                if (zumenClass.indexOf("medium-zumen") !== -1) {
                    shogizumenWidth = 240;
                    shogizumenHeight = 200;
                } else if (zumenClass.indexOf("large-zumen") !== -1) {
                    shogizumenWidth = 312;
                    shogizumenHeight = 260;
                } else if (zumenClass.indexOf("big-zumen") !== -1) {
                    shogizumenWidth = 432;
                    shogizumenHeight = 380;
                }

                shogizumen.style.display = "none";
                var newElement = svgdraw(
                    shogizumenWidth,
                    shogizumenHeight,
                    ban,
                    fill
                );
                var e = shogizumenClassElement.insertBefore(
                    newElement,
                    shogizumen
                );
                e.appendChild(shogizumen);
            }
        }
    };
    var HanSuuji = "123456789";
    var ZenSuuji = "１２３４５６７８９";
    var KanSuuji = "一二三四五六七八九";
    var KomaStr = "玉飛角金銀桂香歩玉龍馬金全圭杏と";
    var convMgRepeat = function (str) {
        var re = new RegExp("[" + ZenSuuji + KanSuuji + "]", "g");
        str = str.replace(re, function (a) {
            return HanSuuji.charAt((ZenSuuji + KanSuuji).indexOf(a) % 9);
        });
        str = str.replace("０", "0");
        str = str.replace(/十([1-9])/, "1$1");
        str = str.replace("十", "10");
        str = str.replace(/(.)(1?[0-9])/g, function (a, b, c) {
            for (var i = 0, s = ""; i < c; i++) {
                s += b;
            }
            return s;
        });
        return str;
    };
    var convKomaStr = function (str) {
        str = str.replace("王", "玉");
        str = str.replace("竜", "龍");
        str = str.replace("仝", "杏");
        str = str.replace("个", "と");
        return str;
    };
    var readzumen = function (text) {
        var result, cell, x, y, s, cal, i, re2;
        var ban = new Array(99);
        for (var i = 0; i < 95; i++) {
            ban[i] = 0;
        }
        ban[95] = "先手";
        ban[96] = "後手";
        ban[97] = -1; // 最終着手駒の位置
        ban[98] = text.slice(0, 3) === "詰将棋"; // trueなら詰将棋レイアウト
        ban[99] = text.slice(0, 2) === "反転";
        const isRotationDiagram = ban[99];
        var mgStrSente = "";
        var mgStrGote = "";
        // 例(後手の持駒：なし)
        // result[1] = 後手の
        // result[2] = なし
        var re = /([先下後上]手の)?持駒：([^\n]*)/gm;
        while ((result = re.exec(text)) != null) {
            if (/[後上]/.test(result[1]) !== isRotationDiagram) {
                mgStrGote = result[2]; // "後手" または "上手"
            } else {
                mgStrSente = result[2]; // "先手" または "下手"
            }
            // 上手と下手逆では？
        }

        // 用途不明
        re = /^([先下後上]手)：(.*)\n/gm;
        while ((result = re.exec(text)) != null) {
            result[2].replace(/^\s+/, "");
            result[2].replace(/(\s|　).*$/, "");
            if (/[後上]/.test(result[1])) {
                ban[96] = result[2];
            } else {
                ban[95] = result[2];
            }
        }

        y = 1;
        re = /^\|([^\n]*)/gm;
        var row;
        while ((row = re.exec(text)) != null) {
            // 盤面 1行取得
            row[1] = convKomaStr(row[1]);
            x = 9;
            re2 = new RegExp("([\\+\\-vV\\^\\s])(.)", "g");
            while ((cell = re2.exec(row[1])) != null) {
                // 例：v香
                // cell[1] = v
                // cell[2] = 香
                s = "vV-".indexOf(cell[1]) > -1 !== isRotationDiagram ? 2 : 0; //(2進数 10(後手) or 00(先手))
                if ((cal = KomaStr.indexOf(cell[2])) > -1) {
                    // 0:玉 8:玉
                    // 1:飛 9:龍
                    // 2:角 10:馬
                    // 3:金 11:金
                    // 4:銀 12:全
                    // 5:桂 13:圭
                    // 6:香 14:杏
                    // 7:歩 15:と
                    if (cal > 7) {
                        // 成駒
                        cal = cal - 8;
                        s = s | 1; // 後手の駒なら3(2進数11) 先手の駒なら1(01)
                    }
                    //xysAry[c]+=""+x+y+s;
                    ban[
                        (isRotationDiagram ? 10 - y : y) * 9 -
                            (isRotationDiagram ? 10 - x : x)
                    ] = s * 8 + cal + 1;
                }
                if (--x < 1) {
                    break;
                }
            }
            if (++y > 9) {
                break;
            }
        }
        if (y == 1) {
            return false;
        }
        mgStrSente = convMgRepeat(mgStrSente);
        for (i = 0; i < mgStrSente.length; i++) {
            if ((cal = KomaStr.indexOf(mgStrSente.charAt(i))) > 0) {
                ban[81 + cal - 1] += 1;
            }
        }
        mgStrGote = convMgRepeat(mgStrGote);
        for (i = 0; i < mgStrGote.length; i++) {
            if ((cal = KomaStr.indexOf(mgStrGote.charAt(i))) > 0) {
                ban[88 + cal - 1] += 1;
            }
        }
        re = /^手数＝\d+\s+[▲△▽]?(.)(.)(.*)まで/gm;
        if ((result = re.exec(text)) != null) {
            // 例(手数＝31  ▲５六歩  まで)
            // result[1] = "５"
            // result[2] = "六"
            var lastMove = -100;
            if ((cal = 0 + result[1]) > 0) {
                lastMove = 8 - cal;
            } else if ((cal = ZenSuuji.indexOf(result[1])) > -1) {
                lastMove = 8 - cal;
            }
            if ((row = 0 + result[2]) > 0) {
                lastMove += row * 9;
            } else if ((row = ZenSuuji.indexOf(result[2])) > 0) {
                lastMove += row * 9;
            } else if ((row = KanSuuji.indexOf(result[2])) > 0) {
                lastMove += row * 9;
            }
            ban[97] = isRotationDiagram ? 80 - lastMove : lastMove;
        }

        return ban;
    };

    var svgNS = "http://www.w3.org/2000/svg";
    var mincho = "Sawarabi Mincho";
    var sgm = 1;
    var scolor = "currentColor";

    var mgpack = function (v, ban) {
        var r = "";
        for (var i = 1; i < 8; i++) {
            var a = ban[81 + v * 7 + i - 1];
            if (a > 0) {
                r += KomaStr.charAt(i);
                if (a > 1) {
                    if (a > 10) {
                        r += "十";
                        a -= 10;
                    }
                    r += KanSuuji.charAt(a - 1);
                }
            }
        }
        if (r == "") {
            return "なし";
        }
        return r;
    };
    var mgtext = function (v, d, kx, ban) {
        const isRotationDiagram = ban[99];
        var g = d.createElementNS(svgNS, "g");
        var t =
            (v == 0) !== isRotationDiagram
                ? "☗" + ban[95] /* "先手" */ + "　"
                : "☖" + ban[96] /* "後手" */ + "　";
        if (ban[98]) {
            t = v == 0 ? "　持駒　" : "　　　";
        }
        if (!ban[98] || v === 0) {
            t += mgpack(v, ban);
        }

        for (var i = 0; i < t.length - sgm; i++) {
            var s = d.createElementNS(svgNS, "text");
            s.textContent = t.charAt(t.length - i - 1);
            s.setAttribute("font-family", mincho);
            s.setAttribute("font-size", (kx * 9) / 14);
            s.setAttribute("fill", scolor);
            s.setAttribute("text-anchor", "middle");
            s.setAttribute("x", 0);
            s.setAttribute("y", (-i * kx * 9) / 14);
            g.appendChild(s);
        }
        if (!ban[98]) {
            var s = d.createElementNS(svgNS, "polygon");
            var py = (-t.length * kx * 9) / 14;
            s.setAttribute(
                "points",
                "0," +
                    py +
                    " " +
                    kx * 0.23 +
                    "," +
                    (py + kx * 0.1) +
                    " " +
                    kx * 0.3 +
                    "," +
                    (py + kx * 0.6) +
                    " " +
                    kx * -0.3 +
                    "," +
                    (py + kx * 0.6) +
                    " " +
                    kx * -0.23 +
                    "," +
                    (py + kx * 0.1)
            );
            if ((v != 0) !== isRotationDiagram) {
                s.setAttribute("fill", "none");
            } else {
                s.setAttribute("fill", scolor);
            }
            s.setAttribute("stroke", scolor);
            s.setAttribute("stroke-width", kx / 25);

            g.appendChild(s);
        }
        //
        var r = t.length > 14 ? 14 / t.length : 1;
        if (v == 0) {
            g.setAttribute(
                "transform",
                "translate(" +
                    kx * 11.35 +
                    "," +
                    kx * 9.7 +
                    ") scale(1," +
                    r +
                    ")"
            );
        } else {
            g.setAttribute(
                "transform",
                "translate(" +
                    kx * 0.65 +
                    "," +
                    kx * 0.8 +
                    ") scale(-1," +
                    -r +
                    ")"
            );
        }
        return g;
    };

    var svgdraw = function (w, h, ban, fill) {
        var svg = document.createElementNS(svgNS, "svg");
        var lastMove = ban[97];
        const isRotationDiagram = ban[99];

        var kx = defaultSize;
        if (kx == 0) {
            kx = w / 12 < h / 10 ? Math.floor(w / 12) : Math.floor(h / 10);
            if (kx < minSize) {
                kx = minSize;
            }
            if (maxSize && kx > maxSize) {
                kx = maxSize;
            }
        }

        svg.setAttribute("width", kx * 12);
        svg.setAttribute("height", kx * 10);
        svg.style.verticalAlign = "bottom";
        var dx = Math.floor(kx * 1.25);
        var dy = Math.floor(kx * 0.75);

        var dp;
        if (window.devicePixelRatio && window.devicePixelRatio >= 2) {
            dp = 1 / 2;
        } else {
            dp = 1;
        }

        var gTag = document.createElementNS(svgNS, "g");

        var rectTag = document.createElementNS(svgNS, "rect");
        rectTag.setAttribute("x", dx);
        rectTag.setAttribute("y", dy);
        rectTag.setAttribute("width", kx * 9 + 1);
        rectTag.setAttribute("height", kx * 9 + 1);
        rectTag.setAttribute("stroke-width", 2);
        rectTag.setAttribute("stroke", scolor);
        rectTag.setAttribute("fill", fill);
        gTag.appendChild(rectTag);

        for (var i = 0; i < 9; i++) {
            if (i !== 0) {
                var lineY = document.createElementNS(svgNS, "line");
                var lineX = document.createElementNS(svgNS, "line");
                lineY.setAttribute("x1", i * kx + dx + dp / 2);
                lineY.setAttribute("x2", i * kx + dx + dp / 2);
                lineY.setAttribute("y1", dy + dp / 2);
                lineY.setAttribute("y2", dy + kx * 9 + dp / 2);
                lineY.setAttribute("stroke-width", dp);
                lineY.setAttribute("stroke", scolor);
                lineX.setAttribute("y1", i * kx + dy + dp / 2);
                lineX.setAttribute("y2", i * kx + dy + dp / 2);
                lineX.setAttribute("x1", dx + dp / 2);
                lineX.setAttribute("x2", dx + kx * 9 + dp / 2);
                lineX.setAttribute("stroke-width", dp);
                lineX.setAttribute("stroke", scolor);
                gTag.appendChild(lineY);
                gTag.appendChild(lineX);
            }
            var textY = document.createElementNS(svgNS, "text");
            var textX = document.createElementNS(svgNS, "text");
            textY.setAttribute("x", i * kx + dx + kx / 2);
            textY.setAttribute("y", dy - kx / 6);
            textY.setAttribute("font-family", mincho);
            textY.textContent = (
                isRotationDiagram
                    ? ZenSuuji.split("").reverse().join("")
                    : ZenSuuji
            ).charAt(8 - i);
            textY.setAttribute("font-size", kx * 0.4);
            textY.setAttribute("fill", scolor);
            textY.setAttribute("text-anchor", "middle");
            gTag.appendChild(textY);
            textX.setAttribute("x", dx + kx * 9 + kx * 0.35);
            textX.setAttribute("y", i * kx + dy + kx * 0.6);
            textX.textContent = (
                isRotationDiagram
                    ? KanSuuji.split("").reverse().join("")
                    : KanSuuji
            ).charAt(i);
            textX.setAttribute("font-size", kx * 0.4);
            textX.setAttribute("font-family", mincho);
            textX.setAttribute("fill", scolor);
            textX.setAttribute("text-anchor", "middle");
            gTag.appendChild(textX);
        }
        svg.appendChild(gTag);
        for (var i = 0; i < 81; i++) {
            if (ban[i] > 0) {
                var x = (i % 9) * kx + dx + kx / 2 + dp / 2;
                var y = Math.floor(i / 9) * kx + dy + kx / 2 + dp / 2;
                var gTag = document.createElementNS(svgNS, "g");

                var t = KomaStr.charAt((ban[i] - 1) & 15);
                var textk = document.createElementNS(svgNS, "text");
                textk.setAttribute("fill", scolor);
                if ("全圭杏".indexOf(t) != -1) {
                    var textk = document.createElementNS(svgNS, "text");
                    textk.setAttribute("font-size", kx * 0.82);
                    t = KomaStr.charAt((ban[i] - 1) & 7);
                    if (i == lastMove) {
                        textk.setAttribute("class", "szLastMove");
                    } else {
                        textk.setAttribute("font-family", mincho);
                    }
                    textk.setAttribute("text-anchor", "middle");
                    textk.setAttribute("dy", -kx * 0.09);
                    textk.textContent = "成";
                    gTag.appendChild(textk);
                    textk = document.createElementNS(svgNS, "text");
                    textk.setAttribute("dy", kx * 0.32 + kx * 0.41);
                    if (ban[i] > 16) {
                        gTag.setAttribute(
                            "transform",
                            "translate(" + x + "," + y + ") scale(-1,-0.5)"
                        );
                    } else {
                        gTag.setAttribute(
                            "transform",
                            "translate(" + x + "," + y + ") scale(1,0.5)"
                        );
                    }
                } else {
                    textk.setAttribute("dy", kx * 0.32);
                    if (ban[i] > 16) {
                        gTag.setAttribute(
                            "transform",
                            "translate(" + x + "," + y + ") scale(-1,-1)"
                        );
                    } else {
                        gTag.setAttribute(
                            "transform",
                            "translate(" + x + "," + y + ")"
                        );
                    }
                }
                textk.setAttribute("font-size", kx * 0.82);
                if (i == lastMove) {
                    textk.setAttribute("class", "szLastMove");
                } else {
                    textk.setAttribute("font-family", mincho);
                }
                textk.setAttribute("text-anchor", "middle");
                textk.textContent = t;

                gTag.appendChild(textk);
                svg.appendChild(gTag);
            }
        }

        var mg0 = mgtext(0, document, kx, ban);
        svg.appendChild(mg0);

        var mg1 = mgtext(1, document, kx, ban);
        svg.appendChild(mg1);

        var wrap = document.createElement("div");
        wrap.style.position = "relative";
        // wrap.style.width = kx * 12 + "px";
        wrap.style.height = kx * 10 + "px";
        wrap.style.overflow = "auto";
        (function (u) {
            u.onmouseover = function (e) {
                // this.childNodes[1].style.display = "block";
            };
            u.onmouseout = function (e) {
                this.childNodes[1].style.display = "none";
            };
        })(wrap);
        var btn = document.createElement("div");
        btn.style.position = "absolute";
        btn.style.right = 0 + "px";
        btn.style.top = 0 + "px";
        btn.style.zIndex = "9999";
        btn.style.width = "30px";
        btn.style.height = "16px";
        btn.style.borderRadius = "4px";
        btn.style.backgroundColor = "#CCC";
        btn.style.display = "none";
        btn.style.fontSize = "14px";
        btn.style.lineHeight = "1";
        btn.style.color = "black";
        btn.style.cursor = "pointer";
        btn.style.baseline = "middle";
        btn.title = "表示切替（局面図⇔kif形式）";
        btn.style.textAlign = "center";

        btn.innerHTML = "⇔";
        btn.onclick = function () {
            var d = this.parentNode;
            if (this.previousSibling.style.display == "none") {
                this.previousSibling.style.display = "";
                this.nextSibling.style.display = "none";
            } else {
                this.previousSibling.style.display = "none";
                this.nextSibling.style.display = "";
            }
        };
        wrap.appendChild(svg);
        wrap.appendChild(btn);
        return wrap;
    };
    drawall(isFirstRun);
});
