/**
 * This build breadcrumb-style navigation using the existing
 * tree menu generated by Trilium. The concept is to find
 * the currently active link (fixed by an earlier script)
 * and follow that up to the root part of the menu
 */
export default function buildBreadcrumbsFromNav() {
    const container = document.createElement("ul");
    container.id = "breadcrumbs";
    
    // Find currently active link
    const current = document.querySelector("#menu .active");
    if (!current) return; // Something went really wrong

    // Clone the link and add it to the front of the breadcrumb list
    const firstItem = document.createElement("li");
    firstItem.append(current.cloneNode(true));
    container.prepend(firstItem);

    // Walk the sublists upward until the root
    let next = current.closest("ul");
    while (next) {
        const clone = next?.previousElementSibling?.querySelector("a")?.cloneNode(true);
        if (!clone) continue; // This also means something went very wrong

        // Get the parent of the previous and add to front of breadcrumbs
        const ancestorItem = document.createElement("li");
        ancestorItem.append(clone);
        container.prepend(ancestorItem);

        // Get the next sublist upward
        next = next?.parentElement?.closest("ul") ?? null;

        // We are not yet at root, continue
        if (next) continue;
        
        // Since next == null, we are at root, let's ue a pretty logo
        clone.textContent = "";
        const logo = document.createElement("img");
        logo.src = "https://raw.githubusercontent.com/zadam/trilium/master/images/icon-black.svg";
        clone.appendChild(logo);
    }
    
    // We don't need this at root
    if (container.children.length === 1) return;
    
    // Add breadcrumb container to the main layout
    const main = document.getElementById("main");
    main?.prepend(container);

    // Scroll to the active breadcrumb in case of overflow
    container.scrollLeft = container.scrollWidth - container.clientWidth;
}