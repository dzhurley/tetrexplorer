import * as THREE from '../web_modules/three.js';
import OrbitControls from '../web_modules/threejs-orbit-controls.js';

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let aspect = screenWidth / screenHeight;

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 100;

export const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const onWindowResize = () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    aspect = screenWidth / screenHeight;
    renderer.setSize(screenWidth, screenHeight);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
};
window.addEventListener('resize', onWindowResize, false);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;

export const render = () => {
    renderer.render(scene, camera);
    controls.update();
};
