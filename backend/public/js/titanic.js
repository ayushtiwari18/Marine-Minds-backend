let scene, camera, renderer, submarine, ship;
let moveForward = false,
  moveBackward = false,
  moveLeft = false,
  moveRight = false,
  moveUp = false,
  moveDown = false;
let waterParticles;
let exploring = false;
let modelsLoaded = false;
let oxygen = 100;
let isImploding = false;
let implosionStartTime;
let flashCardShown = false;

const MAX_DEPTH = -3850;
const MIN_DEPTH = -10;
const DARK_DEPTH = -3500;
const TITANIC_DEPTH = -3750;
const FLASH_CARD_DEPTH = -3600;
const READ_INFO_DEPTH = -3500;

const loader = new THREE.GLTFLoader();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create sky
  const skyGeometry = new THREE.SphereGeometry(5000, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({
    color: 0x87ceeb,
    side: THREE.BackSide,
  });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  // Create ocean surface
  const oceanGeometry = new THREE.PlaneGeometry(10000, 10000);
  const oceanMaterial = new THREE.MeshPhongMaterial({
    color: 0x006994,
    transparent: true,
    opacity: 0.8,
  });
  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
  ocean.rotation.x = -Math.PI / 2;
  scene.add(ocean);

  // Create ocean floor
  const floorGeometry = new THREE.PlaneGeometry(10000, 10000);
  const floorMaterial = new THREE.MeshPhongMaterial({
    color: 0x00000,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = MAX_DEPTH;
  scene.add(floor);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);

  loadModels();
  addWaterParticles();
  addCorals();

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);
  document.addEventListener("wheel", onScroll, false);
  document.addEventListener("mousedown", onMouseDown, false);
  document.addEventListener("mouseup", onMouseUp, false);
  document.addEventListener("mousemove", onMouseMove, false);

  document
    .getElementById("lets-go-button")
    .addEventListener("click", startExploration);
  document
    .getElementById("read-info-button")
    .addEventListener("click", showTitanicInfo);

  // Show info for 30 seconds
  const infoElement = document.getElementById("info");
  setTimeout(() => {
    infoElement.innerHTML = `Depth: <span id="depth">0</span> m`;
  }, 30000);
  document
    .getElementById("returnToMapButton")
    .addEventListener("click", returnToMap);
}

