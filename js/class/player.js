import { Inventory } from "./inventory.js"
export class Player extends Inventory {
    constructor(game, htmlTab, id) {
        super()
        this.game = game
        this.otherPlayer = null
        this.htmlTab = htmlTab
        this.id = id
        this.name
        this.nbCol = 3
        this.nbColCase = 3
    }

    refreshColumn(columnId) {
        this.sortColumn(columnId).forEach((dice, nbCase) => {
            let imgSrc = "#"
            let dataSet = "null"

            if (dice !== "null") {
                imgSrc = `https://ik.imagekit.io/iq52ivedsj/assets/dices/Dice${dice}.png?ik-sdk-version=javascript-1.4.3`
                dataSet = dice
            }

            const imgCase = $(`#player${this.id}-col${columnId}-case-${nbCase + 1} img`)

            imgCase.attr("data-value", dataSet)
            imgCase.attr("src", imgSrc)
        })
    }

    sortColumn(columnId) {
        let columnValue = this.getFormatColumn(columnId)
        columnValue = columnValue.filter(caseValue => caseValue !== "null")
        const nbOfNullCase = 3 - columnValue.length

        for (let index = 0; index < nbOfNullCase; index++) {
            columnValue.push("null")
        }

        return columnValue
    }

    refreshTotalScore() {
        let totalScore = 0

        for (let columnId = 1; columnId <= 3; columnId++) {
            totalScore += this.evalScoreColumn(columnId)
        }

        $(`#totalScore${this.id}`).html(totalScore)
    }

    addEffect(columnId) {
        const countDices = this.getFormatColumn(columnId).reduce((acc, value) => ({ ...acc, [value]: (acc[value] || 0) + 1 }), {})
        const formatColumn = this.getFormatColumn(columnId)

        const indices = [];
        for (let element in countDices) {
            if (element !== "null" && countDices[element] > 1) {
                let idx = formatColumn.indexOf(element);
                while (idx !== -1) {
                    indices.push(idx);
                    idx = formatColumn.indexOf(element, idx + 1);
                }
            }
        }

        indices.map(element => {
            $(`#player${this.id}-col${columnId}-case-${element + 1}`).attr('class', 'case vibrate')
        })
    }

    removeEffect(columnId) {
        for (let element = 1; element <= 3; element++) {
            $(`#player${this.id}-col${columnId}-case-${element}`).attr('class', 'case')
        }
    }

    remove() {
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                for (let k = 1; k < 3; k++) {
                    $(`#player${k}-col${i}-case-${j}`).attr('class', 'case')
                    $(`#potPlayer${k}`).attr('src', "https://ik.imagekit.io/iq52ivedsj/assets/dices/choseDice_ftS4YvZbV.png?ik-sdk-version=javascript-1.4.3&updatedAt=1662986918825")
                }
            }
        }
    }

    refreshScoreColumn(columnId) {
        const scoreColumn = this.evalScoreColumn(columnId)
        this.addEffect(columnId)
        this.removeEffect(columnId)

        if (scoreColumn > 0) {
            $(`#totalScore${this.id}Column${columnId}`).html(scoreColumn)
        } else {
            $(`#totalScore${this.id}Column${columnId}`).html("")
        }
    }

    evalScoreColumn(columnId) {
        this.removeEffect(columnId)
        const countDices = this.getFormatColumn(columnId).reduce((acc, value) => ({
            ...acc,
            [value]: (acc[value] || 0) + 1
        }), {})
        let totalScoreOfColumn = 0

        this.addEffect(columnId)

        for (let dice in countDices) {
            if (dice !== "null") {
                const nbOfDice = countDices[dice]
                totalScoreOfColumn += parseInt(dice) * nbOfDice * nbOfDice
            }
        }

        return totalScoreOfColumn
    }

    getFormatColumn(columnId) {
        let formatColumn = []

        document.querySelectorAll(`div[id^="player${this.id}-col${columnId}-case"] img`)
            .forEach((caseImg) => {
                formatColumn.push(caseImg.dataset.value)
            })

        return formatColumn
    }



    initControl() {
        this.controlChoiceDice()
        this.controlColumn()
        this.initInventory()
    }

    controlChoiceDice() {
        document.getElementById(`potPlayer${this.id}`).addEventListener("click", () => {
            if (true) {
                this.game.client.getMyDice()
            }
        })
    }

    controlColumn() {
        for (let columnId = 0; columnId < this.nbCol; columnId++) {
            document.getElementById(`player${this.id}-col${columnId + 1}`).addEventListener("click", () => {
                this.game.client.sendColumnChoice(columnId)
            })
        }
    }

    setName() {
        const pseudo = localStorage.getItem("pseudo")
        if (pseudo !== null) {
            this.name = pseudo
            $(`#namePlayer${this.id}`).html(pseudo)
        }
    }
}