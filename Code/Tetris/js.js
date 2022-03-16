// Réalisation inspirée du tutoriel Canvas Game Youtube : https://www.youtube.com/watch?v=H2aW5V46khA
// Améliorations, modifications JS, ajouts de fonctionnalités au jeu -> notamment : réglages et design CSS, apparences des pièces et du canvas, Controls/Gamepad, responsive design, 5 Levels avec accélérations du jeu, activation et désactivation de la musique, événements Start/Restart + Pause/Continue


// Ne fonctionne pas
var myAudio = document.getElementById("myAudio");

function togglePlay() {
    return myAudio.paused ? myAudio.play() : myAudio.pause();
};

let currentRepository;
let repository = true;
let n = 1;

const canvasTetris = document.getElementById('tetris');
const canvasRepository = document.getElementById('repository');
const canvasStartGame = document.getElementById('start_game');
const canvasRestartGame = document.getElementById('restart_game');
const canvasDemoImg = document.getElementById('demo-img');
const canvasLevels = document.getElementById('levels');
const canvasPauseGame = document.getElementById('pause_game');
const canvasContinueGame = document.getElementById('continue_game');
const canvasScore = document.getElementById('score');

const contextTetris = canvasTetris.getContext('2d');
const contextRepository = canvasRepository.getContext('2d');

canvasTetris.style.border = '0px solid transparent';
canvasRepository.style.border = '0px solid transparent';

