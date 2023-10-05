import {
  Avatar,
  Burger,
  Button,
  DEFAULT_THEME,
  Flex,
  Menu,
  Text,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";

type HeaderProps = {
  onMenuToggle: () => void;
  opened: boolean;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const session = useSession();

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        w={"100%"}
        h={"100%"}
        px={"md"}
      >
        <Flex align={"center"}>
          <Burger
            hiddenFrom="md"
            opened={props.opened}
            onClick={props.onMenuToggle}
            size="sm"
            color={DEFAULT_THEME.colors.gray[6]}
            mr="md"
          />
          <Text>My T3 App</Text>
        </Flex>

        <Flex align={"center"} gap={"xs"}>
          <Text c={DEFAULT_THEME.colors.dark[4]}>
            {session?.data?.user.name}
          </Text>
          <Menu shadow="md" width={200} withinPortal position="bottom-end">
            <Menu.Target>
              <Button w={42} h={42} variant="subtle" p={0}>
                <Avatar
                  src={session.data?.user.image}
                  radius={"xl"}
                  color="blue"
                />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Akun</Menu.Label>
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
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Flex>
    </>
  );
};
