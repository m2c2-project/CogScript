
Include("GList.js");

class LogMan
{
	 static Log(tag, str)
	 {
		  LogMan_Log(tag, str);
	 }
	
}

function ToInt(i)
{
	return parseInt(i,10);
}

function ToBool(b)
{
	// converts a string to bool
	return b.toLowerCase() == 'true';
}

function ToFloat(i)
{
	return (i);
}



