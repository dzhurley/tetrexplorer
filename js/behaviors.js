import {
  Object3D,
  Quaternion,
  SceneUtils,
  Vector3,
} from '../web_modules/three-full.js';
import { Easing, Tween } from '../web_modules/es6-tween.js';

import { scene } from './setup.js';
import { pivots, randomBetween, setTarget, setTrailFace, tetra } from './meshes.js';

let keyPressed = false;
let flipping = false;

export const atRest = () => !flipping && keyPressed;

window.addEventListener('keydown', evt => {
  if (evt.code === 'Space') {
    keyPressed = true;
  }
  if (evt.code === 'ShiftLeft') {
    setTarget(scene);
  }
}, false);
window.addEventListener('keyup', () => keyPressed = false, false);

let activePivot;

const findActivePivot = () => {
  // only choose from pivots that connect to the last trail piece
  const { a, b, c } = tetra.geometry.faces[tetra.userData.lastTrailFace];
  const vertices = [a, b, c];
  const choices = pivots.reduce((found, p) => {
    const [first, second] = p.userData.vertices;
    if (vertices.includes(first) && vertices.includes(second)) {
      found.push(p);
    }
    return found;
  }, []);

  // find closest pivot to target to set as active
  const target = scene.getObjectByName('target');
  const ruler = new Vector3();
  const closest = choices.reduce((leader, choice) => {
    if (!leader) {
      return choice;
    }
    return (
      leader.getWorldPosition(ruler).distanceTo(target.position) >
      choice.getWorldPosition(ruler).distanceTo(target.position)
    ) ? choice : leader;
  });
  return closest.clone();
};

const setPivotPoint = mesh => {
  if (flipping) {
    removeFromPivot();
  }
  flipping = true;

  activePivot = findActivePivot();
  // as all pivots are children of the tetra, copy the position/rotation
  // of the chosen pivot into a new parent of the tetra that can be tweened
  // to move the tetra and all pivots as one
  activePivot.position.setFromMatrixPosition(activePivot.matrixWorld);
  activePivot.quaternion.setFromRotationMatrix(activePivot.matrixWorld);
  activePivot.updateMatrixWorld();
  scene.add(activePivot);
  SceneUtils.attach(mesh, scene, activePivot);
};

const removeFromPivot = mesh => {
  if (flipping) {
    flipping = false;
    SceneUtils.detach(mesh, activePivot, scene);
    scene.remove(activePivot);
  }
};

const findTrailFace = () => {
  if (!activePivot) {
    return tetra.geometry.faces[0];
  }

  // only choose from pivots that connect to the last trail piece
  const [first, second] = activePivot.userData.vertices;
  return tetra.geometry.faces.find((face, index) => {
    if (tetra.userData.lastTrailFace === index) {
      return false;
    }
    const { a, b, c } = face;
    const vertices = [a, b, c];
    return vertices.includes(first) && vertices.includes(second);
  });
};

export const addTrail = () => setTrailFace(findTrailFace(), scene);

const endObject = new Object3D();
export const flip = mesh => {
  setPivotPoint(mesh);

  const start = activePivot.quaternion.clone();
  endObject.quaternion.copy(start);
  // all pivots are rotated such that 'up' points along a tetra edge
  endObject.rotateOnAxis(activePivot.up, randomBetween(14, 24) * 0.1);

  let o = { t: 0 };
  new Tween(o)
    .to({ t: 1 }, 200)
    .easing(Easing.Exponential.InOut)
    .on('update', () => {
      Quaternion.slerp(start, endObject.quaternion, activePivot.quaternion, o.t);
    })
    .on('complete', () => {
      addTrail();
      removeFromPivot(mesh);
    })
    .start();
};
