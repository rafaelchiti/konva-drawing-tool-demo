import * as React from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useGesture } from "@use-gesture/react";
import { animated, useSpring, config } from "@react-spring/konva";

window.Konva.hitOnDragEnabled = true;
window.Konva.captureTouchEventsEnabled = true;

const STAGE_WIDTH = 500;
const STAGE_HEIGHT = 350;

export const DrawingTool = () => {
  return (
    <div>
      <div>Issue with offset of dragging node in Konva</div>
      <div
        style={{
          border: "1px solid #483D8B",
          touchAction: "none",
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}px`,
        }}
      >
        <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
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
            <RectNode />
            {/* <RectNode initialX={150} initialY={150} /> */}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

const RectNode = ({ stageWrapperRef, initialX, initialY }) => {
  const ref = React.useRef(null);

  const [style, api] = useSpring(() => ({
    x: 100,
    y: 100,
    config: { ...config.wobbly },
  }));

  const bind = useGesture(
    {
      onDrag: (options) => {
        const shape = ref.current;

        let x = options.offset[0];
        let y = options.offset[1];

        api.start({ x, y });
      },
    },
    {
      // https://use-gesture.netlify.app/docs/options/#pointercapture
      // https://use-gesture.netlify.app/docs/options/#pointertouch

      drag: {
        pointer: { capture: false /*, touch: true*/ },
      },
      // pinch: {
      //   pointer: { touch: true, capture: false },
      //   scaleBounds: { min: 0.5, max: 2 },
      //   rubberband: true,
      // },
      // target: ref,
    }
  );

  const newBind = () => {
    const bindings = bind();
    const newBindings = {};
    Object.keys(bindings).forEach((eventName) => {
      newBindings[eventName] = (konvaEvent) =>
        bindings[eventName](konvaEvent.evt);
    });

    return newBindings;
  };

  return (
    <animated.Rect
      {...newBind()}
      {...style}
      width={100}
      height={100}
      fill="red"
    />
  );
};
