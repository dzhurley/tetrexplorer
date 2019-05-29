import * as dat from '../web_modules/dat.gui.js';

export const knobs = {
  chaseTarget: true,
  chaseSpeed: 650,
  cycleTarget: true,
  autoRotate: false,
};

export const setupDat = (setTarget, scene) => {
  // inject here so it's callable from GUI
  knobs.changeTarget = () => setTarget(scene);

  const gui = new dat.GUI();
  gui.add(knobs, 'chaseTarget');
  gui.add(knobs, 'chaseSpeed', 100, 800, 10);
  gui.add(knobs, 'cycleTarget');
  gui.add(knobs, 'changeTarget');
  gui.add(knobs, 'autoRotate');

  gui.closed = true;

  return gui;
};
