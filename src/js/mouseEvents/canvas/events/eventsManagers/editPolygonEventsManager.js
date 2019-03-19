import {
  setEditablePolygon, movePolygonPoint,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
  sendPolygonPointsToFront, getPolygonEditingStatus,
} from '../../../../canvas/canvasObjects/polygon/changePolygon';

let polygonMoved = false;
let polygonPointMoved = false;
let selectedPolygonId = null;
let newPolygonSelected = false;

function setEditablePolygonOnClick(event, canvas) {
  if (getPolygonEditingStatus()) {
    // selecting another polygon without moving the first one
    removePolygonPoints();
  }
  setEditablePolygon(canvas, event.target);
  selectedPolygonId = event.target.id;
}

function setEditablePolygonWhenPolygonMoved(event, canvas) {
  if (newPolygonSelected) {
    setEditablePolygonAfterMoving(canvas, event.target);
    selectedPolygonId = event.target.id;
  } else {
    displayPolygonPointsAfterMove();
  }
  polygonMoved = false;
}

function resetPolygonSelectableAreaAfterPointMoved() {
  resetPolygonSelectableArea();
  polygonPointMoved = false;
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedPolygonId = null;
}

function polygonMouseDownEvents(event) {
  if (event.target) {
    if (event.target.shapeName === 'bndBox' && getPolygonEditingStatus()) {
      setPolygonNotEditableOnClick();
      newPolygonSelected = false;
    } else if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
      newPolygonSelected = true;
    } else {
      newPolygonSelected = false;
    }
  } else {
    newPolygonSelected = false;
  }
}

function polygonMouseUpEvents(event, canvas) {
  if (polygonMoved) {
    setEditablePolygonWhenPolygonMoved(event, canvas);
  } else if (newPolygonSelected) {
    setEditablePolygonOnClick(event, canvas);
  } else if (polygonPointMoved) {
    resetPolygonSelectableAreaAfterPointMoved();
  } else if (event.target && event.target.shapeName === 'polygon') {
    sendPolygonPointsToFront();
  } else if (!event.target && getPolygonEditingStatus()) {
    setPolygonNotEditableOnClick();
  }
}

function polygonMoveEvents(event) {
  if (event.target) {
    if (event.target.shapeName === 'polygon') {
      if (getPolygonEditingStatus()) {
        removePolygonPoints();
      }
      polygonMoved = true;
    } else if (event.target.shapeName === 'point') {
      movePolygonPoint(event);
      polygonPointMoved = true;
    }
  }
}

function removeSelectedPolygonId() {
  selectedPolygonId = null;
}

export {
  polygonMouseDownEvents, polygonMouseUpEvents,
  polygonMoveEvents, removeSelectedPolygonId,
};