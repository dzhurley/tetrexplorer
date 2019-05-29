import { update as updateTween } from '../web_modules/es6-tween.js';

import { render, scene } from './setup.js';
import { setTarget, shape } from './meshes.js';

import { addTrail, atRest, flip } from './behaviors.js';

scene.add(shape);

const animate = time => {
  if (atRest()) {
    flip(shape);
  }
  updateTween(time);
  render(shape);
  requestAnimationFrame(animate);
};

setTarget(scene);
addTrail(scene);
animate(0);
