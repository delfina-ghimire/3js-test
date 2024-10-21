import { Canvas, useFrame,} from "@react-three/fiber";
import "./App.css";
import { useGLTF, Stage, PresentationControls, OrbitControls, Wireframe } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MeshStandardMaterial } from 'three';

const Cube = ({position, size, color }) => {
   const ref = useRef()
    useFrame((state, delta) => {
      ref.current.rotation.x += delta
      ref.current.rotation.y += delta *2
      ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2
  })
  return(
      <mesh  position={position} ref={ref}>
        <boxGeometry args={size}/>
        <meshStandardMaterial color={color} wireframe/>
      </mesh>
  )
}
function Model({ url, color }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef()

  const material = useMemo(() => {
    return new MeshStandardMaterial({
      color: isHovered ? 'goldenrod' : color,
      metalness: isHovered ? 1 : 0,
      roughness: isHovered ? 0.2 : 1,
    });
  }, [isHovered, color]);

   const { scene } = useGLTF(url); 

    useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }, [scene, material]);

    useFrame((state, delta) => {
       ref.current.position.x = Math.sin(state.clock.elapsedTime) * 0.1
  })

  return <mesh
   ref={ref} 
   onPointerEnter={(event)=>(event.stopPropagation(), setIsHovered(true))}
   onPointerLeave={() => setIsHovered(false) }
   >
    <primitive object={scene}     />; 
     {isHovered && (
        <pointLight
         position={[5,``,5]} 
          intensity={2} 
          distance={6} 
          decay={2} 
          color="gold" 
        />)}
    </mesh>
}


const App = () => {
  return (
    <Canvas dpr={[1,2]} shadows camera={{fov:45}} style={{"position": "absolute" }}>
      <color attach="background" args={["#101010"]}/>
      <directionalLight position={[0,0,2]} intensity={1}/>
      <ambientLight intensity={0.5}/>
   
       <OrbitControls /> 
       <group position={[0,-0.5,0]}>
       <Model url="/models/S.gltf" color="#fff" />
      <Model url="/models/T.gltf" color="#fff" />
      <Model url="/models/O.gltf" color="#fff"/>
      <Model url="/models/R.gltf" color="#fff"/>
      <Model url="/models/Y.gltf" color="#fff" />    
       </group>

       {/* <Cube color={"yellow"}/> */}
     

    </Canvas>
  );
};

export default App;
