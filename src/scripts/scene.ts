import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const domScene = document.getElementById("three-scene");

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

let book;

window.addEventListener("resize", onResize);

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  camera.position.set(0, 0, 20);
  camera.lookAt(scene.position);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  domScene?.appendChild(renderer.domElement);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(0, 500, 500);
  dirLight.lookAt(scene.position);
  scene.add(dirLight);

  loadBook();
}
function render() {
  let y = book.rotation.y;
  book.rotation.set(0, y + 0.01, 0);
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
function loadBook() {
  const loader = new GLTFLoader();
  loader.load("models/gltf/book.glb", (object) => {
    scene.add(object.scene);
    book = object.scene;
  });
}

export default function initialize() {
  init();
  animate();
}
