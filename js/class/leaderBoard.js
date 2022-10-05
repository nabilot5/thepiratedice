import { url_allRating } from "../../config/url.config.js"
export class Leaderboard {
    constructor() {
        this.btnId = ".leaderboard-btn"
        this.leaderboardId = "#leaderboard"
        this.tableId = ".responsive-table"
        this.menuPrincipal = "#menu-principal"
        this.shop = "#shop"
        this.playerPseudo = "#leaderboard-player-pseudo"
        this.playerRating = "#leaderboard-player-rating"
        this.playerElo = "#leaderboard-player-elo"
    }

    init() {
        $(this.btnId).on("click", () => {
            $.ajax({
                type: "POST",
                url: url_allRating,
                success: function (response) {
                    this.add(response)

                    $(this.menuPrincipal).fadeOut(400)
                    $(this.shop).fadeOut(400)
                    $(this.leaderboardId).fadeIn(400)
                }.bind(this)
            })
        })
    }

    add(datas) {
        const table = $(this.tableId)
        let html = `
                    <li class="table-header">
                        <div class="col col-1">Pseudo</div>
                        <div class="col col-2">Elo</div>
                        <div class="col col-3">Position</div>
                    </li>`

        datas.forEach((data, index) => {
            let styleClass = ""
            let myPosition

            if (data.pseudo === localStorage.getItem("pseudo")) {
                myPosition = index + 1

                $(this.playerPseudo).html(`${data.pseudo}`)
                $(this.playerElo).html(`Elo : ${data.rating}`)
                this.showMyPosition(datas.length, myPosition)
            }
            data.pseudo === localStorage.getItem("pseudo") ? styleClass = ' class="color-or"' : null

            html += `
                    <li class="table-row">
                        <div class="col col-1" data-label="Job Id">${data.pseudo}</div>
                        <div class="col col-2" data-label="Customer Name">${data.rating}</div>
                        <div class="col col-3" data-label="Amount">${index + 1}</div>
                    </li>`
        })

        table.html(html)
    }

    getPseudo() {
        return $("#player-name").text()
    }

    getElo() {
        return $("#player-rating").text()
    }

    showMyPosition(totalPlayer, myPosition) {
        $(this.playerRating).html(`${myPosition}/${totalPlayer}`)
    }
}