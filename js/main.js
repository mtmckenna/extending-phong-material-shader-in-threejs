/*
 * The goal of this code is to demonstrate one way to extend Three.js's
 * standard Phong material shader. The default cube uses the standard Phong
 * material. The custom cube uses the modified Phong vertex shader in
 * index.html.
 *
 * Basic scene pulled from Three.js docs:
 * https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene
 */

var cubeColorHex = 0x00ff00;

var defaultCanvas = document.getElementById('js-canvas-default');
var defaultMaterial = new THREE.MeshPhongMaterial({ color: cubeColorHex });

var customCanvas = document.getElementById('js-canvas-custom');
var customVertexShader = document.getElementById('js-custom-vertex-shader').textContent;
var customUniforms = THREE.UniformsUtils.merge([
  THREE.ShaderLib.phong.uniforms,
  { diffuse: { value: new THREE.Color(cubeColorHex) } },
  { time: { value: 0.0 } }
]);
var customMaterial = new THREE.ShaderMaterial({
  uniforms: customUniforms,
  vertexShader: customVertexShader,
  fragmentShader: THREE.ShaderLib.phong.fragmentShader,
  lights: true,
  name: 'custom-material'
});

animateScene(defaultCanvas, defaultMaterial);
animateScene(customCanvas, customMaterial);

function animateScene(canvas, material) {
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(width, height);

  var geometry = new THREE.BoxBufferGeometry(3, 3, 3, 4, 4, 4);

  // If this is the custom cube, add random float for every vertex
  if (material.name === 'custom-material') {
    var offset = vertexOffsets(geometry.attributes.position.count);
    geometry.addAttribute('offset', new THREE.BufferAttribute(offset, 1));
  }

  var cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(3, 3, 3);
  scene.add(pointLight);

  var animate = function(timestamp) {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    // If this the custom cube, pass the timestamp to the shader
    if (cube.material.name === 'custom-material') {
      cube.material.uniforms.time.value = timestamp;
    }

    renderer.render(scene, camera);
  };

  animate(0.0);
}

function vertexOffsets(numberOfOffsets) {
  var offsets = new Float32Array(numberOfOffsets);
  for (var i = 0; i < numberOfOffsets; i++) { offsets[i] = Math.random(); }
  return offsets;
}
