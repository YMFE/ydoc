package com.mqunar.react.test.util;

import com.mqunar.react.init.QGlobalEnv;

/**
 * Created by wangtao.wang on 16/6/14.
 */
public class InitRn {
  public static void init(){
    QGlobalEnv.getInstance().setPid("10010");
//    QGlobalEnv.getInstance().setPid("66666");
//    QGlobalEnv.getInstance().setVid("60001001");
    QGlobalEnv.getInstance().setVid("60001138");

//    QReactNative.registerBizJSBundleLoader(new QReactNative.BizJSBundleLoader() {
//      @Override
//      public boolean OnBizBundleLoader(String hybridId, InitEnvironment initEnvironment, JSBundleLoaderListener jsBundleLoaderListener) {
//        jsBundleLoaderListener.onJSBundleLoaderSuccess(JSBundleLoader.createFileLoader(QGlobalEnv.getInstance().getContext(),"assets://bnbrn.bundle"));
//        DbUtil.log("OnBizBundleLoader: hybridid:"+hybridId+" initEnvironment:"+initEnvironment);
//        return true;
//      }
//    });
  }

}
