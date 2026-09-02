/* =========================================================
   G.K. MURTHY CASE RECORD
   Evidence Register + Mobile Navigation
   ========================================================= */


/* MOBILE MENU */

const menu = document.querySelector("#menu");
const nav = document.querySelector(".nav nav");

menu?.addEventListener("click", () => {

  if (!nav) return;

  const isOpen = nav.style.display === "flex";

  nav.style.display = isOpen ? "none" : "flex";
  nav.style.position = "absolute";
  nav.style.top = "70px";
  nav.style.right = "10px";
  nav.style.background = "#09162c";
  nav.style.padding = "18px";
  nav.style.flexDirection = "column";
  nav.style.borderRadius = "8px";
  nav.style.boxShadow = "0 15px 35px rgba(0,0,0,.35)";

});


/* CLOSE MOBILE MENU AFTER CLICK */

nav?.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", () => {

    if (window.innerWidth <= 850) {
      nav.style.display = "none";
    }

  });

});


/* EVIDENCE REGISTER */

async function loadEvidence() {

  const box = document.querySelector("#docs");

  if (!box) return;


  try {

    /*
      IMPORTANT:
      The manifest is located inside /documents/
    */

    const manifestUrl = "./documents/manifest.json";

    const response = await fetch(
      manifestUrl + "?v=" + Date.now(),
      {
        cache: "no-store"
      }
    );


    if (!response.ok) {
      throw new Error(
        "Could not load documents/manifest.json"
      );
    }


    const data = await response.json();


    if (!Array.isArray(data)) {
      throw new Error(
        "manifest.json is not a valid JSON array"
      );
    }


    const searchBox = document.querySelector("#q");
    const categoryBox = document.querySelector("#cat");


    async function fileExists(url) {

      try {

        /*
          First try HEAD.
          GitHub Pages supports this for the same site.
        */

        const head = await fetch(
          url + "?v=" + Date.now(),
          {
            method: "HEAD",
            cache: "no-store"
          }
        );

        return head.ok;

      } catch (error) {

        /*
          If HEAD is unavailable, assume the
          file is present because it is listed
          in the manifest.
        */

        return true;

      }

    }


    async function render() {

      const search =
        (searchBox?.value || "")
          .toLowerCase()
          .trim();


      const category =
        categoryBox?.value || "all";


      const rows = data.filter(doc => {

        let categoryMatch = true;


        if (category === "comp") {
          categoryMatch =
            doc.category === "Compassionate Appointment";
        }

        if (category === "lod") {
          categoryMatch =
            doc.category === "Line of Duty";
        }

        if (category === "vig") {
          categoryMatch =
            doc.category === "Vigilance";
        }

        if (category === "service") {
          categoryMatch =
            doc.category === "Service / Death";
        }


        const searchableText =
          [
            doc.id,
            doc.date,
            doc.category,
            doc.title,
            doc.filename
          ]
          .join(" ")
          .toLowerCase();


        return (
          categoryMatch &&
          searchableText.includes(search)
        );

      });


      if (!rows.length) {

        box.innerHTML =
          "<p class='loading'>No matching documents.</p>";

        return;

      }


      /*
        Check which PDFs actually exist.
      */

      const checkedRows = await Promise.all(

        rows.map(async doc => {

          const filename = String(
            doc.filename || ""
          ).trim();


          const url =
            "./documents/" +
            encodeURIComponent(filename);


          const exists =
            filename.length > 0
              ? await fileExists(url)
              : false;


          return {
            ...doc,
            url,
            exists
          };

        })

      );


      box.innerHTML = checkedRows.map(doc => {

        const pdfButton = doc.exists

          ? `
            <a
              class="pdfbtn"
              href="${doc.url}"
              target="_blank"
              rel="noopener"
            >
              View PDF
            </a>
          `

          : `
            <span class="await">
              PDF not uploaded yet
            </span>
          `;


        return `

          <article class="doccard">

            <div class="doctop">

              <b>
                ${escapeHtml(doc.id)}
              </b>

              <span>
                ${escapeHtml(doc.category)}
              </span>

            </div>


            <small>
              ${escapeHtml(doc.date)}
            </small>


            <h3>
              ${escapeHtml(doc.title)}
            </h3>


            <div class="docaction">

              ${pdfButton}

            </div>

          </article>

        `;

      }).join("");

    }


    /*
      Escape text coming from manifest.json.
      This prevents accidental HTML injection.
    */

    function escapeHtml(value) {

      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }


    searchBox?.addEventListener(
      "input",
      render
    );


    categoryBox?.addEventListener(
      "change",
      render
    );


    await render();


  } catch (error) {

    console.error(
      "Evidence register error:",
      error
    );


    box.innerHTML = `

      <div class="publication-note">

        <b>Evidence register could not be loaded.</b>

        <p>
          Check that
          <code>documents/manifest.json</code>
          exists and contains valid JSON.
        </p>

      </div>

    `;

  }

}


/* START */

loadEvidence();
