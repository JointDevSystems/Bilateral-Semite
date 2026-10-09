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