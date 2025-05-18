function generate() {
    var qr = qrcode(0, 'L');
    qr.addData(document.getElementById('qrtext').value || "miau");
    qr.make();

    var moduleCount = qr.getModuleCount();
    var dotSize = 12;
    var margin = 8;
    var svgSize = moduleCount * dotSize + margin * 2;

    // Start SVG with background and rounded border
    var svg = `<svg width="${svgSize}" height="${svgSize}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="${svgSize/16}" ry="${svgSize/16}" fill="#88878c"/>
    `;

    // Draw horizontal pills for each run of dark modules
    for (var row = 0; row < moduleCount; row++) {
        var col = 0;
        while (col < moduleCount) {
            // Find the start of a run
            while (col < moduleCount && !qr.isDark(row, col)) col++;
            var startCol = col;
            // Find the end of the run
            while (col < moduleCount && qr.isDark(row, col)) col++;
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

    // Draw vertical pills for each run of dark modules
    for (var col = 0; col < moduleCount; col++) {
        var row = 0;
        while (row < moduleCount) {
            // Find the start of a run
            while (row < moduleCount && !qr.isDark(row, col)) row++;
            var startRow = row;
            // Find the end of the run
            while (row < moduleCount && qr.isDark(row, col)) row++;
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

    svg += `</svg>`;

    document.getElementById('qrcode').innerHTML = svg;
}