import dynamic from "next/dynamic";
import { Layout } from "src/components/Layout";

const AsyncDrawingTool = dynamic(
  () =>
    import("src/components/DrawingToolV3").then((module) => module.DrawingTool),
  {
    ssr: false,
  }
);

export default function V3() {
  return (
    <Layout>
      <AsyncDrawingTool />
    </Layout>
  );
}
