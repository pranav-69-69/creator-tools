/* Creator Tools — core logic (works in browser AND in Node for tests).
   No DOM access at import time: init() is called by the page only. */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Hook & title generator — patterns grounded in 2025-26 Shorts       */
  /* research: first 2.5s decide (64% of viewers), payoff must match   */
  /* the promise, number contrast + question + secret + result-first    */
  /* are the highest-performing openers on Hindi story/motivation      */
  /* Shorts. Templates use {topic}, {n1}, {n2} placeholders.           */
  /* ------------------------------------------------------------------ */

  var HOOK_FAMILIES = [
    {
      id: 'contrast', name: 'Number Contrast', needsNumbers: true,
      hook: {
        hi: ['{topic} — {n1} se {n2} tak, kaise?', '{n1} se shuru karke {n2} tak pahunchne wala — {topic}'],
        hing: ['{topic} — {n1} se {n2} tak, kaise?', '{n1} se shuru karke {n2} tak pahunchne wala — {topic}']
      },
      title: {
        hi: ['{n1} Se {n2} | {topic} Ki Kahani', '{topic} — {n1} Se {n2} Tak'],
        hing: ['{n1} Se {n2} | {topic} Ki Kahani', '{topic} — {n1} Se {n2} Tak']
      }
    },
    {
      id: 'question', name: 'Question Hook', needsNumbers: false,
      hook: {
        hi: ['{topic} — aakhir sach kya hai?', 'Kya aap {topic} ko sach mein jaante ho?'],
        hing: ['{topic} — aakhir sach kya hai?', 'Kya aap {topic} ko sach mein jaante ho?']
      },
      title: {
        hi: ['{topic} Ka Sach Kya Hai?', '{topic} Ko Kaun Jaanta Hai?'],
        hing: ['{topic} Ka Sach Kya Hai?', '{topic} Ko Kaun Jaanta Hai?']
      }
    },
    {
      id: 'secret', name: 'Secret / Reveal', needsNumbers: false,
      hook: {
        hi: ['{topic} ka woh raaz jo koi nahi batata', 'Yeh baat {topic} ke baare mein kisi ne nahi batayi'],
        hing: ['{topic} ka woh raaz jo koi nahi batata', 'Yeh baat {topic} ke baare mein kisi ne nahi batayi']
      },
      title: {
        hi: ['{topic} Ka Chhupa Raaz', '{topic} Ki Ankahee Kahani'],
        hing: ['{topic} Ka Chhupa Raaz', '{topic} Ki Ankahee Kahani']
      }
    },
    {
      id: 'urgency', name: '"Aaj" Urgency', needsNumbers: false,
      hook: {
        hi: ['Aaj {topic} ke baare mein yeh jaan lo, warna der ho jayegi', 'Aaj ka din {topic} ke liye khaas kyun hai?'],
        hing: ['Aaj {topic} ke baare mein yeh jaan lo, warna der ho jayegi', 'Aaj ka din {topic} ke liye khaas kyun hai?']
      },
      title: {
        hi: ['Aaj {topic} Ke Baare Mein Jaan Lo', '{topic} — Aaj Hi Dekho'],
        hing: ['Aaj {topic} Ke Baare Mein Jaan Lo', '{topic} — Aaj Hi Dekho']
      }
    },
    {
      id: 'mistake', name: 'Mistake Audit', needsNumbers: false,
      hook: {
        hi: ['{topic} mein 99% log yeh galti karte hain', 'Agar aap {topic} ko aise dekhte ho, to aap galat ho'],
        hing: ['{topic} mein 99% log yeh galti karte hain', 'Agar aap {topic} ko aise dekhte ho, to aap galat ho']
      },
      title: {
        hi: ['{topic} Mein Sabse Badi Galti', '{topic} — Yeh Galti Mat Karna'],
        hing: ['{topic} Mein Sabse Badi Galti', '{topic} — Yeh Galti Mat Karna']
      }
    },
    {
      id: 'result', name: 'Result First', needsNumbers: false,
      hook: {
        hi: ['{topic} ne sab kuch badal diya — saboot dekh lo', 'Yeh dekh lo — {topic} ka nateeja sabke saamne hai'],
        hing: ['{topic} ne sab kuch badal diya — saboot dekh lo', 'Yeh dekh lo — {topic} ka nateeja sabke saamne hai']
      },
      title: {
        hi: ['{topic} Ka Nateeja Dekh Lo', '{topic} Ne Sab Badal Diya'],
        hing: ['{topic} Ka Nateeja Dekh Lo', '{topic} Ne Sab Badal Diya']
      }
    },
    {
      id: 'paradox', name: 'Paradox', needsNumbers: false,
      hook: {
        hi: ['Sabse ameer, sabse saada — {topic}', '{topic} — jeet bhi, haar bhi, ek hi kahani'],
        hing: ['Sabse ameer, sabse saada — {topic}', '{topic} — jeet bhi, haar bhi, ek hi kahani']
      },
      title: {
        hi: ['Sabse Ameer, Sabse Saada | {topic}', '{topic} — Ulta Sach'],
        hing: ['Sabse Ameer, Sabse Saada | {topic}', '{topic} — Ulta Sach']
      }
    },
    {
      id: 'kaise', name: '"Kaise" Curiosity', needsNumbers: false,
      hook: {
        hi: ['{topic} kaise bana? Poori kahani, end tak dekho', '{topic} kaise hua — kisi ko yakeen nahi hoga'],
        hing: ['{topic} kaise bana? Poori kahani, end tak dekho', '{topic} kaise hua — kisi ko yakeen nahi hoga']
      },
      title: {
        hi: ['{topic} Kaise Bana?', '{topic} Kaise Hua? Poori Kahani'],
        hing: ['{topic} Kaise Bana?', '{topic} Kaise Hua? Poori Kahani']
      }
    },
    {
      id: 'twist', name: 'Twist / Turning Point', needsNumbers: false,
      hook: {
        hi: ['{topic} ka woh mod jisne sab kuch badal diya', 'Ek pal mein sab badal gaya — {topic}'],
        hing: ['{topic} ka woh mod jisne sab kuch badal diya', 'Ek pal mein sab badal gaya — {topic}']
      },
      title: {
        hi: ['{topic} Ka Woh Mod', 'Ek Pal Ne Badal Diya | {topic}'],
        hing: ['{topic} Ka Woh Mod', 'Ek Pal Ne Badal Diya | {topic}']
      }
    },
    {
      id: 'beforeafter', name: 'Before / After', needsNumbers: false,
      hook: {
        hi: ['Pehle koi nahi jaanta tha, aaj duniya jaanti hai — {topic}', 'Kal tak kuch nahi tha, aaj sab kuch hai — {topic}'],
        hing: ['Pehle koi nahi jaanta tha, aaj duniya jaanti hai — {topic}', 'Kal tak kuch nahi tha, aaj sab kuch hai — {topic}']
      },
      title: {
        hi: ['Pehle Vs Ab | {topic}', '{topic} — Pehle Aur Ab'],
        hing: ['Pehle Vs Ab | {topic}', '{topic} — Pehle Aur Ab']
      }
    },
    {
      id: 'lessons', name: 'Lessons / List', needsNumbers: false,
      hook: {
        hi: ['{topic} se seekhne layak 3 baatein', '{topic} ne 3 cheezein sikhayi jo school nahi sikhata'],
        hing: ['{topic} se seekhne layak 3 baatein', '{topic} ne 3 cheezein sikhayi jo school nahi sikhata']
      },
      title: {
        hi: ['{topic} Se 3 Seekh', '3 Baatein Jo {topic} Sikhata Hai'],
        hing: ['{topic} Se 3 Seekh', '3 Baatein Jo {topic} Sikhata Hai']
      }
    },
    {
      id: 'loop', name: 'Loop / Watch Till End', needsNumbers: false,
      hook: {
        hi: ['End tak dekho — {topic} ka twist aapko hila dega', 'Aakhri 5 second mein {topic} ka asli sach'],
        hing: ['End tak dekho — {topic} ka twist aapko hila dega', 'Aakhri 5 second mein {topic} ka asli sach']
      },
      title: {
        hi: ['End Tak Dekho | {topic}', '{topic} Ka Twist — End Tak'],
        hing: ['End Tak Dekho | {topic}', '{topic} Ka Twist — End Tak']
      }
    },
    {
      id: 'pov', name: 'POV + Emotion', needsNumbers: false,
      hook: {
        hi: ['POV: {topic} aapke saamne khada hai', 'Soch lo — agar aap {topic} ki jagah hote to kya karte?'],
        hing: ['POV: {topic} aapke saamne khada hai', 'Soch lo — agar aap {topic} ki jagah hote to kya karte?']
      },
      title: {
        hi: ['POV: {topic}', 'Agar Aap {topic} Hote To?'],
        hing: ['POV: {topic}', 'Agar Aap {topic} Hote To?']
      }
    },
    {
      id: 'challenge', name: 'Challenge / Dare', needsNumbers: false,
      hook: {
        hi: ['Kya aap {topic} ko jaante ho? 90% log nahi jaante', 'Sirf 10 second — {topic} ke baare mein yeh batao to maanunga'],
        hing: ['Kya aap {topic} ko jaante ho? 90% log nahi jaante', 'Sirf 10 second — {topic} ke baare mein yeh batao to maanunga']
      },
      title: {
        hi: ['90% Log Nahi Jaante | {topic}', '{topic} Challenge — 10 Second'],
        hing: ['90% Log Nahi Jaante | {topic}', '{topic} Challenge — 10 Second']
      }
    }
  ];

  var CATEGORY_BOOSTERS = {
    biography: {
      hook: { hi: ['{topic} ka bachpan — garibi se shuruaat, kahan tak pahunche?', '{topic} ki zindagi ka sabse mushkil din kaunsa tha?'],
                hing: ['{topic} ka bachpan — garibi se shuruaat, kahan tak pahunche?', '{topic} ki zindagi ka sabse mushkil din kaunsa tha?'] },
      title: { hi: ['{topic} Ki Poori Kahani', '{topic} — Bachpan Se Shohrat Tak'],
                hing: ['{topic} Ki Poori Kahani', '{topic} — Bachpan Se Shohrat Tak'] },
      tags: ['#Biography', '#SuccessStory', '#Inspiration', '#LifeStory']
    },
    motivation: {
      hook: { hi: ['Haar ke baad bhi {topic} ne haar nahi maani', '{topic} — himmat ki asli kahani'],
                hing: ['Haar ke baad bhi {topic} ne haar nahi maani', '{topic} — himmat ki asli kahani'] },
      title: { hi: ['{topic} — Himmat Ki Kahani', 'Motivation | {topic}'],
                hing: ['{topic} — Himmat Ki Kahani', 'Motivation | {topic}'] },
      tags: ['#Motivation', '#Mindset', '#LifeLessons', '#HindiMotivation']
    },
    facts: {
      hook: { hi: ['{topic} ke baare mein 3 facts jo aapko hairan kar denge', '{topic} — yeh fact sunke aap yakeen nahi karoge'],
                hing: ['{topic} ke baare mein 3 facts jo aapko hairan kar denge', '{topic} — yeh fact sunke aap yakeen nahi karoge'] },
      title: { hi: ['{topic} — 3 Hairan Karne Wale Facts', 'Amazing Facts | {topic}'],
                hing: ['{topic} — 3 Hairan Karne Wale Facts', 'Amazing Facts | {topic}'] },
      tags: ['#Facts', '#AmazingFacts', '#DidYouKnow', '#HindiFacts']
    },
    story: {
      hook: { hi: ['Ek kahani — {topic}, jise sunkar aap soch mein pad jaoge', '{topic} ki kahani suno, end tak'],
                hing: ['Ek kahani — {topic}, jise sunkar aap soch mein pad jaoge', '{topic} ki kahani suno, end tak'] },
      title: { hi: ['{topic} Ki Kahani', 'Real Story | {topic}'],
                hing: ['{topic} Ki Kahani', 'Real Story | {topic}'] },
      tags: ['#Story', '#Kahani', '#RealStory', '#HindiStory']
    },
    money: {
      hook: { hi: ['{topic} se paisa kaise banta hai? Sach jaan lo', '{topic} — business ka woh lesson jo MBA nahi sikhata'],
                hing: ['{topic} se paisa kaise banta hai? Sach jaan lo', '{topic} — business ka woh lesson jo MBA nahi sikhata'] },
      title: { hi: ['{topic} — Business Lesson', 'Paisa Kaise Banta Hai | {topic}'],
                hing: ['{topic} — Business Lesson', 'Paisa Kaise Banta Hai | {topic}'] },
      tags: ['#Business', '#Money', '#Success', '#BusinessMindset']
    }
  };

  var BASE_TAGS = ['#Shorts', '#ViralShorts', '#HindiShorts', '#TrueTurns'];

  function fill(tpl, topic, n1, n2) {
    return tpl.split('{topic}').join(topic).split('{n1}').join(n1 || '').split('{n2}').join(n2 || '');
  }

  function shuffle(arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((rnd || Math.random)() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function generateHooks(topic, category, lang, n1, n2) {
    topic = (topic || '').trim();
    if (!topic) return { hooks: [], titles: [], hashtags: [], error: 'Topic likho pehle.' };
    lang = (lang === 'hing') ? 'hing' : 'hi';
    var hasNumbers = !!(n1 && n2);
    var hooks = [], titles = [];
    var seenH = {}, seenT = {};

    var fams = shuffle(HOOK_FAMILIES);
    fams.forEach(function (fam) {
      if (fam.needsNumbers && !hasNumbers) return;
      var h = fam.hook[lang][Math.floor(Math.random() * fam.hook[lang].length)];
      var t = fam.title[lang][Math.floor(Math.random() * fam.title[lang].length)];
      h = fill(h, topic, n1, n2); t = fill(t, topic, n1, n2);
      if (!seenH[h]) { seenH[h] = 1; hooks.push({ text: h, pattern: fam.name }); }
      if (!seenT[t]) { seenT[t] = 1; titles.push({ text: t, pattern: fam.name }); }
    });

    // Category booster fills any remaining slots (and adds flavour first).
    var boost = CATEGORY_BOOSTERS[category] || CATEGORY_BOOSTERS.story;
    var bh = shuffle(boost.hook[lang]), bt = shuffle(boost.title[lang]);
    bh.forEach(function (h) { h = fill(h, topic, n1, n2); if (hooks.length < 10 && !seenH[h]) { seenH[h] = 1; hooks.push({ text: h, pattern: 'Category Pick' }); } });
    bt.forEach(function (t) { t = fill(t, topic, n1, n2); if (titles.length < 10 && !seenT[t]) { seenT[t] = 1; titles.push({ text: t, pattern: 'Category Pick' }); } });

    // If still short (numbers missing), pad with generic strong openers.
    var padH = [
      fill('{topic} — yeh kahani aapko sochne par majboor kar degi', topic),
      fill('Aaj {topic} ki woh kahani jo har kisi ko sunni chahiye', topic),
      fill('{topic} — ek naam, ek kahani, ek seekh', topic)
    ];
    var padT = [
      fill('{topic} | Must Watch', topic),
      fill('{topic} — Poori Kahani Hindi Mein', topic),
      fill('{topic} Ki Best Kahani', topic)
    ];
    padH.forEach(function (h) { if (hooks.length < 10 && !seenH[h]) { seenH[h] = 1; hooks.push({ text: h, pattern: 'Classic' }); } });
    padT.forEach(function (t) { if (titles.length < 10 && !seenT[t]) { seenT[t] = 1; titles.push({ text: t, pattern: 'Classic' }); } });

    var tags = BASE_TAGS.concat(boost.tags);
    var topicTag = '#' + topic.replace(/[^A-Za-z0-9\u0900-\u097F]+/g, '');
    if (topicTag.length > 1 && tags.indexOf(topicTag) === -1) tags.push(topicTag);

    return { hooks: hooks.slice(0, 10), titles: titles.slice(0, 10), hashtags: tags, error: null };
  }

  /* ------------------------------------------------------------------ */
  /* Thumbnail maker — 1280x720 canvas, 5 templates from 2025-26        */
  /* research: face 20-35% of frame, 2-3 words best (6.8% avg CTR vs   */
  /* 4.3% for 6+ words), bold sans + black stroke, complementary       */
  /* colours, max 2-3 elements, never cover the face, keep text out    */
  /* of the bottom-right duration badge.                                */
  /* ------------------------------------------------------------------ */

  var TW = 1280, TH = 720;
  var FONT_STACK = '"Arial Black", "Impact", "Noto Sans Devanagari", "Mangal", sans-serif';

  function drawCover(ctx, img, x, y, w, h, focusX, focusY) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    var scale = Math.max(w / iw, h / ih);
    var dw = iw * scale, dh = ih * scale;
    var dx = x + (w - dw) * (focusX == null ? 0.5 : focusX);
    var dy = y + (h - dh) * (focusY == null ? 0.5 : focusY);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function strokeFillText(ctx, text, x, y, size, color, align) {
    ctx.font = '900 ' + size + 'px ' + FONT_STACK;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.92)';
    ctx.lineWidth = Math.max(6, size / 7);
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function fitLines(ctx, lines, maxWidth, startSize, minSize) {
    var size = startSize;
    ctx.font = '900 ' + size + 'px ' + FONT_STACK;
    while (size > minSize) {
      var ok = true;
      for (var i = 0; i < lines.length; i++) {
        if (ctx.measureText(lines[i]).width > maxWidth) { ok = false; break; }
      }
      if (ok) break;
      size -= 4;
      ctx.font = '900 ' + size + 'px ' + FONT_STACK;
    }
    return size;
  }

  function darkGradient(ctx, x, y, w, h, horizontal) {
    var g = horizontal
      ? ctx.createLinearGradient(x, 0, x + w, 0)
      : ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, 'rgba(0,0,0,0.88)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.45)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }

  /* state: { img, template, line1, line2, number, color, scale, side, bright, contrast } */
  function drawThumbnail(ctx, st) {
    ctx.clearRect(0, 0, TW, TH);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, TW, TH);
    var sizeMul = st.scale || 1;
    var filter = 'brightness(' + (st.bright == null ? 1 : st.bright) + ') contrast(' + (st.contrast == null ? 1 : st.contrast) + ')';
    var l1 = (st.line1 || '').toUpperCase();
    var l2 = (st.line2 || '').toUpperCase();
    var lines = [];
    if (l1) lines.push(l1);
    if (l2) lines.push(l2);
    if (!lines.length) lines = ['APNI TEXT LIKHO'];

    function photo(x, y, w, h, extraFilter) {
      if (!st.img) {
        ctx.fillStyle = '#2b2b2b'; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#888888'; ctx.font = '900 34px ' + FONT_STACK; ctx.textAlign = 'center';
        ctx.fillText('PHOTO UPLOAD KARO', x + w / 2, y + h / 2);
        return;
      }
      ctx.save();
      ctx.filter = extraFilter || filter;
      drawCover(ctx, st.img, x, y, w, h, 0.5, 0.35);
      ctx.restore();
    }

    if (st.template === 'split') {
      // Before/After: left grey + dark, right vivid, divider, text top.
      photo(0, 0, 640, 720, 'grayscale(1) brightness(0.55) contrast(1.05)');
      photo(640, 0, 640, 720, 'brightness(1.08) contrast(1.12) saturate(1.25)');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(636, 0, 8, 720);
      ctx.font = '900 44px ' + FONT_STACK; ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.lineWidth = 8;
      ctx.strokeText('PEHLE', 320, 90); ctx.fillText('PEHLE', 320, 90);
      ctx.fillStyle = '#FFD400';
      ctx.strokeText('AB', 960, 90); ctx.fillText('AB', 960, 90);
      darkGradient(ctx, 0, 430, 1280, 290, false);
      var s = fitLines(ctx, lines, 1150, Math.round(92 * sizeMul), 40);
      var y = 560;
      lines.forEach(function (ln) { strokeFillText(ctx, ln, 640, y, s, st.color || '#FFD400', 'center'); y += s + 12; });
    } else if (st.template === 'number') {
      // Number Blast: giant number left, photo right, text below number.
      photo(620, 0, 660, 720);
      darkGradient(ctx, 0, 0, 700, 720, true);
      var num = (st.number || '1').toString().toUpperCase();
      ctx.font = '900 ' + Math.round(300 * sizeMul) + 'px ' + FONT_STACK;
      ctx.textAlign = 'left'; ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(0,0,0,0.95)'; ctx.lineWidth = 22;
      ctx.strokeText(num, 40, 330);
      var grad = ctx.createLinearGradient(40, 60, 40, 340);
      grad.addColorStop(0, '#FFD400'); grad.addColorStop(1, '#FF6A00');
      ctx.fillStyle = grad; ctx.fillText(num, 40, 330);
      var s2 = fitLines(ctx, lines, 560, Math.round(84 * sizeMul), 36);
      var y2 = 430;
      lines.forEach(function (ln) { strokeFillText(ctx, ln, 40, y2, s2, st.color || '#FFFFFF', 'left'); y2 += s2 + 10; });
    } else if (st.template === 'shock') {
      // Shock + Red Circle: full-bleed photo, vignette, red circle, text top.
      photo(0, 0, 1280, 720);
      var vg = ctx.createRadialGradient(640, 360, 240, 640, 360, 820);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, 1280, 720);
      ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.ellipse(950, 300, 150, 190, -0.15, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(950, 300); ctx.lineTo(1050, 160);
      ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 14; ctx.stroke();
      darkGradient(ctx, 0, 0, 1280, 260, false);
      var s3 = fitLines(ctx, lines, 1180, Math.round(96 * sizeMul), 40);
      var y3 = 130;
      lines.forEach(function (ln) { strokeFillText(ctx, ln, 640, y3, s3, st.color || '#FFD400', 'center'); y3 += s3 + 12; });
    } else if (st.template === 'cinematic') {
      // Dark Cinematic: full photo, bottom gradient, gold text bottom-left.
      photo(0, 0, 1280, 720);
      darkGradient(ctx, 0, 330, 1280, 390, false);
      ctx.fillStyle = '#FFD400'; ctx.fillRect(60, 470, 120, 8);
      var s4 = fitLines(ctx, lines, 1120, Math.round(88 * sizeMul), 38);
      var y4 = 580;
      lines.forEach(function (ln) { strokeFillText(ctx, ln, 60, y4, s4, st.color || '#FFFFFF', 'left'); y4 += s4 + 12; });
    } else {
      // Default: face-text — photo right, dark gradient left, big text left.
      var photoW = 640;
      var px = (st.side === 'left') ? 0 : TW - photoW;
      var tx = (st.side === 'left') ? photoW : 0;
      photo(px, 0, photoW, 720);
      if (st.side === 'left') darkGradient(ctx, photoW - 40, 0, TW - photoW + 40, 720, true);
      else { var g2 = ctx.createLinearGradient(0, 0, 700, 0); g2.addColorStop(0, 'rgba(0,0,0,0.92)'); g2.addColorStop(0.75, 'rgba(0,0,0,0.35)'); g2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, 700, 720); }
      ctx.fillStyle = '#FFD400'; ctx.font = '900 30px ' + FONT_STACK; ctx.textAlign = 'left';
      ctx.fillText('TRUE TURNS', tx + 50, 90);
      var s5 = fitLines(ctx, lines, 560, Math.round(96 * sizeMul), 38);
      var y5 = 330;
      lines.forEach(function (ln) { strokeFillText(ctx, ln, tx + 50, y5, s5, st.color || '#FFD400', 'left'); y5 += s5 + 12; });
    }
    return { width: TW, height: TH };
  }

  /* ------------------------------------------------------------------ */
  /* Train Berth Position Decoder — berth/seat layouts VERIFIED from   */
  /* multiple independent sources (Nov 2026):                          */
  /*  - SL / 3A: bay of 8, pattern LB,MB,UB,LB,MB,UB,SL,SU repeats.    */
  /*    n mod 8: 1 LB, 2 MB, 3 UB, 4 LB, 5 MB, 6 UB, 7 SL, 0 SU.        */
  /*    Sources: yehsafarhamarahai.com berth guide (mod-8 table),      */
  /*    railmitra.com 3A guide (full berth-number lists to 72),        */
  /*    trainticketdatecalculator.in seat finder, sambalpur.co.in       */
  /*    coach-layout table (numbers 1-80). SL: ICF 72, LHB 80 berths;  */
  /*    3A: ICF 64, LHB 72 — same mod-8 pattern.                       */
  /*  - 2A: bay of 6, pattern LB,UB,LB,UB,SL,SU repeats (no MB).       */
  /*    Sources: trainticketdatecalculator.in (mod-6, SL at 5,11,17..),*/
  /*    sambalpur.co.in table. ICF 46, LHB 54 berths.                  */
  /*  - 3E / Garib Rath: bay of 9, LB,MB,UB,LB,MB,UB,SL,SM,SU.         */
  /*    Sources: trainticketdatecalculator.in, lastberth.com,          */
  /*    sambalpur.co.in (SL 7, SM 8, SU 9 / 16,17,18). 83 berths.      */
  /*  - CC (AC Chair Car, standard ICF Shatabdi layout): first row 4   */
  /*    seats (W,A,A,W), then rows of 5 (W,M,A,A,W) — 3+2 layout.      */
  /*    Sources: sambalpur.co.in + scribd "Train Coach Seating         */
  /*    Arrangements" agree on the exact seat sequence (1 W, 2 A,      */
  /*    3 A, 4 W, 5 W, 6 M, 7 A, 8 A, 9 W, 10 W, 11 M ...);            */
  /*    railmitra.com + railtravels.org confirm 3+2, 5 seats/row,      */
  /*    73-78 seats. NOTE: Vande Bharat end coaches (44 seats) and    */
  /*    Jan Shatabdi (3+3) use different layouts — flagged on page.    */
  /*  - EC (Executive Chair Car, Shatabdi): 2+2, W,A,A,W per row of 4.  */
  /*    Sources: scribd layout table (W A A W repeating), railmitra    */
  /*    Vande Bharat guide (2x2, no middle seat). 56 seats Shatabdi,   */
  /*    52 Vande Bharat — flagged on page.                             */
  /*  - 2S (Second Sitting): 3+3, W,M,A,A,M,W per row of 6. Sources:   */
  /*    trainticketdatecalculator.in, sambalpur.co.in. 108 seats.       */
  /*  - 1A (First AC): NOT covered — cabins/coupes, no fixed repeating */
  /*    pattern (trainticketdatecalculator.in confirms). Tool shows    */
  /*    "not covered yet" with the reason, never a guessed mapping.    */
  /*  Window/aisle side for sleepers: main-bay berths (LB/MB/UB) are   */
  /*  against the window wall; side berths (SL/SM/SU) run along the    */
  /*  aisle/corridor.                                                   */
  /* ------------------------------------------------------------------ */

  var BERTH_TYPE_INFO = {
    LB: { en: 'Lower Berth', hi: 'लोअर बर्थ', sub: 'Neeche wali — sabse aaram, din mein baithne ki seat bhi', side: 'window' },
    MB: { en: 'Middle Berth', hi: 'मिडिल बर्थ', sub: 'Beech wali — sirf raat 10 baje ke baad khulti hai', side: 'window' },
    UB: { en: 'Upper Berth', hi: 'अपर बर्थ', sub: 'Upar wali — sabse shant, chadhna padta hai', side: 'window' },
    SL: { en: 'Side Lower', hi: 'साइड लोअर', sub: 'Galiyare ki neeche wali — din mein 2 log baith sakte hain', side: 'aisle' },
    SM: { en: 'Side Middle', hi: 'साइड मिडिल', sub: 'Galiyare ki beech wali — sirf 3E / Garib Rath mein', side: 'aisle' },
    SU: { en: 'Side Upper', hi: 'साइड अपर', sub: 'Galiyare ki upar wali — privacy achhi, chadhna padta hai', side: 'aisle' },
    W: { en: 'Window Seat', hi: 'खिड़की वाली सीट', sub: 'Bahar ka view — safar ka maza', side: 'window' },
    M: { en: 'Middle Seat', hi: 'बीच वाली सीट', sub: 'Na window, na aisle — beech mein', side: 'middle' },
    A: { en: 'Aisle Seat', hi: 'गलियारे वाली सीट', sub: 'Uthna-baithna sabse aasan', side: 'aisle' }
  };

  var BERTH_COACHES = [
    { id: 'sl', code: 'SL', nameEn: 'Sleeper Class', nameHi: 'स्लीपर क्लास', total: 80, kind: 'sleeper', baySize: 8, sideCount: 2, pattern: ['LB', 'MB', 'UB', 'LB', 'MB', 'UB', 'SL', 'SU'], noteEn: 'ICF coach: 72 berths. LHB coach: 80 berths. Same pattern.', noteHi: 'ICF coach mein 72 berths, LHB mein 80 — pattern same hai.' },
    { id: '3a', code: '3A', nameEn: 'AC 3 Tier', nameHi: 'एसी 3 टियर', total: 72, kind: 'sleeper', baySize: 8, sideCount: 2, pattern: ['LB', 'MB', 'UB', 'LB', 'MB', 'UB', 'SL', 'SU'], noteEn: 'ICF coach: 64 berths. LHB coach: 72 berths. Same pattern.', noteHi: 'ICF coach mein 64 berths, LHB mein 72 — pattern same hai.' },
    { id: '2a', code: '2A', nameEn: 'AC 2 Tier', nameHi: 'एसी 2 टियर', total: 54, kind: 'sleeper', baySize: 6, sideCount: 2, pattern: ['LB', 'UB', 'LB', 'UB', 'SL', 'SU'], noteEn: 'No middle berth in 2A. ICF: 46 berths. LHB: 54 berths.', noteHi: '2A mein middle berth nahi hota. ICF mein 46, LHB mein 54 berths.' },
    { id: '3e', code: '3E', nameEn: 'AC 3 Tier Economy', nameHi: 'एसी 3 टियर इकोनॉमी', total: 83, kind: 'sleeper', baySize: 9, sideCount: 3, pattern: ['LB', 'MB', 'UB', 'LB', 'MB', 'UB', 'SL', 'SM', 'SU'], noteEn: 'Garib Rath coaches use the same 9-berth bay pattern.', noteHi: 'Garib Rath coach mein bhi yahi pattern hai.' },
    { id: 'cc', code: 'CC', nameEn: 'AC Chair Car', nameHi: 'एसी चेयर कार', total: 78, kind: 'chair', rowSize: 5, firstRow: 4, pattern: ['W', 'M', 'A', 'A', 'W'], noteEn: 'Standard Shatabdi / ICF layout (3+2). Vande Bharat end coaches (44 seats) and Jan Shatabdi (3+3) differ — check your ticket.', noteHi: 'Standard Shatabdi / ICF layout (3+2). Vande Bharat ke end coaches (44 seats) aur Jan Shatabdi (3+3) mein layout alag hai — ticket par check karein.' },
    { id: 'ec', code: 'EC', nameEn: 'Executive Chair Car', nameHi: 'एग्ज़ीक्यूटिव चेयर कार', total: 56, kind: 'chair', rowSize: 4, pattern: ['W', 'A', 'A', 'W'], noteEn: 'Shatabdi layout (2+2, no middle seat). Vande Bharat / Tejas: 52 seats, layout may differ — check your ticket.', noteHi: 'Shatabdi layout (2+2, beech wali seat nahi). Vande Bharat / Tejas mein 52 seats, layout alag ho sakta hai — ticket par check karein.' },
    { id: '2s', code: '2S', nameEn: 'Second Sitting', nameHi: 'सेकंड सिटिंग', total: 108, kind: 'chair', rowSize: 6, pattern: ['W', 'M', 'A', 'A', 'M', 'W'], noteEn: '3+3 seating, 6 seats per row.', noteHi: '3+3 seating, har row mein 6 seats.' },
    { id: '1a', code: '1A', nameEn: 'First AC', nameHi: 'फर्स्ट एसी', total: 24, kind: 'sleeper', covered: false, noteEn: 'Cabins and coupes — no fixed repeating pattern. Seat number alone cannot tell the berth. Check the IRCTC coach layout for your train.', noteHi: 'Cabins aur coupe hote hain — koi fixed pattern nahi. Sirf seat number se berth pata nahi chalti. Apni train ka IRCTC coach layout dekhein.' }
  ];

  function berthCoachById(id) {
    for (var i = 0; i < BERTH_COACHES.length; i++) if (BERTH_COACHES[i].id === id) return BERTH_COACHES[i];
    return BERTH_COACHES[0];
  }

  function decodeBerth(coachId, seatRaw) {
    var coach = berthCoachById(coachId);
    var seat = parseInt(String(seatRaw).trim(), 10);
    if (coach.covered === false) {
      return { ok: false, covered: false, coach: coach, seat: seat, errorEn: 'First AC (1A) is not covered yet — cabins and coupes have no fixed pattern.', errorHi: 'First AC (1A) abhi covered nahi hai — cabins aur coupe ka koi fixed pattern nahi hota.' };
    }
    if (isNaN(seat) || String(seatRaw).trim() === '') {
      return { ok: false, coach: coach, seat: seat, errorEn: 'Please type your berth / seat number.', errorHi: 'Apna berth / seat number likho.' };
    }
    if (seat < 1 || seat > coach.total) {
      return { ok: false, coach: coach, seat: seat, errorEn: 'This coach has only berths 1 to ' + coach.total + '. Please check your ticket number.', errorHi: 'Is coach mein sirf 1 se ' + coach.total + ' tak berths hain. Apna number dobara check karo.' };
    }
    var code, group, groupSeats = [];
    if (coach.kind === 'sleeper') {
      var idx = (seat - 1) % coach.baySize;
      code = coach.pattern[idx];
      var bay = Math.floor((seat - 1) / coach.baySize) + 1;
      var bayStart = (bay - 1) * coach.baySize + 1;
      var bayEnd = Math.min(bay * coach.baySize, coach.total);
      group = { kind: 'bay', no: bay, start: bayStart, end: bayEnd, total: Math.ceil(coach.total / coach.baySize) };
      for (var n = bayStart; n <= bayEnd; n++) {
        groupSeats.push({ n: n, code: coach.pattern[(n - 1) % coach.baySize] });
      }
    } else {
      var row, rowStart, rowEnd;
      if (coach.firstRow) {
        if (seat <= coach.firstRow) {
          code = ['W', 'A', 'A', 'W'][seat - 1];
          row = 1; rowStart = 1; rowEnd = coach.firstRow;
        } else {
          var off = seat - coach.firstRow - 1;
          code = coach.pattern[off % coach.rowSize];
          row = 2 + Math.floor(off / coach.rowSize);
          rowStart = coach.firstRow + 1 + (row - 2) * coach.rowSize;
          rowEnd = Math.min(rowStart + coach.rowSize - 1, coach.total);
        }
      } else {
        code = coach.pattern[(seat - 1) % coach.rowSize];
        row = Math.floor((seat - 1) / coach.rowSize) + 1;
        rowStart = (row - 1) * coach.rowSize + 1;
        rowEnd = Math.min(row * coach.rowSize, coach.total);
      }
      group = { kind: 'row', no: row, start: rowStart, end: rowEnd, total: Math.ceil((coach.total - (coach.firstRow || 0)) / coach.rowSize) + (coach.firstRow ? 1 : 0) };
      for (var m = rowStart; m <= rowEnd; m++) {
        var c2;
        if (coach.firstRow && m <= coach.firstRow) c2 = ['W', 'A', 'A', 'W'][m - 1];
        else if (coach.firstRow) c2 = coach.pattern[(m - coach.firstRow - 1) % coach.rowSize];
        else c2 = coach.pattern[(m - 1) % coach.rowSize];
        groupSeats.push({ n: m, code: c2 });
      }
    }
    var info = BERTH_TYPE_INFO[code];
    var sideLabel = info.side === 'window' ? { en: 'Window side', hi: 'खिड़की की तरफ' }
      : info.side === 'aisle' ? { en: 'Aisle side', hi: 'गलियारे की तरफ' }
      : { en: 'Middle seat', hi: 'बीच वाली सीट' };
    return { ok: true, coach: coach, seat: seat, code: code, typeEn: info.en, typeHi: info.hi, tip: info.sub, side: info.side, sideEn: sideLabel.en, sideHi: sideLabel.hi, group: group, groupSeats: groupSeats };
  }

  var api = {
    generateHooks: generateHooks,
    drawThumbnail: drawThumbnail,
    decodeBerth: decodeBerth,
    berthCoachById: berthCoachById,
    BERTH_COACHES: BERTH_COACHES,
    BERTH_TYPE_INFO: BERTH_TYPE_INFO,
    HOOK_FAMILIES: HOOK_FAMILIES,
    CATEGORY_BOOSTERS: CATEGORY_BOOSTERS,
    TW: TW, TH: TH
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CreatorTools = api;
})(typeof window !== 'undefined' ? window : globalThis);
