// const endpoint=`http://localhost:3000`
// const signup = document.querySelector("#signupformid");
// signup.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const name = e.target.name.value;
//   const email = e.target.email.value;
//   const password = e.target.pass.value;

//   const obj = { name, email, password };
//   async function postdata() {
//     try {
//       const result = await axios.post(
//         `${endpoint}/user/signup`,
//         obj
//       );
//       console.log("data posted successfully...");
//       console.log(result.data);
//       e.target.reset();
//       const signupModalElement = document.getElementById("signupModal");
//       const signupModal = bootstrap.Modal.getInstance(signupModalElement);

//       if (signupModal) {
//         signupModal.hide();
//       }

//       const loginModal = new bootstrap.Modal(
//         document.getElementById("loginmodal")
//       );
//       loginModal.show();
//     } catch (err) {
//       if (err.response.status == 409) {
//         displayErrorMessage("User already exists");
//         function displayErrorMessage(message) {
//           const errorDiv = document.getElementById("error-message");
//           errorDiv.textContent = message;
//           errorDiv.style.display = "block";
//         }
//       }
//       console.log("Error in posting Data...", err);
//     }
//   }
//   postdata();
// });

// const login = document.querySelector("#loginformid");
// login.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const email = e.target.emailid.value;
//   const password = e.target.password.value;
//   const obj = { email, password };

//   function displayErrorMessage(message) {
//     const errorDiv = document.getElementById("error-message");
//     errorDiv.textContent = message;
//     errorDiv.style.display = "block";
//   }

//   async function loginfun() {
//     try {
//       const response = await axios.post(
//         `${endpoint}/user/login`,
//         obj
//       );
//       if (response.status == 200)
//         localStorage.setItem("token", response.data.token);
//       alert("Login successfull");
//       e.target.reset();
//       window.location.href = "/expense";
//     } catch (err) {
//       if (err.response) {
//         if (err.response.status == 401)
//           displayErrorMessage("User not authorized");
//         else if (err.response.status == 404)
//           displayErrorMessage("User not found");
//       }
//     }
//   }
//   loginfun();
// });
// const forgetbtn = document.getElementById("forgetpasswordform");
// forgetbtn.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const email = e.target.email.value.trim();
//   if (!email) {
//     console.log("Email is required");
//     alert("Please enter a valid email address.");
//     return;
//   }
//   try {
//     const result = await axios.post(
//       `${endpoint}/password/forgotpassword`,
//       { email }
//     );
//     console.log(result.data.message);
//   } catch (err) {
//     console.log("error in forgetbuton ", err);
//   }
// });

const endpoint = `http://localhost:3000`;

function displayErrorMessage(message, elementId = "error-message") {
  const errorDiv = document.getElementById(elementId);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }
}

// Signup Form Handler
document.querySelector("#signupformid").addEventListener("submit", (e) => {
  e.preventDefault();
  const { name, email, pass } = e.target;
  const obj = { name: name.value, email: email.value, password: pass.value };

  async function postdata() {
    try {
      const result = await axios.post(`${endpoint}/user/signup`, obj);
      console.log("Signup successful", result.data);
      e.target.reset();
      
      // Close Signup Modal and Open Login Modal
      const signupModalElement = document.getElementById("signupmodal");
      if (signupModalElement) bootstrap.Modal.getInstance(signupModalElement)?.hide();

      const loginModalElement = document.getElementById("loginmodal");
      if (loginModalElement) new bootstrap.Modal(loginModalElement).show();
    } catch (err) {
      if (err.response?.status === 409) {
        displayErrorMessage("User already exists");
      } else {
        console.error("Signup Error:", err);
        alert("Signup failed. Please try again.");
      }
    }
  }
  postdata();
});

// Login Form Handler
document.querySelector("#loginformid").addEventListener("submit", (e) => {
  e.preventDefault();
  const { emailid, password } = e.target;
  const obj = { email: emailid.value, password: password.value };

  async function loginfun() {
    try {
      const response = await axios.post(`${endpoint}/user/login`, obj);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful");
        e.target.reset();
        window.location.href = "/expense";
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) displayErrorMessage("User not authorized");
      else if (status === 404) displayErrorMessage("User not found");
      else {
        console.error("Login Error:", err);
        alert("Login failed. Please try again.");
      }
    }
  }
  loginfun();
});

// Forgot Password Handler
document.getElementById("forgetpasswordform").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  if (!email) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    const result = await axios.post(`${endpoint}/password/forgotpassword`, { email });
    alert(result.data.message || "Check your email for reset instructions.");
  } catch (err) {
    console.error("Forgot Password Error:", err);
    alert("Failed to process the request. Please try again.");
  }
});

