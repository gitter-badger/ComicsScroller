var React = require('react');
var CssEvent = require('material-ui').Utils.CssEvent;
var Dom = require('material-ui').Utils.Dom;
var KeyLine = require('material-ui').Utils.KeyLine;
// var Classable = require('material-ui').Mixins.Classable;
var StylePropable = require('material-ui').Mixins.StylePropable;
var Transitions = require('material-ui').Styles.Transitions;
var ClickAwayable = require('material-ui').Mixins.ClickAwayable;
var Paper = require('material-ui').Paper;
var MenuItem = require('./menu-item.jsx');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
// var LinkMenuItem = require('./link-menu-item');
// var SubheaderMenuItem = require('./subheader-menu-item');

/***********************
* Nested Menu Component
***********************/
var NestedMenuItem = React.createClass({

  mixins: [PureRenderMixin,StylePropable, ClickAwayable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    index: React.PropTypes.number.isRequired,
    text: React.PropTypes.string,
    menuItems: React.PropTypes.array.isRequired,
    zDepth: React.PropTypes.number,
    disabled: React.PropTypes.bool,
    onItemClick: React.PropTypes.func,
    onItemTap: React.PropTypes.func,
    menuItemStyle: React.PropTypes.object
  },
  
  getDefaultProps: function() {
    return {
      disabled: false
    };
  },

  getInitialState: function() {
    return { open: false }
  },

  componentClickAway: function() {
    this._closeNestedMenu();
  },

  componentDidMount: function() {
    this._positionNestedMenu();
  },

  componentDidUpdate: function(prevProps, prevState) {
    this._positionNestedMenu();
  },

  getSpacing: function() {
    return this.context.muiTheme.spacing;
  },

  render: function() {
    var styles = this.mergeAndPrefix({
      position: 'relative'
    }, this.props.style);

    var iconCustomArrowDropRight = {
      marginRight: this.getSpacing().desktopGutterMini * -1,
      color: this.context.muiTheme.component.dropDownMenu.accentColor
    };

    var {
      index,
      menuItemStyle,
      ...other
    } = this.props;

    return (
      <div ref="root" style={styles} onMouseEnter={this._openNestedMenu} onMouseLeave={this._closeNestedMenu}>
        <MenuItem 
          index={index}
          style={menuItemStyle}
          disabled={this.props.disabled} 
          iconRightStyle={iconCustomArrowDropRight} 
          iconRightClassName="muidocs-icon-custom-arrow-drop-right" 
          onClick={this._onParentItemClick}>
            {this.props.text}
        </MenuItem>
        <Menu {...other}
          ref="nestedMenu"
          menuItems={this.props.menuItems}
          onItemClick={this._onMenuItemClick}
          onItemTap={this._onMenuItemTap}
          hideable={true}
          visible={this.state.open}
          zDepth={this.props.zDepth + 1} />
      </div>
    );
  },

  _positionNestedMenu: function() {
    var el = React.findDOMNode(this);
    var nestedMenu = React.findDOMNode(this.refs.nestedMenu);

    nestedMenu.style.left = el.offsetWidth + 'px';
  },
  
  _openNestedMenu: function() {
    if (!this.props.disabled) this.setState({ open: true });
  },
  
  _closeNestedMenu: function() {
    this.setState({ open: false });
  },
  
  _toggleNestedMenu: function() {
    if (!this.props.disabled) this.setState({ open: !this.state.open });
  },

  _onParentItemClick: function() {
    this._toggleNestedMenu();
  },

  _onMenuItemClick: function(e, index, menuItem) {
    if (this.props.onItemClick) this.props.onItemClick(e, index, menuItem);
    this._closeNestedMenu();
  },
  
  _onMenuItemTap: function(e, index, menuItem) {
    if (this.props.onItemTap) this.props.onItemTap(e, index, menuItem);
    this._closeNestedMenu();
  }
});


