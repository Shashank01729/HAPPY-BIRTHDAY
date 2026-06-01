import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ============================================================
   Happy Birthday Radhika 🦇  — gothic / vampire three.js scene
   Single static build, GitHub Pages friendly.
   ============================================================ */

const NAME = 'Radhika';
const WISHES = [
  `Happy birthday, ${NAME}. May your night be endless and your fangs forever sharp. 🦇`,
  `To Vampika — may every year bite back twice as sweet. 🩸`,
  `Another year, another century of looking flawless under the blood moon, ${NAME}.`,
  `Wishing you dark skies, warm hearts, and cake worth rising from the grave for. 🍰`,
  `Stay mysterious, stay magnificent. The night belongs to you, Vampika.`,
  `May your wishes haunt the universe until every single one comes true. ✨`,
];

const root = document.getElementById('scene');

/* ---------- renderer ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
root.appendChild(renderer.domElement);

/* ---------- scene + fog ---------- */
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0008, 0.022);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(0, 4.5, 18);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 9;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI * 0.56;
controls.minPolarAngle = Math.PI * 0.18;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.45;
controls.target.set(0, 2.2, 0);

/* ---------- lights ---------- */
scene.add(new THREE.AmbientLight(0x331018, 0.7));
const moonLight = new THREE.DirectionalLight(0xff3354, 1.1);
moonLight.position.set(-8, 14, -6);
scene.add(moonLight);
const rim = new THREE.PointLight(0x4466ff, 0.6, 60);
rim.position.set(10, 6, 8);
scene.add(rim);

/* ============================================================
   BLOOD MOON
   ============================================================ */
const moonGroup = new THREE.Group();
moonGroup.position.set(-10, 13, -40);
scene.add(moonGroup);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(7, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0xff2b40, emissive: 0x8a0014, emissiveIntensity: 1.4, roughness: 1, metalness: 0,
  })
);
moonGroup.add(moon);

// glow halo via sprite
const haloTex = makeRadialTexture('#ff2b40');
const halo = new THREE.Sprite(new THREE.SpriteMaterial({
  map: haloTex, color: 0xff2b40, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9,
}));
halo.scale.set(34, 34, 1);
moonGroup.add(halo);

/* ============================================================
   STARFIELD
   ============================================================ */
{
  const N = 1400, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 120 + Math.random() * 160;
    const t = Math.acos(2 * Math.random() - 1), p = Math.random() * Math.PI * 2;
    pos[i*3]   = r * Math.sin(t) * Math.cos(p);
    pos[i*3+1] = Math.abs(r * Math.cos(t)) * 0.6 + 10;
    pos[i*3+2] = r * Math.sin(t) * Math.sin(p);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(g, new THREE.PointsMaterial({
    color: 0xffd9e0, size: 0.9, sizeAttenuation: true, transparent: true, opacity: 0.85,
  }));
  scene.add(stars);
}

/* ============================================================
   FLOATING EMBERS / BLOOD MOTES
   ============================================================ */
const emberCount = 380;
const emberGeo = new THREE.BufferGeometry();
const emberPos = new Float32Array(emberCount * 3);
const emberVel = new Float32Array(emberCount);
for (let i = 0; i < emberCount; i++) {
  emberPos[i*3]   = (Math.random() - 0.5) * 60;
  emberPos[i*3+1] = Math.random() * 30;
  emberPos[i*3+2] = (Math.random() - 0.5) * 60;
  emberVel[i] = 0.4 + Math.random() * 1.2;
}
emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
const embers = new THREE.Points(emberGeo, new THREE.PointsMaterial({
  map: makeRadialTexture('#ff708a'), color: 0xff516e, size: 0.6,
  transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false,
}));
scene.add(embers);

