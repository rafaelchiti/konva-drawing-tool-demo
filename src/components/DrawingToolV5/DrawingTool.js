import * as React from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useDrag, useGesture } from "@use-gesture/react";
import { animated, useSpring, config } from "@react-spring/web";

window.Konva.hitOnDragEnabled = true;
window.Konva.captureTouchEventsEnabled = true;

const STAGE_WIDTH = 500;
const STAGE_HEIGHT = 350;

export const DrawingTool = () => {
  const [style, api] = useSpring(() => ({
    x: 50,
    y: 50,
    config: { ...config.wobbly },
  }));

  const bind = useDrag(
    (options) => {
      const {
        down,
        movement: [mx, my],
        offset,
      } = options;
      api.start({ x: offset[0], y: offset[1] });
    },
    { from: () => [50, 50] }
  );

  return (
    <div>
      <div>Simple drag on dom node</div>
      <div
        style={{
          border: "1px solid #483D8B",
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}px`,
        }}
      >
        <animated.div
          {...bind()}
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "red",
            x: style.x,
            y: style.y,
          }}
        ></animated.div>
      </div>
    </div>
  );
};
