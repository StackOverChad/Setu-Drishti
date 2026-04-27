/* Dashboard — Mock FHIR patient records */

const MOCK_PATIENTS = [
  { id:'P001', name:'Ravi Kumar',    age:38, condition:'Fever, Cough',                   risk:'MEDIUM', initials:'RK', color:'#3b82f6' },
  { id:'P002', name:'Priya Sharma',  age:26, condition:'Chest pain, Dyspnea',            risk:'HIGH',   initials:'PS', color:'#ef4444' },
  { id:'P003', name:'Anita Devi',    age:54, condition:'Joint pain, Fatigue',             risk:'LOW',    initials:'AD', color:'#22c55e' },
  { id:'P004', name:'Mohan Lal',     age:71, condition:'Chest pain, Palpitations',        risk:'HIGH',   initials:'ML', color:'#ef4444' },
  { id:'P005', name:'Sunita Patel',  age:33, condition:'Nausea, Dizziness',               risk:'MEDIUM', initials:'SP', color:'#f59e0b' },
  { id:'P006', name:'Kiran Joshi',   age:45, condition:'Productive cough, Mild fever',    risk:'LOW',    initials:'KJ', color:'#22c55e' },
  { id:'P007', name:'Ramesh Singh',  age:60, condition:'Pallor, Fatigue, Low Hb 7.2',    risk:'HIGH',   initials:'RS', color:'#ef4444' },
  { id:'P008', name:'Meena Kumari',  age:29, condition:'Skin lesion, 3-week progression', risk:'MEDIUM', initials:'MK', color:'#a855f7' },
];

function renderDashboard() {
  const list = document.getElementById('patientList');
  if (!list) return;

  list.innerHTML = MOCK_PATIENTS.map(p => `
    <div class="patient-row" role="listitem" tabindex="0"
         onclick="openPatient('${p.id}', '${p.name}')"
         onkeydown="if(event.key==='Enter')openPatient('${p.id}','${p.name}')">
      <div class="patient-avatar"
           style="background:${p.color}18; border:1.5px solid ${p.color}30; color:${p.color}"
           aria-hidden="true">
        ${p.initials}
      </div>
      <div class="patient-info">
        <div class="patient-name">
          ${p.name}
          <span style="font-weight:400;color:var(--text-tertiary);font-size:var(--text-xs)">· ${p.age} y</span>
        </div>
        <div class="patient-meta">${p.condition}</div>
      </div>
      <span class="risk-pill risk-${p.risk}" role="status" aria-label="Risk level: ${p.risk}">${p.risk}</span>
    </div>
  `).join('');
}

function openPatient(id, name) {
  showToast(`Viewing record: ${name} (${id})`, 'info');
  addToAuditLog(`Accessed patient record ${id} — ${name}`, 'cyan');
}

document.addEventListener('DOMContentLoaded', renderDashboard);
