<script>
    import { T, useTask } from '@threlte/core'
    import { Environment, interactivity, Text3DGeometry } from '@threlte/extras'
    import { spring } from 'svelte/motion'
    import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
    import { useLoader } from '@threlte/core'
    import Kinematics from '$lib/kinematics';
    import { OrbitControls } from '@threlte/extras'
    import { robotCoordinates, useSliderControl } from '$lib/robotStore.js';

    import { onMount } from 'svelte';

    interactivity()
    const scale = spring(1)
    const scaleFactor = 0.25;
  
    let rotation = 0
    let headRot = -1.57

    // Loading STL Files
    const baseSTL = useLoader(STLLoader).load('robot/BASE_2.stl')
    const a1STL = useLoader(STLLoader).load('robot/A1_2.stl')
    const a2STL = useLoader(STLLoader).load('robot/A2_2.stl')
    const a3STL = useLoader(STLLoader).load('robot/A3_2.stl')
    const a4STL = useLoader(STLLoader).load('robot/A4_2.stl')
    const a5STL = useLoader(STLLoader).load('robot/A5_2.stl')

//const Kinematics = require('kinematics').default
const geometry = [
  [259,  270,  75], // V0: 1x 1y
  [0, 680,  14], // V1: 10y
  [476.5,  -22.5,  -107], // V2: 5x
  [190,  0,  0], // V3: 3x
  [0, -158,  0], // V4: -3y
  ].map(arr => arr.map(val => val * scaleFactor));

const RobotKin = new Kinematics(geometry);
let r1 = 0
let r2 = 0
let r3 = 0
let r4 = 0
let r5 = 0
let r6 = 0
let animationTime = 0
let headX = 0
let headY = 0
let headZ = 200

// Subscribe to store values
let targetX = 0
let targetY = 180
let targetZ = 200
let useSliderControlActive = false

// Subscribe to stores
robotCoordinates.subscribe(coords => {
    targetX = coords.x
    targetY = coords.y
    targetZ = coords.z
})

useSliderControl.subscribe(value => {
    useSliderControlActive = value
})

