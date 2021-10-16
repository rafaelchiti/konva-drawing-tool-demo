import { Stage, Layer, Rect, Circle } from "react-konva";
import * as React from "react";
import { Box } from "src/components/Box";

export const DrawingTool = () => {
  const [currentTool, setCurrentTool] = React.useState(TOOLS.POINTER);
  // Stage - is a div wrapper
  // Layer - is an actual 2d canvas element, so you can have several layers inside the stage
  // Rect and Circle are not DOM elements. They are 2d shapes on canvas
  return (
    <Box display="flex">
      <Box
        name="CanvasWrapper"
        border="1px solid #483D8B"
        width="500px"
        height="500px"
      >
        <Stage width={500} height={500}>
          <Layer>
            <Rect width={50} height={50} fill="red" />
            <Circle x={200} y={200} stroke="black" radius={50} />
          </Layer>
        </Stage>
      </Box>

      <Box paddingLeft="10px">
        <ToolsPanel />
      </Box>
    </Box>
  );
};

const ToolsPanel = () => {
  const { currentTool, setCurrentTool } = useToolsHelper();

  return (
    <Box>
      Tools
      <Box marginTop="10px" />
      <Box>
        <Box
          preset={Box.toolButtonPreset}
          onClick={() => setCurrentTool(TOOLS.PEN)}
        >
          Pen
        </Box>
        <Box marginTop="10px" />
        <Box
          preset={Box.toolButtonPreset}
          onClick={() => setCurrentTool(TOOLS.ERASER)}
        >
          Eraser
        </Box>
        <Box marginTop="10px" />
        <Box
          preset={Box.toolButtonPreset}
          onClick={() => setCurrentTool(TOOLS.POINTER)}
        >
          Pointer
        </Box>
        <Box marginTop="10px" />
        <Box
          preset={Box.toolButtonPreset}
          onClick={() => setCurrentTool(TOOLS.POINTER)}
        >
          Sticker (lion)
        </Box>
      </Box>
    </Box>
  );
};

const useToolsHelper = () => {
  const [currentTool, setCurrentTool] = React.useState(TOOLS.POINTER);

  return {
    currentTool,
    setCurrentTool,
  };
};

const LION_IMAGE_URL = "https://konvajs.org/assets/lion.png";

const TOOLS = {
  POINTER: "pointer",
  PEN: "pen",
  ERASER: "eraser",
};
