import React, { useEffect, useState, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { Group, Box3, Vector3 } from 'three';
import RobloxAvatarDS from '../../data_services/RobloxAvatarDS';

interface RobloxAvatarProps {
  playerName: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const RobloxAvatar: React.FC<RobloxAvatarProps> = ({
  playerName,
  scale = 0.1,
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) => {
  const [objUrl, setObjUrl] = useState<string | null>(null);
  const [mtlUrl, setMtlUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const groupRef = useRef<Group>(null);

  // Load the avatar data from the API
  useEffect(() => {
    const fetchAvatarData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const avatarData = await RobloxAvatarDS.getAvatarModel(playerName);
        
        // Create full URLs for OBJ and MTL files
        setMtlUrl(RobloxAvatarDS.getAvatarFileUrl(playerName, avatarData.mtl_file));
        setObjUrl(RobloxAvatarDS.getAvatarFileUrl(playerName, avatarData.obj_file));
      } catch (err) {
        console.error('Failed to load avatar model:', err);
        setError('Failed to load avatar model');
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarData();
  }, [playerName]);

  // Use Materials and Model loader when URLs are available
  const materials = mtlUrl ? useLoader(MTLLoader, mtlUrl) : null;
  const obj = objUrl && materials 
    ? useLoader(OBJLoader, objUrl, (loader) => {
        if (materials) {
          materials.preload();
          loader.setMaterials(materials);
        }
      })
    : null;

  // Center the model and fix materials
  const centerAndFixModel = (model: Group) => {
    // Calculate bounding box to center the model
    const box = new Box3().setFromObject(model);
    const center = box.getCenter(new Vector3());
    
    // Reset the model position to center it at origin
    model.position.sub(center);
    
    // Fix material transparency issues
    model.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // If handling a single material
        if (!Array.isArray(child.material)) {
          // Remove alphaMap if it exists
          if (child.material.alphaMap) {
            child.material.alphaMap = null;
          }
          child.material.transparent = false;
          child.material.needsUpdate = true;
        } 
        // If handling multiple materials
        else {
          child.material.forEach((mat: any) => {
            if (mat.alphaMap) {
              mat.alphaMap = null;
            }
            mat.transparent = false;
            mat.needsUpdate = true;
          });
        }
      }
    });
    
    return model;
  };

  // Create a new Group ref to hold the model
  useEffect(() => {
    if (groupRef.current && obj) {
      // Clear previous children
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      
      // Clone, center, and fix the model before adding
      const modelClone = obj.clone();
      const fixedModel = centerAndFixModel(modelClone);
      
      // Add the fixed model
      groupRef.current.add(fixedModel);
    }
  }, [obj]);

  // Return loading state or error as null (won't render anything)
  if (loading || error || !obj) return null;

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      scale={[scale, scale, scale]}
    />
  );
};

export default RobloxAvatar;
