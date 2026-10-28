# Later: a native Android Pocket Nag app (sketch)

**Core:** a `NotificationListenerService` that the user enables in Settings → Notification access.

```kotlin
class NagListener : NotificationListenerService() {
  private val payApps = setOf("com.google.android.apps.walletnfcrel", "com.google.android.gms",
                              "com.samsung.android.spay", /* bank apps the user picks */)
  private lateinit var tts: TextToSpeech
  override fun onCreate() { super.onCreate(); tts = TextToSpeech(this) {} }
  override fun onNotificationPosted(sbn: StatusBarNotification) {
    if (sbn.packageName !in payApps || sbn.isOngoing) return
    val ex = sbn.notification.extras
    val title = ex.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: return
    val text  = ex.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
    val parsed = Parser.parse(sbn.packageName, title, text) ?: return   // per-app regex (merchant, amount)
    val count = VisitDao.recordAndCount(parsed.merchantKey, days = 7)  // Room/SQLite
    val line  = Picker.pick(Lines.load(this), parsed, count)           // same lines.json + port of picker.js
    tts.setAudioAttributes(AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE).build())
    tts.speak(line, TextToSpeech.QUEUE_FLUSH, null, sbn.key)
  }
}
```
- **Manifest:** `<service android:name=".NagListener" android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE" android:exported="true"><intent-filter><action android:name="android.service.notification.NotificationListenerService"/></intent-filter></service>`
- **Settings UI:** personality, voice, volume boost, quiet hours, the list of bank and wallet apps to listen to, and a "test" button.
- **Widget:** a Glance `AppWidget` showing this week's total and the last line.
- **Play Store:** notification-listener apps get extra review. Write a clear disclosure, keep processing on-device, and don't upload notification content.
- **Bank SMS** (non-Google-Wallet users) would need SMS permissions. Play restricts those heavily, so skip it.
- **Faster than the notification?** Only if Pocket Nag *were* the default wallet (Android 15 `ROLE_WALLET`), which would mean becoming a real payment app with issuer tokenization. That isn't realistic.
