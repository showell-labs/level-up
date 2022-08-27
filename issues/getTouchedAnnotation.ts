//Issue:
//When there are multiple annotations of different size close to each other, the getTouchedAnnotation doesn't seem to make logically the best choice.
// Imagine you have two annotations like in the example below. "x" refers to user's touch point. 
// --------------
// | Annot 1    |
// --------------
 
// x
// --------------------------------
// | Annot 2                      |
// --------------------------------
// For some reason this algorithm seems to return "Annot 1" even though "Annot 2" is clearly closer.


//Initial Thoughts:
//Immediately when reading this I assume there is something wrong with the algorithm that is being used to choose which annot to pick
//How I go about solving a bug like this I like to draw out on a piece of paper or whiteboard so i can visualize 
//how the function to choose a touch point reacts. Photos of this thinking will be attached in issueInvestigation folder

//after drawing it out and visualizing the issue I now understant why there is an issue:
// because we are basing the touch based on the center point of the anotation
//  which we get from using both its height and width coupled with the top and left markers this skews the comparison of the distances
//the algorithm works when all annotations have the same center in terms of width but when an annotations center is moved more right/ left this will mess up the algorithm

//we can see what should be happening vs what is happening with the original code in page 3 of issue Investigation



//Solution proposal:
//we shouldnt just base the touch on the center point of an annotation becuase if the height of the annotation 
// as mentioned earlier if the width of annot 2 is larger that the width of annot 2 by 2 times 
//but the touch is closer to annot 2, annot 1 will be matched
//we should base it on the border or outline of annotation

//solution:
//first check if touch is in boundary of annotation --> this will also work for overlapping annotation
//if not in boundary, check closest Y distance to top and bottom border of annotation and then set to match
//if not in boundary -> 
//first check if touch point intersects perpendicular (check both x scale and y scale) to annotation gives us a straight line the closest distance 
//then if not perpendicular check pythageros theorem to get distance from angle


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
    const isWithinBounds =
      left <= point.x &&
      right >= point.x &&
      top <= point.y &&
      bottom >= point.y;
    let distance = 0;
  

    // Exact match
    if (isWithinBounds) {
      nearestDistance = 0;
      match = annot;
      return;
    }
    //perpendicular match on y axis
    if(point.x >= left && point.x <= right  && (point.y > bottom || point.y < top)){
      point.y > bottom ?  distance = Math.abs(point.y - bottom) : distance =  Math.abs(point.y - top)
     
    }
    //perpendicular match on x axis
    else if(point.y >= top && point.y <= bottom && (point.x > right || point.y < left)){
      point.x > right ?  distance = Math.abs(point.x - right) : distance =  Math.abs(point.x - left);

    }
    //pythagores theorem
    else{
      let deltaX = 0;
      let deltaY = 0;
     point.x > right ?  deltaX = Math.abs(right - point.x) : deltaX = Math.abs(left- point.x);
     point.y > bottom ?  deltaY = Math.abs(bottom - point.y) : deltaY = Math.abs(top- point.y);

      if(Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) < HIT_SLOP){
        distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
      }
    }


    // Close match
    if (distance <= nearestDistance && distance < HIT_SLOP) {
      nearestDistance = distance;
      match = annot;
    }
  });
  return match;
}
