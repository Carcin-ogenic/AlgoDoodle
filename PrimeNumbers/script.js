document.addEventListener("DOMContentLoaded", () => {
  const limitInput = document.getElementById("limit");
  const visualizeBtn = document.getElementById("visualize-btn");
  const clearBtn = document.getElementById("clear-btn");
  const visualization = document.getElementById("visualization");

  visualizeBtn.addEventListener("click", async () => {
    const limit = parseInt(limitInput.value);
    if (isNaN(limit) || limit < 1) {
      alert("Please enter a valid limit greater than 0.");
      return;
    }

    visualizeBtn.disabled = true;
    await visualizePrimes(limit);
    visualizeBtn.disabled = false;
  });

  clearBtn.addEventListener("click", clearVisualization);

  async function visualizePrimes(limit) {
    clearVisualization();

    const isPrimeArray = Array(limit + 1).fill(true);
    isPrimeArray[0] = isPrimeArray[1] = false;

    for (let num = 1; num <= limit; num++) {
      const numberDiv = document.createElement("div");
      numberDiv.classList.add("number");
      numberDiv.textContent = num;
      numberDiv.id = `num-${num}`;
      visualization.appendChild(numberDiv);
      
    }

    for (let p = 2; p * p <= limit; p++) {
      if (isPrimeArray[p]) {
        const primeDiv = document.getElementById(`num-${p}`);
        primeDiv.classList.add("checking");

        await delay(500);

        for (let multiple = p * p; multiple <= limit; multiple += p) {
          isPrimeArray[multiple] = false;
          const multipleDiv = document.getElementById(`num-${multiple}`);
          multipleDiv.classList.add("non-prime");
          await delay(100);
        }
        primeDiv.classList.remove("checking");
        primeDiv.classList.add("prime");
      }
    }

    for (let num = 1; num <= limit; num++) {
      const numberDiv = document.getElementById(`num-${num}`);
      if (num === 1 || !isPrimeArray[num]) {
        numberDiv.classList.add("non-prime");
      } else {
        numberDiv.classList.add("prime");
      }
    }
  }

  function clearVisualization() {
    visualization.innerHTML = "";
    limitInput.value = "";
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
