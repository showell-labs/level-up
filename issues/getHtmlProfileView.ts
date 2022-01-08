/**
 * Issue
 *
 * Perform security audit for this function. Fix any issues found.
 */

interface UserProfile {
  url: string;
  name: string;
  phone: string;
  signature: string;
}

export function getHtmlProfileView(userProfile: UserProfile): string {
  return `<div class="profile">
    <div class="name"><a href="${escapeHTMLAttribute(userProfile.url)}">${
    userProfile.name
  }</a></div>
  <div class="phone">${userProfile.phone}</div>
  <div class="signature">${userProfile.signature.replace("\n", "<br>")}</div>
    </div>`;
}

const textareaDOMElement = document.createElement("textarea");
function escapeHTMLAttribute(html: string) {
  textareaDOMElement.textContent = html;
  return textareaDOMElement.innerHTML;
}
