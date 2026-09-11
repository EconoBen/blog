export type Point = { x: number; y: number };
export type MeshVertex = { source: Point; target: Point };
export type TriangleMesh = { vertices: MeshVertex[]; triangles: [number, number, number][] };
export type AffineTransform = { a: number; b: number; c: number; d: number; e: number; f: number };
export type MeshCoverage = {
  readonly width: number;
  readonly height: number;
  readonly columns: number;
  readonly rows: number;
  readonly sums: Uint32Array;
};
const COVERAGE_CELL = 8;

/**
 * Read static artwork once and retain a small summed table of occupied 8×8 cells.
 * Every nonzero alpha value counts, including isolated antialiased feather tips.
 * Rebuild after resizing or adding ink outside the original source silhouette.
 * A mask may be shared by same-sized textures contained within that silhouette.
 * Unreadable canvases return null so the caller can keep complete rendering.
 */
export function createMeshCoverage(source: HTMLCanvasElement): MeshCoverage | null {
  const { width, height } = source;
  if (![width, height].every(value => Number.isSafeInteger(value) && value > 0)) return null;
  try {
    const ctx = source.getContext('2d');
    if (!ctx) return null;
    const pixels = ctx.getImageData(0, 0, width, height).data;
    const columns = Math.ceil(width / COVERAGE_CELL), rows = Math.ceil(height / COVERAGE_CELL);
    const occupied = new Uint8Array(columns * rows);
    for (let y = 0; y < height; y++) {
      const row = Math.floor(y / COVERAGE_CELL) * columns;
      for (let x = 0; x < width; x++) {
        if (pixels[(y * width + x) * 4 + 3] !== 0) occupied[row + Math.floor(x / COVERAGE_CELL)] = 1;
      }
    }
    const stride = columns + 1, sums = new Uint32Array(stride * (rows + 1));
    for (let y = 0; y < rows; y++) {
      let count = 0;
      for (let x = 0; x < columns; x++) {
        count += occupied[y * columns + x];
        sums[(y + 1) * stride + x + 1] = sums[y * stride + x + 1] + count;
      }
    }
    return { width, height, columns, rows, sums };
  } catch {
    return null;
  }
}

function coverageMatchesImage(coverage: MeshCoverage, image: CanvasImageSource): boolean {
  const source = image as { naturalWidth?: number; naturalHeight?: number; videoWidth?: number; videoHeight?: number; displayWidth?: number; displayHeight?: number; width?: unknown; height?: unknown };
  const width = source.naturalWidth ?? source.videoWidth ?? source.displayWidth ?? source.width;
  const height = source.naturalHeight ?? source.videoHeight ?? source.displayHeight ?? source.height;
  return width === coverage.width && height === coverage.height;
}

/** Query the actual expanded raster clip, including its reconstruction footprint. */
function clipHasCoverage(coverage: MeshCoverage, clip: readonly Point[], matrix: AffineTransform): boolean {
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  if (!Number.isFinite(determinant) || determinant === 0) return true;
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  for (const point of clip) {
    const x = point.x - matrix.e, y = point.y - matrix.f;
    const sx = (matrix.d * x - matrix.c * y) / determinant;
    const sy = (matrix.a * y - matrix.b * x) / determinant;
    left = Math.min(left, sx); right = Math.max(right, sx);
    top = Math.min(top, sy); bottom = Math.max(bottom, sy);
  }
  // Cover source texel interpolation and four backing pixels of reconstruction.
  // Under extreme foreshortening this deliberately keeps more triangles, rather
  // than assuming a fixed source margin can cover an arbitrarily expanded clip.
  const padX = 2 + 4 * (Math.abs(matrix.d) + Math.abs(matrix.c)) / Math.abs(determinant);
  const padY = 2 + 4 * (Math.abs(matrix.b) + Math.abs(matrix.a)) / Math.abs(determinant);
  if (![left, top, right, bottom, padX, padY].every(Number.isFinite)) return true;
  const x0 = Math.max(0, Math.min(coverage.columns, Math.floor((left - padX) / COVERAGE_CELL)));
  const y0 = Math.max(0, Math.min(coverage.rows, Math.floor((top - padY) / COVERAGE_CELL)));
  const x1 = Math.max(0, Math.min(coverage.columns, Math.floor((right + padX) / COVERAGE_CELL) + 1));
  const y1 = Math.max(0, Math.min(coverage.rows, Math.floor((bottom + padY) / COVERAGE_CELL) + 1));
  if (x0 >= x1 || y0 >= y1) return false;
  const stride = coverage.columns + 1, sums = coverage.sums;
  return sums[y1 * stride + x1] - sums[y0 * stride + x1] - sums[y1 * stride + x0] + sums[y0 * stride + x0] > 0;
}

