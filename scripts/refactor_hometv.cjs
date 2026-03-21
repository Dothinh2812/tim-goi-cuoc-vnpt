const fs = require('fs');
const file = 'src/pages/bang-gia.astro';
let content = fs.readFileSync(file, 'utf8');

// 1. Move the Quick Nav link
const quickNavHomeCamMatch = content.match(/<a href="#home-cam"[\s\S]*?<\/a>\r?\n/);
const quickNavHomeTVMatch = content.match(/ +<a href="#hometv"[^\n]+\n/);

if (quickNavHomeCamMatch && quickNavHomeTVMatch) {
    const homeTVLink = quickNavHomeTVMatch[0];
    content = content.replace(homeTVLink, ''); // remove from old position
    
    // insert after home-cam
    const insertPos = content.indexOf(quickNavHomeCamMatch[0]) + quickNavHomeCamMatch[0].length;
    content = content.substring(0, insertPos) + homeTVLink + content.substring(insertPos);
}

// 2. Move the Section
const sectionStartStr = '    <!-- ============================================ -->\r\n    <!-- HOMETV COMBO -->';
const sectionStartStrAlt = '    <!-- ============================================ -->\n    <!-- HOMETV COMBO -->';
let startIdx = content.indexOf(sectionStartStr);
if (startIdx === -1) startIdx = content.indexOf(sectionStartStrAlt);

if (startIdx !== -1) {
    const sectionEndStr = '    </section>\r\n';
    const sectionEndStrAlt = '    </section>\n';
    let endIdx = content.indexOf(sectionEndStr, startIdx);
    let offset = sectionEndStr.length;
    if (endIdx === -1) {
        endIdx = content.indexOf(sectionEndStrAlt, startIdx);
        offset = sectionEndStrAlt.length;
    }
    
    const hometvContent = content.substring(startIdx, endIdx + offset);
    
    // Remove from old position
    content = content.replace(hometvContent, '');

    // Insert before FAMILY SAFE
    const insertAnchor = '    <!-- ============================================ -->\r\n    <!-- FAMILY SAFE -->';
    const insertAnchorAlt = '    <!-- ============================================ -->\n    <!-- FAMILY SAFE -->';
    
    let targetIdx = content.indexOf(insertAnchor);
    if (targetIdx === -1) targetIdx = content.indexOf(insertAnchorAlt);
    
    if (targetIdx !== -1) {
        content = content.substring(0, targetIdx) + hometvContent + '\r\n' + content.substring(targetIdx);
        
        fs.writeFileSync(file, content);
        console.log("Successfully moved HomeTV section and quick nav!");
    } else {
        console.log("Error: Could not find insert anchor (FAMILY SAFE).");
    }
} else {
    console.log("Error: Could not find HOMETV COMBO start.");
}
