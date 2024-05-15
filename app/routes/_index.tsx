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
     <h1 className="text-xl font-bold text-red-500 underline">
      Hello world!
      </h1>
      <p>
        Welcome to your new <a href="https://remix.run">Remix</a> app.
        </p>
    </div>
  );
}
