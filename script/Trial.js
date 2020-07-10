



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

  OnClickUp(x,y,clickTime)
  {

  }

  OnClickDown(x,y,clickTime)
  {

  }

  OnClickMove(x,y,clickTime)
  {

  }


  CallTrialEnd()
  {
    this.complete = true;
  }





}