/**
 * The hero brake assembly: rotor, caliper and pads (CC-BY model, see
 * ASSET-PROVENANCE.md). The rotor spins, the pointer tilts the assembly, and
 * scroll progress through [data-brake-track] explodes the parts apart.
 */
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export async function mountBrake(canvas: HTMLCanvasElement, track: HTMLElement | null) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  // Red rim light from behind: the swoosh colour, used as light.
  const rim = new DirectionalLight(new Color('#ff2a36'), 5);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync('/models/brake.glb');
  const model = gltf.scene;

  // Centre and normalise to a 2.6-unit disc.
  const box = new Box3().setFromObject(model);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  model.position.sub(center);
  const holder = new Group();
  holder.add(model);
  holder.scale.setScalar(2.6 / Math.max(size.x, size.y, size.z));
  const assembly = new Group();
  assembly.add(holder);
  scene.add(assembly);

  const part = (n: string) => model.getObjectByName(n) as Mesh | undefined;
  const rotor = part('rotor');
  const caliper = part('caliper');
  const pads = part('pads');

  if (rotor) {
    rotor.material = new MeshPhysicalMaterial({ color: '#c8ccd2', metalness: 1, roughness: 0.32, clearcoat: 0.3 });
    // Spin about the rotor's own axis (local Y), through its own centre.
    rotor.geometry.computeBoundingBox();
    const c = rotor.geometry.boundingBox!.getCenter(new Vector3());
    rotor.geometry.translate(-c.x, 0, -c.z);
    rotor.position.set(c.x, 0, c.z);
  }
  if (caliper) caliper.material = new MeshPhysicalMaterial({ color: '#d6232a', metalness: 0.2, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12 });
  if (pads) pads.material = new MeshPhysicalMaterial({ color: '#3a3a41', metalness: 0.6, roughness: 0.55 });
  const home = { cal: caliper?.position.clone(), pad: pads?.position.clone() };

  let w = 0, h = 0;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (r.width === w && r.height === h) return;
    w = r.width; h = r.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Pull back on tall canvases so the disc always fits the width.
    camera.position.z = camera.aspect >= 1 ? 6.2 : Math.min(11, 4.6 / camera.aspect);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  let px = 0, py = 0, tx = 0, ty = 0;
  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

  let spin = 0, last = performance.now(), explode = 0;
  const frame = (now: number) => {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) { last = now; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    resize();

    // Plain page scroll, no pinning: apart over the first ~1.6 screens,
    // then fade out by the end of the brakes section.
    const y = scrollY;
    const vh = innerHeight;
    const p = clamp(y / (vh * 1.6));
    explode = lerp(explode, ease(p), 0.08);
    const fixed = getComputedStyle(canvas).position === 'fixed';
    const end = document.getElementById('brakes');
    const fadeStart = end ? end.offsetTop + end.offsetHeight - vh * 1.2 : vh * 2.2;
    const fade = fixed ? 1 - clamp((y - fadeStart) / (vh * 0.6)) : 1;
    canvas.style.setProperty('--fade', fade.toFixed(3));
    if (fade <= 0.001) { return; }

    px = lerp(px, tx, 0.06);
    py = lerp(py, ty, 0.06);
    if (!reduce) spin += dt * (0.9 + explode * 1.6);
    if (rotor) rotor.rotation.y = -spin;

    // Three-quarter view in the hero, turning side-on as it explodes.
    assembly.rotation.x = lerp(-0.35, -0.1, explode) + py * 0.12;
    assembly.rotation.y = lerp(-0.55, -1.1, explode) + px * 0.2;
    assembly.position.x = lerp(0, 0.35, explode);

    if (caliper && home.cal) caliper.position.set(home.cal.x + explode * 22, home.cal.y + explode * 26, home.cal.z);
    if (pads && home.pad) pads.position.set(home.pad.x + explode * 11, home.pad.y + explode * 13, home.pad.z);

    renderer.render(scene, camera);
  };
  requestAnimationFrame(frame);
  canvas.dataset.ready = 'true';
}
