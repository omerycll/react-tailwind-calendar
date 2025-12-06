# Demo Uygulamasını Yayınlama

Bu projeyi test etmek için birkaç seçenek var:

## 1. Vercel'e Deploy (Önerilen)

### Adımlar:

1. **GitHub'a push yapın:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Vercel'e gidin:**
   - [vercel.com](https://vercel.com) adresine gidin
   - GitHub hesabınızla giriş yapın
   - "New Project" butonuna tıklayın
   - Repository'nizi seçin

3. **Yapılandırma:**
   - **Root Directory:** `example` olarak ayarlayın
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (otomatik algılanır)
   - **Output Directory:** `dist` (otomatik algılanır)
   - **Install Command:** `npm install` (otomatik algılanır)

4. **Deploy edin!**

Vercel otomatik olarak her push'ta yeni bir deploy yapacak.

## 2. Netlify'e Deploy

1. **Netlify'e gidin:**
   - [netlify.com](https://netlify.com) adresine gidin
   - GitHub hesabınızla giriş yapın

2. **Yapılandırma:**
   - Repository'nizi seçin
   - **Base directory:** `example`
   - **Build command:** `npm run build`
   - **Publish directory:** `example/dist`

3. **Deploy edin!**

## 3. GitHub Pages

1. **GitHub Actions workflow oluşturun:**
   `.github/workflows/deploy.yml` dosyası oluşturun (opsiyonel)

2. **GitHub Pages ayarları:**
   - Repository Settings > Pages
   - Source: GitHub Actions

## 4. Lokal Test

Demo uygulamasını lokal olarak çalıştırmak için:

```bash
cd example
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresine gidin.

## 5. npm'e Beta/Alpha Tag ile Yayınlama

Test için npm'e yayınlamak isterseniz:

```bash
# Beta versiyonu yayınla
npm version 1.0.0-beta.1
npm publish --tag beta

# Kullanıcılar test edebilir:
npm install react-tailwind-calendar@beta
```

## Öneriler

- **Vercel** en kolay ve hızlı seçenek
- Otomatik HTTPS ve CDN desteği
- Her commit'te otomatik deploy
- Preview URL'leri

