(() => {
  "use strict";

  const FALLBACK_EMAIL = "jiejuefuyou@gmail.com";
  const REQUEST_TIMEOUT_MS = 8000;
  const LEAD_INPUT_IDS = new Set([
    "agent-email",
    "rescue-email",
    "quiz-email",
    "b2b-email",
    "bc-email",
    "case-studies-email",
    "ec-email",
    "deals-email",
    "faq-email",
    "audit-email",
    "templates-email",
    "how-i-built-this-email",
    "cheatsheet-email",
    "just-published-email",
    "nl-page-email",
    "press-kit-email",
    "pab-email",
    "pr-email",
    "prompts-lead-email",
    "quote-lead-email",
    "refer-email",
    "roi-email",
    "sales-email",
    "ss-email",
    "services-email",
    "svc-email",
    "trans-email",
    "zh-email",
  ]);

  const formInputs = new WeakMap();
  const controlInputs = new WeakMap();
  const pendingInputs = new WeakSet();

  function isChinesePage() {
    return (document.documentElement.lang || "").toLowerCase().startsWith("zh");
  }

  function configuredEndpoint() {
    const raw = String(window.LEAD_WEBHOOK_URL || "").trim();
    if (!raw) return "";

    try {
      const url = new URL(raw, window.location.href);
      const loopback = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
      if (!/^https?:$/.test(url.protocol) || loopback.has(url.hostname)) return "";
      return url.href;
    } catch (_error) {
      return "";
    }
  }

  function captureScope(input) {
    if (input.form) return input.form;

    let node = input.parentElement;
    while (node && node !== document.body) {
      if (node.querySelector("button, input[type=submit]")) return node;
      node = node.parentElement;
    }
    return input.parentElement || document.body;
  }

  function statusElement(input) {
    const scope = captureScope(input);
    let status = scope.querySelector(".autoapp-lead-status");
    if (status) return status;

    status = document.createElement("p");
    status.className = "autoapp-lead-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.marginTop = "8px";
    status.style.fontSize = ".84rem";
    status.style.lineHeight = "1.5";
    scope.appendChild(status);
    return status;
  }

  function replaceStatus(status, text, color, link) {
    status.replaceChildren(document.createTextNode(text));
    status.style.color = color;
    if (link) {
      status.appendChild(document.createTextNode(" "));
      status.appendChild(link);
    }
  }

  function fallbackLink(input) {
    const link = document.createElement("a");
    const subject = `Website request from ${location.pathname || "/"}`;
    const body = `Page: ${location.href}\nVisitor email: ${input.value.trim()}\n\nPlease follow up with me.`;
    link.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    link.textContent = isChinesePage() ? "改用邮件发送" : "Send by email instead";
    link.style.textDecoration = "underline";
    return link;
  }

  function setBusy(control, busy) {
    if (!control) return;
    control.disabled = busy;
    control.setAttribute("aria-busy", busy ? "true" : "false");
  }

  async function sendLead(input, control) {
    if (pendingInputs.has(input)) return;
    const email = input.value.trim();
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!looksLikeEmail || !input.checkValidity()) {
      input.setCustomValidity(isChinesePage() ? "请输入有效的邮箱地址。" : "Enter a valid email address.");
      input.reportValidity();
      input.setCustomValidity("");
      return;
    }

    const status = statusElement(input);
    const endpoint = configuredEndpoint();
    if (!endpoint) {
      const message = isChinesePage()
        ? "在线提交暂不可用；你的邮箱尚未发送。"
        : "Online signup is unavailable; your email has not been sent.";
      replaceStatus(status, message, "#ffb547", fallbackLink(input));
      return;
    }

    pendingInputs.add(input);
    setBusy(control, true);
    replaceStatus(
      status,
      isChinesePage() ? "正在提交…" : "Submitting…",
      "#a1a1aa",
    );

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const payload = {
      email,
      source: input.dataset.source || input.id || "website-lead",
      page: location.pathname || "/",
      url: location.href,
      submitted_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      input.disabled = true;
      replaceStatus(
        status,
        isChinesePage() ? "提交成功，我们会通过邮件联系你。" : "Received — we will follow up by email.",
        "#4ade80",
      );
    } catch (_error) {
      const message = isChinesePage()
        ? "提交失败；你的邮箱尚未发送。"
        : "Submission failed; your email has not been sent.";
      replaceStatus(status, message, "#ffb547", fallbackLink(input));
      setBusy(control, false);
    } finally {
      window.clearTimeout(timeout);
      pendingInputs.delete(input);
    }
  }

  function intercept(event, input, control) {
    if (!input) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    void sendLead(input, control);
  }

  function install() {
    const inputs = Array.from(document.querySelectorAll("input[type=email]"))
      .filter((input) => LEAD_INPUT_IDS.has(input.id));

    inputs.forEach((input) => {
      const scope = captureScope(input);
      if (input.form) formInputs.set(input.form, input);
      scope.querySelectorAll("button, input[type=submit]").forEach((control) => {
        controlInputs.set(control, input);
      });
    });

    document.addEventListener("submit", (event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (form) intercept(event, formInputs.get(form), form.querySelector("button, input[type=submit]"));
    }, true);

    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const control = target ? target.closest("button, input[type=submit]") : null;
      if (control) intercept(event, controlInputs.get(control), control);
    }, true);
  }

  window.AutoAppLead = Object.freeze({ configuredEndpoint });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
