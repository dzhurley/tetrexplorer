import { Object3D, Quaternion, SceneUtils } from '../web_modules/three-full.js';
import { Easing, Tween } from '../web_modules/es6-tween.js';

import { scene } from './setup.js';

let keyPressed = '';
let flipping = false;

// corresponds to each edge on tetra
const keyMapping = {
  'Digit1': 'pivot-0,1', // red
  'Digit2': 'pivot-0,2', // green
  'Digit3': 'pivot-0,3', // blue
  'Digit4': 'pivot-1,2', // yellow
  'Digit5': 'pivot-1,3', // magenta
  'Digit6': 'pivot-2,3', // cyan
};

export const atRest = () => !flipping && keyPressed.length;

window.addEventListener('keydown', evt => {
  if (evt.code in keyMapping) {
    keyPressed = evt.code;
  }
}, false);
window.addEventListener('keyup', () => keyPressed = '', false);

let activePivot;

const setPivotPoint = (mesh, lastKey) => {
  if (flipping) {
    removeFromPivot();
  }
  flipping = true;

  // as all pivots are children of the tetra, copy the position/rotation
  // of the chosen pivot into a new parent of the tetra that can be tweened
  // to move the tetra and all pivots as one
  activePivot = scene.getObjectByName(keyMapping[lastKey]).clone();
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

const endObject = new Object3D();
export const flip = mesh => {
  const lastKey = keyPressed;
  setPivotPoint(mesh, lastKey);

  const start = activePivot.quaternion.clone();
  endObject.quaternion.copy(start);
  // all pivots are rotated such that 'up' points along a tetra edge
  endObject.rotateOnAxis(activePivot.up, Math.PI - Math.acos(1 / 3));

  let o = { t: 0 };
  new Tween(o)
    .to({ t: 1 }, 500)
    .easing(Easing.Bounce.Out)
    .on('update', () => {
      Quaternion.slerp(start, endObject.quaternion, activePivot.quaternion, o.t);
    })
    .on('complete', () => removeFromPivot(mesh))
    .start();
};
