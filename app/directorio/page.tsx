import { DirectoryHome } from "@/components/module-1/directory-home";

export const revalidate = 86400;

export default function DirectoryPage() {
  return <DirectoryHome backLink={{ href: "/", label: "Volver al inicio" }} />;
}
