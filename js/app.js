const SAMPLE_PROJECTS = [
    {
        title: "Python macro",
        description: "마인크래프트 사이트 로그인 매크로",
        tags: ["Python", "Automation"]
    },
    {
        title: "Portfolio",
        description: "GitHub Pages로 배포 가능한 정적 포트폴리오 사이트",
        tags: ["JavaScript", "Web", "GitHub Pages"],
        repo: "https://github.com/J1n-h/portfolio"
    }
];

function normalizeProject(input) {
    const title = typeof input?.title === "string" ? input.title.trim() : "";
    const description = typeof input?.description === "string" ? input.description.trim() : "";

    const tagsRaw = input?.tags;
    const tags = Array.isArray(tagsRaw)
        ? tagsRaw.map(t => String(t).trim()).filter(Boolean).slice(0, 8)
        : [];

    const link = typeof input?.link === "string" ? input.link.trim() : "";
    const repo = typeof input?.repo === "string" ? input.repo.trim() : "";

    return {
        title: title || "Untitled",
        description: description || "설명이 아직 등록되지 않았습니다.",
        tags,
        link,
        repo
    };
}

function projectMatches(project, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    const haystack = [
        project.title,
        project.description,
        ...(project.tags || [])
    ].join(" ").toLowerCase();
    return haystack.includes(q);
}

function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (v === undefined || v === null) continue;
        if (k === "class") node.className = String(v);
        else if (k === "text") node.textContent = String(v);
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, String(v));
    }
    for (const child of children) {
        if (child === null || child === undefined) continue;
        node.append(child);
    }
    return node;
}

function renderProjects(container, projects, query) {
    container.innerHTML = "";
    const visible = projects.filter(p => projectMatches(p, query));

    if (visible.length === 0) {
        container.append(
            el("div", { class: "card" }, [
                el("h3", { text: "검색 결과가 없습니다." }),
                el("p", { class: "note", text: "검색어를 바꾸거나, Firestore에 프로젝트 데이터를 추가해 주세요." })
            ])
        );
        return visible.length;
    }

    for (const project of visible) {
        const tags = el("div", { class: "project-tags" }, (project.tags || []).map(t => el("span", { class: "tag", text: t })));

        const links = el("div", { class: "project-links" }, []);
        if (project.link) links.append(el("a", { href: project.link, target: "_blank", rel: "noreferrer", text: "Link" }));
        if (project.repo) links.append(el("a", { href: project.repo, target: "_blank", rel: "noreferrer", text: "Repo" }));

        container.append(
            el("article", { class: "project" }, [
                el("div", { class: "project-title", text: project.title }),
                el("p", { class: "project-desc", text: project.description }),
                tags,
                links
            ])
        );
    }

    return visible.length;
}

async function fetchFirestoreProjects() {
    return [];
}

async function bootstrap() {
    const container = document.getElementById("project-list");
    const statusEl = document.getElementById("project-status");
    const searchEl = document.getElementById("project-search");

    if (!container || !statusEl || !searchEl) return;

    let projects = [];
    const sourceLabel = "정적";
    projects = SAMPLE_PROJECTS.map(normalizeProject);

    const update = () => {
        const query = searchEl.value.trim();
        const count = renderProjects(container, projects, query);
        statusEl.textContent = `${sourceLabel} · ${count}개 표시`;
    };

    searchEl.addEventListener("input", update);
    update();
}

window.addEventListener("DOMContentLoaded", bootstrap);
