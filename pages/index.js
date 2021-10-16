import dynamic from "next/dynamic";

const AsyncDrawingTool = dynamic(
  () =>
    import("src/components/DrawingTool").then((module) => module.DrawingTool),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          padding: "20px",
          borderRadius: "6px",
          border: "1px solid #483D8B",
        }}
      >
        <AsyncDrawingTool />
      </div>
    </div>
  );
}
