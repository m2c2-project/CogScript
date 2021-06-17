 
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");

// --------------------------------
// useful snippets
// --------------------------------
// responseTrigger.GetStartTime();

// --------------------------------
// global functions
// --------------------------------

function Init()
{
	// initiate counters
	trialNum = 0;

	// timing params
	trial_timeout = 6000;
	
	// init params
	response_time = -2;
	current_time = -2;
 
   targ_x = -999;
   targ_y = -999;
   
 	// define colors
	white = new GColor(1,1,1);
	black = new GColor(0,0,0);

	// global cogtask variables
	SetName(GetName());
}
 
function GetName()
{
  return "fitts_law";
}
 
function GetInstructions()
{
	// return array of strings for the instructions
	return ["Click the red square, as fast as possible."];
}
 
// create/load images
function LoadImages()
{
}
 
function DrawBlockTransition()
{
}
 
// --------------------------------
// trial-level functions
// --------------------------------
 
// run at the start of each trial
function Start()
{
  audit_start_start = KTime.GetMilliTime();
  
	// get trial params
  circle_radius = GetParamInt("annulus_radius", 100);
  circle_total_points = GetParamInt("annulus_n_pts", 9);
  circle_point_size = GetParamInt("annulus_pt_size", 30);
  
  // generate location for random target
  rand_target = GameEngine.RandomInt(1,circle_total_points);

	// optional start time
	startTime = KTime.GetMilliTime();

  audit_start_end = KTime.GetMilliTime();
}
 
function Update()
{
  audit_update_start = KTime.GetMilliTime();

	// update current time
	current_time = KTime.GetMilliTime() - startTime;

  audit_update_end = KTime.GetMilliTime();
}
 
function Draw()
{
  audit_draw_start = KTime.GetMilliTime();

	// draw current time elapsed
	GameEngine.ResetColor();
	GameEngine.SetColor(0,0,0);
	GameDraw.DrawText("Time elapsed: " + current_time, 50, 25);
	GameEngine.ResetColor();
 
  // draw n targets along annulus
  for (var i = 1; i <= circle_total_points  ; i++) {
    var theta = ((Math.PI*2) / circle_total_points);
    var angle = (theta * i);
  
    c_x = (circle_radius * Math.cos(angle)) + GameEngine.GetWidth()/2;
    c_y = (circle_radius * Math.sin(angle)) + GameEngine.GetHeight()/2;
      
    // draw target as red
    if(i == rand_target) {
      targ_x = c_x;
      targ_y = c_y;
      GameEngine.SetColor(255,0,0);
      GameDraw.DrawBox(c_x, c_y, circle_point_size, circle_point_size);
      GameEngine.ResetColor();
    } else {
      GameEngine.SetColor(120,120,120);
      GameDraw.DrawBox(c_x, c_y, circle_point_size, circle_point_size);
      GameEngine.ResetColor();
    }
  }
 
  audit_draw_end = KTime.GetMilliTime();
}
 
function OnClickDown(x,y,clickTime)
{
  //if(cross.PointCollide(x,y)) {
  	// calculate and save RT
    click_x = x;
    click_y = y;
  	response_time = clickTime - startTime;
  	CallEndTrial();
  //}
}
 
function OnClickUp(x,y,clickTime)
{
}
 
function OnClickMove(x,y,clickTime)
{
}
 
function ExportData()
{
  // save relevant values
  AddResult("circle_num_pts", "" + circle_total_points);
  AddResult("circle_radius", "" + circle_radius);
  AddResult("circle_point_size", "" + circle_point_size);
  AddResult("click_x", "" + click_x);
  AddResult("click_y", "" + click_y);
  AddResult("target_x", "" + targ_x);
  AddResult("target_y", "" + targ_y);
  AddResult("response_time", "" + response_time);
  AddResult("audit_start_start", "" + audit_start_start);
  AddResult("audit_start_end", "" + audit_start_end);
  AddResult("audit_update_start", "" + audit_update_start);
  AddResult("audit_update_end", "" + audit_update_end);
  AddResult("audit_draw_start", "" + audit_draw_start);
  AddResult("audit_draw_end", "" + audit_draw_end);
}
