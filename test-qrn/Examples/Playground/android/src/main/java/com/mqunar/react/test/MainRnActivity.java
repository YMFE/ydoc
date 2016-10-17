package com.mqunar.react.test;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.mqunar.react.debug.RnDebugActivity;
import com.mqunar.react.test.util.InitRn;

public class MainRnActivity extends Activity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    InitRn.init();
    startActivity(new Intent(MainRnActivity.this,RnDebugActivity.class));
    this.finish();
  }
}
