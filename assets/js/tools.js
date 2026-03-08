(() => {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const slug = pathParts[pathParts.length - 1];
  const pageLang = ['en', 'ja'].includes(pathParts[0]) ? pathParts[0] : 'ko';
  const numberLocale = pageLang === 'en' ? 'en-US' : (pageLang === 'ja' ? 'ja-JP' : 'ko-KR');

  const formatNum = (n) => new Intl.NumberFormat(numberLocale).format(Math.round(n || 0));

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

    const unitLabelsByLang = {
      ko: {
        length: [['m','m'],['cm','cm'],['km','km'],['inch','인치'],['ft','피트']],
        weight: [['kg','kg'],['g','g'],['lb','파운드(lb)'],['oz','온스(oz)']],
        temperature: [['c','℃'],['f','℉'],['k','K']]
      },
      en: {
        length: [['m','m'],['cm','cm'],['km','km'],['inch','inch'],['ft','ft']],
        weight: [['kg','kg'],['g','g'],['lb','lb'],['oz','oz']],
        temperature: [['c','℃'],['f','℉'],['k','K']]
      },
      ja: {
        length: [['m','m'],['cm','cm'],['km','km'],['inch','インチ'],['ft','フィート']],
        weight: [['kg','kg'],['g','g'],['lb','ポンド(lb)'],['oz','オンス(oz)']],
        temperature: [['c','℃'],['f','℉'],['k','K']]
      }
    };
    const labels = unitLabelsByLang[pageLang] || unitLabelsByLang.ko;

    const ucText = {
      ko: { result: '결과' },
      en: { result: 'Result' },
      ja: { result: '結果' }
    }[pageLang] || { result: '결과' };

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
      out.textContent = `${ucText.result}: ${result.toLocaleString(numberLocale, { maximumFractionDigits: 6 })} ${to.options[to.selectedIndex]?.text || ''}`;
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

    const tzI18n = {
      ko: {
        locale: 'ko-KR',
        result: (fromText, toText, timeText) => `${fromText} 기준 → ${toText}: ${timeText}`
      },
      en: {
        locale: 'en-US',
        result: (fromText, toText, timeText) => `${fromText} → ${toText}: ${timeText}`
      },
      ja: {
        locale: 'ja-JP',
        result: (fromText, toText, timeText) => `${fromText} 基準 → ${toText}: ${timeText}`
      }
    };
    const tzText = tzI18n[pageLang] || tzI18n.ko;

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
      const text = new Intl.DateTimeFormat(tzText.locale, {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: to.value
      }).format(utcDate);
      out.textContent = tzText.result(from.options[from.selectedIndex].text, to.options[to.selectedIndex].text, text);
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

    const resizeText = {
      ko: {
        original: (w, h, b) => `원본: ${w}×${h}px / ${b} bytes`,
        result: (ow, oh, w, h, b) => `원본: ${ow}×${oh}px → 결과: ${w}×${h}px / ${b} bytes`
      },
      en: {
        original: (w, h, b) => `Original: ${w}×${h}px / ${b} bytes`,
        result: (ow, oh, w, h, b) => `Original: ${ow}×${oh}px → Result: ${w}×${h}px / ${b} bytes`
      },
      ja: {
        original: (w, h, b) => `元画像: ${w}×${h}px / ${b} bytes`,
        result: (ow, oh, w, h, b) => `元画像: ${ow}×${oh}px → 出力: ${w}×${h}px / ${b} bytes`
      }
    }[pageLang] || {
      original: (w, h, b) => `원본: ${w}×${h}px / ${b} bytes`,
      result: (ow, oh, w, h, b) => `원본: ${ow}×${oh}px → 결과: ${w}×${h}px / ${b} bytes`
    };

    const updateResult = (width, height, outBytes = 0) => {
      if (!result) return;
      if (!outBytes) {
        result.textContent = resizeText.original(img?.width || 0, img?.height || 0, formatNum(originBytes));
      } else {
        result.textContent = resizeText.result(img?.width || 0, img?.height || 0, width, height, formatNum(outBytes));
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

    const pcText = {
      ko: {
        original: (b) => `원본 크기: ${b} bytes`,
        compressed: (o, c, r) => `원본: ${o} bytes → 압축: ${c} bytes (약 ${r}% 절감)`
      },
      en: {
        original: (b) => `Original size: ${b} bytes`,
        compressed: (o, c, r) => `Original: ${o} bytes → Compressed: ${c} bytes (about ${r}% reduced)`
      },
      ja: {
        original: (b) => `元サイズ: ${b} bytes`,
        compressed: (o, c, r) => `元画像: ${o} bytes → 圧縮後: ${c} bytes (約${r}%削減)`
      }
    }[pageLang] || {
      original: (b) => `원본 크기: ${b} bytes`,
      compressed: (o, c, r) => `원본: ${o} bytes → 압축: ${c} bytes (약 ${r}% 절감)`
    };

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
      if (result) result.textContent = pcText.original(formatNum(originSize));
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
        result.textContent = pcText.compressed(formatNum(originSize), formatNum(compressedBytes), ratio.toFixed(1));
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

    const ytkText = {
      ko: {
        labels: {
          thumbnail: '유튜브 썸네일',
          'shorts-cover': '쇼츠 커버',
          'channel-banner': '채널 배너',
          'channel-icon': '채널 아이콘',
          watermark: '워터마크'
        },
        ready: (w, h) => `원본: ${w}x${h}px · 생성 준비 완료`,
        download: (label) => `${label} 다운로드`,
        previewAlt: (label) => `${label} 미리보기`,
        done: (count) => `${count}개 출력 이미지를 생성했습니다.`
      },
      en: {
        labels: {
          thumbnail: 'YouTube Thumbnail',
          'shorts-cover': 'Shorts Cover',
          'channel-banner': 'Channel Banner',
          'channel-icon': 'Channel Icon',
          watermark: 'Watermark'
        },
        ready: (w, h) => `Original: ${w}x${h}px · Ready to generate`,
        download: (label) => `Download ${label}`,
        previewAlt: (label) => `${label} preview`,
        done: (count) => `Generated ${count} output images.`
      },
      ja: {
        labels: {
          thumbnail: 'YouTubeサムネイル',
          'shorts-cover': 'ショートカバー',
          'channel-banner': 'チャンネルバナー',
          'channel-icon': 'チャンネルアイコン',
          watermark: '透かし'
        },
        ready: (w, h) => `元画像: ${w}x${h}px · 生成準備完了`,
        download: (label) => `${label} をダウンロード`,
        previewAlt: (label) => `${label} プレビュー`,
        done: (count) => `${count}個の出力画像を生成しました。`
      }
    }[pageLang] || {
      labels: {
        thumbnail: '유튜브 썸네일',
        'shorts-cover': '쇼츠 커버',
        'channel-banner': '채널 배너',
        'channel-icon': '채널 아이콘',
        watermark: '워터마크'
      },
      ready: (w, h) => `원본: ${w}x${h}px · 생성 준비 완료`,
      download: (label) => `${label} 다운로드`,
      previewAlt: (label) => `${label} 미리보기`,
      done: (count) => `${count}개 출력 이미지를 생성했습니다.`
    };

    const targets = [
      { key: 'thumbnail', w: 1280, h: 720 },
      { key: 'shorts-cover', w: 1080, h: 1920 },
      { key: 'channel-banner', w: 2560, h: 1440 },
      { key: 'channel-icon', w: 800, h: 800 },
      { key: 'watermark', w: 150, h: 150 }
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
        if (result) result.textContent = ytkText.ready(i.width, i.height);
      };
      i.src = u;
    });

    run?.addEventListener('click', () => {
      if (!img || !wrap) return;
      wrap.innerHTML = '';
      renders = [];
      targets.forEach((t) => {
        const label = ytkText.labels[t.key] || t.key;

        const card = document.createElement('div');
        card.className = 'ytk-card';

        const canvas = document.createElement('canvas');
        canvas.width = t.w;
        canvas.height = t.h;
        const ctx = canvas.getContext('2d');
        drawFrame(ctx, img, t.w, t.h, fit.value || 'cover', bg?.value || '#0f172a');
        const dataUrl = canvas.toDataURL('image/png');

        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = t.w;
        previewCanvas.height = t.h;
        const pctx = previewCanvas.getContext('2d');
        drawFrame(pctx, img, t.w, t.h, fit.value || 'cover', bg?.value || '#0f172a');
        const previewUrl = previewCanvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.className = 'open-link';
        link.textContent = ytkText.download(label);
        link.download = `${t.key}-${t.w}x${t.h}.png`;
        link.href = dataUrl;

        const title = document.createElement('strong');
        title.textContent = `${label} (${t.w}x${t.h})`;

        const preview = document.createElement('div');
        preview.className = 'ytk-preview';
        const previewImg = document.createElement('img');
        previewImg.className = 'ytk-preview-img';
        previewImg.src = previewUrl;
        previewImg.alt = ytkText.previewAlt(label);
        preview.appendChild(previewImg);

        card.appendChild(title);
        card.appendChild(preview);
        card.appendChild(link);
        wrap.appendChild(card);

        renders.push(link);
      });
      if (result) result.textContent = ytkText.done(targets.length);
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
    const copyBtn = document.getElementById('pct-copy');
    const resetBtn = document.getElementById('pct-reset');

    if (!mode || !main || !sub || !diff || !type || !help) return;

    const pctI18n = {
      ko: {
        idleDefault: '필수 값을 입력하면 결과가 계산됩니다.',
        idleInput: '입력 대기',
        idlePercentOf: '기준값 A와 비율 B를 입력하세요.',
        idleRatio: '부분값 A와 전체값 B를 입력하세요.',
        idleChange: '이전값과 현재값을 입력하세요.',
        cannotCalc: '계산 불가',
        positive: '양수 결과',
        negative: '음수 결과',
        over100: '100% 초과',
        normalRange: '정상 범위',
        increase: '증가',
        decrease: '감소',
        unchanged: '변화 없음',
        msgWholeZero: '전체값(B)이 0이면 백분율을 계산할 수 없습니다.',
        msgOldZero: '이전값이 0이면 증감률(%)을 계산할 수 없습니다.',
        msgPercentOf: (base, rate, result) => `${base}의 ${rate}% = ${result}`,
        msgRatio: (part, whole, ratio) => `${part}는 ${whole}의 ${ratio}%입니다.`,
        msgChange: (oldVal, nowVal, rate, trend) => `이전값 ${oldVal} 대비 ${nowVal}는 ${rate}% ${trend}입니다.`,
        copyText: (main, sub, diff, type) => `주요 결과: ${main} | 보조 결과: ${sub} | 차이값: ${diff} | 판정: ${type}`,
        copied: '복사됨',
        copyDefault: '결과 복사',
        resetMsg: '값을 입력하면 결과가 즉시 계산됩니다.'
      },
      en: {
        idleDefault: 'Results appear after entering required values.',
        idleInput: 'Waiting for input',
        idlePercentOf: 'Enter base value A and rate B.',
        idleRatio: 'Enter part value A and whole value B.',
        idleChange: 'Enter previous and current values.',
        cannotCalc: 'Cannot calculate',
        positive: 'Positive result',
        negative: 'Negative result',
        over100: 'Over 100%',
        normalRange: 'Normal range',
        increase: 'Increase',
        decrease: 'Decrease',
        unchanged: 'No change',
        msgWholeZero: 'Cannot calculate percentage when whole value (B) is 0.',
        msgOldZero: 'Cannot calculate change rate (%) when previous value is 0.',
        msgPercentOf: (base, rate, result) => `${rate}% of ${base} = ${result}`,
        msgRatio: (part, whole, ratio) => `${part} is ${ratio}% of ${whole}.`,
        msgChange: (oldVal, nowVal, rate, trend) => `From ${oldVal} to ${nowVal}: ${rate}% ${trend.toLowerCase()}.`,
        copyText: (main, sub, diff, type) => `Main result: ${main} | Secondary result: ${sub} | Difference: ${diff} | Status: ${type}`,
        copied: 'Copied',
        copyDefault: 'Copy result',
        resetMsg: 'Results are calculated instantly after input.'
      },
      ja: {
        idleDefault: '必須項目を入力すると結果を計算します。',
        idleInput: '入力待ち',
        idlePercentOf: '基準値Aと比率Bを入力してください。',
        idleRatio: '部分値Aと全体値Bを入力してください。',
        idleChange: '前の値と現在値を入力してください。',
        cannotCalc: '計算不可',
        positive: '正の結果',
        negative: '負の結果',
        over100: '100%超え',
        normalRange: '通常範囲',
        increase: '増加',
        decrease: '減少',
        unchanged: '変化なし',
        msgWholeZero: '全体値(B)が0の場合、割合を計算できません。',
        msgOldZero: '前の値が0の場合、増減率(%)を計算できません。',
        msgPercentOf: (base, rate, result) => `${base}の${rate}% = ${result}`,
        msgRatio: (part, whole, ratio) => `${part}は${whole}の${ratio}%です。`,
        msgChange: (oldVal, nowVal, rate, trend) => `${oldVal}から${nowVal}への変化は${rate}%（${trend}）です。`,
        copyText: (main, sub, diff, type) => `主要結果: ${main} | 補助結果: ${sub} | 差分: ${diff} | 判定: ${type}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー',
        resetMsg: '値を入力すると即時計算します。'
      }
    };
    const pctText = pctI18n[pageLang] || pctI18n.ko;

    const fmt = (v, max = 6) => {
      if (!Number.isFinite(v)) return '-';
      return v.toLocaleString(numberLocale, { maximumFractionDigits: max });
    };

    const parseRequired = (el) => {
      const raw = (el?.value || '').trim();
      if (raw === '') return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    };

    const setIdle = (msg = pctText.idleDefault) => {
      main.textContent = '-';
      sub.textContent = '-';
      diff.textContent = '-';
      type.textContent = pctText.idleInput;
      help.textContent = msg;
    };

    const showByMode = () => {
      Object.entries(fields).forEach(([k, el]) => {
        if (el) el.hidden = k !== mode.value;
      });
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const render = () => {
      const currentMode = mode.value || 'percent-of';
      showByMode();

      if (currentMode === 'percent-of') {
        const base = parseRequired(inputs.base);
        const rate = parseRequired(inputs.rate);
        if (base === null || rate === null) {
          setIdle(pctText.idlePercentOf);
          return;
        }

        const result = base * (rate / 100);
        const remain = base - result;

        main.textContent = fmt(result);
        sub.textContent = `${fmt(rate)}%`;
        diff.textContent = fmt(remain);
        type.textContent = result === 0 ? '0%' : (result > 0 ? pctText.positive : pctText.negative);
        help.textContent = pctText.msgPercentOf(fmt(base), fmt(rate), fmt(result));
        return;
      }

      if (currentMode === 'ratio') {
        const part = parseRequired(inputs.part);
        const whole = parseRequired(inputs.whole);
        if (part === null || whole === null) {
          setIdle(pctText.idleRatio);
          return;
        }

        if (whole === 0) {
          main.textContent = '-';
          sub.textContent = '-';
          diff.textContent = '-';
          type.textContent = pctText.cannotCalc;
          help.textContent = pctText.msgWholeZero;
          return;
        }

        const ratio = (part / whole) * 100;
        const remain = whole - part;

        main.textContent = `${fmt(ratio)}%`;
        sub.textContent = `${fmt(part)} / ${fmt(whole)}`;
        diff.textContent = fmt(remain);
        type.textContent = ratio > 100 ? pctText.over100 : pctText.normalRange;
        help.textContent = pctText.msgRatio(fmt(part), fmt(whole), fmt(ratio));
        return;
      }

      if (currentMode === 'change') {
        const oldVal = parseRequired(inputs.old);
        const newVal = parseRequired(inputs.now);
        if (oldVal === null || newVal === null) {
          setIdle(pctText.idleChange);
          return;
        }

        if (oldVal === 0) {
          main.textContent = '-';
          sub.textContent = '-';
          diff.textContent = fmt(newVal - oldVal);
          type.textContent = pctText.cannotCalc;
          help.textContent = pctText.msgOldZero;
          return;
        }

        const delta = newVal - oldVal;
        const rate = (delta / oldVal) * 100;
        const trend = delta > 0 ? pctText.increase : (delta < 0 ? pctText.decrease : pctText.unchanged);

        main.textContent = `${fmt(rate)}%`;
        sub.textContent = `${fmt(oldVal)} → ${fmt(newVal)}`;
        diff.textContent = fmt(delta);
        type.textContent = trend;
        help.textContent = pctText.msgChange(fmt(oldVal), fmt(newVal), fmt(rate), trend);
      }
    };

    copyBtn?.addEventListener('click', async () => {
      const text = pctText.copyText(main.textContent, sub.textContent, diff.textContent, type.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = pctText.copied;
      setTimeout(() => { copyBtn.textContent = old || pctText.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      Object.values(inputs).forEach((input) => { if (input) input.value = ''; });
      mode.value = 'percent-of';
      showByMode();
      setIdle(pctText.resetMsg);
    });

    mode.addEventListener('change', render);
    Object.values(inputs).forEach((input) => input?.addEventListener('input', render));
    render();
  }

  if (slug === 'image-upscaler') {
    const file = document.getElementById('iu-file');
    const scaleSel = document.getElementById('iu-scale');
    const run = document.getElementById('iu-run');
    const sharp = document.getElementById('iu-sharp');
    const denoise = document.getElementById('iu-denoise');
    const canvas = document.getElementById('iu-canvas');
    const link = document.getElementById('iu-download');
    const result = document.getElementById('iu-result');

    const iuI18n = {
      ko: {
        original: (w, h, b) => `원본: ${w}x${h}px / ${b} bytes`,
        result: (w, h, outBytes, ratio, mode) => `결과: ${w}x${h}px / ${outBytes} bytes (원본 대비 ${ratio}%) · ${mode}`,
        mode1x: '1x 보정',
        modeUpscale: (scale) => `${scale}x 업스케일`,
        denoiseOn: '노이즈 감소 ON',
        denoiseOff: '노이즈 감소 OFF',
        sharpOn: '샤픈 ON',
        sharpOff: '샤픈 OFF'
      },
      en: {
        original: (w, h, b) => `Original: ${w}x${h}px / ${b} bytes`,
        result: (w, h, outBytes, ratio, mode) => `Result: ${w}x${h}px / ${outBytes} bytes (${ratio}% of original) · ${mode}`,
        mode1x: '1x enhance',
        modeUpscale: (scale) => `${scale}x upscale`,
        denoiseOn: 'Denoise ON',
        denoiseOff: 'Denoise OFF',
        sharpOn: 'Sharpen ON',
        sharpOff: 'Sharpen OFF'
      },
      ja: {
        original: (w, h, b) => `元画像: ${w}x${h}px / ${b} bytes`,
        result: (w, h, outBytes, ratio, mode) => `結果: ${w}x${h}px / ${outBytes} bytes（元画像比 ${ratio}%）・${mode}`,
        mode1x: '1x 補正',
        modeUpscale: (scale) => `${scale}x アップスケール`,
        denoiseOn: 'ノイズ低減 ON',
        denoiseOff: 'ノイズ低減 OFF',
        sharpOn: 'シャープ ON',
        sharpOff: 'シャープ OFF'
      }
    };
    const iuText = iuI18n[pageLang] || iuI18n.ko;

    let img = null;
    let originBytes = 0;

    file?.addEventListener('change', () => {
      const f = file.files?.[0];
      if (!f) return;
      originBytes = f.size || 0;
      const u = URL.createObjectURL(f);
      const i = new Image();
      i.onload = () => {
        img = i;
        URL.revokeObjectURL(u);
        if (result) result.textContent = iuText.original(i.width, i.height, formatNum(originBytes));
      };
      i.src = u;
    });

    const applySharpen = (ctx, w, h) => {
      const src = ctx.getImageData(0, 0, w, h);
      const out = ctx.createImageData(w, h);
      const d = src.data;
      const o = out.data;
      const k = [0, -1, 0, -1, 5, -1, 0, -1, 0];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            let ki = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = ((y + ky) * w + (x + kx)) * 4 + c;
                sum += d[idx] * k[ki++];
              }
            }
            const oi = (y * w + x) * 4 + c;
            o[oi] = Math.max(0, Math.min(255, sum));
          }
          const aIdx = (y * w + x) * 4 + 3;
          o[aIdx] = d[aIdx];
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    const applyDenoise = (ctx, w, h) => {
      const src = ctx.getImageData(0, 0, w, h);
      const out = ctx.createImageData(w, h);
      const d = src.data;
      const o = out.data;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            let count = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = ((y + ky) * w + (x + kx)) * 4 + c;
                sum += d[idx];
                count++;
              }
            }
            const oi = (y * w + x) * 4 + c;
            o[oi] = Math.round(sum / count);
          }
          const aIdx = (y * w + x) * 4 + 3;
          o[aIdx] = d[aIdx];
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    run?.addEventListener('click', () => {
      if (!img) return;
      const scale = Number(scaleSel?.value || 2);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const stepCanvas = document.createElement('canvas');
      const stepCtx = stepCanvas.getContext('2d');
      stepCanvas.width = img.width;
      stepCanvas.height = img.height;
      stepCtx.drawImage(img, 0, 0);

      // Multi-step upscale to reduce quality loss
      let cw = img.width;
      let ch = img.height;
      while (cw * 2 < w && ch * 2 < h) {
        const nw = Math.min(w, Math.round(cw * 2));
        const nh = Math.min(h, Math.round(ch * 2));
        const temp = document.createElement('canvas');
        temp.width = nw;
        temp.height = nh;
        const tctx = temp.getContext('2d');
        tctx.imageSmoothingEnabled = true;
        tctx.imageSmoothingQuality = 'high';
        tctx.drawImage(stepCanvas, 0, 0, cw, ch, 0, 0, nw, nh);
        stepCanvas.width = nw;
        stepCanvas.height = nh;
        stepCtx.clearRect(0, 0, nw, nh);
        stepCtx.drawImage(temp, 0, 0);
        cw = nw;
        ch = nh;
      }

      ctx.drawImage(stepCanvas, 0, 0, cw, ch, 0, 0, w, h);
      if (denoise?.checked) applyDenoise(ctx, w, h);
      if (sharp?.checked) applySharpen(ctx, w, h);

      const data = canvas.toDataURL('image/png');
      link.href = data;
      const outBytes = Math.floor((data.length * 3) / 4);
      const ratio = originBytes ? ((outBytes / originBytes) * 100).toFixed(1) : '0';
      const mode = [
        scale === 1 ? iuText.mode1x : iuText.modeUpscale(scale),
        denoise?.checked ? iuText.denoiseOn : iuText.denoiseOff,
        sharp?.checked ? iuText.sharpOn : iuText.sharpOff
      ].join(' · ');
      if (result) result.textContent = iuText.result(w, h, formatNum(outBytes), ratio, mode);
    });
  }

  if (slug === 'password-generator') {
    const lenInput = document.getElementById('pw-length');
    const countInput = document.getElementById('pw-count');
    const upper = document.getElementById('pw-upper');
    const lower = document.getElementById('pw-lower');
    const number = document.getElementById('pw-number');
    const symbol = document.getElementById('pw-symbol');
    const excludeSimilar = document.getElementById('pw-exclude-similar');
    const runBtn = document.getElementById('pw-run');
    const copyAllBtn = document.getElementById('pw-copy-all');
    const output = document.getElementById('pw-output');
    const strength = document.getElementById('pw-strength');
    const poolOut = document.getElementById('pw-pool');
    const combosOut = document.getElementById('pw-combos');
    const bitsOut = document.getElementById('pw-bits');
    const help = document.getElementById('pw-help');

    if (!lenInput || !countInput || !upper || !lower || !number || !symbol || !runBtn || !copyAllBtn || !output || !strength || !poolOut || !combosOut || !bitsOut || !help) return;

    const pwI18n = {
      ko: {
        scoreLow: '낮음',
        scoreMedium: '보통',
        scoreStrong: '강함',
        scoreVeryStrong: '매우 강함',
        poolUnit: '자',
        chooseType: '최소 1개 문자 유형을 선택해 주세요.',
        tooShort: (length, n) => `현재 길이(${length})로는 선택한 문자 유형 ${n}개를 모두 포함할 수 없습니다.`,
        generatedAll: (length, count) => `길이 ${length}, ${count}개 생성 완료. 각 비밀번호는 선택한 모든 문자 유형을 최소 1개 이상 포함합니다.`,
        generatedPartial: (size, count) => `중복 없는 비밀번호 ${size}개를 생성했습니다. (요청 ${count}개, 문자풀/길이 조합 제한)`,
        copied: '복사됨',
        copyDefault: '전체 복사'
      },
      en: {
        scoreLow: 'Low',
        scoreMedium: 'Medium',
        scoreStrong: 'Strong',
        scoreVeryStrong: 'Very strong',
        poolUnit: 'chars',
        chooseType: 'Select at least one character type.',
        tooShort: (length, n) => `Current length (${length}) cannot include all ${n} selected character types.`,
        generatedAll: (length, count) => `Generated ${count} password(s) at length ${length}. Each password includes every selected character type at least once.`,
        generatedPartial: (size, count) => `Generated ${size} unique password(s). (Requested: ${count}; limited by pool/length combination)`,
        copied: 'Copied',
        copyDefault: 'Copy all'
      },
      ja: {
        scoreLow: '低い',
        scoreMedium: '普通',
        scoreStrong: '強い',
        scoreVeryStrong: '非常に強い',
        poolUnit: '文字',
        chooseType: '文字種を1つ以上選択してください。',
        tooShort: (length, n) => `現在の長さ（${length}）では、選択した${n}種類すべてを含められません。`,
        generatedAll: (length, count) => `長さ${length}で${count}件生成しました。各パスワードは選択した文字種をすべて最低1文字含みます。`,
        generatedPartial: (size, count) => `重複なしパスワードを${size}件生成しました。（要求${count}件、文字プール/長さの組み合わせ制限）`,
        copied: 'コピー完了',
        copyDefault: 'すべてコピー'
      }
    };
    const pwText = pwI18n[pageLang] || pwI18n.ko;

    const SETS = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      number: '0123456789',
      symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?/~'
    };
    const SIMILAR = new Set(['O', '0', 'o', 'I', 'l', '1', 'B', '8', 'S', '5', 'Z', '2']);

    const pick = (str) => {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return str[arr[0] % str.length];
    };

    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const rand = new Uint32Array(1);
        crypto.getRandomValues(rand);
        const j = rand[0] % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const toScientificFromLog10 = (log10Value) => {
      if (!Number.isFinite(log10Value)) return '-';
      if (log10Value < 6) return Math.round(10 ** log10Value).toLocaleString(numberLocale);
      const exp = Math.floor(log10Value);
      const mantissa = (10 ** (log10Value - exp)).toFixed(2);
      return `${mantissa}e+${exp}`;
    };

    const buildSet = () => {
      const chosen = [];
      if (upper.checked) chosen.push({ key: 'upper', chars: SETS.upper });
      if (lower.checked) chosen.push({ key: 'lower', chars: SETS.lower });
      if (number.checked) chosen.push({ key: 'number', chars: SETS.number });
      if (symbol.checked) chosen.push({ key: 'symbol', chars: SETS.symbol });

      const removeSimilar = excludeSimilar.checked;
      const normalized = chosen.map((set) => {
        if (!removeSimilar) return set;
        return { ...set, chars: Array.from(set.chars).filter((ch) => !SIMILAR.has(ch)).join('') };
      }).filter((set) => set.chars.length > 0);

      const pool = normalized.map((s) => s.chars).join('');
      return { normalized, pool };
    };

    const scoreLabel = (bits) => {
      if (bits < 40) return pwText.scoreLow;
      if (bits < 60) return pwText.scoreMedium;
      if (bits < 80) return pwText.scoreStrong;
      return pwText.scoreVeryStrong;
    };

    const renderStats = (poolSize, len) => {
      if (!(poolSize > 0) || !(len > 0)) {
        strength.textContent = '-';
        poolOut.textContent = '-';
        combosOut.textContent = '-';
        bitsOut.textContent = '-';
        return;
      }
      const bits = len * Math.log2(poolSize);
      const log10Combos = len * Math.log10(poolSize);
      strength.textContent = scoreLabel(bits);
      poolOut.textContent = `${poolSize.toLocaleString(numberLocale)} ${pwText.poolUnit}`;
      combosOut.textContent = toScientificFromLog10(log10Combos);
      bitsOut.textContent = `${bits.toLocaleString(numberLocale, { maximumFractionDigits: 1 })} bit`;
    };

    const generate = () => {
      const length = Math.max(4, Math.min(128, Math.floor(Number(lenInput.value || 16))));
      const count = Math.max(1, Math.min(20, Math.floor(Number(countInput.value || 5))));
      lenInput.value = length;
      countInput.value = count;

      const { normalized, pool } = buildSet();
      if (!normalized.length || !pool.length) {
        output.value = '';
        renderStats(0, length);
        help.textContent = pwText.chooseType;
        return;
      }

      if (length < normalized.length) {
        output.value = '';
        renderStats(pool.length, length);
        help.textContent = pwText.tooShort(length, normalized.length);
        return;
      }

      renderStats(pool.length, length);

      const list = [];
      const seen = new Set();
      let attempts = 0;
      const maxAttempts = Math.max(200, count * 30);

      while (list.length < count && attempts < maxAttempts) {
        attempts += 1;
        const chars = [];
        normalized.forEach((set) => chars.push(pick(set.chars)));
        while (chars.length < length) chars.push(pick(pool));
        const candidate = shuffle(chars).join('');
        if (seen.has(candidate)) continue;
        seen.add(candidate);
        list.push(candidate);
      }

      output.value = list.join('\n');
      if (list.length === count) {
        help.textContent = pwText.generatedAll(length, count);
      } else {
        help.textContent = pwText.generatedPartial(list.length, count);
      }
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    runBtn.addEventListener('click', generate);
    [lenInput, countInput, upper, lower, number, symbol, excludeSimilar].forEach((el) => el.addEventListener('input', () => {
      const { pool } = buildSet();
      const length = Math.max(4, Math.min(128, Math.floor(Number(lenInput.value || 16))));
      renderStats(pool.length, length);
    }));

    copyAllBtn.addEventListener('click', async () => {
      if (!output.value.trim()) return;
      await copyText(output.value.trim());
      const old = copyAllBtn.textContent;
      copyAllBtn.textContent = pwText.copied;
      setTimeout(() => { copyAllBtn.textContent = old || pwText.copyDefault; }, 900);
    });

    generate();
  }

  if (slug === 'pyeong-calculator') {
    const FACTOR = 3.305785;
    const m2Input = document.getElementById('py-m2');
    const pyeongInput = document.getElementById('py-pyeong');
    const priceInput = document.getElementById('py-price');
    const outM2 = document.getElementById('py-out-m2');
    const outPyeong = document.getElementById('py-out-pyeong');
    const outPricePer = document.getElementById('py-price-per');
    const outPricePer10k = document.getElementById('py-price-per-10k');
    const help = document.getElementById('py-help');
    const copyBtn = document.getElementById('py-copy');
    const resetBtn = document.getElementById('py-reset');

    if (!m2Input || !pyeongInput || !priceInput || !outM2 || !outPyeong || !outPricePer || !outPricePer10k || !help) return;

    const pyI18n = {
      ko: {
        currency: '원',
        unitPyeong: '평',
        unitManwon: '만원',
        unitEok: '억원',
        invalidNumber: '숫자 형식으로 입력해 주세요.',
        needPositiveInput: '㎡ 또는 평 중 하나를 0보다 크게 입력하세요.',
        areaPositive: '면적은 0보다 커야 합니다.',
        summaryPrice: (m2, p, per10k, eokText) => `입력 면적 ${m2}㎡(약 ${p}평) 기준 평당가는 ${per10k}만원${eokText ? ` (${eokText})` : ''}입니다.`,
        summaryArea: (m2, p) => `면적 ${m2}㎡ = 약 ${p}평`,
        needAreaFirst: '㎡ 또는 평 중 하나를 먼저 입력하세요.',
        copyText: (m2, p, pricePer, pricePer10k) => `평수 계산 결과 | ${m2} | ${p} | 평당가 ${pricePer} (${pricePer10k})`,
        copied: '복사됨',
        copyDefault: '결과 복사',
        idle: '㎡ 또는 평 중 하나를 입력하면 자동으로 변환됩니다.'
      },
      en: {
        currency: 'KRW',
        unitPyeong: 'pyeong',
        unitManwon: '10k KRW',
        unitEok: '100M KRW',
        invalidNumber: 'Please enter valid numeric values.',
        needPositiveInput: 'Enter either m² or pyeong greater than 0.',
        areaPositive: 'Area must be greater than 0.',
        summaryPrice: (m2, p, per10k, eokText) => `For ${m2}m² (about ${p} pyeong), price per pyeong is ${per10k} ${eokText ? `(${eokText})` : ''}.`,
        summaryArea: (m2, p) => `${m2}m² = about ${p} pyeong`,
        needAreaFirst: 'Enter m² or pyeong first.',
        copyText: (m2, p, pricePer, pricePer10k) => `Pyeong conversion result | ${m2} | ${p} | Price per pyeong ${pricePer} (${pricePer10k})`,
        copied: 'Copied',
        copyDefault: 'Copy result',
        idle: 'Enter either m² or pyeong to convert automatically.'
      },
      ja: {
        currency: 'ウォン',
        unitPyeong: '坪',
        unitManwon: '万ウォン',
        unitEok: '億ウォン',
        invalidNumber: '数値形式で入力してください。',
        needPositiveInput: '㎡または坪のどちらかに0より大きい値を入力してください。',
        areaPositive: '面積は0より大きい必要があります。',
        summaryPrice: (m2, p, per10k, eokText) => `入力面積 ${m2}㎡（約${p}坪）を基準にした坪単価は ${per10k}${eokText ? `（${eokText}）` : ''}です。`,
        summaryArea: (m2, p) => `面積 ${m2}㎡ = 約${p}坪`,
        needAreaFirst: '先に㎡または坪を入力してください。',
        copyText: (m2, p, pricePer, pricePer10k) => `坪数計算結果 | ${m2} | ${p} | 坪単価 ${pricePer} (${pricePer10k})`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー',
        idle: '㎡または坪を入力すると自動で変換されます。'
      }
    };
    const pyText = pyI18n[pageLang] || pyI18n.ko;

    let lock = false;

    const fmt = (v, max = 4) => Number(v).toLocaleString(numberLocale, { maximumFractionDigits: max });
    const fmtKRW = (v) => `${Math.round(v).toLocaleString(numberLocale)} ${pyText.currency}`;
    const fmtEok = (v) => `${fmt(v / 100000000, 2)} ${pyText.unitEok}`;

    const setIdle = (msg) => {
      outM2.textContent = '-';
      outPyeong.textContent = '-';
      outPricePer.textContent = '-';
      outPricePer10k.textContent = '-';
      help.textContent = msg;
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const render = (source = 'm2') => {
      const m2Raw = Number(m2Input.value || 0);
      const pRaw = Number(pyeongInput.value || 0);
      const priceRaw = Number(priceInput.value || 0);
      const price = Number.isFinite(priceRaw) ? Math.max(0, priceRaw) : 0;

      if (!Number.isFinite(m2Raw) || !Number.isFinite(pRaw)) {
        setIdle(pyText.invalidNumber);
        return;
      }

      if (m2Raw <= 0 && pRaw <= 0) {
        setIdle(pyText.needPositiveInput);
        return;
      }

      let m2 = 0;
      let p = 0;

      if (source === 'pyeong') {
        p = Math.max(0, pRaw);
        m2 = p * FACTOR;
      } else {
        m2 = Math.max(0, m2Raw);
        p = m2 / FACTOR;
      }

      if (!(m2 > 0) || !(p > 0)) {
        setIdle(pyText.areaPositive);
        return;
      }

      lock = true;
      m2Input.value = m2 ? m2.toFixed(2).replace(/\.00$/, '') : '';
      pyeongInput.value = p ? p.toFixed(2).replace(/\.00$/, '') : '';
      lock = false;

      outM2.textContent = `${fmt(m2, 2)}㎡`;
      outPyeong.textContent = `${fmt(p, 2)} ${pyText.unitPyeong}`;

      if (price > 0) {
        const per = price / p;
        const per10k = per / 10000;
        const eokText = per >= 100000000 ? fmtEok(per) : '';
        outPricePer.textContent = fmtKRW(per);
        outPricePer10k.textContent = eokText
          ? `${fmt(per10k, 1)} ${pyText.unitManwon} (${eokText})`
          : `${fmt(per10k, 1)} ${pyText.unitManwon}`;
        help.textContent = pyText.summaryPrice(fmt(m2, 2), fmt(p, 2), fmt(per10k, 1), eokText);
      } else {
        outPricePer.textContent = '-';
        outPricePer10k.textContent = '-';
        help.textContent = pyText.summaryArea(fmt(m2, 2), fmt(p, 2));
      }
    };

    m2Input.addEventListener('input', () => { if (!lock) render('m2'); });
    pyeongInput.addEventListener('input', () => { if (!lock) render('pyeong'); });
    priceInput.addEventListener('input', () => {
      if (Number(m2Input.value || 0) > 0) render('m2');
      else if (Number(pyeongInput.value || 0) > 0) render('pyeong');
      else setIdle(pyText.needAreaFirst);
    });

    copyBtn?.addEventListener('click', async () => {
      if (outM2.textContent === '-') return;
      const text = pyText.copyText(outM2.textContent, outPyeong.textContent, outPricePer.textContent, outPricePer10k.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = pyText.copied;
      setTimeout(() => { copyBtn.textContent = old || pyText.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      m2Input.value = '';
      pyeongInput.value = '';
      priceInput.value = '';
      setIdle(pyText.idle);
    });

    setIdle(pyText.idle);
  }

  if (slug === 'd-day-calculator') {
    const start = document.getElementById('dday-start');
    const end = document.getElementById('dday-end');
    const businessOnly = document.getElementById('dday-business-only');
    const label = document.getElementById('dday-label');
    const days = document.getElementById('dday-days');
    const daysLabel = document.getElementById('dday-days-label');
    const inclusive = document.getElementById('dday-inclusive');
    const business = document.getElementById('dday-business');
    const help = document.getElementById('dday-help');
    const swapBtn = document.getElementById('dday-swap');
    const copyBtn = document.getElementById('dday-copy');

    if (!start || !end || !label || !days || !inclusive || !business || !help) return;

    const ddayI18n = {
      ko: {
        calendarDiff: '달력일 차이',
        businessDiff: '업무일 차이',
        needDates: '기준일과 목표일을 선택하면 결과가 계산됩니다.',
        left: (n, useBusiness) => `목표일까지 ${n}${useBusiness ? '업무일' : '일'} 남았습니다.`,
        passed: (n, useBusiness) => `목표일이 ${n}${useBusiness ? '업무일' : '일'} 지났습니다.`,
        today: '오늘이 목표일입니다.',
        fromBase: '기준',
        toTarget: '→',
        copyMetric: '달력일 차이',
        copyText: (label, metricLabel, daysText, inclusive, business) => `D-day ${label} | ${metricLabel} ${daysText} | 포함 일수 ${inclusive} | 업무일 ${business}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        calendarDiff: 'Calendar-day difference',
        businessDiff: 'Business-day difference',
        needDates: 'Select start and target dates to calculate.',
        left: (n, useBusiness) => `${n} ${useBusiness ? 'business day(s)' : 'day(s)'} left until target date.`,
        passed: (n, useBusiness) => `${n} ${useBusiness ? 'business day(s)' : 'day(s)'} passed since target date.`,
        today: 'Today is the target date.',
        fromBase: 'Start',
        toTarget: '→',
        copyMetric: 'Calendar-day difference',
        copyText: (label, metricLabel, daysText, inclusive, business) => `D-day ${label} | ${metricLabel} ${daysText} | Inclusive days ${inclusive} | Business days ${business}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        calendarDiff: '暦日差',
        businessDiff: '営業日差',
        needDates: '基準日と目標日を選ぶと計算します。',
        left: (n, useBusiness) => `目標日まであと${n}${useBusiness ? '営業日' : '日'}です。`,
        passed: (n, useBusiness) => `目標日を${n}${useBusiness ? '営業日' : '日'}過ぎています。`,
        today: '今日は目標日です。',
        fromBase: '基準',
        toTarget: '→',
        copyMetric: '暦日差',
        copyText: (label, metricLabel, daysText, inclusive, business) => `D-day ${label} | ${metricLabel} ${daysText} | 両端含む日数 ${inclusive} | 営業日 ${business}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const ddayText = ddayI18n[pageLang] || ddayI18n.ko;

    const toLocalDateOnly = (v) => {
      if (!v) return null;
      const [y, m, d] = v.split('-').map(Number);
      if (!y || !m || !d) return null;
      return new Date(y, m - 1, d);
    };

    const dayDiff = (a, b) => Math.round((b.getTime() - a.getTime()) / 86400000);

    const countBusinessDaysInclusive = (a, b) => {
      const startDate = a <= b ? a : b;
      const endDate = a <= b ? b : a;
      const totalDays = dayDiff(startDate, endDate) + 1;
      const fullWeeks = Math.floor(totalDays / 7);
      const remainder = totalDays % 7;

      let count = fullWeeks * 5;
      const startDay = startDate.getDay();
      for (let i = 0; i < remainder; i++) {
        const day = (startDay + i) % 7;
        if (day !== 0 && day !== 6) count++;
      }
      return count;
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const render = () => {
      const s = toLocalDateOnly(start.value);
      const e = toLocalDateOnly(end.value);

      if (!s || !e) {
        label.textContent = '-';
        days.textContent = '-';
        if (daysLabel) daysLabel.textContent = ddayText.calendarDiff;
        inclusive.textContent = '-';
        business.textContent = '-';
        help.textContent = ddayText.needDates;
        return;
      }

      const diff = dayDiff(s, e);
      const absDiff = Math.abs(diff);
      const inclusiveDays = absDiff + 1;
      const weekdayCount = countBusinessDaysInclusive(s, e);
      const businessDiff = Math.max(weekdayCount - 1, 0);
      const useBusiness = !!businessOnly?.checked;

      const shownDiff = useBusiness ? businessDiff : absDiff;
      const dLabel = shownDiff === 0 ? 'D-day' : (diff > 0 ? `D-${shownDiff}` : `D+${shownDiff}`);
      label.textContent = dLabel;
      days.textContent = `${shownDiff.toLocaleString(numberLocale)}${pageLang === 'en' ? ' days' : '日'}`;
      if (pageLang === 'ko') days.textContent = `${shownDiff.toLocaleString(numberLocale)}일`;
      if (daysLabel) daysLabel.textContent = useBusiness ? ddayText.businessDiff : ddayText.calendarDiff;
      inclusive.textContent = `${inclusiveDays.toLocaleString(numberLocale)}${pageLang === 'en' ? ' days' : '日'}`;
      business.textContent = `${weekdayCount.toLocaleString(numberLocale)}${pageLang === 'en' ? ' days' : '日'}`;
      if (pageLang === 'ko') {
        inclusive.textContent = `${inclusiveDays.toLocaleString(numberLocale)}일`;
        business.textContent = `${weekdayCount.toLocaleString(numberLocale)}일`;
      }

      const startWeek = new Intl.DateTimeFormat(pageLang === 'en' ? 'en-US' : (pageLang === 'ja' ? 'ja-JP' : 'ko-KR'), { weekday: 'short' }).format(s);
      const endWeek = new Intl.DateTimeFormat(pageLang === 'en' ? 'en-US' : (pageLang === 'ja' ? 'ja-JP' : 'ko-KR'), { weekday: 'short' }).format(e);

      const diffText = diff > 0
        ? ddayText.left(shownDiff.toLocaleString(numberLocale), useBusiness)
        : (diff < 0
          ? ddayText.passed(shownDiff.toLocaleString(numberLocale), useBusiness)
          : ddayText.today);

      help.textContent = `${start.value}(${startWeek}) ${ddayText.toTarget} ${end.value}(${endWeek}) · ${diffText}`;
    };

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (!start.value) start.value = toISO(today);
    if (!end.value) end.value = toISO(nextWeek);

    [start, end, businessOnly].forEach((el) => el?.addEventListener('input', render));

    swapBtn?.addEventListener('click', () => {
      const temp = start.value;
      start.value = end.value;
      end.value = temp;
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      const metricLabel = daysLabel?.textContent || ddayText.copyMetric;
      const text = ddayText.copyText(label.textContent, metricLabel, days.textContent, inclusive.textContent, business.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = ddayText.copied;
      setTimeout(() => { copyBtn.textContent = old || ddayText.copyDefault; }, 900);
    });

    render();
  }


  if (slug === 'bmi-calculator') {
    const height = document.getElementById('bmi-height');
    const weight = document.getElementById('bmi-weight');
    const age = document.getElementById('bmi-age');
    const sex = document.getElementById('bmi-sex');
    const copyBtn = document.getElementById('bmi-copy');
    const resetBtn = document.getElementById('bmi-reset');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const bmiNormal = document.getElementById('bmi-normal');
    const bmiBmr = document.getElementById('bmi-bmr');
    const help = document.getElementById('bmi-help');

    if (!height || !weight || !bmiValue || !bmiCategory || !bmiNormal || !bmiBmr || !help) return;

    const RANGE = {
      height: { min: 50, max: 260 },
      weight: { min: 10, max: 400 },
      age: { min: 1, max: 120 }
    };

    const bmiI18n = {
      ko: {
        classify: ['저체중', '정상', '과체중', '비만', '고도비만'],
        idleDefault: '키와 몸무게를 입력하면 BMI를 계산합니다.',
        idlePending: '입력 대기',
        idleNeedInputs: '키(cm)와 몸무게(kg)를 입력하세요.',
        idleRange: (hMin, hMax, wMin, wMax) => `입력 범위를 확인하세요 (키 ${hMin}~${hMax}cm, 몸무게 ${wMin}~${wMax}kg).`,
        bmrPending: '나이/성별 입력 시 계산',
        bmrAgeRange: (aMin, aMax) => `나이는 ${aMin}~${aMax}세 범위로 입력하세요`,
        help: (bmi, category) => `BMI ${bmi.toFixed(2)} (${category}). 성인 기준 참고값이며 진단을 대체하지 않습니다.`,
        copyInputCheck: '입력 확인',
        copyDefault: '결과 복사',
        copied: '복사됨',
        copyText: (bmi, category, normal, bmr) => `BMI ${bmi} (${category}) | 정상 체중 범위 ${normal} | BMR ${bmr}`
      },
      en: {
        classify: ['Underweight', 'Normal', 'Overweight', 'Obese', 'Severely obese'],
        idleDefault: 'Enter height and weight to calculate BMI.',
        idlePending: 'Waiting for input',
        idleNeedInputs: 'Enter height (cm) and weight (kg).',
        idleRange: (hMin, hMax, wMin, wMax) => `Check input range (height ${hMin}-${hMax} cm, weight ${wMin}-${wMax} kg).`,
        bmrPending: 'Shown when age and sex are provided',
        bmrAgeRange: (aMin, aMax) => `Enter age between ${aMin} and ${aMax}.`,
        help: (bmi, category) => `BMI ${bmi.toFixed(2)} (${category}). This is a screening reference for adults and not a medical diagnosis.`,
        copyInputCheck: 'Check inputs',
        copyDefault: 'Copy result',
        copied: 'Copied',
        copyText: (bmi, category, normal, bmr) => `BMI ${bmi} (${category}) | Healthy weight range ${normal} | BMR ${bmr}`
      },
      ja: {
        classify: ['低体重', '普通体重', '過体重', '肥満', '高度肥満'],
        idleDefault: '身長と体重を入力するとBMIを計算します。',
        idlePending: '入力待ち',
        idleNeedInputs: '身長(cm)と体重(kg)を入力してください。',
        idleRange: (hMin, hMax, wMin, wMax) => `入力範囲を確認してください（身長 ${hMin}〜${hMax}cm、体重 ${wMin}〜${wMax}kg）。`,
        bmrPending: '年齢・性別を入力すると表示',
        bmrAgeRange: (aMin, aMax) => `年齢は${aMin}〜${aMax}歳で入力してください。`,
        help: (bmi, category) => `BMI ${bmi.toFixed(2)}（${category}）。成人向けの目安であり、診断の代わりにはなりません。`,
        copyInputCheck: '入力を確認',
        copyDefault: '結果をコピー',
        copied: 'コピー完了',
        copyText: (bmi, category, normal, bmr) => `BMI ${bmi}（${category}） | 標準体重範囲 ${normal} | BMR ${bmr}`
      }
    };
    const bmiText = bmiI18n[pageLang] || bmiI18n.ko;

    const classify = (bmi) => {
      if (bmi < 18.5) return bmiText.classify[0];
      if (bmi < 23) return bmiText.classify[1];
      if (bmi < 25) return bmiText.classify[2];
      if (bmi < 30) return bmiText.classify[3];
      return bmiText.classify[4];
    };

    const calcBmr = ({ w, h, a, sx }) => {
      if (!(a > 0) || !sx) return null;
      if (sx === 'male') return 10 * w + 6.25 * h - 5 * a + 5;
      if (sx === 'female') return 10 * w + 6.25 * h - 5 * a - 161;
      return null;
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setIdle = (msg = bmiText.idleDefault) => {
      bmiValue.textContent = '-';
      bmiCategory.textContent = bmiText.idlePending;
      bmiNormal.textContent = '-';
      bmiBmr.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const h = Number(height.value || 0);
      const w = Number(weight.value || 0);
      const a = Number(age?.value || 0);
      const sx = sex?.value || '';

      if (!(h > 0) || !(w > 0)) {
        setIdle(bmiText.idleNeedInputs);
        return false;
      }

      if (h < RANGE.height.min || h > RANGE.height.max || w < RANGE.weight.min || w > RANGE.weight.max) {
        setIdle(bmiText.idleRange(RANGE.height.min, RANGE.height.max, RANGE.weight.min, RANGE.weight.max));
        return false;
      }

      const m = h / 100;
      const bmi = w / (m * m);
      const normalMin = 18.5 * m * m;
      const normalMax = 22.9 * m * m;
      const category = classify(bmi);
      const hasValidAge = !age?.value || (a >= RANGE.age.min && a <= RANGE.age.max);
      const bmr = hasValidAge ? calcBmr({ w, h, a, sx }) : null;

      bmiValue.textContent = bmi.toLocaleString(numberLocale, { maximumFractionDigits: 2 });
      bmiCategory.textContent = category;
      bmiNormal.textContent = `${normalMin.toLocaleString(numberLocale, { maximumFractionDigits: 1 })}kg ~ ${normalMax.toLocaleString(numberLocale, { maximumFractionDigits: 1 })}kg`;
      bmiBmr.textContent = Number.isFinite(bmr)
        ? `${Math.round(bmr).toLocaleString(numberLocale)} kcal`
        : (hasValidAge ? bmiText.bmrPending : bmiText.bmrAgeRange(RANGE.age.min, RANGE.age.max));
      help.textContent = bmiText.help(bmi, category);
      return true;
    };

    [height, weight, age, sex].forEach((el) => el?.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      height.value = 170;
      weight.value = 65;
      if (age) age.value = '';
      if (sex) sex.value = '';
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (!render() || bmiValue.textContent === '-') {
        const old = copyBtn.textContent;
        copyBtn.textContent = bmiText.copyInputCheck;
        setTimeout(() => { copyBtn.textContent = old || bmiText.copyDefault; }, 900);
        return;
      }

      const text = bmiText.copyText(bmiValue.textContent, bmiCategory.textContent, bmiNormal.textContent, bmiBmr.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = bmiText.copied;
      setTimeout(() => { copyBtn.textContent = old || bmiText.copyDefault; }, 900);
    });

    if (!height.value) height.value = 170;
    if (!weight.value) weight.value = 65;
    render();
  }


  if (slug === 'body-fat-calculator') {
    const sex = document.getElementById('bfat-sex');
    const height = document.getElementById('bfat-height');
    const neck = document.getElementById('bfat-neck');
    const waist = document.getElementById('bfat-waist');
    const hip = document.getElementById('bfat-hip');
    const weight = document.getElementById('bfat-weight');
    const outPercent = document.getElementById('bfat-percent');
    const outCategory = document.getElementById('bfat-category');
    const outFatMass = document.getElementById('bfat-fat-mass');
    const outLeanMass = document.getElementById('bfat-lean-mass');
    const help = document.getElementById('bfat-help');
    const copyBtn = document.getElementById('bfat-copy');
    const resetBtn = document.getElementById('bfat-reset');

    if (!sex || !height || !neck || !waist || !hip || !weight || !outPercent || !outCategory || !outFatMass || !outLeanMass || !help) return;

    const t = {
      ko: {
        waiting: '입력 대기',
        idle: '키·목·허리·몸무게를 입력하면 체지방률을 계산합니다. 여성은 엉덩이 둘레도 입력하세요.',
        invalid: '치수가 올바른지 확인하세요. (허리 > 목, 여성은 허리+엉덩이 > 목)',
        categoriesMale: ['필수지방', '운동선수', '피트니스', '평균', '높음'],
        categoriesFemale: ['필수지방', '운동선수', '피트니스', '평균', '높음'],
        helpSummary: (percent, category) => `US Navy 공식 · ${percent} (${category})`,
        copyText: (percent, category, fatMass, leanMass) => `체지방률 ${percent} | ${category} | 체지방량 ${fatMass} | 제지방량 ${leanMass}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        waiting: 'Waiting for input',
        idle: 'Enter height, neck, waist, and weight. For female mode, add hip measurement.',
        invalid: 'Check measurements. (waist > neck, and for female: waist + hip > neck)',
        categoriesMale: ['Essential', 'Athletes', 'Fitness', 'Average', 'High'],
        categoriesFemale: ['Essential', 'Athletes', 'Fitness', 'Average', 'High'],
        helpSummary: (percent, category) => `US Navy formula · ${percent} (${category})`,
        copyText: (percent, category, fatMass, leanMass) => `Body fat ${percent} | ${category} | Fat mass ${fatMass} | Lean mass ${leanMass}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        waiting: '入力待ち',
        idle: '身長・首・腹囲・体重を入力してください。女性モードはヒップも入力します。',
        invalid: '測定値を確認してください。（腹囲 > 首、女性は 腹囲+ヒップ > 首）',
        categoriesMale: ['必須脂肪', 'アスリート', 'フィットネス', '平均', '高め'],
        categoriesFemale: ['必須脂肪', 'アスリート', 'フィットネス', '平均', '高め'],
        helpSummary: (percent, category) => `U.S. Navy方式 · ${percent}（${category}）`,
        copyText: (percent, category, fatMass, leanMass) => `体脂肪率 ${percent} | ${category} | 脂肪量 ${fatMass} | 除脂肪体重 ${leanMass}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      waiting: '입력 대기', idle: '값을 입력하세요.', invalid: '입력값 확인',
      categoriesMale: ['필수지방','운동선수','피트니스','평균','높음'],
      categoriesFemale: ['필수지방','운동선수','피트니스','평균','높음'],
      helpSummary: (percent, category) => `US Navy 공식 · ${percent} (${category})`,
      copyText: (percent, category, fatMass, leanMass) => `체지방률 ${percent} | ${category} | 체지방량 ${fatMass} | 제지방량 ${leanMass}`,
      copied: '복사됨', copyDefault: '결과 복사'
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const classify = (percent, female) => {
      const c = female ? t.categoriesFemale : t.categoriesMale;
      if (female) {
        if (percent < 14) return c[0];
        if (percent < 21) return c[1];
        if (percent < 25) return c[2];
        if (percent < 32) return c[3];
        return c[4];
      }
      if (percent < 6) return c[0];
      if (percent < 14) return c[1];
      if (percent < 18) return c[2];
      if (percent < 25) return c[3];
      return c[4];
    };

    const setIdle = (msg = t.idle) => {
      outPercent.textContent = '-';
      outCategory.textContent = t.waiting;
      outFatMass.textContent = '-';
      outLeanMass.textContent = '-';
      help.textContent = msg;
    };

    const within = (value, min, max) => value >= min && value <= max;

    const toggleHipField = () => {
      const isFemale = sex.value === 'female';
      hip.disabled = !isFemale;
      hip.setAttribute('aria-disabled', String(!isFemale));
      if (!isFemale) hip.value = '';
    };

    const render = () => {
      const isFemale = sex.value === 'female';
      const h = Number(height.value || 0);
      const n = Number(neck.value || 0);
      const w = Number(waist.value || 0);
      const hp = Number(hip.value || 0);
      const kg = Number(weight.value || 0);

      if (!(h > 0) || !(n > 0) || !(w > 0) || !(kg > 0) || (isFemale && !(hp > 0))) {
        setIdle();
        return;
      }

      if (!within(h, 120, 230) || !within(n, 20, 70) || !within(w, 40, 180) || !within(kg, 30, 250) || (isFemale && !within(hp, 50, 200))) {
        setIdle(t.invalid);
        return;
      }

      const inch = 0.3937007874;
      const hi = h * inch;
      const ni = n * inch;
      const wi = w * inch;
      const hpi = hp * inch;

      let denominator;
      if (isFemale) {
        if ((wi + hpi) <= ni) { setIdle(t.invalid); return; }
        denominator = 1.29579 - 0.35004 * Math.log10(wi + hpi - ni) + 0.22100 * Math.log10(hi);
      } else {
        if (wi <= ni) { setIdle(t.invalid); return; }
        denominator = 1.0324 - 0.19077 * Math.log10(wi - ni) + 0.15456 * Math.log10(hi);
      }

      if (!(denominator > 0)) { setIdle(t.invalid); return; }
      const bf = 495 / denominator - 450;
      if (!Number.isFinite(bf) || bf <= 0 || bf >= 70) { setIdle(t.invalid); return; }

      const fatMass = kg * (bf / 100);
      const leanMass = kg - fatMass;
      const category = classify(bf, isFemale);

      outPercent.textContent = `${bf.toLocaleString(numberLocale, { maximumFractionDigits: 1 })}%`;
      outCategory.textContent = category;
      outFatMass.textContent = `${fatMass.toLocaleString(numberLocale, { maximumFractionDigits: 1 })}kg`;
      outLeanMass.textContent = `${leanMass.toLocaleString(numberLocale, { maximumFractionDigits: 1 })}kg`;
      help.textContent = t.helpSummary(outPercent.textContent, category);
    };

    [sex, height, neck, waist, hip, weight].forEach((el) => el?.addEventListener('input', render));
    sex?.addEventListener('change', () => {
      toggleHipField();
      render();
    });

    resetBtn?.addEventListener('click', () => {
      sex.value = 'male';
      height.value = 170;
      neck.value = 38;
      waist.value = 82;
      hip.value = '';
      weight.value = 68;
      toggleHipField();
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (outPercent.textContent === '-') return;
      await copyText(t.copyText(outPercent.textContent, outCategory.textContent, outFatMass.textContent, outLeanMass.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    if (!height.value) height.value = 170;
    if (!neck.value) neck.value = 38;
    if (!waist.value) waist.value = 82;
    if (!weight.value) weight.value = 68;
    toggleHipField();
    render();
  }


  if (slug === 'loan-calculator') {
    const amount = document.getElementById('loan-amount');
    const rate = document.getElementById('loan-rate');
    const years = document.getElementById('loan-years');
    const type = document.getElementById('loan-type');
    const copyBtn = document.getElementById('loan-copy');
    const resetBtn = document.getElementById('loan-reset');
    const monthly = document.getElementById('loan-monthly');
    const totalInterest = document.getElementById('loan-total-interest');
    const totalPayment = document.getElementById('loan-total-payment');
    const monthCount = document.getElementById('loan-month-count');
    const comparePayment = document.getElementById('loan-compare-payment');
    const compareInterest = document.getElementById('loan-compare-interest');
    const help = document.getElementById('loan-help');

    if (!amount || !rate || !years || !type || !monthly || !totalInterest || !totalPayment || !monthCount || !comparePayment || !compareInterest || !help) return;

    const loanI18n = {
      ko: {
        currency: '원',
        count: '회',
        comparePayment: (ep, ef, el) => `원리금균등: ${ep} / 원금균등: 첫 달 ${ef} → 마지막 ${el}`,
        compareInterestEmpty: '총 이자 차이: -',
        compareInterestSame: '총 이자 차이: 거의 없음',
        compareInterestEqualPrincipalLess: (v) => `총 이자 차이: 원금균등이 ${v} 더 적음`,
        compareInterestEqualPaymentLess: (v) => `총 이자 차이: 원리금균등이 ${v} 더 적음`,
        invalidHelp: '대출금액·연이율·상환기간을 올바르게 입력하세요.',
        estimateHelp: (label) => `${label} 기준 추정값입니다. 실제 대출은 수수료·우대금리·중도상환 여부에 따라 달라질 수 있습니다.`,
        copyTitle: (label) => `대출 계산 결과 (${label})`,
        copyMonthly: (v) => `월 납입액(첫 달): ${v}`,
        copyInterest: (v) => `총 이자: ${v}`,
        copyTotal: (v) => `총 상환액: ${v}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW',
        count: 'months',
        comparePayment: (ep, ef, el) => `Amortized: ${ep} / Equal principal: first ${ef} → last ${el}`,
        compareInterestEmpty: 'Interest difference: -',
        compareInterestSame: 'Interest difference: almost none',
        compareInterestEqualPrincipalLess: (v) => `Interest difference: equal principal is lower by ${v}`,
        compareInterestEqualPaymentLess: (v) => `Interest difference: amortized is lower by ${v}`,
        invalidHelp: 'Enter a valid loan amount, annual rate, and term.',
        estimateHelp: (label) => `Estimated result based on ${label}. Actual loans vary by fees, preferential rates, and prepayment conditions.`,
        copyTitle: (label) => `Loan calculation (${label})`,
        copyMonthly: (v) => `Monthly payment (first): ${v}`,
        copyInterest: (v) => `Total interest: ${v}`,
        copyTotal: (v) => `Total repayment: ${v}`,
        copied: 'Copied',
        copyDefault: 'Copy results'
      },
      ja: {
        currency: 'ウォン',
        count: '回',
        comparePayment: (ep, ef, el) => `元利均等: ${ep} / 元金均等: 初回 ${ef} → 最終 ${el}`,
        compareInterestEmpty: '総利息差: -',
        compareInterestSame: '総利息差: ほぼなし',
        compareInterestEqualPrincipalLess: (v) => `総利息差: 元金均等のほうが${v}少ない`,
        compareInterestEqualPaymentLess: (v) => `総利息差: 元利均等のほうが${v}少ない`,
        invalidHelp: '借入額・年利・返済期間を正しく入力してください。',
        estimateHelp: (label) => `${label}基準の試算です。実際のローンは手数料・優遇金利・繰上返済条件で変わる場合があります。`,
        copyTitle: (label) => `ローン計算結果 (${label})`,
        copyMonthly: (v) => `毎月返済額(初回): ${v}`,
        copyInterest: (v) => `総利息: ${v}`,
        copyTotal: (v) => `総返済額: ${v}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const loanText = loanI18n[pageLang] || loanI18n.ko;
    const fmtKRW = (v) => {
      const rounded = Math.round(v);
      if (pageLang === 'en') return `${rounded.toLocaleString(numberLocale)}${loanText.currency}`;
      return `${rounded.toLocaleString(numberLocale)}${loanText.currency}`;
    };

    const calcPlan = ({ principal, n, r, mode }) => {
      let firstMonthly = 0;
      let lastMonthly = 0;
      let total = 0;

      if (mode === 'equal-principal') {
        const principalPerMonth = principal / n;
        let remaining = principal;
        for (let i = 0; i < n; i++) {
          const interest = remaining * r;
          const pay = principalPerMonth + interest;
          if (i === 0) firstMonthly = pay;
          if (i === n - 1) lastMonthly = pay;
          total += pay;
          remaining -= principalPerMonth;
        }
      } else {
        if (r === 0) {
          firstMonthly = principal / n;
          lastMonthly = firstMonthly;
        } else {
          firstMonthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          lastMonthly = firstMonthly;
        }
        total = firstMonthly * n;
      }

      return {
        firstMonthly,
        lastMonthly,
        total,
        interest: Math.max(0, total - principal)
      };
    };

    const setInvalid = () => {
      monthly.textContent = '-';
      totalInterest.textContent = '-';
      totalPayment.textContent = '-';
      monthCount.textContent = '-';
      comparePayment.textContent = loanText.comparePayment('-', '-', '-');
      compareInterest.textContent = loanText.compareInterestEmpty;
      help.textContent = loanText.invalidHelp;
    };

    const render = () => {
      const principal = Number(amount.value || 0);
      const annualRate = Number(rate.value || 0);
      const yearTerm = Number(years.value || 0);
      const n = Math.round(yearTerm * 12);

      if (!(principal > 0) || !(yearTerm > 0) || n <= 0 || annualRate < 0) {
        setInvalid();
        return;
      }

      const r = annualRate / 100 / 12;
      const equalPayment = calcPlan({ principal, n, r, mode: 'equal-payment' });
      const equalPrincipal = calcPlan({ principal, n, r, mode: 'equal-principal' });
      const selected = type.value === 'equal-principal' ? equalPrincipal : equalPayment;

      monthly.textContent = fmtKRW(selected.firstMonthly);
      totalInterest.textContent = fmtKRW(selected.interest);
      totalPayment.textContent = fmtKRW(selected.total);
      monthCount.textContent = `${n.toLocaleString(numberLocale)} ${loanText.count}`;

      comparePayment.textContent = loanText.comparePayment(
        fmtKRW(equalPayment.firstMonthly),
        fmtKRW(equalPrincipal.firstMonthly),
        fmtKRW(equalPrincipal.lastMonthly)
      );

      const diffInterest = equalPrincipal.interest - equalPayment.interest;
      if (Math.abs(diffInterest) < 1) {
        compareInterest.textContent = loanText.compareInterestSame;
      } else if (diffInterest < 0) {
        compareInterest.textContent = loanText.compareInterestEqualPrincipalLess(fmtKRW(Math.abs(diffInterest)));
      } else {
        compareInterest.textContent = loanText.compareInterestEqualPaymentLess(fmtKRW(Math.abs(diffInterest)));
      }

      help.textContent = loanText.estimateHelp(type.options[type.selectedIndex].text);
    };

    [amount, rate, years, type].forEach((el) => el.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      amount.value = 100000000;
      rate.value = 4.2;
      years.value = 30;
      type.value = 'equal-payment';
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      const text = [
        loanText.copyTitle(type.options[type.selectedIndex].text),
        loanText.copyMonthly(monthly.textContent),
        loanText.copyInterest(totalInterest.textContent),
        loanText.copyTotal(totalPayment.textContent),
        comparePayment.textContent,
        compareInterest.textContent
      ].join(' | ');
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = loanText.copied;
      setTimeout(() => { copyBtn.textContent = old || loanText.copyDefault; }, 900);
    });

    if (!amount.value) amount.value = 100000000;
    if (!rate.value) rate.value = 4.2;
    if (!years.value) years.value = 30;

    render();
  }

  if (slug === 'compound-interest-calculator') {
    const initial = document.getElementById('ci-initial');
    const monthly = document.getElementById('ci-monthly');
    const rate = document.getElementById('ci-rate');
    const years = document.getElementById('ci-years');
    const compound = document.getElementById('ci-compound');
    const inflation = document.getElementById('ci-inflation');
    const final = document.getElementById('ci-final');
    const contrib = document.getElementById('ci-contrib');
    const interest = document.getElementById('ci-interest');
    const real = document.getElementById('ci-real');
    const help = document.getElementById('ci-help');
    const copyBtn = document.getElementById('ci-copy');
    const resetBtn = document.getElementById('ci-reset');

    if (!initial || !monthly || !rate || !years || !compound || !inflation || !final || !contrib || !interest || !real || !help) return;

    const ciI18n = {
      ko: {
        currency: '원',
        idle: '입력값을 넣으면 복리 결과가 즉시 계산됩니다.',
        invalid: '숫자만 입력해 주세요.',
        term: '투자 기간(1년 이상)을 입력하세요.',
        noInflation: '인플레이션 미입력',
        summary: (y, bal, annualized) => `${y}년 후 예상 자산은 ${bal}이며, 원금 대비 수익률은 약 ${annualized}%입니다.`,
        copy: (f,c,i,r) => `복리 계산 결과 | 만기 자산 ${f} | 총 원금 ${c} | 예상 수익 ${i} | 실질가치 ${r}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW',
        idle: 'Enter your inputs to calculate compound growth instantly.',
        invalid: 'Please enter numbers only.',
        term: 'Enter an investment term of at least 1 year.',
        noInflation: 'No inflation input',
        summary: (y, bal, annualized) => `Estimated ending balance after ${y} years is ${bal}, with an approximate return of ${annualized}% versus total principal.`,
        copy: (f,c,i,r) => `Compound interest result | Ending balance ${f} | Total principal ${c} | Estimated profit ${i} | Inflation-adjusted value ${r}`,
        copied: 'Copied',
        copyDefault: 'Copy results'
      },
      ja: {
        currency: 'ウォン',
        idle: '入力すると複利の結果をすぐに計算します。',
        invalid: '数値のみ入力してください。',
        term: '運用期間は1年以上で入力してください。',
        noInflation: 'インフレ率未入力',
        summary: (y, bal, annualized) => `${y}年後の予想資産は ${bal}、元本に対する収益率は約 ${annualized}% です。`,
        copy: (f,c,i,r) => `複利計算結果 | 満期予想資産 ${f} | 元本合計 ${c} | 想定利益 ${i} | インフレ調整後価値 ${r}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const t = ciI18n[pageLang] || ciI18n.ko;
    const fmtCurrency = (v) => {
      const rounded = Math.round(v);
      if (pageLang === 'en') return `${rounded.toLocaleString(numberLocale)}${t.currency}`;
      return `${rounded.toLocaleString(numberLocale)}${t.currency}`;
    };

    const setIdle = (msg) => {
      final.textContent = '-';
      contrib.textContent = '-';
      interest.textContent = '-';
      real.textContent = '-';
      help.textContent = msg;
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const clamp = (num, min, max) => Math.min(max, Math.max(min, num));

    const render = () => {
      const p0 = clamp(Number(initial.value || 0), 0, 1000000000000);
      const mAdd = clamp(Number(monthly.value || 0), 0, 100000000000);
      const rAnnual = clamp(Number(rate.value || 0), 0, 100);
      const y = Math.floor(clamp(Number(years.value || 0), 1, 100));
      const n = Math.max(1, Number(compound.value || 12));
      const inf = clamp(Number(inflation.value || 0), 0, 50);

      if (!Number.isFinite(p0) || !Number.isFinite(mAdd) || !Number.isFinite(rAnnual) || !Number.isFinite(y) || !Number.isFinite(inf)) {
        setIdle(t.invalid);
        return;
      }
      if (!(y > 0)) {
        setIdle(t.term);
        return;
      }

      if (Number(initial.value || 0) !== p0) initial.value = p0;
      if (Number(monthly.value || 0) !== mAdd) monthly.value = mAdd;
      if (Number(rate.value || 0) !== rAnnual) rate.value = rAnnual;
      if (Number(years.value || 0) !== y) years.value = y;
      if (Number(inflation.value || 0) !== inf) inflation.value = inf;

      let balance = p0;
      const periodicRate = rAnnual / 100 / n;
      const totalMonths = y * 12;
      const monthsPerPeriod = 12 / n;

      for (let month = 1; month <= totalMonths; month++) {
        if (month % monthsPerPeriod === 0) balance *= (1 + periodicRate);
        balance += mAdd;
      }

      const totalContrib = p0 + (mAdd * totalMonths);
      const earned = balance - totalContrib;
      const realValue = balance / Math.pow(1 + inf / 100, y);

      final.textContent = fmtCurrency(balance);
      contrib.textContent = fmtCurrency(totalContrib);
      interest.textContent = fmtCurrency(earned);
      real.textContent = inf > 0 ? fmtCurrency(realValue) : t.noInflation;

      const annualized = totalContrib > 0 ? ((balance / totalContrib - 1) * 100) : 0;
      help.textContent = t.summary(y, fmtCurrency(balance), annualized.toLocaleString(numberLocale, { maximumFractionDigits: 2 }));
    };

    [initial, monthly, rate, years, compound, inflation].forEach((el) => {
      el?.addEventListener('input', render);
      el?.addEventListener('change', render);
    });

    copyBtn?.addEventListener('click', async () => {
      const text = t.copy(final.textContent, contrib.textContent, interest.textContent, real.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      initial.value = 1000000;
      monthly.value = 300000;
      rate.value = 7;
      years.value = 10;
      compound.value = 12;
      inflation.value = 2.5;
      render();
    });

    if (!initial.value) initial.value = 1000000;
    if (!monthly.value) monthly.value = 300000;
    if (!rate.value) rate.value = 7;
    if (!years.value) years.value = 10;
    render();
  }


  if (slug === 'discount-calculator') {
    const mode = document.getElementById('dc-mode');
    const listPrice = document.getElementById('dc-list-price');
    const discountRate = document.getElementById('dc-discount-rate');
    const coupon = document.getElementById('dc-coupon');
    const quantity = document.getElementById('dc-quantity');
    const shipping = document.getElementById('dc-shipping');
    const targetPrice = document.getElementById('dc-target-price');
    const forwardFields = document.getElementById('dc-forward-fields');
    const forwardFields2 = document.getElementById('dc-forward-fields-2');
    const reverseFields = document.getElementById('dc-reverse-fields');

    const discountAmount = document.getElementById('dc-discount-amount');
    const unitPrice = document.getElementById('dc-unit-price');
    const finalTotal = document.getElementById('dc-final-total');
    const effectiveRate = document.getElementById('dc-effective-rate');
    const help = document.getElementById('dc-help');

    const copyBtn = document.getElementById('dc-copy');
    const resetBtn = document.getElementById('dc-reset');

    if (!mode || !listPrice || !discountRate || !coupon || !quantity || !shipping || !targetPrice || !discountAmount || !unitPrice || !finalTotal || !effectiveRate || !help) return;

    const discountI18n = {
      ko: {
        currency: '원',
        needPrice: '정가를 0원보다 크게 입력하세요.',
        invalidRate: '할인율은 0%~100% 범위에서 입력하세요.',
        forwardHelp: (price, q) => `${price} 상품 ${q}개 기준, 쿠폰/배송비까지 반영한 최종 결제금액입니다.`,
        reverseHighTarget: '목표 판매가(1개 기준)가 정가보다 높아 할인율은 0%로 표시됩니다.',
        reverseHelp: (price, target, rate) => `정가 ${price}(1개)를 목표가 ${target}로 맞추려면 약 ${rate} 할인이 필요합니다.`,
        copyText: (discount, unit, total, rate) => `할인 계산 결과 | 할인 금액: ${discount} | 할인 후 단가: ${unit} | 최종 결제금액: ${total} | 실질 할인율: ${rate}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: '$',
        needPrice: 'Enter a list price greater than 0.',
        invalidRate: 'Discount rate must be between 0% and 100%.',
        forwardHelp: (price, q) => `Final payable amount for ${q} item(s), including coupon and shipping, based on list price ${price}.`,
        reverseHighTarget: 'Target selling price is higher than list price, so required discount is shown as 0%.',
        reverseHelp: (price, target, rate) => `To lower ${price} (per item) to target ${target}, you need about ${rate} discount.`,
        copyText: (discount, unit, total, rate) => `Discount calculation | Discount amount: ${discount} | Discounted unit price: ${unit} | Final payable amount: ${total} | Effective discount rate: ${rate}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        currency: 'ウォン',
        needPrice: '定価は0より大きい値を入力してください。',
        invalidRate: '割引率は0%〜100%の範囲で入力してください。',
        forwardHelp: (price, q) => `定価${price}・${q}個を基準に、クーポンと送料を反映した最終支払金額です。`,
        reverseHighTarget: '目標販売価格（1個あたり）が定価より高いため、必要割引率は0%で表示します。',
        reverseHelp: (price, target, rate) => `定価${price}（1個）を目標価格${target}にするには、約${rate}の割引が必要です。`,
        copyText: (discount, unit, total, rate) => `割引計算結果 | 割引額: ${discount} | 割引後単価: ${unit} | 最終支払金額: ${total} | 実質割引率: ${rate}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const dcText = discountI18n[pageLang] || discountI18n.ko;
    const fmtKRW = (v) => {
      const rounded = Math.round(v).toLocaleString(numberLocale);
      if (pageLang === 'en') return `${dcText.currency}${rounded}`;
      return `${rounded}${dcText.currency}`;
    };
    const fmtPct = (v) => `${v.toLocaleString(numberLocale, { maximumFractionDigits: 2 })}%`;
    const n = (el, fallback = 0) => {
      const num = Number(el?.value || fallback);
      return Number.isFinite(num) ? num : fallback;
    };

    const setModeUI = () => {
      const isForward = (mode.value || 'forward') === 'forward';
      if (forwardFields) forwardFields.hidden = !isForward;
      if (forwardFields2) forwardFields2.hidden = !isForward;
      if (reverseFields) reverseFields.hidden = isForward;
      discountRate.disabled = !isForward;
      targetPrice.disabled = isForward;
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setOutput = ({ discount = '-', unit = '-', total = '-', rate = '-', message = '' } = {}) => {
      discountAmount.textContent = discount;
      unitPrice.textContent = unit;
      finalTotal.textContent = total;
      effectiveRate.textContent = rate;
      help.textContent = message;
    };

    const render = () => {
      setModeUI();
      const price = Math.max(0, n(listPrice));
      const q = Math.max(1, Math.floor(n(quantity, 1)));
      const ship = Math.max(0, n(shipping));

      if (price <= 0) {
        setOutput({ message: dcText.needPrice });
        return;
      }

      if ((mode.value || 'forward') === 'forward') {
        const rate = n(discountRate);
        if (rate < 0 || rate > 100) {
          setOutput({ message: dcText.invalidRate });
          return;
        }

        const couponAmount = Math.max(0, n(coupon));
        const discounted = price * (1 - rate / 100);
        const unit = Math.max(0, discounted - couponAmount);
        const totalBeforeShipping = unit * q;
        const total = Math.max(0, totalBeforeShipping + ship);

        const totalList = price * q + ship;
        const effRate = totalList > 0 ? ((totalList - total) / totalList) * 100 : 0;

        discountAmount.textContent = fmtKRW(price - discounted);
        unitPrice.textContent = fmtKRW(unit);
        finalTotal.textContent = fmtKRW(total);
        effectiveRate.textContent = fmtPct(Math.max(0, effRate));
        help.textContent = dcText.forwardHelp(fmtKRW(price), q);
      } else {
        const target = Math.max(0, n(targetPrice));
        if (target > price) {
          discountAmount.textContent = fmtKRW(0);
          unitPrice.textContent = fmtKRW(target);
          finalTotal.textContent = fmtKRW(target);
          effectiveRate.textContent = fmtPct(0);
          help.textContent = dcText.reverseHighTarget;
          return;
        }

        const needRate = price === 0 ? 0 : ((price - target) / price) * 100;
        discountAmount.textContent = fmtKRW(price - target);
        unitPrice.textContent = fmtKRW(target);
        finalTotal.textContent = fmtKRW(target);
        effectiveRate.textContent = fmtPct(Math.max(0, needRate));
        help.textContent = dcText.reverseHelp(fmtKRW(price), fmtKRW(target), fmtPct(needRate));
      }
    };

    [mode, listPrice, discountRate, coupon, quantity, shipping, targetPrice].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      const text = dcText.copyText(discountAmount.textContent, unitPrice.textContent, finalTotal.textContent, effectiveRate.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = dcText.copied;
      setTimeout(() => { copyBtn.textContent = old || dcText.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      mode.value = 'forward';
      listPrice.value = 59000;
      discountRate.value = 20;
      coupon.value = 3000;
      quantity.value = 1;
      shipping.value = 0;
      targetPrice.value = 45000;
      render();
    });

    if (!listPrice.value) listPrice.value = 59000;
    if (!discountRate.value) discountRate.value = 20;
    if (!quantity.value) quantity.value = 1;
    render();
  }

  if (slug === 'age-calculator') {
    const birth = document.getElementById('age-birth-date');
    const target = document.getElementById('age-target-date');
    const koreanMode = document.getElementById('age-korean-mode');
    const international = document.getElementById('age-international');
    const korean = document.getElementById('age-korean');
    const months = document.getElementById('age-months');
    const days = document.getElementById('age-days');
    const nextBirthday = document.getElementById('age-next-birthday');
    const copyBtn = document.getElementById('age-copy');
    const resetBtn = document.getElementById('age-reset');

    if (!birth || !target || !international || !korean || !months || !days || !nextBirthday) return;

    const ageI18n = {
      ko: {
        years: '세',
        months: '개월',
        days: '일',
        hidden: '숨김',
        idleNeedBoth: '생년월일과 기준일을 입력하세요.',
        idleInvalid: '생년월일은 기준일보다 늦을 수 없습니다.',
        nextBirthday: (date, dday) => `다음 생일: ${date} (${dday})`,
        dday: 'D-day',
        dminus: (days) => `D-${days}`,
        copyInputCheck: '입력 확인',
        copyDefault: '결과 복사',
        copied: '복사됨',
        copyText: (intl, kr, m, d, next) => `나이 계산 결과 | 만 나이 ${intl} | 세는나이 ${kr} | 총 ${m} / ${d} | ${next}`,
        firstMessage: '생년월일을 입력하면 나이 계산 결과가 표시됩니다.'
      },
      en: {
        years: ' years',
        months: ' months',
        days: ' days',
        hidden: 'Hidden',
        idleNeedBoth: 'Enter birth date and reference date.',
        idleInvalid: 'Birth date cannot be later than the reference date.',
        nextBirthday: (date, dday) => `Next birthday: ${date} (${dday})`,
        dday: 'D-day',
        dminus: (days) => `D-${days}`,
        copyInputCheck: 'Check inputs',
        copyDefault: 'Copy result',
        copied: 'Copied',
        copyText: (intl, kr, m, d, next) => `Age calculation | International age ${intl} | Korean age ${kr} | Total ${m} / ${d} | ${next}`,
        firstMessage: 'Enter your birth date to show age calculation results.'
      },
      ja: {
        years: '歳',
        months: 'か月',
        days: '日',
        hidden: '非表示',
        idleNeedBoth: '生年月日と基準日を入力してください。',
        idleInvalid: '生年月日は基準日より後にできません。',
        nextBirthday: (date, dday) => `次の誕生日: ${date}（${dday}）`,
        dday: 'D-day',
        dminus: (days) => `D-${days}`,
        copyInputCheck: '入力を確認',
        copyDefault: '結果をコピー',
        copied: 'コピー完了',
        copyText: (intl, kr, m, d, next) => `年齢計算結果 | 満年齢 ${intl} | 韓国式年齢 ${kr} | 合計 ${m} / ${d} | ${next}`,
        firstMessage: '生年月日を入力すると年齢計算結果を表示します。'
      }
    };
    const ageText = ageI18n[pageLang] || ageI18n.ko;

    const toDate = (value) => {
      if (!value) return null;
      const [y, m, d] = value.split('-').map(Number);
      if (!y || !m || !d) return null;
      const parsed = new Date(y, m - 1, d, 12, 0, 0, 0);
      const isValid = parsed.getFullYear() === y && parsed.getMonth() === (m - 1) && parsed.getDate() === d;
      return isValid ? parsed : null;
    };

    const toUTCDate = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const dayDiff = (a, b) => Math.floor((toUTCDate(b) - toUTCDate(a)) / 86400000);

    const getFullAge = (b, t) => {
      let age = t.getFullYear() - b.getFullYear();
      const monthDiff = t.getMonth() - b.getMonth();
      const beforeBirthday = monthDiff < 0 || (monthDiff === 0 && t.getDate() < b.getDate());
      if (beforeBirthday) age -= 1;
      return Math.max(0, age);
    };

    const getMonthSpan = (b, t) => {
      let m = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth());
      if (t.getDate() < b.getDate()) m -= 1;
      return Math.max(0, m);
    };

    const getNextBirthday = (b, t) => {
      const year = t.getFullYear();
      const month = b.getMonth();
      const day = b.getDate();
      const safeDate = (y) => {
        const lastDay = new Date(y, month + 1, 0).getDate();
        return new Date(y, month, Math.min(day, lastDay), 12, 0, 0, 0);
      };

      let candidate = safeDate(year);
      if (dayDiff(t, candidate) < 0) candidate = safeDate(year + 1);
      return candidate;
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      international.textContent = '-';
      korean.textContent = '-';
      months.textContent = '-';
      days.textContent = '-';
      nextBirthday.textContent = msg;
    };

    const render = () => {
      const b = toDate(birth.value);
      const t = toDate(target.value);
      if (!b || !t) {
        setIdle(ageText.idleNeedBoth);
        return;
      }
      if (b > t) {
        setIdle(ageText.idleInvalid);
        return;
      }

      const fullAge = getFullAge(b, t);
      const koreanAge = t.getFullYear() - b.getFullYear() + 1;
      const totalMonths = getMonthSpan(b, t);
      const totalDays = dayDiff(b, t);
      const upcomingBirthday = getNextBirthday(b, t);
      const daysLeft = dayDiff(t, upcomingBirthday);

      international.textContent = `${fullAge.toLocaleString(numberLocale)}${ageText.years}`;
      korean.textContent = koreanMode?.checked ? `${koreanAge.toLocaleString(numberLocale)}${ageText.years}` : ageText.hidden;
      months.textContent = `${totalMonths.toLocaleString(numberLocale)}${ageText.months}`;
      days.textContent = `${totalDays.toLocaleString(numberLocale)}${ageText.days}`;

      const birthdayText = `${upcomingBirthday.getFullYear()}-${String(upcomingBirthday.getMonth() + 1).padStart(2, '0')}-${String(upcomingBirthday.getDate()).padStart(2, '0')}`;
      const ddayText = daysLeft === 0 ? ageText.dday : ageText.dminus(daysLeft.toLocaleString(numberLocale));
      nextBirthday.textContent = ageText.nextBirthday(birthdayText, ddayText);
    };

    const today = new Date();
    const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (!target.value) target.value = toISO(today);

    [birth, target, koreanMode].forEach((el) => el?.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      target.value = toISO(new Date());
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (international.textContent === '-') {
        const old = copyBtn.textContent;
        copyBtn.textContent = ageText.copyInputCheck;
        setTimeout(() => { copyBtn.textContent = old || ageText.copyDefault; }, 900);
        return;
      }
      const text = ageText.copyText(international.textContent, korean.textContent, months.textContent, days.textContent, nextBirthday.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = ageText.copied;
      setTimeout(() => { copyBtn.textContent = old || ageText.copyDefault; }, 900);
    });

    setIdle(ageText.firstMessage);
    render();
  }

  if (slug === 'salary-calculator') {
    const annual = document.getElementById('sal-annual');
    const nonTax = document.getElementById('sal-nontax');
    const dependent = document.getElementById('sal-dependent');
    const children = document.getElementById('sal-children');
    const netMonth = document.getElementById('sal-net-month');
    const netYear = document.getElementById('sal-net-year');
    const taxMonth = document.getElementById('sal-tax-month');
    const insuranceMonth = document.getElementById('sal-insurance-month');
    const summary = document.getElementById('sal-summary');
    const copyBtn = document.getElementById('sal-copy');
    const resetBtn = document.getElementById('sal-reset');

    if (!annual || !nonTax || !dependent || !children || !netMonth || !netYear || !taxMonth || !insuranceMonth || !summary) return;

    const salaryI18n = {
      ko: {
        currency: '원',
        idle: '연봉(세전)을 입력하면 예상 실수령액을 계산합니다.',
        needAnnual: '연봉을 먼저 입력하세요.',
        summary: (rate, capped) => `공제율 약 ${rate}% 기준 추정치입니다.${capped ? ' 비과세 월급은 월 총급여를 넘지 않도록 자동 보정했습니다.' : ''} 회사별 비과세·수당·정산에 따라 실제 수령액은 달라질 수 있습니다.`,
        copyText: (m, y, t, i) => `실수령액 계산 결과 | 월 ${m} | 연 ${y} | 소득세+지방세(월) ${t} | 4대보험(월) ${i}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: '',
        idle: 'Enter annual gross salary to estimate take-home pay.',
        needAnnual: 'Enter annual salary first.',
        summary: (rate, capped) => `Estimated deduction rate: about ${rate}%.${capped ? ' Non-taxable monthly income was auto-capped at monthly gross pay.' : ''} Actual net pay may vary by company policy, non-taxable items, and payroll settlement.`,
        copyText: (m, y, t, i) => `Take-home estimate | Monthly ${m} | Yearly ${y} | Income+local tax (monthly) ${t} | Social insurance (monthly) ${i}`,
        copied: 'Copied',
        copyDefault: 'Copy results'
      },
      ja: {
        currency: 'ウォン',
        idle: '額面年収を入力すると、手取り見込みを計算します。',
        needAnnual: '先に年収を入力してください。',
        summary: (rate, capped) => `控除率は約${rate}%の試算です。${capped ? ' 非課税月額は月額総支給を超えないよう自動補正しました。' : ''} 実際の手取りは会社規定・非課税項目・精算方法により変動します。`,
        copyText: (m, y, t, i) => `手取り試算結果 | 月 ${m} | 年 ${y} | 所得税+住民税(月) ${t} | 社会保険(月) ${i}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const salText = salaryI18n[pageLang] || salaryI18n.ko;
    const KRW = (v) => {
      const rounded = Math.round(v);
      if (pageLang === 'en') return `${rounded.toLocaleString(numberLocale)} KRW`;
      return `${rounded.toLocaleString(numberLocale)}${salText.currency}`;
    };

    const earnedIncomeDeduction = (gross) => {
      if (gross <= 5000000) return gross * 0.7;
      if (gross <= 15000000) return 3500000 + (gross - 5000000) * 0.4;
      if (gross <= 45000000) return 7500000 + (gross - 15000000) * 0.15;
      if (gross <= 100000000) return 12000000 + (gross - 45000000) * 0.05;
      return 14750000 + (gross - 100000000) * 0.02;
    };

    const calcIncomeTax = (base) => {
      if (base <= 12000000) return base * 0.06;
      if (base <= 46000000) return base * 0.15 - 1080000;
      if (base <= 88000000) return base * 0.24 - 5220000;
      if (base <= 150000000) return base * 0.35 - 14900000;
      if (base <= 300000000) return base * 0.38 - 19400000;
      if (base <= 500000000) return base * 0.4 - 25400000;
      if (base <= 1000000000) return base * 0.42 - 35400000;
      return base * 0.45 - 65400000;
    };

    const calcChildCredit = (n) => {
      const c = Math.max(0, Math.floor(n));
      if (c <= 0) return 0;
      if (c === 1) return 150000;
      if (c === 2) return 300000;
      return 300000 + (c - 2) * 300000;
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      netMonth.textContent = '-';
      netYear.textContent = '-';
      taxMonth.textContent = '-';
      insuranceMonth.textContent = '-';
      summary.textContent = msg;
    };

    const render = () => {
      const grossAnnual = Number(annual.value || 0);
      const depCount = Math.min(20, Math.max(0, Math.floor(Number(dependent.value || 0))));
      const childCount = Math.min(10, Math.max(0, Math.floor(Number(children.value || 0))));

      if (!(grossAnnual > 0)) {
        setIdle(salText.idle);
        return;
      }

      const grossMonthly = grossAnnual / 12;
      const nonTaxMonthlyRaw = Math.max(0, Number(nonTax.value || 0));
      const nonTaxMonthly = Math.min(nonTaxMonthlyRaw, grossMonthly);
      if (Number(dependent.value || 0) !== depCount) dependent.value = depCount;
      if (Number(children.value || 0) !== childCount) children.value = childCount;
      if (nonTaxMonthlyRaw !== nonTaxMonthly) nonTax.value = Math.round(nonTaxMonthly);
      const pensionBase = Math.min(grossMonthly, 6170000);
      const pension = pensionBase * 0.045;
      const health = grossMonthly * 0.03545;
      const longCare = health * 0.1295;
      const employment = grossMonthly * 0.009;
      const monthlyInsurance = pension + health + longCare + employment;
      const annualInsurance = monthlyInsurance * 12;

      const annualTaxableGross = Math.max(0, grossAnnual - (nonTaxMonthly * 12));
      const earnDed = earnedIncomeDeduction(annualTaxableGross);
      const earnIncome = Math.max(0, annualTaxableGross - earnDed);
      const personalDed = (1 + depCount + childCount) * 1500000;
      const taxBase = Math.max(0, earnIncome - personalDed - annualInsurance);

      let annualIncomeTax = Math.max(0, calcIncomeTax(taxBase));
      annualIncomeTax = Math.max(0, annualIncomeTax - calcChildCredit(childCount));
      const annualLocalTax = annualIncomeTax * 0.1;
      const monthlyTax = (annualIncomeTax + annualLocalTax) / 12;

      const monthlyNet = Math.max(0, grossMonthly - monthlyInsurance - monthlyTax);
      const annualNet = monthlyNet * 12;
      const effectiveRate = grossAnnual > 0 ? ((grossAnnual - annualNet) / grossAnnual) * 100 : 0;

      netMonth.textContent = KRW(monthlyNet);
      netYear.textContent = KRW(annualNet);
      taxMonth.textContent = KRW(monthlyTax);
      insuranceMonth.textContent = KRW(monthlyInsurance);
      const cappedNonTax = nonTaxMonthlyRaw > nonTaxMonthly;
      summary.textContent = salText.summary(effectiveRate.toLocaleString(numberLocale, { maximumFractionDigits: 2 }), cappedNonTax);
    };

    [annual, nonTax, dependent, children].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (netMonth.textContent === '-') {
        setIdle(salText.needAnnual);
        return;
      }
      const text = salText.copyText(netMonth.textContent, netYear.textContent, taxMonth.textContent, insuranceMonth.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = salText.copied;
      setTimeout(() => { copyBtn.textContent = old || salText.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      annual.value = 50000000;
      nonTax.value = 200000;
      dependent.value = 0;
      children.value = 0;
      render();
    });

    if (!annual.value) annual.value = 50000000;
    if (!nonTax.value) nonTax.value = 200000;
    render();
  }

  if (slug === 'severance-pay-calculator') {
    const start = document.getElementById('sev-start');
    const end = document.getElementById('sev-end');
    const monthly = document.getElementById('sev-monthly');
    const annualBonus = document.getElementById('sev-annual-bonus');
    const serviceDays = document.getElementById('sev-service-days');
    const serviceYears = document.getElementById('sev-service-years');
    const dailyWage = document.getElementById('sev-daily-wage');
    const amount = document.getElementById('sev-amount');
    const help = document.getElementById('sev-help');
    const copyBtn = document.getElementById('sev-copy');
    const resetBtn = document.getElementById('sev-reset');

    if (!start || !end || !monthly || !annualBonus || !serviceDays || !serviceYears || !dailyWage || !amount || !help) return;

    const sevI18n = {
      ko: {
        currency: '원',
        chooseDates: '입사일과 퇴사일을 선택하세요.',
        invalidRange: '퇴사일은 입사일보다 빠를 수 없습니다.',
        needMonthly: '최근 월급(세전)을 입력하세요.',
        dayUnit: '일',
        yearUnit: '년',
        eligibleHelp: '법정 평균임금의 간편 추정 방식(연 환산)으로 계산한 참고값입니다. 실제 퇴직금은 최근 3개월 임금·상여 반영 방식에 따라 달라질 수 있습니다.',
        ineligibleHelp: '재직기간이 1년 미만으로 보입니다. 계산은 가능하지만 법적 지급 요건 충족 여부를 반드시 확인하세요.',
        inputCheck: '입력 확인',
        copyResult: '퇴직금 계산 결과',
        copyLabels: {
          days: '재직일수',
          years: '계속근로연수',
          daily: '1일 평균임금',
          amount: '예상 퇴직금'
        },
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: '',
        chooseDates: 'Select start date and end date.',
        invalidRange: 'End date cannot be earlier than start date.',
        needMonthly: 'Enter recent monthly gross salary.',
        dayUnit: ' days',
        yearUnit: ' years',
        eligibleHelp: 'This is a simplified estimate based on annualized statutory average wage. Actual severance may differ depending on how wages and bonuses from the last 3 months are reflected.',
        ineligibleHelp: 'Your service period appears to be under 1 year. Calculation is possible, but please verify legal eligibility requirements.',
        inputCheck: 'Check inputs',
        copyResult: 'Severance estimate',
        copyLabels: {
          days: 'Service days',
          years: 'Years of service',
          daily: 'Average daily wage',
          amount: 'Estimated severance'
        },
        copied: 'Copied',
        copyDefault: 'Copy results'
      },
      ja: {
        currency: 'ウォン',
        chooseDates: '入社日と退社日を選択してください。',
        invalidRange: '退社日は入社日より前にできません。',
        needMonthly: '直近の月給（額面）を入力してください。',
        dayUnit: '日',
        yearUnit: '年',
        eligibleHelp: '法定の平均賃金を年換算した簡易推定です。実際の退職金は直近3か月の賃金・賞与の反映方法により異なる場合があります。',
        ineligibleHelp: '勤続期間が1年未満の可能性があります。計算は可能ですが、法的な支給要件を必ず確認してください。',
        inputCheck: '入力を確認',
        copyResult: '退職金試算結果',
        copyLabels: {
          days: '勤続日数',
          years: '勤続年数',
          daily: '1日平均賃金',
          amount: '退職金見込み'
        },
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const sevText = sevI18n[pageLang] || sevI18n.ko;
    const fmtKRW = (v) => {
      const rounded = Math.round(v);
      if (pageLang === 'en') return `${rounded.toLocaleString(numberLocale)} KRW`;
      return `${rounded.toLocaleString(numberLocale)}${sevText.currency}`;
    };

    const toDate = (value) => {
      if (!value) return null;
      const [y, m, d] = value.split('-').map(Number);
      if (!y || !m || !d) return null;
      const date = new Date(y, m - 1, d, 12, 0, 0, 0);
      const valid = date.getFullYear() === y && date.getMonth() === (m - 1) && date.getDate() === d;
      return valid ? date : null;
    };

    const dayDiff = (a, b) => Math.floor((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      serviceDays.textContent = '-';
      serviceYears.textContent = '-';
      dailyWage.textContent = '-';
      amount.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const s = toDate(start.value);
      const e = toDate(end.value);
      const m = Math.max(0, Number(monthly.value || 0));
      const b = Math.max(0, Number(annualBonus.value || 0));

      if (!s || !e) {
        setIdle(sevText.chooseDates);
        return;
      }
      if (e < s) {
        setIdle(sevText.invalidRange);
        return;
      }
      if (!(m > 0)) {
        setIdle(sevText.needMonthly);
        return;
      }

      const days = dayDiff(s, e) + 1;
      const years = days / 365;
      const annualizedWage = (m * 12) + b;
      const avgDailyWage = annualizedWage / 365;
      const severance = avgDailyWage * 30 * years;
      const isEligible = days >= 365;

      serviceDays.textContent = `${days.toLocaleString(numberLocale)}${sevText.dayUnit}`;
      serviceYears.textContent = `${years.toLocaleString(numberLocale, { maximumFractionDigits: 2 })}${sevText.yearUnit}`;
      dailyWage.textContent = fmtKRW(avgDailyWage);
      amount.textContent = fmtKRW(severance);
      help.textContent = isEligible ? sevText.eligibleHelp : sevText.ineligibleHelp;
    };

    const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const today = new Date();
    const sampleStart = new Date(today);
    sampleStart.setFullYear(sampleStart.getFullYear() - 3);

    if (!start.value) start.value = toISO(sampleStart);
    if (!end.value) end.value = toISO(today);

    [start, end, monthly, annualBonus].forEach((el) => el?.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      start.value = toISO(sampleStart);
      end.value = toISO(today);
      monthly.value = 3200000;
      annualBonus.value = 0;
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (amount.textContent === '-') {
        const old = copyBtn.textContent;
        copyBtn.textContent = sevText.inputCheck;
        setTimeout(() => { copyBtn.textContent = old || sevText.copyDefault; }, 900);
        return;
      }
      const text = `${sevText.copyResult} | ${sevText.copyLabels.days} ${serviceDays.textContent} | ${sevText.copyLabels.years} ${serviceYears.textContent} | ${sevText.copyLabels.daily} ${dailyWage.textContent} | ${sevText.copyLabels.amount} ${amount.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = sevText.copied;
      setTimeout(() => { copyBtn.textContent = old || sevText.copyDefault; }, 900);
    });

    if (!monthly.value) monthly.value = 3200000;
    render();
  }

  if (slug === 'stock-average-calculator') {
    const currentQty = document.getElementById('sa-current-qty');
    const currentPrice = document.getElementById('sa-current-price');
    const addQty = document.getElementById('sa-add-qty');
    const addPrice = document.getElementById('sa-add-price');
    const targetPrice = document.getElementById('sa-target-price');
    const newAvg = document.getElementById('sa-new-avg');
    const totalQtyOut = document.getElementById('sa-total-qty');
    const totalCostOut = document.getElementById('sa-total-cost');
    const needQtyOut = document.getElementById('sa-need-qty');
    const help = document.getElementById('sa-help');
    const copyBtn = document.getElementById('sa-copy');
    const resetBtn = document.getElementById('sa-reset');

    if (!currentQty || !currentPrice || !addQty || !addPrice || !newAvg || !totalQtyOut || !totalCostOut || !needQtyOut || !help) return;

    const stockI18n = {
      ko: {
        currency: '원',
        shareUnit: '주',
        needCurrent: '현재 보유 수량과 평단가를 먼저 입력하세요.',
        avgWithPlan: (avg) => `추가 매수 반영 시 새 평단가는 ${avg}입니다.`,
        alreadyTarget: '현재 평단가가 이미 목표 평단 이하입니다.',
        alreadyWithPlan: '현재 입력된 추가 매수 계획까지 반영하면 이미 목표 평단을 만족합니다.',
        alreadyNow: '현재 보유 상태로 이미 목표 평단을 만족합니다.',
        impossible: '달성 불가',
        impossibleHelp: '추가 매수가가 목표 평단 이상이면 같은 가격의 추가 매수만으로 목표 평단을 만들 수 없습니다.',
        needAfterPlan: (tp, need, aq) => `현재 계획(${aq}) 이후에도 목표 평단 ${tp}를 맞추려면 최소 ${need}를 같은 가격에 더 매수해야 합니다.`,
        needNow: (tp, need) => `목표 평단 ${tp}를 맞추려면 현재 조건에서 최소 ${need} 추가 매수가 필요합니다.`,
        zeroShares: '0주',
        copyTitle: '물타기 계산 결과',
        copyLabels: {
          avg: '새 평단가',
          qty: '총 보유',
          cost: '총 매수금액',
          need: '목표 평단 필요수량'
        },
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: '',
        shareUnit: ' shares',
        needCurrent: 'Enter current holding quantity and average cost first.',
        avgWithPlan: (avg) => `New average cost with planned buy: ${avg}.`,
        alreadyTarget: 'Your current average cost is already at or below the target.',
        alreadyWithPlan: 'With the additional buy plan already entered, the target average is already met.',
        alreadyNow: 'Your current holdings already meet the target average.',
        impossible: 'Not achievable',
        impossibleHelp: 'If your additional buy price is at or above the target average, you cannot reach the target by buying more at that same price.',
        needAfterPlan: (tp, need, aq) => `After your current plan (${aq}), you still need at least ${need} more at the same price to reach target average ${tp}.`,
        needNow: (tp, need) => `To reach target average ${tp}, you need at least ${need} more shares under current conditions.`,
        zeroShares: '0 shares',
        copyTitle: 'Average-down calculation',
        copyLabels: {
          avg: 'New average cost',
          qty: 'Total shares',
          cost: 'Total invested',
          need: 'Required shares for target average'
        },
        copied: 'Copied',
        copyDefault: 'Copy results'
      },
      ja: {
        currency: '円',
        shareUnit: '株',
        needCurrent: '現在の保有株数と平均取得単価を先に入力してください。',
        avgWithPlan: (avg) => `追加購入を反映した新しい平均取得単価は ${avg} です。`,
        alreadyTarget: '現在の平均取得単価はすでに目標以下です。',
        alreadyWithPlan: '現在入力済みの追加購入計画まで反映すると、すでに目標単価を満たしています。',
        alreadyNow: '現在の保有状態ですでに目標単価を満たしています。',
        impossible: '達成不可',
        impossibleHelp: '追加購入単価が目標単価以上の場合、同じ価格での買い増しだけでは目標単価に到達できません。',
        needAfterPlan: (tp, need, aq) => `現在の計画（${aq}）の後も、目標単価 ${tp} にするには同価格で最低 ${need} の追加購入が必要です。`,
        needNow: (tp, need) => `目標単価 ${tp} にするには、現在条件で最低 ${need} の追加購入が必要です。`,
        zeroShares: '0株',
        copyTitle: 'ナンピン計算結果',
        copyLabels: {
          avg: '新しい平均取得単価',
          qty: '総保有株数',
          cost: '総購入金額',
          need: '目標単価に必要な株数'
        },
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const stockText = stockI18n[pageLang] || stockI18n.ko;
    const fmtKRW = (v) => {
      const rounded = Math.round(v);
      if (pageLang === 'en') return `${rounded.toLocaleString(numberLocale)} KRW`;
      return `${rounded.toLocaleString(numberLocale)}${stockText.currency}`;
    };
    const fmtQty = (v) => `${Math.round(v).toLocaleString(numberLocale)}${stockText.shareUnit}`;

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      newAvg.textContent = '-';
      totalQtyOut.textContent = '-';
      totalCostOut.textContent = '-';
      needQtyOut.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const cq = Math.max(0, Number(currentQty.value || 0));
      const cp = Math.max(0, Number(currentPrice.value || 0));
      const aq = Math.max(0, Number(addQty.value || 0));
      const ap = Math.max(0, Number(addPrice.value || 0));
      const tpRaw = targetPrice?.value || '';
      const tp = tpRaw === '' ? null : Math.max(0, Number(tpRaw));

      if (!(cq > 0) || !(cp > 0)) {
        setIdle(stockText.needCurrent);
        return;
      }

      const baseCost = cq * cp;
      const addCost = aq * ap;
      const totalQty = cq + aq;
      const totalCost = baseCost + addCost;
      const avg = totalQty > 0 ? totalCost / totalQty : 0;

      newAvg.textContent = fmtKRW(avg);
      totalQtyOut.textContent = fmtQty(totalQty);
      totalCostOut.textContent = fmtKRW(totalCost);

      if (tp === null || !Number.isFinite(tp)) {
        needQtyOut.textContent = '-';
        help.textContent = stockText.avgWithPlan(fmtKRW(avg));
        return;
      }

      if (tp >= cp && aq === 0) {
        needQtyOut.textContent = stockText.zeroShares;
        help.textContent = stockText.alreadyTarget;
        return;
      }

      const denominator = tp - ap;
      const numerator = totalCost - (tp * totalQty);

      if (numerator <= 0) {
        needQtyOut.textContent = stockText.zeroShares;
        help.textContent = aq > 0 ? stockText.alreadyWithPlan : stockText.alreadyNow;
        return;
      }

      if (denominator <= 0) {
        needQtyOut.textContent = stockText.impossible;
        help.textContent = stockText.impossibleHelp;
        return;
      }

      const need = Math.ceil(numerator / denominator);
      needQtyOut.textContent = fmtQty(need);
      help.textContent = aq > 0
        ? stockText.needAfterPlan(fmtKRW(tp), fmtQty(need), fmtQty(aq))
        : stockText.needNow(fmtKRW(tp), fmtQty(need));
    };

    [currentQty, currentPrice, addQty, addPrice, targetPrice].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (newAvg.textContent === '-') return;
      const text = `${stockText.copyTitle} | ${stockText.copyLabels.avg} ${newAvg.textContent} | ${stockText.copyLabels.qty} ${totalQtyOut.textContent} | ${stockText.copyLabels.cost} ${totalCostOut.textContent} | ${stockText.copyLabels.need} ${needQtyOut.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = stockText.copied;
      setTimeout(() => { copyBtn.textContent = old || stockText.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      currentQty.value = 100;
      currentPrice.value = 50000;
      addQty.value = 100;
      addPrice.value = 40000;
      if (targetPrice) targetPrice.value = 43000;
      render();
    });

    if (!currentQty.value) currentQty.value = 100;
    if (!currentPrice.value) currentPrice.value = 50000;
    if (!addQty.value) addQty.value = 100;
    if (!addPrice.value) addPrice.value = 40000;
    render();
  }


  if (slug === 'tdee-calculator') {
    const sex = document.getElementById('tdee-sex');
    const age = document.getElementById('tdee-age');
    const height = document.getElementById('tdee-height');
    const weight = document.getElementById('tdee-weight');
    const activity = document.getElementById('tdee-activity');
    const outBmr = document.getElementById('tdee-bmr');
    const outMaintain = document.getElementById('tdee-maintain');
    const outCut = document.getElementById('tdee-cut');
    const outBulk = document.getElementById('tdee-bulk');
    const outProtein = document.getElementById('tdee-protein');
    const outFat = document.getElementById('tdee-fat');
    const outCarb = document.getElementById('tdee-carb');
    const help = document.getElementById('tdee-help');
    const copyBtn = document.getElementById('tdee-copy');
    const resetBtn = document.getElementById('tdee-reset');

    if (!sex || !age || !height || !weight || !activity || !outBmr || !outMaintain || !outCut || !outBulk || !outProtein || !outFat || !outCarb || !help) return;

    const tdeeI18n = {
      ko: {
        idle: '값을 입력하면 BMR/TDEE와 목표별 칼로리가 계산됩니다.',
        invalidRange: '나이(10~100), 키(120~230), 몸무게(25~250) 범위를 확인해 주세요.',
        protein: '단백질',
        fat: '지방',
        carb: '탄수화물',
        selectedActivity: '선택 활동량',
        macroNotice: ' 현재 입력에서는 단백질/지방 최소치만으로 유지 칼로리를 거의 채워 탄수화물 권장량이 낮게 표시될 수 있습니다.',
        help: (activityLabel, cut, bulk, notice) => `${activityLabel} 기준 추정치입니다. 보수 감량은 주당 약 ${cut}kg, 린 증량은 주당 약 ${bulk}kg 변화를 목표로 합니다. 2~3주 체중/허리둘레 변화에 맞춰 100~200kcal 단위로 조정하세요.${notice}`,
        copyTitle: '칼로리 계산 결과',
        copyLabels: {
          maintain: '유지(TDEE)',
          cut: '감량',
          bulk: '증량'
        },
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        idle: 'Enter values to calculate BMR/TDEE and goal-based calories.',
        invalidRange: 'Check ranges: age (10–100), height (120–230), weight (25–250).',
        protein: 'Protein',
        fat: 'Fat',
        carb: 'Carbs',
        selectedActivity: 'Selected activity level',
        macroNotice: ' With your current inputs, minimum protein/fat may already use most maintenance calories, so recommended carbs can appear low.',
        help: (activityLabel, cut, bulk, notice) => `Estimate based on ${activityLabel}. A moderate cut targets about ${cut} kg/week, and a lean bulk targets about ${bulk} kg/week. Adjust by 100–200 kcal after tracking weight/waist changes for 2–3 weeks.${notice}`,
        copyTitle: 'Calorie calculation',
        copyLabels: {
          maintain: 'Maintain (TDEE)',
          cut: 'Cut',
          bulk: 'Bulk'
        },
        copied: 'Copied',
        copyDefault: 'Copy results'
      },
      ja: {
        idle: '値を入力すると、BMR/TDEEと目的別カロリーを計算します。',
        invalidRange: '範囲を確認してください（年齢 10〜100、身長 120〜230、体重 25〜250）。',
        protein: 'たんぱく質',
        fat: '脂質',
        carb: '炭水化物',
        selectedActivity: '選択した活動量',
        macroNotice: ' 現在の入力では、たんぱく質/脂質の最低量だけで維持カロリーの多くを占めるため、炭水化物推奨量が低く表示される場合があります。',
        help: (activityLabel, cut, bulk, notice) => `${activityLabel}を基準にした推定です。緩やかな減量は週あたり約${cut}kg、リーンバルクは週あたり約${bulk}kgの変化を目安にしています。2〜3週間の体重・ウエスト変化を見て100〜200kcal単位で調整してください。${notice}`,
        copyTitle: 'カロリー計算結果',
        copyLabels: {
          maintain: '維持 (TDEE)',
          cut: '減量',
          bulk: '増量'
        },
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const tdeeText = tdeeI18n[pageLang] || tdeeI18n.ko;
    const fmtKcal = (v) => `${Math.round(v).toLocaleString(numberLocale)}kcal`;
    const fmtGram = (v) => `${Math.round(v).toLocaleString(numberLocale)}g`;

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setIdle = (msg = tdeeText.idle) => {
      outBmr.textContent = '-';
      outMaintain.textContent = '-';
      outCut.textContent = '-';
      outBulk.textContent = '-';
      outProtein.textContent = `${tdeeText.protein}: -`;
      outFat.textContent = `${tdeeText.fat}: -`;
      outCarb.textContent = `${tdeeText.carb}: -`;
      help.textContent = msg;
    };

    const render = () => {
      const a = Number(age.value || 0);
      const h = Number(height.value || 0);
      const w = Number(weight.value || 0);
      const af = Number(activity.value || 1.2);

      if (!(a >= 10 && a <= 100) || !(h >= 120 && h <= 230) || !(w >= 25 && w <= 250)) {
        setIdle(tdeeText.invalidRange);
        return;
      }

      const bmr = sex.value === 'female'
        ? (10 * w + 6.25 * h - 5 * a - 161)
        : (10 * w + 6.25 * h - 5 * a + 5);
      const tdee = bmr * af;

      const cutModerate = tdee * 0.85;
      const cutAggressive = tdee * 0.8;
      const bulkLean = tdee * 1.06;
      const bulkAggressive = tdee * 1.12;

      // 유지 칼로리 기준 매크로: 단백질 1.8g/kg, 지방 0.8g/kg, 나머지 탄수화물
      const proteinG = Math.max(0, w * 1.8);
      const fatG = Math.max(0, w * 0.8);
      const macroBaseKcal = (proteinG * 4 + fatG * 9);
      const remainKcal = Math.max(0, tdee - macroBaseKcal);
      const carbG = remainKcal / 4;

      const weeklyCutKg = ((tdee - cutModerate) * 7) / 7700;
      const weeklyBulkKg = ((bulkLean - tdee) * 7) / 7700;

      outBmr.textContent = fmtKcal(bmr);
      outMaintain.textContent = fmtKcal(tdee);
      outCut.textContent = `${fmtKcal(cutModerate)} / ${fmtKcal(cutAggressive)}`;
      outBulk.textContent = `${fmtKcal(bulkLean)} / ${fmtKcal(bulkAggressive)}`;

      outProtein.textContent = `${tdeeText.protein}: ${fmtGram(proteinG)} (≈ ${(proteinG * 4).toLocaleString(numberLocale, { maximumFractionDigits: 0 })}kcal)`;
      outFat.textContent = `${tdeeText.fat}: ${fmtGram(fatG)} (≈ ${(fatG * 9).toLocaleString(numberLocale, { maximumFractionDigits: 0 })}kcal)`;
      outCarb.textContent = `${tdeeText.carb}: ${fmtGram(carbG)} (≈ ${(carbG * 4).toLocaleString(numberLocale, { maximumFractionDigits: 0 })}kcal)`;

      const activityLabel = activity.options[activity.selectedIndex]?.text || tdeeText.selectedActivity;
      const macroNotice = macroBaseKcal > tdee ? tdeeText.macroNotice : '';
      help.textContent = tdeeText.help(
        activityLabel,
        weeklyCutKg.toLocaleString(numberLocale, { maximumFractionDigits: 2 }),
        weeklyBulkKg.toLocaleString(numberLocale, { maximumFractionDigits: 2 }),
        macroNotice
      );
    };

    [sex, age, height, weight, activity].forEach((el) => el?.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      sex.value = 'male';
      age.value = 30;
      height.value = 170;
      weight.value = 68;
      activity.value = '1.55';
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (outBmr.textContent === '-') return;
      const text = [
        `${tdeeText.copyTitle}`,
        `BMR ${outBmr.textContent}`,
        `${tdeeText.copyLabels.maintain} ${outMaintain.textContent}`,
        `${tdeeText.copyLabels.cut} ${outCut.textContent}`,
        `${tdeeText.copyLabels.bulk} ${outBulk.textContent}`,
        outProtein.textContent,
        outFat.textContent,
        outCarb.textContent
      ].join(' | ');
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = tdeeText.copied;
      setTimeout(() => { copyBtn.textContent = old || tdeeText.copyDefault; }, 900);
    });

    if (!age.value) age.value = 30;
    if (!height.value) height.value = 170;
    if (!weight.value) weight.value = 68;
    if (!activity.value) activity.value = '1.55';
    render();
  }


  if (slug === 'brokerage-fee-calculator') {
    const type = document.getElementById('bf-type');
    const amount = document.getElementById('bf-amount');
    const deposit = document.getElementById('bf-deposit');
    const monthlyRent = document.getElementById('bf-monthly-rent');
    const rentHelper = document.getElementById('bf-rent-helper');
    const rateEl = document.getElementById('bf-rate');
    const limitEl = document.getElementById('bf-limit');
    const feeEl = document.getElementById('bf-fee');
    const vatEl = document.getElementById('bf-vat');
    const help = document.getElementById('bf-help');
    const copyBtn = document.getElementById('bf-copy');
    const resetBtn = document.getElementById('bf-reset');

    const i18n = {
      ko: {
        currency: '원',
        noFixedCap: '법정 정액 상한 없음',
        idle: '거래 유형과 거래금액을 입력하면 중개보수 상한을 계산합니다.',
        typeSale: '매매',
        typeRent: '임대차',
        rentHint: ' (환산금액: 보증금 + 월세×100)',
        helpLine: (typeLabel, rentHint) => `주택 ${typeLabel} 상한 요율 기준 계산값입니다${rentHint}. 실제 중개보수는 공인중개사와 상한 이내 협의로 결정됩니다.`,
        copyText: (typeLabel, amountText, rateText, feeText, vatText) => `거래유형: ${typeLabel}\n거래금액: ${amountText}\n적용 상한 요율: ${rateText}\n예상 중개보수(한도): ${feeText}\n부가세 포함(참고): ${vatText}`,
        copiedPrimary: '결과를 클립보드에 복사했습니다.',
        copiedFallback: '결과를 복사했습니다.'
      },
      en: {
        currency: ' KRW',
        noFixedCap: 'No fixed statutory cap',
        idle: 'Enter transaction type and amount to estimate the legal fee cap.',
        typeSale: 'Home sale',
        typeRent: 'Lease',
        rentHint: ' (converted value: deposit + monthly rent × 100)',
        helpLine: (typeLabel, rentHint) => `Based on Korea’s statutory upper-rate table for ${typeLabel.toLowerCase()}${rentHint}. Actual brokerage fees are negotiated within the legal cap.`,
        copyText: (typeLabel, amountText, rateText, feeText, vatText) => `Transaction type: ${typeLabel}\nTransaction amount: ${amountText}\nApplied max rate: ${rateText}\nEstimated brokerage fee (max): ${feeText}\nVAT included (reference): ${vatText}`,
        copiedPrimary: 'Copied to clipboard.',
        copiedFallback: 'Copied result.'
      },
      ja: {
        currency: 'ウォン',
        noFixedCap: '法定の定額上限なし',
        idle: '取引タイプと取引金額を入力すると、仲介手数料の上限を試算します。',
        typeSale: '売買',
        typeRent: '賃貸',
        rentHint: '（換算金額: 保証金 + 月家賃×100）',
        helpLine: (typeLabel, rentHint) => `住宅${typeLabel}の上限料率に基づく試算です${rentHint ? ` ${rentHint}` : ''}。実際の仲介手数料は上限内で協議して決まります。`,
        copyText: (typeLabel, amountText, rateText, feeText, vatText) => `取引タイプ: ${typeLabel}\n取引金額: ${amountText}\n適用上限料率: ${rateText}\n仲介手数料（上限目安）: ${feeText}\nVAT込み（参考）: ${vatText}`,
        copiedPrimary: 'クリップボードにコピーしました。',
        copiedFallback: '結果をコピーしました。'
      }
    };
    const t = i18n[pageLang] || i18n.ko;

    const KRW = (n) => `${Math.round(n || 0).toLocaleString(numberLocale)}${t.currency}`;

    const tables = {
      sale: [
        { max: 50000000, rate: 0.006, cap: 250000 },
        { max: 200000000, rate: 0.005, cap: 800000 },
        { max: 900000000, rate: 0.004, cap: null },
        { max: 1200000000, rate: 0.005, cap: null },
        { max: 1500000000, rate: 0.006, cap: null },
        { max: Infinity, rate: 0.007, cap: null }
      ],
      rent: [
        { max: 50000000, rate: 0.005, cap: 200000 },
        { max: 100000000, rate: 0.004, cap: 300000 },
        { max: 600000000, rate: 0.003, cap: null },
        { max: 1200000000, rate: 0.004, cap: null },
        { max: 1500000000, rate: 0.005, cap: null },
        { max: Infinity, rate: 0.006, cap: null }
      ]
    };

    const resolveRow = (tt, v) => (tables[tt] || tables.sale).find((r) => v <= r.max) || tables.sale[tables.sale.length - 1];

    const syncRentConvertedAmount = () => {
      if ((type?.value || 'sale') !== 'rent' || !amount) return;
      const d = Math.max(0, Number(deposit?.value || 0));
      const m = Math.max(0, Number(monthlyRent?.value || 0));
      if (!(d > 0 || m > 0)) return;
      amount.value = String(Math.round(d + (m * 100)));
    };

    const run = () => {
      if (rentHelper) rentHelper.hidden = (type?.value || 'sale') !== 'rent';

      const v = Number(amount?.value || 0);
      if (!v || v <= 0) {
        rateEl.textContent = '-';
        limitEl.textContent = '-';
        feeEl.textContent = '-';
        vatEl.textContent = '-';
        if (help) help.textContent = t.idle;
        return;
      }

      const currentType = type?.value || 'sale';
      const row = resolveRow(currentType, v);
      const raw = v * row.rate;
      const capped = row.cap ? Math.min(raw, row.cap) : raw;
      const vatIncluded = capped * 1.1;

      rateEl.textContent = `${(row.rate * 100).toFixed(1)}%`;
      limitEl.textContent = row.cap ? KRW(row.cap) : t.noFixedCap;
      feeEl.textContent = KRW(capped);
      vatEl.textContent = KRW(vatIncluded);

      if (help) {
        const typeLabel = currentType === 'sale' ? t.typeSale : t.typeRent;
        const rentHint = currentType === 'rent' ? t.rentHint : '';
        help.textContent = t.helpLine(typeLabel, rentHint);
      }
    };

    [type, amount, deposit, monthlyRent].forEach((el) => el?.addEventListener('input', () => {
      syncRentConvertedAmount();
      run();
    }));
    type?.addEventListener('change', () => {
      syncRentConvertedAmount();
      run();
    });

    copyBtn?.addEventListener('click', async () => {
      const typeLabel = type?.selectedOptions?.[0]?.text || '-';
      const text = t.copyText(typeLabel, KRW(Number(amount?.value || 0)), rateEl.textContent, feeEl.textContent, vatEl.textContent);
      try {
        await navigator.clipboard.writeText(text);
        if (help) help.textContent = t.copiedPrimary;
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (help) help.textContent = t.copiedFallback;
      }
    });

    resetBtn?.addEventListener('click', () => {
      if (type) type.value = 'sale';
      if (amount) amount.value = '';
      if (deposit) deposit.value = '';
      if (monthlyRent) monthlyRent.value = '';
      run();
    });

    run();
  }

  if (slug === 'weekly-holiday-pay-calculator') {
    const hourly = document.getElementById('whp-hourly');
    const hours = document.getElementById('whp-hours');
    const days = document.getElementById('whp-days');
    const perfect = document.getElementById('whp-perfect');
    const eligibleEl = document.getElementById('whp-eligible');
    const paidHoursEl = document.getElementById('whp-hours-paid');
    const weeklyEl = document.getElementById('whp-weekly');
    const monthlyEl = document.getElementById('whp-monthly');
    const help = document.getElementById('whp-help');
    const copyBtn = document.getElementById('whp-copy');
    const resetBtn = document.getElementById('whp-reset');

    if (!hourly || !hours || !days || !perfect || !eligibleEl || !paidHoursEl || !weeklyEl || !monthlyEl || !help) return;

    const i18n = {
      ko: {
        currency: '원',
        hourUnit: '시간',
        invalidNumber: '숫자 형식으로 입력해 주세요.',
        needInput: '시급·주 소정근로시간·근무일수를 입력하세요.',
        eligible: '대상',
        ineligible: '비대상',
        under15h: '주 15시간 미만이면 일반적으로 주휴수당 대상이 아닙니다.',
        noPerfect: '개근 조건을 충족하지 않으면 해당 주 주휴수당이 제한될 수 있습니다.',
        capNotice: ' (주휴시간 상한 8시간 적용)',
        summary: (w, m, c) => `입력 기준 예상 주휴수당은 주 ${w}, 월 환산 ${m}입니다.${c}`,
        copy: (e, h, w, m) => `주휴수당 계산 결과 | 대상 여부 ${e} | 주휴시간 ${h} | 주 ${w} | 월 환산 ${m}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW',
        hourUnit: 'h',
        invalidNumber: 'Please enter valid numbers.',
        needInput: 'Enter hourly wage, weekly hours, and scheduled workdays.',
        eligible: 'Eligible',
        ineligible: 'Not eligible',
        under15h: 'Under 15 weekly hours is generally not eligible for paid weekly holiday allowance.',
        noPerfect: 'If perfect attendance is not met, the allowance may be limited for that week.',
        capNotice: ' (8-hour cap applied to paid holiday hours)',
        summary: (w, m, c) => `Estimated paid holiday allowance: ${w} per week, ${m} per month.${c}`,
        copy: (e, h, w, m) => `Weekly holiday pay result | Eligibility: ${e} | Paid holiday hours: ${h} | Weekly: ${w} | Monthly est.: ${m}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        currency: 'ウォン',
        hourUnit: '時間',
        invalidNumber: '数値形式で入力してください。',
        needInput: '時給・週労働時間・勤務日数を入力してください。',
        eligible: '対象',
        ineligible: '対象外',
        under15h: '週15時間未満の場合、一般的に週休手当の対象外です。',
        noPerfect: '皆勤条件を満たさない場合、その週の週休手当は制限されることがあります。',
        capNotice: '（週休時間の上限8時間を適用）',
        summary: (w, m, c) => `入力条件での週休手当見込みは週 ${w}、月換算 ${m} です。${c}`,
        copy: (e, h, w, m) => `週休手当計算結果 | 対象可否 ${e} | 週休時間 ${h} | 週 ${w} | 月換算 ${m}`,
        copied: 'コピーしました',
        copyDefault: '結果をコピー'
      }
    };
    const t = i18n[pageLang] || i18n.ko;

    const KRW = (n) => `${Math.round(n || 0).toLocaleString(numberLocale)}${t.currency}`;
    const HOURS = (n) => `${Number(n || 0).toLocaleString(numberLocale, { maximumFractionDigits: 2 })}${t.hourUnit}`;

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      eligibleEl.textContent = '-';
      paidHoursEl.textContent = '-';
      weeklyEl.textContent = '-';
      monthlyEl.textContent = '-';
      help.textContent = msg;
    };

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const render = () => {
      const wageRaw = Number(hourly.value || 0);
      const weekHoursRaw = Number(hours.value || 0);
      const weekDaysRaw = Number(days.value || 0);

      if (!Number.isFinite(wageRaw) || !Number.isFinite(weekHoursRaw) || !Number.isFinite(weekDaysRaw)) {
        setIdle(t.invalidNumber);
        return;
      }

      const wage = clamp(wageRaw, 0, 1000000);
      const weekHours = clamp(weekHoursRaw, 0, 80);
      const weekDays = clamp(Math.floor(weekDaysRaw), 1, 7);
      const isPerfect = !!perfect.checked;

      if (wageRaw !== wage) hourly.value = wage;
      if (weekHoursRaw !== weekHours) hours.value = weekHours;
      if (weekDaysRaw !== weekDays) days.value = weekDays;

      if (!(wage > 0) || !(weekHours > 0) || !(weekDays > 0)) {
        setIdle(t.needInput);
        return;
      }

      const eligibleByHour = weekHours >= 15;
      const eligible = eligibleByHour && isPerfect;
      const rawPaidHours = weekHours / weekDays;
      const paidHours = Math.min(8, rawPaidHours);
      const weeklyPay = eligible ? (paidHours * wage) : 0;
      const monthlyPay = weeklyPay * 4.345;

      eligibleEl.textContent = eligible ? t.eligible : t.ineligible;
      paidHoursEl.textContent = HOURS(eligible ? paidHours : 0);
      weeklyEl.textContent = KRW(weeklyPay);
      monthlyEl.textContent = KRW(monthlyPay);

      if (!eligibleByHour) {
        help.textContent = t.under15h;
      } else if (!isPerfect) {
        help.textContent = t.noPerfect;
      } else {
        const capNotice = rawPaidHours > 8 ? t.capNotice : '';
        help.textContent = t.summary(KRW(weeklyPay), KRW(monthlyPay), capNotice);
      }
    };

    [hourly, hours, days, perfect].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (eligibleEl.textContent === '-') return;
      const text = t.copy(eligibleEl.textContent, paidHoursEl.textContent, weeklyEl.textContent, monthlyEl.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      hourly.value = 10030;
      hours.value = 20;
      days.value = 5;
      perfect.checked = true;
      render();
    });

    if (!hourly.value) hourly.value = 10030;
    if (!hours.value) hours.value = 20;
    if (!days.value) days.value = 5;
    render();
  }


  if (slug === 'jeonse-vs-wolse-calculator') {
    const jeonse = document.getElementById('jv-jeonse');
    const wolseDeposit = document.getElementById('jv-wolse-deposit');
    const wolseRent = document.getElementById('jv-wolse-rent');
    const rate = document.getElementById('jv-rate');
    const months = document.getElementById('jv-months');
    const jeonseCostEl = document.getElementById('jv-jeonse-cost');
    const wolseCostEl = document.getElementById('jv-wolse-cost');
    const monthlyGapEl = document.getElementById('jv-monthly-gap');
    const breakEvenEl = document.getElementById('jv-break-even');
    const help = document.getElementById('jv-help');
    const copyBtn = document.getElementById('jv-copy');
    const resetBtn = document.getElementById('jv-reset');

    if (!jeonse || !wolseDeposit || !wolseRent || !rate || !months || !jeonseCostEl || !wolseCostEl || !monthlyGapEl || !breakEvenEl || !help) return;

    const jvI18n = {
      ko: {
        currency: '원',
        needInput: '전세 보증금과 거주기간을 입력하세요.',
        jeonseBetter: '전세 유리',
        wolseBetter: '월세 유리',
        similar: '거의 동일',
        monthlyGap: (v, label) => `${v} (${label})`,
        helpJeonse: (v) => `입력 조건에서는 전세의 월 환산 주거비가 약 ${v} 더 낮습니다.`,
        helpWolse: (v) => `입력 조건에서는 월세의 월 환산 주거비가 약 ${v} 더 낮습니다.`,
        helpSame: '입력 조건에서 전세와 월세의 월 환산 주거비가 거의 같습니다.',
        copy: (a,b,c,d) => `전세 vs 월세 비교 | 전세 총 주거비 ${a} | 월세 총 주거비 ${b} | 월 기준 비용 차이 ${c} | 손익분기 월세 ${d}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: '',
        needInput: 'Enter jeonse deposit and stay period.',
        jeonseBetter: 'Jeonse is cheaper',
        wolseBetter: 'Wolse is cheaper',
        similar: 'Almost the same',
        monthlyGap: (v, label) => `${v} (${label})`,
        helpJeonse: (v) => `Under this scenario, jeonse is lower by about ${v} per month-equivalent cost.`,
        helpWolse: (v) => `Under this scenario, wolse is lower by about ${v} per month-equivalent cost.`,
        helpSame: 'Under this scenario, jeonse and wolse are nearly the same on a monthly-equivalent basis.',
        copy: (a,b,c,d) => `Jeonse vs Wolse | Total jeonse cost ${a} | Total wolse cost ${b} | Monthly cost gap ${c} | Break-even wolse rent ${d}`,
        copied: 'Copied',
        copyDefault: 'Copy results'
      },
      ja: {
        currency: 'ウォン',
        needInput: 'チョンセ保証金と居住期間を入力してください。',
        jeonseBetter: 'チョンセが有利',
        wolseBetter: 'ウォルセが有利',
        similar: 'ほぼ同じ',
        monthlyGap: (v, label) => `${v}（${label}）`,
        helpJeonse: (v) => `この条件では、月額換算でチョンセのほうが約 ${v} 低くなります。`,
        helpWolse: (v) => `この条件では、月額換算でウォルセのほうが約 ${v} 低くなります。`,
        helpSame: 'この条件では、月額換算でチョンセとウォルセはほぼ同水準です。',
        copy: (a,b,c,d) => `チョンセ vs ウォルセ | チョンセ総住居費 ${a} | ウォルセ総住居費 ${b} | 月額コスト差 ${c} | 損益分岐ウォルセ家賃 ${d}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const t = jvI18n[pageLang] || jvI18n.ko;
    const fmtCurrency = (v) => {
      const rounded = Math.round(v);
      if (pageLang === 'en') return `${rounded.toLocaleString(numberLocale)} KRW`;
      return `${rounded.toLocaleString(numberLocale)}${t.currency}`;
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      jeonseCostEl.textContent = '-';
      wolseCostEl.textContent = '-';
      monthlyGapEl.textContent = '-';
      breakEvenEl.textContent = '-';
      help.textContent = msg;
    };

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const render = () => {
      const j = Math.max(0, Number(jeonse.value || 0));
      const wd = Math.max(0, Number(wolseDeposit.value || 0));
      const wr = Math.max(0, Number(wolseRent.value || 0));
      const rRaw = Number(rate.value || 0);
      const mRaw = Number(months.value || 0);

      if (!(j > 0) || !(mRaw > 0)) {
        setIdle(t.needInput);
        return;
      }

      const r = Number.isFinite(rRaw) ? clamp(rRaw, 0, 30) : 0;
      const m = Number.isFinite(mRaw) ? clamp(Math.floor(mRaw), 1, 120) : 1;
      if (rRaw !== r) rate.value = r;
      if (mRaw !== m) months.value = m;

      const annualRate = r / 100;
      const monthRate = annualRate / 12;
      const jeonseCost = j * annualRate * (m / 12);
      const wolseOpportunity = wd * annualRate * (m / 12);
      const wolseCost = wolseOpportunity + (wr * m);

      const monthlyJeonse = jeonseCost / m;
      const monthlyWolse = wolseCost / m;
      const gapMonthly = monthlyWolse - monthlyJeonse;
      const breakEvenMonthlyRent = Math.max(0, (j - wd) * monthRate);

      jeonseCostEl.textContent = fmtCurrency(jeonseCost);
      wolseCostEl.textContent = fmtCurrency(wolseCost);
      monthlyGapEl.textContent = t.monthlyGap(fmtCurrency(Math.abs(gapMonthly)), gapMonthly > 0 ? t.jeonseBetter : gapMonthly < 0 ? t.wolseBetter : t.similar);
      breakEvenEl.textContent = fmtCurrency(breakEvenMonthlyRent);

      if (gapMonthly > 0) help.textContent = t.helpJeonse(fmtCurrency(Math.abs(gapMonthly)));
      else if (gapMonthly < 0) help.textContent = t.helpWolse(fmtCurrency(Math.abs(gapMonthly)));
      else help.textContent = t.helpSame;
    };

    [jeonse, wolseDeposit, wolseRent, rate, months].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (jeonseCostEl.textContent === '-') return;
      const text = t.copy(jeonseCostEl.textContent, wolseCostEl.textContent, monthlyGapEl.textContent, breakEvenEl.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      jeonse.value = 400000000;
      wolseDeposit.value = 50000000;
      wolseRent.value = 1100000;
      rate.value = 3.5;
      months.value = 24;
      render();
    });

    if (!jeonse.value) jeonse.value = 400000000;
    if (!wolseDeposit.value) wolseDeposit.value = 50000000;
    if (!wolseRent.value) wolseRent.value = 1100000;
    if (!rate.value) rate.value = 3.5;
    if (!months.value) months.value = 24;
    render();
  }


  if (slug === 'tip-calculator') {
    const subtotalEl = document.getElementById('tip-subtotal');
    const taxEl = document.getElementById('tip-tax');
    const serviceEl = document.getElementById('tip-service');
    const peopleEl = document.getElementById('tip-people');
    const baseModeEl = document.getElementById('tip-base-mode');
    const tipModeEl = document.getElementById('tip-mode');
    const tipRateEl = document.getElementById('tip-rate');
    const tipFixedEl = document.getElementById('tip-fixed');
    const tipRateWrap = document.getElementById('tip-rate-wrap');
    const tipFixedWrap = document.getElementById('tip-fixed-wrap');

    const outTip = document.getElementById('tip-tip-amount');
    const outTotal = document.getElementById('tip-total');
    const outPer = document.getElementById('tip-per-person');
    const outBase = document.getElementById('tip-base-amount');
    const help = document.getElementById('tip-help');
    const copyBtn = document.getElementById('tip-copy');
    const resetBtn = document.getElementById('tip-reset');

    if (!subtotalEl || !taxEl || !serviceEl || !peopleEl || !baseModeEl || !tipModeEl || !tipRateEl || !tipFixedEl || !outTip || !outTotal || !outPer || !outBase || !help) return;

    const text = {
      ko: {
        noInput: '결제 금액을 입력하면 결과가 계산됩니다.',
        summary: (tip, total, per, people) => `팁 ${tip}, 총 ${total}, ${people}인 기준 1인당 ${per}`,
        copy: '팁 계산 결과',
        copyTip: '팁',
        copyTotal: '총액',
        copyPerPerson: '1인당',
        copyBase: '팁 기준 금액',
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        noInput: 'Enter bill values to calculate results.',
        summary: (tip, total, per, people) => `Tip ${tip}, total ${total}, ${per} per person (${people} people)`,
        copy: 'Tip calculation',
        copyTip: 'Tip',
        copyTotal: 'Total',
        copyPerPerson: 'Per person',
        copyBase: 'Tip base',
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        noInput: '金額を入力すると結果を計算します。',
        summary: (tip, total, per, people) => `チップ ${tip}、合計 ${total}、${people}人で1人あたり ${per}`,
        copy: 'チップ計算結果',
        copyTip: 'チップ',
        copyTotal: '合計',
        copyPerPerson: '1人あたり',
        copyBase: 'チップ基準額',
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      noInput: '결제 금액을 입력하면 결과가 계산됩니다.',
      summary: (tip, total, per, people) => `팁 ${tip}, 총 ${total}, ${people}인 기준 1인당 ${per}`,
      copy: '팁 계산 결과',
      copyTip: '팁',
      copyTotal: '총액',
      copyPerPerson: '1인당',
      copyBase: '팁 기준 금액',
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const fmtMoney = (v) => {
      const n = Number(v || 0);
      return n.toLocaleString(numberLocale, { maximumFractionDigits: 2 });
    };

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    const parseNonNegative = (el, max = 1000000000000) => {
      const raw = Number(el?.value || 0);
      if (!Number.isFinite(raw)) return 0;
      return clamp(raw, 0, max);
    };

    const copyText = async (v) => {
      try { await navigator.clipboard.writeText(v); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = v; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const syncMode = () => {
      const fixed = (tipModeEl.value || 'percent') === 'fixed';
      if (tipRateWrap) tipRateWrap.hidden = fixed;
      if (tipFixedWrap) tipFixedWrap.hidden = !fixed;
    };

    const render = () => {
      syncMode();
      const subtotal = parseNonNegative(subtotalEl);
      const tax = parseNonNegative(taxEl);
      const service = parseNonNegative(serviceEl);

      const peopleRaw = Number(peopleEl.value || 1);
      const people = Number.isFinite(peopleRaw) ? clamp(Math.floor(peopleRaw), 1, 1000) : 1;
      if (peopleRaw !== people) peopleEl.value = people;

      if (subtotal <= 0 && tax <= 0 && service <= 0) {
        outTip.textContent = '-';
        outTotal.textContent = '-';
        outPer.textContent = '-';
        outBase.textContent = '-';
        help.textContent = text.noInput;
        return;
      }

      const billTotal = subtotal + tax + service;
      const tipBase = (baseModeEl.value || 'subtotal') === 'total' ? billTotal : subtotal;
      const tipRateRaw = Number(tipRateEl.value || 0);
      const tipRate = Number.isFinite(tipRateRaw) ? clamp(tipRateRaw, 0, 100) : 0;
      if (tipRateRaw !== tipRate) tipRateEl.value = tipRate;

      const tipFixedRaw = Number(tipFixedEl.value || 0);
      const tipFixed = Number.isFinite(tipFixedRaw) ? clamp(tipFixedRaw, 0, 1000000000000) : 0;
      if (tipFixedRaw !== tipFixed) tipFixedEl.value = tipFixed;

      const tipAmount = (tipModeEl.value || 'percent') === 'fixed'
        ? tipFixed
        : tipBase * (tipRate / 100);

      const total = billTotal + tipAmount;
      const per = total / people;

      outTip.textContent = fmtMoney(tipAmount);
      outTotal.textContent = fmtMoney(total);
      outPer.textContent = fmtMoney(per);
      outBase.textContent = fmtMoney(tipBase);
      help.textContent = text.summary(fmtMoney(tipAmount), fmtMoney(total), fmtMoney(per), people.toLocaleString(numberLocale));
    };

    [subtotalEl, taxEl, serviceEl, peopleEl, baseModeEl, tipModeEl, tipRateEl, tipFixedEl].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (outTotal.textContent === '-') return;
      const msg = `${text.copy} | ${text.copyTip} ${outTip.textContent} | ${text.copyTotal} ${outTotal.textContent} | ${text.copyPerPerson} ${outPer.textContent} | ${text.copyBase} ${outBase.textContent}`;
      await copyText(msg);
      const old = copyBtn.textContent;
      copyBtn.textContent = text.copied;
      setTimeout(() => { copyBtn.textContent = old || text.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      subtotalEl.value = 100;
      taxEl.value = 10;
      serviceEl.value = 0;
      peopleEl.value = 2;
      baseModeEl.value = 'subtotal';
      tipModeEl.value = 'percent';
      tipRateEl.value = 15;
      tipFixedEl.value = '';
      render();
    });

    if (!subtotalEl.value) subtotalEl.value = 100;
    if (!taxEl.value) taxEl.value = 10;
    if (!peopleEl.value) peopleEl.value = 2;
    if (!tipRateEl.value) tipRateEl.value = 15;
    render();
  }

  if (slug === 'blog-banned-word-checker') {
    const input = document.getElementById('bw-input');
    const summary = document.getElementById('bw-summary');
    const list = document.getElementById('bw-list');
    const totalEl = document.getElementById('bw-total');
    const spamEl = document.getElementById('bw-spam');
    const claimEl = document.getElementById('bw-claim');
    const linkEl = document.getElementById('bw-link');
    if (!input || !list) return;

    const bwI18n = {
      ko: {
        catSpamPromo: '스팸/홍보 키워드',
        catOverclaim: '의학·법률·금융 과장 표현',
        catAbuse: '어뷰징 의심 패턴',
        catContact: '연락처/아이디 유도',
        catLinks: '외부 링크/단축 URL',
        catRepeat: '과도한 키워드 반복',
        catHashtag: '해시태그 남발',
        countHit: '건',
        countItem: '개',
        countTimes: '회',
        hashtagDetail: '해시태그 수가 많습니다. 본문 맥락과 직접 관련된 태그만 최소화하세요.',
        emptyState: '현재 기준으로 감지된 금칙/주의 패턴이 없습니다.',
        idle: '텍스트를 입력하면 금칙/주의 패턴을 실시간 점검합니다.',
        highRisk: (n) => `위험도 높음: 총 ${n}건 감지. 스팸성/과장 표현을 적극 수정하세요.`,
        caution: (n) => `주의 필요: 총 ${n}건 감지. 반복 키워드·링크·표현을 정리하세요.`,
        mild: (n) => `경미한 주의: ${n}건 감지. 문맥 중심으로 자연스럽게 다듬으세요.`,
        clean: '감지 항목이 없습니다. 그래도 문맥/정보가치 중심으로 최종 검수하세요.'
      },
      en: {
        catSpamPromo: 'Spam/promo keywords',
        catOverclaim: 'Overclaim wording (medical/legal/finance)',
        catAbuse: 'Potential abuse patterns',
        catContact: 'Contact/ID solicitation',
        catLinks: 'External links / short URLs',
        catRepeat: 'Excessive keyword repetition',
        catHashtag: 'Hashtag stuffing',
        countHit: ' hits',
        countItem: ' items',
        countTimes: ' times',
        hashtagDetail: 'Too many hashtags detected. Keep only tags that are directly relevant to the content.',
        emptyState: 'No banned/risky pattern detected with the current rules.',
        idle: 'Paste text to scan banned/risky patterns in real time.',
        highRisk: (n) => `High risk: ${n} hits detected. Rewrite spammy or overclaim wording aggressively.`,
        caution: (n) => `Needs attention: ${n} hits detected. Clean repetitive keywords, links, and tone.`,
        mild: (n) => `Mild caution: ${n} hit(s) detected. Smooth out wording with context-first edits.`,
        clean: 'No detected issue. Still run a final review for context and information value.'
      },
      ja: {
        catSpamPromo: 'スパム/宣伝キーワード',
        catOverclaim: '医療・法律・金融の誇大表現',
        catAbuse: '不正利用が疑われる反復パターン',
        catContact: '連絡先/IDへの誘導',
        catLinks: '外部リンク/短縮URL',
        catRepeat: 'キーワードの過剰反復',
        catHashtag: 'ハッシュタグ過多',
        countHit: '件',
        countItem: '個',
        countTimes: '回',
        hashtagDetail: 'ハッシュタグが多すぎます。本文と直接関係するタグだけに絞ってください。',
        emptyState: '現在の基準では禁止語/注意パターンは検出されませんでした。',
        idle: 'テキストを入力すると、禁止語/注意パターンをリアルタイムで点検します。',
        highRisk: (n) => `高リスク: 合計${n}件を検出。スパム的・誇大な表現を積極的に修正してください。`,
        caution: (n) => `要注意: 合計${n}件を検出。反復キーワード・リンク・表現を整理してください。`,
        mild: (n) => `軽度注意: ${n}件を検出。文脈を意識して自然な表現に整えてください。`,
        clean: '検出項目はありません。最終的に文脈と情報価値の観点で見直してください。'
      }
    };
    const t = bwI18n[pageLang] || bwI18n.ko;

    const rules = [
      { cat: t.catSpamPromo, tag: 'spam', re: /(대출|도박|성인물|카지노|바카라|급전|무료체험|최저가|특가|당일지급|고수익|부업문의|재택알바|loan|casino|gambling|adult\s?content|free\s?trial|guaranteed\s?profit|side\s?hustle|副業|無料体験|最安値|即日支給|高収益)/gi },
      { cat: t.catOverclaim, tag: 'claim', re: /(무조건|100%|완치|치료|암\s*예방|직빵|평생보장|절대\s*손해\s*없음|보장수익|guaranteed|cure|always|no\s?risk|risk[-\s]?free|絶対|完治|必ず|ノーリスク)/gi },
      { cat: t.catAbuse, tag: 'spam', re: /(강추\s*강추|최저가\s*최저가|후기\s*후기|추천\s*추천|best\s*best|must\s*buy\s*must\s*buy|おすすめ\s*おすすめ)/gi },
      { cat: t.catContact, tag: 'link', re: /(01[0-9][-\s]?[0-9]{3,4}[-\s]?[0-9]{4}|카카오톡\s*ID|카톡\s*아이디|오픈채팅|텔레그램\s*@?\w+|kakao\s?talk\s?id|line\s?id|telegram\s*@?\w+|open\s?chat|連絡先|オープンチャット|テレグラム\s*@?\w+)/gi },
      { cat: t.catLinks, tag: 'link', re: /(https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+)/gi }
    ];

    const repetitionCheck = (text) => {
      const words = (text.match(/[가-힣A-Za-zぁ-んァ-ン一-龥]{2,}/g) || []).map((w) => w.toLowerCase());
      const count = {};
      words.forEach((w) => { count[w] = (count[w] || 0) + 1; });
      const top = Object.entries(count).sort((a,b) => b[1]-a[1]).slice(0, 5);
      const bad = top.filter(([, n]) => n >= 5);
      return { bad, top };
    };

    const hashtagCheck = (text) => {
      const tags = text.match(/#[^\s#]+/g) || [];
      return { tags, over: tags.length >= 8 };
    };

    const render = () => {
      const text = input.value || '';
      list.innerHTML = '';
      let total = 0, spam = 0, claim = 0, link = 0;

      rules.forEach((rule) => {
        const matches = text.match(rule.re) || [];
        if (!matches.length) return;
        total += matches.length;
        if (rule.tag === 'spam') spam += matches.length;
        if (rule.tag === 'claim') claim += matches.length;
        if (rule.tag === 'link') link += matches.length;

        const item = document.createElement('div');
        item.className = 'bw-item';
        const uniq = Array.from(new Set(matches.map((m) => m.trim()))).slice(0, 8).join(', ');
        item.innerHTML = `<strong>${rule.cat}<span class="bw-tag">${matches.length}${t.countHit}</span></strong><p>${uniq}</p>`;
        list.appendChild(item);
      });

      const rep = repetitionCheck(text);
      if (rep.bad.length) {
        const item = document.createElement('div');
        item.className = 'bw-item';
        const view = rep.bad.map(([w,n]) => `${w}(${n}${t.countTimes})`).join(', ');
        item.innerHTML = `<strong>${t.catRepeat}<span class="bw-tag">${rep.bad.length}${t.countItem}</span></strong><p>${view}</p>`;
        list.appendChild(item);
        total += rep.bad.length;
        spam += rep.bad.length;
      }

      const hs = hashtagCheck(text);
      if (hs.over) {
        const item = document.createElement('div');
        item.className = 'bw-item';
        item.innerHTML = `<strong>${t.catHashtag}<span class="bw-tag">${hs.tags.length}${t.countItem}</span></strong><p>${t.hashtagDetail}</p>`;
        list.appendChild(item);
        total += hs.tags.length;
        spam += hs.tags.length;
      }

      if (!total) {
        list.innerHTML = `<div class="empty-state">${t.emptyState}</div>`;
      }

      totalEl.textContent = String(total);
      spamEl.textContent = String(spam);
      claimEl.textContent = String(claim);
      linkEl.textContent = String(link);

      if (summary) {
        if (!text.trim()) summary.textContent = t.idle;
        else if (total >= 15) summary.textContent = t.highRisk(total);
        else if (total >= 6) summary.textContent = t.caution(total);
        else if (total > 0) summary.textContent = t.mild(total);
        else summary.textContent = t.clean;
      }
    };

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(render, 80);
    });
    render();
  }

  if (slug === 'json-merge') {
    const filesInput = document.getElementById('jm-files');
    const modeSel = document.getElementById('jm-mode');
    const runBtn = document.getElementById('jm-run');
    const copyBtn = document.getElementById('jm-copy');
    const output = document.getElementById('jm-output');
    const download = document.getElementById('jm-download');
    const help = document.getElementById('jm-help');
    const fileCount = document.getElementById('jm-file-count');
    const itemCount = document.getElementById('jm-item-count');
    const conflictCount = document.getElementById('jm-conflict-count');
    const sizeOut = document.getElementById('jm-size');

    if (!filesInput || !modeSel || !runBtn || !copyBtn || !output || !download || !help || !fileCount || !itemCount || !conflictCount || !sizeOut) return;

    const jmI18n = {
      ko: {
        readFail: (name) => `파일 읽기 실패: ${name}`,
        parseFail: (name) => `JSON 파싱 실패: ${name}`,
        needFiles: '먼저 JSON 파일을 1개 이상 선택하세요.',
        mergeDone: (count, mode) => `${count}개 파일 병합 완료 (${mode}). 다운로드 버튼으로 저장하세요.`,
        mergeError: '병합 중 오류가 발생했습니다.',
        noCopy: '복사할 병합 결과가 없습니다. 먼저 JSON 합치기를 실행하세요.',
        copied: '복사됨',
        copyDefault: '결과 복사',
        modeLabelMap: {
          'array-concat': '배열 이어붙이기',
          'object-merge': '객체 키 병합',
          'object-array-concat': '객체 내 공통 배열 자동 이어붙이기',
          'wrap-array': '파일별 루트 배열 감싸기'
        }
      },
      en: {
        readFail: (name) => `Failed to read file: ${name}`,
        parseFail: (name) => `JSON parse failed: ${name}`,
        needFiles: 'Select at least one JSON file first.',
        mergeDone: (count, mode) => `Merged ${count} file(s) (${mode}). Use the download button to save.`,
        mergeError: 'An error occurred while merging.',
        noCopy: 'No merged result to copy. Run JSON merge first.',
        copied: 'Copied',
        copyDefault: 'Copy result',
        modeLabelMap: {
          'array-concat': 'Concatenate arrays',
          'object-merge': 'Merge object keys',
          'object-array-concat': 'Auto-concatenate common array in objects',
          'wrap-array': 'Wrap file roots into array'
        }
      },
      ja: {
        readFail: (name) => `ファイルの読み込みに失敗しました: ${name}`,
        parseFail: (name) => `JSONの解析に失敗しました: ${name}`,
        needFiles: '先にJSONファイルを1つ以上選択してください。',
        mergeDone: (count, mode) => `${count}個のファイルをマージしました（${mode}）。ダウンロードで保存してください。`,
        mergeError: 'マージ中にエラーが発生しました。',
        noCopy: 'コピーするマージ結果がありません。先にJSONマージを実行してください。',
        copied: 'コピー完了',
        copyDefault: '結果をコピー',
        modeLabelMap: {
          'array-concat': '配列を連結',
          'object-merge': 'オブジェクトキー統合',
          'object-array-concat': 'オブジェクト内の共通配列を自動連結',
          'wrap-array': '各ファイルのルートを配列で包む'
        }
      }
    };
    const jmText = jmI18n[pageLang] || jmI18n.ko;

    const fmt = (n) => Number(n || 0).toLocaleString(numberLocale);

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const readText = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error(jmText.readFail(file.name)));
      reader.readAsText(file, 'utf-8');
    });

    const detectMode = (roots) => {
      if (roots.every((v) => Array.isArray(v))) return 'array-concat';
      if (roots.every((v) => v && typeof v === 'object' && !Array.isArray(v))) {
        // 흔한 패턴: { items: [...] } 형태를 파일별로 분할 저장한 경우
        const keySets = roots.map((obj) => Object.keys(obj));
        const commonKeys = keySets.reduce((acc, keys) => acc.filter((k) => keys.includes(k)), keySets[0] || []);
        const arrayCommonKeys = commonKeys.filter((k) => roots.every((obj) => Array.isArray(obj[k])));
        if (arrayCommonKeys.length === 1) return 'object-array-concat';
        return 'object-merge';
      }
      return 'wrap-array';
    };

    const getCount = (value) => {
      if (Array.isArray(value)) return value.length;
      if (value && typeof value === 'object') return Object.keys(value).length;
      return 1;
    };

    filesInput.addEventListener('change', () => {
      fileCount.textContent = fmt(filesInput.files?.length || 0);
    });

    runBtn.addEventListener('click', async () => {
      const files = Array.from(filesInput.files || []);
      if (!files.length) {
        help.textContent = jmText.needFiles;
        return;
      }

      try {
        const texts = await Promise.all(files.map(readText));
        const parsed = texts.map((txt, idx) => {
          try {
            return JSON.parse(txt);
          } catch (_) {
            throw new Error(jmText.parseFail(files[idx].name));
          }
        });

        const selected = modeSel.value || 'auto';
        const mode = selected === 'auto' ? detectMode(parsed) : selected;

        let merged;
        let conflicts = 0;

        if (mode === 'array-concat') {
          merged = parsed.flatMap((v) => Array.isArray(v) ? v : [v]);
        } else if (mode === 'object-array-concat') {
          const keySets = parsed.map((obj) => Object.keys(obj));
          const commonKeys = keySets.reduce((acc, keys) => acc.filter((k) => keys.includes(k)), keySets[0] || []);
          const arrayKey = commonKeys.find((k) => parsed.every((obj) => Array.isArray(obj[k])));
          merged = { ...(parsed[0] || {}) };
          merged[arrayKey] = parsed.flatMap((obj) => Array.isArray(obj[arrayKey]) ? obj[arrayKey] : []);
          parsed.slice(1).forEach((obj) => {
            Object.keys(obj || {}).forEach((k) => {
              if (k === arrayKey) return;
              if (Object.prototype.hasOwnProperty.call(merged, k)) conflicts += 1;
              merged[k] = obj[k];
            });
          });
        } else if (mode === 'object-merge') {
          merged = {};
          parsed.forEach((obj) => {
            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
            Object.keys(obj).forEach((k) => {
              if (Object.prototype.hasOwnProperty.call(merged, k)) conflicts += 1;
              merged[k] = obj[k];
            });
          });
        } else {
          merged = parsed;
        }

        const pretty = JSON.stringify(merged, null, 2);
        output.value = pretty;

        const blob = new Blob([pretty], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        download.href = url;
        download.download = `merged-${new Date().toISOString().slice(0, 10)}.json`;

        itemCount.textContent = fmt(getCount(merged));
        conflictCount.textContent = fmt(conflicts);
        sizeOut.textContent = fmt(new TextEncoder().encode(pretty).length);
        help.textContent = jmText.mergeDone(files.length, jmText.modeLabelMap[mode] || mode);
      } catch (err) {
        output.value = '';
        itemCount.textContent = '-';
        conflictCount.textContent = '-';
        sizeOut.textContent = '-';
        help.textContent = err?.message || jmText.mergeError;
      }
    });

    copyBtn.addEventListener('click', async () => {
      const text = output.value || '';
      if (!text.trim()) {
        help.textContent = jmText.noCopy;
        return;
      }
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = jmText.copied;
      setTimeout(() => { copyBtn.textContent = old || jmText.copyDefault; }, 900);
    });
  }

  if (slug === 'font-change') {
    const input = document.getElementById('fc-input');
    const list = document.getElementById('fc-list');
    const toast = document.getElementById('fc-toast');
    const showFavBtn = document.getElementById('fc-show-fav');
    const showAllBtn = document.getElementById('fc-show-all');
    const clearFavBtn = document.getElementById('fc-clear-fav');
    if (!input || !list) return;

    const favStoreKey = 'toolog-font-favorites-v1';
    let favorites = new Set();
    let onlyFav = false;
    let showAll = false;

    try {
      const saved = JSON.parse(localStorage.getItem(favStoreKey) || '[]');
      if (Array.isArray(saved)) favorites = new Set(saved);
    } catch (_) {}

    const mapByOffset = (str, startUpper, startLower, startDigit = null) =>
      Array.from(str).map((ch) => {
        const code = ch.codePointAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(startUpper + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(startLower + (code - 97));
        if (startDigit !== null && code >= 48 && code <= 57) return String.fromCodePoint(startDigit + (code - 48));
        return ch;
      }).join('');

    const mapByAlphabet = (str, upperAlphabet, lowerAlphabet, digitAlphabet = null) =>
      Array.from(str).map((ch) => {
        const code = ch.codePointAt(0);
        if (code >= 65 && code <= 90) return upperAlphabet[code - 65] || ch;
        if (code >= 97 && code <= 122) return lowerAlphabet[code - 97] || ch;
        if (digitAlphabet && code >= 48 && code <= 57) return digitAlphabet[code - 48] || ch;
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
      { key: 'script', label: 'Script', convert: (s) => mapByAlphabet(
        s,
        ['𝒜','ℬ','𝒞','𝒟','ℰ','ℱ','𝒢','ℋ','ℐ','𝒥','𝒦','ℒ','ℳ','𝒩','𝒪','𝒫','𝒬','ℛ','𝒮','𝒯','𝒰','𝒱','𝒲','𝒳','𝒴','𝒵'],
        ['𝒶','𝒷','𝒸','𝒹','ℯ','𝒻','ℊ','𝒽','𝒾','𝒿','𝓀','𝓁','𝓂','𝓃','ℴ','𝓅','𝓆','𝓇','𝓈','𝓉','𝓊','𝓋','𝓌','𝓍','𝓎','𝓏']
      ) },
      { key: 'script-bold', label: 'Script Bold', convert: (s) => mapByOffset(s, 0x1D4D0, 0x1D4EA) },
      { key: 'fraktur', label: 'Fraktur', convert: (s) => mapByAlphabet(
        s,
        ['𝔄','𝔅','ℭ','𝔇','𝔈','𝔉','𝔊','ℌ','ℑ','𝔍','𝔎','𝔏','𝔐','𝔑','𝔒','𝔓','𝔔','ℜ','𝔖','𝔗','𝔘','𝔙','𝔚','𝔛','𝔜','ℨ'],
        ['𝔞','𝔟','𝔠','𝔡','𝔢','𝔣','𝔤','𝔥','𝔦','𝔧','𝔨','𝔩','𝔪','𝔫','𝔬','𝔭','𝔮','𝔯','𝔰','𝔱','𝔲','𝔳','𝔴','𝔵','𝔶','𝔷']
      ) },
      { key: 'fraktur-bold', label: 'Fraktur Bold', convert: (s) => mapByOffset(s, 0x1D56C, 0x1D586) },

      // Special
      { key: 'double-struck', label: 'Double Struck', convert: (s) => mapByAlphabet(
        s,
        ['𝔸','𝔹','ℂ','𝔻','𝔼','𝔽','𝔾','ℍ','𝕀','𝕁','𝕂','𝕃','𝕄','ℕ','𝕆','ℙ','ℚ','ℝ','𝕊','𝕋','𝕌','𝕍','𝕎','𝕏','𝕐','ℤ'],
        ['𝕒','𝕓','𝕔','𝕕','𝕖','𝕗','𝕘','𝕙','𝕚','𝕛','𝕜','𝕝','𝕞','𝕟','𝕠','𝕡','𝕢','𝕣','𝕤','𝕥','𝕦','𝕧','𝕨','𝕩','𝕪','𝕫'],
        ['𝟘','𝟙','𝟚','𝟛','𝟜','𝟝','𝟞','𝟟','𝟠','𝟡']
      ) },
      { key: 'monospace', label: 'Monospace', convert: (s) => mapByOffset(s, 0x1D670, 0x1D68A, 0x1D7F6) },
      { key: 'small-caps', label: 'Small Caps', convert: (s) => s.replace(/[a-z]/g, (c) => ({a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'}[c] || c)) },
      { key: 'small-caps-strict', label: 'Small Caps (Strict)', convert: (s) => {
        const map = { a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ', h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ', o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'s', t:'ᴛ', u:'ᴜ', v:'ᴠ', w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ' };
        return s.toLowerCase().split('').map((ch) => map[ch] || ch).join('');
      } },
      { key: 'bottom-mix', label: 'Bottom Mix', convert: (s) => {
        const lowerMap = {
          a:'ₐ', e:'ₑ', h:'ₕ', i:'ᵢ', j:'ⱼ', k:'ₖ', l:'ₗ', m:'ₘ', n:'ₙ', o:'ₒ', p:'ₚ', r:'ᵣ', s:'ₛ', t:'ₜ', u:'ᵤ', v:'ᵥ', x:'ₓ'
        };
        const upperMap = {
          A:'ᴀ', B:'ʙ', C:'ᴄ', D:'ᴅ', E:'ᴇ', F:'ꜰ', G:'ɢ', H:'ʜ', I:'ɪ', J:'ᴊ', K:'ᴋ', L:'ʟ', M:'ᴍ', N:'ɴ', O:'ᴏ', P:'ᴘ', Q:'ǫ', R:'ʀ', S:'s', T:'ᴛ', U:'ᴜ', V:'ᴠ', W:'ᴡ', X:'x', Y:'ʏ', Z:'ᴢ'
        };
        return s.split('').map((ch) => lowerMap[ch] || upperMap[ch] || ch).join('');
      } },
      { key: 'mini-bottom-align', label: 'Mini Bottom Align', convert: (s) => {
        const map = {
          '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
          '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
          '★': '⭑', '☆': '⭒', '♪': '♩', '♫': '♪',
          '!': '﹗', '?': '﹖', '+': '₊', '-': '₋', '=': '₌',
          '(': '₍', ')': '₎', '*': '⁎', '.': '․', ',': '﹐',
          'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ',
          'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ',
          'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ',
          'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ꜰ', 'G': 'ɢ',
          'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ',
          'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 's', 'T': 'ᴛ', 'U': 'ᴜ',
          'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
        };

        return s
          .replaceAll('♥️', '❣️')
          .split('')
          .map((ch) => (ch === ' ' ? ' ' : (map[ch] || ch)))
          .join('');
      } },
      { key: 'tiny-subscript-final', label: 'Tiny Subscript Final', convert: (s) => {
        const map = {
          'a':'ₐ', 'b':'♭', 'c':'꜀', 'd':'ᑯ', 'e':'ₑ', 'f':'ꞧ', 'g':'₉', 'h':'ₕ', 'i':'ᵢ', 'j':'ⱼ', 'k':'ₖ', 'l':'ₗ',
          'm':'ₘ', 'n':'ₙ', 'o':'ₒ', 'p':'ₚ', 'q':'ᑫ', 'r':'ᵣ', 's':'ₛ', 't':'ₜ', 'u':'ᵤ', 'v':'ᵥ', 'w':'ᴡ', 'x':'ₓ', 'y':'ʏ', 'z':'ᴢ',
          'A':'ᴀ', 'B':'ʙ', 'C':'ᴄ', 'D':'ᴅ', 'E':'ᴇ', 'F':'ꜰ', 'G':'ɢ', 'H':'ʜ', 'I':'ɪ', 'J':'ᴊ', 'K':'ᴋ', 'L':'ʟ', 'M':'ᴍ', 'N':'ɴ',
          'O':'ᴏ', 'P':'ᴘ', 'Q':'ǫ', 'R':'ʀ', 'S':'s', 'T':'ᴛ', 'U':'ᴜ', 'V':'ᴠ', 'W':'ᴡ', 'X':'x', 'Y':'ʏ', 'Z':'ᴢ',
          '0':'₀', '1':'₁', '2':'₂', '3':'₃', '4':'₄', '5':'₅', '6':'₆', '7':'₇', '8':'₈', '9':'₉',
          ':':'﹕', ')':'₎'
        };
        return s.split('').map((ch) => map[ch] || ch).join('');
      } },

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

    const labelI18n = {
      ja: {
        normal: '標準', bold: '太字 (Serif)', italic: '斜体 (Serif)', 'bold-italic': '太字斜体 (Serif)',
        sans: 'Sans', 'sans-bold': 'Sans 太字', 'sans-italic': 'Sans 斜体', 'sans-bold-italic': 'Sans 太字斜体',
        'script-bold': 'スクリプト太字', 'fraktur-bold': 'フラクトゥール太字', 'double-struck': '二重線体',
        monospace: '等幅', 'small-caps': 'スモールキャップ', 'small-caps-strict': 'スモールキャップ（厳密）',
        circled: '丸囲み', parenthesized: '括弧付き', 'full-width': '全角', 'upside-down': '上下反転',
        'strike-through': '取り消し線', underline: '下線', slash: 'スラッシュ', crossed: 'クロス線',
        overline: '上線', 'underline-overline': '上下線', 'long-strike': '長い取り消し線', 'double-slash': 'スラッシュ×3',
        superscript: '上付き', subscript: '下付き', 'thai-comb-1a5a': '結合記号 ᩚ', 'wing-only': 'ウィング装飾',
        'mini-bottom-align': 'ミニ下付き', 'bottom-mix': '下付きミックス'
      }
    };

    const getStyleLabel = (font) => {
      if (pageLang === 'ja') return labelI18n.ja?.[font.key] || font.label;
      return font.label;
    };

    const safeKeys = new Set([
      'normal','bold','italic','bold-italic','sans','sans-bold','sans-italic','sans-bold-italic',
      'script-bold','fraktur-bold','double-struck','monospace','small-caps','small-caps-strict',
      'circled','parenthesized','full-width','upside-down','strike-through','underline','slash','crossed',
      'overline','underline-overline','long-strike','double-slash','superscript','subscript','thai-comb-1a5a','wing-only','mini-bottom-align','bottom-mix'
    ]);

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

    const saveFav = () => localStorage.setItem(favStoreKey, JSON.stringify(Array.from(favorites)));

    let t;
    const showToast = () => {
      if (!toast) return;
      toast.classList.add('show');
      clearTimeout(t);
      t = setTimeout(() => toast.classList.remove('show'), 800);
    };

    const updateButtonsText = () => {
      if (showFavBtn) showFavBtn.textContent = (pageLang === 'en')
        ? `★ Favorites only: ${onlyFav ? 'ON' : 'OFF'}`
        : (pageLang === 'ja')
          ? `★ お気に入りのみ: ${onlyFav ? 'ON' : 'OFF'}`
          : `★ 즐겨찾기만 보기: ${onlyFav ? 'ON' : 'OFF'}`;
      if (showAllBtn) showAllBtn.textContent = (pageLang === 'en')
        ? `Show extended styles: ${showAll ? 'ON' : 'OFF'}`
        : (pageLang === 'ja')
          ? `拡張スタイル表示: ${showAll ? 'ON' : 'OFF'}`
          : `확장 폰트 보기: ${showAll ? 'ON' : 'OFF'}`;
    };

    const render = () => {
      const value = (input.value || '').slice(0, 500);
      list.innerHTML = '';
      let targets = showAll ? fontMap : fontMap.filter((f) => safeKeys.has(f.key));
      if (onlyFav) targets = targets.filter((f) => favorites.has(f.key));

      if (!targets.length) {
        list.innerHTML = `<div class="empty-state">${pageLang === 'en' ? 'No favorite styles yet.' : (pageLang === 'ja' ? 'お気に入り登録されたスタイルがありません。' : '즐겨찾기된 폰트가 없습니다.')}</div>`;
        return;
      }

      targets.forEach((font) => {
        const sampleText = pageLang === 'en' ? 'Hello Font' : (pageLang === 'ja' ? 'フォントサンプル' : '폰트 샘플');
        const out = font.convert(value || sampleText);

        const item = document.createElement('div');
        item.className = 'font-preview-item';

        const favBtn = document.createElement('button');
        favBtn.type = 'button';
        favBtn.className = `font-fav-btn ${favorites.has(font.key) ? 'active' : ''}`;
        favBtn.textContent = favorites.has(font.key) ? '★' : '☆';
        favBtn.title = pageLang === 'en' ? 'Favorite' : (pageLang === 'ja' ? 'お気に入り' : '즐겨찾기');

        const body = document.createElement('div');
        body.className = 'font-preview-body';

        const name = document.createElement('span');
        name.className = 'font-preview-name';
        name.textContent = getStyleLabel(font);

        const text = document.createElement('span');
        text.className = 'font-preview-text';
        text.textContent = out;

        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (favorites.has(font.key)) favorites.delete(font.key);
          else favorites.add(font.key);
          saveFav();
          render();
        });

        item.addEventListener('click', async () => {
          await copyText(out);
          item.classList.add('copied');
          setTimeout(() => item.classList.remove('copied'), 650);
          showToast();
        });

        body.appendChild(name);
        body.appendChild(text);
        item.appendChild(favBtn);
        item.appendChild(body);
        list.appendChild(item);
      });
    };

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(render, 80);
    });

    showFavBtn?.addEventListener('click', () => {
      onlyFav = !onlyFav;
      updateButtonsText();
      render();
    });

    showAllBtn?.addEventListener('click', () => {
      showAll = !showAll;
      updateButtonsText();
      render();
    });

    clearFavBtn?.addEventListener('click', () => {
      favorites.clear();
      saveFav();
      render();
    });

    updateButtonsText();
    render();
  }
})();
