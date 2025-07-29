import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

export function PageLinksHeader({ children, heading, links }) {
  return (
    <CustomBreadcrumbs
      heading={heading}
      links={links}
      action={children}
      sx={{ mb: { xs: 3, md: 5 } }}
  />
  );
}