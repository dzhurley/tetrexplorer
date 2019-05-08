import {
    BoxBufferGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshNormalMaterial,
    TetrahedronGeometry,
    Vector3,
} from '../web_modules/three-full.js';

const tetra = new Mesh(
    new TetrahedronGeometry(10, 0),
    new MeshNormalMaterial(),
);

export const pivots = {};

const addPivots = () => {
    const v = new Vector3();
    const pivotGeo = new BoxBufferGeometry(1, 1, 1);
    const pivotMat = new MeshBasicMaterial();

    for (let i = 0; i < tetra.geometry.vertices.length; i++) {
        for (let j = i + 1; j < tetra.geometry.vertices.length; j++) {
            const a = tetra.geometry.vertices[i];
            const b = tetra.geometry.vertices[j];

            v.copy(b).add(a).divideScalar(2);
            const pivot = new Mesh(pivotGeo, pivotMat);
            pivot.position.copy(v);
            // pivot rotation
            pivot.updateMatrixWorld();
            pivots[[i, j]] = pivot;
            shape.add(pivot);
        }
    }
};

export const shape = new Group();
shape.add(tetra);
addPivots();
