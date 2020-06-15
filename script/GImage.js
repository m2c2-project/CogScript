
Include("GameEngine.js");
Include("GColor.js");


class GImage
{
 constructor()
 {
  this.imageIndex = -1;

  this.w = 1;
  this.h = 1;
  
  
 }

 LoadImage(str)
 {
  // saves the int location of the image
  this.SetImage(GImage_LoadImage(str));

 }

 SetImage(i)
 {
  // sets an image from an index in the java code
  this.imageIndex = i;
  this.w = GImage_GetW(this.imageIndex);
  this.h = GImage_GetH(this.imageIndex);
 }
  
 
 GetImageIndex()
 {
  return this.imageIndex;
 }



 GetCenterX(fullW = GameEngine.GetWidth())
 {
  return (fullW - this.w)/2;
 }

 GetCenterY(fullH = GameEngine.GetHeight())
 {
  return (fullH - this.h)/2;
 }


 GetWidth()
 {
  return this.w;
 }

 GetHeight()
 {
   return this.h;
 }


 





  // reloads all images
  // this must be called because the width and height aren't set until the main app loads them later
  // calling this will give the correct width and height variables to the GImage
 static ReloadImages()
 {
  for (var i = 0; i < GImage.imageReloadList.GetSize(); i++)
  {
    GImage.imageReloadList.Get(i).SetImage(GImage.imageReloadList.Get(i).imageIndex);
  }
 
 }


 static CreateFromZipFile(zipRef, filename)
 {
   var image = new GImage();
   image.SetImage(GImage_CreateFromZipFile(zipRef, filename));

   return image;
 }
 
 


}

GImage.imageReloadList = new GList();
