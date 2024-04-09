import ChangeLog, { changeLogMetaData } from "../_pages/change-log";
import CLI, { cliMetaData } from "../_pages/cli";
import Installation, { installationMetaData } from "../_pages/installation";
import Introduction, { introductionMetaData } from "../_pages/introduction";
import LazykitConfig, { lazykitConfigMetaData } from "../_pages/lazykit-config";

const PAGES_CONFIG = [
  {
    component: Introduction,
    path: "/docs/introduction",
    metaData: introductionMetaData,
  },
  {
    component: Installation,
    path: "/docs/installation",
    metaData: installationMetaData,
  },
  {
    component: LazykitConfig,
    path: "/docs/lazykit-config",
    metaData: lazykitConfigMetaData,
  },
  {
    component: CLI,
    path: "/docs/cli",
    metaData: cliMetaData,
  },
  {
    component: ChangeLog,
    path: "/docs/changelog",
    metaData: changeLogMetaData,
  },
];

export default PAGES_CONFIG;
