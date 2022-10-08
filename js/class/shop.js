import { url_shopCategory, url_basicPurchase, url_playerInfos } from "../../config/url.config.js"

export class Shop {
    constructor() {
        this.tooltip()
        this.recoverDataPlayer()
    }

    recoverData(section) {
        $.ajax({
            type: "POST",
            url: url_shopCategory,
            data: { category: section },
            dataType: "json",
            success: function (allItems) {
                allItems.forEach(item => {
                    this.addItems(item.imgUrl, item.product, item.description, item.basicPrice, item.id)
                })
                this.purchaseWithBasicCoin()
            }.bind(this)
        })
    }

    showShop() {
        const section = ['gold', 'skin', 'icon', 'emot', 'bonus']
        section.forEach(element => {
            $(`#${element}-btn`).on('click', () => {
                $(`#content-items`).fadeOut(0)
                $(`#content-items`).empty()
                $(`#content-items`).fadeIn(1000)
                this.recoverData(element)
            })

        })
    }

    addItems(imgLink, name, description, price, productId) {
        if (productId == "6" || productId == "7") {
            $(`#content-items`).append(`
            <button id="items-btn" type="button" value="${productId}" style="background-image:url('${imgLink}');" data-tooltip="${description}">
                <p>${name}</p>
                <h3>${price} €</h3>
            </button>
            `)
        }
        else {
            $(`#content-items`).append(`
            <button  id="items-btn" type="button" value="${productId}" style="background-image:url('${imgLink}');" data-tooltip="${description}">
                <p>${name}</p>
                <h3>${price}<img id="coin-icone" src="https://ik.imagekit.io/mbo2hq52r/assets/coin_JK98uHaKwy.png?ik-sdk-version=javascript-1.4.3&updatedAt=1664045674332" alt=""></h3>
            </button>
            `)
        }

    }

    purchaseWithBasicCoin() {
        $(`#content-items button`).each((index, button) => {
            $(button).on("click", () => {
                this.recoverDataPlayer()
                const btnVal = $(button).val()
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
                    })
                }
            })
        })
    }

    recoverDataPlayer() {
        $.ajax({
            type: "POST",
            url: url_playerInfos,
            data: {
                pseudo: localStorage.getItem("pseudo"),
                password: localStorage.getItem("password"),
            },
            dataType: "json",
            success: function (response) {
                if (response.basicCoin > 999 && response.basicCoin < 999999) {
                    $(`#coin-stat-btn`).html(`${eval(Math.round(response.basicCoin / 1000))}K`)
                }
                else if (response.basicCoin > 999999) {
                    $(`#coin-stat-btn`).html(`${eval(Math.round(response.basicCoin / 1000000))}M`)
                }
                else {
                    $(`#coin-stat-btn`).html(`${response.basicCoin}`)
                }
            }.bind(this)
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