canvasStartGame.addEventListener("click", function() {
    const arenaTetris = createMatrix(12, 20);
    const arenaRepository = createMatrix(3, 3);

    canvasTetris.style.border = 'solid .2em #fff';
    canvasRepository.style.border = 'solid .2em #fff';
    canvasStartGame.style.display = "none";
    canvasDemoImg.style.display = "none";
    canvasRestartGame.style.display = "block";

    // Bouton pour recommencer la partie sans reload de la page 
    canvasRestartGame.addEventListener("click", function() {
        player.pos.y = 0;
        merge(player);
        dropInterval = 500;
        currentRepository = undefined;
        repository = true;
        canvasLevels.innerText = "Level 1";
    });

    // Ici on définit les ombres des dessins des pièces du jeu
    // Voir : https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/shadowColor
    contextTetris.shadowColor = 'black';
    contextTetris.shadowOffsetX = 0.5;
    contextTetris.shadowOffsetY = 0.5;

    // On définit l'échelle du Tetris
    contextTetris.scale(20, 20);

    // ????
    contextRepository.shadowColor = 'black';
    contextRepository.shadowOffsetX = 0.5;
    contextRepository.shadowOffsetY = 0.5;

    // On définit l'échelle du Tetris
    contextRepository.scale(20, 20);

    // Exemple : on entre les coordonnées du tetrominoe en forme de T
    /*
    const matrix = [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ];
    */

    // Fonction qui permet de retirer les lignes remplies 
    function arenaSweep() {
        let rowCount = 1;

        outer: for (let y = arenaTetris.length - 1; y > 0; --y) {
            for (let x = 0; x < arenaTetris[y].length; ++x) {
                if (arenaTetris[y][x] === 0) {
                    continue outer;
                }
            }

            arenaTetris.unshift(arenaTetris.splice(y, 1)[0].fill(0));
            ++y;
            player.score += rowCount * 10;
            rowCount *= 2;
        }
    };

    // Fonction de collision
    function collide(player) {
        const [m, o] = [player.matrix, player.pos];

        // Pour vérifier qu'une collision est détectée..
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                // On vérifie où le joueur se trouve..
                if (m[y][x] !== 0 && (arenaTetris[y + o.y] && arenaTetris[y + o.y][x + o.x]) !== 0) {
                    repository = true;
                    return true;
                }
            }
        }
        // Ou pas !
        return false;
    };

    // Cette fonction prend en paramètres width et height des pièces du jeu
    function createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    };

    function draw() {
        contextTetris.fillStyle = '#e3e3e3';
        contextTetris.fillRect(0, 0, canvasTetris.width, canvasTetris.height);

        drawMatrix(arenaTetris, {
            x: 0,
            y: 0
        });
        drawMatrix(player.matrix, player.pos);
    }

    function drawRepository() {
        contextRepository.fillStyle = '#e3e3e3';
        contextRepository.fillRect(0, 0, canvasRepository.width, canvasRepository.height);

        drawMatrixRepository(arenaRepository, {
            x: 0,
            y: 0
        });
        drawMatrixRepository(player.matrix, 0);
    }

    // On écrit une fonction qui va dessiner en prenant en paramètre le "matrix" (c'est-à-dire les coordonnées des pièces du jeu Tetris) et l "offset" : le décalage de la pièce, là où elle va apparaître au départ dans le canvas tetris
    function drawMatrixRepository(matrix, offset) {
        // On fait une première boucle qui va itérer les coordonnées du Tetrominoe pour chaque ligne du tableau "row"
        matrix.forEach((row, y) => {
            // On fait une deuxième boucle pour chaque ligne-tableau du matrix
            // On récupère la valeur et l'indice x
            row.forEach((value, x) => {
                // On décide que la valeur récupérée égale à 0 doit être ignorée pour les dessins des pièces
                // Donc on vérifie que la valeur n'est pas égale à 0
                // A condition que la valeur soit différente de 0
                if (value !== 0) {
                    // Alors on dessine
                    // Choix de la couleur
                    // context.fillStyle = 'red';
                    contextRepository.fillStyle = colors[value];
                    // On dessine une forme à partir la valeur x (coordonnée gauche), de la valeur y (coordonnée en haut), puis on définit la largeur = 1 et la hauteur = 1
                    contextRepository.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    };

    // Fonction qui crée les différentes pièces (définit les dimensions des tetrominoes)
    function createPiece(type) {
        if (type === 'I') {
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        } else if (type === 'L') {
            return [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2],
            ];
        } else if (type === 'J') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ];
        } else if (type === 'O') {
            return [
                [4, 4],
                [4, 4],
            ];
        } else if (type === 'Z') {
            return [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'T') {
            return [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];
        }
    };

    // On écrit une fonction qui va dessiner en prenant en paramètre le "matrix" (c'est-à-dire les coordonnées des pièces du jeu Tetris) et l "offset" : le décalage de la pièce, là où elle va apparaître au départ dans le canvas tetris
    function drawMatrix(matrix, offset) {
        // On fait une première boucle qui va itérer les coordonnées du Tetrominoe pour chaque ligne du tableau "row"
        matrix.forEach((row, y) => {
            // On fait une deuxième boucle pour chaque ligne-tableau du matrix
            // On récupère la valeur et l'indice x
            row.forEach((value, x) => {
                // On décide que la valeur récupérée égale à 0 doit être ignorée pour les dessins des pièces
                // Donc on vérifie que la valeur n'est pas égale à 0
                // A condition que la valeur soit différente de 0
                if (value !== 0) {
                    // Alors on dessine
                    // Choix de la couleur
                    // context.fillStyle = 'red';
                    contextTetris.fillStyle = colors[value];
                    // On dessine une forme à partir la valeur x (coordonnée gauche), de la valeur y (coordonnée en haut), puis on définit la largeur = 1 et la hauteur = 1
                    contextTetris.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    };

    // On appelle la fonction de dessin des pièces, en définissant l "offset" des pièces (la position x à partir la gauche et la position y à partir du haut du canvas)
    // Exemple -> drawMatrix(matrix, {x:4, y:4});
    // On peut remplacer les paramètres de l'appel de la fonction drawMatrix à partir d'une constante "player"
    const player = {
        pos: {
            x: 0,
            y: 0
        },
        // Exemple -> matrix: createPiece('S'),
        matrix: null,
        score: 0,
    };

    // Cette fonction calcule les positions du joueur en fonction du tableau de positions de l'arène de jeu
    function merge(player) {
        player.matrix.forEach((row, y) => {
            // On récupère les positions
            row.forEach((value, x) => {
                if (value !== 0) {
                    arenaTetris[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    };

    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);

        // On modifie le comportement de la pièce en fonction des collisions avec les bords de l'arène ou la présence d'autres pièces déjà posées sur l'arène
        while (collide(player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }

    // Fonction de rotation des pièces du jeu
    // Elle fonctionne par inversion des colonnes de positions qui définissent l'apparition des pièces du jeu
    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
            }
        }
        // ici on vérifie la direction et effectue la rotation des pièces 
        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    // Cette fonction empêche le joueur de sortir des bords gauche et droit de l'arène
    function playerMove(dir) {
        player.pos.x += dir;
        if (collide(player)) {
            player.pos.x -= dir;
        }
    };

    // Fonction qui affiche aléatoirement les pièces
    function playerReset() {
        const pieces = 'TJLOSZI';
        player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
        player.pos.y = 0;
        player.pos.x = (arenaTetris[0].length / 2 | 0) -
            (player.matrix[0].length / 2 | 0);

        // Ici on active un retour en début de partie lorsque tout est rempli
        if (collide(player)) {
            arenaTetris.forEach(row => row.fill(0));
            player.score = 0;
            updateScore();
            dropInterval = 500;
            canvasLevels.innerText = "Level 1";
        }
    }

    function playerDrop() {
        player.pos.y++;

        if (collide(player)) {
            player.pos.y--;
            merge(player);
            playerReset();
            arenaSweep();
            updateScore();
        }

        dropCounter = 0;
    }

    // Function qui stocke la pièce courante et l'échange contre la pièce qui est déjà stocké si il y en a une
    function playerRepository() {
        let gateway;

        if (currentRepository) {
            gateway = currentRepository;
            currentRepository = player.matrix;
            player.matrix = gateway;
        } else {
            currentRepository = player.matrix;
            playerReset();
        }

        drawRepository();
    }

    // Fonction qui permet de dessiner continuellement en temps réel
    // La paramètre time défini à 0 -> on peut observer le résultat dans la console (cela opère un décompte du temps en millisecondes)
    let dropCounter = 0;
    // Nous voulons que la pièce tombe selon cette intervalle en millisecondes
    let dropInterval = 500;

    // Mise en pause  
    canvasPauseGame.addEventListener("click", function() {
        dropInterval = 2000000;
        canvasPauseGame.style.display = "none";
        canvasContinueGame.style.display = "block";
    });

    // Remise en cours du jeu
    canvasContinueGame.addEventListener("click", function() {
        dropInterval = 200;
        canvasPauseGame.style.display = "block";
        canvasContinueGame.style.display = "none";
    });

    let lastTime = 0;

    function update(time = 0) {
        // On met à jour le temps
        const deltaTime = time - lastTime;
        lastTime = time;
        //console.log(deltaTime);

        // On utilise ici l'opérateur affectation après addition
        // Cela équivaut à : dropCounter = dropCounter + deltaTime;
        dropCounter += deltaTime;

        if (dropCounter > dropInterval) {
            // On déplace la pièce
            // Exemple -> player.pos.y++;
            // On rétablit à 0
            // dropCounter = 0;

            playerDrop();
        };

        draw();
        requestAnimationFrame(update);
    };

    let colors = [
        null,
        '#FF0D72',
        '#0DC2FF',
        '#0DFF72',
        '#F538FF',
        '#FF8E0D',
        '#FFE138',
        '#3877FF',
    ];

    function updateScore() {
        canvasScore.innerText = player.score;

        // Vérifications du score pour accélérer la vitesse et passer à de nouveaux levels
        const textScore = canvasScore.textContent;
        // On convertit le texte en nombre
        const numberScore = Number(textScore);
        // console.log(numberScore);

        // Level 2
        if (numberScore >= 100) {
            // alert(numberScore);
            dropInterval = 400;
            // console.log(dropInterval)
            canvasLevels.innerText = "Level 2";
        }
        // Level 3
        if (numberScore >= 200) {
            dropInterval = 300;
            canvasLevels.innerText = "Level 3";
        }
        // On vérifie que le nombre du score est supérieur à 100 pour augmenter ensuite la vitesse du jeu
        if (numberScore >= 300) {
            dropInterval = 200;
            canvasLevels.innerText = "Level 4";
        }
        // On vérifie que le nombre du score est supérieur à 100 pour augmenter ensuite la vitesse du jeu
        if (numberScore >= 400) {
            dropInterval = 100;
            canvasLevels.innerText = "Level 5";
        }

    }

    document.addEventListener('keydown', event => {
        if (event.keyCode === 37 || event.keyCode === 81) {
            playerMove(-1);
        } else if (event.keyCode === 38 || event.keyCode === 90) {
            if (repository) {
                playerRepository();
                repository = false;
            }
        } else if (event.keyCode === 39 || event.keyCode === 68) {
            playerMove(1);
        } else if (event.keyCode === 40 || event.keyCode === 83) {
            playerDrop();
        }
        // La touche Ctrl permet de faire une rotation à gauche
        else if (event.keyCode === 17 || event.keyCode === 16 || event.keyCode === 65) {
            playerRotate(-1);
        }
        // La touche W permet de faire une rotation à droite
        else if (event.keyCode === 96 || event.keyCode === 32 || event.keyCode === 69) {
            playerRotate(1);
        }
    });

    playerReset();
    updateScore();
    update();
});