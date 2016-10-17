package com.mqunar.react.test.androiddemo;

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
public class QRootViewActivity extends QReactBaseActivity {

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
//    initProps.putString("qInitView", "base");
    createReactContext();

  }

  private void createReactContext() {

    QReactNative.createRootViewUseBaseActivityWithListener(
      hybridid, module, initProps, this, new QReactNative.QReactInstanceEventListener() {
        @Override
        public void onJsLoadingSuccess(View view) {
          //使用view布局
          frameLayout.addView(view);
        }

        @Override
        public void onJsLoadingFailure() {
          //重试
          progressDialog.dismiss();
          Toast.makeText(QRootViewActivity.this, "bundle加载失败", Toast.LENGTH_SHORT);
        }

        @Override
        public void onViewShow() {
          //页面渲染完成，取消loading
          progressDialog.dismiss();

        }
      });
  }
}
