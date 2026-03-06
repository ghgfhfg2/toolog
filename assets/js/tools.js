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
        const dataUrl = canvas.toDataURL('image/png');

        // 미리보기는 카드 높이에 꽉 차도록 렌더링
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = t.w;
        previewCanvas.height = t.h;
        const pctx = previewCanvas.getContext('2d');
        drawFrame(pctx, img, t.w, t.h, fit.value || 'cover', bg?.value || '#0f172a');
        const previewUrl = previewCanvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.className = 'open-link';
        link.textContent = `${t.label} 다운로드`;
        link.download = `${t.key}-${t.w}x${t.h}.png`;
        link.href = dataUrl;

        const title = document.createElement('strong');
        title.textContent = `${t.label} (${t.w}x${t.h})`;

        const preview = document.createElement('div');
        preview.className = 'ytk-preview';
        const previewImg = document.createElement('img');
        previewImg.className = 'ytk-preview-img';
        previewImg.src = previewUrl;
        previewImg.alt = `${t.label} 미리보기`;
        preview.appendChild(previewImg);

        card.appendChild(title);
        card.appendChild(preview);
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
    const copyBtn = document.getElementById('pct-copy');
    const resetBtn = document.getElementById('pct-reset');

    if (!mode || !main || !sub || !diff || !type || !help) return;

    const fmt = (v, max = 6) => {
      if (!Number.isFinite(v)) return '-';
      return v.toLocaleString('ko-KR', { maximumFractionDigits: max });
    };

    const parseRequired = (el) => {
      const raw = (el?.value || '').trim();
      if (raw === '') return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    };

    const setIdle = (msg = '필수 값을 입력하면 결과가 계산됩니다.') => {
      main.textContent = '-';
      sub.textContent = '-';
      diff.textContent = '-';
      type.textContent = '입력 대기';
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
          setIdle('기준값 A와 비율 B를 입력하세요.');
          return;
        }

        const result = base * (rate / 100);
        const remain = base - result;

        main.textContent = fmt(result);
        sub.textContent = `${fmt(rate)}%`;
        diff.textContent = fmt(remain);
        type.textContent = result === 0 ? '0%' : (result > 0 ? '양수 결과' : '음수 결과');
        help.textContent = `${fmt(base)}의 ${fmt(rate)}% = ${fmt(result)}`;
        return;
      }

      if (currentMode === 'ratio') {
        const part = parseRequired(inputs.part);
        const whole = parseRequired(inputs.whole);
        if (part === null || whole === null) {
          setIdle('부분값 A와 전체값 B를 입력하세요.');
          return;
        }

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
        diff.textContent = fmt(remain);
        type.textContent = ratio > 100 ? '100% 초과' : '정상 범위';
        help.textContent = `${fmt(part)}는 ${fmt(whole)}의 ${fmt(ratio)}%입니다.`;
        return;
      }

      if (currentMode === 'change') {
        const oldVal = parseRequired(inputs.old);
        const newVal = parseRequired(inputs.now);
        if (oldVal === null || newVal === null) {
          setIdle('이전값과 현재값을 입력하세요.');
          return;
        }

        if (oldVal === 0) {
          main.textContent = '-';
          sub.textContent = '-';
          diff.textContent = fmt(newVal - oldVal);
          type.textContent = '계산 불가';
          help.textContent = '이전값이 0이면 증감률(%)을 계산할 수 없습니다.';
          return;
        }

        const delta = newVal - oldVal;
        const rate = (delta / oldVal) * 100;
        const trend = delta > 0 ? '증가' : (delta < 0 ? '감소' : '변화 없음');

        main.textContent = `${fmt(rate)}%`;
        sub.textContent = `${fmt(oldVal)} → ${fmt(newVal)}`;
        diff.textContent = fmt(delta);
        type.textContent = trend;
        help.textContent = `이전값 ${fmt(oldVal)} 대비 ${fmt(newVal)}는 ${fmt(rate)}% ${trend}입니다.`;
      }
    };

    copyBtn?.addEventListener('click', async () => {
      const text = `주요 결과: ${main.textContent} | 보조 결과: ${sub.textContent} | 차이값: ${diff.textContent} | 판정: ${type.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      Object.values(inputs).forEach((input) => { if (input) input.value = ''; });
      mode.value = 'percent-of';
      showByMode();
      setIdle('값을 입력하면 결과가 즉시 계산됩니다.');
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
        if (result) result.textContent = `원본: ${i.width}x${i.height}px / ${formatNum(originBytes)} bytes`;
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

      // 다단계 업스케일로 품질 저하 완화
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
        scale === 1 ? '1x 보정' : `${scale}x 업스케일`,
        denoise?.checked ? '노이즈 감소 ON' : '노이즈 감소 OFF',
        sharp?.checked ? '샤픈 ON' : '샤픈 OFF'
      ].join(' · ');
      if (result) result.textContent = `결과: ${w}x${h}px / ${formatNum(outBytes)} bytes (원본 대비 ${ratio}%) · ${mode}`;
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
      if (log10Value < 6) return Math.round(10 ** log10Value).toLocaleString('ko-KR');
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
      if (bits < 40) return '낮음';
      if (bits < 60) return '보통';
      if (bits < 80) return '강함';
      return '매우 강함';
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
      poolOut.textContent = `${poolSize.toLocaleString('ko-KR')}자`;
      combosOut.textContent = toScientificFromLog10(log10Combos);
      bitsOut.textContent = `${bits.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} bit`;
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
        help.textContent = '최소 1개 문자 유형을 선택해 주세요.';
        return;
      }

      if (length < normalized.length) {
        output.value = '';
        renderStats(pool.length, length);
        help.textContent = `현재 길이(${length})로는 선택한 문자 유형 ${normalized.length}개를 모두 포함할 수 없습니다.`;
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
        help.textContent = `길이 ${length}, ${count}개 생성 완료. 각 비밀번호는 선택한 모든 문자 유형을 최소 1개 이상 포함합니다.`;
      } else {
        help.textContent = `중복 없는 비밀번호 ${list.length}개를 생성했습니다. (요청 ${count}개, 문자풀/길이 조합 제한)`;
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
      copyAllBtn.textContent = '복사됨';
      setTimeout(() => { copyAllBtn.textContent = old || '전체 복사'; }, 900);
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

    let lock = false;

    const fmt = (v, max = 4) => Number(v).toLocaleString('ko-KR', { maximumFractionDigits: max });
    const fmtKRW = (v) => `${Math.round(v).toLocaleString('ko-KR')}원`;
    const fmtEok = (v) => `${fmt(v / 100000000, 2)}억원`;

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
        setIdle('숫자 형식으로 입력해 주세요.');
        return;
      }

      if (m2Raw <= 0 && pRaw <= 0) {
        setIdle('㎡ 또는 평 중 하나를 0보다 크게 입력하세요.');
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
        setIdle('면적은 0보다 커야 합니다.');
        return;
      }

      lock = true;
      m2Input.value = m2 ? m2.toFixed(2).replace(/\.00$/, '') : '';
      pyeongInput.value = p ? p.toFixed(2).replace(/\.00$/, '') : '';
      lock = false;

      outM2.textContent = `${fmt(m2, 2)}㎡`;
      outPyeong.textContent = `${fmt(p, 2)}평`;

      if (price > 0) {
        const per = price / p;
        const per10k = per / 10000;
        outPricePer.textContent = fmtKRW(per);
        outPricePer10k.textContent = per >= 100000000
          ? `${fmt(per10k, 1)}만원 (${fmtEok(per)})`
          : `${fmt(per10k, 1)}만원`;
        help.textContent = `입력 면적 ${fmt(m2, 2)}㎡(약 ${fmt(p, 2)}평) 기준 평당가는 ${fmt(per10k, 1)}만원${per >= 100000000 ? ` (${fmtEok(per)})` : ''}입니다.`;
      } else {
        outPricePer.textContent = '-';
        outPricePer10k.textContent = '-';
        help.textContent = `면적 ${fmt(m2, 2)}㎡ = 약 ${fmt(p, 2)}평`; 
      }
    };

    m2Input.addEventListener('input', () => { if (!lock) render('m2'); });
    pyeongInput.addEventListener('input', () => { if (!lock) render('pyeong'); });
    priceInput.addEventListener('input', () => {
      if (Number(m2Input.value || 0) > 0) render('m2');
      else if (Number(pyeongInput.value || 0) > 0) render('pyeong');
      else setIdle('㎡ 또는 평 중 하나를 먼저 입력하세요.');
    });

    copyBtn?.addEventListener('click', async () => {
      if (outM2.textContent === '-') return;
      const text = `평수 계산 결과 | ${outM2.textContent} | ${outPyeong.textContent} | 평당가 ${outPricePer.textContent} (${outPricePer10k.textContent})`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      m2Input.value = '';
      pyeongInput.value = '';
      priceInput.value = '';
      setIdle('㎡ 또는 평 중 하나를 입력하면 자동으로 변환됩니다.');
    });

    setIdle('㎡ 또는 평 중 하나를 입력하면 자동으로 변환됩니다.');
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
        if (daysLabel) daysLabel.textContent = '달력일 차이';
        inclusive.textContent = '-';
        business.textContent = '-';
        help.textContent = '기준일과 목표일을 선택하면 결과가 계산됩니다.';
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
      days.textContent = `${shownDiff.toLocaleString('ko-KR')}일`;
      if (daysLabel) daysLabel.textContent = useBusiness ? '업무일 차이' : '달력일 차이';
      inclusive.textContent = `${inclusiveDays.toLocaleString('ko-KR')}일`;
      business.textContent = `${weekdayCount.toLocaleString('ko-KR')}일`;

      const startWeek = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(s);
      const endWeek = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(e);

      const diffText = diff > 0
        ? `목표일까지 ${shownDiff.toLocaleString('ko-KR')}${useBusiness ? '업무일' : '일'} 남았습니다.`
        : (diff < 0
          ? `목표일이 ${shownDiff.toLocaleString('ko-KR')}${useBusiness ? '업무일' : '일'} 지났습니다.`
          : '오늘이 목표일입니다.');

      help.textContent = `${start.value}(${startWeek}) → ${end.value}(${endWeek}) · ${diffText}`;
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
      const metricLabel = daysLabel?.textContent || '달력일 차이';
      const text = `D-day ${label.textContent} | ${metricLabel} ${days.textContent} | 포함 일수 ${inclusive.textContent} | 업무일 ${business.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
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

    const classify = (bmi) => {
      if (bmi < 18.5) return '저체중';
      if (bmi < 23) return '정상';
      if (bmi < 25) return '과체중';
      if (bmi < 30) return '비만';
      return '고도비만';
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

    const setIdle = (msg = '키와 몸무게를 입력하면 BMI를 계산합니다.') => {
      bmiValue.textContent = '-';
      bmiCategory.textContent = '입력 대기';
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
        setIdle('키(cm)와 몸무게(kg)를 입력하세요.');
        return false;
      }

      if (h < RANGE.height.min || h > RANGE.height.max || w < RANGE.weight.min || w > RANGE.weight.max) {
        setIdle(`입력 범위를 확인하세요 (키 ${RANGE.height.min}~${RANGE.height.max}cm, 몸무게 ${RANGE.weight.min}~${RANGE.weight.max}kg).`);
        return false;
      }

      const m = h / 100;
      const bmi = w / (m * m);
      const normalMin = 18.5 * m * m;
      const normalMax = 22.9 * m * m;
      const category = classify(bmi);
      const hasValidAge = !age?.value || (a >= RANGE.age.min && a <= RANGE.age.max);
      const bmr = hasValidAge ? calcBmr({ w, h, a, sx }) : null;

      bmiValue.textContent = bmi.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
      bmiCategory.textContent = category;
      bmiNormal.textContent = `${normalMin.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}kg ~ ${normalMax.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}kg`;
      bmiBmr.textContent = Number.isFinite(bmr)
        ? `${Math.round(bmr).toLocaleString('ko-KR')} kcal`
        : (hasValidAge ? '나이/성별 입력 시 계산' : `나이는 ${RANGE.age.min}~${RANGE.age.max}세 범위로 입력하세요`);
      help.textContent = `BMI ${bmi.toFixed(2)} (${category}). 성인 기준 참고값이며 진단을 대체하지 않습니다.`;
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
        copyBtn.textContent = '입력 확인';
        setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
        return;
      }

      const text = `BMI ${bmiValue.textContent} (${bmiCategory.textContent}) | 정상 체중 범위 ${bmiNormal.textContent} | BMR ${bmiBmr.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    if (!height.value) height.value = 170;
    if (!weight.value) weight.value = 65;
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

    const fmtKRW = (v) => `${Math.round(v).toLocaleString('ko-KR')}원`;

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
      comparePayment.textContent = '원리금균등: - / 원금균등: 첫 달 - → 마지막 -';
      compareInterest.textContent = '총 이자 차이: -';
      help.textContent = '대출금액·연이율·상환기간을 올바르게 입력하세요.';
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
      monthCount.textContent = `${n.toLocaleString('ko-KR')}회`;

      comparePayment.textContent = `원리금균등: ${fmtKRW(equalPayment.firstMonthly)} / 원금균등: 첫 달 ${fmtKRW(equalPrincipal.firstMonthly)} → 마지막 ${fmtKRW(equalPrincipal.lastMonthly)}`;

      const diffInterest = equalPrincipal.interest - equalPayment.interest;
      if (Math.abs(diffInterest) < 1) {
        compareInterest.textContent = '총 이자 차이: 거의 없음';
      } else if (diffInterest < 0) {
        compareInterest.textContent = `총 이자 차이: 원금균등이 ${fmtKRW(Math.abs(diffInterest))} 더 적음`;
      } else {
        compareInterest.textContent = `총 이자 차이: 원리금균등이 ${fmtKRW(Math.abs(diffInterest))} 더 적음`;
      }

      help.textContent = `${type.options[type.selectedIndex].text} 기준 추정값입니다. 실제 대출은 수수료·우대금리·중도상환 여부에 따라 달라질 수 있습니다.`;
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
        `대출 계산 결과 (${type.options[type.selectedIndex].text})`,
        `월 납입액(첫 달): ${monthly.textContent}`,
        `총 이자: ${totalInterest.textContent}`,
        `총 상환액: ${totalPayment.textContent}`,
        comparePayment.textContent,
        compareInterest.textContent
      ].join(' | ');
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
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

    const fmtKRW = (v) => `${Math.round(v).toLocaleString('ko-KR')}원`;

    const setIdle = (msg) => {
      final.textContent = '-';
      contrib.textContent = '-';
      interest.textContent = '-';
      real.textContent = '-';
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

    const render = () => {
      const p0 = Math.max(0, Number(initial.value || 0));
      const mAdd = Math.max(0, Number(monthly.value || 0));
      const rAnnual = Number(rate.value || 0);
      const y = Math.floor(Number(years.value || 0));
      const n = Math.max(1, Number(compound.value || 12));
      const inf = Math.max(0, Number(inflation.value || 0));

      if (!(y > 0) || !Number.isFinite(rAnnual) || rAnnual < 0 || rAnnual > 100) {
        setIdle('투자 기간(1년 이상)과 연 수익률(0~100%)을 입력하세요.');
        return;
      }

      let balance = p0;
      const periodicRate = rAnnual / 100 / n;
      const totalMonths = y * 12;
      const monthsPerPeriod = 12 / n;

      for (let month = 1; month <= totalMonths; month++) {
        if (month % monthsPerPeriod === 0) {
          balance *= (1 + periodicRate);
        }
        balance += mAdd;
      }

      const totalContrib = p0 + (mAdd * totalMonths);
      const earned = balance - totalContrib;
      const realValue = balance / Math.pow(1 + inf / 100, y);

      final.textContent = fmtKRW(balance);
      contrib.textContent = fmtKRW(totalContrib);
      interest.textContent = fmtKRW(earned);
      real.textContent = inf > 0 ? fmtKRW(realValue) : '인플레이션 미입력';

      const annualized = totalContrib > 0 ? ((balance / totalContrib - 1) * 100) : 0;
      help.textContent = `${y}년 후 예상 자산은 ${fmtKRW(balance)}이며, 원금 대비 수익률은 약 ${annualized.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}%입니다.`;
    };

    [initial, monthly, rate, years, compound, inflation].forEach((el) => {
      el?.addEventListener('input', render);
      el?.addEventListener('change', render);
    });

    copyBtn?.addEventListener('click', async () => {
      const text = `복리 계산 결과 | 만기 자산 ${final.textContent} | 총 원금 ${contrib.textContent} | 예상 수익 ${interest.textContent} | 실질가치 ${real.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
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

    const fmtKRW = (v) => `${Math.round(v).toLocaleString('ko-KR')}원`;
    const fmtPct = (v) => `${v.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}%`;
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
        setOutput({ message: '정가를 0원보다 크게 입력하세요.' });
        return;
      }

      if ((mode.value || 'forward') === 'forward') {
        const rate = n(discountRate);
        if (rate < 0 || rate > 100) {
          setOutput({ message: '할인율은 0%~100% 범위에서 입력하세요.' });
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
        help.textContent = `${fmtKRW(price)} 상품 ${q}개 기준, 쿠폰/배송비까지 반영한 최종 결제금액입니다.`;
      } else {
        const target = Math.max(0, n(targetPrice));
        if (target > price) {
          discountAmount.textContent = fmtKRW(0);
          unitPrice.textContent = fmtKRW(target);
          finalTotal.textContent = fmtKRW(target);
          effectiveRate.textContent = fmtPct(0);
          help.textContent = '목표 판매가(1개 기준)가 정가보다 높아 할인율은 0%로 표시됩니다.';
          return;
        }

        const needRate = price === 0 ? 0 : ((price - target) / price) * 100;
        discountAmount.textContent = fmtKRW(price - target);
        unitPrice.textContent = fmtKRW(target);
        finalTotal.textContent = fmtKRW(target);
        effectiveRate.textContent = fmtPct(Math.max(0, needRate));
        help.textContent = `정가 ${fmtKRW(price)}(1개)를 목표가 ${fmtKRW(target)}로 맞추려면 약 ${fmtPct(needRate)} 할인이 필요합니다.`;
      }
    };

    [mode, listPrice, discountRate, coupon, quantity, shipping, targetPrice].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      const text = `할인 계산 결과 | 할인 금액: ${discountAmount.textContent} | 할인 후 단가: ${unitPrice.textContent} | 최종 결제금액: ${finalTotal.textContent} | 실질 할인율: ${effectiveRate.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
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
        setIdle('생년월일과 기준일을 입력하세요.');
        return;
      }
      if (b > t) {
        setIdle('생년월일은 기준일보다 늦을 수 없습니다.');
        return;
      }

      const fullAge = getFullAge(b, t);
      const koreanAge = t.getFullYear() - b.getFullYear() + 1;
      const totalMonths = getMonthSpan(b, t);
      const totalDays = dayDiff(b, t);
      const upcomingBirthday = getNextBirthday(b, t);
      const daysLeft = dayDiff(t, upcomingBirthday);

      international.textContent = `${fullAge}세`;
      korean.textContent = koreanMode?.checked ? `${koreanAge}세` : '숨김';
      months.textContent = `${totalMonths.toLocaleString('ko-KR')}개월`;
      days.textContent = `${totalDays.toLocaleString('ko-KR')}일`;

      const birthdayText = `${upcomingBirthday.getFullYear()}-${String(upcomingBirthday.getMonth() + 1).padStart(2, '0')}-${String(upcomingBirthday.getDate()).padStart(2, '0')}`;
      const ddayText = daysLeft === 0 ? 'D-day' : `D-${daysLeft.toLocaleString('ko-KR')}`;
      nextBirthday.textContent = `다음 생일: ${birthdayText} (${ddayText})`;
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
        copyBtn.textContent = '입력 확인';
        setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
        return;
      }
      const text = `나이 계산 결과 | 만 나이 ${international.textContent} | 세는나이 ${korean.textContent} | 총 ${months.textContent} / ${days.textContent} | ${nextBirthday.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    setIdle('생년월일을 입력하면 나이 계산 결과가 표시됩니다.');
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

    const KRW = (v) => `${Math.round(v).toLocaleString('ko-KR')}원`;

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
        setIdle('연봉(세전)을 입력하면 예상 실수령액을 계산합니다.');
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
      summary.textContent = `공제율 약 ${effectiveRate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}% 기준 추정치입니다.${cappedNonTax ? ' 비과세 월급은 월 총급여를 넘지 않도록 자동 보정했습니다.' : ''} 회사별 비과세·수당·정산에 따라 실제 수령액은 달라질 수 있습니다.`;
    };

    [annual, nonTax, dependent, children].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (netMonth.textContent === '-') {
        setIdle('연봉을 먼저 입력하세요.');
        return;
      }
      const text = `실수령액 계산 결과 | 월 ${netMonth.textContent} | 연 ${netYear.textContent} | 소득세+지방세(월) ${taxMonth.textContent} | 4대보험(월) ${insuranceMonth.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
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

    const fmtKRW = (v) => `${Math.round(v).toLocaleString('ko-KR')}원`;

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
        setIdle('입사일과 퇴사일을 선택하세요.');
        return;
      }
      if (e < s) {
        setIdle('퇴사일은 입사일보다 빠를 수 없습니다.');
        return;
      }
      if (!(m > 0)) {
        setIdle('최근 월급(세전)을 입력하세요.');
        return;
      }

      const days = dayDiff(s, e) + 1;
      const years = days / 365;
      const annualizedWage = (m * 12) + b;
      const avgDailyWage = annualizedWage / 365;
      const severance = avgDailyWage * 30 * years;
      const isEligible = days >= 365;

      serviceDays.textContent = `${days.toLocaleString('ko-KR')}일`;
      serviceYears.textContent = `${years.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}년`;
      dailyWage.textContent = fmtKRW(avgDailyWage);
      amount.textContent = fmtKRW(severance);
      help.textContent = isEligible
        ? '법정 평균임금의 간편 추정 방식(연 환산)으로 계산한 참고값입니다. 실제 퇴직금은 최근 3개월 임금·상여 반영 방식에 따라 달라질 수 있습니다.'
        : '재직기간이 1년 미만으로 보입니다. 계산은 가능하지만 법적 지급 요건 충족 여부를 반드시 확인하세요.';
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
        copyBtn.textContent = '입력 확인';
        setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
        return;
      }
      const text = `퇴직금 계산 결과 | 재직일수 ${serviceDays.textContent} | 계속근로연수 ${serviceYears.textContent} | 1일 평균임금 ${dailyWage.textContent} | 예상 퇴직금 ${amount.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
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

    const fmtKRW = (v) => `${Math.round(v).toLocaleString('ko-KR')}원`;
    const fmtQty = (v) => `${Math.round(v).toLocaleString('ko-KR')}주`;

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
        setIdle('현재 보유 수량과 평단가를 먼저 입력하세요.');
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
        help.textContent = `추가 매수 반영 시 새 평단가는 ${fmtKRW(avg)}입니다.`;
        return;
      }

      if (tp >= cp && aq === 0) {
        needQtyOut.textContent = '0주';
        help.textContent = '현재 평단가가 이미 목표 평단 이하입니다.';
        return;
      }

      const denominator = tp - ap;
      const numerator = totalCost - (tp * totalQty);

      if (numerator <= 0) {
        needQtyOut.textContent = '0주';
        help.textContent = aq > 0
          ? '현재 입력된 추가 매수 계획까지 반영하면 이미 목표 평단을 만족합니다.'
          : '현재 보유 상태로 이미 목표 평단을 만족합니다.';
        return;
      }

      if (denominator <= 0) {
        needQtyOut.textContent = '달성 불가';
        help.textContent = '추가 매수가가 목표 평단 이상이면 같은 가격의 추가 매수만으로 목표 평단을 만들 수 없습니다.';
        return;
      }

      const need = Math.ceil(numerator / denominator);
      needQtyOut.textContent = fmtQty(need);
      help.textContent = aq > 0
        ? `현재 계획(${fmtQty(aq)}) 이후에도 목표 평단 ${fmtKRW(tp)}를 맞추려면 최소 ${fmtQty(need)}를 같은 가격에 더 매수해야 합니다.`
        : `목표 평단 ${fmtKRW(tp)}를 맞추려면 현재 조건에서 최소 ${fmtQty(need)} 추가 매수가 필요합니다.`;
    };

    [currentQty, currentPrice, addQty, addPrice, targetPrice].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (newAvg.textContent === '-') return;
      const text = `물타기 계산 결과 | 새 평단가 ${newAvg.textContent} | 총 보유 ${totalQtyOut.textContent} | 총 매수금액 ${totalCostOut.textContent} | 목표 평단 필요수량 ${needQtyOut.textContent}`;
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
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

    const fmtKcal = (v) => `${Math.round(v).toLocaleString('ko-KR')}kcal`;
    const fmtGram = (v) => `${Math.round(v).toLocaleString('ko-KR')}g`;

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

    const setIdle = (msg = '값을 입력하면 BMR/TDEE와 목표별 칼로리가 계산됩니다.') => {
      outBmr.textContent = '-';
      outMaintain.textContent = '-';
      outCut.textContent = '-';
      outBulk.textContent = '-';
      outProtein.textContent = '단백질: -';
      outFat.textContent = '지방: -';
      outCarb.textContent = '탄수화물: -';
      help.textContent = msg;
    };

    const render = () => {
      const a = Number(age.value || 0);
      const h = Number(height.value || 0);
      const w = Number(weight.value || 0);
      const af = Number(activity.value || 1.2);

      if (!(a >= 10 && a <= 100) || !(h >= 120 && h <= 230) || !(w >= 25 && w <= 250)) {
        setIdle('나이(10~100), 키(120~230), 몸무게(25~250) 범위를 확인해 주세요.');
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

      outProtein.textContent = `단백질: ${fmtGram(proteinG)} (약 ${(proteinG * 4).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}kcal)`;
      outFat.textContent = `지방: ${fmtGram(fatG)} (약 ${(fatG * 9).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}kcal)`;
      outCarb.textContent = `탄수화물: ${fmtGram(carbG)} (약 ${(carbG * 4).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}kcal)`;

      const activityLabel = activity.options[activity.selectedIndex]?.text || '선택 활동량';
      const macroNotice = macroBaseKcal > tdee
        ? ' 현재 입력에서는 단백질/지방 최소치만으로 유지 칼로리를 거의 채워 탄수화물 권장량이 낮게 표시될 수 있습니다.'
        : '';
      help.textContent = `${activityLabel} 기준 추정치입니다. 보수 감량은 주당 약 ${weeklyCutKg.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}kg, 린 증량은 주당 약 ${weeklyBulkKg.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}kg 변화를 목표로 합니다. 2~3주 체중/허리둘레 변화에 맞춰 100~200kcal 단위로 조정하세요.${macroNotice}`;
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
        `칼로리 계산 결과`,
        `BMR ${outBmr.textContent}`,
        `유지(TDEE) ${outMaintain.textContent}`,
        `감량 ${outCut.textContent}`,
        `증량 ${outBulk.textContent}`,
        outProtein.textContent,
        outFat.textContent,
        outCarb.textContent
      ].join(' | ');
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
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

    const KRW = (n) => `${Math.round(n || 0).toLocaleString('ko-KR')}원`;

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

    const resolveRow = (t, v) => (tables[t] || tables.sale).find((r) => v <= r.max) || tables.sale[tables.sale.length - 1];

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
        if (help) help.textContent = '거래 유형과 거래금액을 입력하면 중개보수 상한을 계산합니다.';
        return;
      }

      const row = resolveRow(type?.value || 'sale', v);
      const raw = v * row.rate;
      const capped = row.cap ? Math.min(raw, row.cap) : raw;
      const vatIncluded = capped * 1.1;

      rateEl.textContent = `${(row.rate * 100).toFixed(1)}%`;
      limitEl.textContent = row.cap ? KRW(row.cap) : '법정 정액 상한 없음';
      feeEl.textContent = KRW(capped);
      vatEl.textContent = KRW(vatIncluded);

      if (help) {
        const typeLabel = (type?.value || 'sale') === 'sale' ? '매매' : '임대차';
        const rentHint = (type?.value || 'sale') === 'rent' ? ' (환산금액: 보증금 + 월세×100)' : '';
        help.textContent = `주택 ${typeLabel} 상한 요율 기준 계산값입니다${rentHint}. 실제 중개보수는 공인중개사와 상한 이내 협의로 결정됩니다.`;
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
      const text = `거래유형: ${type?.selectedOptions?.[0]?.text || '-'}
거래금액: ${KRW(Number(amount?.value || 0))}
적용 상한 요율: ${rateEl.textContent}
예상 중개보수(한도): ${feeEl.textContent}
부가세 포함(참고): ${vatEl.textContent}`;
      try {
        await navigator.clipboard.writeText(text);
        if (help) help.textContent = '결과를 클립보드에 복사했습니다.';
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (help) help.textContent = '결과를 복사했습니다.';
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

  if (slug === 'blog-banned-word-checker') {
    const input = document.getElementById('bw-input');
    const summary = document.getElementById('bw-summary');
    const list = document.getElementById('bw-list');
    const totalEl = document.getElementById('bw-total');
    const spamEl = document.getElementById('bw-spam');
    const claimEl = document.getElementById('bw-claim');
    const linkEl = document.getElementById('bw-link');
    if (!input || !list) return;

    const rules = [
      { cat: '스팸/홍보 키워드', tag: 'spam', re: /(대출|도박|성인물|카지노|바카라|급전|무료체험|최저가|특가|당일지급|고수익|부업문의|재택알바)/gi },
      { cat: '의학·법률·금융 과장 표현', tag: 'claim', re: /(무조건|100%|완치|치료|암\s*예방|직빵|평생보장|절대\s*손해\s*없음|보장수익)/gi },
      { cat: '어뷰징 의심 패턴', tag: 'spam', re: /(강추\s*강추|최저가\s*최저가|후기\s*후기|추천\s*추천)/gi },
      { cat: '연락처/아이디 유도', tag: 'link', re: /(\b01[0-9][-\s]?[0-9]{3,4}[-\s]?[0-9]{4}\b|카카오톡\s*ID|카톡\s*아이디|오픈채팅|텔레그램\s*@?\w+)/gi },
      { cat: '외부 링크/단축 URL', tag: 'link', re: /(https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+)/gi }
    ];

    const repetitionCheck = (text) => {
      const words = (text.match(/[가-힣A-Za-z]{2,}/g) || []).map((w) => w.toLowerCase());
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
        item.innerHTML = `<strong>${rule.cat}<span class="bw-tag">${matches.length}건</span></strong><p>${uniq}</p>`;
        list.appendChild(item);
      });

      const rep = repetitionCheck(text);
      if (rep.bad.length) {
        const item = document.createElement('div');
        item.className = 'bw-item';
        const view = rep.bad.map(([w,n]) => `${w}(${n}회)`).join(', ');
        item.innerHTML = `<strong>과도한 키워드 반복<span class="bw-tag">${rep.bad.length}개</span></strong><p>${view}</p>`;
        list.appendChild(item);
        total += rep.bad.length;
        spam += rep.bad.length;
      }

      const hs = hashtagCheck(text);
      if (hs.over) {
        const item = document.createElement('div');
        item.className = 'bw-item';
        item.innerHTML = `<strong>해시태그 남발<span class="bw-tag">${hs.tags.length}개</span></strong><p>해시태그 수가 많습니다. 본문 맥락과 직접 관련된 태그만 최소화하세요.</p>`;
        list.appendChild(item);
        total += hs.tags.length;
        spam += hs.tags.length;
      }

      if (!total) {
        list.innerHTML = '<div class="empty-state">현재 기준으로 감지된 금칙/주의 패턴이 없습니다.</div>';
      }

      totalEl.textContent = String(total);
      spamEl.textContent = String(spam);
      claimEl.textContent = String(claim);
      linkEl.textContent = String(link);

      if (summary) {
        if (!text.trim()) summary.textContent = '텍스트를 입력하면 금칙/주의 패턴을 실시간 점검합니다.';
        else if (total >= 15) summary.textContent = `위험도 높음: 총 ${total}건 감지. 스팸성/과장 표현을 적극 수정하세요.`;
        else if (total >= 6) summary.textContent = `주의 필요: 총 ${total}건 감지. 반복 키워드·링크·표현을 정리하세요.`;
        else if (total > 0) summary.textContent = `경미한 주의: ${total}건 감지. 문맥 중심으로 자연스럽게 다듬으세요.`;
        else summary.textContent = '감지 항목이 없습니다. 그래도 문맥/정보가치 중심으로 최종 검수하세요.';
      }
    };

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(render, 80);
    });
    render();
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
      if (showFavBtn) showFavBtn.textContent = `★ 즐겨찾기만 보기: ${onlyFav ? 'ON' : 'OFF'}`;
      if (showAllBtn) showAllBtn.textContent = `확장 폰트 보기: ${showAll ? 'ON' : 'OFF'}`;
    };

    const render = () => {
      const value = (input.value || '').slice(0, 500);
      list.innerHTML = '';
      let targets = showAll ? fontMap : fontMap.filter((f) => safeKeys.has(f.key));
      if (onlyFav) targets = targets.filter((f) => favorites.has(f.key));

      if (!targets.length) {
        list.innerHTML = '<div class="empty-state">즐겨찾기된 폰트가 없습니다.</div>';
        return;
      }

      targets.forEach((font) => {
        const out = font.convert(value || 'Hello Font');

        const item = document.createElement('div');
        item.className = 'font-preview-item';

        const favBtn = document.createElement('button');
        favBtn.type = 'button';
        favBtn.className = `font-fav-btn ${favorites.has(font.key) ? 'active' : ''}`;
        favBtn.textContent = favorites.has(font.key) ? '★' : '☆';
        favBtn.title = '즐겨찾기';

        const body = document.createElement('div');
        body.className = 'font-preview-body';

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
