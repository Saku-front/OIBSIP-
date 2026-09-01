const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sections=$$('.scene');
const progress=$('.progress span');
const portraitStage=$('#portraitStage');
let activeProject=0;

function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(scrollY/Math.max(max,1)*100)+'%';}
addEventListener('scroll',updateProgress,{passive:true});updateProgress();

// Mouse / touch depth: restrained, not game-like.
let tx=0,ty=0,rx=0,ry=0;
addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)});
function frame(){rx+=(tx*7-rx)*.06;ry+=(ty*5-ry)*.06;if(portraitStage)portraitStage.style.transform=`translate3d(${rx}px,${ry}px,0) rotateY(${rx*.55}deg) rotateX(${-ry*.35}deg)`;requestAnimationFrame(frame)} frame();

// Project dial
const cards=$$('.project-card'), label=$('#projectLabel');
function showProject(n){activeProject=(n+cards.length)%cards.length;cards.forEach((c,i)=>c.classList.toggle('active',i===activeProject));label.textContent=`0${activeProject+1} / 0${cards.length}`}
$('#prev').onclick=()=>showProject(activeProject-1);$('#next').onclick=()=>showProject(activeProject+1);
let startX=null;
$('#projectOrbit').addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});
$('#projectOrbit').addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)showProject(activeProject+(dx<0?1:-1));startX=null},{passive:true});

// Skill field reacts to pointer.
const stage=$('#skillStage');stage?.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$$('.skill-pill').forEach((el,i)=>{el.style.transform=`translate(${x*(i%2?18:-12)}px,${y*(i%3?15:-9)}px)`})});
stage?.addEventListener('pointerleave',()=>$$('.skill-pill').forEach(el=>el.style.transform=''));

// Voice presentation using the browser's available female voice where possible.
let voices=[];function loadVoices(){voices=speechSynthesis?.getVoices?.()||[]}loadVoices();speechSynthesis?.addEventListener?.('voiceschanged',loadVoices);
function pickVoice(){const preferred=voices.filter(v=>/female|samantha|zira|victoria|karen|susan|aria|jenny|libby|hazel|google us english/i.test(v.name+' '+v.voiceURI));return preferred.find(v=>/^en/i.test(v.lang))||preferred[0]||voices.find(v=>/^en/i.test(v.lang))||voices[0]}
function speak(text){if(!('speechSynthesis'in window)){alert('Your browser does not support voice playback.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.voice=pickVoice();u.lang='en-IN';u.rate=.94;u.pitch=1.08;document.body.classList.add('speaking');$('#voiceCaption').classList.add('show');$('#captionText').textContent=text.slice(0,90)+(text.length>90?'…':'');u.onend=()=>{document.body.classList.remove('speaking');setTimeout(()=>$('#voiceCaption').classList.remove('show'),600)};speechSynthesis.speak(u)}
const intro="Hi, I'm Sakshi Vikas Mule. I'm a fresher web developer from Pune, with a B.Sc. in Computer Science. I build responsive interfaces using HTML, CSS and JavaScript, and I learn by turning ideas into real projects. Have a look around — this portfolio is my little digital studio.";
$('#voiceBtn').onclick=()=>speak(intro);$('#talkBtn').onclick=()=>speak(intro);$$('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));

// Section-aware narration cue (never auto-speaks; user starts it).
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('seen')})},{threshold:.45});sections.forEach(s=>observer.observe(s));
