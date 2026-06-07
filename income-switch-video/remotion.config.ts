import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// H.264 MP4 is the safest format for YouTube/Loom (which Skool embeds from).
Config.setCodec("h264");
