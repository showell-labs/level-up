/**
 * Issue
 *
 * When there are multiple annotations of different size close to each other, the
 * algorithm doesn't seem to make logically the best choice.
 *
 * Imagine you have two annotations like in the example below. "x" refers to user's touch
 * point. For some reason this algorithm seems to return "Annot 1" even though "Annot 2"
 * is clearly closer.
 *
 * *************************************
 *
 * --------------
 * | Annot 1    |
 * --------------
 *
 * x
 * --------------------------------
 * | Annot 2                      |
 * --------------------------------
 *
 * *************************************
 */

interface TouchPoint {
  x: number;
  y: number;
}

interface Annotation {
  url: string;
  width: number;
  height: number;
  left: number;
  top: number;
}

// How far the touch can be from the annotation
const HIT_SLOP = 50;

/**
 * Retrieve annotation that should receive user's touch
 *
 * Annotation may receive touch if the touch is within the annotation
 * or close enough to annotation. If there are multiple annotations
 * close to each other, the nearest is selected. If there are overlapping
 * annotations and the touch is within the annotations' boundaries,
 * the last annotation is selected.
 */
export default function getTouchedAnnotation(
  point: TouchPoint,
  annotations: Annotation[]
) {
  let nearestDistance: number = Number.MAX_SAFE_INTEGER;
  let match: Annotation | undefined = undefined;

  annotations.forEach((annot) => {
    const left = annot.left;
    const top = annot.top;
    const right = left + annot.width;
    const bottom = top + annot.height;
    const annotCenterX = (right - left) / 2 + left;
    const annotCenterY = (bottom - top) / 2 + top;
    const isWithinBounds =
      left <= point.x &&
      right >= point.x &&
      top <= point.y &&
      bottom >= point.y;

    const deltaX = Math.abs(annotCenterX - point.x);
    const deltaY = Math.abs(annotCenterY - point.y);
    const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    // Exact match
    if (isWithinBounds) {
      nearestDistance = 0;
      match = annot;
      return;
    }

    // Close match
    if (distance < nearestDistance && distance < HIT_SLOP) {
      nearestDistance = distance;
      match = annot;
    }
  });

  return match;
}
