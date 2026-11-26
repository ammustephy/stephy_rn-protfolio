import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { setMaxAnisotropy } from './canvasText.js';

/**
 * WebGL renderer, camera, PMREM environment and (desktop only) a light bloom.
 * Physically based setup: sRGB output, ACES Filmic tone mapping, soft shadows.
 */
export class RendererView {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{phone: boolean, bloom: boolean}} quality
   */
  constructor(canvas, quality) {
    this.quality = quality;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', stencil: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.maxDpr = quality.phone ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.maxDpr));
    setMaxAnisotropy(renderer.capabilities.getMaxAnisotropy());
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0b0a10');
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.02, 60);

    // Image-based lighting for reflections (glass, metal, varnish).
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = env;

    this.composer = null;
    if (quality.bloom) {
      const size = renderer.getDrawingBufferSize(new THREE.Vector2());
      const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 });
      const composer = new EffectComposer(renderer, rt);
      composer.addPass(new RenderPass(this.scene, this.camera));
      // High threshold: only neon, bulbs and bright screen highlights glow.
      this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), 0.3, 0.45, 1.0);
      composer.addPass(this.bloom);
      composer.addPass(new OutputPass());
      this.composer = composer;
    }
  }

  resize(w, h) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.maxDpr));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(w, h);
    }
  }

  render() {
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }
}
