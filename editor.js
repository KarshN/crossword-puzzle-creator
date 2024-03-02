var size = localStorage.getItem("size");
var width = 0;
var height = 0;
if (size == "small"){
  width = 10;
  height = width;
}else if(size == "medium"){
  width = 20;
  height = width;
}else if(size == "large"){
  width = 30;
  height = width;
}else{
  width = prompt("Width?");
  height = prompt("Height?");
}

var alphabet = [" ","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
var letters =[];
var selectedBox = 0;
var correct = [];
var clues = [];
clues.push("A");
clues.push("D");
var boxes = [];
var numbers = [];
var canvas = document.getElementById('gamecanvas');
var context = canvas.getContext("2d");
function rect(x, y, width, height,color) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
  context.stroke();
  context.lineWidth = 4;
}
function eraseCanvas(){
  context.clearRect(0, 0, canvas.width, canvas.height);
}
function drawBox(x,y){
  rect(x,y,30,30,"black");
  rect(x+2,y+2,26,26,"white");
}
function drawOutline(x,y){
  rect(x,y,30,30,"yellow");
  rect(x+2,y+2,26,26,"white");
}
function FindX(num,width,height){
  var x = 30*((num-1) % width);
  return x;
}
function FindY(num,width,height){
  var y = 30*Math.floor((num-1)/width);
  return y;
}
function LoadLevel(savecode){
  //savecode format:  item 1: width (space) item 2: height (space). all letters after that will be describing each box. There are three properties for each box separated by a space: property 3: corresponding letter property(as a number value) 2: the little number at the top(insert 0 if there isn't any) property 1: if it's a black square, white square, or outlined (1,2,3). More information is continued after this for loop
  var array = savecode.split("|");
  var width = array[0];
  var height = array[1];
  letters = [];
  boxes= [];
  numbers = [];
  clues = [];
  //boxes
  for(let i = 2; i<2+(width*height*3);i++){
    if((i-2) % 3 == 2){
      letters.push(array[i]);
      Text(FindX((i-1)/3,width,height),FindY((i-1)/3,width,height),alphabet[array[i]],"bold 18px Arial",1,"black");
    }else if((i-2) % 3 == 1){
      if(array[i]!= 0){
        Text(FindX(i/3,width,height),FindY(i/3,width,height),array[i],"10px Arial",0,"black");
      }
      numbers.push(array[i]);
    }else{
      if(selectedBox != (i+1)/3 ){
        if(array[i]==1){
          rect(FindX((i+1)/3,width,height),FindY((i+1)/3,width,height),30,30,"black");
        }else if(array[i]==2){
          rect(FindX((i+1)/3,width,height),FindY((i+1)/3,width,height),30,30,"white");
        }else{
          drawBox(FindX((i+1)/3,width,height),FindY((i+1)/3,width,height));
        }
      }else{
        drawOutline(FindX(selectedBox,width,height),FindY(selectedBox,width,height));
      }
      boxes.push(array[i]);
    }
  }
  //the format for the clues is: First you put a D or an A, if you want to start with down, or with across. There is a space between each of them. Then, you put which number it is a clue for, a comma, and you type the clue out. You keep doing that until you get to Across or down, after which you do the same thing after adding an A or D
  //clues
  let y=0;
  let x=60;
  let clue = [];
  for(let r = 2+(width*height*3);r<array.length;r++){
    if (array[r] == "D"){
      Text((width*30)+x,y,"DOWN:","bold 20px",1,"black");
    }else if(array[r] == "A"){
      Text((width*30)+x,y,"ACROSS:","bold 20px",1,"black");
    }else{
      clue=array[r].split("&");
      Text((width*30)+x,y,clue[0]+"."+" "+clue[1],"bold 13px",1,"black");
    }
    clues.push(array[r]);
    y+=30;
    if(y>=1470){
      x+=750;
      y=0;
    }
  }
}
function generateSaveCode(letters,boxes,numbers,clues){
  //all parameters in this function should be arrays
  var savecode = "";
  savecode = savecode + width + "|";
  savecode = savecode + height +"|";
  for(let i = 0;i<boxes.length;i++){
    for(let l = 0;l<3;l++){
      if(l == 0){
        savecode = savecode + boxes[i];
      }else if(l==1){
        savecode = savecode + numbers[i];
      }else{
        savecode = savecode + letters[i];
      }
      savecode = savecode+"|"
    }
  }
  for(let j = 0; j < clues.length;j++){
    savecode = savecode + clues[j];
    if(j<clues.length-1){
      savecode = savecode + "|"
    }
  }
  return savecode;
}
function Text(x,y, text,font,format,color){
  context.fillStyle = color;
  context.font = font;
  if( format == 1){
    context.fillText(text, x+8.25,y+22.5);
  }else{
    context.fillText(text, x+2.5,y+10.25);
  }
}
function PosWithin(x1,y1,x2,y2,posx,posy){
  //x1,y1 is higher and more to the left than x2,y2
  if(posx<=x2 && posx>=x1 && posy <=y2 && posy >=y1){
    var Condition = true;
  }else{
    var Condition = false;
  }
  return Condition;
}
function ListContains(list, contains) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] === contains) {
      return true;
    }
  }
  return false;
}
function ListItemContains(list, contains,starting,ending) {
  for (var i = starting; i < ending; i++) {
    if (list[i].indexOf(contains)!= false) {
      return i;
    }
  }
  return false;
}
function changeBox(){
  if(boxes[selectedBox-1]==1){
    boxes.splice(selectedBox-1,1,2);
  }else if(boxes[selectedBox-1] == 2){
    boxes.splice(selectedBox-1,1,3);
  }else{
    boxes.splice(selectedBox-1,1,1);
    letters.splice(selectedBox-1,1,0);
  }
  LoadLevel(generateSaveCode(letters,boxes,numbers,clues));
}
function changeNumber(){
  var number = prompt("What number would you like to put (0 for nothing)?");
  numbers.splice(selectedBox-1,1,number);
  LoadLevel(generateSaveCode(letters,boxes,numbers,clues));
}
function searchFor(str,searchValue,replace){
  var arr = str.split("");
  while(ListContains(arr,searchValue)){
    arr.splice(arr.indexOf(searchValue),1,replace);
  }
  return combineElementsOf(arr);
}
function combineElementsOf(array){
  var str = "";
  for(let i = 0;i<array.length;i++){
    str = str + array[i];
  }
  return str;
}
function addClue(){
  var dir = prompt("Across or Down?");
  var number = prompt("Which number is this a clue for?");
  var clue = prompt("Type in the clue");
  clue = searchFor(clue,"|"," ")
  clue = searchFor(clue,"&"," and ");
  var concatClue = number +"&"+clue;
  if(dir == "across"){ 
    clues.splice(clues.indexOf("D"),1,concatClue,"D");
  }else{
    clues.push(concatClue);
  }
}
function deleteClue(){
  var number = prompt("What number do you want to delete?");
  var dir = prompt("Which way is it going?");
  if(dir == "across"){
    var item = ListItemContains(clues,number,clues.indexOf("A"),clues.indexOf("D"));
  }else{
    var item = ListItemContains(clues,number,clues.indexOf("D"),clues.length);
  }
  if(item != false){
    clues.splice(item,1);
  }
}
function loadPuzzle(){
  var savecode = prompt("Enter save code");
  eraseCanvas();
  LoadLevel(savecode);
}
function savePuzzle(){
  var savecode = generateSaveCode(letters,boxes,numbers,clues);
  var savecodeElem = document.getElementById('savecode');
  savecodeElem.innerHTML = savecode;
  alert("Below the puzzle, there is a text containing the save code.");
}
function ParseClick(canvas, event,boxNums,width,height) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var boxWithin = 0;
  for(let i = 1;i<boxNums+1;i++){
    if(PosWithin(FindX(i,width,height),FindY(i,width,height),FindX(i,width,height)+30,FindY(i,width,height)+30,x,y)){
      boxWithin = i;
    }
  }
  if (boxWithin != 0){
    selectedBox = boxWithin;
    eraseCanvas();
    LoadLevel(generateSaveCode(letters,boxes,numbers,clues));
  }

} 

drawBox(0,0);
//Text(0,0,"A","bold 18px Arial",1,"black");
//Text(0,0,"1","10px Arial",0,"black");
for(let i = 0; i<(width*height); i++){
  boxes.push(3);
  letters.push(0);
  numbers.push(0);
}
LoadLevel(generateSaveCode(letters,boxes,numbers,clues));
let canvasElem = document.querySelector("canvas");
canvasElem.addEventListener("mousedown", function(e)
{
  ParseClick(canvasElem,e,width*height,width,height);
});
document.addEventListener("keyup", function(event) {
  //a is 65, b is 66, c is 67, and so on
  if(ListContains(correct,selectedBox)){
  }else{
    if(selectedBox != 0){
      if(event.keyCode>64 &&event.keyCode<91){
        Text(FindX(selectedBox,width,height),FindY(selectedBox,width,height),event.key,"bold 18px Arial",1,"black");
        letters.splice(selectedBox-1, 1, event.keyCode-64);
        selectedBox+=1;
        eraseCanvas();
        LoadLevel(generateSaveCode(letters,boxes,numbers,clues));
      }
    }
  }
})

