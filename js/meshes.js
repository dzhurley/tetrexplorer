import {
    Mesh,
    MeshNormalMaterial,
    PlaneBufferGeometry,
    TetrahedronGeometry,
} from '../web_modules/three-full.js';

export const plane = new Mesh(
    new PlaneBufferGeometry(1000, 1000, 25, 25),
    new MeshNormalMaterial({ wireframe: true }),
);

export const tetra = new Mesh(
    new TetrahedronGeometry(50, 0),
    new MeshNormalMaterial(),
);
