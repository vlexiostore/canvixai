import CreativeStudioPage from "@/components/tools/CreativeStudio";

export default function StudioPage() {
  const user = {
    name: "Guest User",
    credits: { total: 500, used: 0 },
  };

  return <CreativeStudioPage user={user} />;
}
