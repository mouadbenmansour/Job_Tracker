let currentAppId = null

document.addEventListener('DOMContentLoaded', () => {
  loadApplications()

  // Form submission
  const form = document.getElementById('application-form')
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const applicationData = {
        company: document.getElementById('company').value,
        role: document.getElementById('role').value,
        status: document.getElementById('status').value,
        applied_date: document.getElementById('applied_date').value,
        deadline: document.getElementById('deadline').value || null,
        notes: document.getElementById('notes').value || null,
        job_url: document.getElementById('job_url').value || null
      }
      await addApplication(applicationData)
      form.reset()
      loadApplications()
    })
  }

  // Modal close button
  const closeBtn = document.getElementById('modal-close')
  if (closeBtn) closeBtn.addEventListener('click', closeModal)

  // Close modal on overlay click
  const overlay = document.getElementById('modal-overlay')
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal()
    })
  }

  // Modal update button
  const updateBtn = document.getElementById('modal-update-btn')
  if (updateBtn) {
    updateBtn.addEventListener('click', async () => {
      const newStatus = document.getElementById('modal-status-select').value
      await updateApplication(currentAppId, { status: newStatus })
      closeModal()
      loadApplications()
    })
  }

  // Modal delete button
  const deleteBtn = document.getElementById('modal-delete-btn')
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const confirmed = confirm('Are you sure you want to delete this application?')
      if (confirmed) {
        await deleteApplication(currentAppId)
        closeModal()
        loadApplications()
      }
    })
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })
})

async function loadApplications() {
  const applications = await getApplications()

  if (!Array.isArray(applications)) {
    console.error("Received non-array data:", applications);
    applications = [];
} 

  const container = document.getElementById('applications-container')
  if (!container) return

  container.innerHTML = ''

  // Dashboard stats
  if (document.getElementById('total')) {
    document.getElementById('total').textContent = applications.length
    document.getElementById('applied').textContent = applications.filter(a => a.status === 'APPLIED').length
    document.getElementById('interview').textContent = applications.filter(a => a.status === 'INTERVIEW').length
    document.getElementById('offer').textContent = applications.filter(a => a.status === 'OFFER').length
    document.getElementById('rejected').textContent = applications.filter(a => a.status === 'REJECTED').length
  }

  if (applications.length === 0) {
    container.innerHTML = `
      <tr><td colspan="4">
        <div class="empty-state"><p>No applications yet — add your first one above!</p></div>
      </td></tr>`
    return
  }

  applications.forEach(app => {
    const row = createApplicationRow(app)
    container.appendChild(row)
  })
}

function createApplicationRow(app) {
  const tr = document.createElement('tr')
  tr.innerHTML = `
    <td class="td-company">${app.company}</td>
    <td class="td-role">${app.role}</td>
    <td><span class="badge ${app.status.toLowerCase()}">${app.status}</span></td>
    <td class="td-date">${new Date(app.applied_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
  `
  tr.addEventListener('click', () => openModal(app))
  return tr
}

function openModal(app) {
  currentAppId = app.id

  document.getElementById('modal-company').textContent = app.company
  document.getElementById('modal-role').textContent = app.role
  document.getElementById('modal-date').textContent = new Date(app.applied_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  document.getElementById('modal-deadline').textContent = app.deadline ? new Date(app.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

  const statusBadge = document.getElementById('modal-status-badge')
  statusBadge.textContent = app.status
  statusBadge.className = `badge ${app.status.toLowerCase()}`

  const urlEl = document.getElementById('modal-url')
  urlEl.innerHTML = app.job_url ? `<a href="${app.job_url}" target="_blank" class="modal-link">View Posting ↗</a>` : '—'

  const notesWrapper = document.getElementById('modal-notes-wrapper')
  const notesEl = document.getElementById('modal-notes')
  if (app.notes) {
    notesEl.textContent = app.notes
    notesWrapper.style.display = 'block'
  } else {
    notesWrapper.style.display = 'none'
  }

  // Set status select to current status
  if(document.getElementById('modal-status-select')){
    document.getElementById('modal-status-select').value = app.status
  }
  

  document.getElementById('modal-overlay').classList.add('open')
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open')
  currentAppId = null
}