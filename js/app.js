// Load sample projects (no Firebase needed)
async function loadProjects() {
    const listEl = document.getElementById('project-list');
    const sampleProjects = [
        { title: '포트폴리오 웹사이트', description: 'HTML, CSS, JavaScript로 만든 개인 포트폴리오 사이트' },
        { title: 'C 언어 계산기', description: '기본적인 사칙연산을 수행하는 콘솔 기반 계산기' },
        { title: 'Python 데이터 분석', description: 'Pandas와 Matplotlib를 사용한 간단한 데이터 시각화 프로젝트' }
    ];

    sampleProjects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = `${project.title} - ${project.description}`;
        listEl.appendChild(li);
    });
}

window.addEventListener('DOMContentLoaded', loadProjects);
