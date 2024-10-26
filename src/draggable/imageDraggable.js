import interact from 'interactjs';
import { dragMoveListener } from './listeners';
import { createImagePlaceholder } from './elementCreator';

export function setupImageDraggable(state) {
    interact('#imageIcon').draggable({
        inertia: true,
        autoScroll: true,
        listeners: {
            start() {
                createImagePlaceholder(state);
            },
            move(event) {
                dragMoveListener(event);
            }
        }
    });
}