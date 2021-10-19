import * as React from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useGesture } from "@use-gesture/react";
import { animated, useSpring, config } from "@react-spring/konva";

window.Konva.hitOnDragEnabled = true;
window.Konva.captureTouchEventsEnabled = true;

const STAGE_WIDTH = 500;
const STAGE_HEIGHT = 350;

export default function App() {
  return (
    <div>
      <div>Konva Demo (change index.js for Web Demo)</div>

      <DrawingTool />
    </div>
  );
}

export const DrawingTool = () => {
  const stageWrapperRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const isPinchingCanvas = React.useRef(false);
  const [isDraggingShape, setIsDraggingShape] = React.useState(false);
  const [bounds, setBounds] = React.useState({
    left: 0,
    right: STAGE_WIDTH,
    top: 0,
    bottom: STAGE_HEIGHT,
  });

  useGesture(
    {
      onDragStart: (options) => {
        const stage = stageRef.current;
        const stagePointerPosition = stage.getPointerPosition();

        const shape = stage.getIntersection({
          x: stagePointerPosition.x,
          y: stagePointerPosition.y,
        });

        if (shape && shape.id() === "frameRect") {
          setIsDraggingShape(false);
        } else {
          setIsDraggingShape(shape ? true : false);
        }
      },
      onDragEnd: (options) => {
        setIsDraggingShape(false);
      },
      onPinchStart: () => {
        const stage = stageRef.current;
        const stagePointerPosition = stage.getPointerPosition();

        const shape = stage.getIntersection({
          x: stagePointerPosition.x,
          y: stagePointerPosition.y,
        });

        if (shape && shape.id() === "frameRect") {
          isPinchingCanvas.current = true;
        } else {
          isPinchingCanvas.current = shape ? false : true;
        }
      },
      onDrag: (options) => {
        if (!isDraggingShape) {
          const stage = stageRef.current;

          stage.x(stage.x() + options.delta[0]);
          stage.y(stage.y() + options.delta[1]);
        }
      },
      onPinch: (options) => {
        if (isPinchingCanvas.current) {
          // Stage interaction
          const stage = stageRef.current;
          const result = calculatePinchingCanvas({
            stage: stageRef.current,
            gestureOptions: options,
          });
          stage.position(result.position);
          stage.scale({ x: result.scale, y: result.scale });
        }
      },
      onPinchEnd: () => {
        isPinchingCanvas.current = false;
      },
    },
    {
      target: stageRef,
      pinch: {
        scaleBounds: { max: 1.5, min: 0.5 },
        rubberband: true,
      },
    }
  );

  return (
    <div>
      <div
        ref={stageWrapperRef}
        style={{
          border: "1px solid #483D8B",
          touchAction: "none",
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}`,
        }}
      >
        <Stage ref={stageRef} width={STAGE_WIDTH} height={STAGE_HEIGHT}>
          <Layer>
            <Rect
              cornerRadius={12}
              id="frameRect"
              width={STAGE_WIDTH}
              height={STAGE_HEIGHT}
              stroke="black"
            />
          </Layer>
          <Layer>
            <RectNode stageWrapperRef={stageWrapperRef} />
            <RectNode
              stageWrapperRef={stageWrapperRef}
              initialX={150}
              initialY={150}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

const RectNode = ({ stageWrapperRef, initialX, initialY }) => {
  const ref = React.useRef(null);

  const [style, api] = useSpring(() => ({
    // from: { x: initialX || 100, y: initialY || 100 },
    // to: { x: initialX || 100, y: initialY || 100 },
    x: initialX || 100,
    y: initialY || 100,

    width: 100,
    height: 100,
    scale: { x: 1, y: 1 },
    rotation: 0,
    offsetX: 50,
    offsetY: 50,
    config: { ...config.wobbly },
    onChange: (e) => console.log(e.value),
  }));

  useGesture(
    {
      onDragStart: (option) => {
        // const shape = ref.current;
        // console.log("------- Shape X", shape.x());
        // api.start({
        //   x: shape.x(),
        //   y: shape.y(),
        //   reset: true,
        //   cancel: true,
        //   immediate: true,
        // });
      },
      onDrag: (options) => {
        const shape = ref.current;
        console.log("Shape X", shape.x());
        console.log("Style X", style.x.get());
        console.log("OFfset", options.offset);

        let x = options.offset[0];
        let y = options.offset[1];

        api.start({ x, y });
      },
      onPinch: (options) => {
        // api.start({
        //   scale: { x: options.offset[0], y: options.offset[0] },
        //   rotation: options.offset[1],
        // });
      },
    },
    {
      // https://use-gesture.netlify.app/docs/options/#pointercapture
      // https://use-gesture.netlify.app/docs/options/#pointertouch

      drag: {
        pointer: { capture: false, touch: true },
        bounds: { left: 0, right: STAGE_WIDTH, top: 0, bottom: STAGE_HEIGHT },
        rubberband: true,
      },
      pinch: {
        pointer: { touch: true, capture: false },
        scaleBounds: { min: 0.5, max: 2 },
        rubberband: true,
      },
      target: ref,
    }
  );

  return <animated.Rect ref={ref} {...style} fill="red" />;
};

function calculatePinchingCanvas({ stage, gestureOptions }) {
  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  const deltaX = gestureOptions.delta[0];

  const scaleBy = 1.01;
  // const newScale = deltaX > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  const newScale = gestureOptions.offset[0];

  var newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };

  return { position: newPos, scale: newScale };
}
