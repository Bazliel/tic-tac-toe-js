import { menu_side } from "./navigation-script.js";
// the winning path 
const winning_path = {
    // rows wins
    "row1": [1, 2, 3],
    "row2": [4, 5, 6],
    "row3": [7, 8, 9],
    // diagonal wins
    "diagonal2": [1, 5, 9],
    "diagonal1": [3, 5, 7],
    // column wins
    "column1": [1, 4, 7],
    "column2": [2, 5, 8],
    "column3": [3, 6, 9]
}
// x and o path logs are stored here 
// which are later processed by a 
// function
let x_path = [];
let o_path = [];

// getting the elements from our dom
const cells = Array.from(document.querySelectorAll("[data-cell-index]"));
const reset_score_btn = document.querySelector("#reset-btn");
const x_score = document.querySelector("#x-score");
const tie_score = document.querySelector("#tie-score");
const o_score = document.querySelector("#o-score");

const score_containers = Array.from(document.querySelectorAll(".score-container"));

export const current_player = document.querySelector("#current-player");

const intersector = document.querySelector(".intersector")
const banner = document.querySelector(".banner")

// game variables
const data = {
    "X": {
        color: '#ff1e00',
        player: document.querySelector("#x-player-name")
    },
    "O": {
        color: '#00b5ec',
        player: document.querySelector("#o-player-name")
    }
}
export let game_active = false



function main() {
    // the function's main job is to bind the functions that we defined
    cells.forEach(cell => {
        cell.addEventListener("mouseup", e => handle_cell_click(e))
    })
    reset_score_btn.addEventListener('mouseup', reset_scores)
}

main()

// The function that handles the click of a cell
function handle_cell_click(e) {
    console.log(x_path, o_path)
    const cell = e.target;
    console.log(cell);
    // cheking if the cell is occupied and if it is then go out of the function
    if(cell.innerText !== "") return; 
    
    game_active = true
    // adding the class name and the letter using a function
    add_x_o(cell, current_player.innerText)
    
    // changing the cell index from string to int and assigning to a varible
    const cell_index = parseInt(cell.getAttribute("data-cell-index"))
    
    // calling log_path()
    log_path(cell_index);

    // executing out game logic 
    game_logic()
}

export function defaults() {
    change_current_player("X")
    change_underline("X")
    clear_board()
}

export function reset_scores() {
    x_score.innerText = '0'
    o_score.innerText = '0'
    tie_score.innerText = '0'
    menu_side.classList.remove('active')
    game_active = false
    defaults()
}

function get_winner(path) {
    let array_winning_path = Object.values(winning_path)
    for (let i of array_winning_path) {
        let counter = 0;
        for (let k of path) {
            for(let j of i) { 
                if (k === j){
                    counter ++
                }
                if (counter === 3) return [true, Object.keys(winning_path).find(key => winning_path[key] === i)];
            }
        }
    }
    return [false, null];
}

function game_logic() {
    let x_iswinner, x_index, o_index, o_iswinner;
    [x_iswinner, x_index] = get_winner(x_path);
    [o_iswinner, o_index] = get_winner(o_path);
    if(x_iswinner) {
        update_scores(x_score)
        got_winner("X", x_index)
    }
    else if(o_iswinner) {
        update_scores(o_score)
        got_winner("O", o_index)
    }
    else if(is_full()) {
        update_scores(tie_score)
        got_winner(null, null)
    }
    else {
        update_current_player()
    }
}

export function use_banner(message, callback=() => {}, args=[]) {
    const transition_duration = getComputedStyle(document.querySelector('.banner')).getPropertyValue("--transition-duration")
    document.querySelector('*, *::after, *::before').style.setProperty("pointer-events", 'none')
    banner.innerText = message
    banner.classList.add('active')
    setTimeout(() => {
    banner.classList.remove("active");
    setTimeout(() => {
        if(args !== []) callback(...args);
        else callback()
        document.querySelector('*, *::after, *::before').style.setProperty("pointer-events", 'auto')
    }, transition_duration*1000) 
    }, transition_duration*1000)
}

function update_scores(score) {
    let current_score = parseInt(score.iupdate_current_playernnerText);
    current_score ++;
    score.innerText = current_score;
}

function remove_indicator(){
    intersector.classList.remove('diagonal')
    intersector.classList.remove('row')
    intersector.classList.remove('column')
    intersector.classList.remove('active')
}

function use_intersector(index, color) {
    remove_indicator()
    intersector.classList.add(`${index.substring(0, index.length - 1)}`)
    intersector.classList.add('active')
    intersector.style.setProperty("--background-color", color)
    intersector.setAttribute('data-position', index)
    setTimeout(() => remove_indicator(), 1500)
}

function log_path(cell_index) {
    if(current_player.innerText === "X") {
        x_path.push(cell_index);
    }
    else if(current_player.innerText === "O") {
        o_path.push(cell_index);
    }
}

function got_winner(winner, index) {
    if(winner !== null) {
        use_intersector(index, data[winner]['color'])
    }
    else {
        console.log("tie game")
    }
    setTimeout(() => {
        clear_board(); 
        update_current_player()
        use_banner(`${data[winner]['player'].innerText} Has Won!`,use_banner, [`${current_player.innerText} begins`])
    }, 1500)
}

function clear_board() {
    cells.forEach((cell) => {
        cell.innerText = ""
        cell.classList.remove("X")
        cell.classList.remove("O")
    })
    x_path = []
    o_path = []
}

function is_full() {
    let full = true
    cells.forEach(cell => {
        if(cell.innerText === '') full = false
    })
    return full
}



function modify_score_container(score_container) {
    score_containers.forEach((container) => {
        container.classList.remove("active");
    })
    score_container.classList.add("active");
}


// the function that handles the current undelined player turn
function change_underline(value) {
    if(value === "X") {
        modify_score_container(x_score.parentElement);
    }
    else if(value === "O") {
        modify_score_container(o_score.parentElement);
    }
    else {
        modify_score_container(tie_score.parentElement);
    }
}


function update_current_player() {
    if(current_player.innerText === "X") {
        change_current_player("O")
    }
    else if(current_player.innerText === "O") {
        change_current_player("X")
    }
    change_underline(current_player.innerText);
}

function change_current_player(value) {
    current_player.classList.replace(current_player.innerText, value)
    current_player.innerText = value;
}



function add_x_o(cell, value) {
    cell.innerText = current_player.innerText;
    cell.classList.add(value)
}
