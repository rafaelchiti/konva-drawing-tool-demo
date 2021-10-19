import dynamic from "next/dynamic";
import { Layout } from "src/components/Layout";

const AsyncDrawingTool = dynamic(
  () =>
    import("src/components/DrawingToolV5").then((module) => module.DrawingTool),
  {
    ssr: false,
  }
);

export default function V5() {
  return (
    <Layout>
      <AsyncDrawingTool />
    </Layout>
  );
}
