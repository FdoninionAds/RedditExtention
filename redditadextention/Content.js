// *===================================================================================================================*
// This code creates the variables needed throughout the run time of this code and loads the users saved domains to be
// removed.
// *===================================================================================================================*
let previousPostCount = 0;
let allowedDomains = [];

chrome.storage.sync.get({ domains: [] }, function (data) {
  allowedDomains = data.domains;
});

// *===================================================================================================================*
// This function will compare saved domain names with the loaded post domain names. A match will result in the post's
// element being deleted thus preventing the user from seeing it.
// *===================================================================================================================*
function deletePostsWithAllowedDomains() {
  const redditPosts = document.querySelectorAll(
    '[data-testid^="post-container"]'
  );

  redditPosts.forEach((post) => {
    const postDomainElement = post.querySelector("a");

    if (postDomainElement) {
      const postDomain = postDomainElement.getAttribute("href");

      if (allowedDomains.some((domain) => postDomain.includes(domain))) {
        console.log(`Post found: ${postDomain}, element will now be deleted.`);
        post.remove();
      }
    }
  });
}

// *===================================================================================================================*
// When the user scrolls, more posts are loaded. This function will save those posts for domain checking and run the
// function needed to delete the element when they match.
// *===================================================================================================================*
function handleScroll() {
  const redditPosts = document.querySelectorAll(
    '[data-testid^="post-container"]'
  );
  const currentPostCount = redditPosts.length;

  if (currentPostCount > previousPostCount) {
    deletePostsWithAllowedDomains();
  }

  previousPostCount = currentPostCount;
}

// *===================================================================================================================*
// This code is to handle the user scrolling. It will call the function that handles the outcome of said scrolling.
// *===================================================================================================================*
window.addEventListener("scroll", handleScroll);
handleScroll();
