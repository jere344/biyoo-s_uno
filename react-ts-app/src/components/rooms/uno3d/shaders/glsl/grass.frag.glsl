uniform sampler2D textures[4];

varying vec2 vUv; // grass texture
varying vec2 cloudUV; // cloud texture
varying vec3 vColor; // black roots, white tips

void main() {
  float contrast = 1.;

  vec3 grassColor = texture2D(textures[0], vUv).rgb * contrast;
  vec3 cloudColor = texture2D(textures[1], cloudUV).rgb;
  float cloudBrightness = (cloudColor.r + cloudColor.g + cloudColor.b) / 3.0;
  
  vec3 color = grassColor;
  color = mix(color, color * (1.0 + cloudColor * 0.5), 0.8 * cloudBrightness);

  
  float vcolorBrightness = (vColor.r + vColor.g + vColor.b) / 3.0;
  // color = mix(color, vColor, 0.8 - vcolorBrightness);
  color = mix(color, vec3(0.3216, 0.1961, 0.0235), 0.8 - vcolorBrightness);
  

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.;
}