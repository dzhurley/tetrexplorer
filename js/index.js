import { camera, controls, render, scene } from './setup.js';
import { plane, tetra } from './meshes.js';

scene.add(plane);
scene.add(tetra);

const animate = time => {
    requestAnimationFrame(animate);

    const delta = Math.sin(time / 100) * 0.1;
    const dx = 0.1;
    const dy = 0.1;
    const dz = delta;

    tetra.position.x += dx;
    tetra.position.y += dy;
    tetra.position.z += dz;

    camera.position.x += dx;
    camera.position.y += dy;
    camera.position.z += dz;

    controls.target.x += dx;
    controls.target.y += dy;
    controls.target.z += dz;

    render();
};

animate(0);
