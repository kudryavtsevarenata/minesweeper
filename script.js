const uAgent = navigator.userAgent;
document.getElementById('user-agent').innerText = uAgent;

let components = {
    col: 8,
    row: 8,
    bombCount: 0,
    bombSymb: '💣',
    flag: '🚩',
    colors : {1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'maroon', 6: 'turquoise', 7: 'black', 8: 'grey'},
    isFirstPressed: true,
    matrix: new Array(),
    openedDigits: 0,
    flagCount: 0,
    digitsCount: 0
}
function setStartCondition(){
    document.getElementById('again').innerText = '🙂';
    components.bombCount = 0;
    components.openedDigits = 0;
    components.digitsCount = 0;
    field = document.getElementById('field');
    field.innerHTML = '';
    document.getElementById('bomb-count').innerText = ' ';
    document.getElementById('flag-count').innerText = ' ';
    components.flagCount = 0;
    components.isFirstPressed = true;
}
function startGame(){
    setStartCondition();
    for (let i = 0; i < components.row; ++i){
        r = document.createElement('tr');
        for (let j = 0; j < components.col; ++j){
            td = document.createElement('td');
            td.id = "cell-" + i + '-' + j;
            td.classList.add("border-element")
            td.onclick = function(){
                openCell(this.id);
            };
            td.oncontextmenu = function(){
                placeFlag(this.id);
                return false;
            }
            r.appendChild(td);
        }
        field.appendChild(r);
    }
}

window.onload = function() {
    let preloader = document.querySelector('.preloader');
    setTimeout(function() {
        preloader.classList.add('hide-preloader');
    }, 2000);
    setTimeout(function(){
        preloader.classList.add('preloader-hidden');
    }, 3000);
    startGame();
    updateTime();
}

function updateTime(){
    let curTime = new Date();
    let h = curTime.getHours();
    let min = curTime.getMinutes();
    if (min < 10)
        min = "0" + min;
    let sTime = h + ":" + min;
    document.getElementById("time").innerText = sTime;
    let dd = String(curTime.getDate()).padStart(2, '0');
    let mm = String(curTime.getMonth() + 1).padStart(2, '0');
    let yyyy = curTime.getFullYear();
    let today = dd + '/' + mm + '/' + yyyy;
    document.getElementById("date").innerText = today;
}

setInterval(updateTime, 1000);

window.onclick = function(){
    let obj = document.getElementsByClassName('icons');
    let collection = obj[0].children;
    for (let i = 0; i < collection.length; ++i){
        collection[i].classList.remove('active-icon');
    }
}
function placeFlag(id){
    let elem = document.getElementById(id);
    if (elem.innerText === components.flag){
        elem.innerText = '';
        --components.flagCount;
        document.getElementById('flag-count').innerText = components.flagCount;
    }
    else if (elem.innerText === '') {
        elem.innerText = components.flag;
        document.getElementById('flag-count').innerText = components.flagCount + 1;
        components.flagCount++;
    }
}
function unParseID(id){
    s = 'cell-'+parseInt(id[0])+'-'+parseInt(id[1]);
    return s;
}

function openCell(id){
    let c = parseIdCell(id);
    let i = c[0];
    let j = c[1];
    if (components.isFirstPressed){
        components.isFirstPressed = false;
        let bombMatrix = createBombField(components.row, components.col, c);
        components.matrix = createFullField(bombMatrix);
        if (components.matrix[i][j] <= -1){
            if (i - 1 >= 0 && document.getElementById(id).innerText === '') components.matrix[i - 1][j]--;
            if (i - 1 >= 0 && j - 1 >= 0) components.matrix[i - 1][j - 1]--;
            if (j - 1 >= 0) components.matrix[i][j - 1]--;
            if (j - 1 >= 0 && i + 1 < components.row) components.matrix[i + 1][j - 1]--;
            if (i + 1 < components.row) components.matrix[i + 1][j]--;
            if (i + 1 < components.row && j + 1 < components.col)components.matrix[i + 1][j + 1]--;
            if (j + 1 < components.col) components.matrix[i][j + 1]--;
            if (i - 1 >= 0 && j + 1 < components.col) components.matrix[i - 1][j + 1]--;
            components.matrix[i][j] === 0;
        }
        // console.log(components.matrix);
    }
    document.getElementById('bomb-count').innerText = components.bombCount;
    if (components.matrix[i][j] < 0){
        removeEvents();
    }
    open(c);
}

function removeEvents(){
    field = document.getElementById('field');
    for (let i = 0; i < components.row; ++i){
        r = document.getElementsByName('tr');
        for (let j = 0; j < components.col; ++j){
            td = document.getElementById(unParseID([i, j]));
            let newElem = td.cloneNode(true);
            td.parentNode.replaceChild(newElem, td);
        }
    }
}

function isClosed(i, j){
    return document.getElementById(unParseID([i, j])).innerText === '';
}

function open(id){
    let i = id[0];
    let j = id[1];
    makeOpenCell(id);
    if (components.matrix[i][j] === 0){
        if (i - 1 >= 0 && isClosed(i - 1, j)) open([i - 1, j]);
        if (i - 1 >= 0 && j - 1 >= 0 && isClosed(i - 1, j - 1)) open([i - 1, j - 1]);
        if (j - 1 >= 0 && isClosed(i, j - 1)) open([i, j - 1]);
        if (j - 1 >= 0 && i + 1 < components.row && isClosed(i + 1, j - 1)) open([i + 1, j - 1]);
        if (i + 1 < components.row && isClosed(i + 1, j)) open([i + 1, j]);
        if (i + 1 < components.row && j + 1 < components.col && isClosed(i + 1, j + 1)) open([i + 1, j + 1]);
        if (j + 1 < components.col && isClosed(i, j + 1)) open([i, j + 1]);
        if (i - 1 >= 0 && j + 1 < components.col && isClosed(i - 1, j + 1)) open([i - 1, j + 1]);
    }
}

