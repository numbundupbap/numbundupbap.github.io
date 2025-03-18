const HTML = (q) => document.querySelector(q);

const padding = 10;
const playerSpeed = 7;
const enemySpeed = 4;
let press = new Set();
let moving = { x: 0, y: 0 };
const world = HTML("#main");
const player = HTML("#player");
let enemy = [];
let score = 0;
let dist = 350;
let updateFrame, enemyFrame;
let is_start = false;

// HTML('#circle').style.width = dist*2 + 'px';
// HTML('#circle').style.height = dist*2 + 'px';
// HTML('#circle').style.borderRadius = dist + 'px';

function isColliding(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left || 
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom 
    );
}

function distance(elem, x, y) {
    const elemRect = elem.getBoundingClientRect();
    const elemCenter = {
        x: elemRect.left + elemRect.width / 2,
        y: elemRect.bottom + elemRect.height / 2,
    };
    return Math.sqrt((elemCenter.x - x)**2 + (elemCenter.y-y)**2);
}

function direct(elem, target) {
    const elemRect = elem.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const elemCenter = {
      x: elemRect.left + elemRect.width / 2,
      y: elemRect.bottom + elemRect.height / 2,
    };
    const targetCenter = {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.bottom + targetRect.height / 2,
    };
    const dx = targetCenter.x - elemCenter.x;
    const dy = elemCenter.y - targetCenter.y;
    let angle = Math.atan2(dx, dy) * (180 / Math.PI);
    return angle >= 0 ? angle : 360 + angle;
}

// 키 입력 감지
document.addEventListener("keydown", (e) => press.add(e.key.toLowerCase()));
document.addEventListener("keyup", (e) => press.delete(e.key.toLowerCase()));

// 플레이어 이동
function update() {
    let dx = 0, dy = 0;

    if (press.has("a")) dx = -playerSpeed;
    if (press.has("d")) dx = playerSpeed;
    if (press.has("w")) dy = playerSpeed;
    if (press.has("s")) dy = -playerSpeed;

    moving.x = dx;
    moving.y = dy;

    let newX = Math.min(Math.max(parseInt(player.style.left || 0) + moving.x, padding), world.offsetWidth - player.offsetWidth - padding);
    let newY = Math.min(Math.max(parseInt(player.style.bottom || 0) + moving.y, padding), world.offsetHeight - player.offsetHeight - padding);

    player.style.left = newX + "px";
    player.style.bottom = newY + "px";
    // HTML('#circle').style.left = parseInt(player.style.left || 0) - dist+10 + 'px';
    // HTML('#circle').style.bottom = parseInt(player.style.bottom || 0) - dist+10 + 'px';

    updateFrame = requestAnimationFrame(update);
}

// 적 생성
function spawnEnemy() {
    let enemyColor = Math.floor(Math.random()*3);
    let spawnPos = [ Math.floor(Math.random() * (world.offsetWidth - 2 * padding - player.offsetWidth) + padding), Math.floor(Math.random() * (world.offsetHeight - 2 * padding - player.offsetHeight) + padding) ];

    while (!(Math.abs(spawnPos[0] - world.offsetWidth) >= 30 && distance(player, spawnPos[0], spawnPos[1]) > dist)) {
        spawnPos[0] = Math.floor(Math.random() * (world.offsetWidth - 2 * padding - player.offsetWidth) + padding);
    }
    while (!(Math.abs(spawnPos[1] - world.offsetHeight) >= 30 || distance(player, spawnPos[0], spawnPos[1]) > dist)) {
        spawnPos[1] = Math.floor(Math.random() * (world.offsetHeight - 2 * padding - player.offsetHeight) + padding);
    }

    if ((spawnPos[0] < world.offsetWidth / 2 - player.offsetWidth) && (spawnPos[1] > world.offsetHeight / 2 - player.offsetHeight)) {
        enemyColor = ['yellow', 'green', 'blue'][enemyColor];
    } else if (spawnPos[0] > world.offsetWidth / 2 && spawnPos[1] > world.offsetHeight / 2 - player.offsetHeight) {
        enemyColor = ['red', 'green', 'blue'][enemyColor];
    } else if (spawnPos[0] < world.offsetWidth / 2 - player.offsetWidth) {
        enemyColor = ['red', 'yellow', 'blue'][enemyColor];
    } else if (spawnPos[0] > world.offsetWidth / 2) {
        enemyColor = ['red', 'yellow', 'green'][enemyColor];
    } else {
        enemyColor = 'red';
    }
    const newDiv = document.createElement('div');

    // 클래스와 스타일 설정
    newDiv.classList.add('object', enemyColor);
    newDiv.style.left = spawnPos[0] + 'px';
    newDiv.style.bottom = spawnPos[1] + 'px';
    world.appendChild(newDiv);
    enemy.push(newDiv);
}

function moveEnemy() {
    enemy.forEach((e, index) => {
        const angle = direct(e, player) * (Math.PI / 180);
        
        let currentX = parseInt(e.style.left || 0);
        let currentY = parseInt(e.style.bottom || 0);

        let newX = currentX + enemySpeed * Math.sin(angle);
        let newY = currentY + enemySpeed * Math.cos(angle);

        e.style.left = newX + "px";
        e.style.bottom = newY + "px";

        if (isColliding(HTML('#' + e.classList[1] + '-area'), e) && !(isColliding(HTML('#safe-area'), e))) {
            e.remove();  // 충돌한 적 삭제
            enemy.splice(index, 1);  // 배열에서도 제거
            score++;
            HTML('#score').innerHTML = score;
            const pung = document.createElement('div');
            pung.classList.add('pung');
            pung.style.left = newX + 'px';
            pung.style.bottom = newY + 'px';
            world.appendChild(pung);
            setTimeout(() => pung.remove(), 1000);
        }
        if (isColliding(player, e)) {
            cancelAnimationFrame(updateFrame);
            clearInterval(spawnInterval);
            cancelAnimationFrame(enemyFrame);
            enemyFrame = 'die';
            is_start = false;
            document.querySelector('.start > div').textContent = '실패!'
            document.querySelector('.start > p').textContent = `총 ${score}점을 얻으셨어요`
            document.querySelector('.startbtn').textContent = '다시 시작하기'
            document.querySelector('.screen').className = 'screen';
        }
    });
    if (enemyFrame !== 'die') { enemyFrame = requestAnimationFrame(moveEnemy) }
}

// 기본설정
player.style.left = world.offsetWidth / 2 - player.offsetWidth / 2 + 'px';
player.style.bottom = world.offsetHeight / 2 - player.offsetHeight / 2 + 'px';

let start = async () => {
    if (!is_start) {
        player.style.left = world.offsetWidth / 2 - player.offsetWidth / 2 + 'px';
        player.style.bottom = world.offsetHeight / 2 - player.offsetHeight / 2 + 'px';
        press = new Set();
        is_start = true;
        score = 0;
        HTML('#score').innerHTML = score;
        await Promise.all([...enemy].reverse().map(e => {
            return new Promise(resolve => {
                enemy.splice(enemy.indexOf(e), 1); // 안전한 삭제
                e.remove();
                resolve();
            });
        }));
        updateFrame = requestAnimationFrame(update);
        spawnInterval = setInterval(spawnEnemy, 500);
        enemyFrame = requestAnimationFrame(moveEnemy);
        document.querySelector('.screen').className += ' invisible';
        console.log(enemy);
    }
}
