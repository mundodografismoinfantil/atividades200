document.addEventListener('DOMContentLoaded', () => {
  // 1. Filtro Interativo de Idades (3-4, 5-6, 7-8 anos)
  const ageData = {
    '3-4': {
      title: 'Faixa de 3 a 4 anos: Descoberta Sensorial & Coordenação',
      desc: 'Atividades curtinhas (10 a 15 min) com pinturas com esponja, colagens grandes, carimbos divertidos e reconhecimento de cores e formas sem frustração.'
    },
    '5-6': {
      title: 'Faixa de 5 a 6 anos: Imaginação, Recorte & Montagem',
      desc: 'Projetos lúdicos de dobraduras fáceis, máscaras de animais, fantoches de papel e brinquedos com rolinhos que estimulam o foco e a criatividade.'
    },
    '7-8': {
      title: 'Faixa de 7 a 8 anos: Desafios Criativos & Autonomia',
      desc: 'Construções com recicláveis, jogos de tabuleiro caseiros, desafios de 15 minutos e criações passo a passo que a criança consegue fazer quase sozinha!'
    }
  };

  const ageButtons = document.querySelectorAll('.age-btn');
  const ageContentBox = document.getElementById('age-content-display');

  ageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      ageButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-age');
      if (ageData[key] && ageContentBox) {
        ageContentBox.innerHTML = `
          <strong>✨ ${ageData[key].title}</strong>
          <p style="margin-top:4px;">${ageData[key].desc}</p>
        `;
      }
    });
  });

  // 2. Accordion de Perguntas Frequentes (FAQ)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((other) => other.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // 3. Carrossel de Depoimentos Mobile (com suporte a Touch Swipe e Botões)
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    const updateCarousel = (index) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => updateCarousel(idx));
    });

    // Suporte a deslizar o dedo (Touch Swipe no celular)
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          updateCarousel(currentIndex + 1);
        } else {
          updateCarousel(currentIndex - 1);
        }
      }
      isDragging = false;
    }, { passive: true });
  }

  // 4. Back Redirect (Botão Voltar do Celular) + Exit-Intent (Tentar Fechar a Aba)
  const exitPopup = document.getElementById('exit-popup');
  const exitCloseBtn = document.getElementById('exit-popup-close');
  let exitPopupShown = false;
  let historyArmed = false;

  const showExitPopup = () => {
    if (!exitPopup || exitPopupShown) return;
    exitPopupShown = true;
    exitPopup.classList.add('active');
    exitPopup.setAttribute('aria-hidden', 'false');
  };

  const hideExitPopup = () => {
    if (!exitPopup) return;
    exitPopup.classList.remove('active');
    exitPopup.setAttribute('aria-hidden', 'true');
  };

  if (exitCloseBtn) {
    exitCloseBtn.addEventListener('click', hideExitPopup);
  }

  if (exitPopup) {
    exitPopup.addEventListener('click', (e) => {
      if (e.target === exitPopup) {
        hideExitPopup();
      }
    });
  }

  // Arma o histórico para interceptar o botão "Voltar" no celular
  const armBackRedirect = () => {
    if (historyArmed) return;
    historyArmed = true;
    try {
      window.history.pushState({ page: 'offer-guard' }, '', window.location.href);
    } catch (err) {
      // Ignora caso o navegador restrinja pushState local
    }
  };

  armBackRedirect();
  window.addEventListener('touchstart', armBackRedirect, { once: true, passive: true });
  window.addEventListener('click', armBackRedirect, { once: true, passive: true });

  window.addEventListener('popstate', () => {
    if (!exitPopupShown) {
      showExitPopup();
    }
  });

  // No computador: quando leva o mouse para o topo para fechar a aba
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 10 && !exitPopupShown) {
      showExitPopup();
    }
  });
});
