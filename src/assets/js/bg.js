(function() {
  var canvas = document.createElement('canvas');
  canvas.className = 'bg-canvas';
  document.body.prepend(canvas);
  var ctx = canvas.getContext('2d');
  var W, H, mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var COUNT = 70;
  var CONNECT = 160;
  var MOUSE_RAD = 220;
  var particles = [];

  for (var i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5
    });
  }

  function getColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? '74,158,255' : '5,109,232';
  }

  function dist(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    var color = getColor();

    for (var i = 0; i < COUNT; i++) {
      var p = particles[i];
      var dx = p.x - mouseX;
      var dy = p.y - mouseY;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_RAD && d > 0) {
        var f = (MOUSE_RAD - d) / MOUSE_RAD;
        p.vx += (dx / d) * f * 1.0;
        p.vy += (dy / d) * f * 1.0;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;

      if (p.x < -60) p.x = W + 60;
      if (p.x > W + 60) p.x = -60;
      if (p.y < -60) p.y = H + 60;
      if (p.y > H + 60) p.y = -60;
    }

    for (var i = 0; i < COUNT; i++) {
      for (var j = i + 1; j < COUNT; j++) {
        var d = dist(particles[i], particles[j]);
        if (d < CONNECT) {
          var a = (1 - d / CONNECT) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + color + ',' + a + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    for (var i = 0; i < COUNT; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ',0.35)';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', function() {
    mouseX = -9999;
    mouseY = -9999;
  });
})();
