import { url_shopCategory, url_basicPurchase } from "../../config/url.config.js"

export class Shop {
    constructor() {
        this.bonusId = "bonus-items"
        this.purchaseWithCoinBtn = "#bonus-items button"

        this.executionBtn()
    }

    recoverData(section, html) {
        $.ajax({
            type: "POST",
            url: url_shopCategory,
            data: { category: section },
            dataType: "json",
            success: function (response) {
                this.addAllItems(response, html)
            }.bind(this)
        })
    }

    showShop() {
        this.recoverData("bonus", "bonus-items")
        this.recoverData("gold", 'coin-items')
        this.recoverData("emot", 'emots-items')
        this.recoverData("icon", 'icons-items')
        this.recoverData("skin", 'skin-items')
        this.recoverDataPlayer()
    }

    addAllItems(allItems, html) {
        const content = document.createElement('div')
        content.setAttribute('id', html)
        content.setAttribute('class', 'content-menu hide')
        allItems.forEach(item => {
            document.getElementById('bgPanel').append(content)
            this.addItems(item.imgUrl, item.product, item.description, item.basicPrice, item.id, html)
        })

        this.purchaseWithBasicCoin(html)
    }

    addItems(imgLink, name, description, price, productId, html) {
        if (html === 'coin-items') {
            $(`#${html}`).append(`
            <button id="items-btn" type="button" value="${productId}" style="background-image:url('${imgLink}');" data-tooltip="${description}">
                <p>${name}</p>
                <h3>${price} €</h3>
            </button>
            `)
        }
        else {
            $(`#${html}`).append(`
            <button  id="items-btn" type="button" value="${productId}" style="background-image:url('${imgLink}');" data-tooltip="${description}">
                <p>${name}</p>
                <h3>${price}<img id="coin-icone" src="https://ik.imagekit.io/mbo2hq52r/assets/coin_JK98uHaKwy.png?ik-sdk-version=javascript-1.4.3&updatedAt=1664045674332" alt=""></h3>
            </button>
            `)
        }
        this.tooltip()
    }

    purchaseWithBasicCoin(html) {
        $(`#${html} button`).each((index, element) => {
            $(element).on("click", () => {
                const btnVal = $(element).val()
                if (btnVal >= 3 && btnVal <= 5) {

                    $.ajax({
                        type: "POST",
                        url: url_basicPurchase,
                        data: {
                            pseudo: localStorage.getItem("pseudo"),
                            password: localStorage.getItem("password"),
                            productId: btnVal
                        },
                        dataType: "json",
                        success: function (response) {
                        },
                        error: (xhr, ajaxOptions, thrownError) => {
                        }
                    })
                }
            })
        })
    }


    recoverDataPlayer() {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/player/infos",
            data: {
                pseudo: localStorage.getItem("pseudo"),
                password: localStorage.getItem("password"),
            },
            dataType: "json",
            success: function (response) {
                $(`#coin-stat-btn`).attr('value', `${response.basicCoin}`)
            }.bind(this)
        })

    }

    executionBtn() {
        this.selectBtn("bonus")
        this.selectBtn("emots")
        this.selectBtn("icons")
        this.selectBtn("skin")
        this.selectBtn("coin")
    }

    selectBtn(type) {
        $(`#${type}-btn`).on('click', () => {
            $("#bonus-items").fadeOut(400)
            $("#emots-items").fadeOut(400)
            $("#icons-items").fadeOut(400)
            $("#skin-items").fadeOut(400)
            $("#coin-items").fadeOut(400)
            $(`#${type}-items`).fadeIn(400)
        })
    }

    tooltip() {
        let tooltip;
        function showTooltip(anchorElem, html) {
            let tooltipElem = document.createElement('div');
            tooltipElem.className = 'tooltip';
            tooltipElem.innerHTML = html;
            document.body.append(tooltipElem);

            let coords = anchorElem.getBoundingClientRect();

            // Position the tooltip in the center of the element
            let left = coords.left + (anchorElem.offsetWidth - tooltipElem.offsetWidth) / 2;
            if (left < 0) left = 0;

            let top = coords.top - tooltipElem.offsetHeight - 5;
            if (top < 0) top = coords.top + anchorElem.offsetHeight + 5;

            tooltipElem.style.left = left + 'px';
            tooltipElem.style.top = top + 'px';

            return tooltipElem;
        }

        document.onmouseover = function (event) {
            let ourElement = event.target.closest('[data-tooltip]');

            if (!ourElement) return;
            tooltip = showTooltip(ourElement, ourElement.dataset.tooltip);
        }

        document.onmouseout = function () {
            if (tooltip) {
                tooltip.remove();
                tooltip = false;
            }
        }

        document.onkeydown = function (evt) {
            // Sorting table
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            }

            if (isEscape) {
                $.each($('.tooltip'), function () {
                    $(this).remove();
                });
            }
        }
    }
}

