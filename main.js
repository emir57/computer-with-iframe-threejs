import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import dat from 'dat.gui';

const gui = new dat.GUI();
const containerDiv = document.getElementById('domEl');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const gltfLoader = new GLTFLoader();

const computer = await gltfLoader.loadAsync('./objects/Computer.glb');
const desk = await gltfLoader.loadAsync('./objects/Desk.glb');

const pointer = new THREE.Vector2();

const cssscene = new THREE.Scene();
const webglscene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.01, 1000);

camera.position.set(16.05, 74.82, 65.01);
camera.rotation.set(-.08, -.11, 0);

const cameraFolder = gui.addFolder("Camera");
const cameraPositionFolder = cameraFolder.addFolder("Position")
cameraPositionFolder.add(camera.position, 'x', -200, 200, 0.01);
cameraPositionFolder.add(camera.position, 'y', -200, 200, 0.01);
cameraPositionFolder.add(camera.position, 'z', -200, 200, 0.01);
cameraPositionFolder.open();

const cameraRotationFolder = cameraFolder.addFolder("Rotation")
cameraRotationFolder.add(camera.rotation, 'x', -100, 100, 0.01);
cameraRotationFolder.add(camera.rotation, 'y', -100, 100, 0.01);
cameraRotationFolder.add(camera.rotation, 'z', -100, 100, 0.01);
cameraRotationFolder.open();

cameraFolder.open();

const webglrenderer = new THREE.WebGLRenderer({ antialias: true });
webglrenderer.shadowMap = THREE.PCFSoftShadowMap;

webglrenderer.setSize(sizes.width, sizes.height);
containerDiv.appendChild(webglrenderer.domElement);

const cssrenderer = new CSS3DRenderer();
cssrenderer.domElement.style.position = 'absolute';
cssrenderer.domElement.style.top = '0';

cssrenderer.setSize(sizes.width, sizes.height);
containerDiv.appendChild(cssrenderer.domElement);

// const controls = new OrbitControls(camera, webglrenderer.domElement);
const gridHelper = new THREE.GridHelper(200, 200);
webglscene.add(gridHelper)

const iframe = document.createElement('iframe');
iframe.width = '640';
iframe.height = '360';
iframe.src = 'https://htmlcolorcodes.com/';

const div = document.createElement('div');
div.appendChild(iframe);
const divObject = new CSS3DObject(div);
divObject.position.set(0, 0, 0);
divObject.rotation.set(0, 0, 0);
divObject.scale.set(.058, .058, .058);
cssscene.add(divObject);

computer.scene.scale.set(.1, .1, .1);

const divObjectfolder = gui.addFolder("Div Object");
divObjectfolder.add(divObject.scale, 'x', -2, 1, 0.001);
divObjectfolder.add(divObject.scale, 'y', -2, 1, 0.001);
divObjectfolder.add(divObject.scale, 'z', -2, 1, 0.001);
divObjectfolder.open();

const group = new THREE.Group();

const lightIntensity = 300;
const lightColor = 0xffffff;

const pointLightLeft = new THREE.PointLight(lightColor, lightIntensity);
const pointLightLeftHelper = new THREE.PointLightHelper(pointLightLeft);
pointLightLeft.position.set(-18.67, 25.44, 34.27);
group.add(pointLightLeft, pointLightLeftHelper);

const pointLightRight = new THREE.PointLight(lightColor, lightIntensity);
const pointLightRightHelper = new THREE.PointLightHelper(pointLightRight);
pointLightRight.position.set(27.65, 25.44, 34.27);
group.add(pointLightRight, pointLightRightHelper);

const geometry = new THREE.PlaneGeometry(37, 20.29);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(geometry, material);
plane.position.setY(16.9);
plane.position.setZ(0.5);
plane.scale.set(1, 1, 1);

group.add(plane);

const planeFolder = gui.addFolder('Plane');
planeFolder.add(plane.position, 'x');
planeFolder.add(plane.position, 'y');
planeFolder.add(plane.position, 'z');
planeFolder.open();

computer.scene.children.forEach(obj => {
    obj.castShadow = true;
})

group.add(computer.scene);
document.addEventListener('mousemove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
})

group.position.set(13.7, 57.88, 5.77);

const groupPositionVector = group.position;
const groupRotationVector = group.rotation;

const planePositionVector = plane.position;
const planeRotationVector = plane.rotation;

divObject.position.set(groupPositionVector.x + planePositionVector.x, groupPositionVector.y + planePositionVector.y, groupPositionVector.z + planePositionVector.z);
divObject.rotation.set(groupRotationVector.x + planeRotationVector.x, groupRotationVector.y + planeRotationVector.y, groupRotationVector.z + planeRotationVector.z);

desk.scene.scale.set(.5, .5, .5);
desk.scene.position.set(-728.6, -57.87, 286.49);
desk.scene.scale.set(2, 2, 2);

desk.scene.children[0].receiveShadow = true;

group.add(desk.scene);

webglscene.add(group);

const textureLoader = new THREE.TextureLoader();
const wallMap = await textureLoader.loadAsync('./materials/Bricks052_2K_Color.jpg');
const wallNormalMap = await textureLoader.loadAsync('./materials/Bricks052_2K_Normal.jpg');
const wallAoMap = await textureLoader.loadAsync('./materials/Bricks052_2K_AmbientOcclusion.jpg');
const wallRoughnessMap = await textureLoader.loadAsync('./materials/Bricks052_2K_Roughness.jpg');

const wallGroup = new THREE.Group();
const wallHeightCount = 5;
const wallWidthCount = 10;
const wallSize = 30;
for (let i = 1; i <= wallWidthCount; i++) {
    for (let j = 0; j <= wallHeightCount; j++) {
        const wallGeometry = new THREE.PlaneGeometry(wallSize, wallSize, 5, 5);
        const wallMaterial = new THREE.MeshStandardMaterial({
            map: wallMap,
            normalMap: wallNormalMap,
            aoMap: wallAoMap,
            roughnessMap: wallRoughnessMap
        });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(i * wallSize, j * wallSize, 0);
        wallGroup.add(wall);
    }
}
wallGroup.position.set(-130.7, -9.23, -23.08);
webglscene.add(wallGroup);

const wallGroupFolder = gui.addFolder('Wall Group Position');
wallGroupFolder.add(wallGroup.position, 'x', -180, 50, 0.01);
wallGroupFolder.add(wallGroup.position, 'y', -50, 90, 0.01);
wallGroupFolder.add(wallGroup.position, 'z', -50, 50, 0.01);
wallGroupFolder.open();

const clock = new THREE.Clock();
animate();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    camera.rotation.y = pointer.x * 0.00008;
    camera.rotation.x = pointer.y * 0.00008;

    cssrenderer.render(cssscene, camera);
    webglrenderer.render(webglscene, camera);
}

