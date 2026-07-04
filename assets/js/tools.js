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
    const lines = document.getElementById('tc-lines');
    const bytes = document.getElementById('tc-bytes');
    const limit = document.getElementById('tc-limit');
    const limitType = document.getElementById('tc-limit-type');
    const status = document.getElementById('tc-status');
    const meter = document.querySelector('.tc-meter');
    const meterBar = document.getElementById('tc-meter-bar');
    const sample = document.getElementById('tc-sample');
    const copy = document.getElementById('tc-copy');
    const clear = document.getElementById('tc-clear');
    const tcText = {
      ko: {
        empty: '텍스트를 입력하면 글자 수를 바로 계산합니다.',
        counted: (count) => `${formatNum(count)}자를 계산했습니다.`,
        invalidLimit: '제한 수치는 1 이상 10,000,000 이하의 정수로 입력해 주세요.',
        remaining: (n) => `제한까지 ${formatNum(n)} 남았습니다.`,
        exact: '설정한 제한에 정확히 맞았습니다.',
        exceeded: (n) => `설정한 제한을 ${formatNum(n)} 초과했습니다.`,
        copied: '결과 요약을 복사했습니다.',
        copyEmpty: '복사할 계산 결과가 없습니다.',
        copyFail: '자동 복사를 사용할 수 없습니다.',
        cleared: '입력과 제한을 초기화했습니다.',
        sample: '좋은 글은 핵심을 먼저 말하고, 필요한 근거를 짧고 분명하게 덧붙입니다.',
        summary: (v) => `공백 포함 ${v.chars}자 / 공백 제외 ${v.noSpaces}자 / 단어 ${v.words}개 / ${v.lines}줄 / UTF-8 ${v.bytes}바이트`
      },
      en: {
        empty: 'Enter text to see the count instantly.',
        counted: (count) => `Counted ${formatNum(count)} characters.`,
        invalidLimit: 'Enter a whole-number limit from 1 to 10,000,000.',
        remaining: (n) => `${formatNum(n)} remaining before the limit.`,
        exact: 'The text exactly matches the limit.',
        exceeded: (n) => `The text exceeds the limit by ${formatNum(n)}.`,
        copied: 'Copied the count summary.',
        copyEmpty: 'There is no count summary to copy yet.',
        copyFail: 'Automatic copy is unavailable.',
        cleared: 'Cleared the text and limit.',
        sample: 'Clear writing puts the main point first and supports it with concise evidence.',
        summary: (v) => `${v.chars} characters with spaces / ${v.noSpaces} without spaces / ${v.words} words / ${v.lines} lines / ${v.bytes} UTF-8 bytes`
      },
      ja: {
        empty: 'テキストを入力するとすぐに集計します。',
        counted: (count) => `${formatNum(count)}文字を集計しました。`,
        invalidLimit: '上限は1〜10,000,000の整数で入力してください。',
        remaining: (n) => `上限まで残り${formatNum(n)}です。`,
        exact: '設定した上限と一致しています。',
        exceeded: (n) => `設定した上限を${formatNum(n)}超えています。`,
        copied: '集計結果をコピーしました。',
        copyEmpty: 'コピーできる集計結果がまだありません。',
        copyFail: '自動コピーを利用できません。',
        cleared: '入力と上限をクリアしました。',
        sample: '読みやすい文章は、要点を先に示し、必要な根拠を簡潔に補足します。',
        summary: (v) => `空白含む${v.chars}文字 / 空白除く${v.noSpaces}文字 / ${v.words}単語 / ${v.lines}行 / UTF-8 ${v.bytes}バイト`
      }
    }[pageLang] || {};
    let current = { chars: 0, noSpaces: 0, words: 0, lines: 0, bytes: 0 };

    const setStatus = (message, state = '') => {
      status.textContent = message;
      status.dataset.state = state;
    };

    const update = () => {
      const v = input.value || '';
      current = {
        chars: [...v].length,
        noSpaces: [...v.replace(/\s/gu, '')].length,
        words: (v.trim().match(/\S+/gu) || []).length,
        lines: v ? v.split(/\r\n|\r|\n/).length : 0,
        bytes: new TextEncoder().encode(v).length
      };
      chars.textContent = formatNum(current.chars);
      noSpaces.textContent = formatNum(current.noSpaces);
      words.textContent = formatNum(current.words);
      lines.textContent = formatNum(current.lines);
      bytes.textContent = formatNum(current.bytes);

      const rawLimit = limit.value.trim();
      const limitValue = Number(rawLimit);
      if (!rawLimit) {
        meter.hidden = true;
        limit.setAttribute('aria-invalid', 'false');
        setStatus(v ? tcText.counted(current.chars) : tcText.empty);
        return;
      }
      if (!Number.isInteger(limitValue) || limitValue < 1 || limitValue > 10000000) {
        meter.hidden = true;
        limit.setAttribute('aria-invalid', 'true');
        setStatus(tcText.invalidLimit, 'error');
        return;
      }

      limit.setAttribute('aria-invalid', 'false');
      const used = current[limitType.value] || 0;
      const diff = limitValue - used;
      const percent = Math.min(100, Math.round((used / limitValue) * 100));
      meter.hidden = false;
      meter.setAttribute('aria-valuenow', String(percent));
      meterBar.style.width = `${percent}%`;
      meterBar.dataset.state = diff < 0 ? 'over' : (diff === 0 ? 'exact' : 'within');
      if (diff > 0) setStatus(tcText.remaining(diff), 'within');
      else if (diff === 0) setStatus(tcText.exact, 'exact');
      else setStatus(tcText.exceeded(Math.abs(diff)), 'over');
    };
    [input, limit, limitType].forEach(el => el?.addEventListener('input', update));
    limitType?.addEventListener('change', update);
    sample?.addEventListener('click', () => {
      input.value = tcText.sample;
      update();
      input.focus();
    });
    clear?.addEventListener('click', () => {
      input.value = '';
      limit.value = '';
      update();
      setStatus(tcText.cleared);
      input.focus();
    });
    copy?.addEventListener('click', async () => {
      if (!input.value) {
        setStatus(tcText.copyEmpty, 'error');
        input.focus();
        return;
      }
      const summary = tcText.summary(current);
      try {
        await navigator.clipboard.writeText(summary);
        setStatus(tcText.copied);
      } catch (_) {
        setStatus(tcText.copyFail, 'error');
      }
    });
    update();
  }

  if (slug === 'vat-calculator') {
    const mode = document.getElementById('vat-mode');
    const amt = document.getElementById('vat-amount');
    const rounding = document.getElementById('vat-rounding');
    const s = document.getElementById('vat-supply');
    const t = document.getElementById('vat-tax');
    const total = document.getElementById('vat-total');
    const status = document.getElementById('vat-status');
    const example = document.getElementById('vat-example');
    const copy = document.getElementById('vat-copy');
    const clear = document.getElementById('vat-clear');
    const vatText = {
      ko: {
        empty: '0원 이상의 정수 금액을 입력하세요.',
        invalid: '금액은 0원 이상의 정수로 입력해 주세요.',
        tooLarge: '금액은 1,000조 원 이하로 입력해 주세요.',
        calculated: (base) => `${base} 기준으로 부가세 10%를 계산했습니다.`,
        supplyBase: '공급가',
        totalBase: '합계',
        copied: '계산 결과를 복사했습니다.',
        copyFail: '자동 복사를 사용할 수 없습니다.',
        cleared: '입력값을 초기화했습니다.',
        summary: (v) => `공급가 ${v.supply}원 / 부가세(10%) ${v.tax}원 / 합계 ${v.total}원`
      },
      en: {
        empty: 'Enter a non-negative whole-unit amount.',
        invalid: 'Enter a non-negative whole-unit amount.',
        tooLarge: 'Enter an amount no greater than 1 quadrillion.',
        calculated: (base) => `Calculated 10% VAT from the ${base}.`,
        supplyBase: 'net price',
        totalBase: 'gross total',
        copied: 'Copied the calculation result.',
        copyFail: 'Automatic copy is unavailable.',
        cleared: 'Cleared the amount.',
        summary: (v) => `Net price ${v.supply} / VAT (10%) ${v.tax} / gross total ${v.total}`
      },
      ja: {
        empty: '0以上の整数金額を入力してください。',
        invalid: '金額は0以上の整数で入力してください。',
        tooLarge: '金額は1,000兆以下で入力してください。',
        calculated: (base) => `${base}を基準にVAT 10%を計算しました。`,
        supplyBase: '税抜価格',
        totalBase: '税込合計',
        copied: '計算結果をコピーしました。',
        copyFail: '自動コピーを利用できません。',
        cleared: '金額をクリアしました。',
        summary: (v) => `税抜 ${v.supply} / VAT (10%) ${v.tax} / 税込合計 ${v.total}`
      }
    }[pageLang];
    let current = null;

    const setStatus = (message, state = '') => {
      status.textContent = message;
      status.dataset.state = state;
    };

    const resetResult = () => {
      [s, t, total].forEach(el => { el.textContent = '-'; });
      copy.disabled = true;
      current = null;
    };

    const roundAmount = (value) => {
      if (rounding.value === 'floor') return Math.floor(value);
      if (rounding.value === 'ceil') return Math.ceil(value);
      return Math.round(value);
    };

    const calc = () => {
      const raw = amt.value.trim();
      if (!raw) {
        amt.setAttribute('aria-invalid', 'false');
        resetResult();
        setStatus(vatText.empty);
        return;
      }
      const v = Number(raw);
      if (!Number.isFinite(v) || v < 0 || !Number.isInteger(v)) {
        amt.setAttribute('aria-invalid', 'true');
        resetResult();
        setStatus(vatText.invalid, 'error');
        return;
      }
      if (v > 1000000000000000) {
        amt.setAttribute('aria-invalid', 'true');
        resetResult();
        setStatus(vatText.tooLarge, 'error');
        return;
      }

      amt.setAttribute('aria-invalid', 'false');
      let supply = 0, tax = 0, sum = 0;
      if ((mode.value || 'supply') === 'supply') {
        supply = v;
        tax = roundAmount(v * 0.1);
        sum = supply + tax;
      } else {
        sum = v;
        supply = roundAmount(v / 1.1);
        tax = sum - supply;
      }
      s.textContent = formatNum(supply);
      t.textContent = formatNum(tax);
      total.textContent = formatNum(sum);
      current = { supply: formatNum(supply), tax: formatNum(tax), total: formatNum(sum) };
      copy.disabled = false;
      setStatus(vatText.calculated(mode.value === 'supply' ? vatText.supplyBase : vatText.totalBase), 'success');
    };
    [mode, rounding].forEach(el => el.addEventListener('change', calc));
    amt.addEventListener('input', calc);
    example.addEventListener('click', () => {
      amt.value = '110000';
      calc();
      amt.focus();
    });
    clear.addEventListener('click', () => {
      amt.value = '';
      calc();
      setStatus(vatText.cleared);
      amt.focus();
    });
    copy.addEventListener('click', async () => {
      if (!current) return;
      try {
        await navigator.clipboard.writeText(vatText.summary(current));
        setStatus(vatText.copied, 'success');
      } catch (_) {
        setStatus(vatText.copyFail, 'error');
      }
    });
    calc();
  }

  if (slug === 'unit-converter') {
    const type = document.getElementById('uc-type');
    const value = document.getElementById('uc-value');
    const from = document.getElementById('uc-from');
    const to = document.getElementById('uc-to');
    const out = document.getElementById('uc-result');
    const swap = document.getElementById('uc-swap');

    const maps = {
      length: { mm:0.001, cm:0.01, m:1, km:1000, inch:0.0254, ft:0.3048, yd:0.9144, mile:1609.344 },
      weight: { kg:1, g:0.001, lb:0.45359237, oz:0.028349523125 },
      temperature: { c: 'c', f: 'f', k: 'k' }
    };

    const unitLabelsByLang = {
      ko: {
        length: [['mm','mm'],['cm','cm'],['m','m'],['km','km'],['inch','인치'],['ft','피트'],['yd','야드(yd)'],['mile','마일(mile)']],
        weight: [['kg','kg'],['g','g'],['lb','파운드(lb)'],['oz','온스(oz)']],
        temperature: [['c','℃'],['f','℉'],['k','K']]
      },
      en: {
        length: [['mm','mm'],['cm','cm'],['m','m'],['km','km'],['inch','inch'],['ft','ft'],['yd','yd'],['mile','mile']],
        weight: [['kg','kg'],['g','g'],['lb','lb'],['oz','oz']],
        temperature: [['c','℃'],['f','℉'],['k','K']]
      },
      ja: {
        length: [['mm','mm'],['cm','cm'],['m','m'],['km','km'],['inch','インチ'],['ft','フィート'],['yd','ヤード'],['mile','マイル']],
        weight: [['kg','kg'],['g','g'],['lb','ポンド(lb)'],['oz','オンス(oz)']],
        temperature: [['c','℃'],['f','℉'],['k','K']]
      }
    };
    const labels = unitLabelsByLang[pageLang] || unitLabelsByLang.ko;

    const ucText = {
      ko: { empty: '변환할 값을 입력해 주세요.', invalid: '유효한 숫자를 입력해 주세요.', absoluteZero: '절대영도보다 낮은 온도는 계산할 수 없습니다.' },
      en: { empty: 'Enter a value to convert.', invalid: 'Enter a valid number.', absoluteZero: 'Temperatures below absolute zero cannot be converted.' },
      ja: { empty: '変換する値を入力してください。', invalid: '有効な数値を入力してください。', absoluteZero: '絶対零度未満の温度は計算できません。' }
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

    const isBelowAbsoluteZero = (v, unit) => (
      (unit === 'c' && v < -273.15) ||
      (unit === 'f' && v < -459.67) ||
      (unit === 'k' && v < 0)
    );

    const showMessage = (message, invalid = false) => {
      out.textContent = message;
      value.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    };

    const run = () => {
      const t = type.value || 'length';
      if (value.value.trim() === '') {
        showMessage(ucText.empty);
        return;
      }
      const v = Number(value.value);
      if (!Number.isFinite(v)) {
        showMessage(ucText.invalid, true);
        return;
      }
      if (t === 'temperature' && isBelowAbsoluteZero(v, from.value)) {
        showMessage(ucText.absoluteZero, true);
        return;
      }
      let result = 0;
      if (t === 'temperature') {
        result = convertTemp(v, from.value, to.value);
      } else {
        const map = maps[t];
        const base = v * (map[from.value] || 1);
        result = base / (map[to.value] || 1);
      }
      const fromLabel = from.options[from.selectedIndex]?.text || '';
      const toLabel = to.options[to.selectedIndex]?.text || '';
      const source = v.toLocaleString(numberLocale, { maximumFractionDigits: 10 });
      const converted = result.toLocaleString(numberLocale, { maximumFractionDigits: 10 });
      showMessage(`${source} ${fromLabel} = ${converted} ${toLabel}`);
    };

    [value, from, to].forEach(el => el?.addEventListener('input', run));
    type?.addEventListener('change', fillUnits);
    swap?.addEventListener('click', () => {
      const oldFrom = from.value;
      from.value = to.value;
      to.value = oldFrom;
      run();
      value.focus();
    });
    fillUnits();
  }

  if (slug === 'timezone-converter') {
    const from = document.getElementById('tz-from');
    const to = document.getElementById('tz-to');
    const dt = document.getElementById('tz-datetime');
    const out = document.getElementById('tz-result');
    const sourceOut = document.getElementById('tz-source');
    const targetOut = document.getElementById('tz-target');
    const offsetOut = document.getElementById('tz-offset');
    const dayDiffOut = document.getElementById('tz-daydiff');
    const nowBtn = document.getElementById('tz-now');
    const swapBtn = document.getElementById('tz-swap');
    const copyBtn = document.getElementById('tz-copy');
    const clearBtn = document.getElementById('tz-clear');

    const tzI18n = {
      ko: {
        locale: 'ko-KR',
        empty: '날짜와 시간을 입력하면 대상 지역의 현지 시간이 표시됩니다.',
        invalid: '날짜나 시간 형식을 확인해 주세요.',
        nonexistent: '선택한 기준 시간대에서 DST 전환으로 존재하지 않는 현지 시각입니다. 다른 시각을 입력해 주세요.',
        ambiguous: 'DST 종료로 두 번 반복되는 현지 시각입니다. 이른 시각 기준 결과를 표시합니다.',
        copied: '변환 결과를 복사했습니다.',
        copyFail: '복사할 변환 결과가 아직 없습니다.',
        copyUnavailable: '자동 복사를 사용할 수 없습니다.',
        cleared: '입력 시간을 초기화했습니다.',
        sameDay: '같은 날짜',
        prevDay: '전날',
        nextDay: '다음날',
        diffDays: (n) => n > 0 ? `${n}일 뒤` : `${Math.abs(n)}일 전`,
        result: (fromText, toText, timeText, offset, dayDiff) => `${fromText} 기준 → ${toText}: ${timeText} (${offset}, ${dayDiff})`
      },
      en: {
        locale: 'en-US',
        empty: 'Enter a date and time to see the converted local time.',
        invalid: 'Check the date and time format.',
        nonexistent: 'This local time does not exist in the source zone because of a DST transition. Choose another time.',
        ambiguous: 'This local time repeats when DST ends. Showing the earlier occurrence.',
        copied: 'Copied the converted time.',
        copyFail: 'There is no converted result to copy yet.',
        copyUnavailable: 'Automatic copy is unavailable.',
        cleared: 'Cleared the input time.',
        sameDay: 'Same date',
        prevDay: 'Previous day',
        nextDay: 'Next day',
        diffDays: (n) => n > 0 ? `${n} days later` : `${Math.abs(n)} days earlier`,
        result: (fromText, toText, timeText, offset, dayDiff) => `${fromText} → ${toText}: ${timeText} (${offset}, ${dayDiff})`
      },
      ja: {
        locale: 'ja-JP',
        empty: '日付と時刻を入力すると、変換先の現地時刻を表示します。',
        invalid: '日付または時刻の形式を確認してください。',
        nonexistent: 'DST切替により、基準タイムゾーンに存在しない現地時刻です。別の時刻を選んでください。',
        ambiguous: 'DST終了で2回繰り返される現地時刻です。早い方の時刻を表示します。',
        copied: '変換結果をコピーしました。',
        copyFail: 'コピーできる変換結果がまだありません。',
        copyUnavailable: '自動コピーを利用できません。',
        cleared: '入力時刻をクリアしました。',
        sameDay: '同じ日付',
        prevDay: '前日',
        nextDay: '翌日',
        diffDays: (n) => n > 0 ? `${n}日後` : `${Math.abs(n)}日前`,
        result: (fromText, toText, timeText, offset, dayDiff) => `${fromText} 基準 → ${toText}: ${timeText} (${offset}, ${dayDiff})`
      }
    };
    const tzText = tzI18n[pageLang] || tzI18n.ko;
    const zones = [
      ['Asia/Seoul', 'Seoul (KST)'],
      ['Asia/Tokyo', 'Tokyo (JST)'],
      ['Asia/Shanghai', 'Shanghai/Beijing (CST)'],
      ['Asia/Singapore', 'Singapore (SGT)'],
      ['Asia/Bangkok', 'Bangkok (ICT)'],
      ['Asia/Dubai', 'Dubai (GST)'],
      ['Europe/London', 'London (GMT/BST)'],
      ['Europe/Paris', 'Paris/Berlin (CET/CEST)'],
      ['America/New_York', 'New York (EST/EDT)'],
      ['America/Chicago', 'Chicago (CST/CDT)'],
      ['America/Denver', 'Denver (MST/MDT)'],
      ['America/Los_Angeles', 'Los Angeles (PST/PDT)'],
      ['America/Sao_Paulo', 'Sao Paulo (BRT)'],
      ['Australia/Sydney', 'Sydney (AEST/AEDT)'],
      ['Pacific/Auckland', 'Auckland (NZST/NZDT)'],
      ['UTC', 'UTC']
    ];

    const fillZones = (select, selected) => {
      if (!select) return;
      select.innerHTML = zones.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
      select.value = selected;
    };

    fillZones(from, 'Asia/Seoul');
    fillZones(to, 'America/Los_Angeles');

    const getParts = (date, timeZone) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hourCycle: 'h23'
      }).formatToParts(date);
      const map = {};
      parts.forEach(p => { if (p.type !== 'literal') map[p.type] = p.value; });
      return map;
    };

    const parseLocalInput = (dateStr) => {
      const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(dateStr || '');
      if (!match) return null;
      const values = match.slice(1).map(Number);
      const [Y, M, D, h, m] = values;
      const check = new Date(Date.UTC(Y, M - 1, D, h, m));
      if (
        check.getUTCFullYear() !== Y || check.getUTCMonth() !== M - 1 || check.getUTCDate() !== D ||
        check.getUTCHours() !== h || check.getUTCMinutes() !== m
      ) return null;
      return { Y, M, D, h, m };
    };

    const partsMatch = (parts, target) => (
      Number(parts.year) === target.Y &&
      Number(parts.month) === target.M &&
      Number(parts.day) === target.D &&
      Number(parts.hour) === target.h &&
      Number(parts.minute) === target.m
    );

    const zonedToUtc = (dateStr, timeZone) => {
      const targetParts = parseLocalInput(dateStr);
      if (!targetParts) return null;
      const { Y, M, D, h, m } = targetParts;
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
      const candidates = [-120, -60, -30, 0, 30, 60, 120]
        .map(minutes => new Date(utc + minutes * 60000))
        .filter(candidate => partsMatch(getParts(candidate, timeZone), targetParts))
        .sort((a, b) => a.getTime() - b.getTime());
      const unique = candidates.filter((candidate, index) => index === 0 || candidate.getTime() !== candidates[index - 1].getTime());
      if (!unique.length) return { nonexistent: true };
      return { date: unique[0], ambiguous: unique.length > 1 };
    };

    const formatDateTime = (date, timeZone, options = {}) => new Intl.DateTimeFormat(tzText.locale, {
      dateStyle: options.dateStyle || 'medium',
      timeStyle: options.timeStyle || 'short',
      timeZone
    }).format(date);

    const getOffsetLabel = (date, timeZone) => {
      const parts = getParts(date, timeZone);
      const localAsUTC = Date.UTC(
        Number(parts.year), Number(parts.month) - 1, Number(parts.day),
        Number(parts.hour), Number(parts.minute), Number(parts.second || 0)
      );
      const offsetMinutes = Math.round((localAsUTC - date.getTime()) / 60000);
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const abs = Math.abs(offsetMinutes);
      return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
    };

    const getDayDiffText = (date, fromZone, toZone) => {
      const a = getParts(date, fromZone);
      const b = getParts(date, toZone);
      const fromDay = Date.UTC(Number(a.year), Number(a.month) - 1, Number(a.day));
      const toDay = Date.UTC(Number(b.year), Number(b.month) - 1, Number(b.day));
      const diff = Math.round((toDay - fromDay) / 86400000);
      if (diff === 0) return tzText.sameDay;
      if (diff === -1) return tzText.prevDay;
      if (diff === 1) return tzText.nextDay;
      return tzText.diffDays(diff);
    };

    const setStats = (source = '-', target = '-', offset = '-', dayDiff = '-') => {
      if (sourceOut) sourceOut.textContent = source;
      if (targetOut) targetOut.textContent = target;
      if (offsetOut) offsetOut.textContent = offset;
      if (dayDiffOut) dayDiffOut.textContent = dayDiff;
    };

    const setStatus = (message, state = '') => {
      out.textContent = message;
      out.dataset.state = state;
    };

    const resetResult = (message, state = '') => {
      setStatus(message, state);
      setStats();
      copyBtn.disabled = true;
    };

    const formatInputForZone = (date, timeZone) => {
      const parts = getParts(date, timeZone);
      return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
    };

    const run = () => {
      if (!dt.value) {
        dt.setAttribute('aria-invalid', 'false');
        resetResult(tzText.empty);
        return;
      }
      const conversion = zonedToUtc(dt.value, from.value);
      if (!conversion) {
        dt.setAttribute('aria-invalid', 'true');
        resetResult(tzText.invalid, 'error');
        return;
      }
      if (conversion.nonexistent) {
        dt.setAttribute('aria-invalid', 'true');
        resetResult(tzText.nonexistent, 'error');
        return;
      }
      const utcDate = conversion.date;
      dt.setAttribute('aria-invalid', 'false');
      const sourceText = formatDateTime(utcDate, from.value);
      const targetText = formatDateTime(utcDate, to.value);
      const resultText = formatDateTime(utcDate, to.value, { dateStyle: 'full' });
      const offset = getOffsetLabel(utcDate, to.value);
      const dayDiff = getDayDiffText(utcDate, from.value, to.value);
      const result = tzText.result(from.options[from.selectedIndex].text, to.options[to.selectedIndex].text, resultText, offset, dayDiff);
      setStatus(conversion.ambiguous ? `${tzText.ambiguous} ${result}` : result, conversion.ambiguous ? 'warning' : 'success');
      setStats(sourceText, targetText, offset, dayDiff);
      copyBtn.disabled = false;
    };

    const setNow = () => {
      dt.value = formatInputForZone(new Date(), from.value);
      run();
      dt.focus();
    };

    [from, to, dt].forEach(el => el?.addEventListener('input', run));
    [from, to].forEach(el => el?.addEventListener('change', run));
    nowBtn?.addEventListener('click', setNow);
    clearBtn?.addEventListener('click', () => {
      dt.value = '';
      resetResult(tzText.cleared);
      dt.setAttribute('aria-invalid', 'false');
      dt.focus();
    });
    swapBtn?.addEventListener('click', () => {
      const oldFrom = from.value;
      from.value = to.value;
      to.value = oldFrom;
      run();
    });
    copyBtn?.addEventListener('click', async () => {
      const text = out.textContent || '';
      if (!text || text === tzText.empty || text === tzText.invalid) {
        out.textContent = tzText.copyFail;
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        setStatus(`${tzText.copied} ${text}`, out.dataset.state);
      } catch (_) {
        setStatus(tzText.copyUnavailable, 'error');
      }
    });
    document.querySelectorAll('.tz-presets button').forEach(btn => btn.addEventListener('click', () => {
      from.value = btn.dataset.from || from.value;
      to.value = btn.dataset.to || to.value;
      run();
    }));
    setNow();
  }

  if (slug === 'case-converter') {
    const input = document.getElementById('cc-input');
    const output = document.getElementById('cc-output');
    const status = document.getElementById('cc-status');
    const chars = document.getElementById('cc-chars');
    const wordsOut = document.getElementById('cc-words');
    const copy = document.getElementById('cc-copy');
    const clear = document.getElementById('cc-clear');
    const sample = document.getElementById('cc-sample');
    const buttons = [...document.querySelectorAll('.cc-grid button')];
    if (!input || !output || !status) return;

    const ccText = {
      ko: {
        empty: '변환할 텍스트를 먼저 입력해 주세요.',
        ready: '텍스트를 입력한 뒤 변환 형식을 선택하세요.',
        converted: (mode) => `${mode} 형식으로 변환했습니다.`,
        copied: '변환 결과를 복사했습니다.',
        copyEmpty: '복사할 변환 결과가 없습니다.',
        copyFail: '자동 복사를 사용할 수 없습니다. 결과를 직접 선택해 복사해 주세요.',
        sample: 'customerOrder ID API_response',
        cleared: '입력과 결과를 초기화했습니다.'
      },
      en: {
        empty: 'Enter text before choosing a conversion style.',
        ready: 'Enter text, then choose a conversion style.',
        converted: (mode) => `Converted to ${mode}.`,
        copied: 'Copied the converted result.',
        copyEmpty: 'There is no converted result to copy.',
        copyFail: 'Automatic copy is unavailable. Select and copy the result manually.',
        sample: 'customerOrder ID API_response',
        cleared: 'Cleared the input and result.'
      },
      ja: {
        empty: '変換するテキストを先に入力してください。',
        ready: 'テキストを入力して変換形式を選んでください。',
        converted: (mode) => `${mode}形式に変換しました。`,
        copied: '変換結果をコピーしました。',
        copyEmpty: 'コピーする変換結果がありません。',
        copyFail: '自動コピーを利用できません。結果を選択してコピーしてください。',
        sample: 'customerOrder ID API_response',
        cleared: '入力と結果をクリアしました。'
      }
    }[pageLang];

    const splitWords = (text) => text
      .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2')
      .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
      .match(/[\p{L}\p{N}]+/gu) || [];
    const capitalize = (word) => word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : '';
    const updateStats = () => {
      const text = input.value || '';
      chars.textContent = formatNum([...text].length);
      wordsOut.textContent = formatNum(splitWords(text).length);
      if (!text.trim()) {
        output.value = '';
        buttons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
        status.textContent = ccText.ready;
      }
    };
    const convert = (mode) => {
      const text = input.value || '';
      if (!text.trim()) {
        output.value = '';
        status.textContent = ccText.empty;
        input.focus();
        return;
      }
      const words = splitWords(text);
      const lowerWords = words.map(word => word.toLowerCase());
      const results = {
        upper: () => text.toUpperCase(),
        lower: () => text.toLowerCase(),
        title: () => words.map(capitalize).join(' '),
        camel: () => lowerWords.map((word, index) => index ? capitalize(word) : word).join(''),
        snake: () => lowerWords.join('_'),
        kebab: () => lowerWords.join('-')
      };
      output.value = (results[mode] || results.lower)();
      buttons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.mode === mode)));
      status.textContent = ccText.converted(buttons.find(btn => btn.dataset.mode === mode)?.textContent || mode);
    };

    buttons.forEach(btn => btn.addEventListener('click', () => convert(btn.dataset.mode)));
    input.addEventListener('input', updateStats);
    sample?.addEventListener('click', () => {
      input.value = ccText.sample;
      updateStats();
      convert('camel');
    });
    clear?.addEventListener('click', () => {
      input.value = '';
      output.value = '';
      updateStats();
      status.textContent = ccText.cleared;
      input.focus();
    });
    copy?.addEventListener('click', async () => {
      if (!output.value) {
        status.textContent = ccText.copyEmpty;
        return;
      }
      try {
        await navigator.clipboard.writeText(output.value);
        status.textContent = ccText.copied;
      } catch (_) {
        output.focus();
        output.select();
        status.textContent = ccText.copyFail;
      }
    });
    updateStats();
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
    const fit = document.getElementById('ir-fit');
    const format = document.getElementById('ir-format');
    const qualityInput = document.getElementById('ir-quality');
    const qualityLabel = document.getElementById('ir-quality-label');
    const bg = document.getElementById('ir-bg');
    const result = document.getElementById('ir-result');
    const originalStat = document.getElementById('ir-original');
    const targetStat = document.getElementById('ir-target');
    const outputStat = document.getElementById('ir-output');
    const fitStat = document.getElementById('ir-fit-label');
    if (!f || !run || !canvas || !link) return;
    let img = null;
    let ratio = 1;
    let originBytes = 0;
    let objectUrl = '';
    let downloadUrl = '';
    const maxEdge = 4096;
    const maxPixels = 12000000;
    const maxSourcePixels = 50000000;
    const supportedTypes = ['image/png', 'image/jpeg', 'image/webp'];

    const resizeText = {
      ko: {
        empty: '이미지를 먼저 선택해 주세요.',
        invalidFile: '이미지 파일을 불러오지 못했습니다. JPG, PNG, WebP 파일로 다시 시도해 주세요.',
        unsupportedBrowser: '이 브라우저는 이미지 리사이즈 저장을 지원하지 않습니다. 최신 Chrome, Edge, Safari에서 다시 시도해 주세요.',
        invalidSize: '너비와 높이는 1~4096px 사이 숫자로 입력해 주세요.',
        tooLarge: '출력 픽셀 수가 너무 큽니다. 가로×세로가 1,200만 픽셀 이하가 되도록 줄여 주세요.',
        sourceTooLarge: '원본 이미지가 너무 큽니다. 5,000만 픽셀 이하 이미지로 다시 시도해 주세요.',
        exportFail: '브라우저에서 결과 파일을 만들지 못했습니다. 크기를 줄이거나 다른 출력 포맷을 선택해 주세요.',
        original: (w, h, b) => `원본: ${w}×${h}px / ${b}`,
        result: (ow, oh, w, h, b) => `원본: ${ow}×${oh}px → 결과: ${w}×${h}px / ${b}`,
        ready: (w, h) => `${w}×${h}px 이미지가 준비되었습니다. 목표 크기를 확인한 뒤 리사이즈하세요.`,
        done: (w, h, b) => `${w}×${h}px 이미지로 리사이즈했습니다. 다운로드 버튼을 사용할 수 있습니다.`,
        quality: (n) => `품질 ${n}%`,
        fitLabels: { contain: '전체 맞춤', cover: '채우기/자르기', stretch: '늘리기' }
      },
      en: {
        empty: 'Choose an image first.',
        invalidFile: 'Could not load this image. Try a JPG, PNG, or WebP file.',
        unsupportedBrowser: 'This browser cannot export resized images. Try the latest Chrome, Edge, or Safari.',
        invalidSize: 'Enter width and height as numbers from 1 to 4096 px.',
        tooLarge: 'The output is too large. Keep width × height at 12 million pixels or less.',
        sourceTooLarge: 'The source image is too large. Try an image at or below 50 million pixels.',
        exportFail: 'The browser could not create the output file. Try a smaller size or another output format.',
        original: (w, h, b) => `Original: ${w}×${h}px / ${b}`,
        result: (ow, oh, w, h, b) => `Original: ${ow}×${oh}px → Result: ${w}×${h}px / ${b}`,
        ready: (w, h) => `${w}×${h}px image loaded. Check the target size, then resize.`,
        done: (w, h, b) => `Resized to ${w}×${h}px. The download button is ready.`,
        quality: (n) => `Quality ${n}%`,
        fitLabels: { contain: 'Fit inside', cover: 'Fill/crop', stretch: 'Stretch' }
      },
      ja: {
        empty: '先に画像を選択してください。',
        invalidFile: '画像を読み込めませんでした。JPG、PNG、WebPファイルで再試行してください。',
        unsupportedBrowser: 'このブラウザではリサイズ画像を書き出せません。最新のChrome、Edge、Safariで再試行してください。',
        invalidSize: '幅と高さは1〜4096pxの数字で入力してください。',
        tooLarge: '出力サイズが大きすぎます。幅×高さを1,200万ピクセル以下にしてください。',
        sourceTooLarge: '元画像が大きすぎます。5,000万ピクセル以下の画像で再試行してください。',
        exportFail: 'ブラウザで出力ファイルを作成できませんでした。サイズを下げるか別の形式を選んでください。',
        original: (w, h, b) => `元画像: ${w}×${h}px / ${b}`,
        result: (ow, oh, w, h, b) => `元画像: ${ow}×${oh}px → 出力: ${w}×${h}px / ${b}`,
        ready: (w, h) => `${w}×${h}pxの画像を読み込みました。目標サイズを確認してリサイズしてください。`,
        done: (w, h, b) => `${w}×${h}pxにリサイズしました。ダウンロードできます。`,
        quality: (n) => `品質 ${n}%`,
        fitLabels: { contain: '全体表示', cover: '切り抜き', stretch: '引き伸ばし' }
      }
    }[pageLang] || {
      empty: '이미지를 먼저 선택해 주세요.',
      invalidFile: '이미지 파일을 불러오지 못했습니다. JPG, PNG, WebP 파일로 다시 시도해 주세요.',
      unsupportedBrowser: '이 브라우저는 이미지 리사이즈 저장을 지원하지 않습니다. 최신 Chrome, Edge, Safari에서 다시 시도해 주세요.',
      invalidSize: '너비와 높이는 1~4096px 사이 숫자로 입력해 주세요.',
      tooLarge: '출력 픽셀 수가 너무 큽니다. 가로×세로가 1,200만 픽셀 이하가 되도록 줄여 주세요.',
      sourceTooLarge: '원본 이미지가 너무 큽니다. 5,000만 픽셀 이하 이미지로 다시 시도해 주세요.',
      exportFail: '브라우저에서 결과 파일을 만들지 못했습니다. 크기를 줄이거나 다른 출력 포맷을 선택해 주세요.',
      original: (w, h, b) => `원본: ${w}×${h}px / ${b}`,
      result: (ow, oh, w, h, b) => `원본: ${ow}×${oh}px → 결과: ${w}×${h}px / ${b}`,
      ready: (w, h) => `${w}×${h}px 이미지가 준비되었습니다. 목표 크기를 확인한 뒤 리사이즈하세요.`,
      done: (w, h, b) => `${w}×${h}px 이미지로 리사이즈했습니다. 다운로드 버튼을 사용할 수 있습니다.`,
      quality: (n) => `품질 ${n}%`,
      fitLabels: { contain: '전체 맞춤', cover: '채우기/자르기', stretch: '늘리기' }
    };

    const revokeDownload = () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = '';
    };

    const setDownloadReady = (ready) => {
      if (ready) {
        link.removeAttribute('aria-disabled');
      } else {
        revokeDownload();
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
      }
    };

    const setStats = (target = '-', output = '-', fitMode = '-') => {
      if (originalStat) originalStat.textContent = img ? `${formatNum(img.width)}×${formatNum(img.height)}` : '-';
      if (targetStat) targetStat.textContent = target;
      if (outputStat) outputStat.textContent = output;
      if (fitStat) fitStat.textContent = fitMode;
    };

    const setMessage = (message, state = '') => {
      if (!result) return;
      result.textContent = message;
      result.dataset.state = state;
    };

    const setInvalid = (invalid) => {
      [w, h].forEach(el => el?.setAttribute('aria-invalid', invalid ? 'true' : 'false'));
    };
    const setFileInvalid = (invalid) => {
      f.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    };
    const formatBytes = (bytes) => {
      const n = Number(bytes || 0);
      if (!Number.isFinite(n) || n <= 0) return '0 B';
      if (n < 1024) return `${formatNum(n)} B`;
      if (n < 1024 * 1024) return `${formatNum(n / 1024)} KB`;
      return `${(n / 1024 / 1024).toFixed(n >= 10 * 1024 * 1024 ? 1 : 2)} MB`;
    };

    const getMime = () => format?.value || mime;
    const getQuality = () => {
      const q = Number(qualityInput?.value || quality);
      return Number.isFinite(q) ? Math.min(1, Math.max(0.45, q)) : quality;
    };
    const extensionFor = (type) => {
      if (type === 'image/jpeg') return 'jpg';
      if (type === 'image/webp') return 'webp';
      return 'png';
    };
    const isOpaqueOutput = () => getMime() === 'image/jpeg';
    const backgroundColor = () => bg?.value || '#ffffff';

    const updateQualityLabel = () => {
      const percent = Math.round(getQuality() * 100);
      if (qualityLabel) qualityLabel.textContent = `${percent}%`;
      if (qualityInput) qualityInput.setAttribute('aria-label', resizeText.quality(percent));
    };

    const updateResult = (width, height, outBytes = 0) => {
      const fitMode = resizeText.fitLabels[fit?.value || 'contain'] || '-';
      setStats(`${formatNum(width)}×${formatNum(height)}`, outBytes ? formatBytes(outBytes) : '-', fitMode);
      if (!result) return;
      if (!outBytes) {
        result.textContent = resizeText.original(img?.width || 0, img?.height || 0, formatBytes(originBytes));
      } else {
        result.textContent = resizeText.result(img?.width || 0, img?.height || 0, width, height, formatBytes(outBytes));
      }
    };

    const getTargetSize = () => {
      const width = Math.round(Number(w?.value || 0));
      const height = Math.round(Number(h?.value || 0));
      if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1 || width > maxEdge || height > maxEdge) {
        return null;
      }
      if (width * height > maxPixels) return false;
      return { width, height };
    };

    const syncTargetStats = () => {
      const size = getTargetSize();
      if (size && img) updateResult(size.width, size.height);
      if (!size && img) setStats('-', '-', resizeText.fitLabels[fit?.value || 'contain'] || '-');
    };

    const drawImageToCanvas = (ctx, width, height) => {
      const mode = fit?.value || 'contain';
      ctx.clearRect(0, 0, width, height);
      if (mode === 'contain' || isOpaqueOutput()) {
        ctx.fillStyle = backgroundColor();
        ctx.fillRect(0, 0, width, height);
      }

      if (mode === 'stretch') {
        ctx.drawImage(img, 0, 0, width, height);
        return;
      }

      const scale = mode === 'cover'
        ? Math.max(width / img.width, height / img.height)
        : Math.min(width / img.width, height / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const dx = (width - drawWidth) / 2;
      const dy = (height - drawHeight) / 2;
      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    };

    setDownloadReady(false);
    setStats();
    updateQualityLabel();
    if (!canvas.getContext || !HTMLCanvasElement.prototype.toBlob) {
      run.disabled = true;
      setFileInvalid(false);
      setInvalid(false);
      setMessage(resizeText.unsupportedBrowser, 'error');
      return;
    }

    f.addEventListener('change', () => {
      const file = f.files?.[0];
      setDownloadReady(false);
      setFileInvalid(false);
      setInvalid(false);
      canvas.removeAttribute('width');
      canvas.removeAttribute('height');
      if (!file) {
        img = null;
        setStats();
        setMessage(resizeText.empty);
        return;
      }
      if (!supportedTypes.includes(file.type)) {
        img = null;
        setStats();
        setFileInvalid(true);
        setMessage(resizeText.invalidFile, 'error');
        return;
      }
      originBytes = file.size || 0;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(file);
      const i = new Image();
      i.onload = () => {
        if (i.width * i.height > maxSourcePixels) {
          img = null;
          setStats();
          setFileInvalid(true);
          setMessage(resizeText.sourceTooLarge, 'error');
          URL.revokeObjectURL(objectUrl);
          objectUrl = '';
          return;
        }
        img = i;
        setFileInvalid(false);
        ratio = i.width / i.height;
        if (w) w.value = i.width;
        if (h) h.value = i.height;
        updateResult(i.width, i.height);
        setMessage(resizeText.ready(i.width, i.height));
        URL.revokeObjectURL(objectUrl);
        objectUrl = '';
      };
      i.onerror = () => {
        img = null;
        setStats();
        setFileInvalid(true);
        setMessage(resizeText.invalidFile, 'error');
        URL.revokeObjectURL(objectUrl);
        objectUrl = '';
      };
      i.src = objectUrl;
    });

    preset?.addEventListener('change', () => {
      if (!preset.value || preset.value === 'custom') return;
      const [pw, ph] = preset.value.split('x').map(Number);
      if (w) w.value = pw;
      if (h) h.value = ph;
      setInvalid(false);
      syncTargetStats();
    });

    w?.addEventListener('input', () => {
      if (preset) preset.value = 'custom';
      if (!img || !lock?.checked) return;
      const width = Number(w.value || img.width);
      if (!Number.isFinite(width) || width < 1) {
        syncTargetStats();
        return;
      }
      if (h) h.value = Math.max(1, Math.round(width / ratio));
      syncTargetStats();
    });

    h?.addEventListener('input', () => {
      if (preset) preset.value = 'custom';
      if (!img || !lock?.checked) return;
      const height = Number(h.value || img.height);
      if (!Number.isFinite(height) || height < 1) {
        syncTargetStats();
        return;
      }
      if (w) w.value = Math.max(1, Math.round(height * ratio));
      syncTargetStats();
    });

    [w, h, fit, bg, format].forEach(el => el?.addEventListener('change', syncTargetStats));
    [w, h].forEach(el => el?.addEventListener('input', () => {
      setDownloadReady(false);
      const size = getTargetSize();
      setInvalid(size === false || !size);
      syncTargetStats();
    }));
    [fit, bg, format].forEach(el => el?.addEventListener('change', () => setDownloadReady(false)));
    qualityInput?.addEventListener('input', () => {
      setDownloadReady(false);
      updateQualityLabel();
    });

    run.addEventListener('click', () => {
      setDownloadReady(false);
      if (!img) {
        setMessage(resizeText.empty);
        return;
      }
      const size = getTargetSize();
      if (size === false) {
        setInvalid(true);
        setMessage(resizeText.tooLarge, 'error');
        return;
      }
      if (!size) {
        setInvalid(true);
        setMessage(resizeText.invalidSize, 'error');
        return;
      }
      setInvalid(false);
      const { width, height } = size;
      canvas.width = width; canvas.height = height;
      drawImageToCanvas(canvas.getContext('2d'), width, height);
      const exportMime = getMime();
      const exportQuality = exportMime === 'image/png' ? undefined : getQuality();
      canvas.toBlob((blob) => {
        if (!blob) {
          setDownloadReady(false);
          setMessage(resizeText.exportFail, 'error');
          return;
        }
        revokeDownload();
        downloadUrl = URL.createObjectURL(blob);
        link.href = downloadUrl;
        link.download = `resized-${width}x${height}.${extensionFor(exportMime)}`;
        setDownloadReady(true);
        updateResult(width, height, blob.size);
        setMessage(resizeText.done(width, height, blob.size), 'success');
      }, exportMime, exportQuality);
    });
  };

  if (slug === 'image-resizer') drawResize('ir-file','ir-width','ir-height','ir-run','ir-canvas','ir-download','image/png',0.92);

  if (slug === 'png-compressor') {
    const file = document.getElementById('pc-file');
    const q = document.getElementById('pc-quality');
    const qLabel = document.getElementById('pc-quality-label');
    const format = document.getElementById('pc-format');
    const run = document.getElementById('pc-run');
    const canvas = document.getElementById('pc-canvas');
    const link = document.getElementById('pc-download');
    const result = document.getElementById('pc-result');
    const originalStat = document.getElementById('pc-original');
    const outputStat = document.getElementById('pc-output');
    const savingsStat = document.getElementById('pc-savings');
    const dimensionsStat = document.getElementById('pc-dimensions');
    const formatStat = document.getElementById('pc-format-stat');
    const warning = document.getElementById('pc-warning');
    let img = null;
    let originSize = 0;
    let originType = '';
    let objectUrl = '';
    let downloadUrl = '';
    let isRunning = false;

    const pcText = {
      ko: {
        ready: '이미지를 선택했습니다. 포맷과 품질을 고른 뒤 압축 실행을 누르세요.',
        empty: '먼저 압축할 이미지 파일을 선택해 주세요.',
        unsupported: 'PNG, JPEG, WebP 이미지 파일만 선택할 수 있습니다.',
        unsupportedBrowser: '이 브라우저는 이미지 압축 기능을 지원하지 않습니다. 최신 Chrome, Edge, Safari에서 다시 시도해 주세요.',
        tooLarge: '이미지가 너무 커서 브라우저 압축이 불안정할 수 있습니다. 먼저 이미지 리사이저로 크기를 줄여 주세요.',
        fail: '이 브라우저에서 해당 포맷으로 압축하지 못했습니다. 다른 출력 포맷을 선택해 보세요.',
        running: '압축 중입니다...',
        done: (o, c, r) => `원본 ${o}에서 결과 ${c}로 변환했습니다. ${r >= 0 ? `약 ${r}% 절감됐습니다.` : `결과가 약 ${Math.abs(r)}% 커졌습니다.`}`,
        pngNotice: 'PNG는 무손실 출력이라 품질 슬라이더 영향이 작고, 사진은 WebP/JPEG가 더 작을 수 있습니다.',
        jpegAlpha: '투명 배경 이미지를 JPEG로 저장하면 투명 영역은 흰색 배경으로 합성됩니다.',
        larger: '결과 용량이 원본보다 커졌습니다. 이미 최적화된 이미지일 수 있으니 WebP/JPEG 품질을 낮추거나 원본을 그대로 쓰는 편이 나을 수 있습니다.'
      },
      en: {
        ready: 'Image loaded. Choose a format and quality, then press Compress.',
        empty: 'Choose an image file before compressing.',
        unsupported: 'Only PNG, JPEG, and WebP images are supported.',
        unsupportedBrowser: 'This browser does not support in-browser image compression. Try a current Chrome, Edge, or Safari build.',
        tooLarge: 'This image is too large for reliable in-browser compression. Resize it first.',
        fail: 'This browser could not export that format. Try a different output format.',
        running: 'Compressing...',
        done: (o, c, r) => `Converted ${o} to ${c}. ${r >= 0 ? `About ${r}% smaller.` : `The output is about ${Math.abs(r)}% larger.`}`,
        pngNotice: 'PNG is lossless, so the quality slider has little effect and photos may be smaller as WebP/JPEG.',
        jpegAlpha: 'Transparent pixels are flattened onto a white background when saving as JPEG.',
        larger: 'The output is larger than the original. The image may already be optimized, so try lower WebP/JPEG quality or keep the original.'
      },
      ja: {
        ready: '画像を読み込みました。形式と品質を選んで圧縮を実行してください。',
        empty: '先に圧縮する画像ファイルを選択してください。',
        unsupported: 'PNG、JPEG、WebP画像のみ対応しています。',
        unsupportedBrowser: 'このブラウザは画像圧縮機能に対応していません。最新のChrome、Edge、Safariでお試しください。',
        tooLarge: '画像が大きすぎるため、ブラウザ内圧縮が不安定になる可能性があります。先にリサイズしてください。',
        fail: 'このブラウザではその形式で出力できませんでした。別の出力形式を試してください。',
        running: '圧縮中です...',
        done: (o, c, r) => `${o}から${c}へ変換しました。${r >= 0 ? `約${r}%削減しました。` : `結果が約${Math.abs(r)}%大きくなりました。`}`,
        pngNotice: 'PNGは可逆出力のため品質スライダーの影響が小さく、写真はWebP/JPEGのほうが軽くなる場合があります。',
        jpegAlpha: '透過画像をJPEGで保存すると、透過部分は白背景に合成されます。',
        larger: '結果容量が元画像より大きくなりました。すでに最適化済みの可能性があるため、WebP/JPEG品質を下げるか元画像の利用を検討してください。'
      }
    }[pageLang] || {
      ready: '이미지를 선택했습니다. 포맷과 품질을 고른 뒤 압축 실행을 누르세요.',
      empty: '먼저 압축할 이미지 파일을 선택해 주세요.',
      unsupported: 'PNG, JPEG, WebP 이미지 파일만 선택할 수 있습니다.',
      unsupportedBrowser: '이 브라우저는 이미지 압축 기능을 지원하지 않습니다. 최신 Chrome, Edge, Safari에서 다시 시도해 주세요.',
      tooLarge: '이미지가 너무 커서 브라우저 압축이 불안정할 수 있습니다. 먼저 이미지 리사이저로 크기를 줄여 주세요.',
      fail: '이 브라우저에서 해당 포맷으로 압축하지 못했습니다. 다른 출력 포맷을 선택해 보세요.',
      running: '압축 중입니다...',
      done: (o, c, r) => `원본 ${o}에서 결과 ${c}로 변환했습니다. ${r >= 0 ? `약 ${r}% 절감됐습니다.` : `결과가 약 ${Math.abs(r)}% 커졌습니다.`}`,
      pngNotice: 'PNG는 무손실 출력이라 품질 슬라이더 영향이 작고, 사진은 WebP/JPEG가 더 작을 수 있습니다.',
      jpegAlpha: '투명 배경 이미지를 JPEG로 저장하면 투명 영역은 흰색 배경으로 합성됩니다.',
      larger: '결과 용량이 원본보다 커졌습니다. 이미 최적화된 이미지일 수 있으니 WebP/JPEG 품질을 낮추거나 원본을 그대로 쓰는 편이 나을 수 있습니다.'
    };

    const supportedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxPixels = 24_000_000;
    const maxBytes = 25 * 1024 * 1024;

    const extByMime = (mime) => {
      if (mime === 'image/jpeg') return 'jpg';
      if (mime === 'image/png') return 'png';
      return 'webp';
    };

    const formatBytes = (bytes) => {
      const n = Number(bytes) || 0;
      if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toLocaleString(numberLocale, { maximumFractionDigits: 2 })} MB`;
      if (n >= 1024) return `${(n / 1024).toLocaleString(numberLocale, { maximumFractionDigits: 1 })} KB`;
      return `${formatNum(n)} B`;
    };

    const setDownloadReady = (ready, url = '') => {
      if (!link) return;
      if (downloadUrl && downloadUrl !== url) URL.revokeObjectURL(downloadUrl);
      downloadUrl = url;
      if (ready && url) {
        link.href = url;
        link.setAttribute('aria-disabled', 'false');
      } else {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
      }
    };

    const mimeLabel = (mime) => {
      if (mime === 'image/jpeg') return 'JPEG';
      if (mime === 'image/png') return 'PNG';
      if (mime === 'image/webp') return 'WebP';
      return '-';
    };

    const setMessage = (message, state = '') => {
      if (!result) return;
      result.textContent = message;
      result.dataset.state = state;
    };

    const setWarning = (message = '', state = 'warning') => {
      if (!warning) return;
      warning.textContent = message;
      warning.hidden = !message;
      warning.dataset.state = message ? state : '';
    };

    const setStats = (original = '-', output = '-', savings = '-', dimensions = '-', outputFormat = '-') => {
      if (originalStat) originalStat.textContent = original;
      if (outputStat) outputStat.textContent = output;
      if (savingsStat) savingsStat.textContent = savings;
      if (dimensionsStat) dimensionsStat.textContent = dimensions;
      if (formatStat) formatStat.textContent = outputFormat;
    };

    const updateQualityLabel = () => {
      const percent = Math.round(Number(q?.value || 0.8) * 100);
      if (qLabel) qLabel.textContent = `${percent}%`;
    };

    const clearCanvas = () => {
      if (!canvas) return;
      canvas.width = 0;
      canvas.height = 0;
    };

    if (!canvas?.getContext || !HTMLCanvasElement.prototype.toBlob) {
      setMessage(pcText.unsupportedBrowser, 'error');
      run.disabled = true;
      file.disabled = true;
      format.disabled = true;
      q.disabled = true;
      setDownloadReady(false);
      return;
    }

    file?.addEventListener('change', () => {
      setDownloadReady(false);
      setWarning('');
      clearCanvas();
      img = null;
      originType = '';
      const f = file.files?.[0];
      if (!f) {
        originSize = 0;
        setStats();
        file.setAttribute('aria-invalid', 'false');
        setMessage(pcText.empty);
        return;
      }
      if (!supportedTypes.includes(f.type)) {
        file.value = '';
        originSize = 0;
        setStats();
        file.setAttribute('aria-invalid', 'true');
        setMessage(pcText.unsupported, 'error');
        return;
      }
      if (f.size > maxBytes) {
        file.value = '';
        originSize = 0;
        setStats();
        file.setAttribute('aria-invalid', 'true');
        setMessage(pcText.tooLarge, 'error');
        return;
      }
      originSize = f.size || 0;
      originType = f.type;
      file.setAttribute('aria-invalid', 'false');
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(f);
      const i = new Image();
      i.onload = () => {
        if (i.width * i.height > maxPixels) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = '';
          originSize = 0;
          file.value = '';
          setStats();
          file.setAttribute('aria-invalid', 'true');
          setMessage(pcText.tooLarge, 'error');
          return;
        }
        img = i;
        setStats(formatBytes(originSize), '-', '-', `${formatNum(i.width)} x ${formatNum(i.height)}`, mimeLabel(format?.value));
        setMessage(pcText.ready, 'success');
        if ((format?.value || '') === 'image/jpeg' && originType === 'image/png') {
          setWarning(pcText.jpegAlpha);
        }
      };
      i.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        objectUrl = '';
        originSize = 0;
        setStats();
        file.setAttribute('aria-invalid', 'true');
        setMessage(pcText.unsupported, 'error');
      };
      i.src = objectUrl;
    });

    q?.addEventListener('input', updateQualityLabel);
    format?.addEventListener('change', () => {
      setDownloadReady(false);
      setStats(
        originalStat?.textContent || '-',
        '-',
        '-',
        dimensionsStat?.textContent || '-',
        mimeLabel(format.value)
      );
      if (format.value === 'image/png') {
        setMessage(pcText.pngNotice, 'warning');
        setWarning('');
      } else if (format.value === 'image/jpeg' && originType === 'image/png') {
        setWarning(pcText.jpegAlpha);
        if (img) setMessage(pcText.ready, 'success');
      } else {
        setWarning('');
        if (img) setMessage(pcText.ready, 'success');
      }
    });
    updateQualityLabel();
    setDownloadReady(false);

    run?.addEventListener('click', async () => {
      if (isRunning) return;
      setDownloadReady(false);
      setWarning('');
      if (!img) {
        setMessage(pcText.empty, 'error');
        file?.focus();
        return;
      }
      const mime = format?.value || 'image/webp';
      const quality = Number(q.value || 0.8);
      isRunning = true;
      run.disabled = true;
      setMessage(pcText.running);
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, mime === 'image/png' ? undefined : quality));
      isRunning = false;
      run.disabled = false;
      if (!blob) {
        setMessage(pcText.fail, 'error');
        setStats(formatBytes(originSize), '-', '-', `${formatNum(img.width)} x ${formatNum(img.height)}`, mimeLabel(mime));
        return;
      }
      const url = URL.createObjectURL(blob);
      setDownloadReady(true, url);
      link.download = `compressed.${extByMime(mime)}`;

      const compressedBytes = blob.size || 0;
      const ratio = originSize ? Number(((1 - compressedBytes / originSize) * 100).toFixed(1)) : 0;
      setStats(formatBytes(originSize), formatBytes(compressedBytes), `${ratio}%`, `${formatNum(img.width)} x ${formatNum(img.height)}`, mimeLabel(mime));
      setMessage(pcText.done(formatBytes(originSize), formatBytes(compressedBytes), ratio), ratio >= 0 ? 'success' : 'warning');
      if (ratio < 0) setWarning(pcText.larger, 'warning');
      else if (mime === 'image/jpeg' && originType === 'image/png') setWarning(pcText.jpegAlpha, 'warning');
    });
  }

  if (slug === 'youtube-image-kit') {
    const file = document.getElementById('ytk-file');
    const fit = document.getElementById('ytk-fit');
    const bg = document.getElementById('ytk-bg');
    const format = document.getElementById('ytk-format');
    const quality = document.getElementById('ytk-quality');
    const qualityLabel = document.getElementById('ytk-quality-label');
    const run = document.getElementById('ytk-run');
    const wrap = document.getElementById('ytk-list');
    const result = document.getElementById('ytk-result');
    const warning = document.getElementById('ytk-warning');
    const allBtn = document.getElementById('ytk-download-all');
    const clearBtn = document.getElementById('ytk-clear');
    const originalOut = document.getElementById('ytk-original');
    const countOut = document.getElementById('ytk-count');
    const formatOut = document.getElementById('ytk-format-label');
    const totalOut = document.getElementById('ytk-total-size');
    if (!file || !fit || !bg || !format || !quality || !run || !wrap || !result) return;

    const ytkText = {
      ko: {
        labels: {
          thumbnail: '유튜브 썸네일',
          'shorts-cover': '쇼츠 커버',
          'channel-banner': '채널 배너',
          'channel-icon': '채널 아이콘',
          watermark: '워터마크'
        },
        idle: '이미지를 선택하면 유튜브 업로드 이미지 세트를 브라우저에서 생성합니다.',
        empty: '먼저 기준 이미지를 선택해 주세요.',
        badType: 'PNG, JPEG, WebP, GIF 이미지만 사용할 수 있습니다.',
        tooBigFile: '파일 용량이 큽니다. 모바일에서는 생성이 느리거나 실패할 수 있습니다.',
        smallSource: '원본이 썸네일 권장 크기(1280x720)보다 작아 일부 결과가 흐릴 수 있습니다.',
        tooLarge: '이미지 해상도가 너무 큽니다. 8000만 픽셀 이하 이미지로 줄인 뒤 다시 시도해 주세요.',
        loading: '이미지를 불러오는 중입니다...',
        failed: '이미지를 읽지 못했습니다. 다른 파일로 다시 시도해 주세요.',
        ready: (w, h) => `원본: ${w}x${h}px · 생성 준비 완료`,
        generating: '출력 이미지를 생성하는 중입니다...',
        generateFailed: '출력 이미지를 생성하지 못했습니다. 더 작은 이미지나 다른 포맷으로 다시 시도해 주세요.',
        emptyAfterGenerate: '생성된 출력이 없습니다. 포맷을 바꾸거나 더 작은 이미지로 다시 시도해 주세요.',
        cleared: '입력과 생성 결과를 초기화했습니다.',
        downloadAll: (count) => `${count}개 파일 다운로드를 시작했습니다. 브라우저가 여러 다운로드 허용을 물어볼 수 있습니다.`,
        download: (label) => `${label} 다운로드`,
        previewAlt: (label) => `${label} 미리보기`,
        done: (count, size, formatLabel) => `${count}개 ${formatLabel} 출력 이미지를 생성했습니다. 총 ${size}.`,
        formatLabel: { 'image/webp': 'WebP', 'image/png': 'PNG', 'image/jpeg': 'JPEG' }
      },
      en: {
        labels: {
          thumbnail: 'YouTube Thumbnail',
          'shorts-cover': 'Shorts Cover',
          'channel-banner': 'Channel Banner',
          'channel-icon': 'Channel Icon',
          watermark: 'Watermark'
        },
        idle: 'Choose an image to generate a YouTube upload image set in your browser.',
        empty: 'Choose a source image first.',
        badType: 'Use a PNG, JPEG, WebP, or GIF image.',
        tooBigFile: 'This file is large. Generation may be slow or fail on mobile browsers.',
        smallSource: 'The source is below the recommended thumbnail size (1280x720), so some outputs may look soft.',
        tooLarge: 'The image resolution is too large. Resize it below 80 million pixels and try again.',
        loading: 'Loading image...',
        failed: 'Could not read the image. Try another file.',
        ready: (w, h) => `Original: ${w}x${h}px · Ready to generate`,
        generating: 'Generating output images...',
        generateFailed: 'Could not generate the outputs. Try a smaller image or another format.',
        emptyAfterGenerate: 'No outputs were generated. Try another format or a smaller source image.',
        cleared: 'Cleared the input and generated outputs.',
        downloadAll: (count) => `Started downloading ${count} files. Your browser may ask to allow multiple downloads.`,
        download: (label) => `Download ${label}`,
        previewAlt: (label) => `${label} preview`,
        done: (count, size, formatLabel) => `Generated ${count} ${formatLabel} output images. Total ${size}.`,
        formatLabel: { 'image/webp': 'WebP', 'image/png': 'PNG', 'image/jpeg': 'JPEG' }
      },
      ja: {
        labels: {
          thumbnail: 'YouTubeサムネイル',
          'shorts-cover': 'ショートカバー',
          'channel-banner': 'チャンネルバナー',
          'channel-icon': 'チャンネルアイコン',
          watermark: '透かし'
        },
        idle: '画像を選ぶと、YouTube投稿用画像セットをブラウザ内で生成できます。',
        empty: '先に元画像を選択してください。',
        badType: 'PNG、JPEG、WebP、GIF画像を使用してください。',
        tooBigFile: 'ファイル容量が大きいため、モバイルでは生成が遅くなるか失敗する場合があります。',
        smallSource: '元画像が推奨サムネイルサイズ（1280x720）未満のため、一部の出力がぼやける場合があります。',
        tooLarge: '画像解像度が大きすぎます。8000万ピクセル以下に縮小してから再試行してください。',
        loading: '画像を読み込んでいます...',
        failed: '画像を読み込めませんでした。別のファイルで再試行してください。',
        ready: (w, h) => `元画像: ${w}x${h}px · 生成準備完了`,
        generating: '出力画像を生成しています...',
        generateFailed: '出力画像を生成できませんでした。小さめの画像または別形式で再試行してください。',
        emptyAfterGenerate: '生成された出力がありません。形式を変えるか、小さめの画像で再試行してください。',
        cleared: '入力と生成結果をクリアしました。',
        downloadAll: (count) => `${count}個のファイルのダウンロードを開始しました。ブラウザが複数ダウンロードの許可を求める場合があります。`,
        download: (label) => `${label} をダウンロード`,
        previewAlt: (label) => `${label} プレビュー`,
        done: (count, size, formatLabel) => `${count}個の${formatLabel}出力画像を生成しました。合計 ${size}。`,
        formatLabel: { 'image/webp': 'WebP', 'image/png': 'PNG', 'image/jpeg': 'JPEG' }
      }
    }[pageLang] || {
      labels: {
        thumbnail: '유튜브 썸네일',
        'shorts-cover': '쇼츠 커버',
        'channel-banner': '채널 배너',
        'channel-icon': '채널 아이콘',
        watermark: '워터마크'
      },
      idle: '이미지를 선택하면 유튜브 업로드 이미지 세트를 브라우저에서 생성합니다.',
      empty: '먼저 기준 이미지를 선택해 주세요.',
      badType: 'PNG, JPEG, WebP, GIF 이미지만 사용할 수 있습니다.',
      tooBigFile: '파일 용량이 큽니다. 모바일에서는 생성이 느리거나 실패할 수 있습니다.',
      smallSource: '원본이 썸네일 권장 크기(1280x720)보다 작아 일부 결과가 흐릴 수 있습니다.',
      tooLarge: '이미지 해상도가 너무 큽니다. 8000만 픽셀 이하 이미지로 줄인 뒤 다시 시도해 주세요.',
      loading: '이미지를 불러오는 중입니다...',
      failed: '이미지를 읽지 못했습니다. 다른 파일로 다시 시도해 주세요.',
      ready: (w, h) => `원본: ${w}x${h}px · 생성 준비 완료`,
      generating: '출력 이미지를 생성하는 중입니다...',
      generateFailed: '출력 이미지를 생성하지 못했습니다. 더 작은 이미지나 다른 포맷으로 다시 시도해 주세요.',
      emptyAfterGenerate: '생성된 출력이 없습니다. 포맷을 바꾸거나 더 작은 이미지로 다시 시도해 주세요.',
      cleared: '입력과 생성 결과를 초기화했습니다.',
      downloadAll: (count) => `${count}개 파일 다운로드를 시작했습니다. 브라우저가 여러 다운로드 허용을 물어볼 수 있습니다.`,
      download: (label) => `${label} 다운로드`,
      previewAlt: (label) => `${label} 미리보기`,
      done: (count, size, formatLabel) => `${count}개 ${formatLabel} 출력 이미지를 생성했습니다. 총 ${size}.`,
      formatLabel: { 'image/webp': 'WebP', 'image/png': 'PNG', 'image/jpeg': 'JPEG' }
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
    let objectUrls = [];
    const maxFileBytes = 30 * 1024 * 1024;

    const formatBytes = (bytes) => {
      if (!Number.isFinite(bytes) || bytes <= 0) return '-';
      if (bytes < 1024) return `${Math.round(bytes)} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    };

    const setStatus = (message, state = '') => {
      result.textContent = message;
      result.dataset.state = state;
    };

    const setWarning = (message = '', state = '') => {
      if (!warning) return;
      warning.textContent = message;
      warning.dataset.state = state;
      warning.hidden = !message;
    };

    const resetOutputs = () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls = [];
      renders = [];
      if (wrap) wrap.innerHTML = '';
      if (countOut) countOut.textContent = '0';
      if (totalOut) totalOut.textContent = '-';
      if (allBtn) allBtn.disabled = true;
    };

    const getFormatLabel = () => ytkText.formatLabel?.[format?.value || 'image/webp'] || 'WebP';

    const updateControls = () => {
      const mime = format.value || 'image/webp';
      if (formatOut) formatOut.textContent = getFormatLabel();
      if (qualityLabel) qualityLabel.textContent = `${Math.round(Number(quality.value || 0.86) * 100)}%`;
      quality.disabled = mime === 'image/png';
    };

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

    const canvasToBlob = (canvas, mime, q) => new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), mime, mime === 'image/png' ? undefined : q);
    });

    file?.addEventListener('change', () => {
      const f = file.files?.[0];
      resetOutputs();
      img = null;
      if (originalOut) originalOut.textContent = '-';
      file.setAttribute('aria-invalid', 'false');
      setWarning('');
      if (!f) {
        setStatus(ytkText.idle);
        return;
      }
      const isSupported = /^image\/(png|jpe?g|webp|gif)$/i.test(f.type || '') || /\.(png|jpe?g|webp|gif)$/i.test(f.name || '');
      if (!isSupported) {
        file.setAttribute('aria-invalid', 'true');
        setStatus(ytkText.badType, 'error');
        file.value = '';
        return;
      }
      if (f.size > maxFileBytes) setWarning(ytkText.tooBigFile, 'warning');
      setStatus(ytkText.loading);
      const u = URL.createObjectURL(f);
      const i = new Image();
      i.onload = () => {
        if (i.width * i.height > 80000000) {
          URL.revokeObjectURL(u);
          file.setAttribute('aria-invalid', 'true');
          setStatus(ytkText.tooLarge, 'error');
          file.value = '';
          return;
        }
        img = i;
        URL.revokeObjectURL(u);
        if (originalOut) originalOut.textContent = `${i.width}x${i.height}`;
        if (i.width < 1280 || i.height < 720) setWarning(ytkText.smallSource, 'warning');
        setStatus(ytkText.ready(i.width, i.height), 'success');
      };
      i.onerror = () => {
        URL.revokeObjectURL(u);
        file.setAttribute('aria-invalid', 'true');
        setStatus(ytkText.failed, 'error');
      };
      i.src = u;
    });

    [format, quality].forEach((el) => {
      el?.addEventListener('input', updateControls);
      el?.addEventListener('change', updateControls);
    });
    updateControls();

    run?.addEventListener('click', async () => {
      if (!img) {
        setStatus(ytkText.empty, 'error');
        file.focus();
        return;
      }
      resetOutputs();
      setStatus(ytkText.generating);
      run.disabled = true;
      const mime = format.value || 'image/webp';
      const q = Math.max(0.5, Math.min(1, Number(quality.value || 0.86)));
      const ext = mime === 'image/png' ? 'png' : (mime === 'image/jpeg' ? 'jpg' : 'webp');
      let totalBytes = 0;
      try {
        for (const t of targets) {
          const label = ytkText.labels[t.key] || t.key;

          const card = document.createElement('div');
          card.className = 'ytk-card';

          const canvas = document.createElement('canvas');
          canvas.width = t.w;
          canvas.height = t.h;
          const ctx = canvas.getContext('2d', { alpha: mime !== 'image/jpeg' });
          if (!ctx) throw new Error('canvas-context');
          drawFrame(ctx, img, t.w, t.h, fit.value || 'cover', bg.value || '#0f172a');
          const blob = await canvasToBlob(canvas, mime, q);
          if (!blob) continue;
          totalBytes += blob.size;
          const url = URL.createObjectURL(blob);
          objectUrls.push(url);

          const previewCanvas = document.createElement('canvas');
          const previewScale = Math.min(1, 520 / Math.max(t.w, t.h));
          previewCanvas.width = Math.max(1, Math.round(t.w * previewScale));
          previewCanvas.height = Math.max(1, Math.round(t.h * previewScale));
          const pctx = previewCanvas.getContext('2d');
          if (!pctx) throw new Error('preview-context');
          drawFrame(pctx, img, previewCanvas.width, previewCanvas.height, fit.value || 'cover', bg.value || '#0f172a');
          const previewUrl = previewCanvas.toDataURL('image/png');

          const link = document.createElement('a');
          link.className = 'open-link';
          link.textContent = ytkText.download(label);
          link.download = `${t.key}-${t.w}x${t.h}.${ext}`;
          link.href = url;

          const title = document.createElement('strong');
          title.textContent = `${label} (${t.w}x${t.h})`;

          const meta = document.createElement('span');
          meta.className = 'ytk-card-meta';
          meta.textContent = `${getFormatLabel()} · ${formatBytes(blob.size)}`;

          const preview = document.createElement('div');
          preview.className = 'ytk-preview';
          const previewImg = document.createElement('img');
          previewImg.className = 'ytk-preview-img';
          previewImg.src = previewUrl;
          previewImg.alt = ytkText.previewAlt(label);
          preview.appendChild(previewImg);

          card.appendChild(title);
          card.appendChild(meta);
          card.appendChild(preview);
          card.appendChild(link);
          wrap.appendChild(card);

          renders.push(link);
        }
      } catch (_) {
        resetOutputs();
        setStatus(ytkText.generateFailed, 'error');
        run.disabled = false;
        return;
      }
      if (countOut) countOut.textContent = formatNum(renders.length);
      if (totalOut) totalOut.textContent = formatBytes(totalBytes);
      if (allBtn) allBtn.disabled = renders.length === 0;
      run.disabled = false;
      setStatus(
        renders.length ? ytkText.done(renders.length, formatBytes(totalBytes), getFormatLabel()) : ytkText.emptyAfterGenerate,
        renders.length ? 'success' : 'error'
      );
    });

    allBtn?.addEventListener('click', async () => {
      if (!renders.length) {
        setStatus(ytkText.empty, 'error');
        return;
      }
      setStatus(ytkText.downloadAll(renders.length), 'success');
      for (const a of renders) {
        a.click();
        await new Promise((r) => setTimeout(r, 180));
      }
    });

    clearBtn?.addEventListener('click', () => {
      file.value = '';
      file.setAttribute('aria-invalid', 'false');
      img = null;
      resetOutputs();
      setWarning('');
      if (originalOut) originalOut.textContent = '-';
      setStatus(ytkText.cleared);
      file.focus();
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
    const formatSel = document.getElementById('iu-format');
    const quality = document.getElementById('iu-quality');
    const qualityLabel = document.getElementById('iu-quality-label');
    const canvas = document.getElementById('iu-canvas');
    const link = document.getElementById('iu-download');
    const result = document.getElementById('iu-result');
    const originalOut = document.getElementById('iu-original');
    const targetOut = document.getElementById('iu-target');
    const sizeOut = document.getElementById('iu-size');
    const modeOut = document.getElementById('iu-mode');
    if (!file || !scaleSel || !run || !canvas || !link || !result) return;

    const iuI18n = {
      ko: {
        ready: '이미지를 확인했습니다. 배율과 보정 옵션을 고른 뒤 실행하세요.',
        empty: 'PNG, JPEG, WebP 이미지를 먼저 선택해 주세요.',
        unsupported: '지원하는 이미지 형식은 PNG, JPEG, WebP입니다.',
        fileTooLarge: '파일 용량이 25MB를 넘습니다. 먼저 이미지 리사이저로 크기를 줄인 뒤 다시 시도해 주세요.',
        invalid: '이미지를 읽을 수 없습니다. 손상되지 않은 PNG, JPEG, WebP 파일인지 확인해 주세요.',
        tooLarge: (w, h) => `선택한 배율의 결과(${w}×${h})가 1,200만 화소를 넘습니다. 더 낮은 배율을 선택해 주세요.`,
        processing: '이미지를 보정하고 있습니다. 큰 이미지는 잠시 걸릴 수 있습니다.',
        failed: '이미지 처리에 실패했습니다. 더 작은 이미지나 낮은 배율로 다시 시도해 주세요.',
        done: (w, h, format) => `${w}×${h}px 보정이 끝났습니다. 미리보기를 확인하고 ${format} 파일을 다운로드하세요.`,
        mode1x: '1x 보정',
        modeUpscale: (scale) => `${scale}x 업스케일`,
        denoiseOn: '노이즈 감소',
        sharpOn: '선명도 보정',
        noFilter: '추가 보정 없음',
        formatNames: { 'image/png': 'PNG', 'image/webp': 'WebP', 'image/jpeg': 'JPEG' }
      },
      en: {
        ready: 'Image loaded. Choose a scale and enhancement options, then run.',
        empty: 'Choose a PNG, JPEG, or WebP image first.',
        unsupported: 'Supported image formats are PNG, JPEG, and WebP.',
        fileTooLarge: 'The file is larger than 25 MB. Resize it first, then try again.',
        invalid: 'This image could not be read. Check that it is a valid PNG, JPEG, or WebP file.',
        tooLarge: (w, h) => `The selected output (${w}×${h}) exceeds 12 megapixels. Choose a lower scale.`,
        processing: 'Enhancing the image. Large images may take a moment.',
        failed: 'Image processing failed. Try a smaller image or lower scale.',
        done: (w, h, format) => `${w}×${h}px enhancement complete. Review the preview and download the ${format} file.`,
        mode1x: '1x enhance',
        modeUpscale: (scale) => `${scale}x upscale`,
        denoiseOn: 'Denoise',
        sharpOn: 'Sharpen',
        noFilter: 'No extra filter',
        formatNames: { 'image/png': 'PNG', 'image/webp': 'WebP', 'image/jpeg': 'JPEG' }
      },
      ja: {
        ready: '画像を読み込みました。倍率と補正オプションを選んで実行してください。',
        empty: 'PNG、JPEG、WebP画像を選択してください。',
        unsupported: '対応形式はPNG、JPEG、WebPです。',
        fileTooLarge: 'ファイルが25MBを超えています。先にリサイズしてから再試行してください。',
        invalid: '画像を読み込めません。破損していないPNG、JPEG、WebPファイルか確認してください。',
        tooLarge: (w, h) => `選択した出力（${w}×${h}）は1,200万画素を超えます。低い倍率を選択してください。`,
        processing: '画像を補正しています。大きな画像は少し時間がかかります。',
        failed: '画像処理に失敗しました。小さい画像または低い倍率で再試行してください。',
        done: (w, h, format) => `${w}×${h}pxの補正が完了しました。プレビューを確認して${format}ファイルを保存できます。`,
        mode1x: '1x 補正',
        modeUpscale: (scale) => `${scale}x アップスケール`,
        denoiseOn: 'ノイズ低減',
        sharpOn: 'シャープ補正',
        noFilter: '追加補正なし',
        formatNames: { 'image/png': 'PNG', 'image/webp': 'WebP', 'image/jpeg': 'JPEG' }
      }
    };
    const iuText = iuI18n[pageLang] || iuI18n.ko;

    let img = null;
    let originBytes = 0;
    let outputUrl = '';
    const maxPixels = 12000000;
    const maxFileBytes = 25 * 1024 * 1024;
    const supportedTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
    const extensionFor = (type) => type === 'image/jpeg' ? 'jpg' : (type === 'image/png' ? 'png' : 'webp');
    const formatBytes = (bytes) => bytes < 1024 * 1024
      ? `${(bytes / 1024).toLocaleString(numberLocale, { maximumFractionDigits: 1 })} KB`
      : `${(bytes / 1024 / 1024).toLocaleString(numberLocale, { maximumFractionDigits: 1 })} MB`;
    const setStatus = (message, state = '') => {
      result.textContent = message;
      result.dataset.state = state;
    };
    const setDownload = (url = '') => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      outputUrl = url;
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', url ? 'false' : 'true');
      if (url) link.href = url;
    };
    const resetStats = () => {
      if (originalOut) originalOut.textContent = '-';
      if (targetOut) targetOut.textContent = '-';
      if (sizeOut) sizeOut.textContent = '-';
      if (modeOut) modeOut.textContent = '-';
    };
    const updateQualityLabel = () => {
      if (!qualityLabel || !quality) return;
      qualityLabel.textContent = `${Math.round(Number(quality.value || 0.86) * 100)}%`;
    };
    const modeText = () => {
      const scale = Number(scaleSel.value || 1);
      const filters = [denoise?.checked ? iuText.denoiseOn : '', sharp?.checked ? iuText.sharpOn : ''].filter(Boolean);
      return [scale === 1 ? iuText.mode1x : iuText.modeUpscale(scale), filters.join(' + ') || iuText.noFilter].join(' · ');
    };
    const updateTarget = () => {
      if (!img) return;
      const scale = Number(scaleSel.value || 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      if (targetOut) targetOut.textContent = `${formatNum(w)}×${formatNum(h)}px`;
      if (modeOut) modeOut.textContent = modeText();
      run.disabled = w * h > maxPixels;
      if (w * h > maxPixels) setStatus(iuText.tooLarge(formatNum(w), formatNum(h)), 'error');
      else if (!outputUrl) setStatus(iuText.ready);
    };

    file?.addEventListener('change', () => {
      const f = file.files?.[0];
      img = null;
      run.disabled = true;
      canvas.hidden = true;
      setDownload();
      resetStats();
      if (!f) {
        setStatus(iuText.empty);
        return;
      }
      if (!supportedTypes.has(f.type)) {
        file.setAttribute('aria-invalid', 'true');
        setStatus(iuText.unsupported, 'error');
        return;
      }
      if (f.size > maxFileBytes) {
        file.setAttribute('aria-invalid', 'true');
        setStatus(iuText.fileTooLarge, 'error');
        return;
      }
      file.setAttribute('aria-invalid', 'false');
      originBytes = f.size || 0;
      const u = URL.createObjectURL(f);
      const i = new Image();
      i.onload = () => {
        img = i;
        URL.revokeObjectURL(u);
        if (originalOut) originalOut.textContent = `${formatNum(i.width)}×${formatNum(i.height)}px · ${formatBytes(originBytes)}`;
        updateTarget();
      };
      i.onerror = () => {
        URL.revokeObjectURL(u);
        file.setAttribute('aria-invalid', 'true');
        setStatus(iuText.invalid, 'error');
      };
      i.src = u;
    });

    const applySharpen = (ctx, w, h) => {
      const src = ctx.getImageData(0, 0, w, h);
      const out = ctx.createImageData(w, h);
      const d = src.data;
      const o = out.data;
      o.set(d);
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
      o.set(d);
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

    updateQualityLabel();
    quality?.addEventListener('input', () => {
      updateQualityLabel();
      setDownload();
      if (sizeOut) sizeOut.textContent = '-';
      if (img && !outputUrl) setStatus(iuText.ready);
    });
    [scaleSel, sharp, denoise, formatSel].forEach((el) => el?.addEventListener('change', () => {
      setDownload();
      canvas.hidden = true;
      if (sizeOut) sizeOut.textContent = '-';
      updateTarget();
    }));

    run?.addEventListener('click', () => {
      if (!img) {
        setStatus(iuText.empty, 'error');
        return;
      }
      const scale = Number(scaleSel?.value || 2);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      if (w * h > maxPixels) {
        setStatus(iuText.tooLarge(formatNum(w), formatNum(h)), 'error');
        return;
      }
      run.disabled = true;
      setStatus(iuText.processing);
      setDownload();
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

      window.setTimeout(() => {
        try {
          ctx.drawImage(stepCanvas, 0, 0, cw, ch, 0, 0, w, h);
          if (denoise?.checked) applyDenoise(ctx, w, h);
          if (sharp?.checked) applySharpen(ctx, w, h);
          const mime = formatSel?.value || 'image/webp';
          const outputQuality = Number(quality?.value || 0.86);
          link.download = `upscaled-image.${extensionFor(mime)}`;
          canvas.toBlob((blob) => {
            run.disabled = false;
            if (!blob) {
              setStatus(iuText.failed, 'error');
              return;
            }
            setDownload(URL.createObjectURL(blob));
            canvas.hidden = false;
            if (sizeOut) sizeOut.textContent = formatBytes(blob.size);
            if (modeOut) modeOut.textContent = modeText();
            setStatus(iuText.done(formatNum(w), formatNum(h), iuText.formatNames[mime] || 'image'), 'success');
          }, mime, outputQuality);
        } catch (_) {
          run.disabled = false;
          setStatus(iuText.failed, 'error');
        }
      }, 20);
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
    const clearBtn = document.getElementById('pw-clear');
    const output = document.getElementById('pw-output');
    const strength = document.getElementById('pw-strength');
    const poolOut = document.getElementById('pw-pool');
    const combosOut = document.getElementById('pw-combos');
    const bitsOut = document.getElementById('pw-bits');
    const status = document.getElementById('pw-status');
    const help = document.getElementById('pw-help');

    if (!lenInput || !countInput || !upper || !lower || !number || !symbol || !runBtn || !copyAllBtn || !clearBtn || !output || !strength || !poolOut || !combosOut || !bitsOut || !status || !help) return;

    const pwI18n = {
      ko: {
        scoreLow: '낮음',
        scoreMedium: '보통',
        scoreStrong: '강함',
        scoreVeryStrong: '매우 강함',
        poolUnit: '자',
        ready: '옵션을 고르면 브라우저에서 안전한 랜덤 비밀번호를 생성합니다.',
        chooseType: '최소 1개 문자 유형을 선택해 주세요.',
        invalidLength: '길이는 4 이상 128 이하의 정수로 입력해 주세요.',
        invalidCount: '생성 개수는 1 이상 20 이하의 정수로 입력해 주세요.',
        cryptoUnavailable: '이 브라우저에서는 보안 난수 생성 API를 사용할 수 없습니다.',
        tooShort: (length, n) => `현재 길이(${length})로는 선택한 문자 유형 ${n}개를 모두 포함할 수 없습니다.`,
        preview: (pool, bits) => `문자풀 ${pool}자, 예상 엔트로피 ${bits} bit입니다.`,
        generatedAll: (length, count) => `길이 ${length}, ${count}개 생성 완료. 각 비밀번호는 선택한 모든 문자 유형을 최소 1개 이상 포함합니다.`,
        generatedPartial: (size, count) => `중복 없는 비밀번호 ${size}개를 생성했습니다. (요청 ${count}개, 문자풀/길이 조합 제한)`,
        copied: '복사됨',
        copyDefault: '전체 복사',
        copyEmpty: '복사할 비밀번호가 없습니다.',
        copyFail: '자동 복사를 사용할 수 없습니다.',
        cleared: '생성 결과를 지웠습니다.'
      },
      en: {
        scoreLow: 'Low',
        scoreMedium: 'Medium',
        scoreStrong: 'Strong',
        scoreVeryStrong: 'Very strong',
        poolUnit: 'chars',
        ready: 'Choose options and generate secure random passwords in your browser.',
        chooseType: 'Select at least one character type.',
        invalidLength: 'Enter a whole-number length from 4 to 128.',
        invalidCount: 'Enter a whole-number count from 1 to 20.',
        cryptoUnavailable: 'This browser does not provide a secure random generator API.',
        tooShort: (length, n) => `Current length (${length}) cannot include all ${n} selected character types.`,
        preview: (pool, bits) => `Pool size is ${pool} characters with about ${bits} bits of entropy.`,
        generatedAll: (length, count) => `Generated ${count} password(s) at length ${length}. Each password includes every selected character type at least once.`,
        generatedPartial: (size, count) => `Generated ${size} unique password(s). (Requested: ${count}; limited by pool/length combination)`,
        copied: 'Copied',
        copyDefault: 'Copy all',
        copyEmpty: 'There are no generated passwords to copy.',
        copyFail: 'Automatic copy is unavailable.',
        cleared: 'Cleared the generated passwords.'
      },
      ja: {
        scoreLow: '低い',
        scoreMedium: '普通',
        scoreStrong: '強い',
        scoreVeryStrong: '非常に強い',
        poolUnit: '文字',
        ready: 'オプションを選ぶと、ブラウザ内で安全なランダムパスワードを生成できます。',
        chooseType: '文字種を1つ以上選択してください。',
        invalidLength: '長さは4〜128の整数で入力してください。',
        invalidCount: '生成数は1〜20の整数で入力してください。',
        cryptoUnavailable: 'このブラウザでは安全な乱数生成APIを利用できません。',
        tooShort: (length, n) => `現在の長さ（${length}）では、選択した${n}種類すべてを含められません。`,
        preview: (pool, bits) => `文字プールは${pool}文字、推定エントロピーは${bits} bitです。`,
        generatedAll: (length, count) => `長さ${length}で${count}件生成しました。各パスワードは選択した文字種をすべて最低1文字含みます。`,
        generatedPartial: (size, count) => `重複なしパスワードを${size}件生成しました。（要求${count}件、文字プール/長さの組み合わせ制限）`,
        copied: 'コピー完了',
        copyDefault: 'すべてコピー',
        copyEmpty: 'コピーできるパスワードがありません。',
        copyFail: '自動コピーを利用できません。',
        cleared: '生成結果をクリアしました。'
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

    const canUseCrypto = Boolean(window.crypto && window.crypto.getRandomValues);
    const setStatus = (message, state = '') => {
      status.textContent = message;
      status.dataset.state = state;
    };

    const pick = (str) => {
      if (!canUseCrypto || !str.length) return '';
      const arr = new Uint32Array(1);
      const max = Math.floor(0x100000000 / str.length) * str.length;
      do {
        crypto.getRandomValues(arr);
      } while (arr[0] >= max);
      return str[arr[0] % str.length];
    };

    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const rand = new Uint32Array(1);
        window.crypto.getRandomValues(rand);
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

    const parseBoundedInt = (input, min, max) => {
      const raw = input.value.trim();
      const value = Number(raw);
      if (!raw || !Number.isInteger(value) || value < min || value > max) {
        input.setAttribute('aria-invalid', 'true');
        return null;
      }
      input.setAttribute('aria-invalid', 'false');
      return value;
    };

    const clearResult = () => {
      output.value = '';
      copyAllBtn.disabled = true;
    };

    const generate = () => {
      const length = parseBoundedInt(lenInput, 4, 128);
      const count = parseBoundedInt(countInput, 1, 20);
      if (length === null) {
        clearResult();
        renderStats(0, 0);
        setStatus(pwText.invalidLength, 'error');
        lenInput.focus();
        return;
      }
      if (count === null) {
        clearResult();
        renderStats(0, 0);
        setStatus(pwText.invalidCount, 'error');
        countInput.focus();
        return;
      }

      if (!canUseCrypto) {
        clearResult();
        renderStats(0, 0);
        setStatus(pwText.cryptoUnavailable, 'error');
        return;
      }

      const { normalized, pool } = buildSet();
      if (!normalized.length || !pool.length) {
        clearResult();
        renderStats(0, length);
        setStatus(pwText.chooseType, 'error');
        return;
      }

      if (length < normalized.length) {
        clearResult();
        renderStats(pool.length, length);
        setStatus(pwText.tooShort(length, normalized.length), 'error');
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
      copyAllBtn.disabled = !list.length;
      if (list.length === count) {
        setStatus(pwText.generatedAll(length, count), 'success');
      } else {
        setStatus(pwText.generatedPartial(list.length, count), 'warning');
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

    const previewStats = () => {
      const length = parseBoundedInt(lenInput, 4, 128);
      const count = parseBoundedInt(countInput, 1, 20);
      const { pool } = buildSet();
      clearResult();
      if (length === null) {
        renderStats(0, 0);
        setStatus(pwText.invalidLength, 'error');
        return;
      }
      if (count === null) {
        renderStats(0, 0);
        setStatus(pwText.invalidCount, 'error');
        return;
      }
      if (!pool.length) {
        renderStats(0, length);
        setStatus(pwText.chooseType, 'error');
        return;
      }
      const bits = length * Math.log2(pool.length);
      renderStats(pool.length, length);
      setStatus(pwText.preview(pool.length.toLocaleString(numberLocale), bits.toLocaleString(numberLocale, { maximumFractionDigits: 1 })));
    };

    runBtn.addEventListener('click', generate);
    [lenInput, countInput].forEach((el) => el.addEventListener('input', previewStats));
    [upper, lower, number, symbol, excludeSimilar].forEach((el) => el.addEventListener('change', previewStats));

    copyAllBtn.addEventListener('click', async () => {
      if (!output.value.trim()) {
        setStatus(pwText.copyEmpty, 'error');
        return;
      }
      try {
        await copyText(output.value.trim());
        const old = copyAllBtn.textContent;
        copyAllBtn.textContent = pwText.copied;
        setStatus(pwText.copied, 'success');
        setTimeout(() => { copyAllBtn.textContent = old || pwText.copyDefault; }, 900);
      } catch (_) {
        setStatus(pwText.copyFail, 'error');
      }
    });

    clearBtn.addEventListener('click', () => {
      clearResult();
      setStatus(pwText.cleared);
      output.focus();
    });

    generate();
  }

  if (slug === 'korean-spelling-practice') {
    const category = document.getElementById('ksp-category');
    const count = document.getElementById('ksp-count');
    const startBtn = document.getElementById('ksp-start');
    const nextBtn = document.getElementById('ksp-next');
    const resetBtn = document.getElementById('ksp-reset');
    const optionA = document.getElementById('ksp-option-a');
    const optionB = document.getElementById('ksp-option-b');
    const question = document.getElementById('ksp-question');
    const feedback = document.getElementById('ksp-feedback');
    const missed = document.getElementById('ksp-missed');
    const totalOut = document.getElementById('ksp-total');
    const currentOut = document.getElementById('ksp-current');
    const correctOut = document.getElementById('ksp-correct');
    const wrongOut = document.getElementById('ksp-wrong');
    const accuracyOut = document.getElementById('ksp-accuracy');

    if (!category || !count || !startBtn || !nextBtn || !resetBtn || !optionA || !optionB || !question || !feedback || !missed) return;

    const bank = [
      { category: 'daily', prompt: '올바른 표현을 고르세요.', options: ['웬일', '왠일'], answer: 0, explain: '`웬`은 어찌 된, 어떤의 뜻으로 쓰여 `웬일`이 맞습니다.' },
      { category: 'daily', prompt: '올바른 표현을 고르세요.', options: ['며칠', '몇일'], answer: 0, explain: '`며칠`이 표준어입니다.' },
      { category: 'daily', prompt: '올바른 표현을 고르세요.', options: ['금세', '금새'], answer: 0, explain: '`금세`가 맞는 표기입니다.' },
      { category: 'daily', prompt: '문장에 맞는 표현을 고르세요. “시간이 없어서 숙제를 ___.”', options: ['안 했다', '않 했다'], answer: 0, explain: '부정 표현 `안`과 동사 `했다`가 결합한 형태라 `안 했다`가 자연스럽습니다.' },
      { category: 'daily', prompt: '문장에 맞는 표현을 고르세요. “어제는 정말 ___ 바빴다.”', options: ['어찌나', '어찌나나'], answer: 0, explain: '`어찌나`가 맞고 `어찌나나`는 잘못된 중복 표현입니다.' },
      { category: 'daily', prompt: '올바른 표현을 고르세요.', options: ['어떡해', '어떻게'], answer: 1, explain: '방법을 묻는 말은 `어떻게`, 감탄이나 난감함은 문맥에 따라 `어떡해`가 쓰입니다. 단독 기본형 학습에서는 `어떻게`를 먼저 구분하는 것이 좋습니다.' },
      { category: 'daily', prompt: '문장에 맞는 표현을 고르세요. “비가 와서 밖에 나가면 ___.”', options: ['안 된다', '안된다'], answer: 0, explain: '부정 부사 `안`과 용언 `된다`는 띄어 써 `안 된다`가 맞습니다.' },
      { category: 'daily', prompt: '올바른 표현을 고르세요.', options: ['되레', '도리어'], answer: 0, explain: '둘 다 쓰지만 자주 헷갈리는 표준 표현으로는 `되레`가 자연스럽습니다.' },
      { category: 'work', prompt: '업무 문장에 맞는 표현을 고르세요. “자료 ___ 부탁드립니다.”', options: ['검토 부탁드립니다', '검토부탁드립니다'], answer: 0, explain: '명사와 서술 구성이 이어질 때는 띄어 쓰는 것이 기본입니다.' },
      { category: 'work', prompt: '업무 문장에 맞는 표현을 고르세요. “확인해 ___.”', options: ['주세요', '주십시요'], answer: 0, explain: '`주세요`가 맞고 `주십시요`는 잘못된 표기입니다.' },
      { category: 'work', prompt: '업무 문장에 맞는 표현을 고르세요. “현재 검토 ___.”', options: ['중입니다', '중 입니다'], answer: 0, explain: '`중입니다`처럼 붙여 쓰는 것이 자연스럽습니다.' },
      { category: 'work', prompt: '업무 문장에 맞는 표현을 고르세요. “첨부파일을 ___.”', options: ['확인 부탁드립니다', '확인부탁드립니다'], answer: 0, explain: '`확인 부탁드립니다`처럼 띄어 쓰는 형태가 맞습니다.' },
      { category: 'work', prompt: '업무 문장에 맞는 표현을 고르세요. “일정은 내일까지 ___.”', options: ['공유해 주세요', '공유해주세요'], answer: 0, explain: '보조 용언 구성으로 보아 `공유해 주세요`처럼 띄어 쓰는 연습이 안전합니다.' },
      { category: 'work', prompt: '업무 문장에 맞는 표현을 고르세요. “확인 후 다시 ___.”', options: ['연락드리겠습니다', '연락 드리겠습니다'], answer: 0, explain: '실무 문장에서는 `연락드리겠습니다`처럼 붙여 쓰는 표현이 널리 쓰입니다.' }
    ];

    let quiz = [];
    let index = 0;
    let correct = 0;
    let wrong = 0;
    let answered = false;
    let wrongNotes = [];

    const shuffle = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const setButtonsDisabled = (value) => {
      optionA.disabled = value;
      optionB.disabled = value;
    };

    const renderStats = () => {
      totalOut.textContent = quiz.length;
      currentOut.textContent = quiz.length ? Math.min(index + 1, quiz.length) : 0;
      correctOut.textContent = correct;
      wrongOut.textContent = wrong;
      const done = correct + wrong;
      accuracyOut.textContent = done ? `${Math.round((correct / done) * 100)}%` : '-';
    };

    const renderMissed = () => {
      if (!wrongNotes.length) {
        missed.innerHTML = '<p class="tool-result">오답이 없으면 여기에 복습 목록이 표시되지 않습니다.</p>';
        return;
      }
      missed.innerHTML = wrongNotes.map((item) => `
        <div class="tool-card">
          <strong>${item.question}</strong>
          <p class="tool-result">내 선택: ${item.picked}</p>
          <p class="tool-result">정답: ${item.answer}</p>
          <p class="tool-result">해설: ${item.explain}</p>
        </div>
      `).join('');
    };

    const renderQuestion = () => {
      renderStats();
      if (!quiz.length) {
        question.textContent = '연습 시작을 누르면 문제가 나옵니다.';
        optionA.textContent = '보기 A';
        optionB.textContent = '보기 B';
        feedback.textContent = '자주 헷갈리는 맞춤법과 띄어쓰기를 짧은 2지선다 퀴즈로 복습해보세요.';
        setButtonsDisabled(true);
        return;
      }

      if (index >= quiz.length) {
        question.textContent = '연습이 끝났습니다.';
        optionA.textContent = '완료';
        optionB.textContent = '완료';
        feedback.textContent = `총 ${quiz.length}문제 중 ${correct}문제 정답입니다. 틀린 문제는 아래에서 다시 볼 수 있습니다.`;
        setButtonsDisabled(true);
        renderMissed();
        currentOut.textContent = quiz.length;
        return;
      }

      const item = quiz[index];
      question.textContent = `${index + 1}. ${item.prompt}`;
      optionA.textContent = item.options[0];
      optionB.textContent = item.options[1];
      feedback.textContent = '보기 중 하나를 선택하면 바로 해설이 표시됩니다.';
      answered = false;
      setButtonsDisabled(false);
      missed.innerHTML = '<p class="tool-result">문제를 풀면 오답 복습 목록이 여기에 쌓입니다.</p>';
    };

    const answer = (picked) => {
      if (answered || index >= quiz.length) return;
      answered = true;
      const item = quiz[index];
      const isCorrect = picked === item.answer;
      if (isCorrect) {
        correct += 1;
        feedback.textContent = `정답! ${item.explain}`;
      } else {
        wrong += 1;
        feedback.textContent = `오답입니다. 정답은 “${item.options[item.answer]}”입니다. ${item.explain}`;
        wrongNotes.push({
          question: item.prompt,
          picked: item.options[picked],
          answer: item.options[item.answer],
          explain: item.explain
        });
      }
      renderStats();
      setButtonsDisabled(true);
      renderMissed();
    };

    const start = () => {
      const selectedCategory = category.value || 'all';
      const selectedCount = Number(count.value || 8);
      const pool = selectedCategory === 'all' ? bank : bank.filter((item) => item.category === selectedCategory);
      quiz = shuffle(pool).slice(0, Math.min(selectedCount, pool.length));
      index = 0;
      correct = 0;
      wrong = 0;
      wrongNotes = [];
      answered = false;
      renderQuestion();
    };

    optionA.addEventListener('click', () => answer(0));
    optionB.addEventListener('click', () => answer(1));
    startBtn.addEventListener('click', start);
    nextBtn.addEventListener('click', () => {
      if (!quiz.length) {
        start();
        return;
      }
      if (index < quiz.length) index += 1;
      renderQuestion();
    });
    resetBtn.addEventListener('click', () => {
      quiz = [];
      index = 0;
      correct = 0;
      wrong = 0;
      wrongNotes = [];
      answered = false;
      renderQuestion();
      renderMissed();
    });

    renderQuestion();
    renderMissed();
  }

  if (slug === 'workplace-honorific-practice') {
    const category = document.getElementById('whp-category');
    const count = document.getElementById('whp-count');
    const startBtn = document.getElementById('whp-start');
    const nextBtn = document.getElementById('whp-next');
    const resetBtn = document.getElementById('whp-reset');
    const optionA = document.getElementById('whp-option-a');
    const optionB = document.getElementById('whp-option-b');
    const question = document.getElementById('whp-question');
    const feedback = document.getElementById('whp-feedback');
    const missed = document.getElementById('whp-missed');
    const totalOut = document.getElementById('whp-total');
    const currentOut = document.getElementById('whp-current');
    const correctOut = document.getElementById('whp-correct');
    const wrongOut = document.getElementById('whp-wrong');
    const accuracyOut = document.getElementById('whp-accuracy');

    if (!category || !count || !startBtn || !nextBtn || !resetBtn || !optionA || !optionB || !question || !feedback || !missed) return;

    const bank = [
      { category: 'messenger', situation: '메신저', prompt: '팀장에게 빠른 확인을 부탁할 때 더 자연스러운 표현은?', options: ['확인 부탁드립니다.', '확인 바랍니다.'], answer: 0, explain: '`확인 부탁드립니다`가 메신저에서 더 부드럽고 협업형으로 들립니다. `확인 바랍니다`는 문맥에 따라 다소 딱딱하거나 일방적으로 느껴질 수 있습니다.' },
      { category: 'messenger', situation: '메신저', prompt: '자료 전달 후 한마디로 더 무난한 표현은?', options: ['자료 공유드립니다.', '자료 송부드리오니 확인 바랍니다.'], answer: 0, explain: '메신저에서는 짧고 명확한 표현이 더 자연스럽습니다. 두 번째 문장은 메일 문체에 가깝고 다소 무겁습니다.' },
      { category: 'messenger', situation: '메신저', prompt: '상대가 늦은 답장을 했을 때 더 부담이 적은 표현은?', options: ['확인해주셔서 감사합니다.', '답변이 늦으셨네요.'], answer: 0, explain: '감사 표현이 관계를 부드럽게 유지합니다. 늦음을 직접 지적하는 문장은 불필요하게 날카롭게 들릴 수 있습니다.' },
      { category: 'email', situation: '이메일', prompt: '메일 첫 문장으로 더 자연스러운 표현은?', options: ['안녕하세요. 요청 주신 내용 정리해 전달드립니다.', '안녕하십니까. 요청하신 바를 하기와 같이 송부하오니 검토 바랍니다.'], answer: 0, explain: '지나치게 관료적인 문체보다 자연스럽고 명확한 문장이 읽기 부담이 적습니다.' },
      { category: 'email', situation: '이메일', prompt: '회신 요청 문장으로 더 부드러운 표현은?', options: ['가능 여부를 알려주시면 일정 조정에 도움이 됩니다.', '가능 여부를 빠르게 회신 바랍니다.'], answer: 0, explain: '왜 회신이 필요한지 맥락을 주면 요청 강도가 낮아지고 협조를 얻기 쉬워집니다.' },
      { category: 'email', situation: '이메일', prompt: '첨부파일 안내 문장으로 더 자연스러운 표현은?', options: ['관련 파일을 첨부드립니다.', '관련 파일을 첨부하였사오니 참조 부탁드립니다.'], answer: 0, explain: '짧고 분명한 표현이 현재 업무 메일 톤에 더 잘 맞습니다. 두 번째 문장은 너무 무거운 느낌을 줄 수 있습니다.' },
      { category: 'schedule', situation: '일정 조율', prompt: '일정 변경을 부탁할 때 더 부담이 덜한 표현은?', options: ['혹시 가능하시다면 시간을 조금 조정할 수 있을까요?', '시간 변경 부탁드립니다.'], answer: 0, explain: '정중한 완충 표현이 들어가면 상대가 선택권을 가진 느낌을 받아 부담이 줄어듭니다.' },
      { category: 'schedule', situation: '일정 조율', prompt: '회의 시간 후보를 보낼 때 더 자연스러운 표현은?', options: ['가능하신 시간을 알려주시면 그에 맞춰 조정하겠습니다.', '가능 시간 회신 바랍니다.'], answer: 0, explain: '조정 의사를 함께 밝히면 일방 지시처럼 들리지 않고 협업 톤이 살아납니다.' },
      { category: 'schedule', situation: '일정 조율', prompt: '늦을 가능성을 알릴 때 더 좋은 표현은?', options: ['도착이 10분 정도 늦어질 것 같아 먼저 양해 부탁드립니다.', '10분 늦습니다.'], answer: 0, explain: '지연 안내 자체보다도 먼저 양해를 구하는 구조가 더 공손합니다.' },
      { category: 'messenger', situation: '메신저', prompt: '추가 검토를 부탁할 때 더 자연스러운 표현은?', options: ['한 번 더 봐주실 수 있을까요?', '다시 검토해주세요.'], answer: 0, explain: '부탁형 의문문이 메신저 협업 상황에서 더 부드럽게 들립니다.' },
      { category: 'email', situation: '이메일', prompt: '메일 마무리로 더 무난한 표현은?', options: ['확인 후 편하실 때 회신 부탁드립니다. 감사합니다.', '검토 후 회답 바랍니다.'], answer: 0, explain: '끝맺음이 부드럽고, 상대의 시간을 존중하는 뉘앙스가 있습니다.' },
      { category: 'schedule', situation: '일정 조율', prompt: '면접 일정 회신으로 더 자연스러운 표현은?', options: ['안내 주신 시간 중 화요일 오후 2시가 가능합니다.', '화요일 오후 2시로 하겠습니다.'], answer: 0, explain: '확정 전 단계에서는 가능 여부를 공손하게 밝히는 표현이 더 안전합니다.' }
    ];

    let quiz = [];
    let index = 0;
    let correct = 0;
    let wrong = 0;
    let answered = false;
    let wrongNotes = [];

    const shuffle = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const setButtonsDisabled = (value) => {
      optionA.disabled = value;
      optionB.disabled = value;
    };

    const renderStats = () => {
      totalOut.textContent = quiz.length;
      currentOut.textContent = quiz.length ? Math.min(index + 1, quiz.length) : 0;
      correctOut.textContent = correct;
      wrongOut.textContent = wrong;
      const done = correct + wrong;
      accuracyOut.textContent = done ? `${Math.round((correct / done) * 100)}%` : '-';
    };

    const renderMissed = () => {
      if (!wrongNotes.length) {
        missed.innerHTML = '<p class="tool-result">오답이 생기면 상황별 복습 목록이 여기에 쌓입니다.</p>';
        return;
      }
      missed.innerHTML = wrongNotes.map((item) => `
        <div class="tool-card">
          <strong>[${item.situation}] ${item.question}</strong>
          <p class="tool-result">내 선택: ${item.picked}</p>
          <p class="tool-result">정답: ${item.answer}</p>
          <p class="tool-result">해설: ${item.explain}</p>
        </div>
      `).join('');
    };

    const renderQuestion = () => {
      renderStats();
      if (!quiz.length) {
        question.textContent = '연습 시작을 누르면 상황 문제가 나옵니다.';
        optionA.textContent = '보기 A';
        optionB.textContent = '보기 B';
        feedback.textContent = '더 자연스럽고 부담이 덜한 표현을 고르며 업무용 높임말 감각을 익혀보세요.';
        setButtonsDisabled(true);
        return;
      }

      if (index >= quiz.length) {
        question.textContent = '연습이 끝났습니다.';
        optionA.textContent = '완료';
        optionB.textContent = '완료';
        feedback.textContent = `총 ${quiz.length}문제 중 ${correct}문제 정답입니다. 틀린 표현은 아래에서 다시 볼 수 있습니다.`;
        setButtonsDisabled(true);
        renderMissed();
        currentOut.textContent = quiz.length;
        return;
      }

      const item = quiz[index];
      question.textContent = `${index + 1}. [${item.situation}] ${item.prompt}`;
      optionA.textContent = item.options[0];
      optionB.textContent = item.options[1];
      feedback.textContent = '두 표현 중 더 자연스러운 높임말을 골라보세요.';
      answered = false;
      setButtonsDisabled(false);
    };

    const answer = (picked) => {
      if (answered || index >= quiz.length) return;
      answered = true;
      const item = quiz[index];
      const isCorrect = picked === item.answer;
      if (isCorrect) {
        correct += 1;
        feedback.textContent = `정답! ${item.explain}`;
      } else {
        wrong += 1;
        feedback.textContent = `오답입니다. 더 자연스러운 표현은 “${item.options[item.answer]}”입니다. ${item.explain}`;
        wrongNotes.push({
          situation: item.situation,
          question: item.prompt,
          picked: item.options[picked],
          answer: item.options[item.answer],
          explain: item.explain
        });
      }
      renderStats();
      setButtonsDisabled(true);
      renderMissed();
    };

    const start = () => {
      const selectedCategory = category.value || 'all';
      const selectedCount = Number(count.value || 8);
      const pool = selectedCategory === 'all' ? bank : bank.filter((item) => item.category === selectedCategory);
      quiz = shuffle(pool).slice(0, Math.min(selectedCount, pool.length));
      index = 0;
      correct = 0;
      wrong = 0;
      wrongNotes = [];
      answered = false;
      renderQuestion();
      renderMissed();
    };

    optionA.addEventListener('click', () => answer(0));
    optionB.addEventListener('click', () => answer(1));
    startBtn.addEventListener('click', start);
    nextBtn.addEventListener('click', () => {
      if (!quiz.length) {
        start();
        return;
      }
      if (index < quiz.length) index += 1;
      renderQuestion();
    });
    resetBtn.addEventListener('click', () => {
      quiz = [];
      index = 0;
      correct = 0;
      wrong = 0;
      wrongNotes = [];
      answered = false;
      renderQuestion();
      renderMissed();
    });

    renderQuestion();
    renderMissed();
  }

  if (slug === 'date-format-normalizer') {
    const input = document.getElementById('dfn-input');
    const format = document.getElementById('dfn-format');
    const slashOrder = document.getElementById('dfn-slash-order');
    const extract = document.getElementById('dfn-extract');
    const keepInvalid = document.getElementById('dfn-keep-invalid');
    const sampleBtn = document.getElementById('dfn-sample');
    const copyBtn = document.getElementById('dfn-copy');
    const clearBtn = document.getElementById('dfn-clear');
    const output = document.getElementById('dfn-output');
    const linesOut = document.getElementById('dfn-lines');
    const convertedOut = document.getElementById('dfn-converted');
    const ambiguousOut = document.getElementById('dfn-ambiguous');
    const formatOut = document.getElementById('dfn-format-out');
    const summary = document.getElementById('dfn-summary');
    const warningList = document.getElementById('dfn-warning-list');

    if (!input || !format || !slashOrder || !extract || !keepInvalid || !output || !linesOut || !convertedOut || !ambiguousOut || !formatOut || !summary) return;

    const dfnText = {
      ko: {
        empty: '날짜가 섞인 텍스트를 넣으면 통일된 형식으로 정리합니다.',
        converted: (count, ambiguous) => `총 ${formatNum(count)}개의 날짜 표현을 정리했고, 그중 ${formatNum(ambiguous)}개는 월/일 해석에 주의가 필요해요.`,
        none: '인식 가능한 날짜를 찾지 못했어요. yyyy-mm-dd, yyyy년 m월 d일, May 4, 2026 같은 형식을 써보세요.',
        copied: '복사됨',
        copyEmpty: '복사할 결과가 아직 없습니다.',
        warningsTitle: '확인할 날짜',
        invalidDropped: (count) => `${formatNum(count)}개 줄은 해석되지 않아 결과에서 제외했어요.`,
        yearRange: '연도는 1000~9999 범위만 변환합니다.',
        formatNames: { iso: 'YYYY-MM-DD', dot: 'YYYY. M. D.', slash: 'YYYY/MM/DD', korean: 'YYYY년 M월 D일 (요일)' },
        sample: [
          '공지 초안: 2026.5.4 업데이트',
          '제출일 2026년 5월 6일',
          '영문 표기: May 8, 2026',
          '압축 입력: 20260509',
          '해외 문서: 05/10/2026'
        ]
      },
      en: {
        empty: 'Paste mixed date text to normalize it into one format.',
        converted: (count, ambiguous) => `Normalized ${formatNum(count)} date expressions. ${formatNum(ambiguous)} slash-date item(s) need review.`,
        none: 'No recognizable dates found. Try formats like yyyy-mm-dd, May 4, 2026, or 20260504.',
        copied: 'Copied',
        copyEmpty: 'There is no result to copy yet.',
        warningsTitle: 'Dates to review',
        invalidDropped: (count) => `${formatNum(count)} unparsed line(s) were omitted from the result.`,
        yearRange: 'Only years from 1000 to 9999 are converted.',
        formatNames: { iso: 'YYYY-MM-DD', dot: 'YYYY. M. D.', slash: 'YYYY/MM/DD', korean: 'YYYY년 M월 D일 (weekday)' },
        sample: [
          'Announcement draft: 2026.5.4 update',
          'Due date: May 8, 2026',
          'Compact input: 20260509',
          'EU note: 10/05/2026',
          'US note: 05/10/2026'
        ]
      },
      ja: {
        empty: '混在した日付テキストを貼り付けると、1つの形式に整えます。',
        converted: (count, ambiguous) => `${formatNum(count)}件の日付表記を整理しました。${formatNum(ambiguous)}件は月/日の解釈に注意が必要です。`,
        none: '認識できる日付が見つかりません。yyyy-mm-dd、May 4, 2026、20260504 などを試してください。',
        copied: 'コピー済み',
        copyEmpty: 'コピーできる結果がまだありません。',
        warningsTitle: '確認が必要な日付',
        invalidDropped: (count) => `${formatNum(count)}行は解釈できなかったため結果から除外しました。`,
        yearRange: '年は1000〜9999の範囲のみ変換します。',
        formatNames: { iso: 'YYYY-MM-DD', dot: 'YYYY. M. D.', slash: 'YYYY/MM/DD', korean: 'YYYY年 M月 D日 (曜日)' },
        sample: [
          'お知らせ下書き: 2026.5.4 更新',
          '提出日: May 8, 2026',
          '短縮入力: 20260509',
          '海外メモ: 10/05/2026',
          'US表記: 05/10/2026'
        ]
      }
    }[pageLang] || {};

    const monthMap = {
      january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4,
      may: 5, june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8,
      september: 9, sept: 9, sep: 9, october: 10, oct: 10, november: 11, nov: 11, december: 12, dec: 12
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

    const pad = (n) => String(n).padStart(2, '0');
    const weekdayByLang = {
      ko: ['일', '월', '화', '수', '목', '금', '토'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      ja: ['日', '月', '火', '水', '木', '金', '土']
    };
    const weekday = weekdayByLang[pageLang] || weekdayByLang.ko;

    const makeDate = (y, m, d) => {
      const year = Number(y), month = Number(m), day = Number(d);
      if (!year || !month || !day) return null;
      if (year < 1000 || year > 9999) return null;
      const dt = new Date(year, month - 1, day);
      if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return null;
      return dt;
    };

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const mode = format.value || 'iso';
      if (mode === 'dot') return `${y}. ${m}. ${d}.`;
      if (mode === 'slash') return `${y}/${pad(m)}/${pad(d)}`;
      if (mode === 'korean') {
        if (pageLang === 'en') return `${y}. ${m}. ${d}. (${weekday[date.getDay()]})`;
        if (pageLang === 'ja') return `${y}年 ${m}月 ${d}日 (${weekday[date.getDay()]})`;
        return `${y}년 ${m}월 ${d}일 (${weekday[date.getDay()]})`;
      }
      return `${y}-${pad(m)}-${pad(d)}`;
    };

    const parseCandidate = (text) => {
      const raw = (text || '').trim();
      if (!raw) return { date: null, ambiguous: false, token: raw };

      let match = raw.match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})\.?$/);
      if (match) return { date: makeDate(match[1], match[2], match[3]), ambiguous: false, token: raw };

      match = raw.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
      if (match) return { date: makeDate(match[1], match[2], match[3]), ambiguous: false, token: raw };

      match = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
      if (match) return { date: makeDate(match[1], match[2], match[3]), ambiguous: false, token: raw };

      match = raw.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
      if (match) return { date: makeDate(match[3], monthMap[match[1].toLowerCase()], match[2]), ambiguous: false, token: raw };

      match = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
      if (match) return { date: makeDate(match[3], monthMap[match[2].toLowerCase()], match[1]), ambiguous: false, token: raw };

      match = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
      if (match) {
        const a = Number(match[1]);
        const b = Number(match[2]);
        const order = slashOrder.value || 'mdy';
        const month = order === 'mdy' ? a : b;
        const day = order === 'mdy' ? b : a;
        const ambiguous = a <= 12 && b <= 12;
        return { date: makeDate(match[3], month, day), ambiguous, token: raw };
      }

      return { date: null, ambiguous: false, token: raw };
    };

    const replaceInlineDates = (line) => {
      const patterns = [
        /(\d{4}[.\/-]\d{1,2}[.\/-]\d{1,2}\.?)/g,
        /(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)/g,
        /(\d{8})(?!\d)/g,
        /([A-Za-z]+\s+\d{1,2},\s*\d{4})/g,
        /(\d{1,2}\s+[A-Za-z]+\s+\d{4})/g,
        /(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/g
      ];

      let converted = 0;
      let ambiguous = 0;
      let out = line;
      const warnings = [];

      patterns.forEach((pattern) => {
        out = out.replace(pattern, (token) => {
          const parsed = parseCandidate(token);
          if (!parsed.date) return token;
          converted += 1;
          if (parsed.ambiguous) {
            ambiguous += 1;
            warnings.push(token);
          }
          return formatDate(parsed.date);
        });
      });

      return { text: out, converted, ambiguous, warnings };
    };

    const renderWarnings = (items, dropped) => {
      if (!warningList) return;
      const warnings = [...new Set(items)].slice(0, 8);
      const parts = [];
      if (warnings.length) {
        parts.push(`<p><strong>${dfnText.warningsTitle || 'Dates to review'}</strong>: ${warnings.map((item) => `<code>${item}</code>`).join(' ')}</p>`);
      }
      if (dropped > 0) {
        parts.push(`<p>${dfnText.invalidDropped ? dfnText.invalidDropped(dropped) : `${dropped} unparsed line(s) omitted.`}</p>`);
      }
      warningList.innerHTML = parts.join('');
    };

    const render = () => {
      if (!input.value.trim()) {
        output.value = '';
        linesOut.textContent = '0';
        convertedOut.textContent = '0';
        ambiguousOut.textContent = '0';
        formatOut.textContent = (dfnText.formatNames && dfnText.formatNames[format.value]) || format.options[format.selectedIndex]?.text || '-';
        summary.textContent = dfnText.empty || 'Paste mixed date text to normalize it into one format.';
        renderWarnings([], 0);
        return;
      }

      const rows = input.value.split('\n');
      let converted = 0;
      let ambiguous = 0;
      let dropped = 0;
      const warnings = [];

      const result = rows.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';

        if (extract.checked) {
          const inline = replaceInlineDates(line);
          converted += inline.converted;
          ambiguous += inline.ambiguous;
          warnings.push(...inline.warnings);
          if (inline.converted > 0) return inline.text;
        }

        const parsed = parseCandidate(trimmed);
        if (parsed.date) {
          converted += 1;
          if (parsed.ambiguous) {
            ambiguous += 1;
            warnings.push(parsed.token || trimmed);
          }
          return formatDate(parsed.date);
        }

        if (!keepInvalid.checked) dropped += 1;
        return keepInvalid.checked ? line : '';
      });

      output.value = result.filter((line, index) => line !== '' || rows[index].trim() !== '').join('\n');
      linesOut.textContent = formatNum(rows.filter((line) => line.trim()).length);
      convertedOut.textContent = formatNum(converted);
      ambiguousOut.textContent = formatNum(ambiguous);
      formatOut.textContent = (dfnText.formatNames && dfnText.formatNames[format.value]) || format.options[format.selectedIndex]?.text || '-';
      summary.textContent = converted
        ? dfnText.converted(converted, ambiguous)
        : dfnText.none;
      renderWarnings(warnings, dropped);
    };

    sampleBtn?.addEventListener('click', () => {
      input.value = (dfnText.sample || []).join('\n');
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (!output.value.trim()) {
        summary.textContent = dfnText.copyEmpty;
        return;
      }
      await copyText(output.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = dfnText.copied || 'Copied';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      output.value = '';
      render();
      input.focus();
    });

    [input, format, slashOrder, extract, keepInvalid].forEach((el) => {
      el?.addEventListener('input', render);
      el?.addEventListener('change', render);
    });

    render();
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

  if (slug === 'appointment-departure-buffer-simulator') {
    const appointment = document.getElementById('adbs-appointment');
    const travel = document.getElementById('adbs-travel');
    const ready = document.getElementById('adbs-ready');
    const style = document.getElementById('adbs-style');
    const transfer = document.getElementById('adbs-transfer');
    const weather = document.getElementById('adbs-weather');
    const newplace = document.getElementById('adbs-newplace');
    const packing = document.getElementById('adbs-packing');
    const copyBtn = document.getElementById('adbs-copy');
    const sampleBtn = document.getElementById('adbs-sample');
    const startOut = document.getElementById('adbs-start');
    const leaveOut = document.getElementById('adbs-leave');
    const arriveOut = document.getElementById('adbs-arrive');
    const bufferOut = document.getElementById('adbs-buffer');
    const totalOut = document.getElementById('adbs-total');
    const riskOut = document.getElementById('adbs-risk');
    const help = document.getElementById('adbs-help');

    if (!appointment || !travel || !ready || !style || !startOut || !leaveOut || !arriveOut || !bufferOut || !totalOut || !riskOut || !help) return;

    const fmtTime = (date) => new Intl.DateTimeFormat('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);

    const toDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
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
      const when = toDate(appointment.value);
      const travelMin = Number(travel.value || 0);
      const readyMin = Number(ready.value || 0);
      const styleBase = ({ tight: 5, normal: 12, relaxed: 20 })[style.value] ?? 12;

      if (!when || !(travelMin > 0) || readyMin < 0) {
        startOut.textContent = '-';
        leaveOut.textContent = '-';
        arriveOut.textContent = '-';
        bufferOut.textContent = '-';
        totalOut.textContent = '-';
        riskOut.textContent = '-';
        help.textContent = '약속 시각, 이동시간, 준비시간을 입력하면 결과가 계산됩니다.';
        return;
      }

      let variableBuffer = styleBase;
      if (transfer.checked) variableBuffer += 8;
      if (weather.checked) variableBuffer += 10;
      if (newplace.checked) variableBuffer += 12;
      if (packing.checked) variableBuffer += 7;

      const arrivalLead = style.value === 'relaxed' ? 12 : (style.value === 'tight' ? 3 : 7);
      const leaveTime = new Date(when.getTime() - (travelMin + variableBuffer + arrivalLead) * 60000);
      const startTime = new Date(leaveTime.getTime() - readyMin * 60000);
      const arriveGoal = new Date(when.getTime() - arrivalLead * 60000);
      const totalMinutes = readyMin + travelMin + variableBuffer + arrivalLead;

      const riskScore = [style.value === 'tight' ? 2 : 0, transfer.checked ? 2 : 0, weather.checked ? 2 : 0, newplace.checked ? 2 : 0, packing.checked ? 1 : 0].reduce((a, b) => a + b, 0);
      const riskLabel = riskScore >= 6 ? '높음' : (riskScore >= 3 ? '보통' : '낮음');

      startOut.textContent = fmtTime(startTime);
      leaveOut.textContent = fmtTime(leaveTime);
      arriveOut.textContent = `${fmtTime(arriveGoal)} (${arrivalLead}분 전)`;
      bufferOut.textContent = `${variableBuffer}분`;
      totalOut.textContent = `${totalMinutes}분`;
      riskOut.textContent = riskLabel;
      help.textContent = `준비 ${readyMin}분 + 이동 ${travelMin}분 + 추가 버퍼 ${variableBuffer}분 + 조기 도착 ${arrivalLead}분 기준으로 계산했어요.`;
    };

    sampleBtn?.addEventListener('click', () => {
      const now = new Date();
      const target = new Date(now.getTime() + 1000 * 60 * 60 * 20);
      target.setMinutes(30, 0, 0);
      appointment.value = new Date(target.getTime() - target.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      travel.value = 42;
      ready.value = 35;
      style.value = 'normal';
      transfer.checked = true;
      weather.checked = false;
      newplace.checked = true;
      packing.checked = true;
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (startOut.textContent === '-') return;
      const text = [
        `준비 시작: ${startOut.textContent}`,
        `출발 시각: ${leaveOut.textContent}`,
        `권장 도착: ${arriveOut.textContent}`,
        `추가 버퍼: ${bufferOut.textContent}`,
        `총 소요: ${totalOut.textContent}`,
        `리스크: ${riskOut.textContent}`
      ].join(' | ');
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    if (!appointment.value) {
      const base = new Date();
      base.setHours(base.getHours() + 3, 0, 0, 0);
      appointment.value = new Date(base.getTime() - base.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }

    [appointment, travel, ready, style, transfer, weather, newplace, packing].forEach((el) => {
      el?.addEventListener('input', render);
      el?.addEventListener('change', render);
    });

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
        currency: ' KRW',
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
      if (pageLang === 'en') return `${rounded}${dcText.currency}`;
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
        currency: 'ウォン',
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
    const monthlyJeonseEl = document.getElementById('jv-monthly-jeonse');
    const monthlyWolseEl = document.getElementById('jv-monthly-wolse');
    const monthlyGapEl = document.getElementById('jv-monthly-gap');
    const breakEvenEl = document.getElementById('jv-break-even');
    const help = document.getElementById('jv-help');
    const copyBtn = document.getElementById('jv-copy');
    const resetBtn = document.getElementById('jv-reset');

    if (!jeonse || !wolseDeposit || !wolseRent || !rate || !months || !jeonseCostEl || !wolseCostEl || !monthlyJeonseEl || !monthlyWolseEl || !monthlyGapEl || !breakEvenEl || !help) return;

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
        copy: (a,b,c,d,e,f) => `전세 vs 월세 비교 | 전세 총 주거비 ${a} | 월세 총 주거비 ${b} | 전세 월 환산 ${c} | 월세 월 환산 ${d} | 월 기준 비용 차이 ${e} | 손익분기 월세 ${f}`,
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
        copy: (a,b,c,d,e,f) => `Jeonse vs Wolse | Total jeonse cost ${a} | Total wolse cost ${b} | Jeonse monthly-equivalent ${c} | Wolse monthly-equivalent ${d} | Monthly cost gap ${e} | Break-even wolse rent ${f}`,
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
        copy: (a,b,c,d,e,f) => `チョンセ vs ウォルセ | チョンセ総住居費 ${a} | ウォルセ総住居費 ${b} | チョンセ月額換算 ${c} | ウォルセ月額換算 ${d} | 月額コスト差 ${e} | 損益分岐ウォルセ家賃 ${f}`,
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
      monthlyJeonseEl.textContent = '-';
      monthlyWolseEl.textContent = '-';
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
      monthlyJeonseEl.textContent = fmtCurrency(monthlyJeonse);
      monthlyWolseEl.textContent = fmtCurrency(monthlyWolse);
      monthlyGapEl.textContent = t.monthlyGap(fmtCurrency(Math.abs(gapMonthly)), gapMonthly > 0 ? t.jeonseBetter : gapMonthly < 0 ? t.wolseBetter : t.similar);
      breakEvenEl.textContent = fmtCurrency(breakEvenMonthlyRent);

      if (gapMonthly > 0) help.textContent = t.helpJeonse(fmtCurrency(Math.abs(gapMonthly)));
      else if (gapMonthly < 0) help.textContent = t.helpWolse(fmtCurrency(Math.abs(gapMonthly)));
      else help.textContent = t.helpSame;
    };

    [jeonse, wolseDeposit, wolseRent, rate, months].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (jeonseCostEl.textContent === '-') return;
      const text = t.copy(
        jeonseCostEl.textContent,
        wolseCostEl.textContent,
        monthlyJeonseEl.textContent,
        monthlyWolseEl.textContent,
        monthlyGapEl.textContent,
        breakEvenEl.textContent
      );
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

  if (slug === 'profit-margin-calculator') {
    const sales = document.getElementById('pm-sales');
    const cost = document.getElementById('pm-cost');
    const targetMargin = document.getElementById('pm-target-margin');
    const outProfit = document.getElementById('pm-profit');
    const outCostRate = document.getElementById('pm-cost-rate');
    const outMarginRate = document.getElementById('pm-margin-rate');
    const outTargetPrice = document.getElementById('pm-target-price');
    const help = document.getElementById('pm-help');
    const copyBtn = document.getElementById('pm-copy');
    const resetBtn = document.getElementById('pm-reset');

    if (!sales || !cost || !targetMargin || !outProfit || !outCostRate || !outMarginRate || !outTargetPrice || !help) return;

    const i18n = {
      ko: {
        currency: '원',
        needInput: '매출과 원가를 입력하세요.',
        invalid: '매출은 0보다 커야 하고 원가는 0 이상이어야 합니다.',
        summary: (cr, mr) => `원가율 ${cr}, 마진율 ${mr} 기준 결과입니다.`,
        impossible: '목표 마진율은 100% 미만이어야 합니다.',
        copy: (p, cr, mr, tp) => `원가율 계산 결과 | 이익 ${p} | 원가율 ${cr} | 마진율 ${mr} | 권장 판매가 ${tp}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW',
        needInput: 'Enter sales and cost.',
        invalid: 'Sales must be greater than 0, and cost must be 0 or higher.',
        summary: (cr, mr) => `Calculated from cost ratio ${cr} and margin ratio ${mr}.`,
        impossible: 'Target margin must be less than 100%.',
        copy: (p, cr, mr, tp) => `Profit margin result | Profit ${p} | Cost ratio ${cr} | Margin ratio ${mr} | Suggested price ${tp}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        currency: 'ウォン',
        needInput: '売上と原価を入力してください。',
        invalid: '売上は0より大きく、原価は0以上で入力してください。',
        summary: (cr, mr) => `原価率 ${cr}、利益率 ${mr} の結果です。`,
        impossible: '目標利益率は100%未満で入力してください。',
        copy: (p, cr, mr, tp) => `原価率計算結果 | 利益 ${p} | 原価率 ${cr} | 利益率 ${mr} | 推奨販売価格 ${tp}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const t = i18n[pageLang] || i18n.ko;

    const fmtMoney = (v) => {
      const rounded = Math.round(v || 0).toLocaleString(numberLocale);
      return `${rounded}${t.currency}`;
    };
    const fmtPct = (v) => `${(v || 0).toLocaleString(numberLocale, { maximumFractionDigits: 2 })}%`;

    const setIdle = (msg) => {
      outProfit.textContent = '-';
      outCostRate.textContent = '-';
      outMarginRate.textContent = '-';
      outTargetPrice.textContent = '-';
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

    const render = () => {
      const s = Number(sales.value || 0);
      const c = Number(cost.value || 0);
      const tm = Number(targetMargin.value || 0);

      if (!(s > 0) && !(c > 0)) {
        setIdle(t.needInput);
        return;
      }
      if (!(s > 0) || c < 0) {
        setIdle(t.invalid);
        return;
      }

      const profit = s - c;
      const costRate = (c / s) * 100;
      const marginRate = (profit / s) * 100;

      outProfit.textContent = fmtMoney(profit);
      outCostRate.textContent = fmtPct(costRate);
      outMarginRate.textContent = fmtPct(marginRate);

      if (targetMargin.value !== '') {
        if (tm >= 100) {
          outTargetPrice.textContent = '-';
          help.textContent = t.impossible;
        } else {
          const suggested = c / (1 - (tm / 100));
          outTargetPrice.textContent = fmtMoney(suggested);
          help.textContent = t.summary(fmtPct(costRate), fmtPct(marginRate));
        }
      } else {
        outTargetPrice.textContent = '-';
        help.textContent = t.summary(fmtPct(costRate), fmtPct(marginRate));
      }
    };

    [sales, cost, targetMargin].forEach((el) => el.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (outProfit.textContent === '-') return;
      const text = t.copy(outProfit.textContent, outCostRate.textContent, outMarginRate.textContent, outTargetPrice.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      sales.value = 10000;
      cost.value = 7000;
      targetMargin.value = 30;
      render();
    });

    if (!sales.value) sales.value = 10000;
    if (!cost.value) cost.value = 7000;
    render();
  }

  if (slug === 'pomodoro-timer') {
    const focusEl = document.getElementById('pomo-focus');
    const shortEl = document.getElementById('pomo-short');
    const longEl = document.getElementById('pomo-long');
    const cycleEl = document.getElementById('pomo-cycle');
    const startBtn = document.getElementById('pomo-start');
    const skipBtn = document.getElementById('pomo-skip');
    const resetBtn = document.getElementById('pomo-reset');

    const outPhase = document.getElementById('pomo-phase');
    const outRemaining = document.getElementById('pomo-remaining');
    const outProgress = document.getElementById('pomo-progress');
    const outStatus = document.getElementById('pomo-status');
    const help = document.getElementById('pomo-help');

    if (!focusEl || !shortEl || !longEl || !cycleEl || !startBtn || !skipBtn || !resetBtn || !outPhase || !outRemaining || !outProgress || !outStatus || !help) return;

    const t = {
      ko: {
        phase: { focus: '집중', short: '짧은 휴식', long: '긴 휴식' },
        ready: '준비됨', running: '진행 중', paused: '일시정지',
        helpReady: '시작을 누르면 포모도로 타이머가 시작됩니다.',
        helpPhaseDone: (phase) => `${phase} 시간이 끝났습니다. 다음 구간으로 자동 전환됩니다.`
      },
      en: {
        phase: { focus: 'Focus', short: 'Short break', long: 'Long break' },
        ready: 'Ready', running: 'Running', paused: 'Paused',
        helpReady: 'Press Start to begin the Pomodoro timer.',
        helpPhaseDone: (phase) => `${phase} completed. Switched to next phase automatically.`
      },
      ja: {
        phase: { focus: '集中', short: '短い休憩', long: '長い休憩' },
        ready: '準備完了', running: '進行中', paused: '一時停止',
        helpReady: '開始を押すとポモドーロタイマーが始まります。',
        helpPhaseDone: (phase) => `${phase}が終了し、次のフェーズに自動で切り替わりました。`
      }
    }[pageLang] || {
      phase: { focus: '집중', short: '짧은 휴식', long: '긴 휴식' },
      ready: '준비됨', running: '진행 중', paused: '일시정지',
      helpReady: '시작을 누르면 포모도로 타이머가 시작됩니다.',
      helpPhaseDone: (phase) => `${phase} 시간이 끝났습니다. 다음 구간으로 자동 전환됩니다.`
    };

    let timer = null;
    let phase = 'focus';
    let focusDone = 0;
    let remainingSec = 25 * 60;
    let running = false;

    const clampInt = (v, min, max) => {
      const n = Math.floor(Number(v || min));
      if (!Number.isFinite(n)) return min;
      return Math.min(max, Math.max(min, n));
    };

    const settings = () => {
      const focus = clampInt(focusEl.value, 1, 120);
      const short = clampInt(shortEl.value, 1, 60);
      const long = clampInt(longEl.value, 1, 90);
      const cycle = clampInt(cycleEl.value, 2, 12);
      focusEl.value = focus;
      shortEl.value = short;
      longEl.value = long;
      cycleEl.value = cycle;
      return { focus, short, long, cycle };
    };

    const formatSec = (sec) => {
      const s = Math.max(0, sec);
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
    };

    const nextPhase = () => {
      const { focus, short, long, cycle } = settings();
      if (phase === 'focus') {
        focusDone += 1;
        const longTurn = (focusDone > 0 && focusDone % cycle === 0);
        phase = longTurn ? 'long' : 'short';
        remainingSec = (longTurn ? long : short) * 60;
      } else {
        phase = 'focus';
        remainingSec = focus * 60;
      }
      help.textContent = t.helpPhaseDone(t.phase[phase]);
    };

    const render = () => {
      const { cycle } = settings();
      outPhase.textContent = t.phase[phase] || phase;
      outRemaining.textContent = formatSec(remainingSec);
      outProgress.textContent = `${focusDone % cycle} / ${cycle}`;
      outStatus.textContent = running ? t.running : (focusDone === 0 && phase === 'focus' && remainingSec === settings().focus * 60 ? t.ready : t.paused);
    };

    const tick = () => {
      if (!running) return;
      remainingSec -= 1;
      if (remainingSec <= 0) nextPhase();
      render();
    };

    const resetAll = () => {
      const { focus } = settings();
      if (timer) clearInterval(timer);
      timer = null;
      running = false;
      phase = 'focus';
      focusDone = 0;
      remainingSec = focus * 60;
      outStatus.textContent = t.ready;
      help.textContent = t.helpReady;
      render();
    };

    startBtn.addEventListener('click', () => {
      if (!timer) timer = setInterval(tick, 1000);
      running = !running;
      render();
    });

    skipBtn.addEventListener('click', () => {
      nextPhase();
      render();
    });

    resetBtn.addEventListener('click', resetAll);
    [focusEl, shortEl, longEl, cycleEl].forEach((el) => el.addEventListener('input', () => {
      if (!running) resetAll();
    }));

    resetAll();
  }

  if (slug === 'meeting-agenda-generator') {
    const typeEl = document.getElementById('mag-type');
    const durationEl = document.getElementById('mag-duration');
    const participantsEl = document.getElementById('mag-participants');
    const goalEl = document.getElementById('mag-goal');
    const topicsEl = document.getElementById('mag-topics');
    const includeOwnerEl = document.getElementById('mag-include-owner');
    const runBtn = document.getElementById('mag-run');
    const copyBtn = document.getElementById('mag-copy');
    const topicCountEl = document.getElementById('mag-topic-count');
    const durationOutEl = document.getElementById('mag-duration-out');
    const formatEl = document.getElementById('mag-format');
    const followUpEl = document.getElementById('mag-follow-up');
    const outputEl = document.getElementById('mag-output');
    const helpEl = document.getElementById('mag-help');

    if (!typeEl || !durationEl || !participantsEl || !goalEl || !topicsEl || !includeOwnerEl || !runBtn || !copyBtn || !topicCountEl || !durationOutEl || !formatEl || !followUpEl || !outputEl || !helpEl) return;

    const i18n = {
      ko: {
        types: {
          weekly: '주간 정기회의',
          project: '프로젝트 킥오프 / 업데이트',
          retrospective: '회고 미팅',
          client: '클라이언트 미팅',
          interview: '면담 / 인터뷰'
        },
        intro: '회의 목적과 핵심 안건을 바탕으로 바로 공유 가능한 초안을 생성했습니다.',
        title: '회의 안건',
        purpose: '회의 목적',
        attendees: '참여자',
        agenda: '안건',
        open: '오프닝 및 목표 확인',
        close: '결론 정리 및 다음 액션',
        owner: '담당자 / 후속조치',
        minutes: '분',
        output: '한국어 초안',
        included: '포함',
        excluded: '미포함',
        placeholderTopic: '논의 주제',
        copyDone: '복사됨',
        copyDefault: '결과 복사',
        needGoal: '회의 목표와 안건을 함께 넣으면 결과가 더 자연스러워집니다.'
      }
    };
    const t = i18n.ko;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const parseTopics = () => (topicsEl.value || '').split(/\n+/).map(v => v.trim()).filter(Boolean);

    const generate = () => {
      const meetingType = typeEl.value || 'weekly';
      const duration = Math.min(240, Math.max(10, Number(durationEl.value || 30)));
      durationEl.value = duration;
      const participants = (participantsEl.value || '').trim() || '관련 담당자';
      const goal = (goalEl.value || '').trim() || '핵심 이슈를 정리하고 다음 액션을 확정하기';
      const topics = parseTopics();
      const topicList = topics.length ? topics : [t.placeholderTopic];
      const includeOwner = !!includeOwnerEl.checked;

      const opening = Math.max(5, Math.round(duration * 0.15));
      const closing = Math.max(5, Math.round(duration * 0.15));
      const remaining = Math.max(5, duration - opening - closing);
      const base = Math.floor(remaining / topicList.length);
      let extra = remaining - (base * topicList.length);

      const lines = [];
      lines.push(`[${t.types[meetingType]}] ${t.title}`);
      lines.push(`- ${t.purpose}: ${goal}`);
      lines.push(`- ${t.attendees}: ${participants}`);
      lines.push(`- 총 ${duration}${t.minutes}`);
      lines.push('');
      lines.push(`1. ${t.open} (${opening}${t.minutes})`);

      topicList.forEach((topic, index) => {
        const minutes = base + (extra > 0 ? 1 : 0);
        if (extra > 0) extra -= 1;
        lines.push(`${index + 2}. ${topic} (${minutes}${t.minutes})`);
        lines.push(`   - 현재 상황 공유`);
        lines.push(`   - 결정 필요 사항 / 쟁점 정리`);
      });

      lines.push(`${topicList.length + 2}. ${t.close} (${closing}${t.minutes})`);
      lines.push(`   - 결정 사항 요약`);
      lines.push(`   - 다음 일정 / 마감 확인`);

      if (includeOwner) {
        lines.push('');
        lines.push(`[${t.owner}]`);
        lines.push(`- 액션 1: 담당자 / 기한`);
        lines.push(`- 액션 2: 담당자 / 기한`);
      }

      outputEl.value = lines.join('\n');
      topicCountEl.textContent = String(topicList.length);
      durationOutEl.textContent = `${duration}${t.minutes}`;
      formatEl.textContent = t.output;
      followUpEl.textContent = includeOwner ? t.included : t.excluded;
      helpEl.textContent = topics.length ? t.intro : t.needGoal;
    };

    runBtn.addEventListener('click', generate);
    [typeEl, durationEl, participantsEl, goalEl, topicsEl, includeOwnerEl].forEach((el) => el.addEventListener('input', generate));
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) generate();
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copyDone;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    generate();
  }

  if (slug === 'move-checklist-planner') {
    const dateEl = document.getElementById('mcp-date');
    const homeEl = document.getElementById('mcp-home');
    const styleEl = document.getElementById('mcp-style');
    const elevatorEl = document.getElementById('mcp-elevator');
    const utilitiesEl = document.getElementById('mcp-utilities');
    const essentialsEl = document.getElementById('mcp-essentials');
    const runBtn = document.getElementById('mcp-run');
    const copyBtn = document.getElementById('mcp-copy');
    const totalEl = document.getElementById('mcp-total');
    const urgentEl = document.getElementById('mcp-urgent');
    const focusEl = document.getElementById('mcp-focus');
    const formatEl = document.getElementById('mcp-format');
    const outputEl = document.getElementById('mcp-output');
    const helpEl = document.getElementById('mcp-help');

    if (!dateEl || !homeEl || !styleEl || !elevatorEl || !utilitiesEl || !essentialsEl || !runBtn || !copyBtn || !totalEl || !urgentEl || !focusEl || !formatEl || !outputEl || !helpEl) return;

    const t = {
      homes: {
        studio: '원룸 / 오피스텔',
        apartment: '아파트 / 가족 이사',
        office: '사무실 / 작업실'
      },
      styles: {
        full: '포장이사',
        semi: '반포장 / 셀프 포장',
        self: '직접 운반 / 소형 이사'
      },
      elevator: {
        yes: '엘리베이터 있음',
        no: '엘리베이터 없음',
        unknown: '엘리베이터 확인 필요'
      },
      focusByHome: {
        studio: '생활 정리',
        apartment: '가족 일정',
        office: '설비 / 주소 이전'
      },
      focusByStyle: {
        full: '예약 / 검수',
        semi: '포장 우선순위',
        self: '짐 줄이기 / 동선'
      },
      intro: '이사 준비를 2주 전, 3일 전, 당일 순서로 정리한 체크리스트입니다.',
      format: '복사형 체크리스트',
      copyDone: '복사됨',
      copyDefault: '결과 복사'
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const formatDate = (value) => {
      if (!value) return '미정';
      const [y, m, d] = value.split('-').map(Number);
      if (!y || !m || !d) return value;
      return `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`;
    };

    const generate = () => {
      const moveDate = dateEl.value || '';
      const home = homeEl.value || 'studio';
      const style = styleEl.value || 'full';
      const elevator = elevatorEl.value || 'yes';
      const needUtilities = !!utilitiesEl.checked;
      const needEssentials = !!essentialsEl.checked;

      const checklist = {
        before2w: [
          '이사업체 / 차량 일정 비교 후 예약 확정',
          '버릴 물건, 기부할 물건, 가져갈 물건 3분류 정리',
          '자주 안 쓰는 짐부터 박스 / 봉투 / 라벨 준비'
        ],
        before3d: [
          '냉장고 / 냉동실 비우기 시작, 음식물 처리 계획 세우기',
          '깨지기 쉬운 물건 / 귀중품 / 서류 별도 분리',
          '청소도구, 휴지, 충전기 등 당일 바로 쓸 물건 한데 모으기'
        ],
        day0: [
          '출발 전 기존 집 사진 / 계량기 / 비밀번호 / 열쇠 상태 확인',
          '도착 후 큰 가구 위치 먼저 결정하고 박스 이동 순서 정리',
          '퇴실·입실 체크리스트 마지막 확인'
        ]
      };

      if (home === 'apartment') {
        checklist.before2w.push('관리사무소 / 주차 / 엘리베이터 예약 가능 여부 확인');
        checklist.before3d.push('가족별 필수 가방 / 옷 / 세면도구 분리 포장');
        checklist.day0.push('아이 / 반려동물 / 가족 동선 먼저 확보');
      } else if (home === 'office') {
        checklist.before2w.push('사업자 주소 / 우편물 / 거래처 주소 변경 항목 정리');
        checklist.before3d.push('장비, 케이블, 문서, 백업 드라이브를 구역별로 라벨링');
        checklist.day0.push('인터넷 / 프린터 / 전원 멀티탭 작동 여부 즉시 점검');
      } else {
        checklist.before2w.push('생활 소형가전, 계절옷, 침구류부터 순차 포장');
      }

      if (style !== 'full') {
        checklist.before2w.push('박스별 방 이름 / 우선순위 / 파손주의 표시하기');
        checklist.before3d.push('무거운 짐과 가벼운 짐을 섞지 않도록 재포장 점검');
      }
      if (style === 'self') {
        checklist.before2w.push('사다리차 / 운반 인원 / 차량 동선 직접 확인');
        checklist.day0.push('들고 이동할 동선을 미리 비워두고 미끄럼 위험 제거');
      }

      if (elevator === 'no') {
        checklist.before3d.push('계단 이동 대비 짐 무게 줄이기, 손잡이 박스 우선 배치');
        checklist.day0.push('무거운 짐은 가장 먼저 옮기고 휴식 구간 확보');
      } else if (elevator === 'unknown') {
        checklist.before2w.push('엘리베이터 사용 가능 시간 / 예약 필요 여부 재확인');
      }

      if (needUtilities) {
        checklist.before2w.push('전기 / 가스 / 수도 / 인터넷 이전 신청 일정 체크');
        checklist.before3d.push('전입신고, 우편물 주소 변경, 각종 자동결제 주소 점검');
      }

      if (needEssentials) {
        checklist.before3d.push('첫날 박스 따로 만들기: 세면도구, 충전기, 상비약, 옷 1벌');
        checklist.day0.push('도착 즉시 첫날 박스부터 열고 잠자리 / 세면 동선부터 세팅');
      }

      const sections = [
        ['2주 전', checklist.before2w],
        ['3일 전', checklist.before3d],
        ['이사 당일', checklist.day0]
      ];

      const lines = [];
      lines.push(`[이사 체크리스트] ${formatDate(moveDate)}`);
      lines.push(`- 집 형태: ${t.homes[home]}`);
      lines.push(`- 이사 방식: ${t.styles[style]}`);
      lines.push(`- 현장 조건: ${t.elevator[elevator]}`);
      lines.push(`- 공과금/인터넷 이전: ${needUtilities ? '필요' : '불필요'}`);
      lines.push(`- 당일 필수 박스: ${needEssentials ? '준비' : '미준비'}`);
      lines.push('');

      sections.forEach(([label, items]) => {
        lines.push(`[${label}]`);
        items.forEach((item) => lines.push(`- ${item}`));
        lines.push('');
      });

      outputEl.value = lines.join('\n').trim();
      totalEl.textContent = String(checklist.before2w.length + checklist.before3d.length + checklist.day0.length);
      urgentEl.textContent = String(checklist.before3d.length + checklist.day0.length);
      focusEl.textContent = `${t.focusByHome[home]} / ${t.focusByStyle[style]}`;
      formatEl.textContent = t.format;
      helpEl.textContent = t.intro;
    };

    runBtn.addEventListener('click', generate);
    [dateEl, homeEl, styleEl, elevatorEl, utilitiesEl, essentialsEl].forEach((el) => el.addEventListener('input', generate));
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) generate();
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copyDone;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    if (!dateEl.value) {
      const now = new Date();
      const future = new Date(now.getTime() + 14 * 86400000);
      dateEl.value = new Date(future.getTime() - future.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }
    generate();
  }

  if (slug === 'business-trip-checklist-planner') {
    const dateEl = document.getElementById('btcp-date');
    const daysEl = document.getElementById('btcp-days');
    const typeEl = document.getElementById('btcp-type');
    const transportEl = document.getElementById('btcp-transport');
    const baggageEl = document.getElementById('btcp-baggage');
    const weatherEl = document.getElementById('btcp-weather');
    const laundryEl = document.getElementById('btcp-laundry');
    const formalEl = document.getElementById('btcp-formal');
    const devicesEl = document.getElementById('btcp-devices');
    const healthEl = document.getElementById('btcp-health');
    const runBtn = document.getElementById('btcp-run');
    const copyBtn = document.getElementById('btcp-copy');
    const totalEl = document.getElementById('btcp-total');
    const clothesEl = document.getElementById('btcp-clothes');
    const focusEl = document.getElementById('btcp-focus');
    const formatEl = document.getElementById('btcp-format');
    const outputEl = document.getElementById('btcp-output');
    const helpEl = document.getElementById('btcp-help');

    if (!dateEl || !daysEl || !typeEl || !transportEl || !baggageEl || !weatherEl || !laundryEl || !formalEl || !devicesEl || !healthEl || !runBtn || !copyBtn || !totalEl || !clothesEl || !focusEl || !formatEl || !outputEl || !helpEl) return;

    const t = {
      type: {
        domestic: '국내 출장',
        international: '해외 출장',
        conference: '행사 / 컨퍼런스 중심',
        client: '고객 미팅 / 발표 중심'
      },
      transport: {
        plane: '비행기',
        train: 'KTX / 기차',
        car: '차량 이동',
        mixed: '복합 이동'
      },
      baggage: {
        carry: '기내용 / 백팩 위주',
        checked: '위탁수하물 / 캐리어 있음',
        light: '최소 짐'
      },
      weather: {
        mild: '보통',
        hot: '덥고 습함',
        cold: '쌀쌀함 / 추움',
        rain: '비 가능성 높음'
      },
      format: '복사형 체크리스트',
      copyDone: '복사됨',
      copyDefault: '결과 복사'
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const formatDate = (value) => {
      if (!value) return '미정';
      const [y, m, d] = value.split('-').map(Number);
      if (!y || !m || !d) return value;
      return `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`;
    };

    const generate = () => {
      const days = Math.min(30, Math.max(1, Math.floor(Number(daysEl.value || 3))));
      daysEl.value = days;
      const tripType = typeEl.value || 'domestic';
      const transport = transportEl.value || 'plane';
      const baggage = baggageEl.value || 'carry';
      const weather = weatherEl.value || 'mild';
      const laundry = !!laundryEl.checked;
      const formal = !!formalEl.checked;
      const devices = !!devicesEl.checked;
      const health = !!healthEl.checked;

      const top = [
        '신분증 / 사원증 / 필요한 출입 정보 확인',
        '교통편·숙소 예약 확인 메시지 다시 점검',
        '일정표 / 주소 / 연락처를 휴대폰에서 바로 열 수 있게 정리'
      ];
      const docs = [
        '회사 결재 문서 / 방문 확인 메일 / 일정 초대 링크 저장',
        '영수증 정산 기준 또는 법인카드 사용 규칙 확인'
      ];
      const clothes = [
        `상의 ${Math.max(2, laundry ? Math.ceil(days * 0.7) : days)}벌`,
        `하의 ${Math.max(1, laundry ? Math.ceil(days * 0.4) : Math.ceil(days / 2))}벌`,
        `속옷 / 양말 ${laundry ? Math.max(2, days - 1) : days}세트`,
        '잠옷 또는 숙소용 편한 옷 1세트'
      ];
      const devicesList = [
        '휴대폰 충전기 / 케이블',
        '보조배터리 충전 상태 확인',
        '업무용 파일 클라우드 업로드 또는 백업 링크 준비'
      ];
      const healthList = [
        '세면도구 / 칫솔 / 렌즈용품 / 면도도구 확인',
        '상비약 / 진통제 / 밴드 / 개인 복용약 챙기기'
      ];
      const dayOf = [
        '출발 전 지갑, 휴대폰, 충전기, 신분증 4가지를 마지막 확인',
        '이동 중 바로 꺼낼 물건은 바깥 주머니에 분리',
        '숙소 도착 후 다음 날 일정과 알람 시간 먼저 확인'
      ];

      if (tripType === 'international') {
        top.push('여권 유효기간 / 비자 / 입국 요건 재확인');
        docs.push('로밍 / 유심 / eSIM 준비 여부 확인');
        docs.push('현지 결제수단, 환전, 카드 해외사용 설정 확인');
        dayOf.push('멀티어댑터 / 충전 규격 / 현지 시차 확인');
      }

      if (tripType === 'conference') {
        docs.push('행사 등록 QR / 배지 발급 메일 저장');
        docs.push('명함 / 네트워킹 메모 / 부스 위치 확인');
      }

      if (tripType === 'client') {
        docs.push('발표 자료 최종본 + PDF 백업본 준비');
        docs.push('회의실 장비(HDMI, 젠더, 리모컨) 호환성 확인');
      }

      if (formal) {
        clothes.push('미팅용 셔츠 / 블라우스 1~2벌');
        clothes.push('구김 적은 겉옷 또는 재킷 1벌');
      } else {
        clothes.push('이동이 편한 캐주얼 겉옷 1벌');
      }

      if (weather === 'hot') {
        clothes.push('얇은 여벌 옷 / 흡습 빠른 이너 추가');
        healthList.push('선크림 / 땀 닦는 티슈 / 물병 확인');
      } else if (weather === 'cold') {
        clothes.push('가벼운 니트 / 보온 이너 / 외투 확인');
        healthList.push('건조 대비 립밤 / 핸드크림 챙기기');
      } else if (weather === 'rain') {
        clothes.push('얇은 우산 / 방수 파우치 / 여분 양말 추가');
        dayOf.push('전자기기용 방수 파우치 또는 지퍼백 챙기기');
      }

      if (transport === 'plane') {
        top.push('항공권 / 좌석 / 수하물 규정 확인');
        dayOf.push('보안검색 전 꺼낼 물건 위치 미리 정리');
      } else if (transport === 'train') {
        top.push('승차권 / 좌석 / 탑승 시간 여유 확인');
      } else if (transport === 'car') {
        top.push('주차 / 톨비 / 운전 교대 여부 확인');
        dayOf.push('차량용 충전기 / 거치대 / 물티슈 챙기기');
      } else if (transport === 'mixed') {
        top.push('구간별 티켓 / 환승 동선 / 짐 이동 난이도 확인');
      }

      if (baggage === 'carry') {
        top.push('기내용 반입 제한 물품 재확인');
        dayOf.push('노트북, 신분증, 충전기는 가장 꺼내기 쉬운 위치에 배치');
      } else if (baggage === 'checked') {
        top.push('짐표 / 위탁 마감 시간 / 분실 대비 이름표 확인');
        clothes.push('비상용 갈아입을 옷 1세트는 손가방에도 분리');
      } else if (baggage === 'light') {
        clothes.push('다회전 코디 기준으로 색상 맞춰 최소화');
        dayOf.push('현지 조달 가능한 소모품은 과감히 생략');
      }

      if (devices) {
        devicesList.push('노트북 / 충전기 / 마우스 / 이어폰 확인');
        devicesList.push('멀티탭 또는 작은 충전 허브 1개');
        devicesList.push('발표용 젠더 / HDMI / USB 메모리 준비');
      }

      if (health) {
        healthList.push('마스크 / 손소독제 / 물티슈 / 티슈 확인');
      }

      const focusTags = [t.type[tripType], t.transport[transport], weather === 'mild' ? '기본 짐' : t.weather[weather]];
      if (formal) focusTags.push('회의 복장');
      if (devices) focusTags.push('전자기기');

      const sections = [
        ['출발 전 확인', top],
        ['문서 / 예약 / 업무 준비', docs],
        ['의류 / 착장', clothes],
        ['전자기기 / 충전', devicesList],
        ['세면 / 건강', healthList],
        ['이동 당일 체크', dayOf]
      ];

      const lines = [];
      lines.push(`[출장 준비 체크리스트] ${formatDate(dateEl.value)} · ${days}일`);
      lines.push(`- 출장 유형: ${t.type[tripType]}`);
      lines.push(`- 이동수단: ${t.transport[transport]}`);
      lines.push(`- 짐 스타일: ${t.baggage[baggage]}`);
      lines.push(`- 현지 기후: ${t.weather[weather]}`);
      lines.push(`- 세탁 가능: ${laundry ? '예' : '아니오'}`);
      lines.push(`- 회의/발표 복장: ${formal ? '필요' : '불필요'}`);
      lines.push(`- 전자기기 체크 강화: ${devices ? '예' : '아니오'}`);
      lines.push('');
      sections.forEach(([label, items]) => {
        const uniqueItems = Array.from(new Set(items));
        lines.push(`[${label}]`);
        uniqueItems.forEach((item) => lines.push(`- ${item}`));
        lines.push('');
      });

      outputEl.value = lines.join('\n').trim();
      totalEl.textContent = String(sections.reduce((sum, [, items]) => sum + new Set(items).size, 0));
      clothesEl.textContent = `${Math.max(2, laundry ? Math.ceil(days * 0.7) : days)}벌 상의 기준`;
      focusEl.textContent = focusTags.join(' / ');
      formatEl.textContent = t.format;
      helpEl.textContent = `${days}일 일정 기준으로 서류, 복장, 전자기기, 이동 체크를 한 번에 묶은 리스트입니다. 항공/해외 규정과 회사 정책은 마지막에 한 번 더 확인하세요.`;
    };

    [dateEl, daysEl, typeEl, transportEl, baggageEl, weatherEl, laundryEl, formalEl, devicesEl, healthEl].forEach((el) => {
      el.addEventListener('input', generate);
      el.addEventListener('change', generate);
    });
    runBtn.addEventListener('click', generate);
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) generate();
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copyDone;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    if (!dateEl.value) {
      const now = new Date();
      const future = new Date(now.getTime() + 3 * 86400000);
      dateEl.value = new Date(future.getTime() - future.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }
    generate();
  }

  if (slug === 'secondhand-trade-checklist-planner') {
    const itemEl = document.getElementById('stcp-item');
    const methodEl = document.getElementById('stcp-method');
    const priceEl = document.getElementById('stcp-price');
    const packageEl = document.getElementById('stcp-package');
    const testEl = document.getElementById('stcp-test');
    const partsEl = document.getElementById('stcp-parts');
    const defectEl = document.getElementById('stcp-defect');
    const urgentEl = document.getElementById('stcp-urgent');
    const runBtn = document.getElementById('stcp-run');
    const copyBtn = document.getElementById('stcp-copy');
    const totalEl = document.getElementById('stcp-total');
    const beforeEl = document.getElementById('stcp-before');
    const focusEl = document.getElementById('stcp-focus');
    const formatEl = document.getElementById('stcp-format');
    const outputEl = document.getElementById('stcp-output');
    const helpEl = document.getElementById('stcp-help');

    if (!itemEl || !methodEl || !priceEl || !packageEl || !testEl || !partsEl || !defectEl || !urgentEl || !runBtn || !copyBtn || !totalEl || !beforeEl || !focusEl || !formatEl || !outputEl || !helpEl) return;

    const t = {
      item: {
        electronics: '전자기기',
        fashion: '의류 / 잡화',
        books: '도서 / 취미용품',
        home: '가구 / 생활용품'
      },
      method: {
        meet: '직거래',
        delivery: '택배거래',
        both: '둘 다 가능'
      },
      price: {
        low: '5만 원 미만',
        mid: '5만~30만 원',
        high: '30만 원 이상'
      },
      package: {
        light: '간단 포장',
        normal: '보통',
        heavy: '완충 포장 중요'
      },
      format: '복사형 체크리스트',
      copyDone: '복사됨',
      copyDefault: '결과 복사'
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const generate = () => {
      const item = itemEl.value || 'electronics';
      const method = methodEl.value || 'meet';
      const price = priceEl.value || 'low';
      const packaging = packageEl.value || 'normal';
      const testable = !!testEl.checked;
      const hasParts = !!partsEl.checked;
      const needDefect = !!defectEl.checked;
      const urgent = !!urgentEl.checked;

      const beforeSale = [
        '사진은 밝은 곳에서 앞·뒤·측면과 사용 흔적이 보이게 촬영',
        '판매글 제목에 모델명, 핵심 상태, 거래 방식을 짧게 정리',
        '가격 제안 가능 여부와 네고 기준을 미리 정해두기'
      ];
      const beforeMeet = [
        '상대와 날짜, 시간, 장소 또는 발송 방식을 다시 한 번 확인',
        '판매 물품과 구성품을 한곳에 모아 빠짐없이 점검',
        '거래 직전 연락용 메시지 초안을 짧게 준비'
      ];
      const afterTrade = [
        '거래 완료 후 판매글 상태를 예약중 또는 판매완료로 바로 변경',
        '계좌 입금 또는 현금 수령 여부를 다시 확인',
        '남은 문의가 오지 않도록 완료 메모를 남기기'
      ];

      if (item === 'electronics') {
        beforeSale.push('전원, 화면, 버튼, 배터리, 초기화 여부를 체크하고 설명문에 반영');
        beforeMeet.push(testable ? '현장 테스트 순서를 미리 정하고 충전 상태를 30% 이상 확보' : '테스트가 어렵다면 동작 확인 영상이나 사진을 미리 준비');
        afterTrade.push('계정 로그아웃, 초기화 여부, 일련번호 노출 사진 삭제를 확인');
      } else if (item === 'fashion') {
        beforeSale.push('오염, 보풀, 수선 흔적, 실측 정보를 글에 반영');
        beforeMeet.push('접는 방식과 방수 포장을 미리 정해 구김과 오염을 줄이기');
      } else if (item === 'books') {
        beforeSale.push('밑줄, 필기, 찢김, 구성 누락 여부를 확인');
        beforeMeet.push('세트 상품이면 권수 누락이 없는지 다시 체크');
      } else if (item === 'home') {
        beforeSale.push('크기, 무게, 분해 가능 여부, 차량 적재 가능성을 설명문에 포함');
        beforeMeet.push('옮길 때 필요한 인원과 이동 동선을 미리 확인');
      }

      if (method === 'meet' || method === 'both') {
        beforeMeet.push('사람이 많은 공공장소 또는 테스트 가능한 장소를 우선으로 잡기');
        beforeMeet.push('거래 직전 출발 메시지와 도착 후 식별 포인트를 짧게 정리');
      }
      if (method === 'delivery' || method === 'both') {
        beforeMeet.push('송장 정보, 수취인 연락처, 주소를 오타 없이 다시 확인');
        beforeMeet.push('발송 후 송장 사진 또는 번호를 바로 전달할 준비');
        afterTrade.push('택배 접수 시간과 운송장 조회 가능 시점을 메모');
      }

      if (packaging === 'heavy') {
        beforeSale.push('파손 우려 부위는 근접 사진을 남기고 완충재 필요량을 미리 계산');
        beforeMeet.push('에어캡, 모서리 보호, 테이프 보강 상태를 마지막으로 확인');
      } else if (packaging === 'light') {
        beforeMeet.push('간단 포장이어도 오염 방지용 봉투나 지퍼백은 준비');
      }

      if (price === 'high') {
        beforeSale.push('고가 물품은 거래 이력, 구매 시기, 영수증 또는 인증 가능한 정보 여부를 확인');
        beforeMeet.push('직거래면 CCTV 있는 장소, 택배면 포장 전후 사진을 남기기');
        focusEl.textContent = '안전한 거래 환경 / 증빙 확보';
      } else if (price === 'mid') {
        focusEl.textContent = '상태 설명 정확도 / 구성품 누락 방지';
      } else {
        focusEl.textContent = '빠른 응답 / 준비 시간 최소화';
      }

      if (hasParts) {
        beforeSale.push('박스, 설명서, 충전기, 여분 부속품을 한 번에 모아 사진과 설명문에 반영');
      } else {
        beforeSale.push('구성품이 없으면 본품만 판매라는 점을 제목 또는 본문 초반에 명확히 적기');
      }

      if (needDefect) {
        beforeSale.push('생활기스, 사용감, 고장 이력, 교체 부품 여부를 짧게 정리');
      }

      if (urgent) {
        beforeMeet.push('오늘 거래 가능 시간대와 응답 가능 시간을 먼저 고정해 혼선을 줄이기');
        afterTrade.push('불발 시 바로 다음 후보자에게 보낼 짧은 안내문을 준비');
      }

      const lines = [];
      lines.push('[중고거래 준비 체크리스트]');
      lines.push(`- 물품 종류: ${t.item[item]}`);
      lines.push(`- 거래 방식: ${t.method[method]}`);
      lines.push(`- 가격대: ${t.price[price]}`);
      lines.push(`- 포장 난이도: ${t.package[packaging]}`);
      lines.push(`- 테스트 가능: ${testable ? '가능' : '어려움'}`);
      lines.push(`- 구성품 포함: ${hasParts ? '있음' : '없음'}`);
      lines.push(`- 하자 고지 메모: ${needDefect ? '포함' : '간단 표기'}`);
      lines.push('');
      lines.push('[판매 전 점검]');
      beforeSale.forEach((itemText) => lines.push(`- ${itemText}`));
      lines.push('');
      lines.push('[약속 직전 / 발송 직전]');
      beforeMeet.forEach((itemText) => lines.push(`- ${itemText}`));
      lines.push('');
      lines.push('[거래 후 확인]');
      afterTrade.forEach((itemText) => lines.push(`- ${itemText}`));

      outputEl.value = lines.join('\n').trim();
      totalEl.textContent = String(beforeSale.length + beforeMeet.length + afterTrade.length);
      beforeEl.textContent = String(beforeSale.length);
      formatEl.textContent = t.format;
      helpEl.textContent = '판매 전 확인, 거래 직전 준비, 거래 후 메모까지 한 번에 정리했습니다.';
    };

    runBtn.addEventListener('click', generate);
    [itemEl, methodEl, priceEl, packageEl, testEl, partsEl, defectEl, urgentEl].forEach((el) => el.addEventListener('input', generate));
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) generate();
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copyDone;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    generate();
  }

  if (slug === 'fridge-ingredient-menu-picker') {
    const ingredientsEl = document.getElementById('fimp-ingredients');
    const mealEl = document.getElementById('fimp-meal');
    const timeEl = document.getElementById('fimp-time');
    const styleEl = document.getElementById('fimp-style');
    const carbEl = document.getElementById('fimp-carb');
    const panEl = document.getElementById('fimp-pan');
    const potEl = document.getElementById('fimp-pot');
    const microEl = document.getElementById('fimp-micro');
    const airEl = document.getElementById('fimp-air');
    const runBtn = document.getElementById('fimp-run');
    const sampleBtn = document.getElementById('fimp-sample');
    const copyBtn = document.getElementById('fimp-copy');
    const countEl = document.getElementById('fimp-count');
    const topEl = document.getElementById('fimp-top');
    const matchEl = document.getElementById('fimp-match');
    const formatEl = document.getElementById('fimp-format');
    const outputEl = document.getElementById('fimp-output');
    const helpEl = document.getElementById('fimp-help');

    if (!ingredientsEl || !mealEl || !timeEl || !styleEl || !carbEl || !panEl || !potEl || !microEl || !airEl || !runBtn || !sampleBtn || !copyBtn || !countEl || !topEl || !matchEl || !formatEl || !outputEl || !helpEl) return;

    const recipes = [
      { name: '햄야채볶음밥', required: ['밥', '계란'], optional: ['햄', '양파', '대파', '당근'], meal: ['lunch', 'dinner', 'late'], time: ['quick', 'short'], style: ['comfort'], carb: ['rice'], tools: ['pan'], summary: '남은 밥과 자투리 채소를 가장 빠르게 처리하기 좋은 메뉴예요.' },
      { name: '계란볶음밥', required: ['밥', '계란'], optional: ['대파', '간장', '양파'], meal: ['breakfast', 'lunch', 'dinner'], time: ['quick', 'short'], style: ['comfort', 'light'], carb: ['rice'], tools: ['pan'], summary: '재료가 단순할수록 실패 확률이 낮고 10분 안팎으로 끝내기 쉽습니다.' },
      { name: '김치볶음밥', required: ['밥', '김치'], optional: ['계란', '햄', '대파', '참기름'], meal: ['lunch', 'dinner', 'late'], time: ['quick', 'short'], style: ['comfort', 'spicy'], carb: ['rice'], tools: ['pan'], summary: '김치가 있으면 가장 안정적으로 든든한 한 끼를 만들 수 있어요.' },
      { name: '된장찌개', required: ['된장', '두부'], optional: ['애호박', '양파', '대파', '버섯', '감자'], meal: ['lunch', 'dinner'], time: ['short', 'medium'], style: ['comfort', 'soup'], carb: ['protein'], tools: ['pot'], summary: '두부와 된장만 있어도 국물 있는 집밥 느낌을 만들기 좋습니다.' },
      { name: '두부부침 + 간장양념', required: ['두부'], optional: ['간장', '대파', '고춧가루', '참기름'], meal: ['breakfast', 'lunch', 'dinner'], time: ['quick'], style: ['light', 'protein'], carb: ['protein'], tools: ['pan'], summary: '두부가 남았을 때 가장 간단하게 단백질 반찬 겸 한 끼 보완용으로 좋아요.' },
      { name: '토스트 / 프렌치토스트', required: ['식빵', '계란'], optional: ['우유', '치즈', '설탕', '버터'], meal: ['breakfast', 'late'], time: ['quick'], style: ['light'], carb: ['bread'], tools: ['pan', 'micro'], summary: '아침이나 야식처럼 짧게 해결하고 싶을 때 가장 편한 선택입니다.' },
      { name: '치즈계란토스트', required: ['식빵', '계란', '치즈'], optional: ['햄', '양배추', '마요네즈'], meal: ['breakfast', 'lunch', 'late'], time: ['quick'], style: ['light', 'comfort'], carb: ['bread'], tools: ['pan', 'micro'], summary: '빵과 계란, 치즈 조합이 맞으면 실패하기 어렵고 포만감도 적당해요.' },
      { name: '라면 업그레이드', required: ['라면'], optional: ['계란', '대파', '만두', '치즈', '김치'], meal: ['lunch', 'dinner', 'late'], time: ['quick'], style: ['soup', 'spicy'], carb: ['noodle'], tools: ['pot'], summary: '기본 라면에 남은 재료를 더해 가장 빠르게 만족도를 높이는 방향입니다.' },
      { name: '잔치국수 / 간단 국수', required: ['국수'], optional: ['계란', '대파', '간장', '김가루'], meal: ['lunch', 'dinner'], time: ['short'], style: ['light', 'soup'], carb: ['noodle'], tools: ['pot'], summary: '국수만 있어도 가볍고 따뜻한 한 끼로 정리하기 좋습니다.' },
      { name: '에어프라이어 감자구이', required: ['감자'], optional: ['치즈', '버터', '후추', '소금'], meal: ['breakfast', 'lunch', 'dinner', 'late'], time: ['short', 'medium'], style: ['light', 'comfort'], carb: ['any'], tools: ['air'], summary: '에어프라이어가 가능하면 손을 많이 안 대고 사이드 겸 간식처럼 만들 수 있어요.' },
      { name: '전자레인지 계란찜', required: ['계란'], optional: ['대파', '물', '소금', '치즈'], meal: ['breakfast', 'lunch', 'dinner'], time: ['quick'], style: ['light', 'soup'], carb: ['protein'], tools: ['micro'], summary: '불 쓰기 귀찮을 때 가장 빠르게 단백질 반찬을 확보하는 방식입니다.' },
      { name: '참치마요덮밥', required: ['밥', '참치'], optional: ['마요네즈', '김', '계란', '양파'], meal: ['lunch', 'dinner'], time: ['quick'], style: ['comfort'], carb: ['rice'], tools: ['pan', 'micro'], summary: '참치 캔과 밥만 있으면 거의 바로 한 끼 구성이 가능합니다.' }
    ];

    const normalize = (text) => (text || '').toLowerCase().replace(/\s+/g, '');
    const synonymMap = {
      쪽파: '대파', 파: '대파', 스팸: '햄', 햄류: '햄', 밥한공기: '밥', 흰밥: '밥', 즉석밥: '밥',
      달걀: '계란', 계란: '계란', 두부한모: '두부', 식빵류: '식빵', 토스트빵: '식빵',
      어묵국수: '국수', 소면: '국수', 라면사리: '라면', 참치캔: '참치'
    };

    const parseIngredients = () => {
      const raw = ingredientsEl.value || '';
      return Array.from(new Set(raw.split(/[\n,\/]+/).map((item) => normalize(item)).filter(Boolean).map((item) => synonymMap[item] || item)));
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const generate = () => {
      const items = parseIngredients();
      const state = {
        meal: mealEl.value || 'dinner',
        time: timeEl.value || 'short',
        style: styleEl.value || 'comfort',
        carb: carbEl.value || 'rice',
        tools: [panEl.checked && 'pan', potEl.checked && 'pot', microEl.checked && 'micro', airEl.checked && 'air'].filter(Boolean)
      };

      const ranked = recipes.map((recipe) => {
        const requiredMatched = recipe.required.filter((item) => items.includes(item));
        const optionalMatched = recipe.optional.filter((item) => items.includes(item));
        let score = requiredMatched.length * 5 + optionalMatched.length * 1.5;
        if (recipe.required.length && requiredMatched.length === recipe.required.length) score += 6;
        if (state.meal === 'any' || recipe.meal.includes(state.meal)) score += 2;
        if (state.time === 'any' || recipe.time.includes(state.time)) score += 2;
        if (state.style === 'any' || recipe.style.includes(state.style)) score += 2;
        if (state.carb === 'any' || recipe.carb.includes(state.carb) || recipe.carb.includes('any')) score += 2;
        const toolMatches = recipe.tools.filter((tool) => state.tools.includes(tool));
        if (toolMatches.length) score += 2;
        if (recipe.tools.length && !toolMatches.length) score -= 6;
        if (!requiredMatched.length) score -= 4;
        return {
          ...recipe,
          requiredMatched,
          optionalMatched,
          missing: recipe.required.filter((item) => !items.includes(item)),
          score
        };
      }).filter((recipe) => recipe.score > 0)
        .sort((a, b) => b.score - a.score || b.requiredMatched.length - a.requiredMatched.length || a.name.localeCompare(b.name, 'ko'));

      const picks = ranked.slice(0, 3);
      const lines = [];
      lines.push('[냉장고 재료 조합 추천 결과]');
      lines.push(`- 입력 재료: ${items.length ? items.join(', ') : '없음'}`);
      lines.push(`- 식사 상황: ${mealEl.options[mealEl.selectedIndex].text}`);
      lines.push(`- 조리 시간: ${timeEl.options[timeEl.selectedIndex].text}`);
      lines.push(`- 원하는 느낌: ${styleEl.options[styleEl.selectedIndex].text}`);
      lines.push(`- 사용 가능 도구: ${state.tools.length ? state.tools.map((tool) => ({ pan: '팬', pot: '냄비', micro: '전자레인지', air: '에어프라이어' }[tool])).join(', ') : '없음'}`);
      lines.push('');

      if (!picks.length) {
        lines.push('조건에 맞는 추천이 충분하지 않아요.');
        lines.push('- 재료를 2~3개 더 넣거나');
        lines.push('- 조리 시간/주재료 방향을 상관없음으로 완화해보세요.');
      } else {
        picks.forEach((pick, index) => {
          const matchPercent = Math.round((pick.requiredMatched.length + pick.optionalMatched.length * 0.4) / Math.max(1, pick.required.length + pick.optional.length * 0.4) * 100);
          lines.push(`${index + 1}. ${pick.name}`);
          lines.push(`- 적합도: ${matchPercent}%`);
          lines.push(`- 이미 있는 핵심 재료: ${pick.requiredMatched.length ? pick.requiredMatched.join(', ') : '없음'}`);
          lines.push(`- 있으면 좋은 추가 재료: ${pick.optionalMatched.length ? pick.optionalMatched.join(', ') : '없음'}`);
          lines.push(`- 부족한 핵심 재료: ${pick.missing.length ? pick.missing.join(', ') : '없음'}`);
          lines.push(`- 추천 이유: ${pick.summary}`);
          lines.push('');
        });
        lines.push('활용 팁');
        lines.push('- 1순위가 마음에 들지 않으면 같은 재료로 2, 3순위를 비교해 가장 덜 번거로운 쪽을 고르세요.');
        lines.push('- 부족한 핵심 재료가 1개뿐이면 장보기 메모로 바로 이어가기 좋습니다.');
      }

      outputEl.value = lines.join('\n').trim();
      countEl.textContent = String(ranked.length);
      topEl.textContent = picks[0]?.name || '-';
      matchEl.textContent = picks[0] ? `${Math.round((picks[0].requiredMatched.length / Math.max(1, picks[0].required.length)) * 100)}%` : '-';
      formatEl.textContent = '복사형 메뉴 후보 리스트';
      helpEl.textContent = picks.length
        ? `${picks.map((pick) => pick.name).join(', ')} 순으로 추천했어요. 냉장고 털이용으로는 1순위부터 보는 게 가장 편합니다.`
        : '입력 재료가 너무 적거나 조건이 좁으면 추천 풀이 줄어듭니다. 조건을 조금만 완화해보세요.';
    };

    sampleBtn.addEventListener('click', () => {
      ingredientsEl.value = '계란, 양파, 대파, 햄, 밥, 두부, 김치';
      mealEl.value = 'dinner';
      timeEl.value = 'short';
      styleEl.value = 'comfort';
      carbEl.value = 'rice';
      panEl.checked = true;
      potEl.checked = true;
      microEl.checked = true;
      airEl.checked = false;
      generate();
    });

    [ingredientsEl, mealEl, timeEl, styleEl, carbEl, panEl, potEl, microEl, airEl].forEach((el) => {
      el.addEventListener('input', generate);
      el.addEventListener('change', generate);
    });
    runBtn.addEventListener('click', generate);
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) generate();
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    generate();
  }

  if (slug === 'schedule-coordination-message-generator') {
    const situationEl = document.getElementById('scmg-situation');
    const channelEl = document.getElementById('scmg-channel');
    const toneEl = document.getElementById('scmg-tone');
    const targetEl = document.getElementById('scmg-target');
    const purposeEl = document.getElementById('scmg-purpose');
    const timesEl = document.getElementById('scmg-times');
    const deadlineEl = document.getElementById('scmg-deadline');
    const extraEl = document.getElementById('scmg-extra');
    const askAltEl = document.getElementById('scmg-ask-alt');
    const greetEl = document.getElementById('scmg-greet');
    const runBtn = document.getElementById('scmg-run');
    const sampleBtn = document.getElementById('scmg-sample');
    const copyBtn = document.getElementById('scmg-copy');
    const countEl = document.getElementById('scmg-count');
    const styleEl = document.getElementById('scmg-style');
    const channelOutEl = document.getElementById('scmg-channel-out');
    const variantCountEl = document.getElementById('scmg-variant-count');
    const helpEl = document.getElementById('scmg-help');
    const outputEl = document.getElementById('scmg-output');

    if (!situationEl || !channelEl || !toneEl || !targetEl || !purposeEl || !timesEl || !deadlineEl || !extraEl || !askAltEl || !greetEl || !runBtn || !sampleBtn || !copyBtn || !countEl || !styleEl || !channelOutEl || !variantCountEl || !helpEl || !outputEl) return;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const labels = {
      meeting: '회의',
      appointment: '약속',
      interview: '인터뷰',
      consultation: '상담/면담',
      reschedule: '일정 변경'
    };

    const channelLabels = {
      messenger: '메신저',
      email: '이메일'
    };

    const toneLabels = {
      neutral: '보통',
      polite: '정중',
      casual: '캐주얼'
    };

    const parseTimes = () => (timesEl.value || '').split(/\n+/).map((v) => v.trim()).filter(Boolean).slice(0, 8);

    const joinTimesInline = (items) => {
      if (!items.length) return '가능하신 시간을 알려주시면 맞춰보겠습니다.';
      if (items.length === 1) return `${items[0]} 가능하실지 확인 부탁드립니다.`;
      return `${items.join(', ')} 중 편하신 시간을 알려주시면 맞춰보겠습니다.`;
    };

    const buildGreeting = (target, tone, channel) => {
      if (!greetEl.checked) return '';
      if (target) return `${target} 안녕하세요.`;
      if (tone === 'casual' && channel === 'messenger') return '안녕하세요!';
      return '안녕하세요.';
    };

    const buildClosing = (tone, channel) => {
      if (tone === 'casual') return channel === 'email' ? '확인 부탁드려요. 감사합니다.' : '편한 시간 알려주세요!';
      if (tone === 'polite') return '확인 부탁드리며, 회신 주시면 일정 확정하겠습니다. 감사합니다.';
      return '가능한 시간 회신 부탁드립니다. 감사합니다.';
    };

    const generate = () => {
      const situation = situationEl.value || 'meeting';
      const channel = channelEl.value || 'messenger';
      const tone = toneEl.value || 'neutral';
      const target = (targetEl.value || '').trim();
      const purpose = (purposeEl.value || '').trim() || `${labels[situation]} 일정`;
      const times = parseTimes();
      const deadline = (deadlineEl.value || '').trim();
      const extra = (extraEl.value || '').trim();
      const askAlt = !!askAltEl.checked;
      const greeting = buildGreeting(target, tone, channel);

      const listBlock = times.length ? times.map((time, index) => `${index + 1}. ${time}`).join('\n') : '1. 가능한 시간을 먼저 받아 조율';
      const askAltLine = askAlt ? (tone === 'polite' ? '위 시간이 어려우시면 가능하신 다른 시간도 함께 알려주시면 감사하겠습니다.' : '위 시간이 어렵다면 가능하신 다른 시간도 알려주세요.') : '';
      const deadlineLine = deadline ? (tone === 'polite' ? `${deadline} 전까지 회신 주시면 일정 확정에 큰 도움이 됩니다.` : `${deadline} 전까지 알려주시면 일정 정리에 도움이 됩니다.`) : '';
      const extraLine = extra ? `${extra}` : '';

      const shortParts = [
        greeting,
        `${purpose} 관련해 ${joinTimesInline(times)}`,
        deadlineLine,
        askAltLine,
        extraLine,
        buildClosing(tone, channel)
      ].filter(Boolean);

      const basicParts = [
        greeting,
        `${purpose} 일정을 조율하고 있어 아래 시간 후보를 먼저 공유드립니다.`,
        listBlock,
        deadlineLine,
        askAltLine,
        extraLine,
        buildClosing(tone, channel)
      ].filter(Boolean);

      const politeIntro = target ? `${target}께 ${purpose} 관련 일정 가능 여부를 여쭙고자 연락드립니다.` : `${purpose} 관련 일정 가능 여부를 여쭙고자 연락드립니다.`;
      const politeParts = [
        greeting,
        tone === 'casual' ? `${purpose} 일정 잡으려고 해요.` : politeIntro,
        times.length ? `가능한 시간 후보는 아래와 같습니다.\n${listBlock}` : '가능하신 시간을 알려주시면 그에 맞춰 조율하겠습니다.',
        deadlineLine,
        askAltLine,
        extraLine,
        buildClosing('polite', channel)
      ].filter(Boolean);

      outputEl.value = [
        '[짧은형]',
        shortParts.join(channel === 'email' ? '\n' : ' '),
        '',
        '[기본형]',
        basicParts.join('\n'),
        '',
        '[정중형]',
        politeParts.join('\n')
      ].join('\n');

      countEl.textContent = String(times.length);
      styleEl.textContent = toneLabels[tone] || '-';
      channelOutEl.textContent = channelLabels[channel] || '-';
      variantCountEl.textContent = '3';
      helpEl.textContent = times.length
        ? `${labels[situation]} 상황에 맞는 일정 조율 문구 3가지를 만들었습니다.`
        : '시간 후보를 한 줄에 하나씩 넣으면 더 자연스러운 결과가 나옵니다.';
    };

    sampleBtn.addEventListener('click', () => {
      situationEl.value = 'meeting';
      channelEl.value = 'messenger';
      toneEl.value = 'neutral';
      targetEl.value = '팀 여러분';
      purposeEl.value = '다음 주 프로젝트 킥오프 미팅';
      timesEl.value = '4월 12일(월) 오후 2시\n4월 12일(월) 오후 4시\n4월 13일(화) 오전 10시';
      deadlineEl.value = '오늘 오후 6시';
      extraEl.value = '회의 링크는 시간 확정 후 공유드릴게요.';
      askAltEl.checked = true;
      greetEl.checked = true;
      generate();
    });

    runBtn.addEventListener('click', generate);
    copyBtn.addEventListener('click', async () => {
      await copyText(outputEl.value || '');
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = '결과 복사'; }, 1200);
    });

    [situationEl, channelEl, toneEl, targetEl, purposeEl, timesEl, deadlineEl, extraEl, askAltEl, greetEl].forEach((el) => {
      el.addEventListener('input', generate);
      el.addEventListener('change', generate);
    });

    generate();
  }

  if (slug === 'interview-followup-question-generator') {
    const role = document.getElementById('ifqg-role');
    const level = document.getElementById('ifqg-level');
    const type = document.getElementById('ifqg-type');
    const focus = document.getElementById('ifqg-focus');
    const input = document.getElementById('ifqg-input');
    const metric = document.getElementById('ifqg-include-metric');
    const risk = document.getElementById('ifqg-include-risk');
    const run = document.getElementById('ifqg-run');
    const sample = document.getElementById('ifqg-sample');
    const copy = document.getElementById('ifqg-copy');
    const output = document.getElementById('ifqg-output');
    const count = document.getElementById('ifqg-count');
    const roleOut = document.getElementById('ifqg-role-out');
    const focusOut = document.getElementById('ifqg-focus-out');
    const depth = document.getElementById('ifqg-depth');
    const help = document.getElementById('ifqg-help');
    if (!role || !input || !output) return;

    const roleMap = {
      pm: { label: 'PM / 기획', lens: '우선순위 판단과 이해관계자 조율', specifics: ['왜 그 문제를 먼저 풀어야 했나요?', '다른 이해관계자의 반대는 어떻게 조율했나요?', '실행 전후의 핵심 지표는 무엇이었나요?'] },
      dev: { label: '개발', lens: '원인 분석과 기술적 판단', specifics: ['원인을 어떻게 좁혀 갔나요?', '해당 방식 대신 다른 기술 선택지는 왜 제외했나요?', '배포 후 재발 방지는 어떻게 했나요?'] },
      design: { label: '디자인', lens: '사용자 맥락과 설계 근거', specifics: ['사용자 문제를 어떤 근거로 정의했나요?', '시안 선택 기준은 무엇이었나요?', '협업 중 디자인 의도를 어떻게 설득했나요?'] },
      marketing: { label: '마케팅', lens: '메시지 전략과 성과 해석', specifics: ['어떤 타깃 가설로 시작했나요?', '성과가 좋았던 이유를 어떻게 해석하나요?', '예상보다 성과가 낮았을 때 어떤 수정안을 냈나요?'] },
      ops: { label: '운영 / 비즈니스', lens: '프로세스 개선과 실행 안정성', specifics: ['병목을 어떻게 발견했나요?', '현장 혼선을 줄이기 위해 어떤 기준을 세웠나요?', '개선 효과를 어떤 방식으로 확인했나요?'] }
    };
    const levelMap = {
      junior: { label: '신입 / 주니어', ask: '직접 기여 범위', pressure: '내가 직접 한 일과 배운 점' },
      mid: { label: '경력 3~7년', ask: '판단 근거와 재현 가능성', pressure: '판단 기준과 협업 설득력' },
      senior: { label: '시니어 / 리드', ask: '조직 영향과 의사결정 책임', pressure: '우선순위·리스크·사람 관리' }
    };
    const typeMap = {
      behavior: { label: '경험 / 인성 면접', asks: ['당시 가장 어려웠던 순간은 무엇이었나요?', '그 상황에서 본인 판단 기준은 무엇이었나요?'] },
      project: { label: '프로젝트 설명 면접', asks: ['프로젝트 전체 맥락에서 본인 역할은 어디까지였나요?', '결과를 수치나 사용자 변화로 설명할 수 있나요?'] },
      problem: { label: '문제해결 / 케이스 면접', asks: ['문제를 구조화할 때 어떤 순서로 접근했나요?', '제약조건이 바뀌면 같은 답을 유지하겠나요?'] },
      culture: { label: '협업 / 조직적합 면접', asks: ['의견이 다른 사람과는 어떻게 맞췄나요?', '같은 팀에서 신뢰를 얻기 위해 어떤 방식을 쓰나요?'] }
    };
    const focusMap = {
      impact: { label: '성과와 수치', point: '결과 수치와 전후 비교를 바로 말할 준비' },
      ownership: { label: '주도성과 책임', point: '누가 시켜서가 아니라 왜 직접 움직였는지 설명' },
      collaboration: { label: '협업과 조율', point: '갈등, 설득, 합의 방식까지 구체화' },
      learning: { label: '실패와 학습', point: '실수 인정 + 다음 행동 변화까지 연결' }
    };

    const makeQuestionBlock = (idx, q, intent, tip) => `${idx}. 예상 꼬리질문\n- 질문: ${q}\n- 질문 의도: ${intent}\n- 답변 포인트: ${tip}`;

    const build = () => {
      const raw = (input.value || '').trim();
      if (!raw) {
        output.value = '';
        count.textContent = '0';
        roleOut.textContent = '-';
        focusOut.textContent = '-';
        depth.textContent = '-';
        help.textContent = '먼저 핵심 답변이나 경험 요약을 입력하세요.';
        return;
      }
      const roleInfo = roleMap[role.value] || roleMap.pm;
      const levelInfo = levelMap[level.value] || levelMap.junior;
      const typeInfo = typeMap[type.value] || typeMap.behavior;
      const focusInfo = focusMap[focus.value] || focusMap.impact;
      const hasNumber = /\d/.test(raw);
      const hasTeam = /(팀|협업|디자인|개발|운영|마케팅|stakeholder|동료|부서)/i.test(raw);
      const hasProblem = /(문제|장애|갈등|이슈|실패|지연|리스크|오류)/i.test(raw);

      const questions = [];
      questions.push({
        q: roleInfo.specifics[0],
        intent: `${roleInfo.lens} 관점에서 실제 판단 근거를 확인하려는 질문`,
        tip: `${levelInfo.ask}를 1~2문장으로 먼저 말하고, 상황-행동-결과 순으로 짧게 정리하세요.`
      });
      questions.push({
        q: typeInfo.asks[0],
        intent: `${typeInfo.label}에서 맥락과 난도를 검증하려는 질문`,
        tip: `당시 제약조건, 선택지, 최종 판단 이유를 빠르게 연결하세요.`
      });
      questions.push({
        q: hasTeam ? '협업 과정에서 가장 의견이 갈렸던 지점은 무엇이었고 어떻게 정리했나요?' : '이 과정에서 다른 사람의 도움 없이 본인이 직접 주도한 부분은 정확히 어디였나요?',
        intent: '본인 기여 범위와 협업 설득력을 확인하려는 질문',
        tip: `${hasTeam ? '누구와 어떤 관점이 달랐는지, 최종 합의 기준이 무엇이었는지' : '직접 분석·실행·조정한 행동'}를 구체적으로 말하세요.`
      });
      if (metric.checked) {
        questions.push({
          q: hasNumber ? '방금 말한 수치가 의미 있는 개선이라고 볼 수 있는 기준은 무엇이었나요?' : '성과를 수치로 바꾸면 어떤 지표로 설명할 수 있나요?',
          intent: '결과를 객관적 근거로 설명할 수 있는지 확인하려는 질문',
          tip: `${hasNumber ? '비교 기준과 측정 기간' : '전환율, 시간 단축, 오류 감소, 만족도 등'} 중 하나로 환산해 답변을 준비하세요.`
        });
      }
      if (risk.checked) {
        questions.push({
          q: hasProblem ? '그 문제를 처리하면서 놓쳤던 부분이나 아쉬운 판단은 무엇이었나요?' : '같은 상황이 다시 오면 이번에는 무엇을 다르게 하겠나요?',
          intent: '실패 인식, 리스크 감도, 학습 능력을 확인하려는 질문',
          tip: '변명보다 배운 점과 다음 행동 변화를 분리해서 말하면 좋습니다.'
        });
      }
      while (questions.length < 5) {
        questions.push({
          q: typeInfo.asks[1] || roleInfo.specifics[1],
          intent: `${focusInfo.label} 관점에서 답변 깊이를 더 보려는 질문`,
          tip: `${focusInfo.point}.` 
        });
      }

      const uniqueQuestions = questions.slice(0, 5);
      const summaryLines = [
        `면접 포커스: ${roleInfo.label} / ${levelInfo.label} / ${typeInfo.label}`,
        `강조 포인트: ${focusInfo.label}`,
        `핵심 답변 요약: ${raw}`,
        '',
        ...uniqueQuestions.map((item, index) => makeQuestionBlock(index + 1, item.q, item.intent, item.tip)),
        '',
        '[셀프 체크]',
        `- 수치, 본인 기여, 선택 근거, 아쉬운 점 중 바로 답이 안 나오는 항목이 있는지 확인하세요.`,
        `- 예상 압박 포인트: ${levelInfo.pressure}`
      ];

      output.value = summaryLines.join('\n');
      count.textContent = String(uniqueQuestions.length);
      roleOut.textContent = roleInfo.label;
      focusOut.textContent = focusInfo.label;
      depth.textContent = levelInfo.pressure;
      help.textContent = '생성된 질문을 보고 30초 답변과 1분 답변을 각각 말해보세요.';
    };

    run.addEventListener('click', build);
    sample.addEventListener('click', () => {
      role.value = 'pm';
      level.value = 'mid';
      type.value = 'project';
      focus.value = 'impact';
      metric.checked = true;
      risk.checked = true;
      input.value = '결제 단계 이탈이 높던 서비스를 맡아 퍼널 데이터를 다시 분석했고, 체크아웃 단계를 5단계에서 3단계로 줄였습니다. 디자인과 개발 일정이 충돌했지만 핵심 가설부터 먼저 검증하도록 우선순위를 조정했고, 2주 뒤 AB 테스트에서 전환율이 12% 상승했습니다.';
      build();
    });
    copy.addEventListener('click', async () => {
      if (!output.value) build();
      if (!output.value) return;
      try {
        await navigator.clipboard.writeText(output.value);
        help.textContent = '결과를 복사했어요. 소리 내어 모의답변해보면 더 좋습니다.';
      } catch (err) {
        help.textContent = '복사에 실패했어요. 결과창에서 직접 복사해 주세요.';
      }
    });
  }

  if (slug === 'secondhand-price-message-generator') {
    const roleEl = document.getElementById('spmg-role');
    const situationEl = document.getElementById('spmg-situation');
    const toneEl = document.getElementById('spmg-tone');
    const targetEl = document.getElementById('spmg-target');
    const itemEl = document.getElementById('spmg-item');
    const priceEl = document.getElementById('spmg-price');
    const conditionEl = document.getElementById('spmg-condition');
    const placeEl = document.getElementById('spmg-place');
    const extraEl = document.getElementById('spmg-extra');
    const greetEl = document.getElementById('spmg-greet');
    const closeEl = document.getElementById('spmg-close');
    const runBtn = document.getElementById('spmg-run');
    const sampleBtn = document.getElementById('spmg-sample');
    const copyBtn = document.getElementById('spmg-copy');
    const roleOutEl = document.getElementById('spmg-role-out');
    const toneOutEl = document.getElementById('spmg-tone-out');
    const situationOutEl = document.getElementById('spmg-situation-out');
    const variantCountEl = document.getElementById('spmg-variant-count');
    const helpEl = document.getElementById('spmg-help');
    const outputEl = document.getElementById('spmg-output');
    if (!roleEl || !situationEl || !toneEl || !targetEl || !itemEl || !priceEl || !conditionEl || !placeEl || !extraEl || !greetEl || !closeEl || !runBtn || !sampleBtn || !copyBtn || !roleOutEl || !toneOutEl || !situationOutEl || !variantCountEl || !helpEl || !outputEl) return;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const roleLabels = { buyer: '구매자', seller: '판매자' };
    const toneLabels = { polite: '정중', neutral: '보통', friendly: '친근' };
    const situationLabels = {
      offer: '가격 제안',
      accept: '제안 수락',
      decline: '가격 거절',
      hold: '예약 요청 / 홀드',
      bundle: '묶음 거래 제안'
    };

    const greet = (target, tone) => {
      if (!greetEl.checked) return '';
      if (target) return `${target} 안녕하세요.`;
      if (tone === 'friendly') return '안녕하세요!';
      return '안녕하세요.';
    };

    const closing = (tone) => {
      if (!closeEl.checked) return '';
      if (tone === 'friendly') return '가능하시면 편하게 답 주세요 🙂';
      if (tone === 'polite') return '가능 여부 편하실 때 답 주시면 감사하겠습니다.';
      return '가능 여부 답 주시면 감사하겠습니다.';
    };

    const buildBody = (role, situation, item, price, condition, place, extra, tone) => {
      const itemText = item || '물품';
      const priceText = price || '가격';
      const conditionLine = condition ? `${condition}` : '';
      const placeLine = place ? `${place}` : '';
      const extraLine = extra ? `${extra}` : '';

      const map = {
        buyer: {
          offer: [
            `${itemText} 보고 연락드렸어요. ${priceText} 조건으로 거래 가능하실까요?`,
            conditionLine,
            placeLine,
            extraLine
          ],
          accept: [
            `${itemText} ${priceText} 조건으로 진행하고 싶습니다.`,
            placeLine,
            extraLine
          ],
          decline: [
            `${itemText} 상태와 조건은 좋지만 이번에는 가격이 조금 부담되어 보류하려고 합니다.`,
            conditionLine,
            extraLine
          ],
          hold: [
            `${itemText} 구매 의사가 있는데 ${priceText} 조건으로 잠시 예약 가능할까요?`,
            placeLine,
            extraLine
          ],
          bundle: [
            `${itemText} 포함해 묶음으로 보고 있어요. ${priceText} 조건이면 한 번에 진행 가능할까요?`,
            conditionLine,
            placeLine,
            extraLine
          ]
        },
        seller: {
          offer: [
            `${itemText} 문의 주셔서 감사합니다. ${priceText} 조건이면 거래 가능합니다.`,
            conditionLine,
            placeLine,
            extraLine
          ],
          accept: [
            `${itemText} 제안해주신 ${priceText} 조건으로 진행 가능합니다.`,
            placeLine,
            extraLine
          ],
          decline: [
            `${itemText} 문의 감사합니다. 현재는 ${priceText} 이하로는 진행이 어려운 점 양해 부탁드립니다.`,
            conditionLine,
            extraLine
          ],
          hold: [
            `${itemText}는 ${priceText} 조건으로 오늘까지 예약은 가능합니다.`,
            placeLine,
            extraLine
          ],
          bundle: [
            `${itemText} 포함 묶음 거래는 ${priceText} 조건이면 가능합니다.`,
            conditionLine,
            placeLine,
            extraLine
          ]
        }
      };

      return (map[role]?.[situation] || []).filter(Boolean).join(' ');
    };

    const soften = (text, tone) => {
      if (tone === 'friendly') return text.replace(/감사하겠습니다\./g, '감사해요!').replace(/가능합니다\./g, '가능해요.');
      if (tone === 'neutral') return text.replace(/양해 부탁드립니다\./g, '양해 부탁드려요.');
      return text;
    };

    const generate = () => {
      const role = roleEl.value || 'buyer';
      const situation = situationEl.value || 'offer';
      const tone = toneEl.value || 'polite';
      const target = (targetEl.value || '').trim();
      const item = (itemEl.value || '').trim();
      const price = (priceEl.value || '').trim();
      const condition = (conditionEl.value || '').trim();
      const place = (placeEl.value || '').trim();
      const extra = (extraEl.value || '').trim();

      const head = greet(target, tone);
      const body = soften(buildBody(role, situation, item, price, condition, place, extra, tone), tone);
      const tail = closing(tone);
      const concise = [head, body, tail].filter(Boolean).join(' ');
      const balanced = [head, body, tail].filter(Boolean).join('\n');
      const safer = [
        head,
        body,
        situation === 'decline' ? '무리하게 맞추기보다는 서로 편한 조건에서 거래하면 좋겠습니다.' : '조건이 맞으면 빠르게 일정 맞춰 거래 진행하겠습니다.',
        tail
      ].filter(Boolean).join('\n');

      outputEl.value = [
        '[짧은형]',
        concise,
        '',
        '[기본형]',
        balanced,
        '',
        '[완충형]',
        safer
      ].join('\n');

      roleOutEl.textContent = roleLabels[role] || '-';
      toneOutEl.textContent = toneLabels[tone] || '-';
      situationOutEl.textContent = situationLabels[situation] || '-';
      variantCountEl.textContent = '3';
      helpEl.textContent = `${roleLabels[role]} 입장에서 ${situationLabels[situation]} 문구 3가지를 만들었습니다.`;
    };

    sampleBtn.addEventListener('click', () => {
      roleEl.value = 'buyer';
      situationEl.value = 'offer';
      toneEl.value = 'polite';
      targetEl.value = '판매자님';
      itemEl.value = '에어팟 프로 2세대';
      priceEl.value = '10만 원';
      conditionEl.value = '사진상 상태가 좋아 보여서 바로 거래 가능해요';
      placeEl.value = '오늘 저녁 강남역 직거래 가능합니다';
      extraEl.value = '박스 포함이면 더 좋습니다';
      greetEl.checked = true;
      closeEl.checked = true;
      generate();
    });

    runBtn.addEventListener('click', generate);
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) generate();
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });
    [roleEl, situationEl, toneEl, targetEl, itemEl, priceEl, conditionEl, placeEl, extraEl, greetEl, closeEl].forEach((el) => {
      el.addEventListener('input', generate);
      el.addEventListener('change', generate);
    });

    generate();
  }

  if (slug === 'lunch-menu-picker') {
    const timeEl = document.getElementById('lmp-time');
    const companyEl = document.getElementById('lmp-company');
    const budgetEl = document.getElementById('lmp-budget');
    const moodEl = document.getElementById('lmp-mood');
    const hotEl = document.getElementById('lmp-hot');
    const riceEl = document.getElementById('lmp-rice');
    const runBtn = document.getElementById('lmp-run');
    const copyBtn = document.getElementById('lmp-copy');
    const countEl = document.getElementById('lmp-count');
    const topTagEl = document.getElementById('lmp-top-tag');
    const budgetTagEl = document.getElementById('lmp-budget-tag');
    const formatEl = document.getElementById('lmp-format');
    const outputEl = document.getElementById('lmp-output');
    const helpEl = document.getElementById('lmp-help');
    if (!timeEl || !companyEl || !budgetEl || !moodEl || !hotEl || !riceEl || !runBtn || !copyBtn || !countEl || !topTagEl || !budgetTagEl || !formatEl || !outputEl || !helpEl) return;

    const labelMap = { comfort: '든든', fresh: '가벼움', spicy: '자극적', fast: '빨리 먹기', social: '같이 먹기' };
    const menus = [
      { name: '김치찌개', time: ['lunch', 'dinner'], company: ['solo', 'pair', 'team'], budget: ['light', 'mid'], moods: ['comfort', 'spicy', 'fast'], hot: true, rice: true },
      { name: '제육볶음', time: ['lunch', 'dinner'], company: ['solo', 'pair', 'team'], budget: ['light', 'mid'], moods: ['comfort', 'spicy'], hot: true, rice: true },
      { name: '비빔밥', time: ['lunch', 'dinner'], company: ['solo', 'pair'], budget: ['light', 'mid'], moods: ['fresh', 'fast'], hot: false, rice: true },
      { name: '샐러드 포케', time: ['lunch', 'dinner'], company: ['solo', 'pair'], budget: ['mid', 'high'], moods: ['fresh', 'fast'], hot: false, rice: false },
      { name: '쌀국수', time: ['lunch', 'dinner'], company: ['solo', 'pair', 'team'], budget: ['mid'], moods: ['fresh', 'comfort'], hot: true, rice: false },
      { name: '마라탕', time: ['lunch', 'dinner', 'late'], company: ['pair', 'team'], budget: ['mid', 'high'], moods: ['spicy', 'social'], hot: true, rice: false },
      { name: '초밥', time: ['lunch', 'dinner'], company: ['pair', 'team'], budget: ['mid', 'high'], moods: ['fresh', 'social'], hot: false, rice: true },
      { name: '돈까스', time: ['lunch', 'dinner'], company: ['solo', 'pair'], budget: ['light', 'mid'], moods: ['comfort', 'fast'], hot: true, rice: true },
      { name: '파스타', time: ['lunch', 'dinner'], company: ['pair', 'team'], budget: ['mid', 'high'], moods: ['social', 'fresh'], hot: true, rice: false },
      { name: '햄버거', time: ['lunch', 'dinner', 'late'], company: ['solo', 'pair'], budget: ['light', 'mid'], moods: ['fast'], hot: true, rice: false },
      { name: '국밥', time: ['lunch', 'dinner', 'late'], company: ['solo', 'pair'], budget: ['light', 'mid'], moods: ['comfort', 'fast'], hot: true, rice: true },
      { name: '칼국수', time: ['lunch', 'dinner'], company: ['solo', 'pair', 'team'], budget: ['light', 'mid'], moods: ['comfort'], hot: true, rice: false },
      { name: '분식 세트', time: ['lunch', 'late'], company: ['solo', 'pair'], budget: ['light'], moods: ['fast', 'spicy'], hot: true, rice: false },
      { name: '삼겹살', time: ['dinner'], company: ['pair', 'team'], budget: ['high'], moods: ['social', 'comfort'], hot: true, rice: true },
      { name: '냉면', time: ['lunch', 'dinner'], company: ['solo', 'pair'], budget: ['light', 'mid'], moods: ['fresh'], hot: false, rice: false },
      { name: '샤브샤브', time: ['dinner'], company: ['pair', 'team'], budget: ['high'], moods: ['social', 'fresh'], hot: true, rice: false },
      { name: '도시락 / 덮밥', time: ['lunch', 'dinner'], company: ['solo', 'pair'], budget: ['light'], moods: ['fast', 'comfort'], hot: true, rice: true },
      { name: '타코 / 브리또', time: ['lunch', 'dinner'], company: ['pair', 'team'], budget: ['mid'], moods: ['fresh', 'social'], hot: false, rice: false }
    ];

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const scoreMenu = (menu, state) => {
      let score = 0;
      if (state.time === 'any' || menu.time.includes(state.time)) score += 3;
      if (state.company === 'any' || menu.company.includes(state.company)) score += 2;
      if (state.budget === 'any' || menu.budget.includes(state.budget)) score += 3;
      if (state.mood === 'any' || menu.moods.includes(state.mood)) score += 4;
      if (!state.wantHot && menu.hot) score -= 1;
      if (!state.wantRice && menu.rice) score -= 1;
      return score;
    };

    const generate = () => {
      const state = {
        time: timeEl.value || 'lunch',
        company: companyEl.value || 'solo',
        budget: budgetEl.value || 'mid',
        mood: moodEl.value || 'comfort',
        wantHot: !!hotEl.checked,
        wantRice: !!riceEl.checked
      };

      let ranked = menus.map((menu) => ({ ...menu, score: scoreMenu(menu, state) }))
        .filter((menu) => menu.score >= 4)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ko'));

      if (!state.wantHot) ranked = ranked.filter((menu) => !menu.hot || menu.score >= 7);
      if (!state.wantRice) ranked = ranked.filter((menu) => !menu.rice || menu.score >= 7);
      if (!ranked.length) {
        ranked = menus.map((menu) => ({ ...menu, score: scoreMenu(menu, { ...state, mood: 'any', budget: 'any' }) }))
          .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ko'));
      }

      const picks = ranked.slice(0, 3);
      const lines = [];
      lines.push('[오늘 뭐 먹지? 메뉴 추천 결과]');
      lines.push(`- 식사 상황: ${timeEl.options[timeEl.selectedIndex].text}`);
      lines.push(`- 함께 먹는 사람: ${companyEl.options[companyEl.selectedIndex].text}`);
      lines.push(`- 예산: ${budgetEl.options[budgetEl.selectedIndex].text}`);
      lines.push(`- 원하는 분위기: ${moodEl.options[moodEl.selectedIndex].text}`);
      lines.push('');
      picks.forEach((pick, index) => {
        const tags = [];
        if (pick.hot) tags.push('뜨끈함');
        if (pick.rice) tags.push('밥류');
        tags.push(...pick.moods.slice(0, 2).map((m) => labelMap[m] || m));
        lines.push(`${index + 1}. ${pick.name} — ${tags.join(' · ')}`);
      });
      lines.push('');
      lines.push('고르기 팁');
      lines.push('- 빨리 정해야 하면 1번부터, 여럿이 먹는 자리면 social 성향 메뉴를 먼저 보세요.');
      lines.push('- 너무 무거운 메뉴가 싫으면 fresh, 든든하게 먹고 싶으면 comfort 성향 메뉴가 잘 맞습니다.');

      outputEl.value = lines.join('\n');
      countEl.textContent = String(ranked.length);
      topTagEl.textContent = moodEl.options[moodEl.selectedIndex].text;
      budgetTagEl.textContent = budgetEl.options[budgetEl.selectedIndex].text;
      formatEl.textContent = '복사형 추천 리스트';
      helpEl.textContent = picks.length ? `${picks.map((pick) => pick.name).join(', ')} 순으로 추천했어요.` : '조건을 조금 완화해서 다시 추천해보세요.';
    };

    [timeEl, companyEl, budgetEl, moodEl, hotEl, riceEl].forEach((el) => {
      el.addEventListener('input', generate);
      el.addEventListener('change', generate);
    });
    runBtn.addEventListener('click', generate);
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) generate();
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    generate();
  }

  if (slug === 'text-line-break-cleaner') {
    const input = document.getElementById('tlbc-input');
    const output = document.getElementById('tlbc-output');
    const trim = document.getElementById('tlbc-trim');
    const spaces = document.getElementById('tlbc-spaces');
    const blank = document.getElementById('tlbc-blank');
    const join = document.getElementById('tlbc-join');
    const bullets = document.getElementById('tlbc-bullets');
    const bulletStyle = document.getElementById('tlbc-bullet-style');
    const runBtn = document.getElementById('tlbc-run');
    const sampleBtn = document.getElementById('tlbc-sample');
    const copyBtn = document.getElementById('tlbc-copy');
    const linesIn = document.getElementById('tlbc-lines-in');
    const linesOut = document.getElementById('tlbc-lines-out');
    const charsOut = document.getElementById('tlbc-chars-out');
    const changesEl = document.getElementById('tlbc-changes');
    const help = document.getElementById('tlbc-help');

    if (!input || !output || !trim || !spaces || !blank || !join || !bullets || !bulletStyle || !runBtn || !sampleBtn || !copyBtn || !linesIn || !linesOut || !charsOut || !changesEl || !help) return;

    const tlbcText = {
      ko: {
        idle: '텍스트를 붙여넣고 정리 옵션을 고르면 복붙 흔적을 빠르게 다듬습니다.',
        copied: '복사됨',
        copyDefault: '결과 복사', mustDo: '필수 작업',
        summary: (n) => `선택한 정리 옵션 ${n}개를 적용했습니다. 결과를 한 번 더 눈으로 확인해 보세요.`
      },
      en: {
        idle: 'Paste text and choose cleanup options to tidy copied formatting quickly.',
        copied: 'Copied',
        copyDefault: 'Copy result', mustDo: 'Must-do',
        summary: (n) => `Applied ${n} selected cleanup option(s). Review the result once before using it.`
      },
      ja: {
        idle: 'テキストを貼り付けて整形オプションを選ぶと、コピー時の崩れをすばやく整えます。',
        copied: 'コピー完了',
        copyDefault: '結果をコピー', mustDo: '必須タスク',
        summary: (n) => `選択した整形オプション ${n} 件を適用しました。使用前に一度結果を確認してください。`
      }
    }[pageLang] || {
      idle: '텍스트를 붙여넣고 정리 옵션을 고르면 복붙 흔적을 빠르게 다듬습니다.',
      copied: '복사됨',
      copyDefault: '결과 복사',
      summary: (n) => `선택한 정리 옵션 ${n}개를 적용했습니다. 결과를 한 번 더 눈으로 확인해 보세요.`
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

    const isBulletLine = (line) => /^\s*([-*•]|\d+[.)])\s+/.test(line);
    const isHeadingLine = (line) => /^\s*#{1,6}\s+/.test(line) || /^\s*\[[^\]]+\]\s*$/.test(line);
    const looksSentenceEnd = (line) => /[.!?。！？…:：]$/.test(line.trim());

    const clean = () => {
      const selectedCount = [trim.checked, spaces.checked, blank.checked, join.checked, bullets.checked].filter(Boolean).length;
      const original = input.value || '';
      const originalLines = original === '' ? [] : original.replace(/\r\n?/g, '\n').split('\n');
      let lines = [...originalLines];

      if (trim.checked) {
        lines = lines.map((line) => line.trim());
      }

      if (spaces.checked) {
        lines = lines.map((line) => line.replace(/[ \t]{2,}/g, ' '));
      }

      if (bullets.checked) {
        const style = bulletStyle.value || '-';
        lines = lines.map((line) => line.replace(/^\s*([-*•])\s+/, `${style} `));
      }

      if (join.checked) {
        const merged = [];
        lines.forEach((line) => {
          const current = line || '';
          const prev = merged.length ? merged[merged.length - 1] : null;
          const currentTrim = current.trim();
          if (!currentTrim) {
            merged.push('');
            return;
          }
          if (!prev || !prev.trim()) {
            merged.push(currentTrim);
            return;
          }
          if (isBulletLine(currentTrim) || isBulletLine(prev) || isHeadingLine(currentTrim) || isHeadingLine(prev) || looksSentenceEnd(prev)) {
            merged.push(currentTrim);
            return;
          }
          merged[merged.length - 1] = `${prev.trim()} ${currentTrim}`.replace(/[ \t]{2,}/g, ' ');
        });
        lines = merged;
      }

      if (blank.checked) {
        const compact = [];
        let blankSeen = false;
        lines.forEach((line) => {
          if ((line || '').trim() === '') {
            if (!blankSeen) compact.push('');
            blankSeen = true;
          } else {
            compact.push(line);
            blankSeen = false;
          }
        });
        while (compact.length && compact[0] === '') compact.shift();
        while (compact.length && compact[compact.length - 1] === '') compact.pop();
        lines = compact;
      }

      const result = lines.join('\n');
      output.value = result;
      linesIn.textContent = formatNum(originalLines.length);
      linesOut.textContent = formatNum(result ? result.split('\n').length : 0);
      charsOut.textContent = formatNum(result.length);
      changesEl.textContent = formatNum(selectedCount);
      help.textContent = tlbcText.summary(selectedCount);
    };

    sampleBtn.addEventListener('click', () => {
      input.value = "  회의 공지 초안  \n\n- 안건 1\n* 안건 2\n• 안건 3\n\nPDF에서 복사한 문장이라\n줄마다 강제로\n끊겨 보입니다.\n\n\n참석 가능 여부를\n금요일까지 알려주세요.  ";
      clean();
    });

    runBtn.addEventListener('click', clean);
    [input, trim, spaces, blank, join, bullets, bulletStyle].forEach((el) => {
      el?.addEventListener('input', clean);
      el?.addEventListener('change', clean);
    });

    copyBtn.addEventListener('click', async () => {
      if (!output.value.trim()) clean();
      if (!output.value.trim()) return;
      await copyText(output.value);
      const old = copyBtn.textContent;
      copyBtn.textContent = tlbcText.copied;
      setTimeout(() => { copyBtn.textContent = old || tlbcText.copyDefault; }, 900);
    });

    linesIn.textContent = '0';
    linesOut.textContent = '0';
    charsOut.textContent = '0';
    changesEl.textContent = formatNum([trim.checked, spaces.checked, blank.checked, join.checked, bullets.checked].filter(Boolean).length);
    help.textContent = tlbcText.idle;
  }

  if (slug === 'blog-banned-word-checker') {
    const input = document.getElementById('bw-input');
    const summary = document.getElementById('bw-summary');
    const list = document.getElementById('bw-list');
    const totalEl = document.getElementById('bw-total');
    const spamEl = document.getElementById('bw-spam');
    const claimEl = document.getElementById('bw-claim');
    const linkEl = document.getElementById('bw-link');
    const charsEl = document.getElementById('bw-chars');
    const sampleBtn = document.getElementById('bw-sample');
    const copyBtn = document.getElementById('bw-copy');
    const clearBtn = document.getElementById('bw-clear');
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
        tooLong: '최대 20,000자까지만 검사합니다. 글을 나누어 점검해 주세요.',
        highRisk: (n) => `위험도 높음: 총 ${n}건 감지. 스팸성/과장 표현을 적극 수정하세요.`,
        caution: (n) => `주의 필요: 총 ${n}건 감지. 반복 키워드·링크·표현을 정리하세요.`,
        mild: (n) => `경미한 주의: ${n}건 감지. 문맥 중심으로 자연스럽게 다듬으세요.`,
        clean: '감지 항목이 없습니다. 그래도 문맥/정보가치 중심으로 최종 검수하세요.',
        copied: '점검 결과를 복사했습니다.',
        copyFail: '자동 복사를 사용할 수 없습니다.',
        cleared: '입력값을 초기화했습니다.',
        sample: '이 제품은 100% 효과 보장! 지금 무료체험 신청하면 최저가로 당일지급 혜택을 받을 수 있습니다. 자세한 문의는 카카오톡 ID toolog 또는 https://bit.ly/sample 에서 확인하세요. #추천 #추천 #최저가 #이벤트 #대박 #후기 #후기 #광고'
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
        tooLong: 'Only the first 20,000 characters can be checked. Split longer drafts into sections.',
        highRisk: (n) => `High risk: ${n} hits detected. Rewrite spammy or overclaim wording aggressively.`,
        caution: (n) => `Needs attention: ${n} hits detected. Clean repetitive keywords, links, and tone.`,
        mild: (n) => `Mild caution: ${n} hit(s) detected. Smooth out wording with context-first edits.`,
        clean: 'No detected issue. Still run a final review for context and information value.',
        copied: 'Copied the scan checklist.',
        copyFail: 'Automatic copy is unavailable.',
        cleared: 'Cleared the text.',
        sample: 'This offer is 100% guaranteed with no risk. Get a free trial and guaranteed profit today. Contact telegram @toolog or visit https://bit.ly/sample now. #best #best #sale #promo #review #review #deal #deal'
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
        tooLong: '最大20,000文字まで点検できます。長い文章は分けて確認してください。',
        highRisk: (n) => `高リスク: 合計${n}件を検出。スパム的・誇大な表現を積極的に修正してください。`,
        caution: (n) => `要注意: 合計${n}件を検出。反復キーワード・リンク・表現を整理してください。`,
        mild: (n) => `軽度注意: ${n}件を検出。文脈を意識して自然な表現に整えてください。`,
        clean: '検出項目はありません。最終的に文脈と情報価値の観点で見直してください。',
        copied: 'チェック結果をコピーしました。',
        copyFail: '自動コピーを利用できません。',
        cleared: '入力をクリアしました。',
        sample: 'この商品は絶対におすすめ。無料体験で必ず高収益、ノーリスクです。連絡はテレグラム @toolog または https://bit.ly/sample へ。#おすすめ #おすすめ #最安値 #レビュー #レビュー #広告 #副業 #無料体験'
      }
    };
    const t = bwI18n[pageLang] || bwI18n.ko;

    const rules = [
      { cat: t.catSpamPromo, tag: 'spam', re: /(대출|도박|성인물|카지노|바카라|급전|무료체험|최저가|특가|당일지급|고수익|부업문의|재택알바|loan|casino|gambling|adult\s?content|free\s?trial|guaranteed\s?profit|side\s?hustle|副業|無料体験|最安値|即日支給|高収益)/gi },
      { cat: t.catOverclaim, tag: 'claim', re: /(무조건|100%|완치|치료|암\s*예방|직빵|평생보장|절대\s*손해\s*없음|보장수익|guaranteed|cure|always|no\s?risk|risk[-\s]?free|絶対|完治|必ず|ノーリスク)/gi },
      { cat: t.catAbuse, tag: 'spam', re: /(강추\s*강추|최저가\s*최저가|후기\s*후기|추천\s*추천|best\s*best|must\s*buy\s*must\s*buy|おすすめ\s*おすすめ)/gi },
      { cat: t.catContact, tag: 'link', re: /(\b01[0-9][-\s]?[0-9]{3,4}[-\s]?[0-9]{4}\b|카카오톡\s*ID|카톡\s*아이디|오픈채팅|텔레그램\s*@?[\w.-]+|kakao\s?talk\s?id|line\s?id|telegram\s*@?[\w.-]+|open\s?chat|連絡先|オープンチャット|テレグラム\s*@?[\w.-]+)/gi },
      { cat: t.catLinks, tag: 'link', re: /(https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+)/gi }
    ];

    const repetitionCheck = (text) => {
      const words = (text.match(/[가-힣A-Za-zぁ-んァ-ン一-龥]{2,}/g) || [])
        .map((w) => w.toLowerCase())
        .filter((w) => !/^(그리고|하지만|그리고요|the|and|for|with|this|that|です|ます|する)$/.test(w));
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
      const charCount = [...text].length;
      list.innerHTML = '';
      let total = 0, spam = 0, claim = 0, link = 0;
      const copyLines = [];
      if (charsEl) charsEl.textContent = formatNum(charCount);
      input.setAttribute('aria-invalid', charCount > 20000 ? 'true' : 'false');

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
        item.innerHTML = `<strong>${rule.cat}<span class="bw-tag">${formatNum(matches.length)}${t.countHit}</span></strong><p></p>`;
        item.querySelector('p').textContent = uniq;
        list.appendChild(item);
        copyLines.push(`${rule.cat}: ${uniq}`);
      });

      const rep = repetitionCheck(text);
      if (rep.bad.length) {
        const item = document.createElement('div');
        item.className = 'bw-item';
        const view = rep.bad.map(([w,n]) => `${w}(${n}${t.countTimes})`).join(', ');
        item.innerHTML = `<strong>${t.catRepeat}<span class="bw-tag">${formatNum(rep.bad.length)}${t.countItem}</span></strong><p></p>`;
        item.querySelector('p').textContent = view;
        list.appendChild(item);
        copyLines.push(`${t.catRepeat}: ${view}`);
        total += rep.bad.length;
        spam += rep.bad.length;
      }

      const hs = hashtagCheck(text);
      if (hs.over) {
        const item = document.createElement('div');
        item.className = 'bw-item';
        item.innerHTML = `<strong>${t.catHashtag}<span class="bw-tag">${formatNum(hs.tags.length)}${t.countItem}</span></strong><p></p>`;
        item.querySelector('p').textContent = t.hashtagDetail;
        list.appendChild(item);
        copyLines.push(`${t.catHashtag}: ${t.hashtagDetail}`);
        total += hs.tags.length;
        spam += hs.tags.length;
      }

      if (!total) {
        list.innerHTML = `<div class="empty-state">${t.emptyState}</div>`;
      }

      totalEl.textContent = formatNum(total);
      spamEl.textContent = formatNum(spam);
      claimEl.textContent = formatNum(claim);
      linkEl.textContent = formatNum(link);
      if (copyBtn) {
        copyBtn.disabled = !text.trim();
        copyBtn.dataset.copyText = copyLines.length ? copyLines.join('\n') : t.clean;
      }

      if (summary) {
        summary.dataset.state = '';
        if (!text.trim()) summary.textContent = t.idle;
        else if (charCount > 20000) {
          summary.textContent = t.tooLong;
          summary.dataset.state = 'error';
        }
        else if (total >= 15) summary.textContent = t.highRisk(total);
        else if (total >= 6) summary.textContent = t.caution(total);
        else if (total > 0) summary.textContent = t.mild(total);
        else summary.textContent = t.clean;
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

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(render, 80);
    });
    sampleBtn?.addEventListener('click', () => {
      input.value = t.sample;
      render();
      input.focus();
    });
    clearBtn?.addEventListener('click', () => {
      input.value = '';
      render();
      if (summary) summary.textContent = t.cleared;
      input.focus();
    });
    copyBtn?.addEventListener('click', async () => {
      try {
        await copyText(copyBtn.dataset.copyText || t.clean);
        if (summary) summary.textContent = t.copied;
      } catch (_) {
        if (summary) {
          summary.textContent = t.copyFail;
          summary.dataset.state = 'error';
        }
      }
    });
    render();
  }

  if (slug === 'filename-sanitizer') {
    const input = document.getElementById('fs-input');
    const separatorEl = document.getElementById('fs-separator');
    const caseEl = document.getElementById('fs-case');
    const dateEnabledEl = document.getElementById('fs-date-enabled');
    const dateEl = document.getElementById('fs-date');
    const numberEnabledEl = document.getElementById('fs-number-enabled');
    const numberStartEl = document.getElementById('fs-number-start');
    const removeEmojiEl = document.getElementById('fs-remove-emoji');
    const keepExtensionEl = document.getElementById('fs-keep-extension');
    const sampleBtn = document.getElementById('fs-sample');
    const copyBtn = document.getElementById('fs-copy');
    const inputCountEl = document.getElementById('fs-input-count');
    const outputCountEl = document.getElementById('fs-output-count');
    const changedCountEl = document.getElementById('fs-changed-count');
    const duplicateCountEl = document.getElementById('fs-duplicate-count');
    const summaryEl = document.getElementById('fs-summary');
    const outputEl = document.getElementById('fs-output');
    if (!input || !separatorEl || !caseEl || !dateEnabledEl || !dateEl || !numberEnabledEl || !numberStartEl || !removeEmojiEl || !keepExtensionEl || !sampleBtn || !copyBtn || !inputCountEl || !outputCountEl || !changedCountEl || !duplicateCountEl || !summaryEl || !outputEl) return;

    const t = {
      sample: '최종 발표 자료 v3!.pptx\n브랜드 소개서 2026 수정본.pdf\n회의 캡처 😀 04-27.png\n고객전달용 견적서(최종)(진짜최종).xlsx',
      idle: '파일명 목록을 붙여넣으면 공백, 특수문자, 순번 규칙을 한 번에 정리합니다.',
      copied: '복사됨',
      copyDefault: '결과 복사',
      summary: (changed, dupes) => changed ? `총 ${changed}개 항목을 정리했고, 중복 파일명 후보는 ${dupes}개입니다.` : `이미 비교적 정돈된 파일명입니다. 중복 후보 ${dupes}개를 확인해 보세요.`,
      empty: '정리된 파일명 목록이 여기에 표시됩니다.'
    };

    const setToday = () => {
      if (dateEl.value) return;
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateEl.value = local;
    };
    setToday();

    const pad = (n) => String(n).padStart(2, '0');
    const formatDatePrefix = (value) => {
      if (!value) return '';
      const [y, m, d] = value.split('-');
      if (!y || !m || !d) return '';
      return `${y}-${m}-${d}`;
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const splitExt = (line) => {
      if (!keepExtensionEl.checked) return { base: line, ext: '' };
      const match = line.match(/^(.*?)(\.[A-Za-z0-9]{1,8})$/);
      if (!match) return { base: line, ext: '' };
      return { base: match[1], ext: match[2] };
    };

    const sanitizeBase = (text, separator) => {
      let value = text.normalize('NFKC').trim();
      if (removeEmojiEl.checked) {
        value = value.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ');
      }
      value = value
        .replace(/[“”"'`]+/g, ' ')
        .replace(/[()\[\]{}<>]+/g, ' ')
        .replace(/[\/\\|:;,+*&^%$#@!?~=]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (caseEl.value === 'lower') value = value.toLowerCase();
      if (caseEl.value === 'upper') value = value.toUpperCase();

      const joiner = separator || '';
      value = value.replace(/[\s._-]+/g, joiner || '');
      if (separator) {
        const escaped = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        value = value.replace(new RegExp(`${escaped}{2,}`, 'g'), separator);
        value = value.replace(new RegExp(`^${escaped}|${escaped}$`, 'g'), '');
      }

      value = value.replace(/^[._-]+|[._-]+$/g, '');
      return value || 'untitled';
    };

    const analyze = () => {
      const lines = (input.value || '').split('\n').map((line) => line.trim()).filter(Boolean);
      inputCountEl.textContent = lines.length.toLocaleString(numberLocale);

      if (!lines.length) {
        outputCountEl.textContent = '0';
        changedCountEl.textContent = '0';
        duplicateCountEl.textContent = '0';
        summaryEl.textContent = t.idle;
        outputEl.value = '';
        return;
      }

      const separator = separatorEl.value;
      const start = Math.max(1, Number(numberStartEl.value || 1));
      numberStartEl.value = String(start);
      const datePrefix = dateEnabledEl.checked ? formatDatePrefix(dateEl.value) : '';

      const seen = {};
      let changed = 0;

      const outputs = lines.map((line, index) => {
        const { base, ext } = splitExt(line);
        let name = sanitizeBase(base, separator);
        const parts = [];
        if (datePrefix) parts.push(datePrefix);
        if (numberEnabledEl.checked) parts.push(pad(start + index));
        parts.push(name);
        name = separator ? parts.filter(Boolean).join(separator) : parts.filter(Boolean).join('');
        const finalName = `${name}${ext}`;
        if (finalName !== line) changed += 1;
        seen[finalName] = (seen[finalName] || 0) + 1;
        return finalName;
      });

      const duplicates = Object.values(seen).filter((count) => count > 1).reduce((sum, count) => sum + count, 0);
      outputEl.value = outputs.join('\n');
      outputCountEl.textContent = outputs.length.toLocaleString(numberLocale);
      changedCountEl.textContent = changed.toLocaleString(numberLocale);
      duplicateCountEl.textContent = duplicates.toLocaleString(numberLocale);
      summaryEl.textContent = t.summary(changed, duplicates);
    };

    [input, separatorEl, caseEl, dateEnabledEl, dateEl, numberEnabledEl, numberStartEl, removeEmojiEl, keepExtensionEl].forEach((el) => {
      el.addEventListener('input', analyze);
      el.addEventListener('change', analyze);
    });

    sampleBtn.addEventListener('click', () => {
      input.value = t.sample;
      analyze();
    });

    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) return;
      await copyText(outputEl.value);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 1200);
    });

    analyze();
  }

  if (slug === 'readability-checker') {
    const input = document.getElementById('rc-input');
    const sentenceLimitEl = document.getElementById('rc-sentence-limit');
    const paragraphLimitEl = document.getElementById('rc-paragraph-limit');
    const copyBtn = document.getElementById('rc-copy');
    const sampleBtn = document.getElementById('rc-sample');
    const charsEl = document.getElementById('rc-chars');
    const sentencesEl = document.getElementById('rc-sentences');
    const avgEl = document.getElementById('rc-avg');
    const longSentencesEl = document.getElementById('rc-long-sentences');
    const longParagraphsEl = document.getElementById('rc-long-paragraphs');
    const scoreEl = document.getElementById('rc-score');
    const summaryEl = document.getElementById('rc-summary');
    const listEl = document.getElementById('rc-list');
    if (!input || !sentenceLimitEl || !paragraphLimitEl || !copyBtn || !sampleBtn || !charsEl || !sentencesEl || !avgEl || !longSentencesEl || !longParagraphsEl || !scoreEl || !summaryEl || !listEl) return;

    const t = {
      sample: '이번 안내는 신청자가 많을 경우 처리 시간이 조금 더 길어질 수 있으며, 제출 서류가 누락되면 접수가 자동으로 보류될 수 있으니 반드시 체크리스트를 먼저 확인한 뒤 제출해 주세요.\n\n또한 결과 안내 메일은 순차 발송되기 때문에 같은 날 신청했더라도 수신 시점이 다를 수 있습니다. 급한 문의는 담당 부서 운영시간을 확인한 후 연락해 주세요.',
      empty: '텍스트를 입력하면 문장 길이와 문단 밀도를 바로 점검합니다.',
      readability: ['매우 읽기 쉬움', '읽기 쉬움', '보통', '다소 빽빽함', '손보기 필요'],
      summary: (score, avg, longS, longP) => `가독성 ${score} · 평균 문장 길이 ${avg}자 · 긴 문장 ${longS}개 · 긴 문단 ${longP}개`,
      noIssues: '지금 기준에서는 크게 거슬리는 길이 문제나 반복 표현이 보이지 않습니다.',
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const renderList = (items) => {
      if (!items.length) {
        listEl.innerHTML = `<div class="empty-state">${t.noIssues}</div>`;
        return;
      }
      listEl.innerHTML = items.map((item) => `<div class="bw-item"><strong>${item.title}<span class="bw-tag">${item.count}</span></strong><p>${item.detail}</p></div>`).join('');
    };

    const analyze = () => {
      const text = input.value || '';
      const sentenceLimit = clamp(Number(sentenceLimitEl.value || 45), 20, 120);
      const paragraphLimit = clamp(Number(paragraphLimitEl.value || 4), 2, 12);
      sentenceLimitEl.value = sentenceLimit;
      paragraphLimitEl.value = paragraphLimit;

      const chars = text.length;
      const sentences = text.split(/(?<=[.!?。！？])\s+|\n+/).map(v => v.trim()).filter(Boolean);
      const paragraphs = text.split(/\n{2,}/).map(v => v.trim()).filter(Boolean);
      const words = (text.match(/[가-힣A-Za-z0-9]{2,}/g) || []).map(v => v.toLowerCase());
      const freq = {};
      words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
      const repeated = Object.entries(freq).filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]).slice(0, 5);

      const sentenceLengths = sentences.map((s) => s.replace(/\s+/g, '').length);
      const longSentences = sentenceLengths.filter((n) => n >= sentenceLimit);
      const paragraphLines = paragraphs.map((p) => Math.max(1, p.split(/\n/).filter(Boolean).length));
      const longParagraphs = paragraphLines.filter((n) => n >= paragraphLimit);
      const avg = sentenceLengths.length ? (sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length) : 0;

      let score = 100;
      score -= longSentences.length * 8;
      score -= longParagraphs.length * 10;
      score -= repeated.length * 6;
      if (avg > sentenceLimit * 0.9) score -= 12;
      score = clamp(score, 0, 100);
      const label = score >= 90 ? t.readability[0] : score >= 75 ? t.readability[1] : score >= 60 ? t.readability[2] : score >= 40 ? t.readability[3] : t.readability[4];

      charsEl.textContent = chars.toLocaleString(numberLocale);
      sentencesEl.textContent = sentences.length.toLocaleString(numberLocale);
      avgEl.textContent = avg ? avg.toLocaleString(numberLocale, { maximumFractionDigits: 1 }) : '0';
      longSentencesEl.textContent = longSentences.length.toLocaleString(numberLocale);
      longParagraphsEl.textContent = longParagraphs.length.toLocaleString(numberLocale);
      scoreEl.textContent = label;
      summaryEl.textContent = chars ? t.summary(label, avg.toLocaleString(numberLocale, { maximumFractionDigits: 1 }), longSentences.length, longParagraphs.length) : t.empty;

      const items = [];
      if (longSentences.length) items.push({ title: '긴 문장', count: `${longSentences.length}개`, detail: `${sentenceLimit}자 이상 문장이 있습니다. 쉼표 뒤나 접속사 앞에서 둘로 나눌 수 있는지 확인해 보세요.` });
      if (longParagraphs.length) items.push({ title: '긴 문단', count: `${longParagraphs.length}개`, detail: `${paragraphLimit}줄 이상 문단이 있습니다. 핵심 한 가지씩 묶어 문단을 쪼개면 읽기 호흡이 좋아집니다.` });
      if (repeated.length) items.push({ title: '반복 표현', count: `${repeated.length}개`, detail: repeated.map(([w, n]) => `${w}(${n}회)`).join(', ') });
      if (paragraphs.length && paragraphs.length <= 1 && chars >= 300) items.push({ title: '줄바꿈 밀도', count: '낮음', detail: '긴 글인데 문단 분리가 거의 없습니다. 2~4문장마다 한 번씩 끊어 읽기 흐름을 만들어 보세요.' });
      renderList(items);
    };

    input.addEventListener('input', analyze);
    sentenceLimitEl.addEventListener('input', analyze);
    paragraphLimitEl.addEventListener('input', analyze);
    sampleBtn.addEventListener('click', () => { input.value = t.sample; analyze(); });
    copyBtn.addEventListener('click', async () => {
      const text = [
        `문장 가독성 점검기`,
        `글자 수: ${charsEl.textContent}`,
        `문장 수: ${sentencesEl.textContent}`,
        `평균 문장 길이: ${avgEl.textContent}`,
        `긴 문장: ${longSentencesEl.textContent}`,
        `긴 문단: ${longParagraphsEl.textContent}`,
        `가독성: ${scoreEl.textContent}`,
        `요약: ${summaryEl.textContent}`
      ].join(' | ');
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });
    analyze();
  }

  if (slug === 'deadline-backward-planner') {
    const deadlineEl = document.getElementById('dbp-deadline');
    const hoursEl = document.getElementById('dbp-hours');
    const dailyHoursEl = document.getElementById('dbp-daily-hours');
    const bufferEl = document.getElementById('dbp-buffer-days');
    const sampleBtn = document.getElementById('dbp-sample');
    const copyBtn = document.getElementById('dbp-copy');
    const daysEl = document.getElementById('dbp-days');
    const startEl = document.getElementById('dbp-start');
    const dailyEl = document.getElementById('dbp-daily');
    const reviewEl = document.getElementById('dbp-review');
    const summaryEl = document.getElementById('dbp-summary');
    const listEl = document.getElementById('dbp-list');
    if (!deadlineEl || !hoursEl || !dailyHoursEl || !bufferEl || !sampleBtn || !copyBtn || !daysEl || !startEl || !dailyEl || !reviewEl || !summaryEl || !listEl) return;

    const copyByLang = {
      ko: {
        empty: '마감일을 입력하면 역산 계획을 만들어줍니다.',
        copied: '복사됨',
        copyDefault: '계획 복사',
        tight: (need, cap) => `일정이 다소 빡빡합니다. 하루 평균 ${need}시간이 필요해 입력한 집중 가능 시간 ${cap}시간을 넘습니다.`,
        normal: (need, cap) => `하루 평균 ${need}시간 정도면 마감 전까지 진행 가능합니다. 입력한 집중 가능 시간 ${cap}시간 안에 들어옵니다.`,
        late: '이미 검토 버퍼를 두기 어려운 상태예요. 오늘 바로 핵심 작업부터 시작하는 편이 안전합니다.',
        phase: ['자료 정리·구조 잡기', '핵심 작업 진행', '빈칸 보완·마무리', '최종 검토·제출 체크'],
        dayLabel: (date, dday) => `${date} · D-${dday}`,
        work: (hours, label) => `${hours}시간 · ${label}`,
        review: (hours) => `${hours}시간 · 최종 검토와 제출 준비`,
        summaryLine: '생성된 계획은 그대로 복사해 캘린더나 할 일 앱에 붙여 넣어 쓰면 편합니다.'
      },
      en: {
        empty: 'Enter a deadline to build a backward plan.', copied: 'Copied', copyDefault: 'Copy plan',
        tight: (need, cap) => `This schedule is tight. You need about ${need} hours per day, above your stated ${cap}-hour daily capacity.`,
        normal: (need, cap) => `About ${need} hours per day should keep this on track before the deadline, within your ${cap}-hour daily capacity.`,
        late: 'There is almost no room for a review buffer now, so it is safer to start the core work immediately.',
        phase: ['research and outline', 'main work block', 'gap-filling and refinement', 'final review and submission check'],
        dayLabel: (date, dday) => `${date} · D-${dday}`,
        work: (hours, label) => `${hours}h · ${label}`,
        review: (hours) => `${hours}h · final review and submission prep`,
        summaryLine: 'You can copy this plan straight into your calendar or task app.'
      },
      ja: {
        empty: '締切を入力すると逆算プランを作成します。', copied: 'コピー完了', copyDefault: '計画をコピー',
        tight: (need, cap) => `予定がやや厳しめです。1日平均 ${need} 時間が必要で、入力した集中可能時間 ${cap} 時間を上回ります。`,
        normal: (need, cap) => `1日平均 ${need} 時間ほどで進めれば、締切前までに収まりそうです。入力した集中可能時間 ${cap} 時間の範囲です。`,
        late: '見直しバッファを確保しにくい状態です。今日すぐに本作業へ入るのが安全です。',
        phase: ['調査・構成づくり', '本作業を進める', '不足分の補完・仕上げ', '最終確認・提出チェック'],
        dayLabel: (date, dday) => `${date} · D-${dday}`,
        work: (hours, label) => `${hours}時間 · ${label}`,
        review: (hours) => `${hours}時間 · 最終確認と提出準備`,
        summaryLine: '作成した計画はカレンダーやタスク管理にそのまま移して使えます。'
      }
    };
    const t = copyByLang[pageLang] || copyByLang.ko;

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    const fmtDate = (date) => new Intl.DateTimeFormat(pageLang === 'en' ? 'en-US' : pageLang === 'ja' ? 'ja-JP' : 'ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }).format(date);
    const fmtHour = (n) => Number(n).toLocaleString(numberLocale, { maximumFractionDigits: 1 });
    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    if (!deadlineEl.value) {
      const now = new Date();
      const base = new Date(now.getTime() + (48 * 60 * 60 * 1000));
      base.setHours(18, 0, 0, 0);
      deadlineEl.value = new Date(base.getTime() - base.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }

    const buildPlan = () => {
      const now = new Date();
      const deadline = new Date(deadlineEl.value);
      const totalHours = clamp(Number(hoursEl.value || 0), 1, 200);
      const dailyCap = clamp(Number(dailyHoursEl.value || 0), 0.5, 16);
      const bufferDays = clamp(Number(bufferEl.value || 0), 0, 14);
      hoursEl.value = totalHours;
      dailyHoursEl.value = dailyCap;
      bufferEl.value = bufferDays;

      if (!(deadline instanceof Date) || Number.isNaN(deadline.getTime())) {
        summaryEl.textContent = t.empty;
        listEl.innerHTML = '';
        return;
      }

      const effectiveEnd = new Date(deadline);
      effectiveEnd.setDate(effectiveEnd.getDate() - bufferDays);
      const startDay = new Date(now); startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(effectiveEnd); endDay.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((endDay - startDay) / 86400000) + 1;
      const workDays = Math.max(1, diffDays);
      const reviewHours = Math.min(Math.max(totalHours * 0.15, 1), Math.min(3, totalHours));
      const buildDays = Math.max(1, workDays - 1);
      const buildHours = Math.max(0, totalHours - reviewHours);
      const dailyNeed = totalHours / workDays;
      const workPerBuildDay = buildHours / buildDays;
      const isTight = dailyNeed > dailyCap;

      daysEl.textContent = workDays.toLocaleString(numberLocale);
      startEl.textContent = fmtDate(startDay);
      dailyEl.textContent = `${fmtHour(dailyNeed)}h`;
      reviewEl.textContent = `${fmtHour(reviewHours)}h`;
      summaryEl.textContent = diffDays <= 0 ? t.late : (isTight ? t.tight(fmtHour(dailyNeed), fmtHour(dailyCap)) : t.normal(fmtHour(dailyNeed), fmtHour(dailyCap)));

      const plan = [];
      for (let i = 0; i < workDays; i += 1) {
        const date = new Date(startDay);
        date.setDate(startDay.getDate() + i);
        const remaining = workDays - i - 1;
        const progress = workDays === 1 ? 1 : i / (workDays - 1);
        const phaseIndex = i === workDays - 1 ? 3 : progress < 0.34 ? 0 : progress < 0.75 ? 1 : 2;
        const hours = i === workDays - 1 ? reviewHours : workPerBuildDay;
        const dday = Math.max(0, Math.ceil((endDay - date) / 86400000));
        plan.push({
          label: t.dayLabel(fmtDate(date), dday),
          detail: i === workDays - 1 ? t.review(fmtHour(hours)) : t.work(fmtHour(hours), t.phase[phaseIndex]),
          tag: remaining === 0 ? 'final' : `${fmtHour(hours)}h`
        });
      }

      listEl.innerHTML = plan.map((item) => `<div class="bw-item"><strong>${item.label}<span class="bw-tag">${item.tag}</span></strong><p>${item.detail}</p></div>`).join('');
      copyBtn.dataset.plan = [summaryEl.textContent, ...plan.map((item) => `- ${item.label}: ${item.detail}`), t.summaryLine].join('\n');
    };

    [deadlineEl, hoursEl, dailyHoursEl, bufferEl].forEach((el) => el.addEventListener('input', buildPlan));
    sampleBtn.addEventListener('click', () => {
      const now = new Date();
      const sample = new Date(now.getTime() + (5 * 86400000));
      sample.setHours(18, 0, 0, 0);
      deadlineEl.value = new Date(sample.getTime() - sample.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      hoursEl.value = 11;
      dailyHoursEl.value = 2.5;
      bufferEl.value = 1;
      buildPlan();
    });
    copyBtn.addEventListener('click', async () => {
      await copyText(copyBtn.dataset.plan || summaryEl.textContent || '');
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });
    buildPlan();
  }

  if (slug === 'privacy-exposure-checker') {
    const input = document.getElementById('pec-input');
    const maskPhone = document.getElementById('pec-mask-phone');
    const maskId = document.getElementById('pec-mask-id');
    const maskEmail = document.getElementById('pec-mask-email');
    const maskAccount = document.getElementById('pec-mask-account');
    const copyBtn = document.getElementById('pec-copy');
    const sampleBtn = document.getElementById('pec-sample');
    const clearBtn = document.getElementById('pec-clear');
    const totalEl = document.getElementById('pec-total');
    const contactEl = document.getElementById('pec-contact');
    const idnumEl = document.getElementById('pec-idnum');
    const linkEl = document.getElementById('pec-link');
    const summaryEl = document.getElementById('pec-summary');
    const listEl = document.getElementById('pec-list');
    const outputEl = document.getElementById('pec-output');
    if (!input || !maskPhone || !maskId || !maskEmail || !maskAccount || !copyBtn || !sampleBtn || !clearBtn || !totalEl || !contactEl || !idnumEl || !linkEl || !summaryEl || !listEl || !outputEl) return;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const t = {
      ko: {
        sample: '안녕하세요. 담당자 김도윤입니다.\n연락은 010-1234-5678 또는 doyoon.kim@example.com 으로 주세요.\n주민등록번호는 900101-1234567 형식으로 적지 마세요.\n법인카드는 4111 1111 1111 1111 처럼 전체 번호를 공유하지 않는 것이 좋습니다.\n입금 계좌는 123-45-678901, 문의 링크는 https://example.com/form 입니다.\n카카오톡 ID: sample_team',
        idle: '텍스트를 입력하면 전화번호, 이메일, 주민등록번호 유사 패턴, 계좌/카드번호형 숫자열, 링크 유도 표현을 점검합니다.',
        clean: '눈에 띄는 개인정보/민감정보 패턴은 감지되지 않았습니다. 그래도 이름, 주소, 고유번호처럼 문맥상 민감한 정보는 한 번 더 확인하세요.',
        caution: (n) => `${formatNum(n)}개의 노출 가능 패턴이 감지됐어요. 외부 발송 전에는 마스킹 결과를 기준으로 꼭 한 번 더 검토하세요.`,
        copied: '마스킹 결과를 복사했어요.',
        emptyCopy: '복사할 마스킹 결과가 아직 없어요.',
        cleared: '입력과 마스킹 결과를 초기화했어요.',
        catContact: '연락처/이메일',
        catId: '식별번호/긴 숫자열',
        catLink: '링크/아이디 유도',
        risk: '위험도',
        maskedExample: '마스킹 예시',
        riskHigh: '높음',
        riskMedium: '중간',
        riskLow: '낮음',
        noList: '텍스트를 입력하면 감지 항목이 여기에 정리됩니다.',
        labels: {
          phone: '전화번호',
          email: '이메일',
          rrn: '주민등록번호 유사',
          biz: '사업자등록번호 유사',
          card: '카드번호 유사',
          account: '계좌/긴 숫자열 유사',
          url: 'URL 링크',
          messenger: '메신저/아이디 유도'
        }
      },
      en: {
        sample: 'Hello, this is Jamie from Operations.\nPlease contact me at +82 10-1234-5678 or jamie.ops@example.com.\nDo not include ID-like numbers such as 900101-1234567 in shared notes.\nAvoid sharing full card numbers like 4111 1111 1111 1111.\nThe deposit account is 123-45-678901 and the form link is https://example.com/form.\nTelegram @sample_team',
        idle: 'Paste text to scan for phone numbers, emails, ID-like numbers, card/account-style strings, and link or messenger prompts.',
        clean: 'No obvious privacy or sensitive-data pattern was detected. Still review names, addresses, internal codes, and context-sensitive details manually.',
        caution: (n) => `${formatNum(n)} possible exposure pattern${n === 1 ? '' : 's'} detected. Review the masked result before sending externally.`,
        copied: 'Copied the masked result.',
        emptyCopy: 'There is no masked result to copy yet.',
        cleared: 'Cleared the input and masked result.',
        catContact: 'Contact/email',
        catId: 'ID-like/long number',
        catLink: 'Link/ID prompt',
        risk: 'Risk',
        maskedExample: 'Masked example',
        riskHigh: 'High',
        riskMedium: 'Medium',
        riskLow: 'Low',
        noList: 'Detected items will appear here after you enter text.',
        labels: {
          phone: 'Phone number',
          email: 'Email address',
          rrn: 'ID-like number',
          biz: 'Business ID-like number',
          card: 'Card-like number',
          account: 'Account-style number',
          url: 'URL link',
          messenger: 'Messenger or ID prompt'
        }
      },
      ja: {
        sample: 'こんにちは。担当の佐藤です。\n連絡先は 090-1234-5678 または sato.ops@example.com です。\n共有メモには 900101-1234567 のような個人番号風の文字列を入れないでください。\nカード番号 4111 1111 1111 1111 のような全桁共有は避けましょう。\n振込口座は 123-45-678901、問い合わせリンクは https://example.com/form です。\nTelegram @sample_team',
        idle: 'テキストを貼り付けると、電話番号、メール、番号系パターン、カード/口座番号風文字列、リンクやメッセンジャー誘導を点検します。',
        clean: '目立つ個人情報・機微情報パターンは検出されませんでした。ただし名前、住所、社内コード、文脈依存の情報はもう一度確認してください。',
        caution: (n) => `${formatNum(n)}件の露出可能性があるパターンを検出しました。外部送信前にマスキング結果を必ず確認してください。`,
        copied: 'マスキング結果をコピーしました。',
        emptyCopy: 'コピーできるマスキング結果がまだありません。',
        cleared: '入力とマスキング結果をクリアしました。',
        catContact: '連絡先/メール',
        catId: '番号系/長い数字列',
        catLink: 'リンク/ID誘導',
        risk: 'リスク',
        maskedExample: 'マスキング例',
        riskHigh: '高',
        riskMedium: '中',
        riskLow: '低',
        noList: 'テキストを入力すると検出項目がここに表示されます。',
        labels: {
          phone: '電話番号',
          email: 'メールアドレス',
          rrn: '個人番号風',
          biz: '事業者番号風',
          card: 'カード番号風',
          account: '口座番号風/長い数字列',
          url: 'URLリンク',
          messenger: 'メッセンジャー/ID誘導'
        }
      }
    }[pageLang] || {};

    const rules = [
      { key: 'phone', cat: 'contact', label: '전화번호', risk: 'medium', re: /(?:\+?82[-\s]?)?0?1[0-9][-.\s]?[0-9]{3,4}[-.\s]?[0-9]{4}/g },
      { key: 'email', cat: 'contact', label: '이메일', risk: 'medium', re: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi },
      { key: 'rrn', cat: 'id', label: '주민등록번호 유사', risk: 'high', re: /\b\d{6}[- ]?[1-4]\d{6}\b/g },
      { key: 'biz', cat: 'id', label: '사업자등록번호 유사', risk: 'high', re: /\b\d{3}[- ]?\d{2}[- ]?\d{5}\b/g },
      { key: 'card', cat: 'id', label: '카드번호 유사', risk: 'high', re: /\b(?:\d[ -]*?){13,19}\b/g },
      { key: 'account', cat: 'id', label: '계좌/긴 숫자열 유사', risk: 'medium', re: /\b\d{2,6}[- ]\d{2,6}[- ]\d{3,8}\b/g },
      { key: 'url', cat: 'link', label: 'URL 링크', risk: 'low', re: /https?:\/\/[^\s]+|www\.[^\s]+/gi },
      { key: 'messenger', cat: 'link', label: '메신저/아이디 유도', risk: 'low', re: /(카카오톡\s*ID|카톡\s*아이디|오픈채팅|텔레그램\s*@?\w+|디엠\s*주세요|DM\s*me|open\s?chat|telegram\s*@?\w+)/gi }
    ];

    const maskers = {
      phone: (value) => value.replace(/(\d{2,3})[-.\s]?(\d{3,4})[-.\s]?(\d{4})/, (_, a, b, c) => `${a}-${b.slice(0, Math.max(1, b.length - 2))}${'*'.repeat(Math.min(2, b.length))}-${'*'.repeat(c.length)}`),
      email: (value) => value.replace(/^([^@]{1,2})([^@]*)(@.*)$/, (_, a, b, c) => `${a}${'*'.repeat(Math.max(2, Math.min(6, b.length || 2)))}${c}`),
      rrn: (value) => value.replace(/(\d{6})[- ]?(\d)(\d{6})/, (_, a, b) => `${a}-${b}******`),
      biz: (value) => value.replace(/(\d{3})[- ]?(\d{2})[- ]?(\d{5})/, (_, a) => `${a}-**-*****`),
      card: (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 13 || digits.length > 19) return value;
        return `${digits.slice(0, 4)} **** **** ${digits.slice(-4)}`;
      },
      account: (value) => value.replace(/\d/g, (char, index) => {
        const digits = value.replace(/\D/g, '');
        const digitIndex = value.slice(0, index + 1).replace(/\D/g, '').length - 1;
        return digitIndex < 3 || digitIndex >= digits.length - 2 ? char : '*';
      }),
      url: (value) => value,
      messenger: (value) => value
    };

    const shouldMask = (key) => {
      if (key === 'phone') return maskPhone.checked;
      if (key === 'email') return maskEmail.checked;
      if (['rrn', 'biz', 'card'].includes(key)) return maskId.checked;
      if (key === 'account') return maskAccount.checked;
      return false;
    };

    const escapeHtml = (value) => value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const findMatches = (text) => {
      const items = [];
      rules.forEach((rule) => {
        rule.re.lastIndex = 0;
        const matches = [...text.matchAll(rule.re)];
        matches.forEach((match) => {
          const raw = match[0];
          const digits = raw.replace(/\D/g, '');
          if (rule.key === 'card' && (digits.length < 13 || digits.length > 19)) return;
          items.push({
            ...rule,
            value: raw,
            index: match.index || 0,
            end: (match.index || 0) + raw.length,
            masked: shouldMask(rule.key) ? (maskers[rule.key]?.(raw) || raw) : raw
          });
        });
      });
      const priority = { rrn: 1, biz: 1, card: 2, account: 3, phone: 4, email: 4, url: 5, messenger: 5 };
      const sorted = items.sort((a, b) => a.index - b.index || (priority[a.key] || 9) - (priority[b.key] || 9) || (b.end - b.index) - (a.end - a.index));
      const filtered = [];
      sorted.forEach((item) => {
        if (!filtered.some((prev) => item.index < prev.end && item.end > prev.index)) filtered.push(item);
      });
      return filtered;
    };

    const applyMask = (text, items) => {
      if (!items.length) return text;
      let cursor = 0;
      let result = '';
      items.forEach((item) => {
        result += text.slice(cursor, item.index);
        result += item.masked;
        cursor = item.end;
      });
      result += text.slice(cursor);
      return result;
    };

    const render = () => {
      const text = input.value || '';
      const items = findMatches(text);
      const counts = {
        contact: items.filter((item) => item.cat === 'contact').length,
        id: items.filter((item) => item.cat === 'id').length,
        link: items.filter((item) => item.cat === 'link').length
      };

      totalEl.textContent = formatNum(items.length);
      contactEl.textContent = formatNum(counts.contact);
      idnumEl.textContent = formatNum(counts.id);
      linkEl.textContent = formatNum(counts.link);
      summaryEl.textContent = text.trim() ? (items.length ? t.caution(items.length) : t.clean) : t.idle;
      outputEl.value = text.trim() ? applyMask(text, items) : '';
      copyBtn.disabled = !outputEl.value.trim();

      if (!text.trim()) {
        listEl.innerHTML = `<div class="tool-card"><p>${t.noList}</p></div>`;
        return;
      }

      if (!items.length) {
        listEl.innerHTML = `<div class="tool-card"><p>${t.clean}</p></div>`;
        return;
      }

      listEl.innerHTML = items.map((item) => {
        const riskLabel = item.risk === 'high' ? t.riskHigh : (item.risk === 'medium' ? t.riskMedium : t.riskLow);
        const categoryLabel = item.cat === 'contact' ? t.catContact : (item.cat === 'id' ? t.catId : t.catLink);
        return `
          <div class="tool-card">
            <strong>${escapeHtml(t.labels[item.key] || item.label)}</strong>
            <p>${escapeHtml(categoryLabel)} · ${escapeHtml(t.risk)} ${escapeHtml(riskLabel)}</p>
            <p><code>${escapeHtml(item.value)}</code></p>
            <p>${escapeHtml(t.maskedExample)}: <code>${escapeHtml(item.masked)}</code></p>
          </div>
        `;
      }).join('');
    };

    input.addEventListener('input', render);
    [maskPhone, maskId, maskEmail, maskAccount].forEach((el) => el.addEventListener('change', render));
    sampleBtn.addEventListener('click', () => { input.value = t.sample; render(); input.focus(); });
    clearBtn.addEventListener('click', () => {
      input.value = '';
      render();
      summaryEl.textContent = t.cleared;
      input.focus();
    });
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) {
        summaryEl.textContent = t.emptyCopy;
        return;
      }
      await copyText(outputEl.value);
      summaryEl.textContent = t.copied;
    });
    render();
  }

  if (slug === 'password-strength-checker') {
    const input = document.getElementById('psc-password');
    const purpose = document.getElementById('psc-purpose');
    const showPassword = document.getElementById('psc-show-password');
    const allowSpaces = document.getElementById('psc-allow-spaces');
    const sampleBtn = document.getElementById('psc-sample');
    const copyBtn = document.getElementById('psc-copy');
    const scoreEl = document.getElementById('psc-score');
    const gradeEl = document.getElementById('psc-grade');
    const lengthEl = document.getElementById('psc-length');
    const varietyEl = document.getElementById('psc-variety');
    const riskEl = document.getElementById('psc-risk');
    const summaryEl = document.getElementById('psc-summary');
    const meterBar = document.getElementById('psc-meter-bar');
    const listEl = document.getElementById('psc-list');
    const outputEl = document.getElementById('psc-output');
    if (!input || !purpose || !showPassword || !allowSpaces || !sampleBtn || !copyBtn || !scoreEl || !gradeEl || !lengthEl || !varietyEl || !riskEl || !summaryEl || !meterBar || !listEl || !outputEl) return;

    const t = {
      ko: {
        idle: '비밀번호를 입력하면 길이, 문자 조합, 반복/연속 패턴, 쉬운 추측 가능성을 함께 점검합니다.',
        copied: '점검 요약을 복사했어요.',
        emptyCopy: '복사할 점검 결과가 아직 없어요.',
        sample: 'Spring2026!Seoul',
        grade: ['매우 약함', '약함', '보통', '강함', '매우 강함'],
        purposeLabel: { general: '일반 사이트 로그인', important: '금융/업무/메인 계정', temporary: '임시/1회성 계정' },
        ok: '현재 기준에서 큰 위험 신호는 적습니다. 그래도 중요한 계정은 사이트별로 다른 비밀번호와 2단계 인증을 함께 쓰는 편이 안전합니다.',
        resultTitle: '점검 결과',
        noList: '점검 항목이 여기에 표시됩니다.',
        warnShort: '길이가 10자 미만이라 짧은 편입니다.',
        tipLength: '최소 12자 이상, 가능하면 16자 안팎으로 늘려보세요.',
        warnMoreLength: '조금 더 길게 만들면 방어력이 더 좋아집니다.',
        warnVariety: '문자 종류가 적어 패턴이 단순합니다.',
        tipVariety: '대문자, 숫자, 특수문자를 3종 이상 섞어보세요.',
        warnSpaces: '공백 포함 비밀번호를 허용하지 않는 환경에서는 실패할 수 있습니다.',
        tipSpaces: '공백 없이도 충분히 긴 패스프레이즈로 바꿔보세요.',
        warnRepeat: '같은 문자가 3번 이상 반복됩니다.',
        tipRepeat: '반복 구간 대신 다른 단어나 기호를 섞어보세요.',
        warnSeq: '연속된 숫자/알파벳/키보드 배열 패턴이 보입니다.',
        tipSeq: '123, abc, qwerty 같은 흐름은 피하는 편이 좋습니다.',
        warnCommon: (items) => `너무 흔한 단어/패턴이 포함됩니다: ${items}`,
        tipCommon: '잘 알려진 단어 대신 개인만 아는 조합이나 긴 문장형 구조를 쓰세요.',
        warnYear: '연도처럼 추측하기 쉬운 숫자 조합이 들어 있습니다.',
        tipYear: '생년, 기념일, 현재 연도처럼 유추 가능한 숫자는 피하세요.',
        warnImportant: '중요 계정용으로는 길이가 더 긴 편이 안전합니다.',
        summaryRisk: (count, important) => `${count}개의 위험 신호가 보여요. ${important ? '특히 중요한 계정이라면 더 강한 조합이 좋습니다.' : '아래 항목을 손보면 강도가 올라갑니다.'}`,
        danger: '위험 신호',
        tip: '개선 팁',
        good: '좋은 점',
        gradeLabel: (grade, purposeLabel, score) => `${purposeLabel} 기준 점검 점수는 ${score}점입니다.`,
        output: {
          purpose: '사용 목적',
          score: '보안 점수',
          grade: '강도 등급',
          length: '길이',
          lengthUnit: '자',
          variety: '문자 종류',
          varietyUnit: '종',
          riskCount: '위험 신호 수',
          riskUnit: '개',
          risks: '위험 신호',
          noRisk: '큰 경고 없음',
          tips: '개선 팁',
          defaultTip: '현재 조합 유지 + 2단계 인증 권장'
        }
      },
      en: {
        idle: 'Enter a password to check length, character mix, repeated or sequential patterns, and guessability signals.',
        copied: 'Copied the summary.',
        emptyCopy: 'There is no summary to copy yet.',
        sample: 'Spring2026!Seoul',
        grade: ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'],
        purposeLabel: { general: 'General site login', important: 'Finance / work / main account', temporary: 'Temporary / one-time account' },
        ok: 'There are not many obvious risk signals right now. For important accounts, unique passwords plus 2FA are still the safer default.',
        resultTitle: 'Check result',
        noList: 'Check items will appear here.',
        warnShort: 'The password is shorter than 10 characters.',
        tipLength: 'Aim for at least 12 characters, and around 16 if possible.',
        warnMoreLength: 'A little more length would improve resistance.',
        warnVariety: 'It uses too few character types, so the pattern is simple.',
        tipVariety: 'Mix at least three types such as uppercase, numbers, and symbols.',
        warnSpaces: 'Some services may reject passwords with spaces.',
        tipSpaces: 'Try a long passphrase that stays strong even without spaces.',
        warnRepeat: 'The same character repeats 3 times or more.',
        tipRepeat: 'Replace repeated runs with another word or symbol.',
        warnSeq: 'A sequential number, alphabet, or keyboard pattern is visible.',
        tipSeq: 'Avoid flows like 123, abc, or qwerty.',
        warnCommon: (items) => `Common words or patterns were found: ${items}`,
        tipCommon: 'Use a less obvious combination or a longer phrase that only you would know.',
        warnYear: 'It includes an easy-to-guess year-like number.',
        tipYear: 'Avoid birth years, anniversaries, or the current year when possible.',
        warnImportant: 'For important accounts, a longer password is safer.',
        summaryRisk: (count, important) => `${count} risk signal(s) appeared. ${important ? 'Because this is an important account, a stronger structure is recommended.' : 'Fixing the items below should improve the score.'}`,
        danger: 'Risk signal',
        tip: 'Improvement tip',
        good: 'What looks good',
        gradeLabel: (grade, purposeLabel, score) => `For ${purposeLabel}, the check score is ${score}.`,
        output: {
          purpose: 'Account type',
          score: 'Security score',
          grade: 'Strength grade',
          length: 'Length',
          lengthUnit: ' chars',
          variety: 'Character types',
          varietyUnit: ' types',
          riskCount: 'Risk signals',
          riskUnit: ' items',
          risks: 'Risk signals',
          noRisk: 'No major warning',
          tips: 'Improvement tips',
          defaultTip: 'Keep the current structure and use 2FA where possible'
        }
      },
      ja: {
        idle: 'パスワードを入力すると、長さ、文字構成、繰り返し/連続パターン、推測されやすさをまとめて点検します。',
        copied: '点検結果をコピーしました。',
        emptyCopy: 'まだコピーする点検結果がありません。',
        sample: 'Spring2026!Seoul',
        grade: ['とても弱い', '弱い', '普通', '強い', 'とても強い'],
        purposeLabel: { general: '一般サイトのログイン', important: '金融・業務・メインアカウント', temporary: '一時・使い捨てアカウント' },
        ok: '今のところ大きな危険シグナルは多くありません。重要アカウントでは、サイトごとに別のパスワードと2段階認証を併用するほうが安全です。',
        resultTitle: '点検結果',
        noList: '点検項目がここに表示されます。',
        warnShort: '10文字未満でやや短めです。',
        tipLength: '最低12文字以上、できれば16文字前後まで伸ばしてみてください。',
        warnMoreLength: 'もう少し長くすると強度が上がります。',
        warnVariety: '文字種類が少なく、パターンが単純です。',
        tipVariety: '大文字、数字、記号など3種類以上を混ぜてみてください。',
        warnSpaces: '空白入りパスワードを受け付けない環境では失敗することがあります。',
        tipSpaces: '空白なしでも十分長いパスフレーズにしてみてください。',
        warnRepeat: '同じ文字が3回以上繰り返されています。',
        tipRepeat: '繰り返し部分の代わりに別の単語や記号を混ぜてみてください。',
        warnSeq: '連続した数字・アルファベット・キーボード配列パターンが見えます。',
        tipSeq: '123、abc、qwerty のような並びは避けるほうが安全です。',
        warnCommon: (items) => `よくある単語・パターンが含まれています: ${items}`,
        tipCommon: 'よく知られた単語の代わりに、自分だけが分かる組み合わせや長めのフレーズを使ってください。',
        warnYear: '年号のような推測しやすい数字が含まれています。',
        tipYear: '生年、記念日、今年の年号のような推測しやすい数字は避けましょう。',
        warnImportant: '重要アカウント用としては、もう少し長いほうが安全です。',
        summaryRisk: (count, important) => `${count}件の注意シグナルがあります。${important ? '重要アカウントなら、さらに強い構成がおすすめです。' : '下の項目を直すと強度が上がります。'}`,
        danger: '注意シグナル',
        tip: '改善ヒント',
        good: '良い点',
        gradeLabel: (grade, purposeLabel, score) => `${purposeLabel} 基準の点検スコアは ${score} 点です。`,
        output: {
          purpose: '用途',
          score: '安全スコア',
          grade: '強度ランク',
          length: '長さ',
          lengthUnit: '文字',
          variety: '文字種類',
          varietyUnit: '種類',
          riskCount: '注意シグナル数',
          riskUnit: '件',
          risks: '注意シグナル',
          noRisk: '大きな警告なし',
          tips: '改善ヒント',
          defaultTip: '現在の構成を維持し、可能なら2段階認証を使う'
        }
      }
    }[pageLang] || {
      idle: '비밀번호를 입력하면 길이, 문자 조합, 반복/연속 패턴, 쉬운 추측 가능성을 함께 점검합니다.', copied: '점검 요약을 복사했어요.', emptyCopy: '복사할 점검 결과가 아직 없어요.', sample: 'Spring2026!Seoul', grade: ['매우 약함', '약함', '보통', '강함', '매우 강함'], purposeLabel: { general: '일반 사이트 로그인', important: '금융/업무/메인 계정', temporary: '임시/1회성 계정' }, ok: '현재 기준에서 큰 위험 신호는 적습니다. 그래도 중요한 계정은 사이트별로 다른 비밀번호와 2단계 인증을 함께 쓰는 편이 안전합니다.', resultTitle: '점검 결과', noList: '점검 항목이 여기에 표시됩니다.', warnShort: '길이가 10자 미만이라 짧은 편입니다.', tipLength: '최소 12자 이상, 가능하면 16자 안팎으로 늘려보세요.', warnMoreLength: '조금 더 길게 만들면 방어력이 더 좋아집니다.', warnVariety: '문자 종류가 적어 패턴이 단순합니다.', tipVariety: '대문자, 숫자, 특수문자를 3종 이상 섞어보세요.', warnSpaces: '공백 포함 비밀번호를 허용하지 않는 환경에서는 실패할 수 있습니다.', tipSpaces: '공백 없이도 충분히 긴 패스프레이즈로 바꿔보세요.', warnRepeat: '같은 문자가 3번 이상 반복됩니다.', tipRepeat: '반복 구간 대신 다른 단어나 기호를 섞어보세요.', warnSeq: '연속된 숫자/알파벳/키보드 배열 패턴이 보입니다.', tipSeq: '123, abc, qwerty 같은 흐름은 피하는 편이 좋습니다.', warnCommon: (items) => `너무 흔한 단어/패턴이 포함됩니다: ${items}`, tipCommon: '잘 알려진 단어 대신 개인만 아는 조합이나 긴 문장형 구조를 쓰세요.', warnYear: '연도처럼 추측하기 쉬운 숫자 조합이 들어 있습니다.', tipYear: '생년, 기념일, 현재 연도처럼 유추 가능한 숫자는 피하세요.', warnImportant: '중요 계정용으로는 길이가 더 긴 편이 안전합니다.', summaryRisk: (count, important) => `${count}개의 위험 신호가 보여요. ${important ? '특히 중요한 계정이라면 더 강한 조합이 좋습니다.' : '아래 항목을 손보면 강도가 올라갑니다.'}`, danger: '위험 신호', tip: '개선 팁', good: '좋은 점', gradeLabel: (grade, purposeLabel, score) => `${purposeLabel} 기준 점검 점수는 ${score}점입니다.`, output: { purpose: '사용 목적', score: '보안 점수', grade: '강도 등급', length: '길이', lengthUnit: '자', variety: '문자 종류', varietyUnit: '종', riskCount: '위험 신호 수', riskUnit: '개', risks: '위험 신호', noRisk: '큰 경고 없음', tips: '개선 팁', defaultTip: '현재 조합 유지 + 2단계 인증 권장' }
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const escapeHtml = (value) => value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const runs = (text) => {
      if (text.length < 3) return 0;
      let longest = 1;
      let current = 1;
      for (let i = 1; i < text.length; i += 1) {
        if (text[i] === text[i - 1]) current += 1;
        else current = 1;
        longest = Math.max(longest, current);
      }
      return longest;
    };

    const hasSequential = (text) => {
      const lower = text.toLowerCase();
      const sequences = ['0123456789', '9876543210', 'abcdefghijklmnopqrstuvwxyz', 'zyxwvutsrqponmlkjihgfedcba', 'qwertyuiop', 'poiuytrewq', 'asdfghjkl', 'lkjhgfdsa'];
      return sequences.some((seq) => {
        for (let i = 0; i <= seq.length - 3; i += 1) {
          if (lower.includes(seq.slice(i, i + 3))) return true;
        }
        return false;
      });
    };

    const analyze = (raw) => {
      const value = raw || '';
      const classes = {
        lower: /[a-z]/.test(value),
        upper: /[A-Z]/.test(value),
        number: /\d/.test(value),
        symbol: /[^A-Za-z0-9\s]/.test(value),
        space: /\s/.test(value)
      };
      const variety = [classes.lower, classes.upper, classes.number, classes.symbol, classes.space && allowSpaces.checked].filter(Boolean).length;
      let score = Math.min(40, value.length * 3);
      score += Math.min(24, variety * 6);
      if (value.length >= 16) score += 10;
      else if (value.length >= 12) score += 6;

      const warnings = [];
      const tips = [];

      if (!value.trim()) {
        return { value, score: 0, grade: '-', variety: 0, risks: 0, warnings: [], tips: [], summary: t.idle };
      }

      if (value.length < 10) {
        score -= 18;
        warnings.push(t.warnShort);
        tips.push(t.tipLength);
      } else if (value.length < 12) {
        warnings.push(t.warnMoreLength);
      }

      if (variety <= 2) {
        score -= 12;
        warnings.push(t.warnVariety);
        tips.push(t.tipVariety);
      }

      if (classes.space && !allowSpaces.checked) {
        score -= 8;
        warnings.push(t.warnSpaces);
        tips.push(t.tipSpaces);
      }

      if (runs(value) >= 3) {
        score -= 10;
        warnings.push(t.warnRepeat);
        tips.push(t.tipRepeat);
      }

      if (hasSequential(value)) {
        score -= 12;
        warnings.push(t.warnSeq);
        tips.push(t.tipSeq);
      }

      const lowered = value.toLowerCase();
      const commonWords = ['password', 'admin', 'qwer', 'welcome', 'letmein', 'iloveyou', 'abc123', '0000', '1111', '1234', '12345', '123456', 'korea', 'seoul'];
      const hitCommon = commonWords.filter((word) => lowered.includes(word));
      if (hitCommon.length) {
        score -= 16;
        warnings.push(t.warnCommon(hitCommon.slice(0, 3).join(', ')));
        tips.push(t.tipCommon);
      }

      const yearMatch = value.match(/19\d{2}|20\d{2}/g) || [];
      if (yearMatch.length) {
        score -= 8;
        warnings.push(t.warnYear);
        tips.push(t.tipYear);
      }

      if (purpose.value === 'important' && value.length < 14) {
        score -= 10;
        warnings.push(t.warnImportant);
      }
      if (purpose.value === 'temporary' && value.length >= 12 && variety >= 3) score += 4;

      score = Math.max(0, Math.min(100, score));
      const gradeIndex = score >= 85 ? 4 : score >= 70 ? 3 : score >= 50 ? 2 : score >= 30 ? 1 : 0;
      const summary = warnings.length ? t.summaryRisk(warnings.length, purpose.value === 'important') : t.ok;
      return { value, score, grade: t.grade[gradeIndex], variety, risks: warnings.length, warnings, tips: [...new Set(tips)].slice(0, 4), summary };
    };

    const render = () => {
      input.type = showPassword.checked ? 'text' : 'password';
      const result = analyze(input.value || '');
      scoreEl.textContent = formatNum(result.score);
      gradeEl.textContent = result.grade;
      lengthEl.textContent = formatNum(result.value.length);
      varietyEl.textContent = formatNum(result.variety);
      riskEl.textContent = formatNum(result.risks);
      summaryEl.textContent = result.summary;
      meterBar.style.width = `${result.score}%`;
      meterBar.dataset.grade = result.score >= 70 ? 'good' : (result.score >= 50 ? 'fair' : 'weak');

      if (!result.value.trim()) {
        listEl.innerHTML = `<div class="bw-item"><p>${escapeHtml(t.noList)}</p></div>`;
        outputEl.value = '';
        return;
      }

      const items = [];
      items.push(`<div class="bw-item"><strong>${escapeHtml(result.grade)}</strong><p>${escapeHtml(t.gradeLabel(result.grade, t.purposeLabel[purpose.value] || t.purposeLabel.general, result.score))}</p></div>`);
      if (result.warnings.length) {
        items.push(...result.warnings.map((warning) => `<div class="bw-item"><strong>${escapeHtml(t.danger)}</strong><p>${escapeHtml(warning)}</p></div>`));
      } else {
        items.push(`<div class="bw-item"><strong>${escapeHtml(t.good)}</strong><p>${escapeHtml(t.ok)}</p></div>`);
      }
      if (result.tips.length) {
        items.push(...result.tips.map((tip) => `<div class="bw-item"><strong>${escapeHtml(t.tip)}</strong><p>${escapeHtml(tip)}</p></div>`));
      }
      listEl.innerHTML = items.join('');

      outputEl.value = [
        `[${t.resultTitle}]`,
        `- ${t.output.purpose}: ${t.purposeLabel[purpose.value] || t.purposeLabel.general}`,
        `- ${t.output.score}: ${result.score}/100`,
        `- ${t.output.grade}: ${result.grade}`,
        `- ${t.output.length}: ${result.value.length}${t.output.lengthUnit}`,
        `- ${t.output.variety}: ${result.variety}${t.output.varietyUnit}`,
        `- ${t.output.riskCount}: ${result.risks}${t.output.riskUnit}`,
        result.warnings.length ? `- ${t.output.risks}: ${result.warnings.join(' / ')}` : `- ${t.output.risks}: ${t.output.noRisk}`,
        result.tips.length ? `- ${t.output.tips}: ${result.tips.join(' / ')}` : `- ${t.output.tips}: ${t.output.defaultTip}`
      ].join('\n');
    };

    [input, purpose].forEach((el) => el.addEventListener('input', render));
    [showPassword, allowSpaces].forEach((el) => el.addEventListener('change', render));
    sampleBtn.addEventListener('click', () => { input.value = t.sample; render(); });
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) {
        summaryEl.textContent = t.emptyCopy;
        return;
      }
      await copyText(outputEl.value);
      summaryEl.textContent = t.copied;
    });
    render();
  }

  if (slug === 'hangul-keyboard-layout-converter') {
    const input = document.getElementById('hklc-input');
    const mode = document.getElementById('hklc-mode');
    const preview = document.getElementById('hklc-preview');
    const sampleBtn = document.getElementById('hklc-sample');
    const swapBtn = document.getElementById('hklc-swap');
    const copyBtn = document.getElementById('hklc-copy');
    const charsOut = document.getElementById('hklc-chars');
    const hangulOut = document.getElementById('hklc-hangul');
    const englishOut = document.getElementById('hklc-english');
    const modeOut = document.getElementById('hklc-mode-out');
    const help = document.getElementById('hklc-help');
    const output = document.getElementById('hklc-output');

    if (!input || !mode || !preview || !sampleBtn || !swapBtn || !copyBtn || !charsOut || !hangulOut || !englishOut || !modeOut || !help || !output) return;

    const textMap = {
      ko: {
        idle: '입력 대기',
        auto: '자동 판별',
        enToKo: '영어 → 한글 복원',
        koToEn: '한글 → 영어 복원',
        helpIdle: '잘못 입력된 텍스트를 넣으면 한/영 키 배열 기준으로 복원합니다.',
        helpResult: (direction) => `${direction} 기준으로 복원 결과를 만들었습니다. 짧은 혼합 문자열은 방향을 직접 바꾸면 더 정확할 수 있습니다.`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        idle: 'Waiting',
        auto: 'Auto detect',
        enToKo: 'English → Korean',
        koToEn: 'Korean → English',
        helpIdle: 'Paste mistyped text to recover it using the Korean/English keyboard layout mapping.',
        helpResult: (direction) => `Recovered with ${direction}. For short mixed strings, manual direction selection may be more accurate.`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        idle: '入力待ち',
        auto: '自動判定',
        enToKo: '英語 → ハングル復元',
        koToEn: 'ハングル → 英語復元',
        helpIdle: '誤入力テキストを貼り付けると、韓/英キーボード配列 기준で復元します。',
        helpResult: (direction) => `${direction} 기준으로復元しました。短い混在文字列は方向を 직접 선택すると 더 정확할 수 있습니다。`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      idle: '입력 대기', auto: '자동 판별', enToKo: '영어 → 한글 복원', koToEn: '한글 → 영어 복원',
      helpIdle: '잘못 입력된 텍스트를 넣으면 한/영 키 배열 기준으로 복원합니다.',
      helpResult: (direction) => `${direction} 기준으로 복원 결과를 만들었습니다.`, copied: '복사됨', copyDefault: '결과 복사'
    };

    const ENG_TO_JAMO = {
      r:'ㄱ', R:'ㄲ', s:'ㄴ', e:'ㄷ', E:'ㄸ', f:'ㄹ', a:'ㅁ', q:'ㅂ', Q:'ㅃ', t:'ㅅ', T:'ㅆ', d:'ㅇ', w:'ㅈ', W:'ㅉ', c:'ㅊ', z:'ㅋ', x:'ㅌ', v:'ㅍ', g:'ㅎ',
      k:'ㅏ', o:'ㅐ', i:'ㅑ', O:'ㅒ', j:'ㅓ', p:'ㅔ', u:'ㅕ', P:'ㅖ', h:'ㅗ', y:'ㅛ', n:'ㅜ', b:'ㅠ', m:'ㅡ', l:'ㅣ'
    };
    const JAMO_TO_ENG = Object.fromEntries(Object.entries(ENG_TO_JAMO).map(([k, v]) => [v, k]));
    Object.assign(JAMO_TO_ENG, {
      'ㅘ':'hk','ㅙ':'ho','ㅚ':'hl','ㅝ':'nj','ㅞ':'np','ㅟ':'nl','ㅢ':'ml'
    });

    const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
    const JONG = ['', 'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

    const VOWEL_COMBO = {
      'ㅗㅏ':'ㅘ', 'ㅗㅐ':'ㅙ', 'ㅗㅣ':'ㅚ', 'ㅜㅓ':'ㅝ', 'ㅜㅔ':'ㅞ', 'ㅜㅣ':'ㅟ', 'ㅡㅣ':'ㅢ'
    };
    const FINAL_COMBO = {
      'ㄱㅅ':'ㄳ', 'ㄴㅈ':'ㄵ', 'ㄴㅎ':'ㄶ', 'ㄹㄱ':'ㄺ', 'ㄹㅁ':'ㄻ', 'ㄹㅂ':'ㄼ', 'ㄹㅅ':'ㄽ', 'ㄹㅌ':'ㄾ', 'ㄹㅍ':'ㄿ', 'ㄹㅎ':'ㅀ', 'ㅂㅅ':'ㅄ'
    };
    const FINAL_SPLIT = {
      'ㄳ':['ㄱ','ㅅ'], 'ㄵ':['ㄴ','ㅈ'], 'ㄶ':['ㄴ','ㅎ'], 'ㄺ':['ㄹ','ㄱ'], 'ㄻ':['ㄹ','ㅁ'], 'ㄼ':['ㄹ','ㅂ'], 'ㄽ':['ㄹ','ㅅ'], 'ㄾ':['ㄹ','ㅌ'], 'ㄿ':['ㄹ','ㅍ'], 'ㅀ':['ㄹ','ㅎ'], 'ㅄ':['ㅂ','ㅅ']
    };
    const CHO_INDEX = Object.fromEntries(CHO.map((v, i) => [v, i]));
    const JUNG_INDEX = Object.fromEntries(JUNG.map((v, i) => [v, i]));
    const JONG_INDEX = Object.fromEntries(JONG.map((v, i) => [v, i]));
    const isConsonant = (char) => Object.prototype.hasOwnProperty.call(CHO_INDEX, char) || ['ㄳ','ㄵ','ㄶ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅄ'].includes(char);
    const isVowel = (char) => Object.prototype.hasOwnProperty.call(JUNG_INDEX, char);

    const composeSyllable = (cho, jung, jong = '') => {
      if (!(cho in CHO_INDEX) || !(jung in JUNG_INDEX)) return `${cho || ''}${jung || ''}${jong || ''}`;
      const code = 0xAC00 + ((CHO_INDEX[cho] * 21 + JUNG_INDEX[jung]) * 28) + (JONG_INDEX[jong] || 0);
      return String.fromCharCode(code);
    };

    const decomposeHangul = (char) => {
      const code = char.charCodeAt(0);
      if (code < 0xAC00 || code > 0xD7A3) return [char];
      const diff = code - 0xAC00;
      const cho = CHO[Math.floor(diff / 588)];
      const jung = JUNG[Math.floor((diff % 588) / 28)];
      const jong = JONG[diff % 28];
      return [cho, jung, ...(jong ? [jong] : [])];
    };

    const chooseDirection = (value, selectedMode) => {
      if (selectedMode !== 'auto') return selectedMode;
      const englishCount = (value.match(/[A-Za-z]/g) || []).length;
      const hangulCount = (value.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) || []).length;
      if (englishCount === 0 && hangulCount === 0) return 'en-to-ko';
      if (englishCount >= hangulCount) return 'en-to-ko';
      return 'ko-to-en';
    };

    const convertEnToKo = (value) => {
      const mapped = Array.from(value).map((char) => ENG_TO_JAMO[char] || char);
      let result = '';
      let i = 0;
      while (i < mapped.length) {
        const current = mapped[i];
        if (!isConsonant(current) && !isVowel(current)) {
          result += current;
          i += 1;
          continue;
        }

        if (isVowel(current)) {
          result += current;
          i += 1;
          continue;
        }

        let cho = current;
        let jung = null;
        let jong = '';
        let cursor = i + 1;

        if (cursor < mapped.length && isVowel(mapped[cursor])) {
          jung = mapped[cursor];
          cursor += 1;
          if (cursor < mapped.length && isVowel(mapped[cursor])) {
            const combo = VOWEL_COMBO[jung + mapped[cursor]];
            if (combo) {
              jung = combo;
              cursor += 1;
            }
          }
        }

        if (!jung) {
          result += current;
          i += 1;
          continue;
        }

        if (cursor < mapped.length && isConsonant(mapped[cursor])) {
          const firstFinal = mapped[cursor];
          const next = mapped[cursor + 1];
          if (next && isVowel(next)) {
            // keep consonant as next initial
          } else {
            jong = firstFinal;
            cursor += 1;
            const comboCandidate = mapped[cursor];
            const afterCombo = mapped[cursor + 1];
            if (comboCandidate && isConsonant(comboCandidate) && !(afterCombo && isVowel(afterCombo))) {
              const combo = FINAL_COMBO[jong + comboCandidate];
              if (combo) {
                jong = combo;
                cursor += 1;
              }
            }
          }
        }

        result += composeSyllable(cho, jung, jong);
        i = cursor;
      }
      return result;
    };

    const convertKoToEn = (value) => Array.from(value).map((char) => {
      if (/[가-힣]/.test(char)) {
        return decomposeHangul(char).map((jamo) => {
          if (FINAL_SPLIT[jamo]) return FINAL_SPLIT[jamo].map((part) => JAMO_TO_ENG[part] || part).join('');
          return JAMO_TO_ENG[jamo] || jamo;
        }).join('');
      }
      if (FINAL_SPLIT[char]) return FINAL_SPLIT[char].map((part) => JAMO_TO_ENG[part] || part).join('');
      return JAMO_TO_ENG[char] || char;
    }).join('');

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
      const value = input.value || '';
      const englishCount = (value.match(/[A-Za-z]/g) || []).length;
      const hangulCount = (value.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) || []).length;
      const direction = chooseDirection(value, mode.value);
      const converted = direction === 'ko-to-en' ? convertKoToEn(value) : convertEnToKo(value);
      const directionLabel = direction === 'ko-to-en' ? textMap.koToEn : textMap.enToKo;

      charsOut.textContent = formatNum(value.length);
      hangulOut.textContent = formatNum(hangulCount);
      englishOut.textContent = formatNum(englishCount);
      modeOut.textContent = value ? directionLabel : '-';
      preview.value = value ? directionLabel : textMap.idle;
      help.textContent = value ? textMap.helpResult(directionLabel) : textMap.helpIdle;
      output.value = converted;
    };

    input.addEventListener('input', render);
    mode.addEventListener('change', render);
    sampleBtn.addEventListener('click', () => {
      input.value = 'dkssudgktpdy\nㅗ디ㅣㅐ\nrkatkgkqslek';
      mode.value = 'auto';
      render();
    });
    swapBtn.addEventListener('click', () => {
      if (mode.value === 'auto') mode.value = chooseDirection(input.value || '', 'auto') === 'en-to-ko' ? 'ko-to-en' : 'en-to-ko';
      else mode.value = mode.value === 'en-to-ko' ? 'ko-to-en' : 'en-to-ko';
      render();
    });
    copyBtn.addEventListener('click', async () => {
      if (!output.value) return;
      await copyText(output.value);
      const old = copyBtn.textContent;
      copyBtn.textContent = textMap.copied;
      setTimeout(() => { copyBtn.textContent = old || textMap.copyDefault; }, 900);
    });
    render();
  }

  if (slug === 'korean-name-romanizer') {
    const input = document.getElementById('knr-input');
    const caseSel = document.getElementById('knr-case');
    const sepSel = document.getElementById('knr-separator');
    const capSyllable = document.getElementById('knr-cap-syllable');
    const trim = document.getElementById('knr-trim');
    const sampleBtn = document.getElementById('knr-sample');
    const copyBtn = document.getElementById('knr-copy');
    const output = document.getElementById('knr-output');
    const help = document.getElementById('knr-help');
    const hangulCount = document.getElementById('knr-hangul-count');
    const wordCount = document.getElementById('knr-word-count');
    const charCount = document.getElementById('knr-char-count');
    const styleOut = document.getElementById('knr-style-out');

    if (!input || !caseSel || !sepSel || !output || !help) return;

    const L = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
    const V = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
    const T = ['', 'k', 'k', 'ks', 'n', 'nj', 'nh', 't', 'l', 'lk', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'p', 'ps', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 'h'];

    const knrText = {
      ko: {
        help: (count, style) => `한글 ${count}자를 ${style} 기준 로마자 표기로 변환했습니다. 공식 문서에는 기존 등록 영문명을 우선 확인하세요.`,
        idle: '한글 입력을 로마자 표기 초안으로 빠르게 바꿉니다. 공식 서류 제출 전에는 기존 등록 영문명과 기관 기준을 꼭 다시 확인하세요.',
        copied: '복사됨',
        copyDefault: '결과 복사',
        styles: { title: '첫 글자 대문자', lower: '소문자', upper: '대문자', syllable: '음절 단위 대문자' },
        separators: { space: '공백 유지', hyphen: '하이픈', none: '붙여쓰기' },
        sample: '김민준\n서울 책방\n한강 공원 야간 산책'
      },
      en: {
        help: (count, style) => `Converted ${count} Hangul syllable(s) using ${style}. Double-check official registered spellings for passports or formal documents.`,
        idle: 'Convert Hangul input into quick Romanized drafts. For official documents, always verify your registered English spelling first.',
        copied: 'Copied',
        copyDefault: 'Copy result',
        styles: { title: 'Title case', lower: 'Lowercase', upper: 'Uppercase', syllable: 'Syllable caps' },
        separators: { space: 'Keep spaces', hyphen: 'Hyphens', none: 'Join words' },
        sample: '김민준\n서울 책방\n한강 공원 야간 산책'
      },
      ja: {
        help: (count, style) => `ハングル ${count}文字を ${style} 基準でローマ字化しました。公式書類では既存の登録英字名を優先して確認してください。`,
        idle: 'ハングル入力をローマ字表記の下書きに変換します。公式書類では既存の登録表記を必ず確認してください。',
        copied: 'コピー完了',
        copyDefault: '結果をコピー',
        styles: { title: '単語先頭大文字', lower: '小文字', upper: '大文字', syllable: '音節ごと大文字' },
        separators: { space: '空白維持', hyphen: 'ハイフン', none: 'つなげる' },
        sample: '김민준\n서울 책방\n한강 공원 야간 산책'
      }
    }[pageLang] || {
      help: (count, style) => `한글 ${count}자를 ${style} 기준 로마자 표기로 변환했습니다.`,
      idle: '한글 입력을 로마자 표기 초안으로 빠르게 바꿉니다.',
      copied: '복사됨',
      copyDefault: '결과 복사',
      styles: { title: '첫 글자 대문자', lower: '소문자', upper: '대문자', syllable: '음절 단위 대문자' },
      separators: { space: '공백 유지', hyphen: '하이픈', none: '붙여쓰기' },
      sample: '김민준\n서울 책방\n한강 공원 야간 산책'
    };

    const romanizeSyllable = (char) => {
      const code = char.charCodeAt(0);
      if (code < 0xAC00 || code > 0xD7A3) return char;
      const index = code - 0xAC00;
      const l = Math.floor(index / 588);
      const v = Math.floor((index % 588) / 28);
      const t = index % 28;
      return `${L[l]}${V[v]}${T[t]}`;
    };

    const applyCase = (text, mode, syllableMode = false) => {
      if (mode === 'upper') return text.toUpperCase();
      if (mode === 'lower') return text.toLowerCase();
      if (syllableMode) return text.replace(/[A-Za-z]+/g, (token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase());
      return text.replace(/\b([A-Za-z])/g, (m, c) => c.toUpperCase());
    };

    const convertLine = (line) => {
      const normalized = trim.checked ? line.replace(/\s+/g, ' ').trim() : line;
      const converted = Array.from(normalized).map((char) => romanizeSyllable(char)).join('');
      const separatorMode = sepSel.value || 'space';
      let joined = converted;
      if (separatorMode === 'hyphen') joined = joined.replace(/\s+/g, '-');
      if (separatorMode === 'none') joined = joined.replace(/\s+/g, '');
      return applyCase(joined, caseSel.value || 'title', !!capSyllable.checked);
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
      const raw = input.value || '';
      const lines = raw.split(/\n/);
      const convertedLines = lines.map((line) => convertLine(line));
      const result = convertedLines.join('\n');
      const hangulMatches = raw.match(/[가-힣]/g) || [];
      const words = (raw.trim().match(/\S+/g) || []);
      output.value = result;
      hangulCount.textContent = formatNum(hangulMatches.length);
      wordCount.textContent = formatNum(words.length);
      charCount.textContent = formatNum(result.length);
      const styleLabel = `${knrText.styles[caseSel.value || 'title']} · ${knrText.separators[sepSel.value || 'space']}${capSyllable.checked ? ' · ' + knrText.styles.syllable : ''}`;
      styleOut.textContent = styleLabel;
      help.textContent = hangulMatches.length ? knrText.help(formatNum(hangulMatches.length), styleLabel) : knrText.idle;
    };

    [input, caseSel, sepSel, capSyllable, trim].forEach((el) => el?.addEventListener('input', render));
    sampleBtn?.addEventListener('click', () => {
      input.value = knrText.sample;
      render();
    });
    copyBtn?.addEventListener('click', async () => {
      if (!output.value.trim()) return;
      await copyText(output.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = knrText.copied;
      setTimeout(() => { copyBtn.textContent = old || knrText.copyDefault; }, 900);
    });
    render();
  }

  if (slug === 'json-merge') {
    const filesInput = document.getElementById('jm-files');
    const modeSel = document.getElementById('jm-mode');
    const runBtn = document.getElementById('jm-run');
    const dedupeChk = document.getElementById('jm-dedupe');
    const copyBtn = document.getElementById('jm-copy');
    const output = document.getElementById('jm-output');
    const download = document.getElementById('jm-download');
    const help = document.getElementById('jm-help');
    const fileCount = document.getElementById('jm-file-count');
    const itemCount = document.getElementById('jm-item-count');
    const conflictCount = document.getElementById('jm-conflict-count');
    const sizeOut = document.getElementById('jm-size');
    const filesSummary = document.getElementById('jm-files-summary');
    const fileList = document.getElementById('jm-file-list');
    const sampleBtn = document.getElementById('jm-sample');
    const clearBtn = document.getElementById('jm-clear');

    if (!filesInput || !modeSel || !runBtn || !copyBtn || !output || !download || !help || !fileCount || !itemCount || !conflictCount || !sizeOut || !filesSummary || !fileList || !sampleBtn || !clearBtn) return;

    const jmI18n = {
      ko: {
        idle: 'JSON 파일을 선택하거나 예시를 불러와 병합 결과를 확인하세요.',
        readFail: (name) => `파일 읽기 실패: ${name}`,
        parseFail: (name) => `JSON 파싱 실패: ${name}. 쉼표, 따옴표, 중괄호가 맞는지 확인하세요.`,
        needFiles: '먼저 JSON 파일을 1개 이상 선택하세요.',
        tooManyFiles: (count) => `파일이 ${count}개 선택되었습니다. 한 번에 최대 50개까지 합칠 수 있습니다.`,
        tooLarge: (size) => `선택한 파일의 합계가 ${size}MB입니다. 브라우저 보호를 위해 20MB 이하로 줄여 주세요.`,
        filesReady: (count, size) => `${count}개 파일 선택됨 · 합계 ${size}MB · 파일은 브라우저 안에서만 처리됩니다.`,
        filePill: (name, size) => `${name} · ${size}KB`,
        invalidObjectMode: '객체 키 병합은 모든 파일의 루트가 JSON 객체일 때만 사용할 수 있습니다.',
        invalidObjectArrayMode: '공통 배열 이어붙이기는 모든 파일이 같은 이름의 배열 키를 가진 JSON 객체여야 합니다.',
        emptyFile: (name) => `빈 JSON 파일은 병합할 수 없습니다: ${name}`,
        optionChanged: '병합 옵션이 변경되었습니다. JSON 합치기를 다시 실행하세요.',
        working: (count) => `${count}개 JSON 파일을 읽고 병합하는 중입니다.`,
        mergeDone: (count, mode, size) => `${count}개 파일 병합 완료 (${mode}) · 결과 ${size}KB. 다운로드 버튼으로 저장하세요.`,
        mergeError: '병합 중 오류가 발생했습니다.',
        sampleLoaded: '예시 JSON 2개를 객체 내 공통 배열 병합 방식으로 합쳤습니다.',
        cleared: 'JSON 병합 입력과 결과를 초기화했습니다.',
        noCopy: '복사할 병합 결과가 없습니다. 먼저 JSON 합치기를 실행하세요.',
        copied: '복사됨',
        copyFail: '자동 복사를 사용할 수 없습니다. 결과 영역에서 직접 선택해 복사해 주세요.',
        copyDefault: '결과 복사',
        outputTooLarge: '결과가 커서 미리보기는 앞부분만 표시합니다. 전체 내용은 다운로드로 저장하세요.',
        modeLabelMap: {
          'array-concat': '배열 이어붙이기',
          'object-merge': '객체 키 병합',
          'object-array-concat': '객체 내 공통 배열 자동 이어붙이기',
          'wrap-array': '파일별 루트 배열 감싸기'
        }
      },
      en: {
        idle: 'Choose JSON files or load the sample to preview a merge.',
        readFail: (name) => `Failed to read file: ${name}`,
        parseFail: (name) => `JSON parse failed: ${name}. Check commas, quotes, and braces.`,
        needFiles: 'Select at least one JSON file first.',
        tooManyFiles: (count) => `${count} files selected. You can merge up to 50 files at once.`,
        tooLarge: (size) => `Selected files total ${size} MB. Reduce the total to 20 MB or less to protect browser memory.`,
        filesReady: (count, size) => `${count} file(s) selected · ${size} MB total · Files stay in this browser.`,
        filePill: (name, size) => `${name} · ${size} KB`,
        invalidObjectMode: 'Object key merge requires every file root to be a JSON object.',
        invalidObjectArrayMode: 'Common-array merge requires JSON objects that share an array key with the same name.',
        emptyFile: (name) => `Empty JSON files cannot be merged: ${name}`,
        optionChanged: 'Merge options changed. Run JSON merge again.',
        working: (count) => `Reading and merging ${count} JSON file(s).`,
        mergeDone: (count, mode, size) => `Merged ${count} file(s) (${mode}) · ${size} KB output. Use the download button to save.`,
        mergeError: 'An error occurred while merging.',
        sampleLoaded: 'Merged 2 sample JSON objects with the shared-array mode.',
        cleared: 'Cleared the JSON merge input and result.',
        noCopy: 'No merged result to copy. Run JSON merge first.',
        copied: 'Copied',
        copyFail: 'Automatic copy is unavailable. Select the result preview and copy manually.',
        copyDefault: 'Copy result',
        outputTooLarge: 'The result is large, so the preview shows only the beginning. Use download for the full file.',
        modeLabelMap: {
          'array-concat': 'Concatenate arrays',
          'object-merge': 'Merge object keys',
          'object-array-concat': 'Auto-concatenate common array in objects',
          'wrap-array': 'Wrap file roots into array'
        }
      },
      ja: {
        idle: 'JSONファイルを選択するか、サンプルでマージ結果を確認してください。',
        readFail: (name) => `ファイルの読み込みに失敗しました: ${name}`,
        parseFail: (name) => `JSONの解析に失敗しました: ${name}。カンマ、引用符、中括弧を確認してください。`,
        needFiles: '先にJSONファイルを1つ以上選択してください。',
        tooManyFiles: (count) => `${count}個のファイルが選択されています。一度に結合できるのは最大50個です。`,
        tooLarge: (size) => `選択ファイルの合計は${size}MBです。ブラウザ保護のため20MB以下に減らしてください。`,
        filesReady: (count, size) => `${count}個選択 · 合計${size}MB · ファイルはブラウザ内だけで処理されます。`,
        filePill: (name, size) => `${name} · ${size}KB`,
        invalidObjectMode: 'オブジェクトキー結合は、すべてのファイルのルートがJSONオブジェクトの場合のみ使用できます。',
        invalidObjectArrayMode: '共通配列の連結には、同じ名前の配列キーを持つJSONオブジェクトが必要です。',
        emptyFile: (name) => `空のJSONファイルはマージできません: ${name}`,
        optionChanged: '結合オプションが変更されました。JSON結合をもう一度実行してください。',
        working: (count) => `${count}個のJSONファイルを読み込んで結合しています。`,
        mergeDone: (count, mode, size) => `${count}個のファイルをマージしました（${mode}）· 結果${size}KB。ダウンロードで保存してください。`,
        mergeError: 'マージ中にエラーが発生しました。',
        sampleLoaded: 'サンプルJSON 2件を共通配列マージで結合しました。',
        cleared: 'JSON結合の入力と結果をクリアしました。',
        noCopy: 'コピーするマージ結果がありません。先にJSONマージを実行してください。',
        copied: 'コピー完了',
        copyFail: '自動コピーを利用できません。結果プレビューを選択して手動でコピーしてください。',
        copyDefault: '結果をコピー',
        outputTooLarge: '結果が大きいため、プレビューは先頭部分のみ表示しています。全体はダウンロードで保存してください。',
        modeLabelMap: {
          'array-concat': '配列を連結',
          'object-merge': 'オブジェクトキー統合',
          'object-array-concat': 'オブジェクト内の共通配列を自動連結',
          'wrap-array': '各ファイルのルートを配列で包む'
        }
      }
    };
    const jmText = jmI18n[pageLang] || jmI18n.ko;
    const MAX_FILES = 50;
    const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
    const MAX_PREVIEW_CHARS = 120000;
    let downloadUrl = '';
    let currentResult = '';

    const fmt = (n) => Number(n || 0).toLocaleString(numberLocale);
    const formatMb = (bytes) => (bytes / (1024 * 1024)).toLocaleString(numberLocale, { maximumFractionDigits: 2 });
    const formatKb = (bytes) => (bytes / 1024).toLocaleString(numberLocale, { maximumFractionDigits: 1 });

    const setHelp = (message, state = '') => {
      help.textContent = message;
      help.dataset.state = state;
    };

    const clearResult = () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = '';
      currentResult = '';
      output.value = '';
      download.removeAttribute('href');
      download.setAttribute('aria-disabled', 'true');
      copyBtn.disabled = true;
      itemCount.textContent = '-';
      conflictCount.textContent = '-';
      sizeOut.textContent = '-';
    };

    const copyText = async (text) => {
      try {
        if (!navigator.clipboard) throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('copy failed');
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

    const renderFileList = (files) => {
      fileList.replaceChildren();
      files.slice(0, 8).forEach((file) => {
        const pill = document.createElement('span');
        pill.textContent = jmText.filePill(file.name, formatKb(file.size));
        fileList.appendChild(pill);
      });
      if (files.length > 8) {
        const more = document.createElement('span');
        more.textContent = `+${fmt(files.length - 8)}`;
        fileList.appendChild(more);
      }
    };

    const getCount = (value) => {
      if (Array.isArray(value)) return value.length;
      if (value && typeof value === 'object') return Object.keys(value).length;
      return 1;
    };

    const stableStringify = (value) => {
      if (value === null || typeof value !== 'object') return JSON.stringify(value);
      if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
      const keys = Object.keys(value).sort();
      return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
    };

    const dedupeArray = (arr) => {
      const seen = new Set();
      const out = [];
      arr.forEach((item) => {
        const key = stableStringify(item);
        if (seen.has(key)) return;
        seen.add(key);
        out.push(item);
      });
      return out;
    };

    const validateFiles = (files) => {
      if (!files.length) return jmText.needFiles;
      if (files.length > MAX_FILES) return jmText.tooManyFiles(files.length);
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      if (totalBytes > MAX_TOTAL_BYTES) return jmText.tooLarge(formatMb(totalBytes));
      return '';
    };

    filesInput.addEventListener('change', () => {
      const files = Array.from(filesInput.files || []);
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      const error = validateFiles(files);
      clearResult();
      fileCount.textContent = fmt(files.length);
      runBtn.disabled = !!error;
      filesInput.setAttribute('aria-invalid', error ? 'true' : 'false');
      renderFileList(files);
      filesSummary.textContent = error || jmText.filesReady(files.length, formatMb(totalBytes));
      filesSummary.dataset.state = error ? 'error' : '';
      setHelp(error || jmText.filesReady(files.length, formatMb(totalBytes)), error ? 'error' : '');
    });

    [modeSel, dedupeChk].forEach((control) => control?.addEventListener('change', () => {
      if (!output.value) return;
      clearResult();
      setHelp(jmText.optionChanged, 'warning');
    }));

    runBtn.addEventListener('click', async () => {
      const files = Array.from(filesInput.files || []);
      const fileError = validateFiles(files);
      if (fileError) {
        help.textContent = fileError;
        setHelp(fileError, 'error');
        return;
      }

      clearResult();
      runBtn.disabled = true;
      filesInput.setAttribute('aria-invalid', 'false');
      setHelp(jmText.working(files.length));
      try {
        const texts = await Promise.all(files.map(readText));
        const parsed = texts.map((txt, idx) => {
          if (!txt.trim()) throw new Error(jmText.emptyFile(files[idx].name));
          try {
            return JSON.parse(txt);
          } catch (_) {
            throw new Error(jmText.parseFail(files[idx].name));
          }
        });

        const selected = modeSel.value || 'auto';
        const mode = selected === 'auto' ? detectMode(parsed) : selected;
        const dedupeEnabled = !!dedupeChk?.checked;
        const allObjects = parsed.every((value) => value && typeof value === 'object' && !Array.isArray(value));
        if (mode === 'object-merge' && !allObjects) throw new Error(jmText.invalidObjectMode);

        let merged;
        let conflicts = 0;

        if (mode === 'array-concat') {
          const arr = parsed.flatMap((v) => Array.isArray(v) ? v : [v]);
          merged = dedupeEnabled ? dedupeArray(arr) : arr;
        } else if (mode === 'object-array-concat') {
          if (!allObjects) throw new Error(jmText.invalidObjectArrayMode);
          const keySets = parsed.map((obj) => Object.keys(obj));
          const commonKeys = keySets.reduce((acc, keys) => acc.filter((k) => keys.includes(k)), keySets[0] || []);
          const arrayKey = commonKeys.find((k) => parsed.every((obj) => Array.isArray(obj[k])));
          if (!arrayKey) throw new Error(jmText.invalidObjectArrayMode);
          merged = { ...(parsed[0] || {}) };
          const arr = parsed.flatMap((obj) => Array.isArray(obj[arrayKey]) ? obj[arrayKey] : []);
          merged[arrayKey] = dedupeEnabled ? dedupeArray(arr) : arr;
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
        currentResult = pretty;
        output.value = pretty.length > MAX_PREVIEW_CHARS ? `${pretty.slice(0, MAX_PREVIEW_CHARS)}\n...` : pretty;

        const blob = new Blob([pretty], { type: 'application/json;charset=utf-8' });
        downloadUrl = URL.createObjectURL(blob);
        download.href = downloadUrl;
        download.download = `merged-${new Date().toISOString().slice(0, 10)}.json`;
        download.setAttribute('aria-disabled', 'false');
        copyBtn.disabled = false;

        itemCount.textContent = fmt(getCount(merged));
        conflictCount.textContent = fmt(conflicts);
        const outputBytes = new TextEncoder().encode(pretty).length;
        sizeOut.textContent = fmt(outputBytes);
        const doneMessage = jmText.mergeDone(files.length, jmText.modeLabelMap[mode] || mode, formatKb(outputBytes));
        setHelp(pretty.length > MAX_PREVIEW_CHARS ? `${doneMessage} ${jmText.outputTooLarge}` : doneMessage, 'success');
      } catch (err) {
        output.value = '';
        itemCount.textContent = '-';
        conflictCount.textContent = '-';
        sizeOut.textContent = '-';
        setHelp(err?.message || jmText.mergeError, 'error');
      } finally {
        runBtn.disabled = false;
      }
    });

    sampleBtn.addEventListener('click', () => {
      clearResult();
      const sample = {
        source: 'toolog-sample',
        items: [
          { id: 1, title: 'alpha', status: 'open' },
          { id: 2, title: 'beta', status: 'done' },
          { id: 3, title: 'gamma', status: 'open' }
        ],
        updatedAt: '2026-06-29'
      };
      const pretty = JSON.stringify(sample, null, 2);
      currentResult = pretty;
      output.value = pretty;
      const blob = new Blob([pretty], { type: 'application/json;charset=utf-8' });
      downloadUrl = URL.createObjectURL(blob);
      download.href = downloadUrl;
      download.download = `merged-sample-${new Date().toISOString().slice(0, 10)}.json`;
      download.setAttribute('aria-disabled', 'false');
      itemCount.textContent = fmt(sample.items.length);
      conflictCount.textContent = '1';
      sizeOut.textContent = fmt(new TextEncoder().encode(pretty).length);
      fileCount.textContent = '2';
      copyBtn.disabled = false;
      modeSel.value = 'object-array-concat';
      dedupeChk.checked = true;
      filesInput.value = '';
      filesInput.setAttribute('aria-invalid', 'false');
      fileList.replaceChildren();
      filesSummary.textContent = jmText.sampleLoaded;
      filesSummary.dataset.state = '';
      setHelp(jmText.sampleLoaded, 'success');
    });

    clearBtn.addEventListener('click', () => {
      clearResult();
      filesInput.value = '';
      fileCount.textContent = '0';
      runBtn.disabled = true;
      filesInput.setAttribute('aria-invalid', 'false');
      fileList.replaceChildren();
      filesSummary.textContent = jmText.idle;
      filesSummary.dataset.state = '';
      setHelp(jmText.cleared);
    });

    copyBtn.addEventListener('click', async () => {
      const text = currentResult || output.value || '';
      if (!text.trim()) {
        setHelp(jmText.noCopy, 'error');
        return;
      }
      try {
        await copyText(text);
        const old = copyBtn.textContent;
        copyBtn.textContent = jmText.copied;
        setHelp(jmText.copied, 'success');
        setTimeout(() => { copyBtn.textContent = old || jmText.copyDefault; }, 900);
      } catch (_) {
        setHelp(jmText.copyFail, 'error');
      }
    });
  }

  if (slug === 'font-change') {
    const input = document.getElementById('fc-input');
    const filter = document.getElementById('fc-filter');
    const list = document.getElementById('fc-list');
    const status = document.getElementById('fc-status');
    const toast = document.getElementById('fc-toast');
    const showFavBtn = document.getElementById('fc-show-fav');
    const showAllBtn = document.getElementById('fc-show-all');
    const clearFavBtn = document.getElementById('fc-clear-fav');
    const clearInputBtn = document.getElementById('fc-clear-input');
    const sampleBtn = document.getElementById('fc-sample');
    const copyVisibleBtn = document.getElementById('fc-copy-visible');
    const charCount = document.getElementById('fc-char-count');
    const styleCount = document.getElementById('fc-style-count');
    const convertedCount = document.getElementById('fc-converted-count');
    const unchangedCount = document.getElementById('fc-unchanged-count');
    if (!input || !list) return;

    const favStoreKey = 'toolog-font-favorites-v1';
    let favorites = new Set();
    let onlyFav = false;
    let showAll = false;
    let visibleResults = [];

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
        normal: '標準',
        bold: '太字（セリフ）',
        italic: '斜体（セリフ）',
        'bold-italic': '太字斜体（セリフ）',
        sans: 'サンセリフ',
        'sans-bold': 'サンセリフ太字',
        'sans-italic': 'サンセリフ斜体',
        'sans-bold-italic': 'サンセリフ太字斜体',
        script: 'スクリプト',
        'script-bold': 'スクリプト太字',
        fraktur: 'フラクトゥール',
        'fraktur-bold': 'フラクトゥール太字',
        'double-struck': '黒板太字（Double Struck）',
        monospace: '等幅',
        'small-caps': 'スモールキャップ',
        'small-caps-strict': 'スモールキャップ（厳密）',
        'bottom-mix': '下付きミックス',
        'mini-bottom-align': 'ミニ下付き',
        'tiny-subscript-final': '極小下付き',
        circled: '丸囲み',
        'circled-negative': '白抜き丸囲み',
        squared: '四角囲み',
        'squared-negative': '白抜き四角囲み',
        parenthesized: '括弧付き',
        'full-width': '全角',
        'upside-down': '上下反転',
        'strike-through': '取り消し線',
        underline: '下線',
        slash: 'スラッシュ',
        crossed: 'クロス線',
        overline: '上線',
        'underline-overline': '上下線',
        'long-strike': '長い取り消し線',
        'double-slash': 'スラッシュ×3',
        'regional-indicator': '地域インジケーター',
        superscript: '上付き',
        subscript: '下付き',
        'cloud-top': '上付き記号（ウムラウト）',
        'double-top': '上付き記号（ダブル）',
        'dot-below': '下付き記号',
        'zigzag-combo': '複合ジグザグ',
        joiner: '連結スタイル',
        'spark-combo': 'スパーク複合',
        'khmer-mark': 'クメール記号',
        'thai-comb-1a5a': '結合記号 ᩚ',
        'wing-only': 'ウィング装飾',
        'alt-alpha': '代替アルファ',
        'alt-cyrillic': '代替キリル',
        'alt-box': '代替ボックス'
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

    const fcText = {
      ko: {
        visible: (n) => `${formatNum(n)}개 스타일을 표시하고 있습니다. 스타일을 선택하면 결과를 복사합니다.`,
        empty: '입력 전에는 예시 문구로 스타일을 미리 볼 수 있습니다.',
        noMatch: '검색 조건에 맞는 스타일이 없습니다.',
        noFav: '즐겨찾기된 폰트가 없습니다.',
        noVisible: '복사할 표시 스타일이 없습니다.',
        copied: (label) => `${label} 스타일을 복사했습니다.`,
        copiedVisible: (n) => `${formatNum(n)}개 표시 스타일을 한 번에 복사했습니다.`,
        copyFail: '자동 복사에 실패했습니다. 브라우저의 클립보드 권한을 확인해 주세요.',
        cleared: '입력과 스타일 검색을 초기화했습니다.',
        favCleared: '즐겨찾기를 초기화했습니다.',
        favAdded: (label) => `${label} 스타일을 즐겨찾기에 추가했습니다.`,
        favRemoved: (label) => `${label} 스타일을 즐겨찾기에서 제거했습니다.`,
        sample: 'daily mood 2026',
        copyLabel: (label) => `${label} 스타일 결과 복사`
      },
      en: {
        visible: (n) => `Showing ${formatNum(n)} styles. Select a style to copy its result.`,
        empty: 'Previewing styles with sample text until you enter your own.',
        noMatch: 'No styles match your search.',
        noFav: 'No favorite styles yet.',
        noVisible: 'There are no visible styles to copy.',
        copied: (label) => `Copied the ${label} style.`,
        copiedVisible: (n) => `Copied ${formatNum(n)} visible styles.`,
        copyFail: 'Copy failed. Check your browser clipboard permission.',
        cleared: 'Cleared the text and style search.',
        favCleared: 'Reset favorites.',
        favAdded: (label) => `Added ${label} to favorites.`,
        favRemoved: (label) => `Removed ${label} from favorites.`,
        sample: 'daily mood 2026',
        copyLabel: (label) => `Copy ${label} style result`
      },
      ja: {
        visible: (n) => `${formatNum(n)}件のスタイルを表示しています。選択すると結果をコピーします。`,
        empty: '入力前はサンプル文でスタイルをプレビューできます。',
        noMatch: '検索条件に一致するスタイルがありません。',
        noFav: 'お気に入り登録されたスタイルがありません。',
        noVisible: 'コピーできる表示スタイルがありません。',
        copied: (label) => `${label}スタイルをコピーしました。`,
        copiedVisible: (n) => `${formatNum(n)}件の表示スタイルをコピーしました。`,
        copyFail: 'コピーに失敗しました。ブラウザのクリップボード権限を確認してください。',
        cleared: '入力とスタイル検索をクリアしました。',
        favCleared: 'お気に入りをリセットしました。',
        favAdded: (label) => `${label}をお気に入りに追加しました。`,
        favRemoved: (label) => `${label}をお気に入りから削除しました。`,
        sample: 'daily mood 2026',
        copyLabel: (label) => `${label}スタイルの結果をコピー`
      }
    }[pageLang] || {};

    const setStatus = (message, state = '') => {
      if (!status) return;
      status.textContent = message;
      status.dataset.state = state;
    };

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        let copied = false;
        try {
          copied = document.execCommand('copy');
        } catch (_) {}
        document.body.removeChild(ta);
        return copied;
      }
    };

    const saveFav = () => {
      try {
        localStorage.setItem(favStoreKey, JSON.stringify(Array.from(favorites)));
      } catch (_) {}
    };

    let t;
    const showToast = (message) => {
      if (!toast) return;
      toast.textContent = message;
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
      const query = (filter?.value || '').trim().toLocaleLowerCase(pageLang === 'ja' ? 'ja-JP' : (pageLang === 'en' ? 'en-US' : 'ko-KR'));
      list.innerHTML = '';
      visibleResults = [];
      let targets = showAll ? fontMap : fontMap.filter((f) => safeKeys.has(f.key));
      if (onlyFav) targets = targets.filter((f) => favorites.has(f.key));
      if (query) targets = targets.filter((f) => `${f.key} ${f.label} ${getStyleLabel(f)}`.toLocaleLowerCase().includes(query));
      if (charCount) charCount.textContent = formatNum([...value].length);
      if (styleCount) styleCount.textContent = formatNum(targets.length);

      if (!targets.length) {
        const message = query ? fcText.noMatch : fcText.noFav;
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = message;
        list.appendChild(empty);
        if (convertedCount) convertedCount.textContent = '0';
        if (unchangedCount) unchangedCount.textContent = '0';
        setStatus(message, 'error');
        return;
      }

      let changed = 0;
      let unchanged = 0;
      targets.forEach((font) => {
        const sampleText = pageLang === 'en' ? 'Hello Font' : (pageLang === 'ja' ? 'フォントサンプル' : '폰트 샘플');
        const sourceText = value || sampleText;
        const out = font.convert(sourceText);
        if (out === sourceText) unchanged += 1;
        else changed += 1;
        visibleResults.push({ label: getStyleLabel(font), text: out });

        const item = document.createElement('div');
        item.className = 'font-preview-item';

        const favBtn = document.createElement('button');
        favBtn.type = 'button';
        favBtn.className = `font-fav-btn ${favorites.has(font.key) ? 'active' : ''}`;
        favBtn.textContent = favorites.has(font.key) ? '★' : '☆';
        favBtn.title = pageLang === 'en' ? 'Favorite' : (pageLang === 'ja' ? 'お気に入り' : '즐겨찾기');
        favBtn.setAttribute('aria-label', `${favBtn.title}: ${getStyleLabel(font)}`);
        favBtn.setAttribute('aria-pressed', favorites.has(font.key) ? 'true' : 'false');

        const body = document.createElement('div');
        body.className = 'font-preview-body';
        body.setAttribute('role', 'button');
        body.tabIndex = 0;
        body.setAttribute('aria-label', fcText.copyLabel(getStyleLabel(font)));

        const name = document.createElement('span');
        name.className = 'font-preview-name';
        name.textContent = getStyleLabel(font);

        const text = document.createElement('span');
        text.className = 'font-preview-text';
        text.textContent = out;

        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const label = getStyleLabel(font);
          let message;
          if (favorites.has(font.key)) {
            favorites.delete(font.key);
            message = fcText.favRemoved(label);
          } else {
            favorites.add(font.key);
            message = fcText.favAdded(label);
          }
          saveFav();
          render();
          setStatus(message, 'success');
        });

        const copyResult = async () => {
          const copied = await copyText(out);
          if (!copied) {
            setStatus(fcText.copyFail, 'error');
            showToast(fcText.copyFail);
            return;
          }
          item.classList.add('copied');
          setTimeout(() => item.classList.remove('copied'), 650);
          const message = fcText.copied(getStyleLabel(font));
          setStatus(message, 'success');
          showToast(message);
        };

        body.addEventListener('click', copyResult);
        body.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          copyResult();
        });

        body.appendChild(name);
        body.appendChild(text);
        item.appendChild(favBtn);
        item.appendChild(body);
        list.appendChild(item);
      });
      if (convertedCount) convertedCount.textContent = formatNum(changed);
      if (unchangedCount) unchangedCount.textContent = formatNum(unchanged);
      setStatus(value ? fcText.visible(targets.length) : fcText.empty);
    };

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(render, 80);
    });
    filter?.addEventListener('input', render);

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
      setStatus(fcText.favCleared);
    });

    sampleBtn?.addEventListener('click', () => {
      input.value = fcText.sample;
      render();
      input.focus();
    });

    copyVisibleBtn?.addEventListener('click', async () => {
      if (!visibleResults.length) {
        setStatus(fcText.noVisible, 'error');
        return;
      }
      const text = visibleResults.map((item) => `${item.label}: ${item.text}`).join('\n');
      const copied = await copyText(text);
      if (!copied) {
        setStatus(fcText.copyFail, 'error');
        showToast(fcText.copyFail);
        return;
      }
      const message = fcText.copiedVisible(visibleResults.length);
      setStatus(message, 'success');
      showToast(message);
    });

    clearInputBtn?.addEventListener('click', () => {
      input.value = '';
      if (filter) filter.value = '';
      render();
      setStatus(fcText.cleared);
      input.focus();
    });

    updateButtonsText();
    render();
  }
  if (slug === 'work-end-time-calculator') {
    const startEl = document.getElementById('we-start');
    const workEl = document.getElementById('we-work-hours');
    const breakEl = document.getElementById('we-break-minutes');
    const endEl = document.getElementById('we-end-time');
    const stayEl = document.getElementById('we-total-stay');
    const nextEl = document.getElementById('we-next-day');
    const breakSummaryEl = document.getElementById('we-break-summary');
    const help = document.getElementById('we-help');
    const copyBtn = document.getElementById('we-copy');
    const resetBtn = document.getElementById('we-reset');

    if (!startEl || !workEl || !breakEl || !endEl || !stayEl || !nextEl || !breakSummaryEl || !help) return;

    const t = {
      ko: {
        needInput: '출근 시각과 근무시간을 입력하세요.',
        nextSame: '당일',
        nextDay: (n) => `+${n}일`,
        breakSummary: (m) => `총 ${m}분`,
        help: (end, day) => `예상 퇴근 시각은 ${end} (${day}) 입니다.`,
        copy: (e,s,d,b) => `퇴근 시간 계산 결과 | 퇴근 ${e} | 체류 ${s} | 날짜 ${d} | 휴게 ${b}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        needInput: 'Enter start time and work hours.',
        nextSame: 'Same day',
        nextDay: (n) => `+${n} day(s)`,
        breakSummary: (m) => `${m} min total`,
        help: (end, day) => `Estimated clock-out time: ${end} (${day}).`,
        copy: (e,s,d,b) => `Work end time | End ${e} | Stay ${s} | Day ${d} | Break ${b}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        needInput: '出勤時刻と勤務時間を入力してください。',
        nextSame: '当日',
        nextDay: (n) => `+${n}日`,
        breakSummary: (m) => `合計 ${m}分`,
        help: (end, day) => `退勤予定時刻は ${end}（${day}）です。`,
        copy: (e,s,d,b) => `退勤時刻計算 | 退勤 ${e} | 滞在 ${s} | 日付 ${d} | 休憩 ${b}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || null;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const fmtHM = (minutes) => {
      const m = ((minutes % 1440) + 1440) % 1440;
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };

    const render = () => {
      const start = startEl.value || '';
      const workHours = Number(workEl.value || 0);
      const breakMinutes = Number(breakEl.value || 0);

      if (!start || !(workHours > 0)) {
        endEl.textContent = '-'; stayEl.textContent = '-'; nextEl.textContent = '-'; breakSummaryEl.textContent = '-';
        help.textContent = t.needInput;
        return;
      }

      const [h, m] = start.split(':').map(Number);
      const startMinutes = (h * 60) + m;
      const totalMinutes = Math.round(workHours * 60 + Math.max(0, breakMinutes));
      const endMinutesRaw = startMinutes + totalMinutes;
      const dayOffset = Math.floor(endMinutesRaw / 1440);
      const endTime = fmtHM(endMinutesRaw);

      endEl.textContent = endTime;
      stayEl.textContent = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
      nextEl.textContent = dayOffset > 0 ? t.nextDay(dayOffset) : t.nextSame;
      breakSummaryEl.textContent = t.breakSummary(Math.max(0, breakMinutes));
      help.textContent = t.help(endTime, nextEl.textContent);
    };

    [startEl, workEl, breakEl].forEach((el) => el.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      startEl.value = '09:00';
      workEl.value = '8';
      breakEl.value = '60';
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (endEl.textContent === '-') return;
      await copyText(t.copy(endEl.textContent, stayEl.textContent, nextEl.textContent, breakSummaryEl.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    if (!startEl.value) startEl.value = '09:00';
    if (!workEl.value) workEl.value = '8';
    if (!breakEl.value) breakEl.value = '60';
    render();
  }

  if (slug === 'savings-interest-calculator') {
    const principal = document.getElementById('si-principal');
    const rate = document.getElementById('si-rate');
    const months = document.getElementById('si-months');
    const method = document.getElementById('si-method');
    const tax = document.getElementById('si-tax');
    const grossInterestEl = document.getElementById('si-gross-interest');
    const taxAmountEl = document.getElementById('si-tax-amount');
    const netInterestEl = document.getElementById('si-net-interest');
    const maturityEl = document.getElementById('si-maturity');
    const help = document.getElementById('si-help');
    const copyBtn = document.getElementById('si-copy');
    const resetBtn = document.getElementById('si-reset');

    if (!principal || !rate || !months || !method || !tax || !grossInterestEl || !taxAmountEl || !netInterestEl || !maturityEl || !help) return;

    const t = {
      ko: {
        needInput: '예치금·금리·기간을 입력하세요.',
        summary: (gross, net) => `세전 이자 ${gross}, 세후 이자 ${net} 기준 결과입니다.`,
        copy: (g, t, n, m) => `예금 이자 계산 결과 | 세전 이자 ${g} | 세금 ${t} | 세후 이자 ${n} | 만기금액 ${m}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        needInput: 'Enter deposit, rate, and term.',
        summary: (gross, net) => `Estimated result based on pre-tax interest ${gross} and after-tax interest ${net}.`,
        copy: (g, t, n, m) => `Savings interest result | Pre-tax interest ${g} | Tax ${t} | After-tax interest ${n} | Maturity amount ${m}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        needInput: '預入額・金利・期間を入力してください。',
        summary: (gross, net) => `税引前利息 ${gross}、税引後利息 ${net} の試算結果です。`,
        copy: (g, t, n, m) => `預金利息計算結果 | 税引前利息 ${g} | 税額 ${t} | 税引後利息 ${n} | 満期金額 ${m}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      needInput: '예치금·금리·기간을 입력하세요.',
      summary: (gross, net) => `세전 이자 ${gross}, 세후 이자 ${net} 기준 결과입니다.`,
      copy: (g, t, n, m) => `예금 이자 계산 결과 | 세전 이자 ${g} | 세금 ${t} | 세후 이자 ${n} | 만기금액 ${m}`,
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const fmtMoney = (v) => `${Math.round(v || 0).toLocaleString(numberLocale)}${pageLang === 'en' ? ' KRW' : (pageLang === 'ja' ? 'ウォン' : '원')}`;

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
      grossInterestEl.textContent = '-';
      taxAmountEl.textContent = '-';
      netInterestEl.textContent = '-';
      maturityEl.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const p = Math.max(0, Number(principal.value || 0));
      const r = Math.max(0, Number(rate.value || 0));
      const m = Math.max(1, Math.floor(Number(months.value || 0)));
      const taxRate = Math.max(0, Number(tax.value || 0)) / 100;

      if (!(p > 0) || !(r >= 0) || !(m > 0)) {
        setIdle(t.needInput);
        return;
      }

      if (Number(months.value || 0) !== m) months.value = m;

      const annualRate = r / 100;
      let grossInterest = 0;
      if ((method.value || 'simple') === 'monthly-compound') {
        const monthlyRate = annualRate / 12;
        grossInterest = p * (Math.pow(1 + monthlyRate, m) - 1);
      } else {
        grossInterest = p * annualRate * (m / 12);
      }

      const taxAmount = grossInterest * taxRate;
      const netInterest = grossInterest - taxAmount;
      const maturity = p + netInterest;

      grossInterestEl.textContent = fmtMoney(grossInterest);
      taxAmountEl.textContent = fmtMoney(taxAmount);
      netInterestEl.textContent = fmtMoney(netInterest);
      maturityEl.textContent = fmtMoney(maturity);
      help.textContent = t.summary(fmtMoney(grossInterest), fmtMoney(netInterest));
    };

    [principal, rate, months, method, tax].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (maturityEl.textContent === '-') return;
      const text = t.copy(grossInterestEl.textContent, taxAmountEl.textContent, netInterestEl.textContent, maturityEl.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      principal.value = 10000000;
      rate.value = 3.5;
      months.value = 12;
      method.value = 'simple';
      tax.value = '15.4';
      render();
    });

    if (!principal.value) principal.value = 10000000;
    if (!rate.value) rate.value = 3.5;
    if (!months.value) months.value = 12;
    render();
  }

  if (slug === 'parking-fee-calculator') {
    const minutes = document.getElementById('pf-minutes');
    const baseMinutes = document.getElementById('pf-base-minutes');
    const baseFee = document.getElementById('pf-base-fee');
    const unitMinutes = document.getElementById('pf-unit-minutes');
    const unitFee = document.getElementById('pf-unit-fee');
    const maxFee = document.getElementById('pf-max-fee');
    const outTotal = document.getElementById('pf-total');
    const outOver = document.getElementById('pf-over-minutes');
    const outUnits = document.getElementById('pf-units');
    const outCap = document.getElementById('pf-cap-applied');
    const help = document.getElementById('pf-help');
    const copyBtn = document.getElementById('pf-copy');
    const resetBtn = document.getElementById('pf-reset');

    if (!minutes || !baseMinutes || !baseFee || !unitMinutes || !unitFee || !maxFee || !outTotal || !outOver || !outUnits || !outCap || !help) return;

    const i18n = {
      ko: {
        currency: '원',
        minute: '분',
        unit: '회',
        yes: '적용',
        no: '미적용',
        needInput: '주차 시간과 요금 조건을 입력하세요.',
        summary: (fee) => `예상 주차요금은 ${fee}입니다.`,
        copy: (a, b, c, d) => `주차요금 계산 결과 | 요금 ${a} | 초과시간 ${b} | 과금단위 ${c} | 최대요금 ${d}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW',
        minute: ' min',
        unit: ' units',
        yes: 'Applied',
        no: 'Not applied',
        needInput: 'Enter parking time and pricing policy.',
        summary: (fee) => `Estimated parking fee: ${fee}.`,
        copy: (a, b, c, d) => `Parking fee result | Fee ${a} | Overtime ${b} | Charged units ${c} | Max fee ${d}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        currency: 'ウォン',
        minute: '分',
        unit: '回',
        yes: '適用',
        no: '未適用',
        needInput: '駐車時間と料金条件を入力してください。',
        summary: (fee) => `予想駐車料金は ${fee} です。`,
        copy: (a, b, c, d) => `駐車料金計算結果 | 料金 ${a} | 超過時間 ${b} | 課金単位 ${c} | 最大料金 ${d}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const t = i18n[pageLang] || i18n.ko;

    const fmtMoney = (v) => {
      const rounded = Math.round(v || 0).toLocaleString(numberLocale);
      return `${rounded}${t.currency}`;
    };
    const fmtMinute = (v) => `${Math.max(0, Math.round(v || 0)).toLocaleString(numberLocale)}${t.minute}`;
    const fmtUnit = (v) => `${Math.max(0, Math.round(v || 0)).toLocaleString(numberLocale)}${t.unit}`;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      outTotal.textContent = '-';
      outOver.textContent = '-';
      outUnits.textContent = '-';
      outCap.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const m = Math.max(0, Number(minutes.value || 0));
      const bm = Math.max(0, Number(baseMinutes.value || 0));
      const bf = Math.max(0, Number(baseFee.value || 0));
      const um = Math.max(1, Number(unitMinutes.value || 1));
      const uf = Math.max(0, Number(unitFee.value || 0));
      const mfRaw = Number(maxFee.value || 0);
      const mf = Number.isFinite(mfRaw) && mfRaw > 0 ? mfRaw : 0;

      if (!(m > 0)) {
        setIdle(t.needInput);
        return;
      }

      const over = Math.max(0, m - bm);
      const units = over > 0 ? Math.ceil(over / um) : 0;
      const rawFee = bf + (units * uf);
      const finalFee = mf > 0 ? Math.min(rawFee, mf) : rawFee;
      const capApplied = mf > 0 && rawFee > mf;

      outTotal.textContent = fmtMoney(finalFee);
      outOver.textContent = fmtMinute(over);
      outUnits.textContent = fmtUnit(units);
      outCap.textContent = capApplied ? t.yes : t.no;
      help.textContent = t.summary(fmtMoney(finalFee));
    };

    [minutes, baseMinutes, baseFee, unitMinutes, unitFee, maxFee].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (outTotal.textContent === '-') return;
      await copyText(t.copy(outTotal.textContent, outOver.textContent, outUnits.textContent, outCap.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      minutes.value = 135;
      baseMinutes.value = 60;
      baseFee.value = 2000;
      unitMinutes.value = 10;
      unitFee.value = 500;
      maxFee.value = 15000;
      render();
    });

    if (!minutes.value) minutes.value = 135;
    if (!baseMinutes.value) baseMinutes.value = 60;
    if (!baseFee.value) baseFee.value = 2000;
    if (!unitMinutes.value) unitMinutes.value = 10;
    if (!unitFee.value) unitFee.value = 500;
    render();
  }

  if (slug === 'lucky-draw-picker') {
    const input = document.getElementById('ldp-input');
    const count = document.getElementById('ldp-count');
    const runBtn = document.getElementById('ldp-run');
    const copyBtn = document.getElementById('ldp-copy');
    const output = document.getElementById('ldp-output');
    const totalEl = document.getElementById('ldp-total');
    const pickedEl = document.getElementById('ldp-picked');
    const help = document.getElementById('ldp-help');
    if (!input || !count || !runBtn || !copyBtn || !output || !totalEl || !pickedEl || !help) return;

    const t = {
      ko: {
        needInput: '참여자를 1명 이상 입력하세요.',
        done: (p, w) => `${p}명 중 ${w}명 추첨 완료`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        needInput: 'Enter at least one participant.',
        done: (p, w) => `Picked ${w} winner(s) from ${p} participant(s).`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        needInput: '参加者を1名以上入力してください。',
        done: (p, w) => `${p}名中 ${w}名の抽選が完了しました。`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      needInput: '참여자를 1명 이상 입력하세요.',
      done: (p, w) => `${p}명 중 ${w}명 추첨 완료`,
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const uniqueNames = () => {
      const lines = (input.value || '').split('\n').map(v => v.trim()).filter(Boolean);
      return Array.from(new Set(lines));
    };

    const shuffle = (arr) => {
      const out = [...arr];
      for (let i = out.length - 1; i > 0; i--) {
        const rand = new Uint32Array(1);
        crypto.getRandomValues(rand);
        const j = rand[0] % (i + 1);
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    };

    const run = () => {
      const users = uniqueNames();
      totalEl.textContent = users.length.toLocaleString(numberLocale);
      if (!users.length) {
        output.value = '';
        pickedEl.textContent = '0';
        help.textContent = t.needInput;
        return;
      }
      const wantedRaw = Number(count.value || 1);
      const wanted = Math.min(users.length, Math.max(1, Math.floor(wantedRaw)));
      count.value = wanted;
      const winners = shuffle(users).slice(0, wanted);
      output.value = winners.map((name, idx) => `${idx + 1}. ${name}`).join('\n');
      pickedEl.textContent = wanted.toLocaleString(numberLocale);
      help.textContent = t.done(users.length.toLocaleString(numberLocale), wanted.toLocaleString(numberLocale));
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    runBtn.addEventListener('click', run);
    input.addEventListener('input', () => {
      const users = uniqueNames();
      totalEl.textContent = users.length.toLocaleString(numberLocale);
      if (users.length && Number(count.value || 1) > users.length) count.value = users.length;
    });

    copyBtn.addEventListener('click', async () => {
      if (!output.value.trim()) return;
      await copyText(output.value);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });
  }

  if (slug === 'gift-idea-picker') {
    const relationEl = document.getElementById('gip-relation');
    const occasionEl = document.getElementById('gip-occasion');
    const budgetEl = document.getElementById('gip-budget');
    const styleEl = document.getElementById('gip-style');
    const speedEl = document.getElementById('gip-speed');
    const avoidFoodEl = document.getElementById('gip-avoid-food');
    const wrapEl = document.getElementById('gip-wrap');
    const runBtn = document.getElementById('gip-run');
    const sampleBtn = document.getElementById('gip-sample');
    const copyBtn = document.getElementById('gip-copy');
    const countEl = document.getElementById('gip-count');
    const topEl = document.getElementById('gip-top');
    const budgetTagEl = document.getElementById('gip-budget-tag');
    const speedTagEl = document.getElementById('gip-speed-tag');
    const helpEl = document.getElementById('gip-help');
    const outputEl = document.getElementById('gip-output');
    if (!relationEl || !occasionEl || !budgetEl || !styleEl || !speedEl || !avoidFoodEl || !wrapEl || !runBtn || !sampleBtn || !copyBtn || !countEl || !topEl || !budgetTagEl || !speedTagEl || !helpEl || !outputEl) return;

    const t = {
      ko: {
        copied: '복사됨',
        copyDefault: '결과 복사',
        help: (count, top) => `${count}개의 후보를 골랐어요. 지금 조건엔 ${top} 계열이 가장 잘 맞아요.`,
        none: '조건에 맞는 후보가 부족해요. 예산이나 분위기를 조금 넓혀 다시 골라보세요.'
      },
      en: {
        copied: 'Copied',
        copyDefault: 'Copy result',
        help: (count, top) => `Picked ${count} ideas. ${top} fits your current filters best.`,
        none: 'Not enough matches. Try widening the budget or vibe.'
      },
      ja: {
        copied: 'コピー完了',
        copyDefault: '結果をコピー',
        help: (count, top) => `${count}件を選びました。今の条件では ${top} 系が最も相性よさそうです。`,
        none: '条件に合う候補が少ないです。予算や雰囲気を少し広げてみてください。'
      }
    }[pageLang] || {
      copied: '복사됨', copyDefault: '결과 복사', help: (count, top) => `${count}개의 후보를 골랐어요. 지금 조건엔 ${top} 계열이 가장 잘 맞아요.`, none: '조건에 맞는 후보가 부족해요. 예산이나 분위기를 조금 넓혀 다시 골라보세요.'
    };

    const ideas = [
      { name: '핸드크림 + 립밤 세트', type: '실용 소형', relations: ['friend','partner','family','coworker'], occasions: ['birthday','thanks','seasonal'], budgets: ['light'], styles: ['practical','cozy'], speeds: ['rush','normal'], food: false, easyWrap: true, why: '호불호가 비교적 적고 계절감도 챙기기 쉬워요.', caution: '향이 강하면 취향 차이가 있을 수 있어요.' },
      { name: '디저트/커피 기프티콘', type: '즉시 전달', relations: ['friend','coworker','kid'], occasions: ['thanks','birthday','congrats'], budgets: ['light'], styles: ['fun','practical'], speeds: ['rush'], food: true, easyWrap: true, why: '오늘 바로 보내기 좋고 부담이 적어요.', caution: '카페 취향이나 사용 가능 지역을 확인하면 더 좋아요.' },
      { name: '텀블러 또는 머그', type: '생활용품', relations: ['friend','family','coworker','partner'], occasions: ['birthday','thanks','congrats'], budgets: ['mid'], styles: ['practical','cozy'], speeds: ['normal','planned'], food: false, easyWrap: true, why: '실사용 빈도가 높아 실패 확률이 낮아요.', caution: '이미 비슷한 제품이 많은 사람에겐 중복될 수 있어요.' },
      { name: '향초/디퓨저', type: '분위기 선물', relations: ['partner','friend','family'], occasions: ['birthday','anniversary','seasonal'], budgets: ['mid'], styles: ['cozy','luxury'], speeds: ['normal','planned'], food: false, easyWrap: true, why: '집에서 쓰는 순간마다 선물 기억이 남기 쉬워요.', caution: '향 취향이 분명한 사람에겐 무향 대안이 더 안전해요.' },
      { name: '고급 과일/간식 박스', type: '공유형 선물', relations: ['family','coworker','friend'], occasions: ['thanks','seasonal','congrats'], budgets: ['mid','high'], styles: ['cozy','luxury'], speeds: ['normal','planned'], food: true, easyWrap: false, why: '여럿이 함께 나누기 좋고 예의 있는 느낌이 있어요.', caution: '알레르기나 당 조절이 필요한지 살피면 좋아요.' },
      { name: '책 + 짧은 메모', type: '취향형', relations: ['friend','partner','kid','family'], occasions: ['birthday','thanks','congrats'], budgets: ['mid'], styles: ['cozy','practical'], speeds: ['normal','planned'], food: false, easyWrap: true, why: '취향이 맞으면 기억에 오래 남는 선물이 됩니다.', caution: '상대 관심사를 어느 정도 알고 있을 때 더 잘 맞아요.' },
      { name: '무선 충전기/테크 소품', type: '테크 실용', relations: ['partner','friend','coworker'], occasions: ['birthday','congrats'], budgets: ['mid','high'], styles: ['practical','luxury'], speeds: ['normal','planned'], food: false, easyWrap: true, why: '일상에서 바로 쓰기 좋고 만족도가 높은 편이에요.', caution: '기기 규격이나 이미 보유 중인지 확인하면 더 안전해요.' },
      { name: '꽃다발 + 카드', type: '감성 포인트', relations: ['partner','family','friend'], occasions: ['birthday','anniversary','congrats'], budgets: ['mid','high'], styles: ['cozy','luxury'], speeds: ['rush','normal'], food: false, easyWrap: false, why: '축하와 마음 표현이 가장 직관적으로 전달돼요.', caution: '보관 시간과 이동 동선을 고려하면 좋아요.' },
      { name: '수면양말/담요/홈웨어', type: '편안함 선물', relations: ['partner','family','friend'], occasions: ['birthday','seasonal','thanks'], budgets: ['light','mid'], styles: ['cozy'], speeds: ['normal','planned'], food: false, easyWrap: true, why: '계절감이 있고 체감 만족도가 높아요.', caution: '사이즈나 소재 선호를 살피면 실패를 줄일 수 있어요.' },
      { name: '필기구/노트 세트', type: '단정한 실용', relations: ['coworker','kid','friend','family'], occasions: ['thanks','congrats','birthday'], budgets: ['light','mid'], styles: ['practical'], speeds: ['rush','normal'], food: false, easyWrap: true, why: '가볍게 예의를 갖추면서도 활용도가 높아요.', caution: '아주 가까운 사이의 특별한 기념일에는 다소 무난하게 느껴질 수 있어요.' },
      { name: '취미 소모품 리필', type: '취향 맞춤', relations: ['partner','friend','kid','family'], occasions: ['birthday','anniversary','congrats'], budgets: ['mid','high'], styles: ['practical','fun'], speeds: ['planned'], food: false, easyWrap: true, why: '상대가 이미 즐기는 취미와 연결되면 만족도가 크게 올라가요.', caution: '정확한 취미 정보가 있을 때 추천 강도가 높아집니다.' },
      { name: '호텔/브런치 식사권', type: '경험 선물', relations: ['partner','family'], occasions: ['anniversary','congrats','birthday'], budgets: ['high'], styles: ['luxury'], speeds: ['planned'], food: true, easyWrap: true, why: '물건보다 시간을 선물하고 싶을 때 잘 맞아요.', caution: '일정 맞추기와 예약 가능일을 함께 확인해야 해요.' }
    ];

    const relationAlias = { coworker: '직장/격식', partner: '감성/기념일', family: '가족형', friend: '가벼운 친밀형', kid: '학생/키즈형' };
    const budgetAlias = { light: '가볍게', mid: '중간 예산', high: '조금 넉넉하게' };
    const speedAlias = { rush: '바로 준비', normal: '며칠 내 준비', planned: '미리 준비' };

    const scoreIdea = (idea) => {
      let score = 0;
      if (idea.relations.includes(relationEl.value)) score += 4;
      if (idea.occasions.includes(occasionEl.value)) score += 4;
      if (idea.budgets.includes(budgetEl.value)) score += 3;
      if (idea.styles.includes(styleEl.value)) score += 3;
      if (idea.speeds.includes(speedEl.value)) score += 2;
      if (avoidFoodEl.checked && idea.food) score -= 4;
      if (wrapEl.checked && idea.easyWrap) score += 1;
      if (styleEl.value === 'luxury' && idea.budgets.includes('high')) score += 1;
      if (speedEl.value === 'rush' && idea.speeds.includes('rush')) score += 1;
      return score;
    };

    const render = () => {
      const ranked = ideas
        .map(idea => ({ ...idea, score: scoreIdea(idea) }))
        .filter(idea => idea.score >= 5)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, pageLang === 'ja' ? 'ja' : (pageLang === 'en' ? 'en' : 'ko')))
        .slice(0, 5);

      if (!ranked.length) {
        countEl.textContent = '0';
        topEl.textContent = '-';
        budgetTagEl.textContent = budgetAlias[budgetEl.value] || '-';
        speedTagEl.textContent = speedAlias[speedEl.value] || '-';
        outputEl.value = '';
        helpEl.textContent = t.none;
        return;
      }

      countEl.textContent = String(ranked.length);
      topEl.textContent = relationAlias[relationEl.value] || ranked[0].type;
      budgetTagEl.textContent = budgetAlias[budgetEl.value] || '-';
      speedTagEl.textContent = speedAlias[speedEl.value] || '-';
      helpEl.textContent = t.help(ranked.length, ranked[0].type);
      outputEl.value = ranked.map((idea, idx) => `${idx + 1}. ${idea.name}\n- 이유: ${idea.why}\n- 체크: ${idea.caution}`).join('\n\n');
    };

    const copyText = async () => {
      if (!outputEl.value) return;
      try {
        await navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = t.copied;
        window.setTimeout(() => { copyBtn.textContent = t.copyDefault; }, 1600);
      } catch (err) {}
    };

    runBtn.addEventListener('click', render);
    sampleBtn.addEventListener('click', () => {
      relationEl.value = 'partner';
      occasionEl.value = 'anniversary';
      budgetEl.value = 'mid';
      styleEl.value = 'cozy';
      speedEl.value = 'normal';
      avoidFoodEl.checked = false;
      wrapEl.checked = true;
      render();
    });
    copyBtn.addEventListener('click', copyText);
    render();
  }

  if (slug === 'hourly-monthly-salary-calculator') {
    const hourly = document.getElementById('hms-hourly');
    const weeklyHours = document.getElementById('hms-weekly-hours');
    const weeks = document.getElementById('hms-weeks');
    const days = document.getElementById('hms-days');
    const includeWeekly = document.getElementById('hms-include-weekly');
    const weeklyPay = document.getElementById('hms-weekly-pay');
    const monthlyPay = document.getElementById('hms-monthly-pay');
    const annualPay = document.getElementById('hms-annual-pay');
    const weeklyHoliday = document.getElementById('hms-weekly-holiday');
    const help = document.getElementById('hms-help');
    const copyBtn = document.getElementById('hms-copy');
    const resetBtn = document.getElementById('hms-reset');
    if (!hourly || !weeklyHours || !weeks || !days || !includeWeekly || !weeklyPay || !monthlyPay || !annualPay || !weeklyHoliday || !help) return;

    const fmt = (n) => `${Math.round(n || 0).toLocaleString(numberLocale)}${pageLang === 'en' ? ' KRW' : pageLang === 'ja' ? 'ウォン' : '원'}`;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const render = () => {
      const h = Math.max(0, Number(hourly.value || 0));
      const wh = Math.max(0, Number(weeklyHours.value || 0));
      const wm = Math.min(5, Math.max(4, Number(weeks.value || 4.345)));
      const wd = Math.min(7, Math.max(1, Math.floor(Number(days.value || 5))));
      weeks.value = wm;
      days.value = wd;

      if (!(h > 0) || !(wh > 0)) {
        weeklyPay.textContent = '-';
        monthlyPay.textContent = '-';
        annualPay.textContent = '-';
        weeklyHoliday.textContent = '-';
        help.textContent = pageLang === 'en' ? 'Enter hourly wage and weekly hours.' : pageLang === 'ja' ? '時給と週労働時間を入力してください。' : '시급과 주 근무시간을 입력하세요.';
        return;
      }

      const baseWeekly = h * wh;
      const holidayHours = wh >= 15 ? Math.min(8, wh / wd) : 0;
      const holidayPay = includeWeekly.checked ? holidayHours * h : 0;
      const weekTotal = baseWeekly + holidayPay;
      const monthTotal = weekTotal * wm;
      const yearTotal = monthTotal * 12;

      weeklyPay.textContent = fmt(weekTotal);
      monthlyPay.textContent = fmt(monthTotal);
      annualPay.textContent = fmt(yearTotal);
      weeklyHoliday.textContent = fmt(holidayPay);
      help.textContent = wh >= 15
        ? (pageLang === 'en' ? 'Weekly holiday pay included (15+ weekly hours).' : pageLang === 'ja' ? '週15時間以上のため週休手当を反映しました。' : '주 15시간 이상으로 주휴수당을 반영했습니다.')
        : (pageLang === 'en' ? 'Weekly holiday pay is excluded under 15 weekly hours.' : pageLang === 'ja' ? '週15時間未満のため週休手当은 0です。' : '주 15시간 미만으로 주휴수당은 0원입니다.');
    };

    [hourly, weeklyHours, weeks, days, includeWeekly].forEach((el) => el.addEventListener('input', render));
    copyBtn?.addEventListener('click', async () => {
      if (weeklyPay.textContent === '-') return;
      const title = pageLang === 'en' ? 'Hourly↔Monthly salary result' : pageLang === 'ja' ? '時給↔月給計算結果' : '시급↔월급 계산 결과';
      await copyText(`${title} | ${weeklyPay.textContent} | ${monthlyPay.textContent} | ${annualPay.textContent} | ${weeklyHoliday.textContent}`);
      const old = copyBtn.textContent;
      copyBtn.textContent = pageLang === 'en' ? 'Copied' : pageLang === 'ja' ? 'コピー完了' : '복사됨';
      setTimeout(() => { copyBtn.textContent = old || (pageLang === 'en' ? 'Copy result' : pageLang === 'ja' ? '結果をコピー' : '결과 복사'); }, 900);
    });
    resetBtn?.addEventListener('click', () => {
      hourly.value = 10030;
      weeklyHours.value = 20;
      weeks.value = 4.345;
      days.value = 5;
      includeWeekly.checked = true;
      render();
    });
    if (!hourly.value) hourly.value = 10030;
    if (!weeklyHours.value) weeklyHours.value = 20;
    render();
  }


  if (slug === 'volumetric-weight-calculator') {
    const lengthEl = document.getElementById('vw-length');
    const widthEl = document.getElementById('vw-width');
    const heightEl = document.getElementById('vw-height');
    const actualEl = document.getElementById('vw-actual');
    const divisorEl = document.getElementById('vw-divisor');
    const volumeEl = document.getElementById('vw-volume');
    const volumetricEl = document.getElementById('vw-volumetric');
    const chargeableEl = document.getElementById('vw-chargeable');
    const basisEl = document.getElementById('vw-basis');
    const help = document.getElementById('vw-help');
    const copyBtn = document.getElementById('vw-copy');
    const resetBtn = document.getElementById('vw-reset');

    if (!lengthEl || !widthEl || !heightEl || !actualEl || !divisorEl || !volumeEl || !volumetricEl || !chargeableEl || !basisEl || !help) return;

    const text = {
      ko: {
        needInput: '가로·세로·높이와 실제 무게를 입력하세요.',
        basisActual: '실제 무게 기준',
        basisVolumetric: '부피무게 기준',
        summary: (vw, cw) => `부피무게 ${vw}, 적용무게 ${cw} 기준으로 운임을 비교해 보세요.`,
        copy: (v, vw, cw, b) => `부피무게 계산 결과 | 박스 부피 ${v} | 부피무게 ${vw} | 적용무게 ${cw} | 청구 기준 ${b}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        needInput: 'Enter length, width, height, and actual weight.',
        basisActual: 'Actual weight basis',
        basisVolumetric: 'Volumetric weight basis',
        summary: (vw, cw) => `Compare shipping cost using volumetric weight ${vw} and chargeable weight ${cw}.`,
        copy: (v, vw, cw, b) => `Volumetric weight result | Box volume ${v} | Volumetric weight ${vw} | Chargeable weight ${cw} | Billing basis ${b}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        needInput: '縦・横・高さと実重量を入力してください。',
        basisActual: '実重量基準',
        basisVolumetric: '容積重量基準',
        summary: (vw, cw) => `容積重量 ${vw} と適用重量 ${cw} を基準に送料を比較してください。`,
        copy: (v, vw, cw, b) => `容積重量計算結果 | 箱の容積 ${v} | 容積重量 ${vw} | 適用重量 ${cw} | 請求基準 ${b}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      needInput: '가로·세로·높이와 실제 무게를 입력하세요.',
      basisActual: '실제 무게 기준',
      basisVolumetric: '부피무게 기준',
      summary: (vw, cw) => `부피무게 ${vw}, 적용무게 ${cw} 기준으로 운임을 비교해 보세요.`,
      copy: (v, vw, cw, b) => `부피무게 계산 결과 | 박스 부피 ${v} | 부피무게 ${vw} | 적용무게 ${cw} | 청구 기준 ${b}`,
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const fmtKg = (n) => `${Number(n || 0).toLocaleString(numberLocale, { maximumFractionDigits: 2 })}kg`;
    const fmtL = (n) => `${Number(n || 0).toLocaleString(numberLocale, { maximumFractionDigits: 2 })}L`;

    const copyText = async (value) => {
      try { await navigator.clipboard.writeText(value); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const render = () => {
      const l = Math.max(0, Number(lengthEl.value || 0));
      const w = Math.max(0, Number(widthEl.value || 0));
      const h = Math.max(0, Number(heightEl.value || 0));
      const actual = Math.max(0, Number(actualEl.value || 0));
      const divisor = Math.max(1, Number(divisorEl.value || 6000));

      if (!(l > 0) || !(w > 0) || !(h > 0) || !(actual > 0)) {
        volumeEl.textContent = '-';
        volumetricEl.textContent = '-';
        chargeableEl.textContent = '-';
        basisEl.textContent = '-';
        help.textContent = text.needInput;
        return;
      }

      const volumeLiter = (l * w * h) / 1000;
      const volumetric = (l * w * h) / divisor;
      const chargeable = Math.max(actual, volumetric);
      const basis = actual >= volumetric ? text.basisActual : text.basisVolumetric;

      volumeEl.textContent = fmtL(volumeLiter);
      volumetricEl.textContent = fmtKg(volumetric);
      chargeableEl.textContent = fmtKg(chargeable);
      basisEl.textContent = basis;
      help.textContent = text.summary(fmtKg(volumetric), fmtKg(chargeable));
    };

    [lengthEl, widthEl, heightEl, actualEl, divisorEl].forEach((el) => el.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (chargeableEl.textContent === '-') return;
      await copyText(text.copy(volumeEl.textContent, volumetricEl.textContent, chargeableEl.textContent, basisEl.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = text.copied;
      setTimeout(() => { copyBtn.textContent = old || text.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      lengthEl.value = 40;
      widthEl.value = 30;
      heightEl.value = 20;
      actualEl.value = 2.8;
      divisorEl.value = 6000;
      render();
    });

    if (!lengthEl.value) lengthEl.value = 40;
    if (!widthEl.value) widthEl.value = 30;
    if (!heightEl.value) heightEl.value = 20;
    if (!actualEl.value) actualEl.value = 2.8;
    render();
  }

  if (slug === 'average-speed-calculator') {
    const distance = document.getElementById('as-distance');
    const hours = document.getElementById('as-hours');
    const minutes = document.getElementById('as-minutes');
    const speed = document.getElementById('as-speed');
    const pace = document.getElementById('as-pace');
    const out5k = document.getElementById('as-5k');
    const out10k = document.getElementById('as-10k');
    const help = document.getElementById('as-help');
    const copyBtn = document.getElementById('as-copy');
    const resetBtn = document.getElementById('as-reset');

    if (!distance || !hours || !minutes || !speed || !pace || !out5k || !out10k || !help) return;

    const t = {
      ko: {
        idle: '거리와 시간을 입력하면 속도와 페이스를 계산합니다.',
        invalid: '거리와 총 시간은 0보다 커야 합니다.',
        summary: (s, p) => `평균 속도 ${s}, 1km 페이스 ${p} 기준 결과입니다.`,
        copied: '복사됨',
        copyDefault: '결과 복사',
        copy: (s,p,f,t) => `평균 속도 계산 결과 | 평균 속도 ${s} | 페이스 ${p} | 예상 5km ${f} | 예상 10km ${t}`
      },
      en: {
        idle: 'Enter distance and time to calculate speed and pace.',
        invalid: 'Distance and total time must be greater than 0.',
        summary: (s, p) => `Calculated from average speed ${s} and pace ${p}.`,
        copied: 'Copied',
        copyDefault: 'Copy result',
        copy: (s,p,f,t) => `Average speed result | Average speed ${s} | Pace ${p} | Estimated 5K ${f} | Estimated 10K ${t}`
      },
      ja: {
        idle: '距離と時間を入力すると速度とペースを計算します。',
        invalid: '距離と総時間は0より大きい必要があります。',
        summary: (s, p) => `平均速度 ${s}、1kmペース ${p} を基準にした結果です。`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー',
        copy: (s,p,f,t) => `平均速度計算結果 | 平均速度 ${s} | ペース ${p} | 予想5K ${f} | 予想10K ${t}`
      }
    }[pageLang] || {
      idle: '거리와 시간을 입력하면 속도와 페이스를 계산합니다.',
      invalid: '거리와 총 시간은 0보다 커야 합니다.',
      summary: (s, p) => `평균 속도 ${s}, 1km 페이스 ${p} 기준 결과입니다.`,
      copied: '복사됨', copyDefault: '결과 복사',
      copy: (s,p,f,t) => `평균 속도 계산 결과 | 평균 속도 ${s} | 페이스 ${p} | 예상 5km ${f} | 예상 10km ${t}`
    };

    const pad = (n) => String(Math.floor(n)).padStart(2, '0');
    const formatRaceTime = (minutesTotal) => {
      const totalSeconds = Math.round(minutesTotal * 60);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const render = () => {
      const d = Math.max(0, Number(distance.value || 0));
      const h = Math.max(0, Number(hours.value || 0));
      const mRaw = Number(minutes.value || 0);
      const m = Number.isFinite(mRaw) ? Math.min(59, Math.max(0, Math.floor(mRaw))) : 0;
      if (mRaw !== m) minutes.value = m;

      const totalHours = h + (m / 60);
      const totalMinutes = (h * 60) + m;

      if (!(d > 0) || !(totalHours > 0)) {
        speed.textContent = '-';
        pace.textContent = '-';
        out5k.textContent = '-';
        out10k.textContent = '-';
        help.textContent = d === 0 && totalHours === 0 ? t.idle : t.invalid;
        return;
      }

      const speedKmh = d / totalHours;
      const paceMin = totalMinutes / d;
      speed.textContent = `${speedKmh.toLocaleString(numberLocale, { maximumFractionDigits: 2 })} km/h`;
      pace.textContent = `${formatRaceTime(paceMin)}/km`;
      out5k.textContent = formatRaceTime(paceMin * 5);
      out10k.textContent = formatRaceTime(paceMin * 10);
      help.textContent = t.summary(speed.textContent, pace.textContent);
    };

    [distance, hours, minutes].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (speed.textContent === '-') return;
      await copyText(t.copy(speed.textContent, pace.textContent, out5k.textContent, out10k.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      distance.value = 10;
      hours.value = 1;
      minutes.value = 0;
      render();
    });

    if (!distance.value) distance.value = 10;
    if (!hours.value) hours.value = 1;
    render();
  }

  if (slug === 'average-calculator') {
    const input = document.getElementById('avg-input');
    const countEl = document.getElementById('avg-count');
    const sumEl = document.getElementById('avg-sum');
    const meanEl = document.getElementById('avg-mean');
    const medianEl = document.getElementById('avg-median');
    const minEl = document.getElementById('avg-min');
    const maxEl = document.getElementById('avg-max');
    const rangeEl = document.getElementById('avg-range');
    const ignoredEl = document.getElementById('avg-ignored');
    const help = document.getElementById('avg-help');
    const detail = document.getElementById('avg-detail');
    const sampleBtn = document.getElementById('avg-sample');
    const copyBtn = document.getElementById('avg-copy');
    const resetBtn = document.getElementById('avg-reset');
    if (!input || !countEl || !sumEl || !meanEl || !medianEl || !minEl || !maxEl || !rangeEl || !ignoredEl || !help) return;

    const text = {
      ko: {
        idle: '숫자를 입력하면 평균·중앙값·합계·범위를 계산합니다.',
        invalid: '계산할 수 있는 숫자가 없습니다. 문자, 빈 항목, 무한대 값은 제외됩니다.',
        tooMany: '숫자는 한 번에 최대 5,000개까지 계산할 수 있습니다.',
        tooLarge: '정확한 계산을 위해 각 숫자는 -1,000조부터 1,000조까지 입력해 주세요.',
        mixed: (valid, invalid) => `${valid}개 숫자를 계산했습니다. 숫자가 아닌 항목 ${invalid}개는 제외했습니다.`,
        summary: (count, mean) => `${count}개 숫자의 평균은 ${mean}입니다.`,
        detail: (min, max, range) => `최솟값 ${min}, 최댓값 ${max}, 범위 ${range}`,
        sample: '82, 91, 77, 88.5, 95, 73, 88.5, 100',
        copyEmpty: '복사할 계산 결과가 없습니다.',
        copyFail: '자동 복사를 사용할 수 없습니다.',
        copy: (count, sum, mean, median, min, max, range, ignored) => `평균 계산 결과 | 개수 ${count} | 합계 ${sum} | 평균 ${mean} | 중앙값 ${median} | 최솟값 ${min} | 최댓값 ${max} | 범위 ${range} | 제외 항목 ${ignored}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        idle: 'Enter numbers to calculate count, sum, average, median, and range.',
        invalid: 'No calculable numbers found. Text, blanks, and infinite values are ignored.',
        tooMany: 'You can calculate up to 5,000 numbers at a time.',
        tooLarge: 'For reliable results, each number must be between -1 quadrillion and 1 quadrillion.',
        mixed: (valid, invalid) => `Calculated ${valid} numbers and ignored ${invalid} non-number entries.`,
        summary: (count, mean) => `Average of ${count} numbers is ${mean}.`,
        detail: (min, max, range) => `Minimum ${min}, maximum ${max}, range ${range}`,
        sample: '82, 91, 77, 88.5, 95, 73, 88.5, 100',
        copyEmpty: 'There is no calculation result to copy.',
        copyFail: 'Automatic copy is unavailable.',
        copy: (count, sum, mean, median, min, max, range, ignored) => `Average result | Count ${count} | Sum ${sum} | Average ${mean} | Median ${median} | Min ${min} | Max ${max} | Range ${range} | Ignored ${ignored}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        idle: '数値を入力すると、個数・合計・平均・中央値・範囲を計算します。',
        invalid: '計算できる数値がありません。文字、空欄、無限大の値は除外されます。',
        tooMany: '一度に計算できる数値は最大5,000個です。',
        tooLarge: '正確に計算するため、各数値は -1,000兆 から 1,000兆 の範囲で入力してください。',
        mixed: (valid, invalid) => `${valid}個の数値を計算し、数値ではない項目${invalid}個を除外しました。`,
        summary: (count, mean) => `${count}個の数値の平均は ${mean} です。`,
        detail: (min, max, range) => `最小値 ${min}、最大値 ${max}、範囲 ${range}`,
        sample: '82, 91, 77, 88.5, 95, 73, 88.5, 100',
        copyEmpty: 'コピーできる計算結果がありません。',
        copyFail: '自動コピーを利用できません。',
        copy: (count, sum, mean, median, min, max, range, ignored) => `平均計算結果 | 個数 ${count} | 合計 ${sum} | 平均 ${mean} | 中央値 ${median} | 最小値 ${min} | 最大値 ${max} | 範囲 ${range} | 除外項目 ${ignored}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      idle: '숫자를 입력하면 평균·중앙값·합계·범위를 계산합니다.',
      invalid: '계산할 수 있는 숫자가 없습니다.',
      tooMany: '숫자는 한 번에 최대 5,000개까지 계산할 수 있습니다.',
      tooLarge: '정확한 계산을 위해 각 숫자는 -1,000조부터 1,000조까지 입력해 주세요.',
      mixed: (valid, invalid) => `${valid}개 숫자를 계산했습니다. 숫자가 아닌 항목 ${invalid}개는 제외했습니다.`,
      summary: (count, mean) => `${count}개 숫자의 평균은 ${mean}입니다.`,
      detail: (min, max, range) => `최솟값 ${min}, 최댓값 ${max}, 범위 ${range}`,
      sample: '82, 91, 77, 88.5, 95, 73, 88.5, 100',
      copyEmpty: '복사할 계산 결과가 없습니다.',
      copyFail: '자동 복사를 사용할 수 없습니다.',
      copy: (count, sum, mean, median, min, max, range, ignored) => `평균 계산 결과 | 개수 ${count} | 합계 ${sum} | 평균 ${mean} | 중앙값 ${median} | 최솟값 ${min} | 최댓값 ${max} | 범위 ${range} | 제외 항목 ${ignored}`,
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const MAX_ITEMS = 5000;
    const MAX_ABS = 1000000000000000;
    const fmt = (n) => Number(n).toLocaleString(numberLocale, { maximumFractionDigits: 8 });

    const copyText = async (value) => {
      try {
        if (!navigator.clipboard) throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(value);
      }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const setStatus = (msg, state = '') => {
      help.textContent = msg;
      help.dataset.state = state;
    };

    const setIdle = (msg, state = '') => {
      [countEl, sumEl, meanEl, medianEl, minEl, maxEl, rangeEl, ignoredEl].forEach((el) => { el.textContent = '-'; });
      setStatus(msg, state);
      if (detail) detail.textContent = text.idle;
      input.setAttribute('aria-invalid', state === 'error' ? 'true' : 'false');
      if (copyBtn) copyBtn.disabled = true;
    };

    const parseNumbers = (raw) => {
      const tokens = (raw || '')
        .replace(/[;|]/g, ' ')
        .split(/[\s,]+/)
        .map((v) => v.trim())
        .filter(Boolean);
      const nums = [];
      let invalid = 0;
      tokens.forEach((token) => {
        const normalized = token.replace(/_/g, '').replace(/,/g, '');
        if (!/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(normalized)) {
          invalid += 1;
          return;
        }
        const value = Number(normalized);
        if (Number.isFinite(value)) nums.push(value);
        else invalid += 1;
      });
      return { nums, invalid, tokenCount: tokens.length };
    };

    const render = () => {
      const parsed = parseNumbers(input.value);
      const nums = parsed.nums;
      if (nums.length > MAX_ITEMS) {
        setIdle(text.tooMany, 'error');
        return;
      }
      if (nums.some((n) => Math.abs(n) > MAX_ABS)) {
        setIdle(text.tooLarge, 'error');
        return;
      }
      if (!nums.length) {
        setIdle(input.value.trim() ? text.invalid : text.idle, input.value.trim() ? 'error' : '');
        return;
      }
      const sorted = [...nums].sort((a, b) => a - b);
      const count = nums.length;
      const sum = nums.reduce((acc, cur) => acc + cur, 0);
      const mean = sum / count;
      const mid = Math.floor(count / 2);
      const median = count % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const range = max - min;

      input.setAttribute('aria-invalid', 'false');
      countEl.textContent = count.toLocaleString(numberLocale);
      sumEl.textContent = fmt(sum);
      meanEl.textContent = fmt(mean);
      medianEl.textContent = fmt(median);
      minEl.textContent = fmt(min);
      maxEl.textContent = fmt(max);
      rangeEl.textContent = fmt(range);
      ignoredEl.textContent = parsed.invalid ? parsed.invalid.toLocaleString(numberLocale) : '0';
      if (copyBtn) copyBtn.disabled = false;
      setStatus(parsed.invalid ? text.mixed(count.toLocaleString(numberLocale), parsed.invalid.toLocaleString(numberLocale)) : text.summary(count.toLocaleString(numberLocale), fmt(mean)), parsed.invalid ? 'warning' : 'success');
      if (detail) detail.textContent = text.detail(fmt(min), fmt(max), fmt(range));
    };

    input.addEventListener('input', render);
    sampleBtn?.addEventListener('click', () => {
      input.value = text.sample;
      render();
      input.focus();
    });
    copyBtn?.addEventListener('click', async () => {
      if (countEl.textContent === '-') {
        setStatus(text.copyEmpty, 'error');
        input.focus();
        return;
      }
      try {
        await copyText(text.copy(countEl.textContent, sumEl.textContent, meanEl.textContent, medianEl.textContent, minEl.textContent, maxEl.textContent, rangeEl.textContent, ignoredEl.textContent));
        const old = copyBtn.textContent;
        copyBtn.textContent = text.copied;
        setStatus(text.copied, 'success');
        setTimeout(() => { copyBtn.textContent = old || text.copyDefault; }, 900);
      } catch (_) {
        setStatus(text.copyFail, 'error');
      }
    });
    resetBtn?.addEventListener('click', () => {
      input.value = '';
      setIdle(text.idle);
      input.focus();
    });

    setIdle(text.idle);
  }


  if (slug === 'fraction-calculator') {
    const aNum = document.getElementById('frac-a-num');
    const aDen = document.getElementById('frac-a-den');
    const bNum = document.getElementById('frac-b-num');
    const bDen = document.getElementById('frac-b-den');
    const op = document.getElementById('frac-op');
    const outResult = document.getElementById('frac-result');
    const outMixed = document.getElementById('frac-mixed');
    const outDecimal = document.getElementById('frac-decimal');
    const outPercent = document.getElementById('frac-percent');
    const help = document.getElementById('frac-help');
    const swapBtn = document.getElementById('frac-swap');
    const copyBtn = document.getElementById('frac-copy');
    const resetBtn = document.getElementById('frac-reset');

    if (!aNum || !aDen || !bNum || !bDen || !op || !outResult || !outMixed || !outDecimal || !outPercent || !help) return;

    const text = {
      ko: {
        idle: '분수 2개를 입력하면 사칙연산과 약분 결과를 바로 확인할 수 있습니다.',
        empty: '네 칸에 분자와 분모를 모두 입력해 주세요.',
        invalid: '분수에는 정수만 입력할 수 있습니다.',
        tooLarge: '정확한 계산을 위해 각 값은 -10,000,000부터 10,000,000까지 입력해 주세요.',
        zeroDenominator: '분모는 0이 될 수 없습니다.',
        divZero: '0으로 나누는 연산은 할 수 없습니다.',
        mixedNone: '해당 없음',
        copy: (r, m, d, p) => `분수 계산 결과 | 약분 결과 ${r} | 대분수 ${m} | 소수값 ${d} | 백분율 ${p}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        idle: 'Enter two fractions to calculate and simplify the result instantly.',
        empty: 'Enter a numerator and denominator in all four fields.',
        invalid: 'Fractions must use whole-number inputs.',
        tooLarge: 'For an exact result, enter each value from -10,000,000 to 10,000,000.',
        zeroDenominator: 'Denominator cannot be 0.',
        divZero: 'Division by zero is not allowed.',
        mixedNone: 'N/A',
        copy: (r, m, d, p) => `Fraction result | Simplified ${r} | Mixed ${m} | Decimal ${d} | Percent ${p}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        idle: '2つの分数を入力すると、四則演算と約分結果をすぐ確認できます。',
        empty: '4つの欄に分子と分母をすべて入力してください。',
        invalid: '分数には整数のみ入力できます。',
        tooLarge: '正確に計算するため、各値は -10,000,000 から 10,000,000 の範囲で入力してください。',
        zeroDenominator: '分母に 0 は使えません。',
        divZero: '0 で割ることはできません。',
        mixedNone: '該当なし',
        copy: (r, m, d, p) => `分数計算結果 | 約分結果 ${r} | 帯分数 ${m} | 小数 ${d} | 百分率 ${p}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      idle: '분수 2개를 입력하면 사칙연산과 약분 결과를 바로 확인할 수 있습니다.',
      empty: '네 칸에 분자와 분모를 모두 입력해 주세요.',
      invalid: '분수에는 정수만 입력할 수 있습니다.',
      tooLarge: '정확한 계산을 위해 각 값은 -10,000,000부터 10,000,000까지 입력해 주세요.',
      zeroDenominator: '분모는 0이 될 수 없습니다.',
      divZero: '0으로 나누는 연산은 할 수 없습니다.',
      mixedNone: '해당 없음',
      copy: (r, m, d, p) => `분수 계산 결과 | 약분 결과 ${r} | 대분수 ${m} | 소수값 ${d} | 백분율 ${p}`,
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const gcd = (a, b) => {
      let x = Math.abs(a), y = Math.abs(b);
      while (y) [x, y] = [y, x % y];
      return x || 1;
    };
    const simplify = (n, d) => {
      const sign = d < 0 ? -1 : 1;
      const g = gcd(n, d);
      return { n: sign * n / g, d: Math.abs(d) / g };
    };
    const fmt = (n, max = 6) => Number(n).toLocaleString(numberLocale, { maximumFractionDigits: max });
    const copyText = async (value) => {
      try { await navigator.clipboard.writeText(value); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };
    const inputs = [aNum, aDen, bNum, bDen];
    const setInvalid = (invalidInputs = []) => {
      inputs.forEach((input) => input.setAttribute('aria-invalid', invalidInputs.includes(input) ? 'true' : 'false'));
    };
    const setIdle = (msg, invalidInputs = []) => {
      outResult.textContent = '-';
      outMixed.textContent = '-';
      outDecimal.textContent = '-';
      outPercent.textContent = '-';
      help.textContent = msg;
      setInvalid(invalidInputs);
      if (copyBtn) copyBtn.disabled = true;
    };
    const readInteger = (input) => {
      if (input.value.trim() === '') return { error: 'empty' };
      const value = Number(input.value);
      if (!Number.isFinite(value) || !Number.isInteger(value)) return { error: 'invalid' };
      if (Math.abs(value) > 10000000) return { error: 'tooLarge' };
      return { value };
    };
    const render = () => {
      const parsed = inputs.map(readInteger);
      const emptyInputs = inputs.filter((_, index) => parsed[index].error === 'empty');
      if (emptyInputs.length) {
        setIdle(text.empty, emptyInputs);
        return;
      }
      const invalidInputs = inputs.filter((_, index) => parsed[index].error === 'invalid');
      if (invalidInputs.length) {
        setIdle(text.invalid, invalidInputs);
        return;
      }
      const largeInputs = inputs.filter((_, index) => parsed[index].error === 'tooLarge');
      if (largeInputs.length) {
        setIdle(text.tooLarge, largeInputs);
        return;
      }
      const [an, ad, bn, bd] = parsed.map(({ value }) => value);
      const zeroDenominators = [aDen, bDen].filter((input) => Number(input.value) === 0);
      if (zeroDenominators.length) {
        setIdle(text.zeroDenominator, zeroDenominators);
        return;
      }
      let rn = 0, rd = 1;
      if (op.value === 'add') {
        rn = an * bd + bn * ad; rd = ad * bd;
      } else if (op.value === 'sub') {
        rn = an * bd - bn * ad; rd = ad * bd;
      } else if (op.value === 'mul') {
        rn = an * bn; rd = ad * bd;
      } else {
        if (bn === 0) {
          setIdle(text.divZero, [bNum]);
          return;
        }
        rn = an * bd; rd = ad * bn;
      }
      const s = simplify(rn, rd);
      const dec = s.n / s.d;
      outResult.textContent = s.d === 1 ? `${s.n}` : `${s.n}/${s.d}`;
      const whole = Math.trunc(s.n / s.d);
      const rem = Math.abs(s.n % s.d);
      outMixed.textContent = rem === 0 ? `${whole}` : (Math.abs(s.n) < s.d ? text.mixedNone : `${whole} ${rem}/${s.d}`);
      outDecimal.textContent = fmt(dec, 8);
      outPercent.textContent = `${fmt(dec * 100, 4)}%`;
      help.textContent = `${an}/${ad} ${op.options[op.selectedIndex].text} ${bn}/${bd} = ${outResult.textContent}`;
      setInvalid();
      if (copyBtn) copyBtn.disabled = false;
    };
    [...inputs, op].forEach((el) => el.addEventListener('input', render));
    swapBtn?.addEventListener('click', () => {
      [aNum.value, bNum.value] = [bNum.value, aNum.value];
      [aDen.value, bDen.value] = [bDen.value, aDen.value];
      render();
      aNum.focus();
    });
    resetBtn?.addEventListener('click', () => {
      aNum.value = 1; aDen.value = 2; bNum.value = 1; bDen.value = 3; op.value = 'add'; render();
    });
    copyBtn?.addEventListener('click', async () => {
      if (outResult.textContent === '-') return;
      await copyText(text.copy(outResult.textContent, outMixed.textContent, outDecimal.textContent, outPercent.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = text.copied;
      setTimeout(() => { copyBtn.textContent = old || text.copyDefault; }, 900);
    });
    if (!aNum.value) aNum.value = 1;
    if (!aDen.value) aDen.value = 2;
    if (!bNum.value) bNum.value = 1;
    if (!bDen.value) bDen.value = 3;
    render();
  }

  if (slug === 'split-bill-calculator') {
    const total = document.getElementById('sb-total');
    const people = document.getElementById('sb-people');
    const rounding = document.getElementById('sb-rounding');
    const mode = document.getElementById('sb-mode');
    const outBase = document.getElementById('sb-base');
    const outRounded = document.getElementById('sb-rounded');
    const outLast = document.getElementById('sb-last');
    const outDiff = document.getElementById('sb-diff');
    const help = document.getElementById('sb-help');
    const copyBtn = document.getElementById('sb-copy');
    const resetBtn = document.getElementById('sb-reset');

    if (!total || !people || !rounding || !mode || !outBase || !outRounded || !outLast || !outDiff || !help) return;

    const t = {
      ko: {
        currency: '원', idle: '총액과 인원 수를 입력하면 N빵 결과를 계산합니다.',
        summary: (share, last, people) => `${people}명 기준 기본 송금액은 ${share}, 마지막 1인은 ${last}로 맞추면 총액이 정확히 맞습니다.`,
        copy: (a,b,c,d) => `N빵 계산 결과 | 정확한 1인당 ${a} | 반올림 기준 금액 ${b} | 마지막 1인 조정 ${c} | 차액 ${d}`,
        copied: '복사됨', copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW', idle: 'Enter total amount and people to split the bill.',
        summary: (share, last, people) => `For ${people} people, send ${share} as the standard share and ${last} for the last person to match the exact total.`,
        copy: (a,b,c,d) => `Split bill result | Exact share ${a} | Rounded share ${b} | Last-person adjustment ${c} | Difference ${d}`,
        copied: 'Copied', copyDefault: 'Copy result'
      },
      ja: {
        currency: 'ウォン', idle: '合計金額と人数を入れると割り勘結果を計算します。',
        summary: (share, last, people) => `${people}人なら標準金額は ${share}、最後の1人を ${last} にすると合計がぴったり合います。`,
        copy: (a,b,c,d) => `割り勘計算結果 | 正確な1人あたり ${a} | 丸め後の標準金額 ${b} | 最後の1人の調整額 ${c} | 差額 ${d}`,
        copied: 'コピー完了', copyDefault: '結果をコピー'
      }
    }[pageLang] || { currency: '원', idle: '총액과 인원 수를 입력하면 N빵 결과를 계산합니다.', summary: (share,last,people) => `${people}명 기준 기본 송금액은 ${share}, 마지막 1인은 ${last}로 맞추면 총액이 정확히 맞습니다.`, copy: (a,b,c,d) => `N빵 계산 결과 | 정확한 1인당 ${a} | 반올림 기준 금액 ${b} | 마지막 1인 조정 ${c} | 차액 ${d}`, copied: '복사됨', copyDefault: '결과 복사' };

    const fmt = (n) => `${Math.round(n || 0).toLocaleString(numberLocale)}${t.currency}`;
    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };
    const roundByMode = (value, unit, modeValue) => {
      if (modeValue === 'up') return Math.ceil(value / unit) * unit;
      if (modeValue === 'down') return Math.floor(value / unit) * unit;
      return Math.round(value / unit) * unit;
    };
    const render = () => {
      const totalValue = Math.max(0, Number(total.value || 0));
      const peopleValue = Math.max(1, Math.floor(Number(people.value || 1)));
      const unit = Math.max(1, Number(rounding.value || 1));
      people.value = peopleValue;
      if (!(totalValue > 0)) {
        outBase.textContent = '-'; outRounded.textContent = '-'; outLast.textContent = '-'; outDiff.textContent = '-'; help.textContent = t.idle; return;
      }
      const exact = totalValue / peopleValue;
      const rounded = roundByMode(exact, unit, mode.value || 'nearest');
      const last = totalValue - rounded * (peopleValue - 1);
      const diff = last - rounded;
      outBase.textContent = fmt(exact);
      outRounded.textContent = fmt(rounded);
      outLast.textContent = fmt(last);
      outDiff.textContent = fmt(diff);
      help.textContent = t.summary(fmt(rounded), fmt(last), peopleValue.toLocaleString(numberLocale));
    };
    [total, people, rounding, mode].forEach((el) => el?.addEventListener('input', render));
    copyBtn?.addEventListener('click', async () => {
      if (outBase.textContent === '-') return;
      await copyText(t.copy(outBase.textContent, outRounded.textContent, outLast.textContent, outDiff.textContent));
      const old = copyBtn.textContent; copyBtn.textContent = t.copied; setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });
    resetBtn?.addEventListener('click', () => { total.value = 50000; people.value = 3; rounding.value = 100; mode.value = 'nearest'; render(); });
    if (!people.value) people.value = 2;
    render();
  }

  if (slug === 'required-gpa-calculator') {
    const scale = document.getElementById('rg-scale');
    const currentGpa = document.getElementById('rg-current-gpa');
    const completedCredits = document.getElementById('rg-completed-credits');
    const targetGpa = document.getElementById('rg-target-gpa');
    const remainingCredits = document.getElementById('rg-remaining-credits');
    const neededGpa = document.getElementById('rg-needed-gpa');
    const currentPoints = document.getElementById('rg-current-points');
    const maxFinalGpa = document.getElementById('rg-max-final-gpa');
    const status = document.getElementById('rg-status');
    const help = document.getElementById('rg-help');
    const copyBtn = document.getElementById('rg-copy');
    const resetBtn = document.getElementById('rg-reset');

    if (!scale || !currentGpa || !completedCredits || !targetGpa || !remainingCredits || !neededGpa || !currentPoints || !maxFinalGpa || !status || !help) return;

    const t = {
      ko: {
        idle: '현재 GPA·이수학점·목표 GPA·남은 학점을 입력하면 앞으로 필요한 GPA를 계산합니다.',
        needInput: '현재 GPA, 이수학점, 목표 GPA, 남은 학점을 모두 입력하세요.',
        invalid: '입력값이 학점 스케일 범위를 벗어났습니다.',
        guaranteed: '이미 목표권',
        achievable: '달성 가능',
        impossible: '달성 어려움',
        impossibleMsg: (need, max) => `남은 학기 평균 ${need}가 필요합니다. 현재 스케일 최고점 ${max}를 넘어 목표 달성이 어렵습니다.`,
        achievableMsg: (need) => `남은 학기 평균 GPA ${need}를 받으면 목표에 도달할 수 있습니다.`,
        guaranteedMsg: '현재 누적 성적 기준으로 목표권에 있습니다.',
        copy: (need, points, max, status) => `목표 학점 계산 결과 | 필요한 평균 GPA ${need} | 현재 총 평점 ${points} | 최대 최종 GPA ${max} | 판정 ${status}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        idle: 'Enter your current GPA, completed credits, target GPA, and remaining credits to calculate the GPA you need.',
        needInput: 'Enter current GPA, completed credits, target GPA, and remaining credits.',
        invalid: 'One or more values are outside the selected GPA scale.',
        guaranteed: 'Already on track',
        achievable: 'Achievable',
        impossible: 'Very unlikely',
        impossibleMsg: (need, max) => `You need an average GPA of ${need} from now on. That exceeds the scale maximum of ${max}, so the target is not realistic under the current plan.`,
        achievableMsg: (need) => `You can reach the target if you average ${need} from now on.`,
        guaranteedMsg: 'Your current cumulative record already keeps you within target range.',
        copy: (need, points, max, status) => `Required GPA result | Needed GPA ${need} | Current grade points ${points} | Max final GPA ${max} | Status ${status}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        idle: '現在GPA・取得済み単位・目標GPA・残り単位を入力すると、今後必要なGPAを計算します。',
        needInput: '現在GPA、取得済み単位、目標GPA、残り単位を入力してください。',
        invalid: '入力値が選択したGPAスケール範囲を超えています。',
        guaranteed: 'すでに目標圏内',
        achievable: '達成可能',
        impossible: '達成困難',
        impossibleMsg: (need, max) => `今後平均 ${need} のGPAが必要です。選択スケール上限 ${max} を超えるため、現在条件では目標達成が難しいです。`,
        achievableMsg: (need) => `今後平均 ${need} を取れば目標に到達できます。`,
        guaranteedMsg: '現在の累積成績ですでに目標圏内です。',
        copy: (need, points, max, status) => `目標GPA逆算結果 | 必要GPA ${need} | 現在の総評点 ${points} | 最大最終GPA ${max} | 判定 ${status}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {};

    const fmt = (v, digits = 2) => Number(v).toLocaleString(numberLocale, { maximumFractionDigits: digits, minimumFractionDigits: digits });
    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const setIdle = (msg = t.idle) => {
      neededGpa.textContent = '-';
      currentPoints.textContent = '-';
      maxFinalGpa.textContent = '-';
      status.textContent = pageLang === 'en' ? 'Waiting for input' : (pageLang === 'ja' ? '入力待ち' : '입력 대기');
      help.textContent = msg;
    };

    const render = () => {
      const s = Number(scale.value || 4.5);
      const cur = Number(currentGpa.value || 0);
      const done = Number(completedCredits.value || 0);
      const target = Number(targetGpa.value || 0);
      const left = Number(remainingCredits.value || 0);

      if (!(cur >= 0) || !(done >= 0) || !(target >= 0) || !(left > 0)) {
        setIdle(t.needInput);
        return;
      }
      if (cur > s || target > s) {
        setIdle(t.invalid);
        return;
      }

      const currentTotalPoints = cur * done;
      const finalCredits = done + left;
      const required = ((target * finalCredits) - currentTotalPoints) / left;
      const maxFinal = ((currentTotalPoints) + (s * left)) / finalCredits;

      neededGpa.textContent = fmt(Math.max(0, required));
      currentPoints.textContent = fmt(currentTotalPoints);
      maxFinalGpa.textContent = fmt(maxFinal);

      if (required <= 0) {
        status.textContent = t.guaranteed;
        help.textContent = t.guaranteedMsg;
      } else if (required <= s) {
        status.textContent = t.achievable;
        help.textContent = t.achievableMsg(fmt(required));
      } else {
        status.textContent = t.impossible;
        help.textContent = t.impossibleMsg(fmt(required), fmt(s));
      }
    };

    [scale, currentGpa, completedCredits, targetGpa, remainingCredits].forEach((el) => el?.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      scale.value = '4.5';
      currentGpa.value = '3.72';
      completedCredits.value = '96';
      targetGpa.value = '3.90';
      remainingCredits.value = '24';
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (neededGpa.textContent === '-') return;
      await copyText(t.copy(neededGpa.textContent, currentPoints.textContent, maxFinalGpa.textContent, status.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    if (!currentGpa.value) currentGpa.value = '3.72';
    if (!completedCredits.value) completedCredits.value = '96';
    if (!targetGpa.value) targetGpa.value = '3.90';
    if (!remainingCredits.value) remainingCredits.value = '24';
    render();
  }


  if (slug === 'gpa-calculator') {
    const scale = document.getElementById('gpa-scale');
    const outResult = document.getElementById('gpa-result');
    const outCredits = document.getElementById('gpa-credits');
    const outPoints = document.getElementById('gpa-points');
    const outPass = document.getElementById('gpa-pass');
    const help = document.getElementById('gpa-help');
    const copyBtn = document.getElementById('gpa-copy');
    const resetBtn = document.getElementById('gpa-reset');
    const clearBtn = document.getElementById('gpa-clear');
    if (!scale || !outResult || !outCredits || !outPoints || !outPass || !help) return;

    const text = {
      ko: {
        idle: '과목별 학점과 등급을 입력하면 가중 평균 GPA를 바로 계산합니다.',
        incomplete: '학점이나 등급이 빠진 행이 있습니다. 계산에서 제외했으니 입력을 확인해 주세요.',
        invalidCredit: '학점은 0 초과 30 이하 숫자로 입력해 주세요.',
        passOnly: (pass) => `P/제외 학점 ${pass}만 입력되어 GPA 계산 대상 학점이 없습니다.`,
        summary: (gpa, credits, pass) => `평가 반영 ${credits}학점 기준 GPA는 ${gpa}입니다. P 처리 학점은 ${pass}학점으로 따로 집계했습니다.`,
        copy: (gpa, credits, points, pass) => `학점 계산 결과 | GPA ${gpa} | 반영 학점 ${credits} | 총 평점 ${points} | P/제외 학점 ${pass}`,
        copied: '복사했습니다.',
        copyFail: '자동 복사를 사용할 수 없습니다.',
        cleared: '입력값을 초기화했습니다.',
        copyDefault: '결과 복사',
        creditUnit: '학점'
      },
      en: {
        idle: 'Enter course credits and grades to calculate weighted GPA instantly.',
        incomplete: 'Some rows are missing credits or grades. They were skipped, so check the inputs.',
        invalidCredit: 'Enter credits as a number greater than 0 and no more than 30.',
        passOnly: (pass) => `Only ${pass} pass/ignored credits are entered, so there are no graded credits to calculate GPA.`,
        summary: (gpa, credits, pass) => `Weighted GPA is ${gpa} across ${credits} graded credits. Pass/ignored credits total ${pass}.`,
        copy: (gpa, credits, points, pass) => `GPA result | GPA ${gpa} | Graded credits ${credits} | Grade points ${points} | Pass/ignored credits ${pass}`,
        copied: 'Copied the result.',
        copyFail: 'Automatic copy is unavailable.',
        cleared: 'Cleared all inputs.',
        copyDefault: 'Copy result',
        creditUnit: ' credits'
      },
      ja: {
        idle: '科目ごとの単位数と成績を入力すると、加重平均GPAをすぐ計算できます。',
        incomplete: '単位数または成績が未入力の行があります。その行は計算から除外しました。',
        invalidCredit: '単位数は0より大きく30以下の数値で入力してください。',
        passOnly: (pass) => `P/除外単位 ${pass} のみ入力されているため、GPA計算対象の単位がありません。`,
        summary: (gpa, credits, pass) => `評価反映 ${credits} を基準にした GPA は ${gpa} です。P扱いの単位は ${pass} として別集計しました。`,
        copy: (gpa, credits, points, pass) => `GPA計算結果 | GPA ${gpa} | 評価反映単位 ${credits} | 総評点 ${points} | P/除外単位 ${pass}`,
        copied: '結果をコピーしました。',
        copyFail: '自動コピーを利用できません。',
        cleared: '入力をクリアしました。',
        copyDefault: '結果をコピー',
        creditUnit: '単位'
      }
    }[pageLang] || {
      idle: '과목별 학점과 등급을 입력하면 가중 평균 GPA를 바로 계산합니다.',
      incomplete: '학점이나 등급이 빠진 행이 있습니다. 계산에서 제외했으니 입력을 확인해 주세요.',
      invalidCredit: '학점은 0 초과 30 이하 숫자로 입력해 주세요.',
      passOnly: (pass) => `P/제외 학점 ${pass}만 입력되어 GPA 계산 대상 학점이 없습니다.`,
      summary: (gpa, credits, pass) => `평가 반영 ${credits}학점 기준 GPA는 ${gpa}입니다. P 처리 학점은 ${pass}학점으로 따로 집계했습니다.`,
      copy: (gpa, credits, points, pass) => `학점 계산 결과 | GPA ${gpa} | 반영 학점 ${credits} | 총 평점 ${points} | P/제외 학점 ${pass}`,
      copied: '복사했습니다.',
      copyFail: '자동 복사를 사용할 수 없습니다.',
      cleared: '입력값을 초기화했습니다.',
      copyDefault: '결과 복사',
      creditUnit: '학점'
    };

    const gradeMaps = {
      '4.5': { 'A+': 4.5, 'A0': 4.0, 'B+': 3.5, 'B0': 3.0, 'C+': 2.5, 'C0': 2.0, 'D+': 1.5, 'D0': 1.0, 'F': 0 },
      '4.3': { 'A+': 4.3, 'A0': 4.0, 'B+': 3.3, 'B0': 3.0, 'C+': 2.3, 'C0': 2.0, 'D+': 1.3, 'D0': 1.0, 'F': 0 },
      '4.0': { 'A+': 4.0, 'A0': 4.0, 'B+': 3.3, 'B0': 3.0, 'C+': 2.3, 'C0': 2.0, 'D+': 1.3, 'D0': 1.0, 'F': 0 }
    };

    const rows = Array.from({ length: 6 }, (_, idx) => ({
      course: document.getElementById(`gpa-course-${idx + 1}`),
      credit: document.getElementById(`gpa-credit-${idx + 1}`),
      grade: document.getElementById(`gpa-grade-${idx + 1}`)
    }));

    const copyText = async (value) => {
      try { await navigator.clipboard.writeText(value); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const fmt = (n, digits = 2) => Number(n || 0).toLocaleString(numberLocale, { maximumFractionDigits: digits, minimumFractionDigits: digits });
    const fmtCredit = (n) => `${Number(n || 0).toLocaleString(numberLocale, { maximumFractionDigits: 1 })}${text.creditUnit}`;
    let current = null;

    const setHelp = (message, state = '') => {
      help.textContent = message;
      help.dataset.state = state;
    };

    const resetOutputs = () => {
      outResult.textContent = '-';
      outCredits.textContent = '-';
      outPoints.textContent = '-';
      outPass.textContent = '-';
      copyBtn.disabled = true;
      current = null;
    };

    const render = () => {
      const map = gradeMaps[scale.value || '4.5'];
      let credits = 0;
      let points = 0;
      let passCredits = 0;
      let hasInvalid = false;
      let hasIncomplete = false;

      rows.forEach(({ credit, grade }) => {
        const rawCredit = credit?.value.trim() || '';
        const g = grade?.value || '';
        credit?.setAttribute('aria-invalid', 'false');
        grade?.setAttribute('aria-invalid', 'false');
        if (!rawCredit && !g) return;
        const c = Number(rawCredit);
        if (!Number.isFinite(c) || c <= 0 || c > 30) {
          hasInvalid = true;
          credit?.setAttribute('aria-invalid', 'true');
          return;
        }
        if (!g) {
          hasIncomplete = true;
          grade?.setAttribute('aria-invalid', 'true');
          return;
        }
        if (g === 'P') {
          passCredits += c;
          return;
        }
        credits += c;
        points += c * (map[g] ?? 0);
      });

      if (hasInvalid) {
        resetOutputs();
        setHelp(text.invalidCredit, 'error');
        return;
      }

      if (!(credits > 0) && !(passCredits > 0)) {
        resetOutputs();
        setHelp(text.idle);
        return;
      }

      const gpa = credits > 0 ? points / credits : 0;
      outResult.textContent = credits > 0 ? fmt(gpa, 2) : '-';
      outCredits.textContent = fmtCredit(credits);
      outPoints.textContent = fmt(points, 2);
      outPass.textContent = fmtCredit(passCredits);
      copyBtn.disabled = credits <= 0;
      current = credits > 0 ? {
        gpa: fmt(gpa, 2),
        credits: fmtCredit(credits),
        points: fmt(points, 2),
        pass: fmtCredit(passCredits)
      } : null;
      if (hasIncomplete) {
        setHelp(text.incomplete, 'warning');
      } else if (credits <= 0) {
        setHelp(text.passOnly(fmtCredit(passCredits)), 'warning');
      } else {
        setHelp(text.summary(current.gpa, current.credits, current.pass), 'success');
      }
    };

    [scale, ...rows.flatMap((row) => [row.course, row.credit, row.grade])].forEach((el) => el?.addEventListener('input', render));
    rows.forEach((row) => row.grade?.addEventListener('change', render));
    resetBtn?.addEventListener('click', () => {
      scale.value = '4.5';
      const sample = [
        { credit: 3, grade: 'A+' },
        { credit: 3, grade: 'A0' },
        { credit: 2, grade: 'B+' },
        { credit: 3, grade: 'B0' },
        { credit: 1, grade: 'P' },
        { credit: '', grade: '' }
      ];
      rows.forEach((row, idx) => {
        row.course.value = pageLang === 'en' ? `Course ${idx + 1}` : (pageLang === 'ja' ? `科目 ${idx + 1}` : `과목 ${idx + 1}`);
        row.credit.value = sample[idx].credit;
        row.grade.value = sample[idx].grade;
      });
      render();
    });
    clearBtn?.addEventListener('click', () => {
      rows.forEach((row) => {
        row.course.value = '';
        row.credit.value = '';
        row.grade.value = '';
        row.credit?.setAttribute('aria-invalid', 'false');
        row.grade?.setAttribute('aria-invalid', 'false');
      });
      scale.value = '4.5';
      resetOutputs();
      setHelp(text.cleared);
      rows[0]?.credit?.focus();
    });
    copyBtn?.addEventListener('click', async () => {
      if (!current) return;
      try {
        await copyText(text.copy(current.gpa, current.credits, current.points, current.pass));
        setHelp(text.copied, 'success');
      } catch (_) {
        setHelp(text.copyFail, 'error');
      }
    });
    render();
  }

  if (slug === 'time-difference-calculator') {
    const start = document.getElementById('td-start');
    const end = document.getElementById('td-end');
    const breakEl = document.getElementById('td-break');
    const nextDay = document.getElementById('td-next-day');
    const elapsedEl = document.getElementById('td-elapsed');
    const netEl = document.getElementById('td-net');
    const totalMinEl = document.getElementById('td-total-min');
    const decimalEl = document.getElementById('td-decimal');
    const help = document.getElementById('td-help');
    const copyBtn = document.getElementById('td-copy');
    const resetBtn = document.getElementById('td-reset');

    if (!start || !end || !breakEl || !nextDay || !elapsedEl || !netEl || !totalMinEl || !decimalEl || !help) return;

    const text = {
      ko: {
        idle: '시작 시각과 종료 시각을 입력하면 시간 차이를 즉시 계산합니다.',
        needInput: '시작 시각과 종료 시각을 모두 입력하세요.',
        summary: (elapsed, net, minutes, decimal) => `총 ${elapsed} · 순수 ${net} · ${minutes} · ${decimal}`,
        totalMin: '분',
        decimal: '시간',
        hour: '시간',
        minute: '분',
        copy: (elapsed, net, minutes, decimal) => `시간 차이 계산 결과 | 총 경과시간 ${elapsed} | 순수 시간 ${net} | 총 분 ${minutes} | 소수 시간 ${decimal}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        idle: 'Enter start and end times to calculate the difference instantly.',
        needInput: 'Enter both start time and end time.',
        summary: (elapsed, net, minutes, decimal) => `Elapsed ${elapsed} · Net ${net} · ${minutes} · ${decimal}`,
        totalMin: 'min',
        decimal: 'hours',
        hour: 'h',
        minute: 'm',
        copy: (elapsed, net, minutes, decimal) => `Time difference result | Elapsed ${elapsed} | Net ${net} | Total minutes ${minutes} | Decimal hours ${decimal}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        idle: '開始時刻と終了時刻を入力すると差を即時計算します。',
        needInput: '開始時刻と終了時刻をどちらも入力してください。',
        summary: (elapsed, net, minutes, decimal) => `経過 ${elapsed} · 実作業 ${net} · ${minutes} · ${decimal}`,
        totalMin: '分',
        decimal: '時間',
        hour: '時間',
        minute: '分',
        copy: (elapsed, net, minutes, decimal) => `時間差計算結果 | 経過時間 ${elapsed} | 実作業時間 ${net} | 総分数 ${minutes} | 小数時間 ${decimal}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {
      idle: '시작 시각과 종료 시각을 입력하면 시간 차이를 즉시 계산합니다.',
      needInput: '시작 시각과 종료 시각을 모두 입력하세요.',
      summary: (elapsed, net, minutes, decimal) => `총 ${elapsed} · 순수 ${net} · ${minutes} · ${decimal}`,
      totalMin: '분',
      decimal: '시간',
      hour: '시간',
      minute: '분',
      copy: (elapsed, net, minutes, decimal) => `시간 차이 계산 결과 | 총 경과시간 ${elapsed} | 순수 시간 ${net} | 총 분 ${minutes} | 소수 시간 ${decimal}`,
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const toMinutes = (value) => {
      if (!value || !value.includes(':')) return null;
      const [h, m] = value.split(':').map(Number);
      if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
      return (h * 60) + m;
    };

    const formatDuration = (minutes) => {
      const total = Math.max(0, Math.round(minutes));
      const h = Math.floor(total / 60);
      const m = total % 60;
      return `${h}${text.hour} ${m}${text.minute}`;
    };

    const copyText = async (value) => {
      try { await navigator.clipboard.writeText(value); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      elapsedEl.textContent = '-';
      netEl.textContent = '-';
      totalMinEl.textContent = '-';
      decimalEl.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const s = toMinutes(start.value);
      const e = toMinutes(end.value);
      const breakMinutes = Math.max(0, Math.min(1440, Number(breakEl.value || 0)));
      if (Number(breakEl.value || 0) !== breakMinutes) breakEl.value = breakMinutes;

      if (s === null || e === null) {
        setIdle(text.needInput);
        return;
      }

      let diff = e - s;
      if (nextDay.checked && diff <= 0) diff += 1440;
      else if (!nextDay.checked && diff < 0) diff = 0;

      const net = Math.max(0, diff - breakMinutes);
      elapsedEl.textContent = formatDuration(diff);
      netEl.textContent = formatDuration(net);
      totalMinEl.textContent = `${diff.toLocaleString(numberLocale)} ${text.totalMin}`;
      decimalEl.textContent = `${(diff / 60).toLocaleString(numberLocale, { maximumFractionDigits: 2 })} ${text.decimal}`;
      help.textContent = text.summary(elapsedEl.textContent, netEl.textContent, totalMinEl.textContent, decimalEl.textContent);
    };

    [start, end, breakEl, nextDay].forEach((el) => el?.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      start.value = '09:00';
      end.value = '18:30';
      breakEl.value = 60;
      nextDay.checked = false;
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      if (elapsedEl.textContent === '-') return;
      await copyText(text.copy(elapsedEl.textContent, netEl.textContent, totalMinEl.textContent, decimalEl.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = text.copied;
      setTimeout(() => { copyBtn.textContent = old || text.copyDefault; }, 900);
    });

    if (!start.value) start.value = '09:00';
    if (!end.value) end.value = '18:30';
    if (!breakEl.value) breakEl.value = 0;
    render();
  }


  if (slug === 'fuel-economy-calculator') {
    const distance = document.getElementById('fe-distance');
    const fuel = document.getElementById('fe-fuel');
    const price = document.getElementById('fe-price');
    const outKml = document.getElementById('fe-kml');
    const outL100 = document.getElementById('fe-l100');
    const outTotalCost = document.getElementById('fe-total-cost');
    const outCostPerKm = document.getElementById('fe-cost-per-km');
    const help = document.getElementById('fe-help');
    const copyBtn = document.getElementById('fe-copy');
    const resetBtn = document.getElementById('fe-reset');

    if (!distance || !fuel || !price || !outKml || !outL100 || !outTotalCost || !outCostPerKm || !help) return;

    const i18n = {
      ko: {
        currency: '원',
        needInput: '주행거리와 주유량을 입력하세요.',
        invalid: '주행거리와 주유량은 0보다 커야 합니다.',
        noPrice: '단가를 입력하면 총 주유비와 1km당 연료비도 함께 계산됩니다.',
        summary: (kml, l100, total, perKm) => `연비 ${kml}, 100km당 ${l100}, 총 주유비 ${total}, 1km당 ${perKm}`,
        copy: (kml, l100, total, perKm) => `연비 계산 결과 | 연비 ${kml} | 100km당 소비량 ${l100} | 총 주유비 ${total} | 1km당 연료비 ${perKm}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW',
        needInput: 'Enter distance and fuel used.',
        invalid: 'Distance and fuel used must be greater than 0.',
        noPrice: 'Enter fuel price to calculate total cost and cost per km as well.',
        summary: (kml, l100, total, perKm) => `Fuel economy ${kml}, ${l100} per 100km, total fuel cost ${total}, cost per km ${perKm}`,
        copy: (kml, l100, total, perKm) => `Fuel economy result | ${kml} | ${l100} per 100km | Total fuel cost ${total} | Cost per km ${perKm}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        currency: 'ウォン',
        needInput: '走行距離と給油量を入力してください。',
        invalid: '走行距離と給油量は0より大きい値で入力してください。',
        noPrice: '単価を入力すると、総燃料費と1kmあたり燃料費も計算します。',
        summary: (kml, l100, total, perKm) => `燃費 ${kml}、100kmあたり ${l100}、総燃料費 ${total}、1kmあたり ${perKm}`,
        copy: (kml, l100, total, perKm) => `燃費計算結果 | 燃費 ${kml} | 100kmあたり消費量 ${l100} | 総燃料費 ${total} | 1kmあたり燃料費 ${perKm}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const t = i18n[pageLang] || i18n.ko;
    const fmtMoney = (v) => {
      const rounded = Math.round(v || 0).toLocaleString(numberLocale);
      return pageLang === 'en' ? `${rounded}${t.currency}` : `${rounded}${t.currency}`;
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
      outKml.textContent = '-';
      outL100.textContent = '-';
      outTotalCost.textContent = '-';
      outCostPerKm.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const d = Number(distance.value || 0);
      const f = Number(fuel.value || 0);
      const p = Math.max(0, Number(price.value || 0));

      if (!(d > 0) && !(f > 0)) {
        setIdle(t.needInput);
        return;
      }
      if (!(d > 0) || !(f > 0)) {
        setIdle(t.invalid);
        return;
      }

      const kml = d / f;
      const l100 = 100 / kml;
      outKml.textContent = `${kml.toLocaleString(numberLocale, { maximumFractionDigits: 2 })} km/L`;
      outL100.textContent = `${l100.toLocaleString(numberLocale, { maximumFractionDigits: 2 })} L/100km`;

      if (p > 0) {
        const total = f * p;
        const perKm = total / d;
        outTotalCost.textContent = fmtMoney(total);
        outCostPerKm.textContent = fmtMoney(perKm);
        help.textContent = t.summary(outKml.textContent, outL100.textContent, outTotalCost.textContent, outCostPerKm.textContent);
      } else {
        outTotalCost.textContent = '-';
        outCostPerKm.textContent = '-';
        help.textContent = t.noPrice;
      }
    };

    [distance, fuel, price].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (outKml.textContent === '-') return;
      const text = t.copy(outKml.textContent, outL100.textContent, outTotalCost.textContent, outCostPerKm.textContent);
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      distance.value = 420;
      fuel.value = 28;
      price.value = 1720;
      render();
    });

    if (!distance.value) distance.value = 420;
    if (!fuel.value) fuel.value = 28;
    render();
  }

  if (slug === 'goal-savings-calculator') {
    const current = document.getElementById('gs-current');
    const target = document.getElementById('gs-target');
    const monthly = document.getElementById('gs-monthly');
    const rate = document.getElementById('gs-rate');
    const outMonths = document.getElementById('gs-months');
    const outPeriod = document.getElementById('gs-period');
    const outContrib = document.getElementById('gs-contrib');
    const outInterest = document.getElementById('gs-interest');
    const help = document.getElementById('gs-help');
    const copyBtn = document.getElementById('gs-copy');
    const resetBtn = document.getElementById('gs-reset');

    if (!current || !target || !monthly || !rate || !outMonths || !outPeriod || !outContrib || !outInterest || !help) return;

    const t = {
      ko: {
        currency: '원',
        need: '현재 금액, 목표 금액, 월 저축액을 입력하세요.',
        invalid: '목표 금액은 현재 금액보다 커야 하고, 월 저축액은 0보다 커야 합니다.',
        achieved: '이미 목표 금액을 달성한 상태입니다.',
        impossible: '월 저축액이 0원이면 목표 금액까지 도달할 수 없습니다.',
        months: '개월',
        year: '년',
        month: '개월',
        summary: (m, p, c, i) => `${m} 동안 모으면 ${p} 뒤 목표 달성이 예상됩니다. 총 납입액 ${c}, 예상 이자 ${i}`,
        copy: (m, p, c, i) => `목표 저축 기간 계산 결과 | 필요 개월 수 ${m} | 기간 환산 ${p} | 총 납입액 ${c} | 예상 이자 ${i}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW',
        need: 'Enter current savings, target amount, and monthly savings.',
        invalid: 'Target must be greater than current savings, and monthly savings must be greater than 0.',
        achieved: 'You have already reached your target amount.',
        impossible: 'You cannot reach the target if monthly savings is 0.',
        months: 'months',
        year: 'yr',
        month: 'mo',
        summary: (m, p, c, i) => `You are expected to reach the goal in ${m} (${p}). Total contributions ${c}, estimated interest ${i}.`,
        copy: (m, p, c, i) => `Goal savings result | Required months ${m} | Period ${p} | Total contributions ${c} | Estimated interest ${i}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        currency: 'ウォン',
        need: '現在の貯蓄額、目標金額、毎月の積立額を入力してください。',
        invalid: '目標金額は現在額より大きく、毎月の積立額は0より大きい必要があります。',
        achieved: 'すでに目標金額を達成しています。',
        impossible: '毎月の積立額が0だと目標金額に到達できません。',
        months: 'か月',
        year: '年',
        month: 'か月',
        summary: (m, p, c, i) => `${m} で積み立てると、${p} 後に目標達成見込みです。総納入額 ${c}、想定利息 ${i}。`,
        copy: (m, p, c, i) => `目標貯蓄期間計算結果 | 必要月数 ${m} | 期間 ${p} | 総納入額 ${c} | 想定利息 ${i}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {};

    const fmtMoney = (v) => `${Math.round(v || 0).toLocaleString(numberLocale)}${t.currency}`;
    const fmtMonths = (v) => `${Math.round(v || 0).toLocaleString(numberLocale)} ${t.months}`;
    const periodText = (months) => {
      const years = Math.floor(months / 12);
      const rem = months % 12;
      if (years <= 0) return `${rem.toLocaleString(numberLocale)} ${t.month}`;
      if (rem <= 0) return `${years.toLocaleString(numberLocale)} ${t.year}`;
      return `${years.toLocaleString(numberLocale)} ${t.year} ${rem.toLocaleString(numberLocale)} ${t.month}`;
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
      outMonths.textContent = '-';
      outPeriod.textContent = '-';
      outContrib.textContent = '-';
      outInterest.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const cur = Math.max(0, Number(current.value || 0));
      const tgt = Math.max(0, Number(target.value || 0));
      const mon = Math.max(0, Number(monthly.value || 0));
      const annualRate = Math.max(0, Number(rate.value || 0));

      if (!(cur > 0) && !(tgt > 0) && !(mon > 0)) {
        setIdle(t.need);
        return;
      }
      if (tgt <= cur) {
        outMonths.textContent = `0 ${t.months}`;
        outPeriod.textContent = pageLang === 'en' ? '0 mo' : (pageLang === 'ja' ? '0か月' : '0개월');
        outContrib.textContent = fmtMoney(0);
        outInterest.textContent = fmtMoney(0);
        help.textContent = t.achieved;
        return;
      }
      if (!(mon > 0)) {
        setIdle(t.impossible);
        return;
      }

      const monthlyRate = annualRate / 100 / 12;
      let balance = cur;
      let months = 0;
      let totalContrib = 0;
      const maxMonths = 1200;

      while (balance < tgt && months < maxMonths) {
        balance += mon;
        totalContrib += mon;
        if (monthlyRate > 0) balance *= (1 + monthlyRate);
        months += 1;
      }

      if (balance < tgt) {
        setIdle(t.invalid);
        return;
      }

      const interest = Math.max(0, balance - cur - totalContrib);
      outMonths.textContent = fmtMonths(months);
      outPeriod.textContent = periodText(months);
      outContrib.textContent = fmtMoney(totalContrib);
      outInterest.textContent = fmtMoney(interest);
      help.textContent = t.summary(outMonths.textContent, outPeriod.textContent, outContrib.textContent, outInterest.textContent);
    };

    [current, target, monthly, rate].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (outMonths.textContent === '-') return;
      await copyText(t.copy(outMonths.textContent, outPeriod.textContent, outContrib.textContent, outInterest.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      current.value = 2000000;
      target.value = 10000000;
      monthly.value = 500000;
      rate.value = 3;
      render();
    });

    if (!current.value) current.value = 2000000;
    if (!target.value) target.value = 10000000;
    if (!monthly.value) monthly.value = 500000;
    render();
  }

  if (slug === 'unit-price-calculator') {
    const mode = document.getElementById('up-mode');
    const unit = document.getElementById('up-unit');
    const priceA = document.getElementById('up-price-a');
    const qtyA = document.getElementById('up-qty-a');
    const priceB = document.getElementById('up-price-b');
    const qtyB = document.getElementById('up-qty-b');
    const unitAEl = document.getElementById('up-unit-a');
    const unitBEl = document.getElementById('up-unit-b');
    const compareEl = document.getElementById('up-compare');
    const savingsEl = document.getElementById('up-savings');
    const subAEl = document.getElementById('up-sub-a');
    const subBEl = document.getElementById('up-sub-b');
    const help = document.getElementById('up-help');
    const copyBtn = document.getElementById('up-copy');
    const resetBtn = document.getElementById('up-reset');

    if (!mode || !unit || !priceA || !qtyA || !priceB || !qtyB || !unitAEl || !unitBEl || !compareEl || !savingsEl || !subAEl || !subBEl || !help) return;

    const text = {
      ko: {
        need: '가격과 수량을 입력하면 단가가 계산됩니다.',
        invalid: '수량은 0보다 커야 합니다.',
        same: '거의 동일',
        aCheaper: '상품 A가 더 저렴',
        bCheaper: '상품 B가 더 저렴',
        save: (money, pct) => `${money} 절약 · 약 ${pct}% 차이`,
        onlyA: '상품 A 단가만 계산했습니다.',
        onlyB: '상품 B 단가만 계산했습니다.',
        compare: (label, money, pct) => `${label} · 기준 단가 차이 ${money} (${pct}%)`,
        perItem: '1개당',
        per100g: '100g당',
        per1kg: '1kg당',
        per100ml: '100ml당',
        per1l: '1L당',
        copyDefault: '결과 복사',
        copied: '복사됨',
        copy: (a,b,c,d,sa,sb) => `단가 계산 결과 | A ${a} | B ${b} | 비교 ${c} | 절감 ${d} | A 보조 ${sa} | B 보조 ${sb}`
      },
      en: {
        need: 'Enter price and quantity to calculate unit price.',
        invalid: 'Quantity must be greater than 0.',
        same: 'Almost the same',
        aCheaper: 'Product A is cheaper',
        bCheaper: 'Product B is cheaper',
        save: (money, pct) => `Save ${money} · about ${pct}% difference`,
        onlyA: 'Calculated only product A unit price.',
        onlyB: 'Calculated only product B unit price.',
        compare: (label, money, pct) => `${label} · unit price gap ${money} (${pct}%)`,
        perItem: 'Per item',
        per100g: 'Per 100g',
        per1kg: 'Per 1kg',
        per100ml: 'Per 100ml',
        per1l: 'Per 1L',
        copyDefault: 'Copy result',
        copied: 'Copied',
        copy: (a,b,c,d,sa,sb) => `Unit price result | A ${a} | B ${b} | Compare ${c} | Savings ${d} | A extra ${sa} | B extra ${sb}`
      },
      ja: {
        need: '価格と数量を入力すると単価を計算できます。',
        invalid: '数量は0より大きい必要があります。',
        same: 'ほぼ同じ',
        aCheaper: '商品Aが安い',
        bCheaper: '商品Bが安い',
        save: (money, pct) => `${money} 節約・約${pct}%差`,
        onlyA: '商品Aの単価のみ計算しました。',
        onlyB: '商品Bの単価のみ計算しました。',
        compare: (label, money, pct) => `${label} ・単価差 ${money}（${pct}%）`,
        perItem: '1個あたり',
        per100g: '100gあたり',
        per1kg: '1kgあたり',
        per100ml: '100mlあたり',
        per1l: '1Lあたり',
        copyDefault: '結果をコピー',
        copied: 'コピー完了',
        copy: (a,b,c,d,sa,sb) => `単価計算結果 | A ${a} | B ${b} | 比較 ${c} | 節約 ${d} | A補助 ${sa} | B補助 ${sb}`
      }
    }[pageLang] || { need: '가격과 수량을 입력하면 단가가 계산됩니다.', invalid: '수량은 0보다 커야 합니다.', same: '거의 동일', aCheaper: '상품 A가 더 저렴', bCheaper: '상품 B가 더 저렴', save: (money, pct) => `${money} 절약 · 약 ${pct}% 차이`, onlyA: '상품 A 단가만 계산했습니다.', onlyB: '상품 B 단가만 계산했습니다.', compare: (label, money, pct) => `${label} · 기준 단가 차이 ${money} (${pct}%)`, perItem: '1개당', per100g: '100g당', per1kg: '1kg당', per100ml: '100ml당', per1l: '1L당', copyDefault: '결과 복사', copied: '복사됨', copy: (a,b,c,d,sa,sb) => `단가 계산 결과 | A ${a} | B ${b} | 비교 ${c} | 절감 ${d} | A 보조 ${sa} | B 보조 ${sb}` };

    const fmtMoney = (v) => `${Math.round(v || 0).toLocaleString(numberLocale)}${pageLang === 'en' ? ' KRW' : (pageLang === 'ja' ? 'ウォン' : '원')}`;
    const q = (el) => { const n = Number(el?.value || 0); return Number.isFinite(n) ? n : 0; };
    const copyText = async (textValue) => {
      try { await navigator.clipboard.writeText(textValue); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = textValue; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const syncUnits = () => {
      const m = mode.value || 'count';
      if (m === 'count') unit.value = 'count';
      if (m === 'weight' && !['g','kg'].includes(unit.value)) unit.value = 'g';
      if (m === 'volume' && !['ml','l'].includes(unit.value)) unit.value = 'ml';
      Array.from(unit.options).forEach((opt) => {
        const allowed = m === 'count' ? ['count'] : (m === 'weight' ? ['g','kg'] : ['ml','l']);
        opt.hidden = !allowed.includes(opt.value);
      });
    };

    const perBase = (price, qtyValue, unitValue) => {
      if (!(qtyValue > 0)) return null;
      let baseQty = qtyValue;
      if (unitValue === 'kg' || unitValue === 'l') baseQty = qtyValue * 1000;
      return price / baseQty;
    };

    const subLabel = (unitValue) => {
      if (unitValue === 'count') return text.perItem;
      if (unitValue === 'g') return text.per100g;
      if (unitValue === 'kg') return text.per1kg;
      if (unitValue === 'ml') return text.per100ml;
      return text.per1l;
    };

    const subValue = (baseUnitPrice, unitValue) => {
      if (baseUnitPrice == null) return '-';
      if (unitValue === 'count') return `${text.perItem} ${fmtMoney(baseUnitPrice)}`;
      if (unitValue === 'g') return `${text.per100g} ${fmtMoney(baseUnitPrice * 100)} · ${text.per1kg} ${fmtMoney(baseUnitPrice * 1000)}`;
      if (unitValue === 'kg') return `${text.per1kg} ${fmtMoney(baseUnitPrice * 1000)}`;
      if (unitValue === 'ml') return `${text.per100ml} ${fmtMoney(baseUnitPrice * 100)} · ${text.per1l} ${fmtMoney(baseUnitPrice * 1000)}`;
      return `${text.per1l} ${fmtMoney(baseUnitPrice * 1000)}`;
    };

    const render = () => {
      syncUnits();
      const pa = Math.max(0, q(priceA));
      const qa = Math.max(0, q(qtyA));
      const pb = Math.max(0, q(priceB));
      const qb = Math.max(0, q(qtyB));
      const uv = unit.value || 'count';

      const ua = perBase(pa, qa, uv);
      const ub = perBase(pb, qb, uv);

      unitAEl.textContent = ua == null ? '-' : `${subLabel(uv)} ${fmtMoney(uv === 'count' ? ua : (['g','ml'].includes(uv) ? ua * 100 : ua * 1000))}`;
      unitBEl.textContent = ub == null ? '-' : `${subLabel(uv)} ${fmtMoney(uv === 'count' ? ub : (['g','ml'].includes(uv) ? ub * 100 : ub * 1000))}`;
      subAEl.textContent = subValue(ua, uv);
      subBEl.textContent = subValue(ub, uv);

      if (ua == null && ub == null) {
        compareEl.textContent = '-';
        savingsEl.textContent = '-';
        help.textContent = text.need;
        return;
      }
      if ((qa <= 0 && pa > 0) || (qb <= 0 && pb > 0)) {
        help.textContent = text.invalid;
      }
      if (ua != null && ub == null) {
        compareEl.textContent = 'A';
        savingsEl.textContent = '-';
        help.textContent = text.onlyA;
        return;
      }
      if (ua == null && ub != null) {
        compareEl.textContent = 'B';
        savingsEl.textContent = '-';
        help.textContent = text.onlyB;
        return;
      }

      const diff = Math.abs(ua - ub);
      const cheaper = ua < ub ? 'A' : (ub < ua ? 'B' : 'same');
      const pct = Math.max(0, ((diff / Math.max(ua, ub)) * 100));
      if (cheaper === 'same' || diff < 1e-9) {
        compareEl.textContent = text.same;
        savingsEl.textContent = text.save(fmtMoney(0), '0');
        help.textContent = text.compare(text.same, fmtMoney(0), '0');
      } else if (cheaper === 'A') {
        compareEl.textContent = text.aCheaper;
        savingsEl.textContent = text.save(fmtMoney(uv === 'count' ? diff : diff * (['g','ml'].includes(uv) ? 100 : 1000)), pct.toLocaleString(numberLocale, { maximumFractionDigits: 2 }));
        help.textContent = text.compare(text.aCheaper, fmtMoney(uv === 'count' ? diff : diff * (['g','ml'].includes(uv) ? 100 : 1000)), pct.toLocaleString(numberLocale, { maximumFractionDigits: 2 }));
      } else {
        compareEl.textContent = text.bCheaper;
        savingsEl.textContent = text.save(fmtMoney(uv === 'count' ? diff : diff * (['g','ml'].includes(uv) ? 100 : 1000)), pct.toLocaleString(numberLocale, { maximumFractionDigits: 2 }));
        help.textContent = text.compare(text.bCheaper, fmtMoney(uv === 'count' ? diff : diff * (['g','ml'].includes(uv) ? 100 : 1000)), pct.toLocaleString(numberLocale, { maximumFractionDigits: 2 }));
      }
    };

    [mode, unit, priceA, qtyA, priceB, qtyB].forEach((el) => el?.addEventListener('input', render));
    copyBtn?.addEventListener('click', async () => {
      const payload = text.copy(unitAEl.textContent, unitBEl.textContent, compareEl.textContent, savingsEl.textContent, subAEl.textContent, subBEl.textContent);
      await copyText(payload);
      const old = copyBtn.textContent;
      copyBtn.textContent = text.copied;
      setTimeout(() => { copyBtn.textContent = old || text.copyDefault; }, 900);
    });
    resetBtn?.addEventListener('click', () => {
      mode.value = 'count'; unit.value = 'count';
      priceA.value = 5980; qtyA.value = 4; priceB.value = 8400; qtyB.value = 6;
      render();
    });
    if (!priceA.value) priceA.value = 5980;
    if (!qtyA.value) qtyA.value = 4;
    if (!priceB.value) priceB.value = 8400;
    if (!qtyB.value) qtyB.value = 6;
    render();
  }


  if (slug === 'electricity-cost-calculator') {
    const power = document.getElementById('ec-power');
    const hours = document.getElementById('ec-hours');
    const days = document.getElementById('ec-days');
    const rate = document.getElementById('ec-rate');
    const dailyKwh = document.getElementById('ec-daily-kwh');
    const monthlyKwh = document.getElementById('ec-monthly-kwh');
    const monthlyCost = document.getElementById('ec-monthly-cost');
    const yearlyCost = document.getElementById('ec-yearly-cost');
    const help = document.getElementById('ec-help');
    const copyBtn = document.getElementById('ec-copy');
    const resetBtn = document.getElementById('ec-reset');

    if (!power || !hours || !days || !rate || !dailyKwh || !monthlyKwh || !monthlyCost || !yearlyCost || !help) return;

    const i18n = {
      ko: {
        currency: '원',
        idle: '소비전력·사용시간·사용일수·전기단가를 입력하면 예상 전기요금을 계산합니다.',
        needInput: '소비전력, 사용시간, 사용일수, 전기단가를 모두 입력하세요.',
        summary: (m, y) => `예상 월 요금은 ${m}, 연간으로는 약 ${y}입니다. 실제 청구요금은 누진제/기본요금 등에 따라 달라질 수 있습니다.`,
        copy: (d, m, mc, yc) => `전기요금 계산 결과 | 하루 사용량 ${d} | 월 사용량 ${m} | 예상 월 요금 ${mc} | 예상 연 요금 ${yc}`,
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        currency: ' KRW',
        idle: 'Enter power, hours, days, and price per kWh to estimate electricity cost.',
        needInput: 'Enter wattage, hours, days, and price per kWh.',
        summary: (m, y) => `Estimated monthly cost is ${m}, and yearly cost is about ${y}. Actual bills can differ because of taxes, base fees, or tiered pricing.`,
        copy: (d, m, mc, yc) => `Electricity cost result | Daily usage ${d} | Monthly usage ${m} | Monthly cost ${mc} | Yearly cost ${yc}`,
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        currency: 'ウォン',
        idle: '消費電力・使用時間・使用日数・単価を入力すると電気料金を試算します。',
        needInput: '消費電力、使用時間、使用日数、電気単価を入力してください。',
        summary: (m, y) => `予想月額料金は ${m}、年間では約 ${y} です。実際の請求額は基本料金や段階料金などで変わる場合があります。`,
        copy: (d, m, mc, yc) => `電気料金計算結果 | 1日の使用量 ${d} | 月間使用量 ${m} | 予想月額料金 ${mc} | 予想年額料金 ${yc}`,
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    };
    const t = i18n[pageLang] || i18n.ko;

    const fmtCurrency = (v) => {
      const rounded = Math.round(v || 0).toLocaleString(numberLocale);
      if (pageLang === 'en') return `${rounded}${t.currency}`;
      return `${rounded}${t.currency}`;
    };
    const fmtKwh = (v) => `${Number(v || 0).toLocaleString(numberLocale, { maximumFractionDigits: 2 })} kWh`;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      dailyKwh.textContent = '-';
      monthlyKwh.textContent = '-';
      monthlyCost.textContent = '-';
      yearlyCost.textContent = '-';
      help.textContent = msg;
    };

    const render = () => {
      const p = Math.max(0, Number(power.value || 0));
      const h = Math.max(0, Number(hours.value || 0));
      const d = Math.max(0, Number(days.value || 0));
      const r = Math.max(0, Number(rate.value || 0));

      if (!(p > 0) || !(h > 0) || !(d > 0) || !(r > 0)) {
        setIdle(t.needInput);
        return;
      }

      const daily = (p / 1000) * h;
      const monthly = daily * d;
      const monthlyFee = monthly * r;
      const yearlyFee = monthlyFee * 12;

      dailyKwh.textContent = fmtKwh(daily);
      monthlyKwh.textContent = fmtKwh(monthly);
      monthlyCost.textContent = fmtCurrency(monthlyFee);
      yearlyCost.textContent = fmtCurrency(yearlyFee);
      help.textContent = t.summary(fmtCurrency(monthlyFee), fmtCurrency(yearlyFee));
    };

    [power, hours, days, rate].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      if (monthlyCost.textContent === '-') return;
      await copyText(t.copy(dailyKwh.textContent, monthlyKwh.textContent, monthlyCost.textContent, yearlyCost.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      power.value = 1500;
      hours.value = 4;
      days.value = 30;
      rate.value = 150;
      render();
    });

    if (!power.value) power.value = 1500;
    if (!hours.value) hours.value = 4;
    if (!days.value) days.value = 30;
    if (!rate.value) rate.value = 150;
    render();
  }

  if (slug === 'ratio-split-calculator') {
    const total = document.getElementById('rs-total');
    const rounding = document.getElementById('rs-rounding');
    const items = document.getElementById('rs-items');
    const ratioSum = document.getElementById('rs-ratio-sum');
    const itemCount = document.getElementById('rs-item-count');
    const lastAdjust = document.getElementById('rs-last-adjust');
    const checkTotal = document.getElementById('rs-check-total');
    const list = document.getElementById('rs-list');
    const help = document.getElementById('rs-help');
    const copyBtn = document.getElementById('rs-copy');
    const resetBtn = document.getElementById('rs-reset');

    if (!total || !rounding || !items || !ratioSum || !itemCount || !lastAdjust || !checkTotal || !list || !help) return;

    const t = {
      ko: {
        need: '총 금액과 항목별 비율을 입력하세요.',
        invalidTotal: '총 금액은 0보다 커야 합니다.',
        invalidItems: '항목은 한 줄에 이름,비율 형식으로 입력하고 비율은 0보다 커야 합니다.',
        ratioUnit: '합',
        itemUnit: '개',
        summary: (count, total, adjust) => `${count}개 항목으로 ${total}을 배분했습니다. 마지막 차액 보정은 ${adjust}입니다.`,
        exact: '정확히 일치',
        adjustment: '보정',
        amount: '배분 금액',
        weight: '비율',
        share: '비중',
        totalAmount: '총 배분 합계',
        copyTitle: '비율 분배 계산 결과',
        copied: '복사됨',
        copyDefault: '결과 복사'
      },
      en: {
        need: 'Enter a total amount and item ratios.',
        invalidTotal: 'Total amount must be greater than 0.',
        invalidItems: 'Enter each item as name,ratio on a new line, and ratios must be greater than 0.',
        ratioUnit: 'sum',
        itemUnit: 'items',
        summary: (count, total, adjust) => `Allocated ${total} across ${count} items. Final adjustment: ${adjust}.`,
        exact: 'Exact match',
        adjustment: 'Adjustment',
        amount: 'Amount',
        weight: 'Ratio',
        share: 'Share',
        totalAmount: 'Allocated total',
        copyTitle: 'Ratio split result',
        copied: 'Copied',
        copyDefault: 'Copy result'
      },
      ja: {
        need: '総額と項目ごとの比率を入力してください。',
        invalidTotal: '総額は0より大きい必要があります。',
        invalidItems: '項目は1行ごとに 名前,比率 の形式で入力し、比率は0より大きくしてください。',
        ratioUnit: '合計',
        itemUnit: '項目',
        summary: (count, total, adjust) => `${count}項目に ${total} を配分しました。最後の差額補正は ${adjust} です。`,
        exact: '完全一致',
        adjustment: '補正',
        amount: '配分金額',
        weight: '比率',
        share: '割合',
        totalAmount: '配分合計',
        copyTitle: '比率配分計算結果',
        copied: 'コピー完了',
        copyDefault: '結果をコピー'
      }
    }[pageLang] || {};

    const fmtMoney = (v) => Math.round(v || 0).toLocaleString(numberLocale);
    const roundValue = (value, unit) => Math.round(value / unit) * unit;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const setIdle = (msg) => {
      ratioSum.textContent = '-';
      itemCount.textContent = '-';
      lastAdjust.textContent = '-';
      checkTotal.textContent = '-';
      list.innerHTML = '';
      help.textContent = msg;
    };

    const parseItems = () => {
      const lines = (items.value || '').split(/\n+/).map((line) => line.trim()).filter(Boolean);
      const parsed = [];
      for (const [idx, line] of lines.entries()) {
        const parts = line.split(',');
        if (parts.length < 2) return null;
        const name = parts.slice(0, -1).join(',').trim() || `Item ${idx + 1}`;
        const ratio = Number(parts[parts.length - 1].trim());
        if (!Number.isFinite(ratio) || ratio <= 0) return null;
        parsed.push({ name, ratio });
      }
      return parsed;
    };

    const render = () => {
      const totalAmount = Math.max(0, Number(total.value || 0));
      const unit = Math.max(1, Number(rounding.value || 1));
      const parsed = parseItems();

      if (!(totalAmount > 0) && !(items.value || '').trim()) {
        setIdle(t.need);
        return;
      }
      if (!(totalAmount > 0)) {
        setIdle(t.invalidTotal);
        return;
      }
      if (!parsed || !parsed.length) {
        setIdle(t.invalidItems);
        return;
      }

      const sum = parsed.reduce((acc, item) => acc + item.ratio, 0);
      const allocations = parsed.map((item) => ({
        ...item,
        percent: (item.ratio / sum) * 100,
        rawAmount: totalAmount * (item.ratio / sum)
      }));

      let allocated = 0;
      allocations.forEach((item, idx) => {
        if (idx === allocations.length - 1) return;
        item.amount = roundValue(item.rawAmount, unit);
        allocated += item.amount;
      });
      const last = allocations[allocations.length - 1];
      last.amount = totalAmount - allocated;

      const finalTotal = allocations.reduce((acc, item) => acc + item.amount, 0);
      const adjustment = last.amount - roundValue(last.rawAmount, unit);

      ratioSum.textContent = `${sum.toLocaleString(numberLocale, { maximumFractionDigits: 2 })} ${t.ratioUnit}`;
      itemCount.textContent = `${allocations.length.toLocaleString(numberLocale)} ${t.itemUnit}`;
      lastAdjust.textContent = adjustment === 0 ? t.exact : `${fmtMoney(adjustment)} (${t.adjustment})`;
      checkTotal.textContent = fmtMoney(finalTotal);

      list.innerHTML = allocations.map((item) => `
        <div class="bw-item">
          <strong>${item.name}<span class="bw-tag">${item.percent.toLocaleString(numberLocale, { maximumFractionDigits: 2 })}%</span></strong>
          <p>${t.amount}: ${fmtMoney(item.amount)} · ${t.weight}: ${item.ratio.toLocaleString(numberLocale, { maximumFractionDigits: 2 })} · ${t.share}: ${item.percent.toLocaleString(numberLocale, { maximumFractionDigits: 2 })}%</p>
        </div>
      `).join('');

      help.textContent = t.summary(allocations.length.toLocaleString(numberLocale), fmtMoney(totalAmount), adjustment === 0 ? t.exact : fmtMoney(adjustment));
    };

    [total, rounding, items].forEach((el) => el?.addEventListener('input', render));

    copyBtn?.addEventListener('click', async () => {
      const parsed = parseItems();
      if (!parsed || !parsed.length || !(Number(total.value || 0) > 0)) return;
      render();
      const lines = Array.from(list.querySelectorAll('.bw-item')).map((item) => item.textContent.trim().replace(/\s+/g, ' '));
      const text = [t.copyTitle, ...lines, `${t.totalAmount}: ${checkTotal.textContent}`].join('\n');
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    resetBtn?.addEventListener('click', () => {
      total.value = 1000000;
      rounding.value = 100;
      items.value = pageLang === 'en'
        ? 'Marketing,5\nOperations,3\nReserve,2'
        : (pageLang === 'ja'
          ? 'マーケ,5\n運営,3\n予備,2'
          : '항목 A,5\n항목 B,3\n항목 C,2');
      render();
    });

    if (!total.value) total.value = 1000000;
    if (!(items.value || '').trim()) {
      items.value = pageLang === 'en'
        ? 'Marketing,5\nOperations,3\nReserve,2'
        : (pageLang === 'ja'
          ? 'マーケ,5\n運営,3\n予備,2'
          : '항목 A,5\n항목 B,3\n항목 C,2');
    }
    render();
  }

  if (slug === 'subscription-cleanup-simulator') {
    const rows = [1, 2, 3, 4, 5].map((index) => ({
      index,
      name: document.getElementById(`scs-name-${index}`),
      cost: document.getElementById(`scs-cost-${index}`),
      usage: document.getElementById(`scs-usage-${index}`),
      alt: document.getElementById(`scs-alt-${index}`),
      billing: document.getElementById(`scs-billing-${index}`),
      shared: document.getElementById(`scs-shared-${index}`),
      essential: document.getElementById(`scs-essential-${index}`)
    }));
    const sampleBtn = document.getElementById('scs-sample');
    const resetBtn = document.getElementById('scs-reset');
    const copyBtn = document.getElementById('scs-copy');
    const totalEl = document.getElementById('scs-total');
    const cancelSaveEl = document.getElementById('scs-cancel-save');
    const pauseSaveEl = document.getElementById('scs-pause-save');
    const urgentEl = document.getElementById('scs-urgent');
    const helpEl = document.getElementById('scs-help');
    const outputEl = document.getElementById('scs-output');
    if (!rows[0]?.name || !outputEl) return;

    const t = {
      ko: {
        unit: '원',
        keep: '유지',
        pause: '보류 검토',
        cancel: '해지 우선',
        empty: '구독 정보를 입력하면 유지, 보류, 해지 우선순위를 정리해 드립니다.',
        summary: (count, total, cancel, pause) => `${count}개 구독, 월 ${total}${'원'} 중 해지 우선 ${cancel}${'원'}, 보류 검토 ${pause}${'원'}입니다.`,
        urgent: '이번 주 안에 확인 권장',
        reasonCost: '비용 부담이 큰 편',
        reasonUsage: '사용 빈도가 낮음',
        reasonAlt: '대체 수단이 있음',
        reasonShared: '공유 중이라 체감 단가가 낮음',
        reasonEssential: '업무·학습에 직접 필요',
        reasonSoon: '다음 결제가 가까움',
        copyDefault: '결과 복사',
        copied: '복사됨!'
      },
      en: {
        unit: '',
        keep: 'Keep',
        pause: 'Review / pause',
        cancel: 'Cancel first',
        empty: 'Add subscriptions to organize a practical keep, pause, or cancel order.',
        summary: (count, total, cancel, pause) => `${count} subscriptions, ${total} total per month, ${cancel} in cancel-first savings, ${pause} in review pool.`,
        urgent: 'Check this within the week',
        reasonCost: 'High monthly cost',
        reasonUsage: 'Low usage',
        reasonAlt: 'Easy replacement exists',
        reasonShared: 'Shared plan lowers the effective burden',
        reasonEssential: 'Directly needed for work or study',
        reasonSoon: 'Billing date is close',
        copyDefault: 'Copy result',
        copied: 'Copied!'
      },
      ja: {
        unit: '円',
        keep: '維持',
        pause: '保留検討',
        cancel: '解約優先',
        empty: 'サブスク情報を入力すると、維持・保留・解約の優先順位を整理します。',
        summary: (count, total, cancel, pause) => `${count}件、月額合計 ${total}${'円'}、解約優先 ${cancel}${'円'}、保留検討 ${pause}${'円'}です。`,
        urgent: '今週中の確認がおすすめ',
        reasonCost: '月額負担が大きい',
        reasonUsage: '利用頻度が低い',
        reasonAlt: '代替手段がある',
        reasonShared: '共有中で実質負担が低め',
        reasonEssential: '仕事・学習に必要',
        reasonSoon: '次回決済が近い',
        copyDefault: '結果をコピー',
        copied: 'コピーしました!'
      }
    }[pageLang] || {
      unit: '원', keep: '유지', pause: '보류 검토', cancel: '해지 우선',
      empty: '구독 정보를 입력하면 유지, 보류, 해지 우선순위를 정리해 드립니다.',
      summary: (count, total, cancel, pause) => `${count}개 구독, 월 ${total}원 중 해지 우선 ${cancel}원, 보류 검토 ${pause}원입니다.`,
      urgent: '이번 주 안에 확인 권장', reasonCost: '비용 부담이 큰 편', reasonUsage: '사용 빈도가 낮음', reasonAlt: '대체 수단이 있음', reasonShared: '공유 중이라 체감 단가가 낮음', reasonEssential: '업무·학습에 직접 필요', reasonSoon: '다음 결제가 가까움', copyDefault: '결과 복사', copied: '복사됨!'
    };

    const fmtMoney = (value) => `${formatNum(value)}${t.unit}`;
    const scoreUsage = { high: -5, medium: 0, low: 5 };
    const scoreAlt = { none: -3, partial: 1, easy: 4 };
    const scoreBilling = { soon: 3, week: 1, later: 0 };

    const getRows = () => rows.map((row) => ({
      name: (row.name.value || '').trim(),
      cost: Number(row.cost.value || 0),
      usage: row.usage.value || 'high',
      alt: row.alt.value || 'none',
      billing: row.billing.value || 'later',
      shared: !!row.shared.checked,
      essential: !!row.essential.checked
    })).filter((item) => item.name && item.cost > 0);

    const classify = (item) => {
      let score = 0;
      score += item.cost >= 20000 ? 4 : item.cost >= 10000 ? 2 : 0;
      score += scoreUsage[item.usage] || 0;
      score += scoreAlt[item.alt] || 0;
      score += scoreBilling[item.billing] || 0;
      if (item.shared) score -= 2;
      if (item.essential) score -= 6;
      if (score >= 8) return 'cancel';
      if (score >= 3) return 'pause';
      return 'keep';
    };

    const reasonList = (item) => {
      const reasons = [];
      if (item.cost >= 10000) reasons.push(t.reasonCost);
      if (item.usage === 'low') reasons.push(t.reasonUsage);
      if (item.alt !== 'none') reasons.push(t.reasonAlt);
      if (item.shared) reasons.push(t.reasonShared);
      if (item.essential) reasons.push(t.reasonEssential);
      if (item.billing === 'soon') reasons.push(t.reasonSoon);
      return reasons;
    };

    const render = () => {
      const items = getRows().map((item) => {
        const decision = classify(item);
        const score = (item.cost >= 20000 ? 4 : item.cost >= 10000 ? 2 : 0)
          + (scoreUsage[item.usage] || 0)
          + (scoreAlt[item.alt] || 0)
          + (scoreBilling[item.billing] || 0)
          + (item.shared ? -2 : 0)
          + (item.essential ? -6 : 0);
        return { ...item, decision, score, reasons: reasonList(item) };
      }).sort((a, b) => {
        const order = { cancel: 0, pause: 1, keep: 2 };
        return order[a.decision] - order[b.decision] || b.score - a.score || b.cost - a.cost;
      });

      const total = items.reduce((sum, item) => sum + item.cost, 0);
      const cancelSave = items.filter((item) => item.decision === 'cancel').reduce((sum, item) => sum + item.cost, 0);
      const pauseSave = items.filter((item) => item.decision === 'pause').reduce((sum, item) => sum + item.cost, 0);
      const urgent = items.filter((item) => item.billing === 'soon' || item.billing === 'week').length;

      totalEl.textContent = fmtMoney(total);
      cancelSaveEl.textContent = fmtMoney(cancelSave);
      pauseSaveEl.textContent = fmtMoney(pauseSave);
      urgentEl.textContent = formatNum(urgent);

      if (!items.length) {
        helpEl.textContent = t.empty;
        outputEl.innerHTML = '';
        return;
      }

      helpEl.textContent = t.summary(items.length, formatNum(total), formatNum(cancelSave), formatNum(pauseSave));
      outputEl.innerHTML = items.map((item, index) => {
        const badge = item.decision === 'cancel' ? t.cancel : item.decision === 'pause' ? t.pause : t.keep;
        const urgentText = item.billing !== 'later' ? `<p>${t.urgent}</p>` : '';
        return `
          <div class="bw-item">
            <strong>${index + 1}. ${item.name} · ${badge}</strong>
            <p>${fmtMoney(item.cost)} / score ${item.score}</p>
            <p>${item.reasons.length ? item.reasons.join(' · ') : '-'}</p>
            ${urgentText}
          </div>
        `;
      }).join('');
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    sampleBtn?.addEventListener('click', () => {
      const sample = pageLang === 'en'
        ? [
            ['Netflix', 17000, 'medium', 'partial', 'soon', true, false],
            ['Notion AI', 14000, 'low', 'easy', 'week', false, false],
            ['Spotify', 11900, 'high', 'none', 'later', false, false],
            ['Adobe CC', 78000, 'medium', 'partial', 'soon', false, true],
            ['Extra cloud storage', 4900, 'low', 'easy', 'later', false, false]
          ]
        : pageLang === 'ja'
          ? [
              ['Netflix', 1700, 'medium', 'partial', 'soon', true, false],
              ['Notion AI', 1400, 'low', 'easy', 'week', false, false],
              ['Spotify', 1190, 'high', 'none', 'later', false, false],
              ['Adobe CC', 7800, 'medium', 'partial', 'soon', false, true],
              ['追加クラウド容量', 490, 'low', 'easy', 'later', false, false]
            ]
          : [
              ['넷플릭스', 17000, 'medium', 'partial', 'soon', true, false],
              ['노션 AI', 14000, 'low', 'easy', 'week', false, false],
              ['스포티파이', 11900, 'high', 'none', 'later', false, false],
              ['어도비 CC', 78000, 'medium', 'partial', 'soon', false, true],
              ['추가 클라우드 용량', 4900, 'low', 'easy', 'later', false, false]
            ];
      rows.forEach((row, idx) => {
        const item = sample[idx] || ['', '', 'high', 'none', 'later', false, false];
        row.name.value = item[0] || '';
        row.cost.value = item[1] || '';
        row.usage.value = item[2] || 'high';
        row.alt.value = item[3] || 'none';
        row.billing.value = item[4] || 'later';
        row.shared.checked = !!item[5];
        row.essential.checked = !!item[6];
      });
      render();
    });

    resetBtn?.addEventListener('click', () => {
      rows.forEach((row) => {
        row.name.value = '';
        row.cost.value = '';
        row.usage.value = 'high';
        row.alt.value = 'none';
        row.billing.value = 'soon';
        row.shared.checked = false;
        row.essential.checked = false;
      });
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      const items = getRows().map((item) => ({ ...item, decision: classify(item), reasons: reasonList(item) }));
      if (!items.length) return;
      const text = [
        '[Subscription cleanup priority]',
        ...items.map((item) => `- ${item.name}: ${item.decision === 'cancel' ? t.cancel : item.decision === 'pause' ? t.pause : t.keep} / ${fmtMoney(item.cost)} / ${item.reasons.join(', ')}`)
      ].join('\n');
      await copyText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    rows.forEach((row) => {
      [row.name, row.cost, row.usage, row.alt, row.billing, row.shared, row.essential].forEach((el) => el?.addEventListener('input', render));
      [row.usage, row.alt, row.billing].forEach((el) => el?.addEventListener('change', render));
    });

    render();
  }

  if (slug === 'memory-quiz-generator') {
    const input = document.getElementById('mqg-input');
    const sampleBtn = document.getElementById('mqg-sample');
    const buildBtn = document.getElementById('mqg-build');
    const shuffleInput = document.getElementById('mqg-shuffle');
    const totalEl = document.getElementById('mqg-total');
    const currentEl = document.getElementById('mqg-current');
    const correctEl = document.getElementById('mqg-correct');
    const wrongEl = document.getElementById('mqg-wrong');
    const accuracyEl = document.getElementById('mqg-accuracy');
    const summaryEl = document.getElementById('mqg-summary');
    const questionEl = document.getElementById('mqg-question');
    const answerEl = document.getElementById('mqg-answer');
    const revealBtn = document.getElementById('mqg-reveal');
    const correctBtn = document.getElementById('mqg-correct-btn');
    const wrongBtn = document.getElementById('mqg-wrong-btn');
    const nextBtn = document.getElementById('mqg-next');
    const missedEl = document.getElementById('mqg-missed');
    if (!input) return;

    const t = {
      ko: {
        idle: '질문-정답 목록을 붙여넣고 퀴즈를 만들면 셀프 테스트를 시작할 수 있습니다.',
        invalid: '카드를 만들 수 없어요. 한 줄에 하나씩, 질문과 정답을 = 또는 : 또는 탭/쉼표로 구분해 주세요.',
        ready: (n) => `${n}개의 카드가 준비됐어요. 먼저 답을 떠올린 뒤 정답을 확인해 보세요.`,
        progress: (i, n) => `${i} / ${n}`,
        accuracy: (c, w) => `${Math.round((c / Math.max(1, c + w)) * 100)}%`,
        noQuiz: '아직 퀴즈가 없습니다',
        answerHidden: '정답 보기를 누르면 여기에 표시됩니다.',
        complete: (c, w) => `퀴즈 완료! 총 ${c + w}장 중 ${c}개 정답, ${w}개 오답입니다.`,
        missedTitle: '다시 볼 카드',
        noneMissed: '틀린 카드가 없어요. 그대로 넘어가도 좋습니다.',
        sample: '대한민국 수도 = 서울\nphotosynthesis = 식물이 빛으로 에너지를 만드는 과정\n갑오개혁 = 1894년\n우리 회사의 핵심 가치 = 고객 문제를 빠르게 해결하는 것'
      },
      en: {
        idle: 'Paste prompt-answer pairs and build a quiz to start self-testing.',
        invalid: 'Could not create cards. Use one pair per line and separate prompt and answer with =, :, tab, or comma.',
        ready: (n) => `${n} cards are ready. Try recalling the answer first, then reveal it.`,
        progress: (i, n) => `${i} / ${n}`,
        accuracy: (c, w) => `${Math.round((c / Math.max(1, c + w)) * 100)}%`,
        noQuiz: 'No quiz yet',
        answerHidden: 'The answer will appear here after reveal.',
        complete: (c, w) => `Quiz complete. ${c} correct and ${w} wrong out of ${c + w} cards.`,
        missedTitle: 'Cards to review',
        noneMissed: 'No missed cards. Nice.',
        sample: 'capital of Korea = Seoul\nphotosynthesis = process plants use to convert light into energy\nGapo Reform = 1894\ncore value = solve customer problems quickly'
      },
      ja: {
        idle: '質問と答えのペアを貼り付けてクイズを作成すると、セルフテストを始められます。',
        invalid: 'カードを作成できませんでした。1行に1つずつ、質問と答えを =、:、タブ、カンマで区切ってください。',
        ready: (n) => `${n}枚のカードを用意しました。先に答えを思い出してから確認してみてください。`,
        progress: (i, n) => `${i} / ${n}`,
        accuracy: (c, w) => `${Math.round((c / Math.max(1, c + w)) * 100)}%`,
        noQuiz: 'まだクイズがありません',
        answerHidden: '答えを表示するとここに出ます。',
        complete: (c, w) => `クイズ完了。${c + w}枚中、正解 ${c}、不正解 ${w} です。`,
        missedTitle: '復習するカード',
        noneMissed: '間違えたカードはありません。',
        sample: '韓国の首都 = ソウル\nphotosynthesis = 植物が光でエネルギーを作る過程\n甲午改革 = 1894年\n会社のコア価値 = 顧客課題を素早く解決すること'
      }
    }[pageLang] || {
      idle: '질문-정답 목록을 붙여넣고 퀴즈를 만들면 셀프 테스트를 시작할 수 있습니다.',
      invalid: '카드를 만들 수 없어요. 한 줄에 하나씩, 질문과 정답을 = 또는 : 또는 탭/쉼표로 구분해 주세요.',
      ready: (n) => `${n}개의 카드가 준비됐어요. 먼저 답을 떠올린 뒤 정답을 확인해 보세요.`,
      progress: (i, n) => `${i} / ${n}`,
      accuracy: (c, w) => `${Math.round((c / Math.max(1, c + w)) * 100)}%`,
      noQuiz: '아직 퀴즈가 없습니다',
      answerHidden: '정답 보기를 누르면 여기에 표시됩니다.',
      complete: (c, w) => `퀴즈 완료! 총 ${c + w}장 중 ${c}개 정답, ${w}개 오답입니다.`,
      missedTitle: '다시 볼 카드',
      noneMissed: '틀린 카드가 없어요. 그대로 넘어가도 좋습니다.',
      sample: '대한민국 수도 = 서울\nphotosynthesis = 식물이 빛으로 에너지를 만드는 과정\n갑오개혁 = 1894년\n우리 회사의 핵심 가치 = 고객 문제를 빠르게 해결하는 것'
    };

    let cards = [];
    let currentIndex = 0;
    let currentRevealed = false;
    let results = [];

    const shuffle = (arr) => {
      const cloned = [...arr];
      for (let i = cloned.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
      }
      return cloned;
    };

    const parseCards = () => (input.value || '')
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(/\s*(?:=|:|\t|,)\s*/);
        if (parts.length < 2) return null;
        return { question: parts[0].trim(), answer: parts.slice(1).join(' / ').trim() };
      })
      .filter((card) => card && card.question && card.answer);

    const renderMissed = () => {
      const missed = results.filter((item) => item.result === 'wrong');
      missedEl.innerHTML = `<div class="bw-item"><strong>${t.missedTitle}</strong><p>${missed.length ? '' : t.noneMissed}</p></div>` + missed.map((item) => `
        <div class="bw-item">
          <strong>${item.question}</strong>
          <p>${item.answer}</p>
        </div>
      `).join('');
    };

    const updateStats = () => {
      const correct = results.filter((item) => item.result === 'correct').length;
      const wrong = results.filter((item) => item.result === 'wrong').length;
      totalEl.textContent = formatNum(cards.length);
      currentEl.textContent = cards.length ? t.progress(Math.min(currentIndex + (results.length === cards.length ? 0 : 1), cards.length), cards.length) : '0';
      correctEl.textContent = formatNum(correct);
      wrongEl.textContent = formatNum(wrong);
      accuracyEl.textContent = (correct + wrong) ? t.accuracy(correct, wrong) : '-';
    };

    const renderCard = () => {
      updateStats();
      if (!cards.length) {
        questionEl.textContent = t.noQuiz;
        answerEl.textContent = t.answerHidden;
        summaryEl.textContent = t.idle;
        missedEl.innerHTML = '';
        return;
      }
      if (currentIndex >= cards.length) {
        questionEl.textContent = t.complete(results.filter((item) => item.result === 'correct').length, results.filter((item) => item.result === 'wrong').length);
        answerEl.textContent = t.answerHidden;
        summaryEl.textContent = t.complete(results.filter((item) => item.result === 'correct').length, results.filter((item) => item.result === 'wrong').length);
        renderMissed();
        return;
      }
      const card = cards[currentIndex];
      questionEl.textContent = card.question;
      answerEl.textContent = currentRevealed ? card.answer : t.answerHidden;
      summaryEl.textContent = t.ready(cards.length);
    };

    const mark = (result) => {
      if (!cards.length || currentIndex >= cards.length) return;
      const card = cards[currentIndex];
      results = results.filter((item) => item.index !== currentIndex);
      results.push({ index: currentIndex, question: card.question, answer: card.answer, result });
      currentIndex += 1;
      currentRevealed = false;
      renderCard();
    };

    sampleBtn?.addEventListener('click', () => {
      input.value = t.sample;
    });
    buildBtn?.addEventListener('click', () => {
      const parsed = parseCards();
      if (!parsed.length) {
        cards = [];
        results = [];
        currentIndex = 0;
        currentRevealed = false;
        summaryEl.textContent = t.invalid;
        renderCard();
        return;
      }
      cards = shuffleInput?.checked ? shuffle(parsed) : parsed;
      results = [];
      currentIndex = 0;
      currentRevealed = false;
      summaryEl.textContent = t.ready(cards.length);
      renderCard();
    });
    revealBtn?.addEventListener('click', () => {
      if (!cards.length || currentIndex >= cards.length) return;
      currentRevealed = true;
      renderCard();
    });
    correctBtn?.addEventListener('click', () => mark('correct'));
    wrongBtn?.addEventListener('click', () => mark('wrong'));
    nextBtn?.addEventListener('click', () => {
      if (!cards.length || currentIndex >= cards.length) return;
      currentIndex += 1;
      currentRevealed = false;
      renderCard();
    });

    renderCard();
  }
  if (slug === 'meeting-action-item-organizer') {
    const titleEl = document.getElementById('maio-title');
    const dueEl = document.getElementById('maio-due');
    const inputEl = document.getElementById('maio-input');
    const ownerEl = document.getElementById('maio-owner');
    const priorityEl = document.getElementById('maio-priority');
    const deadlineEl = document.getElementById('maio-deadline');
    const checkboxEl = document.getElementById('maio-checkbox');
    const runBtn = document.getElementById('maio-run');
    const sampleBtn = document.getElementById('maio-sample');
    const copyBtn = document.getElementById('maio-copy');
    const linesEl = document.getElementById('maio-lines');
    const actionsEl = document.getElementById('maio-actions');
    const checksEl = document.getElementById('maio-checks');
    const notesEl = document.getElementById('maio-notes');
    const helpEl = document.getElementById('maio-help');
    const outputEl = document.getElementById('maio-output');

    if (!titleEl || !dueEl || !inputEl || !ownerEl || !priorityEl || !deadlineEl || !checkboxEl || !runBtn || !sampleBtn || !copyBtn || !linesEl || !actionsEl || !checksEl || !notesEl || !helpEl || !outputEl) return;

    const t = {
      sampleTitle: '제품 주간회의 후속정리',
      sample: ['랜딩 문구 수정', '배너 시안 금요일까지 확인', '결제 오류 재현 로그 공유', '다음 회차 주제 확정', '고객 요청 범위 재확인', '회의록 링크 팀 채널에 공유'].join('\n'),
      empty: '회의 메모를 한 줄에 한 항목씩 넣어 주세요.',
      ready: (count) => `${count}개 메모를 정리했습니다. 결과를 바로 복사해 팀 채팅이나 문서에 붙여넣을 수 있어요.`,
      copied: '복사됨',
      copyDefault: '결과 복사',
      labels: {
        action: '실행 항목',
        check: '확인 필요',
        note: '공유 메모',
        summary: '빠른 공유용 한 줄 요약',
        owner: '담당',
        priority: '우선순위',
        deadline: '기한'
      },
      dueMap: {
        'today': '오늘',
        'tomorrow': '내일',
        'this-week': '이번 주',
        'next-week': '다음 주'
      }
    };

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const cleanLine = (line) => line
      .replace(/^\s*[-*•\d.)]+\s*/, '')
      .replace(/\s+/g, ' ')
      .trim();

    const classify = (line) => {
      const text = line.toLowerCase();
      const noteKeywords = ['확정', '결정', '공유', '안내', '링크', '회의록', '메모'];
      const checkKeywords = ['확인', '재확인', '검토', '논의', '질문', '체크', '가능 여부'];
      const urgentKeywords = ['오늘', '긴급', '즉시', 'asap', '오전', '오후', '금요일', '월요일'];

      let bucket = 'action';
      if (noteKeywords.some((word) => text.includes(word))) bucket = 'note';
      if (checkKeywords.some((word) => text.includes(word))) bucket = 'check';
      const priority = urgentKeywords.some((word) => text.includes(word)) ? '높음' : (bucket === 'action' ? '보통' : '낮음');
      return { bucket, priority };
    };

    const buildItem = (line) => {
      const { bucket, priority } = classify(line);
      const prefix = checkboxEl.checked && bucket !== 'note' ? '- [ ] ' : '- ';
      const tags = [];
      if (ownerEl.checked && bucket !== 'note') tags.push(`@${t.labels.owner}: ____`);
      if (priorityEl.checked) tags.push(`${t.labels.priority}: ${priority}`);
      if (deadlineEl.checked && bucket !== 'note') tags.push(`${t.labels.deadline}: ${t.dueMap[dueEl.value] || t.dueMap['this-week']}`);
      return {
        bucket,
        text: `${prefix}${line}${tags.length ? ` (${tags.join(' | ')})` : ''}`
      };
    };

    const render = () => {
      const lines = (inputEl.value || '').split('\n').map(cleanLine).filter(Boolean);
      linesEl.textContent = String(lines.length);

      if (!lines.length) {
        actionsEl.textContent = '0';
        checksEl.textContent = '0';
        notesEl.textContent = '0';
        helpEl.textContent = t.empty;
        outputEl.value = '';
        return;
      }

      const built = lines.map(buildItem);
      const actions = built.filter((item) => item.bucket === 'action');
      const checks = built.filter((item) => item.bucket === 'check');
      const notes = built.filter((item) => item.bucket === 'note');
      actionsEl.textContent = String(actions.length);
      checksEl.textContent = String(checks.length);
      notesEl.textContent = String(notes.length);

      const title = (titleEl.value || t.sampleTitle).trim();
      const summaryBits = [];
      if (actions.length) summaryBits.push(`실행 ${actions.length}건`);
      if (checks.length) summaryBits.push(`확인 ${checks.length}건`);
      if (notes.length) summaryBits.push(`공유 ${notes.length}건`);

      const sections = [
        `# ${title}`,
        '',
        `## ${t.labels.summary}`,
        `- ${summaryBits.join(' / ')}`,
        ''
      ];

      if (actions.length) {
        sections.push(`## ${t.labels.action}`);
        sections.push(...actions.map((item) => item.text));
        sections.push('');
      }
      if (checks.length) {
        sections.push(`## ${t.labels.check}`);
        sections.push(...checks.map((item) => item.text));
        sections.push('');
      }
      if (notes.length) {
        sections.push(`## ${t.labels.note}`);
        sections.push(...notes.map((item) => item.text));
        sections.push('');
      }

      outputEl.value = sections.join('\n').trim();
      helpEl.textContent = t.ready(lines.length);
    };

    [titleEl, dueEl, inputEl, ownerEl, priorityEl, deadlineEl, checkboxEl].forEach((el) => el.addEventListener('input', render));
    runBtn?.addEventListener('click', render);
    sampleBtn?.addEventListener('click', () => {
      titleEl.value = t.sampleTitle;
      inputEl.value = t.sample;
      render();
    });
    copyBtn?.addEventListener('click', async () => {
      if (!outputEl.value.trim()) return;
      await copyText(outputEl.value);
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    render();
  }

  if (slug === 'remote-work-cost-simulator') {
    const totalDaysEl = document.getElementById('rw-total-days');
    const officeDaysEl = document.getElementById('rw-office-days');
    const commuteCostEl = document.getElementById('rw-commute-cost');
    const lunchCostEl = document.getElementById('rw-lunch-cost');
    const coffeeCostEl = document.getElementById('rw-coffee-cost');
    const homeExtraEl = document.getElementById('rw-home-extra');
    const commuteMinutesEl = document.getElementById('rw-commute-minutes');
    const hourValueEl = document.getElementById('rw-hour-value');
    const officeTotalEl = document.getElementById('rw-office-total');
    const homeTotalEl = document.getElementById('rw-home-total');
    const timeCostEl = document.getElementById('rw-time-cost');
    const gapEl = document.getElementById('rw-gap');
    const hoursEl = document.getElementById('rw-hours');
    const breakEvenEl = document.getElementById('rw-break-even');
    const helpEl = document.getElementById('rw-help');
    const copyBtn = document.getElementById('rw-copy');
    const resetBtn = document.getElementById('rw-reset');

    if (!totalDaysEl || !officeDaysEl || !commuteCostEl || !lunchCostEl || !coffeeCostEl || !homeExtraEl || !commuteMinutesEl || !hourValueEl || !officeTotalEl || !homeTotalEl || !timeCostEl || !gapEl || !hoursEl || !breakEvenEl || !helpEl) return;

    const t = {
      currency: '원',
      day: '일',
      hour: '시간',
      noValue: '미반영',
      winOffice: '출근 쪽이 유리',
      winHome: '재택 쪽이 유리',
      similar: '거의 비슷함',
      helpOffice: (gap) => `입력 기준으로는 출근 쪽이 월 ${gap} 더 유리합니다.`,
      helpHome: (gap) => `입력 기준으로는 재택 쪽이 월 ${gap} 더 유리합니다.`,
      helpSimilar: '입력 기준으로는 두 방식의 체감 차이가 크지 않습니다.',
      copy: (office, home, time, gap, hours, be) => `재택 vs 출근 비교 | 출근 총비용 ${office} | 재택 총비용 ${home} | 통근 시간 환산 ${time} | 월 체감 차이 ${gap} | 월 통근시간 ${hours} | 손익분기 출근일 ${be}`,
      copied: '복사됨',
      copyDefault: '결과 복사'
    };

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    const fmtMoney = (v) => `${Math.round(v || 0).toLocaleString(numberLocale)}${t.currency}`;
    const fmtHours = (mins) => `${(mins / 60).toLocaleString(numberLocale, { maximumFractionDigits: 1 })}${t.hour}`;
    const fmtDays = (days) => `${Math.round(days).toLocaleString(numberLocale)}${t.day}`;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const render = () => {
      const totalDays = clamp(Math.floor(Number(totalDaysEl.value || 0)), 1, 31);
      const officeDays = clamp(Math.floor(Number(officeDaysEl.value || 0)), 0, totalDays);
      const homeDays = Math.max(0, totalDays - officeDays);
      const commuteCost = Math.max(0, Number(commuteCostEl.value || 0));
      const lunchCost = Math.max(0, Number(lunchCostEl.value || 0));
      const coffeeCost = Math.max(0, Number(coffeeCostEl.value || 0));
      const homeExtra = Math.max(0, Number(homeExtraEl.value || 0));
      const commuteMinutes = clamp(Number(commuteMinutesEl.value || 0), 0, 360);
      const hourValue = Math.max(0, Number(hourValueEl.value || 0));

      totalDaysEl.value = totalDays;
      officeDaysEl.value = officeDays;

      const officeDaily = commuteCost + lunchCost + coffeeCost;
      const officeTotal = officeDaily * officeDays;
      const homeTotal = homeExtra * homeDays;
      const totalCommuteMinutes = commuteMinutes * officeDays;
      const timeCost = hourValue > 0 ? (totalCommuteMinutes / 60) * hourValue : 0;
      const effectiveOffice = officeTotal + timeCost;
      const gap = effectiveOffice - homeTotal;
      const dailyGap = officeDaily + ((commuteMinutes / 60) * hourValue) + homeExtra;
      const breakEvenDays = dailyGap <= 0 ? 0 : Math.ceil(homeTotal / dailyGap);

      officeTotalEl.textContent = fmtMoney(officeTotal);
      homeTotalEl.textContent = fmtMoney(homeTotal);
      timeCostEl.textContent = hourValue > 0 ? fmtMoney(timeCost) : t.noValue;
      hoursEl.textContent = fmtHours(totalCommuteMinutes);
      breakEvenEl.textContent = fmtDays(Math.min(totalDays, breakEvenDays));

      if (Math.abs(gap) < 1000) {
        gapEl.textContent = `${fmtMoney(Math.abs(gap))} (${t.similar})`;
        helpEl.textContent = t.helpSimilar;
      } else if (gap < 0) {
        gapEl.textContent = `${fmtMoney(Math.abs(gap))} (${t.winOffice})`;
        helpEl.textContent = t.helpOffice(fmtMoney(Math.abs(gap)));
      } else {
        gapEl.textContent = `${fmtMoney(Math.abs(gap))} (${t.winHome})`;
        helpEl.textContent = t.helpHome(fmtMoney(Math.abs(gap)));
      }
    };

    [totalDaysEl, officeDaysEl, commuteCostEl, lunchCostEl, coffeeCostEl, homeExtraEl, commuteMinutesEl, hourValueEl].forEach((el) => el.addEventListener('input', render));

    resetBtn?.addEventListener('click', () => {
      totalDaysEl.value = 20;
      officeDaysEl.value = 8;
      commuteCostEl.value = 4000;
      lunchCostEl.value = 11000;
      coffeeCostEl.value = 3000;
      homeExtraEl.value = 2000;
      commuteMinutesEl.value = 80;
      hourValueEl.value = '';
      render();
    });

    copyBtn?.addEventListener('click', async () => {
      await copyText(t.copy(officeTotalEl.textContent, homeTotalEl.textContent, timeCostEl.textContent, gapEl.textContent, hoursEl.textContent, breakEvenEl.textContent));
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });

    render();
  }


  if (slug === 'message-tone-checker') {
    const contextEl = document.getElementById('mtc-context');
    const inputEl = document.getElementById('mtc-input');
    const runBtn = document.getElementById('mtc-run');
    const sampleBtn = document.getElementById('mtc-sample');
    const copyBtn = document.getElementById('mtc-copy');
    const clearBtn = document.getElementById('mtc-clear');
    const statusEl = document.getElementById('mtc-status');
    const directEl = document.getElementById('mtc-direct');
    const softEl = document.getElementById('mtc-soft');
    const requestEl = document.getElementById('mtc-request');
    const deadlineEl = document.getElementById('mtc-deadline');
    const lengthEl = document.getElementById('mtc-length');
    const summaryEl = document.getElementById('mtc-summary');
    const listEl = document.getElementById('mtc-list');
    const outputEl = document.getElementById('mtc-output');
    if (!contextEl || !inputEl || !runBtn || !sampleBtn || !copyBtn || !clearBtn || !statusEl || !directEl || !softEl || !requestEl || !deadlineEl || !lengthEl || !summaryEl || !listEl || !outputEl) return;

    const mtcText = {
      ko: {
        samples: {
          work: '안녕하세요. 초안 검토 부탁드립니다. 오늘 오후 4시 전까지 가능 여부만 회신 주시면 일정 정리에 도움이 됩니다. 어려우시면 가능한 시간도 함께 알려주세요.',
          external: '안녕하세요. 전달드린 제안서 관련해 검토 부탁드립니다. 가능하시다면 내일 오전까지 확인 의견을 회신 주시면 후속 일정 안내에 큰 도움이 됩니다.',
          quick: '왜 아직 공유 안 됐나요? 빨리 보내주세요. 오늘 안에 꼭 필요합니다.'
        },
        empty: '메시지를 넣으면 직설성, 정중함, 요청/마감 언급, 길이 부담을 함께 점검합니다.',
        emptyList: '아직 점검한 메시지가 없습니다.',
        emptyCopy: '복사할 점검 결과가 없습니다.',
        copied: '복사됨',
        copyDefault: '결과 복사',
        cleared: '입력을 초기화했습니다.',
        balanced: '균형적',
        directStrong: '직설 강함',
        softHeavy: '완곡 과다',
        vagueRequest: '요청 모호',
        missingDeadline: '마감 누락',
        long: '조금 김',
        unclear: '판단 보류',
        noInput: '-',
        requestOk: '명확',
        requestNeed: '보완 필요',
        deadlineOk: '있음',
        deadlineNeed: '없음',
        summaryBalanced: '전반적으로 무난한 톤입니다.',
        summaryDirect: '상대가 압박으로 느낄 수 있는 표현이 보여 완충 표현을 조금 섞는 편이 좋습니다.',
        summarySoft: '정중하지만 사과·완충 표현이 많아 핵심 요청이 흐려질 수 있습니다.',
        summaryRequest: '메시지 목적은 보이지만 상대가 무엇을 해야 하는지 조금 더 분명하게 적는 편이 좋습니다.',
        summaryDeadline: '요청은 있지만 언제까지 필요한지 드러나지 않아 처리 우선순위가 밀릴 수 있습니다.',
        summaryShort: '짧은 문장은 관계와 맥락 영향이 커서 자동 신호만으로 판단하기 어렵습니다.',
        sentenceInfo: (summary, sentences, avg) => `${summary} (문장 ${sentences}개 · 평균 ${avg}자)`,
        detected: (items) => `감지된 표현: ${items}`,
        noteDirect: '압박으로 읽히는 표현이 있는지 다시 보고, 이유나 완충 문장을 한 줄 덧붙여보세요.',
        noteSoft: '`죄송하지만`, `혹시`, `괜찮으시다면` 같은 표현이 겹치면 핵심 요청을 한 문장으로 분리해보세요.',
        noteRequest: '`확인 부탁드립니다`, `회신 부탁드립니다`, `공유 부탁드립니다`처럼 행동 요청을 한 번은 명시해보세요.',
        noteDeadline: '오늘/내일/오후 4시 전처럼 시점을 넣으면 상대가 처리 우선순위를 잡기 쉬워집니다.',
        noteLong: '설명이 길다면 핵심 요청 문장을 앞에 두고 배경 설명은 뒤로 정리해보세요.',
        noteShort: '짧은 메시지는 목적어와 기한이 빠지기 쉽습니다. 무엇을 언제까지 원하는지 한 번 더 확인해보세요.',
        noteOk: '요청과 시점이 비교적 분명합니다. 보내기 전 호칭·첨부 여부만 마지막으로 확인해보세요.',
        heading: '[메시지 톤 점검 결과]',
        context: '상황 기준',
        tone: '톤 요약',
        direct: '직설 표현',
        soft: '완충/사과 표현',
        request: '요청 명확성',
        deadline: '마감 언급',
        length: '글자 수',
        memo: '개선 메모'
      },
      en: {
        samples: {
          work: 'Hi, could you review the draft by 4 PM today? Even a quick yes or no would help me finalize the schedule. If that timing is difficult, please let me know when works.',
          external: 'Hello, could you review the proposal I shared and send any comments by tomorrow morning? Your feedback will help us confirm the next schedule.',
          quick: 'Why has this not been shared yet? Please send it ASAP. I need it today.'
        },
        empty: 'Paste a message to check directness, politeness, request clarity, deadline cues, and length burden together.',
        emptyList: 'No message has been checked yet.',
        emptyCopy: 'There is no check result to copy.',
        copied: 'Copied',
        copyDefault: 'Copy result',
        cleared: 'Cleared the input.',
        balanced: 'Balanced',
        directStrong: 'Too direct',
        softHeavy: 'Over-softened',
        vagueRequest: 'Vague request',
        missingDeadline: 'No timing cue',
        long: 'A bit long',
        unclear: 'Needs context',
        noInput: '-',
        requestOk: 'Clear',
        requestNeed: 'Needs work',
        deadlineOk: 'Present',
        deadlineNeed: 'Missing',
        summaryBalanced: 'The overall tone looks workable.',
        summaryDirect: 'Some phrasing may feel pushy, so adding context or a softer request would help.',
        summarySoft: 'The message is polite, but too much softening can hide the main ask.',
        summaryRequest: 'The purpose is visible, but the exact action could be clearer.',
        summaryDeadline: 'There is a request, but the needed timing is not clear enough for prioritization.',
        summaryShort: 'Very short messages depend heavily on relationship and context, so treat this as a signal check.',
        sentenceInfo: (summary, sentences, avg) => `${summary} (${sentences} sentence(s), ${avg} chars avg.)`,
        detected: (items) => `Detected signals: ${items}`,
        noteDirect: 'Review phrases that may read as pressure, and add a short reason or softer request.',
        noteSoft: 'If apologies or hedges repeat, separate the main ask into one direct sentence.',
        noteRequest: 'State the action once, such as "please review", "please reply", or "please share".',
        noteDeadline: 'Add a clear timing cue such as today, tomorrow, or before 4 PM.',
        noteLong: 'Put the main ask first and move background details after it.',
        noteShort: 'Short messages often miss the object or deadline. Check what you need and by when.',
        noteOk: 'The request and timing look reasonably clear. Check the recipient name and attachments before sending.',
        heading: '[Message Tone Check]',
        context: 'Context',
        tone: 'Tone summary',
        direct: 'Direct signals',
        soft: 'Softening words',
        request: 'Request clarity',
        deadline: 'Timing cue',
        length: 'Characters',
        memo: 'Revision notes'
      },
      ja: {
        samples: {
          work: 'お疲れさまです。下書きの確認をお願いします。本日16時までに可否だけでも返信いただけると、予定調整に助かります。難しければ可能な時間も教えてください。',
          external: 'お世話になっております。共有した提案書について、明日午前中までに確認コメントをいただけますでしょうか。後続日程の調整に役立ちます。',
          quick: 'まだ共有されていないのはなぜですか。ASAPで送ってください。今日中に必要です。'
        },
        empty: 'メッセージを入力すると、強さ、丁寧さ、依頼/期限の明確さ、文量負担をまとめて点検します。',
        emptyList: 'まだ点検したメッセージがありません。',
        emptyCopy: 'コピーできる点検結果がありません。',
        copied: 'コピー済み',
        copyDefault: '結果をコピー',
        cleared: '入力をクリアしました。',
        balanced: 'バランス良好',
        directStrong: '強め',
        softHeavy: '婉曲多め',
        vagueRequest: '依頼が曖昧',
        missingDeadline: '期限なし',
        long: '少し長い',
        unclear: '文脈判断',
        noInput: '-',
        requestOk: '明確',
        requestNeed: '要補足',
        deadlineOk: 'あり',
        deadlineNeed: 'なし',
        summaryBalanced: '全体として無理のないトーンです。',
        summaryDirect: '相手が急かされていると感じる表現があるため、理由や緩衝表現を少し足すとよさそうです。',
        summarySoft: '丁寧ですが、謝罪や緩衝表現が多いと依頼の要点がぼやけることがあります。',
        summaryRequest: '目的は見えますが、相手が何をすればよいかをもう少し明確にするとよさそうです。',
        summaryDeadline: '依頼はありますが、いつまで必要かが見えにくく優先順位をつけにくい可能性があります。',
        summaryShort: '短い文面は関係性や文脈の影響が大きいため、信号チェックとして見てください。',
        sentenceInfo: (summary, sentences, avg) => `${summary} (文 ${sentences} 件・平均 ${avg} 文字)`,
        detected: (items) => `検出した表現: ${items}`,
        noteDirect: '圧力として読まれそうな表現を見直し、理由や柔らかい依頼文を一文足してみてください。',
        noteSoft: '謝罪や緩衝表現が重なる場合は、中心の依頼を一文で分けると伝わりやすくなります。',
        noteRequest: '「確認をお願いします」「返信をお願いします」「共有してください」のように行動を一度明示しましょう。',
        noteDeadline: '今日、明日、16時までなど、処理の目安になる時間を入れると親切です。',
        noteLong: '説明が長い場合は、中心の依頼を先に置き、背景説明を後ろに回しましょう。',
        noteShort: '短文では対象や期限が抜けやすいです。何をいつまでに求めるのか確認してください。',
        noteOk: '依頼と時点は比較的明確です。送信前に宛名や添付の有無だけ確認してください。',
        heading: '[メッセージトーン点検結果]',
        context: '利用場面',
        tone: 'トーン要約',
        direct: '強い表現',
        soft: '緩衝/謝罪表現',
        request: '依頼の明確さ',
        deadline: '期限言及',
        length: '文字数',
        memo: '改善メモ'
      }
    }[pageLang] || {};

    const directPatterns = [
      { label: '빨리', re: /빨리|당장|즉시|왜 아직|왜 안|무조건|지금 바로|꼭 보내/gi },
      { label: 'ASAP', re: /\bASAP\b|right now|immediately|why (?:is|has|was|did)|must\b|urgent/gi },
      { label: '強い依頼', re: /至急|早急|すぐに|なぜまだ|必ず|今すぐ|ASAP/gi }
    ];
    const softPatterns = [
      { label: '완충 표현', re: /죄송|송구|부탁|감사|괜찮으실까요|가능하실까요|혹시|번거로우시겠지만/gi },
      { label: 'softening words', re: /sorry|apologize|please|thank you|would you|could you|if possible|when you have a chance/gi },
      { label: '緩衝表現', re: /すみません|申し訳|恐れ入ります|お願いします|ありがとう|可能でしたら|よろしければ|お手数/gi }
    ];
    const requestPatterns = [
      /부탁|확인|회신|알려|공유|검토|전달|정리|보내/gi,
      /please|could you|would you|review|reply|respond|share|send|confirm|let me know|check/gi,
      /お願い|確認|返信|共有|検討|送って|教えて|ご確認|ご返信/gi
    ];
    const deadlinePatterns = [
      /오늘|내일|모레|이번 주|다음 주|까지|전까지|오전|오후|\d{1,2}시|\d{1,2}:\d{2}|\d+일/gi,
      /\btoday\b|\btomorrow\b|this week|next week|by\b|before\b|until\b|AM\b|PM\b|\d{1,2}:\d{2}/gi,
      /今日|明日|今週|来週|まで|午前|午後|\d{1,2}時|\d{1,2}:\d{2}/gi
    ];

    const getMatches = (text, patternGroups) => {
      const found = [];
      patternGroups.forEach(({ re }) => {
        re.lastIndex = 0;
        for (const match of text.matchAll(re)) {
          if (match[0]) found.push(match[0]);
        }
      });
      return found;
    };
    const countMatches = (text, patterns) => patterns.reduce((sum, pattern) => {
      pattern.lastIndex = 0;
      return sum + Array.from(text.matchAll(pattern)).length;
    }, 0);
    const hasAnyMatch = (text, patterns) => patterns.some((pattern) => {
      pattern.lastIndex = 0;
      return pattern.test(text);
    });
    const uniqueShort = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))].slice(0, 6);
    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const resetList = (message) => {
      listEl.innerHTML = '';
      const p = document.createElement('p');
      p.className = 'tool-result';
      p.textContent = message;
      listEl.appendChild(p);
    };

    const renderNotes = (notes) => {
      listEl.innerHTML = '';
      notes.forEach((note) => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        const p = document.createElement('p');
        p.className = 'tool-result';
        p.textContent = note;
        card.appendChild(p);
        listEl.appendChild(card);
      });
    };

    const render = () => {
      const text = (inputEl.value || '').trim();
      const context = contextEl.value || 'work';
      const sentenceParts = text.split(/[.!?。！？\n]+/u).map((part) => part.trim()).filter(Boolean);
      const sentenceCount = sentenceParts.length || 1;
      const charCount = [...text].length;
      const avgSentence = text ? charCount / sentenceCount : 0;
      const directMatches = uniqueShort(getMatches(text, directPatterns));
      const softMatches = uniqueShort(getMatches(text, softPatterns));
      const directCount = directMatches.length;
      const softCount = softMatches.length;
      const requestCount = countMatches(text, requestPatterns);
      const hasDeadline = hasAnyMatch(text, deadlinePatterns);
      const hasRequest = requestCount > 0;

      if (!text) {
        statusEl.textContent = mtcText.noInput;
        directEl.textContent = '0';
        softEl.textContent = '0';
        requestEl.textContent = mtcText.noInput;
        deadlineEl.textContent = mtcText.noInput;
        lengthEl.textContent = '0';
        summaryEl.textContent = mtcText.empty;
        summaryEl.dataset.state = '';
        resetList(mtcText.emptyList);
        outputEl.value = '';
        copyBtn.disabled = true;
        inputEl.setAttribute('aria-invalid', 'false');
        return;
      }

      inputEl.setAttribute('aria-invalid', 'false');
      copyBtn.disabled = false;
      let status = mtcText.balanced;
      let summary = mtcText.summaryBalanced;
      let state = 'success';
      const notes = [];

      if (directCount >= (context === 'quick' ? 3 : 2)) {
        status = mtcText.directStrong;
        summary = mtcText.summaryDirect;
        state = 'warning';
        notes.push(mtcText.noteDirect);
      }

      if (softCount >= 4 && status === mtcText.balanced) {
        status = mtcText.softHeavy;
        summary = mtcText.summarySoft;
        state = 'warning';
        notes.push(mtcText.noteSoft);
      }

      if (!hasRequest) {
        status = mtcText.vagueRequest;
        summary = mtcText.summaryRequest;
        state = 'warning';
        notes.push(mtcText.noteRequest);
      }

      if (hasRequest && !hasDeadline) {
        if (status === mtcText.balanced) status = mtcText.missingDeadline;
        summary = mtcText.summaryDeadline;
        state = 'warning';
        notes.push(mtcText.noteDeadline);
      }

      if (charCount <= 12 && !hasRequest) {
        if (status === mtcText.balanced) status = mtcText.unclear;
        summary = mtcText.summaryShort;
        state = 'warning';
        notes.push(mtcText.noteShort);
      }

      if (charCount >= (context === 'external' ? 260 : 220) || avgSentence >= 55) {
        if (status === mtcText.balanced) status = mtcText.long;
        state = state === 'success' ? 'warning' : state;
        notes.push(mtcText.noteLong);
      }

      const detected = [...directMatches, ...softMatches];
      if (detected.length) notes.unshift(mtcText.detected(detected.join(', ')));
      if (!notes.length) {
        notes.push(mtcText.noteOk);
      }

      statusEl.textContent = status;
      directEl.textContent = String(directCount);
      softEl.textContent = String(softCount);
      requestEl.textContent = hasRequest ? mtcText.requestOk : mtcText.requestNeed;
      deadlineEl.textContent = hasDeadline ? mtcText.deadlineOk : mtcText.deadlineNeed;
      lengthEl.textContent = formatNum(charCount);
      summaryEl.textContent = mtcText.sentenceInfo(summary, sentenceCount, Math.round(avgSentence));
      summaryEl.dataset.state = state;

      renderNotes(notes);
      outputEl.value = [
        mtcText.heading,
        `- ${mtcText.context}: ${contextEl.options[contextEl.selectedIndex].text}`,
        `- ${mtcText.tone}: ${status}`,
        `- ${mtcText.direct}: ${directCount}`,
        `- ${mtcText.soft}: ${softCount}`,
        `- ${mtcText.request}: ${hasRequest ? mtcText.requestOk : mtcText.requestNeed}`,
        `- ${mtcText.deadline}: ${hasDeadline ? mtcText.deadlineOk : mtcText.deadlineNeed}`,
        `- ${mtcText.length}: ${formatNum(charCount)}`,
        '',
        mtcText.memo,
        ...notes.map((note) => `- ${note}`)
      ].join('\n');
    };

    runBtn.addEventListener('click', render);
    sampleBtn.addEventListener('click', () => {
      inputEl.value = mtcText.samples[contextEl.value || 'work'];
      render();
      inputEl.focus();
    });
    clearBtn.addEventListener('click', () => {
      inputEl.value = '';
      render();
      summaryEl.textContent = mtcText.cleared;
      inputEl.focus();
    });
    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) render();
      if (!outputEl.value.trim()) {
        summaryEl.textContent = mtcText.emptyCopy;
        summaryEl.dataset.state = 'error';
        inputEl.focus();
        return;
      }
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = mtcText.copied;
      setTimeout(() => { copyBtn.textContent = old || mtcText.copyDefault; }, 900);
    });
    [contextEl, inputEl].forEach((el) => {
      el.addEventListener('input', render);
      el.addEventListener('change', render);
    });

    render();
  }

  if (slug === 'priority-decision-matrix-planner') {
    const rows = Array.from({ length: 5 }, (_, idx) => ({
      name: document.getElementById(`pdm-name-${idx + 1}`),
      urgency: document.getElementById(`pdm-urgency-${idx + 1}`),
      impact: document.getElementById(`pdm-impact-${idx + 1}`),
      effort: document.getElementById(`pdm-effort-${idx + 1}`),
      confidence: document.getElementById(`pdm-confidence-${idx + 1}`),
      note: document.getElementById(`pdm-note-${idx + 1}`)
    }));
    const sampleBtn = document.getElementById('pdm-sample');
    const copyBtn = document.getElementById('pdm-copy');
    const countEl = document.getElementById('pdm-count');
    const topEl = document.getElementById('pdm-top');
    const nowEl = document.getElementById('pdm-now');
    const weekEl = document.getElementById('pdm-week');
    const holdEl = document.getElementById('pdm-hold');
    const summaryEl = document.getElementById('pdm-summary');
    const outputEl = document.getElementById('pdm-output');
    if (rows.some((row) => !row.name || !row.urgency || !row.impact || !row.effort || !row.confidence || !row.note) || !sampleBtn || !copyBtn || !countEl || !topEl || !nowEl || !weekEl || !holdEl || !summaryEl || !outputEl) return;

    const sampleData = [
      { name: '결제 오류 재현 및 수정', urgency: 5, impact: 5, effort: 3, confidence: 4, note: '오늘 안에 CS 문의 대응 필요' },
      { name: '다음 주 제안서 마무리', urgency: 4, impact: 4, effort: 4, confidence: 4, note: '자료는 거의 모였음' },
      { name: '뉴스레터 초안 정리', urgency: 3, impact: 3, effort: 2, confidence: 5, note: '1시간 안에 끝낼 수 있음' },
      { name: '새 분석 대시보드 탐색', urgency: 2, impact: 4, effort: 5, confidence: 2, note: '요구사항 추가 확인 필요' },
      { name: '회의록 정리 후 공유', urgency: 4, impact: 3, effort: 1, confidence: 5, note: '빠르게 처리 가능' }
    ];

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const getBucket = (score, urgency, impact) => {
      if (score >= 4.1 || (urgency >= 4 && impact >= 4)) return '지금 실행';
      if (score >= 3 || impact >= 4) return '이번 주 진행';
      return '보류 검토';
    };

    const build = () => {
      const items = rows.map((row, idx) => {
        const name = (row.name.value || '').trim();
        if (!name) return null;
        const urgency = Number(row.urgency.value || 3);
        const impact = Number(row.impact.value || 3);
        const effort = Number(row.effort.value || 3);
        const confidence = Number(row.confidence.value || 3);
        const note = (row.note.value || '').trim();
        const score = (urgency * 0.35) + (impact * 0.4) + ((6 - effort) * 0.15) + (confidence * 0.1);
        const bucket = getBucket(score, urgency, impact);
        const reason = [];
        if (urgency >= 4) reason.push('마감 압박 높음');
        if (impact >= 4) reason.push('결과 영향 큼');
        if (effort <= 2) reason.push('비교적 빠르게 처리 가능');
        if (confidence <= 2) reason.push('진행 전 확인 필요');
        if (!reason.length) reason.push('전체 균형은 보통');
        return { idx, name, urgency, impact, effort, confidence, note, score, bucket, reason: reason.join(', ') };
      }).filter(Boolean).sort((a, b) => b.score - a.score || b.impact - a.impact || b.urgency - a.urgency);

      countEl.textContent = String(items.length);
      topEl.textContent = items[0]?.name || '-';
      nowEl.textContent = String(items.filter((item) => item.bucket === '지금 실행').length);
      weekEl.textContent = String(items.filter((item) => item.bucket === '이번 주 진행').length);
      holdEl.textContent = String(items.filter((item) => item.bucket === '보류 검토').length);

      if (!items.length) {
        summaryEl.textContent = '항목을 1개 이상 입력하면 우선순위 추천 결과가 여기에 표시됩니다.';
        outputEl.value = '';
        return;
      }

      summaryEl.textContent = `${items[0].name}을(를) 가장 먼저 보는 흐름이 유리해 보여요. 총 ${items.length}개 항목을 우선순위 순으로 정리했습니다.`;
      outputEl.value = [
        '[우선순위 결정 매트릭스 결과]',
        ...items.map((item, index) => `${index + 1}. ${item.name} | ${item.bucket} | 점수 ${item.score.toFixed(2)}\n- 긴급도 ${item.urgency} / 영향도 ${item.impact} / 노력도 ${item.effort} / 확신도 ${item.confidence}\n- 판단 메모: ${item.reason}${item.note ? `\n- 추가 메모: ${item.note}` : ''}`)
      ].join('\n\n');
    };

    sampleBtn.addEventListener('click', () => {
      rows.forEach((row, idx) => {
        const sample = sampleData[idx];
        row.name.value = sample.name;
        row.urgency.value = String(sample.urgency);
        row.impact.value = String(sample.impact);
        row.effort.value = String(sample.effort);
        row.confidence.value = String(sample.confidence);
        row.note.value = sample.note;
      });
      build();
    });

    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) build();
      if (!outputEl.value.trim()) return;
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    rows.forEach((row) => {
      Object.values(row).forEach((el) => {
        el.addEventListener('input', build);
        el.addEventListener('change', build);
      });
    });

    build();
  }


  if (slug === 'customer-support-message-generator') {
    const itemEl = document.getElementById('csmg-item');
    const typeEl = document.getElementById('csmg-type');
    const orderEl = document.getElementById('csmg-order');
    const toneEl = document.getElementById('csmg-tone');
    const problemEl = document.getElementById('csmg-problem');
    const requestEl = document.getElementById('csmg-request');
    const proofEl = document.getElementById('csmg-proof');
    const deadlineEl = document.getElementById('csmg-deadline');
    const sampleBtn = document.getElementById('csmg-sample');
    const copyBtn = document.getElementById('csmg-copy');
    const linesEl = document.getElementById('csmg-lines');
    const charsEl = document.getElementById('csmg-chars');
    const infoEl = document.getElementById('csmg-info');
    const summaryEl = document.getElementById('csmg-summary');
    const outputEl = document.getElementById('csmg-output');

    if (!itemEl || !outputEl || !summaryEl) return;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const typeLabels = {
      refund: '환불 요청',
      exchange: '교환 요청',
      delivery: '배송 지연·누락 문의',
      error: '오류 신고',
      as: 'AS·수리 문의',
      billing: '결제·청구 문의'
    };

    const toneOpeners = {
      polite: '안녕하세요. 아래 건에 대해 확인 부탁드립니다.',
      firm: '안녕하세요. 아래 문제에 대해 빠른 확인과 명확한 안내를 부탁드립니다.',
      brief: '안녕하세요. 문의드립니다.'
    };

    const normalize = (value) => (value || '').trim().replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n');

    const build = () => {
      const item = normalize(itemEl.value) || '해당 제품/서비스';
      const type = typeEl.value || 'refund';
      const order = normalize(orderEl.value);
      const problem = normalize(problemEl.value) || '문제 상황을 입력해 주세요.';
      const request = normalize(requestEl.value) || '가능한 처리 방법을 안내 부탁드립니다.';
      const tone = toneEl.value || 'polite';
      const lines = [
        toneOpeners[tone] || toneOpeners.polite,
        '',
        `- 문의 유형: ${typeLabels[type] || '문의'}`,
        `- 제품/서비스: ${item}`
      ];

      if (order) lines.push(`- 주문/구매 정보: ${order}`);
      lines.push('', '[문제 상황]', problem, '', '[요청 사항]', request);

      if (proofEl.checked) {
        lines.push('', '필요하시면 사진, 스크린샷, 영수증 등 확인 가능한 자료를 첨부하겠습니다.');
      }
      if (deadlineEl.checked) {
        lines.push('가능하다면 영업일 기준 2~3일 이내에 답변 부탁드립니다.');
      }

      if (tone === 'firm') {
        lines.push('', '동일 문제가 반복되지 않도록 원인과 처리 가능 범위를 함께 안내해 주시면 감사하겠습니다.');
      }
      lines.push('', '확인 후 답변 부탁드립니다. 감사합니다.');

      const text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
      const sentenceCount = (text.match(/[.!?。]|다\.|요\.|니다\./g) || []).length || text.split('\n').filter(Boolean).length;
      const infoCount = [itemEl.value, type, order, problemEl.value, requestEl.value, proofEl.checked, deadlineEl.checked].filter(Boolean).length;
      outputEl.value = text;
      linesEl.textContent = formatNum(sentenceCount);
      charsEl.textContent = formatNum(text.length);
      infoEl.textContent = formatNum(infoCount);
      summaryEl.textContent = `${typeLabels[type] || '문의'} 문구를 ${text.length.toLocaleString(numberLocale)}자 분량으로 만들었습니다. 보내기 전 개인정보와 주문 정보를 한 번 확인하세요.`;
    };

    sampleBtn.addEventListener('click', () => {
      itemEl.value = '무선 이어폰';
      typeEl.value = 'exchange';
      orderEl.value = '주문번호 20260509-1234, 5월 8일 수령';
      toneEl.value = 'polite';
      problemEl.value = '상품을 개봉해 사용해 보니 오른쪽 이어버드에서 소리가 나지 않습니다. 충전과 재연결을 여러 번 시도했지만 같은 증상이 반복됩니다.';
      requestEl.value = '초기 불량 여부를 확인한 뒤 교환 또는 환불 절차를 안내받고 싶습니다.';
      proofEl.checked = true;
      deadlineEl.checked = true;
      build();
    });

    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) build();
      if (!outputEl.value.trim()) return;
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    [itemEl, typeEl, orderEl, toneEl, problemEl, requestEl, proofEl, deadlineEl].forEach((el) => {
      el.addEventListener('input', build);
      el.addEventListener('change', build);
    });

    build();
  }



  if (slug === 'cafe-work-seat-simulator') {
    const purposeEl = document.getElementById('cwss-purpose');
    const durationEl = document.getElementById('cwss-duration');
    const chargeEl = document.getElementById('cwss-charge');
    const quietEl = document.getElementById('cwss-quiet');
    const rows = Array.from({ length: 4 }, (_, idx) => {
      const n = idx + 1;
      return {
        name: document.getElementById(`cwss-name-${n}`),
        power: document.getElementById(`cwss-power-${n}`),
        noise: document.getElementById(`cwss-noise-${n}`),
        seat: document.getElementById(`cwss-seat-${n}`),
        light: document.getElementById(`cwss-light-${n}`),
        traffic: document.getElementById(`cwss-traffic-${n}`)
      };
    });
    const sampleBtn = document.getElementById('cwss-sample');
    const copyBtn = document.getElementById('cwss-copy');
    const countEl = document.getElementById('cwss-count');
    const topEl = document.getElementById('cwss-top');
    const powerScoreEl = document.getElementById('cwss-power-score');
    const focusScoreEl = document.getElementById('cwss-focus-score');
    const summaryEl = document.getElementById('cwss-summary');
    const outputEl = document.getElementById('cwss-output');

    if (!purposeEl || !rows[0].name || !summaryEl || !outputEl) return;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const labels = {
      power: { table: '자리에서 바로 사용', near: '가까이에 있음', far: '멀거나 애매함', none: '없음' },
      noise: { quiet: '조용함', normal: '보통', busy: '소음 많음' },
      seat: { table: '일반 테이블', bar: '바/높은 테이블', sofa: '소파·낮은 테이블', window: '창가 좌석' },
      light: { soft: '적당함', bright: '밝음', glare: '눈부심 있음', dark: '어두움' },
      traffic: { low: '동선 적음', mid: '동선 보통', high: '동선 많음' }
    };

    const scoreItem = (item, purpose, duration, needCharge, preferQuiet) => {
      let score = 55;
      let powerScore = 0;
      let focusScore = 0;

      if (item.power === 'table') { score += 20; powerScore = 100; }
      if (item.power === 'near') { score += 12; powerScore = 75; }
      if (item.power === 'far') { score -= needCharge ? 14 : 3; powerScore = 35; }
      if (item.power === 'none') { score -= needCharge ? 28 : 8; powerScore = 5; }
      if (duration === 'long' && (item.power === 'far' || item.power === 'none')) score -= 12;

      if (item.noise === 'quiet') { score += preferQuiet ? 18 : 10; focusScore += 45; }
      if (item.noise === 'normal') { score += 6; focusScore += 25; }
      if (item.noise === 'busy') { score -= preferQuiet ? 18 : 8; focusScore += 5; }

      if (item.seat === 'table') score += 12;
      if (item.seat === 'window') score += purpose === 'reading' ? 14 : 6;
      if (item.seat === 'bar') score += duration === 'short' ? 8 : -6;
      if (item.seat === 'sofa') score += purpose === 'reading' ? 8 : -8;

      if (item.light === 'soft') { score += 10; focusScore += 30; }
      if (item.light === 'bright') { score += purpose === 'study' ? 8 : 3; focusScore += 20; }
      if (item.light === 'glare') score -= 12;
      if (item.light === 'dark') score -= purpose === 'reading' || purpose === 'study' ? 14 : 7;

      if (item.traffic === 'low') { score += 10; focusScore += 25; }
      if (item.traffic === 'mid') score += 2;
      if (item.traffic === 'high') score -= purpose === 'call' ? 6 : 16;
      if (purpose === 'call' && item.noise === 'quiet' && item.traffic === 'low') score -= 4;
      if (duration === 'long' && item.seat === 'bar') score -= 8;

      return {
        score: Math.max(0, Math.min(100, Math.round(score))),
        powerScore: Math.max(0, Math.min(100, Math.round(powerScore))),
        focusScore: Math.max(0, Math.min(100, Math.round(focusScore)))
      };
    };

    const reasonFor = (item, purpose, duration, needCharge, preferQuiet) => {
      const reasons = [];
      if (needCharge && (item.power === 'table' || item.power === 'near')) reasons.push('충전 접근성이 좋음');
      if (needCharge && (item.power === 'far' || item.power === 'none')) reasons.push('충전이 필요하면 불리함');
      if (preferQuiet && item.noise === 'quiet') reasons.push('집중하기 조용함');
      if (item.noise === 'busy') reasons.push('주변 소음이 많음');
      if (item.seat === 'table') reasons.push('노트북을 놓기 안정적임');
      if (duration === 'long' && item.seat === 'bar') reasons.push('오래 앉기에는 피로할 수 있음');
      if (item.light === 'glare') reasons.push('눈부심을 확인해야 함');
      if (item.traffic === 'high') reasons.push('사람 동선이 잦음');
      if (purpose === 'reading' && item.seat === 'window') reasons.push('독서·메모에 분위기가 좋음');
      if (!reasons.length) reasons.push('전체 조건이 무난함');
      return reasons.join(', ');
    };

    const build = () => {
      const purpose = purposeEl.value || 'work';
      const duration = durationEl.value || 'medium';
      const needCharge = !!chargeEl.checked;
      const preferQuiet = !!quietEl.checked;
      const items = rows.map((row, idx) => {
        const name = (row.name.value || '').trim();
        if (!name) return null;
        const item = {
          index: idx + 1,
          name,
          power: row.power.value,
          noise: row.noise.value,
          seat: row.seat.value,
          light: row.light.value,
          traffic: row.traffic.value
        };
        return { ...item, ...scoreItem(item, purpose, duration, needCharge, preferQuiet) };
      }).filter(Boolean).sort((a, b) => b.score - a.score);

      countEl.textContent = String(items.length);
      if (!items.length) {
        topEl.textContent = '-';
        powerScoreEl.textContent = '0';
        focusScoreEl.textContent = '0';
        summaryEl.textContent = '후보 자리를 입력하면 추천 순위가 표시됩니다.';
        outputEl.value = '';
        return;
      }

      const top = items[0];
      topEl.textContent = top.name.length > 12 ? `${top.name.slice(0, 12)}…` : top.name;
      powerScoreEl.textContent = String(top.powerScore);
      focusScoreEl.textContent = String(top.focusScore);
      summaryEl.textContent = `1순위는 ${top.name}입니다. 점수 ${top.score}점 — ${reasonFor(top, purpose, duration, needCharge, preferQuiet)}`;

      outputEl.value = ['카페 작업 자리 비교 결과', ...items.map((item, idx) => {
        return `${idx + 1}. ${item.name} - ${item.score}점\n   조건: 콘센트 ${labels.power[item.power]}, 소음 ${labels.noise[item.noise]}, 좌석 ${labels.seat[item.seat]}, 조명 ${labels.light[item.light]}, ${labels.traffic[item.traffic]}\n   이유: ${reasonFor(item, purpose, duration, needCharge, preferQuiet)}`;
      })].join('\n\n');
    };

    sampleBtn?.addEventListener('click', () => {
      const samples = [
        ['벽쪽 콘센트 2인석', 'table', 'normal', 'table', 'soft', 'mid'],
        ['창가 바 테이블', 'near', 'quiet', 'bar', 'bright', 'low'],
        ['중앙 소파 자리', 'none', 'busy', 'sofa', 'glare', 'high'],
        ['구석 작은 테이블', 'far', 'quiet', 'table', 'dark', 'low']
      ];
      samples.forEach((s, idx) => {
        const row = rows[idx];
        row.name.value = s[0]; row.power.value = s[1]; row.noise.value = s[2]; row.seat.value = s[3]; row.light.value = s[4]; row.traffic.value = s[5];
      });
      build();
    });

    copyBtn?.addEventListener('click', async () => {
      if (!outputEl.value.trim()) build();
      if (!outputEl.value.trim()) return;
      await copyText(outputEl.value);
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    [purposeEl, durationEl, chargeEl, quietEl, ...rows.flatMap(row => Object.values(row))].forEach((el) => {
      el?.addEventListener('input', build);
      el?.addEventListener('change', build);
    });

    build();
  }


  if (slug === 'movie-seat-choice-simulator') {
    const preferenceEl = document.getElementById('mscs-preference');
    const groupEl = document.getElementById('mscs-group');
    const rows = Array.from({ length: 4 }, (_, idx) => {
      const n = idx + 1;
      return {
        name: document.getElementById(`mscs-name-${n}`),
        distance: document.getElementById(`mscs-distance-${n}`),
        center: document.getElementById(`mscs-center-${n}`),
        aisle: document.getElementById(`mscs-aisle-${n}`),
        note: document.getElementById(`mscs-note-${n}`)
      };
    });
    const sampleBtn = document.getElementById('mscs-sample');
    const copyBtn = document.getElementById('mscs-copy');
    const countEl = document.getElementById('mscs-count');
    const topEl = document.getElementById('mscs-top');
    const immersionEl = document.getElementById('mscs-immersion');
    const comfortEl = document.getElementById('mscs-comfort');
    const summaryEl = document.getElementById('mscs-summary');
    const outputEl = document.getElementById('mscs-output');

    if (!preferenceEl || !rows[0].name || !summaryEl || !outputEl) return;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const distanceLabel = { front: '앞쪽', mid: '중간', back: '뒤쪽', far: '맨 뒤쪽' };
    const centerLabel = { center: '거의 중앙', near: '중앙에서 조금 벗어남', side: '사이드' };
    const aisleLabel = { aisle: '통로 바로 옆', near: '통로와 가까움', middle: '줄 가운데' };

    const classify = (item) => {
      if (item.center === 'center' && (item.distance === 'front' || item.distance === 'mid')) return '몰입형';
      if ((item.distance === 'mid' || item.distance === 'back') && item.center !== 'side') return '편안한 관람형';
      if (item.aisle === 'aisle') return '출입 편의형';
      return '무난한 후보';
    };

    const scoreItem = (item, preference, group) => {
      let score = 60;
      if (item.distance === 'mid') score += 18;
      if (item.distance === 'back') score += 12;
      if (item.distance === 'front') score += preference === 'immersion' ? 12 : -8;
      if (item.distance === 'far') score += preference === 'comfort' ? 6 : -6;

      if (item.center === 'center') score += 20;
      if (item.center === 'near') score += 8;
      if (item.center === 'side') score -= group === 'group' ? 18 : 10;

      if (item.aisle === 'aisle') score += preference === 'exit' ? 18 : 8;
      if (item.aisle === 'near') score += 6;
      if (item.aisle === 'middle') score += preference === 'immersion' ? 6 : -4;

      if (preference === 'comfort' && item.distance === 'front') score -= 14;
      if (preference === 'immersion' && item.center === 'center') score += 8;
      if (group === 'group' && item.aisle === 'middle') score -= 8;
      return Math.max(0, Math.min(100, score));
    };

    const reasonFor = (item, preference, group) => {
      const reasons = [];
      if (item.center === 'center') reasons.push('화면 중심에 가까움');
      if (item.center === 'side') reasons.push('사이드라 시야 균형은 약함');
      if (item.distance === 'mid') reasons.push('목 편안함과 몰입감 균형이 좋음');
      if (item.distance === 'front') reasons.push(preference === 'immersion' ? '앞쪽 몰입감이 강함' : '앞쪽이라 목 피로를 확인해야 함');
      if (item.aisle === 'aisle') reasons.push('출입이 편함');
      if (group === 'group' && item.aisle === 'middle') reasons.push('여러 명이면 이동이 불편할 수 있음');
      if (!reasons.length) reasons.push('전체 조건이 무난함');
      return reasons.join(', ');
    };

    const build = () => {
      const preference = preferenceEl.value || 'balanced';
      const group = groupEl.value || 'pair';
      const items = rows.map((row, idx) => {
        const name = (row.name.value || '').trim();
        if (!name) return null;
        const item = { idx, name, distance: row.distance.value, center: row.center.value, aisle: row.aisle.value, note: (row.note.value || '').trim() };
        item.score = scoreItem(item, preference, group);
        item.kind = classify(item);
        item.reason = reasonFor(item, preference, group);
        return item;
      }).filter(Boolean).sort((a, b) => b.score - a.score || a.idx - b.idx);

      countEl.textContent = String(items.length);
      topEl.textContent = items[0]?.name || '-';
      immersionEl.textContent = String(items.filter((item) => item.kind === '몰입형').length);
      comfortEl.textContent = String(items.filter((item) => item.kind === '편안한 관람형').length);

      if (!items.length) {
        summaryEl.textContent = '좌석 후보를 1개 이상 입력하면 추천 순서와 이유를 정리합니다.';
        outputEl.value = '';
        return;
      }

      summaryEl.textContent = `${items[0].name}을(를) 1순위로 추천합니다. 총 ${items.length}개 좌석 후보를 비교했어요.`;
      outputEl.value = [
        '[영화관 좌석 선택 시뮬레이션 결과]',
        `기준: ${preferenceEl.options[preferenceEl.selectedIndex].text} / 인원: ${groupEl.options[groupEl.selectedIndex].text}`,
        ...items.map((item, index) => `${index + 1}. ${item.name} | ${item.kind} | 점수 ${Math.round(item.score)}
- 조건: ${distanceLabel[item.distance]} / ${centerLabel[item.center]} / ${aisleLabel[item.aisle]}
- 이유: ${item.reason}${item.note ? `
- 메모: ${item.note}` : ''}`)
      ].join('\n\n');
    };

    sampleBtn?.addEventListener('click', () => {
      const samples = [
        ['G열 8번', 'mid', 'center', 'middle', '남은 중앙 좌석'],
        ['H열 3번 통로', 'mid', 'near', 'aisle', '출입 편함'],
        ['D열 중앙', 'front', 'center', 'middle', '몰입감 좋음'],
        ['J열 사이드', 'back', 'side', 'near', '목은 편할 듯']
      ];
      rows.forEach((row, idx) => {
        const sample = samples[idx];
        row.name.value = sample[0];
        row.distance.value = sample[1];
        row.center.value = sample[2];
        row.aisle.value = sample[3];
        row.note.value = sample[4];
      });
      preferenceEl.value = 'balanced';
      groupEl.value = 'pair';
      build();
    });

    copyBtn?.addEventListener('click', async () => {
      if (!outputEl.value.trim()) build();
      if (!outputEl.value.trim()) return;
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    [preferenceEl, groupEl, ...rows.flatMap((row) => Object.values(row))].forEach((el) => {
      el?.addEventListener('input', build);
      el?.addEventListener('change', build);
    });

    build();
  }

  if (slug === 'ingredient-expiry-priority-checker') {
    const rows = Array.from({ length: 5 }, (_, idx) => {
      const n = idx + 1;
      return {
        name: document.getElementById(`iepc-name-${n}`),
        days: document.getElementById(`iepc-days-${n}`),
        storage: document.getElementById(`iepc-storage-${n}`),
        amount: document.getElementById(`iepc-amount-${n}`),
        plan: document.getElementById(`iepc-plan-${n}`),
        note: document.getElementById(`iepc-note-${n}`)
      };
    });
    const sampleBtn = document.getElementById('iepc-sample');
    const copyBtn = document.getElementById('iepc-copy');
    const countEl = document.getElementById('iepc-count');
    const urgentEl = document.getElementById('iepc-urgent');
    const weekEl = document.getElementById('iepc-week');
    const topEl = document.getElementById('iepc-top');
    const summaryEl = document.getElementById('iepc-summary');
    const outputEl = document.getElementById('iepc-output');

    if (!rows[0].name || !summaryEl || !outputEl) return;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
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

    const storageLabel = { fridge: '냉장', frozen: '냉동', room: '실온', opened: '개봉 후 냉장' };
    const amountLabel = { small: '조금', medium: '보통', large: '많이' };
    const planLabel = { none: '계획 없음', today: '오늘 사용 예정', week: '이번 주 사용 예정' };

    const getBucket = (score, days) => {
      if (days < 0 || score >= 80) return '오늘 확인';
      if (score >= 55) return '1~2일 안에 사용';
      if (score >= 35) return '이번 주 사용';
      return '여유 있음';
    };

    const tipFor = (item) => {
      if (item.days < 0) return '소비기한이 지났다면 냄새·색·곰팡이·포장 팽창을 확인하고, 이상하면 섭취하지 마세요.';
      if (item.storage === 'opened') return '개봉 후 재료는 밀폐하고, 물기 많은 채소·두부·유제품은 상태 확인을 먼저 하세요.';
      if (item.storage === 'frozen') return '냉동 상태라 급하지는 않지만, 양이 많다면 소분하거나 이번 주 메뉴에 배치하세요.';
      if (item.amount === 'large' && item.plan === 'none') return '양이 많은데 계획이 없으니 볶음·국·샐러드처럼 한 번에 쓰는 메뉴를 먼저 잡아보세요.';
      return '오늘 조리 계획에 넣거나 눈에 보이는 칸으로 옮겨 잊히지 않게 하세요.';
    };

    const build = () => {
      const items = rows.map((row, idx) => {
        const name = (row.name.value || '').trim();
        if (!name) return null;
        const rawDays = row.days.value === '' ? 7 : Number(row.days.value || 0);
        const days = Number.isFinite(rawDays) ? rawDays : 7;
        let score = 0;
        if (days < 0) score += 80;
        else if (days === 0) score += 70;
        else if (days <= 2) score += 55;
        else if (days <= 5) score += 35;
        else if (days <= 10) score += 18;
        else score += 6;

        if (row.storage.value === 'opened') score += 18;
        if (row.storage.value === 'room') score += 12;
        if (row.storage.value === 'frozen') score -= 18;
        if (row.amount.value === 'large') score += 10;
        if (row.amount.value === 'small') score -= 4;
        if (row.plan.value === 'today') score -= 18;
        if (row.plan.value === 'week') score -= 8;
        if (row.plan.value === 'none') score += 8;
        score = Math.max(0, Math.min(100, score));
        const bucket = getBucket(score, days);
        const note = (row.note.value || '').trim();
        return { idx, name, days, storage: row.storage.value, amount: row.amount.value, plan: row.plan.value, note, score, bucket };
      }).filter(Boolean).sort((a, b) => b.score - a.score || a.days - b.days);

      countEl.textContent = String(items.length);
      urgentEl.textContent = String(items.filter((item) => item.bucket === '오늘 확인').length);
      weekEl.textContent = String(items.filter((item) => item.bucket === '1~2일 안에 사용' || item.bucket === '이번 주 사용').length);
      topEl.textContent = items[0]?.name || '-';

      if (!items.length) {
        summaryEl.textContent = '재료를 1개 이상 입력하면 먼저 확인할 순서와 보관 팁을 정리합니다.';
        outputEl.value = '';
        return;
      }

      const top = items[0];
      summaryEl.textContent = `${top.name}을(를) 먼저 확인하는 것이 좋아요. 총 ${items.length}개 재료를 소비기한 우선순위로 정리했습니다.`;
      outputEl.value = [
        '[식재료 소비기한 우선순위 점검 결과]',
        ...items.map((item, index) => `${index + 1}. ${item.name} | ${item.bucket} | 점수 ${Math.round(item.score)}
- 남은 소비기한: ${item.days}일 / 보관: ${storageLabel[item.storage]} / 양: ${amountLabel[item.amount]} / 계획: ${planLabel[item.plan]}
- 팁: ${tipFor(item)}${item.note ? `
- 메모: ${item.note}` : ''}`)
      ].join('\n\n');
    };

    sampleBtn?.addEventListener('click', () => {
      const samples = [
        ['두부', '0', 'opened', 'medium', 'none', '개봉함'],
        ['상추', '2', 'fridge', 'large', 'none', '숨이 조금 죽음'],
        ['우유', '3', 'opened', 'small', 'today', '아침에 쓸 예정'],
        ['닭가슴살', '12', 'frozen', 'large', 'week', '소분 필요'],
        ['양파', '10', 'room', 'medium', 'none', '망에 보관']
      ];
      rows.forEach((row, idx) => {
        const sample = samples[idx];
        row.name.value = sample[0];
        row.days.value = sample[1];
        row.storage.value = sample[2];
        row.amount.value = sample[3];
        row.plan.value = sample[4];
        row.note.value = sample[5];
      });
      build();
    });

    copyBtn?.addEventListener('click', async () => {
      if (!outputEl.value.trim()) build();
      if (!outputEl.value.trim()) return;
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    rows.forEach((row) => {
      Object.values(row).forEach((el) => {
        el?.addEventListener('input', build);
        el?.addEventListener('change', build);
      });
    });

    build();
  }

  if (slug === 'secondhand-scam-signal-checker') {
    const item = document.getElementById('sssc-item');
    const priceGap = document.getElementById('sssc-price-gap');
    const payment = document.getElementById('sssc-payment');
    const pressure = document.getElementById('sssc-pressure');
    const profile = document.getElementById('sssc-profile');
    const meet = document.getElementById('sssc-meet');
    const outside = document.getElementById('sssc-outside');
    const refuseSafe = document.getElementById('sssc-refuse-safe');
    const stockPhoto = document.getElementById('sssc-stock-photo');
    const excuse = document.getElementById('sssc-excuse');
    const message = document.getElementById('sssc-message');
    const sampleBtn = document.getElementById('sssc-sample');
    const copyBtn = document.getElementById('sssc-copy');
    const scoreEl = document.getElementById('sssc-score');
    const levelEl = document.getElementById('sssc-level');
    const signalsEl = document.getElementById('sssc-signals');
    const actionEl = document.getElementById('sssc-action');
    const summaryEl = document.getElementById('sssc-summary');
    const listEl = document.getElementById('sssc-list');
    const outputEl = document.getElementById('sssc-output');

    if (!item || !priceGap || !payment || !pressure || !profile || !meet || !outside || !refuseSafe || !stockPhoto || !excuse || !message || !scoreEl || !levelEl || !signalsEl || !actionEl || !summaryEl || !listEl || !outputEl) return;

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

    const build = () => {
      let score = 0;
      const signals = [];
      const actions = [];
      const text = (message.value || '').toLowerCase();

      const add = (points, label, action) => {
        score += points;
        signals.push(label);
        if (action) actions.push(action);
      };

      if (item.value === 'ticket') add(12, '티켓·예약권·디지털 코드는 회수/취소 위험이 높아 확인이 더 어렵습니다.', '플랫폼 보호가 없는 거래라면 보수적으로 보세요.');
      if (item.value === 'digital') add(8, '전자기기·고가 IT 기기는 사기 타깃이 되기 쉬운 품목입니다.', '직거래 테스트 또는 안전결제 우선으로 조건을 좁히세요.');
      if (item.value === 'fashion') add(6, '명품·한정판은 가품/사진 도용 위험이 함께 붙습니다.', '구매 영수증·시리얼·실사 각도 추가 확인이 좋습니다.');

      if (priceGap.value === 'low') add(12, '시세보다 꽤 낮은 가격은 급매처럼 보여도 미끼일 수 있습니다.', '같은 모델 최근 거래가를 다시 비교해 보세요.');
      if (priceGap.value === 'very-low') add(24, '시세보다 지나치게 싼 가격은 대표적인 경고 신호입니다.', '입금 전 거래를 멈추고 진위부터 다시 확인하세요.');

      if (payment.value === 'mixed') add(16, '선입금 일부 요구는 책임 소재가 흐려질 수 있습니다.', '안전결제 또는 대면 확인 후 결제로 전환을 제안하세요.');
      if (payment.value === 'prepay') add(28, '전액 선입금만 요구하면 사기 위험이 크게 올라갑니다.', '거절하고 보호 가능한 결제 방식만 허용하세요.');

      if (pressure.value === 'some') add(10, '빠른 결정을 재촉하는 말투는 판단을 흐리게 만들 수 있습니다.', '급해 보여도 추가 확인 전에는 결제하지 마세요.');
      if (pressure.value === 'high') add(18, '강한 압박 판매는 사기/분쟁 상황에서 매우 흔한 패턴입니다.', '시간을 끌어도 거래가 유지되는지부터 보세요.');

      if (profile.value === 'unclear') add(8, '계정 이력과 활동 정보가 부족합니다.', '후기·가입 시점·이전 판매 흔적을 더 확인하세요.');
      if (profile.value === 'new') add(18, '새 계정 또는 정보가 거의 없는 계정은 경계가 필요합니다.', '대면 거래나 보호 결제 외 방식은 피하는 편이 안전합니다.');

      if (meet.value === 'limited') add(8, '실물 확인이 제한되면 하자·사진 도용 여부를 놓치기 쉽습니다.', '테스트 영상, 오늘 날짜 메모와 함께 찍은 실사 등을 추가 요청하세요.');
      if (meet.value === 'no') add(20, '실물 확인을 계속 회피하면 신뢰도가 크게 떨어집니다.', '확인 거부가 계속되면 거래를 접는 쪽이 낫습니다.');

      if (outside.checked) add(14, '플랫폼 밖 메신저로 유도하면 신고·분쟁 기록이 약해집니다.', '가능하면 플랫폼 채팅 안에서만 대화 기록을 남기세요.');
      if (refuseSafe.checked) add(16, '안전결제/직거래 제안을 거부하면 보호 장치를 피하려는 신호일 수 있습니다.', '보호 장치를 거부하면 거래 중단을 우선 검토하세요.');
      if (stockPhoto.checked) add(10, '사진이 적거나 퍼온 느낌이면 실물 보유 여부부터 의심해야 합니다.', '배경 포함 실사, 특정 각도, 시리얼 일부 가린 사진을 요청해 보세요.');
      if (excuse.checked) add(12, '군인/해외/대리발송 같은 반복 사유는 확인 회피 패턴으로 자주 쓰입니다.', '확인 불가 사유가 길어질수록 거래 강행보다 중단이 안전합니다.');

      const keywordRules = [
        { re: /안전결제.*안|안전결제 불가|안전결제는 안/, points: 18, label: '메시지에서 안전결제를 직접 거부하는 표현이 보입니다.', action: '안전결제 거부 사유보다 보호 가능 여부를 우선 보세요.' },
        { re: /오늘 안|지금 입금|바로 입금|지금 보내/, points: 10, label: '즉시 입금을 압박하는 표현이 보입니다.', action: '압박 문구가 있어도 결제 전 확인 항목을 줄이지 마세요.' },
        { re: /군부대|해외|출장 중|대리 발송/, points: 10, label: '직접 확인을 피하는 단서가 메시지에 있습니다.', action: '실물 확인 불가 거래는 보수적으로 판단하세요.' },
        { re: /계좌만|현금만|문자 주세요|오픈채팅/, points: 10, label: '기록이 약한 결제·연락 수단을 선호하는 표현이 보입니다.', action: '플랫폼 내부 기록과 보호 결제를 유지하세요.' }
      ];

      keywordRules.forEach((rule) => {
        if (rule.re.test(text)) add(rule.points, rule.label, rule.action);
      });

      const uniqueActions = [...new Set(actions)];
      let level = '낮음';
      let action = '기본 확인 유지';
      if (score >= 70) {
        level = '매우 높음';
        action = '거래 중단 권장';
      } else if (score >= 45) {
        level = '높음';
        action = '결제 보류 후 추가 확인';
      } else if (score >= 25) {
        level = '주의';
        action = '보호 장치 있는 방식만 진행';
      }

      scoreEl.textContent = String(score);
      levelEl.textContent = level;
      signalsEl.textContent = String(signals.length);
      actionEl.textContent = action;
      summaryEl.textContent = signals.length
        ? `위험 신호 ${signals.length}개를 기준으로 ${level} 단계로 봤어요. 특히 ${signals[0].replace('.', '')}`
        : '뚜렷한 위험 신호는 적지만, 시세·실사·결제 보호 여부는 계속 확인하는 편이 좋아요.';

      listEl.innerHTML = `
        <div class="tool-card">
          <strong>감지된 위험 신호</strong>
          <ul>${(signals.length ? signals : ['입력된 조건에서 즉시 큰 경고 신호는 많지 않습니다.']).map((signal) => `<li>${signal}</li>`).join('')}</ul>
        </div>
        <div class="tool-card">
          <strong>지금 권장되는 대응</strong>
          <ul>${(uniqueActions.length ? uniqueActions.slice(0, 5) : ['시세 비교, 실사 추가 확인, 플랫폼 내 기록 유지, 안전결제 가능 여부를 기본으로 확인하세요.']).map((tip) => `<li>${tip}</li>`).join('')}</ul>
        </div>
      `;

      outputEl.value = [
        '[중고거래 사기 신호 점검 결과]',
        `- 위험 점수: ${score}`,
        `- 위험 등급: ${level}`,
        `- 권장 대응: ${action}`,
        '',
        '[감지 신호]',
        ...(signals.length ? signals.map((signal, index) => `${index + 1}. ${signal}`) : ['1. 큰 경고 신호는 적지만, 기본 보호 절차는 유지하세요.']),
        '',
        '[권장 대응]',
        ...(uniqueActions.length ? uniqueActions.slice(0, 5).map((tip, index) => `${index + 1}. ${tip}`) : ['1. 시세 비교, 실사 확인, 안전결제 유지'])
      ].join('\n');
    };

    sampleBtn.addEventListener('click', () => {
      item.value = 'digital';
      priceGap.value = 'very-low';
      payment.value = 'prepay';
      pressure.value = 'high';
      profile.value = 'new';
      meet.value = 'no';
      outside.checked = true;
      refuseSafe.checked = true;
      stockPhoto.checked = true;
      excuse.checked = true;
      message.value = '오늘 안 보내면 다른 분께 넘겨요. 안전결제는 안 되고 계좌로만 받아요. 군부대라 통화 어렵고 오픈채팅으로 주세요.';
      build();
    });

    copyBtn.addEventListener('click', async () => {
      if (!outputEl.value.trim()) build();
      if (!outputEl.value.trim()) return;
      await copyText(outputEl.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    [item, priceGap, payment, pressure, profile, meet, outside, refuseSafe, stockPhoto, excuse, message].forEach((el) => {
      el.addEventListener('input', build);
      el.addEventListener('change', build);
    });

    build();
  }


  if (slug === 'link-list-cleaner') {
    const input = document.getElementById('llc-input');
    const dedupe = document.getElementById('llc-dedupe');
    const strip = document.getElementById('llc-strip');
    const sortDomain = document.getElementById('llc-sort-domain');
    const lowerHost = document.getElementById('llc-lower-host');
    const format = document.getElementById('llc-format');
    const sampleBtn = document.getElementById('llc-sample');
    const copyBtn = document.getElementById('llc-copy');
    const clearBtn = document.getElementById('llc-clear');
    const output = document.getElementById('llc-output');
    const foundOut = document.getElementById('llc-found');
    const uniqueOut = document.getElementById('llc-unique');
    const domainsOut = document.getElementById('llc-domains');
    const trackingOut = document.getElementById('llc-tracking');
    const summary = document.getElementById('llc-summary');
    const domainList = document.getElementById('llc-domain-list');

    if (!input || !output || !foundOut || !uniqueOut || !domainsOut || !trackingOut || !summary || !domainList) return;

    const llcText = {
      ko: {
        initial: '텍스트를 넣으면 URL만 추출해 중복, 추적 파라미터, 도메인 순서를 정리합니다.',
        emptyDomain: '도메인 요약이 여기에 표시됩니다.',
        noLinks: '텍스트 안에서 http://, https:// 또는 www. 링크를 찾지 못했어요.',
        cleaned: (found, kept, removed, duplicates, skipped) => {
          const extra = skipped ? ` 유효하지 않은 후보 ${formatNum(skipped)}개는 제외했습니다.` : '';
          return `링크 ${formatNum(found)}개를 읽어 ${formatNum(kept)}개로 정리했고, 추적 파라미터 ${formatNum(removed)}개와 중복 ${formatNum(duplicates)}개를 줄였어요.${extra}`;
        },
        domainLinks: (count) => `${formatNum(count)}개 링크`,
        copied: '정리된 링크 목록을 복사했습니다.',
        copyEmpty: '복사할 정리 결과가 없습니다.',
        copyFail: '자동 복사를 사용할 수 없습니다. 결과를 직접 선택해 복사해 주세요.',
        cleared: '입력과 결과를 초기화했습니다.',
        sample: [
          '기사 참고 https://Example.com/news?id=52&utm_source=telegram&utm_medium=chat',
          '문서 링크 [보고서](www.docs.example.org/report?fbclid=test123)',
          '같은 링크 다시 공유 https://example.com/news?id=52&utm_campaign=spring',
          '영상 링크 https://video.example.net/watch?v=abc123&gclid=demo).'
        ]
      },
      en: {
        initial: 'Paste text to extract URLs, remove duplicates, strip tracking parameters, and sort by domain.',
        emptyDomain: 'Domain summary will appear here.',
        noLinks: 'No http://, https://, or www. links were found in the text.',
        cleaned: (found, kept, removed, duplicates, skipped) => {
          const extra = skipped ? ` ${formatNum(skipped)} invalid candidate(s) were skipped.` : '';
          return `Read ${formatNum(found)} link(s), cleaned them down to ${formatNum(kept)}, and reduced ${formatNum(removed)} tracking parameter(s) plus ${formatNum(duplicates)} duplicate(s).${extra}`;
        },
        domainLinks: (count) => `${formatNum(count)} link(s)`,
        copied: 'Copied the cleaned link list.',
        copyEmpty: 'There is no cleaned result to copy.',
        copyFail: 'Automatic copy is unavailable. Select the result manually to copy it.',
        cleared: 'Cleared the input and result.',
        sample: [
          'Article https://Example.com/news?id=52&utm_source=telegram&utm_medium=chat',
          'Docs [report](www.docs.example.org/report?fbclid=test123)',
          'Same link again https://example.com/news?id=52&utm_campaign=spring',
          'Video https://video.example.net/watch?v=abc123&gclid=demo).'
        ]
      },
      ja: {
        initial: 'テキストを貼り付けるとURLだけを抽出し、重複・追跡パラメータ・ドメイン順を整理します。',
        emptyDomain: 'ドメイン要約がここに表示されます。',
        noLinks: 'テキスト内に http://、https://、www. のリンクが見つかりませんでした。',
        cleaned: (found, kept, removed, duplicates, skipped) => {
          const extra = skipped ? ` 無効な候補${formatNum(skipped)}件は除外しました。` : '';
          return `${formatNum(found)}件のリンクを読み取り、${formatNum(kept)}件に整理し、追跡パラメータ${formatNum(removed)}件と重複${formatNum(duplicates)}件を減らしました。${extra}`;
        },
        domainLinks: (count) => `${formatNum(count)}件のリンク`,
        copied: '整理されたリンク一覧をコピーしました。',
        copyEmpty: 'コピーできる整理結果がありません。',
        copyFail: '自動コピーを利用できません。結果を手動で選択してコピーしてください。',
        cleared: '入力と結果をクリアしました。',
        sample: [
          '記事 https://Example.com/news?id=52&utm_source=telegram&utm_medium=chat',
          '資料 [レポート](www.docs.example.org/report?fbclid=test123)',
          '同じリンク https://example.com/news?id=52&utm_campaign=spring',
          '動画 https://video.example.net/watch?v=abc123&gclid=demo).'
        ]
      }
    }[pageLang];

    const TRACKING_KEYS = new Set([
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'utm_id', 'utm_name', 'fbclid', 'gclid', 'igshid', 'mc_cid', 'mc_eid',
      'si', 'feature', 'ref_src', 'utm_creative', 'utm_reader', 'utm_place',
      '_hsenc', '_hsmi', 'mkt_tok', 'vero_id', 'yclid', 'msclkid', 'twclid',
      'dclid', 'gbraid', 'wbraid'
    ]);

    const setSummary = (message, state = '') => {
      summary.textContent = message;
      summary.dataset.state = state;
    };

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand('copy');
          document.body.removeChild(ta);
          return ok;
        } catch (err) {
          return false;
        }
      }
    };

    const trimTrailingPunctuation = (token) => {
      let value = token;
      while (/[.,!?;:]+$/.test(value)) value = value.slice(0, -1);
      const pairs = [['(', ')'], ['[', ']'], ['{', '}'], ['<', '>']];
      let changed = true;
      while (changed) {
        changed = false;
        pairs.forEach(([open, close]) => {
          const opens = (value.match(new RegExp(`\\${open}`, 'g')) || []).length;
          const closes = (value.match(new RegExp(`\\${close}`, 'g')) || []).length;
          if (value.endsWith(close) && closes > opens) {
            value = value.slice(0, -1);
            changed = true;
          }
        });
      }
      return value;
    };

    const cleanToken = (token) => trimTrailingPunctuation(token.trim().replace(/^[([<{]+/g, ''));

    const normalizeUrl = (raw) => {
      const cleaned = cleanToken(raw.trim());
      try {
        const url = new URL(/^www\./i.test(cleaned) ? `https://${cleaned}` : cleaned);
        if (!['http:', 'https:'].includes(url.protocol)) return null;
        let removed = 0;
        if (lowerHost.checked) url.hostname = url.hostname.toLowerCase();
        if (strip.checked) {
          const keys = Array.from(url.searchParams.keys());
          keys.forEach((key) => {
            if (TRACKING_KEYS.has(key.toLowerCase())) {
              removed += url.searchParams.getAll(key).length || 1;
              url.searchParams.delete(key);
            }
          });
        }
        if (!url.pathname) url.pathname = '/';
        if (!url.search) url.search = '';
        url.hash = url.hash || '';
        return { href: url.toString(), host: url.hostname || '-', removed };
      } catch (_) {
        return null;
      }
    };

    const renderDomainCards = (items) => {
      const counts = new Map();
      items.forEach((item) => counts.set(item.host, (counts.get(item.host) || 0) + 1));
      const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      if (!entries.length) {
        domainList.innerHTML = `<p class="tool-result">${escapeHtml(llcText.emptyDomain)}</p>`;
        return;
      }
      domainList.innerHTML = entries.map(([host, count]) => `
        <div class="tool-card">
          <strong>${escapeHtml(host)}</strong>
          <p class="tool-result">${escapeHtml(llcText.domainLinks(count))}</p>
        </div>
      `).join('');
    };

    const formatOutput = (items) => {
      const mode = format?.value || 'plain';
      const hrefs = items.map((item) => item.href);
      if (mode === 'markdown') return hrefs.map((href) => `- <${href}>`).join('\n');
      if (mode === 'html') return hrefs.map((href) => `<a href="${escapeHtml(href)}">${escapeHtml(href)}</a>`).join('\n');
      return hrefs.join('\n');
    };

    const render = () => {
      const rawText = input.value || '';
      const matches = (rawText.match(/(?:https?:\/\/|www\.)[^\s"'<>]+/gi) || []);
      foundOut.textContent = matches.length.toLocaleString(numberLocale);

      const normalized = [];
      let removedTotal = 0;
      let skipped = 0;
      matches.forEach((match) => {
        const parsed = normalizeUrl(match);
        if (!parsed) {
          skipped += 1;
          return;
        }
        removedTotal += parsed.removed;
        normalized.push(parsed);
      });

      let items = normalized;
      let duplicates = 0;
      if (dedupe.checked) {
        const seen = new Set();
        items = items.filter((item) => {
          if (seen.has(item.href)) {
            duplicates += 1;
            return false;
          }
          seen.add(item.href);
          return true;
        });
      }

      if (sortDomain.checked) {
        items = [...items].sort((a, b) => a.host.localeCompare(b.host) || a.href.localeCompare(b.href));
      }

      const uniqueDomains = new Set(items.map((item) => item.host));
      uniqueOut.textContent = items.length.toLocaleString(numberLocale);
      domainsOut.textContent = uniqueDomains.size.toLocaleString(numberLocale);
      trackingOut.textContent = `${formatNum(removedTotal)} / ${formatNum(duplicates)}`;
      output.value = formatOutput(items);
      copyBtn.disabled = !output.value.trim();
      renderDomainCards(items);

      if (!matches.length) {
        setSummary(rawText.trim() ? llcText.noLinks : llcText.initial, rawText.trim() ? 'warning' : '');
      } else {
        setSummary(llcText.cleaned(matches.length, items.length, removedTotal, duplicates, skipped), skipped ? 'warning' : 'success');
      }
    };

    sampleBtn?.addEventListener('click', () => {
      input.value = llcText.sample.join('\n');
      render();
      input.focus();
    });

    copyBtn?.addEventListener('click', async () => {
      if (!output.value.trim()) {
        setSummary(llcText.copyEmpty, 'error');
        input.focus();
        return;
      }
      const copied = await copyText(output.value.trim());
      if (!copied) {
        setSummary(llcText.copyFail, 'error');
        output.focus();
        output.select();
        return;
      }
      const old = copyBtn.textContent;
      copyBtn.textContent = llcText.copied;
      setSummary(llcText.copied, 'success');
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      render();
      setSummary(llcText.cleared);
      input.focus();
    });

    [input, dedupe, strip, sortDomain, lowerHost, format].forEach((el) => {
      el?.addEventListener('input', render);
      el?.addEventListener('change', render);
    });

    render();
  }




  if (slug === 'shortcut-key-practice') {
    const $ = (id) => document.getElementById(id);
    const osEl = $('skp-os');
    const catEl = $('skp-category');
    const promptEl = $('skp-prompt');
    const feedbackEl = $('skp-feedback');
    const nextBtn = $('skp-next');
    const reviewBtn = $('skp-review');
    const resetBtn = $('skp-reset');
    const correctEl = $('skp-correct');
    const totalEl = $('skp-total');
    const rateEl = $('skp-rate');
    const missedEl = $('skp-missed');
    const optionBtns = Array.from(document.querySelectorAll('#skp-options [data-choice]'));
    if (!osEl || !promptEl || !optionBtns.length) return;

    const i18n = {
      ko: { ready:'동작에 맞는 단축키를 골라보세요.', empty:'선택한 조건에 맞는 문제가 부족해 전체 문제에서 냅니다.', correct:'정답입니다.', wrong:(a)=>`아쉬워요. 정답은 ${a} 입니다.`, reviewEmpty:'아직 복습할 오답이 없습니다.', reset:'점수를 초기화했습니다.', action:'다음 동작의 단축키는?', explain:'해설' },
      en: { ready:'Choose the shortcut that matches the action.', empty:'Not enough questions for this filter, so using the full pool.', correct:'Correct.', wrong:(a)=>`Not quite. The answer is ${a}.`, reviewEmpty:'No missed questions to review yet.', reset:'Score reset.', action:'Which shortcut matches this action?', explain:'Note' },
      ja: { ready:'操作に合うショートカットを選んでください。', empty:'この条件の問題が少ないため、全体から出題します。', correct:'正解です。', wrong:(a)=>`惜しいです。正解は ${a} です。`, reviewEmpty:'復習する間違いはまだありません。', reset:'スコアをリセットしました。', action:'この操作のショートカットは?', explain:'解説' }
    }[pageLang] || null;

    const L = (obj) => obj?.[pageLang] || obj?.ko || '';
    const questions = [
      { os:'common', cat:'browser', action:{ko:'새 탭 열기', en:'Open a new tab', ja:'新しいタブを開く'}, answer:'Ctrl/Cmd + T', explain:{ko:'대부분의 브라우저에서 Ctrl+T 또는 Command+T를 씁니다.', en:'Most browsers use Ctrl+T or Command+T.', ja:'多くのブラウザでCtrl+TまたはCommand+Tを使います。'} },
      { os:'common', cat:'browser', action:{ko:'닫은 탭 다시 열기', en:'Reopen the last closed tab', ja:'閉じたタブを再度開く'}, answer:'Ctrl/Cmd + Shift + T', explain:{ko:'실수로 닫은 탭을 되돌릴 때 가장 자주 쓰입니다.', en:'Useful when you accidentally close a tab.', ja:'誤って閉じたタブを戻すときによく使います。'} },
      { os:'common', cat:'browser', action:{ko:'주소창으로 바로 이동', en:'Focus the address bar', ja:'アドレスバーに移動'}, answer:'Ctrl/Cmd + L', explain:{ko:'검색어나 URL을 바로 입력할 수 있습니다.', en:'Lets you type a search or URL immediately.', ja:'検索語やURLをすぐ入力できます。'} },
      { os:'common', cat:'browser', action:{ko:'페이지 안에서 검색', en:'Find on the current page', ja:'ページ内検索'}, answer:'Ctrl/Cmd + F', explain:{ko:'긴 문서나 웹페이지에서 단어를 빠르게 찾습니다.', en:'Find words quickly in long pages.', ja:'長いページで単語をすばやく探せます。'} },
      { os:'common', cat:'editing', action:{ko:'실행 취소', en:'Undo the previous action', ja:'前の操作を取り消す'}, answer:'Ctrl/Cmd + Z', explain:{ko:'편집 실수를 되돌릴 때 가장 기본이 되는 단축키입니다.', en:'The basic shortcut for reversing an edit.', ja:'編集ミスを戻す基本ショートカットです。'} },
      { os:'common', cat:'editing', action:{ko:'다시 실행', en:'Redo the undone action', ja:'やり直し'}, answer:'Ctrl/Cmd + Shift + Z', explain:{ko:'앱에 따라 Ctrl+Y를 쓰기도 하지만 Shift+Z 조합도 널리 쓰입니다.', en:'Some apps use Ctrl+Y, but Shift+Z is widely used too.', ja:'アプリによってCtrl+Yもありますが、Shift+Zもよく使われます。'} },
      { os:'common', cat:'editing', action:{ko:'전체 선택', en:'Select all', ja:'すべて選択'}, answer:'Ctrl/Cmd + A', explain:{ko:'문서, 입력창, 파일 목록 전체를 한 번에 선택합니다.', en:'Selects all text, fields, or files in context.', ja:'文書や入力欄、ファイル一覧をまとめて選択します。'} },
      { os:'common', cat:'editing', action:{ko:'복사하기', en:'Copy', ja:'コピー'}, answer:'Ctrl/Cmd + C', explain:{ko:'선택한 내용을 클립보드에 복사합니다.', en:'Copies selected content to the clipboard.', ja:'選択した内容をクリップボードにコピーします。'} },
      { os:'common', cat:'editing', action:{ko:'붙여넣기', en:'Paste', ja:'貼り付け'}, answer:'Ctrl/Cmd + V', explain:{ko:'클립보드 내용을 현재 위치에 넣습니다.', en:'Pastes clipboard content at the current position.', ja:'クリップボードの内容を現在位置に貼り付けます。'} },
      { os:'mac', cat:'system', action:{ko:'앱 전환', en:'Switch apps', ja:'アプリを切り替える'}, answer:'Cmd + Tab', explain:{ko:'맥에서 열려 있는 앱 사이를 빠르게 이동합니다.', en:'Moves between open apps on Mac.', ja:'Macで開いているアプリ間を移動します。'} },
      { os:'win', cat:'system', action:{ko:'앱 전환', en:'Switch apps', ja:'アプリを切り替える'}, answer:'Alt + Tab', explain:{ko:'윈도우에서 열린 창 사이를 빠르게 이동합니다.', en:'Moves between open windows on Windows.', ja:'Windowsで開いているウィンドウ間を移動します。'} },
      { os:'mac', cat:'system', action:{ko:'스포트라이트 검색 열기', en:'Open Spotlight search', ja:'Spotlight検索を開く'}, answer:'Cmd + Space', explain:{ko:'앱, 파일, 설정을 빠르게 검색합니다.', en:'Search apps, files, and settings quickly.', ja:'アプリ、ファイル、設定をすばやく検索します。'} },
      { os:'win', cat:'system', action:{ko:'파일 탐색기 열기', en:'Open File Explorer', ja:'エクスプローラーを開く'}, answer:'Win + E', explain:{ko:'폴더와 파일을 바로 확인할 때 유용합니다.', en:'Useful for opening folders and files quickly.', ja:'フォルダやファイルをすぐ確認できます。'} },
      { os:'win', cat:'system', action:{ko:'화면 잠금', en:'Lock the screen', ja:'画面をロック'}, answer:'Win + L', explain:{ko:'자리를 비울 때 즉시 화면을 잠급니다.', en:'Locks your screen immediately when stepping away.', ja:'席を外すときにすぐ画面をロックします。'} },
      { os:'mac', cat:'system', action:{ko:'현재 앱 설정 열기', en:'Open current app settings', ja:'現在のアプリ設定を開く'}, answer:'Cmd + ,', explain:{ko:'많은 맥 앱에서 환경설정을 여는 단축키입니다.', en:'Many Mac apps use this to open preferences.', ja:'多くのMacアプリで環境設定を開きます。'} },
      { os:'common', cat:'editing', action:{ko:'저장하기', en:'Save', ja:'保存'}, answer:'Ctrl/Cmd + S', explain:{ko:'문서나 작업 내용을 자주 저장하는 습관에 좋습니다.', en:'Good for saving documents or work frequently.', ja:'文書や作業内容をこまめに保存できます。'} }
    ];
    const distractors = ['Ctrl/Cmd + P','Ctrl/Cmd + W','Ctrl/Cmd + R','Ctrl/Cmd + N','Alt + F4','Ctrl/Cmd + B','Ctrl/Cmd + H','Shift + Space','Ctrl/Cmd + D','Esc'];
    let current = null, correct = 0, total = 0;
    const missed = [];
    const pool = () => {
      const os = osEl.value || 'all';
      const cat = catEl.value || 'all';
      let list = questions.filter(q => (os === 'all' || q.os === os || q.os === 'common') && (cat === 'all' || q.cat === cat));
      if (list.length < 4) { feedbackEl.textContent = i18n.empty; list = questions; }
      return list;
    };
    const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]);
    const updateStats = () => {
      correctEl.textContent = formatNum(correct);
      totalEl.textContent = formatNum(total);
      rateEl.textContent = total ? `${Math.round(correct / total * 100)}%` : '0%';
      missedEl.textContent = formatNum(missed.length);
    };
    const showQuestion = (fromMissed = false) => {
      const source = fromMissed && missed.length ? missed : pool();
      if (fromMissed && !missed.length) { feedbackEl.textContent = i18n.reviewEmpty; return; }
      current = source[Math.floor(Math.random() * source.length)] || questions[0];
      promptEl.textContent = `${i18n.action} ${L(current.action)}`;
      const options = shuffle([current.answer, ...shuffle(distractors.filter(x => x !== current.answer)).slice(0,3)]);
      optionBtns.forEach((btn, idx) => { btn.textContent = options[idx]; btn.disabled = false; btn.style.opacity = '1'; });
      feedbackEl.textContent = i18n.ready;
    };
    optionBtns.forEach(btn => btn.addEventListener('click', () => {
      if (!current) return;
      total += 1;
      const picked = btn.textContent;
      if (picked === current.answer) {
        correct += 1;
        feedbackEl.textContent = `${i18n.correct} ${i18n.explain}: ${L(current.explain)}`;
        const idx = missed.indexOf(current); if (idx >= 0) missed.splice(idx, 1);
      } else {
        feedbackEl.textContent = `${i18n.wrong(current.answer)} ${i18n.explain}: ${L(current.explain)}`;
        if (!missed.includes(current)) missed.push(current);
      }
      optionBtns.forEach(b => { b.disabled = true; b.style.opacity = b.textContent === current.answer ? '1' : '0.65'; });
      updateStats();
    }));
    nextBtn?.addEventListener('click', () => showQuestion(false));
    reviewBtn?.addEventListener('click', () => showQuestion(true));
    resetBtn?.addEventListener('click', () => { correct = 0; total = 0; missed.length = 0; updateStats(); feedbackEl.textContent = i18n.reset; showQuestion(false); });
    [osEl, catEl].forEach(el => el?.addEventListener('change', () => showQuestion(false)));
    updateStats();
    showQuestion(false);
  }


  if (slug === 'pet-care-note-generator') {
    const $ = (id) => document.getElementById(id);
    const fields = {
      name: $('pcng-name'), type: $('pcng-type'), period: $('pcng-period'), contact: $('pcng-contact'),
      personality: $('pcng-personality'), meals: $('pcng-meals'), activity: $('pcng-activity'), medicine: $('pcng-medicine'), cautions: $('pcng-cautions')
    };
    const output = $('pcng-output');
    const runBtn = $('pcng-run');
    const sampleBtn = $('pcng-sample');
    const copyBtn = $('pcng-copy');
    const sectionsOut = $('pcng-sections');
    const checksOut = $('pcng-checks');
    const riskOut = $('pcng-risk');
    const charsOut = $('pcng-chars');
    const help = $('pcng-help');
    if (!fields.name || !output) return;

    const i18n = {
      ko: {
        copied: '복사됨', copyDefault: '메모 복사', empty: '이름이나 루틴을 입력하면 돌봄 메모를 만들 수 있어요.',
        type: { dog: '강아지', cat: '고양이', small: '소동물', other: '반려동물' }, risk: ['낮음', '보통', '높음'],
        title: (n,t) => `# ${n || t} 돌봄 메모`, period: '돌봄 기간', contact: '비상 연락처',
        headings: { personality:'성격/안심 포인트', meals:'식사와 물', activity:'산책·놀이·배변/화장실', medicine:'약/건강 주의사항', cautions:'주의사항/집 메모' },
        checklist: ['식사와 물 확인', '배변·화장실 상태 확인', '문단속과 위험 물건 확인'],
        medicineNotice: '※ 약, 용량, 시간은 보호자가 확인한 내용대로만 진행해주세요.',
        done: (s,c) => `${s}개 섹션과 ${c}개 체크 항목으로 돌봄 메모를 만들었습니다. 전달 전 약·연락처는 한 번 더 확인하세요.`,
        sample: { name:'모모', type:'cat', period:'5/24 저녁~5/25 밤', contact:'보호자 010-1234-5678 / 우리동물병원 02-000-0000', personality:'낯선 사람을 처음엔 피하지만 간식 봉지를 흔들면 나옵니다. 큰 소리와 갑작스러운 손길을 싫어해요.', meals:'아침 8시, 저녁 7시에 사료 40g씩 주세요. 물그릇은 식사 때마다 새 물로 갈아주세요. 츄르는 하루 1개만 가능합니다.', activity:'화장실은 하루 2번 모래 상태를 확인하고 뭉친 부분만 치워주세요. 창문은 방충망까지 꼭 닫아주세요.', medicine:'저녁 식사 후 처방약 1알을 간식에 섞어 주세요. 먹지 않으면 억지로 먹이지 말고 보호자에게 연락해주세요.', cautions:'현관문 열 때 따라나오지 않게 먼저 위치를 확인해주세요. 실 끈 장난감은 사용 후 서랍에 넣어주세요.' }
      },
      en: {
        copied: 'Copied', copyDefault: 'Copy note', empty: 'Enter a name or routine to generate a care note.',
        type: { dog: 'dog', cat: 'cat', small: 'small pet', other: 'pet' }, risk: ['Low', 'Medium', 'High'],
        title: (n,t) => `# ${n || t} care note`, period: 'Care period', contact: 'Emergency contact',
        headings: { personality:'Personality / comfort notes', meals:'Meals and water', activity:'Walk/play and potty/litter', medicine:'Medicine / health cautions', cautions:'Cautions / home notes' },
        checklist: ['Check meals and water', 'Check potty/litter condition', 'Check doors and hazards'],
        medicineNotice: '※ Follow only the medicine name, dose, and timing confirmed by the guardian.',
        done: (s,c) => `Created a care note with ${s} section(s) and ${c} checklist item(s). Review medicine and contacts before sending.`,
        sample: { name:'Momo', type:'cat', period:'May 24 evening - May 25 night', contact:'Guardian 010-1234-5678 / Local vet 02-000-0000', personality:'Shy at first, but comes out for treats. Avoid loud sounds and sudden touching.', meals:'Food 40g at 8 AM and 7 PM. Refresh water at each meal. One tube treat per day max.', activity:'Check litter twice a day and remove clumps. Keep windows and screens closed.', medicine:'One prescribed tablet after dinner, mixed with a treat. If refused, do not force it; contact the guardian.', cautions:'Check location before opening the front door. Put string toys away after use.' }
      },
      ja: {
        copied: 'コピー完了', copyDefault: 'メモをコピー', empty: '名前やルーティンを入力すると、お世話メモを作成できます。',
        type: { dog: '犬', cat: '猫', small: '小動物', other: 'ペット' }, risk: ['低め', '普通', '高め'],
        title: (n,t) => `# ${n || t} お世話メモ`, period: '預ける期間', contact: '緊急連絡先',
        headings: { personality:'性格・安心ポイント', meals:'食事・水', activity:'散歩・遊び・トイレ', medicine:'薬・健康上の注意', cautions:'注意事項・家のメモ' },
        checklist: ['食事と水を確認', 'トイレ状態を確認', '戸締まりと危険物を確認'],
        medicineNotice: '※ 薬名・量・時間は飼い主が確認した内容だけに従ってください。',
        done: (s,c) => `${s}項目と${c}個のチェック項目でお世話メモを作成しました。送る前に薬と連絡先を再確認してください。`,
        sample: { name:'モモ', type:'cat', period:'5/24夜〜5/25夜', contact:'飼い主 010-1234-5678 / かかりつけ病院 02-000-0000', personality:'最初は隠れますが、おやつの音で出てきます。大きな音と急な接触が苦手です。', meals:'朝8時、夜7時にフード40g。水は食事ごとに新しくしてください。おやつは1日1本まで。', activity:'トイレは1日2回確認し、固まった部分を取り除いてください。窓と網戸は必ず閉めてください。', medicine:'夕食後に処方薬1錠をおやつに混ぜてください。食べない場合は無理に与えず飼い主へ連絡してください。', cautions:'玄関を開ける前に居場所を確認してください。ひも状のおもちゃは使用後にしまってください。' }
      }
    }[pageLang] || null;

    const cleanLines = (text) => (text || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
    const render = () => {
      const name = fields.name.value.trim();
      const petType = i18n.type[fields.type.value] || i18n.type.other;
      const values = ['personality','meals','activity','medicine','cautions'].map(k => [k, fields[k].value.trim()]).filter(([,v]) => v);
      if (!name && values.length === 0) {
        output.value = ''; help.textContent = i18n.empty; sectionsOut.textContent = '0'; checksOut.textContent = '0'; riskOut.textContent = '-'; charsOut.textContent = '0'; return;
      }
      const lines = [i18n.title(name, petType), ''];
      if (fields.period.value.trim()) lines.push(`- ${i18n.period}: ${fields.period.value.trim()}`);
      if (fields.contact.value.trim()) lines.push(`- ${i18n.contact}: ${fields.contact.value.trim()}`);
      if (fields.period.value.trim() || fields.contact.value.trim()) lines.push('');
      values.forEach(([key, value]) => {
        lines.push(`## ${i18n.headings[key]}`);
        cleanLines(value).forEach(v => lines.push(`- ${v}`));
        if (key === 'medicine') lines.push(i18n.medicineNotice);
        lines.push('');
      });
      lines.push('## Quick checklist');
      const checklist = [...i18n.checklist];
      if (fields.medicine.value.trim()) checklist.push(i18n.headings.medicine);
      if (fields.contact.value.trim()) checklist.push(i18n.contact);
      checklist.forEach(v => lines.push(`- [ ] ${v}`));
      const result = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
      output.value = result;
      const cautionWords = `${fields.medicine.value} ${fields.cautions.value}`.match(/약|병원|처방|알레르기|탈출|공격|medicine|vet|allergy|escape|薬|病院|アレルギー|脱走/g) || [];
      const riskIdx = cautionWords.length >= 3 ? 2 : (cautionWords.length >= 1 ? 1 : 0);
      sectionsOut.textContent = String(values.length);
      checksOut.textContent = String(checklist.length);
      riskOut.textContent = i18n.risk[riskIdx];
      charsOut.textContent = formatNum(result.length);
      help.textContent = i18n.done(values.length, checklist.length);
    };
    const copyText = async (val) => { try { await navigator.clipboard.writeText(val); } catch (_) { const ta=document.createElement('textarea'); ta.value=val; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } };
    runBtn?.addEventListener('click', render);
    sampleBtn?.addEventListener('click', () => { Object.entries(i18n.sample).forEach(([k,v]) => { if (fields[k]) fields[k].value = v; }); render(); });
    copyBtn?.addEventListener('click', async () => { if (!output.value.trim()) render(); if (!output.value.trim()) return; await copyText(output.value); const old=copyBtn.textContent; copyBtn.textContent=i18n.copied; setTimeout(() => { copyBtn.textContent = old || i18n.copyDefault; }, 900); });
    Object.values(fields).forEach(el => el?.addEventListener('input', render));
    fields.type?.addEventListener('change', render);
    render();
  }

  if (slug === 'privacy-masker') {
    const $ = (id) => document.getElementById(id);
    const input = $('pm-input');
    const output = $('pm-output');
    const runBtn = $('pm-run');
    const sampleBtn = $('pm-sample');
    const copyBtn = $('pm-copy');
    const clearBtn = $('pm-clear');
    const style = $('pm-style');
    const checks = { phone: $('pm-phone'), email: $('pm-email'), card: $('pm-card'), account: $('pm-account'), id: $('pm-id') };
    const counts = { phone: $('pm-phone-count'), email: $('pm-email-count'), card: $('pm-card-count'), account: $('pm-account-count'), id: $('pm-id-count') };
    const help = $('pm-help');
    const detectionsEl = $('pm-detections');
    if (!input || !output) return;

    const i18n = {
      ko: {
        copied:'복사됨', copyDefault:'결과 복사', none:'마스킹할 텍스트를 입력하세요.', noneSelected:'마스킹할 항목을 하나 이상 선택하세요.', noMatch:'선택한 항목에서 마스킹 후보를 찾지 못했습니다. 원문을 그대로 표시했습니다.',
        done:(n)=>`${n}개 후보를 마스킹했습니다. 이름·주소·주문번호처럼 문맥 확인이 필요한 정보는 직접 확인하세요.`,
        labels:{ phone:'전화번호', email:'이메일', card:'카드번호', account:'계좌번호 후보', id:'주민등록번호 후보' },
        tokens:{ phone:'[전화번호]', email:'[이메일]', card:'[카드번호]', account:'[계좌번호]', id:'[신분번호]' },
        sample:'김수야 고객님 연락처는 010-1234-5678, 이메일은 sooya@example.com 입니다. 미국 지점 번호는 +1 415-555-1212입니다. 결제 카드 1234-5678-9012-3456, 환불 계좌 국민 123456-78-901234, 신분번호 후보 900101-1234567 로 접수되었습니다.'
      },
      en: {
        copied:'Copied', copyDefault:'Copy result', none:'Enter text to mask.', noneSelected:'Select at least one masking category.', noMatch:'No selected privacy candidates were found. The original text is shown unchanged.',
        done:(n)=>`Masked ${n} candidate(s). Review context-specific details such as names, addresses, and order IDs manually.`,
        labels:{ phone:'Phone', email:'Email', card:'Card number', account:'Account candidate', id:'ID number candidate' },
        tokens:{ phone:'[PHONE]', email:'[EMAIL]', card:'[CARD]', account:'[ACCOUNT]', id:'[ID]' },
        sample:'Customer Suya Kim can be reached at 010-1234-5678, +1 415-555-1212, or sooya@example.com. Payment card 1234-5678-9012-3456, refund account 123456-78-901234, and ID-like number 900101-1234567 were included.'
      },
      ja: {
        copied:'コピー完了', copyDefault:'結果をコピー', none:'マスキングするテキストを入力してください。', noneSelected:'マスキング対象を1つ以上選択してください。', noMatch:'選択した項目では候補が見つかりませんでした。原文をそのまま表示しています。',
        done:(n)=>`${n}件の候補をマスキングしました。氏名・住所・注文番号など文脈依存の情報は目視確認してください。`,
        labels:{ phone:'電話番号', email:'メール', card:'カード番号', account:'口座番号候補', id:'ID番号候補' },
        tokens:{ phone:'[電話番号]', email:'[メール]', card:'[カード]', account:'[口座]', id:'[ID]' },
        sample:'スヤ様の連絡先は010-1234-5678、海外拠点は+1 415-555-1212、メールはsooya@example.comです。決済カード1234-5678-9012-3456、返金口座123456-78-901234、ID番号候補900101-1234567が含まれています。'
      }
    }[pageLang] || null;

    const setHelp = (message, state = '') => {
      help.textContent = message;
      help.dataset.state = state;
    };
    const setCopyEnabled = (enabled) => {
      if (copyBtn) copyBtn.disabled = !enabled;
    };
    const bump = (key, amount = 1) => { if (counts[key]) counts[key].textContent = String((Number(counts[key].textContent) || 0) + amount); };
    const resetCounts = () => Object.values(counts).forEach(el => { if (el) el.textContent = '0'; });
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
    const detectionRows = [];
    const addDetection = (key, before, after) => {
      if (before === after || detectionRows.length >= 30) return;
      detectionRows.push({ key, before, after });
    };
    const renderDetections = () => {
      if (!detectionsEl) return;
      detectionsEl.innerHTML = detectionRows.map((row) => (
        `<div class="bw-item"><strong>${escapeHtml(i18n.labels[row.key] || row.key)}</strong><span class="bw-tag">${escapeHtml(row.after)}</span><p>${escapeHtml(row.before)}</p></div>`
      )).join('');
    };
    const shouldUseLabel = () => (style?.value || 'shape') === 'label';
    const labelFor = (key) => i18n.tokens?.[key] || `[${String(key).toUpperCase()}]`;
    const maskEmail = (value) => {
      if (shouldUseLabel()) return labelFor('email');
      const [local, domain = ''] = value.split('@');
      const [host, ...rest] = domain.split('.');
      const safeLocal = local.length <= 2 ? `${local[0] || '*'}***` : `${local.slice(0, 2)}***`;
      const safeHost = host.length <= 2 ? `${host[0] || '*'}***` : `${host.slice(0, 2)}***`;
      return `${safeLocal}@${safeHost}${rest.length ? `.${rest.join('.')}` : ''}`;
    };
    const maskDigits = (value, visibleStart = 3, visibleEnd = 2) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= visibleStart + visibleEnd) return value.replace(/\d/g, '*');
      let seen = 0;
      const tailStart = digits.length - visibleEnd;
      return value.replace(/\d/g, (d) => {
        const keep = seen < visibleStart || seen >= tailStart;
        seen += 1;
        return keep ? d : '*';
      });
    };
    const luhnOk = (digits) => {
      let sum = 0;
      let doubleIt = false;
      for (let i = digits.length - 1; i >= 0; i -= 1) {
        let n = Number(digits[i]);
        if (doubleIt) {
          n *= 2;
          if (n > 9) n -= 9;
        }
        sum += n;
        doubleIt = !doubleIt;
      }
      return sum > 0 && sum % 10 === 0;
    };
    const replaceCandidate = (text, key, pattern, masker) => text.replace(pattern, (match, ...args) => {
      const masked = masker(match, ...args);
      if (masked === match) return match;
      bump(key);
      addDetection(key, match, masked);
      return masked;
    });

    const render = () => {
      resetCounts();
      detectionRows.length = 0;
      if (detectionsEl) detectionsEl.innerHTML = '';
      let text = input.value || '';
      if (!text.trim()) {
        output.value = '';
        input.setAttribute('aria-invalid', 'false');
        setCopyEnabled(false);
        setHelp(i18n.none);
        return;
      }
      if (!Object.values(checks).some((el) => el?.checked)) {
        output.value = text;
        input.setAttribute('aria-invalid', 'true');
        setCopyEnabled(false);
        setHelp(i18n.noneSelected, 'error');
        return;
      }
      input.setAttribute('aria-invalid', 'false');
      if (checks.id?.checked) {
        const maskId = (m) => {
          const digits = m.replace(/\D/g, '');
          if (digits.length !== 13 || !/^\d{6}[1-8]\d{6}$/.test(digits)) return m;
          if (shouldUseLabel()) return labelFor('id');
          let seen = 0;
          return m.replace(/\d/g, (d) => {
            const keep = seen < 7;
            seen += 1;
            return keep ? d : '*';
          });
        };
        text = replaceCandidate(text, 'id', /\b\d{6}[- ]?[1-8]\d{6}\b/g, maskId);
      }
      if (checks.email?.checked) {
        text = replaceCandidate(text, 'email', /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, maskEmail);
      }
      if (checks.card?.checked) {
        const maskCard = (m) => {
          const digits = m.replace(/\D/g, '');
          const groupedCard = /\d{4}[- ]\d{4}[- ]\d{4}[- ]\d{4}/.test(m);
          if (digits.length < 13 || digits.length > 19 || (!groupedCard && !luhnOk(digits))) return m;
          if (shouldUseLabel()) return labelFor('card');
          return maskDigits(m, 4, 4);
        };
        text = replaceCandidate(text, 'card', /\b\d{4}[- ]\d{4}[- ]\d{4}[- ]\d{4}(?:[- ]\d{1,3})?\b/g, maskCard);
        text = replaceCandidate(text, 'card', /\b\d{13,19}\b/g, maskCard);
      }
      if (checks.phone?.checked) {
        const maskPhone = (m) => {
          const digits = m.replace(/\D/g, '');
          if (digits.length < 9 || digits.length > 15 || (digits.length >= 13 && luhnOk(digits))) return m;
          if (shouldUseLabel()) return labelFor('phone');
          return maskDigits(m, 3, 2);
        };
        text = replaceCandidate(text, 'phone', /\b(?:\+?82[-.\s]?)?0?1[016789][-\s.]?\d{3,4}[-\s.]?\d{4}\b/g, maskPhone);
        text = replaceCandidate(text, 'phone', /\+\d{1,3}[-.\s]?(?:\(?\d{2,4}\)?[-.\s]?){2,4}\d{3,4}\b/g, maskPhone);
      }
      if (checks.account?.checked) {
        const maskAccount = (m) => {
          const digits = m.replace(/\D/g, '');
          if (digits.length < 9 || digits.length > 16 || /\*+/.test(m)) return m;
          if (shouldUseLabel()) return labelFor('account');
          return maskDigits(m, 3, 2);
        };
        text = replaceCandidate(text, 'account', /\b\d{2,6}[-\s]\d{2,6}[-\s]\d{2,8}\b/g, maskAccount);
      }
      const total = Object.values(counts).reduce((sum, el) => sum + (Number(el?.textContent) || 0), 0);
      output.value = text;
      renderDetections();
      setCopyEnabled(Boolean(output.value.trim()));
      setHelp(total ? i18n.done(total) : i18n.noMatch, total ? 'success' : 'warning');
    };
    const copyText = async (val) => { try { await navigator.clipboard.writeText(val); } catch (_) { const ta=document.createElement('textarea'); ta.value=val; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } };
    runBtn?.addEventListener('click', render);
    sampleBtn?.addEventListener('click', () => { input.value = i18n.sample; render(); });
    copyBtn?.addEventListener('click', async () => { if (!output.value.trim()) render(); if (!output.value.trim()) return; await copyText(output.value); const old = copyBtn.textContent; copyBtn.textContent = i18n.copied; setTimeout(() => { copyBtn.textContent = old || i18n.copyDefault; }, 900); });
    clearBtn?.addEventListener('click', () => { input.value = ''; output.value = ''; input.setAttribute('aria-invalid', 'false'); resetCounts(); setCopyEnabled(false); if (detectionsEl) detectionsEl.innerHTML = ''; setHelp(i18n.none); input.focus(); });
    input.addEventListener('input', render);
    style?.addEventListener('change', render);
    Object.values(checks).forEach(el => el?.addEventListener('change', render));
    render();
  }


  if (slug === 'recycling-sorting-checker') {
    const itemsEl = document.getElementById('rsc-items');
    const materialEl = document.getElementById('rsc-material');
    const contamEl = document.getElementById('rsc-contam');
    const partsEl = document.getElementById('rsc-parts');
    const placeEl = document.getElementById('rsc-place');
    const specialEl = document.getElementById('rsc-special');
    const localNoteEl = document.getElementById('rsc-local-note');
    const localEl = document.getElementById('rsc-local');
    const runBtn = document.getElementById('rsc-run');
    const sampleBtn = document.getElementById('rsc-sample');
    const copyBtn = document.getElementById('rsc-copy');
    const countOut = document.getElementById('rsc-count');
    const rinseOut = document.getElementById('rsc-rinse');
    const reviewOut = document.getElementById('rsc-review');
    const stepsOut = document.getElementById('rsc-steps');
    const help = document.getElementById('rsc-help');
    const output = document.getElementById('rsc-output');
    if (!itemsEl || !output) return;

    const i18n = {
      ko: {
        title: '재활용 분리배출 체크리스트', copied: '복사됨', copyDefault: '결과 복사', sample: '페트병\n배달 플라스틱 용기\n종이컵', items: '품목', checklist: '체크리스트', review: '재확인', local: '거주지·건물별 배출 요일과 수거 가능 품목을 최종 확인',
        empty: '품목을 한 줄에 하나 이상 입력하면 체크리스트를 만들 수 있습니다.',
        tooMany: (shown, total) => `품목이 ${total}개라 결과에는 먼저 ${shown}개만 표시했습니다. 나머지는 같은 기준으로 나누어 확인하세요.`,
        localNote: (note) => `지역/건물 메모: ${note}`,
        summary: (decision) => `현재 조건의 권장 방향은 “${decision}”입니다. 지자체·건물 규칙은 마지막에 다시 확인하세요.`,
        decision: { recycle: '분리 후 재활용 배출', rinse: '비우고 헹군 뒤 재활용 검토', trash: '일반쓰레기 또는 전용 배출 검토', review: '지역 규칙 확인 후 배출' },
        material: { plastic: ['내용물을 완전히 비우기', '페트병은 가능하면 투명 페트 전용함 여부 확인'], paper: ['젖은 종이와 음식물 묻은 종이는 분리', '종이팩은 펼쳐 말린 뒤 전용 수거함 여부 확인'], can: ['캔 내부를 비우고 가볍게 헹구기', '날카로운 뚜껑이나 금속 조각은 안전하게 처리'], glass: ['유리병은 내용물을 비우고 병 수거함 확인', '깨진 유리는 재활용함 대신 안전 포장 후 지역 안내 확인'], mixed: ['몸체 재질과 부속품 재질을 각각 확인', '혼합 재질은 무리하게 재활용함에 넣지 말고 안내를 확인'] },
        contam: { clean: ['깨끗한 상태를 유지해 같은 재질끼리 모으기'], rinse: ['남은 내용물을 버리고 물로 한 번 헹구기'], heavy: ['음식물·기름기가 많이 남으면 재활용 품질이 떨어짐', '세척이 어렵다면 일반쓰레기 전환을 검토'], chemical: ['약품·페인트·세제 잔여물은 일반 재활용함에 넣지 않기', '유해 폐기물 또는 전용 수거 안내 확인'] },
        parts: { separated: ['라벨·뚜껑·펌프 등 부속품을 재질별로 따로 배출'], possible: ['배출 전 라벨·뚜껑·펌프를 분리'], stuck: ['부속품이 떨어지지 않으면 혼합 재질로 보고 지역 규칙 확인'] },
        place: { apartment: ['분리함 표기와 투명 페트 별도함 여부 확인'], house: ['수거 요일과 배출 봉투·묶음 방식 확인'], office: ['사무실 공용 분리함 기준과 청소 담당 안내 확인'] },
        special: { none: [], sharp: ['깨지거나 날카로운 부분은 두꺼운 종이·신문지로 감싸고 겉면에 표시', '안전 위험이 있으면 일반 재활용함 대신 지역 폐기물 안내 확인'], battery: ['배터리는 일반 재활용품과 섞지 말고 폐건전지·전자제품 전용 수거함 확인', '부풀거나 손상된 배터리는 만지지 말고 전용 회수 안내 확인'], large: ['대형폐기물 신고, 스티커, 예약 수거가 필요한지 먼저 확인', '분해 가능한 재질도 임의 배출하지 말고 건물·지자체 규칙 확인'] }
      },
      en: {
        title: 'Recycling sorting checklist', copied: 'Copied', copyDefault: 'Copy result', sample: 'PET bottle\nTakeout plastic container\nPaper cup', items: 'Items', checklist: 'Checklist', review: 'Review', local: 'Confirm collection days and accepted items for your city, building, or provider',
        empty: 'Enter at least one item, one per line, to generate a checklist.',
        tooMany: (shown, total) => `You entered ${total} items, so the result shows the first ${shown}. Apply the same checks to the rest.`,
        localNote: (note) => `Local/building note: ${note}`,
        summary: (decision) => `Recommended direction: “${decision}”. Confirm local and building rules before disposal.`,
        decision: { recycle: 'Recycle after separation', rinse: 'Empty and rinse, then review recycling', trash: 'Consider trash or special disposal', review: 'Check local rules before disposal' },
        material: { plastic: ['Empty all contents', 'For PET bottles, check whether a clear-PET-only bin is required'], paper: ['Separate wet or food-stained paper', 'For cartons, flatten and dry, then check a dedicated carton bin'], can: ['Empty and lightly rinse cans', 'Handle sharp lids or metal pieces safely'], glass: ['Empty glass bottles and check the bottle bin', 'For broken glass, wrap safely and follow local guidance'], mixed: ['Check the main body and attached parts separately', 'Do not force mixed materials into recycling; review guidance'] },
        contam: { clean: ['Keep clean items grouped with the same material'], rinse: ['Empty residue and rinse once with water'], heavy: ['Heavy food or oil residue lowers recycling quality', 'If cleaning is impractical, consider trash disposal'], chemical: ['Do not put chemical, paint, or detergent residue in regular recycling', 'Check hazardous or special collection guidance'] },
        parts: { separated: ['Dispose labels, caps, pumps, and parts by material'], possible: ['Separate labels, caps, and pumps before disposal'], stuck: ['If parts are stuck, treat as mixed material and check local rules'] },
        place: { apartment: ['Check bin labels and clear-PET separation rules'], house: ['Confirm pickup day, bag, and bundling rules'], office: ['Follow office shared-bin labels and facility guidance'] },
        special: { none: [], sharp: ['Wrap broken or sharp parts in thick paper and mark the outside clearly', 'For safety risks, check local disposal guidance instead of regular recycling bins'], battery: ['Do not mix batteries with regular recyclables; use battery or electronics collection points', 'For swollen or damaged batteries, avoid handling and check special collection guidance'], large: ['Check whether a bulky-waste request, sticker, or pickup reservation is required', 'Even if materials can be separated, follow city or building rules before disposal'] }
      },
      ja: {
        title: 'リサイクル分別チェックリスト', copied: 'コピー完了', copyDefault: '結果をコピー', sample: 'PETボトル\nテイクアウト容器\n紙コップ', items: '品目', checklist: 'チェックリスト', review: '再確認', local: '自治体・建物ごとの回収日と対象品目を最終確認',
        empty: '品目を1行に1つ以上入力するとチェックリストを作成できます。',
        tooMany: (shown, total) => `${total}件入力されたため、結果には先頭${shown}件を表示しました。残りも同じ基準で確認してください。`,
        localNote: (note) => `地域・建物メモ: ${note}`,
        summary: (decision) => `現在条件のおすすめは「${decision}」です。出す前に地域・建物ルールを確認してください。`,
        decision: { recycle: '分離して資源回収へ', rinse: '空にしてすすいだ後リサイクル確認', trash: '一般ごみまたは専用回収を検討', review: '地域ルール確認後に排出' },
        material: { plastic: ['中身を完全に空にする', 'PETボトルは透明PET専用回収の有無を確認'], paper: ['濡れた紙や食品汚れの紙を分ける', '紙パックは開いて乾かし専用回収を確認'], can: ['缶の中を空にして軽くすすぐ', '鋭いフタや金属片は安全に処理'], glass: ['びんは中身を空にしてびん回収を確認', '割れたガラスは資源箱ではなく安全に包んで地域案内を確認'], mixed: ['本体素材と付属部品を別々に確認', '複合素材は無理に資源箱へ入れず案内を確認'] },
        contam: { clean: ['きれいな状態を保ち同じ素材でまとめる'], rinse: ['残りを捨てて水で一度すすぐ'], heavy: ['食品・油汚れが多いとリサイクル品質が下がります', '洗浄が難しければ一般ごみを検討'], chemical: ['薬品・塗料・洗剤の残りは通常資源に入れない', '有害ごみや専用回収案内を確認'] },
        parts: { separated: ['ラベル・フタ・ポンプなどを素材別に出す'], possible: ['出す前にラベル・フタ・ポンプを外す'], stuck: ['外れない部品は複合素材として地域ルール確認'] },
        place: { apartment: ['分別箱表示と透明PETの別回収を確認'], house: ['回収日、袋、束ね方のルールを確認'], office: ['オフィス共用分別箱と施設案内に従う'] },
        special: { none: [], sharp: ['割れた物や鋭利な部分は厚紙・新聞紙で包み、外側に表示', '安全リスクがある場合は通常資源箱ではなく地域案内を確認'], battery: ['電池は通常資源と混ぜず、電池・電子機器の専用回収を確認', '膨張・破損した電池は触らず専用回収案内を確認'], large: ['粗大ごみ申請、シール、予約回収が必要か確認', '分解できる素材でも自治体・建物ルールに従う'] }
      }
    };
    const t = i18n[pageLang] || i18n.ko;
    const lines = (v) => (v || '').split(/\n+/).map((s) => s.trim()).filter(Boolean);
    const copyText = async (val) => { try { await navigator.clipboard.writeText(val); } catch (_) { const ta=document.createElement('textarea'); ta.value=val; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } };

    const render = () => {
      const items = lines(itemsEl.value);
      const material = materialEl.value;
      const contam = contamEl.value;
      const parts = partsEl.value;
      const place = placeEl.value;
      const special = specialEl?.value || 'none';
      const localNote = (localNoteEl?.value || '').trim();
      let decisionKey = 'recycle';
      if (contam === 'rinse') decisionKey = 'rinse';
      if (contam === 'heavy' || contam === 'chemical') decisionKey = 'trash';
      if (material === 'mixed' || parts === 'stuck') decisionKey = decisionKey === 'trash' ? 'trash' : 'review';
      if (special !== 'none') decisionKey = 'trash';
      const checks = [...t.material[material], ...t.contam[contam], ...t.parts[parts], ...t.place[place], ...t.special[special]];
      if (localNote) checks.push(t.localNote(localNote));
      if (localEl.checked) checks.push(t.local);
      const rinseCount = (contam === 'rinse' ? 1 : 0) + checks.filter((x) => /헹|씻|rinse|すす/.test(x)).length;
      const reviewCount = (decisionKey === 'review' ? 1 : 0) + (decisionKey === 'trash' ? 2 : 0) + checks.filter((x) => /확인|검토|check|review|確認|検討/.test(x)).length;
      countOut.textContent = formatNum(items.length);
      rinseOut.textContent = formatNum(rinseCount);
      reviewOut.textContent = formatNum(reviewCount);
      stepsOut.textContent = formatNum(checks.length + items.length);
      if (!items.length) {
        output.value = '';
        help.textContent = t.empty;
        return;
      }
      const decision = t.decision[decisionKey];
      const result = [`# ${t.title}`, '', t.summary(decision), '', `${t.checklist}:`, ...checks.map((x) => `- [ ] ${x}`)];
      const shownItems = items.slice(0, 20);
      result.push('', `${t.items}:`, ...shownItems.map((x) => `- [ ] ${x}`));
      if (items.length > shownItems.length) result.push('', t.tooMany(shownItems.length, items.length));
      if (decisionKey === 'trash' || decisionKey === 'review') result.push('', `${t.review}: ${decision}`);
      output.value = result.join('\n');
      help.textContent = t.summary(decision);
    };
    sampleBtn?.addEventListener('click', () => { itemsEl.value = t.sample; materialEl.value='plastic'; contamEl.value='rinse'; partsEl.value='possible'; placeEl.value='apartment'; if (specialEl) specialEl.value='none'; if (localNoteEl) localNoteEl.value=''; localEl.checked=true; render(); });
    runBtn?.addEventListener('click', render);
    copyBtn?.addEventListener('click', async () => { if (!output.value.trim()) return; await copyText(output.value.trim()); const old=copyBtn.textContent; copyBtn.textContent=t.copied; setTimeout(()=>{ copyBtn.textContent=old||t.copyDefault; },900); });
    [itemsEl, materialEl, contamEl, partsEl, placeEl, specialEl, localNoteEl, localEl].forEach((el) => { el?.addEventListener('input', render); el?.addEventListener('change', render); });
    render();
  }

  if (slug === 'online-return-package-checker') {
    const itemsEl = document.getElementById('orpc-items');
    const reasonEl = document.getElementById('orpc-reason');
    const daysEl = document.getElementById('orpc-days');
    const packageEl = document.getElementById('orpc-package');
    const pickupEl = document.getElementById('orpc-pickup');
    const photoEl = document.getElementById('orpc-photo');
    const runBtn = document.getElementById('orpc-run');
    const sampleBtn = document.getElementById('orpc-sample');
    const copyBtn = document.getElementById('orpc-copy');
    const clearBtn = document.getElementById('orpc-clear');
    const countOut = document.getElementById('orpc-count');
    const urgencyOut = document.getElementById('orpc-urgency');
    const photosOut = document.getElementById('orpc-photos');
    const stepsOut = document.getElementById('orpc-steps');
    const help = document.getElementById('orpc-help');
    const output = document.getElementById('orpc-output');
    if (!itemsEl || !output) return;

    const i18n = {
      ko: {
        title: '온라인 쇼핑 반품 준비 체크리스트', copied: '복사됨', copyDefault: '결과 복사', sample: '재킷\n택/라벨\n사은품 파우치', urgency: ['여유', '주의', '긴급'],
        empty: '상품이나 구성품을 1개 이상 입력해 주세요.',
        invalidDays: '남은 일수는 0~30 사이의 정수로 입력해 주세요.',
        cleared: '입력값을 초기화했습니다.',
        omitted: (n) => `긴 목록은 앞 30개만 반영했습니다. ${n}개 항목은 생략했습니다.`,
        summary: (u,d) => `반품 기한까지 ${d}일 남았습니다. 긴급도는 ${u}입니다.`,
        basics: ['쇼핑몰 반품 가능 기간과 배송비 조건 확인', '주문번호·상품명·옵션을 반품 접수 화면과 대조', '구성품을 모두 모아 누락 여부 확인'],
        photos: ['상품 전체 상태 사진 촬영', '택·라벨·구성품 사진 촬영', '포장 전 최종 구성 사진 남기기'],
        defect: ['불량·파손 부위를 가까이서 촬영', '수령 당시 박스 훼손이나 송장 사진 보관', '판매자 문의가 필요하면 증상 설명을 한 문장으로 정리'],
        wrong: ['주문한 옵션과 실제 수령 상품 차이를 캡처·사진으로 남기기', '오배송이면 사용 흔적이 생기기 전 재포장'],
        change: ['택 제거, 사용 흔적, 향수·오염 여부 확인', '단순 변심 배송비 차감 여부 확인'],
        pkg: { original: '원박스와 완충재를 최대한 그대로 사용', partial: '부족한 완충재를 신문지·에어캡 등으로 보강', none: '튼튼한 박스와 완충재를 새로 준비' },
        pickup: { pickup: '회수 방문일에 문 앞 보관 위치와 연락 가능 상태 확인', dropoff: '접수 가능한 편의점·지점과 운송장 출력 필요 여부 확인', direct: '직접 발송 주소, 택배비 선불/착불 조건 확인' },
        components: '구성품'
      },
      en: {
        title: 'Online return preparation checklist', copied: 'Copied', copyDefault: 'Copy result', sample: 'Jacket\nTag/label\nGift pouch', urgency: ['Low', 'Watch', 'Urgent'],
        empty: 'Enter at least one item or component.',
        invalidDays: 'Days left must be a whole number from 0 to 30.',
        cleared: 'Cleared the inputs.',
        omitted: (n) => `Only the first 30 non-empty lines are included. ${n} item(s) were omitted.`,
        summary: (u,d) => `${d} day(s) left before the return deadline. Urgency: ${u}.`,
        basics: ['Check the store return window and shipping-fee rules', 'Match order number, item name, and option with the return form', 'Gather every component and check for missing parts'],
        photos: ['Take a full product-condition photo', 'Photograph tags, labels, and components', 'Take one final photo before sealing the package'],
        defect: ['Photograph the defect or damage close up', 'Keep box damage and shipping-label photos if relevant', 'Write one clear sentence describing the issue'],
        wrong: ['Save proof of the ordered option versus received item', 'Repack before any use marks appear'],
        change: ['Check tag removal, use marks, scent, or stains', 'Confirm whether change-of-mind return shipping is deducted'],
        pkg: { original: 'Use the original box and padding when possible', partial: 'Add paper, bubble wrap, or padding where packaging is missing', none: 'Prepare a sturdy new box and padding' },
        pickup: { pickup: 'Confirm pickup date, door location, and reachable contact', dropoff: 'Check drop-off location and label/waybill requirements', direct: 'Confirm return address and prepaid/collect shipping rule' },
        components: 'Components'
      },
      ja: {
        title: 'オンライン返品準備チェックリスト', copied: 'コピー完了', copyDefault: '結果をコピー', sample: 'ジャケット\nタグ・ラベル\nノベルティポーチ', urgency: ['余裕', '注意', '緊急'],
        empty: '商品または付属品を1つ以上入力してください。',
        invalidDays: '残り日数は0〜30の整数で入力してください。',
        cleared: '入力をクリアしました。',
        omitted: (n) => `空でない行は先頭30件だけ反映しました。${n}件を省略しました。`,
        summary: (u,d) => `返品期限まで${d}日です。緊急度は${u}です。`,
        basics: ['ショップの返品期間と送料条件を確認', '注文番号・商品名・オプションを返品申請画面と照合', '付属品をすべて集め、欠品がないか確認'],
        photos: ['商品の全体状態を撮影', 'タグ・ラベル・付属品を撮影', '梱包前に最終構成を撮影'],
        defect: ['不良・破損部分を近くで撮影', '箱の破損や送り状写真を保存', '問い合わせ用に症状を一文で整理'],
        wrong: ['注文内容と届いた商品との差を画像で残す', '誤配送なら使用跡が付く前に再梱包'],
        change: ['タグ外れ、使用跡、におい、汚れを確認', '自己都合返品の送料差し引きを確認'],
        pkg: { original: '元箱と緩衝材をできるだけ使用', partial: '不足した緩衝材を紙やエアキャップで補強', none: '丈夫な箱と緩衝材を新しく準備' },
        pickup: { pickup: '集荷日、置き場所、連絡可能状態を確認', dropoff: '持込先と送り状・ラベルの要否を確認', direct: '返送先住所と送料の元払い/着払い条件を確認' },
        components: '付属品'
      }
    };
    const t = i18n[pageLang] || i18n.ko;
    const lines = (v) => (v || '').split(/\n+/).map((s) => s.trim().replace(/\s+/g, ' ')).filter(Boolean);
    const copyText = async (val) => { try { await navigator.clipboard.writeText(val); } catch (_) { const ta=document.createElement('textarea'); ta.value=val; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } };

    const resetStats = () => {
      countOut.textContent = '0';
      urgencyOut.textContent = '-';
      photosOut.textContent = '0';
      stepsOut.textContent = '0';
      output.value = '';
      copyBtn.disabled = true;
    };

    const render = () => {
      const allItems = lines(itemsEl.value);
      const items = allItems.slice(0, 30);
      const reason = reasonEl.value;
      const daysRaw = String(daysEl.value || '').trim();
      const days = Number(daysRaw);
      if (!allItems.length) {
        itemsEl.setAttribute('aria-invalid', 'true');
        daysEl.setAttribute('aria-invalid', 'false');
        resetStats();
        help.textContent = t.empty;
        help.dataset.state = 'error';
        return;
      }
      itemsEl.setAttribute('aria-invalid', 'false');
      if (!daysRaw || !Number.isInteger(days) || days < 0 || days > 30) {
        daysEl.setAttribute('aria-invalid', 'true');
        resetStats();
        countOut.textContent = formatNum(items.length);
        help.textContent = t.invalidDays;
        help.dataset.state = 'error';
        return;
      }
      daysEl.setAttribute('aria-invalid', 'false');
      const urgencyIndex = days <= 1 ? 2 : days <= 3 ? 1 : 0;
      const photoList = photoEl.checked ? [...t.photos] : [];
      if (photoEl.checked && reason === 'defect') photoList.push(...t.defect);
      if (photoEl.checked && reason === 'wrong') photoList.push(...t.wrong);
      const checks = [...t.basics];
      if (reason === 'change') checks.push(...t.change);
      if (reason === 'defect' && !photoEl.checked) checks.push(t.defect[2]);
      if (reason === 'wrong' && !photoEl.checked) checks.push(t.wrong[1]);
      checks.push(t.pkg[packageEl.value], t.pickup[pickupEl.value]);
      if (days <= 1) checks.unshift(pageLang === 'en' ? 'Submit the return request today before packing is delayed' : pageLang === 'ja' ? '梱包が遅れる前に今日中に返品申請を完了' : '포장이 늦어지기 전에 오늘 안에 반품 접수부터 완료');
      countOut.textContent = formatNum(items.length);
      urgencyOut.textContent = t.urgency[urgencyIndex];
      photosOut.textContent = formatNum(photoList.length);
      stepsOut.textContent = formatNum(checks.length + photoList.length + items.length);
      const parts = [`# ${t.title}`, '', t.summary(t.urgency[urgencyIndex], days), '', 'Checklist:', ...checks.map((x) => `- [ ] ${x}`)];
      if (photoList.length) parts.push('', 'Photos:', ...photoList.map((x) => `- [ ] ${x}`));
      if (items.length) parts.push('', `${t.components}:`, ...items.map((x) => `- [ ] ${x}`));
      if (allItems.length > items.length) parts.push('', `Note: ${t.omitted(allItems.length - items.length)}`);
      output.value = parts.join('\n');
      copyBtn.disabled = false;
      help.textContent = allItems.length > items.length ? `${t.summary(t.urgency[urgencyIndex], days)} ${t.omitted(allItems.length - items.length)}` : t.summary(t.urgency[urgencyIndex], days);
      help.dataset.state = 'success';
    };
    sampleBtn?.addEventListener('click', () => { itemsEl.value = t.sample; reasonEl.value='defect'; daysEl.value='2'; packageEl.value='partial'; pickupEl.value='pickup'; photoEl.checked=true; render(); itemsEl.focus(); });
    runBtn?.addEventListener('click', render);
    clearBtn?.addEventListener('click', () => { itemsEl.value = ''; daysEl.value = '3'; reasonEl.value = 'change'; packageEl.value = 'partial'; pickupEl.value = 'pickup'; photoEl.checked = true; resetStats(); help.textContent = t.cleared; help.dataset.state = ''; itemsEl.setAttribute('aria-invalid', 'false'); daysEl.setAttribute('aria-invalid', 'false'); itemsEl.focus(); });
    copyBtn?.addEventListener('click', async () => { if (!output.value.trim()) { render(); } if (!output.value.trim()) return; await copyText(output.value.trim()); const old=copyBtn.textContent; copyBtn.textContent=t.copied; setTimeout(()=>{ copyBtn.textContent=old||t.copyDefault; },900); });
    [itemsEl, reasonEl, daysEl, packageEl, pickupEl, photoEl].forEach((el) => { el?.addEventListener('input', render); el?.addEventListener('change', render); });
    render();
  }


  if (slug === 'rainy-day-outing-planner') {
    const rainEl = document.getElementById('rdop-rain');
    const windEl = document.getElementById('rdop-wind');
    const transportEl = document.getElementById('rdop-transport');
    const hoursEl = document.getElementById('rdop-hours');
    const shoesEl = document.getElementById('rdop-shoes');
    const bagEl = document.getElementById('rdop-bag');
    const itemsEl = document.getElementById('rdop-items');
    const runBtn = document.getElementById('rdop-run');
    const sampleBtn = document.getElementById('rdop-sample');
    const copyBtn = document.getElementById('rdop-copy');
    const umbrellaOut = document.getElementById('rdop-umbrella');
    const bufferOut = document.getElementById('rdop-buffer');
    const riskOut = document.getElementById('rdop-risk');
    const countOut = document.getElementById('rdop-count');
    const help = document.getElementById('rdop-help');
    const output = document.getElementById('rdop-output');
    if (!rainEl || !output) return;

    const text = {
      ko: {
        title: '비 오는 날 외출 준비 플랜', umbrella: { light: '접이식', steady: '일반 우산', heavy: '튼튼한 우산' }, risk: ['낮음', '보통', '높음'], min: '분', copied: '복사됨', copyDefault: '결과 복사', important: '중요 소지품', sample: '노트북\n계약서\n선물 쇼핑백',
        summary: (u,b,r) => `${u}을 챙기고 출발 여유시간은 ${b}분 정도로 잡으세요. 젖음 위험은 ${r}입니다.`,
        basics: ['휴대폰 배터리와 교통앱 확인', '작은 수건이나 휴지 챙기기', '젖은 우산을 넣을 비닐 또는 우산 커버 준비'],
        heavy: ['방수 외투나 여벌 겉옷 고려', '양말 여분을 가방 안쪽에 넣기', '물웅덩이가 많은 길은 피해서 동선 조정'],
        wind: ['강풍이면 큰 우산보다 튼튼한 접이식 또는 우비가 안전합니다'],
        bag: ['전자기기와 종이류는 지퍼백·파우치에 한 번 더 넣기'],
        shoes: ['젖으면 곤란한 신발은 피하고 미끄럼 적은 신발로 바꾸기'],
        transit: ['역·정류장 혼잡과 지연을 감안해 환승 시간을 넉넉히 잡기'],
        bike: ['자전거·킥보드는 미끄럼 위험이 커 대체 이동수단을 먼저 검토하기']
      },
      en: {
        title: 'Rainy day outing plan', umbrella: { light: 'folding', steady: 'regular umbrella', heavy: 'sturdy umbrella' }, risk: ['low', 'medium', 'high'], min: 'min', copied: 'Copied', copyDefault: 'Copy result', important: 'Important belongings', sample: 'Laptop\nDocuments\nGift bag',
        summary: (u,b,r) => `Bring a ${u} and leave about ${b} minutes early. Wet-risk level: ${r}.`,
        basics: ['Check phone battery and transit apps', 'Pack a small towel or tissues', 'Prepare a plastic bag or cover for a wet umbrella'],
        heavy: ['Consider a rain jacket or spare outer layer', 'Put spare socks inside the bag', 'Adjust your route to avoid puddle-heavy streets'],
        wind: ['With strong wind, a sturdy folding umbrella or raincoat is safer than a large umbrella'],
        bag: ['Put electronics and papers in an extra zip bag or pouch'],
        shoes: ['Avoid delicate shoes and switch to grippier footwear'],
        transit: ['Allow extra time for station crowds, stops, and transfers'],
        bike: ['Bike or scooter travel is slippery; check an alternate route first']
      },
      ja: {
        title: '雨の日のお出かけ準備プラン', umbrella: { light: '折りたたみ傘', steady: '普通の傘', heavy: '丈夫な傘' }, risk: ['低め', '普通', '高め'], min: '分', copied: 'コピー完了', copyDefault: '結果をコピー', important: '大事な持ち物', sample: 'ノートPC\n書類\nプレゼント',
        summary: (u,b,r) => `${u}を用意し、出発余裕は約${b}分見てください。濡れリスクは${r}です。`,
        basics: ['スマホ電池と交通アプリを確認', '小さなタオルやティッシュを入れる', '濡れた傘用の袋やカバーを準備'],
        heavy: ['レインコートや替えの上着を検討', '替えの靴下をバッグの内側へ', '水たまりの多い道を避ける'],
        wind: ['強風なら大きな傘より丈夫な折りたたみ傘やレインコートが安全です'],
        bag: ['電子機器や紙類はジッパー袋・ポーチに入れる'],
        shoes: ['濡らしたくない靴を避け、滑りにくい靴に替える'],
        transit: ['駅や停留所の混雑、乗換遅れを見込む'],
        bike: ['自転車・キックボードは滑りやすいため代替手段を確認']
      }
    };
    const t = text[pageLang] || text.ko;
    const lines = (v) => (v || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
    const copyText = async (val) => { try { await navigator.clipboard.writeText(val); } catch (_) { const ta=document.createElement('textarea'); ta.value=val; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } };

    const plan = () => {
      const rain = rainEl.value;
      const wind = windEl.value;
      const transport = transportEl.value;
      const hours = hoursEl.value;
      const shoes = shoesEl.value;
      const bag = bagEl.value;
      const items = lines(itemsEl.value);
      let risk = rain === 'heavy' ? 2 : (rain === 'steady' ? 1 : 0);
      if (wind === 'strong') risk += 1;
      if (transport === 'walk' || transport === 'bike') risk += 1;
      if (shoes === 'delicate') risk += 1;
      if (bag === 'open') risk += 1;
      risk = Math.min(2, risk);
      let buffer = 5 + (rain === 'heavy' ? 15 : rain === 'steady' ? 10 : 5) + (transport === 'transit' ? 10 : transport === 'walk' ? 8 : transport === 'bike' ? 15 : 3) + (hours === 'full' ? 5 : 0);
      const umbrella = wind === 'strong' && rain !== 'light' ? t.umbrella.heavy : t.umbrella[rain];
      umbrellaOut.textContent = umbrella;
      bufferOut.textContent = `${buffer}${t.min}`;
      riskOut.textContent = t.risk[risk];
      countOut.textContent = formatNum(items.length);
      const checklist = [...t.basics];
      if (rain === 'heavy' || hours === 'full') checklist.push(...t.heavy);
      if (wind === 'strong') checklist.push(...t.wind);
      if (bag !== 'covered' || items.length) checklist.push(...t.bag);
      if (shoes !== 'waterproof') checklist.push(...t.shoes);
      if (transport === 'transit') checklist.push(...t.transit);
      if (transport === 'bike') checklist.push(...t.bike);
      const parts = [`# ${t.title}`, '', t.summary(umbrella, buffer, t.risk[risk]), '', 'Checklist:', ...checklist.map(x => `- [ ] ${x}`)];
      if (items.length) parts.push('', `${t.important}:`, ...items.slice(0, 8).map(x => `- ${x}`));
      output.value = parts.join('\n');
      help.textContent = t.summary(umbrella, buffer, t.risk[risk]);
    };
    sampleBtn?.addEventListener('click', () => { rainEl.value='heavy'; windEl.value='strong'; transportEl.value='transit'; hoursEl.value='half'; shoesEl.value='normal'; bagEl.value='normal'; itemsEl.value=t.sample; plan(); });
    runBtn?.addEventListener('click', plan);
    copyBtn?.addEventListener('click', async () => { if (!output.value.trim()) return; await copyText(output.value.trim()); const old=copyBtn.textContent; copyBtn.textContent=t.copied; setTimeout(()=>{ copyBtn.textContent=old||t.copyDefault; },900); });
    [rainEl, windEl, transportEl, hoursEl, shoesEl, bagEl, itemsEl].forEach(el => { el?.addEventListener('input', plan); el?.addEventListener('change', plan); });
    plan();
  }

  if (slug === 'after-work-routine-picker') {
    const timeEl = document.getElementById('awrp-time');
    const energyEl = document.getElementById('awrp-energy');
    const moodEl = document.getElementById('awrp-mood');
    const goalEl = document.getElementById('awrp-goal');
    const tasksEl = document.getElementById('awrp-tasks');
    const softEl = document.getElementById('awrp-soft-start');
    const restEl = document.getElementById('awrp-include-rest');
    const runBtn = document.getElementById('awrp-run');
    const sampleBtn = document.getElementById('awrp-sample');
    const copyBtn = document.getElementById('awrp-copy');
    const energyOut = document.getElementById('awrp-energy-out');
    const taskCount = document.getElementById('awrp-task-count');
    const topType = document.getElementById('awrp-top-type');
    const loadOut = document.getElementById('awrp-load');
    const help = document.getElementById('awrp-help');
    const output = document.getElementById('awrp-output');
    if (!timeEl || !energyEl || !output) return;

    const i18n = {
      ko: {
        names: { rest: '회복 루틴', chores: '처리 루틴', move: '가벼운 운동 루틴', focus: '집중 루틴', hobby: '취미 루틴' },
        load: ['낮음', '보통', '높음'], title: '오늘 밤 추천 루틴', top: '1순위', alternatives: '다른 후보', copied: '복사됨', copyDefault: '결과 복사', mustDo: '필수 작업',
        summary: (name, min, energy, tasks) => `${name}을 추천해요. ${min}분 안에서 시작하고, 현재 에너지 ${energy}/5와 필수 작업 ${tasks}개를 반영했습니다.`,
        sampleTasks: '메일 답장\n빨래 돌리기\n내일 가방 챙기기',
        steps: {
          rest: ['물 마시고 샤워 또는 세안으로 전환하기', '휴대폰 알림을 줄이고 20분 쉬기', '내일 아침을 편하게 할 준비 1가지만 하기'],
          chores: ['가장 짧은 필수 작업 1개부터 끝내기', '빨래·정리처럼 손을 움직이는 일을 25분 처리하기', '남은 일은 내일 목록으로 분리하기'],
          move: ['5분 스트레칭으로 몸 풀기', '산책·홈트·요가 중 하나를 20~30분 하기', '샤워 후 화면 밝기를 낮추고 마무리하기'],
          focus: ['책상 위를 3분 정리하기', '뽀모도로 1세트로 공부·사이드프로젝트 진행하기', '다음 행동 1줄만 적고 종료하기'],
          hobby: ['하고 싶은 콘텐츠나 취미를 하나만 고르기', '타이머를 맞추고 죄책감 없이 즐기기', '잠들기 30분 전에는 마무리 루틴으로 전환하기']
        }
      },
      en: {
        names: { rest: 'recovery routine', chores: 'clear-the-list routine', move: 'light movement routine', focus: 'focus routine', hobby: 'hobby routine' },
        load: ['low', 'medium', 'high'], title: 'Tonight\'s routine pick', top: 'Top pick', alternatives: 'Other options', copied: 'Copied', copyDefault: 'Copy result', mustDo: 'Must-do',
        summary: (name, min, energy, tasks) => `Recommended: ${name}. It fits within ${min} minutes and reflects energy ${energy}/5 plus ${tasks} must-do task(s).`,
        sampleTasks: 'Reply to email\nStart laundry\nPack tomorrow\'s bag',
        steps: {
          rest: ['Drink water and switch out of work mode', 'Reduce notifications and rest for 20 minutes', 'Do one small thing that makes tomorrow easier'],
          chores: ['Finish the shortest must-do task first', 'Handle laundry or cleanup for 25 minutes', 'Move the rest into tomorrow\'s list'],
          move: ['Warm up with 5 minutes of stretching', 'Walk, do a home workout, or try gentle yoga for 20–30 minutes', 'Shower and lower screen brightness afterward'],
          focus: ['Clear your desk for 3 minutes', 'Run one Pomodoro for study or a side project', 'Write one next action before stopping'],
          hobby: ['Choose one hobby or piece of content', 'Set a timer and enjoy it without guilt', 'Switch to wind-down mode 30 minutes before sleep']
        }
      },
      ja: {
        names: { rest: '回復ルーティン', chores: 'タスク処理ルーティン', move: '軽い運動ルーティン', focus: '集中ルーティン', hobby: '趣味ルーティン' },
        load: ['低め', '普通', '高め'], title: '今夜のおすすめルーティン', top: '1番おすすめ', alternatives: '他の候補', copied: 'コピー完了', copyDefault: '結果をコピー', mustDo: '必須タスク',
        summary: (name, min, energy, tasks) => `${name}がおすすめです。${min}分以内で始められ、元気度${energy}/5と必須タスク${tasks}件を反映しました。`,
        sampleTasks: 'メール返信\n洗濯\n明日の準備',
        steps: {
          rest: ['水を飲んで仕事モードを切り替える', '通知を減らして20分休む', '明日の朝が楽になる準備を1つだけする'],
          chores: ['一番短い必須タスクから終わらせる', '洗濯や片付けを25分だけ進める', '残りは明日のリストへ分ける'],
          move: ['5分ストレッチで体をほぐす', '散歩・自宅運動・ヨガを20〜30分する', 'シャワー後に画面の明るさを下げる'],
          focus: ['机を3分片付ける', 'ポモドーロ1セットで勉強や作業を進める', '次の行動を1行書いて終える'],
          hobby: ['趣味やコンテンツを1つだけ選ぶ', 'タイマーをセットして罪悪感なく楽しむ', '寝る30分前にクールダウンへ切り替える']
        }
      }
    };
    const t = i18n[pageLang] || i18n.ko;
    const lines = (v) => (v || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    };

    const score = () => {
      const min = Number(timeEl.value || 60);
      const energy = Number(energyEl.value || 3);
      const tasks = lines(tasksEl.value);
      const taskLoad = tasks.length >= 3 ? 2 : (tasks.length >= 1 ? 1 : 0);
      const mood = moodEl.value;
      const goal = goalEl.value;
      const scores = { rest: 20, chores: 20, move: 20, focus: 20, hobby: 20 };
      if (energy <= 2) { scores.rest += 35; scores.move -= 8; scores.focus -= 10; }
      if (energy >= 4) { scores.move += 18; scores.focus += 12; scores.chores += 8; }
      if (min <= 30) { scores.rest += 12; scores.chores += 8; scores.focus -= 8; }
      if (min >= 90) { scores.focus += 10; scores.hobby += 10; scores.move += 8; }
      if (taskLoad === 1) scores.chores += 18;
      if (taskLoad === 2) { scores.chores += 28; scores.rest += 10; }
      if (mood === 'tired') scores.rest += 24;
      if (mood === 'restless') scores.move += 24;
      if (mood === 'focused') scores.focus += 24;
      if (goal === 'recover') scores.rest += 32;
      if (goal === 'clear') scores.chores += 28;
      if (goal === 'grow') scores.focus += 28;
      if (goal === 'enjoy') scores.hobby += 30;
      if (softEl?.checked) { scores.rest += 5; scores.chores += 3; }
      if (restEl?.checked && goal !== 'recover') scores.rest += 8;
      return { min, energy, tasks, taskLoad, ranked: Object.entries(scores).sort((a,b) => b[1] - a[1]) };
    };

    const render = () => {
      const { min, energy, tasks, taskLoad, ranked } = score();
      const top = ranked[0][0];
      energyOut.textContent = `${energy}/5`;
      taskCount.textContent = formatNum(tasks.length);
      topType.textContent = t.names[top];
      loadOut.textContent = t.load[taskLoad];
      const stepMin = min <= 30 ? '30' : (min <= 60 ? '45–60' : '60–90');
      const parts = [`# ${t.title}`, `${t.top}: ${t.names[top]}`, '', t.summary(t.names[top], stepMin, energy, tasks.length), '', ...t.steps[top].map((s, i) => `${i + 1}. ${s}`)];
      if (tasks.length) parts.push('', `${t.mustDo}:`, ...tasks.slice(0, 6).map(x => `- ${x}`));
      parts.push('', `${t.alternatives}: ${ranked.slice(1, 4).map(([k]) => t.names[k]).join(' / ')}`);
      output.value = parts.join('\n');
      help.textContent = t.summary(t.names[top], stepMin, energy, tasks.length);
    };

    sampleBtn?.addEventListener('click', () => { tasksEl.value = t.sampleTasks; energyEl.value = '2'; moodEl.value = 'tired'; goalEl.value = 'recover'; render(); });
    runBtn?.addEventListener('click', render);
    copyBtn?.addEventListener('click', async () => { if (!output.value.trim()) return; await copyText(output.value.trim()); const old = copyBtn.textContent; copyBtn.textContent = t.copied; setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900); });
    [timeEl, energyEl, moodEl, goalEl, tasksEl, softEl, restEl].forEach(el => { el?.addEventListener('input', render); el?.addEventListener('change', render); });
    render();
  }

  if (slug === 'household-chore-picker') {
    const peopleEl = document.getElementById('hcp-people');
    const choresEl = document.getElementById('hcp-chores');
    const modeEl = document.getElementById('hcp-mode');
    const intensityEl = document.getElementById('hcp-intensity');
    const fairnessEl = document.getElementById('hcp-fairness');
    const checklistEl = document.getElementById('hcp-copy-format');
    const runBtn = document.getElementById('hcp-run');
    const sampleBtn = document.getElementById('hcp-sample');
    const copyBtn = document.getElementById('hcp-copy');
    const peopleCount = document.getElementById('hcp-people-count');
    const choreCount = document.getElementById('hcp-chore-count');
    const heavyCount = document.getElementById('hcp-heavy-count');
    const modeOut = document.getElementById('hcp-mode-out');
    const help = document.getElementById('hcp-help');
    const output = document.getElementById('hcp-output');
    if (!peopleEl || !choresEl || !modeEl || !output) return;

    const i18n = {
      ko: {
        title: '집안일 분담표', idle: '참여자와 집안일을 넣으면 채팅에 바로 붙일 수 있는 분담표를 만듭니다.', need: '참여자 2명 이상과 집안일 1개 이상을 입력하세요.',
        balanced: '균형', random: '랜덤', rotate: '로테이션', none: '(없음)', note: '메모', fairness: '이번 분담은 개수 균형을 우선으로 만든 초안입니다. 지난번에 힘든 일을 맡은 사람이 있다면 한 번 더 바꿔보세요.', copied: '복사됨', copyDefault: '결과 복사',
        samplePeople: ['수야', '민지', '현우'], sampleChores: ['설거지', '거실 청소', '분리수거', '욕실 청소', '빨래 개기', '음식물 쓰레기 버리기'],
        resultLine: (person, chores, checklist) => `${person}\n${chores.map(c => `${checklist ? '- [ ]' : '-'} ${c}`).join('\n')}`,
        summary: (p,c,h,m) => `${p}명이 ${c}개 집안일을 나눴습니다. ${h}개는 힘든 일로 보고 분산을 시도했습니다. (${m})`
      },
      en: {
        title: 'Household chore assignment', idle: 'Enter people and chores, then pick an assignment list you can paste into chat.', need: 'Enter at least 2 people and 1 chore.',
        balanced: 'Balanced', random: 'Random', rotate: 'Rotation', none: '(none)', note: 'Note', fairness: 'This is a balanced draft. If someone handled the hard tasks last time, swap one item before confirming.', copied: 'Copied', copyDefault: 'Copy result',
        samplePeople: ['Alex', 'Jamie', 'Taylor'], sampleChores: ['Dishes', 'Vacuum living room', 'Recycling', 'Clean bathroom', 'Fold laundry', 'Take out food waste'],
        resultLine: (person, chores, checklist) => `${person}\n${chores.map(c => `${checklist ? '- [ ]' : '-'} ${c}`).join('\n')}`,
        summary: (p,c,h,m) => `${p} people split ${c} chores. ${h} task(s) were treated as heavy and spread where possible. (${m})`
      },
      ja: {
        title: '家事分担表', idle: 'メンバーと家事を入力すると、チャットに貼れる分担表を作れます。', need: 'メンバー2人以上と家事1件以上を入力してください。',
        balanced: '均等', random: 'ランダム', rotate: 'ローテーション', none: '(なし)', note: 'メモ', fairness: 'これは件数バランスを優先した下書きです。前回大変な家事を担当した人がいれば、確定前に1つ入れ替えてください。', copied: 'コピー完了', copyDefault: '結果をコピー',
        samplePeople: ['みな', 'けん', 'ゆい'], sampleChores: ['皿洗い', 'リビング掃除', '資源ごみ', '浴室掃除', '洗濯物たたみ', '生ごみ出し'],
        resultLine: (person, chores, checklist) => `${person}\n${chores.map(c => `${checklist ? '- [ ]' : '-'} ${c}`).join('\n')}`,
        summary: (p,c,h,m) => `${p}人で${c}件の家事を分担しました。${h}件は重い家事としてできるだけ分散しました。(${m})`
      }
    };
    const t = i18n[pageLang] || i18n.ko;
    const heavyWords = /청소|욕실|화장실|쓰레기|분리수거|laundry|bath|trash|vacuum|clean|recycling|掃除|浴室|ゴミ|ごみ|洗濯/iu;
    const lines = (v) => (v || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
    const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a,b) => a[0] - b[0]).map(([,v]) => v);
    const modeLabel = () => modeEl.value === 'random' ? t.random : (modeEl.value === 'rotate' ? t.rotate : t.balanced);

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
    };

    const assign = () => {
      const people = lines(peopleEl.value);
      let chores = lines(choresEl.value);
      const heavy = chores.filter(c => heavyWords.test(c));
      peopleCount.textContent = formatNum(people.length);
      choreCount.textContent = formatNum(chores.length);
      heavyCount.textContent = formatNum(heavy.length);
      modeOut.textContent = modeLabel();
      if (people.length < 2 || chores.length < 1) {
        output.value = '';
        help.textContent = t.need;
        return;
      }
      const buckets = people.map(name => ({ name, chores: [], heavy: 0 }));
      if (modeEl.value === 'random') chores = shuffle(chores);
      if (modeEl.value === 'balanced') chores = shuffle(chores).sort((a,b) => Number(heavyWords.test(b)) - Number(heavyWords.test(a)));

      chores.forEach((chore, idx) => {
        const isHeavy = heavyWords.test(chore);
        let target;
        if (modeEl.value === 'rotate') {
          target = buckets[idx % buckets.length];
        } else if (modeEl.value === 'balanced') {
          const sorted = [...buckets].sort((a,b) => {
            if (intensityEl?.value === 'spread' && isHeavy && a.heavy !== b.heavy) return a.heavy - b.heavy;
            if (a.chores.length !== b.chores.length) return a.chores.length - b.chores.length;
            return Math.random() - 0.5;
          });
          target = sorted[0];
        } else {
          target = buckets[Math.floor(Math.random() * buckets.length)];
        }
        target.chores.push(chore);
        if (isHeavy) target.heavy += 1;
      });

      const checklist = !!checklistEl?.checked;
      const parts = [`# ${t.title}`, ...buckets.map(b => t.resultLine(b.name, b.chores.length ? b.chores : [t.none], checklist))];
      if (fairnessEl?.checked) parts.push(`${t.note}: ${t.fairness}`);
      output.value = parts.join('\n\n');
      help.textContent = t.summary(people.length, chores.length, heavy.length, modeLabel());
    };

    sampleBtn?.addEventListener('click', () => {
      peopleEl.value = t.samplePeople.join('\n');
      choresEl.value = t.sampleChores.join('\n');
      assign();
    });
    runBtn?.addEventListener('click', assign);
    copyBtn?.addEventListener('click', async () => {
      if (!output.value.trim()) return;
      await copyText(output.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = t.copied;
      setTimeout(() => { copyBtn.textContent = old || t.copyDefault; }, 900);
    });
    [peopleEl, choresEl, modeEl, intensityEl, fairnessEl, checklistEl].forEach(el => {
      el?.addEventListener('input', assign);
      el?.addEventListener('change', assign);
    });
    help.textContent = t.idle;
    assign();
  }





  if (slug === 'list-format-converter') {
    const input = document.getElementById('lfc-input');
    const format = document.getElementById('lfc-format');
    const header = document.getElementById('lfc-header');
    const trim = document.getElementById('lfc-trim');
    const blank = document.getElementById('lfc-blank');
    const dedupe = document.getElementById('lfc-dedupe');
    const runBtn = document.getElementById('lfc-run');
    const sampleBtn = document.getElementById('lfc-sample');
    const copyBtn = document.getElementById('lfc-copy');
    const output = document.getElementById('lfc-output');
    const summary = document.getElementById('lfc-summary');
    const countEl = document.getElementById('lfc-count');
    const removedEl = document.getElementById('lfc-removed');
    const charsEl = document.getElementById('lfc-chars');
    if (!input || !output) return;

    const lfcText = {
      ko: {
        sample: '회의 안건 정리\n신규 기능 QA\n고객 피드백 검토\n배포 체크리스트 확인\n회의 안건 정리',
        copied: '변환 결과를 클립보드에 복사했어요.',
        fallback: '복사가 지원되지 않으면 결과 영역을 직접 선택해 복사하세요.',
        empty: '변환할 목록을 입력하세요.',
        done: (count, removed, label) => `${count}개 항목을 ${label} 형식으로 변환했습니다. 제외된 줄: ${removed}개`,
        labels: { csv: 'CSV', markdown: '마크다운 표', json: 'JSON 배열', numbered: '번호 목록' }
      },
      en: {
        sample: 'Meeting agenda cleanup\nNew feature QA\nCustomer feedback review\nRelease checklist\nMeeting agenda cleanup',
        copied: 'Converted result copied to the clipboard.',
        fallback: 'If copying is not supported, select the result and copy it manually.',
        empty: 'Enter a list to convert.',
        done: (count, removed, label) => `Converted ${count} items to ${label}. Removed lines: ${removed}`,
        labels: { csv: 'CSV', markdown: 'Markdown table', json: 'JSON array', numbered: 'numbered list' }
      },
      ja: {
        sample: '会議アジェンダ整理\n新機能QA\n顧客フィードバック確認\nリリースチェックリスト\n会議アジェンダ整理',
        copied: '変換結果をクリップボードにコピーしました。',
        fallback: 'コピーできない場合は結果欄を選択して手動でコピーしてください。',
        empty: '変換するリストを入力してください。',
        done: (count, removed, label) => `${count}件を${label}形式に変換しました。除外行: ${removed}件`,
        labels: { csv: 'CSV', markdown: 'Markdown表', json: 'JSON配列', numbered: '番号付きリスト' }
      }
    }[pageLang] || null;

    const csvEscape = (value) => {
      const text = String(value ?? '');
      return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };

    const normalizeHeader = () => (header?.value || (pageLang === 'ja' ? '項目' : pageLang === 'en' ? 'item' : '항목')).trim() || 'item';

    const getItems = () => {
      const raw = (input.value || '').split(/\r?\n/);
      let items = raw.map(line => trim?.checked ? line.trim() : line);
      if (blank?.checked) items = items.filter(line => line.length > 0);
      const beforeDedupe = items.length;
      if (dedupe?.checked) {
        const seen = new Set();
        items = items.filter(line => {
          const key = line.trim();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
      const blankRemoved = blank?.checked ? raw.length - raw.map(line => trim?.checked ? line.trim() : line).filter(line => line.length > 0).length : 0;
      const duplicateRemoved = beforeDedupe - items.length;
      return { items, removed: Math.max(0, blankRemoved + duplicateRemoved) };
    };

    const convert = () => {
      const { items, removed } = getItems();
      const h = normalizeHeader();
      let result = '';
      if (!items.length) {
        summary.textContent = lfcText.empty;
      } else if (format.value === 'csv') {
        result = [csvEscape(h), ...items.map(csvEscape)].join('\n');
      } else if (format.value === 'markdown') {
        result = [`| ${h} |`, '| --- |', ...items.map(item => `| ${item.replace(/\|/g, '\\|')} |`)].join('\n');
      } else if (format.value === 'json') {
        result = JSON.stringify(items, null, 2);
      } else {
        result = items.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
      }
      output.value = result;
      countEl.textContent = formatNum(items.length);
      removedEl.textContent = formatNum(removed);
      charsEl.textContent = formatNum(result.length);
      if (items.length) summary.textContent = lfcText.done(items.length, removed, lfcText.labels[format.value] || format.value);
    };

    runBtn?.addEventListener('click', convert);
    [format, header, trim, blank, dedupe].forEach(el => el?.addEventListener('input', convert));
    input.addEventListener('input', convert);
    sampleBtn?.addEventListener('click', () => { input.value = lfcText.sample; convert(); });
    copyBtn?.addEventListener('click', async () => {
      if (!output.value) convert();
      try {
        await navigator.clipboard.writeText(output.value || '');
        summary.textContent = lfcText.copied;
      } catch (_) {
        output.focus(); output.select(); summary.textContent = lfcText.fallback;
      }
    });
    convert();
  }

  if (slug === 'group-announcement-generator') {
    const $ = (id) => document.getElementById(id);
    const titleEl = $('gag-title');
    const toneEl = $('gag-tone');
    const dateEl = $('gag-date');
    const placeEl = $('gag-place');
    const bringEl = $('gag-bring');
    const rsvpEl = $('gag-rsvp');
    const noteEl = $('gag-note');
    const runBtn = $('gag-run');
    const sampleBtn = $('gag-sample');
    const copyBtn = $('gag-copy');
    const output = $('gag-output');
    const summary = $('gag-summary');
    const linesEl = $('gag-lines');
    const charsEl = $('gag-chars');
    const filledEl = $('gag-filled');
    if (!titleEl || !output) return;

    const i18n = {
      ko: {
        sample: { title:'금요일 팀 저녁 모임', date:'5월 22일 금요일 저녁 7시', place:'강남역 3번 출구 근처 한식당', bring:'개인 우산, 편한 복장', rsvp:'수요일 오후 6시까지 참석 여부 회신', note:'예약 인원 확인이 필요해서 불참/지각 예정이면 미리 알려주세요. 1인 예상 비용은 2만 원대입니다.' },
        copied:'공지 문구를 복사했어요.', ready:'공지 문구를 만들었어요. 보내기 전 날짜와 장소를 한 번 더 확인하세요.',
        labels:{ date:'일시', place:'장소', bring:'준비물', rsvp:'회신', note:'안내' },
        friendly:(v, lines)=>[`📢 ${v.title || '모임 공지'} 안내드려요!`, ...lines, '참석하시는 분들은 확인 부탁드려요 🙂'].join('\n'),
        polite:(v, lines)=>[`[${v.title || '모임'} 안내]`, ...lines, '위 내용 확인 부탁드립니다. 변경 사항이 있으면 다시 안내드리겠습니다.'].join('\n'),
        reminder:(v, lines)=>[`⏰ ${v.title || '모임'} 리마인더`, ...lines, '늦지 않게 확인 부탁드려요!'].join('\n')
      },
      en: {
        sample: { title:'Friday team dinner', date:'Friday, May 22 at 7 PM', place:'Korean restaurant near Gangnam Station Exit 3', bring:'Umbrella, comfortable clothes', rsvp:'Please reply by Wednesday 6 PM', note:'We need to confirm the reservation count. Please tell us early if you cannot join or will be late.' },
        copied:'Announcement copied.', ready:'Announcement generated. Check the date and place before sending.',
        labels:{ date:'When', place:'Where', bring:'Bring', rsvp:'RSVP', note:'Note' },
        friendly:(v, lines)=>[`📢 ${v.title || 'Group event'} notice!`, ...lines, 'Please check and reply when you can 🙂'].join('\n'),
        polite:(v, lines)=>[`[${v.title || 'Group event'} Notice]`, ...lines, 'Please review the details above. We will share updates if anything changes.'].join('\n'),
        reminder:(v, lines)=>[`⏰ ${v.title || 'Group event'} reminder`, ...lines, 'Please check before you head out!'].join('\n')
      },
      ja: {
        sample: { title:'金曜の食事会', date:'5月22日（金）19:00', place:'駅前のレストラン', bring:'傘、楽な服装', rsvp:'水曜18時までに出欠返信', note:'予約人数を確認したいので、欠席や遅れる場合は早めに知らせてください。' },
        copied:'お知らせ文をコピーしました。', ready:'お知らせ文を作成しました。送信前に日時と場所を確認してください。',
        labels:{ date:'日時', place:'場所', bring:'持ち物', rsvp:'返信', note:'案内' },
        friendly:(v, lines)=>[`📢 ${v.title || '集まり'}のお知らせです！`, ...lines, '参加する方は確認をお願いします 🙂'].join('\n'),
        polite:(v, lines)=>[`[${v.title || '集まり'}のお知らせ]`, ...lines, '上記内容をご確認ください。変更があれば改めて案内します。'].join('\n'),
        reminder:(v, lines)=>[`⏰ ${v.title || '集まり'}リマインダー`, ...lines, '忘れずにご確認ください！'].join('\n')
      }
    }[pageLang] || null;
    const t = i18n || {};
    const getValues = () => ({ title:titleEl.value.trim(), date:dateEl.value.trim(), place:placeEl.value.trim(), bring:bringEl.value.trim(), rsvp:rsvpEl.value.trim(), note:noteEl.value.trim() });
    const makeLines = (v) => {
      const rows = [];
      if (v.date) rows.push(`- ${t.labels.date}: ${v.date}`);
      if (v.place) rows.push(`- ${t.labels.place}: ${v.place}`);
      if (v.bring) rows.push(`- ${t.labels.bring}: ${v.bring}`);
      if (v.rsvp) rows.push(`- ${t.labels.rsvp}: ${v.rsvp}`);
      if (v.note) rows.push(`- ${t.labels.note}: ${v.note}`);
      return rows;
    };
    const render = () => {
      const v = getValues();
      const lines = makeLines(v);
      const tone = toneEl.value || 'friendly';
      output.value = (t[tone] || t.friendly)(v, lines.length ? lines : [`- ${t.labels.note}: ${v.note || ''}`]);
      const nonEmpty = Object.values(v).filter(Boolean).length;
      linesEl.textContent = formatNum(output.value.split('\n').filter(Boolean).length);
      charsEl.textContent = formatNum(output.value.length);
      filledEl.textContent = formatNum(nonEmpty);
      summary.textContent = t.ready;
    };
    sampleBtn?.addEventListener('click', () => {
      const s = t.sample;
      titleEl.value = s.title; dateEl.value = s.date; placeEl.value = s.place; bringEl.value = s.bring; rsvpEl.value = s.rsvp; noteEl.value = s.note;
      render();
    });
    runBtn?.addEventListener('click', render);
    [titleEl, toneEl, dateEl, placeEl, bringEl, rsvpEl, noteEl].forEach(el => {
      el?.addEventListener('input', render);
      el?.addEventListener('change', render);
    });
    copyBtn?.addEventListener('click', async () => {
      render();
      try { await navigator.clipboard.writeText(output.value || ''); summary.textContent = t.copied; } catch (e) {}
    });
    if (!titleEl.value) sampleBtn?.click(); else render();
  }

  if (slug === 'grocery-budget-checker') {
    const budgetEl = document.getElementById('gbc-budget');
    const modeEl = document.getElementById('gbc-mode');
    const input = document.getElementById('gbc-input');
    const runBtn = document.getElementById('gbc-run');
    const sampleBtn = document.getElementById('gbc-sample');
    const copyBtn = document.getElementById('gbc-copy');
    const clearBtn = document.getElementById('gbc-clear');
    const totalEl = document.getElementById('gbc-total');
    const essentialEl = document.getElementById('gbc-essential');
    const optionalEl = document.getElementById('gbc-optional');
    const gapEl = document.getElementById('gbc-gap');
    const summary = document.getElementById('gbc-summary');
    const output = document.getElementById('gbc-output');
    if (!budgetEl || !input) return;

    const i18n = {
      ko: {
        sample: '쌀 10kg 32900 필수\n우유 3200 필수\n달걀 7800 필수\n샐러드채소 4500 선택\n과자 2500 선택\n세제 8900 보류\n행사 냉동식품 12900 나중',
        over: (n) => `예산보다 ${formatNum(n)}원 초과했어요. 선택/보류 품목부터 줄여보세요.`,
        left: (n) => `예산 안에 들어와요. 약 ${formatNum(n)}원 여유가 있습니다.`,
        exact: '예산에 정확히 맞았습니다. 결제 전 가격 변동만 한 번 더 확인하세요.',
        empty: '장보기 목록을 한 줄에 하나씩 입력해 주세요.',
        invalidBudget: '예산은 0원 이상 100,000,000원 이하의 정수로 입력해 주세요.',
        tooMany: '품목은 최대 200줄까지 점검할 수 있어요. 목록을 나눠서 확인해 주세요.',
        invalidPrice: (count) => `가격 형식이 애매한 줄 ${formatNum(count)}개는 합계에서 제외했어요. 정수 가격으로 고쳐주세요.`,
        noPricedItems: '가격이 있는 품목이 없습니다. 예상 가격을 함께 입력하면 예산을 점검할 수 있어요.',
        noPrice: '가격 없음', must: '필수', optional: '선택/보류', normal: '일반', cut: '줄일 후보', keep: '구매 유지 후보', unpriced: '가격 확인 필요', copied: '결과를 복사했어요.', copyEmpty: '복사할 점검 결과가 없습니다.', copyFail: '자동 복사를 사용할 수 없습니다.', cleared: '입력값을 초기화했습니다.'
      },
      en: {
        sample: 'Rice 32900 must\nMilk 3200 must\nEggs 7800 must\nSalad greens 4500 optional\nSnack 2500 optional\nDetergent 8900 later\nFrozen meal deal 12900 later',
        over: (n) => `You are over budget by ${formatNum(n)}. Cut optional/later items first.`,
        left: (n) => `This fits your budget with about ${formatNum(n)} left.`,
        exact: 'This exactly matches your budget. Check final prices once before checkout.',
        empty: 'Enter one grocery item per line.',
        invalidBudget: 'Enter a whole-number budget from 0 to 100,000,000.',
        tooMany: 'Check up to 200 item lines at a time. Split longer lists into smaller batches.',
        invalidPrice: (count) => `${formatNum(count)} lines have unclear prices and were excluded from totals. Use whole-number prices.`,
        noPricedItems: 'No priced items were found. Add estimated prices to check the budget.',
        noPrice: 'no price', must: 'must-buy', optional: 'optional/later', normal: 'regular', cut: 'cut candidates', keep: 'keep candidates', unpriced: 'needs price check', copied: 'Result copied.', copyEmpty: 'There is no budget check result to copy yet.', copyFail: 'Automatic copy is unavailable.', cleared: 'Cleared the inputs.'
      },
      ja: {
        sample: '米 32900 必須\n牛乳 3200 必須\n卵 7800 必須\nサラダ野菜 4500 任意\nお菓子 2500 任意\n洗剤 8900 あとで\n冷凍食品セール 12900 あとで',
        over: (n) => `予算を${formatNum(n)}超えています。任意・あとで項目から減らしましょう。`,
        left: (n) => `予算内です。約${formatNum(n)}の余裕があります。`,
        exact: '予算とちょうど一致しています。会計前に価格変動だけ確認しましょう。',
        empty: '買い物リストを1行に1品目ずつ入力してください。',
        invalidBudget: '予算は0以上100,000,000以下の整数で入力してください。',
        tooMany: '品目は最大200行まで確認できます。長いリストは分けてください。',
        invalidPrice: (count) => `価格が曖昧な行${formatNum(count)}件は合計から除外しました。整数価格に直してください。`,
        noPricedItems: '価格のある品目がありません。予想価格を入れると予算を確認できます。',
        noPrice: '価格なし', must: '必須', optional: '任意/あとで', normal: '通常', cut: '削減候補', keep: '購入候補', unpriced: '価格確認が必要', copied: '結果をコピーしました。', copyEmpty: 'コピーできる確認結果がまだありません。', copyFail: '自動コピーを利用できません。', cleared: '入力をクリアしました。'
      }
    }[pageLang] || null;
    const t = i18n || { sample: '', over: (n) => `${n}`, left: (n) => `${n}`, noPrice: 'no price', must: 'must', optional: 'optional', normal: 'normal', cut: 'cut', keep: 'keep', copied: 'copied' };
    const currency = pageLang === 'en' ? ' KRW' : (pageLang === 'ja' ? '円' : '원');
    const money = (n) => `${formatNum(n)}${currency}`;
    const mustRe = /(필수|꼭|반드시|must|essential|必須|必要)/i;
    const optionalRe = /(선택|보류|나중|옵션|optional|later|hold|任意|あとで|保留)/i;
    let currentOutput = '';

    const setStatus = (message, state = '') => {
      summary.textContent = message;
      summary.dataset.state = state;
    };
    const resetStats = () => {
      totalEl.textContent = money(0);
      essentialEl.textContent = money(0);
      optionalEl.textContent = money(0);
      gapEl.textContent = money(0);
      output.value = '';
      currentOutput = '';
      copyBtn.disabled = true;
    };
    const parsePriceToken = (token) => {
      const cleaned = token.replace(/[₩￦원円\s]/gi, '');
      if (!/^\d{1,3}(,\d{3})*$|^\d+$/.test(cleaned)) return { value: 0, invalid: true };
      const value = Number(cleaned.replace(/,/g, ''));
      if (!Number.isSafeInteger(value) || value < 0 || value > 100000000) return { value: 0, invalid: true };
      return { value, invalid: false };
    };
    const parse = () => {
      const lines = input.value.split(/\r\n|\r|\n/).map(raw => raw.trim()).filter(Boolean);
      const limitedLines = lines.slice(0, 200);
      const items = limitedLines.map((line) => {
        const nums = [...line.matchAll(/(?:₩|￦)?\s*\d[\d,.]*(?:\s*(?:원|krw|円))?/gi)];
        const last = nums[nums.length - 1];
        const parsed = last ? parsePriceToken(last[0]) : { value: 0, invalid: false };
        let name = line;
        if (last) name = line.replace(last[0], '').trim().replace(/[-–—:,]+$/, '').trim();
        const type = mustRe.test(line) ? 'must' : (optionalRe.test(line) ? 'optional' : 'normal');
        name = name.replace(mustRe, '').replace(optionalRe, '').trim().replace(/\s{2,}/g, ' ') || line;
        return { raw: line, name, price: parsed.value, type, hasPrice: Boolean(last) && !parsed.invalid, invalidPrice: Boolean(last) && parsed.invalid };
      });
      return { items, omitted: Math.max(0, lines.length - limitedLines.length) };
    };

    const render = () => {
      const rawBudget = budgetEl.value.trim();
      const budget = Number(rawBudget || 0);
      if (rawBudget && (!Number.isSafeInteger(budget) || budget < 0 || budget > 100000000)) {
        budgetEl.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-invalid', 'false');
        resetStats();
        setStatus(t.invalidBudget, 'error');
        return;
      }
      budgetEl.setAttribute('aria-invalid', 'false');
      const { items, omitted } = parse();
      if (!items.length) {
        input.setAttribute('aria-invalid', 'true');
        resetStats();
        setStatus(t.empty, 'error');
        return;
      }
      input.setAttribute('aria-invalid', 'false');
      const totals = items.reduce((a, it) => {
        a.total += it.price;
        if (it.type === 'must') a.must += it.price;
        if (it.type === 'optional') a.optional += it.price;
        if (it.hasPrice) a.priced += 1;
        if (it.invalidPrice) a.invalid += 1;
        return a;
      }, { total: 0, must: 0, optional: 0, priced: 0, invalid: 0 });
      const gap = budget - totals.total;
      totalEl.textContent = money(totals.total);
      essentialEl.textContent = money(totals.must);
      optionalEl.textContent = money(totals.optional);
      gapEl.textContent = gap >= 0 ? `+${money(gap)}` : `-${money(Math.abs(gap))}`;
      if (omitted > 0) setStatus(t.tooMany, 'warning');
      else if (totals.invalid > 0) setStatus(t.invalidPrice(totals.invalid), 'warning');
      else if (!totals.priced) setStatus(t.noPricedItems, 'warning');
      else if (gap > 0) setStatus(t.left(gap), 'success');
      else if (gap === 0) setStatus(t.exact, 'success');
      else setStatus(t.over(Math.abs(gap)), 'warning');

      const sorted = [...items].sort((a, b) => {
        if ((modeEl.value || 'optional') === 'expensive') return b.price - a.price;
        const rank = { optional: 0, normal: 1, must: 2 };
        return (rank[a.type] - rank[b.type]) || (b.price - a.price);
      });
      const cut = sorted.filter(it => it.type !== 'must' && it.hasPrice).slice(0, 6);
      const keep = items.filter(it => it.type === 'must').concat(items.filter(it => it.type === 'normal')).slice(0, 12);
      const unpriced = items.filter(it => !it.hasPrice).slice(0, 8);
      const label = (it) => it.type === 'must' ? t.must : (it.type === 'optional' ? t.optional : t.normal);
      const line = (it) => `- [${label(it)}] ${it.name} · ${it.price ? money(it.price) : t.noPrice}`;
      currentOutput = [
        `${summary.textContent}`,
        ``,
        `${t.keep}`,
        ...(keep.length ? keep.map(line) : ['-']),
        ``,
        `${t.cut}`,
        ...(cut.length ? cut.map(line) : ['-']),
        ``,
        `${t.unpriced}`,
        ...(unpriced.length ? unpriced.map(line) : ['-'])
      ].join('\n');
      output.value = currentOutput;
      copyBtn.disabled = !currentOutput;
    };

    runBtn?.addEventListener('click', render);
    [budgetEl, modeEl, input].forEach(el => el.addEventListener('input', render));
    sampleBtn?.addEventListener('click', () => { input.value = t.sample; render(); input.focus(); });
    clearBtn?.addEventListener('click', () => {
      input.value = '';
      budgetEl.value = '80000';
      resetStats();
      setStatus(t.cleared);
      input.focus();
    });
    copyBtn?.addEventListener('click', async () => {
      render();
      if (!currentOutput) {
        setStatus(t.copyEmpty, 'error');
        return;
      }
      try { await navigator.clipboard.writeText(currentOutput); setStatus(t.copied, 'success'); } catch (e) { setStatus(t.copyFail, 'error'); }
    });
    render();
  }

  if (slug === 'recycling-sorting-practice') {
    const $ = (id) => document.getElementById(id);
    const difficultyEl = $('rsp-difficulty');
    const rangeEl = $('rsp-range');
    const itemEl = $('rsp-item');
    const hintEl = $('rsp-hint');
    const feedbackEl = $('rsp-feedback');
    const nextBtn = $('rsp-next');
    const reviewBtn = $('rsp-review');
    const resetBtn = $('rsp-reset');
    const correctEl = $('rsp-correct');
    const totalEl = $('rsp-total');
    const rateEl = $('rsp-rate');
    const missedEl = $('rsp-missed');
    const choiceBtns = Array.from(document.querySelectorAll('#rsp-choices [data-answer]'));
    if (!itemEl || !feedbackEl || !choiceBtns.length) return;

    const t = {
      ko: {
        labels: { paper: '종이', plastic: '플라스틱', can: '캔·금속', glass: '유리병', food: '음식물쓰레기', general: '일반쓰레기' },
        correct: (label, why) => `정답입니다. ${label}로 분류해요. ${why}`,
        wrong: (picked, label, why) => `아쉬워요. 선택: ${picked} / 정답: ${label}. ${why}`,
        reviewEmpty: '아직 복습할 오답이 없습니다.',
        reset: '점수를 초기화했습니다. 새 문제를 풀어보세요.',
        hint: '알맞은 배출 분류를 고르세요.'
      },
      en: {
        labels: { paper: 'Paper', plastic: 'Plastic', can: 'Can / metal', glass: 'Glass bottle', food: 'Food waste', general: 'General trash' },
        correct: (label, why) => `Correct. Sort it as ${label}. ${why}`,
        wrong: (picked, label, why) => `Not quite. Your choice: ${picked} / Answer: ${label}. ${why}`,
        reviewEmpty: 'No missed items to review yet.',
        reset: 'Score reset. Try a new question.',
        hint: 'Choose the best sorting category.'
      },
      ja: {
        labels: { paper: '紙', plastic: 'プラスチック', can: '缶/金属', glass: 'びん', food: '生ごみ', general: '一般ごみ' },
        correct: (label, why) => `正解です。${label}として分別します。${why}`,
        wrong: (picked, label, why) => `惜しいです。選択: ${picked} / 正解: ${label}。${why}`,
        reviewEmpty: '復習する間違いはまだありません。',
        reset: 'スコアをリセットしました。新しい問題を解いてみましょう。',
        hint: '適切な分別カテゴリを選んでください。'
      }
    }[pageLang] || null;

    const questions = [
      { item: { ko:'깨끗한 신문지', en:'Clean newspaper', ja:'きれいな新聞紙' }, answer:'paper', level:'easy', range:'recycle', why:{ ko:'물기와 음식물이 없으면 종이류로 묶어 배출할 수 있어요.', en:'Clean and dry newspaper can be bundled with paper recyclables.', ja:'汚れや水分がなければ紙類として出せます。' } },
      { item: { ko:'기름 묻은 피자 박스', en:'Greasy pizza box', ja:'油汚れのピザ箱' }, answer:'general', level:'mixed', range:'all', why:{ ko:'기름과 음식물이 많이 묻은 종이는 재활용 품질을 떨어뜨려 일반쓰레기로 봐요.', en:'Heavy grease and food residue make paper hard to recycle.', ja:'油や食べ物汚れが強い紙はリサイクルしにくいため一般ごみ扱いです。' } },
      { item: { ko:'내용물을 비운 페트병', en:'Empty PET bottle', ja:'中身を空にしたペットボトル' }, answer:'plastic', level:'easy', range:'recycle', why:{ ko:'비우고 헹군 뒤 라벨을 제거하면 플라스틱류로 배출하기 좋아요.', en:'Empty, rinse, and remove labels when possible before recycling as plastic.', ja:'中身を空にして洗い、ラベルを外すとプラスチックとして出しやすいです。' } },
      { item: { ko:'영수증 감열지', en:'Thermal receipt paper', ja:'レシート感熱紙' }, answer:'general', level:'hard', range:'all', why:{ ko:'감열지는 코팅·약품 처리로 일반 종이 재활용에 섞지 않는 편이 안전해요.', en:'Thermal receipts are chemically coated and usually kept out of paper recycling.', ja:'感熱紙は薬品処理されているため紙リサイクルに混ぜない方が安全です。' } },
      { item: { ko:'알루미늄 음료 캔', en:'Aluminum drink can', ja:'アルミ飲料缶' }, answer:'can', level:'easy', range:'recycle', why:{ ko:'내용물을 비우고 가능한 한 눌러 캔·금속류로 배출해요.', en:'Empty it and recycle with cans/metals.', ja:'中身を空にして缶・金属類として出します。' } },
      { item: { ko:'깨진 유리컵', en:'Broken drinking glass', ja:'割れたコップ' }, answer:'general', level:'hard', range:'all', why:{ ko:'유리병과 재질이 다르고 위험하므로 신문지 등에 싸서 일반쓰레기 또는 지역 지침에 따라 배출해요.', en:'Broken drinking glass is not the same as bottles and should be wrapped and handled as general trash or per local rules.', ja:'ガラスびんとは材質が異なり危険なので、包んで一般ごみまたは地域ルールに従います。' } },
      { item: { ko:'잼 병처럼 깨끗이 헹군 유리병', en:'Rinsed jam jar', ja:'洗ったジャムのびん' }, answer:'glass', level:'easy', range:'recycle', why:{ ko:'내용물을 비우고 헹군 유리병은 병류로 분리배출해요.', en:'Empty and rinsed jars can go with glass bottles/jars.', ja:'中身を空にして洗ったびんはびん類として出せます。' } },
      { item: { ko:'치킨 뼈', en:'Chicken bones', ja:'鶏の骨' }, answer:'general', level:'mixed', range:'food', why:{ ko:'뼈는 음식물 처리 과정에 적합하지 않아 일반쓰레기로 보는 경우가 많아요.', en:'Bones are usually unsuitable for food-waste processing.', ja:'骨は生ごみ処理に向かないため一般ごみ扱いが多いです。' } },
      { item: { ko:'먹다 남은 밥', en:'Leftover cooked rice', ja:'残ったご飯' }, answer:'food', level:'easy', range:'food', why:{ ko:'일반적으로 음식물쓰레기로 분류하지만 물기는 최대한 빼고 배출해요.', en:'Cooked rice is generally food waste; drain excess moisture first.', ja:'ご飯は一般的に生ごみですが、水分をできるだけ切ります。' } },
      { item: { ko:'티백과 커피 캡슐', en:'Tea bag and coffee capsule', ja:'ティーバッグとコーヒーカプセル' }, answer:'general', level:'hard', range:'food', why:{ ko:'필터·캡슐·내용물이 섞인 복합재는 분리하기 어렵다면 일반쓰레기로 처리해요.', en:'Mixed materials are hard to process unless fully separated.', ja:'素材が混ざって分けにくいものは一般ごみ扱いが無難です。' } },
      { item: { ko:'스티로폼 완충재', en:'Clean foam packaging', ja:'きれいな発泡スチロール緩衝材' }, answer:'plastic', level:'mixed', range:'recycle', why:{ ko:'깨끗한 스티로폼 포장재는 플라스틱/스티로폼 분리배출 대상인 경우가 많아요.', en:'Clean foam packaging is often collected with plastics/foam, depending on local rules.', ja:'きれいな発泡スチロールはプラスチック/発泡材として回収されることが多いです。' } },
      { item: { ko:'코팅된 종이컵', en:'Coated paper cup', ja:'コーティング紙コップ' }, answer:'general', level:'hard', range:'all', why:{ ko:'안쪽 코팅 때문에 일반 종이와 다르게 처리될 수 있어, 별도 수거함이 없으면 일반쓰레기로 보는 편이 안전해요.', en:'Inner coating makes it different from plain paper; use a dedicated bin if available.', ja:'内側コーティングがあるため、専用回収がなければ一般ごみが無難です。' } }
    ];

    let current = null;
    let correct = 0;
    let total = 0;
    const missed = [];

    const localize = (obj) => obj?.[pageLang] || obj?.ko || '';
    const pool = () => {
      const diff = difficultyEl?.value || 'mixed';
      const range = rangeEl?.value || 'all';
      return questions.filter(q => (diff === 'mixed' || q.level === diff || (diff === 'easy' && q.level === 'mixed')) && (range === 'all' || q.range === range || (range === 'food' && q.range === 'all')));
    };
    const updateStats = () => {
      correctEl.textContent = formatNum(correct);
      totalEl.textContent = formatNum(total);
      rateEl.textContent = total ? `${Math.round(correct / total * 100)}%` : '0%';
      missedEl.textContent = formatNum(missed.length);
    };
    const nextQuestion = (fromMissed = false) => {
      const source = fromMissed && missed.length ? missed : pool();
      current = source[Math.floor(Math.random() * source.length)] || questions[0];
      itemEl.textContent = localize(current.item);
      hintEl.textContent = t.hint;
      feedbackEl.textContent = t.hint;
      choiceBtns.forEach(btn => { btn.disabled = false; btn.style.opacity = '1'; });
    };

    choiceBtns.forEach(btn => btn.addEventListener('click', () => {
      if (!current) return;
      const picked = btn.dataset.answer;
      const label = t.labels[current.answer];
      const pickedLabel = t.labels[picked] || picked;
      total += 1;
      if (picked === current.answer) {
        correct += 1;
        feedbackEl.textContent = t.correct(label, localize(current.why));
        const idx = missed.indexOf(current);
        if (idx >= 0) missed.splice(idx, 1);
      } else {
        feedbackEl.textContent = t.wrong(pickedLabel, label, localize(current.why));
        if (!missed.includes(current)) missed.push(current);
      }
      choiceBtns.forEach(b => { b.disabled = true; b.style.opacity = b.dataset.answer === current.answer ? '1' : '0.65'; });
      updateStats();
    }));

    nextBtn?.addEventListener('click', () => nextQuestion(false));
    reviewBtn?.addEventListener('click', () => {
      if (!missed.length) { feedbackEl.textContent = t.reviewEmpty; return; }
      nextQuestion(true);
    });
    resetBtn?.addEventListener('click', () => { correct = 0; total = 0; missed.length = 0; updateStats(); feedbackEl.textContent = t.reset; nextQuestion(false); });
    [difficultyEl, rangeEl].forEach(el => el?.addEventListener('change', () => nextQuestion(false)));
    updateStats();
    nextQuestion(false);
  }

  if (slug === 'meeting-action-item-extractor') {
    const input = document.getElementById('maie-input');
    const namesEl = document.getElementById('maie-names');
    const includeDecisions = document.getElementById('maie-include-decisions');
    const includeQuestions = document.getElementById('maie-include-questions');
    const runBtn = document.getElementById('maie-run');
    const sampleBtn = document.getElementById('maie-sample');
    const copyBtn = document.getElementById('maie-copy');
    const clearBtn = document.getElementById('maie-clear');
    const output = document.getElementById('maie-output');
    const summary = document.getElementById('maie-summary');
    const actionsOut = document.getElementById('maie-actions');
    const decisionsOut = document.getElementById('maie-decisions');
    const datesOut = document.getElementById('maie-dates');
    const ownersOut = document.getElementById('maie-owners');
    if (!input || !output || !runBtn) return;

    const i18n = {
      ko: {
        untitled: '미지정', noDue: '기한 미정', noOwner: '담당 미정', actionTitle: '## 액션아이템', decisionTitle: '## 결정사항', questionTitle: '## 미해결 질문', none: '- 추출된 항목이 없습니다. `해야 함`, `담당`, `까지`, `결정`처럼 더 구체적인 표현을 넣어보세요.', empty: '회의 메모를 먼저 붙여넣어 주세요.', cleared: '입력과 결과를 초기화했습니다.', summary: (a,d,q) => `할 일 ${a}개, 결정사항 ${d}개, 미해결 질문 ${q}개를 정리했습니다.`, copyDone: '복사 완료', copyFail: '자동 복사를 사용할 수 없습니다.', sample: `5/13 서비스 개선 회의\n- 민지: 온보딩 화면 문구를 금요일까지 수정\n- 현우는 고객센터 FAQ 초안을 다음 주 월요일까지 작성하기\n- 결정: 베타 공지는 이번 주에는 보내지 않음\n- TODO 결제 실패 로그를 다시 확인\n- 질문: 무료 체험 종료 알림은 며칠 전에 보내야 하나?\n- 디자인팀 @수정 시안 내일까지 공유` },
      en: {
        untitled: 'Unspecified', noDue: 'No due date', noOwner: 'No owner', actionTitle: '## Action items', decisionTitle: '## Decisions', questionTitle: '## Open questions', none: '- No clear items found. Try adding words like todo, owner, by Friday, decided, or question.', empty: 'Paste meeting notes before extracting.', cleared: 'Cleared the notes and result.', summary: (a,d,q) => `Extracted ${a} action item(s), ${d} decision(s), and ${q} open question(s).`, copyDone: 'Copied', copyFail: 'Automatic copy is unavailable.', sample: `May 13 product meeting\n- Mina: revise onboarding copy by Friday\n- Alex to draft support FAQ by next Monday\n- Decision: do not send the beta announcement this week\n- TODO review payment failure logs again\n- Question: how many days before trial end should we notify users?\n- Design team @Jamie share revised mockups tomorrow` },
      ja: {
        untitled: '未指定', noDue: '期限未定', noOwner: '担当未定', actionTitle: '## アクション項目', decisionTitle: '## 決定事項', questionTitle: '## 未解決の質問', none: '- 明確な項目が見つかりませんでした。TODO、担当、まで、決定、質問などの表現を入れてみてください。', empty: '会議メモを貼り付けてから抽出してください。', cleared: '入力と結果をクリアしました。', summary: (a,d,q) => `アクション${a}件、決定事項${d}件、未解決質問${q}件を整理しました。`, copyDone: 'コピー完了', copyFail: '自動コピーを利用できません。', sample: `5/13 サービス改善会議\n- ミナ: オンボーディング文言を金曜まで修正\n- ケンはFAQ草案を来週月曜まで作成\n- 決定: ベータ告知は今週送らない\n- TODO 決済失敗ログを再確認\n- 質問: 無料トライアル終了通知は何日前に送る？\n- デザインチーム @ユイ 明日までに修正版を共有` }
    }[pageLang] || null;

    const setSummary = (message, state = '') => {
      summary.textContent = message;
      summary.dataset.state = state;
    };
    const setCounts = (a = 0, d = 0, due = 0, owner = 0) => {
      actionsOut.textContent = formatNum(a);
      decisionsOut.textContent = formatNum(d);
      datesOut.textContent = formatNum(due);
      ownersOut.textContent = formatNum(owner);
    };
    const setCopyEnabled = (enabled) => {
      if (copyBtn) copyBtn.disabled = !enabled;
    };
    const normalizeLine = (line) => line.replace(/^\s*(?:[-*•]|\d+[.)\]]|[a-z][.)\]])\s*/i, '').replace(/\s+/g, ' ').trim();
    const pushUnique = (arr, item, keyFn = (v) => v) => {
      const key = keyFn(item).toLowerCase();
      if (!arr.some(v => keyFn(v).toLowerCase() === key)) arr.push(item);
    };
    const ownerFromLine = (line, known) => {
      const at = line.match(/@([\p{L}\p{N}_-]+)/u);
      if (at) return at[1];
      const colon = line.match(/^([\p{L}\p{N}_\s]{2,18})\s*[:：]/u);
      if (colon) return colon[1].trim();
      const koreanSubject = line.match(/^([\p{L}\p{N}_\s]{2,18})(?:은|는|이|가)\s+/u);
      if (koreanSubject) return koreanSubject[1].trim();
      const englishTo = line.match(/^([A-Z][\p{L}\p{N}_-]{1,18})\s+to\s+/u);
      if (englishTo) return englishTo[1].trim();
      const hit = known.find(name => name && line.toLowerCase().includes(name.toLowerCase()));
      return hit || i18n.noOwner;
    };
    const dueFromLine = (line) => {
      const patterns = [
        /(\d{1,2}[./-]\d{1,2})(?:\s*까지|\s*by)?/,
        /(?:오늘|내일|모레|이번\s*주|다음\s*주|월요일|화요일|수요일|목요일|금요일|토요일|일요일)(?:\s*까지)?/,
        /\b(?:by\s+)?(?:today|tomorrow|this\s+week|next\s+week|next\s+Monday|next\s+Tuesday|next\s+Wednesday|next\s+Thursday|next\s+Friday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i,
        /(?:今日|明日|今週|来週|月曜|火曜|水曜|木曜|金曜|土曜|日曜)(?:まで)?/
      ];
      for (const p of patterns) { const m = line.match(p); if (m) return m[0].trim(); }
      return i18n.noDue;
    };
    const isDecision = (line) => /\b(decision|decided|agree[ds]?)\b/i.test(line) || /(결정|확정|합의|보류하기로|진행하기로|하지 않음|하기로 함|決定|確定|合意)/.test(line);
    const isQuestion = (line) => /\?|\b(question|open issue|unclear)\b/i.test(line) || /(질문|확인 필요|논의 필요|미정|検討|質問|確認必要)/.test(line);
    const isAction = (line) => /\b(todo|to do|action|follow up|owner|by\b|due)\b/i.test(line) || /(해야|하기|수정|작성|공유|확인|정리|전달|검토|담당|까지|TODO|액션|対応|修正|作成|共有|確認|担当|まで)/i.test(line);

    const extract = () => {
      const known = (namesEl?.value || '').split(/\n+/).map(v => v.trim()).filter(Boolean);
      const lines = (input.value || '').split(/\n+/).map(normalizeLine).filter(Boolean);
      if (!lines.length) {
        input.setAttribute('aria-invalid', 'true');
        output.value = '';
        setCounts();
        setCopyEnabled(false);
        setSummary(i18n.empty, 'error');
        return;
      }
      input.setAttribute('aria-invalid', 'false');
      const actions = [], decisions = [], questions = [];
      lines.forEach(line => {
        const decision = isDecision(line);
        const question = isQuestion(line);
        if (decision) pushUnique(decisions, line);
        if (question) pushUnique(questions, line);
        if (isAction(line) && !decision && !question) {
          pushUnique(actions, { text: line, owner: ownerFromLine(line, known), due: dueFromLine(line) }, item => item.text);
        }
      });
      const actionLines = actions.map((it, idx) => `- [ ] ${it.text}\n  - ${pageLang === 'en' ? 'Owner' : pageLang === 'ja' ? '担当' : '담당'}: ${it.owner}\n  - ${pageLang === 'en' ? 'Due' : pageLang === 'ja' ? '期限' : '기한'}: ${it.due}`);
      const chunks = [];
      chunks.push(i18n.actionTitle);
      chunks.push(actionLines.length ? actionLines.join('\n') : i18n.none);
      if (includeDecisions?.checked) { chunks.push('', i18n.decisionTitle, decisions.length ? decisions.map(x => `- ${x}`).join('\n') : '- ' + i18n.untitled); }
      if (includeQuestions?.checked) { chunks.push('', i18n.questionTitle, questions.length ? questions.map(x => `- ${x}`).join('\n') : '- ' + i18n.untitled); }
      output.value = chunks.join('\n').trim();
      const ownerCount = actions.filter(x => x.owner !== i18n.noOwner).length;
      const dueCount = actions.filter(x => x.due !== i18n.noDue).length;
      setCounts(actions.length, decisions.length, dueCount, ownerCount);
      setCopyEnabled(true);
      setSummary(i18n.summary(actions.length, decisions.length, questions.length), actions.length ? 'success' : 'warning');
    };

    sampleBtn?.addEventListener('click', () => { input.value = i18n.sample; namesEl.value = pageLang === 'en' ? 'Mina\nAlex\nJamie\nDesign team' : pageLang === 'ja' ? 'ミナ\nケン\nユイ\nデザインチーム' : '민지\n현우\n수정\n디자인팀'; extract(); });
    clearBtn?.addEventListener('click', () => {
      input.value = '';
      if (namesEl) namesEl.value = '';
      output.value = '';
      input.setAttribute('aria-invalid', 'false');
      setCounts();
      setCopyEnabled(false);
      setSummary(i18n.cleared);
      input.focus();
    });
    runBtn.addEventListener('click', extract);
    [input, namesEl, includeDecisions, includeQuestions].forEach(el => { el?.addEventListener('input', extract); el?.addEventListener('change', extract); });
    copyBtn?.addEventListener('click', async () => {
      if (!output.value.trim()) return;
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(output.value.trim());
        else { output.focus(); output.select(); document.execCommand('copy'); }
        const old = copyBtn.textContent;
        copyBtn.textContent = i18n.copyDone;
        setSummary(i18n.copyDone, 'success');
        setTimeout(() => { copyBtn.textContent = old; }, 900);
      } catch (_) {
        setSummary(i18n.copyFail, 'error');
      }
    });
    setCopyEnabled(false);
  }

  if (slug === 'emergency-bag-checklist-planner') {
    const $ = (id) => document.getElementById(id);
    const adultsEl = $('ebcp-adults');
    const childrenEl = $('ebcp-children');
    const hoursEl = $('ebcp-hours');
    const seasonEl = $('ebcp-season');
    const petEl = $('ebcp-pet');
    const medicineEl = $('ebcp-medicine');
    const glassesEl = $('ebcp-glasses');
    const babyEl = $('ebcp-baby');
    const readyEl = $('ebcp-ready');
    const output = $('ebcp-output');
    const summary = $('ebcp-summary');
    const totalEl = $('ebcp-total');
    const readyCountEl = $('ebcp-ready-count');
    const missingCountEl = $('ebcp-missing-count');
    const waterEl = $('ebcp-water');
    const sampleBtn = $('ebcp-sample');
    const copyBtn = $('ebcp-copy');
    if (!adultsEl || !output) return;

    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    };

    const item = (name, group, reason, aliases = []) => ({ name, group, reason, aliases: [name, ...aliases].map(v => v.toLowerCase()) });
    const baseItems = [
      item('생수', '필수', '1인당 하루 2L 안팎을 기준으로 준비합니다.', ['물', 'water']),
      item('비상식량', '필수', '조리 없이 먹을 수 있는 에너지바·통조림·견과류가 좋습니다.', ['간식', '통조림', '에너지바']),
      item('보조배터리와 충전 케이블', '필수', '정전이나 이동 중 연락 수단을 유지합니다.', ['보조배터리', '충전기', '케이블']),
      item('손전등 또는 헤드랜턴', '필수', '야간 이동과 정전 상황에 필요합니다.', ['손전등', '랜턴']),
      item('휴대용 라디오 또는 재난 알림 수단', '필수', '통신 장애 시 공지 확인에 도움이 됩니다.', ['라디오']),
      item('상비약과 응급처치 키트', '필수', '소독제, 밴드, 진통제 등 기본 처치용입니다.', ['상비약', '구급상자', '밴드']),
      item('마스크와 위생용품', '필수', '먼지, 감염, 화장실 이용 상황에 대비합니다.', ['마스크', '물티슈', '휴지']),
      item('소액 현금과 비상 연락처', '필수', '카드 결제가 안 될 때와 연락처 확인에 필요합니다.', ['현금', '연락처']),
      item('방수 지퍼백', '필수', '서류, 약, 전자기기를 습기에서 보호합니다.', ['지퍼백', '방수팩']),
      item('여벌 옷과 양말', '필수', '비·땀·추위에 젖었을 때 체온 유지에 필요합니다.', ['옷', '양말'])
    ];

    const build = () => {
      const adults = Math.max(1, Number(adultsEl.value || 1));
      const children = Math.max(0, Number(childrenEl.value || 0));
      const people = adults + children;
      const hours = Number(hoursEl.value || 48);
      const days = Math.max(1, Math.ceil(hours / 24));
      const season = seasonEl.value || 'normal';
      const items = [...baseItems];

      if (children > 0) items.push(item('아이·고령자용 간식과 개인 물품', '맞춤', '나이와 건강 상태에 맞는 식품, 보온용품, 보조기구를 따로 챙깁니다.', ['아이 간식', '고령자 물품']));
      if (petEl.checked) items.push(item('반려동물 사료·물그릇·배변봉투', '맞춤', '동반 대피 시 평소 먹는 사료와 리드줄, 배변용품이 필요합니다.', ['사료', '배변봉투', '리드줄']));
      if (medicineEl.checked) items.push(item('정기 복용약 3일분과 처방 정보', '맞춤', '평소 먹는 약은 대체가 어려우므로 별도 방수 보관합니다.', ['복용약', '처방전', '약']));
      if (glassesEl.checked) items.push(item('예비 안경·렌즈와 세척용품', '맞춤', '시력 보조 도구가 없으면 이동과 정보 확인이 어려울 수 있습니다.', ['안경', '렌즈']));
      if (babyEl.checked) items.push(item('기저귀·분유·아기 물티슈', '맞춤', '유아는 식사와 위생용품을 성인 물품과 별도로 준비해야 합니다.', ['기저귀', '분유', '아기 물티슈']));
      if (season === 'summer') items.push(item('전해질 음료와 냉감 수건', '계절', '더위와 탈수에 대비합니다.', ['전해질', '냉감 수건']));
      if (season === 'winter') items.push(item('핫팩·보온포·장갑', '계절', '저체온 예방을 위해 가볍고 따뜻한 물품을 추가합니다.', ['핫팩', '보온포', '장갑']));
      if (season === 'rain') items.push(item('우비·방수 신발 커버', '계절', '젖은 상태로 이동할 때 체온 저하와 물품 손상을 줄입니다.', ['우비', '방수']));

      const readyRaw = (readyEl.value || '').toLowerCase().split(/[\n,]/).map(v => v.trim()).filter(Boolean);
      const rows = items.map(it => {
        const ready = readyRaw.some(r => it.aliases.some(a => r.includes(a) || a.includes(r)));
        return { ...it, ready };
      });
      const readyCount = rows.filter(r => r.ready).length;
      const missing = rows.filter(r => !r.ready);
      const water = people * days * 2;
      totalEl.textContent = formatNum(rows.length);
      readyCountEl.textContent = formatNum(readyCount);
      missingCountEl.textContent = formatNum(missing.length);
      waterEl.textContent = `${water}L`;
      summary.textContent = `${people}명 기준 ${hours}시간 대비: ${rows.length}개 권장 항목 중 ${missing.length}개를 보강하면 좋습니다.`;
      const lines = [
        '# 비상가방 체크리스트',
        `- 기준: ${people}명 / ${hours}시간 / 권장 생수 약 ${water}L`,
        '',
        '## 먼저 보강할 항목',
        ...(missing.length ? missing.map(r => `- [ ] ${r.name} (${r.group}) — ${r.reason}`) : ['- 모든 권장 항목이 준비된 것으로 보입니다. 유통기한과 배터리 잔량을 확인하세요.']),
        '',
        '## 준비된 항목',
        ...(rows.filter(r => r.ready).length ? rows.filter(r => r.ready).map(r => `- [x] ${r.name}`) : ['- 아직 입력된 준비 물품이 없습니다.']),
        '',
        '## 점검 팁',
        '- 생수·간식·약·배터리는 분기마다 교체하거나 상태를 확인하세요.',
        '- 가족별 작은 가방으로 나누면 한 사람이 모든 무게를 부담하지 않아도 됩니다.',
        '- 실제 대피 판단은 재난 문자와 지자체 안내를 우선하세요.'
      ];
      output.value = lines.join('\n');
    };

    sampleBtn?.addEventListener('click', () => {
      adultsEl.value = '2'; childrenEl.value = '1'; hoursEl.value = '72'; seasonEl.value = 'rain';
      petEl.checked = true; medicineEl.checked = true; glassesEl.checked = false; babyEl.checked = false;
      readyEl.value = '생수, 보조배터리, 손전등, 마스크, 현금';
      build();
    });
    copyBtn?.addEventListener('click', async () => {
      if (!output.value.trim()) return;
      await copyText(output.value.trim());
      const old = copyBtn.textContent;
      copyBtn.textContent = '복사 완료';
      setTimeout(() => { copyBtn.textContent = old || '결과 복사'; }, 900);
    });
    [adultsEl, childrenEl, hoursEl, seasonEl, petEl, medicineEl, glassesEl, babyEl, readyEl].forEach(el => {
      el?.addEventListener('input', build);
      el?.addEventListener('change', build);
    });
    build();
  }

})();
