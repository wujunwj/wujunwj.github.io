#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const frontmatter = require('front-matter');
const hljs = require('highlight.js');

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
}

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try { return hljs.highlight(code, { language: lang }).value; } catch (e) {}
    }
    return code;
  },
  gfm: true, breaks: true
});

const renderer = new marked.Renderer();
const originalHeadingRenderer = renderer.heading.bind(renderer);
renderer.heading = function(text, level) {
  const id = slugify(text);
  if (level === 1) {
    return `<h1 id="${id}">${text}</h1>`;
  }
  return `<h${level} id="${id}">${text}</h${level}>`;
};
marked.use({ renderer });

function readTemplate(name) {
  return fs.readFileSync(path.join(__dirname, 'src', 'layouts', `${name}.html`), 'utf8');
}

function extractToc(markdownBody) {
  const headings = [];
  const lines = markdownBody.split('\n');
  let currentH1 = null;
  let currentH2 = null;
  
  for (const line of lines) {
    const h1Match = line.match(/^# (.+)/);
    const h2Match = line.match(/^## (.+)/);
    const h3Match = line.match(/^### (.+)/);
    
    if (h1Match) {
      const id = slugify(h1Match[1]);
      currentH1 = { title: h1Match[1], id, level: 1, children: [] };
      headings.push(currentH1);
      currentH2 = null;
    } else if (h2Match) {
      const id = slugify(h2Match[1]);
      currentH2 = { title: h2Match[1], id, level: 2, children: [] };
      if (currentH1) {
        currentH1.children.push(currentH2);
      } else {
        headings.push(currentH2);
      }
    } else if (h3Match && currentH2) {
      const id = slugify(h3Match[1]);
      currentH2.children.push({ title: h3Match[1], id, level: 3 });
    }
  }
  return headings;
}

function processMarkdown(mdPath) {
  const content = fs.readFileSync(mdPath, 'utf8');
  const { attributes, body } = frontmatter(content);
  const toc = extractToc(body);
  return {
    frontmatter: attributes,
    content: marked(body),
    toc: toc,
    slug: path.basename(mdPath, '.md')
  };
}

function build() {
  console.log('🚀 构建博客...\n');

  const contentDir = path.join(__dirname, 'content', 'posts');
  const outputDir = path.join(__dirname, 'public');

  if (!fs.existsSync(contentDir)) {
    console.error('❌ 目录不存在');
    process.exit(1);
  }

  if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const mdFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md')).map(f => path.join(contentDir, f));
  console.log(`找到 ${mdFiles.length} 篇文章`);

  const posts = [];
  for (const f of mdFiles) {
    const post = processMarkdown(f);
    posts.push(post);
    
    const outDir = path.join(outputDir, 'posts');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    
    function buildTocHtml(toc) {
      if (!toc || toc.length === 0) return '<li><span style="color: var(--text-muted); font-size: 12px;">暂无目录</span></li>';
      let html = '';
      for (const item of toc) {
        const levelClass = item.level === 1 ? 'toc-h1' : (item.level === 2 ? 'toc-h2' : 'toc-h3');
        html += `<li class="${levelClass}"><a href="#${item.id}">${item.title}</a>`;
        if (item.children && item.children.length > 0) {
          html += '<ul>';
          for (const child of item.children) {
            const childLevelClass = child.level === 1 ? 'toc-h1' : (child.level === 2 ? 'toc-h2' : 'toc-h3');
            html += `<li class="${childLevelClass}"><a href="#${child.id}">${child.title}</a>`;
            if (child.children && child.children.length > 0) {
              html += '<ul>';
              for (const grandchild of child.children) {
                html += `<li class="toc-h3"><a href="#${grandchild.id}">${grandchild.title}</a></li>`;
              }
              html += '</ul>';
            }
            html += '</li>';
          }
          html += '</ul>';
        }
        html += '</li>';
      }
      return html;
    }

    const html = readTemplate('post')
      .replace(/\{\{title\}\}/g, post.frontmatter.title || '')
      .replace(/\{\{date\}\}/g, post.frontmatter.date || '')
      .replace(/\{\{category\}\}/g, post.frontmatter.category || '')
      .replace(/\{\{content\}\}/g, post.content)
      .replace(/\{\{excerpt\}\}/g, post.frontmatter.excerpt || '')
      .replace(/\{\{recent-posts\}\}/g, '')
      .replace(/\{\{toc\}\}/g, buildTocHtml(post.toc));
    
    fs.writeFileSync(path.join(outDir, `${post.slug}.html`), html);
    console.log(`✓ ${post.frontmatter.title}`);
  }

  posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

  const postsHtml = posts.map(p => `
    <a href="/posts/${p.slug}.html" class="post-item">
      <h3>${p.frontmatter.title}</h3>
      <div class="meta"><span>${p.frontmatter.date}</span><span>${p.frontmatter.category}</span></div>
      <p class="excerpt">${p.frontmatter.excerpt || ''}</p>
    </a>`).join('\n');

  const recentPosts = posts.slice(0, 5).map(p => `<li><a href="/posts/${p.slug}.html">${p.frontmatter.title}</a></li>`).join('\n');

  const indexHtml = readTemplate('index')
    .replace(/\{\{posts\}\}/g, postsHtml)
    .replace(/\{\{recent-posts\}\}/g, recentPosts);

  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

  const categories = {};
  posts.forEach(p => {
    const cat = p.frontmatter.category || '未分类';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(p);
  });

  for (const [cat, catPosts] of Object.entries(categories)) {
    const catDir = path.join(outputDir, 'categories');
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

    const catHtml = catPosts.map(p => `
      <a href="/posts/${p.slug}.html" class="post-item">
        <h3>${p.frontmatter.title}</h3>
        <div class="meta"><span>${p.frontmatter.date}</span></div>
        <p class="excerpt">${p.frontmatter.excerpt || ''}</p>
      </a>`).join('\n');

    const html = readTemplate('base')
      .replace(/\{\{title\}\}/g, `${cat} - TechBlog`)
      .replace(/\{\{content\}\}/g, `<div class="hero"><h1 class="hero-title">${cat}</h1><p class="hero-subtitle">${catPosts.length} 篇文章</p></div><div class="posts-list">${catHtml}</div>`)
      .replace(/\{\{recent-posts\}\}/g, recentPosts);

    const safeName = cat.replace(/[^\w]/g, '-').toLowerCase();
    fs.writeFileSync(path.join(catDir, `${safeName}.html`), html);
  }

  const assetsSrc = path.join(__dirname, 'src', 'assets');
  const assetsDst = path.join(outputDir, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, assetsDst, { recursive: true });
  }

  console.log('\n✅ 构建完成！');
}

build();