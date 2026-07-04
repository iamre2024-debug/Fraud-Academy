let loaded = false;
let ran = false;

function label(a, b = '') { return a + b; }

function render() {
  const targetTitle = label('Identity ', 'Intel');
  const title = [...document.querySelectorAll('h2')].find(x => x.textContent.trim() === targetTitle);
  if (!title) { loaded = false; return; }
  const main = title.closest('.main');
  if (!main || loaded) return;
  loaded = true;

  main.innerHTML = `
    <div class="people-top">
      <div><h2>${label('People ', 'Search')}</h2><div class="muted">Identity Intel Workspace · Review fictional linked records.</div></div>
      <span class="pill">Evidence only · no flags here</span>
    </div>
    <div class="people-workspace">
      <section class="people-main card">
        <div class="ps-steps"><span class="on">1 Enter Search</span><span class="${ran ? 'on' : ''}">2 Run Search</span><span class="${ran ? 'on' : ''}">3 Review Results</span></div>
        <div class="ps-search-card"><h3>🔎 ${label('People ', 'Search')}</h3><p class="muted">Search by fake training record ID or name + date. All output is fictional.</p><div class="ps-toggle"><button class="active">Record ID</button><button>Name + Date</button></div><div class="ps-input-row"><input value="RECORD-4000"/><button id="ps-run" class="ps-run">Run Search 🔍</button></div></div>
        ${ran ? `<div class="ps-match-card"><div class="ps-avatar">👤<small>Record Located</small></div><div class="ps-match-info"><h3>Training Record</h3><p>Record ID: RECORD-4000 · Masked Ref: FAKE-****</p><p>Linked address, contact, business, property, and public-record style data found.</p></div><div class="ps-confidence"><span>Match Confidence</span><strong>97%</strong><small>Established record depth</small></div></div><div class="ps-counts"><button><span>🏠</span><b>3</b><small>Addresses</small></button><button><span>📞</span><b>4</b><small>Phones</small></button><button><span>✉️</span><b>3</b><small>Emails</small></button><button><span>👥</span><b>6</b><small>Associates</small></button><button><span>💼</span><b>2</b><small>Businesses</small></button><button><span>🏡</span><b>1</b><small>Properties</small></button><button><span>🚗</span><b>2</b><small>Vehicles</small></button><button><span>🎓</span><b>2</b><small>Licenses</small></button></div><div class="ps-detail-grid"><div class="result"><h3>Record Snapshot</h3><div class="ps-kv"><b>Record Status</b><span>Located</span></div><div class="ps-kv"><b>Address Stability</b><span>High</span></div><div class="ps-kv"><b>Contact Stability</b><span>Medium</span></div><div class="ps-kv"><b>Record Depth</b><span>Established</span></div></div><div class="result"><h3>Possible Matches</h3><div class="ps-match-mini"><b>Demo Match A</b><span>62%</span><small>Training City</small></div><div class="ps-match-mini"><b>Demo Match B</b><span>48%</span><small>Training County</small></div></div><div class="result"><h3>Quick Stats</h3><div class="ps-kv"><b>Public Links</b><span>8</span></div><div class="ps-kv"><b>Business Links</b><span>2</span></div><div class="ps-kv"><b>Property Links</b><span>1</span></div><div class="ps-kv"><b>Vehicle Links</b><span>2</span></div></div></div><button class="ps-full">View Full Report →</button>` : `<div class="ps-empty"><div class="ps-illustration">🪪🔍</div><h3>Enter a fake record ID or name + date to begin</h3><p>Running the lookup returns fictional linked record categories across training data sources.</p><div class="ps-policy">🔒 Searches are logged and monitored.</div></div>`}
      </section>
      <aside class="people-report card"><div class="ps-report-head"><h3>📂 Evidence Explorer</h3><small>${ran ? 'Fake report sections available' : 'Run search to view results'}</small></div>${['Identity Summary','Addresses','Phone Numbers','Email Addresses','Associates','Public Records','Business Links','Property Links','Licenses','Vehicles','Additional Sources'].map((name, i) => `<button class="ps-section"><span>📌</span><b>${name}<small>Fictional training report section</small></b><em>${ran ? i + 1 : '—'}</em><strong>View</strong></button>`).join('')}<div class="ps-report-detail"><h3>Report Summary</h3><p class="muted">${ran ? 'Full fictional report details will open here as we build each section.' : 'No report details loaded yet.'}</p><p class="muted mini">Fictional training data only. Evidence page does not decide fraud.</p></div></aside>
    </div>`;

  main.querySelector('#ps-run')?.addEventListener('click', () => { ran = true; loaded = false; render(); });
}

new MutationObserver(render).observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', render);
