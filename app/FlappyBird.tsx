import React, { useEffect, useRef, useState } from 'react';

export function FlappyBirdGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'
  const gameStateRef = useRef('start');
  const birdRef: any = useRef(null);
  const pipesRef: any = useRef([]);
  const frameCountRef: any = useRef(0);
  const animationRef: any = useRef(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 600, height: 300 });

  // Update canvas dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container: any = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        setCanvasDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const canvasWidth = canvasDimensions.width;
  const canvasHeight = canvasDimensions.height;

  useEffect(() => {
    const canvas: any = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    birdRef.current = {
      x: 80,
      y: canvasHeight * 0.3,
      radius: 15,
      velocity: 0,
      gravity: 0.5,
      jump: -9
    };

    const pipeWidth = 60;
    const pipeGap = 150;
    const pipeSpeed = 2;

    function drawBird() {
      const bird: any = birdRef.current!;
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.moveTo(bird.x + bird.radius, bird.y);
      ctx.lineTo(bird.x + bird.radius + 10, bird.y - 5);
      ctx.lineTo(bird.x + bird.radius + 10, bird.y + 5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(bird.x + 5, bird.y - 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPipe(pipe: any) {
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
      ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);

      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);
      ctx.strokeRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);

      ctx.fillStyle = '#66BB6A';
      ctx.fillRect(pipe.x - 5, pipe.top - 20, pipeWidth + 10, 20);
      ctx.fillRect(pipe.x - 5, pipe.top + pipeGap, pipeWidth + 10, 20);
    }

    function createPipe() {
      const minTop = 50;
      const maxTop = canvas.height - pipeGap - 50;
      const top = Math.random() * (maxTop - minTop) + minTop;

      pipesRef.current.push({
        x: canvas.width,
        top: top,
        scored: false
      });
    }

    function updateBird() {
      const bird = birdRef.current;
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      if (bird.y + bird.radius > canvas.height) {
        bird.y = canvas.height - bird.radius;
        endGame();
      }

      if (bird.y - bird.radius < 0) {
        bird.y = bird.radius;
      }
    }

    function updatePipes() {
      const bird = birdRef.current;
      for (let i = pipesRef.current.length - 1; i >= 0; i--) {
        pipesRef.current[i].x -= pipeSpeed;

        if (pipesRef.current[i].x + pipeWidth < 0) {
          pipesRef.current.splice(i, 1);
          continue;
        }

        if (!pipesRef.current[i].scored && pipesRef.current[i].x + pipeWidth < bird.x - bird.radius) {
          setScore(s => s + 1);
          pipesRef.current[i].scored = true;
        }

        if (checkCollision(pipesRef.current[i])) {
          endGame();
        }
      }
    }

    function checkCollision(pipe: any) {
      const bird = birdRef.current;
      if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
        if (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.top + pipeGap) {
          return true;
        }
      }
      return false;
    }

    function drawBackground() {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    }

    function gameLoop() {
      if (gameStateRef.current !== 'playing') return;

      drawBackground();
      drawBird();
      updateBird();

      frameCountRef.current++;
      if (frameCountRef.current % 90 === 0) {
        createPipe();
      }

      pipesRef.current.forEach(drawPipe);
      updatePipes();

      animationRef.current = requestAnimationFrame(gameLoop);
    }

    function endGame() {
      if (gameStateRef.current === 'gameOver') return;
      gameStateRef.current = 'gameOver';
      setGameState('gameOver');
      setBestScore(prev => Math.max(prev, score));
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    drawBackground();
    drawBird();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const flap = () => {
    if (gameState === 'start') {
      setGameState('playing');
      gameStateRef.current = 'playing';
      const canvas:any = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const pipeWidth = 60;
      const pipeGap = 150;
      const pipeSpeed = 2;

      function drawBird() {
        const bird = birdRef.current;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(bird.x + bird.radius, bird.y);
        ctx.lineTo(bird.x + bird.radius + 10, bird.y - 5);
        ctx.lineTo(bird.x + bird.radius + 10, bird.y + 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(bird.x + 5, bird.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      function drawPipe(pipe: any) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);

        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.strokeRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);

        ctx.fillStyle = '#66BB6A';
        ctx.fillRect(pipe.x - 5, pipe.top - 20, pipeWidth + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.top + pipeGap, pipeWidth + 10, 20);
      }

      function createPipe() {
        const minTop = 50;
        const maxTop = canvas.height - pipeGap - 50;
        const top = Math.random() * (maxTop - minTop) + minTop;

        pipesRef.current.push({
          x: canvas.width,
          top: top,
          scored: false
        });
      }

      function updateBird() {
        const bird = birdRef.current;
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.radius > canvas.height) {
          bird.y = canvas.height - bird.radius;
          endGame();
        }

        if (bird.y - bird.radius < 0) {
          bird.y = bird.radius;
        }
      }

      function updatePipes() {
        const bird = birdRef.current;
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          pipesRef.current[i].x -= pipeSpeed;

          if (pipesRef.current[i].x + pipeWidth < 0) {
            pipesRef.current.splice(i, 1);
            continue;
          }

          if (!pipesRef.current[i].scored && pipesRef.current[i].x + pipeWidth < bird.x - bird.radius) {
            setScore(s => s + 1);
            pipesRef.current[i].scored = true;
          }

          if (checkCollision(pipesRef.current[i])) {
            endGame();
          }
        }
      }

      function checkCollision(pipe: any) {
        const bird = birdRef.current;
        if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
          if (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.top + pipeGap) {
            return true;
          }
        }
        return false;
      }

      function drawBackground() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
      }

      function endGame() {
        if (gameStateRef.current === 'gameOver') return;
        gameStateRef.current = 'gameOver';
        setGameState('gameOver');
        setBestScore(prev => Math.max(prev, score));
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }

      function gameLoop() {
        if (gameStateRef.current !== 'playing') return;

        drawBackground();
        drawBird();
        updateBird();

        frameCountRef.current++;
        if (frameCountRef.current % 90 === 0) {
          createPipe();
        }

        pipesRef.current.forEach(drawPipe);
        updatePipes();

        animationRef.current = requestAnimationFrame(gameLoop);
      }

      gameLoop();
    }

    if (gameState === 'playing') {
      birdRef.current.velocity = birdRef.current.jump;
    }
  };

  const restartGame = () => {
    birdRef.current = {
      x: 80,
      y: canvasHeight * 0.3,
      radius: 15,
      velocity: 0,
      gravity: 0.5,
      jump: -9
    };
    pipesRef.current = [];
    setScore(0);
    frameCountRef.current = 0;
    setGameState('start');
    gameStateRef.current = 'start';

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'gameOver') {
          restartGame();
        } else {
          flap();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div ref={containerRef} className="w-full h-full bg-gradient-to-b from-cyan-400 to-blue-300">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={flap}
        className="w-full h-full cursor-pointer"
    />
        
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-5xl font-bold text-white z-10"
           style={{ textShadow: '3px 3px 0 #000' }}>
        {score}
      </div>

      {gameState === 'start' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20">
          <h1 className="text-5xl font-bold mb-4" style={{ textShadow: '3px 3px 0 #000' }}>
            FLAPPY BIRD
          </h1>
          <p className="text-xl mb-2" style={{ textShadow: '2px 2px 0 #000' }}>
            Click or press SPACE to start
          </p>
          <p className="text-xl" style={{ textShadow: '2px 2px 0 #000' }}>
            Click or press SPACE to flap
          </p>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white p-8 rounded-lg text-center z-20">
          <h2 className="text-4xl font-bold mb-3">Game Over!</h2>
          <p className="text-xl mb-2">Score: {score}</p>
          <p className="text-xl mb-6">Best: {bestScore}</p>
          <button
            onClick={restartGame}
            className="px-8 py-3 text-xl bg-green-500 hover:bg-green-600 text-white font-bold rounded-md transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}