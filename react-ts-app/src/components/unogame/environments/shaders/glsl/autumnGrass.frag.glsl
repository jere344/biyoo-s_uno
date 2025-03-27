uniform sampler2D textures[4];

varying vec2 vUv; // grass texture
varying vec2 cloudUV; // cloud texture
varying vec3 vColor; // black roots, white tips

void main() {
  float contrast = 1.2; // Increased contrast to enhance autumn colors

  vec3 grassColor = texture2D(textures[0], vUv).rgb * contrast;
  
  // Autumn color palette
  vec3 autumnOrange = vec3(0.85, 0.3, 0.1);
  vec3 autumnYellow = vec3(0.9, 0.75, 0.1);
  vec3 autumnRed = vec3(0.7, 0.15, 0.05);
  vec3 autumnBrown = vec3(0.45, 0.25, 0.1);
  
  // Create autumn color variation based on UV coordinates
  float colorVariation =  dot(grassColor, vec3(0.299, 0.587, 0.114)); // Luminance of the original grass color
  vec3 autumnColor = mix(
    mix(autumnOrange, autumnYellow, smoothstep(0.0, 0.5, colorVariation)),
    mix(autumnRed, autumnBrown, smoothstep(0.5, 1.0, colorVariation)),
    smoothstep(0.3, 0.7, colorVariation)
  );
  
  // Apply autumn coloring to the grass
  grassColor = mix(grassColor, autumnColor, 0.65);
  
  // Warm lighting effect
  vec3 cloudColor = texture2D(textures[1], cloudUV).rgb;
  vec3 goldenSunlight = vec3(1.0, 0.9, 0.6);
  // cloudColor = mix(cloudColor, goldenSunlight, 0.4);
  float cloudBrightness = (cloudColor.r + cloudColor.g + cloudColor.b) / 3.0;
  
  vec3 color = grassColor;
  color = mix(color, color * (1.0 + cloudColor * 0.5), 0.8 * cloudBrightness);
  


  // Add slight depth with brown tones at the base
  // float vcolorBrightness = (vColor.r + vColor.g + vColor.b) / 3.0;
  // color = mix(color, vColor, 0.8 - vcolorBrightness);
  

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.;
}