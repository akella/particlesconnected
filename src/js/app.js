import * as THREE from 'three';
import {TimelineMax} from 'gsap';
var OrbitControls = require('three-orbit-controls')(THREE);
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import VTKLoader from './lib/vtkloader';
let loader = new THREE.VTKLoader();



let maxDist,colors,numVertices,facePos,connections,linepositions,lineMesh,pointsData,space,numParticles,points,camera, pos, controls, scene, renderer, geometry, geometry1, material,plane,tex1,tex2,positions;
let destination = {x:0,y:0};
let textures = [];
numParticles = 2000;
space = 800;
maxDist = 110;


function init() {

  
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 3000
  );
  


  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set( 0, 0, 950 );

  
  pointsData = [];


  // material = new THREE.ShaderMaterial( {
  //   side: THREE.DoubleSide,
  //   uniforms: {
  //     time: { type: 'f', value: 0 },
  //     pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
  //     accel: {type: 'v2', value: new THREE.Vector2(0.5,2)},
  //     progress: {type: 'f', value: 0},
  //     uvRate1: {
  //       value: new THREE.Vector2(1,1)
  //     },
  //   },
  //   // wireframe: true,
  //   vertexShader: vertex,
  //   fragmentShader: fragment
  // });

  let pointsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2
  });

  let lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    vertexColors: THREE.VertexColors,
    transparent: true
  });

  

  



  loader.load('/img/head1k.vtk',function(mesh) {
    console.log(mesh.vertices.length);

    numVertices = mesh.vertices.length;

    facePos = new Float32Array(numVertices*3);

    positions = new Float32Array(numVertices*3);
    linepositions = new Float32Array(numParticles*numParticles);
    colors = new Float32Array(numParticles*numParticles);





    // create world
    for (let i = 0; i < numVertices; i++) {
      let x = (Math.random() - 0.5)*space;
      let y = (Math.random() - 0.5)*space;
      let z = (Math.random() - 0.5)*space;

      positions[3*i] = x;
      positions[3*i+1] = y;
      positions[3*i+2] = z;

      pointsData.push({
        velocity: new THREE.Vector3(2*Math.random() -1,2*Math.random() -1,2*Math.random() -1)
      });
    }

    let pointsGeometry = new THREE.BufferGeometry();
    let linesGeometry = new THREE.BufferGeometry();

    linesGeometry.setDrawRange(0,connections*2);

    pointsGeometry.addAttribute('position', new THREE.BufferAttribute(positions,3).setDynamic(true));
    linesGeometry.addAttribute('color', new THREE.BufferAttribute(colors,3).setDynamic(true));
    linesGeometry.addAttribute('position', new THREE.BufferAttribute(linepositions,3).setDynamic(true));

    // pointsGeometry.attributes.position.copyVector3sArray(mesh.vertices);
    lineMesh = new THREE.LineSegments(linesGeometry,lineMaterial);

    points = new THREE.Points(pointsGeometry,pointsMaterial);

    scene.add(points);
    scene.add(lineMesh);

    animate();
  });
  

  resize();

 
}

window.addEventListener('resize', resize); 
function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;




  camera.updateProjectionMatrix();
}

let time = 0;
function animate() {
  time = time+0.05;
  let vertexPos = 0;
  let colorIndex = 0;
  connections = 0;

  // material.uniforms.time.value = time;



  for (var i = 0; i < numVertices; i++) {
    positions[3*i] += pointsData[i].velocity.x;
    positions[3*i+1] += pointsData[i].velocity.y;
    positions[3*i+2] += pointsData[i].velocity.z;

    if(positions[3*i]<-space/2 || positions[3*i]>space/2) {
      pointsData[i].velocity.x = -pointsData[i].velocity.x;
    }
    if(positions[3*i+1]<-space/2 || positions[3*i+1]>space/2) {
      pointsData[i].velocity.y = -pointsData[i].velocity.y;
    }
    if(positions[3*i+2]<-space/2 || positions[3*i+2]>space/2) {
      pointsData[i].velocity.z = -pointsData[i].velocity.z;
    }

    

    for (var j = i+1; j < numVertices; j++) {

      let dx = positions[i*3] - positions[j*3];
      let dy = positions[i*3+1] - positions[j*3+1];
      let dz = positions[i*3+2] - positions[j*3+2];

      let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

      if(dist<maxDist) {
        let alpha = 1 - dist/maxDist;
        linepositions[vertexPos++] = positions[i*3];
        linepositions[vertexPos++] = positions[i*3+1];
        linepositions[vertexPos++] = positions[i*3+2];


        linepositions[vertexPos++] = positions[j*3];
        linepositions[vertexPos++] = positions[j*3+1];
        linepositions[vertexPos++] = positions[j*3+2];


        colors[ colorIndex++ ] = alpha;
        colors[ colorIndex++ ] = alpha;
        colors[ colorIndex++ ] = alpha;

        colors[ colorIndex++ ] = alpha;
        colors[ colorIndex++ ] = alpha;
        colors[ colorIndex++ ] = alpha;

        connections++;
      }

      


      
    }
    
  }
  lineMesh.geometry.setDrawRange(0,connections*2);
  lineMesh.geometry.attributes.position.needsUpdate = true;
  lineMesh.geometry.attributes.color.needsUpdate = true;
  points.geometry.attributes.position.needsUpdate = true;



  
  requestAnimationFrame(animate);
  render();
}

function render() {
  scene.rotation.y += 0.003;
  renderer.render(scene, camera);
}


init();
// animate();





