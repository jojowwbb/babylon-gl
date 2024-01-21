// // import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
// // import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
// // import { Engine } from "@babylonjs/core/Engines/engine";
// // import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
// // import { Vector3 } from "@babylonjs/core/Maths/math.vector";
// // import { MeshBuilder } from "@babylonjs/core/Meshes/Builders";
// // import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
// // import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
// // import { Scene } from "@babylonjs/core/scene";

// // import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";

// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
// import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
// import earcut from 'earcut'

// // Get the canvas element from the DOM.
// const canvas = document.getElementById('renderCanvas')

// // Associate a Babylon Engine to it.
// const engine = new BABYLON.Engine(canvas)

// // Create our first scene.
// var scene = new BABYLON.Scene(engine)

// // This creates and positions a free camera (non-mesh)
// // var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

// var camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 1.5, Math.PI / 2.2, 15, new BABYLON.Vector3(0, 0, 0))

// // This targets the camera to scene origin
// camera.setTarget(BABYLON.Vector3.Zero())

// // This attaches the camera to the canvas
// camera.attachControl(canvas, true)

// // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
// var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 10, 0), scene)

// // Default intensity is 1. Let's dim the light a small amount
// light.intensity = 0.7

// // demo

// //Polygon shape in XZ plane
// const shape = [new BABYLON.Vector3(4, 0, -4), new BABYLON.Vector3(-4, 0, -4), new BABYLON.Vector3(-4, 0, 4), new BABYLON.Vector3(4, 0, 4), new BABYLON.Vector3(4, 0, -4)]

// MeshBuilder.ExtrudePolygon('polygon', { shape: shape, depth: 0.1, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, null, earcut)

// for (var i = 0; i < shape.length - 2; i++) {
//     createWall(shape[i], shape[i + 1], 4)
// }

// function createWall(pointStart, pointEnd, height = 1) {
//     const wall = MeshBuilder.CreateBox('box', { height: height, width: BABYLON.Vector3.Distance(pointStart, pointEnd), depth: 0.01 })
//     var vec1 = pointEnd.subtract(pointStart)
//     var vec2 = new BABYLON.Vector3(1, 0, 0)
//     var dotProduct = vec1.dot(vec2)
//     var vectorLength = vec1.length() * vec2.length()
//     var angleInRadians = Math.acos(dotProduct / vectorLength)
//     var center = BABYLON.Vector3.Center(pointStart, pointEnd)
//     wall.rotation.y = -angleInRadians
//     wall.position.x = center.x
//     wall.position.y = height / 2
//     wall.position.z = center.z
// }


// console.log(scene)

// var sphere = MeshBuilder.CreateSphere("sphere1",{segments:32,diameter:0.5}, scene);
// sphere.rotation.z = Math.PI/2
// sphere.position.y = 1;

// var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

// // Create the gizmo and attach to the sphere
// var gizmo = new BABYLON.PositionGizmo(utilLayer);
// gizmo.attachedMesh = sphere;

// // Render every frame
// engine.runRenderLoop(() => {
//     scene.render()
// })