const finitePoint = (point: Point | undefined): point is Point =>
  !!point && Number.isFinite(point.x) && Number.isFinite(point.y);
const areaTwice = (a: Point, b: Point, c: Point) =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

function usableTriangle(points: readonly Point[]): boolean {
  if (points.length !== 3 || !points.every(finitePoint)) return false;
  const [a, b, c] = points;
  const area = areaTwice(a, b, c);
  const longestEdgeSquared = Math.max(
    (a.x - b.x) ** 2 + (a.y - b.y) ** 2,
    (b.x - c.x) ** 2 + (b.y - c.y) ** 2,
    (c.x - a.x) ** 2 + (c.y - a.y) ** 2,
  );
  // Reject triangles that are effectively a line at their own coordinate scale.
  return Number.isFinite(area) && Number.isFinite(longestEdgeSquared)
    && Math.abs(area) > longestEdgeSquared * 1e-10;
}

/** Map source-image pixels to target drawing coordinates, using Canvas's a–f convention. */
export function triangleAffine(source: readonly Point[], target: readonly Point[]): AffineTransform | null {
  if (!usableTriangle(source) || !usableTriangle(target)) return null;
  const [s0, s1, s2] = source;
  const [t0, t1, t2] = target;
  const sx1 = s1.x - s0.x, sy1 = s1.y - s0.y;
  const sx2 = s2.x - s0.x, sy2 = s2.y - s0.y;
  const tx1 = t1.x - t0.x, ty1 = t1.y - t0.y;
  const tx2 = t2.x - t0.x, ty2 = t2.y - t0.y;
  const determinant = sx1 * sy2 - sx2 * sy1;
  const a = (tx1 * sy2 - tx2 * sy1) / determinant;
  const b = (ty1 * sy2 - ty2 * sy1) / determinant;
  const c = (tx2 * sx1 - tx1 * sx2) / determinant;
  const d = (ty2 * sx1 - ty1 * sx2) / determinant;
  const e = t0.x - a * s0.x - c * s0.y;
  const f = t0.y - b * s0.x - d * s0.y;
  return [a, b, c, d, e, f].every(Number.isFinite) ? { a, b, c, d, e, f } : null;
}

/** Indexed vertices make adjacent texture triangles share the same deformed edge. */
export function makeGrid(
  width: number,
  height: number,
  columns: number,
  rows: number,
  deform: (point: Point) => Point,
): TriangleMesh {
  if (![width, height].every(value => Number.isFinite(value) && value > 0)
    || ![columns, rows].every(value => Number.isSafeInteger(value) && value > 0)) {
    throw new RangeError('Mesh dimensions must be positive and finite; subdivisions must be positive integers.');
  }
  const vertices: MeshVertex[] = [];
  const triangles: [number, number, number][] = [];
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      const source = { x: width * (column / columns), y: height * (row / rows) };
      // A rig may mutate its input point; its source texture location stays intact.
      const target = deform({ ...source });
      vertices.push({ source, target: { x: target.x, y: target.y } });
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const topLeft = row * (columns + 1) + column;
      const bottomLeft = topLeft + columns + 1;
      triangles.push([topLeft, topLeft + 1, bottomLeft + 1], [topLeft, bottomLeft + 1, bottomLeft]);
    }
  }
  return { vertices, triangles };
}

