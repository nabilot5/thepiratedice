import { Login } from "./class/login.js"
import { Leaderboard } from "./class/leaderBoard.js"
import { Game } from "./class/game.js"
import { Loader } from "./class/loader.js"
import { Shop } from "./class/shop.js"

const resize = () => {
    let body = document.body,
        html = document.documentElement;

    var height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    document.getElementById("backg").style.height = height + "px"

    let bgGameHeigth = document.getElementById("fond").height
    document.getElementById("grids").style.height = bgGameHeigth + "px"
}


const changeBackground = () => {
    const bg = document.getElementById('backg');
    const time = new Date().getHours() + 1;

    if (time >= 8 && time < 13) {
        bg.setAttribute('src', 'https://ik.imagekit.io/iq52ivedsj/assets/bg1_xedqZJjiY.png?ik-sdk-version=javascript-1.4.3&updatedAt=1662987064789');
    }
    else if (time >= 13 && time < 18) {
        bg.setAttribute('src', 'https://ik.imagekit.io/iq52ivedsj/assets/bg2_ILScAgZGCc.png?ik-sdk-version=javascript-1.4.3&updatedAt=1662987081708');
    }
    else {
        bg.setAttribute('src', 'https://ik.imagekit.io/iq52ivedsj/assets/bg3_WXdvDGb2b.png?ik-sdk-version=javascript-1.4.3&updatedAt=1662987044446');
    }
}

window.addEventListener("resize", () => {
    resize()
})

const loader = new Loader()
loader.add("Loading ...")

window.addEventListener('load', function () {
    setTimeout(() => {
        loader.remove()
    }, 500)
    $("#index").fadeIn(400)

    var SeaSound = document.getElementById('SeaSound')
    SeaSound.volume = 0.1
    SeaSound.loop = "true"
}, false)

resize()
changeBackground()

const login = new Login()
login.autoConnect()
login.signup()
login.signin()

const leaderBoard = new Leaderboard()
leaderBoard.init()

const shop = new Shop()
shop.showBonus()

const game = new Game()
game.init()

$('#redirectionSolo').on('click', () => {
    const pseudo = localStorage.getItem("pseudo")
    const password = localStorage.getItem("password")
    if (pseudo !== null && password !== null) {
        game.play("solo")
        resize()
    } else {
        // show conect form
        console.log("Veillez vous connecter");
    }
})

$('#redirectionMulti').on('click', () => {
    const pseudo = localStorage.getItem("pseudo")
    const password = localStorage.getItem("password")
    if (pseudo !== null && password !== null) {
        game.play("multi")
        resize()
    } else {
        // show conect form
        console.log("Veillez vous connecter");
    }
})

$('#new-user-btn').on('click', () => {
    $('#signin').fadeOut(400, () => {
        $('#signup').fadeIn(400)
    });
})

$("#menu-principal-btn").on("click", () => {
    changeBackground()
    $("#menu-principal").fadeIn(400)
    $("#leaderboard").fadeOut(400)
    $("#shop").fadeOut(400)
})

$("#shop-btn").on("click", () => {
    $('#backg').attr('src', '/Client/assets/shop/wallpaper.png');
    $("#menu-principal").fadeOut(400)
    $("#leaderboard").fadeOut(400)
    $("#shop").fadeIn(400)
})

$("#leaderboard-btn").on('click', () => {
    $('#backg').attr('src', '/Client/assets/shop/wallpaper.png');
})

$('#player-info').on('click', () => {
    $("#menu-principal").fadeOut(400)
    $("#leaderboard").fadeIn(400)
    $("#shop").fadeOut(400)
})

$("#bonus-btn").on('click', () => {
    $("#bonus-items").fadeIn(400)
    $("#emots-items").fadeOut(400)
    $("#icons-items").fadeOut(400)
    $("#skin-items").fadeOut(400)
    $("#coin-items").fadeOut(400)
})

$("#emots-btn").on('click', () => {
    $("#bonus-items").fadeOut(400)
    $("#emots-items").fadeIn(400)
    $("#icons-items").fadeOut(400)
    $("#skin-items").fadeOut(400)
    $("#coin-items").fadeOut(400)
})

$("#icons-btn").on('click', () => {
    $("#bonus-items").fadeOut(400)
    $("#emots-items").fadeOut(400)
    $("#icons-items").fadeIn(400)
    $("#skin-items").fadeOut(400)
    $("#coin-items").fadeOut(400)
})

$("#skin-btn").on('click', () => {
    $("#bonus-items").fadeOut(400)
    $("#emots-items").fadeOut(400)
    $("#icons-items").fadeOut(400)
    $("#skin-items").fadeIn(400)
    $("#coin-items").fadeOut(400)
})

$("#buy-po-btn").on('click', () => {
    $("#bonus-items").fadeOut(400)
    $("#emots-items").fadeOut(400)
    $("#icons-items").fadeOut(400)
    $("#skin-items").fadeOut(400)
    $("#coin-items").fadeIn(400)
})


$("#btn-rules").on('click', () => {
    $("#rules").fadeIn(400)
})