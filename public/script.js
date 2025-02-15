document.addEventListener("DOMContentLoaded", function() {
  const domainSelect = document.getElementById("domainSelect");
  const addForm = document.getElementById("addForm");
  const deleteForm = document.getElementById("deleteForm");
  const messageEl = document.getElementById("message");

  // Ambil daftar domain dari API
  fetch("/api/domains")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Fetched domains:", data);
      // Bersihkan dropdown dan isi dengan data domain yang didapat
      domainSelect.innerHTML = "";
      data.forEach(domain => {
        const option = document.createElement("option");
        option.value = domain;
        option.textContent = domain;
        domainSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error fetching domains:", error);
      domainSelect.innerHTML = "<option value=''>Error loading domains</option>";
    });

  // Handle form tambah subdomain
  addForm.addEventListener("submit", function(e) {
    e.preventDefault();
    messageEl.textContent = "Menambahkan subdomain...";
    const domain = domainSelect.value;
    const subdomain = document.getElementById("subdomainInput").value;
    const ip = document.getElementById("ipInput").value;
    
    fetch("/api/add-subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, subdomain, ip })
    })
    .then(response => response.json().then(data => ({ status: response.status, data })))
    .then(result => {
      if (result.status === 200) {
        messageEl.textContent = `Subdomain ${subdomain}.${domain} berhasil ditambahkan.`;
      } else {
        messageEl.textContent = `Error: ${result.data.error}`;
      }
    })
    .catch(error => {
      messageEl.textContent = `Error: ${error.message}`;
    });
  });

  // Handle form hapus subdomain
  deleteForm.addEventListener("submit", function(e) {
    e.preventDefault();
    messageEl.textContent = "Menghapus subdomain...";
    const domain = domainSelect.value;
    const subdomain = document.getElementById("deleteSubdomainInput").value;
    
    fetch("/api/delete-subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, subdomain })
    })
    .then(response => response.json().then(data => ({ status: response.status, data })))
    .then(result => {
      if (result.status === 200) {
        messageEl.textContent = `Subdomain ${subdomain}.${domain} berhasil dihapus.`;
      } else {
        messageEl.textContent = `Error: ${result.data.error}`;
      }
    })
    .catch(error => {
      messageEl.textContent = `Error: ${error.message}`;
    });
  });
});
