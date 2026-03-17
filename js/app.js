const SAMPLE_PROJECTS = [
    {
        title: "AI Financial Intelligence Market",
        description: "최신 금융 뉴스를 자동으로 수집(크롤링)하고, OpenAI의 AI 모델을 활용해 뉴스 내용을 요약한 뒤 시장 영향도와 감정(긍정/부정)을 분석하여 뉴스 등급을 분류하는 서비스입니다. 사용자는 웹사이트를 통해 분석된 금융 정보를 구매할 수 있으며, 블록체인 기반 결제 시스템을 사용하여 글로벌 사람들까지 안전하게 구매할 수 있습니다.",
        tags: ["AI", "LLM", "Web"],
        youtube: "https://youtu.be/UN_6pcpfjCc?si=5h2kGI3kFph4S7WR"
    },
    {
        title: "Python과 Selenium을 활용한 Minecraft 웹사이트 자동화 매크로",
        description: "Python과 Selenium을 활용하여 Minecraft 웹사이트에서 닉네임 변경 과정을 반복하고, 로그인 하는 과정을 자동화하는 매크로 프로그램을 개발하였습니다. CSS Selector와 XPath를 이용해 페이지 이동, 입력 및 클릭 등의 과정을 자동으로 실행하도록 구현하였고, 이를 통해 직접 해야하는 로그인 과정을 자동화 했습니다.",
        tags: ["Python", "Selenium", "Automation"],
        youtube: "https://youtu.be/1f42rbSqGUw?si=HuBLhOpkPE8udf5s"
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
    const youtube = typeof input?.youtube === "string" ? input.youtube.trim() : "";

    return {
        title: title || "Untitled",
        description: description || "설명이 아직 등록되지 않았습니다.",
        tags,
        link,
        repo,
        youtube
    };
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

function youtubeToEmbed(url) {
    try {
        const u = new URL(url);
        if (u.hostname === "youtu.be") {
            const id = u.pathname.replace("/", "");
            return `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
        }
        if (u.hostname.includes("youtube.com")) {
            const id = u.searchParams.get("v");
            if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
        }
    } catch {
        // ignore
    }
    return url;
}

function renderProjects(container, projects, onOpenVideo) {
    container.innerHTML = "";

    for (const project of projects) {
        const tags = el("div", { class: "project-tags" }, (project.tags || []).map(t => el("span", { class: "tag", text: t })));

        const links = el("div", { class: "project-links" }, []);
        if (project.link) links.append(el("a", { href: project.link, target: "_blank", rel: "noreferrer", text: "Link" }));
        if (project.repo) links.append(el("a", { href: project.repo, target: "_blank", rel: "noreferrer", text: "Repo" }));
        if (project.youtube) {
            links.append(
                el("a", {
                    href: "#",
                    text: "YouTube",
                    onclick: (e) => {
                        e.preventDefault();
                        onOpenVideo?.(project.title, project.youtube);
                    }
                })
            );
        }

        container.append(
            el("article", { class: "project" }, [
                el("div", { class: "project-title", text: project.title }),
                el("p", { class: "project-desc", text: project.description }),
                tags,
                links
            ])
        );
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.setAttribute("data-show", "true");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toast.removeAttribute("data-show"), 1400);
}

async function bootstrap() {
    const container = document.getElementById("project-list");
    const copyEmailBtn = document.getElementById("copy-email");
    const modal = document.getElementById("video-modal");
    const modalTitle = document.getElementById("video-title");
    const modalBody = document.getElementById("video-body");
    const modalClose = document.getElementById("video-close");

    if (!container) return;

    const projects = SAMPLE_PROJECTS.map(normalizeProject);

    const closeModal = () => {
        if (!modal || !modalBody) return;
        modal.removeAttribute("data-open");
        modal.setAttribute("aria-hidden", "true");
        modalBody.innerHTML = "";
    };

    const openVideo = (title, url) => {
        if (!modal || !modalTitle || !modalBody) return;
        modalTitle.textContent = title;
        modalBody.innerHTML = "";
        const iframe = document.createElement("iframe");
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.src = youtubeToEmbed(url);
        modalBody.appendChild(iframe);
        modal.setAttribute("data-open", "true");
        modal.setAttribute("aria-hidden", "false");
    };

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }
    if (modalClose) modalClose.addEventListener("click", closeModal);
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", async () => {
            const email = "jinhundev@gmail.com";
            try {
                await navigator.clipboard.writeText(email);
                showToast("이메일이 복사되었습니다.");
            } catch {
                const ta = document.createElement("textarea");
                ta.value = email;
                ta.style.position = "fixed";
                ta.style.left = "-9999px";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                ta.remove();
                showToast("이메일이 복사되었습니다.");
            }
        });
    }

    renderProjects(container, projects, openVideo);
}

window.addEventListener("DOMContentLoaded", bootstrap);
