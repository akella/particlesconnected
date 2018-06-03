import * as THREE from 'three';
import {TimelineMax} from 'gsap';
var OrbitControls = require('three-orbit-controls')(THREE);
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';



let camera, pos, controls, scene, renderer, geometry, geometry1, material,plane,tex1,tex2;
let destination = {x:0,y:0};
let textures = [];

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
    0.001, 100
  );
  camera.position.set( 0, 0, 1 );


  controls = new OrbitControls(camera, renderer.domElement);


  material = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 },
      pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
      accel: {type: 'v2', value: new THREE.Vector2(0.5,2)},
      progress: {type: 'f', value: 0},
      uvRate1: {
        value: new THREE.Vector2(1,1)
      },
    },
    // wireframe: true,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 1, 1 ),material);
  scene.add(plane);

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
  material.uniforms.time.value = time;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}


init();
animate();





