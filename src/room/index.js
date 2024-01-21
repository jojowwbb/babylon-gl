import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import '@babylonjs/loaders/glTF'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import earcut from 'earcut'

function getParent(mesh) {
    if (mesh.parent) {
        return getParent(mesh.parent)
    }
    return mesh
}

class RoomDesigner {
    currentSelectedMesh = null
    startingPoint = null
    ground = null
    meshList = []
    collisionGroups = []

    constructor() {
        this.init()
        this.initEvent()
        this.createRoom()
        this.loadAssets('RobotExpressive.glb')
    }

    /**
     * 初始化Canvas场景
     */
    init() {
        this.initScene()
        this.initCamera()
        this.initLight()
    }

    /**
     * 初始化场景
     */
    initScene() {
        this.canvas = document.getElementById('renderCanvas')
        const engine = new BABYLON.Engine(this.canvas)
        var scene = new BABYLON.Scene(engine)
        scene.collisionsEnabled = true
        this.scene = scene
        engine.runRenderLoop(() => {
            scene.render()
        })
    }

    /**
     * 初始化相机
     */
    initCamera() {
        this.camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 1.5, Math.PI / 2.2, 15, new BABYLON.Vector3(0, 0, 0))
        this.camera.checkCollisions = true
        this.camera.setTarget(BABYLON.Vector3.Zero())
        this.camera.attachControl(this.canvas, true)
    }

    /**
     * 灯光
     */
    initLight() {
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 10, 0), this.scene)
        light.intensity = 0.7
    }

    initEvent() {
        // this.scene.onPointerObservable.add((pointerInfo) => {
        //     switch (pointerInfo.type) {
        //         case BABYLON.PointerEventTypes.POINTERDOWN:
        //             if (pointerInfo.pickInfo.hit) {
        //                 let mesh=getParent(pointerInfo.pickInfo.pickedMesh);
        //                 if(!mesh.name.endsWith('_static')){
        //                     this.currentSelectedMesh=mesh
        //                     this.startingPoint = this.getGroundPosition();
        //                   //  this.showDrag(mesh)
        //                 }else{
        //                   //  this.hideDrag)(
        //                 }

        //             }
        //             break
        //         case BABYLON.PointerEventTypes.POINTERUP:
        //             this.removeMeshPointerDragBehavior()
        //             console.log(BABYLON.PointerEventTypes.POINTERUP)
        //             break
        //         case BABYLON.PointerEventTypes.POINTERMOVE:
        //             console.log(BABYLON.PointerEventTypes.POINTERMOVE)
        //             break
        //     }
        // })

        //键盘事件
        this.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    this.handleKeyEvent(kbInfo.event.code)
                    break
                case BABYLON.KeyboardEventTypes.KEYUP:
                    this.handleKeyEvent(kbInfo.event.code)
                    break
            }
        })

        this.scene.registerBeforeRender(() => {
            const allMeshes = this.collisionGroups
            for (const otherMesh of allMeshes) {
                if (this.currentSelectedMesh && otherMesh.name !== 'test') {
                    var flag = this.currentSelectedMesh.intersectsMesh(otherMesh, false)
                    if (flag) {
                        console.log('pengzhuang')
                        // this.gizmo.dragBehavior.enabled = false
                        break
                    }
                    // console.log(this.currentSelectedMesh.intersectsMesh(otherMesh,false))
                    // if (this.currentSelectedMesh !== otherMesh && this.currentSelectedMesh.intersectsMesh(otherMesh)) {
                    //     // 发生碰撞时停止拖拽
                    //     this.gizmo.dragBehavior.enabled=false;
                    //     break;
                    // }
                }
            }
        })
    }

    handleKeyEvent(key) {}

    createWall(pointStart, pointEnd, height = 1) {
        const wall = MeshBuilder.CreateBox('room_wall_static', { height: height, width: BABYLON.Vector3.Distance(pointStart, pointEnd), depth: 0.01 })
        var vec1 = pointEnd.subtract(pointStart)
        var vec2 = new BABYLON.Vector3(1, 0, 0)
        var dotProduct = vec1.dot(vec2)
        var vectorLength = vec1.length() * vec2.length()
        var angleInRadians = Math.acos(dotProduct / vectorLength)
        var center = BABYLON.Vector3.Center(pointStart, pointEnd)
        wall.rotation.y = -angleInRadians
        wall.position.x = center.x
        wall.position.y = height / 2
        wall.position.z = center.z

        wall.checkCollisions = true
        wall.isPickable = false

        wall.showBoundingBox = true

        return wall
    }

    createRoom() {
        const shape = [new BABYLON.Vector3(4, 0, -4), new BABYLON.Vector3(-4, 0, -4), new BABYLON.Vector3(-4, 0, 4), new BABYLON.Vector3(4, 0, 4), new BABYLON.Vector3(4, 0, -4)]
        const floor = MeshBuilder.ExtrudePolygon('room_floor_static', { shape: shape, depth: 0.1, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, null, earcut)
        this.ground = floor
        floor.checkCollisions = true
        floor.isPickable = false
        for (var i = 0; i < shape.length - 2; i++) {
            this.collisionGroups.push(this.createWall(shape[i], shape[i + 1], 4))
        }
    }

    async loadAssets(fileName) {
        const data = await BABYLON.SceneLoader.ImportMeshAsync('', '/assets/', fileName || '1.glb', this.scene)
        // const mesh = data.meshes[0]
        console.log(data)
        const mesh = BABYLON.Mesh.MergeMeshes([data.meshes[1], data.meshes[2]])
        mesh.name = 'test'
        mesh.checkCollisions = true
        mesh.showBoundingBox = true

        // const wireMat = new BABYLON.StandardMaterial('wireMat', this.scene)
        // wireMat.wireframe = true
        // mesh.material = wireMat

        //this.collisionGroups.push(mesh)
        this.createDrag(mesh, new BABYLON.Vector3(1, 0, 0))

        console.log(this.scene.meshes)
    }

    createDrag(mesh, axis) {
        const utilLayer = new BABYLON.UtilityLayerRenderer(this.scene)
        const gizmo = new BABYLON.AxisDragGizmo(axis, BABYLON.Color3.FromHexString('#00FF00'), utilLayer)
        gizmo.attachedMesh = mesh
        gizmo.updateGizmoPositionToMatchAttachedMesh = true
        gizmo.dragBehavior.onDragStartObservable.add(() => {
            //console.log("Position gizmo's x axis started to be dragged");
            this.currentSelectedMesh = mesh
            this.gizmo = gizmo
        })
        //this.currentSelectedMesh=mesh
        // console.log(this.collisionGroups)
        // gizmo.dragBehavior.validateDrag = (target) => {
        //     var data= this.collisionGroups.find(source=>{
        //         if(source.name=='test'){
        //             return false
        //         }else if(source.intersectsMesh(mesh,false)){
        //             console.log('asdsad')
        //             return true
        //        }else{
        //             return false
        //        }

        //         // if(mesh.name=='test'){
        //         //     return false
        //         // }
        //         // return  BABYLON.Vector3.Distance(target, mesh.position) <= 2.1;
        //     })
        //     console.log(data)
        //     return data?false:true
        // }
    }
}

export default RoomDesigner
