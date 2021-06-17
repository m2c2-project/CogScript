 
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

	// global cogtask variables
	SetName(GetName());

	// turn bloat on/off for dev
	bloat = 999;
	bloat_calc = 0;
}
 
function GetName()
{
  return "beat_the_clock";
}
 
function GetInstructions()
{
	// return array of strings for the instructions
	return ["You will be shown a target time. Your goal is to stop the clock shown on screen at the number shown as the TARGET."];
}
 
// create/load images
function LoadImages()
{
	// layout params
	button_font_size = 48;
	button_width = GameEngine.GetWidth() - 100;
	button_height = GameEngine.GetHeight() / 6;
	button_animate_time = 60;
	button_distance_from_top = 600;
	screen_center = (GameEngine.GetWidth() - button_width)/2;

	// define colors
	white = new GColor(1,1,1);
	black = new GColor(0,0,0);

	//  static CreateButtonImage(text, size, center, bW, bH, grad1, grad2, textColor, borderColor)
	button_go_txt = GImage_Create.CreateButtonSet("GO", button_font_size, true, button_width, button_height, white, white, black, black);
	button_stop_txt = GImage_Create.CreateButtonSet("STOP", button_font_size, true, button_width, button_height);
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
  
	// create button
	buttonGo = new GButton(button_go_txt, screen_center, button_distance_from_top, button_animate_time);
	buttonGo.alpha.Set(1,1,1);

	// get trial params
  low_num = GetParam("low_num", 1000);
  high_num = GetParam("high_num", 1000);
  bloat = GetParam("bloat", 0);
  
  // blank out bloat calc
  bloat_calc = 0;
  
	// check if low is higher than high and flip before using in target_time=
	target_time = GameEngine.Random(ToInt(low_num),ToInt(high_num));
 
  // create target time entity
  imTargetTime = GImage_Create.CreateTextImage(target_time, 32, true);
  entTargetTime = new Entity(imTargetTime, imTargetTime.GetCenterX(), imTargetTime.GetCenterX());
  entTargetTime.SetColor(new GColor(0,0,0));
  entTargetTime.alpha.Set(1,1,1);

	// optional start time
	startTime = KTime.GetMilliTime();

  audit_start_end = KTime.GetMilliTime();
}
 
function Update()
{
  audit_update_start = KTime.GetMilliTime();
  
	// draw go button
	buttonGo.Update();
 
  // update target time
  entTargetTime.Update();

	// update current time
	current_time = KTime.GetMilliTime() - startTime;

  // if bloat flag is on
	if(bloat == 1) {
		// add bloat here (math calc)
    bloat_min = 40;
    bloat_max = 400;
		bloat_calc = (GameEngine.Random(bloat_min, bloat_max) * GameEngine.Random(bloat_min, bloat_max)) * (GameEngine.Random(bloat_min, bloat_max) * GameEngine.Random(bloat_min, bloat_max)) * GameEngine.Random(bloat_min, bloat_max);
	}
 
  audit_update_end = KTime.GetMilliTime();
}
 
function Draw()
{
  audit_draw_start = KTime.GetMilliTime();

	// draw go button
	buttonGo.Draw();
 
 // draw target time
  entTargetTime.Draw();

	// draw current time elapsed
	GameEngine.ResetColor();
	GameEngine.SetColor(0,0,0);
	GameDraw.DrawText("Time elapsed: " + current_time, 50, 25);
	GameDraw.DrawText("Bloat (0=off): " + bloat_calc, 50, 75);
  GameDraw.DrawText("Target Time: " + target_time, 50, 100);
	GameEngine.ResetColor();
 
   audit_draw_end = KTime.GetMilliTime();
}
 
function OnClickDown(x,y,clickTime)
{
	if (buttonGo.CheckPressed(x,y)) {
		// calculate and save RT
    click_x = x;
    click_y = y;
		response_time = clickTime - startTime;
		CallEndTrial();
	}
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
  AddResult("click_x", "" + click_x);
  AddResult("click_y", "" + click_y);
  AddResult("dev_bloat_flag", "" + bloat);
  AddResult("response_time", "" + response_time);
  AddResult("target_time", "" + target_time);
  AddResult("audit_start_start", "" + audit_start_start);
  AddResult("audit_start_end", "" + audit_start_end);
  AddResult("audit_update_start", "" + audit_update_start);
  AddResult("audit_update_end", "" + audit_update_end);
  AddResult("audit_draw_start", "" + audit_draw_start);
  AddResult("audit_draw_end", "" + audit_draw_end);
}
