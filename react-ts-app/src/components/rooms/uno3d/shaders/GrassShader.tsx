import vert from './glsl/grass.vert.glsl';
import frag from './glsl/grass.frag.glsl';

type ShaderType = {
    vert: string;
    frag: string;
};

export const grassShader: ShaderType = {
    vert,
    frag
};