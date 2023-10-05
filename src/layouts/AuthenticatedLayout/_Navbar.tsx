import { Box, DEFAULT_THEME, NavLink } from "@mantine/core";
import { IconFileSpreadsheet, IconUser, type Icon } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { type CSSProperties } from "react";

const defaultIconStyle: CSSProperties = {
  padding: 2,
  borderRadius: 4,
};

type TopLevelLink = {
  route?: string;
  label: string;
  icon?: Icon;
  children?: TopLevelLink[];
};

export const Navbar: React.FC = () => {
  const router = useRouter();
  const topLevelLinks: TopLevelLink[] = [
    {
      route: "/cms/book",
      label: "Books",
      icon: IconFileSpreadsheet,
    },
    {
      route: "/cms/author",
      label: "Authors",
      icon: IconFileSpreadsheet,
    },
    {
      label: "Master Data",
      children: [
        {
          label: "Users",
          icon: IconUser,
        },
      ],
    },
  ];

  return (
    <Box p={"md"}>
      {topLevelLinks.map((link) => (
        <NavLink
          key={link.label}
          active={link.route ? router.route.startsWith(link.route) : undefined}
          onClick={() => {
            if (link.route) void router.push(link.route);
          }}
          leftSection={
            link.icon && (
              <link.icon
                strokeWidth={1.5}
                style={{
                  ...defaultIconStyle,
                  backgroundColor: DEFAULT_THEME.colors.green[1],
                  color: DEFAULT_THEME.colors.green[5],
                }}
              />
            )
          }
          label={link.label}
          childrenOffset={28}
        >
          {link.children?.map((linkChild) => (
            <NavLink
              key={linkChild.label}
              label={linkChild.label}
              active={
                link.route ? router.route.startsWith(link.route) : undefined
              }
              onClick={() => {
                if (link.route) void router.push(link.route);
              }}
            />
          ))}
        </NavLink>
      ))}
    </Box>
  );
};
