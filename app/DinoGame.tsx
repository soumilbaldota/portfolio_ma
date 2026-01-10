import React, { useEffect, useRef, useState } from 'react';

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const gameStateRef = useRef<'start' | 'playing' | 'gameOver'>('start');
  const dinoRef = useRef<any>(null);
  const obstaclesRef = useRef<any[]>([]);
  const frameCountRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 600, height: 300 });

  // Update canvas dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const groundY = canvasHeight - 50;

    dinoRef.current = {
      x: 50,
      y: groundY - 40,
      width: 40,
      height: 40,
      velocityY: 0,
      gravity: 0.6,
      jumpPower: -12,
      isJumping: false
    };

    const obstacleSpeed = 5;

    function drawDino() {
      const dino = dinoRef.current;
      ctx!.fillStyle = '#535353';
      ctx!.fillRect(dino.x, dino.y, dino.width, dino.height);
      
      // Eye
      ctx!.fillStyle = '#fff';
      ctx!.fillRect(dino.x + 30, dino.y + 5, 5, 5);
    }

    function drawObstacle(obstacle: any) {
      ctx!.fillStyle = '#535353';
      if (obstacle.type === 'cactus') {
        ctx!.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    }

    function createObstacle() {
      const types = ['cactus'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      obstaclesRef.current.push({
        x: canvasWidth,
        y: groundY - 30,
        width: 20,
        height: 30,
        type: type
      });
    }

    function updateDino() {
      const dino = dinoRef.current;
      
      if (dino.isJumping) {
        dino.velocityY += dino.gravity;
        dino.y += dino.velocityY;

        if (dino.y >= groundY - 40) {
          dino.y = groundY - 40;
          dino.velocityY = 0;
          dino.isJumping = false;
        }
      }
    }

    function updateObstacles() {
      const dino = dinoRef.current;
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        obstaclesRef.current[i].x -= obstacleSpeed;

        if (obstaclesRef.current[i].x + obstaclesRef.current[i].width < 0) {
          obstaclesRef.current.splice(i, 1);
          setScore(s => s + 1);
          continue;
        }

        if (checkCollision(obstaclesRef.current[i])) {
          endGame();
        }
      }
    }

    function checkCollision(obstacle: any) {
      const dino = dinoRef.current;
      return (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x &&
        dino.y < obstacle.y + obstacle.height &&
        dino.y + dino.height > obstacle.y
      );
    }

    function drawBackground() {
      ctx!.fillStyle = '#f7f7f7';
      ctx!.fillRect(0, 0, canvasWidth, canvasHeight);

      // Ground
      ctx!.strokeStyle = '#535353';
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(0, groundY);
      ctx!.lineTo(canvasWidth, groundY);
      ctx!.stroke();
    }

    function gameLoop() {
      if (gameStateRef.current !== 'playing') return;

      drawBackground();
      drawDino();
      updateDino();

      frameCountRef.current++;
      if (frameCountRef.current % 100 === 0) {
        createObstacle();
      }

      obstaclesRef.current.forEach(drawObstacle);
      updateObstacles();

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
    drawDino();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const jump = () => {
    if (gameState === 'start') {
      setGameState('playing');
      gameStateRef.current = 'playing';
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const groundY = canvasHeight - 50;
      const obstacleSpeed = 5;

      function drawDino() {
        const dino = dinoRef.current;
        ctx!.fillStyle = '#535353';
        ctx!.fillRect(dino.x, dino.y, dino.width, dino.height);
        
        ctx!.fillStyle = '#fff';
        ctx!.fillRect(dino.x + 30, dino.y + 5, 5, 5);
      }

      function drawObstacle(obstacle: any) {
        ctx!.fillStyle = '#535353';
        if (obstacle.type === 'cactus') {
          ctx!.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
      }

      function createObstacle() {
        const types = ['cactus'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        obstaclesRef.current.push({
          x: canvasWidth,
          y: groundY - 30,
          width: 20,
          height: 30,
          type: type
        });
      }

      function updateDino() {
        const dino = dinoRef.current;
        
        if (dino.isJumping) {
          dino.velocityY += dino.gravity;
          dino.y += dino.velocityY;

          if (dino.y >= groundY - 40) {
            dino.y = groundY - 40;
            dino.velocityY = 0;
            dino.isJumping = false;
          }
        }
      }

      function updateObstacles() {
        const dino = dinoRef.current;
        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          obstaclesRef.current[i].x -= obstacleSpeed;

          if (obstaclesRef.current[i].x + obstaclesRef.current[i].width < 0) {
            obstaclesRef.current.splice(i, 1);
            setScore(s => s + 1);
            continue;
          }

          if (checkCollision(obstaclesRef.current[i])) {
            endGame();
          }
        }
      }

      function checkCollision(obstacle: any) {
        const dino = dinoRef.current;
        return (
          dino.x < obstacle.x + obstacle.width &&
          dino.x + dino.width > obstacle.x &&
          dino.y < obstacle.y + obstacle.height &&
          dino.y + dino.height > obstacle.y
        );
      }

      function drawBackground() {
        ctx!.fillStyle = '#f7f7f7';
        ctx!.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx!.strokeStyle = '#535353';
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(0, groundY);
        ctx!.lineTo(canvasWidth, groundY);
        ctx!.stroke();
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
        drawDino();
        updateDino();

        frameCountRef.current++;
        if (frameCountRef.current % 100 === 0) {
          createObstacle();
        }

        obstaclesRef.current.forEach(drawObstacle);
        updateObstacles();

        animationRef.current = requestAnimationFrame(gameLoop);
      }

      gameLoop();
    }

    if (gameState === 'playing' && dinoRef.current && !dinoRef.current.isJumping) {
      dinoRef.current.velocityY = dinoRef.current.jumpPower;
      dinoRef.current.isJumping = true;
    }
  };

  const restartGame = () => {
    const groundY = canvasHeight - 50;
    dinoRef.current = {
      x: 50,
      y: groundY - 40,
      width: 40,
      height: 40,
      velocityY: 0,
      gravity: 0.6,
      jumpPower: -12,
      isJumping: false
    };
    obstaclesRef.current = [];
    setScore(0);
    frameCountRef.current = 0;
    setGameState('start');
    gameStateRef.current = 'start';

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'gameOver') {
          restartGame();
        } else {
          jump();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-100 relative">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={jump}
        className="w-full h-full cursor-pointer"
      />
        
      <div className="absolute bottom-5 right-5 text-3xl font-mono text-gray-700">
        Score: {score}
      </div>

      {gameState === 'start' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-700">
          <h1 className="text-5xl font-bold mb-4">
            DINO GAME
          </h1>
          <p className="text-xl mb-2">
            Click or press SPACE to start
          </p>
          <p className="text-xl">
            Press SPACE or ↑ to jump
          </p>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-700 text-gray-700 p-8 rounded-lg text-center">
          <h2 className="text-4xl font-bold mb-3">Game Over!</h2>
          <p className="text-xl mb-2">Score: {score}</p>
          <p className="text-xl mb-6">Best: {bestScore}</p>
          <button
            onClick={restartGame}
            className="px-8 py-3 text-xl bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-md transition-colors"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
