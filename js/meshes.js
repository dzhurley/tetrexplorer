import {
    AxesHelper,
    BoxBufferGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshNormalMaterial,
    PlaneBufferGeometry,
    TetrahedronGeometry,
    Vector3,
} from '../web_modules/three-full.js';

export const plane = new Mesh(
    new PlaneBufferGeometry(500, 500, 50, 50),
    new MeshNormalMaterial({ wireframe: true }),
);
plane.name = 'plane';

const tetra = new Mesh(
    new TetrahedronGeometry(10, 0),
    new MeshNormalMaterial(),
);
tetra.name = 'tetra';

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
            pivot.name = `pivot-${[i, j]}`;
            pivot.position.copy(v);
            pivot.updateMatrixWorld();
            pivot.add(new AxesHelper(10));
            shape.add(pivot);
        }
    }
};

export const shape = new Group();
shape.add(tetra);
addPivots();
