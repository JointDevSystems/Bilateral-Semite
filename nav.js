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

/* Mark the nav link for the page the visitor is on.
   Exactly one top-level item is highlighted at a time.

   - Project cargo (abnormal-cargo.html) is its own top-level item.
   - abnormal-cargo.html#equipment ("Specialized equipment") is a Services
     dropdown page, so it highlights Services plus that dropdown entry and
     NOT the Project cargo link.
   - Service detail pages (svc-*) and Customs & compliance belong to Services.
   - Network, Safety & technology and Project experience belong to About. */
(function(){
  var MENU_PARENT={
    'compliance.html':'services.html',
    'network.html':'about.html',
    'safety-technology.html':'about.html',
    'experience.html':'about.html'
  };
  /* page#hash combinations that live inside a dropdown rather than at top level */
  var HASH_PARENT={
    'abnormal-cargo.html#equipment':'services.html'
  };

  function clean(a){
    return (a.getAttribute('href')||'').split('#')[0].split('?')[0].toLowerCase();
  }
  function full(a){
    return (a.getAttribute('href')||'').split('?')[0].toLowerCase();
  }
  function mark(a){
    a.classList.add('active');
    a.setAttribute('aria-current','page');
  }

  function update(){
    var file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    if(file==='')file='index.html';
    var hash=(location.hash||'').toLowerCase();
    var key=file+hash;

    /* reset so the state is correct after an in-page hash change */
    Array.prototype.forEach.call(document.querySelectorAll('.nl a.active'),function(a){
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });

    var inDropdown=false,target=file;
    if(HASH_PARENT[key]){target=HASH_PARENT[key];inDropdown=true}
    else if(file.indexOf('svc-')===0){target='services.html';inDropdown=true}
    else if(MENU_PARENT[file]){target=MENU_PARENT[file];inDropdown=true}

    /* Top level: direct children of .nl only, first match wins */
    var top=document.querySelectorAll('.nl > a, .nl > .dd > a');
    var done=false;
    Array.prototype.forEach.call(top,function(a){
      if(!done&&clean(a)===target){mark(a);done=true}
    });

    /* Dropdown entry for the exact page (including its #hash when it has one) */
    if(inDropdown){
      var sub=document.querySelectorAll('.dd > div a');
      Array.prototype.forEach.call(sub,function(a){
        var h=full(a);
        if(HASH_PARENT[key]){ if(h===key)mark(a); }
        else if(clean(a)===file&&h.indexOf('#')===-1)mark(a);
      });
    }
  }

  update();
  window.addEventListener('hashchange',update);
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