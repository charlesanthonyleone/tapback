# Pocket Nag for iPhone: Shortcuts build guide (for Charles)

**Goal:** you tap your iPhone to pay, and the phone immediately says a funny line out loud at the register.
**Needs:** iOS 17 or later and a card in Apple Wallet. It runs entirely on the phone, with no app, no server and no internet connection.

> **What's verified and what isn't.** The trigger, its Merchant, Amount and Card values, and the Run Immediately option all come from Apple's docs and from published guides by other apps (sources at the bottom). The action names are the standard Shortcuts names. **None of this has been tested on a real iPhone yet.** The first real tap will tell us the exact timing and whether it talks over the Apple Pay chime.
> **iOS 26 renamed a few things:** the trigger is called **Wallet** instead of **Transaction**, and "New Blank Automation" is now **Create New Shortcut**.

## How it's built (two pieces, so it can be shared)
1. **A shortcut called "Pocket Nag"** holds all the logic and the joke library. You can share this one as an iCloud link.
2. **A Transaction automation** on each phone. It's two actions that pass the merchant and amount to "Pocket Nag". Apple does **not** include automations in shared links, so each person sets this part up themselves (about 1 minute).

---
## Part A: build the "Pocket Nag" shortcut
Open **Shortcuts** → **Shortcuts** tab → **+**. Rename it **Pocket Nag**. Add these actions in order. Use the search bar at the bottom, and type the names exactly as written.

**1. Read the input, or use test data when there isn't any**
1. **If**: set it to *Shortcut Input* · **does not have any value**.
2. Inside the If: **Dictionary** with two Text items: `merchant` = `McDonald's`, `amount` = `8.49`. Then **Set Variable** `Info` to *Dictionary*.
3. **Otherwise**: **Set Variable** `Info` to *Shortcut Input*.
4. **End If**.
5. **Get Dictionary Value**: Get **Value** for `merchant` in `Info` → **Set Variable** `Merchant`.
6. **Get Dictionary Value**: `amount` in `Info` → **Set Variable** `Amount`.

**2. Make a clean merchant key** (it turns "MCDONALD'S #4521" into "mcdonalds")
7. **Change Case**: `Merchant` to **lowercase**.
8. **Replace Text**: find `\s*#?\s*\d{2,}.*$`, replace with nothing. Open the action's options with the **>** arrow and turn **Regular Expression** on.
9. **Replace Text**: find `[^a-z0-9 ]`, replace with nothing, Regular Expression on. → **Set Variable** `Key`.

**3. Log this visit, then count visits in the last 7 days**
10. **Format Date**: *Current Date*, Date Format **Custom**, `yyyy-MM-dd`. → **Set Variable** `Today`.
11. **Text**: `Today|Key` (insert the two variables with a `|` between them).
12. **Append to Text File**: append *Text* to path `PocketNag/visits.txt` in the **Shortcuts** folder of iCloud Drive. Turn **Make New Line** on. The file is created on the first run (untested; if it errors, create an empty `visits.txt` in Files → iCloud Drive → Shortcuts → PocketNag).
13. **Adjust Date**: **Add** `1` **days** to *Current Date*. → **Set Variable** `Tomorrow`.
14. **Repeat** `7` times:
    - **Adjust Date**: **Subtract** *Repeat Index* **days** from `Tomorrow`.
    - **Format Date**: *Adjusted Date*, Custom `yyyy-MM-dd`.
15. **End Repeat**. The Repeat's output is a list of the last 7 dates.
16. **Combine Text**: *Repeat Results*, separator **Custom** `|`. → **Set Variable** `Days`.
17. **Get File from Folder**: folder **Shortcuts**, path `PocketNag/visits.txt`, Error If Not Found **off**.
18. **Match Text**: pattern `(Days)\|Key$` (type `(`, insert `Days`, type `)\|`, insert `Key`, type `$`) in *File*. Turn **Case Sensitive** off. Because `$` needs "multiline" mode, put `(?m)` at the very start of the pattern: `(?m)(Days)\|Key$`.
19. **Count**: **Items** in *Matches*. → **Set Variable** `Visits`.

**4. Pick the visit tier and the ordinal word**
20. **If** `Visits` **is greater than** `3` → **Text** `4` → **Set Variable** `Tier`. **Otherwise** → **Text** `Visits` → **Set Variable** `Tier`. **End If**.
21. **If** `Visits` **is** `1` → Text `1st` · Otherwise **If** `Visits` **is** `2` → Text `2nd` · Otherwise **If** `Visits` **is** `3` → Text `3rd` · Otherwise Text `Visits` + `th`. In each branch, **Set Variable** `Ordinal`. Add **End If** ×3.
   *(Shortcuts has no "else if", so this is three nested Ifs.)*

**5. Load the joke library and pick a category**
22. **Text**: paste the entire contents of `ios/lines_for_shortcuts.json`, about 10 KB.
23. **Get Dictionary from Input** → **Set Variable** `Lib`.
24. **Get Dictionary Value** `cats` in `Lib` → **Set Variable** `Cats`.
25. **Get Dictionary Value** `order` in `Lib`.
26. **Repeat with Each** item in *Dictionary Value*:
    - **If** `Category` **does not have any value**:
      - **Get Dictionary Value** *Repeat Item* in `Cats` → **Get Dictionary Value** `match` in that.
      - **Match Text**: pattern = *Dictionary Value*, in `Key`.
      - **If** *Matches* **has any value** → **Set Variable** `Category` to *Repeat Item*. **End If**.
    - **End If**.
