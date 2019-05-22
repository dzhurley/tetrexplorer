import { update as updateTween } from '../web_modules/es6-tween.js';

import { render, scene } from './setup.js';
import { plane, shape } from './meshes.js';

import { flip, atRest } from './behaviors.js';

scene.add(plane, shape);

const animate = time => {
    requestAnimationFrame(animate);
    if (atRest()) {
        flip(shape);
    }
    updateTween(time);
    render(shape);
};

animate(0);
