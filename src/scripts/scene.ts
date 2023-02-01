import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const domScene = document.getElementById("three-scene");

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

let camera_1: THREE.PerspectiveCamera;
let camera_2: THREE.PerspectiveCamera;
let scene_1: THREE.Scene;
let scene_2: THREE.Scene;
let renderer: THREE.WebGLRenderer;

let book: THREE.Group;
let controls: OrbitControls;

window.addEventListener("resize", onResize);

function init() {
  scene_1 = new THREE.Scene();
  scene_1.fog = new THREE.FogExp2(0x000000, 0.0008);
  
  scene_2 = new THREE.Scene();
  scene_2.fog = new THREE.FogExp2(0x000000, 0.0008);

  camera_1 = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  camera_1.position.set(0, 0, 15);
  camera_1.lookAt(scene_1.position);
  
  camera_2 = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  camera_2.position.set(0, 0, 15);
  camera_2.lookAt(scene_1.position);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.autoClear = false;
  domScene?.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1);
  light.position.set(0, 500, 0);
  scene_1.add(light);

  loadBook();
  loadParticles()

  controls = new OrbitControls(camera_1, renderer.domElement);
  controls.autoRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.minPolarAngle = 1.6;
  controls.maxPolarAngle = 1.6;
  controls.update();
}
function render() {
  beforeUpdate();
  renderer.render(scene_1, camera_1);
  renderer.render(scene_2, camera_2);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function onResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera_1.aspect = ASPECT;
  camera_1.updateProjectionMatrix();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}
function loadBook() {
  const loader = new GLTFLoader();
  loader.load("models/gltf/book.glb", (object) => {
    object.scene.rotation.set(0, 3, 0);
    object.scene.position.set(0, -6, 0);
    book = object.scene;
    scene_1.add(object.scene);
  });
}

function beforeUpdate() {
  let y = book.rotation.y;
  book.rotation.set(0, y + 0.005, 0);

  controls.update();
}

function loadParticles() {
  const geometry = new THREE.BufferGeometry();
  const vertices: any = [];

  const loader = new THREE.TextureLoader();

  const sprite = loader.load("/images/circle.png");

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 500 - 250;
    const y = Math.random() * 500 - 250;
    const z = 0

    vertices.push(x, y, z);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    size: 0.2,
    map: sprite,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
  });
  const particles = new THREE.Points(geometry, material);

  scene_2.add(particles);
}

export default function initialize() {
  init();
  animate();
}
