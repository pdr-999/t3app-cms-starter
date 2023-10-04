import { type NextPageWithLayout } from "@/layouts";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";

export const Page: NextPageWithLayout = () => {
  return <>Books Page</>;
};

Page.getLayout = AuthenticatedLayout;

export default Page;