/* ============================================================
   GROUND  (foggy crypt floor)
   ============================================================ */
{
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(70, 64),
    new THREE.MeshStandardMaterial({ color: 0x12000a, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  scene.add(ground);

  // subtle glowing ring under the cake
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(3.4, 6.2, 64),
    new THREE.MeshBasicMaterial({ color: 0x5a0014, transparent: true, opacity: 0.35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  scene.add(ring);
}

/* ============================================================
   BIRTHDAY CAKE 🍰 (gothic, blood-drip frosting)
   ============================================================ */
const cake = new THREE.Group();
cake.position.y = 0;
scene.add(cake);

const tierMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.05, emissive: c, emissiveIntensity: 0.18 });
const frostMat = new THREE.MeshStandardMaterial({ color: 0x1a0008, roughness: 0.45, emissive: 0x3a0010, emissiveIntensity: 0.4 });

const tiers = [
  { r: 3.0, h: 1.6, y: 0.8 },
  { r: 2.2, h: 1.4, y: 2.3 },
  { r: 1.4, h: 1.2, y: 3.6 },
];
tiers.forEach((t, i) => {
  const body = new THREE.Mesh(new THREE.CylinderGeometry(t.r, t.r, t.h, 48), tierMat(i % 2 ? 0x2a0010 : 0x40031c));
  body.position.y = t.y;
  cake.add(body);
  // frosting cap (blood)
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(t.r + 0.08, t.r + 0.08, 0.28, 48), frostMat);
  cap.position.y = t.y + t.h / 2;
  cake.add(cap);
  // drips
  const drips = 14 - i * 2;
  for (let d = 0; d < drips; d++) {
    const len = 0.4 + Math.random() * 0.7;
    const drip = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, len, 4, 8), frostMat);
    const a = (d / drips) * Math.PI * 2;
    drip.position.set(Math.cos(a) * (t.r + 0.07), t.y + t.h / 2 - len / 2 - 0.1, Math.sin(a) * (t.r + 0.07));
    cake.add(drip);
  }
});

/* ---------- candles + flames ---------- */
const flames = [];
const candleN = 7;
for (let i = 0; i < candleN; i++) {
  const a = (i / candleN) * Math.PI * 2;
  const cx = Math.cos(a) * 0.85, cz = Math.sin(a) * 0.85;
  const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 1.0, 12),
    new THREE.MeshStandardMaterial({ color: i % 2 ? 0xf3e9e0 : 0x7a0018, roughness: 0.5 })
  );
  candle.position.set(cx, 4.7, cz);
  cake.add(candle);

  const flameMat = new THREE.SpriteMaterial({
    map: makeRadialTexture('#ffd27a'), color: 0xffb347,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const flame = new THREE.Sprite(flameMat);
  flame.scale.set(0.5, 0.8, 1);
  flame.position.set(cx, 5.35, cz);
  cake.add(flame);

  const light = new THREE.PointLight(0xffb347, 2.2, 12, 2);
  light.position.set(cx, 5.4, cz);
  cake.add(light);

  flames.push({ flame, light, base: 5.35, phase: Math.random() * Math.PI * 2 });
}

/* ============================================================
   BAT FLOCK 🦇
   ============================================================ */
function makeBat() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x0c0008, roughness: 0.9, side: THREE.DoubleSide });
  // body
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.4, 4, 8), mat);
  g.add(body);
  // wings (extruded-ish triangles)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(1.4, 0.5);
  wingShape.lineTo(1.2, -0.05);
  wingShape.lineTo(1.0, 0.05);
  wingShape.lineTo(0.8, -0.2);
  wingShape.lineTo(0.55, 0.0);
  wingShape.lineTo(0.4, -0.28);
  wingShape.lineTo(0, -0.15);
  wingShape.lineTo(0, 0);
  const wingGeo = new THREE.ShapeGeometry(wingShape);
  const wL = new THREE.Mesh(wingGeo, mat);
  const wR = new THREE.Mesh(wingGeo, mat);
  wL.position.x = 0.1; wR.position.x = -0.1; wR.scale.x = -1;
  g.add(wL); g.add(wR);
  return { group: g, wL, wR };
}

