import { createFileRoute } from "@tanstack/react-router";

import Logo from "@/assets/logo.svg";
import { useAppStore } from "@/store";
import {
  Image,
  makeStyles,
  typographyStyles,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  appName: typographyStyles.title2,
  version: typographyStyles.body1,
});

const About = () => {
  const styles = useStyles();

  const version = useAppStore((state) => state.version);

  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <Image src={Logo} className="size-28" />
      <div className="flex gap-2">
        <span className={styles.appName}>NexPict 奈图</span>
        <span className={styles.version}>v{version}</span>
      </div>
      <div className="mt-20">
        <span>Copyright © 2025 by 暮冬拾柒. All Rights Reserved</span>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_layout/about/")({
  component: About,
});
