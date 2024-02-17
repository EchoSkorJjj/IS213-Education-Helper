# Structure

The project directory structure is inspired by the [Hospital Run project](https://github.com/HospitalRun/hospitalrun-frontend).

# I18N configuration

## TODO:

- [ ] Add localstorage hook to persist the user choice
- [ ] create a component to switch the language

# SEO Configuration

## TODO:

- [ ] Add ability to auto generate sitemap.xml
- [ ] More configuration options in the useHead hook to improve SEO

## useHead() hook

useHead hook can be used to update the title and some meta tags for the page itself

```typescript
useHead("My Page Title", {
  description: "Page description",
  keywords: "keyword1, keyword2",
});
```

## Manual edits and changes

1. Please configure the `meta` tag for `theme-color` based on the theme color that you have picked and configured in the chakraUI theme.
2. Also update the public directory to include the following files
   1. /favicon.ico
   2. /apple-touch-icon.png sizes="180x180"
   3. /mask-icon.svg

## Vite PWA configuration

refer to vite.config.ts for more information
