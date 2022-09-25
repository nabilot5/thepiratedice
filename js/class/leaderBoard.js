export class Leaderboard {
    constructor() {
        this.btnId = "#leaderboard-btn"
        this.leaderboardId = "#leaderboard"
        this.tableId = "#leaderboard-table"
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
                // url: "http://localhost:8080/api/rating/all",
                url: "https://shielded-sea-87437.herokuapp.com/api/rating/all",
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
        let html = `<tr>
                        <th class="table-pseudo">Pseudo</th>
                        <th class="table-elo">Elo</th>
                        <th class="table-pos">Position</th>
                    </tr>`

        datas.forEach((data, index) => {
            let styleClass = ""
            let myPosition

            if (data.pseudo === localStorage.getItem("pseudo")) {
                styleClass = ' class="color-or"'
                myPosition = index + 1

                $(this.playerPseudo).html(`Nom : ${data.pseudo}<br/>Position : ${myPosition}/${datas.length}<br/>Score : ${data.rating}`)
                // this.showMyPosition(datas.length, `Position : ${myPosition}/${datas.length}`)
                // $(this.playerElo).html(`Score : ${data.rating}`)
            }
            // data.pseudo === localStorage.getItem("pseudo") ? styleClass = ' class="color-or"' : null

            html += `<tr>
                        <td${styleClass}>${data.pseudo}</td>
                        <td${styleClass}>${data.rating}</td>
                        <td${styleClass}>${index + 1}</td>
                    </tr>`
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