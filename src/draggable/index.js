import { setupColumnDraggable } from './columnDraggable';
import { setupCanvasElementDraggable } from './canvasElementDraggable';
import { setupImageDraggable } from './imageDraggable';
import { setupFormatPanelEvents } from './formatPanel';
import { setupSizeControls } from './listeners';

export function setupDraggable(state) {
    setupColumnDraggable(state);
    setupCanvasElementDraggable();
    setupImageDraggable(state);
    setupFormatPanelEvents();
    setupKeyboardEvents();
    setupAlignmentButtons();
    setupSizeControls();
}

// Rest of the code remains the same