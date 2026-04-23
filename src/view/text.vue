<template>
  <div class="scene-wrapper">
    <!-- 加载进度遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-box">
        <div class="spinner"></div>
        <p class="loading-text">模型加载中 {{ loadProgress }}%</p>
      </div>
    </div>

    <!-- 加载失败提示 -->
    <div v-if="loadError" class="error-overlay">
      <p>⚠️ 模型加载失败：{{ loadError }}</p>
    </div>

    <!-- 操作提示 -->
    <div v-if="!loading && !loadError" class="hint">
      <span>🖱 拖拽旋转 · 滚轮缩放</span>
    </div>

    <!-- 渲染容器 -->
    <div ref="container" class="canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// ---- DOM ----
const container = ref<HTMLDivElement | null>(null)

// ---- 响应式状态 ----
const loading = ref<boolean>(true)
const loadProgress = ref<number>(0)
const loadError = ref<string>('')

// ---- Three.js 核心对象 ----
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let stats: Stats
let clock: THREE.Clock
let mixer: THREE.AnimationMixer | null = null
let animationId: number

// ---- 初始化场景、灯光、渲染器 ----
function initScene(): void {
  const el = container.value!

  // 场景（浅色背景，接近预览图效果）
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0ece4)

  // 时钟
  clock = new THREE.Clock()

  // 相机（FOV 临时值，加载完模型后会根据包围盒重算）
  camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.01, 2000)

  // 渲染器（高分屏限制 pixelRatio 上限为 2，避免渲染像素数暴涨）
  const dpr: number = Math.min(window.devicePixelRatio, 2)
  // 高 DPR 设备自带天然抗锯齿，antialias 仅低 DPR 时开启
  renderer = new THREE.WebGLRenderer({ antialias: dpr < 2 })
  renderer.setPixelRatio(dpr)
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap  // 比 PCFSoft 性能好
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  el.appendChild(renderer.domElement)

  // 轨道控制（具体 distance 限制在模型加载后设置）
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.screenSpacePanning = false

  // 环境光
  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambient)

  // 主光源（开启阴影，lowpoly 车面数少可以承受）
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.0)
  keyLight.position.set(5, 10, 5)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(1024, 1024)
  keyLight.shadow.camera.near = 0.5
  keyLight.shadow.camera.far = 50
  keyLight.shadow.camera.left = -10
  keyLight.shadow.camera.right = 10
  keyLight.shadow.camera.top = 10
  keyLight.shadow.camera.bottom = -10
  scene.add(keyLight)

  // 补光（暖色右侧，模拟预览图效果）
  const fillLight = new THREE.DirectionalLight(0xfff0e0, 0.8)
  fillLight.position.set(-4, 6, -4)
  scene.add(fillLight)

  // 地面（浅色，承接阴影投影）
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0xe8e0d5,
    roughness: 1.0,
    metalness: 0.0,
  })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // 环境贴图：给材质提供环境反射
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()
  const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture
  scene.environment = envTexture
  pmremGenerator.dispose()

  // 地面网格线（浅色，不太抢眼）
  const grid = new THREE.GridHelper(40, 30, 0xccb8a0, 0xccb8a0)
  scene.add(grid)

  // 性能监控
  stats = new Stats()
  stats.dom.style.position = 'absolute'
  stats.dom.style.top = '10px'
  stats.dom.style.left = '10px'
  el.appendChild(stats.dom)

  // 窗口缩放监听
  window.addEventListener('resize', onResize)
}

