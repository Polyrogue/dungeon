//http://www.roguebasin.com/index.php?title=Dungeon-Building_Algorithm
// small room, big room, up down left right corridor
var grid = []
var dW = 80; //dungeon width
var dH = 60; //dungeon height
var cS = 12; //cell size
var noOfFeatures = 40;
var input,button,head;
var features = [0,1,1]; //0 = short corridor, 1 = small room
var isGrid = true;

var bannerSize = 196;
var inputW,txtW,inputH,txtH,inputF,txtF,txtInfo,t,button,btnSave,btnSaveR,btnG

/*
var imgWall;
var imgFloor;
function preload()
{
  imgWall = loadImage("wall.png");
  imgFloor = loadImage("floor.png");
}
*/

var Cell = function(x,y)
{
    this.size = cS; //cell width
    this.x = x;
    this.y = y;
    this.i1 = this.x/cS;
    this.i2 = this.y/cS;
    //this.s = 1 //state, 0 = clear 1 = solid
    this.arr = [0,1];
    //this.s = random(this.arr);
    this.s = 1;
    this.draw = function()
    {
      this.size = cS; //cell width
      switch(this.s)
      {
        case 0:
          fill(255);
          //image(imgWall,this.x,this.y,cS,cS);
          break;
        case 1:
          fill(0);
          break;
        case 2:
          fill(255,0,0);
      }
      //coordString = this. i1 + "," + this.i2;
      if(isGrid)
      {
        stroke(100,100,100);
      }
      else
      {
        noStroke();
      }
      //noFill()
      rect(this.x,this.y,this.size,this.size);
      fill(0,150,150);
      noStroke()
      textSize(10);
      //text(coordString,this.x+5,this.y+cS/2);
    }
    this.checkCol = function()
    {
      if(mouseX > this.x && mouseX < this.x+cS && mouseY > this.y && mouseY < this.y+cS)
      {
        if(this.s == 0)
        {
          this.s = 1;
        }
        else
        {
          this.s = 0;
        }
      }
    }
}

function checkRectForState(x1,y1,x2,y2,state)
{
  uniform = true;
  for(i = 0; i < dW; i++)
  {
    if(i >= x1 && i <= x2)
    {
      for(j = 0; j < dH; j++)
      {
        if(j >= y1 && j <= y2)
        {
          //We are inthe bounds of where we are checking.
          if(grid[i][j].s != state)
          {
            uniform = false;
          }
        }
      }
    }
  }
  return uniform
}

function initUI()
{
  if(button)
  {
    button.remove();
  }
  button = createButton("Generate");
  button.position(width-178,185);
  button.size(128,48);
  button.mousePressed(generate);
  
  if(btnSave)
  {
    btnSave.remove();
  }
  btnSave = createButton("Save Dungeon map (.png)");
  btnSave.position(width-178,245);
  btnSave.size(128,36);
  btnSave.mousePressed(saveDungeon);
  
  if(btnSaveR)
  {
    btnSaveR.remove();
  }
  btnSaveR = createButton("Save as Roll20 map (70px units)");
  btnSaveR.position(width-178,295);
  btnSaveR.size(128,36);
  btnSaveR.mousePressed(saveDungeonR);
  
  if(btnG)
  {
    btnG.remove();
  }
  btnG = createButton("Toggle Grid");
  btnG.position(width-178,345);
  btnG.size(128,36);
  btnG.mousePressed(toggleGrid);
  
  
  if(head)
  {
    head.remove();
  }
  head = createElement("h1","POLYDUNGEON");
  head.style("font-family", "monospace");
  head.style("color","red");
  head.position(width-178, 5);
  
  if(inputW)
  {
    inputW.remove();
  }
  inputW = createInput();
  inputW.size(25,15);
  inputW.position(width-80, 65);
   
  if(txtW)
  {
    txtW.remove();
  }
  txtW = createElement("h2","Width:");
  txtW.style("font-family","monospace");
  txtW.style("color","red");
  txtW.position(width-178,inputW.height+28);
  
  if(inputH)
  {
    inputH.remove();
  }
  inputH = createInput();
  inputH.size(25,15);
  inputH.position(width-80, 105);
   
  if(txtH)
  {
    txtH.remove();
  }
  txtH = createElement("h2","Height:");
  txtH.style("font-family","monospace");
  txtH.style("color","red");
  txtH.position(width-178,inputH.height+68);
  
  if(inputF)
  {
    inputF.remove();
  }
  inputF = createInput();
  inputF.size(25,15);
  inputF.position(width-80, 145);
   
  if(txtF)
  {
    txtF.remove();
  }
  txtF = createElement("h2","Features:");
  txtF.style("font-family","monospace");
  txtF.style("color","red");
  txtF.position(width-178,inputF.height+108);
  
  if(txtInfo)
  {
    txtInfo.remove();
  }
  txtInfo = createElement("h4","Left click on a cell <br>to dig/undig!</br>");
  txtInfo.style("font-family","monospace");
  txtInfo.style("color","red");
  txtInfo.style("text-align","center");
  txtInfo.position(width-178,368);
}


