import * as THREE from '../web_modules/three.js';

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    screenWidth / -2,
    screenWidth / 2,
    screenHeight / 2,
    screenHeight / -2,
    -1000,
    1000,
);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const onWindowResize = () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    renderer.setSize(screenWidth, screenHeight);
    camera.updateProjectionMatrix();
    camera.left = screenWidth / -2;
    camera.right = screenWidth / 2;
    camera.top = screenHeight / 2;
    camera.bottom = screenHeight / -2;
    camera.updateProjectionMatrix();
};
window.addEventListener('resize', onWindowResize, false);

const geometry = new THREE.TetrahedronBufferGeometry(100, 0);
const material = new THREE.MeshNormalMaterial();
const tetra = new THREE.Mesh(geometry, material);
scene.add(tetra);

const animate = () => {
    requestAnimationFrame(animate);

    tetra.rotation.x += 0.01;
    tetra.rotation.y += 0.01;

    renderer.render(scene, camera);
};

animate();
