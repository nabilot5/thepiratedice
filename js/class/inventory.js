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
            this.getInventory()
        })
    }

    close() {
        $(this.inventoryClose).on("click", () => {
            $(this.inventoryMenu).fadeOut(400, () => {
                $(`${this.inventoryItems} ul`).html("")
            })
        })
    }

    getInventory() {
        $.ajax({
            type: "POST",
            // url: "http://localhost:8080/api/inventory/myInventory",
            url: "https://shielded-sea-87437.herokuapp.com/api/inventory/myInventory",
            data: {
                pseudo: localStorage.getItem("pseudo"),
                password: localStorage.getItem("password"),
            },
            dataType: "json",
            success: function (response) {
                this.addAllBonus(response)
                this.choiceBonus()
            }.bind(this),
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr)
                console.log(thrownError)
            }
        })
    }

    addAllBonus(allBonus) {
        let html = ""

        $(`${this.inventoryItems}`).html(html)

        allBonus.forEach(bonus => {
            html += this.addBonus(
                bonus.imgUrl,
                bonus.quantity,
                bonus.product,
                bonus.description,
                bonus.productId
            )
        })

        $(`${this.inventoryItems}`).append(html)
    }

    addBonus(imgLink, quantity, name, description, productId) {
        return `
            <button data-tooltip="${description}" style="background-image:url('${imgLink}');" id="items-btn" type="button" value="${productId}">
                <p>${name}</p>
                <h3>${quantity}</h3>
            </button>
        `
    }

    choiceBonus() {
        $("#inventory-items button").each((index, element) => {
            $(element).on("click", () => {
                this.game.client.sendBonusChoice(
                    $(element).attr("value")
                )
            })
        })
        this.tooltip()
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
}