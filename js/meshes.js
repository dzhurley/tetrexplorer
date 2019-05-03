import * as THREE from '../web_modules/three.js';

export const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(500, 500, 50, 50),
    new THREE.MeshNormalMaterial({ wireframe: true }),
);

export const tetra = new THREE.Mesh(
    new THREE.TetrahedronBufferGeometry(10, 0),
    new THREE.MeshNormalMaterial(),
);
