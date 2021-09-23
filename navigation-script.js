import { use_banner, game_active, reset_scores, current_player} from "./script.js"

const screens = Array.from(document.querySelectorAll(".screen"))
const play_btn = document.querySelector("#play-btn")
const menu_btn = document.querySelector(".hamburger")
export const menu_side = document.querySelector(".menu-slide")
const close_btn = document.querySelector(".close-btn")
const main_menu_btn = document.querySelector("#main-menu-btn")


function main() {
    play_btn.addEventListener('mouseup', () => {
        change_screen(screens[1])
        use_banner(`${current_player.innerText} begins`)
    })
    menu_btn.addEventListener("mouseup", () => {
        menu_side.classList.add("active")
    })
    close_btn.addEventListener("mouseup", () => {
        menu_side.classList.remove("active")
    })
    main_menu_btn.addEventListener("mouseup", () => {
        go_to_main_menu()
    })
}

function go_to_main_menu() {
    if(game_active) {
        if(confirm("Are you sure to quit active game?")) {
            reset_scores()
            change_screen(screens[0])
        }
    }
    else {
        reset_scores()
        change_screen(screens[0])
    }
}

function change_screen(to_screen) {
    screens.forEach((screen) => {
        screen.classList.remove("active")
    })
    to_screen.classList.add('active')
}

main()