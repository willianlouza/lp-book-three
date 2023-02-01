import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const domScene = document.getElementById("three-scene");

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

let book_camera: THREE.PerspectiveCamera;
let snow_camera: THREE.PerspectiveCamera;
let book_scene: THREE.Scene;
let snow_scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

let book: THREE.Group;
let snows: SnowFlake[] = [];

window.addEventListener("resize", onResize);

function init() {
  book_scene = new THREE.Scene();
  book_scene.fog = new THREE.FogExp2(0x000000, 0.0008);

  snow_scene = new THREE.Scene();
  snow_scene.fog = new THREE.FogExp2(0x000000, 0.0008);

  book_camera = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  book_camera.position.set(0, 0, 15);
  book_camera.lookAt(snow_scene.position);

  snow_camera = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  snow_camera.position.set(0, 0, 15);
  snow_camera.lookAt(snow_scene.position);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.autoClear = false;
  domScene?.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1);
  book_scene.add(light);

  const light2 = new THREE.DirectionalLight(0xffffff, 50);
  light2.position.set(0, 0, 500);
  snow_scene.add(light2);

  loadBook();
  loadParticles();

}
function render() {
  beforeUpdate();
  renderer.render(book_scene, book_camera);
  renderer.render(snow_scene, snow_camera);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function onResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
  book_camera.aspect = ASPECT;
  snow_camera.aspect = ASPECT;
  book_camera.updateProjectionMatrix();
  snow_camera.updateProjectionMatrix();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}
function loadBook() {
  const loader = new GLTFLoader();
  loader.load("models/gltf/book.glb", (object) => {
    object.scene.rotation.set(0, 3, 0);
    object.scene.position.set(10, -6, 0);
    book = object.scene;
    book_scene.add(object.scene);
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

  snow_scene.add(...points);
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
