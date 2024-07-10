

//----------------------------------------------------------------- BASIC parameters
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

if (window.innerWidth > 800) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.needsUpdate = true;
};

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 13, 7);

var scene = new THREE.Scene();
var city = new THREE.Object3D();
var smoke = new THREE.Object3D();
var town = new THREE.Object3D();

var createCarPos = true;
var uSpeed = 0.001;

//----------------------------------------------------------------- FOG background
var setcolor = 0xF02050;
scene.background = new THREE.Color(setcolor);
scene.fog = new THREE.Fog(setcolor, 10, 16);

//----------------------------------------------------------------- RANDOM Function
function mathRandom(num = 8) {
  return -Math.random() * num + Math.random() * num;
}

//----------------------------------------------------------------- CHANGE building colors
var setTintNum = true;

function setTintColor() {
  if (setTintNum) {
    setTintNum = false;
    return 0x000000; // Change color value as needed
  } else {
    setTintNum = true;
    return 0x000000; // Change color value as needed
  }
}

//----------------------------------------------------------------- CREATE City
function init() {
  var segments = 2;

  for (var i = 1; i < 100; i++) {
    var geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments); // Use BoxGeometry instead of CubeGeometry
    var material = new THREE.MeshStandardMaterial({
      color: setTintColor(),
      wireframe: false,
      side: THREE.DoubleSide
    });

    var cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotationValue = 0.1 + Math.abs(mathRandom(8));
    cube.scale.y = 0.1 + Math.abs(mathRandom(8));
    cube.scale.x = cube.scale.z = 0.9 + mathRandom(1 - 0.9);
    cube.position.x = Math.round(mathRandom());
    cube.position.z = Math.round(mathRandom());

    town.add(cube);
  }

  var gmaterial = new THREE.MeshToonMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
  var gparticular = new THREE.CircleGeometry(0.01, 3);
  var aparticular = 5;

  for (var h = 1; h < 300; h++) {
    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular));
    particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
    smoke.add(particular);
  }

  city.add(town);
  city.add(smoke);
  scene.add(city);
}

//----------------------------------------------------------------- Lights
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
var lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
lightFront.penumbra = 0.1;
lightBack.position.set(0, 6, 0);

smoke.position.y = 2;

scene.add(ambientLight);
scene.add(lightFront);
scene.add(lightBack);

//----------------------------------------------------------------- GRID Helper
var gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
city.add(gridHelper);

//----------------------------------------------------------------- ANIMATE
function animate() {
  requestAnimationFrame(animate);

  city.rotation.y -= (mouse.x * 8) * uSpeed;
  city.rotation.x -= (mouse.y * 2) * uSpeed;
  if (city.rotation.x < -0.05) city.rotation.x = -0.05;
  else if (city.rotation.x > 1) city.rotation.x = 1;

  smoke.rotation.y += 0.01;
  smoke.rotation.x += 0.01;

  camera.lookAt(city.position);
  renderer.render(scene, camera);
}

//----------------------------------------------------------------- START functions
function generateLines() {
  for (var i = 0; i < 60; i++) {
    createCars(0.1, 20); // Calling createCars function
  }
}

// Example implementation of createCars function
function createCars(cScale = 2, cPos = 20, cColor = 0xFFFF00) {
    var cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
    var cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
    var cElem = new THREE.Mesh(cGeo, cMat);
    var cAmp = 3;
  
    if (createCarPos) {
      createCarPos = false;
      cElem.position.x = -cPos;
      cElem.position.z = mathRandom(cAmp);
  
      TweenMax.to(cElem.position, 3, { x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3) });
    } else {
      createCarPos = true;
      cElem.position.x = mathRandom(cAmp);
      cElem.position.z = -cPos;
      cElem.rotation.y = 90 * Math.PI / 180;
  
      TweenMax.to(cElem.position, 5, { z: cPos, repeat: -1, yoyo: true, delay: mathRandom(3), ease: Power1.easeInOut });
    }
    cElem.receiveShadow = true;
    cElem.castShadow = true;
    cElem.position.y = Math.abs(mathRandom(5));
    city.add(cElem);
  }
  

//----------------------------------------------------------------- MOUSE function
var mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);

//----------------------------------------------------------------- Initialize
init();
generateLines();
animate();
