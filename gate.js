const HASH_HEX = "cad6363b5b43ff0a9886d4bd2256ffad134868a4f9dac77098d6879e1b5b1549"; // SHA-256("Kikl2M0N")
const TOKEN_KEY = "rainbow_auth";

const encoder = new TextEncoder();

async function sha256Hex(text) {
const buf = await crypto.subtle.digest("SHA-256", encoder.encode(text));
const bytes = new Uint8Array(buf);
return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

function saveAuth(hashHex) {
try { localStorage.setItem(TOKEN_KEY, hashHex); } catch {}
}

function getAuth() {
try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function logout() {
try { localStorage.removeItem(TOKEN_KEY); } catch {}
location.href = "index.html";
}

export async function guard() {
const token = getAuth();
if (token !== HASH_HEX) {
// 쿼리스트링으로 돌아왔다면 안내 메시지 표시용
const back = new URL(location.href);
if (back.searchParams.get("reason") === "unauthorized") {
alert("접근 권한이 없습니다. 비밀번호를 다시 입력해 주세요.");
}
location.replace("index.html");
}
}

// index.html 전용: 폼 처리
const form = document.querySelector("#gate-form");
if (form) {
const input = document.querySelector("#pw");
const msg = document.querySelector("#msg");
form.addEventListener("submit", async (e) => {
e.preventDefault();
msg.textContent = "";
form.classList.remove("shake");
const value = input.value.trim();
if (!value) return;

const digest = await sha256Hex(value);
if (digest === HASH_HEX) {
saveAuth(digest);
location.href = "walk.html"; // 실제 페이지로 이동
} else {
msg.textContent = "비밀번호가 올바르지 않습니다.";
form.classList.add("shake");
input.select();
}
});
}