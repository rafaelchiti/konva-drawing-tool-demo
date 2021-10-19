import { Box } from "src/components/Box";
import Link from "next/link";

export const Layout = ({ children }) => {
  return (
    <Box padding="20px">
      <Box preset={Box.toolButtonPreset}>
        <Link href="/v1">
          <a>V1 - Basic Demo</a>
        </Link>
      </Box>
      <Box preset={Box.toolButtonPreset}>
        <Link href="/v2">
          <a>V2 - Object useGesture</a>
        </Link>
      </Box>
      <Box preset={Box.toolButtonPreset}>
        <Link href="/v3">
          <a>V3</a>
        </Link>
      </Box>

      <Box marginTop="10px" />

      <div
        style={{
          padding: "20px",
          borderRadius: "6px",
          border: "1px solid #483D8B",
        }}
      >
        {children}
      </div>
    </Box>
  );
};
