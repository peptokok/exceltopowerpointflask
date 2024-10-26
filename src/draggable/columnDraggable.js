import interact from 'interactjs';
import { createDraggableElement } from './elementCreator';

export function setupColumnDraggable(state) {
    interact('.column-item').draggable({
        inertia: true,
        autoScroll: true,
        listeners: {
            start(event) {
                const clone = createDraggableElement(
                    event.target.textContent,
                    event.target.getAttribute('data-column')
                );
                document.getElementById('canvasContent').appendChild(clone);
                event.target.setAttribute('data-clone-id', state.elements.length);
                state.elements.push(clone);
            },
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            end(event) {
                event.target.style.transform = '';
                event.target.removeAttribute('data-x');
                event.target.removeAttribute('data-y');
            }
        }
    });
}