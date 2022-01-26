import { Tedis } from "tedis";
import config from "../config";

const tedis = new Tedis({
  port: config?.tedis.port || 6379,
  host: config?.tedis.host || "127.0.0.1",
  password: config?.tedis.password || "kib20blxr21",
});

export default tedis;
