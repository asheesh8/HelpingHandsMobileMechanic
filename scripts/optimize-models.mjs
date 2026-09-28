// Shrinks the licensed Sketchfab models in raw-assets/3d/ into web-ready GLBs
// in public/models/. Run with `npm run models`.
//
// Only CC-BY models are processed. The RAV4, F-150 and WRX STI files in
// raw-assets/3d/ are CC-BY-NC-SA (non-commercial) and must not ship on this
// site. See ASSET-PROVENANCE.md.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, quantize, meshopt, resample } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { statSync } from 'node:fs';

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });

const jobs = [
  {
    src: 'raw-assets/3d/6-_lug_brake_rotor_and_brembo_brake_calipers.glb',
    out: 'public/models/brake.glb',
    // Object_3 is the white "brembo" wordmark on the caliper. Stripped so the
    // site never shows a third-party trademark.
    dropMeshes: ['Object_3'],
    ratio: 0.6,
    error: 0.0008,
    rename: { Object_0: 'pads', Object_1: 'rotor', Object_2: 'caliper' },
  },
  {
    src: 'raw-assets/3d/honda_civic_type-r.glb',
    out: 'public/models/car.glb',
    dropMeshes: [],
    ratio: 0.25,
    error: 0.002,
    rename: {},
  },
];

for (const job of jobs) {
  const doc = await io.read(job.src);
  const root = doc.getRoot();

  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    if (job.dropMeshes.includes(mesh.getName())) {
      node.dispose();
      continue;
    }
    if (job.rename[mesh.getName()]) node.setName(job.rename[mesh.getName()]);
  }

  await doc.transform(
    prune(),
    dedup(),
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: job.ratio, error: job.error }),
    resample(),
    prune(),
    quantize(),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );

  await io.write(job.out, doc);
  const before = statSync(job.src).size / 1e6;
  const after = statSync(job.out).size / 1e6;
  console.log(`${job.out}: ${before.toFixed(1)}MB -> ${after.toFixed(2)}MB`);
}
