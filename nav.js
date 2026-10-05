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