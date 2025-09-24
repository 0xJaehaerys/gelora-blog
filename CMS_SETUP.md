# Настройка Decap CMS для Gelora Blog

## 🚀 Шаги для активации админки в продакшне:

### Шаг 1: Создание GitHub OAuth App

1. **Идите на**: https://github.com/settings/developers
2. **Нажмите**: "New OAuth App"
3. **Заполните форму**:
   ```
   Application name: Gelora Blog CMS
   Homepage URL: https://blog.gelora.study
   Authorization callback URL: https://api.netlify.com/auth/done
   ```
4. **Нажмите**: "Register application"
5. **Скопируйте**: Client ID (понадобится для Vercel)

### Шаг 2: Настройка Vercel Environment Variables

1. **Заходите в проект** на vercel.com
2. **Settings** → **Environment Variables**
3. **Добавляете**:
   ```
   GITHUB_CLIENT_ID = ваш_client_id_из_oauth_app
   GITHUB_CLIENT_SECRET = ваш_client_secret_из_oauth_app
   ```
4. **Редеплойте** проект

### Шаг 3: Настройка Netlify Identity (для аутентификации)

1. **Регистрируйтесь** на netlify.com
2. **Создаете новый сайт** (можно пустой)
3. **Site settings** → **Identity**
4. **Enable Identity**
5. **Settings** → **Git Gateway** → **Enable**
6. **Добавляете GitHub**:
   - Client ID: тот же что в Vercel
   - Client Secret: тот же что в Vercel

### Шаг 4: Обновление CMS конфигурации

Измените `public/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main
```

## 🎯 После настройки:

✅ **Админка доступна** на `blog.gelora.study/admin`
✅ **Вход через GitHub** - безопасно и просто
✅ **Визуальный редактор** - как в Notion
✅ **Автоматические коммиты** - каждое сохранение → Git
✅ **Медиа загрузка** - drag & drop изображений
✅ **Live preview** - видите результат сразу

## 🚀 Возможности CMS:

- **Rich Text Editor** с Markdown поддержкой
- **Image upload** с автоматической оптимизацией
- **Tags management** для категоризации
- **Draft/Publish** workflow
- **SEO fields** (meta description, etc.)
- **Mobile-friendly** редактор

## 💡 Альтернатива (текущая):

Пока OAuth не настроен, используйте **Simple File Manager**:

- Создавайте файлы в `data/blog/`
- Коммитите в Git
- Автодеплой на Vercel

---

**После настройки OAuth у вас будет полноценная веб-админка как в Substack/Medium!** 🎊
