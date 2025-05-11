// entrypoints/example.content.ts
export default defineContentScript({
  matches: ['https://duckduckgo.com/'],
  main(ctx) {
    console.log('内容脚本已注入！');
  },
});
