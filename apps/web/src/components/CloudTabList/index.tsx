import {
  Button,
  Menu,
  MenuItem,
  MenuItemProps,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Overflow,
  OverflowItem,
  Tab,
  TabList,
  makeStyles,
  mergeClasses,
  tokens,
  useIsOverflowItemVisible,
  useOverflowMenu,
} from '@fluentui/react-components';
import { MoreHorizontalFilled, MoreHorizontalRegular, bundleIcon } from '@fluentui/react-icons';

const MoreHorizontal = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);

export type CloudTab = {
  label: string;
  value: string;
};

type OverflowMenuItemProps = {
  tab: CloudTab;
  onClick: MenuItemProps['onClick'];
};

const OverflowMenuItem = (props: OverflowMenuItemProps) => {
  const { tab, onClick } = props;
  const isVisible = useIsOverflowItemVisible(tab.value);

  if (isVisible) {
    return null;
  }

  return (
    <MenuItem key={tab.value} onClick={onClick}>
      <div>{tab.label}</div>
    </MenuItem>
  );
};

const useOverflowMenuStyles = makeStyles({
  menu: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  menuButton: {
    alignSelf: 'center',
  },
});

type OverflowMenuProps = {
  onTabSelect?: (tabId: string) => void;
} & Omit<CloudTabListProps, 'selected' | 'onChange'>;

const OverflowMenu = (props: OverflowMenuProps) => {
  const { tabs, onTabSelect } = props;
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();

  const styles = useOverflowMenuStyles();

  const onItemClick = (tabId: string) => {
    onTabSelect?.(tabId);
  };

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="transparent"
          className={styles.menuButton}
          ref={ref}
          icon={<MoreHorizontal />}
          aria-label={`${overflowCount} more tabs`}
          role="tab"
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList className={styles.menu}>
          {tabs.map((tab) => (
            <OverflowMenuItem key={tab.value} tab={tab} onClick={() => onItemClick(tab.value)} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

const useTablistStyles = makeStyles({
  tablist: {
    flexShrink: 0,
    overflow: 'hidden',
    padding: '5px',
    zIndex: 0,
  },
  horizontal: {
    height: 'fit-content',
  },
});

type CloudTabListProps = {
  tabs: CloudTab[];
  selected: string;
  onChange?: (tabId: string) => void;
};

export const CloudTabList = (props: CloudTabListProps) => {
  const { tabs, selected, onChange } = props;

  const styles = useTablistStyles();

  const onTabSelect = (tabId: string) => {
    onChange?.(tabId);
  };

  return (
    <div className={mergeClasses(styles.tablist, styles.horizontal)}>
      <Overflow minimumVisible={2}>
        <TabList selectedValue={selected} onTabSelect={(_, d) => onTabSelect(d.value as string)}>
          {tabs.map((tab) => {
            return (
              <OverflowItem key={tab.value} id={tab.value} priority={tab.value === selected ? 2 : 1}>
                <Tab value={tab.value}>{tab.label}</Tab>
              </OverflowItem>
            );
          })}
          <OverflowMenu tabs={tabs} onTabSelect={onTabSelect} />
        </TabList>
      </Overflow>
    </div>
  );
};
