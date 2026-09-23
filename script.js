/** 영상 링크: 유튜브 5개는 내부 팝업, 인스타그램 2개는 HTML에서 외부 링크 연결. */
const portfolioVideos = {
  'ai-ad':  { title: 'AI 가상 브랜드 광고', url: 'https://youtu.be/kRm6HHq3u9g' },
  webtoon:  { title: '사주브랜드 · AI 웹툰', url: 'https://youtube.com/shorts/VNQrutF2Oa8' },
  lens:     { title: '렌즈 브랜드 홍보', url: 'https://youtube.com/shorts/xtz5k6fFPQ8' },
  meme:     { title: '사주브랜드 · AI 짤', url: 'https://youtube.com/shorts/YuoN8wMBSOw' },
  selfcam:  { title: '사주브랜드 · AI 셀프캠', url: 'https://youtube.com/shorts/PE02DASq4bM' },
};

function getYoutubeId(input) {
  if (!input || typeof input !== 'string') return null;
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
    let id = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = url.searchParams.get('v') || url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/)?.[1];
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : null;
  } catch { return null; }
}

const dialog = document.getElementById('video-dialog');
const stage = document.getElementById('video-stage');
const title = document.getElementById('dialog-title');
const caption = document.getElementById('dialog-caption');
const external = document.getElementById('dialog-external');
let previousFocus = null;

