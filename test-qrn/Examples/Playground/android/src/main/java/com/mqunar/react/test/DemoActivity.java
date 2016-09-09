/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 * <p/>
 * Facebook reserves all rights not expressly granted.
 * <p/>
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.mqunar.react.test;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.mqunar.react.ReactInit;
import com.mqunar.react.common.app.QRCTBaseActivity;
import com.mqunar.react.init.QGlobalEnv;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class DemoActivity extends QRCTBaseActivity implements DefaultHardwareBackBtnHandler {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    ReactInit.getInstance().init(this.getApplication(), "0", "0", "0", "0", "0", "0", "0", "qunaraphone", QGlobalEnv.QEnvironment.DEV);

    mReactInstanceManager = ReactInstanceManager.builder()
        .setApplication(getApplication())
        .setBundleAssetName("index.bundle")
        .setJSMainModuleName("index")
        .addPackage(new MainReactPackage())
        .setUseDeveloperSupport(true)
        .setInitialLifecycleState(LifecycleState.RESUMED)
        .build();

    ((ReactRootView) findViewById(R.id.react_root_view))
        .startReactApplication(mReactInstanceManager, "DemoApp", null);

//    testReactActivity();

  }

  private void testReactActivity() {
    String hybridId = "hotel_ugc_sleep_rn_ios";
    String url = "http://l-crossupdate1.h.beta.cn0.qunar.com:8081/index.bundle?platform=android&dev=false";
    String module = "ugc_hybrid_write_review";
    String initialProps = "{\"csrfToken\":\"kKxjGt0KDoRxMo0y\",\"hotelName\":\"杭州黄龙玉泉亚朵...\",\"hotelSeq\":\"hangzhou_17504\"}";
//    String initialProps = "{csrfToken:'kKxjGt0KDoRMo0y',hotelName:'杭州黄龙玉泉亚朵...',hotelSeq:'hangzhou_17504'}";
    try {
      url = URLEncoder.encode(url, "utf-8");
      module = URLEncoder.encode(module, "utf-8");
      initialProps = URLEncoder.encode(module, "utf-8");
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }

    String scheme = "qunarhyaphonehotelugcsleep://react?url=" + url + "&hybridId=" + hybridId + "&module=" + module + "&initialProps=" + initialProps;
    Uri uri = Uri.parse(scheme);
    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
    startActivity(intent);
    this.finish();
  }

  @Override
  public boolean onKeyUp(int keyCode, KeyEvent event) {
    if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
      mReactInstanceManager.showDevOptionsDialog();
      return true;
    }
    return super.onKeyUp(keyCode, event);
  }

  @Override
  protected void onPause() {
    super.onPause();

    if (mReactInstanceManager != null) {
      mReactInstanceManager.onHostPause();
    }
  }

  @Override
  protected void onResume() {
    super.onResume();

    if (mReactInstanceManager != null) {
      mReactInstanceManager.onHostResume(this, this);
    }
  }

  @Override
  public void onBackPressed() {
    if (mReactInstanceManager != null) {
      mReactInstanceManager.onBackPressed();
    } else {
      super.onBackPressed();
    }
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    if (mReactInstanceManager != null) {
      mReactInstanceManager.onHostDestroy();
    }
  }

  @Override
  public void invokeDefaultOnBackPressed() {
    super.onBackPressed();
  }

}