function loadModels() {
  let loadedCount = 0;
  const totalModels = 3; // Submarine, ship, and Titanic wreck

  function onModelLoad() {
    loadedCount++;
    if (loadedCount === totalModels) {
      modelsLoaded = true;
      console.log("All models loaded");
    }
  }

  function loadModel(path, onLoad, name) {
    loader.load(
      path,
      onLoad,
      (xhr) => {
        console.log(`${name} ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error(`An error occurred loading the ${name} model:`, error);
        onModelLoad();
      }
    );
  }

  loadModel(
    "https://my-threejs-3d-models.s3.amazonaws.com/models/submarine/scene.gltf",
    (gltf) => {
      submarine = gltf.scene;
      submarine.scale.set(5, 5, 5);
      submarine.position.set(0, -10, 0);
      submarine.visible = false;
      scene.add(submarine);
      addSpotlightsToSubmarine();
      onModelLoad();
    },
    "submarine"
  );

  loadModel(
    "https://my-threejs-3d-models.s3.amazonaws.com/models/cruise_ship/scene.gltf",
    (gltf) => {
      ship = gltf.scene;
      ship.scale.set(0.0025, 0.0025, 0.002);
      ship.position.set(0, -1.5, -15);
      ship.rotation.set(0, Math.PI / 2, 0);
      scene.add(ship);
      camera.position.set(0, 7, 15);
      camera.lookAt(0, -5, 0);
      onModelLoad();
    },
    "ship"
  );

  loadModel(
    "https://my-threejs-3d-models.s3.amazonaws.com/models/titanic__wreck/scene.gltf",
    (gltf) => {
      const titanicWreck = gltf.scene;
      titanicWreck.scale.set(20, 20, 20);
      titanicWreck.position.set(0, -3800, -100);
      scene.add(titanicWreck);
      onModelLoad();
    },
    "Titanic wreck"
  );
}

function addCorals() {
  loader.load(
    "https://my-threejs-3d-models.s3.amazonaws.com/models/coral/scene.gltf",
    (gltf) => {
      const coralModel = gltf.scene;
      for (let i = 0; i < 1500; i++) {
        const coral = coralModel.clone();
        coral.position.set(
          Math.random() * 4000 - 2000,
          MAX_DEPTH,
          Math.random() * 4000 - 2000
        );
        coral.scale.set(
          Math.random() * 2 + 1,
          Math.random() * 4 + 2,
          Math.random() * 2 + 1
        );
        scene.add(coral);
      }
    }
  );
}

function addSpotlightsToSubmarine() {
  const spotlightIntensity = 2;
  const spotlightDistance = 100;
  const spotlightAngle = Math.PI / 4;
  const spotlightPenumbra = 0.5;

  const createSpotlight = (x, y, z) => {
    const spotlight = new THREE.SpotLight(
      0xffffff,
      spotlightIntensity,
      spotlightDistance,
      spotlightAngle,
      spotlightPenumbra
    );
    spotlight.position.set(x, y, z);
    submarine.add(spotlight);
    submarine.add(spotlight.target);
    spotlight.target.position.set(x * 2, y * 2, z * 2);
    return spotlight;
  };

  submarine.spotlights = [
    createSpotlight(0, 0, 5), // Front
    createSpotlight(0, 0, -5), // Back
    createSpotlight(5, 0, 0), // Right
    createSpotlight(-5, 0, 0), // Left
  ];
}

function addWaterParticles() {
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 20000;
  const posArray = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 2000;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });
  waterParticles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(waterParticles);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
  switch (event.code) {
    case "ArrowUp":
      moveForward = true;
      break;
    case "ArrowDown":
      moveBackward = true;
      break;
    case "ArrowLeft":
      moveLeft = true;
      break;
    case "ArrowRight":
      moveRight = true;
      break;
    case "Space":
      moveDown = true;
      break;
    case "Tab":
      moveUp = true;
      event.preventDefault();
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case "ArrowUp":
      moveForward = false;
      break;
    case "ArrowDown":
      moveBackward = false;
      break;
    case "ArrowLeft":
      moveLeft = false;
      break;
    case "ArrowRight":
      moveRight = false;
      break;
    case "Space":
      moveDown = false;
      break;
    case "Tab":
      moveUp = false;
      break;
  }
}

function onScroll(event) {
  if (!exploring) return;

  const scrollSpeed = 0.5;
  submarine.position.y -= event.deltaY * scrollSpeed;

  // Clamp depth
  submarine.position.y = Math.max(
    Math.min(submarine.position.y, MIN_DEPTH),
    MAX_DEPTH
  );

  // Update camera position
  updateCameraPosition();

  // Update depth display
  const depthElement = document.getElementById("depth");
  depthElement.innerText = (-submarine.position.y).toFixed(2);
}

function updateCameraPosition() {
  const offset = new THREE.Vector3(0, 10, 30);
  offset.applyQuaternion(submarine.quaternion);
  camera.position.copy(submarine.position).add(offset);
  camera.lookAt(submarine.position);
}

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
  isDragging = false;
}

function onMouseMove(event) {
  if (!isDragging || !exploring) return;

  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y,
  };

  const rotationSpeed = 0.003;
  submarine.rotation.y -= deltaMove.x * rotationSpeed;
  submarine.rotation.x -= deltaMove.y * rotationSpeed;

  submarine.rotation.x = Math.max(
    -Math.PI / 2,
    Math.min(Math.PI / 2, submarine.rotation.x)
  );

  previousMousePosition = { x: event.clientX, y: event.clientY };
  updateCameraPosition();
}

function startExploration() {
  if (!submarine) {
    console.error("Submarine model not loaded. Cannot start exploration.");
    return;
  }
  exploring = true;
  flashCardShown = false;
  submarine.visible = true;
  if (ship) ship.visible = false;
  submarine.position.set(0, -10, 0);
  updateCameraPosition();

  scene.fog = new THREE.FogExp2(0x000033, 0.00075);
  document.getElementById("lets-go-button").style.display = "none";
  document.getElementById("oxygen-bar").style.display = "block";
}

function updateEnvironment() {
  const depth = -submarine.position.y;
  let fogDensity, ambientIntensity;

  if (depth > DARK_DEPTH) {
    const t = depth / DARK_DEPTH;
    fogDensity = 0.00075 + t * 0.00125;
    ambientIntensity = 0.1 * (1 - t);
  } else {
    fogDensity = 0.002;
    ambientIntensity = 0;
  }

  scene.fog.density = fogDensity;
  scene.children.find(
    (child) => child instanceof THREE.AmbientLight
  ).intensity = ambientIntensity;

  if (depth > READ_INFO_DEPTH) {
    document.getElementById("read-info-button").style.display = "block";
  } else {
    document.getElementById("read-info-button").style.display = "none";
  }

  if (depth > FLASH_CARD_DEPTH && !flashCardShown) {
    showTitanicInfo();
    flashCardShown = true;
  }

  document.getElementById("depth").innerText = depth.toFixed(2);
}

function showTitanicInfo() {
  const flashCard = document.getElementById("flash-card");
  flashCard.innerHTML = `
    <button class="close-button" onclick="closeFlashCard()">×</button>
    <h2>The Titanic</h2>
    <p>The RMS Titanic was a British passenger liner that sank in the North Atlantic Ocean on April 15, 1912, after striking an iceberg during her maiden voyage from Southampton, UK, to New York City.</p>
    <p>Key facts:</p>
    <ul>
        <li>Over 1,500 people died, making it one of the deadliest maritime disasters in modern history.</li><br>
        <li>The ship was the largest afloat at the time and was considered "unsinkable".</li><br>
        <li>The wreck was discovered in 1985 at a depth of about 12,500 feet (3,800 m).</li><br>
        <li>The Titanic's story has fascinated the public for over a century, inspiring numerous books, films, and exhibitions.</li>
    </ul>
    <p> <br>  LET US EXPLORE IT !</p>
  `;
  flashCard.style.display = "block";
}

function closeFlashCard() {
  document.getElementById("flash-card").style.display = "none";
}

function updateOxygen() {
  if (exploring && submarine.position.y < MIN_DEPTH) {
    oxygen -= 0.05;
    if (oxygen <= 0) {
      oxygen = 0;
      exploring = false;
      startImplosion();
    }
  } else if (submarine.position.y >= MIN_DEPTH) {
    oxygen = Math.min(oxygen + 0.1, 100);
  }
  document.getElementById("oxygen-level").style.width = `${oxygen}%`;
}

function startImplosion() {
  isImploding = true;
  implosionStartTime = Date.now();
  document.getElementById("implosion-text").style.display = "block";
  setTimeout(() => {
    document.getElementById("implosion-text").style.display = "none";
    showOceanGateInfo();
  }, 5000);
}

function updateImplosion() {
  if (!isImploding) return;

  const elapsedTime = (Date.now() - implosionStartTime) / 1000;
  const implosionDuration = 2;

  if (elapsedTime < implosionDuration) {
    const t = elapsedTime / implosionDuration;
    const scale = 1 - t;

    submarine.scale.set(scale * 5, scale * 5, scale * 5);
    submarine.rotation.x += 0.1;
    submarine.rotation.y += 0.15;
    submarine.rotation.z += 0.2;

    // Add particle effect
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    });

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = submarine.position.x + (Math.random() - 0.5) * 5;
      positions[i + 1] = submarine.position.y + (Math.random() - 0.5) * 5;
      positions[i + 2] = submarine.position.z + (Math.random() - 0.5) * 5;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Remove particles after a short time
    setTimeout(() => {
      scene.remove(particles);
    }, 1000);
  } else {
    // Implosion complete
    scene.remove(submarine);
    isImploding = false;
  }
}

function showOceanGateInfo() {
  const flashCard = document.getElementById("flash-card");
  flashCard.innerHTML = `
    <button class="close-button" onclick="closeFlashCard()">×</button>
    <h2>OceanGate Titan Submersible Incident</h2>
    <p>On June 18, 2023, the Titan, a submersible operated by OceanGate, imploded during a dive to the Titanic wreck site.</p>
    <p>Key facts:</p>
    <ul>
        <li>The submersible was carrying five people, including OceanGate's CEO.</li>
        <li>The implosion occurred at a depth of approximately 12,500 feet (3,800 meters).</li>
        <li>The incident highlighted concerns about the safety of deep-sea exploration vehicles.</li>
        <li>The implosion was likely due to the immense pressure at that depth, estimated at over 5,600 pounds per square inch.</li>
    </ul>
    <p>This tragic event serves as a stark reminder of the extreme challenges and risks involved in deep-sea exploration.</p>
  `;
  flashCard.style.display = "block";
}

function returnToMap() {
  const currentLocation = { name: "Titanic Sinking Spot" };
  window.location.href = `/Mystries?returnedFrom=${encodeURIComponent(
    currentLocation.name
  )}`;
}

function animate() {
  requestAnimationFrame(animate);

  if (modelsLoaded) {
    if (exploring && !isImploding) {
      const speed = 1;
      const direction = new THREE.Vector3();
      submarine.getWorldDirection(direction);

      if (moveForward) submarine.position.add(direction.multiplyScalar(speed));
      if (moveBackward)
        submarine.position.add(direction.multiplyScalar(-speed));
      if (moveLeft)
        submarine.position.add(
          new THREE.Vector3(-direction.z, 0, direction.x)
            .normalize()
            .multiplyScalar(speed)
        );
      if (moveRight)
        submarine.position.add(
          new THREE.Vector3(direction.z, 0, -direction.x)
            .normalize()
            .multiplyScalar(speed)
        );
      if (moveUp) submarine.position.y += speed;
      if (moveDown) submarine.position.y -= speed;

      submarine.position.y = Math.max(
        Math.min(submarine.position.y, MIN_DEPTH),
        MAX_DEPTH
      );

      updateCameraPosition();
      waterParticles.position.y = submarine.position.y;

      updateEnvironment();
      updateOxygen();
    } else if (!exploring) {
      ship.position.y = -1.5 + Math.sin(Date.now() * 0.001) * 0.5;
      camera.lookAt(ship.position);
    }

    if (isImploding) {
      updateImplosion();
    }
  }

  renderer.render(scene, camera);
}

// Initialize the scene
init();
// Start the animation loop
animate();
