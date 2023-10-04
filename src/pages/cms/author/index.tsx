import { type NextPageWithLayout } from "@/layouts";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";

export const Page: NextPageWithLayout = () => {
  return <>Author Page</>;
};

Page.getLayout = AuthenticatedLayout;

export default Page;
