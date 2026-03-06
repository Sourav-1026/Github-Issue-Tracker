const signInBtn = document.getElementById("btn-signIN").addEventListener("click", () => {
  //   console.log("sign in btn was clicked");
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value;
  console.log(username);

  if (username !== "admin") {
    alert("Invalid UserName");
  }

  const passwordInput = document.getElementById("password");
  const password = passwordInput.value;
  console.log(password);

  if (password !== "admin123") {
    alert("Invalid Password");
    return;
  } else {
    alert("Login Success");
    window.location.href = "home.html";
  }
});
