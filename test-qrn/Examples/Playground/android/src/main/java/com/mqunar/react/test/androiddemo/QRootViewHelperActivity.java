package com.mqunar.react.test.androiddemo;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.mqunar.react.QRnActivityHelper;
import com.mqunar.react.QReactNative;

/**
 * 使用rootview但是不继承QReactBaseActivity的demo
 * 需要使用QRnActivityHelper同步一些acitivity的事件。必须同步这些事件。。。。。
 */
public class QRootViewHelperActivity extends Activity implements DefaultHardwareBackBtnHandler {
  private FrameLayout frameLayout;
  //  private String hybridid="test";
  private String hybridid = "test";
  //  private String module="DemoApp";
  private String module = "naive";
  private Bundle initProps;
  private QRnActivityHelper qRnActivityHelper;

  ProgressDialog progressDialog = null;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    frameLayout = new FrameLayout(this);
    setContentView(frameLayout);
    progressDialog = new ProgressDialog(this);
    progressDialog.show();

    qRnActivityHelper = new QRnActivityHelper();

    initProps = new Bundle();
//    initProps.putString("qInitView", "base");

    createReactContext();
  }

  private void createReactContext() {
    QReactNative.createRootViewUseHelperWithListener(hybridid, module,
      initProps, this, this, qRnActivityHelper, new QReactNative.QReactInstanceEventListener() {
        @Override
        public void onJsLoadingSuccess(View view) {
          //使用view布局
          frameLayout.addView(view);
        }

        @Override
        public void onJsLoadingFailure() {
          //重试
          progressDialog.dismiss();
          Toast.makeText(QRootViewHelperActivity.this, "bundle加载失败", Toast.LENGTH_SHORT);
        }

        @Override
        public void onViewShow() {
          //页面渲染完成，取消loading
          progressDialog.dismiss();

        }
      });
  }

  @Override
  protected void onPause() {
    super.onPause();
    qRnActivityHelper.onPause();
  }

  @Override
  protected void onResume() {
    super.onResume();
    qRnActivityHelper.onResume();
  }

  @Override
  public void onBackPressed() {
    if (!qRnActivityHelper.onBackPressed()) {
      super.onBackPressed();
    }
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    qRnActivityHelper.onActivityResult(requestCode, resultCode, data);
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    qRnActivityHelper.onRequestPermissionsResult(requestCode,permissions,grantResults);
  }

  @Override
  public boolean onKeyUp(int keyCode, KeyEvent event) {
    if (qRnActivityHelper.onKeyUp(keyCode, event)) {
      return true;
    }
    return super.onKeyUp(keyCode, event);
  }

  @Override
  public void invokeDefaultOnBackPressed() {
    super.onBackPressed();
  }
}