function closeVideo() {
  if (dialog.open) dialog.close();
  stage.replaceChildren(); // 영상 종료: iframe 제거
  previousFocus?.focus();
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-video]');
  if (!button) return;
    const project = portfolioVideos[button.dataset.video];
    if (!project) return;
    previousFocus = button;
    title.textContent = project.title;
    stage.replaceChildren();
    const videoId = getYoutubeId(project.url);
    if (videoId) {
      const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
      if (isHttp) {
        // Error 153: YouTube requires the embedding website's HTTP Referer.
        // Keep the page and iframe referrer policy permissive enough to send the origin.
        const iframe = document.createElement('iframe');
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&origin=${encodeURIComponent(location.origin)}`;
        iframe.title = `${project.title} — YouTube 영상`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        stage.append(iframe);
        caption.textContent = '재생이 제한될 경우 아래 YouTube에서 열기를 이용해 주세요.';
      } else {
        // An iframe loaded from file:// cannot supply a useful HTTP Referer.
        // Show a usable fallback instead of an iframe that is likely to display error 153.
        const message = document.createElement('p');
        message.className = 'empty-video';
        message.textContent = '웹사이트 주소에서 재생할 수 있어요.';
        const sub = document.createElement('span');
        sub.textContent = 'HTML 파일을 직접 열면 YouTube가 오류 153으로 재생을 막을 수 있어요. GitHub Pages 배포 후 확인하거나 아래 링크로 감상해 주세요.';
        message.append(sub);
        stage.append(message);
        caption.textContent = '현재는 로컬 HTML 미리보기 상태입니다.';
      }
      external.href = project.url;
      external.hidden = false;
    } else {
      const message = document.createElement('p');
      message.className = 'empty-video';
      message.textContent = '영상이 곧 연결됩니다.';
      const sub = document.createElement('span');
      sub.textContent = 'script.js 파일에 YouTube 링크를 넣어 주세요.';
      message.append(sub);
      stage.append(message);
      caption.textContent = '현재는 포트폴리오 디자인 미리보기 상태입니다.';
      external.hidden = true;
    }
    dialog.showModal();
});

document.querySelector('.dialog-close').addEventListener('click', closeVideo);
dialog.addEventListener('click', event => { if (event.target === dialog) closeVideo(); });
dialog.addEventListener('close', () => { stage.replaceChildren(); previousFocus?.focus(); });

const observer = 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ? new IntersectionObserver((entries, ob) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); ob.unobserve(entry.target); } }); }, {threshold:.08,rootMargin:'0px 0px -35px 0px'})
  : null;
document.querySelectorAll('.reveal').forEach(element => observer ? observer.observe(element) : element.classList.add('visible'));


// 숏폼 갤러리: 끝없이 느리게 이동. hover/focus/터치/모달 재생 시 잠시 멈춤.
const galleryViewport = document.getElementById('gallery-viewport');
const galleryTrack = document.getElementById('gallery-track');
const galleryToggle = document.getElementById('gallery-toggle');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
if (galleryViewport && galleryTrack) {
  const originals = Array.from(galleryTrack.children);
  originals.forEach(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('button,a').forEach(el => { el.tabIndex = -1; });
    galleryTrack.appendChild(copy);
  });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = reduceMotion.matches;
  let hovering = false;
  let interacting = false;
  let last = 0;
  let resumeAt = 0;
  let dragging = false;
  let dragX = 0;
  let dragLeft = 0;
  const cycleWidth = () => galleryTrack.children[originals.length].offsetLeft - galleryTrack.children[0].offsetLeft;
  const normalize = () => {
    const width = cycleWidth();
    if (width && galleryViewport.scrollLeft >= width) galleryViewport.scrollLeft -= width;
    if (galleryViewport.scrollLeft < 0 && width) galleryViewport.scrollLeft += width;
  };
  function updateToggle() {
    galleryToggle.textContent = userPaused ? '▶' : 'Ⅱ';
    galleryToggle.setAttribute('aria-pressed', String(userPaused));
    galleryToggle.setAttribute('aria-label', userPaused ? '영상 갤러리 자동 이동 재개' : '영상 갤러리 자동 이동 일시정지');
  }
  function tick(time) {
    const dt = Math.min(40, time - (last || time)); last = time;
    if (!userPaused && !hovering && !interacting && !dragging && !dialog.open && time > resumeAt && document.visibilityState === 'visible') {
      galleryViewport.scrollLeft += dt * .023; // 약 23px / 초
      normalize();
    }
    requestAnimationFrame(tick);
  }
  galleryViewport.addEventListener('mouseenter', () => { hovering = true; });
  galleryViewport.addEventListener('mouseleave', () => { hovering = false; });
  galleryViewport.addEventListener('focusin', () => { interacting = true; });
  galleryViewport.addEventListener('focusout', () => { interacting = false; resumeAt = performance.now() + 1500; });
  galleryViewport.addEventListener('touchstart', () => { resumeAt = performance.now() + 4000; }, {passive:true});
  galleryViewport.addEventListener('wheel', () => { resumeAt = performance.now() + 2500; }, {passive:true});
  galleryViewport.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; dragging = true; dragX = e.clientX; dragLeft = galleryViewport.scrollLeft; });
  window.addEventListener('pointerup', () => { if (dragging) { dragging = false; resumeAt = performance.now() + 2500; normalize(); } });
  galleryViewport.addEventListener('pointermove', e => { if (dragging && e.pointerType === 'mouse') galleryViewport.scrollLeft = dragLeft - (e.clientX - dragX); });
  galleryToggle.addEventListener('click', () => { userPaused = !userPaused; updateToggle(); });
  function step(dir) {
    const width = originals[0].getBoundingClientRect().width + 22;
    if (dir < 0 && galleryViewport.scrollLeft < width) galleryViewport.scrollLeft += cycleWidth();
    galleryViewport.scrollBy({left:width * dir, behavior:reduceMotion.matches?'auto':'smooth'});
    resumeAt = performance.now() + 2000;
    setTimeout(normalize, 550);
  }
  galleryPrev.addEventListener('click', () => step(-1));
  galleryNext.addEventListener('click', () => step(1));
  reduceMotion.addEventListener?.('change', e => { userPaused = e.matches; updateToggle(); });
  updateToggle();
  requestAnimationFrame(tick);
}


// Download the public GitHub PDF as a real file rather than relying on the
// cross-origin <a download> attribute (which browsers may ignore).
const downloadLink = document.getElementById('portfolio-download');
const downloadStatus = document.getElementById('download-status');
if (downloadLink) {
  downloadLink.addEventListener('click', async event => {
    event.preventDefault();
    if (downloadLink.dataset.downloading === 'true') return;
    downloadLink.dataset.downloading = 'true';
    downloadStatus.textContent = 'PDF 다운로드 준비 중…';
    try {
      const response = await fetch(downloadLink.href);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (!blob.size || !(/pdf/i.test(blob.type) || /%PDF/.test(await blob.slice(0, 8).text()))) {
        throw new Error('PDF 파일 응답이 아닙니다.');
      }
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = downloadLink.download || 'Kim Minju Portfolio.pdf';
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      downloadStatus.textContent = 'PDF 다운로드를 시작했어요.';
    } catch (error) {
      // Some privacy modes block cross-origin fetch. Open the original PDF as fallback.
      downloadStatus.textContent = '직접 다운로드가 제한되어 원본 PDF를 열었어요. 브라우저에서 저장해 주세요.';
      window.open(downloadLink.href, '_blank', 'noopener');
    } finally {
      delete downloadLink.dataset.downloading;
    }
  });
}
