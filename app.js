/* Viral Thumbnail Maker — core logic (works in browser AND in Node for tests).
   No DOM access at import time. */
(function (root) {
  'use strict';

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

    
  var api = {
    drawThumbnail: drawThumbnail,
    TW: TW, TH: TH
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CreatorTools = api;
})(typeof window !== 'undefined' ? window : globalThis);
