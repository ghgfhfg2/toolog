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
    const value = document.getElementById('uc-value');
    const from = document.getElementById('uc-from');
    const to = document.getElementById('uc-to');
    const out = document.getElementById('uc-result');
    const toM = { m:1, cm:0.01, km:1000, inch:0.0254, ft:0.3048 };
    const run = () => {
      const v = Number(value.value || 0);
      const m = v * toM[from.value];
      const result = m / toM[to.value];
      out.textContent = `결과: ${result.toLocaleString('ko-KR', { maximumFractionDigits: 6 })} ${to.value}`;
    };
    [value, from, to].forEach(el => el.addEventListener('input', run)); run();
  }

  if (slug === 'timezone-converter') {
    const from = document.getElementById('tz-from');
    const to = document.getElementById('tz-to');
    const dt = document.getElementById('tz-datetime');
    const out = document.getElementById('tz-result');
    if (dt && !dt.value) {
      const n = new Date();
      dt.value = new Date(n.getTime()-n.getTimezoneOffset()*60000).toISOString().slice(0,16);
    }
    const run = () => {
      if (!dt.value) return;
      const local = new Date(dt.value);
      const text = new Intl.DateTimeFormat('ko-KR', { dateStyle:'full', timeStyle:'short', timeZone: to.value }).format(local);
      out.textContent = `${to.options[to.selectedIndex].text}: ${text}`;
    };
    [from,to,dt].forEach(el => el.addEventListener('input', run)); run();
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
    if (!f || !run || !canvas || !link) return;
    let img = null;
    f.addEventListener('change', () => {
      const file = f.files?.[0]; if (!file) return;
      const u = URL.createObjectURL(file);
      const i = new Image();
      i.onload = () => { img = i; if (w) w.value = i.width; if (h) h.value = i.height; URL.revokeObjectURL(u); };
      i.src = u;
    });
    run.addEventListener('click', () => {
      if (!img) return;
      const width = Number(w?.value || img.width);
      const height = Number(h?.value || img.height);
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const data = canvas.toDataURL(mime, quality);
      link.href = data;
    });
  };

  if (slug === 'image-resizer') drawResize('ir-file','ir-width','ir-height','ir-run','ir-canvas','ir-download','image/png',0.92);

  if (slug === 'png-compressor') {
    const file = document.getElementById('pc-file');
    const q = document.getElementById('pc-quality');
    const run = document.getElementById('pc-run');
    const canvas = document.getElementById('pc-canvas');
    const link = document.getElementById('pc-download');
    let img = null;
    file?.addEventListener('change', () => {
      const f = file.files?.[0]; if (!f) return;
      const u = URL.createObjectURL(f);
      const i = new Image();
      i.onload = () => { img = i; URL.revokeObjectURL(u); };
      i.src = u;
    });
    run?.addEventListener('click', () => {
      if (!img) return;
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const data = canvas.toDataURL('image/jpeg', Number(q.value || 0.8));
      link.href = data;
    });
  }
})();
