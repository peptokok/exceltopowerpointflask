import interact from 'interactjs';
import { dragMoveListener, resizeListener } from './listeners';

export function setupCanvasElementDraggable() {
    interact('.draggable').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent'
            })
        ],
        listeners: {
            move: dragMoveListener
        }
    }).resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
            interact.modifiers.restrictSize({
                min: { width: 100, height: 30 }
            })
        ],
        listeners: {
            move: resizeListener
        }
    });
}