# Tapback for Android: MacroDroid build guide

## The honest answer on "real tap triggers"
I checked whether an Android app can react to the tap itself, and it can't:
- **Android has no tap-to-pay event for other apps.** The payment tap goes to the default wallet app's card-emulation service, and Android doesn't announce it to anyone else (Android Developers, *Host-based card emulation overview*). An app can only see taps aimed at *its own* registered card IDs, and it only handles payments if it **is** the default wallet app.
- **Google Wallet publishes no tap trigger or API for other apps.** What it does have is a **"Transactions" notification channel**, "Get notified after you make a purchase" (9to5Google, Dec 2023, from the Wallet app's own channel list).
- **MacroDroid's "NFC Tag" trigger** is for reading NFC stickers, not for paying at a terminal. It doesn't fire when you pay.
- **Samsung Modes & Routines** can react to "App opened → Samsung Wallet". That fires when the wallet **opens** (for example when you swipe up to pay), *before* the tap, and without merchant or amount. You could use it for a generic "Whoa, what are you buying?!" line as the phone comes out. That's a fun, genuinely instant extra for Samsung owners (untested).

**So the best real option is Google Wallet's purchase notification.** MacroDroid catches it and speaks. **Timing caveat:** 9to5Google (2023) described the Wallet purchase notification arriving "a few minutes later", not instantly. It may be faster now or depend on the card issuer, but we have **not** measured it. If it's slow, Android simply can't do "at the register" the way iPhone can, and the line becomes a "ding, receipt roast" moments later.

## MacroDroid setup (free tier: up to 5 macros, this uses 1)
1. Install **MacroDroid** from the Play Store. Open it and allow **Notification access** when asked (Settings → Notifications → Device & app notifications → Notification access → MacroDroid).
2. In **Google Wallet** → profile picture → **Notifications** (or Android Settings → Apps → Google Wallet → Notifications), make sure **Transactions** notifications are **on**.
3. MacroDroid → **Add Macro**. Name it **Tapback**.
4. **Trigger** → **Notification** → **Notification Received** → **Select Applications** → tick **Google Wallet** (also tick **Google Play services** for older setups) → Text filter **Contains** `$`. Turn on **Ignore ongoing/persistent notifications** and leave **Prevent multiple triggers** on.
5. **Action** → **Volume** → **Volume Change** → **Media** (if Speak Text uses another stream on your phone, also set **Notification**) → **85%**.
6. **Action** → **Device Actions**/**Scripting** → **JavaScript Code**:
   - Paste all of `android/macrodroid_tapback.js`.
   - Engine: **JetPack JavascriptEngine** (the default).
   - **Output Variable**: create a new **String** variable `tb_line`.
   - Leave **Block next action until complete** on.
7. **Action** → **Speak Text** → text `{lv=tb_line}`. If you made it a global variable, use `{v=tb_line}` instead (the variable picker inserts the right one). Turn **Wait to finish** off. Optionally set the speech rate a bit faster.
8. Save (✓). Make sure the macro is enabled.
9. **Test without paying:** MacroDroid → the macro → **⋮ → Test actions**. With no real notification the merchant will be empty, so you'll hear a generic line. A real test needs a real tap.

The script keeps the 7-day visit log inside MacroDroid's JavaScript `globals` store (the `pn_log` key), so no file permissions are needed.

### If Google Wallet's notification looks different
The script assumes **title = merchant name** and **text contains `$12.34`**. Lines 6–9 at the bottom of the script are the only parsing; adjust them after seeing a real notification. A quick way to see what MacroDroid receives: temporarily add **Display Notification** with `{not_title} || {notification}`.

### Tasker alternative (paid, around $3.49)
Use the **Event → UI → Notification** (owner: Google Wallet) profile, then a **JavaScriptlet** with the same script. Swap `magicText.evaluateString(...)` for Tasker's `%evtprm2`/`%evtprm3` (title/text) and `mdOutput()` for `setLocal('tb', ...)`, then **Say** `%tb`. This variant is untested.

## Sources
- Android Developers, Host-based card emulation overview (payment category, default wallet role, AID routing): https://developer.android.com/develop/connectivity/nfc/hce
- Stack Overflow answers on detecting other apps' HCE taps (no system broadcast exists); search "android detect nfc payment other app".
- 9to5Google, Google Wallet notification channels incl. "Transactions": https://9to5google.com/2023/12/04/google-wallet-notifications/
- MacroDroid Wiki, Notification trigger & magic text: https://macrodroidforum.com/wiki/index.php/Trigger:_Notification
- MacroDroid Wiki, JavaScript Code action (mdOutput, globals): https://macrodroidforum.com/wiki/index.php/Action:_JavaScript_Code
- Samsung Modes & Routines: the "App opened" condition is visible in the Routines app (Settings → Modes and Routines). No payment condition exists (checked via Samsung community and how-to articles; no single official URL is cited).
