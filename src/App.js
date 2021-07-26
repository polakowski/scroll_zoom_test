import clamp from 'lodash.clamp';
import {
  useState,
} from 'react';

import './App.css';
import imageBg from './bgggggg.png';

const OPERATION_SCROLL = 'SCROLL';
const OPERATION_ZOOM = 'ZOOM';

function App() {
  const [scrollX, setScrollX] = useState(-400);
  const [scrollY, setScrollY] = useState(-400);
  const [zoom, setZoom] = useState(1);
  const [toX, setToX] = useState(100);
  const [toY, setToY] = useState(100);
  const [mousePos, setMousePos] = useState({});
  const [lastOperation, setLastOperation] = useState(OPERATION_SCROLL);

  const onMouseMove = (event) => {
    const rect = event.target.getBoundingClientRect();

    setMousePos({
      x: (event.clientX - rect.x) / zoom,
      y: (event.clientY - rect.y) / zoom,
    });
  };

  const onWheel = (event) => {
    if (event.metaKey) {
      if (event.deltaY === 0) {
        return;
      }

      const newToX = event.pageX - event.currentTarget.offsetLeft;
      const newToY = event.pageY - event.currentTarget.offsetTop;
      const newZoom = zoom + (event.deltaY > 0 ? -0.1 : 0.1);

      const xDiff = toX - newToX;
      const yDiff = toY - newToY;

      const zoomCompl = (1 - zoom);
      const scrollXDelta = (xDiff / zoom) * zoomCompl;
      const scrollYDelta = (yDiff / zoom) * zoomCompl;

      setToX(newToX);
      setToY(newToY);

      setScrollX(scrollX + scrollXDelta);
      setScrollY(scrollY + scrollYDelta);

      setLastOperation(OPERATION_ZOOM);
      setZoom(clamp(newZoom, 0.1, 5));

      return;
    }

    const newX = scrollX - event.deltaX;
    const newY = scrollY - event.deltaY;

    setScrollX(newX);
    setScrollY(newY);

    setLastOperation(OPERATION_SCROLL);
  };

  return (
    <div className='outer-wrapper'>
      <div
        onWheel={onWheel}
        className='workspace-wrapper'>
        <div
          className='workspace-zoom'
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: `${toX}px ${toY}px`,
          }}>
          <div
            className='workspace-scroll'
            style={{
              transform: `translate(${scrollX}px, ${scrollY}px)`,
              transition: lastOperation === OPERATION_SCROLL
                 ? 'transform 0.3s ease'
                 : 'none',
            }}>
            <div
              style={{ backgroundImage: `url(${imageBg})` }}
              className='workspace'
              onMouseMove={onMouseMove}>
            </div>
          </div>
          <div
            className='transform-origin-marker'
            style={{
              top: toY - 8,
              left: toX - 8,
            }}
          />
        </div>
        <div className='zoom-info'>
          {(zoom || 0).toFixed(2)}
        </div>
        <div className='mouse-info'>
          {`${Math.round(mousePos.x)}, ${Math.round(mousePos.y)}`}
        </div>
      </div>
    </div>
  );
}

export default App;
