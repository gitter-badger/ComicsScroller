var Colors = require('material-ui').Styles.Colors;
var Spacing = require('material-ui').Styles.Spacing;
var ColorManipulator = require('material-ui').Utils.ColorManipulator;
var Extend = require('material-ui').Utils.Extend;

var Types = {
  LIGHT: require('./light-theme'),
  // DARK: require('./themes/dark-theme')
};

var ThemeManager = function() {
  return {
    types: Types,
    template: Types.LIGHT,

    spacing: Spacing,
    contentFontFamily: 'Roboto, sans-serif',

    palette: Types.LIGHT.getPalette(),
    component: Types.LIGHT.getComponentThemes(Types.LIGHT.getPalette()),

    getCurrentTheme: function() {
      return this;
    },

    // Component gets updated to reflect palette changes.
    setTheme: function(newTheme) {
      this.setPalette(newTheme.getPalette());
      this.setComponentThemes(newTheme.getComponentThemes(newTheme.getPalette()));
    },

    setPalette: function(newPalette) {
      this.palette = Extend(this.palette, newPalette);
      this.component = Extend(this.component, this.template.getComponentThemes(this.palette));
    },

    setComponentThemes: function(overrides) {
      this.component = Extend(this.component, overrides);
    }
  };
};

module.exports = ThemeManager;
