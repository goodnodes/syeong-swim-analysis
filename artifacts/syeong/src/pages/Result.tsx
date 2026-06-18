import { Layout } from "@/components/Layout";
import { ClassResultView } from "@/components/ClassResultView";
import { classResult } from "@/data/classMock";
import { useLocation } from "wouter";

export default function Result() {
  const [, setLocation] = useLocation();
  return (
    <Layout>
      <ClassResultView result={classResult} onHome={() => setLocation("/")} />
    </Layout>
  );
}
