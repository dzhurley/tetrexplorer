import { update as updateTween } from '../web_modules/es6-tween.js';

import { render, scene } from './setup.js';
import { plane, tetra } from './meshes.js';

import { flip, atRest } from './behaviors.js';

window.tetra = tetra;

scene.add(tetra);
scene.add(plane);

const animate = time => {
    requestAnimationFrame(animate);
    if (atRest()) {
        flip(tetra);
    }
    updateTween(time);
    render();
};

animate(0);