/****************
* Menu Component
****************/
var Menu = React.createClass({

  mixins: [PureRenderMixin,StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    autoWidth: React.PropTypes.bool,
    onItemTap: React.PropTypes.func,
    onItemClick: React.PropTypes.func,
    onToggleClick: React.PropTypes.func,
    menuItems: React.PropTypes.object.isRequired,
    selectedIndex: React.PropTypes.number,
    hideable: React.PropTypes.bool,
    visible: React.PropTypes.bool,
    zDepth: React.PropTypes.number,
    menuItemStyle: React.PropTypes.object,
    menuItemStyleSubheader: React.PropTypes.object,
    menuItemStyleLink: React.PropTypes.object,
    menuItemClassName: React.PropTypes.string,
    menuItemClassNameSubheader: React.PropTypes.string,
    menuItemClassNameLink: React.PropTypes.string,
  },

  getInitialState: function() {
    return { nestedMenuShown: false }
  },

  getDefaultProps: function() {
    return {
      autoWidth: true,
      hideable: false,
      visible: true,
      zDepth: 1
    };
  },

  componentDidMount: function() {
    var el = this.getDOMNode();

    //Set the menu with
    this._setKeyWidth(el);

    //Save the initial menu height for later
    this._initialMenuHeight = el.offsetHeight + KeyLine.Desktop.GUTTER_LESS;

    //Show or Hide the menu according to visibility
    this._renderVisibility();
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.visible !== prevProps.visible) this._renderVisibility();
    // console.log("Update menu",this.props.menuItems);
  },

  getTheme: function() {
    return this.context.muiTheme.component.menu
  },

  getSpacing: function() {
    return this.context.muiTheme.spacing;
  },

  getStyles: function() {
    var styles = {
      root: {
        backgroundColor: this.getTheme().containerBackgroundColor,
        paddingTop: this.getSpacing().desktopGutterMini,
        paddingBottom: this.getSpacing().desktopGutterMini,
        transition: Transitions.easeOut(null, 'height')
      },
      subheader: {
        paddingLeft: this.context.muiTheme.component.menuSubheader.padding,
        paddingRight: this.context.muiTheme.component.menuSubheader.padding
      },
      hideable: {
        opacity: (this.props.visible) ? 1 : 0,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        zIndex: 1
      }
    };
    return styles;
  },

  render: function() {
    var styles = this.getStyles();
    return (
      <Paper 
        ref="paperContainer" 
        zDepth={this.props.zDepth} 
        style={this.mergeAndPrefix(
          styles.root,
          this.props.hideable && styles.hideable,
          this.props.style)}>
        {this._getChildren()}
      </Paper>
    );
  },

  _getChildren: function() {
    var children = [],
      menuItem,
      itemComponent,
      isSelected,
      isDisabled,
      isMarked;
    //This array is used to keep track of all nested menu refs
    var styles = this.getStyles();

    this._nestedChildren = [];
    // console.log("test",this.props.menuItems);
    for (var i=0; i < this.props.menuItems.size; i++) {
      menuItem = this.props.menuItems.get(i);
      isSelected = i === this.props.selectedIndex;
      isDisabled = (menuItem.get('disabled') === undefined) ? false : menuItem.get('disabled');
      isMarked = (menuItem.get('isMarked') === undefined) ? false :menuItem.get('isMarked');
      var {
        icon,
        data,
        attribute,
        number,
        toggle,
        onClick,
        ...other
      } = menuItem;

      switch (menuItem.type) {

        // case MenuItem.Types.LINK:
        //   itemComponent = (
        //     <LinkMenuItem 
        //       key={i}
        //       index={i}
        //       payload={menuItem.payload}
        //       target={menuItem.target}
        //       text={menuItem.text}
        //       disabled={isDisabled} />
        //   );
        //   break;

        // case MenuItem.Types.SUBHEADER:
        //   itemComponent = (
        //     <SubheaderMenuItem 
        //       key={i}
        //       index={i}
        //       text={menuItem.text} />
        //   );
        //   break;

        // case MenuItem.Types.NESTED:
        //   itemComponent = (
        //     <NestedMenuItem
        //       ref={i}
        //       key={i}
        //       index={i}
        //       text={menuItem.text}
        //       disabled={isDisabled}
        //       menuItems={menuItem.items}
        //       zDepth={this.props.zDepth}
        //       onItemClick={this._onNestedItemClick}
        //       onItemTap={this._onNestedItemClick} />
        //   );
        //   this._nestedChildren.push(i);
        //   break;

        default:
          itemComponent = (
            <MenuItem
              {...other}
              selected={isSelected}
              key={i}
              index={i}
              icon={menuItem.get('icon')}
              data={menuItem.get('data')}
              className={this.props.menuItemClassName}
              style={this.props.menuItemStyle}
              attribute={menuItem.get('attribute')}
              number={menuItem.get('number')}
              toggle={menuItem.get('toggle')}
              onToggle={this.props.onToggle}
              disabled={isDisabled}
              isMarked={isMarked}
              onClick={this._onItemClick}
              onTouchTap={this._onItemTap}>
              {menuItem.get('text')}
            </MenuItem>
          );
      }
      children.push(itemComponent);
    }

    return children;
  },

  _setKeyWidth: function(el) {
    var menuWidth = this.props.autoWidth ?
      KeyLine.getIncrementalDim(el.offsetWidth) + 'px' :
      '100%';

    //Update the menu width
    Dom.withoutTransition(el, function() {
      el.style.width = menuWidth;
    });
  },

  _renderVisibility: function() {
    var el;

    if (this.props.hideable) {
      el = React.findDOMNode(this);
      var container = React.findDOMNode(this.refs.paperContainer);
      
      if (this.props.visible) {

        //Open the menu
        el.style.transition = Transitions.easeOut();
        el.style.height = this._initialMenuHeight + 'px';

        //Set the overflow to visible after the animation is done so
        //that other nested menus can be shown
        CssEvent.onTransitionEnd(el, function() {
          //Make sure the menu is open before setting the overflow.
          //This is to accout for fast clicks
          if (this.props.visible) container.style.overflow = 'visible';
        }.bind(this));

      } else {

        //Close the menu
        el.style.height = '0px';

        //Set the overflow to hidden so that animation works properly
        container.style.overflow = 'hidden';
      }
    }
  },

  _onNestedItemClick: function(e, index, menuItem) {
    if (this.props.onItemClick) this.props.onItemClick(e, index, menuItem);
  },

  _onNestedItemTap: function(e, index, menuItem) {
    if (this.props.onItemTap) this.props.onItemTap(e, index, menuItem);
  },

  _onItemClick: function(e, index) {
    if (this.props.onItemClick) this.props.onItemClick(e, index, this.props.menuItems.get('index'));
  },

  _onItemTap: function(e, index) {
    if (this.props.onItemTap) this.props.onItemTap(e, index, this.props.menuItems.get('index'));
  },

  _onItemToggle: function(e, index, toggled) {
    if (this.props.onItemToggle) this.props.onItemToggle(e, index, this.props.menuItems.get('index'), toggled);
  }

});

module.exports = Menu;
