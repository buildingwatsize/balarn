const {
  override,
  fixBabelImports,
  addLessLoader
} = require('customize-cra');

module.exports = override(
  fixBabelImports("antd", {
    libraryDirectory: "es",
    style: true
  }),
  fixBabelImports("lodash", {
    libraryDirectory: "",
    camel2DashComponentName: false
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#729B79', // primary color for all components
      '@link-color': '#729B79', // link color
      '@success-color': '#52c41a', // success state color
      '@warning-color': '#faad14', // warning state color
      '@error-color': '#f5222d', // error state color
      '@font-size-base': '14px', // major text font size
      '@heading-color': '#333333', // heading text color
      '@text-color': '#444444', // major text color
      '@text-color-secondary': '#555555', // secondary text color
      '@disabled-color': '#666666', // disable state color
      '@border-radius-base': '4px', // major border radius
      '@border-color-base': '#d9d9d9', // major border color
      '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // major shadow for layers
    },
  }),
);