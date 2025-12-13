# GitHub Actions Workflows

## Publish to npm

Bu workflow, yeni bir release oluşturulduğunda veya manuel olarak tetiklendiğinde npm'e paket publish eder.

### Kurulum

1. npm'de bir access token oluşturun: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. GitHub repository'nize gidin: Settings → Secrets and variables → Actions
3. Yeni bir secret ekleyin:
   - Name: `NPM_TOKEN`
   - Value: npm access token'ınız

### Kullanım

- Otomatik: Yeni bir GitHub release oluşturduğunuzda otomatik olarak publish edilir
- Manuel: Actions sekmesinden "Publish to npm" workflow'unu manuel olarak çalıştırabilirsiniz


