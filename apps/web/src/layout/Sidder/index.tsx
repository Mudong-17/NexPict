import { Image } from "@fluentui/react-components";
import {
  AppItem,
  NavDrawer,
  NavDrawerBody,
  NavItem,
  NavSectionHeader,
} from "@fluentui/react-nav-preview";

import {
  Album20Filled,
  Album20Regular,
  bundleIcon,
  CloudArrowUp20Filled,
  CloudArrowUp20Regular,
  Info20Filled,
  Info20Regular,
  PuzzlePiece20Filled,
  PuzzlePiece20Regular,
} from "@fluentui/react-icons";

import Logo from "@/assets/logo.svg";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const Upload = bundleIcon(CloudArrowUp20Filled, CloudArrowUp20Regular);
const Album = bundleIcon(Album20Filled, Album20Regular);
const Puzzle = bundleIcon(PuzzlePiece20Filled, PuzzlePiece20Regular);
const Info = bundleIcon(Info20Filled, Info20Regular);
// const Bug = bundleIcon(Bug20Filled, Bug20Regular);

export const Sidder = ({ isOpen }) => {
  const { pathname } = useLocation();

  const [selectedValue, setSelectedValue] = useState(pathname);
  const navigate = useNavigate();

  const onNavItemSelect = (_, data) => {
    setSelectedValue(data.value);
    navigate({
      to: data.value,
    });
  };

  return (
    <NavDrawer
      className="!w-48"
      open={isOpen}
      type="inline"
      selectedValue={selectedValue}
      onNavItemSelect={onNavItemSelect}
    >
      <NavDrawerBody>
        <AppItem icon={<Image src={Logo} className="size-10" />}>
          NexPict 奈图
        </AppItem>
        <NavItem icon={<Upload />} value="/upload">
          上传图片
        </NavItem>
        <NavItem icon={<Album />} value="/album">
          图册管理
        </NavItem>
        <NavItem icon={<Puzzle />} value="/plugin">
          图床中心
        </NavItem>

        <NavSectionHeader>信息</NavSectionHeader>
        {/* <NavItem icon={<Bug />} value="/logs">
          流程日志
        </NavItem> */}
        <NavItem icon={<Info />} value="/about">
          关于奈图
        </NavItem>
      </NavDrawerBody>
    </NavDrawer>
  );
};