/** Offset clip edges by half a pixel, with bounded joins at sharp corners. */
function seamClip(points: readonly Point[]): Point[] {
  const direction = areaTwice(points[0], points[1], points[2]) > 0 ? 1 : -1;
  const normals = points.map((point, index) => {
    const next = points[(index + 1) % 3];
    const dx = next.x - point.x, dy = next.y - point.y;
    const length = Math.hypot(dx, dy);
    return { x: direction * dy / length, y: -direction * dx / length };
  });
  return points.map((point, index) => {
    const previous = normals[(index + 2) % 3], next = normals[index];
    const factor = .5 / Math.max(1e-10, 1 + previous.x * next.x + previous.y * next.y);
    const dx = (previous.x + next.x) * factor, dy = (previous.y + next.y) * factor;
    const bounded = Math.min(1, 2 / Math.max(Number.EPSILON, Math.hypot(dx, dy)));
    return { x: point.x + dx * bounded, y: point.y + dy * bounded };
  });
}

/**
 * Draw a textured mesh without changing the caller's canvas transform or styles.
 * Source vertices use natural image pixels; targets use the caller's drawing units.
 * Seam overlap stays half a backing-canvas pixel through DPR/camera transforms.
 * Lightweight contexts without getTransform fall back to half a drawing unit.
 * Optional cached coverage skips empty clips without reading artwork per frame.
 * Like other path drawing helpers, this starts a fresh current path.
 */
export function drawTexturedMesh(ctx: CanvasRenderingContext2D, image: CanvasImageSource, mesh: TriangleMesh, coverage?: MeshCoverage | null): void {
  // Transparent source pixels can still erase or filter existing paint under
  // other compositing modes. Keep the complete renderer for those effects.
  const ordinaryPaint = (!ctx.globalCompositeOperation || ctx.globalCompositeOperation === 'source-over')
    && (!ctx.filter || ctx.filter === 'none') && !ctx.shadowBlur && !ctx.shadowOffsetX && !ctx.shadowOffsetY;
  const mask = ordinaryPaint && coverage && coverageMatchesImage(coverage, image) ? coverage : null;
  if (mask && mask.sums[mask.sums.length - 1] === 0) return;
  const current = ctx.getTransform?.() ?? { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  const determinant = current.a * current.d - current.b * current.c;
  if (![current.a, current.b, current.c, current.d, current.e, current.f, determinant].every(Number.isFinite) || determinant === 0) return;
  for (const indices of mesh.triangles) {
    const vertices = indices.map(index => mesh.vertices[index]);
    if (vertices.length !== 3 || vertices.some(vertex => !vertex || !finitePoint(vertex.source) || !finitePoint(vertex.target))) continue;
    const source = vertices.map(vertex => vertex.source), target = vertices.map(vertex => vertex.target);
    const matrix = triangleAffine(source, target);
    if (!matrix) continue;
    // Expand in actual raster coordinates, then return the clip to drawing space.
    // A source-sized rig may otherwise shrink the overlap below antialias coverage.
    const raster = target.map(point => ({
      x: current.a * point.x + current.c * point.y + current.e,
      y: current.b * point.x + current.d * point.y + current.f,
    }));
    if (!usableTriangle(raster)) continue;
    const rasterClip = seamClip(raster);
    if (mask && !clipHasCoverage(mask, rasterClip, {
      a: current.a * matrix.a + current.c * matrix.b,
      b: current.b * matrix.a + current.d * matrix.b,
      c: current.a * matrix.c + current.c * matrix.d,
      d: current.b * matrix.c + current.d * matrix.d,
      e: current.a * matrix.e + current.c * matrix.f + current.e,
      f: current.b * matrix.e + current.d * matrix.f + current.f,
    })) continue;
    const clip = rasterClip.map(point => {
      const x = point.x - current.e, y = point.y - current.f;
      return { x: (current.d * x - current.c * y) / determinant, y: (current.a * y - current.b * x) / determinant };
    });
    if (!clip.every(finitePoint)) continue;
    ctx.save();
    try {
      ctx.beginPath();
      ctx.moveTo(clip[0].x, clip[0].y);
      ctx.lineTo(clip[1].x, clip[1].y);
      ctx.lineTo(clip[2].x, clip[2].y);
      ctx.closePath();
      ctx.clip();
      ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
      ctx.drawImage(image, 0, 0);
    } finally {
      ctx.restore();
    }
  }
}
