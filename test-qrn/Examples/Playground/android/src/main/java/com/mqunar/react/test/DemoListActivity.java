package com.mqunar.react.test;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Debug;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.view.ViewCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.devsupport.log.Lg;
import com.mqunar.react.QReactNative;
import com.mqunar.react.init.QavManager;
import com.mqunar.react.init.manager.ReactContextManagerHelper;
import com.mqunar.react.init.utils.BundleLoaderUtil;
import com.mqunar.react.init.utils.RnMemoryUtil;

import java.util.ArrayList;
import java.util.List;

public class DemoListActivity extends AppCompatActivity {


  private ListView mLv;

  private List<WItem> mList = new ArrayList<WItem>();

  private static List<StringBuilder> listString=new ArrayList<>();

  private static final boolean JELLY_BEAN = android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
//        initActivityWindowSetting(this);
    setContentView(R.layout.activity_demo_list);
    mLv= (ListView) findViewById(R.id.demo_list_lv);
    initData();
    setLvAdapter();
    setLvItemClick();

  }


  private void initData(){
    mList.add(new WItem("view打电话", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("tel:10086"));
        startActivity(intent);
      }
    }));
    mList.add(new WItem("打开打电话页面", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_DIAL, Uri.parse("tel:10086"));
        startActivity(intent);
      }
    }));
    mList.add(new WItem("发短信", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_SENDTO, Uri.parse("sms:13000000000?body=123"));
        startActivity(intent);
      }
    }));
    mList.add(new WItem("发短信view", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("sms:13000000000?body=123"));
        startActivity(intent);
      }
    }));

    mList.add(new WItem("scheme  false", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("qunaraphone://react/debug"));
        startActivity(intent);
      }
    }));

    mList.add(new WItem("跳转rn的debug", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse("qunaraphone://react/debug")));
      }
    }));

    mList.add(new WItem("申请内存20M",new OnWtLvItemClickListener(){
      @Override
      public void onClick(View view) {
        listString.add(new StringBuilder(10240000));
      }
    }));

    mList.add(new WItem("清理内存",new OnWtLvItemClickListener(){
      @Override
      public void onClick(View view) {
        RnMemoryUtil.cleanReactContext();
      }
    }));

    mList.add(new WItem("删除reactcontext",new OnWtLvItemClickListener(){
      @Override
      public void onClick(View view) {
        ReactContextManagerHelper.handleLowMemory();
      }
    }));

    mList.add(new WItem("直接打开biz", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("qunaraphone://react/biz?hybridId=bnbrn&moduleName=bnbrn&initProps={}"));
        startActivity(intent);
      }
    }));

    mList.add(new WItem("发送消息biz", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("qunaraphone://react/biz?hybridId=XXX"));
        Bundle bundle=new Bundle();
        bundle.putBoolean("ext",false);
        intent.putExtras(bundle);
        startActivity(intent);
      }
    }));

    mList.add(new WItem("直接打开open", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("qunaraphone://react/open?hybridId=bnbrn&moduleName=bnbrn&initProps={}"));
        startActivity(intent);
      }
    }));

    mList.add(new WItem("直接打开open", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("qunaraphone://react/open?hybridId=bnbrn&moduleName=bnbrn&initProps={" +
          "    \"name\": \"wang\"," +
          "    \"type\": [" +
          "        \"age\"," +
          "        \"78\"," +
          "        \"sd\"," +
          "        \"dd\"" +
          "    ]" +
          "}"));
        startActivity(intent);
      }
    }));

    mList.add(new WItem("创建rn环境打开biz", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        QReactNative.createReactInstanceWithCallBack("bnbrn", new QReactNative.QReactInstanceCreateCallBack() {
          @Override
          public void success() {
            Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("qunaraphone://react/biz?hybridId=bnbrn&moduleName=bnbrn&initProps={}"));
            startActivity(intent);
          }

          @Override
          public void failed() {

          }
        });

      }
    }));

    mList.add(new WItem("创建rn环境打开biz", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        QReactNative.createReactInstanceWithCallBack("bnbrn", new QReactNative.QReactInstanceCreateCallBack() {
          @Override
          public void success() {
            Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse("qunaraphone://react/biz?hybridId=bnbrn&moduleName=bnbrn&initProps={}"));
            startActivity(intent);
          }

          @Override
          public void failed() {

          }
        });

      }
    }));

    mList.add(new WItem("qav test", new OnWtLvItemClickListener() {
      @Override
      public void onClick(View view) {
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
          @Override
          public void run() {
            QavManager.getInstance().getQavInfo(33.3d, 44.4d, null, new QavManager.XPathListener() {
              @Override
              public void onSuccess(QavManager.QavInfo qavInfo) {
                Lg.e("qav","qavInfo:"+qavInfo.toString());
              }

              @Override
              public void onFail(String message) {
                Lg.e("qav",message);
              }
            });
          }
        },5000);

      }
    }));



  }


  public  void initActivityWindowSetting(Activity activity) {
    Window window = activity.getWindow();
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
//            window.setFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS,
//                    WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
//        }

    activity.requestWindowFeature(Window.FEATURE_NO_TITLE);

    int mWindowFlags=0;
    if(JELLY_BEAN){
      mWindowFlags |= View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
    } else {
      mWindowFlags |= View.SYSTEM_UI_FLAG_LOW_PROFILE;
    }
    activity.getWindow().getDecorView().setSystemUiVisibility(mWindowFlags);
    ViewCompat.requestApplyInsets(activity.getWindow().getDecorView());
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      activity.getWindow().setStatusBarColor(Color.parseColor("#00000000"));
    }
//        StatusBarUtil.setColor("#0000",false,this);
    window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE
      | WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
  }

  private void setLvAdapter(){
    mLv.setAdapter(new BaseAdapter() {
      @Override
      public int getCount() {
        return mList.size();
      }

      @Override
      public Object getItem(int position) {
        return mList.get(position);
      }

      @Override
      public long getItemId(int position) {
        return position;
      }

      @Override
      public View getView(int position, View convertView, ViewGroup parent) {
        TextView textView;
        if(convertView!=null){
          textView= (TextView) convertView;

        }else {
          textView=new TextView(DemoListActivity.this);
        }
//                LinearLayout.LayoutParams params=new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,(int) PixUtil.toPixelFromDIP(30,ClickDemoActivity.this));
//                params.gravity= Gravity.CENTER_VERTICAL;
//                textView.setLayoutParams(params);
        textView.setText(mList.get(position).name);
        return textView;
      }
    });
  }

  private void setLvItemClick(){
    mLv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
      @Override
      public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        mList.get(position).onWtLvItemClickListener.onClick(view);
      }
    });
  }

  private class WItem{
    public String name;
    public OnWtLvItemClickListener onWtLvItemClickListener;
    public WItem(String name ,OnWtLvItemClickListener onWtLvItemClickListener){
      this.name=name;
      this.onWtLvItemClickListener=onWtLvItemClickListener;
    }
  }

  private interface OnWtLvItemClickListener{
    void onClick(View view);
  }


  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    // Toast.makeText(this,"::"+requestCode+"::"+requestCode,Toast.LENGTH_LONG).show();
    Log.e("wt","::"+requestCode+"::"+requestCode);

  }
}