function setup() 
{
  initUI();
  generate();
}

function fillRect(x1,y1,x2,y2,state)
{
  for(i = 0; i < dW; i++)
  {
    if(i >= x1 && i <= x2)
    {
      for(j = 0; j < dH; j++)
      {
        if(j >= y1 && j <= y2)
        {
          grid[i][j].s = state
        }
      }
    }
  }
}

function fillGrid()
{
  grid = []
  for(i = 0; i < dW; i++)
  {
    grid[i] = [];
    for(j = 0; j < dH; j++)
    {
      grid[i] = [];
    }
  }
  for(i = 0; i < dW; i++)
  {
    grid[i] = [];
    for(j = 0; j < dH; j++)
    {
      grid[i][j] = new Cell(i*cS,j*cS,i,j);
    }
  }
}

function drawDungeon(wMap)
{
  if(wMap)
  {
    createCanvas((dW*cS)+bannerSize,(dH*cS));
    noStroke();
    fill(51);
    rect(width-bannerSize,0,bannerSize,height);
    initUI();
  }
  else
  {
    createCanvas(dW*cS,dH*cS);
  }
  for(i = 0; i < dW; i++)
  {
    for(j = 0; j < dH; j++)
    {
      grid[i][j].x = (i*cS);
      grid[i][j].y = j*cS;
      grid[i][j].draw();
    }
  }
}

function generate()
{
  if(inputW.value())
  {
    dW = floor(int(inputW.value()));
  }
  if(inputH.value())
  {
    dH = floor(int(inputH.value()));
  }
  if(inputF.value())
  {
    noOfFeatures = int(inputF.value());
  }
  if(!dW || !dH || !noOfFeatures)
  {
    dW = 80;
    dH = 60;
    noOfFeatures = 40;
  }
  if(dW >= 35 && dH >= 35)
  {
    //initialise the grid
    fillGrid();
    
  //dig out a single room in the centre of the map
    rW = floor(random(2,5))
    rH  = floor(random(2,5))
    fillRect(dW/2-rW,dH/2-rH,dW/2+rW,dH/2+rH,0);
    
    //See how many features we have to build:
    
    //Choose a feature to build until you've found one with space.
    for(k = 0; k < noOfFeatures; k++)
    {
      validFeatureChosen = false;
      while(!validFeatureChosen)
      {
        //pick a wall of the room:
        wallX = 0
        wallY = 0
        wallSide = -1; // -1 = not found 0 = right 1 = down 2 = left 3 = up
        foundAWall = false
        chooseWall();
        
        //check to see if we can build it.
        feature = random(features);
        validFeatureChosen = validateFeature(feature,wallSide);
        //do this for as many times as we want.
      }
    }
    drawDungeon(true);
  }
  else
  {
    alert("Error! The width and height must be at least 35!");
  }
}

function chooseWall()
{
  while(!foundAWall) //todo: revert to !foundAWall
  {
    wallX = floor(random(1,dW-1));
    wallY = floor(random(1,dH-1));
    //check to see if it's a solid square
    if(grid[wallX][wallY].s == 1)
    {
      //it's solid, so let's see if it is to the left, right, top, or bottom of any room 
      if(grid[wallX-1][wallY].s == 1 && grid[wallX+1][wallY].s == 1 && grid[wallX][wallY-1].s == 1 && grid[wallX][wallY+1].s == 0)//see if wall is above a room
      {
        foundAWall = true;
        wallSide = 3;
      }
      else if(grid[wallX-1][wallY].s == 1 && grid[wallX+1][wallY].s == 1 && grid[wallX][wallY-1].s == 0 && grid[wallX][wallY+1].s == 1) //see if wall is below a room
      {
        foundAWall = true;
        wallSide = 1;
      }
      else if(grid[wallX-1][wallY].s == 0 && grid[wallX+1][wallY].s == 1 && grid[wallX][wallY-1].s == 1 && grid[wallX][wallY+1].s == 1) //see if wall is right of a room
      {
        foundAWall = true;
        wallSide = 0;
      }
      else if(grid[wallX-1][wallY].s == 1 && grid[wallX+1][wallY].s == 0 && grid[wallX][wallY-1].s == 1 && grid[wallX][wallY+1].s == 1) //see if wall is left of a room
      {
        foundAWall = true;
        wallSide = 2;  
      }
    }
  }
}

