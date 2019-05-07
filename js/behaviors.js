import { AxesHelper, Object3D, SceneUtils } from '../web_modules/three-full.js';
import { Easing, Tween } from '../web_modules/es6-tween.js';

import { scene } from './setup.js';

let keyPressed = false;
let flipping = false;
export const atRest = () => !flipping && keyPressed;

window.addEventListener('keydown', evt => {
    if (evt.code === 'Space') {
        keyPressed = true;
    }
}, false);

window.addEventListener('keyup', () => keyPressed = false, false);

export const pivot = new Object3D();
scene.add(pivot);
pivot.add(new AxesHelper(5));

const setPivotPoint = (mesh, point) => {
    if (flipping) {
        removeFromPivot();
    }
    flipping = true;
    pivot.position.copy(point);
    pivot.rotation.set(0, 0, 0);
    pivot.updateMatrixWorld();
    SceneUtils.attach(mesh, scene, pivot);
};

function removeFromPivot(mesh) {
    if (flipping) {
        flipping = false;
        SceneUtils.detach(mesh, pivot, scene);
    }
}

export const flip = (mesh, point, axis) => {
    setPivotPoint(mesh, point, axis);

    let o = { t: 0 };
    new Tween(o)
        .to({ t: 1 }, 500)
        .easing(Easing.Bounce.Out)
        .on('update', () => {
            pivot.rotation.y = o.t;
        })
        .on('complete', () => {
            removeFromPivot(mesh);
        })
        .start();
};
