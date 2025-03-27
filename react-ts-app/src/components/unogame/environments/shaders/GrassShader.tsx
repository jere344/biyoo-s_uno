import vert from './glsl/grass.vert.glsl';
import frag from './glsl/grass.frag.glsl';
import autumnGrassFrag from './glsl/autumnGrass.frag.glsl';

type ShaderType = {
    vert: string;
    frag: string;
};

const grassShader: ShaderType = {
    vert,
    frag,
};

const autumnGrassShader: ShaderType = {
    vert,
    frag: autumnGrassFrag,
};

export { grassShader, autumnGrassShader };