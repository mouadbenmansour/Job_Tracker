const BASE_URL = 'https://jobtracker-production-3aa0.up.railway.app'

async function getApplications() {
  const response = await fetch(`${BASE_URL}/api/applications`)
  const data = await response.json()
  return data
}

async function addApplication(applicationData) {
  const response = await fetch(`${BASE_URL}/api/applications/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData)
  })
  const data = await response.json()
  return data
}

async function updateApplication(id, applicationData) {
  const response = await fetch(`${BASE_URL}/api/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData)
  })
  const data = await response.json()
  return data
}

async function deleteApplication(id) {
  const response = await fetch(`${BASE_URL}/api/applications/${id}`, {
    method: 'DELETE'
  })
  const data = await response.json()
  return data
}