/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule LayoutAnimation
 * 空实现
 */
'use strict';


function configureNext(){
  console.log('尚不支持')
}
var Presets = {
  easeInEaseOut: undefined,
  linear:undefined,
  spring: undefined,
};

module.exports = {
  configureNext,
  create:function(){
    console.log('尚不支持')
  },
  Types:function(){
    console.log('尚不支持')
  },
  Properties:function(){
    console.log('尚不支持')
  },
  configChecker:function(){
    console.log('尚不支持')
  },
  Presets,
  easeInEaseOut: configureNext.bind(),
  linear: configureNext.bind(),
  spring: configureNext.bind(),
}
