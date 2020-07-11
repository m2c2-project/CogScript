



class Trial
{
  constructor(params)
  {
    this.params = params;
    this.complete = false;
    this.entList = new GList();
  }


  Start()
  {

  }

  LoadImages()
  {

  }

  Update()
  {
      for (var i = 0; i < this.entList.GetSize(); i++)
      {
        this.entList.Get(i).Update();
      }
  }

  Draw()
  {
    for (var i = 0; i < this.entList.GetSize(); i++)
    {
      this.entList.Get(i).Draw();
    }
  }

  OnClickUp(x,y,clickInfo)
  {

  }

  OnClickDown(x,y,clickInfo)
  {

  }

  OnClickMove(x,y,clickInfo)
  {

  }


  CallEndTrial()
  {
    //this.complete = true;
    CallEndTrial(); // global func
  }

  ExportData()
  {


  }





}