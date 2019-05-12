import { SceneUtils } from '../web_modules/three-full.js';
import { Easing, Tween } from '../web_modules/es6-tween.js';

import { scene } from './setup.js';

let keyPressed = '';
let flipping = false;

const keyMapping = {
    'Digit1': 'pivot-0,1',
    'Digit2': 'pivot-0,2',
    'Digit3': 'pivot-0,3',
    'Digit4': 'pivot-1,2',
    'Digit5': 'pivot-1,3',
    'Digit6': 'pivot-2,3',
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
    activePivot = scene.getObjectByName(keyMapping[lastKey]).clone();
    activePivot.position.setFromMatrixPosition(activePivot.matrixWorld);
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

export const flip = mesh => {
    const lastKey = keyPressed;
    setPivotPoint(mesh, lastKey);

    let o = { t: 0 };
    new Tween(o)
        .to({ t: Math.PI / 2 }, 500)
        .easing(Easing.Bounce.Out)
        .on('update', () => {
            activePivot.rotation.x = -o.t;
        })
        .on('complete', () => removeFromPivot(mesh))
        .start();
};
