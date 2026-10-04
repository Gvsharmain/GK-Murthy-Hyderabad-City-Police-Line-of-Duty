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

if (category === "lokayukta") {
  categoryMatch =
    doc.category === "Lokayukta / Administrative Grievance";
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

const lightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.querySelector(".image-lightbox-close");

document.querySelectorAll(".zoomable-image").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

const flowerPhoto = document.querySelector(".flower-photo");

if (flowerPhoto) {
  for (let i = 0; i < 14; i++) {
    const petal = document.createElement("span");

    petal.className = "petal";

    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${4 + Math.random() * 4}s`;
    petal.style.animationDelay = `${Math.random() * 6}s`;
    petal.style.transform = `scale(${0.6 + Math.random() * 0.7})`;

    flowerPhoto.appendChild(petal);
  }
}
// Background audio
(() => {
  const audio = document.getElementById("background-audio");

  if (!audio) return;

  audio.loop = true;

  const startAudio = () => {
    audio.play().catch(() => {
      // Chrome may block autoplay until the visitor interacts with the page.
    });
  };

  startAudio();

  document.addEventListener("click", startAudio, { once: true });
  document.addEventListener("touchstart", startAudio, { once: true });
  document.addEventListener("keydown", startAudio, { once: true });
   
let scrollAudioStarted = false;

window.addEventListener("scroll", () => {
  if (scrollAudioStarted) return;

  scrollAudioStarted = true;
  startAudio();
}, { passive: true });
})();

/* 
START */

loadEvidence();
/* AUDIO FALLBACK + YOUTUBE CONTROL */
/* AUDIO FALLBACK + YOUTUBE CONTROL */
(() => {
  const audio = document.getElementById("background-audio");

  if (!audio) return;

  let youtubePlaying = false;

  function otherMediaPlaying() {
    return Array.from(document.querySelectorAll("audio, video"))
      .some(media => {
        return (
          media !== audio &&
          !media.paused &&
          !media.ended &&
          media.readyState >= 2
        );
      });
  }

  function updateAudio() {

    /* Never restart our MP3 while YouTube is playing */
    if (youtubePlaying) {
      if (!audio.paused) {
        audio.pause();
      }
      return;
    }

    if (otherMediaPlaying()) {
      if (!audio.paused) {
        audio.pause();
      }
      return;
    }

    audio.play().catch(() => {});
  }

  /* Check every second */
  function setupYouTubePlayers() {

    if (!window.YT || !window.YT.Player) return;

    const frames = Array.from(document.querySelectorAll("iframe"))
      .filter(frame =>
        frame.src.includes("youtube.com/embed/")
      );

    frames.forEach(frame => {

      new YT.Player(frame, {

        events: {

          onStateChange: event => {

            if (event.data === YT.PlayerState.PLAYING) {

              youtubePlaying = true;

              audio.pause();
              audio.currentTime = 0;

            }

            if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.ENDED
            ) {

              youtubePlaying = false;

              audio.play().catch(() => {});

            }

          }

        }

      });

    });

  }

  window.onYouTubeIframeAPIReady = setupYouTubePlayers;

  const youtubeAPI = document.createElement("script");

  youtubeAPI.src = "https://www.youtube.com/iframe_api";
  youtubeAPI.async = true;

  document.head.appendChild(youtubeAPI);

})();
