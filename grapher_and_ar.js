/*//////////////////////////////////////////////
AR.js Initi Start___ 
//////////////////////////////////////////////*/
THREEx.ArToolkitContext.baseURL = "ar_three/";  
//newwww
// init renderer
var renderer	= new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setClearColor(new THREE.Color('grey'), 0)
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
renderer.setSize( 640, 480 );
document.body.appendChild( renderer.domElement );
 

// array of functions for the rendering loop
var onRenderFcts= [];
// init scene and camera
var scene	= new THREE.Scene(); 


//		Initialize a basic camera

// Create a camera
var camera = new THREE.Camera();
scene.add(camera);
 

	//          handle arToolkitSource
	////////////////////////////////////////////////////////////////////////////////
	var arToolkitSource = new THREEx.ArToolkitSource({
		// to read from the webcam 
		sourceType : 'webcam',
		
		// // to read from an image
		// sourceType : 'image',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',		
		// to read from a video
		// sourceType : 'video',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',		
	})
	arToolkitSource.init(function onReady(){
		onResize()
    }) 
    
    // handle resize
	window.addEventListener('resize', function(){
		onResize()
    }) 
    
    function onResize(){
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if( arToolkitContext.arController !== null ){
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
    }  

    // create atToolkitContext
	var arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'camera_para.dat',
		detectionMode: 'mono',
	})

    // initialize it
	arToolkitContext.init(function onCompleted(){
		// copy projection matrix to camera
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
    }) 
    
    // update artoolkit on every frame
	onRenderFcts.push(function(){
		if( arToolkitSource.ready === false )	return
		arToolkitContext.update( arToolkitSource.domElement )
		
		// update scene.visible if the marker is seen
		scene.visible = camera.visible
    })  

    // init controls for camera
	var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
		type : 'pattern',
		patternUrl : THREEx.ArToolkitContext.baseURL + 'patt.hiro',
		changeMatrixMode: 'cameraTransformMatrix'
	})
	// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
    scene.visible = false  

    /*////////////////////////////////////////////////////////////////////////////// 
    End of AR.js Initi 
    //////////////////////////////////////////////////////////////////////////////*/
    
    /////////////////////////////////////////////////////////////////////////////////
	//Scene Creation
	//////////////////////////////////////////////////////////////////////////////////
      

   

  /* function testScene(scene){
    var geometry = new THREE.SphereGeometry(1,32,32); 
    var material = new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.5,
		side: THREE.DoubleSide
    });  
    var mesh = new THREE.Mesh(geometry,material); 
    scene.add(mesh);  
    
   } */

  // testScene(scene); 
  
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

   function parseInput(input, xBounds, yBounds, numVals, isDirect, factor, heightMaxes){
	
	if(isDirect){
		for(var pos = 0; pos < input.length; ++pos){
			if(input[pos] === "%"){
				input = input.slice(0, pos) + String.fromCharCode(parseInt("0x" + input[pos + 1] + input[pos + 2])) + input.slice(pos + 3);
			}
		}
		console.log(input);
	}
	
	input = input.toLowerCase();
	
//********************
//BEGIN ERROR CHECKING
//********************
  
  var allowedChars = "\xa3\xa4\xa5 1234567890+-*/^()xyπ."
  //var isError = false;

  input = input.replace(new RegExp(" ", 'g'), "")
  input = input.replace(new RegExp("\\x5b", 'g'), "(")
  input = input.replace(new RegExp("]", 'g'), ")")

  
  //console.log(input)
  var bannedChars = '\xa3\xa4\xa5';
  
  for(var i = 0; i < bannedChars.length; ++i){
	  if (input.includes(bannedChars[i])){
		return "Illegal character: " + bannedChars[i];
	  }
  }
  
  input = input.replace(new RegExp("sin\\(", 'g'), "\xa3(");
  input = input.replace(new RegExp("cos\\(", 'g'), "\xa4(");
  input = input.replace(new RegExp("tan\\(", 'g'), "\xa5(");
  input = input.replace(new RegExp("pi", 'g'), "π");
  
  //console.log(input);
  
  for(let i = 0; i < input.length; ++i){
	  if(!allowedChars.includes(input[i])){
		  return "Illegal Character: " + input[i];
	  }
  }
  var excessBrackets = input.split("(").length - input.split(")").length;
  if(excessBrackets > 0){
	  return "Too many ( parentheses!"
  }
  if(excessBrackets < 0){
	  return "Too many ) parentheses!"
  }
  
  for(var i = 0; i < input.length; ++i){
	  if("+-*/^(".includes(input[i]) && "+*/^)".includes(input[i + 1])){
		  return "Illegal expression: " + input[i] + input[i + 1];
	  }
	  else if(".".includes(input[i]) && !("1234567890".includes(input[i + 1]))){
		  return "Illegal expression: " + input[i] + input[i + 1];
	  }
	  else if("12345xyπ67890".includes(input[i]) && "xyπ".includes(input[i + 1])){
		  return "Use * for multiplication: " + input[i] + input[i + 1];
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

	var coordinates = [[], [], []]
	
	function func(x, y){}
	
	try{
		func = new Function("x", "y", "return ("+input+");");
	}catch(err){
		return "Invalid Expression";
	}
	
	for(let x = xBounds[0]; x <= xBounds[1]; x += (xBounds[1]-xBounds[0])/numVals){
		for(let y = yBounds[0]; y <= yBounds[1]; y += (xBounds[1]-xBounds[0])/numVals){
			var fVal = func(x, y);
			if(fVal <= heightMaxes){
				coordinates[0].push(x);
				coordinates[1].push(y);
				coordinates[2].push(fVal);
			}
		}
	}
	
	return coordinates;
   }
	//-----------------
  

    function makeScene(scene){

      //  let plot_array = createPlots(parseInput(getURLParameter("func"), [-10,10], [-10,10], 20, true, 10, 50));   
      var pos_array = parseInput(getURLParameter("func"), [-10,10], [-10,10], 20, true, 1, 20);
	  if(typeof(pos_array) === typeof([])){
		  makeMesh([-10,10],[-10,10],20,pos_array, 10);
	  }
       else{
		   alert(pos_array);
	   }
       /* let i =0; 
        for(i; i < plot_array.length; i++){
            scene.add( plot_array[i] ); 
            console.log("sphere added")
        }  */
    } 

    function createPlots(pos_array){
        let plot_array = [];   
        let i =0;

        let geometry = new THREE.SphereGeometry( 0.1,32,32);
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
        for(i; i < pos_array[0].length; i++){ 
            let point = new THREE.Mesh( geometry, material );  
            point.position.x = pos_array[0][i]; 
            point.position.z = pos_array[1][i];  
            point.position.y = pos_array[2][i];
            plot_array.push(point);  

        }
       // alert(plot_array);
        return plot_array; 
    } 

    makeScene(scene);
    onRenderFcts.push(function(){
		renderer.render( scene, camera );
	})
	// run the rendering loop
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
        }) 
       // console.log("running");
  })  
  
  function find_elem(x, y, coords){
    for(var i = 0; i < coords[0].length; ++i){
      //console.log(coords[0][i], coords[1][i])
      if((coords[0][i] === x) && (coords[1][i] === y)){
        return coords[2][i];
      }
    }
    return 70;
  }
  
  function makeMesh(xbd, ybd, maxVals, coords, inc){
   var  material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity: 0.3 } );
    var incs = [(xbd[1]-xbd[0])/maxVals, (ybd[1]-ybd[0])/maxVals,]
    for(var i = 0; i < coords[0].length; ++i){
      var geom = new THREE.Geometry() 
      xCords = [coords[0][i], coords[0][i]+incs[0], coords[0][i]+incs[0]];
      yCords = [coords[1][i]+incs[1], coords[1][i], coords[1][i]+incs[1]];
      geom.vertices.push(new THREE.Vector3(coords[0][i]/inc,coords[2][i]/inc,coords[1][i]/inc))
    
      for(var j = 0; j < 3; j++){
        var foundZ = find_elem(xCords[j], yCords[j], coords);
        if(foundZ !== 70){
      
          //console.log(xCords[j], yCords[j], foundZ, "!!!")
          //geom.vertices.push(new THREE.Vector3(xCords[j]/inc, yCords[j]/inc, foundZ/inc));
          geom.vertices.push(new THREE.Vector3(xCords[j]/inc, foundZ/inc, yCords[j]/inc));
        
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
    
    