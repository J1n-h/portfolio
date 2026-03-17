const SAMPLE_PROJECTS = [
    {
        title: "AI Financial Intelligence Market",
        summary: "AI 기반 금융 정보 시장 서비스",
        description:
            "최신 금융 뉴스를 자동으로 수집(크롤링)하고, OpenAI의 AI 모델을 활용해 뉴스 내용을 요약한 뒤 시장 영향도와 감정(긍정/부정)을 분석하여 뉴스 등급을 분류하는 서비스입니다. 사용자는 웹사이트를 통해 분석된 금융 정보를 구매할 수 있으며, 블록체인 기반 결제 시스템을 사용하여 글로벌 사용자도 안전하게 구매할 수 있습니다.",
        tags: ["AI", "OpenAI", "Fintech", "Blockchain"],
        badge: "AI 활용 · 바이브코딩 프로젝트",
        youtube: "https://youtu.be/UN_6pcpfjCc?si=5h2kGI3kFph4S7WR"
    },
    {
        title: "Python과 Selenium을 활용한 Minecraft 웹사이트 자동화 매크로",
        summary: "Minecraft 계정 작업 자동화 매크로",
        description:
            "Python과 Selenium을 활용하여 Minecraft 웹사이트에서 닉네임 변경 과정을 반복하고, 로그인 하는 과정을 자동화하는 매크로 프로그램을 개발하였습니다. CSS Selector와 XPath를 이용해 페이지 이동, 입력 및 클릭 등의 과정을 자동으로 실행하도록 구현하였고, 이를 통해 직접 해야하는 로그인 과정을 자동화했습니다.",
        tags: ["Python", "Selenium", "Automation", "Web"],
        youtube: "https://youtu.be/1f42rbSqGUw?si=HuBLhOpkPE8udf5s"
    }
];

function normalizeProject(input) {
    const title = typeof input?.title === "string" ? input.title.trim() : "";
    const summary = typeof input?.summary === "string" ? input.summary.trim() : "";
    const description = typeof input?.description === "string" ? input.description.trim() : "";
    const badge = typeof input?.badge === "string" ? input.badge.trim() : "";

    const tagsRaw = input?.tags;
    const tags = Array.isArray(tagsRaw)
        ? tagsRaw.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 8)
        : [];

    const link = typeof input?.link === "string" ? input.link.trim() : "";
    const repo = typeof input?.repo === "string" ? input.repo.trim() : "";
    const youtube = typeof input?.youtube === "string" ? input.youtube.trim() : "";

    return {
        title: title || "Untitled",
        summary,
        description: description || "프로젝트 설명이 아직 등록되지 않았습니다.",
        badge,
        tags,
        link,
        repo,
        youtube
    };
}

function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null) continue;

        if (key === "class") {
            node.className = String(value);
            continue;
        }

        if (key === "text") {
            node.textContent = String(value);
            continue;
        }

        if (key.startsWith("on") && typeof value === "function") {
            node.addEventListener(key.slice(2), value);
            continue;
        }

        node.setAttribute(key, String(value));
    }

    for (const child of children) {
        if (child === null || child === undefined) continue;
        node.append(child);
    }

    return node;
}

function youtubeToEmbed(url) {
    try {
        const parsed = new URL(url);

        if (parsed.hostname === "youtu.be") {
            const id = parsed.pathname.replace("/", "");
            return `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
        }

        if (parsed.hostname.includes("youtube.com")) {
            const id = parsed.searchParams.get("v");
            if (id) {
                return `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
            }
        }
    } catch {
        // ignore invalid urls
    }

    return url;
}

function createProjectActions(project, onOpenVideo) {
    const actions = [];

    if (project.youtube) {
        actions.push(
            el(
                "button",
                {
                    class: "project-action primary",
                    type: "button",
                    onclick: () => onOpenVideo?.(project.title, project.youtube)
                },
                ["영상 보기"]
            )
        );
    }

    if (project.link) {
        actions.push(
            el("a", {
                class: "project-action ghost",
                href: project.link,
                target: "_blank",
                rel: "noreferrer",
                text: "서비스 보기"
            })
        );
    }

    if (project.repo) {
        actions.push(
            el("a", {
                class: "project-action ghost",
                href: project.repo,
                target: "_blank",
                rel: "noreferrer",
                text: "코드 보기"
            })
        );
    }

    return el("div", { class: "project-actions" }, actions);
}

function renderProjects(container, projects, onOpenVideo) {
    container.innerHTML = "";

    for (const project of projects) {
        const tags = el(
            "div",
            { class: "project-tags" },
            project.tags.map((tag) => el("span", { class: "tag", text: tag }))
        );

        container.append(
            el("article", { class: "project" }, [
                el("h3", { class: "project-title", text: project.title }),
                project.summary ? el("p", { class: "project-summary", text: project.summary }) : null,
                project.badge ? el("div", { class: "project-badge", text: project.badge }) : null,
                el("div", { class: "project-copy-label", text: "프로젝트 설명" }),
                el("p", { class: "project-desc", text: project.description }),
                tags,
                createProjectActions(project, onOpenVideo)
            ])
        );
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.setAttribute("data-show", "true");
    window.clearTimeout(showToast._timeout);
    showToast._timeout = window.setTimeout(() => toast.removeAttribute("data-show"), 1400);
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
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal();
        });
    }

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", async () => {
            const email = "jinhundev@gmail.com";

            try {
                await navigator.clipboard.writeText(email);
                showToast("이메일이 복사되었습니다.");
            } catch {
                const textarea = document.createElement("textarea");
                textarea.value = email;
                textarea.style.position = "fixed";
                textarea.style.left = "-9999px";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
                showToast("이메일이 복사되었습니다.");
            }
        });
    }

    renderProjects(container, projects, openVideo);
}

window.addEventListener("DOMContentLoaded", bootstrap);
