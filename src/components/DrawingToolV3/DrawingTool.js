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

const AnimatedStage = animated(Stage);

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
  const [stageScale, setStageScale] = React.useState(1);

  const [styles, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: { x: 1, y: 1 },
  }));

  React.useEffect(() => {
    const stage = stageRef.current;
  }, [stageScale, stageRef]);

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
          api.start({ x: options.offset[0] });
          api.start({ y: options.offset[1] });
          console.log(options.offset);
        }
      },
      onPinch: (options) => {
        if (isPinchingCanvas.current) {
          const result = calculatePinchingCanvas({
            stage: stageRef.current,
            gestureOptions: options,
          });

          setStageScale(result.scale);
          api.start({
            x: result.position.x,
            y: result.position.y,
            scale: { x: result.scale, y: result.scale },
          });
        }
      },
      onPinchEnd: () => {
        isPinchingCanvas.current = false;
      },
    },
    {
      target: stageRef,
      // transform: ([x, y]) => [x, y],
      drag: {
        bounds: { left: -50, top: -50, right: 0, bottom: 0 },
        rubberband: true,
        from: () => [styles.x.get(), styles.y.get()],
      },
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
        <AnimatedStage
          ref={stageRef}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          {...styles}
        >
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
            <RectNode
              stageScale={stageScale}
              stageWrapperRef={stageWrapperRef}
            />
            <RectNode
              stageScale={stageScale}
              stageWrapperRef={stageWrapperRef}
              initialX={250}
              initialY={250}
            />
          </Layer>
        </AnimatedStage>
      </div>
    </div>
  );
};

const RectNode = ({
  stageWrapperRef,
  initialX = 100,
  initialY = 100,
  stageScale,
}) => {
  const ref = React.useRef(null);

  const [style, api] = useSpring(() => ({
    x: initialX,
    y: initialY,
    width: 100,
    height: 100,
    scale: { x: 1, y: 1 },
    rotation: 0,
    offsetX: 50,
    offsetY: 50,
    config: { ...config.wobbly },
  }));

  useGesture(
    {
      onDrag: (options) => {
        console.log(stageScale);
        console.log(options.offset);
        api.start({ x: options.offset[0], y: options.offset[1] });
      },
      onPinch: (options) => {
        api.start({
          scale: { x: options.offset[0], y: options.offset[0] },
          rotation: options.offset[1],
        });
      },
    },
    {
      // https://use-gesture.netlify.app/docs/options/#pointercapture
      // https://use-gesture.netlify.app/docs/options/#pointertouch
      drag: {
        pointer: { capture: false, touch: true },
        bounds: { left: 0, right: STAGE_WIDTH, top: 0, bottom: STAGE_HEIGHT },
        rubberband: true,
        from: () => [style.x.get(), style.y.get()],
      },
      pinch: {
        pointer: { capture: false, touch: true },
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
