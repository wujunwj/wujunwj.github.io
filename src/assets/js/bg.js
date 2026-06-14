(function() {
  var canvas = document.createElement('canvas');
  canvas.className = 'bg-canvas';
  document.body.prepend(canvas);
  var ctx = canvas.getContext('2d');
  var W, H, CX, CY;
  var mouseX = -9999, mouseY = -9999;
  var stars = [];
  var shootingStars = [];
  var connections = [];
  var time = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    CX = W / 2;
    CY = H / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  var COUNT = 140;
  var CONNECT_DIST = 180;
  var MOUSE_RADIUS = 250;
  var DEPTH = 800;

  function getColor(rgb) {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? (rgb ? '74,158,255' : 'rgba(74,158,255,') : (rgb ? '5,109,232' : 'rgba(5,109,232,');
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  // Stars
  for (var i = 0; i < COUNT; i++) {
    stars.push({
      x: rand(-W * 0.5, W * 1.5),
      y: rand(-H * 0.5, H * 1.5),
      z: rand(50, DEPTH),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.15, 0.15),
      vz: rand(-0.3, 0.3),
      size: rand(1, 3),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.3, 1),
      pulseSpeed: rand(0.01, 0.03)
    });
  }

  function addShootingStar() {
    shootingStars.push({
      x: rand(0, W),
      y: rand(0, H * 0.4),
      vx: rand(-4, -2),
      vy: rand(1, 3),
      life: 1,
      decay: rand(0.008, 0.015),
      length: rand(60, 120)
    });
  }

  function spawnShootingStar() {
    if (Math.random() < 0.005) addShootingStar();
  }

  function getScreenPos(p) {
    var scale = DEPTH / (DEPTH - p.z + 50);
    var sx = (p.x - CX) * scale + CX;
    var sy = (p.y - CY) * scale + CY;
    var sz = scale;
    return { x: sx, y: sy, scale: sz };
  }

  function animate() {
    time++;
    ctx.clearRect(0, 0, W, H);
    var rgb = getColor(true);

    // Mouse parallax offset
    var px = (mouseX - CX) / CX * 0.03;
    var py = (mouseY - CY) / CY * 0.03;

    // Update stars
    for (var i = 0; i < COUNT; i++) {
      var s = stars[i];

      // Mouse interaction
      var dx = s.x - mouseX;
      var dy = s.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        s.vx += (dx / dist) * force * 0.6;
        s.vy += (dy / dist) * force * 0.6;
        s.vz -= force * 0.5; // Push inward in z
      }

      s.x += s.vx + s.speed * px * (s.z / DEPTH);
      s.y += s.vy + s.speed * py * (s.z / DEPTH);
      s.z += s.vz;
      s.vx *= 0.98;
      s.vy *= 0.98;
      s.vz *= 0.98;

      // Wrap
      if (s.x < -W * 0.5) s.x = W * 1.5;
      if (s.x > W * 1.5) s.x = -W * 0.5;
      if (s.y < -H * 0.5) s.y = H * 1.5;
      if (s.y > H * 1.5) s.y = -H * 0.5;
      if (s.z < 50) s.z = DEPTH;
      if (s.z > DEPTH) s.z = 50;
    }

    // Draw connections (only between visible stars near center)
    ctx.lineWidth = 0.5;
    for (var i = 0; i < COUNT; i++) {
      var si = stars[i];
      var pi = getScreenPos(si);
      if (pi.x < -100 || pi.x > W + 100 || pi.y < -100 || pi.y > H + 100) continue;

      for (var j = i + 1; j < COUNT; j++) {
        var sj = stars[j];
        var pj = getScreenPos(sj);
        if (pj.x < -100 || pj.x > W + 100 || pj.y < -100 || pj.y > H + 100) continue;

        var dx = pi.x - pj.x;
        var dy = pi.y - pj.y;
        var dz = si.z - sj.z;
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz * 0.1);
        if (dist < CONNECT_DIST) {
          var alpha = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha + ')';
          ctx.stroke();
        }
      }
    }

    // Draw stars
    for (var i = 0; i < COUNT; i++) {
      var s = stars[i];
      var sp = getScreenPos(s);
      if (sp.x < -50 || sp.x > W + 50 || sp.y < -50 || sp.y > H + 50) continue;

      var size = s.size * (0.3 + sp.scale * 0.7);
      var pulse = 0.7 + 0.3 * Math.sin(time * s.pulseSpeed + s.phase);
      var alpha = Math.min(1, sp.scale * 0.6) * pulse;

      // Glow
      if (size > 2) {
        var grad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, size * 4);
        grad.addColorStop(0, 'rgba(' + rgb + ',' + alpha * 0.3 + ')');
        grad.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      var alpha2 = alpha * (0.3 + 0.7 * sp.scale);
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, Math.max(0.5, size), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + rgb + ',' + alpha2 + ')';
      ctx.fill();

      // Bright center
      if (size > 1.5) {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + alpha * 0.4 + ')';
        ctx.fill();
      }
    }

    // Shooting stars
    spawnShootingStar();
    for (var i = shootingStars.length - 1; i >= 0; i--) {
      var ss = shootingStars[i];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= ss.decay;

      if (ss.life <= 0 || ss.x < -100 || ss.y > H + 100) {
        shootingStars.splice(i, 1);
        continue;
      }

      var tailX = ss.x - ss.vx * ss.length * ss.life * 0.5;
      var tailY = ss.y - ss.vy * ss.length * ss.life * 0.5;

      var grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
      grad.addColorStop(0, 'rgba(' + rgb + ',' + ss.life * 0.8 + ')');
      grad.addColorStop(1, 'rgba(' + rgb + ',0)');
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5 * ss.life;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Head glow
      if (ss.life > 0.3) {
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2 * ss.life, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + ss.life * 0.6 + ')';
        ctx.fill();
      }
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
