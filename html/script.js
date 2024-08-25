document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let imageMatrix = '';

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '#e0e0e0';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = '#ffffff';
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '#ffffff';
        const file = event.dataTransfer.files[0];
        handleFile(file);
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    convertImageToMatrix();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function convertImageToMatrix() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;
        let matrix = '';
        for (let y = 0; y < canvas.height; y++) {
            let row = '';
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                row += `${padZero(r)}${padZero(g)}${padZero(b)}`;
                if (x < canvas.width - 1) row += ',';
            }
            matrix += row + '\n';
        }
        imageMatrix = matrix.trim(); 
    }

    function padZero(value) {
        return value.toString().padStart(3, '0');
    }
});
