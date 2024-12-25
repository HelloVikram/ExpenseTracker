const endpoint=`http://localhost:3000`
          let expensesPerPage = 5;
          let currentPage = 1;
      async function getexpense(page = 1) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("You need to login first!");
            return;
          }

          const response = await axios.get(
            `${endpoint}/expense/get-expense?page=${page}&limit=${expensesPerPage}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const ul = document.querySelector("#list");
          ul.innerHTML = "";

          response.data.data.forEach((element) => {
            showItems(element);
          });

          updatePaginationControls(response.data.totalPages, page);
        } catch (err) {
          console.log("Error in getting Expense...", err);
        }
      }

      function updatePaginationControls(totalPages, currentPage) {
        const paginationContainer = document.querySelector("#pagination");

        paginationContainer.innerHTML = "";

        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.disabled = currentPage <= 1;
        prevButton.addEventListener("click", () => {
          getexpense(currentPage - 1);
        });
        paginationContainer.appendChild(prevButton);

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.disabled = currentPage >= totalPages;
        nextButton.addEventListener("click", () => {
          getexpense(currentPage + 1);
        });
        paginationContainer.appendChild(nextButton);
      }

      async function postexpense(obj) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("You need to login first!");
            return;
          }

          const result = await axios.post(
            `${endpoint}/expense/add-expense`,
            obj,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Expense posted successfully", result);
          showItems(result.data.response);
        } catch (err) {
          console.log("Error in posting expense", err);
        }
      }
      async function deleteexpense(obj) {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("you need to login first");
          return;
        }

        try {
          const response = await axios.delete(
            `${endpoint}/expense/delete-expense/${obj.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("data deleted successfully", response.data);
          getexpense();
        } catch (err) {
          console.log("Error in deleting data:", err.message);
        }
      }

      const expense = document.querySelector("#expenseform");
      expense.addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = e.target.amount.value.trim();
        const description = e.target.description.value.trim();
        const category = e.target.category.value.trim();
        const obj = { amount, description, category };
        postexpense(obj);
        e.target.reset();
      });

      function showItems(obj) {
        const ul = document.querySelector("#list");
        const li = document.createElement("li");
        li.textContent = `${obj.amount}-${obj.description}-${obj.category}`;
        const dltbtn = document.createElement("button");
        dltbtn.textContent = "Delete";
        dltbtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm("Are you sure you want to delete this expense?")) {
            deleteexpense(obj);
          }
          ul.removeChild(li);
        });
        li.appendChild(dltbtn);
        ul.appendChild(li);
      }
      document.getElementById("premiumbutton").onclick = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${endpoint}/purchase/buypremium`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(response);
          var options = {
            key: response.data.key_id,
            order_id: response.data.order.id,
            handler: async function (response) {
              try {
                await axios.post(
                  `${endpoint}/purchase/updatepremiummembers`,
                  {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                alert("you are now a premium user!");
              } catch (err) {
                console.log("Error in updating premium details", err);
                alert("Something went wrong");
              }
            },
          };
          const rzp1 = new Razorpay(options);
          rzp1.open();
          rzp1.on("payment.failed", async (response) => {
            console.log(response);

            try {
              const result = await axios.post(
                `${endpoint}/purchase/updatepremiumuseronfailure`,
                {
                  order_id: options.order_id,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              alert("Payment failed");
            } catch (err) {
              console.log("Error in payment failure status");
              alert("something went wrong");
            }
          });
        } catch (err) {
          console.log("Error in fetching details", err);
          alert("Something went wrong");
        }
      };

      document.addEventListener("DOMContentLoaded", async (e) => {
        e.preventDefault();
        getexpense(currentPage);
        const expenses = document.getElementById("Chooseone");
        expenses.addEventListener("change", (e) => {
          e.preventDefault();
          expensesPerPage = parseInt(e.target.value);
          currentPage = 1;
          getexpense(currentPage);
        });
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${endpoint}/expense/details`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.ispremium) {
            const premiumbutton = document.getElementById("premiumbutton");
            premiumbutton.textContent = "you are a premium User";
            premiumbutton.disabled = true;
            showleaderboard();
            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Download Expenses";
            downloadButton.classList.add("btn", "btn-info", "m-3");
            downloadButton.addEventListener("click", download);

            const premiumSection = document.getElementById("premiumid");
            premiumSection.appendChild(downloadButton);
          }
        } catch (err) {
          console.log("Error in fetching premium user", err);
        }
      });
      async function showleaderboard() {
        const token = localStorage.getItem("token");
        try {
          const premiumid = document.getElementById("premiumid");
          premiumid.innerHTML = "";
          const Button = document.createElement("button");
          Button.textContent = "Leaderboard";
          Button.classList.add("btn", "btn-success");
          premiumid.appendChild(Button);
          const response = await axios.get(
            `${endpoint}/premium/leaderboard`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Button.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(response);
            response.data.forEach((el) => {
              const li = document.createElement("li");
              li.textContent = `Name:${el.name}-TotalExpense:${el.totalExpense}`;
              premiumid.appendChild(li);
            });
          });
        } catch (err) {
          console.log("Error in fetching leaderboard data!", err);
        }
      }

      async function download() {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${endpoint}/expense/download`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(response);

          if (
            response.status == 201 &&
            response.data &&
            response.data.fileUrl
          ) {
            const a = document.createElement("a");
            a.href = `${response.data.fileUrl}`;
            a.download = "expenses.txt";
            a.click();
            alert("Data will be downloded");
          }
          if (!response.data.urls) {
            console.log("something went wrong in fetching urls");
          } else {
            const ul = document.getElementById("downloadid");
            response.data.urls.forEach((el) => {
              const li = document.createElement("li");
              li.innerHTML = `<a href=${el.url}>${el.url}</a>`;
              ul.appendChild(li);
            });
          }
        } catch (err) {
          alert("Failed to fetch expenses. Please try again.");
          console.log("Error in downloading ", err);
        }
      }