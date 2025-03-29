/**
 * Interface representing Roblox avatar model data.
 */
export interface IRobloxAvatar {
  /**
   * The filename of the OBJ 3D model file
   */
  obj_file: string;
  
  /**
   * The filename of the MTL material file
   */
  mtl_file: string;
  
  /**
   * List of texture filenames used by the model
   */
  textures: string[];
  
  /**
   * Base URL path to fetch the files from
   */
  base_url: string;
}

export default IRobloxAvatar;
