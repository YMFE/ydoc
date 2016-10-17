/**
 * 
 *  @providesModule Animated
 */
'use strict';
var AnimatedImplementation = require('./AnimatedImplementation')
var Text = require('Text')
var Image = require('Image')
var View = require('View')

module.exports = {
  ...AnimatedImplementation,
  View: AnimatedImplementation.createAnimatedComponent(View),
  Text: AnimatedImplementation.createAnimatedComponent(Text),
  Image: AnimatedImplementation.createAnimatedComponent(Image),
};
