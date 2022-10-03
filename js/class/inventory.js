export class Inventory {
    constructor() {
        this.inventoryMenu = "#inventory-menu"
        this.inventoryItems = "#inventory-items"
        this.inventoryBtn = "#lore"
        this.inventoryClose = "#inventory-close"
    }

    initInventory() {
        this.open()
        this.close()
    }

    open() {
        $(this.inventoryBtn).on("click", () => {
            $(this.inventoryMenu).fadeIn(400)
            this.getInventory("inventory-items")
        })
    }

    close() {
        $(this.inventoryClose).on("click", () => {
            $(this.inventoryMenu).fadeOut(400, () => {
                $(`#inventory-items`).html("")
            })
        })
    }

    getInventory(html) {
        $.ajax({
            type: "POST",
            url: "http://nabilot.alwaysdata.net/api/inventory/myInventory",
            // url: "https://shielded-sea-87437.herokuapp.com/api/inventory/myInventory",
            data: {
                pseudo: localStorage.getItem("pseudo"),
                password: localStorage.getItem("password"),
            },
            dataType: "json",
            success: function (response) {
                this.addAllBonus(response, html)
                this.choiceBonus(html)
            }.bind(this),
            error: (xhr, ajaxOptions, thrownError) => {
            }
        })
    }

    addAllBonus(allBonus, html) {
        const element = document.createElement('div');
        element.setAttribute('class', 'bonus-inventory-items')
        element.append('bonus-inventory')
        allBonus.forEach(item => {
            this.addBonus(item.imgUrl, item.quantity, item.product, item.description, item.productId, html)
        })
    }

    addBonus(imgLink, quantity, name, description, productId, html) {
        $(`#bonus-inventory-items`).append(
            `<div data-tooltip="${description}" style="background-image:url('${imgLink}');">
                <p>${name}</p>
                <h2>${quantity}</h2>
            </div>`
        )
        $(`#${html}`).append(
            `<button data-tooltip="${description}" style="background-image:url('${imgLink}');" id="items-btn" type="button" value="${productId}">
                <p>${name}</p>
                <h2>${quantity}</h2>
            </button>`
        )
        this.tooltip()
    }

    choiceBonus(html) {
        $(`#${html} button`).each((index, element) => {
            $(element).on("click", () => {
                this.game.client.sendBonusChoice(
                    $(element).attr("value")
                )
            })
        })
    }

    removeBonusChoice() {
        for (let grille = 1; grille <= 2; grille++) {
            $(`#grille${grille} img`).each((index, element) => {
                $(element)
                    .off("click")
                    .parent()
                    .removeClass("case-hover")
            })
        }
    }

    tooltip() {
        let tooltip;
        function showTooltip(anchorElem, html) {
            let tooltipElem = document.createElement('div');
            tooltipElem.className = 'tooltip';
            tooltipElem.innerHTML = html;
            document.body.append(tooltipElem);

            let coords = anchorElem.getBoundingClientRect();

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

    executionBtn() {
        this.selectBtn("bonus-inventory")
        this.selectBtn("skin-inventory")
        this.selectBtn("emot-inventory")
    }

    selectBtn(type) {
        $(`#${type}-btn`).on('click', () => {
            $("#bonus-inventory-items").fadeOut(400)
            $("#emots-inventory-items").fadeOut(400)
            $("#icons-inventory-items").fadeOut(400)
            $(`#${type}-items`).fadeIn(400)
        })
    }
}