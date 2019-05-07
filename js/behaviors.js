import { AxesHelper, Object3D, SceneUtils, Vector3 } from '../web_modules/three-full.js';
import { Easing, Tween } from '../web_modules/es6-tween.js';

import { scene } from './setup.js';

let keyPressed = '';
let flipping = false;

export const atRest = () => !flipping && keyPressed;

const keyMapping = {
    KeyW: new Vector3(0, 50, 0),
    KeyS: new Vector3(0, -50, 0),
    KeyA: new Vector3(50, 0, 0),
    KeyD: new Vector3(-50, 0, 0),
};

window.addEventListener('keydown', evt => {
    if (Object.keys(keyMapping).indexOf(evt.code) > -1) {
        keyPressed = evt.code;
    }
}, false);

window.addEventListener('keyup', () => keyPressed = '', false);

const pivot = new Object3D();
scene.add(pivot);
pivot.add(new AxesHelper(50));

const setPivotPoint = (mesh, lastKey) => {
    if (flipping) {
        removeFromPivot();
    }
    flipping = true;
    pivot.position.copy(mesh.position.clone().sub(keyMapping[lastKey]));
    pivot.rotation.set(0, 0, 0);
    pivot.updateMatrixWorld();
    SceneUtils.attach(mesh, scene, pivot);
};

const removeFromPivot = mesh => {
    if (flipping) {
        flipping = false;
        SceneUtils.detach(mesh, pivot, scene);
    }
};

export const flip = mesh => {
    const lastKey = keyPressed;
    setPivotPoint(mesh, lastKey);

    let o = { t: 0 };
    new Tween(o)
        .to({ t: 1 }, 500)
        .easing(Easing.Bounce.Out)
        .on('update', () => {
            if (lastKey === 'KeyW') {
                return pivot.rotation.x = -o.t;
            }
            if (lastKey === 'KeyS') {
                return pivot.rotation.x = o.t;
            }
            if (lastKey === 'KeyA') {
                return pivot.rotation.y = -o.t;
            }
            if (lastKey === 'KeyD') {
                return pivot.rotation.y = o.t;
            }
        })
        .on('complete', () => removeFromPivot(mesh))
        .start();
};