function validateFeature(f,dir)
{
  corL = floor(random(2,6));
  roomW = floor(random(3,7));
  roomH = floor(random(3,7));
  switch(f)
  {
    case 0: //corridor
      switch(dir)
      {
        case 0: //facing right
          vx1 = wallX;
          vy1 = wallY-1;
          vx2 = wallX+corL;
          vy2 = wallY+1;
          valid = checkRectForState(vx1,vy1,vx2,vy2,1);
          print("Check Rect returned: " + valid);
          if(valid)
          {
            fillRect(wallX,wallY,wallX+(corL-1),wallY,0);
          }
          return valid;
          break;
        case 1:
          vx1 = wallX-1;
          vy1 = wallY;
          vx2 = wallX+1;
          vy2 = wallY+corL;
          valid = checkRectForState(vx1,vy1,vx2,vy2,1);
          if(valid)
          {
            fillRect(wallX,wallY,wallX,wallY+(corL-1),0);
          }
          return valid;
          break;
        case 2:
          vx1 = wallX-corL;
          vy1 = wallY;
          vx2 = wallX;
          vy2 = wallY;
          valid = checkRectForState(vx1,vy1,vx2,vy2,1);
          if(valid)
          {
            fillRect(wallX-(corL-1),wallY,wallX,wallY,0);
          }
          return valid;
          break;
        case 3: //facing up
          vx1 = wallX-1;
          vy1 = wallY-corL;
          vx2 = wallX+1;
          vy2 = wallY;
          valid = checkRectForState(vx1,vy1,vx2,vy2,1);
          //fillRect(vx1,vy1,vx2,vy2,3);
          if(valid)
          {
            fillRect(wallX,wallY-(corL-1),wallX,wallY,0);
          }
          return valid;
          break;
      }
      break;
    case 1: //5x5 room
      switch(dir)
      {
        case 0: //facing right
          vx1 = wallX;
          vy1 = wallY-roomH;
          vx2 = wallX+roomW;
          vy2 = wallY+roomH;
          valid = checkRectForState(vx1,vy1,vx2,vy2,1);
          if(valid)
          {
            grid[wallX][wallY].s = 0;
            fillRect(wallX+1,wallY-(roomH-1),wallX+(roomW-1),wallY+(roomH-1),0);
          }
          return valid;
          break;
        case 1: //facing down
          vx1 = wallX-roomW;
          vy1 = wallY;
          vx2 = wallX+roomW;
          vy2 = wallY+roomH;
          valid = checkRectForState(vx1,vy1,vx2,vy2,1);
          if(valid)
          {
            grid[wallX][wallY].s = 0;
            fillRect(wallX-(roomW-1),wallY+1,wallX+(roomW-1),wallY+(roomH-1),0);
          }
          return valid;
          break;
        case 2: //facing left
          vx1 = wallX-roomW;
          vy1 = wallY-roomH;
          vx2 = wallX;
          vy2 = wallX+roomW;
          valid = checkRectForState(vx1,vy1,vx2,vy2,1);
          if(valid)
          {
            grid[wallX][wallY].s = 0;
            fillRect(wallX-(roomW-1),wallY-(roomH-1),wallX-1,wallY+(roomH-1),0);
          }
          return valid;
          break;
        case 3: //facing up
          vx1 = wallX-roomW;
          vy1 = wallY-roomH;
          vx2 = wallX+roomW;
          vy2 = wallY;
          valid = checkRectForState(vx1,vy1,vx2,vy2,1);
          if(valid)
          {
            grid[wallX][wallY].s = 0;
            fillRect(wallX-(roomW-1),wallY-(roomH-1),wallX+(roomW-1),wallY-1,0);
          }
          return valid
          break;
      }
      break;
  }
}

function mousePressed()
{
  for(var i = 0; i < dW; i++)
  {
    for(var j = 0; j < dH; j++)
    {
      grid[i][j].checkCol();
    }
  }
  if(mouseX < dW*cS)
  {
    drawDungeon(true);
  }
}

function keyPressed()
{
  switch(keyCode)
  {
    case ENTER:
      generate();
      break;
  }
  if(key == "G")
  {
    isGrid = !isGrid;
    drawDungeon(true);
  }
  if(key == "R")
  {
    cS = 70;
    drawDungeon(false);
    n = floor(random(1000,10000))
    save("Dungeon-" + dW + "x" + dH + "-" + n + "R.png");  
    cS = 12;
    drawDungeon(true);
  }
  else if(key == "S")
  {
    drawDungeon(false);
    n = floor(random(1000,10000))
    save("Dungeon-" + dW + "x" + dH + "-" + n + ".png"); 
    drawDungeon(true);
  }
}

function saveDungeon()
{
    drawDungeon(false);
    n = floor(random(1000,10000))
    save("Dungeon-" + dW + "x" + dH + "-" + n + ".png"); 
    drawDungeon(true);
}

function saveDungeonR()
{
    cS = 70;
    drawDungeon(false);
    n = floor(random(1000,10000))
    save("Dungeon-" + dW + "x" + dH + "-" + n + "R.png");  
    cS = 12;
    drawDungeon(true);
}

function toggleGrid()
{
  isGrid = !isGrid;
  drawDungeon(true);
}