import { type NextPageWithLayout } from "@/layouts";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";

export const Page: NextPageWithLayout = () => {
  return <>My authenticated page</>;
};

Page.getLayout = AuthenticatedLayout;

export default Page;
