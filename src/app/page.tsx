import { caller } from "@/trpc/server";

export default async function Home() {
  const data = await caller.hello({ text: "test" });

  return (
    <div>
      <h1>Hello World</h1>
      <p>{data?.greeting}</p>
    </div>
  );
}
