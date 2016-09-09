/**
 * @providesModule QHybridIdRegistry
 */

'use strict';

var HybridIdRegistry = {
  hybridId: null,

  setHybridId: function(id: string) {
    HybridIdRegistry.hybridId = id;
  }
};

module.exports = HybridIdRegistry;
