document.addEventListener("DOMContentLoaded", function () {
  const domainInput = document.getElementById("domainInput");
  const addDomainButton = document.getElementById("addDomainButton");
  const domainList = document.getElementById("domainList");

  domainList.style.listStyleType = "none";
  domainList.style.padding = "0";
  domainList.style.margin = "0";

  // Load existing domains from storage
  chrome.storage.sync.get({ domains: [] }, function (data) {
    data.domains.forEach(function (domain) {
      addDomainToList(domain);
    });
  });

  // Add domain button click event
  addDomainButton.addEventListener("click", function () {
    addDomain();
  });

  function addDomain() {
    // Get the input field value
    var domain = domainInput.value.trim();

    domain = "/" + domain + "/";

    if (domain.startsWith("/u/")) {
      domain = domain.replace("/u/", "/user/");
    }

    // Check if it starts with "/r/" or "/u/"
    if (domain.startsWith("/r/") || domain.startsWith("/user/")) {
      // Add the new domain to the list
      addDomainToList(domain);

      // Save the updated list to storage
      chrome.storage.sync.get({ domains: [] }, function (data) {
        data.domains.push(domain);
        chrome.storage.sync.set({ domains: data.domains });
      });

      // Clear the input field
      domainInput.value = "";
    } else {
      // Handle invalid input (optional)
      alert(
        'Invalid input. Please start with "r/" for subreddit or "u/" for username.'
      );
    }
  }

  function addDomainToList(domain) {
    // Remove /r/ or /u/ from the start and / from the end
    const trimmedDomain = domain.slice(1, -1);

    const listItem = document.createElement("li");
    listItem.textContent = trimmedDomain;

    listItem.style.cursor = "pointer";
    listItem.style.border = "1px solid #ccc";
    listItem.style.userSelect = "none";

    listItem.addEventListener("click", function () {
      // Remove the domain from the list when clicked
      removeDomainFromList(domain);
    });
    domainList.appendChild(listItem);
  }

  function removeDomainFromList(domain) {
    const listItems = document.querySelectorAll("#domainList li");
    listItems.forEach(function (item) {
      if (item.textContent === domain.slice(1, -1)) {
        item.remove();

        // Remove the domain from storage
        chrome.storage.sync.get({ domains: [] }, function (data) {
          data.domains = data.domains.filter((d) => d !== domain);
          chrome.storage.sync.set({ domains: data.domains });
        });
      }
    });
  }
});