const bats = [];
const BAT_N = 18;
for (let i = 0; i < BAT_N; i++) {
  const b = makeBat();
  const s = 0.5 + Math.random() * 0.7;
  b.group.scale.setScalar(s);
  b.radius = 8 + Math.random() * 16;
  b.height = 6 + Math.random() * 12;
  b.speed = (0.15 + Math.random() * 0.4) * (Math.random() < 0.5 ? 1 : -1);
  b.angle = Math.random() * Math.PI * 2;
  b.bob = Math.random() * Math.PI * 2;
  b.flap = Math.random() * Math.PI * 2;
  b.flapSpeed = 8 + Math.random() * 6;
  scene.add(b.group);
  bats.push(b);
}

/* ============================================================
   CLICK = BLOOD BURST + bats scatter
   ============================================================ */
const bursts = [];
function bloodBurst(x, y) {
  // project screen click to a point in front of camera
  const ndc = new THREE.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
  ndc.unproject(camera);
  const dir = ndc.sub(camera.position).normalize();
  const origin = camera.position.clone().add(dir.multiplyScalar(12));

  const n = 90;
  const pos = new Float32Array(n * 3);
  const vel = [];
  for (let i = 0; i < n; i++) {
    pos[i*3] = origin.x; pos[i*3+1] = origin.y; pos[i*3+2] = origin.z;
    const v = new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)).normalize()
      .multiplyScalar(0.15 + Math.random() * 0.5);
    vel.push(v);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({
    map: makeRadialTexture('#ff2233'), color: 0xff2233, size: 0.9,
    transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  scene.add(pts);
  bursts.push({ pts, vel, life: 1, geo: g });

  // scatter nearby bats
  bats.forEach((b) => { b.speed *= 1.6; b.flapSpeed = 16; });
  setTimeout(() => bats.forEach((b) => { b.speed /= 1.6; b.flapSpeed = 8 + Math.random()*6; }), 1200);

  blip();
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  if (!started) return;
  bloodBurst(e.clientX, e.clientY);
});

/* ============================================================
   ANIMATION LOOP
   ============================================================ */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // moon pulse
  moon.material.emissiveIntensity = 1.3 + Math.sin(t * 0.8) * 0.25;
  halo.material.opacity = 0.8 + Math.sin(t * 0.8) * 0.12;

  // embers rise
  for (let i = 0; i < emberCount; i++) {
    emberPos[i*3+1] += emberVel[i] * dt;
    emberPos[i*3]   += Math.sin(t * 0.5 + i) * 0.01;
    if (emberPos[i*3+1] > 30) emberPos[i*3+1] = 0;
  }
  emberGeo.attributes.position.needsUpdate = true;

  // candle flicker
  flames.forEach((f) => {
    const flick = 0.85 + Math.sin(t * 12 + f.phase) * 0.12 + Math.random() * 0.06;
    f.flame.scale.set(0.45 * flick, (0.7 + Math.random()*0.15) * flick, 1);
    f.flame.position.y = f.base + Math.sin(t * 8 + f.phase) * 0.02;
    f.light.intensity = 1.1 + flick * 0.5;
  });

  // cake slow spin
  cake.rotation.y += dt * 0.25;

  // bats orbit + flap
  bats.forEach((b) => {
    b.angle += b.speed * dt;
    b.bob += dt;
    const x = Math.cos(b.angle) * b.radius;
    const z = Math.sin(b.angle) * b.radius;
    const y = b.height + Math.sin(b.bob) * 1.6;
    b.group.position.set(x, y, z);
    b.group.rotation.y = -b.angle + (b.speed > 0 ? Math.PI/2 : -Math.PI/2);
    const flap = Math.sin(t * b.flapSpeed + b.flap) * 0.9;
    b.wL.rotation.y = flap;
    b.wR.rotation.y = -flap;
  });

  // bursts
  for (let i = bursts.length - 1; i >= 0; i--) {
    const bu = bursts[i];
    const p = bu.geo.attributes.position.array;
    for (let j = 0; j < bu.vel.length; j++) {
      bu.vel[j].y -= 0.012;            // gravity
      p[j*3]   += bu.vel[j].x;
      p[j*3+1] += bu.vel[j].y;
      p[j*3+2] += bu.vel[j].z;
    }
    bu.geo.attributes.position.needsUpdate = true;
    bu.life -= dt * 0.6;
    bu.pts.material.opacity = Math.max(0, bu.life);
    if (bu.life <= 0) { scene.remove(bu.pts); bu.geo.dispose(); bu.pts.material.dispose(); bursts.splice(i, 1); }
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

/* ============================================================
   HELPERS
   ============================================================ */
function makeRadialTexture(hex) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, hex);
  g.addColorStop(0.25, hex);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ============================================================
   AUDIO — gothic ambient pad (WebAudio, no files needed)
   ============================================================ */
