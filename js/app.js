document.addEventListener('DOMContentLoaded', function () {

  var loadingScreen = document.getElementById('loading-screen');
  var challengeScreen = document.getElementById('challenge-screen');
  var mainSite = document.getElementById('main-site');

  setTimeout(function () {
    loadingScreen.classList.remove('active');
    loadingScreen.style.display = 'none';
    startChallenge();
  }, 2000);

  function startChallenge() {
    challengeScreen.classList.add('active');

    var lines = challengeScreen.querySelectorAll('.challenge-text');
    lines.forEach(function (line, i) {
      setTimeout(function () {
        line.classList.add('show');
      }, 300 + i * 600);
    });

    buildStarField();
  }

  function buildStarField() {
    var field = document.getElementById('star-field');
    var total = 20;
    var targetIndex = Math.floor(Math.random() * total);
    var found = false;

    for (var i = 0; i < total; i++) {
      var star = document.createElement('div');
      star.className = 'field-star';

      var top = 15 + Math.random() * 65;
      var left = 8 + Math.random() * 84;
      star.style.top = top + '%';
      star.style.left = left + '%';
      star.style.animationDelay = (Math.random() * 2) + 's';

      if (i === targetIndex) {
        star.classList.add('target');
        star.style.boxShadow = '0 0 16px 5px rgba(79, 195, 247, 0.85)';
      }

      star.addEventListener('click', (function (isTarget, el) {
        return function () {
            if (!isPlaying) {
                bgMusic.play().catch(() => {});
                iconPlay.style.display = 'none';
                iconPause.style.display = 'block';
                isPlaying = true;
            }
          if (found) return;
          if (isTarget) {
            found = true;
            el.classList.add('found');
            var success = document.querySelector('.challenge-success');
            setTimeout(function () {
              success.classList.add('show');
            }, 500);
            setTimeout(function () {
              goToMainSite();
            }, 2200);
          } else {
            el.style.transform = 'scale(0.7)';
            setTimeout(function () {
              el.style.transform = 'scale(1)';
            }, 200);
          }
        };
      })(i === targetIndex, star));

      field.appendChild(star);
    }
  }

  function goToMainSite() {
    challengeScreen.classList.remove('active');
    mainSite.classList.add('active');
    window.scrollTo(0, 0);
    startHero();
    initObservers();
    initGallery();
  }

  function startHero() {
    var titleEl = document.getElementById('typing-title');
    var subtitleEl = document.getElementById('hero-subtitle');
    var text = 'Happy Birthday';
    var index = 0;

    var cursor = document.createElement('span');
    cursor.className = 'cursor';

    function typeChar() {
      if (index <= text.length) {
        titleEl.textContent = text.slice(0, index);
        titleEl.appendChild(cursor);
        index++;
        setTimeout(typeChar, 100);
      } else {
        setTimeout(function () {
          cursor.style.display = 'none';
          subtitleEl.classList.add('show');
        }, 400);
      }
    }

    setTimeout(typeChar, 500);
    buildParticles();
    setupShootingStar();
  }

  function buildParticles() {
    var container = document.getElementById('hero-particles');
    var count = 40;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = 1 + Math.random() * 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.top = Math.random() * 100 + '%';
      p.style.left = Math.random() * 100 + '%';
      p.style.opacity = 0.3 + Math.random() * 0.6;
      p.style.animationDuration = (1.5 + Math.random() * 2.5) + 's';
      p.style.animationDelay = (Math.random() * 3) + 's';
      container.appendChild(p);
    }
  }

  function setupShootingStar() {
    var star = document.getElementById('shooting-star-1');
    function fire() {
      star.classList.remove('fire');
      void star.offsetWidth;
      star.classList.add('fire');
    }
    fire();
    setInterval(fire, 6000);
  }

  function initObservers() {
    var revealTexts = document.querySelectorAll('.reveal-text');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.4 });

    revealTexts.forEach(function (el) {
      observer.observe(el);
    });

    setupSecretStars();
    setupLetter();
    setupFinalSurprise();
  }

  function setupSecretStars() {
    var messages = {
      '1': 'Aku senang bisa mengenalmu sejauh ini.',
      '2': 'Salah satu hal yang aku suka adalah caramu membawa energi positif ke orang lain.',
      '3': 'Semoga semua hal baik yang kamu harapkan perlahan datang satu per satu.'
    };

    var stars = document.querySelectorAll('.secret-star');
    var messageBox = document.getElementById('secret-message');
    var openLetterBtn = document.getElementById('open-letter-btn');
    var openedCount = 0;
    var openedSet = {};

    stars.forEach(function (star) {
      star.addEventListener('click', function () {
        var key = star.getAttribute('data-star');
        messageBox.textContent = messages[key];
        messageBox.classList.add('show');

        if (!openedSet[key]) {
          openedSet[key] = true;
          openedCount++;
          star.classList.add('opened');
        }

        if (openedCount === 3) {
          openLetterBtn.classList.remove('hidden');
        }
      });
    });

    openLetterBtn.addEventListener('click', function () {
      document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function setupLetter() {
    var envelope = document.getElementById('envelope');
    var letterPaper = document.getElementById('letter-paper');
    var opened = false;

    envelope.addEventListener('click', function () {
      if (opened) return;
      opened = true;
      envelope.classList.add('open');

      setTimeout(function () {
        letterPaper.classList.remove('hidden');
        setTimeout(function () {
          letterPaper.classList.add('show');
        }, 50);
      }, 500);
    });
  }

  function initGallery() {
    var track = document.getElementById('gallery-track');
    var items = track.querySelectorAll('.gallery-item');
    var dotsContainer = document.getElementById('gallery-dots');

    items.forEach(function (_, i) {
      var dot = document.createElement('div');
      dot.className = 'g-dot';
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.g-dot');

    function updateActive() {
      var scrollLeft = track.scrollLeft;
      var width = track.clientWidth;
      var index = Math.round(scrollLeft / width);

      items.forEach(function (item, i) {
        if (i === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      dots.forEach(function (dot, i) {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    track.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateActive);
    });
  }

  function setupFinalSurprise() {
    var giftBtn = document.getElementById('gift-btn');
    var finalContent = document.getElementById('final-content');
    var meteor = document.getElementById('meteor');
    var confettiField = document.getElementById('confetti-field');
    var section = document.getElementById('final-surprise');

    giftBtn.addEventListener('click', function () {
      giftBtn.classList.add('hidden');

      meteor.classList.add('fly');
      section.style.transition = 'background 0.6s ease';
      section.style.boxShadow = 'inset 0 0 120px rgba(124, 77, 255, 0.5)';

      spawnConfetti();

      setTimeout(function () {
        finalContent.classList.remove('hidden');
        setTimeout(function () {
          finalContent.classList.add('show');
        }, 50);
      }, 900);

      setTimeout(function () {
        section.style.boxShadow = 'none';
      }, 2000);
    });

    function spawnConfetti() {
      var colors = ['#7C4DFF', '#4FC3F7', '#FFFFFF'];
      for (var i = 0; i < 36; i++) {
        var piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = (Math.random() * 0.6) + 's';
        piece.style.width = (4 + Math.random() * 4) + 'px';
        piece.style.height = piece.style.width;
        confettiField.appendChild(piece);

        setTimeout(function (el) {
          return function () {
            el.classList.add('fall');
          };
        }(piece), 10);

        setTimeout(function (el) {
          return function () {
            el.remove();
          };
        }(piece), 3200);
      }
    }
  }

  var musicToggle = document.getElementById('music-toggle');
  var bgMusic = document.getElementById('bg-music');
  var iconPlay = document.getElementById('music-icon-play');
  var iconPause = document.getElementById('music-icon-pause');
  var isPlaying = false;

  musicToggle.addEventListener('click', function () {
    if (isPlaying) {
      bgMusic.pause();
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      isPlaying = false;
    } else {
      bgMusic.play().catch(function () {});
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      isPlaying = true;
    }
  });
});