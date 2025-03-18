import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { grassShader, autumnGrassShader } from "./shaders/GrassShader";
import grassjpg from "@assets/img/grass.jpg";
import grassjpgcopy from "@assets/img/grass copy.jpg";
import cloudjpg from "@assets/img/cloud.jpg";

// Utility: converts a value from one range to another.
function convertRange(val, oldMin, oldMax, newMin, newMax) {
    return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

// Generates the vertices and indices for one grass blade.
function generateBlade(center, vArrOffset, uv, bladeWidth, bladeHeight, bladeHeightVariation) {
    const MID_WIDTH = bladeWidth * 0.5;
    const TIP_OFFSET = 0.1;
    const height = bladeHeight + Math.random() * bladeHeightVariation;

    const yaw = Math.random() * Math.PI * 2;
    const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
    const tipBend = Math.random() * Math.PI * 2;
    const tipBendUnitVec = new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend));

    // Compute the five vertex positions for the blade.
    const bl = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3().copy(yawUnitVec).multiplyScalar(bladeWidth / 2)
    );
    const br = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3().copy(yawUnitVec).multiplyScalar(-bladeWidth / 2)
    );
    const tl = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3().copy(yawUnitVec).multiplyScalar(MID_WIDTH / 2)
    );
    const tr = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3().copy(yawUnitVec).multiplyScalar(-MID_WIDTH / 2)
    );
    const tc = new THREE.Vector3().addVectors(
        center,
        new THREE.Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET)
    );

    tl.y += height / 2;
    tr.y += height / 2;
    tc.y += height;

    // Define vertex colors.
    const black = [0, 0, 0];
    const gray = [0.5, 0.5, 0.5];
    const white = [1, 1, 1];

    const verts = [
        { pos: bl.toArray(), uv, color: black },
        { pos: br.toArray(), uv, color: black },
        { pos: tr.toArray(), uv, color: gray },
        { pos: tl.toArray(), uv, color: gray },
        { pos: tc.toArray(), uv, color: white },
    ];

    const indices = [
        vArrOffset,
        vArrOffset + 1,
        vArrOffset + 2,
        vArrOffset + 2,
        vArrOffset + 4,
        vArrOffset + 3,
        vArrOffset + 3,
        vArrOffset,
        vArrOffset + 2,
    ];

    return { verts, indices };
}

function createStyledGroundMaterial(texture, type) {
    if (type === "autumn") {
        return new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            color: new THREE.Color(" #d28c4d"),
            emissive: new THREE.Color("rgb(218, 176, 23)"),
            emissiveIntensity: 0.5,
            roughness: 0.8
        });
    } else {
        // Default green style
        return new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            color: new THREE.Color("#54a955"),
            emissive: new THREE.Color("#004500"),
            emissiveIntensity: 0.1,
            roughness: 0.7
        });
    }
}


type GrassFieldProps = {
    planePosition: [number, number, number];
    planeSize: number;
    bladeCount: number;
    bladeWidth: number;
    bladeHeight: number;
    bladeHeightVariation: number;
    type?: "autumn" | "default";
};

const GrassField = ({ planePosition, planeSize, bladeCount, bladeWidth, bladeHeight, bladeHeightVariation, type = "default"}: GrassFieldProps) => {
    // Load textures using the react-three-fiber loader.
    const grassTexture = useLoader(TextureLoader, grassjpg);
    const grassTextureCopy = useLoader(TextureLoader, grassjpgcopy);
    const cloudTexture = useLoader(TextureLoader, cloudjpg);
    cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

    // Reference for the shader material to update its uniforms.
    const materialRef = useRef();
    const startTime = useMemo(() => Date.now(), []);

    // Update time uniform on every frame.
    useFrame(() => {
        const elapsedTime = Date.now() - startTime;
        if (materialRef.current) {
            materialRef.current.uniforms.iTime.value = elapsedTime;
        }
    });
    
    const groundMaterial = useMemo(() => {
        return createStyledGroundMaterial(grassTextureCopy, type);
    }, [grassTextureCopy, type]);

    // Create the field geometry only once.
    const geometry = useMemo(() => {
        const positions = [];
        const uvs = [];
        const indices = [];
        const colors = [];

        const VERTEX_COUNT = 5;
        const surfaceMin = -planeSize / 2;
        const surfaceMax = planeSize / 2;
        const radius = planeSize / 2;

        for (let i = 0; i < bladeCount; i++) {
            // Random position in a circular area.
            const r = radius * Math.sqrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            const pos = new THREE.Vector3(planePosition[0] + x, planePosition[1], planePosition[2] + y);
            const uv = [
                convertRange(pos.x, surfaceMin, surfaceMax, 0, 1),
                convertRange(pos.z, surfaceMin, surfaceMax, 0, 1),
            ];

            const blade = generateBlade(pos, i * VERTEX_COUNT, uv, bladeWidth, bladeHeight, bladeHeightVariation);
            blade.verts.forEach((vert) => {
                positions.push(...vert.pos);
                uvs.push(...vert.uv);
                colors.push(...vert.color);
            });
            blade.indices.forEach((ind) => indices.push(ind));
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
        geom.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geom.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();
        // geom.computeFaceNormals();

        return geom;
    }, []);

    // Create uniforms for the shader.
    const grassUniforms = useMemo(
        () => ({
            textures: { value: [grassTexture, cloudTexture] },
            iTime: { value: 0.0 },
            // ...THREE.UniformsLib.lights
        }),
        [grassTexture, cloudTexture]
    );

    const selectedShader = type === "autumn" ? autumnGrassShader : grassShader;

    return (
        <>
            <mesh geometry={geometry}>
                <shaderMaterial
                    ref={materialRef}
                    uniforms={grassUniforms}
                    vertexShader={selectedShader.vert}
                    fragmentShader={selectedShader.frag}
                    vertexColors={true}
                    side={THREE.DoubleSide}
                    // lights={true}
                />
            </mesh>

            {/* a simple green circe bellow the grass */}
            <mesh position={planePosition} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[planeSize / 2, 32]} />
                <primitive object={groundMaterial} attach="material" />
            </mesh>
        </>
    );
};

export default GrassField;
