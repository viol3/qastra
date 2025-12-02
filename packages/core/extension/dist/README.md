# Qastra Wallet — Ready to Load

Bu klasör doğrudan tarayıcıya yüklenmek için hazırlanmıştır.

## Hızlı Kurulum (Chrome / Edge / Brave)

### Adım 1: Tarayıcıda Extension Sayfasını Aç
- **Chrome:** `chrome://extensions/`
- **Edge:** `edge://extensions/`
- **Brave:** `brave://extensions/`

### Adım 2: Developer Mode Etkinleştir
Sayfanın sağ üstünde "Developer mode" geçişini aç.

### Adım 3: Load Unpacked Seç
"Load unpacked" butonunu tıkla ve bu klasörü seç:
```
packages/core/extension/dist
```

### Adım 4: Bitti!
Qastra uzantısı tarayıcında yüklendi. Araç çubuğundaki ikondan açabilirsin.

## Dosyalar
- `manifest.json` — Uzantı ayarları
- `popup.html` + `popup.js` — Araç çubuğu arayüzü
- `background.js` — Service worker
- `popup.css` — Stiller
- `icons/` — Uzantı ikonları

## Not
Geliştirme sırasında değişiklikleri görmek için `npm run build` sonrası uzantıyı yeniden yükle.
