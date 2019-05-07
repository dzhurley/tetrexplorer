import { Vector3 } from '../web_modules/three-full.js';
import { update as updateTween } from '../web_modules/es6-tween.js';

import { render, scene } from './setup.js';
import { plane, tetra } from './meshes.js';

import { flip, atRest } from './behaviors.js';

scene.add(tetra);
scene.add(plane);

const animate = time => {
    requestAnimationFrame(animate);
    if (atRest()) {
        flip(
            tetra,
            new Vector3(10, 10, 10).normalize(),
            new Vector3(1, 0, 0),
        );
    }
    updateTween(time);
    render();
};

animate(0);
