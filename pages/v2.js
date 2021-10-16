import dynamic from "next/dynamic";
import { Layout } from "src/components/Layout";

const AsyncDrawingTool = dynamic(
  () =>
    import("src/components/DrawingToolV2").then((module) => module.DrawingTool),
  {
    ssr: false,
  }
);

export default function V1() {
  return (
    <Layout>
      <AsyncDrawingTool />
    </Layout>
  );
}
