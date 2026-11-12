import Image from "next/image";
export function ItalianScene() {
  return (
    <Image
      className="italian-scene"
      src="/italian-scene.svg"
      alt="Illustration of a sunlit Italian doorway, an espresso and an olive branch"
      width={600}
      height={600}
      priority
      unoptimized
    />
  );
}
