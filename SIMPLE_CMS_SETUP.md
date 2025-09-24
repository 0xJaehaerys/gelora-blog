# Простая настройка CMS для Gelora Blog

## 🚀 Метод 1: GitHub + Decap CMS (рекомендуемый)

### Настройка GitHub OAuth:

1. **Создайте GitHub OAuth App**: https://github.com/settings/developers

   ```
   Application name: Gelora Blog CMS
   Homepage URL: https://research.gelora.study
   Authorization callback URL: https://research.gelora.study/admin/oauth
   ```

2. **В Vercel добавьте переменные окружения**:

   ```
   GITHUB_CLIENT_ID=ваш_client_id
   GITHUB_CLIENT_SECRET=ваш_client_secret
   ```

3. **Создайте OAuth handler** в вашем Next.js приложении

### Результат:

- ✅ Админка работает на research.gelora.study/admin
- ✅ Вход через GitHub
- ✅ Прямые коммиты в ваш репозиторий

## 🎯 Метод 2: File-based Admin (работает сейчас)

### Текущий рабочий метод:

1. **Simple File Manager**: https://research.gelora.study/admin/simple.html
2. **Создание файлов** в `data/blog/`
3. **Git commit** → автодеплой

### Workflow:

```
Создать пост.mdx →
Git commit →
Vercel автодеплой →
Пост опубликован
```

## ⚡ Метод 3: Visual Studio Code + GitHub

1. **Клонируете репозиторий** локально
2. **Редактируете в VS Code** с Markdown preview
3. **Коммитите и пушите**
4. **Автодеплой** на research.gelora.study

---

**Рекомендация: Используйте Simple File Manager пока не настроите OAuth!**
