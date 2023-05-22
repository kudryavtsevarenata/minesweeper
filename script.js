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

function startGame(){
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
    for (let i = 0; i < components.row; ++i){
        r = document.createElement('tr');
        for (let j = 0; j < components.col; ++j){
            td = document.createElement('td');
            td.id = "cell-" + i + '-' + j;
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

window.onload = startGame;

function placeFlag(id){
    let elem = document.getElementById(id);
    let c = parseIdCell(id);
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
    if (components.isFirstPressed){
        components.isFirstPressed = false;
        let c = parseIdCell(id);
        let bombMatrix = createBombField(components.row, components.col, c);
        components.matrix = createFullField(bombMatrix);
        let i = c[0];
        let j = c[1];
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
        console.log(components.matrix);
    }
    let count = document.getElementById('bomb-count');
    count.innerText = components.bombCount;
    let c = parseIdCell(id);
    if (components.matrix[c[0]][c[1]] < 0){
        button = document.getElementById('again');
        button.hidden = false;
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
    components.digitsCount = components.col * components.row - components.bombCount;
    return m;
}
function createFullField(bombMatrix){
    let result = new Array(bombMatrix.length);
    for (let i = 0; i < bombMatrix.length; ++i){
        result[i] = new Array(bombMatrix[i].length);
        for (let j = 0; j < bombMatrix[i].length; ++j){
            if (bombMatrix[i][j] !== 1){
                let counter = 0;
                if (i - 1 >= 0 && bombMatrix[i - 1][j] == 1) ++counter;
                if (i - 1 >= 0 && j - 1 >= 0 && bombMatrix[i - 1][j - 1] == 1) ++counter;
                if (j - 1 >= 0 && bombMatrix[i][j - 1] == 1) ++counter;
                if (j - 1 >= 0 && i + 1 < components.row && bombMatrix[i + 1][j - 1] == 1) ++counter;
                if (i + 1 < components.row && bombMatrix[i + 1][j] == 1) ++counter;
                if (i + 1 < components.row && j + 1 < components.col && bombMatrix[i + 1][j + 1] == 1) ++counter;
                if (j + 1 < components.col && bombMatrix[i][j + 1] == 1) ++counter;
                if (i - 1 >= 0 && j + 1 < components.col && bombMatrix[i - 1][j + 1] == 1) ++counter;
                result[i][j] = counter;
            }
            else{
                result[i][j] = -1;
            }
        }
    }
    return result;
}
function makeOpenCell(id){
    s = unParseID(id);
    let elem = document.getElementById(s);
    elem.style.background = '#bebdbe';
    elem.style.border = '1px solid grey';
    if (components.matrix[id[0]][id[1]] > 0){
        elem.innerText = components.matrix[id[0]][id[1]];
        let colorIndex = elem.innerText;
        elem.style.color = components.colors[colorIndex];
        components.openedDigits++;
        if (checkWin()){
            alert('Fucking slaves');
            document.getElementById('again').innerText = '😎';
        }
    }
    else{
        if (components.matrix[id[0]][id[1]] < 0){
            elem.innerText = components.bombSymb;
            elem.style.background = 'red';
            document.getElementById('again').innerText = '😣';
        }
        else{
            elem.innerText = 'ㅤ';
            components.openedDigits++;  
        }
    }
}

function checkWin(){
    return components.openedDigits == components.digitsCount;
}