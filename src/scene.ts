import * as THREE from "three";

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

window.addEventListener("resize", onResize);

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  document.body.appendChild(renderer.domElement);
}
function render() {
  renderer.render(scene, camera);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function onResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.aspect = ASPECT;
  camera.updateProjectionMatrix();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}

export default function initialize() {
  init();
  animate();
}
