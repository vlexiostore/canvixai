import MarketingLayout from "@/app/(marketing)/layout";
import HomePage from "@/components/home/HomePage";

/**
 * Root route (/) — ensures the Canvix landing always renders on Vercel.
 * Uses the same marketing layout (navbar, footer) as other marketing pages.
 */
export default function RootPage() {
  return (
    <MarketingLayout>
      <HomePage />
    </MarketingLayout>
  );
}
