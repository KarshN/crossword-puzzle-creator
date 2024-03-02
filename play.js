//alert(localStorage.getItem("textContent"));
var alphabet = [" ","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
var letters =[];
var canvas = document.getElementById('gamecanvas');
var context = canvas.getContext("2d");
var selectedBox = 0;
var correct = [];
const d = new Date();
var start = d.getTime();
var clues = [];
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
  //savecode format:  item 1: width (space) item 2: height (space). all letters after that will be describing each box. There are three properties for each box separated by a space: property 3: corresponding letter property 2: the little number at the top(insert 0 if there isn't any) property 1: if it's a black square, white square, or outlined (1,2,3). More information is continued after this for loop
  var array = savecode.split("|");
  var width = array[0];
  var height = array[1];
  letters = [];
  //boxes
  for(let i = 2; i<2+(width*height*3);i++){
    if((i-2) % 3 == 2){
      letters.push(array[i]);
      if(ListContains(correct,(i-1)/3)){
        Text(FindX((i-1)/3,width,height),FindY((i-1)/3,width,height),alphabet[array[i]],"bold 18px Arial",1,"black");
      }
    }else if((i-2) % 3 == 1){
      if(array[i]!= 0){
        Text(FindX(i/3,width,height),FindY(i/3,width,height),array[i],"10px Arial",0,"black");
      }
    }else{
      if(selectedBox != (i+1)/3 ){
        if(array[i]==1){
          rect(FindX((i+1)/3,width,height),FindY((i+1)/3,width,height),30,30,"black");
          if(ListContains(correct,(i+1)/3)){
          }else{
            correct.push((i+1)/3);
          }
        }else if(array[i]==2){
          rect(FindX((i+1)/3,width,height),FindY((i+1)/3,width,height),30,30,"white");
          if(ListContains(correct,(i+1)/3)){
          }else{
            correct.push((i+1)/3);
          }
        }else{
          drawBox(FindX((i+1)/3,width,height),FindY((i+1)/3,width,height));
        }
      }else{
        drawOutline(FindX(selectedBox,width,height),FindY(selectedBox,width,height));
      }
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
    y+=30;
    if(y>=1470){
      x+=550;
      y=0;
    }
  }
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
function clearPuzzle(){
  correct = [];
  LoadLevel(localStorage.getItem("textContent"));
}
function ParseClick(canvas, event,boxes,width,height) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var boxWithin = 0;
  for(let i = 1;i<boxes+1;i++){
    if(PosWithin(FindX(i,width,height),FindY(i,width,height),FindX(i,width,height)+30,FindY(i,width,height)+30,x,y)){
      boxWithin = i;
    }
  }
  if (boxWithin != 0){
    selectedBox = boxWithin;
    eraseCanvas();
    LoadLevel(localStorage.getItem("textContent"));
  }

} 

drawBox(0,0);
//Text(0,0,"A","bold 18px Arial",1,"black");
//Text(0,0,"1","10px Arial",0,"black");

//LoadLevel("2 2 3 1 1 3 2 19 3 3 14 3 0 15 A 1,as 3,no D 1,an 2,so");

LoadLevel(localStorage.getItem("textContent"));
var Loaded = localStorage.getItem("textContent").split("|");
var width = Loaded[0];
var height = Loaded[1];  
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
        if(event.keyCode - 64 == letters[selectedBox-1]){
          Text(FindX(selectedBox,width,height),FindY(selectedBox,width,height),event.key,"bold 18px Arial",1,"blue");
          correct.push(selectedBox);
          if(correct.length == width*height){
            const e = new Date();
            var end = e.getTime();
            alert("You Completed The Puzzle In "+Math.floor(((end-start)/1000)/60)+" Minutes and "+Math.floor(((end-start)/1000)%60)+" Seconds");
          }
        }else{
          Text(FindX(selectedBox,width,height),FindY(selectedBox,width,height),event.key,"bold 18px Arial",1,"red");
        }
        selectedBox+=1;
      }
    }
  }
})