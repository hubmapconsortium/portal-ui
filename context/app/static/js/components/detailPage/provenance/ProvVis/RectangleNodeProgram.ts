import { Attributes } from 'graphology-types';
import { NodeProgram, ProgramInfo } from 'sigma/rendering';
import { NodeDisplayData, RenderParams, PartialButFor } from 'sigma/types';

const UNIFORMS = ['u_sizeRatio', 'u_correctionRatio', 'u_matrix'] as const;

// Vertex shader that creates a rectangle
const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute vec4 a_color;
  attribute vec2 a_texture;

  uniform float u_sizeRatio;
  uniform float u_correctionRatio;
  uniform mat3 u_matrix;

  varying vec4 v_color;
  varying vec2 v_texture;

  const float bias = 255.0 / 254.0;

  void main() {
    // Use standard Sigma size calculation for consistent behavior (match NodeCircleProgram)
    float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;
    float height = size;
    float width = size * 2.5; // Make rectangles wider than they are tall
    
    vec2 matrix = (u_matrix * vec3(a_position, 1.0)).xy;
    
    // Create rectangle vertices
    vec2 vertex = vec2(a_texture.x * width, a_texture.y * height);
    
    gl_Position = vec4(matrix + vertex, 0.0, 1.0);

    // Pass through color and texture coordinates
    v_color = vec4(a_color.rgb * bias, a_color.a);
    v_texture = a_texture;
  }
`;

// Fragment shader that renders rectangles
const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  varying vec4 v_color;
  varying vec2 v_texture;

  void main() {
    // Simple rectangle - no circular bounds checking
    // All fragments within the rectangle bounds are rendered
    gl_FragColor = v_color;
  }
`;

export class RectangleNodeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends NodeProgram<(typeof UNIFORMS)[number], N, E, G> {
  getDefinition() {
    return {
      VERTICES: 4,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE,
      METHOD: WebGLRenderingContext.TRIANGLE_FAN,
      UNIFORMS,
      ATTRIBUTES: [
        { name: 'a_position', size: 2, type: WebGLRenderingContext.FLOAT },
        { name: 'a_size', size: 1, type: WebGLRenderingContext.FLOAT },
        { name: 'a_color', size: 4, type: WebGLRenderingContext.UNSIGNED_BYTE, normalized: true },
      ],
      CONSTANT_ATTRIBUTES: [{ name: 'a_texture', size: 2, type: WebGLRenderingContext.FLOAT }],
      CONSTANT_DATA: [
        // Rectangle vertices forming a square (4 corners)
        [-1, -1], // Bottom left
        [1, -1], // Bottom right
        [1, 1], // Top right
        [-1, 1], // Top left
      ],
    };
  }

  processVisibleItem(nodeIndex: number, startIndex: number, data: NodeDisplayData): void {
    const array = this.array;
    let index = startIndex;

    // Position (x, y)
    array[index++] = data.x;
    array[index++] = data.y;

    // Size
    array[index++] = data.size;

    // Color - cast to any to match Sigma's internal handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    array[index] = data.color as any;
  }

  setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
    const { u_sizeRatio, u_correctionRatio, u_matrix } = uniformLocations;

    gl.uniform1f(u_sizeRatio, params.sizeRatio);
    gl.uniform1f(u_correctionRatio, params.correctionRatio);
    gl.uniformMatrix3fv(u_matrix, false, params.matrix);
  }

  drawLabel = (
    context: CanvasRenderingContext2D,
    data: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _settings: any,
  ): void => {
    if (!data.label) return;

    // Match the WebGL shader size calculation for consistency
    // Use the same size calculation as the vertex shader: a_size * u_correctionRatio / u_sizeRatio * 4.0
    // For canvas rendering, data.size is already the final display size
    const displaySize = data.size;
    const fontSize = Math.max(displaySize * 0.3, 8); // Scale font relative to rectangle size
    const font = 'Arial';
    const weight = 'normal';
    const color = '#000000';

    context.fillStyle = color;
    context.font = `${weight} ${fontSize}px ${font}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Calculate available width for text - match the WebGL rectangle width
    const width = displaySize * 2.5;
    const maxWidth = width * 0.8; // Leave some padding

    // Check if text fits, if not, truncate with ellipsis
    let displayText = data.label;
    const textWidth = context.measureText(displayText).width;

    if (textWidth > maxWidth) {
      // More efficient truncation - binary search approach for long texts
      if (displayText.length > 20) {
        // For long labels, start with a reasonable estimate
        const estimatedLength = Math.floor((maxWidth / textWidth) * displayText.length * 0.8);
        displayText = displayText.slice(0, estimatedLength);
      }

      // Fine-tune with ellipsis
      while (context.measureText(displayText + '...').width > maxWidth && displayText.length > 1) {
        displayText = displayText.slice(0, -1);
      }
      displayText += '...';
    }

    // Draw label at the center of the node
    context.fillText(displayText, data.x, data.y);
  };

  drawHover = (
    context: CanvasRenderingContext2D,
    data: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings: any,
  ): void => {
    const height = data.size;
    const width = height * 2.5; // Match the aspect ratio from the shader
    const color = '#000000';

    context.strokeStyle = color;
    context.lineWidth = Math.max(height / 15, 1); // Thinner stroke for better appearance

    // Draw border around the rectangle with proper dimensions
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    context.strokeRect(data.x - halfWidth, data.y - halfHeight, width, height);

    if (data.label) {
      this.drawLabel(context, data, settings);
    }
  };
}
