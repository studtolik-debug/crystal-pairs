package ru.samotsvety.gems;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        /* На полосу у камеры Android окно игры не пускает, и там виден фон
           окна — по умолчанию белый. Чёрный сливается с рамкой экрана. */
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.BLACK));
    }

    /* Игра во весь экран: строка состояния и панель навигации спрятаны.
       Свайп от края показывает их ненадолго, потом они снова уходят.
       Прячем при каждом возврате фокуса: после сворачивания, шторки
       уведомлений или диалога система показывает панели снова. */
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    private void hideSystemBars() {
        WindowInsetsControllerCompat bars =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        bars.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        bars.hide(WindowInsetsCompat.Type.systemBars());
    }
}
