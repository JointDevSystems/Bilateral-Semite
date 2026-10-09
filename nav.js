document.querySelectorAll('.nl a').forEach(function(a){a.addEventListener('click',function(){a.closest('nav').classList.remove('o')})});

/* Transparent at the top, translucent glass once the page scrolls */
(function(){
  var nav=document.querySelector('nav');
  if(!nav)return;
  var ticking=false;
  function update(){
    nav.classList.toggle('stuck',window.scrollY>40);
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;requestAnimationFrame(update)}
  },{passive:true});
  update();
})();

/* Mark the nav link for the page the visitor is on */
(function(){
  var file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(file==='')file='index.html';

  /* Service detail pages (svc-*.html) belong to the Services menu */
  var target=file.indexOf('svc-')===0?'services.html':file;

  var links=document.querySelectorAll('.nl > a, .nl > .dd > a');
  Array.prototype.forEach.call(links,function(a){
    var href=(a.getAttribute('href')||'').split('#')[0].split('?')[0].toLowerCase();
    if(href===target){
      a.classList.add('active');
      a.setAttribute('aria-current','page');
    }
  });

  /* On a service detail page, also highlight that page inside the dropdown */
  if(file.indexOf('svc-')===0){
    var sub=document.querySelectorAll('.dd > div a');
    Array.prototype.forEach.call(sub,function(a){
      if((a.getAttribute('href')||'').toLowerCase()===file){
        a.classList.add('active');
        a.setAttribute('aria-current','page');
      }
    });
  }
})();


/* Preloader: hide once the page has loaded (shown once per browser session) */
(function(){
  var pre=document.getElementById('preloader');
  if(!pre)return;
  var start=Date.now(),min=900,hidden=false;
  function hide(){
    if(hidden)return;hidden=true;
    pre.classList.add('done');
    try{sessionStorage.setItem('preSeen','1')}catch(e){}
    setTimeout(function(){if(pre.parentNode)pre.parentNode.removeChild(pre)},800);
  }
  function ready(){setTimeout(hide,Math.max(0,min-(Date.now()-start)))}
  if(document.readyState==='complete')ready();
  else window.addEventListener('load',ready);
  setTimeout(hide,5000); /* failsafe if something never finishes loading */
})();

/* Back-to-top button: appears after scrolling down, smooth-scrolls to the top */
(function(){
  var btn=document.createElement('button');
  btn.type='button';
  btn.className='totop';
  btn.setAttribute('aria-label','Back to top');
  btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(btn);
  var ticking=false;
  function update(){
    btn.classList.toggle('show',window.scrollY>400);
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;requestAnimationFrame(update)}
  },{passive:true});
  btn.addEventListener('click',function(){
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  });
  update();
})();