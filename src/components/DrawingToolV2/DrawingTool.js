import * as React from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Text,
  Image,
  Transformer,
} from "react-konva";
import { Box } from "src/components/Box";
import { atom, useAtom } from "jotai";
import {
  useDrag,
  createUseGesture,
  dragAction,
  pinchAction,
  useGesture,
} from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/konva";

// const useGesture = createUseGesture([dragAction, pinchAction]);

export const DrawingTool = () => {
  return (
    <Box>
      V2 - Object useGesture
      <Box display="flex">
        <Box
          name="CanvasWrapper"
          border="1px solid #483D8B"
          width="500px"
          height="500px"
        >
          <Stage width={500} height={500}>
            <Layer>
              <RectNode />
            </Layer>
          </Stage>
        </Box>
      </Box>
    </Box>
  );
};

const RectNode = () => {
  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    scale: { x: 1, y: 1 },
  }));

  const ref = React.useRef(null);

  useGesture(
    {
      onDrag: (options) => {
        if (options.pinching) return cancel();
        api.start({ x: options.offset[0], y: options.offset[1] });
      },
      onPinch: (options) => {
        api.start({ scale: { x: options.offset[0], y: options.offset[0] } });
      },
    },
    {
      target: ref,
    }
  );

  return <animated.Rect ref={ref} {...style} fill="green" />;
};
