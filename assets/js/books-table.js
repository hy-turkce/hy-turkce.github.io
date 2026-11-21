// Dynamically generate book table from CSV
async function loadBooksTable() {
    try {
        const response = await fetch('/assets/Harun-Yahya-Kitaplar/kitap.csv');
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        
        console.log('CSV rows loaded:', rows.length);
        console.log('First row:', rows[0]);
        
        const tbody = document.querySelector('#myTable tbody');
        if (!tbody) {
            console.error('Table body not found');
            return;
        }
        tbody.innerHTML = '';
        
        rows.forEach((row, index) => {
            if (index === 0) return; // Skip header row
            
            console.log(`Processing row ${index}:`, row);
            
            const tr = document.createElement('tr');
            
            // Sıra No
            const tdNo = document.createElement('td');
            tdNo.textContent = row[0];
            tr.appendChild(tdNo);
            
            // Kitap Adı
            const tdName = document.createElement('td');
            tdName.textContent = row[1];
            tr.appendChild(tdName);
            
            // Extract paths from CSV links - each column has its own anchor tag
            // row[2] = PDF, row[3] = ePub, row[4] = DOC
            let pdfPath = null, epubPath = null, docPath = null;
            
            // Extract PDF path from row[2]
            if (row[2]) {
                const fileMatch = row[2].match(/file="([^"]+)"/);
                if (fileMatch) pdfPath = fileMatch[1];
            }
            
            // Extract EPUB path from row[3]
            if (row[3]) {
                const hashMatch = row[3].match(/#([^" >]+)/);
                if (hashMatch) epubPath = hashMatch[1];
            }
            
            // Extract DOC path from row[4]
            if (row[4]) {
                const hrefMatch = row[4].match(/href="([^"]+)"/);
                if (hrefMatch) docPath = hrefMatch[1];
            }
            
            console.log(`Row ${index} - PDF path:`, pdfPath);
            console.log(`Row ${index} - EPUB path:`, epubPath);
            console.log(`Row ${index} - DOC path:`, docPath);
            
            // PDF Link
            const tdPdf = document.createElement('td');
            if (pdfPath) {
                let processedPdfPath = pdfPath.replace('kuranvebilim.github.io', 'hy-turkce.github.io');
                processedPdfPath = processedPdfPath.replace('Harun_Yahya_Kitaplar', 'Harun-Yahya-Kitaplar');
                const urlParts = processedPdfPath.split('/');
                const filename = urlParts.pop();
                const encodedFilename = encodeURIComponent(filename);
                processedPdfPath = urlParts.join('/') + '/' + encodedFilename;
                tdPdf.innerHTML = `<a href="https://hy-turkce.github.io/pdf-viewer/?file=${processedPdfPath}" rel="alternate bookmark nofollow" hreflang=tr type=application/pdf target="_blank"><img src="/assets/img/pdf.png" alt="indir" title="İNDİR PDF"></a>`;
            }
            tr.appendChild(tdPdf);
            
            // EPUB Link
            const tdEpub = document.createElement('td');
            if (epubPath) {
                let processedEpubPath = epubPath.replace('kuranvebilim.github.io', 'hy-turkce.github.io');
                processedEpubPath = processedEpubPath.replace('Harun_Yahya_Kitaplar', 'Harun-Yahya-Kitaplar');
                const urlParts = processedEpubPath.split('/');
                const filename = urlParts.pop();
                const encodedFilename = encodeURIComponent(filename);
                processedEpubPath = urlParts.join('/') + '/' + encodedFilename;
                tdEpub.innerHTML = `<a href="https://hy-turkce.github.io/epub-viewer/?file=${processedEpubPath}" rel="alternate bookmark nofollow" hreflang=tr type=application/epub+zip target="_blank"><img src="/assets/img/epub.png" alt="oku" title="OKU EPUB"></a>`;
            }
            tr.appendChild(tdEpub);
            
            // DOCX Link (changed from ODT to DOCX)
            const tdDocx = document.createElement('td');
            if (docPath) {
                let processedDocPath = docPath.replace('kuranvebilim.github.io', 'hy-turkce.github.io');
                processedDocPath = processedDocPath.replace('Harun_Yahya_Kitaplar', 'Harun-Yahya-Kitaplar');
                processedDocPath = processedDocPath.replace(/\.doc$/, '.docx');
                const urlParts = processedDocPath.split('/');
                const filename = urlParts.pop();
                const encodedFilename = encodeURIComponent(filename);
                processedDocPath = urlParts.join('/') + '/' + encodedFilename;
                tdDocx.innerHTML = `<a href="https://hy-turkce.github.io/docx-viewer/?file=${processedDocPath}" rel="alternate bookmark nofollow" hreflang=tr type=application/vnd.openxmlformats-officedocument.wordprocessingml.document target="_blank"><img src="/assets/img/odt.png" alt="indir" title="YAZDIR DOCX"></a>`;
            }
            tr.appendChild(tdDocx);
            
            tbody.appendChild(tr);
        });
        
        // Update count
        const count = rows.length - 1;
        const heading = document.querySelector('#harun-yahya h2');
        if (heading) {
            heading.innerHTML = `<strong>Adnan Harun Yahya Külliyatı - Oku veya İndir</strong>- ${count} Adet Eser`;
        }
        
    } catch (error) {
        console.error('Error loading books table:', error);
    }
}

function parseCSV(text) {
    const lines = text.split('\n');
    return lines.map(line => {
        const result = [];
        let current = '';
        let inQuotes = false;
        let inHtmlTag = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
                current += char;
            } else if (char === '<' && !inQuotes) {
                inHtmlTag = true;
                current += char;
            } else if (char === '>' && !inQuotes) {
                inHtmlTag = false;
                current += char;
            } else if (char === ',' && !inQuotes && !inHtmlTag) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }).filter(row => row.length > 1 && row[0].trim() !== '');
}

// Load table when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooksTable);
} else {
    loadBooksTable();
}
