(() => {
  const slug = window.location.pathname.split('/').filter(Boolean).pop();

  const formatNum = (n) => new Intl.NumberFormat('ko-KR').format(Math.round(n || 0));

  if (slug === 'text-counter') {
    const input = document.getElementById('tc-input'); if (!input) return;
    const chars = document.getElementById('tc-chars');
    const noSpaces = document.getElementById('tc-no-spaces');
    const words = document.getElementById('tc-words');
    const bytes = document.getElementById('tc-bytes');
    const update = () => {
      const v = input.value || '';
      chars.textContent = formatNum(v.length);
      noSpaces.textContent = formatNum(v.replace(/\s/g, '').length);
      words.textContent = formatNum((v.trim().match(/\S+/g) || []).length);
      bytes.textContent = formatNum(new TextEncoder().encode(v).length);
    };
    input.addEventListener('input', update); update();
  }

  if (slug === 'vat-calculator') {
    const mode = document.getElementById('vat-mode');
    const amt = document.getElementById('vat-amount');
    const s = document.getElementById('vat-supply');
    const t = document.getElementById('vat-tax');
    const total = document.getElementById('vat-total');
    const calc = () => {
      const v = Number(amt.value || 0);
      let supply = 0, tax = 0, sum = 0;
      if ((mode.value || 'supply') === 'supply') {
        supply = v; tax = v * 0.1; sum = supply + tax;
      } else {
        sum = v; supply = v / 1.1; tax = sum - supply;
      }
      s.textContent = formatNum(supply);
      t.textContent = formatNum(tax);
      total.textContent = formatNum(sum);
    };
    mode.addEventListener('change', calc); amt.addEventListener('input', calc); calc();
  }

  if (slug === 'unit-converter') {
    const type = document.getElementById('uc-type');
    const value = document.getElementById('uc-value');
    const from = document.getElementById('uc-from');
    const to = document.getElementById('uc-to');
    const out = document.getElementById('uc-result');

    const maps = {
      length: { m:1, cm:0.01, km:1000, inch:0.0254, ft:0.3048 },
      weight: { kg:1, g:0.001, lb:0.45359237, oz:0.028349523125 },
      temperature: { c: 'c', f: 'f', k: 'k' }
    };

    const labels = {
      length: [['m','m'],['cm','cm'],['km','km'],['inch','inch'],['ft','ft']],
      weight: [['kg','kg'],['g','g'],['lb','lb'],['oz','oz']],
      temperature: [['c','℃'],['f','℉'],['k','K']]
    };

    const fillUnits = () => {
      const t = type.value || 'length';
      const opts = labels[t] || labels.length;
      from.innerHTML = opts.map(([v,l]) => `<option value="${v}">${l}</option>`).join('');
      to.innerHTML = opts.map(([v,l]) => `<option value="${v}">${l}</option>`).join('');
      if (opts.length > 1) to.selectedIndex = 1;
      run();
    };

    const convertTemp = (v, f, t) => {
      let c = v;
      if (f === 'f') c = (v - 32) * 5 / 9;
      if (f === 'k') c = v - 273.15;
      if (t === 'f') return c * 9 / 5 + 32;
      if (t === 'k') return c + 273.15;
      return c;
    };

    const run = () => {
      const t = type.value || 'length';
      const v = Number(value.value || 0);
      let result = 0;
      if (t === 'temperature') {
        result = convertTemp(v, from.value, to.value);
      } else {
        const map = maps[t];
        const base = v * (map[from.value] || 1);
        result = base / (map[to.value] || 1);
      }
      out.textContent = `결과: ${result.toLocaleString('ko-KR', { maximumFractionDigits: 6 })} ${to.options[to.selectedIndex]?.text || ''}`;
    };

    [type, value, from, to].forEach(el => el?.addEventListener('input', run));
    type?.addEventListener('change', fillUnits);
    fillUnits();
  }

  if (slug === 'timezone-converter') {
    const from = document.getElementById('tz-from');
    const to = document.getElementById('tz-to');
    const dt = document.getElementById('tz-datetime');
    const out = document.getElementById('tz-result');

    if (dt && !dt.value) {
      const n = new Date();
      dt.value = new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0,16);
    }

    const getParts = (date, timeZone) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      }).formatToParts(date);
      const map = {};
      parts.forEach(p => { if (p.type !== 'literal') map[p.type] = p.value; });
      return map;
    };

    const zonedToUtc = (dateStr, timeZone) => {
      const [d, t] = dateStr.split('T');
      if (!d || !t) return null;
      const [Y, M, D] = d.split('-').map(Number);
      const [h, m] = t.split(':').map(Number);
      let utc = Date.UTC(Y, M - 1, D, h, m, 0);

      for (let i = 0; i < 3; i++) {
        const parts = getParts(new Date(utc), timeZone);
        const asUTC = Date.UTC(
          Number(parts.year), Number(parts.month) - 1, Number(parts.day),
          Number(parts.hour), Number(parts.minute), Number(parts.second || 0)
        );
        const target = Date.UTC(Y, M - 1, D, h, m, 0);
        utc += target - asUTC;
      }
      return new Date(utc);
    };

    const run = () => {
      if (!dt.value) return;
      const utcDate = zonedToUtc(dt.value, from.value);
      if (!utcDate) return;
      const text = new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: to.value
      }).format(utcDate);
      out.textContent = `${from.options[from.selectedIndex].text} 기준 → ${to.options[to.selectedIndex].text}: ${text}`;
    };

    [from, to, dt].forEach(el => el.addEventListener('input', run));
    run();
  }

  if (slug === 'case-converter') {
    const input = document.getElementById('cc-input');
    const output = document.getElementById('cc-output');
    document.querySelectorAll('.cc-grid button').forEach(btn => btn.addEventListener('click', () => {
      const t = input.value || '';
      const mode = btn.dataset.mode;
      const words = t.trim().split(/[^A-Za-z0-9가-힣]+/).filter(Boolean);
      let r = t;
      if (mode === 'upper') r = t.toUpperCase();
      if (mode === 'lower') r = t.toLowerCase();
      if (mode === 'title') r = t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      if (mode === 'camel') r = words.map((w,i)=> i? w[0].toUpperCase()+w.slice(1).toLowerCase(): w.toLowerCase()).join('');
      if (mode === 'snake') r = words.map(w=>w.toLowerCase()).join('_');
      output.value = r;
    }));
  }

  const drawResize = (fileInputId, wId, hId, runId, canvasId, linkId, mime='image/png', quality=0.92) => {
    const f = document.getElementById(fileInputId);
    const w = document.getElementById(wId);
    const h = document.getElementById(hId);
    const run = document.getElementById(runId);
    const canvas = document.getElementById(canvasId);
    const link = document.getElementById(linkId);
    const lock = document.getElementById('ir-lock');
    const preset = document.getElementById('ir-preset');
    const result = document.getElementById('ir-result');
    if (!f || !run || !canvas || !link) return;
    let img = null;
    let ratio = 1;
    let originBytes = 0;

    const updateResult = (width, height, outBytes = 0) => {
      if (!result) return;
      if (!outBytes) {
        result.textContent = `원본: ${img?.width || 0}×${img?.height || 0}px / ${formatNum(originBytes)} bytes`;
      } else {
        result.textContent = `원본: ${img?.width || 0}×${img?.height || 0}px → 결과: ${width}×${height}px / ${formatNum(outBytes)} bytes`;
      }
    };

    f.addEventListener('change', () => {
      const file = f.files?.[0]; if (!file) return;
      originBytes = file.size || 0;
      const u = URL.createObjectURL(file);
      const i = new Image();
      i.onload = () => {
        img = i;
        ratio = i.width / i.height;
        if (w) w.value = i.width;
        if (h) h.value = i.height;
        updateResult(i.width, i.height);
        URL.revokeObjectURL(u);
      };
      i.src = u;
    });

    preset?.addEventListener('change', () => {
      if (!preset.value || preset.value === 'custom') return;
      const [pw, ph] = preset.value.split('x').map(Number);
      if (w) w.value = pw;
      if (h) h.value = ph;
    });

    w?.addEventListener('input', () => {
      if (!img || !lock?.checked) return;
      const width = Number(w.value || img.width);
      if (h) h.value = Math.max(1, Math.round(width / ratio));
    });

    h?.addEventListener('input', () => {
      if (!img || !lock?.checked) return;
      const height = Number(h.value || img.height);
      if (w) w.value = Math.max(1, Math.round(height * ratio));
    });

    run.addEventListener('click', () => {
      if (!img) return;
      const width = Number(w?.value || img.width);
      const height = Number(h?.value || img.height);
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const data = canvas.toDataURL(mime, quality);
      link.href = data;
      const outBytes = Math.floor((data.length * 3) / 4);
      updateResult(width, height, outBytes);
    });
  };

  if (slug === 'image-resizer') drawResize('ir-file','ir-width','ir-height','ir-run','ir-canvas','ir-download','image/png',0.92);

  if (slug === 'png-compressor') {
    const file = document.getElementById('pc-file');
    const q = document.getElementById('pc-quality');
    const format = document.getElementById('pc-format');
    const run = document.getElementById('pc-run');
    const canvas = document.getElementById('pc-canvas');
    const link = document.getElementById('pc-download');
    const result = document.getElementById('pc-result');
    let img = null;
    let originSize = 0;

    const extByMime = (mime) => {
      if (mime === 'image/jpeg') return 'jpg';
      if (mime === 'image/png') return 'png';
      return 'webp';
    };

    file?.addEventListener('change', () => {
      const f = file.files?.[0]; if (!f) return;
      originSize = f.size || 0;
      const u = URL.createObjectURL(f);
      const i = new Image();
      i.onload = () => { img = i; URL.revokeObjectURL(u); };
      i.src = u;
      if (result) result.textContent = `원본 크기: ${formatNum(originSize)} bytes`;
    });

    run?.addEventListener('click', () => {
      if (!img) return;
      const mime = format?.value || 'image/webp';
      const quality = Number(q.value || 0.8);
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);

      const data = canvas.toDataURL(mime, quality);
      link.href = data;
      link.download = `compressed.${extByMime(mime)}`;

      const compressedBytes = Math.floor((data.length * 3) / 4);
      const ratio = originSize ? ((1 - compressedBytes / originSize) * 100) : 0;
      if (result) {
        result.textContent = `원본: ${formatNum(originSize)} bytes → 압축: ${formatNum(compressedBytes)} bytes (약 ${ratio.toFixed(1)}% 절감)`;
      }
    });
  }

  if (slug === 'youtube-image-kit') {
    const file = document.getElementById('ytk-file');
    const fit = document.getElementById('ytk-fit');
    const bg = document.getElementById('ytk-bg');
    const run = document.getElementById('ytk-run');
    const wrap = document.getElementById('ytk-list');
    const result = document.getElementById('ytk-result');
    const allBtn = document.getElementById('ytk-download-all');

    const targets = [
      { key: 'thumbnail', label: '유튜브 썸네일', w: 1280, h: 720 },
      { key: 'shorts-cover', label: '쇼츠 커버', w: 1080, h: 1920 },
      { key: 'channel-banner', label: '채널 배너', w: 2560, h: 1440 },
      { key: 'channel-icon', label: '채널 아이콘', w: 800, h: 800 },
      { key: 'watermark', label: '워터마크', w: 150, h: 150 }
    ];

    let img = null;
    let renders = [];

    const drawFrame = (ctx, image, w, h, mode, bgColor) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);
      const scale = mode === 'cover'
        ? Math.max(w / image.width, h / image.height)
        : Math.min(w / image.width, h / image.height);
      const dw = image.width * scale;
      const dh = image.height * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(image, dx, dy, dw, dh);
    };

    file?.addEventListener('change', () => {
      const f = file.files?.[0];
      if (!f) return;
      const u = URL.createObjectURL(f);
      const i = new Image();
      i.onload = () => {
        img = i;
        URL.revokeObjectURL(u);
        if (result) result.textContent = `원본: ${i.width}x${i.height}px · 생성 준비 완료`;
      };
      i.src = u;
    });

    run?.addEventListener('click', () => {
      if (!img || !wrap) return;
      wrap.innerHTML = '';
      renders = [];
      targets.forEach((t) => {
        const card = document.createElement('div');
        card.className = 'ytk-card';

        const canvas = document.createElement('canvas');
        canvas.width = t.w;
        canvas.height = t.h;
        const ctx = canvas.getContext('2d');
        drawFrame(ctx, img, t.w, t.h, fit.value || 'cover', bg?.value || '#0f172a');

        const link = document.createElement('a');
        link.className = 'open-link';
        link.textContent = `${t.label} 다운로드`;
        link.download = `${t.key}-${t.w}x${t.h}.png`;
        link.href = canvas.toDataURL('image/png');

        const title = document.createElement('strong');
        title.textContent = `${t.label} (${t.w}x${t.h})`;

        card.appendChild(title);
        card.appendChild(canvas);
        card.appendChild(link);
        wrap.appendChild(card);

        renders.push(link);
      });
      if (result) result.textContent = `${targets.length}개 출력 이미지를 생성했습니다.`;
    });

    allBtn?.addEventListener('click', async () => {
      for (const a of renders) {
        a.click();
        await new Promise((r) => setTimeout(r, 180));
      }
    });
  }

  if (slug === 'percent-calculator') {
    const mode = document.getElementById('pct-mode');
    const fields = {
      'percent-of': document.getElementById('pct-fields-percent-of'),
      ratio: document.getElementById('pct-fields-ratio'),
      change: document.getElementById('pct-fields-change')
    };

    const inputs = {
      base: document.getElementById('pct-base'),
      rate: document.getElementById('pct-rate'),
      part: document.getElementById('pct-part'),
      whole: document.getElementById('pct-whole'),
      old: document.getElementById('pct-old'),
      now: document.getElementById('pct-new')
    };

    const main = document.getElementById('pct-result-main');
    const sub = document.getElementById('pct-result-sub');
    const diff = document.getElementById('pct-result-diff');
    const type = document.getElementById('pct-result-type');
    const help = document.getElementById('pct-help');

    if (!mode || !main || !sub || !diff || !type || !help) return;

    const fmt = (v, max = 4) => {
      if (!Number.isFinite(v)) return '-';
      return v.toLocaleString('ko-KR', { maximumFractionDigits: max });
    };

    const showByMode = () => {
      Object.entries(fields).forEach(([k, el]) => {
        if (el) el.hidden = k !== mode.value;
      });
    };

    const render = () => {
      const currentMode = mode.value || 'percent-of';
      showByMode();

      if (currentMode === 'percent-of') {
        const base = Number(inputs.base?.value || 0);
        const rate = Number(inputs.rate?.value || 0);
        const result = base * (rate / 100);

        main.textContent = `${fmt(result)} `;
        sub.textContent = `${fmt(rate)}%`;
        diff.textContent = `${fmt(base - result)} `;
        type.textContent = result === 0 ? '0%' : (result > 0 ? '양수 결과' : '음수 결과');
        help.textContent = `${fmt(base)}의 ${fmt(rate)}% = ${fmt(result)}`;
      }

      if (currentMode === 'ratio') {
        const part = Number(inputs.part?.value || 0);
        const whole = Number(inputs.whole?.value || 0);

        if (whole === 0) {
          main.textContent = '-';
          sub.textContent = '-';
          diff.textContent = '-';
          type.textContent = '계산 불가';
          help.textContent = '전체값(B)이 0이면 백분율을 계산할 수 없습니다.';
          return;
        }

        const ratio = (part / whole) * 100;
        const remain = whole - part;

        main.textContent = `${fmt(ratio)}%`;
        sub.textContent = `${fmt(part)} / ${fmt(whole)}`;
        diff.textContent = `${fmt(remain)} `;
        type.textContent = ratio > 100 ? '100% 초과' : '정상 범위';
        help.textContent = `${fmt(part)}는 ${fmt(whole)}의 ${fmt(ratio)}%입니다.`;
      }

      if (currentMode === 'change') {
        const oldVal = Number(inputs.old?.value || 0);
        const newVal = Number(inputs.now?.value || 0);

        if (oldVal === 0) {
          main.textContent = '-';
          sub.textContent = '-';
          diff.textContent = `${fmt(newVal - oldVal)}`;
          type.textContent = '계산 불가';
          help.textContent = '이전값이 0이면 증감률(%)을 계산할 수 없습니다.';
          return;
        }

        const delta = newVal - oldVal;
        const rate = (delta / oldVal) * 100;

        main.textContent = `${fmt(rate)}%`;
        sub.textContent = `${fmt(oldVal)} → ${fmt(newVal)}`;
        diff.textContent = `${fmt(delta)} `;
        type.textContent = delta > 0 ? '증가' : (delta < 0 ? '감소' : '변화 없음');
        help.textContent = `이전값 ${fmt(oldVal)} 대비 ${fmt(newVal)}는 ${fmt(rate)}% ${delta > 0 ? '증가' : (delta < 0 ? '감소' : '변화 없음')}입니다.`;
      }
    };

    mode.addEventListener('change', render);
    Object.values(inputs).forEach((input) => input?.addEventListener('input', render));
    render();
  }

  if (slug === 'font-change') {
    const input = document.getElementById('fc-input');
    const list = document.getElementById('fc-list');
    const toast = document.getElementById('fc-toast');
    if (!input || !list) return;

    const mapByOffset = (str, startUpper, startLower, startDigit = null) =>
      Array.from(str).map((ch) => {
        const code = ch.codePointAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(startUpper + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(startLower + (code - 97));
        if (startDigit !== null && code >= 48 && code <= 57) return String.fromCodePoint(startDigit + (code - 48));
        return ch;
      }).join('');

    const enclosed = (str, upperBase, lowerBase, digitMap = null) =>
      Array.from(str).map((ch) => {
        const code = ch.codePointAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(upperBase + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(lowerBase + (code - 97));
        if (digitMap && code >= 48 && code <= 57) return digitMap[code - 48] || ch;
        return ch;
      }).join('');

    const upsideMap = {
      a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',
      A:'∀',B:'𐐒',C:'Ɔ',D:'◖',E:'Ǝ',F:'Ⅎ',G:'⅁',H:'H',I:'I',J:'ſ',K:'⋊',L:'˥',M:'W',N:'N',O:'O',P:'Ԁ',Q:'Ό',R:'ᴚ',S:'S',T:'⊥',U:'∩',V:'Λ',W:'M',X:'X',Y:'⅄',Z:'Z',
      '1':'⇂','2':'ᄅ','3':'Ɛ','4':'ㄣ','5':'ϛ','6':'9','7':'ㄥ','8':'8','9':'6','0':'0'
    };

    const fontMap = [
      { key: 'normal', label: 'Normal', convert: (s) => s },

      // Serif
      { key: 'bold', label: 'Bold (Serif)', convert: (s) => mapByOffset(s, 0x1D400, 0x1D41A, 0x1D7CE) },
      { key: 'italic', label: 'Italic (Serif)', convert: (s) => mapByOffset(s, 0x1D434, 0x1D44E) },
      { key: 'bold-italic', label: 'Bold Italic (Serif)', convert: (s) => mapByOffset(s, 0x1D468, 0x1D482) },

      // Sans-serif
      { key: 'sans', label: 'Sans', convert: (s) => mapByOffset(s, 0x1D5A0, 0x1D5BA, 0x1D7E2) },
      { key: 'sans-bold', label: 'Sans Bold', convert: (s) => mapByOffset(s, 0x1D5D4, 0x1D5EE, 0x1D7EC) },
      { key: 'sans-italic', label: 'Sans Italic', convert: (s) => mapByOffset(s, 0x1D608, 0x1D622) },
      { key: 'sans-bold-italic', label: 'Sans Bold Italic', convert: (s) => mapByOffset(s, 0x1D63C, 0x1D656) },

      // Script / Fraktur
      { key: 'script', label: 'Script', convert: (s) => mapByOffset(s, 0x1D49C, 0x1D4B6) },
      { key: 'script-bold', label: 'Script Bold', convert: (s) => mapByOffset(s, 0x1D4D0, 0x1D4EA) },
      { key: 'fraktur', label: 'Fraktur', convert: (s) => mapByOffset(s, 0x1D504, 0x1D51E) },
      { key: 'fraktur-bold', label: 'Fraktur Bold', convert: (s) => mapByOffset(s, 0x1D56C, 0x1D586) },

      // Special
      { key: 'double-struck', label: 'Double Struck', convert: (s) => mapByOffset(s, 0x1D538, 0x1D552, 0x1D7D8) },
      { key: 'monospace', label: 'Monospace', convert: (s) => mapByOffset(s, 0x1D670, 0x1D68A, 0x1D7F6) },
      { key: 'small-caps', label: 'Small Caps', convert: (s) => s.replace(/[a-z]/g, (c) => ({a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'}[c] || c)) },

      // Decoration
      { key: 'circled', label: 'Circled', convert: (s) => enclosed(s, 0x24B6, 0x24D0, ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨']) },
      { key: 'circled-negative', label: 'Circled Negative', convert: (s) => Array.from(s).map((ch) => {
        const c = ch.codePointAt(0);
        if (c >= 65 && c <= 90) return String.fromCodePoint(0x1F150 + (c - 65));
        return ch;
      }).join('') },
      { key: 'squared', label: 'Squared', convert: (s) => Array.from(s).map((ch) => {
        const c = ch.codePointAt(0);
        if (c >= 65 && c <= 90) return String.fromCodePoint(0x1F130 + (c - 65));
        return ch;
      }).join('') },
      { key: 'squared-negative', label: 'Squared Negative', convert: (s) => Array.from(s).map((ch) => {
        const c = ch.codePointAt(0);
        if (c >= 65 && c <= 90) return String.fromCodePoint(0x1F170 + (c - 65));
        return ch;
      }).join('') },
      { key: 'parenthesized', label: 'Parenthesized', convert: (s) => Array.from(s).map((ch) => {
        const c = ch.codePointAt(0);
        if (c >= 97 && c <= 122) return String.fromCodePoint(0x249C + (c - 97));
        return ch;
      }).join('') },

      // Other transforms
      { key: 'full-width', label: 'Full-width', convert: (s) => mapByOffset(s, 0xFF21, 0xFF41, 0xFF10) },
      { key: 'upside-down', label: 'Upside Down', convert: (s) => Array.from(s).reverse().map((c) => upsideMap[c] || c).join('') },
      { key: 'strike-through', label: 'Strike Through', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0336`).join('') },
      { key: 'underline', label: 'Underline', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0332`).join('') },
      { key: 'slash', label: 'Slash', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0337`).join('') },
      { key: 'crossed', label: 'Crossed', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0335`).join('') },
      { key: 'overline', label: 'Overline', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0305`).join('') },
      { key: 'underline-overline', label: 'Underline + Overline', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0332\u0305`).join('') },
      { key: 'long-strike', label: 'Long Strikethrough', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0338`).join('') },
      { key: 'double-slash', label: 'Slash x3', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0337\u0337\u0337`).join('') },
      { key: 'regional-indicator', label: 'Regional Indicator', convert: (s) => Array.from(s).map((ch) => {
        const code = ch.toUpperCase().codePointAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F1E6 + (code - 65));
        return ch;
      }).join(' ') },
      { key: 'superscript', label: 'Superscript', convert: (s) => s.replace(/[A-Za-z0-9+-=()]/g, (c) => ({
        a:'ᵃ',b:'ᵇ',c:'ᶜ',d:'ᵈ',e:'ᵉ',f:'ᶠ',g:'ᵍ',h:'ʰ',i:'ᶦ',j:'ʲ',k:'ᵏ',l:'ˡ',m:'ᵐ',n:'ⁿ',o:'ᵒ',p:'ᵖ',q:'ᑫ',r:'ʳ',s:'ˢ',t:'ᵗ',u:'ᵘ',v:'ᵛ',w:'ʷ',x:'ˣ',y:'ʸ',z:'ᶻ',
        A:'ᴬ',B:'ᴮ',C:'ᶜ',D:'ᴰ',E:'ᴱ',F:'ᶠ',G:'ᴳ',H:'ᴴ',I:'ᴵ',J:'ᴶ',K:'ᴷ',L:'ᴸ',M:'ᴹ',N:'ᴺ',O:'ᴼ',P:'ᴾ',Q:'Q',R:'ᴿ',S:'ˢ',T:'ᵀ',U:'ᵁ',V:'ⱽ',W:'ᵂ',X:'ˣ',Y:'ʸ',Z:'ᶻ',
        '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾'
      }[c] || c)) },
      { key: 'subscript', label: 'Subscript', convert: (s) => s.replace(/[A-Za-z0-9+-=()]/g, (c) => ({
        a:'ₐ',b:'ᵦ',c:'𝒸',d:'ᑯ',e:'ₑ',f:'𝒻',g:'₉',h:'ₕ',i:'ᵢ',j:'ⱼ',k:'ₖ',l:'ₗ',m:'ₘ',n:'ₙ',o:'ₒ',p:'ₚ',q:'૧',r:'ᵣ',s:'ₛ',t:'ₜ',u:'ᵤ',v:'ᵥ',w:'w',x:'ₓ',y:'ᵧ',z:'₂',
        A:'ₐ',B:'ᵦ',C:'𝒸',D:'ᑯ',E:'ₑ',F:'𝒻',G:'₉',H:'ₕ',I:'ᵢ',J:'ⱼ',K:'ₖ',L:'ₗ',M:'ₘ',N:'ₙ',O:'ₒ',P:'ₚ',Q:'૧',R:'ᵣ',S:'ₛ',T:'ₜ',U:'ᵤ',V:'ᵥ',W:'w',X:'ₓ',Y:'ᵧ',Z:'₂',
        '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','=':'₌','(':'₍',')':'₎'
      }[c] || c)) },
      { key: 'cloud-top', label: 'Top Mark (diaeresis)', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0308`).join('') },
      { key: 'double-top', label: 'Top Mark (double)', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0308\u030e`).join('') },
      { key: 'dot-below', label: 'Bottom Mark', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0324\u032e`).join('') },
      { key: 'zigzag-combo', label: 'Complex Combo', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u0324\u032b\u035a`).join('') },
      { key: 'joiner', label: 'Joiner Style', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u035c\u0361`).join('') },
      { key: 'spark-combo', label: 'Spark Combo', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u02df\u02da`).join('') },
      { key: 'khmer-mark', label: 'Khmer Mark', convert: (s) => Array.from(s).map((c) => c === ' ' ? c : `${c}\u1ABA`).join('') },
      { key: 'thai-comb-1a5a', label: 'Combining ᩚ', convert: (s) => {
        const glueChar = '\u1A5A';
        return s.split('').map((ch) => (ch === ' ' ? ch : ch + glueChar)).join('');
      } },
      { key: 'wing-only', label: 'Wing Only', convert: (s) =>
        s.split('')
          .filter((c) => c !== ' ')
          .map((c) => `ʚ${c}ɞ`)
          .join(' ') },
      { key: 'alt-alpha', label: 'Alt Alpha', convert: (s) => s.replace(/[asxcASXC]/g, (c) => ({a:'α',s:'ʂ',x:'x',c:'ƈ',A:'Λ',S:'Ƨ',X:'X',C:'ᄃ'}[c] || c)) },
      { key: 'alt-cyrillic', label: 'Alt Cyrillic', convert: (s) => s.replace(/[asxcASXC]/g, (c) => ({a:'д',s:'ѕ',x:'х',c:'с',A:'Д',S:'Ѕ',X:'Х',C:'С'}[c] || c)) },
      { key: 'alt-box', label: 'Alt Box', convert: (s) => s.replace(/[asxcASXC]/g, (c) => ({a:'卂',s:'丂',x:'乂',c:'匚',A:'卂',S:'丂',X:'乂',C:'匚'}[c] || c)) }
    ];

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    let t;
    const showToast = () => {
      if (!toast) return;
      toast.classList.add('show');
      clearTimeout(t);
      t = setTimeout(() => toast.classList.remove('show'), 800);
    };

    const render = () => {
      const value = (input.value || '').slice(0, 500);
      list.innerHTML = '';
      fontMap.forEach((font) => {
        const out = font.convert(value || 'Hello Font');

        const item = document.createElement('div');
        item.className = 'font-preview-item';

        const body = document.createElement('div');
        body.className = 'font-preview-body';

        const text = document.createElement('span');
        text.className = 'font-preview-text';
        text.textContent = out;

        item.addEventListener('click', async () => {
          await copyText(out);
          item.classList.add('copied');
          setTimeout(() => item.classList.remove('copied'), 650);
          showToast();
        });

        body.appendChild(text);
        item.appendChild(body);
        list.appendChild(item);
      });
    };

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(render, 80);
    });
    render();
  }
})();
