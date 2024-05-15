import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
     <h1 className="text-3xl font-bold underline">
      Hello world!
      </h1>
      <h2 className="text-2xl font-bold">
        development environment
      </h2>
    </div>
  );
}
