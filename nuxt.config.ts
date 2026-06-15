export default {
  compatibilityDate: '2026-06-15',
  devtools: { enabled: true },
  
  srcDir: 'app/',

  app: {
    head: {
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' 
        }
      ]
    }
  }
}