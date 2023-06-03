<template>
  <div>
    <div id="container" ref="container">

      
    </div>
  </div>
</template>
    
<script setup lang='ts'>
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // 自由视角观察
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, renderer, camera, stats;
let model, skeleton, mixer, clock;

const crossFadeControls = [];

let idleAction, walkAction, runAction;
let idleWeight, walkWeight, runWeight;
let actions, settings;

let singleStepMode = false;
let sizeOfNextStep = 0;


const container = ref(null);
  onMounted(()=>{
    init();
  })

function init() {

  console.log(container,'container');

  // 相机位置
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 0, 1, 4 );
  camera.lookAt( 0,0,0 );


  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

  // 太阳光
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  hemiLight.position.set( -5, 20, 0 );
  scene.add( hemiLight );
  
  // 平行光
  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( -3, 10,  0 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = - 2;
  dirLight.shadow.camera.left = - 2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add( dirLight );

  const axesHelper = new THREE.AxesHelper( 1 );
  axesHelper.layers.enableAll();
  scene.add( axesHelper );


  scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

  // ground 物品位置

  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  console.log(mesh,'mesh');
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );

  const loader = new GLTFLoader();
  // yujin_robot Soldier
  loader.load( 'stylized_ww1_plane.glb', function ( gltf ) {
    model = gltf.scene;
    gltf.scene.position.z = 0.5
    gltf.scene.position.x = 0.5
    scene.add( model );
    console.log(gltf,'gltf');

    model.traverse( function ( object ) {
      if ( object.isMesh ){
        console.log(object.material,'object.material');
         object.castShadow = true;
        //  object.material.transparent = true
        //  object.material.emissive = object.material.color;
        //  object.material.emissiveMap = object.material.map;
      }
    } );

    //骨骼显示助手
    
    // skeleton = new THREE.SkeletonHelper( model );
    // skeleton.visible = false;
    // scene.add( skeleton );

    //

    // createPanel();


    //

    const animations = gltf.animations;

    mixer = new THREE.AnimationMixer( model );
    console.log(mixer,'mixer');

    idleAction = mixer.clipAction( animations[ 0 ] );
        //增加旋转飞行动作
    const flyAction = mixer.clipAction( animations[ 1 ] );

    actions = [ idleAction, flyAction ];


    activateAllActions();

    animate();
   

  } ,undefined, function ( error ) {

    console.error( error ,'error');

  } );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  container.value.appendChild( renderer.domElement );

  //自用视角
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.target.set( 0, 1, 0 );
  controls.update();

  stats = new Stats();
  container.value.appendChild( stats.dom );

  window.addEventListener( 'resize', onWindowResize );

}



function showModel( visibility ) {

  model.visible = visibility;

}


function showSkeleton( visibility ) {

  skeleton.visible = visibility;

}


function modifyTimeScale( speed ) {

  mixer.timeScale = speed;

}


function deactivateAllActions() {
  if(!actions.length) return
  actions.forEach( function ( action ) {

    action.stop();

  } );

}

function activateAllActions() {

  // setWeight( idleAction, settings[ 'modify idle weight' ] );
  // setWeight( walkAction, settings[ 'modify walk weight' ] );
  // setWeight( runAction, settings[ 'modify run weight' ] );

  actions.forEach( function ( action ) {
    action.play();

  } );

}

function pauseContinue() {

  if ( singleStepMode ) {

    singleStepMode = false;
    unPauseAllActions();

  } else {

    if ( idleAction.paused ) {

      unPauseAllActions();

    } else {

      pauseAllActions();

    }

  }

}

function pauseAllActions() {

  actions.forEach( function ( action ) {

    action.paused = true;

  } );

}

function unPauseAllActions() {

  actions.forEach( function ( action ) {

    action.paused = false;

  } );

}

function toSingleStepMode() {

  unPauseAllActions();

  singleStepMode = true;
  sizeOfNextStep = settings[ 'modify step size' ];

}

function prepareCrossFade( startAction, endAction, defaultDuration ) {

  // Switch default / custom crossfade duration (according to the user's choice)

  const duration = setCrossFadeDuration( defaultDuration );

  // Make sure that we don't go on in singleStepMode, and that all actions are unpaused

  singleStepMode = false;
  unPauseAllActions();

  // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
  // else wait until the current action has finished its current loop

  if ( startAction === idleAction ) {

    executeCrossFade( startAction, endAction, duration );

  } else {

    synchronizeCrossFade( startAction, endAction, duration );

  }

}

function setCrossFadeDuration( defaultDuration ) {

  // Switch default crossfade duration <-> custom crossfade duration

  if ( settings[ 'use default duration' ] ) {

    return defaultDuration;

  } else {

    return settings[ 'set custom duration' ];

  }

}

function synchronizeCrossFade( startAction, endAction, duration ) {

  mixer.addEventListener( 'loop', onLoopFinished );

  function onLoopFinished( event ) {

    if ( event.action === startAction ) {

      mixer.removeEventListener( 'loop', onLoopFinished );

      executeCrossFade( startAction, endAction, duration );

    }

  }

}

function executeCrossFade( startAction, endAction, duration ) {

  // Not only the start action, but also the end action must get a weight of 1 before fading
  // (concerning the start action this is already guaranteed in this place)

  setWeight( endAction, 1 );
  endAction.time = 0;

  // Crossfade with warping - you can also try without warping by setting the third parameter to false

  startAction.crossFadeTo( endAction, duration, true );

}

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))

function setWeight( action, weight ) {
  action.enabled = true;
  action.setEffectiveTimeScale( 1 );
  action.setEffectiveWeight( weight );

}

// Called by the render loop

function updateWeightSliders() {

  settings[ 'modify idle weight' ] = idleWeight;
  settings[ 'modify walk weight' ] = walkWeight;
  settings[ 'modify run weight' ] = runWeight;

}

// Called by the render loop

function updateCrossFadeControls() {

  if ( idleWeight === 1 && walkWeight === 0 && runWeight === 0 ) {

    crossFadeControls[ 0 ].disable();
    crossFadeControls[ 1 ].enable();
    crossFadeControls[ 2 ].disable();
    crossFadeControls[ 3 ].disable();

  }

  if ( idleWeight === 0 && walkWeight === 1 && runWeight === 0 ) {

    crossFadeControls[ 0 ].enable();
    crossFadeControls[ 1 ].disable();
    crossFadeControls[ 2 ].enable();
    crossFadeControls[ 3 ].disable();

  }

  if ( idleWeight === 0 && walkWeight === 0 && runWeight === 1 ) {

    crossFadeControls[ 0 ].disable();
    crossFadeControls[ 1 ].disable();
    crossFadeControls[ 2 ].disable();
    crossFadeControls[ 3 ].enable();

  }

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  // Render loop

  requestAnimationFrame( animate );

  // idleWeight = idleAction.getEffectiveWeight();
  // walkWeight = walkAction.getEffectiveWeight();
  // runWeight = runAction.getEffectiveWeight();

  // Update the panel values if weights are modified from "outside" (by crossfadings)

  // updateWeightSliders();

  // Enable/disable crossfade controls according to current weight values

  updateCrossFadeControls();

  // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)

  let mixerUpdateDelta = clock.getDelta();

  // If in single step mode, make one step and then do nothing (until the user clicks again)

  if ( singleStepMode ) {

    mixerUpdateDelta = sizeOfNextStep;
    sizeOfNextStep = 0;

  }

  // Update the animation mixer, the stats panel, and render this frame

  mixer.update( mixerUpdateDelta );

  stats.update();

  renderer.render( scene, camera );

}

</script>
    
<style lang='stylus' scoped></style>
    