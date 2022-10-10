/* ******************************************************************************
 * Classification: UNCLASSIFIED
 ***************************************************************************** */

module.exports = (api) => {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 65,
          ie: 10,
          firefox: 45,
        },
        debug: false,
        shippedProposals: true,
        forceAllTransforms: true,
        useBuiltIns: "usage",
      },
    ],
    "@babel/preset-react",
  ];
  const plugins = [
    [
      "transform-imports",
      {
        "react-bootstrap": {
          transform: "react-bootstrap/esm/${member}",
          preventFullImport: true,
        },
        "core-js": {
          transform: "core-js/lib/${member}",
          preventFullImport: true,
        },
      },
    ],
    "lodash",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
  ];
  return {
    presets,
    plugins,
  };
};