27. **End Repeat**.
28. **If** `Category` **does not have any value** → **Text** `generic` → **Set Variable** `Category`. **End If**.
   *(The order runs fast food → coffee → gas → bars → groceries → online → big box. The first match wins; generic is the fallback.)*

**6. (Optional) Big-purchase variant**
29. **If** `Amount` **is greater than** `75` *and* `Visits` **is less than** `3` → **Text** `big` → **Set Variable** `Tier`. **End If**.
   *(Untested: Shortcuts may treat the Amount as currency text. If the comparison fails, add **Get Numbers from Input** on `Amount` first, or skip this step. There's also a `small` tier you can use the same way.)*

**7. Pick a line, fill in the blanks, and say it**
30. **Get Dictionary Value** `Category` in `Cats` → **Get Dictionary Value** `Tier` in that.
31. **Get Item from List**: **Random Item** from *Dictionary Value*.
32. **Replace Text** `{count}` with `Ordinal` → **Replace Text** `{merchant}` with `Merchant` → **Replace Text** `{amount}` with `Amount`. **Set Variable** `Line`.
33. **Set Volume** to **85%** (on iOS 17+ the options let you choose Media or Ringtone; choose **Media**).
34. **Speak Text** `Line`. In its options: **Wait Until Finished** off, Rate a little above the middle, and Pitch to taste. You can pick a voice here (Settings → Accessibility → Spoken Content → Voices to download better ones).

Tap **Done**. **Test it:** tap ▶︎ in the editor. With no input it uses the McDonald's test data. Run it 4 times and the 4th should say something like *"DAMN, FOR THE 4TH TIME THIS WEEK?! EAT SOMETHING HEALTHY FOR ONCE!"* (To reset the count, delete `visits.txt` in Files.)

---
## Part B: the automation that fires on every tap
1. Shortcuts → **Automation** tab → **+** (or **New Automation**).
2. Scroll to **Transaction** (called **Wallet** on iOS 26).
3. Under **When I tap**, select all your cards. Leave all **Categories** selected (and Merchants, if shown).
4. Choose **Run Immediately**. Turn **Notify When Run** **off**.
5. **Next** → **New Blank Automation** (iOS 26: **Create New Shortcut**).
6. Add **Dictionary**: add item `merchant` (Text) → tap the value field → **Select Variable** → *Shortcut Input* → tap the *Shortcut Input* chip → choose **Merchant**. Add `amount` the same way → **Amount**.
7. Add **Run Shortcut**: choose **Pocket Nag**, then tap the arrow and set **Input** to *Dictionary*. Turn **Show While Running** off.
8. **Done**.

## Sharing with Mom
- **Pocket Nag (Part A)**: open it → share button → **Copy iCloud Link** (Apple: "Share shortcuts on iPhone or iPad"). She taps the link → **Add Shortcut**. The signing is handled by Apple's iCloud sharing; nothing to do on our side. If sharing is blocked, turn on **Settings → Apps → Shortcuts → Private Sharing** / **Allow Untrusted Shortcuts** (the label varies by iOS version).
- **The automation (Part B)** cannot be shared. She does Part B herself; it's in SETUP_GUIDE.
- A `.shortcut` file can't be made on this Linux box. It has to be exported or signed on an Apple device, either through iCloud link sharing or `shortcuts sign --mode anyone` on a Mac. So: you build it once on your iPhone and send the iCloud link.

## On-device vs. a tiny web endpoint
The design above is **on-device**. Instead, you could swap steps 7–32 for **Get Contents of URL** pointing at a small free endpoint (a Cloudflare Worker running `picker.js`).
- **Pros:** a much shorter shortcut, and you can update the jokes without re-sharing.
- **Cons:** it adds about 0.3–2 s of delay (the line might land after the moment has passed), fails with no signal (checkout lines often have weak signal), and sends merchant and amount data to a server.
- **Recommendation:** stay on-device. Updating the jokes just means pasting new JSON into step 22.

## Known limits
- It only fires for **Apple Wallet taps on this iPhone**. It doesn't fire for a physical card, online purchases, or apps outside Wallet. (Apple Watch taps: unverified.)
- The Merchant name is whatever the payment network reports, sometimes "SQ *JOES CAFE" or "TST* ...". Unknown names fall back to the generic jokes.
- It may fire even if the payment is then declined (unverified).
- "Last 7 days" counts calendar days including today, so a visit 7 days ago doesn't count.

## Sources
- Apple, Transaction triggers: https://support.apple.com/guide/shortcuts/transaction-trigger-apd65c67538a/ios
- Apple, Add automations (Transaction can run without asking): https://support.apple.com/guide/shortcuts/add-automations-apdfbdbd7123/ios
- Apple, What's new in Shortcuts iOS 17 (Transaction automations; Set Volume media/ringtone): https://support.apple.com/en-gb/111098
- Apple, Share shortcuts (Copy iCloud Link, file signing): https://support.apple.com/guide/shortcuts/share-shortcuts-apdf01f8c054/ios
- Apple, `shortcuts sign` (Mac): https://support.apple.com/guide/shortcuts-mac/apd455c82f02/mac
- TravelSpend help (Run Immediately, Notify off, iOS 26 "Wallet" rename, Shortcut Input → Merchant/Amount): https://help.travel-spend.com/shortcuts--automation/ignQHsp85RQDsig2QwVcdX/set-up-apple-pay-automation/7tL8XfjBceg4D7mQeiSK2V
- Skwad blog (Transaction trigger → Merchant/Amount variables): https://skwad.app/blog/creating-skwad-transactions-using-ios-shortcuts
