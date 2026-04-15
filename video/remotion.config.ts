import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(6);
Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      extensions: [...(config.resolve?.extensions ?? []), ".ts", ".tsx"],
    },
  };
});
