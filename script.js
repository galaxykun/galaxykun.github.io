const start          = document.getElementById('start');
const reset          = document.getElementById('reset');
const table          = document.getElementById('table');
const curr_pleayer   = document.getElementById('curr_pleayer');

const rootElement = document.documentElement;
rootElement.dataset.show = false;

let currentstep = 0;
let requestID;

let player_O = {
   name : 'O',
   iswin : 0,
   time : 60000,
   time_id : document.getElementById('time_O'),
   time_pre: null
}

let player_X = {
   name : 'X',
   iswin : 0,
   time : 60000,
   time_id : document.getElementById('time_X'),
   time_pre: null
}

let player     = player_O;
let win_array  = [7, 73, 273, 146, 84, 292, 56, 448];

for(let i = 0; i < 3; i++){
   let row = document.createElement("div");
   row.className = "row";
   table.appendChild(row);

   for(let j = 0; j < 3; j++){
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("id", i * 3 + j);
      cell.dataset.player = "0";
      row.appendChild(cell);
   }
}

//game start initiaize and event listerner
start.addEventListener('click', () => {
   table.addEventListener('click', click_func);
   settext(true);

   rootElement.dataset.show = true;         
   rootElement.style.setProperty(`--celltext`, `"${player.name}"`);

   player.time_pre = Date.now();
   requestAnimationFrame(animation);
});

//不知道要取甚麼變數(cell)
function click_func(cell) {
   if(cell.target.className != "cell"){
      return;
   }

   cell.target.dataset.player = player.name
   currentstep++;
   player.iswin |= (1 << cell.target.id);

   if(check() == true){
      endgame();

      return;
   }
   
   player = (player.name == 'O') ? player_X : player_O;
   rootElement.style.setProperty(`--celltext`, `"${player.name}"`);
   player.time_pre = Date.now();
}

function animation() {
   const now = Date.now();
   if(player.time <= 0){
      endgame();

      alert((player.name == 'O' ? 'X' : player.name) + ' is WIN!!');

      return;
   }
   
   player.time = player.time - (now - player.time_pre);
   player.time = player.time <= 0 ? 0 : player.time;
   player.time_id.innerText = String((player.time / 1000).toFixed(1));
   player.time_pre = now;

   requestID = requestAnimationFrame(animation);
}

//reset
reset.addEventListener('click', () => {
   endgame();
   settext(false);

   rootElement.style.setProperty(`--celltext`, `""`);

   for(let element of document.getElementsByClassName('cell')){
      element.dataset.player = '0';
   }
});

//data reset
function endgame() {
   rootElement.dataset.show = false;

   table.removeEventListener('click', click_func);
   cancelAnimationFrame(requestID);
}

function check() {
   if(win_array.some(value => (player.iswin & value) == value)){
      alert(player.name + ' is WIN!!');

      return true;
   }

   if(currentstep == 9){
      alert('平手');

      return true;
   }

   return false;
}

function settext(compare) {
   start.disabled = compare ? "disabled" : "";
   reset.disabled = compare ? "" : "disabled";

   player_X.time_id.innerText = '60.0';
   player_O.time_id.innerText = '60.0';

   player = player_O;

   player_O.iswin = 0;
   player_O.time = 60000;

   player_X.iswin = 0;
   player_X.time = 60000;

   currentstep = 0;
}