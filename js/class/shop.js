export class Shop {
    constructor() {
        this.bonusId = "#bonus-items"
        this.purchaseWithCoinBtn = "#bonus-items button"
    }

    showBonus() {
        $.ajax({
            type: "POST",
            // url: "http://localhost:8080/api/shop/category",
            url: "https://shielded-sea-87437.herokuapp.com/api/shop/category",
            data: { category: "Bonus" },
            dataType: "json",
            success: function (response) {
                this.addAllBonus(response)
            }.bind(this)
        })
    }

    addAllBonus(allBonus) {
        allBonus.forEach(bonus => {
            this.addBonus(
                bonus.imgUrl,
                bonus.product,
                bonus.description,
                bonus.basicPrice,
                bonus.id
            )
        })

        this.purchaseWithBasicCoin()
    }

    addBonus(imgLink, name, description, price, productId) {
        $(`${this.bonusId}`).append(`
            <button data-tooltip="${description}" style="background-image:url('${imgLink}');" id="items-btn" type="button" value="${productId}">
                <p>${name}</p>
                <h3>${price}<img style="width:10%;margin-bottom: -3.2%;" src="https://ik.imagekit.io/mbo2hq52r/assets/coin_JK98uHaKwy.png?ik-sdk-version=javascript-1.4.3&updatedAt=1664045674332" alt=""></h3>
            </button>
        `)
        this.tooltip()
    }

    purchaseWithBasicCoin() {
        $(this.purchaseWithCoinBtn).each((index, element) => {
            $(element).on("click", () => {
                const btnVal = $(element).val()

                $.ajax({
                    type: "POST",
                    // url: "http://localhost:8080/api/shop/basicPurchase",
                    url: "https://shielded-sea-87437.herokuapp.com/api/shop/basicPurchase",
                    data: {
                        pseudo: localStorage.getItem("pseudo"),
                        password: localStorage.getItem("password"),
                        productId: btnVal
                    },
                    dataType: "json",
                    success: function (response) {
                        console.log("achat validé");
                    },
                    error: (xhr, ajaxOptions, thrownError) => {
                        console.log(xhr)
                        console.log(thrownError)
                    }
                })
            })
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

