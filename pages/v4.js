import dynamic from "next/dynamic";
import { Layout } from "src/components/Layout";

const AsyncDrawingTool = dynamic(
  () =>
    import("src/components/DrawingToolV4").then((module) => module.DrawingTool),
  {
    ssr: false,
  }
);

export default function V4() {
  return (
    <Layout>
      <AsyncDrawingTool />
    </Layout>
  );
}
