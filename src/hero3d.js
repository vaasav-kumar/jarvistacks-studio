import * as THREE from 'three';

export function mountHero3d(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));

  const dirLight = new THREE.DirectionalLight(0x6366f1, 1.8);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xf59e0b, 1.5, 20, 0);
  pointLight.position.set(-4, -2, 4);
  scene.add(pointLight);

  const group = new THREE.Group();
  scene.add(group);

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.6, 1.6),
    new THREE.MeshPhongMaterial({ color: 0x4f46e5, specular: 0x818cf8, shininess: 60, flatShading: true }),
  );
  box.position.set(0, 0.2, 0);
  group.add(box);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 24, 24),
    new THREE.MeshPhongMaterial({ color: 0xf59e0b, emissive: 0x78350f, shininess: 40 }),
  );
  sphere.position.set(2.0, 1.2, 0.5);
  group.add(sphere);

  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.2, 20),
    new THREE.MeshPhongMaterial({ color: 0xec4899, shininess: 80 }),
  );
  cylinder.rotation.x = Math.PI / 3;
  cylinder.position.set(-2.0, -1.0, 0.8);
  group.add(cylinder);

  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.65, 0),
    new THREE.MeshPhongMaterial({ color: 0x10b981, flatShading: true }),
  );
  ico.position.set(1.8, -1.4, -0.4);
  group.add(ico);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 0) return;
      mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true },
  );

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  new ResizeObserver(resize).observe(container);
  resize();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    const t = reducedMotion ? 0 : clock.getElapsedTime();

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    group.rotation.y = t * 0.35 + targetX * 0.8;
    group.rotation.x = Math.sin(t * 0.5) * 0.15 + targetY * 0.5;

    box.rotation.x = t * 0.4;
    box.rotation.y = t * 0.6;

    sphere.position.y = 1.2 + Math.sin(t * 2) * 0.25;
    cylinder.rotation.z = t * 0.8;
    cylinder.position.y = -1.0 + Math.cos(t * 1.8) * 0.2;
    ico.rotation.y = t * 0.5;

    renderer.render(scene, camera);
  });
}