function parseIdCell(id){
    let i = id.indexOf('-');
    let j = id.lastIndexOf('-');
    return [parseInt(id.slice(i + 1, j)), parseInt(id.slice(j + 1))];
}

function isNeighbour(coord, parsedID){
    return Math.abs(coord[0] - parsedID[0]) <= 1 && Math.abs(coord[1] - parsedID[1]) <= 1;
}

function createBombField(row, col, parsedID){
    let m = new Array(row);
    for (let i = 0; i < row; ++i){
        m[i] = new Array(col);
        for (let j = 0 ; j < col; ++j){
            if (isNeighbour([i, j], parsedID)){
                m[i][j] = 0;
            }
            else{
                let rand = Math.floor(Math.random() * 100);
                m[i][j] = rand < 80 ? 0 : 1;
                if (m[i][j] == 1){
                    components.bombCount++;
                }
            }
        }
    }
    return m;
}
function createFullField(bombMatrix){
    let result = new Array(bombMatrix.length);
    for (let i = 0; i < bombMatrix.length; ++i){
        result[i] = new Array(bombMatrix[i].length);
        for (let j = 0; j < bombMatrix[i].length; ++j){
            if (bombMatrix[i][j] !== 1){
                let counter = 0;
                if (i - 1 >= 0 && bombMatrix[i - 1][j] === 1) ++counter;
                if (i - 1 >= 0 && j - 1 >= 0 && bombMatrix[i - 1][j - 1] === 1) ++counter;
                if (j - 1 >= 0 && bombMatrix[i][j - 1] === 1) ++counter;
                if (j - 1 >= 0 && i + 1 < components.row && bombMatrix[i + 1][j - 1] === 1) ++counter;
                if (i + 1 < components.row && bombMatrix[i + 1][j] === 1) ++counter;
                if (i + 1 < components.row && j + 1 < components.col && bombMatrix[i + 1][j + 1] === 1) ++counter;
                if (j + 1 < components.col && bombMatrix[i][j + 1] === 1) ++counter;
                if (i - 1 >= 0 && j + 1 < components.col && bombMatrix[i - 1][j + 1] === 1) ++counter;
                result[i][j] = counter;
            }
            else{
                result[i][j] = -1;
            }
        }
    }
    components.digitsCount = result.flat().filter(n => (n >= 0)).length;
    return result;
}
function makeOpenCell(id){
    s = unParseID(id);
    let elem = document.getElementById(s);
    elem.style.background = '#bebdbe';
    elem.style.border = '1px solid grey';
    if (components.matrix[id[0]][id[1]] > 0 && elem.innerText !== 'ㅤ' &&  !(elem.innerText >= '1' && elem.innerText <= '8')){
        elem.innerText = components.matrix[id[0]][id[1]];
        let colorIndex = elem.innerText;
        elem.style.color = components.colors[colorIndex];
        components.openedDigits++;
    }
    else{
        if (components.matrix[id[0]][id[1]] < 0){
            elem.innerText = components.bombSymb;
            elem.style.background = 'red';
            document.getElementById('again').innerText = '😣';
        }
        else if (components.matrix[id[0]][id[1]] === 0){
            elem.innerText = 'ㅤ'; 
            components.openedDigits++;
        }
    }
    if (checkWin()){
        document.getElementById('again').innerText = '😎';
    }
}

function checkWin(){
    return components.openedDigits === components.digitsCount;
}

function getMovements(window){
    window.onmousedown = function(event){
        let shiftX = event.clientX - window.getBoundingClientRect().left;
        let shiftY = event.clientY - window.getBoundingClientRect().top;
        window.style.position = 'absolute';
        let collection = window.parentNode.children;
        for (let i = 0; i < collection.length; ++i){
            collection[i].style.zIndex = 2;
        }
        window.style.zIndex = 3;
        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY){
            window.style.left = pageX - shiftX + 'px';
            window.style.top = pageY - shiftY + 'px'; 
        }

        function onMouseMove(event){
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        window.onmouseup = function(){
            document.removeEventListener('mousemove', onMouseMove);
            window.onmouseup = null;
        }
    }
    window.ondragstart = function(){
        return false;
    }
}
function roll(idElem, idTab){
    let window = document.getElementById(idElem);
    let tab = document.getElementById(idTab);
    if (window.hidden === false){
        window.hidden = true;
        tab.classList.remove('active');
    }
    else{
        tab.classList.add('active');
        window.hidden = false;
    }
}
function closeWindow(idElem, idTab){
    let window = document.getElementById(idElem);
    let tab = document.getElementById(idTab);
    window.hidden = true;
    tab.classList.remove('active');
    tab.style.display = 'none';
    tab.style.position = 'absolute';
    window.style.zIndex = 2;
}
function openWindow(obj, idElem, idTab){
    obj.classList.add('active-icon');
    let window = document.getElementById(idElem);
    let tab = document.getElementById(idTab);
    window.hidden = false;
    tab.classList.add('active');
    tab.style.position = 'static';
    tab.style.display = 'flex';
    window.style.zIndex = 3;
}