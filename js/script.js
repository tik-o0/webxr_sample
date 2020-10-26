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
let texture;
let orbitControls;

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.set(0,1.6,3);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);

    const container = document.querySelector('#canvas_vr');
    container.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    window.addEventListener('resize',function(){
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth,window.innerHeight);
    },false);

    checkDevice();
    setLoading();
}

function checkDevice(){
    if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-vr').then(function(supported){
            if(supported){
                renderer.xr.enabled = true;
            }else{
                setController();
            }
        });
    } else {
        setController();
    }
}

function setLoading(){
    TweenMax.to('.loader',0.1,{opacity:1});

    const manifest = [
        {id:'pict01',src:'./img/pict.jpg'}
    ];
    const loadQueue = new createjs.LoadQueue();

    loadQueue.on('progress',function(e){
        const progress = e.progress;
    });

    loadQueue.on('complete',function(){
        const image = loadQueue.getResult('pict01');
        texture = new THREE.Texture(image);
        texture.needsUpdate = true;

        TweenMax.to('#loader_wrapper',1,{
            opacity:0,
            onComplete:function(){
                document.getElementById('loader_wrapper').style.display ='none';
            }
        });
        threeWorld();
        rendering();
    });

    loadQueue.loadManifest(manifest);
}

function threeWorld(){
    const geometry = new THREE.SphereGeometry(100,100,100);
    geometry.scale(-1,1,1);
    const material = new THREE.MeshBasicMaterial({
        map:texture
    });
    const sphere = new THREE.Mesh(geometry,material);
    scene.add(sphere);
}

function setController(){
    document.addEventListener('touchmove',function(e){e.preventDefault();},{passive:false});
    orbitControls = new OrbitControls(camera,renderer.domElement);
    orbitControls.target.set(0,1.6,0);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.5;
    orbitControls.enableZoom = false;
}

function rendering(){
    renderer.setAnimationLoop(animate);
}

function animate(){
    if(orbitControls){
        orbitControls.update();
    }
    renderer.render(scene,camera);
}