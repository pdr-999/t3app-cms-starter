import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Center,
  DEFAULT_THEME,
  Flex,
  Footer,
  Header,
  MediaQuery,
  Menu,
  NavLink,
  Navbar,
  Text,
  useMantineTheme,
  type MantineTheme,
} from "@mantine/core";
import {
  IconDatabase,
  IconFileSpreadsheet,
  IconPower,
  type Icon,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter, type NextRouter } from "next/router";
import { useState, type CSSProperties, type ReactElement } from "react";

const defaultIconStyle: CSSProperties = {
  padding: 2,
  borderRadius: 4,
};

type TopLevelLink = {
  route: string;
  label: string;
  icon: Icon;
};
const KarwasNavbar: React.FC<{
  theme: MantineTheme;
  router: NextRouter;
  isMasterDataActive: boolean;
  opened: boolean;
}> = ({ router, theme, isMasterDataActive, opened }) => {
  const topLevelLinks: TopLevelLink[] = [
    {
      route: "/cms/books",
      label: "Books",
      icon: IconFileSpreadsheet,
    },
    {
      route: "/book/authors",
      label: "Authors",
      icon: IconFileSpreadsheet,
    },
  ];

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ base: 256 - 32 }}
    >
      {topLevelLinks.map((link) => (
        <NavLink
          key={link.label}
          active={router.route.startsWith(link.route)}
          onClick={() => {
            void router.push(link.route);
          }}
          icon={
            <link.icon
              strokeWidth={1.5}
              style={{
                ...defaultIconStyle,
                backgroundColor: theme.colors.green[1],
                color: theme.colors.green[5],
              }}
            />
          }
          label={link.label}
        />
      ))}

      <NavLink
        active={isMasterDataActive}
        defaultOpened={true}
        label="Setup"
        icon={
          <IconDatabase
            strokeWidth={1.5}
            style={{
              ...defaultIconStyle,
              backgroundColor: theme.colors.grape[1],
              color: theme.colors.grape[5],
            }}
          />
        }
        childrenOffset={28}
      >
        <NavLink
          label="MAK"
          active={router.route.startsWith("/mak")}
          onClick={() => {
            void router.push("/mak");
          }}
        />
        <NavLink
          label="PPN"
          active={router.route.startsWith("/ppn")}
          onClick={() => {
            void router.push("/ppn");
          }}
        />
        <NavLink
          label="PPh"
          active={router.route.startsWith("/pph")}
          onClick={() => {
            void router.push("/pph");
          }}
        />
      </NavLink>
    </Navbar>
  );
};

// Refactor later, should use array of objects
export const AuthenticatedLayout: React.FC<ReactElement> = (page) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const session = useSession();

  const isMasterDataActive = false;
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <KarwasNavbar
          router={router}
          theme={theme}
          isMasterDataActive={isMasterDataActive}
          opened={opened}
        />
      }
      footer={
        <Footer height={42}>
          <Center h={"100%"}>
            <Text size={"sm"} color="gray">
              © 2023 Vultra Digital Asia
            </Text>
          </Center>
        </Footer>
      }
      header={
        <Header
          // -1 cuz of border
          height={{ base: 51 }}
          px="md"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>

          <Flex justify="space-between" align="center" w={"100%"} h={"100%"}>
            <Text>
              {/* <Image
                src={"/img/logo_kemenlu.png"}
                alt="Kementerian Luar Negeri"
                width="42"
                height="42"
              /> */}
              My T3 App
            </Text>
            <Flex align={"center"} gap={"xs"}>
              <Text color={DEFAULT_THEME.colors.dark[4]}>
                {session?.data?.user.name}
              </Text>
              <Menu shadow="md" width={200} withinPortal position="bottom-end">
                <Menu.Target>
                  <Button
                    w={42}
                    h={42}
                    variant="subtle"
                    p={0}
                    sx={{
                      ":hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Avatar
                      src={session.data?.user.image}
                      radius={"xl"}
                      sx={{ cursor: "pointer" }}
                      color="blue"
                    />
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  {/* <Menu.Label>Application</Menu.Label>
                  <Menu.Item icon={<IconSettings size={14} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Item icon={<IconMessageCircle size={14} />}>
                    Messages
                  </Menu.Item>
                  <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
                  <Menu.Item
                    icon={<IconSearch size={14} />}
                    rightSection={
                      <Text size="xs" color="dimmed">
                        ⌘K
                      </Text>
                    }
                  >
                    Search
                  </Menu.Item> */}

                  {/* <Menu.Divider /> */}

                  <Menu.Label>Akun</Menu.Label>
                  {/* <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
                    Transfer my data
                  </Menu.Item> */}
                  <Menu.Item
                    data-cy="logout-button"
                    onClick={(e) => {
                      e.preventDefault();

                      localStorage.removeItem("refresh-token");
                      signOut({
                        redirect: true,
                        callbackUrl: "/",
                      }).catch(() => {
                        // TODO: handle signout error
                      });
                    }}
                    color="red"
                    icon={<IconPower size={14} />}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </Flex>
        </Header>
      }
    >
      {page}
    </AppShell>
  );
};
