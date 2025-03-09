let clickFunc = {
    "email": async (e)=>{await navigator.clipboard.writeText(e.querySelector('.link-d').textContent);}, 
    "discord": async (e)=>{await navigator.clipboard.writeText(e.querySelector('.link-d').textContent);}, 
    "github": (e)=>{window.open("https://github.com/numbundupbap")}, 
    "velog": (e)=>{window.open("https://velog.io/@numbundupbap/posts")}, 
    "solvedac": (e)=>{window.open("https://solved.ac/profile/hj0531")}, 
    "baekjoon": (e)=>{window.open("https://www.acmicpc.net/user/hj0531")}
};
let copyElem = ['email', 'discord'];
let CopyVisible = false;
document.querySelectorAll('.link-item').forEach((e) => {
    e.addEventListener('click', (e) => {
        clickFunc[e.target.classList[1]](e.target)
        if (copyElem.includes(e.target.classList[1])) {
            // 새로운 div 생성
            const textElement = document.createElement('div');
            textElement.textContent = '복사 완료!';
            textElement.style.position = 'absolute';
            textElement.style.left = `${event.pageX}px`;
            textElement.style.top = `${event.pageY}px`;
            textElement.style.backgroundColor = 'rgb(35, 184, 77)';
            textElement.style.color = 'white';
            textElement.style.transform = 'translate(-50%, -100%)';
            textElement.style.padding = '5px 10px';
            textElement.style.borderRadius = '5px';
            textElement.style.fontSize = '14px';
            textElement.style.pointerEvents = 'none'; // 클릭 방지
            textElement.style.opacity = '1';
            textElement.style.transition = 'opacity 0.5s ease-out';
        
            // body에 추가
            document.body.appendChild(textElement);
            CopyVisible = true;
        
            setTimeout(() => {
                textElement.style.opacity = '0';
                CopyVisible = false;
            }, 500);
        
            // 1초 후 자동 삭제
            setTimeout(() => {
                textElement.remove();
            }, 1000);
        }
    });
});

let project = {
    "dutShortcut": "https://github.com/numbundupbap/dutscriptShortcut/tree/main", 
};

document.querySelectorAll('.project-item').forEach((e) => {
    e.addEventListener('click', (s) => {
        window.open(project[s.target.classList[1]])
    });
});