// ---- 加载 GLB 模型并设置初始相机 ----
function loadModel(): void {
  const loader = new GLTFLoader()

  loader.load(
    'ferrari.glb',
    (gltf) => {
      const model: THREE.Group = gltf.scene

      // 统计模型面数（用于诊断卡顿原因）
      let totalTriangles = 0
      model.traverse((child: THREE.Object3D) => {
        const mesh = child as THREE.Mesh
        if (mesh.isMesh && mesh.geometry) {
          const geo = mesh.geometry
          totalTriangles += geo.index
            ? geo.index.count / 3
            : (geo.attributes.position?.count ?? 0) / 3
        }
      })
      console.warn(`[Three.js] 模型总三角形数: ${Math.round(totalTriangles).toLocaleString()}`)

      // 计算包围盒，居中模型并贴地
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // 将模型平移至世界坐标原点，底部贴地
      model.position.x -= center.x
      model.position.z -= center.z
      model.position.y -= box.min.y

      scene.add(model)

      // 重新计算贴地后的包围盒
      const boxAfter = new THREE.Box3().setFromObject(model)
      const sizeAfter = boxAfter.getSize(new THREE.Vector3())

      // 车辆对角线长度（XZ 平面）
      const diagXZ = Math.sqrt(sizeAfter.x ** 2 + sizeAfter.z ** 2)

      // 相机距离：让车辆完整显示在视口内
      const fovRad = THREE.MathUtils.degToRad(camera.fov)
      const fitDistance = (diagXZ / 2) / Math.tan(fovRad / 2) * 1.6

      // 侧面 45 度初始相机位置（XZ 平面 45°，相机稍高于车顶）
      const camHeight = sizeAfter.y * 0.8
      const camOffset = fitDistance * Math.cos(THREE.MathUtils.degToRad(45))
      camera.position.set(camOffset, camHeight, camOffset)
      camera.lookAt(0, sizeAfter.y * 0.3, 0)

      // OrbitControls 目标点（车身中心偏下位置）
      controls.target.set(0, sizeAfter.y * 0.3, 0)

      // 禁用缩放和平移，固定距离
      controls.enableZoom = false
      controls.enablePan = false

      // 俯仰角限制
      controls.minPolarAngle = THREE.MathUtils.degToRad(10)
      controls.maxPolarAngle = THREE.MathUtils.degToRad(80)

      // 自动慢速旋转
      controls.autoRotate = true
      controls.autoRotateSpeed = 2.0

      controls.update()

      // 动画
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        gltf.animations.forEach((clip: THREE.AnimationClip) => {
          mixer!.clipAction(clip).play()
        })
      }

      loading.value = false
    },
    (xhr: ProgressEvent) => {
      if (xhr.total > 0) {
        loadProgress.value = Math.round((xhr.loaded / xhr.total) * 100)
      }
    },
    (error: unknown) => {
      loadError.value = error instanceof Error ? error.message : '未知错误'
      loading.value = false
      console.error('GLB 加载失败:', error)
    }
  )
}

// ---- 渲染循环 ----
function animate(): void {
  animationId = requestAnimationFrame(animate)
  const delta: number = clock.getDelta()
  if (mixer) mixer.update(delta)
  controls.update()
  stats.update()
  renderer.render(scene, camera)
}

// ---- 窗口自适应 ----
function onResize(): void {
  const el = container.value
  if (!el) return
  camera.aspect = el.clientWidth / el.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(el.clientWidth, el.clientHeight)
}

// ---- 生命周期 ----
onMounted((): void => {
  initScene()
  loadModel()
  animate()
})

onUnmounted((): void => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  controls.dispose()
  renderer.dispose()
})
</script>

<style scoped>
.scene-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #111827;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

/* 加载遮罩 */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 10, 20, 0.88);
  z-index: 10;
  backdrop-filter: blur(6px);
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.spinner {
  width: 52px;
  height: 52px;
  border: 4px solid rgba(100, 160, 255, 0.15);
  border-top-color: #5b9cf6;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin: 0;
  color: #93b4f0;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: 0.06em;
}

/* 加载失败 */
.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(220, 38, 38, 0.12);
  border: 1px solid rgba(220, 80, 80, 0.35);
  border-radius: 10px;
  padding: 16px 28px;
  color: #f87171;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  z-index: 10;
}

/* 操作提示 */
.hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 7px 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  font-family: 'Inter', system-ui, sans-serif;
  z-index: 5;
  pointer-events: none;
  user-select: none;
}
</style>