useTask((delta) => {
    // Increment animation time
    animationTime += delta
    
    let res;
    
    if (useSliderControlActive) {
        // Use slider values for robot position
        res = RobotKin.inverse(targetX, targetY, targetZ, 0, 0, headRot)
        
        // If slider position is invalid, fall back to animation
        if (res.some(Number.isNaN)) {
            useSliderControl.set(false)
        }
    } else {
        // Animation mode - create smooth figure-8 or circular motion
        const animX = -55 + Math.sin(animationTime * 1.2) * 60
        const animY = 180 + Math.cos(animationTime * 0.8) * 50
        const animZ = 200
        
        // Calculate robot angles for animation position
        res = RobotKin.inverse(animX, animY, animZ, 0, 0, headRot)
        
        // If animation result is invalid, use default position
        if (res.some(Number.isNaN)) {
            res = RobotKin.inverse(-55, 180, 200, 0, 0, headRot)
        }
    }
    
    if (res && !res.some(Number.isNaN)) {
        r1 = res[0]
        r2 = res[1]
        r3 = res[2]
        r4 = res[3]
        r5 = res[4]
        r6 = res[5]
        
        // Calculate head position using forward kinematics
        const forwardPos = RobotKin.forward(r1, r2, r3, r4, r5, r6)
        headX = forwardPos[5][0]
        headY = forwardPos[5][1]
        headZ = forwardPos[5][2]
    }
})
  </script>
  
  <T.DirectionalLight position={[0, 1000, 1000]} castShadow/>

  <T.OrthographicCamera
    makeDefault
    position={[0, 100, 510]}
    on:create={({ ref }) => {
      ref.lookAt(0, 1, 0)
    }}
  > 
    <OrbitControls maxPolarAngle={1.56} />
  </T.OrthographicCamera>

  <Environment url="robot/distribution_board_1k.hdr" />

  <T.GridHelper args={[10, 10, "#F25C19", "#F25C19"]} />

  {#if $baseSTL && $a1STL && $a2STL && $a3STL && $a4STL && $a5STL}
  <T.Mesh
    geometry={$baseSTL}
    scale={scaleFactor}>
    <T.MeshStandardMaterial color="#F25C19"       
    metalness={0.5}
    roughness={0.5}
    reflectifity={0.5}/>
    <T.Mesh
        geometry={$a1STL}
        scale={1}
        rotation.y = {r1}
        castShadow
        receiveShadow>
        <T.MeshStandardMaterial color="#F25C19"       
        metalness={1}
        roughness={0.5}
        reflectifity={0.5}/>
        <T.Mesh
            geometry={$a2STL}
            position.x= 259.01
            position.y = 269.95
            position.z = 75
            rotation.z = {r2}
            castShadow
            receiveShadow>
            <T.MeshStandardMaterial color="#F25C19"       
            metalness={0.5}
            roughness={0.5}
            reflectifity={0.5}/>
            <T.Mesh
                geometry={$a3STL}
                position.x= 0
                position.y = 680
                position.z = 14
                rotation.z = {r3}
                castShadow
                receiveShadow>
                <T.MeshStandardMaterial color="#F25C19"       
                metalness={0.5}
                roughness={0.5}
                reflectifity={0.5}/>
                <T.Mesh
                    geometry={$a4STL}
                    position.x= 476.5
                    position.y = -22.5
                    position.z = -107
                    rotation.x = {r4}
                    castShadow
                    receiveShadow>
                    <T.MeshStandardMaterial color="#F25C19"       
                    metalness={0.5}
                    roughness={0.5}
                    reflectifity={0.5}/>
                    <T.Mesh
                        geometry={$a5STL}
                        position.x= 190
                        position.y = 0
                        position.z = 0
                        rotation.z = {r5}
                        castShadow
                        receiveShadow>
                        <T.MeshStandardMaterial color="#F25C19"       
                        metalness={0.5}
                        roughness={0.5}
                        reflectifity={0.5}/>
                    </T.Mesh>
                </T.Mesh>
            </T.Mesh>
        </T.Mesh>
    </T.Mesh>
</T.Mesh>
  {/if}
  
  <!-- End-Effector Position Display -->
  <T.Group position={[0, -100, 100]} scale={0.15} rotation={[Math.PI / -2, 0, 0]}>
    <!-- X Coordinate -->
    <T.Mesh position={[0, 0, 0]}>
      <Text3DGeometry text={`X: ${headX.toFixed(2)}`} />
      <T.MeshStandardMaterial
        color="#ff4444"
        toneMapped={false}
        emissive="#ff4444"
        emissiveIntensity={0.5}
      />
    </T.Mesh>
    
    <!-- Y Coordinate -->
    <T.Mesh position={[0, -200, 0]}>
      <Text3DGeometry text={`Y: ${headY.toFixed(2)}`} />
      <T.MeshStandardMaterial
        color="#44ff44"
        toneMapped={false}
        emissive="#44ff44"
        emissiveIntensity={0.5}
      />
    </T.Mesh>
    
    <!-- Z Coordinate -->
    <T.Mesh position={[0, -400, 0]}>
      <Text3DGeometry text={`Z: ${headZ.toFixed(2)}`} />
      <T.MeshStandardMaterial
        color="#4444ff"
        toneMapped={false}
        emissive="#4444ff"
        emissiveIntensity={0.5}
      />
    </T.Mesh>
    
    <!-- Control Mode Indicator -->
    <T.Mesh position={[0, -600, 0]}>
      <Text3DGeometry text={useSliderControlActive ? 'SLIDER MODE' : 'ANIMATION MODE'} />
      <T.MeshStandardMaterial
        color={useSliderControlActive ? "#ff9800" : "#4caf50"}
        toneMapped={false}
        emissive={useSliderControlActive ? "#ff9800" : "#4caf50"}
        emissiveIntensity={0.3}
      />
    </T.Mesh>
  </T.Group>



