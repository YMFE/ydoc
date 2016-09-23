package com.mqunar.react.test.androiddemo;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.mqunar.core.basectx.SchemeDispatcher;
import com.mqunar.react.QReactNative;
import com.mqunar.react.debug.RnDebugActivity;
import com.mqunar.react.test.R;

import java.util.List;


/**
 * Created by wangtao.wang on 16/5/3
 * Android开发者事例
 */
public class MainAdActivity extends Activity implements View.OnClickListener {

  private Button mBtOpenByScheme;
  private Button mBtOpenWithFrameLoading;
  private Button mBtOpenWithUserLoading;
  private Button mBtOpenRooViewWithBaseActivity;
  private Button mBtOpenRootViewWithHelper;
  private Button mBtDemo;

  private String hybridId="qunar_hy";
  private String moduleName="naive";
  private String qInitView="test";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main_ad);

    registerPackage();

    initView();
    setListener();
  }

  /**
   * 你可以创建自己的Module和ViewManager.
   * 只要在打开你们的rn页面之前，也就是创建reactcontext之前把你们的package注册进来。
   * package可以参考MainReactPackage类
   */
  private void registerPackage() {
    QReactNative.registerReactPackage(hybridId, new ReactPackage() {
      @Override
      public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return null;
      }

      @Override
      public List<Class<? extends JavaScriptModule>> createJSModules() {
        return null;
      }

      @Override
      public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return null;
      }
    });
  }

  private void setListener() {
    mBtOpenByScheme.setOnClickListener(this);
    mBtOpenWithFrameLoading.setOnClickListener(this);
    mBtOpenWithUserLoading.setOnClickListener(this);
    mBtOpenRooViewWithBaseActivity.setOnClickListener(this);
    mBtOpenRootViewWithHelper.setOnClickListener(this);
    mBtDemo.setOnClickListener(this);
  }

  private void initView() {
    mBtOpenByScheme = (Button) findViewById(R.id.bt_ad_demo_rn_open_scheme);
    mBtOpenWithFrameLoading = (Button) findViewById(R.id.bt_ad_demo_rn_open_frame_loading);
    mBtOpenWithUserLoading = (Button) findViewById(R.id.bt_ad_demo_rn_open_my_loading);
    mBtOpenRooViewWithBaseActivity = (Button) findViewById(R.id.bt_ad_demo_rn_rootview_baseactivity);
    mBtOpenRootViewWithHelper = (Button) findViewById(R.id.bt_ad_demo_rn_rootview_helper);
    mBtDemo = (Button) findViewById(R.id.bt_ad_demo_rn_demo);
  }

  @Override
  public void onClick(View v) {
    int id = v.getId();
    switch (id) {
      case R.id.bt_ad_demo_rn_open_scheme:
        openWithScheme();
        break;
      case R.id.bt_ad_demo_rn_open_frame_loading:
        openWithFrameLoading();
        break;
      case R.id.bt_ad_demo_rn_open_my_loading:
        openWithUseLoading();
        break;
      case R.id.bt_ad_demo_rn_rootview_baseactivity:
        openRootViewActivtyExtendsBaseActivity();
        break;
      case R.id.bt_ad_demo_rn_rootview_helper:
        openRootViewActivityUseHelper();
        break;
      case R.id.bt_ad_demo_rn_demo:
        openActivityDemo();
        break;
    }
  }


  /**
   * 通过scheme打开页面
   */
  private void openWithScheme() {
    String url = "qunaraphone://react/open?hybridId="+hybridId+"&moduleName="+moduleName+"&initProps";
    SchemeDispatcher.sendScheme(this, url);
  }

  /**
   * 调用api打开页面
   */
  private void openWithFrameLoading() {
    QReactNative.startReactActivity(this, hybridId, moduleName, new Bundle());
  }

  /**
   * 自定义loading打开页面
   * 本地存在js代码，创建reactcontext大概需要1.2秒左右。这是比较耗时的。
   * 如果本地不存在qp离线包。还会访问网络。下载js代码。这个耗时就依赖网络了。
   * 所以第一次加载会显示loading.
   * 以后不会存在loading,我们会使用缓存的reactcontext.速度就比较快了。耗时仅仅是渲染界面的时间。也就是二三百毫秒左右。
   */
  private void openWithUseLoading() {
    QReactNative.createReactInstanceWithCallBack(hybridId, new QReactNative.QReactInstanceCreateCallBack() {
      @Override
      public void success() {
        QReactNative.startReactActivity(MainAdActivity.this,hybridId,moduleName,new Bundle());
      }

      @Override
      public void failed() {
        //重试
        Toast.makeText(MainAdActivity.this,"网络错误",Toast.LENGTH_LONG).show();
      }
    });
  }

  /**
   * 如果你不想完全使用我们的框架，仅仅想用ReactRootView作为界面的一部分。我们可也提供了使用的方法。（其实我们不推荐这么使用）
   * 一种是继承我们的baseactivity.如下
   */
  private void openRootViewActivtyExtendsBaseActivity() {
    startActivity(new Intent(this, QRootViewActivity.class));
  }

  /**
   * 一种是使用我们的helper类。如下
   */
  private void openRootViewActivityUseHelper() {
    startActivity(new Intent(this, QRootViewHelperActivity.class));
  }

  private void openActivityDemo() {
    startActivity(new Intent(this, RnDebugActivity.class));
  }
}
