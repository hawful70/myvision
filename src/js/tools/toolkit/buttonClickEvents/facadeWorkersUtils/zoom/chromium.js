import { setDoubleScrollCanvasState } from '../stateManager';

let zoomOverflowWrapperElement;
let zoomOverflowElement;
let stubElement;
let canvasElement;

let newCanvasWidth;
let newCanvasHeight;
let currentZoom = 1;
// should be 6, but currently the code has been optimised to work with 5
const scrollWidth = 5;

let canvasProperties = null;
let canvas = null;

function isHorizontalScrollPresent(element) {
  return element.scrollWidth > element.clientWidth;
}

function reduceCanvasDimensionsBy(width, height) {
  newCanvasWidth -= width;
  newCanvasHeight -= height;
}

function setCanvasElementProperties(left, top) {
  canvasElement.style.left = left || '50%';
  canvasElement.style.top = top || '50%';
}

function setZoomOverFlowElementProperties(width, maxWidth, maxHeight) {
  zoomOverflowElement.style.width = width;
  zoomOverflowElement.style.maxWidth = maxWidth;
  zoomOverflowElement.style.maxHeight = maxHeight;
}

function setZoomOverFlowWrapperElementProperties(width, height, left, marginLeft, marginTop) {
  zoomOverflowWrapperElement.style.width = width;
  zoomOverflowWrapperElement.style.height = height;
  zoomOverflowWrapperElement.style.marginLeft = marginLeft;
  zoomOverflowWrapperElement.style.marginTop = marginTop;
  zoomOverflowWrapperElement.style.left = left || '50%';
}

function setStubElementProperties(width, height, marginLeft, marginTop) {
  stubElement.style.width = width;
  stubElement.style.height = height;
  stubElement.style.marginLeft = marginLeft;
  stubElement.style.marginTop = marginTop;
}

function setDarkZoomOverflowBackground() {
  zoomOverflowElement.style.backgroundColor = '#b1b1b1';
}

function setDefaultZoomOverflowBackground() {
  zoomOverflowElement.style.backgroundColor = '';
}

function setAllElementPropertiesToDefault(switchImage) {
  setZoomOverFlowElementProperties('', '', '');
  setStubElementProperties('', '', '', '');
  setZoomOverFlowWrapperElementProperties('', '', '', '', '');
  if (!switchImage) {
    setCanvasElementProperties('', '');
  }
  setDefaultZoomOverflowBackground();
}

function widthOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${canvasProperties.maximumCanvasWidth}px`;
  const zoomOverflowMaxHeight = `${Math.round(canvasProperties.maximumCanvasHeight)}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2) - 2}px)`;
  const zoomOverflowWrapperMarginLeft = `${Math.round(scrollWidth / 2) - 2}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 1.5}px`;
  const stubMarginTop = `${originalHeight - 17}px`;
  const canvasLeft = `calc(50% - ${scrollWidth / 2 + 0.5}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2) + 0.5}px)`;
  const horizontalScrollOverlap = (Math.round(newCanvasHeight) + scrollWidth)
    - canvasProperties.maximumCanvasHeight + 2;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(scrollWidth + 3, horizontalScrollOverlap);
  setDarkZoomOverflowBackground();
}

function widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${newCanvasWidth - 1}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const zoomOverflowWrapperMarginLeft = `${(scrollWidth / 2)}px`;
  const stubWidth = `${originalWidth - 1}px`;
  const stubMarginTop = `${originalHeight - 18}px`;
  const canvasTop = `calc(50% - ${Math.round((scrollWidth / 2)) + 1}px)`;
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties(stubWidth, '', '', stubMarginTop);
  setCanvasElementProperties('', canvasTop);
  setDarkZoomOverflowBackground();
}

function widthOverflowDefault(originalWidth, originalHeight) {
  const zoomOverflowMaxWidth = `${newCanvasWidth - 1}px`;
  const zoomOverflowWrapperLeft = 'calc(50% + 1px)';
  const zoomOverflowWrapperMarginTop = `${Math.round(scrollWidth / 2) - 1}px`;
  const stubMarginLeft = `${originalWidth - 5}px`;
  const stubMarginTop = `${originalHeight - 14}px`;
  const canvasLeft = 'calc(50% + 0.5px)';
  setZoomOverFlowElementProperties('', zoomOverflowMaxWidth, '');
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, '', zoomOverflowWrapperMarginTop);
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, '');
  setDefaultZoomOverflowBackground();
}

function heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${canvasProperties.maximumCanvasWidth + 1}px`;
  const zoomOverflowMaxHeight = `${canvasProperties.maximumCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth + 0.5}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
  const stubWidth = `${Math.round(originalWidth) + 2}px`;
  const stubMarginTop = `${originalHeight - 18}px`;
  const canvasLeft = `calc(50% - ${Math.round(scrollWidth / 2) + 0.5}px)`;
  const canvasTop = `calc(50% - ${Math.round(scrollWidth / 2) + 1}px)`;
  const verticalScrollOverlap = originalWidth + scrollWidth
    - canvasProperties.maximumCanvasWidth + 2.3;
  // bug fix for Chrome as sometimes the horizontal scroll does not render
  isHorizontalScrollPresent(zoomOverflowElement);
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties(stubWidth, '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(verticalScrollOverlap, scrollWidth + 1.5);
  setDarkZoomOverflowBackground();
}

function heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${Math.round(originalWidth) + 0.3}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${scrollWidth / 2}px)`;
  const zoomOverflowWrapperWidth = `${originalWidth - 1}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth}px`;
  const canvasLeft = `calc(50% - ${(scrollWidth / 2) + 1.5}px)`;
  const stubMarginTop = `${originalHeight - 18}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties(zoomOverflowWrapperWidth, '', zoomOverflowWrapperLeft,
    zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties(canvasLeft, '');
  setDarkZoomOverflowBackground();
}

function heightOverflowDefault(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${originalWidth + 0.5}px`;
  const zoomOverflowMaxHeight = `${newCanvasHeight}px`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth + 2}px`;
  const stubMarginTop = `${originalHeight - scrollWidth - 13}px`;
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', '', zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', '', stubMarginTop);
  setCanvasElementProperties('', '');
  setDarkZoomOverflowBackground();
}

// the use of current zoom may be the secret key for tighter zoom overflow wrap
function fullOverflowOfWidthAndHeight(originalWidth, originalHeight) {
  const zoomOverflowWidth = `${Math.round(newCanvasWidth + 1)}px`;
  const zoomOverflowMaxHeight = `${Math.round(newCanvasHeight)}px`;
  const zoomOverflowWrapperLeft = `calc(50% - ${Math.round(scrollWidth / 2 + 3)}px)`;
  const zoomOverflowWrapperMarginLeft = `${scrollWidth / 2 + 3}px`;
  const stubMarginLeft = `${Math.round(originalWidth) - 2}px`;
  const stubMarginTop = `${Math.round(originalHeight) - 12 - (currentZoom + 4.5)}px`;
  const canvasLeft = 'calc(50% - 3.5px)';
  const canvasTop = 'calc(50% - 4px)';
  setZoomOverFlowElementProperties(zoomOverflowWidth, '', zoomOverflowMaxHeight);
  setZoomOverFlowWrapperElementProperties('', '', zoomOverflowWrapperLeft, zoomOverflowWrapperMarginLeft, '');
  setStubElementProperties('', '', stubMarginLeft, stubMarginTop);
  setCanvasElementProperties(canvasLeft, canvasTop);
  reduceCanvasDimensionsBy(scrollWidth + 2, scrollWidth + 2);
  setDarkZoomOverflowBackground();
}

function setTempValues(newCanvasWidthArg, newCanvasHeightArg, canvasPropertiesArg, currentZoomArg) {
  newCanvasWidth = newCanvasWidthArg;
  newCanvasHeight = newCanvasHeightArg;
  canvasProperties = canvasPropertiesArg;
  currentZoom = currentZoomArg;
}

function changeElementPropertiesChromium(heightOverflowed, widthOverflowed, originalWidth,
  originalHeight, newCanvasWidthArg, newCanvasHeightArg, canvasPropertiesArg, currentZoomArg) {
  setTempValues(newCanvasWidthArg, newCanvasHeightArg, canvasPropertiesArg, currentZoomArg);
  if (heightOverflowed) {
    if (widthOverflowed) {
      setDoubleScrollCanvasState(true);
      fullOverflowOfWidthAndHeight(originalWidth, originalHeight);
      console.log('horizontal and vertical overlap');
    } else {
      setDoubleScrollCanvasState(false);
      heightOverflowDefault(originalWidth, originalHeight);
      console.log('vertical overlap default');
      if (Math.round(newCanvasWidth) + (scrollWidth * 2)
        >= canvasProperties.maximumCanvasWidth - 1) {
        heightOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight);
        console.log('vertical double scrollbar overlap');
        if (Math.round(newCanvasWidth) + scrollWidth >= canvasProperties.maximumCanvasWidth - 1) {
          setDoubleScrollCanvasState(true);
          heightOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight);
          console.log('vertical single scrollbar overlap');
        }
      }
    }
  } else if (widthOverflowed) {
    setDoubleScrollCanvasState(false);
    widthOverflowDefault(originalWidth, originalHeight);
    console.log('horizontal overlap default');
    if (newCanvasHeight + (scrollWidth * 2) > canvasProperties.maximumCanvasHeight - 4) {
      widthOverflowDoubleVerticalScrollBarOverlap(originalWidth, originalHeight);
      console.log('horizontal double scrollbar overlap');
      if (newCanvasHeight + (scrollWidth) > canvasProperties.maximumCanvasHeight - 1) {
        setDoubleScrollCanvasState(true);
        widthOverlapWithOneVerticalScrollBarOverlap(originalWidth, originalHeight);
        console.log('horizontal single scrollbar overlap');
      }
    }
  } else {
    setDoubleScrollCanvasState(false);
    setAllElementPropertiesToDefault();
    console.log('set to default');
  }
  const finalImageDimensions = {
    width: newCanvasWidth,
    height: newCanvasHeight,
  };
  canvas.setDimensions(finalImageDimensions);
}

function setDOMElementsChromium(stubElementArg, zoomOverflowElementArg,
  zoomOverflowWrapperElementArg, initialCanvasElement) {
  stubElement = stubElementArg;
  zoomOverflowElement = zoomOverflowElementArg;
  zoomOverflowWrapperElement = zoomOverflowWrapperElementArg;
  canvasElement = initialCanvasElement;
}

function setCanvasElementChromium(newCanvasElement) {
  canvasElement = newCanvasElement;
}

function initialiseVariablesChromium(canvasArg) {
  canvas = canvasArg;
}

export {
  initialiseVariablesChromium, setCanvasElementChromium,
  changeElementPropertiesChromium, setDOMElementsChromium,
};
