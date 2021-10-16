import * as React from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import { Box } from "src/components/Box";
import { atom, useAtom } from "jotai";

export const DrawingTool = () => {
  const { currentTool } = useTools();
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = React.useCallback(
    (e) => {
      if (currentTool !== TOOLS.PEN && currentTool !== TOOLS.ERASER) {
        isDrawing.current = false;
        return;
      }
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      console.log("Tool:", currentTool);
      setLines([...lines, { tool: currentTool, points: [pos.x, pos.y] }]);
    },
    [currentTool, lines]
  );

  const handleMouseMove = React.useCallback(
    (e) => {
      // no drawing - skipping
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    },
    [lines]
  );

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

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
        <Stage
          width={500}
          height={500}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={line.tool === TOOLS.PEN ? 10 : 30}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === TOOLS.ERASER ? "destination-out" : "source-over"
                }
              />
            ))}
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
  const { currentTool, setCurrentTool } = useTools();

  return (
    <Box>
      Tools. Current Tool: [<b>{currentTool}</b>]
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
          onClick={() => setCurrentTool(TOOLS.STICKER)}
        >
          Sticker (lion)
        </Box>

        <Box marginTop="10px" />
        <Box
          preset={Box.toolButtonPreset}
          onClick={() => setCurrentTool(TOOLS.TEXT)}
        >
          Text
        </Box>
      </Box>
    </Box>
  );
};

const TOOLS = {
  POINTER: "pointer",
  PEN: "pen",
  ERASER: "eraser",
  STICKER: "sticker",
  TEXT: "text",
};

const toolAtom = atom(TOOLS.POINTER);
const useTools = () => {
  const [currentTool, setCurrentTool] = useAtom(toolAtom);

  return {
    currentTool,
    setCurrentTool,
  };
};

const LION_IMAGE_URL = "https://konvajs.org/assets/lion.png";
