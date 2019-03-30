//intilize three.js stuff 
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var material = new THREE.MeshBasicMaterial( {color: 0x00ffff});



var xbd = [-9,9];
var ybd = [-9,9];
var maxVals = 20;

var coords = parseInput("9*sin(x/3)",xbd,ybd,maxVals,false,1,50); 


/////////
///////// 


/*var geom = new THREE.Geometry(); 
var v1 = new THREE.Vector3(0,0,0);
var v2 = new THREE.Vector3(0,500,0);
var v3 = new THREE.Vector3(0,500,500);
var v4 = new THREE.Vector3(500,500,500);

geom.vertices.push(v1);
geom.vertices.push(v2);
geom.vertices.push(v3);
geom.vertices.push(v4);*/

function find_elem(x, y){
	for(var i = 0; i < coords[0].length; ++i){
		//console.log(coords[0][i], coords[1][i])
		if((coords[0][i] === x) && (coords[1][i] === y)){
			return coords[2][i];
		}
	}
	return 70;
}

function makeMesh(xbd, ybd, maxVals, coords){
	var incs = [(xbd[1]-xbd[0])/maxVals, (ybd[1]-ybd[0])/maxVals,]
	for(var i = 0; i < coords[0].length; ++i){
		var geom = new THREE.Geometry()
		xCords = [coords[0][i], coords[0][i]+incs[0], coords[0][i]+incs[0]];
		yCords = [coords[1][i]+incs[1], coords[1][i], coords[1][i]+incs[1]];
		geom.vertices.push(new THREE.Vector3(coords[0][i],coords[1][i],coords[2][i]))
	
		for(var j = 0; j < 3; j++){
			var foundZ = find_elem(xCords[j], yCords[j]);
			if(foundZ !== 70){
		
				//console.log(xCords[j], yCords[j], foundZ, "!!!")
				geom.vertices.push(new THREE.Vector3(xCords[j], yCords[j], foundZ));
			
				if((geom.vertices.length === 3)){
					geom.faces.push( new THREE.Face3( 2, 1, 0 ) );
					geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
					geom.computeFaceNormals();
					var object = new THREE.Mesh( geom, material );
					scene.add(object);
					//object.rotation.x = Math.PI / 6;
				}
				else if(geom.vertices.length === 4){
					console.log(xCords[j], yCords[j], foundZ, "!!!")
					geom.faces.push( new THREE.Face3( 3, 2, 1 ) );
					geom.faces.push( new THREE.Face3( 1, 2, 3 ) );
					geom.computeFaceNormals();
					var object = new THREE.Mesh( geom, material );
					scene.add(object);
				//object.rotation.x = Math.PI / 6;
				}
			
			}
		}
	
	}
}
makeMesh(xbd, ybd, maxVals, coords);

//var object = new THREE.Mesh( geom, material );
//scene.add(object);
//scene.add(sphere);




//////// 
////////
/*
var verts = []; //uses points to make faces
var buffer = []; //stores temp points 


verts[0] = new THREE.Vector3(coords[0][0],coords[2][0],)

var i =0;  
for(i; i < coords[0].length; i++){

}
*/






//camera settings and render 
camera.position.z = 20; 
            

			var animate = function () {
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
			};

            animate();   




//coordinate maker 

function parseInput(input, xBounds, yBounds, numVals, isDirect, factor, heightMaxes){
	
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
        
		var retVal = func(x, y);
		if(Math.abs(retVal) < 50){
			coordinates[0].push(x/factor);
			coordinates[1].push(y/factor);
			coordinates[2].push(func(x, y)/factor);
		}
        
        str += "," + func(x, y);
      }
    //console.log(str); 
    
    }
  } 

  document.write(coordinates);
  return coordinates;
}

