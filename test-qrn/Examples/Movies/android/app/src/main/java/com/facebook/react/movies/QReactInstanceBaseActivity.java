package com.facebook.react.movies;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.mqunar.react.QReactNative;
import com.mqunar.react.init.activity.QReactBaseActivity;


/**
 * Created by wangtao.wang on 16/3/8.
 * reactrootview开发者示例
 * 使用rootview同时继承QReactBaseActivity
 */
public class QReactInstanceBaseActivity extends QReactBaseActivity {

  private FrameLayout frameLayout;
  //  private String hybridid="test";
  private String hybridid = "test";
  //  private String module="DemoApp";
  private String module = "naive";
  private Bundle initProps;

  ProgressDialog progressDialog = null;


  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    frameLayout = new FrameLayout(this);
    setContentView(frameLayout);
    progressDialog = new ProgressDialog(this);
    progressDialog.show();

    initProps = new Bundle();
//    initProps.putString("view", "base");
    createReactContext();

  }

  private void createReactContext() {

    /**
     * 创建ReactRootView
     * 回调函数为js加载成功或者失败以及view渲染成功。
     * 如果js加载成功,在页面渲染完成的时候，会回调onViewShow().可以在里面隐藏自己的loading。
     */
    QReactNative.createRootViewUseBaseActivityWithListener(
      hybridid, module, initProps, this, new QReactNative.QReactInstanceEventListener() {
        @Override
        public void onJsLoadingSuccess(View view) {
          //ReactContext创建完成，js加载成功，返回ReactRootView.可以添加到自己的actiivty
          frameLayout.addView(view);
        }

        @Override
        public void onJsLoadingFailure() {
          //js加载失败，取消loading页。重试。
          progressDialog.dismiss();
        }

        @Override
        public void onViewShow() {
          //页面渲染完成，取消loading
          progressDialog.dismiss();

        }
      });
  }
}
