const profileImageInput = document.getElementById("profileImage");

profileImageInput.addEventListener("change", async function () {
  const file = this.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("profile_image", file);
  const res = await fetch("/php/upload/upload.php", {
    method: "POST",
    body: formData,
  });
  console.log(await res.text());
});
