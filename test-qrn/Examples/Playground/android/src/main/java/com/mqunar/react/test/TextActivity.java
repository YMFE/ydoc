package com.mqunar.react.test;

import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;

import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.mqunar.react.common.app.QRCTBaseActivity;

/**
 * Created by djj.deng on 2016/4/11.
 * E-mail:djj.deng@qunar.com
 */
public class TextActivity extends QRCTBaseActivity implements DefaultHardwareBackBtnHandler {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Button textView = new Button(this);
    textView.setGravity(Gravity.CENTER);
    textView.setText("测试startActivity");
    setContentView(textView);
    final Bundle bundle = getIntent().getExtras();
    textView.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        Intent result = new Intent();
        result.putExtras(bundle);
        TextActivity.this.setResult(RESULT_OK,result);
        TextActivity.this.finish();
      }
    });
  }



  @Override
  public void invokeDefaultOnBackPressed() {
    super.onBackPressed();
  }
}
