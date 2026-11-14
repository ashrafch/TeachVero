import { permanentRedirect } from "next/navigation";
/** One canonical article location keeps edits and educational activities together. */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  permanentRedirect("/learn/" + (await params).slug);
}
