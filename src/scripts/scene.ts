import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const snowContainer = document.getElementById("snow-scene");
const bookContainer = document.getElementById("book-scene");

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

let isMobile = SCREEN_WIDTH < 1060;

let book_camera: THREE.PerspectiveCamera;
let snow_camera: THREE.PerspectiveCamera;
let book_scene: THREE.Scene;
let snow_scene: THREE.Scene;
let snowRenderer: THREE.WebGLRenderer;
let bookRenderer: THREE.WebGLRenderer;

let book: THREE.Group;
let snows: SnowFlake[] = [];

let isMoving = false;
let lastPosition = 0;

window.addEventListener("resize", onResize);

function init() {
  book_scene = new THREE.Scene();
  book_scene.fog = new THREE.FogExp2(0x000000, 0.0008);

  snow_scene = new THREE.Scene();
  snow_scene.fog = new THREE.FogExp2(0x000000, 0.0008);

  book_camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  book_camera.position.set(0, 0, 12);
  book_camera.lookAt(snow_scene.position);

  snow_camera = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  snow_camera.position.set(0, 0, 30);
  snow_camera.lookAt(snow_scene.position);

  snowRenderer = new THREE.WebGLRenderer({ alpha: true });
  snowRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  snowRenderer.autoClear = false;

  bookRenderer = new THREE.WebGLRenderer({ alpha: true });
  if (isMobile) {
    bookRenderer.setSize(400, 400);
  } else {
    bookRenderer.setSize(600, 600);
  }
  bookRenderer.autoClear = false;

  snowContainer?.appendChild(snowRenderer.domElement);
  bookContainer?.appendChild(bookRenderer.domElement);

  bookRenderer.domElement.addEventListener("mousedown", onMouseDown, true);
  bookRenderer.domElement.addEventListener("mouseup", onMouseUp, true);
  bookRenderer.domElement.addEventListener("mousemove", onMouseMove, true);
  bookRenderer.domElement.addEventListener("mouseleave", onMouseUp, true);

  const light = new THREE.AmbientLight(0xffffff, 1);
  book_scene.add(light);

  const light2 = new THREE.DirectionalLight(0xffffff, 50);
  light2.position.set(0, 0, 500);
  snow_scene.add(light2);

  loadBook();
  loadParticles();
}
function beforeUpdate() {
  snowFall();
}
function render() {
  beforeUpdate();
  bookRenderer.render(book_scene, book_camera);
  snowRenderer.render(snow_scene, snow_camera);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function onResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
  isMobile = SCREEN_WIDTH < 1060;
  book_camera.aspect = ASPECT;
  snow_camera.aspect = ASPECT;
  book_camera.updateProjectionMatrix();
  snow_camera.updateProjectionMatrix();
  snowRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  if (isMobile) {
    bookRenderer.setSize(400, 400);
  } else {
    bookRenderer.setSize(600, 600);
  }
}
function loadBook() {
  const loader = new GLTFLoader();
  loader.load("models/gltf/book.glb", (object) => {
    object.scene.rotation.set(0, 2.5, 0);
    object.scene.position.set(0, -6, 0);
    book = object.scene;
    book_scene.add(object.scene);
  });
}
function onMouseMove(event: MouseEvent) {
  if (!isMoving) return;
  const deltaX = event.clientX / window.innerWidth;
  let direction = 0;

  if (deltaX > lastPosition) {
    lastPosition = deltaX;
    direction = 1;
  } else if (deltaX < lastPosition) {
    lastPosition = deltaX;
    direction = -1;
  }

  if (lastPosition === direction) {
    direction = 0;
  }

  book.rotateY(direction * 0.1);
}
function onMouseDown() {
  isMoving = true;
}
function onMouseUp() {
  isMoving = false;
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

function snowFall() {
  for (let i = 0; i < snows.length; i++) {
    const ref = snows[i];
    ref.movePosition(1, 1);
    if (ref.position.y < -50) {
      ref.reset();
    }
  }
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
