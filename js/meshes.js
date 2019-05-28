import {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  SphereBufferGeometry,
  TetrahedronGeometry,
  Vector3,
} from '../web_modules/three-full.js';

export const tetra = new Mesh(
  new TetrahedronGeometry(10, 0),
  new MeshNormalMaterial(),
);
tetra.name = 'tetra';

const pivotColors = [
  0xFF0000,
  0x00FF00,
  0x0000FF,
  0xFFFF00,
  0xFF00FF,
  0x00FFFF,
];

const addPivots = () => {
  const v = new Vector3();
  const up = new Vector3(0, 1, 0).normalize();

  for (let i = 0; i < tetra.geometry.vertices.length; i++) {
    for (let j = i + 1; j < tetra.geometry.vertices.length; j++) {
      const a = tetra.geometry.vertices[i];
      const b = tetra.geometry.vertices[j];

      // find position at center of edge between a and b
      v.copy(b).add(a).divideScalar(2);
      const pivot = new Mesh(
        new SphereBufferGeometry(1, 32, 32),
        new MeshBasicMaterial({ color: pivotColors[0] }),
      );
      pivot.name = `pivot-${[i, j]}`;
      pivot.position.copy(v);
      pivotColors.shift();

      // rotate so 'up' of pivot is pointing along edge direction
      pivot.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize());
      pivot.updateMatrixWorld();
      shape.add(pivot);
    }
  }
};

export const shape = new Group();
shape.add(tetra);
shape.quaternion.setFromUnitVectors(
  tetra.geometry.faces[0].normal.clone().normalize(),
  new Vector3(0, 0, -1).normalize(),
);

addPivots();
