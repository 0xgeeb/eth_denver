import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: `${__dirname}/src/ens-package.js`,
  output: {
    dir: "dist",
    format: "umd",
    name: "namehash",
  },
  plugins: [commonjs(), nodeResolve({ browser: true })],
};
