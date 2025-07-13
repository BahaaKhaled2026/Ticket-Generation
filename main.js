let temp = "";
let uploadedAvatar = null;

// Trigger file input on click
function triggerUpload() {
  document.getElementById("avatar").click();
}

// Reset upload to initial state
function resetUpload() {
  const box = document.getElementsByClassName("upload-text")[0];
  box.onclick = triggerUpload;
  box.innerHTML = temp;
  document.getElementById("avatar").value = "";
  uploadedAvatar = null;
}

// Preview uploaded avatar
function previewAvatar(file) {
  const reader = new FileReader();
  reader.onload = function () {
    const box = document.getElementsByClassName("upload-text")[0];
    box.onclick = null;
    box.innerHTML = `
      <img src="${reader.result}" alt="Uploaded Image" class="uploaded-image" />
      <div class="uploaded-buttons">
        <button type="button" class="remove-button" onclick="event.stopPropagation(); resetUpload()">Remove image</button>
        <button type="button" class="change-button" onclick="event.stopPropagation(); triggerUpload()">Change image</button>
      </div>
    `;
    uploadedAvatar = file;
  };
  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const uploadTextEl = document.getElementsByClassName("upload-text")[0];
  if (uploadTextEl) {
    temp = uploadTextEl.innerHTML;
  }

  const form = document.getElementById("ticketForm");
  const avatarInput = document.getElementById("avatar");

  if (form) {
    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.size <= 500 * 1024) {
        previewAvatar(file);
      } else if (file && file.size > 500 * 1024) {
        const instructions = document.getElementById("uploadInstructions");
        instructions.textContent =
          "File too large. Please upload a photo under 500KB.";
        instructions.style.color = "rgba(255, 0, 0, 0.6)";
        e.target.value = "";
      }
    });

    const dropZone = document.getElementById("drop");
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragging");
    });

    dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragging");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragging");
      const file = e.dataTransfer.files[0];
      if (file && file.size <= 500 * 1024) {
        avatarInput.files = e.dataTransfer.files;
        previewAvatar(file);
      } else {
        const instructions = document.getElementById("uploadInstructions");
        instructions.textContent =
          "File too large. Please upload a photo under 500KB.";
        instructions.style.color = "rgba(255, 0, 0, 0.7)";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const github = document.getElementById("github").value.trim();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailError = document.getElementById("emailError");
      const githubError = document.getElementById("githubError");

      // Name validation
      if (!fullName) {
        document.getElementById("name").style.borderColor =
          "rgba(255, 0, 0, 0.6)";
        nameError.textContent = "Please enter your full name.";
        document.getElementsByClassName("name-info")[0].style.display = "flex";
        return;
      } else {
        document.getElementById("name").style.borderColor = "initial";
        document.getElementsByClassName("name-info")[0].style.display = "none";
      }

      // Email validation
      if (!emailPattern.test(email)) {
        document.getElementById("email").style.borderColor =
          "rgba(255, 0, 0, 0.6)";
        emailError.textContent = "Please enter a valid email address.";
        document.getElementsByClassName("email-info")[0].style.display = "flex";
        return;
      } else {
        document.getElementById("email").style.borderColor = "initial";
        document.getElementsByClassName("email-info")[0].style.display = "none";
      }

      // GitHub validation
      if (!github.startsWith("@")) {
        document.getElementById("github").style.borderColor =
          "rgba(255, 0, 0, 0.6)";
        githubError.textContent = "GitHub username must start with '@'.";
        document.getElementsByClassName("github-info")[0].style.display =
          "flex";
        return;
      } else {
        document.getElementById("github").style.borderColor = "initial";
        document.getElementsByClassName("github-info")[0].style.display =
          "none";
      }

      // Avatar validation
      if (!uploadedAvatar) {
        const instructions = document.getElementById("uploadInstructions");
        instructions.textContent = "Please upload a photo under 500KB.";
        instructions.style.color = "rgba(255, 0, 0, 0.7)";
        return;
      }

      // All fields valid
      const reader = new FileReader();
      reader.onload = function () {
        localStorage.setItem("name", fullName);
        localStorage.setItem("email", email);
        localStorage.setItem("github", github);
        localStorage.setItem("avatar", reader.result);
        window.location.href = "ticket.html";
      };
      reader.readAsDataURL(uploadedAvatar);
    });
  }

  // Fill data on ticket.html
  if (document.getElementById("nameUploaded")) {
    document.getElementById("nameUploaded").textContent =
      localStorage.getItem("name") || "Guest";
    const name2 = document.getElementById("nameUploaded2");
    if (name2) {
      name2.textContent = localStorage.getItem("name") || "Guest";
    }
    document.getElementById("emailUploaded").textContent =
      localStorage.getItem("email") || "guest@email.com";
    document.getElementById("githubUploaded").textContent =
      localStorage.getItem("github") || "@guest";
    document.getElementById("avatarUploaded").src =
      localStorage.getItem("avatar") || "./assets/images/default-avatar.png";
  }
});
