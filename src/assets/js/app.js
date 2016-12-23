import page from 'page'

import detectLocation from './detectLocation'
import map from './map'

import slopeTpl from '../../../build/assets/templates/slopes'
import hutTpl from '../../../build/assets/templates/huts'

let dynamicContent = document.getElementById("dynamic-content");

const chessPlayers = {
    'magnus' : {
        name: 'Magnus Carlsen',
        image: 'https://cdn.worldchess.com/static/img/ny2016v2/carlsen.png',
        description: 'is good but not very good'
    },
    'sergey' : {
        name: 'Sergey Karjakin',
        image: 'https://cdn.worldchess.com/static/img/ny2016v2/karjakin.png',
        description: 'is better but also not very good'
    }
}

function index() {
    dynamicContent.innerHTML = slopeTpl(chessPlayers.sergey);
}

function slopes() {
    dynamicContent.innerHTML = slopeTpl(chessPlayers.magnus);
}

function huts() {
    dynamicContent.innerHTML = hutTpl(chessPlayers.magnus);
}

function lifts() {
    dynamicContent.innerHTML = slopeTpl(chessPlayers.sergey);
}

page('/', index)
page('/slopes/:slope', slopes)
page('/huts/:hut', huts)
page('/lifts/:lift', lifts)
//page('//:hut', huts)
//router('*', notFound)
page()


//TODO
// cache manifest https://developer.mozilla.org/de/docs/Web/HTML/Using_the_application_cache


detectLocation();
