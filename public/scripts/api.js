const BASE_URL = '/api/applications'

async function getApplications() {
  const response = await fetch('/api/applications')
  const data = await response.json()
  return data
}

async function addApplication(applicationData) {
  const response = await fetch(`/api/applications/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData)
  })
  const data = await response.json()
  return data
}

async function updateApplication(id, applicationData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData)
  })
  const data = await response.json()
  return data
}

async function deleteApplication(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })
  const data = await response.json()
  return data
}