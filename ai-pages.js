// NÉTHRA video embeds are created only when clicked to keep the landing page fast.
// YouTube error 153 may occur when this HTML is opened directly as file://.
const caseDialog = document.getElementById('case-video-dialog');
const caseStage = document.getElementById('case-video-stage');
let caseReturnFocus = null;
function closeCaseVideo(){
  if(caseDialog?.open) caseDialog.close();
  caseStage?.replaceChildren();
  caseReturnFocus?.focus();
}
for(const trigger of document.querySelectorAll('[data-case-video]')){
  trigger.addEventListener('click',()=>{
    if(!caseDialog || !caseStage) return;
    caseReturnFocus=trigger;
    caseStage.replaceChildren();
    const id=trigger.getAttribute('data-case-video');
    if((location.protocol==='https:'||location.protocol==='http:') && /^[A-Za-z0-9_-]{11}$/.test(id||'')){
      const iframe=document.createElement('iframe');
      iframe.referrerPolicy='strict-origin-when-cross-origin';
      iframe.src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&origin=${encodeURIComponent(location.origin)}`;
      iframe.title='NÉTHRA — AI Beauty Brand Campaign';
      iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen=true;
      caseStage.append(iframe);
    } else {
      // 로컬 미리보기에서 오류 안내 대신 원본 영상으로 이동합니다.
      window.open(`https://youtube.com/shorts/${id}`, '_blank', 'noopener,noreferrer');
      return;
    }
    caseDialog.showModal();
  });
}
document.getElementById('case-dialog-close')?.addEventListener('click',closeCaseVideo);
caseDialog?.addEventListener('click', e=>{if(e.target===caseDialog)closeCaseVideo()});
caseDialog?.addEventListener('close',()=>{caseStage?.replaceChildren();caseReturnFocus?.focus()});
