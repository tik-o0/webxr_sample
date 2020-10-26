//===============================================================
// Import Library
//===============================================================
import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { VRButton } from './lib/VRButton.js';
 
//===============================================================
// Main
//===============================================================
window.addEventListener('load',function(){
   init();
});
 
let scene,camera,renderer;
 
function init(){
    //シーン、カメラ、レンダラーを生成
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.set(0,1.6,3);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
 
    //canvasを作成
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);
 
    //球体の形状を生成
    const geometry = new THREE.SphereGeometry(100,100,100);
    geometry.scale(-1,1,1);
 
    //テクスチャ画像を読み込み
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./img/pict.jpg');
 
    //球体のマテリアルを生成
    const material = new THREE.MeshBasicMaterial({
        map:texture
    });
 
    //球体を生成
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
 
    //OrbitControlsを初期化
    const orbitControls = new OrbitControls(camera,renderer.domElement);
 
    render();
}
 
function render(){
    requestAnimationFrame(animate);
}
 
function animate(){
    renderer.render(scene,camera);
}

window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
},false);