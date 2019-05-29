import { update as updateTween } from '../web_modules/es6-tween.js';

import { render, scene } from './setup.js';
import { setTarget, shape } from './meshes.js';

import { addTrail, atRest, flip } from './behaviors.js';

import { setupDat } from './gui.js';

scene.add(shape);

const animate = time => {
  if (atRest()) {
    flip(shape);
  }

  const target = scene.getObjectByName('target');
  if (target) {
    target.rotation.x += 0.01;
    target.rotation.y += 0.01;
  }

  updateTween(time);
  render(shape);
  requestAnimationFrame(animate);
};

setupDat(setTarget, scene);

setTarget(scene);
addTrail(scene);
animate(0);
