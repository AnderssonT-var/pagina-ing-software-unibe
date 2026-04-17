document.addEventListener('DOMContentLoaded',()=>{
 const logoCanvas=document.getElementById('logoCanvas');
 if(!logoCanvas) return;
 const ctx=logoCanvas.getContext('2d');
 const parent=logoCanvas.parentElement;
 const dpr=window.devicePixelRatio||1;
 let width=0;
 let height=0;
 let particles=[];
 let animationFrame=null;
 function setSize(){
   width=parent.clientWidth;
   height=parent.clientHeight;
   logoCanvas.width=width*dpr;
   logoCanvas.height=height*dpr;
   logoCanvas.style.width=width+'px';
   logoCanvas.style.height=height+'px';
   ctx.setTransform(dpr,0,0,dpr,0,0);
   createParticles();
 }
 function createParticles(){
   particles=[];
   const total=92;
   for(let i=0;i<total;i++){
     particles.push({
       x:Math.random()*width,
       y:Math.random()*height,
       vx:(Math.random()-0.5)*1.2,
       vy:(Math.random()-0.5)*1.1,
       radius:Math.random()*2.2+0.8,
       alpha:Math.random()*0.7+0.25
     });
   }
 }
 function draw(){
   ctx.clearRect(0,0,width,height);
   const glow=ctx.createRadialGradient(width*0.5,height*0.5,18,width*0.5,height*0.5,width*0.95);
   glow.addColorStop(0,'rgba(0,224,255,0.16)');
   glow.addColorStop(1,'rgba(0,0,0,0)');
   ctx.fillStyle=glow;
   ctx.fillRect(0,0,width,height);
   ctx.lineWidth=1;
   particles.forEach((a,i)=>{
     for(let j=i+1;j<particles.length;j++){
       const b=particles[j];
       const dx=a.x-b.x;
       const dy=a.y-b.y;
       const dist=dx*dx+dy*dy;
       if(dist < 3200){
         ctx.strokeStyle=`rgba(0,224,255,${0.12 - dist/3200*0.1})`;
         ctx.beginPath();
         ctx.moveTo(a.x,a.y);
         ctx.lineTo(b.x,b.y);
         ctx.stroke();
       }
     }
   });
   particles.forEach(p=>{
     p.x += p.vx;
     p.y += p.vy;
     if(p.x < -10) p.x = width + 10;
     if(p.x > width + 10) p.x = -10;
     if(p.y < -10) p.y = height + 10;
     if(p.y > height + 10) p.y = -10;
     ctx.fillStyle=`rgba(0,224,255,${p.alpha})`;
     ctx.beginPath();
     ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
     ctx.fill();
     ctx.fillStyle=`rgba(255,255,255,${Math.min(p.alpha + 0.2,0.8)})`;
     ctx.beginPath();
     ctx.arc(p.x,p.y,p.radius*0.55,0,Math.PI*2);
     ctx.fill();
   });
 }
 function animate(){
   draw();
   animationFrame=requestAnimationFrame(animate);
 }
 setSize();
 animate();
 window.addEventListener('resize',()=>{
   cancelAnimationFrame(animationFrame);
   setSize();
   animate();
 });
});