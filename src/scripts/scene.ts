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
let controls: OrbitControls;

let book: THREE.Group;
let snows: SnowFlake[] = [];

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
  camera_2.lookAt(scene_2.position);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.autoClear = false;
  domScene?.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene_1.add(light);

  const light2 = new THREE.DirectionalLight(0xffffff, 50);
  light2.position.set(0, 0, 500);
  scene_2.add(light2);

  loadBook();
  loadParticles();

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
  if (!book) return;
  let y = book.rotation.y;
  book.rotation.set(0, y + 0.005, 0);

  for (let i = 0; i < snows.length; i++) {
    const ref = snows[i];
    ref.movePosition(1, 1);
    if (ref.position.y < -50) {
      ref.reset();
    }
  }

  controls.update();
}

function loadParticles() {
  const geometry = new THREE.CircleGeometry();
  const material = new THREE.MeshPhongMaterial({ color: 0xffff });
  material.transparent = true;
  material.opacity = 0.5;

  const points: any[] = [];

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    const z = -10;
    const scale = Math.random() * (0.1 - 0.01) + 0.01;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(scale, scale, scale);
    mesh.position.set(x, y, z);

    points.push(mesh);
    snows.push(new SnowFlake(mesh.position, mesh.scale));
  }

  scene_2.add(...points);
}

class SnowFlake {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  speedX: number;
  speedY: number;
  constructor(position: THREE.Vector3, scale: THREE.Vector3) {
    this.position = position;
    this.scale = scale;
    this.speedX = this.getRandom(0.05, 0.01);
    this.speedY = this.getRandom(0.05, 0.01);
  }

  movePosition(x: number, y: number) {
    this.position.set(this.position.x - x * this.speedX, this.position.y - y * this.speedY, this.position.z);
  }

  getRandom(max: number, min: number) {
    return Math.random() * (max - min) + min;
  }

  reset() {
    this.position.set(Math.random() * 100 - 50, 50, 0);
  }
}

export default function initialize() {
  init();
  animate();
}