let actx, masterGain, audioOn = false, audioBuilt = false;
function buildAudio() {
  if (audioBuilt) return;
  audioBuilt = true;
  actx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = actx.createGain();
  masterGain.gain.value = 0.0;
  masterGain.connect(actx.destination);

  // soft reverb-ish low pad: two detuned oscillators per note
  const chord = [110, 130.81, 164.81, 220]; // A minor-ish drone
  chord.forEach((freq, i) => {
    [0, 0.6].forEach((det) => {
      const o = actx.createOscillator();
      o.type = i === 0 ? 'sine' : 'triangle';
      o.frequency.value = freq + det;
      const g = actx.createGain();
      g.gain.value = 0.08 / (i + 1);
      // slow LFO on gain for breathing
      const lfo = actx.createOscillator();
      lfo.frequency.value = 0.06 + i * 0.02;
      const lfoG = actx.createGain();
      lfoG.gain.value = 0.04;
      lfo.connect(lfoG); lfoG.connect(g.gain);
      o.connect(g); g.connect(masterGain);
      o.start(); lfo.start();
    });
  });

  // occasional high bell shimmer
  setInterval(() => {
    if (!audioOn || !actx) return;
    const o = actx.createOscillator();
    o.type = 'sine';
    o.frequency.value = [523, 587, 659, 784, 880][Math.floor(Math.random()*5)];
    const g = actx.createGain();
    g.gain.value = 0;
    o.connect(g); g.connect(masterGain);
    const now = actx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
    o.start(now); o.stop(now + 2.6);
  }, 4200);
}
function fadeAudio(on) {
  if (!actx) return;
  audioOn = on;
  const now = actx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(on ? 0.6 : 0.0, now + 1.2);
}
function blip() {
  if (!audioOn || !actx) return;
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = 'sawtooth'; o.frequency.value = 180;
  o.connect(g); g.connect(masterGain);
  const now = actx.currentTime;
  o.frequency.exponentialRampToValueAtTime(60, now + 0.25);
  g.gain.setValueAtTime(0.12, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  o.start(now); o.stop(now + 0.32);
}

/* ============================================================
   UI WIRING
   ============================================================ */
let started = false;
const intro = document.getElementById('intro');
const overlay = document.getElementById('overlay');
const soundBtn = document.getElementById('soundBtn');
const msgBtn = document.getElementById('msgBtn');
const wishEl = document.getElementById('wish');

document.getElementById('enterBtn').addEventListener('click', () => {
  if (started) return;
  started = true;
  intro.classList.add('gone');
  buildAudio();
  actx.resume?.();
  fadeAudio(true);
  setTimeout(() => { intro.style.display = 'none'; }, 1200);

  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('show'));
  [soundBtn, msgBtn].forEach((b) => { b.classList.remove('hidden'); requestAnimationFrame(() => b.classList.add('show')); });

  typeWish(WISHES[0]);
});

soundBtn.addEventListener('click', () => {
  fadeAudio(!audioOn);
  soundBtn.classList.toggle('off', !audioOn);
  soundBtn.textContent = audioOn ? '♪' : '♪̸';
});

let wIndex = 0;
msgBtn.addEventListener('click', () => {
  wIndex = (wIndex + 1) % WISHES.length;
  typeWish(WISHES[wIndex]);
});

/* typewriter */
let typeTimer = null;
function typeWish(text) {
  clearInterval(typeTimer);
  wishEl.classList.remove('show');
  wishEl.textContent = '';
  let i = 0;
  setTimeout(() => {
    wishEl.classList.add('show');
    typeTimer = setInterval(() => {
      wishEl.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(typeTimer);
    }, 28);
  }, 250);
}
