function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

// Try edit msg
//var msg = 'Hello world';
//var icon = ' <i class="fa fa-smile-o"></i>';


//console.log(msg)

//$('#msg').html(msg + icon)

function getInput(){
  
  return getURLParameter("func")
}


function parseInput(input, xBounds, yBounds, numVals, isDirect){
	
	if(isDirect){
		for(var pos = 0; pos < input.length; ++pos){
			if(input[pos] === "%"){
				input = input.slice(0, pos) + String.fromCharCode(parseInt("0x" + input[pos + 1] + input[pos + 2])) + input.slice(pos + 3);
			}
		}
		console.log(input);
	}
	
//********************
//BEGIN ERROR CHECKING
//********************
  var legalCharacters = "1234567890-+*/^()xyπ. ";
  legalCharacters += "\xa3\xa4\xa5";
  //var isError = false;

  input = input.toLowerCase();
  input = input.replace(new RegExp(" ", 'g'), "");
  input = input.replace(new RegExp("\\x5b", 'g'), "(");
  input = input.replace(new RegExp("]", 'g'), ")");

  //console.log(input)
  if(input.indexOf('\xa3') !== -1){
      return "Illegal character: \xa3";
    }
  if(input.indexOf('\xa4') !== -1){
      return "Illegal character: \xa4";
    }
  if(input.indexOf('\xa5') !== -1){
      return "Illegal character: \xa5";
    }
  
  input = input.replace(new RegExp("sin\\(", 'g'), "\xa3(");
  input = input.replace(new RegExp("cos\\(", 'g'), "\xa4(");
  input = input.replace(new RegExp("tan\\(", 'g'), "\xa5(");
  input = input.replace(new RegExp("pi", 'g'), "π");
  
  //console.log(input);

  for(let i = 0; i < input.length; ++i){
    var cChar = input[i];
    if(legalCharacters.indexOf(cChar) === -1){
      return "Illegal character: "+cChar;
    }
  }
  if(input.split(")").length !== input.split("(").length){
      return "Incorrect number of brackets";
    }

  for(var a = 0; a < input.length; ++a){
    if("(+-*^/".includes(input[a]) &&
        "+*^/)".includes(input[a + 1])){
     return "Illegal expression: " + input[a] + input[a + 1]; 
    }
    else if("." === input[a] &&
          !("0123456789".includes(input[a + 1]))){
      return "Illegal Expression: ." + input[a + 1]
    }
    else if("xy".includes(input[a])){
      if("0123456789xy".includes(input[a - 1])){
        return "You must use * (" + input[a-1] + input[a]+')'
      }
    }
  }

  input = input.replace(new RegExp("\\^", 'g'), "**");
  input = input.replace(new RegExp("\xa3\\(", 'g'), "Math.sin(");
  input = input.replace(new RegExp("\xa4\\(", 'g'), "Math.cos(");
  input = input.replace(new RegExp("\xa5\\(", 'g'), "Math.tan(");
  input = input.replace(new RegExp("π", 'g'), "Math.PI");
  //console.log(input);
//******************
//END ERROR CHECKING
//******************

  var coordinates = [[], [], []];
  
  if(1){
    function func(x, y){
      return 0;
    }
    try{
    func = new Function("x", "y", "return "+input+";");

    }catch(err){
      return ("Other: Invalid Input");
    }
    for(let x = xBounds[0]; x <= xBounds[1]; x += (xBounds[1]-xBounds[0])/numVals){
      var str = "";
      for(let y = yBounds[0]; y <= yBounds[1]; y += (yBounds[1]-yBounds[0])/numVals){
        
        coordinates[0].push(x);
        coordinates[1].push(y);
        coordinates[2].push(func(x, y));
        
        str += "," + func(x, y);
      }
    //console.log(str); 
    
    }
  }
  return coordinates;
}


console.log(parseInput(getInput(), [-5, 5], [-5, 5], 1000, true));