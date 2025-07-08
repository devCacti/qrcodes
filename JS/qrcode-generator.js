function generate() {
    var qr = qrcode(0, 'L');
    qr.addData(document.getElementById('qrtext').value || "qrcodes.devcacti.com");
    qr.make();

    var moduleCount = qr.getModuleCount();
    var dotSize = 12;
    var margin = 8;
    var svgSize = moduleCount * dotSize + margin * 2;

    // Finder pattern positions (top-left, top-right, bottom-left)
    var finderPositions = [
        { row: 0, col: 0 },
        { row: 0, col: moduleCount - 7 },
        { row: moduleCount - 7, col: 0 }
    ];

    // Helper to check if a module is in a finder pattern
    function inFinder(row, col) {
        return finderPositions.some(fp =>
            row >= fp.row && row < fp.row + 7 &&
            col >= fp.col && col < fp.col + 7
        );
    }

    // Start SVG with background and rounded border
    var svg = `<svg width="${svgSize}" height="${svgSize}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="${svgSize/12}" ry="${svgSize/12}" fill="#FFF"/>
    `;

    // Draw horizontal pills for each run of dark modules (skip finder patterns)
    for (var row = 0; row < moduleCount; row++) {
        var col = 0;
        while (col < moduleCount) {
            // Skip finder patterns
            if (inFinder(row, col)) { col++; continue; }
            while (col < moduleCount && !qr.isDark(row, col)) col++;
            var startCol = col;
            while (col < moduleCount && qr.isDark(row, col) && !inFinder(row, col)) col++;
            var endCol = col;

            if (endCol > startCol) {
                var x = margin + startCol * dotSize;
                var y = margin + row * dotSize;
                var width = (endCol - startCol) * dotSize;
                var height = dotSize;
                var radius = dotSize / 2;
                svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#222" />`;
            }
        }
    }

    // Draw vertical pills for each run of dark modules (skip finder patterns)
    for (var col = 0; col < moduleCount; col++) {
        var row = 0;
        while (row < moduleCount) {
            // Skip finder patterns
            if (inFinder(row, col)) { row++; continue; }
            while (row < moduleCount && !qr.isDark(row, col)) row++;
            var startRow = row;
            while (row < moduleCount && qr.isDark(row, col) && !inFinder(row, col)) row++;
            var endRow = row;

            if (endRow > startRow) {
                var x = margin + col * dotSize;
                var y = margin + startRow * dotSize;
                var width = dotSize;
                var height = (endRow - startRow) * dotSize;
                var radius = dotSize / 2;
                svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#222" />`;
            }
        }
    }

    // Draw finder patterns with round pupils
    finderPositions.forEach(fp => {
        var cx = margin + (fp.col + 3) * dotSize + dotSize / 2;
        var cy = margin + (fp.row + 3) * dotSize + dotSize / 2;
        var outerW = dotSize * 7;
        var outerH = dotSize * 7;
        var outerRadius = dotSize * 2;
        var innerW = dotSize * 5;
        var innerH = dotSize * 5;
        var innerRadius = dotSize * 1.2;
        var pupilW = dotSize * 2.75;
        var pupilH = dotSize * 2.75;
        var pupilRadius = dotSize * 0.8;
    
        // Outer ring (rounded rectangle)
        svg += `<rect x="${cx - outerW/2}" y="${cy - outerH/2}" width="${outerW}" height="${outerH}" rx="${outerRadius}" ry="${outerRadius}" fill="#222"/>`;
        // Inner ring (background color, rounded rectangle)
        svg += `<rect x="${cx - innerW/2}" y="${cy - innerH/2}" width="${innerW}" height="${innerH}" rx="${innerRadius}" ry="${innerRadius}" fill="#FFF"/>`;
        // Pupil (rounded rectangle)
        svg += `<rect x="${cx - pupilW/2}" y="${cy - pupilH/2}" width="${pupilW}" height="${pupilH}" rx="${pupilRadius}" ry="${pupilRadius}" fill="#222"/>`;
    });

    svg += `</svg>`;

    document.getElementById('qrcode').innerHTML = svg;
}

function downloadPNG() {
    var svgElement = document.getElementById('qrcode').querySelector('svg');
    if (!svgElement) return;
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svgElement);

    // Create an image from the SVG
    var img = new Image();
    var svgBlob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
    var url = URL.createObjectURL(svgBlob);

    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = svgElement.width.baseVal.value;
        canvas.height = svgElement.height.baseVal.value;
        var ctx = canvas.getContext('2d');
        // Optional: white background
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        // Download as PNG
        var link = document.createElement('a');
        var content = document.getElementById('qrtext').value || "qrcodes.devcacti.com";
        // Sanitize content for filename: remove non-alphanumeric, replace spaces with underscores, limit length
        var safeContent = content.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').substring(0, 32);
        link.download = `qrcode-${safeContent}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    img.src = url;
}
