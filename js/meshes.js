import {
  DoubleSide,
  Group,
  IcosahedronBufferGeometry,
  Mesh,
  MeshNormalMaterial,
  Shape,
  ShapeGeometry,
  TetrahedronGeometry,
  Vector3,
} from '../web_modules/three-full.js';

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const setTarget = scene => {
  let target = scene.getObjectByName('target');
  if (!target) {
    target = new Mesh(
      new IcosahedronBufferGeometry(10),
      new MeshNormalMaterial(),
    );
    target.name = 'target';
    scene.add(target);
  }
  target.position.x = Math.random() > 0.5 ? randomBetween(80, 120) : randomBetween(-80, -120);
  target.position.y = Math.random() > 0.5 ? randomBetween(80, 120) : randomBetween(-80, -120);
  target.position.z = Math.random() > 0.5 ? randomBetween(80, 120) : randomBetween(-80, -120);
};

export const tetra = new Mesh(
  new TetrahedronGeometry(10, 0),
  new MeshNormalMaterial(),
);
tetra.name = 'tetra';

export const shape = new Group();
shape.add(tetra);
shape.quaternion.setFromUnitVectors(
  tetra.geometry.faces[0].normal.clone().normalize(),
  new Vector3(0, 0, -1).normalize(),
);
shape.updateMatrixWorld();

export const pivots = [];
const addPivots = () => {
  const v = new Vector3();
  const up = new Vector3(0, 1, 0).normalize();

  for (let i = 0; i < tetra.geometry.vertices.length; i++) {
    for (let j = i + 1; j < tetra.geometry.vertices.length; j++) {
      const a = tetra.geometry.vertices[i];
      const b = tetra.geometry.vertices[j];

      // find position at center of edge between a and b
      v.copy(b).add(a).divideScalar(2);
      const pivot = new Mesh();
      pivot.name = 'pivot';
      pivot.position.copy(v);

      // rotate so 'up' of pivot is pointing along edge direction
      pivot.quaternion.setFromUnitVectors(up, a.clone().sub(b).normalize());
      pivot.updateMatrixWorld();
      // used in tandem with trail piece to find next active pivot point
      pivot.userData.vertices = [i, j];
      pivots.push(pivot);
      shape.add(pivot);
    }
  }
};
addPivots();

// triangle pieces to place as trail for tetra
const triangle = new Shape();
triangle.moveTo(8, 2);
triangle.lineTo(4, 8);
triangle.lineTo(12, 8);
triangle.lineTo(8, 2);

export const setTrailFace = (face, scene) => {
  const piece = new Mesh(
    new ShapeGeometry(triangle),
    new MeshNormalMaterial({ side: DoubleSide }),
  );

  ['a', 'b', 'c'].forEach((v, i) => {
    const vertex = tetra.geometry.vertices[face[v]].clone();
    piece.geometry.vertices[i].copy(tetra.localToWorld(vertex));
  });
  piece.geometry.computeVertexNormals();

  // save this trail piece to help find which pivot to use next flip
  tetra.userData.lastTrailFace = tetra.geometry.faces.indexOf(face);

  scene.add(piece);
};

window.tetra = tetra;
