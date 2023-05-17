import './style.css';
import * as THREE from 'three';

/*
* Scene
*/
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000);

/*
* Camera
*/
const resolution = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, resolution, 0.5, 1000);
camera.position.setZ(25);


// resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector('#app')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

/*
* Lighting
*/
const pointLight = new THREE.PointLight(0xfff);
pointLight.position.set(5, -28.5, 5);

const pointLight2 = new THREE.PointLight(0x00ffff);
pointLight2.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0x000000);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);

scene.add(pointLight, pointLight2, ambientLight, directionalLight);

/*
* Coin
*/
const textureLoader = new THREE.TextureLoader();

// Face 1
const face1Texture = textureLoader.load('/heads.png');
const face1Material = new THREE.MeshLambertMaterial({ map: face1Texture });

// Face 2
const face2Texture = textureLoader.load('/tails.png');
const face2Material = new THREE.MeshLambertMaterial({ map: face2Texture });

// Edge
const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

const coinMaterials = [
  whiteMaterial, // Coin edge
  face1Material, // Coin face 1
  face2Material, // Coin face 2
];

const coinGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 20, 20, false);
const coin = new THREE.Mesh(coinGeometry, coinMaterials);
scene.add(coin);

let animationId = null;
const animationDuration = 500; // Animation duration in milliseconds
const animationSpeed = 0.006; // Speed of rotation

let choice = null
function startAnimation(wrongChoice = "", failed) {
  if (failed) {
    choice = prompt(`your choice ${wrongChoice} is wrong you have to choose only between 'heads' or 'tails'`)
  } else {
    choice = prompt(`Choose 'heads' or 'tails'`)
  }
  const spellCheck = choice == 'heads' || choice == 'tails'
  if (!spellCheck) {
    startAnimation(choice, true)
    return
  }
  confirm(`your choice is ${choice}`)
  if (animationId === null) {
    animationId = requestAnimationFrame(animate);
  }
}

function stopAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
    const stoppageAngle = coin.rotation.y % (2 * Math.PI);
    const result = stoppageAngle > 1.3 ? 'tails' : 'heads';
    if (choice == result) {
      alert('You won 😉')
    } else {
      alert('You lost 🙅🏿')
    }
    console.log(result, stoppageAngle)
  }
}

function animate(currentTime) {
  const elapsed = currentTime % animationDuration;

  // Calculate the rotation angle based on elapsed time and speed
  const rotationAngle = animationSpeed * elapsed;

  // Update the rotation of the coin
  coin.rotation.y = rotationAngle;
  coin.rotation.x = rotationAngle;
  coin.rotation.z = rotationAngle;

  renderer.render(scene, camera);

  // Continue the animation loop
  animationId = requestAnimationFrame(animate);
}

// Start animation when the button is clicked
const startButton = document.querySelector('#start');
startButton.addEventListener('click', startAnimation);

// Stop animation when the button is clicked
const stopButton = document.querySelector('#stop');
stopButton.addEventListener('click', stopAnimation);
